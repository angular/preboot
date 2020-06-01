/**
 * Script that runs after node modules have been installed (including Bazel managed
 * node modules). This script can be used to apply postinstall patches. Similarly
 * to Bazel's "patches" attribute on repository fetch rules.
 */

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

/**
 * Version of the post install patch. Needs to be incremented when
 * existing patches or edits have been modified.
 */
const PATCH_VERSION = 5;

/** Path to the project directory. */
const projectDir = path.join(__dirname, '../..');

/**
 * Object that maps a given file path to a list of patches that need to be
 * applied.
 */
const PATCHES_PER_FILE = {};

shelljs.set('-e');
shelljs.cd(projectDir);

// Workaround for https://github.com/angular/angular/issues/18810.
shelljs.exec('ngc -p angular-tsconfig.json');

// Workaround for: https://github.com/angular/angular/issues/32651. We just do not
// generate re-exports for secondary entry-points. Similar to what "ng-packagr" does.
searchAndReplace(
  /(?!function\s+)createMetadataReexportFile\([^)]+\);/, '',
  'node_modules/@angular/bazel/src/ng_package/packager.js');
searchAndReplace(
  /(?!function\s+)createTypingsReexportFile\([^)]+\);/, '',
  'node_modules/@angular/bazel/src/ng_package/packager.js');

// Workaround for: https://github.com/angular/angular/pull/32650
searchAndReplace(
  'var indexFile;', `
  var indexFile = files.find(f => f.endsWith('/public-api.ts'));
`,
  'node_modules/@angular/compiler-cli/src/metadata/bundle_index_host.js');
searchAndReplace(
  'var resolvedEntryPoint = null;', `
  var resolvedEntryPoint = tsFiles.find(f => f.endsWith('/public-api.ts')) || null;
`,
  'node_modules/@angular/compiler-cli/src/ngtsc/entry_point/src/logic.js');

// Workaround for: https://hackmd.io/MlqFp-yrSx-0mw4rD7dnQQ?both. We only want to discard
// the metadata of files in the bazel managed node modules. That way we keep the default
// behavior of ngc-wrapped except for dependencies between sources of the library. This makes
// the "generateCodeForLibraries" flag more accurate in the Bazel environment where previous
// compilations should not be treated as external libraries. Read more about this in the document.
searchAndReplace(
  /if \((this\.options\.generateCodeForLibraries === false)/, `
  const fs = require('fs');
  const hasFlatModuleBundle = fs.existsSync(filePath.replace('.d.ts', '.metadata.json'));
  if ((filePath.includes('node_modules/') || !hasFlatModuleBundle) && $1`,
  'node_modules/@angular/compiler-cli/src/transformers/compiler_host.js');
applyPatch(path.join(__dirname, './flat_module_factory_resolution.patch'));
// The three replacements below ensure that metadata files can be read by NGC and
// that metadata files are collected as Bazel action inputs.
searchAndReplace(
  /(const NGC_ASSETS = \/[^(]+\()([^)]*)(\).*\/;)/, '$1$2|metadata.json$3',
  'node_modules/@angular/bazel/src/ngc-wrapped/index.js');
searchAndReplace(
  /^((\s*)results = depset\(dep.angular.summaries, transitive = \[results]\))$/m,
  `$1#\n$2results = depset(dep.angular.metadata, transitive = [results])`,
  'node_modules/@angular/bazel/src/ng_module.bzl');
searchAndReplace(
  /^((\s*)results = depset\(target.angular.summaries if hasattr\(target, "angular"\) else \[]\))$/m,
  `$1#\n$2results = depset(target.angular.metadata if hasattr(target, "angular") else [], transitive = [results])`,
  'node_modules/@angular/bazel/src/ng_module.bzl');
// Ensure that "metadata" of transitive dependencies can be collected.
searchAndReplace(
  /("metadata": outs.metadata),/,
  `$1 + [m for dep in ctx.attr.deps if hasattr(dep, "angular") for m in dep.angular.metadata],`,
  'node_modules/@angular/bazel/src/ng_module.bzl');

// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1208.
applyPatch(path.join(__dirname, './manifest_externs_hermeticity.patch'));

try {
  // Temporary patch pre-req for https://github.com/angular/angular/pull/36333.
  // Can be removed once @angular/bazel is updated here to include this patch.
  // try/catch needed for this the material CI tests to work in angular/repo
  applyPatch(path.join(__dirname, './@angular_bazel_ng_module.patch'));
} catch (_) {}

// Workaround for https://github.com/angular/angular/issues/33452:
searchAndReplace(/angular_compiler_options = {/, `$&
        "strictTemplates": True,`, 'node_modules/@angular/bazel/src/ng_module.bzl');

// More info in https://github.com/angular/angular/pull/33786
shelljs.rm('-rf', [
  'node_modules/rxjs/add/',
  'node_modules/rxjs/observable/',
  'node_modules/rxjs/operator/',
  // rxjs/operators is a public entry point that also contains files to support legacy deep import
  // paths, so we need to preserve index.* and package.json files that are required for module
  // resolution.
  'node_modules/rxjs/operators/!(index.*|package.json)',
  'node_modules/rxjs/scheduler/',
  'node_modules/rxjs/symbol/',
  'node_modules/rxjs/util/',
  'node_modules/rxjs/internal/Rx.d.ts',
  'node_modules/rxjs/AsyncSubject.*',
  'node_modules/rxjs/BehaviorSubject.*',
  'node_modules/rxjs/InnerSubscriber.*',
  'node_modules/rxjs/interfaces.*',
  'node_modules/rxjs/Notification.*',
  'node_modules/rxjs/Observable.*',
  'node_modules/rxjs/Observer.*',
  'node_modules/rxjs/Operator.*',
  'node_modules/rxjs/OuterSubscriber.*',
  'node_modules/rxjs/ReplaySubject.*',
  'node_modules/rxjs/Rx.*',
  'node_modules/rxjs/Scheduler.*',
  'node_modules/rxjs/Subject.*',
  'node_modules/rxjs/SubjectSubscription.*',
  'node_modules/rxjs/Subscriber.*',
  'node_modules/rxjs/Subscription.*',
]);

// Apply all collected patches on a per-file basis. This is necessary because
// multiple edits might apply to the same file, and we only want to mark a given
// file as patched once all edits have been made.
Object.keys(PATCHES_PER_FILE).forEach(filePath => {
  if (hasFileBeenPatched(filePath)) {
    console.info('File ' + filePath + ' is already patched. Skipping..');
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const patchFunctions = PATCHES_PER_FILE[filePath];

  console.info(`Patching file ${filePath} with ${patchFunctions.length} edits..`);
  patchFunctions.forEach(patchFn => content = patchFn(content));

  fs.writeFileSync(filePath, content, 'utf8');
  writePatchMarker(filePath);
});

/**
 * Applies the given patch if not done already. Throws if the patch does
 * not apply cleanly.
 */
function applyPatch(patchFile) {
  // Note: We replace non-word characters from the patch marker file name.
  // This is necessary because Yarn throws if cached node modules are restored
  // which contain files with special characters. Below is an example error:
  // ENOTDIR: not a directory, scandir '/<...>/node_modules/@angular_bazel_ng_module.<..>'".
  const patchMarkerBasename = `${path.basename(patchFile).replace(/[^\w]/, '_')}`;
  const patchMarkerPath = path.join(projectDir, 'node_modules/', patchMarkerBasename);

  if (hasFileBeenPatched(patchMarkerPath)) {
    return;
  }

  shelljs.cat(patchFile).exec('patch -p0');
  writePatchMarker(patchMarkerPath);
}

/**
 * Schedules an edit where the specified file is read and its content replaced based on
 * the given search expression and corresponding replacement. Throws if no changes were made
 * and the patch has not been applied.
 */
function searchAndReplace(search, replacement, relativeFilePath) {
  const filePath = path.join(projectDir, relativeFilePath);
  const fileEdits = PATCHES_PER_FILE[filePath] || (PATCHES_PER_FILE[filePath] = []);

  fileEdits.push(originalContent => {
    const newFileContent = originalContent.replace(search, replacement);
    if (originalContent === newFileContent) {
      throw Error(`Could not perform replacement in: ${filePath}.`);
    }
    return newFileContent;
  });
}

/** Marks the specified file as patched. */
function writePatchMarker(filePath) {
  new shelljs.ShellString(PATCH_VERSION).to(`${filePath}.patch_marker`);
}

/** Checks if the given file has been patched. */
function hasFileBeenPatched(filePath) {
  const markerFilePath = `${filePath}.patch_marker`;
  return shelljs.test('-e', markerFilePath) &&
    shelljs.cat(markerFilePath).toString().trim() === `${PATCH_VERSION}`;
}
