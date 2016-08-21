var gulp = require('gulp');
var size = require('gulp-size');
var gulpTs = require('gulp-typescript');
var typescript = require('typescript');
var path = require('path');
var merge2 = require('merge2');

module.exports = function (opts) {
  gulp.task('tsc', function () {
    var tsConfig = path.join(opts.rootDir, 'tsconfig.json');
    var tsProject = gulpTs.createProject(tsConfig, {
      typescript: typescript,
      declaration: true
    });

    var tsStream = tsProject.src().
      pipe(typescript(tsProject));


    return merge2([
      tsStream.js.
        pipe(size()).
        pipe(gulp.dest(tsProject.config.compilerOptions.outDir)),
      tsStream.dts.
        pipe(gulp.dest(tsProject.config.compilerOptions.outDir))
    ]);

  });
};
