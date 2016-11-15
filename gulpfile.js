var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');

var settings = {
    
    dist:       'dist/',
    src:        'src/',
    cssin:      'src/assets/css/**/*.css',
    jsin:       'src/assets/js/**/*.js',
    imgin:      'src/assets/img/**/*.{jpg,jpeg,png,gif}',
    htmlin:     'src/*.html',
    scssin:     'src/assets/css/*.scss',
    cssout:     'dist/css/',
    jsout:      'dist/js',
    imgout:     'dist/img',
    htmlout:    'dist/',
    scssout:    'src/assets/css',
    cssoutname: 'style.css',
    jsoutname:  'script.js',
    cssreplaceout: 'css/style.css',
    jsreplaceout: 'js/script.js'
    
}

gulp.task('reload', function () {

    browserSync.reload();

});

gulp.task('serve', ['sass'], function () {

    browserSync({

        server: settings.src

    });

    gulp.watch([settings.htmlin, settings.jsin], ['reload']);
    gulp.watch(settings.scssin, ['sass']);

});

gulp.task('sass', function() {
    
    return gulp.src(settings.scssin)
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            
            browsers: ['last 5 versions']
        
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(settings.scssout))
        .pipe(browserSync.stream());
    
});

gulp.task('css', function() {
   
    return gulp.src(settings.cssin)
        .pipe(concat(settings.cssoutname))
        .pipe(cleanCss())
        .pipe(gulp.dest(settings.cssout));
    
});

gulp.task('js', function() {
   
    return gulp.src(settings.jsin)
        .pipe(concat(settings.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(settings.jsout));
    
});

gulp.task('img', function() {
   
    return gulp.src(settings.imgin)
        .pipe(changed(settings.imgout))
        .pipe(imagemin())
        .pipe(gulp.dest(settings.imgout));
    
});

gulp.task('html', function() {
   
    return gulp.src(settings.htmlin)
        .pipe(htmlReplace({
        
            'css': settings.cssreplaceout,
            'js': settings.jsreplaceout
        
        }))
        .pipe(htmlMin({
        
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        
        }))
        .pipe(gulp.dest(settings.dist));
    
});

gulp.task('clean', function() {
   
    return del([settings.dist]);
    
});

gulp.task('build', function() {
   
    sequence('clean', ['html', 'js', 'css', 'img']);
    
});

gulp.task('default', ['serve']);