console.log("Loading content script...");

var s = document.createElement('script');
s.src = chrome.extension.getURL('js/override.js');
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);

var key = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQTIhiRjYqKPAp0YhhwbEkvK/+nMfmIjYVcrXheMUrzw56rzQY4txJvzyqyNx+2xZiau1NZS+i5Fx2OuuNSIAD3cGZkryGI/KluxssHB8EN0kU2upF4fLeTox1WXbyMbQmC3Gzmbjpm4tgv13zFDiZgHQh9yuZ7QMSorcazDA/7gVFbo5uMcipZX+NJF3lcoo611HYbHsiB7rA9p9UGOoDBrnVbBQfGZB61FaUfFPTGGw+7Ab2dpwEyzdxXykKCY/leo2W+CG/Q81K6IRnkZ/JB3xA2d9T4VUnnMWiAl6hmuzisfJwyuMHMx7B3BC2pXKn8LliYqa91Yn8e8m5kwifAgMBAAECggEBAIZOoq3DGc+rX9eG/EoUCvVmGJCyZI41xuujcDT2myO5OVvPtmbJeEKw5Rw1sT62Y0OIMIRz1vhQCHJPYWxSsABOLzOnkplnemB0OXwCkdk1EJE66k2u99txiE1uJyzY8ZCKVoD4gGtYWNFD8v72LdyEH916swln8lBEzI2h1QaSd4M1iRVKRe1DmSl+Nq1C8CAVE6n5YaFZ4InG1X9HGT2AWUQFcOWhAe8yYLdu7SvcHWfMWpkQ2TuwWoiJx9wsj89imX8gHUtCVZYy25FvpaMo6mmG0qQSPJHe3ECvrgyqOecrGpLc80Pe+gCCoTsx6zIQFSzKblX2M+/D0stN9xkCgYEA8gF+kI7hJntLOV2xb+24B7NhU49ckQE/nhsT/g+CcopwOvZBk1wCn7wM42uxQkBGeLJr+Urp295hlVlWiaj8KihmKoITQgLpApJExydkOHf3N03Jdk4Qn9pWZJbWTbTyhSc1Nviojwghuqe7tY/KLEBf1fV6bJb6lFy0H3n4XOsCgYEA3FgP+h+Ve7g2rBnyPCCWUOgU1wpPtyynEkKk6F2ryEDJ4FbgkEO2DgXrFBVnOGbP1eBe9hbUyVS61eRRuunsBeeeG6tq6hlZi3oP5atEK3N1XuG+DGZoTc2v8q2+VH7C0Lx391Fv+ZEyDrQDG9neUeWif38oHzPiFy43CPYJBh0CgYBzUl77h/qmmc5I8eriCYfOs55HcWOM/elQ8FpgkQd6iZndnwe0rv3ZHIWPwfvgNDzguzVUwGwciCY8QyxHwS0Y8dNtojqHFFfxD76SoKTTe+dkhT7hj2XApwzQNki9EuMWrI5hObEpJ5jbF58NcA3JdIu2q5nBMVkLZfm3ninKLQKBgHaJCU9NXmVIHGFJM/8UqMitkUh9y5SG+Pnh0EUQ3zDDada95eC2DGJO3L/ZI8Y7yOMN6QgKED6ezkPyp+UdolMq3uuTs9hr+rgF2jd7gxi87A828b5J+SKh3F15CkL6TmNsgD0UGmDvszYlsOZyth7oohpklXjzuFUwD3tKoGAhAoGBANT2NIb0tZaYSMNwyL/cS95S0yreIVij6MObl/0ZLTfU7fFnNefg3Lz5DcKpKJQWhK+FqT81IQqGVVKzw7OaeUCK43SQE4tM7IS1SYe3JeQy01D9aUM5tPrX2nwbH0xVgWNfoPxZLOhAKlXx0aRzDKhqcJJNEBB0nVkH4WXr5S7m";
var asn1pk = forge.asn1.fromDer(forge.util.decode64(key));
var privateKey = forge.pki.privateKeyFromAsn1(asn1pk);


function download(url) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = "arraybuffer";
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status !== 200) {
				return failed('Got wrong response ' + xhr.status);
			}
			var type = xhr.getResponseHeader('content-type');
			handleResponse(xhr.response, type);
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
}

function handleResponse(response, contentType) {
	var decrypted = decrypt(response);
	var unzipped = gzip.unzip(decrypted);
	var blobUrl = createBlob(unzipped, contentType);
	document.dispatchEvent(new CustomEvent('decrypted', { detail : { 
		url: blobUrl, 
		contentType: contentType 
	}}));	
}

function createBlob(decrypted, contentType) {
	var blob = new Blob( [ new Uint8Array(decrypted) ], { type: contentType } );
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
}
function stringToUint8Array(str) {
	var arr = new Uint8Array(str.length);
	for(var i=0,j=str.length;i<j;++i){
	  arr[i]=str.charCodeAt(i);
	}
	return arr;
}


function decrypt(response) {
	try {
		var buffer = forge.util.createBuffer(response);
		var asn1 = forge.asn1.fromDer(buffer);
		var message = forge.pkcs7.messageFromAsn1(asn1);
		message.decrypt(message.recipients[0], privateKey);
		return stringToUint8Array(message.content.data);
	} catch(e) { 
		console.log(e); 
	}
}

function failed(message) {
	document.dispatchEvent(new CustomEvent('failed', { detail : message } ));	
}

document.addEventListener('start', function(e, x){
	download(e.detail);
});




