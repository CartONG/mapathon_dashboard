
'use strict';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import babel from 'rollup-plugin-babel';
import {rollup} from 'rollup';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pug from 'rollup-plugin-pug';
import json from 'rollup-plugin-json';
import inject from 'rollup-plugin-inject';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src([
    'app/scripts/**/*.js'
  ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// Optimize images
gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    'app/**/*.{otf,eot,ttf,woff,woff2,eof,svg}',
    'app/**/*.json',
    'app/**/**/**/**/*.png',
    '!app/tpl',
    '!app/node_scripts',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Keep material css away from other CSS stuffs
gulp.task('material', () =>
  gulp.src([
    // 'app/styles/vendor/material.icon.min.css',
    'app/styles/vendor/material.cyan-deep_orange.min.css'
  ])
  .pipe($.concat('material.css'))
  .pipe(gulp.dest('.tmp/styles'))
  .pipe(gulp.dest('dist/styles'))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', ['material'], () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    // 'app/styles/vendor/bootstrap.css',
    'getmdl-select.min.css',
    'app/styles/vendor/material-datetime-picker.css',
    'app/styles/vendor/dialog-polyfill.css',
    'app/styles/vendor/font-awesome.min.css',
    'app/styles/vendor/leaflet.css',
    'app/styles/vendor/Control.Loading.css',
    'app/styles/main.css',
    'app/styles/style.css'
  ])
    .pipe($.concat('bundle.css'))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('uglify', ['scripts'], () =>
	gulp.src(['.tmp/scripts/app.min.js'])
		.pipe($.uglify())
		.pipe($.size({title: 'uglify'}))
		.pipe(gulp.dest('dist/scripts/'))
);

// Bundle javascript
gulp.task('scripts', () => {
  return rollup({
    entry: './app/scripts/app.js',
    plugins: [
      pug(),
      json(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs({
        include: 'node_modules/**'
      }),
      babel({
        exclude: ['node_modules/**', 'app/geo/**']
      })
    ]
  }).then(function(bundle) {
    return bundle.write({
      format: 'iife',
      moduleName: 'map',
      dest: '.tmp/scripts/app.min.js'
    });
  });
});

// Scan your HTML for assets & optimize them
gulp.task('html', () =>
  gulp.src('app/tpl/index.pug')
    .pipe($.pug())
    .pipe($.rename('index.html'))
    .pipe(gulp.dest('.tmp'))
    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'))
);

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['html', 'scripts', 'styles'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'APP',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app'],
    port: 3000
  });

  gulp.watch(['app/tpl/*.pug'], ['html', 'lint', 'scripts', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'APP',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
  })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['lint', 'html', 'uglify', 'images', 'copy'],
    cb
  )
);
