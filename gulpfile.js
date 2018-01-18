var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('js', () => {
  return gulp.src('rhaetia.js')
  .pipe(babel({presets: ['env']}))
  .on('error', function(err) {
    console.error('[Compilation Error]');
    console.error(err.message + '\n');
    console.error(err.codeFrame);
    this.emit('end');
  })
  .pipe(uglify())
  .pipe(rename('index.js'))
  .pipe(gulp.dest('./'))
});

gulp.task('watch', () => {
  gulp.watch('rhaetia.js', ['js']);
});

gulp.task('build', ['js']);

gulp.task('default', ['build', 'watch']);
