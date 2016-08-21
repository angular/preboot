var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

module.exports = function (opts) {

  gulp.task('dist.min', ['tsc'], function () {
    return gulp.src([
      '__build/src/browser/preboot_browser.js',
      '__build/src/inline/preboot_inline.js'
    ])
      .pipe(replace(/exports\..*;/, ''))
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.extname = '.min.js';
        return path;
      }))
      .pipe(gulp.dest('__dist'));
  });

  gulp.task('dist.client', [ 'tsc' ], function () {
    return gulp.src([
      '__build/src/browser/preboot_browser.js',
      '__build/src/inline/preboot_inline.js'
    ])
      .pipe(replace(/exports\..*;/, ''))
      .pipe(gulp.dest('__dist'));
  });

  gulp.task('dist', ['dist.min', 'dist.client']);
};
