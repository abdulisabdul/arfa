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
const uglify = require('gulp-uglify');
const color = require('gulp-color');
const nodePath = require('path');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps')
const npmDist = require('gulp-npm-dist')

function compileHtml(source, onEnd, log = true) {
  log && _log('[HTML] Compiling: ' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(nunjucks.compile({
      version: '1.0.0',
      appName: 'Arfa',
      copyright: '2022',
      author: 'Mulai Dari Null'
    },
      {
        trimBlocks: true,
        lstripBlocks: true,
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
    .pipe(dest('dist/pages/'))
    .pipe(plumber.stop());
}

function compileScss(source, onEnd, log = true) {
  log && _log('[SCSS] Compiling scss:' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .on('error', console.error.bind(console))
    .on('end', () => {
      onEnd && onEnd.call(this);
      log && _log('[SCSS] Finished', 'GREEN');
    })
    .pipe(rename({
      dirname: '',
      extname: '.min.css'
    }))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/assets/css'))
    .pipe(plumber.stop());

  src(source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
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
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('assets/css'))
    .pipe(plumber.stop());
}

async function compileJs(source) {
  src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('./dist/assets/js'))

  src('src/js/pages/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest('./dist/assets/js/pages'))
}

async function copyVendor() {
  _log('Copying vendor to dist/vendor', 'GREEN');
  src(
    npmDist({
      copyUnminified: true,
      replaceDefaultExcludes: true,
      excludes: [
        'node_modules/**/*',
        'node_modules',
        '/**/*.txt',
        'src/**/*',
        'examples/**/*',
        'example/**/*',
        'demo/**/*',
        'spec/**/*',
        'docs/**/*',
        'tests/**/*',
        'test/**/*',
        'Gruntfile.js',
        'gulpfile.js',
        'package.json',
        'package-lock.json',
        'bower.json',
        'composer.json',
        'yarn.lock',
        'webpack.config.js',
        'README',
        'LICENSE',
        'CHANGELOG',
        '*.yml',
        '*.md',
        '*.coffee',
        '*.ts',
        '*.scss',
        '*.less',
      ]
    }),
    { base: './node_modules' }
  )
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
    }))
    .on('end', () => _log('Finish copy vendor', 'GREEN'))
    .pipe(dest('./dist/vendor'))
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

function watchUpdate() {
  runCompileScss();
  runCompileHtml();
  compileJs()

  browserSync.init({
    server: {
      baseDir: "./"
    },
    startPath: 'dist/pages/index.html',
    port: 8080
  });

  watch([
    'src/pages/*.html',
    'src/scss/*.scss',
  ]).on('change', (file) => {
    file = file.replace(/\\/g, '/');

    if (file.indexOf('.scss') > -1) {
      compileScss(file, () => {
        return browserSync.reload();
      });
    }

    if (file.indexOf('.html') > -1) {
      compileHtml(file, () => {
        return browserSync.reload();
      });
    }
  });
}

exports.html = runCompileHtml;
exports.sass = runCompileScss;
exports.default = watchUpdate;
exports.js = compileJs;
exports.copyVendor = copyVendor;