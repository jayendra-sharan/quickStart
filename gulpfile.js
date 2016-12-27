var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    runSequence = require('run-sequence');


browserSync = browserSync.create();
// test task
// gulp.task('hello', function() {
//   console.log('Gulp Gulp Gulp!');
// })

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())                // using gulp-sass plugin
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    // minifies only if js file.
    .pipe(gulpIf('*.js', uglify()))
    // minify css files.
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
});


gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  // other watches can be added here
});

gulp.task('build', function(callback){
  runSequence('clean:dist',
    ['sass', 'useref', 'fonts'],
    callback
  )
});

gulp.task('default', function(callback) {
  runSequence(
    ['sass', 'browserSync', 'watch'],
    callback
  )
});
