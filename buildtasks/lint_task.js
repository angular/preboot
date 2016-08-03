var gulp = require('gulp');
var gulpTsLint = require('gulp-tslint');
var tslint = require('tslint');

module.exports = function (opts) {
  gulp.task('lint', function () {
    var program = tslint.createProgram('../tsconfig.json');

    return gulp.src(opts.tsFiles).
      pipe(gulpTsLint({
        formatter: 'verbose',
        program: program
      })).
      pipe(gulpTsLint.report());
  });
};
