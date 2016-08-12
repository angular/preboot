var gulp = require('gulp');
var size = require('gulp-size');
var gulpTs = require('gulp-typescript');
var typescript = require('typescript');
var path = require('path');

module.exports = function (opts) {
  gulp.task('tsc', function () {
    var tsConfig = path.join(opts.rootDir, 'tsconfig.json');
    var tsProject = gulpTs.createProject(tsConfig, {
      typescript: typescript
    });

    return gulp.src(['node_modules/@types/**/*.d.ts', 'src/**/*.ts', 'test/**/*.ts']).
      pipe(gulpTs(tsProject)).
      pipe(size()).
      pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
  });
};
