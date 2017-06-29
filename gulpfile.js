var gulp        = require("gulp");
var serve       = require("gulp-serve");
var sass        = require("gulp-sass");
var cssnano     = require("gulp-cssnano");
var concat      = require("gulp-concat");
var pug         = require("gulp-pug");
var uglify      = require("gulp-uglify");
var rename      = require("gulp-rename");
var autoprefixer= require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var source      = require("vinyl-source-stream");
var buffer      = require("vinyl-buffer");
var browserify  = require("browserify");
var argv        = require("yargs").argv;
var chalk       = require("chalk");
var highlighter = require("gulp-highlight");

var ROOTPATH = "/";
var SERVER   = "http://localhost:8000";
var PREFIX_PATH = {
  src: 'src',
  dist: 'dist',
  demo: 'demo',
  public: 'public'
};
var PATH = {
  demo    : {
    entry: PREFIX_PATH.demo + "/views/demo.scss",
    dist: PREFIX_PATH.public
  },
  sass   : {
    entry: PREFIX_PATH.src + "/ayu.scss",
    src:   PREFIX_PATH.src + "/**/*.scss",
    dist:  PREFIX_PATH.dist
  },
  view   : {
    entry: PREFIX_PATH.demo + "/views/index.pug",
    src:   PREFIX_PATH.demo + "/views/**/*.pug"
  },
  js     : {
    entry: PREFIX_PATH.demo + "/js/app.js",
    src:   PREFIX_PATH.demo + "/js/**/*.js"
  },
  static: {
    src: PREFIX_PATH.demo + "/**/*.{ttf,woff,woff2,eot,svg,jpeg}"
  }
};

var BUILD_NAME = {
  css: {
    minified: 'ayu.css',
    unminified: 'ayu.min.css'
  }
};

// Static server + watching asset files
gulp.task('serve', ['sass-minified', 'sass-unminified', 'browserify', 'pug', 'demo', 'static'], function() {
  var sync = argv.browserify ? argv.browserify : 'true';

  if (sync === 'true') {
    browserSync.init({
      proxy: SERVER
    });
    gulp.watch(PATH.js.src, ['js-watch']);
    gulp.watch(PATH.view.src, ['pug-watch']);
    gulp.watch(PATH.static.src, ['static-watch']);
  }

  gulp.watch(PATH.sass.src, ['sass-minified']);
  gulp.watch(PATH.sass.src, ['sass-unminified']);
  gulp.watch(PATH.demo.entry, ['demo']);
});

gulp.task('build', ['sass-unminified', 'sass-minified', 'browserify', 'pug', 'demo', 'static']);

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass-unminified', function() {
  return gulp.src(PATH.sass.src)
    .pipe(sass({
      includePaths: ['bower_components/gridle/sass']
    }))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename(BUILD_NAME.css.unminified))
    .pipe(gulp.dest(PATH.sass.dist))
    .pipe(gulp.dest(PATH.demo.dist))
    .pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass-minified', function() {
  return gulp.src(PATH.sass.src)
    .pipe(sass({
      includePaths: ['bower_components/gridle/sass']
    }))
    .pipe(autoprefixer())
    .pipe(rename(BUILD_NAME.css.minified))
    .pipe(gulp.dest(PATH.sass.dist))
    .pipe(gulp.dest(PATH.demo.dist));
});

// Compile all js files into one file
gulp.task('browserify', function() {
  return browserify(PATH.js.entry)
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(PREFIX_PATH.public));
});

gulp.task('js-watch', ['browserify'], function(done) {
  browserSync.reload();
  done();
});

// Compile all pug files into one file
gulp.task('pug', function() {
  return gulp.src(PATH.view.entry)
    .pipe(pug())
    .pipe(highlighter())
    .pipe(gulp.dest(PREFIX_PATH.public));
});

gulp.task('pug-watch', ['pug'], function(done) {
  browserSync.reload();
  done();
});

// Minify and clone icon css
gulp.task('demo', function() {
  return gulp.src(PATH.demo.entry)
    .pipe(sass({
      includePaths: ['bower_components/Ionicons/scss']
    }))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(PATH.demo.dist))
    .pipe(browserSync.stream());
});

// Move all static files to dist
gulp.task('static', function() {
  return gulp.src(PATH.static.src)
    .pipe(gulp.dest(PREFIX_PATH.public));
});

gulp.task('static-watch', ['static'], function(done) {
  browserSync.reload();
  done();
});

// Create static website server
// need to be executed separately from main task
gulp.task('server', serve({
  root: [PREFIX_PATH.public],
  port: 8000
}));

// Export assets to other directory
// accept three argument:
// path = main directory target's path (required),
// sass = sass folder (optional),
// js = js folder (optional)
gulp.task('export-assets', function(done) {
  var sassPath = argv.sass ? argv.sass : '/assets/sass';
  var jsPath = argv.js ? argv.js : '/assets/js';

  if (argv.path === undefined) {
    console.log(chalk.red('Please provide path parameter by using --path flag'));
  } else {
    console.log('Target path: ' + chalk.cyan(argv.path));
    gulp.src(PATH.sass.src)
      .pipe(gulp.dest(argv.path + sassPath))
      .on('end', function() { console.log('Copying sass files: ' + chalk.cyan('Done')); });
    gulp.src(PATH.js.src)
      .pipe(gulp.dest(argv.path + jsPath))
      .on('end', function() { console.log('Copying js files: ' + chalk.cyan('Done')); });
  }

  return done();
});

// Main task
gulp.task('default', ['serve']);
