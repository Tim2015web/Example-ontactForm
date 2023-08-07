const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const include = require('gulp-include');

function pages() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function fonts() {
    return src('app/fonts/src/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('app/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('app/fonts'))
}

function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src(['app/images/src/*.*', '!app/images/src/*.svg', '!app/images/src/favicon.png'])
        //.pipe(newer('app/images')) // For Avif
        //.pipe(avif({ quality: 50 }))

        .pipe(src(['app/images/src/*.*', '!app/images/src/favicon.png']))
        .pipe(newer('app/images'))
        .pipe(webp())

        .pipe(src('app/images/src/favicon.*'))
        .pipe(newer('app/images'))
        .pipe(imagemin())

        //.pipe(src('app/images/src/*.*')) // For Jpg
        //.pipe(newer('app/images'))
        //.pipe(imagemin())

        .pipe(dest('app/images'))
}

function imagessvg() {
    return src('app/images/src/sprite/*.svg')
        .pipe(src('app/images/src/sprite/*.svg'))
        .pipe(newer('app/images/src/sprite/compress'))
        .pipe(imagemin())
        .pipe(dest('app/images/src/sprite/compress'))
}

function sprite() {
    return src('app/images/src/sprite/compress/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('app/images'))
}

function watching() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
    watch(['app/scss/style.scss'], styles)
    watch(['app/images/src'], images)
    watch(['app/fonts/src'], fonts)
    watch(['app/js/main.js'], scripts)
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload);
    watch(['app/scss/**/*.scss'], styles);
    //watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
}

function cleanDist() {
    return src(['dist', 'docs'])
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        '!app/images/**/*.html',
        'app/images/*.*',       
        'app/fonts/*.*',
        'app/js/main.min.js',
        'app/*.html'

    ], { base: 'app' })
        .pipe(dest('dist'))
        .pipe(dest('docs'))
}

exports.sprite = sprite;
exports.build = series(cleanDist, building);
exports.start = parallel(styles, images, imagessvg, scripts, pages, watching);
