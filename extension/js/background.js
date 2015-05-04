chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	"use strict";

	if (request.to !== 'background') {
		return;
	}
	if (request.message === 'hasKey?') {
		return sendResponse({hasKey: dp.private_key.hasKey()});
	}
	if (request.message === 'removeKey') {
		dp.private_key.removeKey();
		return sendResponse({hasKey: false});
	}
	if (request.message === 'setKey') {
		try {
			dp.private_key.setKey(request.data);

			// Notify all active tabs that the key has been added. We only want to message active tabs, to avoid magic feeling stuff from happening in the background.
			chrome.tabs.query({active: true}, function(tabs) {
				tabs.forEach(function(tab) {
					chrome.tabs.sendMessage(tab.id, {to: 'content_script', message: 'key_added'});
				});
			});


		} catch (e) {
			console.error('Klarte ikke å parse nøkkel', e);
			sendResponse({hasKey: false, error: 'Klarte ikke å laste inn nøkkel. Er du sikker på at den er på gyldig format?'});
		}

		return sendResponse({hasKey: dp.private_key.hasKey()});
	}
	if (request.message === 'decrypt') {
		var decryptedData = dp.private_key.decryptData(request.data);
		return sendResponse(decryptedData);
	}
});

