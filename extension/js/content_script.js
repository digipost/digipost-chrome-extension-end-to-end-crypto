(function () {

	"use strict";

	/**
	 * Load override script into the Digipost DOM. This allows it to hook into Digiposts frontend display logic.
	 */
	(function loadOverrideScript() {
		var overrideScript = document.createElement('script');
		overrideScript.src = chrome.extension.getURL('js/override.js');
		overrideScript.onload = function () {
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(overrideScript);
	})();

	/**
	 * Listen for event to start download and decryption of document.
	 */
	document.addEventListener('processEncryptedDocument', function (e) {
		download(e.detail.contentUri);
	});


	function download(url) {
		console.debug('Downloading document');
		console.time('Download');
		emit('downloading');

		var xhr = new XMLHttpRequest();

		// We want to buffer the entire response in an array for further processing (decryption)
		xhr.responseType = 'arraybuffer';

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				console.timeEnd('Download');
				if (xhr.status !== 200) {
					return failed('Got wrong response ' + xhr.status);
				}
				var contentType = xhr.getResponseHeader('content-type');

				decrypt(xhr.response, contentType);
			}
		};
		xhr.open('GET', url, true);
		xhr.send();
	}

	function decrypt(data, contentType) {
		console.time('Decrypt');
		emit('decrypting');

		// Delegate decryption to the background context which has access to the private key
		console.log('Initiating background decryption of document');
		chrome.runtime.sendMessage({
			to: 'background',
			message: 'decrypt',
			data: forge.util.binary.base64.encode(new Uint8Array(data))
		}, function (response) {
			console.timeEnd('Decrypt');
			if (response.error) {
				// Signal to the override script that decryption failed
				return emit('decryption-failed', {error: response.error});
			}
			handleDecrypted(stringToUint8Array(response.data), contentType);
		});
	}

	/**
	 * Perform any necessary processing of document before display and return an addressable blob
	 */
	function handleDecrypted(data, contentType) {
		if (contentType.indexOf('html') > 0) {
			data = prepareHtmlForDisplay(data);
		}
		var blobUrl = createBlob(data, contentType);

		// Signal to the override script that download and decryption completed successfully
		emit('decrypted', { url: blobUrl });
	}

	function prepareHtmlForDisplay(data) {
		var htmlString = uint8ArrayToString(data);
		var purified = DOMPurify.sanitize(htmlString, {WHOLE_DOCUMENT: true});
		var purifiedBytes = stringToUint8Array(purified);
		var purifiedBytesWithBomHeader = addBomHeader(purifiedBytes);
		return purifiedBytesWithBomHeader;
	}

	/**
	 * Add BOM (Byte Order Mark) header to uint8 array. This hints that the contents is UTF-8 encoded, so that it will later be rendered correct.
	 */
	function addBomHeader(uint8Array) {
		const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
		if (uint8Array[0] === bom[0] || uint8Array[1] === bom[1] || uint8Array[2] === bom[2]) {
			// Already contains BOM header
			return data;
		}

		var bomPrefixed = new Uint8Array(bom.byteLength + uint8Array.byteLength);
		bomPrefixed.set(bom, 0);
		bomPrefixed.set(uint8Array, bom.byteLength);
		return bomPrefixed;
	}


	/**
	 * Creates an addressable blob uri from the in memory array of decrypted data, which later can be embedded for displaying
	 * or linked for downloading.
	 */
	function createBlob(decrypted, contentType) {
		var blob = new Blob([new Uint8Array(decrypted)], {type: contentType});
		return (window.URL || window.webkitURL).createObjectURL(blob);
	}

	function uint8ArrayToString(data) {
		// Undefined this. fromCharCode is static, we only use apply because it accepts bytes as multiple arguments rather than array.
		return String.fromCharCode.apply(undefined, data);
	}

	function stringToUint8Array(str) {
		var arr = new Uint8Array(str.length);
		var j = str.length;
		for (var i = 0; i < j; ++i) {
			arr[i] = str.charCodeAt(i);
		}
		return arr;
	}


	function failed(message) {
		document.dispatchEvent(new CustomEvent('failed', {detail: message}));
	}

	/**
	 * Dispatches an event to the override script
	 */
	function emit(event, data) {
		document.dispatchEvent(new CustomEvent(event, {detail: data}));
	}

})();