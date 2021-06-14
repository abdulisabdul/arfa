'use strict'
const {
  src,
  dest,
  watch
} = require('gulp');
const plumber = require('gulp-plumber');
const nunjucks = require('gulp-nunjucks');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const color = require('gulp-color');
const nodePath = require('path');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function compileHtml(source, onEnd, log = true) {
  log && _log('[HTML] Compiling: ' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(nunjucks.compile({
        version: '1.0.0',
        appName: 'Arfka'
      },
      /**
       * Nunjucks options   
       */
      {
        trimBlocks: true,
        lstripBlocks: true,
        /**
         * Nunjucks filters
         * @type {Object}
         */
        filters: {
          is_active: (str, reg, page) => {
            reg = new RegExp(reg, 'gm');
            reg = reg.exec(page);
            if (reg != null) {
              return str;
            }
          }
        }
      }
    ))
    .on('error', console.error.bind(console))
    .on('end', () => {
      onEnd && onEnd.call(this);
      log && _log('[HTML] Finished', 'GREEN');
    })
    .pipe(dest('pages/'))
    .pipe(plumber.stop());
}

function compileScss(source, onEnd, log = true) {
  log && _log('[SCSS] Compiling scss:' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .on('error', console.error.bind(console))
    .on('end', () => {
      onEnd && onEnd.call(this);
      log && _log('[SCSS] Finished', 'GREEN');
    })
    .pipe(rename({
      dirname: '',
      extname: '.css'
    }))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(dest('assets/css'))
    .pipe(plumber.stop());
}

function _log(message, _color) {
  console.log(color(message, _color ? _color : 'WHITE'));
}

async function runCompileHtml() {
  return compileHtml('src/pages/*.html', null, true);
}
async function runCompileScss() {
  return compileScss('src/scss/*.scss', null, true);
}

function watching() {
  runCompileScss();
  runCompileHtml();

  /**
   * BrowserSync initialization
   * @type {Object}
   */
  browserSync.init({
    server: {
      baseDir: "./"
    },
    startPath: 'pages/index.html',
    port: 8080
  });

  /**
   * Watch ${htmlDir}
   */
  watch([
    'src/pages/*.html',
    'src/scss/*.scss',
    // jsDir + '/**/*.js',
    // imgDir + '/**/*.*',
  ]).on('change', (file) => {
    file = file.replace(/\\/g, nodePath.sep);

    if (file.indexOf('.scss') > -1) {
      compileScss(file, () => {
        return browserSync.reload();
      });
    }

    // if(file.indexOf('layouts') > -1 && file.indexOf('.html') > -1) {
    //   compileHtml(htmlDir + '/*.html', () => {
    //     return browserSync.reload();
    //   });
    // }
    if (file.indexOf('.html') > -1) {
      compileHtml(file, () => {
        return browserSync.reload();
      });
    }

    // if(file.indexOf(jsDir) > -1 || file.indexOf(imgDir) > -1) {
    //   return browserSync.reload();
    // }
  });
}

exports.html = runCompileHtml;
exports.sass = runCompileScss;
exports.default = watching;