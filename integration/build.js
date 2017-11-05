const {fork} = require('child_process');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const ngc = require('@angular/compiler-cli/src/main').main;
const webpack = require('webpack');

const srcDir = path.join(__dirname, 'src/');
const e2eDir = path.join(__dirname, 'e2e/');
const distDir = path.join(__dirname, 'dist/');
const outDir = path.join(__dirname, 'out-tsc/e2e/');
const rollupConfig = {
  entry: `${outDir}main.js`,
  sourceMap: false,
  format: 'iife',
  onwarn: function (warning) {
    // Skip certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    // console.warn everything else
    console.warn(warning.message);
  },
  plugins: [
    nodeResolve({ jsnext: true, module: true }),
    commonjs({
      include: ['node_modules/rxjs/**']
    }),
    uglify()
  ]
};

const webpackCompiler = webpack(require(path.join(srcDir, 'webpack.config.js')));

function runWebpack() {
  return new Promise((resolve, reject) => {
    webpackCompiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    })
  })
}

return Promise.resolve()
// Compile using ngc.
  .then(() => ngc(['-p', e2eDir]))
  .then(() => ngc(['-p', srcDir]))
  // Create dist dir.
  .then(() => _recursiveMkDir(distDir))
  // Copy files.
  .then(() => {
    // Copy global stylesheets, images, etc.
    const assets = [
      'favicon.ico',
      'styles.css'
    ];

    return Promise.all(assets.map(asset => _relativeCopy(asset, srcDir, distDir)));
  })
  // .then(() => ngc(['-p', path.join(srcDir, 'tsconfig.prerender.json')]))
  // .then(() => fork(path.join(srcDir, 'prerender.js'), [], {cwd: srcDir}))
  .then(() => ngc(['-p', path.join(srcDir, `tsconfig.postrender.json`)]))
  .then(() => runWebpack())
  // Bundle app.
  .then(() => rollup.rollup(rollupConfig))
  // Concatenate app and scripts.
  .then(bundle => {
    const appBundle = bundle.generate(rollupConfig);

    const scripts = [
      'node_modules/core-js/client/shim.min.js',
      'node_modules/zone.js/dist/zone.min.js'
    ];

    let concatenatedScripts = scripts.map((script) => {
      return fs.readFileSync(path.join(__dirname, script)).toString();
    }).join('\n;');

    concatenatedScripts = concatenatedScripts.concat('\n;', appBundle.code);

    fs.writeFileSync(path.join(distDir, 'bundle.js'), concatenatedScripts);
  })
  .then(() => ngc(['-p', path.join(srcDir, 'tsconfig.prerender.json')]))
  .then(() => fork(path.join(outDir, 'prerender.js'), [], {cwd: srcDir}))
  .catch(e => {
    console.error('\Build failed. See below for errors.\n');
    console.error(e);
    process.exit(1);
  });



// Copy files maintaining relative paths.
function _relativeCopy(fileGlob, from, to) {
  return glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const origin = path.join(from, file);
      const dest = path.join(to, file);
      _recursiveMkDir(path.dirname(dest));
      fs.createReadStream(origin).pipe(fs.createWriteStream(dest));
    })
  })
}

// Recursively create a dir.
function _recursiveMkDir(dir) {
  if (!fs.existsSync(dir)) {
    _recursiveMkDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}
