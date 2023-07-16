'use strict';

var gulp          = require('gulp');
var babel         = require('gulp-babel');
var coffee        = require('gulp-coffee');
var sourcemaps    = require('gulp-sourcemaps');
var fileinclude   = require('gulp-file-include');
var htmlmin       = require('gulp-htmlmin');
var minify        = require('gulp-minify');
var browserSync   = require('browser-sync').create();
 
gulp.task('coffee', function() {
  return gulp.src('./coffee/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(minify({ext:{src:'.js', min:'.min.js'}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('coffee:watch', function () {
  gulp.watch('./coffee/**/*.coffee', ['coffee']);
});

gulp.task('fileinclude', function() {
  return gulp.src(['src/**/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root',
      context: {
        "base_url": "",
        "base_path": "/",
        "site_title": "Jetzt die passende Lehrstelle in Österreich finden - lehrstelle.at",
        "site_description": "Finde die perfekte Lehrstelle in Österreich - ob im Büro, im Freien, im Labor, in der Küche oder anderswo mit nextstep!",
        "app_version": 1.1
      }
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['coffee', 'fileinclude'], function() {
  
  gulp.watch('./coffee/**/*.coffee', ['coffee']);
  gulp.watch(['inc/**/**/*.html', 'src/**/**/*.html'], ['fileinclude']);

  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  return gulp.watch(["inc/**/**/*.html", "src/**/**/*.html"], ['fileinclude']).on('change', browserSync.reload);
});