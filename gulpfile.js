var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('reload', function () {

    browserSync.reload();

});

gulp.task('serve', ['sass'], function () {

    browserSync({

        server: 'src'

    });

    gulp.watch('src/*.html', ['reload']);
    gulp.watch('src/scss/*.scss', ['sass']);

});

gulp.task('sass', function() {
    
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourceMaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            
            browsers: ['last 5 versions']
        
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
    
});

gulp.task('default', ['serve']);