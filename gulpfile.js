var gulp = require('gulp');

var jshint = require('gulp-jshint');
var taskListing = require('gulp-task-listing');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var git = require('gulp-git');
var bump = require('gulp-bump');
var tag_version = require('gulp-tag-version');
var yargs = require('yargs');

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

gulp.task('bump', function() {
	var importance = yargs.argv.ver;
	const possibleImportances = ['patch', 'minor', 'major'];

	if (!importance || possibleImportances.indexOf(importance) == -1) {
		var defaultImportance = possibleImportances[0];
		console.log('No or invalid version type provided. Using ' + defaultImportance + '. To specify your own, specify --ver=[' + possibleImportances.join('|') + ']');
		importance = defaultImportance;
	}

	return inc(importance);
});

gulp.task('default', taskListing);

function inc(importance) {
	return gulp.src(['extension/manifest.json'])
		// Bump version numbers in files with version
		.pipe(bump({type: importance}))
		.pipe(gulp.dest('./extension'))
	 	.pipe(git.commit('Bumped package version for ' + importance))
	 	.pipe(tag_version());
}