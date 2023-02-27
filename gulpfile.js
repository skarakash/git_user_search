const { src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser')
const browserSync = require('browser-sync').create()

const scssTask = () => {
  return src('app/scss/style.scss', {sourcemaps: true})
    .pipe(sass())
    .pipe(postcss(cssnano()))
    .pipe(dest('dist', {sourcemap: '.'}))
}

const jsTask = () => {
  return src('app/js/script.js', {sourcemaps: true})
    .pipe(terser())
    .pipe(dest('dist', {sourcemap: '.'}))
}

const browserSyncServe = (cb) => {
  browserSync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

const browserSyncReload = (cb) => {
  browserSync.reload();
  cb();
}

const watchTask = () => {
  watch('*.html', browserSyncReload)
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browserSyncReload))
}

exports.default = series(
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask
)