var privateKey = null;

//Example keys for testing
/*var publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0EyIYkY2KijwKdGIYcGxJLyv/pzH5iI2FXK14XjFK88Oeq80GOLcSb88qsjcftsWYmrtTWUvouRcdjrrjUiAA93BmZK8hiPypbsbLBwfBDdJFNrqReHy3k6MdVl28jG0Jgtxs5m46ZuLYL9d8xQ4mYB0Ifcrme0DEqK3GswwP+4FRW6ObjHIqWV/jSRd5XKKOtdR2Gx7Ige6wPafVBjqAwa51WwUHxmQetRWlHxT0xhsPuwG9nacBMs3cV8pCgmP5XqNlvghv0PNSuiEZ5GfyQd8QNnfU+FVJ5zFogJeoZrs4rHycMrjBzMewdwQtqVyp/C5YmKmvdWJ/HvJuZMInwIDAQAB";
var key = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQTIhiRjYqKPAp0YhhwbEkvK/+nMfmIjYVcrXheMUrzw56rzQY4txJvzyqyNx+2xZiau1NZS+i5Fx2OuuNSIAD3cGZkryGI/KluxssHB8EN0kU2upF4fLeTox1WXbyMbQmC3Gzmbjpm4tgv13zFDiZgHQh9yuZ7QMSorcazDA/7gVFbo5uMcipZX+NJF3lcoo611HYbHsiB7rA9p9UGOoDBrnVbBQfGZB61FaUfFPTGGw+7Ab2dpwEyzdxXykKCY/leo2W+CG/Q81K6IRnkZ/JB3xA2d9T4VUnnMWiAl6hmuzisfJwyuMHMx7B3BC2pXKn8LliYqa91Yn8e8m5kwifAgMBAAECggEBAIZOoq3DGc+rX9eG/EoUCvVmGJCyZI41xuujcDT2myO5OVvPtmbJeEKw5Rw1sT62Y0OIMIRz1vhQCHJPYWxSsABOLzOnkplnemB0OXwCkdk1EJE66k2u99txiE1uJyzY8ZCKVoD4gGtYWNFD8v72LdyEH916swln8lBEzI2h1QaSd4M1iRVKRe1DmSl+Nq1C8CAVE6n5YaFZ4InG1X9HGT2AWUQFcOWhAe8yYLdu7SvcHWfMWpkQ2TuwWoiJx9wsj89imX8gHUtCVZYy25FvpaMo6mmG0qQSPJHe3ECvrgyqOecrGpLc80Pe+gCCoTsx6zIQFSzKblX2M+/D0stN9xkCgYEA8gF+kI7hJntLOV2xb+24B7NhU49ckQE/nhsT/g+CcopwOvZBk1wCn7wM42uxQkBGeLJr+Urp295hlVlWiaj8KihmKoITQgLpApJExydkOHf3N03Jdk4Qn9pWZJbWTbTyhSc1Nviojwghuqe7tY/KLEBf1fV6bJb6lFy0H3n4XOsCgYEA3FgP+h+Ve7g2rBnyPCCWUOgU1wpPtyynEkKk6F2ryEDJ4FbgkEO2DgXrFBVnOGbP1eBe9hbUyVS61eRRuunsBeeeG6tq6hlZi3oP5atEK3N1XuG+DGZoTc2v8q2+VH7C0Lx391Fv+ZEyDrQDG9neUeWif38oHzPiFy43CPYJBh0CgYBzUl77h/qmmc5I8eriCYfOs55HcWOM/elQ8FpgkQd6iZndnwe0rv3ZHIWPwfvgNDzguzVUwGwciCY8QyxHwS0Y8dNtojqHFFfxD76SoKTTe+dkhT7hj2XApwzQNki9EuMWrI5hObEpJ5jbF58NcA3JdIu2q5nBMVkLZfm3ninKLQKBgHaJCU9NXmVIHGFJM/8UqMitkUh9y5SG+Pnh0EUQ3zDDada95eC2DGJO3L/ZI8Y7yOMN6QgKED6ezkPyp+UdolMq3uuTs9hr+rgF2jd7gxi87A828b5J+SKh3F15CkL6TmNsgD0UGmDvszYlsOZyth7oohpklXjzuFUwD3tKoGAhAoGBANT2NIb0tZaYSMNwyL/cS95S0yreIVij6MObl/0ZLTfU7fFnNefg3Lz5DcKpKJQWhK+FqT81IQqGVVKzw7OaeUCK43SQE4tM7IS1SYe3JeQy01D9aUM5tPrX2nwbH0xVgWNfoPxZLOhAKlXx0aRzDKhqcJJNEBB0nVkH4WXr5S7m";
var asn1pk = forge.asn1.fromDer(forge.util.decode64(key));
var privateKey = forge.pki.privateKeyFromAsn1(asn1pk);
*/

function generateRules(hosts) {
	return hosts.map(function(hostspecifier) {
		var parts = hostspecifier.split(':');
		var matcher = { pageUrl: { hostEquals: parts[0], schemes: ['https'] } };
		if (parts[1]) matcher.pageUrl.ports = [ parseInt(parts[1], 10) ];
		console.log('Regel for: ' + hostspecifier);
		return {
			conditions: [
				new chrome.declarativeContent.PageStateMatcher(matcher)
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		};
	});
}

var manifestDetails = chrome.app.getDetails();
var hosts = manifestDetails.content_scripts[0].matches.map(function(m) {
	return m.split('//')[1].split('/')[0];
});

chrome.runtime.onInstalled.addListener(function() {
	console.log('Installert...');
	try {
		console.log('Fjerner gamle regler...');
		chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
			chrome.declarativeContent.onPageChanged.addRules(generateRules(hosts));
			console.log('Nye regler lagt til');
		});
	} catch(e) {
		console.log('Kunne ikke legge inn regler', e);
	}
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.to !== 'background') {
		return;
	}
	if (request.message === 'hasKey?') {
		return sendResponse({ hasKey : privateKey !== null });
	}
	if (request.message === 'removeKey') {
		privateKey = null;
		return sendResponse({ hasKey : false });
	}
	if (request.message === 'setKey') {
		setKey(request.data);
		return sendResponse({ hasKey : privateKey !== null });
	}
	if (request.message === 'decrypt') {
		return sendResponse(decryptData(request.data));
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

function decryptData(data) {
	if (privateKey !== null) {
		try {
			return { data: decrypt(forge.util.binary.base64.decode(data)) };
		} catch(e) {
			return { error: 'Kan ikke dekryptere med den angitte nøkkelen. Feil i data eller feil nøkkel' };
		}
	} else {
		return { error: 'Privatnøkkel ikke lagt til. Trykk på Digipost-ikonet i adressebaren for å legge til' };
	}
}

function decrypt(response) {
	var buffer = forge.util.createBuffer(response);
	var asn1 = forge.asn1.fromDer(buffer);
	var message = forge.pkcs7.messageFromAsn1(asn1);
	message.decrypt(message.recipients[0], privateKey);
	return message.content.data;
}

function setKey(key) {
	var base64Key = stripOpenSSLBoundaries(key);

	var asn1pk = forge.asn1.fromDer(forge.util.decode64(base64Key));
	privateKey = forge.pki.privateKeyFromAsn1(asn1pk);
}

function stripOpenSSLBoundaries(key) {
	return key
			.replace(/\-{5}BEGIN RSA PRIVATE KEY\-{5}/g, '')
			.replace(/\-{5}END RSA PRIVATE KEY\-{5}/g, '')
			.replace(/\n/g, '');
}
