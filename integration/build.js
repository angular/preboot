const {fork} = require('child_process');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { NodeJSFileSystem, setFileSystem } = require('@angular/compiler-cli/src/ngtsc/file_system');
const ngc = require('@angular/compiler-cli/src/main').main;
const webpack = require('webpack');

setFileSystem(new NodeJSFileSystem())

const srcDir = path.join(__dirname, 'src/');
const e2eDir = path.join(__dirname, 'e2e/');
const distDir = path.join(__dirname, 'dist/');
const outDir = path.join(__dirname, 'out-tsc/e2e/');

const webpackCompiler = webpack(require(path.join(srcDir, 'webpack.config.js')));

function runWebpack() {
  return new Promise((resolve, reject) => {
    webpackCompiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString());
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
  .then(() => fs.mkdirSync(distDir))
  // .then(() => ngc(['-p', path.join(srcDir, 'tsconfig.prerender.json')]))
  // .then(() => fork(path.join(srcDir, 'prerender.js'), [], {cwd: srcDir}))
  .then(() => ngc(['-p', path.join(srcDir, `tsconfig.postrender.json`)]))
  .then(() => runWebpack())
  .then(() => ngc(['-p', path.join(srcDir, 'tsconfig.prerender.json')]))
  .then(() => fork(path.join(outDir, 'prerender.js'), [], {cwd: srcDir}))
  .catch(e => {
    console.error('\Build failed. See below for errors.\n');
    console.error(e);
    process.exit(1);
  });
