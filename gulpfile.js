var gulp = require('gulp');

var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var zip = require('gulp-zip');

// Add a task to render the output

gulp.task('lint', function() {
	return gulp.src('extension/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('package', function() {
	return gulp.src('extension/**')
		.pipe(zip('extension.zip'))
		.pipe(gulp.dest('dist'))
});



gulp.task('default', taskListing);