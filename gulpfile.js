const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const htmlmin = require('gulp-htmlmin');
const path = require('path');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

const source_dir = path.join(__dirname, 'src');

const html_source_path = path.join(source_dir, 'index.html');

const sass_source_dir = path.join(source_dir, 'sass')
const sass_source_path = path.join(sass_source_dir, 'style.scss');

const js_source_dir = path.join(source_dir, 'js');
const js_app_source_path = path.join(js_source_dir, 'main.js');

const dest_dir = path.join(__dirname, 'public');
const assets_dir = path.join(dest_dir, 'assets');
const css_dest_dir = path.join(assets_dir, 'css');
const js_dest_dir = path.join(assets_dir, 'js');

gulp.task('html', () =>
    gulp.src(html_source_path)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dest_dir))
);

gulp.task('js', () => {
    const bundler = browserify(js_app_source_path, {
        debug: true,
        paths: ['node_modules', js_source_dir],
        transform: [
            ['babelify', {presets: ["es2015"]}]
        ]
    });
    return bundler
        .bundle()
        .on('error', (err) => {
            gutil.log(err.message);
            err.stream.end();
        })
        .pipe(source('snake.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(js_dest_dir));
});

gulp.task('css', () =>
    gulp.src(sass_source_path)
        .pipe(sass({
            includePaths: [sass_source_dir],
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(css_dest_dir))
);

gulp.task('default', ['html', 'js']);
