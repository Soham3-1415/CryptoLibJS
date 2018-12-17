const form  = document.getElementsByTagName('form')[0];
const privKey = document.getElementById('privkey');
const message = document.getElementById('message');
const ciphertext = document.getElementById('ciphertext');
form.addEventListener("submit", function (event) {
	event.preventDefault();
	const cipher = new RSA(privKey.value);
	message.value = cipher.decrypt(ciphertext.value);
}, false);