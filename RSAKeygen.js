document.addEventListener('DOMContentLoaded', function() {
	const elems = document.querySelectorAll('select');
	const instances = M.FormSelect.init(elems, {});
});

const form  = document.getElementsByTagName('form')[0];
const bits = document.getElementById('bits');
const pubKey = document.getElementById('pubkey');
const privKey = document.getElementById('privkey');
const output = document.getElementById('output');
form.addEventListener("submit", function (event) {
	event.preventDefault();
	output.style.display = "block";
	const keypair = RSA.keyGen(bits.value);
	privKey.value = keypair[0];
	pubKey.value = keypair[1];
}, false);