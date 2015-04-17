console.log("Overriding Digipost JavaScript functions");

(function() {

  "use strict";

  if (dp.url) {
    dp.url.real_normalize = dp.url.normalize;

    dp.url.normalize = function(url) {
      if (url.indexOf("blob:") === 0) {
        return url;
      }
      return dp.url.real_normalize(url);
    }
  }

  if (dp.embed) {
    dp.embed.real_html = dp.embed.html;
    dp.embed.html = function(options) {
      var options = options || {};
      options.sandbox = '';
      return dp.embed.real_html(options);
    }
  }

  if (dp.views.content) {
    dp.views.content.init_original = dp.views.content.init;

		/**
		 * Trap frontend calls to display contents. If the document is encrypted with a user key,
		 * dispatch an event to start downloading and decryption.
		 */
    dp.views.content.init = function() {
      if (!this.doc.data.userKeyEncrypted) {
        // Don't try to decrypt contents if original is not encrypted with user key. Call original content view function.
        return dp.views.content.init_original.apply(this, arguments);
      }

      var view = this;
      dp.spinner.show({ label: 'Laster ned dokument…' });
      document.addEventListener('downloaded', decrypt);
      document.addEventListener('decrypted', show);
      document.addEventListener('decryption-failed', failed);

			// Trigger the content script to start processing the encrypted document.
      document.dispatchEvent(new CustomEvent('processEncryptedDocument', {
					detail: {
						contentUri: this.doc.contentUri()
					}
			}));

      function decrypt(e) {
        document.removeEventListener('downloaded', decrypt);
        dp.spinner.hide();
        dp.spinner.show({ label: 'Dekrypterer dokument…' });
        document.dispatchEvent(new CustomEvent('decrypt', {
          detail: {
            data: e.detail.data,
            contentType: e.detail.contentType
          }
        }));
      }

			/**
			 * Show data as decrypted by the content script
			 */
      function show(data){
        dp.spinner.hide();
        document.removeEventListener('decrypted', show);
        view.doc.contentUri = function() {
          return data.detail.url;
        };
        view.imageUrl = view.doc.contentUri;
        dp.views.content.init_original.apply(view);
        dp.sizes.update($(".doc"));
        $(".meta h2 a").attr('href', data.detail.url);
        $("a[download]").attr('href', data.detail.url);
      }

      function failed(data) {
        dp.spinner.hide();
        dp.modal.show(data.detail.error);
      }
    };
  }

})();