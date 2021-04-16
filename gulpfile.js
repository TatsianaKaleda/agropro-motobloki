const gulp = require('gulp');
const babel = require("gulp-babel");
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const shorthand = require('gulp-shorthand');
const cleanCSS = require('gulp-clean-css');
const browserSync = require("browser-sync");
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const rigger = require('gulp-rigger');
const concat = require('gulp-concat');
const reload = browserSync.reload;

const path = {
    src: {
        js: 'src/script/scripts.js',
        css: 'src/style/style/style.scss',
        fonts: 'src/style/font/**/*.*'
    },
    build: {
        js: 'dist/js',
        css: 'dist/css/',
        fonts: 'dist/fonts/'
    },
    watch: {
        html: './*.html',
        js: 'src/script/*.js',
        css: 'src/style/style/**/*.scss',
        img: 'assets/img/**/*.*',
        fonts: 'src/style/font/**/*.*'
    },
    clean: './dist'
};

const config = {
    server: {
        baseDir: "./"
    },

    host: 'localhost',
    port: 9000,
    logPrefix: "Legal_tech"
};

const css = () => {
    return gulp
        .src(path.src.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer({
            cascade: false
        }))
        .pipe(shorthand())
        .pipe(cleanCSS({
            debug: true,
            compatibility: '*'
        }, details => {
            console.log(`${details.name}: Original size:${details.stats.originalSize} - Minified size: ${details.stats.minifiedSize}`)
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
};

const js = () => {
    return gulp
        .src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env', 'minify'],
            comments: false
        }))
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
};

const font = () => {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}))
};

gulp.task('build', gulp.series(gulp.parallel(css, font), js));

gulp.task('watch', function () {
    gulp.watch(path.watch.html).on('change', reload);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.img).on('change', reload);
    gulp.watch(path.watch.fonts, font);
});

gulp.task('webServer', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', gulp.series('clean', 'build', gulp.parallel('webServer', 'watch')));
