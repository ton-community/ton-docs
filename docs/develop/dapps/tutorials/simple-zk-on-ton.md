# Simple Zero-Knowledge project on TON

Welcome to the simple Zero-Knowledge project on TON tutorial. In this tutorial, we will learn about Zero-Knowledge proofs and how to use them in TON.

## 👋 Introduction

**Zero-knowledge** proofs are a fundamental cryptographic primitive that allows one party (the prover) to prove to another (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself. Zero-knowledge proofs are a powerful tool for building privacy-preserving systems, and have been used in a variety of applications, including anonymous payments, anonymous messaging, and trustless-bridges.

:::tip TVM June 2023 update
Before June 2023 it wasn't possible to verify proofs on TON. Due to complex computation behind the pairing algorithm, we needed TVM Opcodes for these operation which were added in [June 2023 update](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381)(Only available on testnet for now).
:::

## 🦄 What you will learn
1. You will learn about ZK and specifically zk-SNARK(Zero-knowledge Succinct Non-Interactive ARgument of Knowledge)
2. You will learn to do a trusted setup ceremony(Powers of Tau)
3. You will write and compile a simple ZK circuit(Circom language)
4. You will generate and deploy and test a FunC contract to verify a sample ZK proof


## 🟥🟦 Prove that you can see colors!

Before we dig into the details of ZK, let's start with a simple problem. Suppose you want to prove to a color-blind person that you can see colors. We can have an interactive solution for this problem. 
Assume the color-blind person (the verifier) finds two identical pieces of paper one is 🟥 and one is 🟦. 

The verifier shows one of the pieces of paper to you (the prover) and asks you to remember this color. Then the verifier will bring the paper behind himself and either change the paper or keep it the same and ask you to tell him if the color has changed or not. If you can tell the difference, then you can see colors(or you were just lucky, 50% chance of saying right answer).

Now if the verifier do this 10 times, and you can tell the difference every time, then the verifier will be convinced ~99.90234% (1 - (1/2)^10) that you can see colors.
And if the verifier do this 30 times, then the verifier will be 99.99999990686774% (1 - (1/2)^30) convinced that you can see colors.

But this is an interactive solution, and we can't have a DAppthat ask user to send 30 transactions to prove some claim! So we need a non-interactive solution. And this is where Zk-SNARKs and STARKs come in.

We will only cover Zk-SNARK in this tutorial, but you can read more about STARKs [here](https://starkware.co/stark/) and the comparison between Zk-SNARK and STARK [here](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).

### 🎯 Zk-SNARK: Zero-knowledge Succinct Non-Interactive ARgument of Knowledge

Zk-SNARK is a non-interactive proof system where the prover can prove to the verifier that a statement is true by just submitting one proof. And the verifier can verify the proof in a very short time.

Zk-SNARK consists of three phases: 
* Conducting trusted setup by [MPC](https://en.wikipedia.org/wiki/Secure_multi-party_computation) protocol to generate proving and verification keys (Powers of TAU)
* generating proof by prover using prover key, public input, and secret input (witness)
* and verifying the proof


Let's set up our development environment and start coding!

## ⚙ Setup development environment
Let's start by creating an empty [blueprint](https://github.com/ton-org/blueprint) project

1. Create new project using blueprint and then enter a name for your contract (e.g. ZkSimple) and then choose 1st option (simple contract)
```bash 
npm create ton@latest simple-zk
```
2. Now we need to clone the [snarkjs repo](https://github.com/kroist/snarkjs) that is adjusted to support FunC contracts
```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Install required libraries for ZkSNARK
```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```


4. Add this section to package.json(Some of the opcodes that we will use are not available in the mainnet release yet)
```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Also we need to change the version of `@ton-community/sandbox` to be able to use [latest TVM updates](https://t.me/thetontech/56)
```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```



Great! Now we are ready to start writing our first ZK project on TON!

We currently have two main folders in our project:
* `simple-zk` folder: contains our blueprint template, and it's where we will write our circuit and contracts and tests(always stay in this folder)
* `snarkjs` folder: contains the snarkjs repo that we cloned in step 2

## Circom circuit

Firstly let's create a file in `simple-zk/circuits` folder called `test.circom`, and add this code to it:
```circom
template Multiplier() {
   signal private input a;
   signal private input b;
   //private input means that this input is not public and will not be revealed in the proof

   signal output c;

   c <== a*b;
 }

component main = Multiplier();
```

This is a simple multiplier circuit. Using this circuit we can prove that we know two numbers that when multiplied together, the result is a specific number(c). Without revealing the numbers(a and b) themselves.

You can read more about circom language [here](https://docs.circom.io/).

Then let's make a folder for our build files and move there:
```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Trusted setup (Powers of TAU)
It's time to perform a trusted setup. For this, we will use [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) method
(it will probably take a few minutes to finish):
```bash
echo 'prepare phase1'
node ../../../snarkjs/build/cli.cjs powersoftau new bls12-381 14 pot14_0000.ptau -v
echo 'contribute phase1 first'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v -e="some random text"
echo 'contribute phase1 second'
node ../../../snarkjs/build/cli.cjs powersoftau contribute pot14_0001.ptau pot14_0002.ptau --name="Second contribution" -v -e="some random text"
echo 'apply a random beacon'
node ../../../snarkjs/build/cli.cjs powersoftau beacon pot14_0002.ptau pot14_beacon.ptau 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"
echo 'prepare phase2'
node ../../../snarkjs/build/cli.cjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v
echo 'Verify the final ptau'
node ../../../snarkjs/build/cli.cjs powersoftau verify pot14_final.ptau
```

This will create `pot14_final.ptau` file in the `build/circuits` folder which we can use for any circuits that we will write any future.


:::caution Constraint size
If you write a more complex circuit with more constraints you'll have to generate your PTAU setup with bigger parameter.
:::


You can remove the unnecessary files:
```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 Compile circuit

Now let's compile the circuit(be sure to run this command from `build/circuits` folder)
```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

Now we have our circuit compiled to `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs` and `build/circuits/circuit.wasm` files.

:::info altbn-128 and bls12-381 curves
These are the curves that are currently supported by snarkjs. On Ethereum, the [altbn-128](https://eips.ethereum.org/EIPS/eip-197) curve is only supported, but on TON only bls12-381 curve is supported.
:::

Let's check the constraint size of our circuit:
```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

As a result, we should get:
```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Now we can generate the reference zkey
```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Let's add a contribution to the zkey
```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Let's export the final zkey
```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

Now we have our final zkey in `build/circuits/circuit_final.zkey` file. We can verify it:
```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

It's time to generate the verification key
```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

You can remove the unnecessary files:
```bash
rm circuit_0000.zkey circuit_0001.zkey
```


`build/circuits` folder should look like this:
```
build
└── circuits
        ├── circuit_final.zkey
        ├── circuit.r1cs
        ├── circuit.sym
        ├── circuit.wasm
        ├── pot14_final.ptau
        └── verification_key.json

```
### ✅ Export Verifier Contract
Final step in this section is to generate the FunC verifier contract which we will use in our project.
```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
``` 

`verifier.fc` file will be generated in `contracts` folder.


## 🚢 Deploying Verifier Contract

Take a look at `contracts/verifier.fc` file. It contains the magic of ZK-SNARKs. Let's review it line by line.

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

These are the constants that verifier contract needs to use in proof verifying. These parameters can be found in `build/circuits/verification_key.json` file.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```
These lines are the new [TVM Opcodes](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#bls12-381)(BLS12-381) that make the pairing check feasible on the TON blockchain.

The `load_data` and `save_data` functions which is here just used to load and save the result of proof check(only for test purposes).
```func
() load_data() impure {

    var ds = get_data().begin_parse();

    ctx_res = ds~load_uint(32);

    ds.end_parse();
}

() save_data() impure {
    set_data(
            begin_cell()
                    .store_uint(ctx_res, 32)
                    .end_cell()
    );
}
```


Then there are some simple util functions that is used to load the proof data sent to the contract.

```func
(slice, slice) load_p1(slice body) impure {
    ...
}

(slice, slice) load_p2(slice body) impure {
    ...
}

(slice, int) load_newint(slice body) impure {
    ...
}
```

And the last part is the `groth16Verify` function which check the proof sent to the contract.
```func
() groth16Verify(
        slice pi_a,
        slice pi_b,
        slice pi_c,

        int pubInput0

) impure {

    slice cpub = bls_g1_multiexp(

            IC1, pubInput0,

            1
    );


    cpub = bls_g1_add(cpub, IC0);
    slice pi_a_neg = bls_g1_neg(pi_a);
    int a = bls_pairing(
            cpub, vk_gamma_2,
            pi_a_neg, pi_b,
            pi_c, vk_delta_2,
            vk_alpha_1, vk_beta_2,
            4);
    ;; ctx_res = a;
    if (a == 0) {
        ctx_res = 0;
    } else {
        ctx_res = 1;
    }
    save_data();
}
```

Now we need to edit the two files in `wrappers` folder. First is `ZkSimple.compile.ts` file(if you set another name in the step 1, this name is different). We need to put the `verifier.fc` file in the list of contracts to compile.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

And the other file is `ZkSimple.ts`. We need to first add the opcode of `verify` to the `Opcodes` enum:
```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

And then we need to add the `sendVerify` function to the `ZkSimple` class. This function will be used to send the proof to the contract and test it. The function is like this:
```ts
async sendVerify(
  provider: ContractProvider,
  via: Sender,
  opts: {
  pi_a: Buffer;
  pi_b: Buffer;
  pi_c: Buffer;
  pubInputs: bigint[];
  value: bigint;
  queryID?: number;
}
) {
  await provider.internal(via, {
    value: opts.value,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell()
      .storeUint(Opcodes.verify, 32)
      .storeUint(opts.queryID ?? 0, 64)
      .storeRef(
        beginCell()
          .storeBuffer(opts.pi_a)
          .storeRef(
            beginCell()
              .storeBuffer(opts.pi_b)
              .storeRef(
                beginCell()
                  .storeBuffer(opts.pi_c)
                  .storeRef(
                    this.cellFromInputList(opts.pubInputs)
                  )
              )
          )
      )
      .endCell(),
  });
}
```

We also need to add `cellFromInputList` function to the `ZkSimple` class. This function will be used to create a cell from the public inputs which will be sent to the contract.
```ts
 cellFromInputList(list: bigint[]) : Cell {
  var builder = beginCell();
  builder.storeUint(list[0], 256);
  if (list.length > 1) {
    builder.storeRef(
      this.cellFromInputList(list.slice(1))
    );
  }
  return builder.endCell()
}
```

And the last function to add to the `ZkSimple` class is `getRes` function. This function will be used to get the result of the proof check.
```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Now we can run the tests to deploy the contract. It should pass the deployment test(run this command in the root of `simple-zk` folder)
```bash
npx blueprint test
```


## 🧑‍💻 Writing tests for the verifier
Let's open the `ZkSimple.spec.ts` file in the `tests` folder and write a test for the `verify` function. The test will be like this:
```ts
describe('ZkSimple', () => {
  let code: Cell;

  beforeAll(async () => {
    code = await compile('ZkSimple');
  });

  let blockchain: Blockchain;
  let zkSimple: SandboxContract<ZkSimple>;

  beforeEach(async () => {
    // deploy contract
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and zkSimple are ready to use
  });

  it('should verify', async () => {
    // todo write the test
  });
});
```

Firstly, we need to import some packages that we will use in the test:
```ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;
````
* if you run the test, you will get a typescript error, because we don't have declaration file for module 'snarkjs' & ffjavascript. We can fix this by editing the 
`tsconfig.json` file in the root of `simple-zk` folder. We need to change the _**strict**_ option to **_false_**.

We will also need to import `circuit.wasm` and `circuit_final.zkey` files. We will use them to generate the proof to send to the contract.
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
```

Lets fill the `should verify` test. We will need to generate the proof first.
```ts
it('should verify', async () => {
  // proof generation
  let input = {
    "a": "123",
    "b": "456",
  }
  let {proof, publicSignals} = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
  let curve = await buildBls12381();
  let proofProc = unstringifyBigInts(proof);
  var pi_aS = g1Compressed(curve, proofProc.pi_a);
  var pi_bS = g2Compressed(curve, proofProc.pi_b);
  var pi_cS = g1Compressed(curve, proofProc.pi_c);
  var pi_a = Buffer.from(pi_aS, "hex");
  var pi_b = Buffer.from(pi_bS, "hex");
  var pi_c = Buffer.from(pi_cS, "hex");
  
  // todo send the proof to the contract
});
```

We need to define `g1Compressed`, `g2Compressed`, and `toHexString` functions. They will be used to convert the proof to the format that the contract expects.
```ts
function g1Compressed(curve, p1Raw) {
  let p1 = curve.G1.fromObject(p1Raw);

  let buff = new Uint8Array(48);
  curve.G1.toRprCompressed(buff, 0, p1);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function g2Compressed(curve, p2Raw) {
  let p2 = curve.G2.fromObject(p2Raw);

  let buff = new Uint8Array(96);
  curve.G2.toRprCompressed(buff, 0, p2);
  // convert from ffjavascript to blst format
  if (buff[0] & 0x80) {
    buff[0] |= 32;
  }
  buff[0] |= 0x80;
  return toHexString(buff);
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte: any) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join("");
}
```

Now we can send the proof to the contract. We will use the `sendVerify` function for this. The `sendVerify` function expects 5 parameters: `pi_a`, `pi_b`, `pi_c`, `pubInputs` and `value`.
```ts
it('should verify', async () => {
  // proof generation
  
  
  // send the proof to the contract
  const verifier = await blockchain.treasury('verifier');
  const verifyResult = await zkSimple.sendVerify(verifier.getSender(), {
    pi_a: pi_a,
    pi_b: pi_b,
    pi_c: pi_c,
    pubInputs: publicSignals,
    value: toNano('0.15'), // 0.15 TON for fee
  });
  expect(verifyResult.transactions).toHaveTransaction({
    from: verifier.address,
    to: zkSimple.address,
    success: true,
  });

  const res = await zkSimple.getRes();

  expect(res).not.toEqual(0); // check proof result

  return;
  
});
```

Are you ready to verify your first proof on TON blockchain? let's run the test and see the result:
```bash
npx blueprint test
```

Result should be like this:
```bash
 PASS  tests/ZkSimple.spec.ts
  ZkSimple
    ✓ should deploy (857 ms)
    ✓ should verify (1613 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        4.335 s, estimated 5 s
Ran all test suites.
```

You can check the repo that contains the code of this tutorial [here](https://github.com/SaberDoTcodeR/zk-ton-doc).
## 🏁 Conclusion 

In this tutorial 
* you learned about ZK and specifically ZkSnark.
* Then you write your first Circom circuit and compiled it.
* You also performed MPC and a Powers of TAU ceremony Which you used to generate verification keys for your circuit. 
* Then you used Snarkjs library to export a FunC verifier of your circuit.
* You used blueprint to deploy and write tests for your verifier.

This was just a simple ZK use case and there are many more complex use-cases that you can be implemented using ZK.
* private voting system🗳
* private lottery system🎰
* private auction system🤝
* private transactions💸(TON or JETTON)

If you have any questions or have noticed an error - feel free to write to the author - [@saber_coder](https://t.me/saber_coder)

## 📌 References

- [TVM June 2023 Upgrade](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [SnarkJs FunC fork](https://github.com/kroist/snarkjs)
- [Sample ZK on TON](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)


## 📖 See Also

- [TON Trustless bridge EVM contracts](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel Network: Privacy protocol on TON](http://github.com/saberdotcoder/tonnel-network)
- [TVM Challenge](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)


## 📬 About the author 
- Saber on [Telegram](https://t.me/saber_coder) or [Github](https://github.com/saberdotcoder) or [LinkedIn](https://www.linkedin.com/in/szafarpoor/)
