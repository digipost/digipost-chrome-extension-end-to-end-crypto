window.addEventListener('load', function() {
	sendMessage('hasKey?');
	click('setKeyButton', function() {
		sendMessage('setKey', document.getElementById('keydata').value);
	});
	click('removeKeyButton', function() {
		sendMessage('removeKey');
	});

}, false);

function click(id, callback) {
	document.getElementById(id).addEventListener('click', callback, false);
}

function toggle(hasKey) {
	document.getElementById('hasKey').style.display   = hasKey ? 'block' : 'none';
	document.getElementById('needsKey').style.display = hasKey ? 'none' : 'block';
}

function sendMessage(message, data) {
	console.log('sender', message);
	chrome.runtime.sendMessage({ to: 'background', message: message, data: data }, function(response) {
		console.log('message', response);
		toggle(response.hasKey)
	});
}

