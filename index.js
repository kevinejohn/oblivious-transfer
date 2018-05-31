// Need to set navigator and window for Node.js
navigator = typeof navigator === 'undefined' ? {} : navigator;
window = typeof window === 'undefined' ? {} : window;
const JSEncrypt = require('jsencrypt').default;

const randomBytes = require('randombytes');
const BigInteger = require('jsbn').BigInteger;
const sha256 = require('js-sha256');
const aesjs = require('aes-js');
const Buffer = require('buffer/').Buffer;

function generateKey() {
  const key = new JSEncrypt();
  key.getPublicKey();
  return key;
}
function a2hex(str) {
  return new Buffer(str, 'utf8').toString('hex');
}
function hex2a(hex) {
  return new Buffer(hex, 'hex').toString('utf8');
}

function aliceInit() {
  const key = generateKey();
  const Alice = {
    E: new BigInteger(key.key.e.toString()),
    N: new BigInteger(key.key.n.toString()),
    Secret: new BigInteger(randomBytes(32)),
  };
  Alice.Alice = Alice.E.modPow(Alice.Secret, Alice.N);
  return Alice;
}

function bobInit({ E, N, Alice, Choice }) {
  if (!E || !N || !Alice || typeof Choice !== 'number') {
    throw new Error(`Missing parameters`);
  }
  const Bob = {
    E: new BigInteger(E.toString()),
    N: new BigInteger(N.toString()),
    Alice: new BigInteger(Alice.toString()),
    Secret: new BigInteger(randomBytes(32)),
  };
  if (Choice === 0) {
    Bob.Bob = Bob.E.modPow(Bob.Secret, Bob.N);
  } else {
    Bob.Bob = Bob.Alice.multiply(Bob.E.modPow(Bob.Secret, Bob.N));
  }
  return Bob;
}

function aliceEncrypt({ Bob, Secret, N, Alice, Message1, Message2 }) {
  if (!N || !Bob || !Secret || !Alice || !Message1 || !Message2) {
    throw new Error(`Missing parameters`);
  }
  const key1 = sha256(Bob.modPow(Secret, N).toString());
  const key2 = sha256(
    Bob.divide(Alice)
      .modPow(Secret, N)
      .toString()
  );

  const aesKeyArray = aesjs.utils.hex.toBytes(key1);
  const textBytes = aesjs.utils.hex.toBytes(a2hex(Message1));
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyArray);
  const encrypted1 = aesCtr.encrypt(textBytes);

  const aesKeyArray2 = aesjs.utils.hex.toBytes(key2);
  const textBytes2 = aesjs.utils.hex.toBytes(a2hex(Message2));
  const aesCtr2 = new aesjs.ModeOfOperation.ctr(aesKeyArray2);
  const encrypted2 = aesCtr2.encrypt(textBytes2);

  return [encrypted1, encrypted2];
}

function bobDecrypt({ Secret, N, Alice, Encrypted }) {
  if (!N || !Secret || !Alice || !Encrypted) {
    throw new Error(`Missing parameters`);
  }
  const bobKey = sha256(Alice.modPow(Secret, N).toString());

  const decryptedArray = Encrypted.map(enc => {
    const aesKeyArray = aesjs.utils.hex.toBytes(bobKey);
    const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyArray);
    const decryptedBytes = aesCtr.decrypt(enc);
    const decrypted = aesjs.utils.hex.fromBytes(decryptedBytes);
    // console.log(hex2a(decrypted));
    return decrypted;
  })
  return decryptedArray;
}

module.exports = {
  generateKey,
  hex2a,
  a2hex,
  aliceInit,
  aliceEncrypt,
  bobInit,
  bobDecrypt,
}
