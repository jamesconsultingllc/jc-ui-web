/*eslint-env node */

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    babel = require('gulp-babel'),
    uncss = require('gulp-uncss'),
    cssShorthand = require('gulp-shorthand'),
    cssMinify = require('gulp-clean-css'),
    sourcemaps = require("gulp-sourcemaps"),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    htmlreplace = require('gulp-html-replace'),
    browserSync = require('browser-sync').create();

gulp.task('serve', ['css'], function () {

    browserSync.init({
        server: "dist"
    });
    gulp.watch('**/*.css', ['css']);
    gulp.watch("/*.html", ['copy-html'])
    gulp.watch("dist/*.html").on('change', browserSync.reload);
    gulp.watch('js/**/*.js', ['lint']);
});

//gulp.task('dist', ['copy-html', 'copy-images', 'copy-fonts', 'js-dist', 'css']);
gulp.task('dist', ['copy-images', 'copy-fonts', 'replace', 'js-dist', 'css']);

gulp.task('replace', function(){
    gulp.src('src/*.html')
      //  .pipe(sourcemaps.init())
        .pipe(htmlreplace({
            'css': 'assets/css/styles.min.css',
            'js': 'assets/js/bundle.min.js'
        }))
        .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true, removeComments: true}))
       // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));

    gulp.src(['src/web.config', 'src/manifest.json', 'src/*.xml'])
        .pipe(gulp.dest('dist'));
});

gulp.task('js-dist', function () {
    gulp.src([
        //'src/assets/js/bootstrap.js'
        // ,'src/assets/js/slick.js'
        // ,'src/assets/js/waypoints.js'
        // ,'src/assets/js/jquery.counterup.js'
        // , 'src/assets/js/wow.js'
         'src/assets/js/custom.js'])
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('bundle.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'));
});

// gulp.task('copy-html', function () {
//     gulp.src('./*.html')
//     .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, minifyJS: true}))
//     .pipe(gulp.dest('dist'));
// });

gulp.task('copy-fonts', function () {
    gulp.src('src/assets/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('copy-images', function () {
    gulp.src(['src/assets/images/*.jpg', 'src/assets/images/*.png', 'src/assets/images/*.gif'])
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/images'));

    gulp.src('src/*.png')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist'));

    gulp.src('src/assets/images/*.svg')
        .pipe(gulp.dest('dist/assets/images'));    
});

gulp.task('css', function () {
    gulp.src([
        //'src/assets/css/font-awesome.css', 'src/assets/css/bootstrap.css','src/assets/css/slick.css', 'src/assets/css/animate.css',
        'src/assets/css/slick.css',
        'src/assets/css/theme-color/dark-red-theme.css', 'src/style.css', 'src/assets/css/googlefonts.css'])
        .pipe(sourcemaps.init())
        // .pipe(uncss({
        //      html: ['src/*.html']
        //  }))
        .pipe(cssShorthand())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(cssMinify())
        .pipe(concat('styles.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());

    gulp.src('src/assets/css/*.gif')
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('lint', function () {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

//gulp.task('tests', function () {
//    gulp.src('tests/spec/extraSpec.js')
//        .pipe(jasmine({
//            integration: true,
//            vendor: 'js/spec/**/*.js'
//        }));
//});
gulp.task('default', ['copy-html', 'copy-images', 'lint', 'serve']);