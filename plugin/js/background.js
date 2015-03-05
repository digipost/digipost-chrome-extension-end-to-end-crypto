var manifestDetails = chrome.app.getDetails();
var hosts = manifestDetails.content_scripts[0].matches.map(function(m) {
	return m.split('//')[1].split('/')[0];
});

chrome.runtime.onInstalled.addListener(function() {
	console.log('Installert...');
	try {
		console.log('Fjerner gamle regler...');
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
			chrome.declarativeContent.onPageChanged.addRules(generateRules(hosts));
			console.log('Nye regler lagt til');
		});
	} catch(e) {
		console.log('Kunne ikke legge inn regler', e);
	}
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.to !== 'background') {
		return;
	}
	if (request.message === 'hasKey?') {
		return sendResponse({ hasKey : dp.key_storage.hasKey() });
	}
	if (request.message === 'removeKey') {
		privateKey = null;
		return sendResponse({ hasKey : false });
	}
	if (request.message === 'setKey') {
    try {
      dp.key_storage.setKey(request.data);
    } catch (e) {
      console.error('Klarte ikke å parse nøkkel', e);
      sendResponse({ hasKey: false, error: 'Klarte ikke å laste inn nøkkel' });
    }

		return sendResponse({ hasKey : dp.key_storage.hasKey() });
	}
	if (request.message === 'decrypt') {
		return sendResponse(dp.key_storage.decryptData(request.data));
	}
	if (request.message === 'blob') {
		return sendResponse({ url: createBlob(request.data, request.contentType) });
	}
});

function createBlob(decrypted, contentType) {
	var blob = new Blob( [ new Uint8Array(decrypted) ], { type: contentType } );
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
}

function generateRules(hosts) {
  return hosts.map(function(hostspecifier) {
    var parts = hostspecifier.split(':');
    var matcher = { pageUrl: { hostEquals: parts[0], schemes: ['https'] } };
    if (parts[1]) matcher.pageUrl.ports = [ parseInt(parts[1], 10) ];
    console.log('Regel for: ' + hostspecifier);
    return {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher(matcher)
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    };
  });
}
