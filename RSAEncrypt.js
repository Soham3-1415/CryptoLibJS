const form  = document.getElementsByTagName('form')[0];
const pubKey = document.getElementById('pubkey');
const message = document.getElementById('message');
const ciphertext = document.getElementById('ciphertext');
form.addEventListener("submit", function (event) {
	event.preventDefault();
	const cipher = new RSA(pubKey.value);
	ciphertext.value = cipher.encrypt(message.value);
}, false);