// Contains support for: SASS/SCSS, concatenation, and minification for JS and CSS

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
// var compress = require('gulp-yuicompressor');
var elm = require('gulp-elm');
var babel = require("gulp-babel");
/*
 * E L M
 */

var elmPaths = [
 'web/elm/**/*.elm'
];
var elmMain = 'web/elm/Main.elm'

gulp.task('elm-init', elm.init);

gulp.task('elm', ['elm-init'], function() {
 // By explicitly handling errors, we prevent Gulp crashing when compile fails
 function onErrorHandler(err) {
     console.log(err.message);
 }
 // return gulp.src(elmPaths)             // "./src/Main.elm"
 return gulp.src(elmMain)             // "./src/Main.elm"
     .pipe(elm())
     .on('error', onErrorHandler)
	//  .pipe(gulpif(production, uglify()) )   // uglify
     .pipe(gulp.dest('priv/static/js'));
})

// ******

var appCssPaths = [
  'web/static/css/**/*.css*',
  'web/static/css/**/*.scss*',
  'web/elm/**/*.scss*'
];

var vendorCssPaths = [
  'web/static/vendor/**/*.css*',
];

var jsBeforePaths = [
];

var jsAfterPaths = [
  'deps/phoenix/priv/static/phoenix.js',
  'deps/phoenix_html/priv/static/phoenix_html.js',
  'web/static/js/**/*.js*',
  'web/static/vendor/**/*.js*',
];

var otherAssetPaths = [
  'web/static/assets/**/*',
];

function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}


//==================TASKS=====================

gulp.task('css-vendor', function() {
  return gulp
    .src(vendorCssPaths)
    .pipe(concat('app-vendor.css'))
    // .pipe(compress({
    //   type: 'css'
    // }))
    .pipe(gulp.dest('priv/static/css'));
});

gulp.task('css-app', function() {
  return gulp
    .src(appCssPaths)
    .pipe(concat('app.scss'))
    .pipe(sass())
    // .pipe(compress({
    //   type: 'css'
    // }))
    .pipe(gulp.dest('priv/static/css'));
});

gulp.task('js-before', function() {
  return gulp
    .src(jsBeforePaths)
    .pipe(concat('app-before.js'))
    .pipe(compress({
      type: 'js'
    }))
    .pipe(gulp.dest('priv/static/js'));
});

gulp.task('js-after', function() {
  return gulp
    .src(jsAfterPaths)
    // .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app-after.js'))
    // .pipe(sourcemaps.write("."))
    // .pipe(compress({
    //   type: 'js'
    // }))
    .pipe(gulp.dest('priv/static/js'));
});

gulp.task('assets', function() {
  return gulp
    .src(otherAssetPaths)
    .pipe(gulp.dest('priv/static'));
});

gulp.task('default', [
  'assets',
  'css-vendor',
  'css-app',
  'js-before',
  'js-after',
]);


//==================WATCHERS=====================

gulp.task('watch', ['elm', 'css-app'], function() {

  // CSS / SASS
  gulp.watch(vendorCssPaths, ['css-vendor']).on('change', reportChange);
  gulp.watch(appCssPaths, ['css-app']).on('change', reportChange);

  // ELM
  gulp.watch(elmPaths, ['elm']).on('change', reportChange);
  // JS
  gulp.watch(jsBeforePaths, ['js-before']).on('change', reportChange);
  gulp.watch(jsAfterPaths, ['js-after']).on('change', reportChange);

  // Other assets
  gulp.watch([
    'web/static/assets/**/*'
  ], ['assets']).on('change', reportChange);

});
