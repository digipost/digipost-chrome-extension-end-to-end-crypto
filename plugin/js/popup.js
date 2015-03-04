var errorField;
var keyDataField;

window.addEventListener('load', function() {
	sendMessage('hasKey?');
	click('setKeyButton', function() {
    sendMessage('setKey', keyDataField.value);
	});
	click('removeKeyButton', function() {
		sendMessage('removeKey');
	});

  keyDataField = document.getElementById('keydata');
  errorField = document.querySelector('.error');
}, false);

function click(id, callback) {
	document.getElementById(id).addEventListener('click', callback, false);
}

function toggle(hasKey) {
  if (hasKey) {
    keyDataField.value = '';
    hideError();
  }

	document.getElementById('hasKey').style.display   = hasKey ? 'block' : 'none';
	document.getElementById('needsKey').style.display = hasKey ? 'none' : 'block';
}

function showError(message) {
  errorField.innerText = message;
  errorField.classList.remove('hidden')
}

function hideError() {
  errorField.classList.add('hidden')
}

function sendMessage(message, data) {
	chrome.runtime.sendMessage({ to: 'background', message: message, data: data }, function(response) {
    if (response.error) {
      toggle(false);
      showError(response.error);
    }
		toggle(response.hasKey)
	});

}
