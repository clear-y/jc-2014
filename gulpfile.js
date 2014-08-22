var gulp = require('gulp'),
    // css
    sass = require('gulp-ruby-sass'),
    autoprefix = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    // js
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    strip = require('gulp-strip-debug'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    // images
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    // other
    util = require('gulp-util'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    // live reload
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

//
// Assets
//
var paths = {
    assets: {
        stylesDir: '_assets/styles',
        stylesFiles: '_assets/styles/**/*.sass',
        jsDir: '_assets/js/',
        jsFiles: '_assets/js/**/*.js',
        imgDir: '_assets/img',
        imgFiles: '_assets/img/**/*'
    },
    public: {
        styles: 'public/styles',
        js: 'public/js',
        img: 'public/img',
    }
}

//
// Complile Scss
//
gulp.task('styles', function() {
    gulp.src(paths.assets.stylesDir + '/main.sass')
        .pipe(sass({style: 'expanded'}).on('error', util.log))
        .pipe(autoprefix('last 4 version', 'ie 9'))
        .pipe(gulp.dest(paths.public.styles))
        .pipe(notify('Styles task completed.'));
});

//
// Concantinate JS
//
gulp.task('js', function() {
    gulp.src(paths.assets.jsFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.public.js))
        .pipe(notify('JS task completed.'));
});

//
// Optimize images
//
gulp.task('img', function() {
    gulp.src(paths.assets.imgFiles)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(paths.public.img))
        .pipe(notify('Img task completed.'));
});

//
// Clean out the public directory
//
gulp.task('clean', function() {
    gulp.src([paths.public.styles, paths.public.js, paths.public.img], {read: false})
        .pipe(clean());
});

//
// Watch for changes
//
gulp.task('watch', function() {
    gulp.watch(paths.assets.stylesFiles, ['styles']);
    gulp.watch(paths.assets.jsFiles, ['js']);
    gulp.watch(paths.assets.imgFiles, ['img']);
});

//
// Build assets in production mode
//
gulp.task('deploy', function() {
    // Build minified Scss
    gulp.src(paths.assets.stylesDir + '/main.sass')
        .pipe(sass({style: 'compressed'}).on('error', util.log))
        .pipe(autoprefix('last 4 version', 'ie 9'))
        .pipe(minify())
        .pipe(gulp.dest(paths.public.styles))
        .pipe(notify('Styles task completed.'));

    // Stip out debug code and minify JS
    gulp.src(paths.assets.jsFiles)
        .pipe(concat('functions.js'))
        .pipe(strip())
        .pipe(uglify())
        .pipe(gulp.dest(paths.public.js))
        .pipe(notify('JS task completed.'));

    // Img task is the same
    gulp.start('img');
});

//
// Defualt task - Do everything
//
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'js', 'img', 'watch');
});
