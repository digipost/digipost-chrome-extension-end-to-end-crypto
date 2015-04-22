var gulp = require('gulp');

var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var git = require('gulp-git');
var bump = require('gulp-bump');
var tag_version = require('gulp-tag-version');

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

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

gulp.task('default', taskListing);


function inc(importance) {
	return gulp.src(['extension/manifest.json'])
		// Bump version numbers in files with version
		.pipe(bump({type: importance}))
		.pipe(gulp.dest('./extension'))
	 	.pipe(git.commit('Bumped package version for ' + importance))
	 	.pipe(tag_version());
}