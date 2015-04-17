"use strict";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.to !== 'background') {
		return;
	}
	if (request.message === 'hasKey?') {
		return sendResponse({ hasKey : dp.private_key.hasKey() });
	}
	if (request.message === 'removeKey') {
    dp.private_key.removeKey();
		return sendResponse({ hasKey : false });
	}
	if (request.message === 'setKey') {
    try {
      dp.private_key.setKey(request.data);
    } catch (e) {
      console.error('Klarte ikke å parse nøkkel', e);
      sendResponse({ hasKey: false, error: 'Klarte ikke å laste inn nøkkel' });
    }

		return sendResponse({ hasKey : dp.private_key.hasKey() });
	}
	if (request.message === 'decrypt') {
		var decryptedData = dp.private_key.decryptData(request.data);
		return sendResponse(decryptedData);
	}
});

