/*eslint-env node*/

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', ['html', 'images', 'styles', 'lint', 'tests', 'scripts'], function() {
	gulp.watch('./*.html', ['html']);
	gulp.watch('img/**/*.png', ['images']);
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint', 'tests', 'scripts']);
	browserSync.init({
		server: './dist'
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
	gulp.src(['js/**/*.js'])
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('tests', function() {
	gulp.src('spec/*.js')
		.pipe(jasmine({
			integration: true
		}));
});