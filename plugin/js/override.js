console.log("Injecting...");
dp.embed.normalize = function(url) { return url; };

if (dp.views.content) {
	dp.views.content.oldInit = dp.views.content.init;
	dp.views.content.init = function() {
		var view = this;
		document.addEventListener('decrypted', process);
		
		function process(data){
			document.removeEventListener('decrypted', process);
			view.doc.contentUri = function() {
				return data.detail.url;
			};
			view.imageUrl = view.doc.contentUri;
			dp.views.content.oldInit.apply(view);
		}

		document.dispatchEvent(new CustomEvent('start', { detail: this.doc.contentUri() } ));
	};
	console.log("Injected...");
}

