"use strict";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.to !== 'background') {
		return;
	}
	if (request.message === 'hasKey?') {
		return sendResponse({ hasKey : dp.key_storage.hasKey() });
	}
	if (request.message === 'removeKey') {
    dp.key_storage.removeKey();
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


