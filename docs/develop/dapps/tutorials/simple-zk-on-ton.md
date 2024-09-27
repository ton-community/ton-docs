# Building a simple ZK project on TON

## 👋 Introduction

**Zero-knowledge** (ZK) proofs are a fundamental cryptographic primitive that allows one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any information beyond the validity of the statement itself. Zero-knowledge proofs are a powerful tool for building privacy-preserving systems and have been used in a variety of applications including anonymous payments, anonymous messaging systems, and trustless bridges.

:::tip TVM Upgrade 2023.07
Prior to June 2023 it wasn't possible to verify cryptographic proofs on TON. Due to the prevalence of complex computation behind the pairing algorithm, it was necessary to increase the functionality of TVM by adding TVM opcodes to conduct proof verification. This functionality was added in the [June 2023 update](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) and at the time of this writing is only available on testnet.
:::

## 🦄 This tutorial will cover
1. The basics of zero-knowledge cryptography and specifically zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)
2. Initiating a trusted setup ceremony (using the Powers of Tau)
3. Writing and compiling a simple ZK circuit (using the Circom language)
4. Generating, deploying, and testing a FunC contract to verify a sample ZK-proof


## 🟥🟦 Explaining ZK-proofs with a color-focused example

Before we dig into the details of zero-knowledge, let's start with a simple problem. Suppose you want to prove to a color-blind person that it is possible to distinguish between different colors. We’ll use an interactive solution to solve this problem. Assume the color-blind person (the verifier) finds two identical pieces of paper, with one being red 🟥 and one being blue 🟦.

The verifier shows one of the pieces of paper to you (the prover) and asks you to remember the color. Then the verifier holds that specific piece of paper behind their back and either keeps it the same or changes it and asks you whether the color has changed or not. If you can tell the difference, then you can see colors (or you were just lucky because you had a 50% chance of guessing the correct color).

Now if the verifier completes this process 10 times, and you can tell the difference each time, then the verifier is ~99.90234% (1 - (1/2)^10) confident that the correct colors are being used. Therefore, if the verifier completes the process 30 times, then the verifier will be 99.99999990686774% (1 - (1/2)^30) confident.

Nonetheless, this is an interactive solution and it's not efficient to have a DApp that asks users to send 30 transactions to prove specific data. Therefore, a non-interactive solution is needed; this is where Zk-SNARKs and Zk-STARKs come in.

For the purposes of this tutorial, we’ll only cover Zk-SNARKs. However, you can read more about how Zk-STARKs work on the [StarkWare website](https://starkware.co/stark/), while info that compares the differences between Zk-SNARKs and Zk-STARKs can be found on this [Panther Protocol blog post](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).**

### 🎯 Zk-SNARK: Zero-Knowledge Succinct Non-Interactive Argument of Knowledge

A Zk-SNARK is a non-interactive proof system where the prover can demonstrate to the verifier that a statement is true by simply submitting one proof. And the verifier is able to verify the proof in a very short time. Typically, dealing with a Zk-SNARK consists of three main phases:
* Conducting a trusted setup using a [multi-party computation (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) protocol to generate proving and verification keys (using Powers of TAU)
* Generating a proof using a prover key, public input, and secret input (witness)
* Verifying the proof


Let's set up our development environment and start coding!

## ⚙ Development environment setup

Let's begin the process by taking the following steps:

1. Create a new project called "simple-zk" using [Blueprint](https://github.com/ton-org/blueprint) by executing the following command, after that, enter a name for your contract (e.g. ZkSimple) and then select the 1st option (using an empty contract).
```bash 
npm create ton@latest simple-zk
```

2. Next we’ll clone the [snarkjs repo](https://github.com/kroist/snarkjs) that is adjusted to support FunC contracts
```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Then we’ll install the required libraries needed for ZkSNARKs
```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. Next we’ll add the below section to the package.json (note that some of the opcodes that we’ll use are not available in the mainnet release yet)
```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Additionally, we’ll need to change the version of the @ton-community/sandbox to be able to use the [latest TVM updates](https://t.me/thetontech/56)
```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

Great! Now we are ready to start writing our first ZK project on TON!

We currently have two main folders that make up our ZK project:
* `simple-zk` folder: contains our Blueprint template which will enable us to write our circuit and contracts and tests
* `snarkjs` folder: contains the snarkjs repo that we cloned in step 2

## Circom circuit

First let's create a folder `simple-zk/circuits` and then create a file in it and add the following code to it:
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

Above we added a simple multiplier circuit. By using this circuit we can prove that we know two numbers that when multiplied together result in a specific number (c) without revealing the corresponding numbers (a and b) themselves.

To read more about the circom language consider having a look at [this website](https://docs.circom.io/).

Next we’ll create a folder for our build files and move the data there by conducting the following (while being in the `simple-zk` folder):
```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Creating a trusted setup with Powers of TAU

Now it's time to build a trusted setup. To carry out this process, we’ll make use of the [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) method (which probably takes a few minutes to complete). Let’s get into it:
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

After the process above is completed, it will create the pot14_final.ptau file in the build/circuits folder, which can be used for writing future related circuits.

:::caution Constraint size
If a more complex circuit is written with more constraints, it is necessary to generate your PTAU setup using a larger parameter.
:::

You can remove the unnecessary files:
```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```

### 📜 Circuit compilation

Now let's compile the circuit by running the following command from the `build/circuits` folder:
```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

Now we have our circuit compiled to the `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs`, and `build/circuits/circuit.wasm` files.

:::info altbn-128 and bls12-381 curves
The altbn-128 and bls12-381 elliptic curves are currently supported by snarkjs. The [altbn-128](https://eips.ethereum.org/EIPS/eip-197) curve is only supported on Ethereum. However, on TON only the bls12-381 curve is supported.
:::

Let's check the constraint size of our circuit by entering the following command:
```bash
node ../../../snarkjs/build/cli.cjs r1cs info circuit.r1cs 
```

Therefore, the correct result should be:
```bash
[INFO]  snarkJS: Curve: bls12-381
[INFO]  snarkJS: # of Wires: 4
[INFO]  snarkJS: # of Constraints: 1
[INFO]  snarkJS: # of Private Inputs: 2
[INFO]  snarkJS: # of Public Inputs: 0
[INFO]  snarkJS: # of Labels: 4
[INFO]  snarkJS: # of Outputs: 1
```

Now we can generate the reference zkey by executing the following:
```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Then we’ll add the below contribution to the zkey:
```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Next, let's export the final zkey:
```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

Now we have our final zkey present in the `build/circuits/circuit_final.zkey` file. The zkey is then verified by entering the following:
```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Finally, it's time to generate the verification key:
```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Then we’ll remove the unnecessary files:
```bash
rm circuit_0000.zkey circuit_0001.zkey
```


After conducting the above processes, the `build/circuits` folder should be displayed as follows: 
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

### ✅ Exporting the verifier contract

The final step in this section is to generate the FunC verifier contract which we’ll use in our ZK project.
```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
``` 
Then the `verifier.fc` file is generated in the `contracts` folder.

## 🚢 Verifier contract deployment​

Let's review the `contracts/verifier.fc` file step-by-step because it contains the magic of ZK-SNARKs:

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Above are the constants that verifier contracts must make use of to implement proof verification. These parameters can be found in the `build/circuits/verification_key.json` file.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```
The above lines are the new [TVM opcodes](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade-2023-07#bls12-381) (BLS12-381) that allow pairing checks to be conducted on the TON Blockchain.

The load_data and save_data functions are simply used to load and save the proof verification results (only for test purposes).

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

Next there are several simple util functions that are used to load the proof data sent to the contract:
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

And the last part is the groth16Verify function which is required to check the validity of the proof sent to the contract.
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

Now it’s necessary to edit the two files in the `wrappers` folder. The first file that needs our attention is the `ZkSimple.compile.ts` file (if another name for the contract was set in step 1, its name will be different). We’ll put the `verifier.fc` file in the list of contracts that must be compiled.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

The other file that needs attention is `ZkSimple.ts`. We need to first add the opcode of `verify` to the `Opcodes` enum: 

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Next, it’s necessary to add the `sendVerify` function to the `ZkSimple` class. This function is used to send the proof to the contract and test it and is presented as follows:
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

Next, we’ll add the `cellFromInputList` function to the `ZkSimple` class. This function is used to create a cell from the public inputs which will be sent to the contract.
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

Finally, the last function we’ll add to the `ZkSimple` class is the `getRes` function. This function is used to receive the proof verification result.
```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Now we can run the required tests needed to deploy the contract. For this to be possible, the contract should be able to successfully pass the deployment test. Run this command in the root of `simple-zk` folder:
```bash
npx blueprint test
```

## 🧑‍💻 Writing tests for the verifier

Let's open the `ZkSimple.spec.ts` file in the `tests` folder and write a test for the `verify` function. The test is conducted as follows:
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

First, we’ll need to import several packages that we will use in the test:
```ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;
````
* If you run the test, the result will be a TypeScript error, because we don't have a declaration file for the module 'snarkjs' & ffjavascript. This can be addressed by editing the `tsconfig.json` file in the root of the `simple-zk` folder. We'll need to change the _**strict**_ option to **_false_** in that file
* 
We'll also need to import the `circuit.wasm` and `circuit_final.zkey` files which will be used to generate the proof to send to the contract. 
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
```

Let's fill the `should verify` test. We'll need to generate the proof first.
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

To carry out the next step it is necessary to define the `g1Compressed`, `g2Compressed`, and `toHexString` functions. They will be used to convert the cryptographic proof to the format that the contract expects.

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

Now we can send the cryptographic proof to the contract. We'll use the sendVerify function for this. The `sendVerify` function expects 5 parameters: `pi_a`, `pi_b`, `pi_c`, `pubInputs`, and `value`.
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

Are you ready to verify your first proof on TON blockchain? To start off this process, let's run the Blueprint test by inputting the following:
```bash
npx blueprint test
```

The result should be as follows:
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

In order to check the repo that contains the code from this tutorial, click on the following link found [here](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Conclusion 

In this tutorial you learned the following skills:

* The intricacies of zero-knowledge and specifically ZK-SNARKs
* Writing and compiling Circom circuiting
* Increased familiarity with MPC and the Powers of TAU, which were used to generate verification keys for a circuit
* Became familiar with a Snarkjs library to export a FunC verifier for a circuit
* Became familiar with Blueprint for verifier deployment and test writing

Note: The above examples taught us how to build a simple ZK use case. That said, there are a wide range of highly complex ZK-focused use cases that can be implemented in a wide range of industries. Some of these include:

* private voting systems 🗳
* private lottery systems 🎰
* private auction systems 🤝
* private transactions💸 (for Toncoin or Jettons) 

If you have any questions or encounter any errors in this tutorial, feel free to write to the author: [@saber_coder](https://t.me/saber_coder)


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
- Saber on [Telegram](https://t.me/saber_coder) or [GitHub](https://github.com/saberdotcoder) or [LinkedIn](https://www.linkedin.com/in/szafarpoor/)
