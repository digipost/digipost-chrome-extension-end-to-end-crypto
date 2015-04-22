var gulp = require('gulp');

var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');

// Add a task to render the output

gulp.task('lint', function() {
	return gulp.src('extension/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('default', taskListing);