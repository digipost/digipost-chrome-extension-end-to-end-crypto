console.log("Injecting...");
dp.embed.normalize_original = dp.embed.normalize;
dp.embed.normalize = function(url) { 
	if (url.indexOf("blob:") === 0) {
		return url;
	}
	return dp.embed.normalize_original(url);
};

if (dp.views.content) {
	dp.views.content.init_original = dp.views.content.init;
	dp.views.content.init = function() {
		var view = this;
		document.addEventListener('decrypted', process);
		
		function process(data){
			document.removeEventListener('decrypted', process);
			view.doc.contentUri = function() {
				return data.detail.url;
			};
			view.imageUrl = view.doc.contentUri;
			dp.views.content.init_original.apply(view);
		}

		document.dispatchEvent(new CustomEvent('start', { detail: this.doc.contentUri() } ));
	};
	console.log("Injected...");
}

