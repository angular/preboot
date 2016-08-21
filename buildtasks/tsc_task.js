var gulp       = require('gulp');
var size       = require('gulp-size');
var typescript = require('typescript');
var path       = require('path');
var merge2     = require('merge2');
var spawn      = require('child_process').spawn;

module.exports = function (opts) {
  gulp.task('tsc', function () {
    var tsConfig = path.join(opts.rootDir, 'tsconfig.json');

    return new Promise(function (resolve, reject) {

      var cmd = "tsc -p " + tsConfig + " --pretty --diagnostics";
      console.log(cmd);

      const argArray = cmd.split(' ');

      const compiler = spawn(argArray.shift(), argArray, {
        stdio: 'inherit'
      });

      compiler.on('close', function (code) {
        console.log('Typescript compiler exited with code', code);
        code === 0 ? resolve() : reject();
      });

      compiler.on('error', function (code) {
        console.log('error', code);
        reject();
      });

    });
  })
};
