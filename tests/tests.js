const test = require('tape');
const OT = require('../index');

const Message1 = 'Alice did it';
const Message2 = 'Bob did it';

test('1 Test Oblivious Transfer', t => {
  t.plan(2);

  const Choice = 0;
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
  // Decrypted.map(obj => console.log(OT.hex2a(obj)));

  t.equal(OT.hex2a(Decrypted[0]), Message1);
  t.notEqual(OT.hex2a(Decrypted[1]), Message2);
  t.end();
});

test('2 Test Oblivious Transfer', t => {
  t.plan(2);

  const Choice = 1;
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
  // Decrypted.map(obj => console.log(OT.hex2a(obj)));

  t.notEqual(OT.hex2a(Decrypted[0]), Message1);
  t.equal(OT.hex2a(Decrypted[1]), Message2);
  t.end();
});
