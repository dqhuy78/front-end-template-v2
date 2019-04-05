const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const rename = require('gulp-rename');

const scssSrc = [
    'template/_reset.css',
    'src/**/**/*.scss'
];

const jsSrc = [
    'src/**/**/*.js'
];

const imgSrc = [
    'src/images/*.+(png|jpg|svg)'
];

const fontSrc =[
    'src/fonts/*.+(otf|ttf|fnt)'
];

const vendorJs = [
    ''
];

const vendorCss = [
    ''
];

gulp.task('build-scss', () => {
    return gulp.src(scssSrc)
        .pipe(concat('app.scss'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build-js', () => {
    return gulp.src(jsSrc)
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('build-image', function () {
    return gulp.src(imgSrc)
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({
                optimizationLevel: 2,
                bitDepthReduction: false,
                colorTypeReduction: false,
            }),
        ]))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('build-font', function () {
    return gulp.src(fontSrc)
        .pipe(gulp.dest('dist/fonts'))
});
