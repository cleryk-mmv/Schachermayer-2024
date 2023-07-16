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
var browserSync   = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.+(sass|scss)')
    //.pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.stream());
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.+(sass|scss)', ['sass']);
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


gulp.task('default', ['sass', 'sass:watch', 'coffee', 'coffee:watch', 'fileinclude'], function() {
  
  gulp.watch('./scss/**/*.+(sass|scss)', ['sass']);
  gulp.watch('./coffee/**/*.coffee', ['coffee']);
  gulp.watch(['inc/**/**/*.html', 'src/**/**/*.html'], ['fileinclude']);

  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  return gulp.watch(["inc/**/*.html", "src/**/*.html"], ['fileinclude']).on('change', browserSync.reload);
});