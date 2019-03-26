const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const htmlreplace = require('gulp-html-replace');

const scssSrc = [
    'template/_reset.css',
    'src/**/**/*.scss'
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
