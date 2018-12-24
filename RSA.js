class RSA {
	constructor(keyPart1, keyPart2) {
		if(keyPart2 !== undefined)
			if (JSON.parse(atob(keyPart2)).e === undefined)
				this.d = JSON.parse(atob(keyPart2)).d;
			else
				this.e = JSON.parse(atob(keyPart2)).e;
		if(JSON.parse(atob(keyPart1)).e === undefined)
			this.d = JSON.parse(atob(keyPart1)).d;
		else
			this.e = JSON.parse(atob(keyPart1)).e;
		this.n = JSON.parse(atob(keyPart1)).n;
	}

	get privKey() {
		return btoa(JSON.stringify({d:this.d,n:this.n}));
	}

	set privKey(key) {
		this.d = JSON.parse(atob(key)).d;
		this.n = JSON.parse(atob(key)).n;
	}

	get pubKey() {
		return btoa(JSON.stringify({e:this.e,n:this.n}));
	}

	set pubKey(key) {
		this.e = JSON.parse(atob(key)).e;
		this.n = JSON.parse(atob(key)).n;
	}

	encrypt(message){
		const messageEncoded = bigInt(btoa(message).replace(/[=]/g, ""),64,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",true);
		const messageEncrypted = messageEncoded.modPow(this.e,this.n);
		return messageEncrypted.toString(64,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
	}

	decrypt(ciphertext){
		const ciphertextEncoded = bigInt(ciphertext.replace(/[=]/g, ""),64,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",true);
		const ciphertextDecrypted = ciphertextEncoded.modPow(this.d,this.n);
		return atob(ciphertextDecrypted.toString(64,"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"));
	}

	static keyGen(bits) {
		const intArray = new Uint32Array(bits/32);
		window.crypto.getRandomValues(intArray);
		let randBin1 = "";
		let randBin2 = "";
		for(let i = 0; i < intArray.length/2; i++)
			randBin1 += this.intToBinaryStringFixedWidth(intArray[i],32);
		for(let i = intArray.length/2; i < intArray.length; i++)
			randBin2 += this.intToBinaryStringFixedWidth(intArray[i],32);
		randBin1 = randBin1.replace(/.$/,"1");
		randBin2 = randBin2.replace(/.$/,"1");
		let randInt1 = bigInt(randBin1,2);
		let randInt2 = bigInt(randBin2,2);
		while(!randInt1.isProbablePrime(1) || !randInt1.isPrime()/*|| !randInt1.subtract(1).divide(2).isProbablePrime(1)*/)//dont bother with safe primes
			randInt1 = randInt1.add(2);
		while(!randInt2.isProbablePrime(1) || !randInt2.isPrime() /*|| !randInt2.subtract(1).divide(2).isPrime()*/)//dont bother with safe primes
			randInt2 = randInt2.add(2);
		const p = randInt1;
		const q = randInt2;
		const n = p.multiply(q);
		const ctf = bigInt.lcm(p.subtract(1),q.subtract(1));
		let eTest = bigInt(65537);
		while(bigInt.gcd(eTest,ctf).compare(1) !== 0)
			eTest = eTest.add(2);
		const e = eTest;
		const d = e.modInv(ctf);
		const privateKey = {n:n,d:d};
		const publicKey = {n:n,e:e};
		const keypair = [];
		keypair.push(btoa(JSON.stringify(privateKey)));
		keypair.push(btoa(JSON.stringify(publicKey)));
		return keypair;
	}

	static intToBinaryStringFixedWidth (int,length) {
		let binaryString = this.intToBinaryString(int);
		let binaryStringPad = "";
		for(let i=0; i < length - binaryString.length; i++)
			binaryStringPad = "0" + binaryStringPad;
		return binaryStringPad + binaryString;
	};

	static intToBinaryString (int) {
		if(int === 0) return "";
		let digit = int % 2;
		return "" + this.intToBinaryString(Math.floor(int/2)) + digit;
	};
}