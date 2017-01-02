/*eslint-env node*/

// TODO Consider adjusting module bundler (i.e. rollup) so that scoping
//      constraints are maintained even after bundling (e.g. private methods
//      from imported classes are not available in global scope)

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const jasmine = require('gulp-jasmine-phantom');
const babel = require('gulp-babel');
const rollup = require('rollup-stream');
const rollupIncludePaths = require('rollup-plugin-includepaths');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('default', ['html', 'images', 'styles', 'lint', 'scripts'], function() {
	gulp.watch('./*.html', ['html']);
	gulp.watch('img/**/*.png', ['images']);
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint', 'scripts']);
	browserSync.init({
		server: './dist',
		notify: false
	});
	gulp.watch('dist/index.html').on('change', browserSync.reload);
	gulp.watch('dist/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('dist/css/**/*.css').on('change', browserSync.reload);
	gulp.watch('dist/img/**/*.png').on('change', browserSync.reload);
});

gulp.task('html', function() {
	gulp.src(['./*.html'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('images', function() {
	gulp.src(['img/**/*.png'])
		.pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('lint', function() {
	return gulp.src(['js/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('scripts', function() {
	return rollup({
			entry: 'js/app.js',
			plugins: [
				rollupIncludePaths({paths: ['js']})
			]
		})
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('tests', function() {
	gulp.src('spec/*.js')
		.pipe(jasmine({
			integration: true
		}));
});
