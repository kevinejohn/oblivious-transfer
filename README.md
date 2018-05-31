# Oblivious Transfer

[![NPM Package](https://img.shields.io/npm/v/oblivious-transfer.svg?style=flat-square)](https://www.npmjs.org/package/oblivious-transfer)

## Use

`npm install --save oblivious-transfer`

```
const OT = require('oblivious-transfer');

const Message1 = 'Alice did it';
const Message2 = 'Bob did it';
const Choice = 0; // 0 or 1

const Alice = OT.aliceInit();
const Bob = OT.bobInit({
  E: Alice.E,
  N: Alice.N,
  Alice: Alice.Alice,
  Choice,
});
const Encrypted = OT.aliceEncrypt({
  ...Alice,
  Bob: Bob.Bob,
  Message1,
  Message2,
});
const Decrypted = OT.bobDecrypt({
  ...Bob,
  Encrypted,
});
Decrypted.map(obj => console.log(OT.hex2a(obj)));

assert(Decrypted[0] === Message1)
assert(Decrypted[1] !== Message2)
```

## Tests

```
npm test
```
