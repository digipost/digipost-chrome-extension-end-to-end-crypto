var gulp = require('gulp');
var gutil = require('gulp-util');

var taskListing = require('gulp-task-listing');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var through = require('through2');

var zip = require('gulp-zip');

var git = require('gulp-git');
var bump = require('gulp-bump');
var tag_version = require('gulp-tag-version');

var ncp = require('ncp').ncp;
var del = require('del');
var mkdirp = require('mkdirp');

var yargs = require('yargs');
var runSequence = require('run-sequence');

gulp.task('lint', function() {
	return gulp.src('extension/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

gulp.task('package', ['copy', 'clean'], function() {
		return gulp.src('dist/build/**')
			.pipe(zip('extension.zip'))
			.pipe(gulp.dest('dist'))
});

gulp.task('copy', ['clean'], function(cb) {
	console.log('Packaging the extension to the dist folder');

	mkdirp('dist/build', function (mkdirErr) {
		ncp('extension', 'dist/build', function (copyErr) {
			if (mkdirErr || copyErr) return console.error("Unable to copy extension folder", mkdirErr, copyErr);
			cb();
		});
	});
});

gulp.task('clean', function (callback) {
	del(['dist/'], callback);
});

gulp.task('bump', function () {
	var importance = yargs.argv.ver;
	const possibleImportances = ['patch', 'minor', 'major'];

	if (!importance || possibleImportances.indexOf(importance) == -1) {
		var defaultImportance = possibleImportances[0];
		console.log('No or invalid version type provided. Using ' + defaultImportance + '. To specify your own, specify --ver=[' + possibleImportances.join('|') + ']');
		importance = defaultImportance;
	}

	return inc(importance);
});

gulp.task('release', function (callback) {
	runSequence('lint', 'bump', 'copy', 'permissions', 'package', function () {
		console.log('Done releasing! Nothing has been pushed to Github, so please review the release manually and push or rollback. Remember to delete the tag if you want to roll back the release.');
		if (typeof callback == 'function') callback.apply(this, arguments);
	});
});

gulp.task('permissions', function () {
	return gulp.src('dist/build/manifest.json')
		.pipe(manifest_urls({
				permission_urls: ['https://www.digipost.no/*', 'https://www.digipostdata.no/*'],
				content_script_urls: ['https://www.digipost.no/*']
			}))
		.pipe(gulp.dest('dist/build'));
});

gulp.task('default', taskListing);

function inc(importance) {
	return gulp.src(['extension/manifest.json'])
		// Bump version numbers in files with version
		.pipe(bump({type: importance}))
		.pipe(gulp.dest('./extension'))
		.pipe(git.commit('Released new version'))
		.pipe(tag_version());
}


/**
 * Overrides permission and matching URLs in manifest files to avoid publishing version with development URLs.
 */
function manifest_urls(options) {
	return through.obj(function (file, enc, cb) {
		var manifestJson = JSON.parse(file.contents.toString());

		manifestJson.permissions = manifestJson.permissions.filter(removeUrls).concat(options.permission_urls);

		if (manifestJson.content_scripts.length != 1) {
			return cb(new gutil.PluginError('gulpfile.js', 'We only support exactly one content script block.', {
				fileName: file.path,
				showStack: true
			}));
		}
		manifestJson.content_scripts[0].matches = manifestJson.content_scripts[0].matches.filter(removeUrls).concat(options.content_script_urls);

		file.contents = new Buffer(JSON.stringify(manifestJson, null, '  ') + '\n');

		gutil.log('Set permission URLs to  ' + gutil.colors.cyan(options.permission_urls.join(', ')) + ' and content script URLs to ' + gutil.colors.cyan(options.content_script_urls.join(', ')));
		return cb(null, file);
	});

	function removeUrls(item) {
		return item.indexOf('http://') == -1 && item.indexOf('https://') == -1
	}

}
