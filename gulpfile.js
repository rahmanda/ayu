var gulp        = require("gulp");
var serve       = require("gulp-serve");
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
var PREFIX_PATH = {
  src: 'src',
  dist: 'dist'
};
var PATH = {
  css    : {
    entry: PREFIX_PATH.src + "/views/demo.css",
    dist:  PREFIX_PATH.dist + "/assets/css"
  },
  sass   : {
    entry: PREFIX_PATH.src + "/scss/app.scss",
    src:   PREFIX_PATH.src + "/scss/**/*.scss",
    dist:  PREFIX_PATH.dist + "/assets/css"
  },
  view   : {
    entry: PREFIX_PATH.src + "/views/index.pug",
    src:   PREFIX_PATH.src + "/views/**/*.pug",
    dist:  PREFIX_PATH.dist
  },
  js     : {
    entry: PREFIX_PATH.src + "/js/app.js",
    src:   PREFIX_PATH.src + "/js/**/*.js",
    dist:  PREFIX_PATH.dist + "/assets/js"
  }
};

// Static server + watching asset files
gulp.task('serve', ['sass', 'browserify', 'pug', 'democss'], function() {
  browserSync.init({
    proxy: SERVER
  });

  gulp.watch(PATH.sass.src, ['sass']);
  gulp.watch(PATH.css.entry, ['democss']);
  gulp.watch(PATH.js.src, ['js-watch']);
  gulp.watch(PATH.view.src, ['pug-watch']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(PATH.sass.src)
         .pipe(sass())
         .pipe(cssnano())
         .pipe(gulp.dest(PATH.sass.dist))
         .pipe(browserSync.stream());
});

// Compile all js files into one file
gulp.task('browserify', function() {
  return browserify(PATH.js.entry)
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(PATH.js.dist));
});

gulp.task('js-watch', ['browserify'], function(done) {
  browserSync.reload();
  done();
});

// Compile all pug files into one file
gulp.task('pug', function() {
  return gulp.src(PATH.view.entry)
    .pipe(pug())
    .pipe(gulp.dest(PATH.view.dist));
});

gulp.task('pug-watch', ['pug'], function(done) {
  browserSync.reload();
  done();
});

// Minify and clone demo css
gulp.task('democss', function() {
  return gulp.src(PATH.css.entry)
    .pipe(cssnano())
    .pipe(gulp.dest(PATH.css.dist))
    .pipe(browserSync.stream());
});

// Create static website server
// need to be executed separately from main task
gulp.task('server', serve({
    root: ['dist'],
    port: 8000
}));

// Main task
gulp.task('default', ['serve']);
