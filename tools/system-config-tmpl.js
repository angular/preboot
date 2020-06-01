/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** Map of Angular framework packages and their bundle names. */
var frameworkPackages = $ANGULAR_PACKAGE_BUNDLES;

/** Whether Ivy is enabled. */
var isRunningWithIvy = '$ANGULAR_IVY_ENABLED_TMPL'.toString() === 'True';

/** Path that relatively resolves to the directory that contains all packages. */
var packagesPath = '$PACKAGES_DIR';

/** Path that relatively resolves to the node_modules directory. */
var nodeModulesPath = '$NODE_MODULES_BASE_PATH';

/** Path mappings that will be registered in SystemJS. */
var pathMapping = {
  'tslib': 'node:tslib/tslib.js',

  'rxjs': 'node:rxjs/bundles/rxjs.umd.min.js',
  'rxjs/operators': 'tools/system-rxjs-operators.js',

  'preboot': packagesPath + '/preboot',
};

/** Package configurations that will be used in SystemJS. */
var packagesConfig = {
  // Set the default extension for the root package. Needed for imports to source files
  // without explicit extension. This is common in CommonJS.
  '.': {defaultExtension: 'js'},
  [packagesPath + '/preboot']: {
    main: 'index.js',
  }
};

// Configure framework packages.
setupFrameworkPackages();

// Configure the base path and map the different node packages.
System.config({
  baseURL: '$BASE_URL',
  map: pathMapping,
  packages: packagesConfig,
  paths: {
    'node:*': nodeModulesPath + '*',
  }
});

/**
 * Walks through all interpolated Angular Framework packages and configures
 * them in SystemJS. Framework packages should always resolve to the UMD bundles.
 */
function setupFrameworkPackages() {
  Object.keys(frameworkPackages).forEach(function(moduleName) {
    var primaryEntryPointSegments = moduleName.split('-');
    // Ensures that imports to the framework package are resolved
    // to the configured node modules directory.
    pathMapping[moduleName] = 'node:' + moduleName;
    // Configure each bundle for the current package.
    frameworkPackages[moduleName].forEach(function(bundleName) {
      // Entry-point segments determined from the UMD bundle name. We split the
      // bundle into segments based on dashes. We omit the leading segments that
      // belong to the primary entry-point module name since we are only interested
      // in the segments that build up the secondary or tertiary entry-point name.
      var segments = bundleName.substring(0, bundleName.length - '.umd.js'.length)
        .split('-')
        .slice(primaryEntryPointSegments.length);
      // The entry-point name. For secondary entry-points we determine the name from
      // the UMD bundle names. e.g. "animations-browser" results in "@angular/animations/browser".
      var entryPointName = segments.length ? moduleName + '/' + segments.join('/') : moduleName;
      var bundlePath = 'bundles/' + bundleName;
      // When running with Ivy, we need to load the ngcc processed UMD bundles.
      // These are stored in the `__ivy_ngcc_` folder that has been generated
      // since we run ngcc with `--create-ivy-entry-points`. Filter out the compiler
      // package because it won't be processed by ngcc.
      if (isRunningWithIvy && entryPointName !== '@angular/compiler') {
        bundlePath = '__ivy_ngcc__/' + bundlePath;
      }
      packagesConfig[entryPointName] = {
        main: segments
            .map(function() {
              return '../'
            })
            .join('') +
          bundlePath
      };
    });
  });
}
