(function () {

	"use strict";

	console.log('Overriding Digipost JavaScript functions');

	/**
	 * View where we will show the document once decryption is done.
	 */
	var activeContentView;

	overrideDigipostJavascriptFunctions();

	document.addEventListener('downloading', showDownloadSpinner);
	document.addEventListener('decrypting', showDecryptionSpinner);
	document.addEventListener('decrypted', hideSpinner);
	document.addEventListener('decrypted', showDecryptedDocument);
	document.addEventListener('decryption-failed', hideSpinner);
	document.addEventListener('decryption-failed', showEncryptionFailedError);

	function showDecryptionSpinner() {
		hideSpinner();
		dp.spinner.show({label: 'Dekrypterer dokument…'});
	}

	function showDownloadSpinner() {
		hideSpinner();
		dp.spinner.show({label: 'Laster ned dokument…'});
	}

	function hideSpinner() {
		dp.spinner.hide();
	}

	/**
	 * Show data as decrypted by the content script
	 */
	function showDecryptedDocument(data) {
		activeContentView.doc.contentUri = function () {
			return data.detail.url;
		};
		activeContentView.imageUrl = activeContentView.doc.contentUri;
		dp.views.content.init_original.apply(activeContentView);
		dp.sizes.update($('.doc'));
		$('.meta h2 a').attr('href', data.detail.url);
		$('a[download]').attr('href', data.detail.url);
	}

	function showEncryptionFailedError(e) {
		dp.modal.show(e.detail.error);
	}

	/**
	 * Override Javascript functions in Digipost frontend code to be able to hook into display logic to decrypt documents in the browser.
	 */
	function overrideDigipostJavascriptFunctions() {
		/**
		 * Prevent normalization of data URLs. These are browser generated URLs to access Javascript in-memory resources, and should never be modified.
		 */
		if (dp.url) {
			dp.url.real_normalize = dp.url.normalize;
			dp.url.normalize = function (url) {
				if (url.indexOf('blob:') === 0) {
					return url;
				}
				return dp.url.real_normalize(url);
			}
		}

		/**
		 * Override embed function to always set the sandbox attribute of the content iframe to an empty string.
		 * Empty string sandbox attribute enables all sandbox restrictions for the iframe, i.e. content is treated as NOT same origin,
		 * even though its URL is same origin as the parent page. This is important as data URLs (blobs) are same origin as the parent page.
		 */
		if (dp.embed) {
			dp.embed.real_html = dp.embed.html;
			dp.embed.html = function (options) {
				options = options || {};
				options.sandbox = '';
				return dp.embed.real_html(options);
			}
		}

		/**
		 * Trap frontend calls to display contents. If the document is encrypted with a user key,
		 * dispatch an event to start downloading and decryption.
		 */
		if (dp.views.content) {
			dp.views.content.init_original = dp.views.content.init;
			dp.views.content.init = function () {
				if (!this.doc.data.userKeyEncrypted) {
					// Don't try to decrypt contents if original is not encrypted with user key. Call original content view function.
					return dp.views.content.init_original.apply(this, arguments);
				}
				activeContentView = this;

				// Trigger the content script to start processing the encrypted document.
				emit('processEncryptedDocument', {contentUri: this.doc.contentUri()});
			};
		}
	}

	/**
	 * Dispatches an event to the content script
	 */
	function emit(event, data) {
		document.dispatchEvent(new CustomEvent(event, {detail: data}));
	}

})();