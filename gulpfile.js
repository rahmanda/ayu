var gulp        = require("gulp");
var sass        = require("gulp-sass");
var cssnano     = require("gulp-cssnano");
var concat      = require("gulp-concat");
var pug         = require("gulp-pug");
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");
var browserSync = require("browser-sync").create();
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var browserify  = require("browserify");

var ROOTPATH = "/";
var SERVER   = "http://localhost:8000";
var PATH = {
  sass   : "assets/scss/**/*.scss",
  view   : "views/**/*.pug",
  js     : "assets/js/**/*.js",
  dist : {
    css : "public/assets/css",
    js  : "public/assets/js",
    view: "public/"
  }
};

// Static server + watching asset files
gulp.task('serve', ['sass', 'browserify'], function () {
  browserSync.init({
    proxy: SERVER
  });

  gulp.watch(PATH.sass, ['sass']);
  gulp.watch(PATH.js, ['browserify'], browserSync.reload);
  gulp.watch(PATH.view).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(PATH.sass)
         .pipe(sass())
         .pipe(cssnano())
         .pipe(gulp.dest(PATH.dist.css))
         .pipe(browserSync.stream());
});

gulp.task('browserify', function() {
  return browserify('assets/js/app.js')
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(PATH.dist.js));
});

gulp.task('pug', function() {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(PATH.dist.view));
});

gulp.task('default', ['serve']);
