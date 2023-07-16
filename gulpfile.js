'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass');
var babel         = require('gulp-babel');
var coffee        = require('gulp-coffee');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var fileinclude   = require('gulp-file-include');
var htmlmin       = require('gulp-htmlmin');
var minify        = require('gulp-minify');
var concat        = require('gulp-concat');
var browserSync   = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./scss/**/*.+(sass|scss)')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false, overrideBrowserslist: ['defaults']}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream());
});
 
gulp.task('coffee', function() {
  return gulp.src('./coffee/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(minify({ext:{src:'.js', min:'.min.js'}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('fileinclude', function() {
  return gulp.src(['src/**/**/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root',
      context: {
        "base_url": "",
        "base_path": "/",
        "site_title": "",
        "site_description": "",
        "app_version": 1.1
      }
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['sass', 'coffee', 'fileinclude'], function() {
  
  gulp.watch('./scss/**/*.+(sass|scss)', ['sass']);
  gulp.watch('./coffee/**/*.coffee', ['coffee']);
  gulp.watch(['inc/**/**/*.html', 'src/**/**/*.html'], ['fileinclude']);

  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    reloadDelay: 1000
  });

  return gulp.watch(["dist/**/**/*.html"]).on('change', browserSync.reload);
});