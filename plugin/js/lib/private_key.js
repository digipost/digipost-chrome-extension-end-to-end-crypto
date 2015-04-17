window.dp = window.dp || {};
(function () {

	"use strict";

	/**
	 * The user submitted private key. Stored in a var within an anonymous block to avoid global availability.
	 */
	var privateKey = null;

	window.dp.private_key = {
		setKey: setKey,
		decryptData: decryptData,
		hasKey: hasKey,
		removeKey: removeKey
	};

	/**
	 * Decrypt a Base64 encoded DER ASN.1 decoded CMS message.
	 */
	function decryptData(data) {
		if (privateKey === null) {
			return {error: 'Privatnøkkel ikke lagt til. Trykk på Digipost-ikonet i adressebaren for å legge til'};
		}

		console.debug('Decrypting message using private key');
		try {
			return {data: decrypt(forge.util.binary.base64.decode(data))};
		} catch (e) {
			return {
				error: '<p>Klarte ikke dekryptere brevet med nøkkelen. Det kan skyldes at det er feil i datene fra avsender eller at du bruker feil nøkkel. ' +
				'Sjekk at du bruker privatnøkkel tilsvarende den offentlige nøkkelen du har lastet opp i Digipost.</p>' +
				'<p>Du kan fortsatt laste ned filen kryptert og forsøke å dekryptere den lokalt på din egen maskin.</p>'
			};
		}
	}

	function setKey(key) {
		var base64Key = stripOpenSSLBoundaries(key);

		var asn1pk = forge.asn1.fromDer(forge.util.decode64(base64Key), true);
		privateKey = forge.pki.privateKeyFromAsn1(asn1pk);
	}

	function hasKey() {
		return privateKey !== null;
	}

	function removeKey() {
		privateKey = null;
	}


	function decrypt(encryptedMessage) {
		var buffer = forge.util.createBuffer(encryptedMessage);
		var asn1 = forge.asn1.fromDer(buffer, true);
		var message = forge.pkcs7.messageFromAsn1(asn1);
		message.decrypt(message.recipients[0], privateKey);
		return message.content.data;
	}

	/**
	 * Removes boundaries and new lines typically used by OpenSSL when displaying keys.
	 */
	function stripOpenSSLBoundaries(key) {
		return key
			.replace(/\-{5}BEGIN RSA PRIVATE KEY\-{5}/g, '')
			.replace(/\-{5}END RSA PRIVATE KEY\-{5}/g, '')
			.replace(/\n/g, '');
	}

})();