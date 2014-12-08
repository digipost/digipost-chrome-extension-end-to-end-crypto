function generateRules(hosts) {
	return hosts.map(function(hostspecifier) {
		var parts = hostspecifier.split(':');
		var matcher = { pageUrl: { hostEquals: parts[0], schemes: ['https'] } };
		if (parts[1]) matcher.pageUrl.ports = [ parseInt(parts[1], 10) ];
		console.log("Regel for: " + hostspecifier);
		return {
			conditions: [
				new chrome.declarativeContent.PageStateMatcher(matcher)
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		};
	});
}

chrome.runtime.onInstalled.addListener(function() {
	console.log("Installert...");
	try {
		console.log("Fjerner gamle regler...");
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
			chrome.declarativeContent.onPageChanged.addRules(generateRules(['www.digipost.no', 'www.digipostdata.no', 'localhost:9090' ]));
			console.log("Nye regler lagt til");
		});
	} catch(e) {
		console.log("Kunne ikke legge inn regler", e);
	}
});
