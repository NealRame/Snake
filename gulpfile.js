const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const htmlmin = require('gulp-htmlmin');
const path = require('path');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

///////////////////////////////////////////////////////////////////////////////
// Config variables  //////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////
// HTML tasks /////////////////////////////////////////////////////////////////
gulp.task('html', () =>
    gulp.src(html_source_path)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dest_dir))
);
gulp.task('html-watch', () => gulp.watch(html_source_path, ['html']));

///////////////////////////////////////////////////////////////////////////////
// Js tasks ///////////////////////////////////////////////////////////////////
const browserify_base_options = {
    debug: true,
    paths: ['node_modules', js_source_dir],
    transform: [
        ['babelify', {presets: ["es2015"]}]
    ]
};

function bundle(bundler) {
    return bundler
        .bundle()
        .on('error', (err) => {
            gutil.log(err.message);
            err.stream.end();
        })
        .pipe(source('snake.js'))
        .pipe(buffer())
        // .pipe(sourcemaps.init({loadMaps: true, debug: true}))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(js_dest_dir));
}

function create_browserify_bundler(options) {
    return browserify(
        js_app_source_path,
        Object.assign({}, browserify_base_options, options || {})
    );
}

function create_watchify_bundler(bundle) {
    const bundler = watchify(create_browserify_bundler(watchify.args));
    bundler
        .on('update', (ids) => {
            gutil.log('Update:');
            ids.forEach((id) => gutil.log(` - ${id}`))
            bundle(bundler);
        })
        .on('log', gutil.log)
    return bundler;
}

gulp.task('js', () => bundle(create_browserify_bundler()));
gulp.task('js-watch', () => bundle(create_watchify_bundler(bundle)));

///////////////////////////////////////////////////////////////////////////////
// CSS tasks //////////////////////////////////////////////////////////////////
gulp.task('css', () =>
    gulp.src(sass_source_path)
        // .pipe(sourcemaps.init({loadMaps: true, debug: true}))
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sass({
                includePaths: [sass_source_dir],
                outputStyle: 'compressed'
            }).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(css_dest_dir))
);
gulp.task('css-watch', () =>
    gulp.watch(path.join(sass_source_dir, '**', '*.scss'), ['css'])
);

///////////////////////////////////////////////////////////////////////////////
// Macro tasks ////////////////////////////////////////////////////////////////
gulp.task('watch', ['css-watch', 'html-watch', 'js-watch']);
gulp.task('default', ['css', 'html', 'js']);
