console.log("Injecting...");

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
	dp.views.content.init = function() {
		var view = this;
		dp.spinner.show();
		document.addEventListener('decrypted', process);
		document.addEventListener('decryption-failed', failed);
		
		function process(data){
			dp.spinner.hide();
			document.removeEventListener('decrypted', process);
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
			console.log(data);
			dp.spinner.hide();
			dp.modal.show(data.detail.error);
		}
		document.dispatchEvent(new CustomEvent('start', { detail: this.doc.contentUri() } ));
	};
	console.log("Injected...");
}

