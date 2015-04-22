var gulp = require('gulp');

var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var zip = require('gulp-zip');
var clean = require('gulp-clean');

// Add a task to render the output

gulp.task('lint', function() {
	return gulp.src('extension/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('package', ['clean'], function() {
	return gulp.src('extension/**')
		.pipe(zip('extension.zip'))
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function() {
	return gulp.src('dist/', { read: false })
		.pipe(clean());
});

gulp.task('default', taskListing);