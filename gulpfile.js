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

function compileHtml(source = 'src/pages/*.html', onEnd = null, log = true) {
  log && _log('[HTML] Compiling: ' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(nunjucks.compile({
      version: '1.1.0',
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

function compileScss(source = 'src/scss/*.scss', onEnd = null, log = true) {
  log && _log('[SCSS] Compiling scss:' + source, 'GREEN');

  src(source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .on('error', console.error.bind(console))
    .on('end', () => {
      onEnd && onEnd.call(this);
      log && _log('[SCSS] Compile Minified Finished', 'GREEN');
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
      log && _log('[SCSS] Compile Finished', 'GREEN');
    })
    .pipe(rename({
      dirname: '',
      extname: '.css'
    }))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/assets/css'))
    .pipe(plumber.stop());
}

async function compileJs(source) {
  src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .on('end', () => {
      _log('[js] Compile Finished', 'GREEN');
    })
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
    .on('end', () => _log('Finish Copy Vendor', 'GREEN'))
    .pipe(dest('./dist/vendor'))
}

function _log(message, _color) {
  console.log(color(message, _color ? _color : 'WHITE'));
}

function watchUpdate() {
  compileScss();
  compileHtml();
  compileJs()

  browserSync.init({
    server: {
      baseDir: "./"
    },
    startPath: 'dist/pages/index.html',
    port: 8080
  });

  watch([
    'src/pages/**/*.html',
    'src/scss/**/*.scss',
    'src/js/**/*.js',
  ]).on('change', (file) => {
    file = file.replace(/\\/g, '/');

    if (file.indexOf('.scss') > -1) {
      compileScss('src/scss/*.scss', () => {
        return browserSync.reload();
      });
    }

    if (file.indexOf('.html') > -1) {
      compileHtml('src/pages/*.html', () => {
        return browserSync.reload();
      });
    }

    if (file.indexOf('.js') > -1) {
      compileJs()
    }
  });
}

exports.html = compileHtml;
exports.sass = compileScss;
exports.default = watchUpdate;
exports.js = compileJs;
exports.copyVendor = copyVendor;