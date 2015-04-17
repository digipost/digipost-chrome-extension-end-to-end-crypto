"use strict";

chrome.runtime.onInstalled.addListener(function () {
	try {
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
			chrome.declarativeContent.onPageChanged.addRules(generateRules());
		});
	} catch (e) {
		console.error('Klarte ikke å legge inn declarative content-regler', e);
	}

	/**
	 * Generate declarative content rules to show Digipost page action (dialog for adding and removing key)
	 * for the domains defined in the manifest.
	 *
	 * See https://developer.chrome.com/extensions/declarativeContent
	 */
	function generateRules() {
		var manifestDetails = chrome.app.getDetails();
		var hosts = manifestDetails.content_scripts[0].matches.map(function (m) {
			return m.split('//')[1].split('/')[0];
		});

		return hosts.map(function (hostspecifier) {
			var parts = hostspecifier.split(':');
			var matcher = {pageUrl: {hostEquals: parts[0], schemes: ['https']}};
			if (parts[1]) matcher.pageUrl.ports = [parseInt(parts[1], 10)];
			return {
				conditions: [
					new chrome.declarativeContent.PageStateMatcher(matcher)
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			};
		});
	}

});
