import Feedback from '@site/src/components/Feedback';

# Building a simple ZK project on TON

## 👋 Introduction

**Zero-knowledge (ZK)** proofs are a fundamental cryptographic concept that allows **the prover** to prove to **the verifier** that a statement is true without revealing any additional information. ZK proofs are a powerful tool for building privacy-preserving systems and are widely used in applications such as anonymous payments, private messaging, and trustless bridges.



:::tip TVM upgrade 2023.07
Before June 2023, verifying cryptographic proofs on TON was not possible. Due to the complex computations required for the pairing algorithm, the TON Virtual Machine (TVM) needed to be upgraded with new opcodes to support proof verification. This functionality was added in the [June 2023 update](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade#bls12-381) and, at the time of writing, is only available on testnet.
:::

## 🦄 This tutorial will cover
1. The basics of zero-knowledge cryptography, with a focus on zk-SNARKs (zero-knowledge succinct non-interactive argument of knowledge).
2. How to initiate a trusted setup ceremony (using the Powers of Tau).
3. Writing and compiling a simple ZK circuit (using the Circom language).
4. Generating, deploying, and testing a FunC contract to verify a sample ZK proof.


## 🟥🟦 Explaining ZK-proofs with a color-focused example

Before diving into the technical details, let's start with a simple analogy. Imagine you want to prove to a color-blind person that two colors are different. We’ll use an interactive method to demonstrate this. Assume the color-blind person (the verifier) has two identical pieces of paper, one red 🟥 and one blue 🟦.

The verifier shows the prover one of two colored pieces of paper and asks them to remember the color. Then, the verifier hides the paper behind their back, either keeping the same color or swapping it for the other color. Afterward, they ask the prover whether the color has changed. If the prover correctly identifies whether the color has changed, it suggests that the prover can distinguish between the colors—or they were simply lucky, since there’s a 50% chance of guessing correctly.

If this process is repeated 10 times, and you answer correctly each time, the verifier can be ~99.90% confident that you truly see the colors. After 30 repetitions, their confidence level rises to 99.9999999%.

However, this method is interactive, meaning it requires multiple steps between the prover and verifier. In a decentralized application (DApp), having users send 30 transactions to prove a fact would be inefficient. This is why a non-interactive solution is needed—enter zk-SNARKs and zk-STARKs.

For this tutorial, we’ll focus on zk-SNARKs. However, you can learn more about zk-STARKs on the [StarkWare website](https://starkware.co/stark/), and find a comparison of zk-SNARKs vs. zk-STARKs in this [Panther Protocol blog post](https://blog.pantherprotocol.io/zk-snarks-vs-zk-starks-differences-in-zero-knowledge-technologies/).**

### 🎯 Zk-SNARK: zero-knowledge succinct non-interactive argument of knowledge

A zk-SNARK is a non-interactive proof system where the prover submits a single proof to demonstrate that a statement is true. The verifier can then quickly validate the proof. Typically, working with a zk-SNARK involves three main steps:
* Performing a trusted setup using a [multi-party computation (MPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation) protocol to generate proving and verification keys (using Powers of TAU),
* Generating a proof using a prover key, public input, and secret input (witness),
* Verifying the proof.


Let’s set up our development environment and start coding!

## ⚙ Setting up the development environment

Follow these steps to begin:

1. Create a new project called "simple-zk" using [Blueprint](https://github.com/ton-org/blueprint) using Blueprint by running the following command, after that, enter a name for your contract (e.g. ZkSimple) and then select the first option (using an empty contract).
```bash 
npm create ton@latest simple-zk
```

2. Clone the [snarkjs repo](https://github.com/kroist/snarkjs) that is adjusted to support FunC contracts
```bash
git clone https://github.com/kroist/snarkjs.git
cd snarkjs
npm ci
cd ../simple-zk
```

3. Install the required libraries needed for ZkSNARKs
```bash
npm add --save-dev snarkjs ffjavascript
npm i -g circom
```

4. Modify the package.json file by adding the necessary dependencies. Note that some opcodes used in this tutorial are not yet available on the mainnet release.
```json
"overrides": {
    "@ton-community/func-js-bin": "0.4.5-tvmbeta.1",
    "@ton-community/func-js": "0.6.3-tvmbeta.1"
}
```

5. Update the version of the @ton-community/sandbox to ensure compatibility with the latest [latest TVM updates](https://t.me/thetontech/56).
```bash
npm i --save-dev @ton-community/sandbox@0.12.0-tvmbeta.1
```

Great! Now we’re ready to start writing our first ZK project on TON!

We now have two main folders in our ZK project:
* `simple-zk` folder: contains the Blueprint template, where we’ll write our circuits, contracts, and tests.
* `snarkjs` folder: contains the snarkjs repository that we cloned in step 2.

## Circom circuit

First let's create a folder named `simple-zk/circuits`. Inside this folder, create a new file and add the following code::
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

The circuit above defines a simple multiplier. Using this circuit, we can prove that we know two numbers (a and b) that multiply to produce a specific number (c)—without revealing the values of a and b themselves.

For more information about the Circom language, visit [this website](https://docs.circom.io/).

Next, we’ll create a folder to store our build files and move the necessary data there. While inside the `simple-zk` folder, run the following commands:
```bash
mkdir -p ./build/circuits
cd ./build/circuits
```

### 💪 Creating a trusted setup with Powers of TAU

Now, it’s time to establish a trusted setup using the [Powers of Tau](https://a16zcrypto.com/posts/article/on-chain-trusted-setup-ceremony/) method. This process may take a few minutes to complete. Let’s get started:
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

Once the process is complete, a file named pot14_final.ptau will be created inside the build/circuits folder. This file can be reused for generating future circuits.

:::caution Constraint size
If you plan to write a more complex circuit with additional constraints, you’ll need to generate a Powers of Tau (PTAU) setup using a larger parameter. 

You can remove the unnecessary files:
```bash
rm pot14_0000.ptau pot14_0001.ptau pot14_0002.ptau pot14_beacon.ptau
```
### 📜 Circuit compilation

To compile the circuit, run the following command from the `build/circuits` folder:
```bash
circom ../../circuits/test.circom --r1cs circuit.r1cs --wasm circuit.wasm --prime bls12381 --sym circuit.sym
```

After running this command, the compiled circuit will be available in `build/circuits/circuit.sym`, `build/circuits/circuit.r1cs`, and `build/circuits/circuit.wasm`.

:::info altbn-128 and bls12-381 curves
The altbn-128 and bls12-381 elliptic curves are currently supported by snarkjs. However, the [altbn-128](https://eips.ethereum.org/EIPS/eip-197) curve is only supported on Ethereum, whereas TON exclusively supports the bls12-381 curve.
:::

To check the constraint size of the circuit, run:

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

Now we can generate the reference zkey by executing:
```bash
node ../../../snarkjs/build/cli.cjs zkey new circuit.r1cs pot14_final.ptau circuit_0000.zkey
```

Next, add a contribution to the zkey with the following command:
```bash
echo "some random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v
```

Then, export the final zkey:
```bash
echo "another random text" | node ../../../snarkjs/build/cli.cjs zkey contribute circuit_0001.zkey circuit_final.zkey
```

At this point, the final zkey is stored in `build/circuits/circuit_final.zkey` file. The zkey is then verified by entering the following:
```bash
node ../../../snarkjs/build/cli.cjs zkey verify circuit.r1cs pot14_final.ptau circuit_final.zkey
```

Finally, it's time to generate the verification key:
```bash
node ../../../snarkjs/build/cli.cjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Then, remove unnecessary files to clean up the workspace:
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

The final step in this section is to generate the FunC verifier contract, which will be used in our ZK project.
```bash
node ../../../snarkjs/build/cli.cjs zkey export funcverifier circuit_final.zkey ../../contracts/verifier.fc
``` 
Then the `verifier.fc` file will be generated in the `contracts` folder.

## 🚢 Deploying the verifier contract

Now, let's review the `contracts/verifier.fc` file step by step. This file contains the core logic required for ZK-SNARK verification.

```func
const slice IC0 = "b514a6870a13f33f07bc314cdad5d426c61c50b453316c241852089aada4a73a658d36124c4df0088f2cd8838731b971"s;
const slice IC1 = "8f9fdde28ca907af4acff24f772448a1fa906b1b51ba34f1086c97cd2c3ac7b5e0e143e4161258576d2a996c533d6078"s;

const slice vk_gamma_2 = "93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8"s;
const slice vk_delta_2 = "97b0fdbc9553a62a79970134577d1b86f7da8937dd9f4d3d5ad33844eafb47096c99ee36d2eab4d58a1f5b8cc46faa3907e3f7b12cf45449278832eb4d902eed1d5f446e5df9f03e3ce70b6aea1d2497fd12ed91bd1d5b443821223dca2d19c7"s;
const slice vk_alpha_1 = "a3fa7b5f78f70fbd1874ffc2104f55e658211db8a938445b4a07bdedd966ec60090400413d81f0b6e7e9afac958abfea"s;
const slice vk_beta_2 = "b17e1924160eff0f027c872bc13ad3b60b2f5076585c8bce3e5ea86e3e46e9507f40c4600401bf5e88c7d6cceb05e8800712029d2eff22cbf071a5eadf166f266df75ad032648e8e421550f9e9b6c497b890a1609a349fbef9e61802fa7d9af5"s;
```

Above you can see the constants that verifier contracts must use to implement proof verification. These parameters can be found in the `build/circuits/verification_key.json` file.

```func
slice bls_g1_add(slice x, slice y) asm "BLS_G1_ADD";
slice bls_g1_neg(slice x) asm "BLS_G1_NEG";
slice bls_g1_multiexp(
        slice x1, int y1,
        int n
) asm "BLS_G1_MULTIEXP";
int bls_pairing(slice x1, slice y1, slice x2, slice y2, slice x3, slice y3, slice x4, slice y4, int n) asm "BLS_PAIRING";
```
The above lines are the new [TVM opcodes](/v3/documentation/tvm/changelog/tvm-upgrade-2023-07#bls12-381) (BLS12-381) that allow pairing checks to be conducted on the TON Blockchain.

The load_data and save_data functions store and retrieve proof verification results (primarily for testing purposes).

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

Next there are several simple util functions. These functions process and load proof data sent to the contract.
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

And the last part is the groth16Verify function that verifies the validity of the proof sent to the contract.
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

Next, we need to edit two files inside the `wrappers` folder. The first file that needs our attention is the `ZkSimple.compile.ts` file (If a different contract name was chosen in Step 1, update the filename accordingly. ). We need to add `verifier.fc` to the list of contracts that must be compiled.

```ts
import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
  lang: 'func',
  targets: ['contracts/verifier.fc'], // <-- here we put the path to our contract
};
```

The other file that needs attention is `ZkSimple.ts`. We need to first add the `verify` opcode to the `Opcodes` enum: 

```ts
export const Opcodes = {
  verify: 0x3b3cca17,
};
```

Next, add the `sendVerify` function to the `ZkSimple` class. This function sends the proof to the contract for verification::
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

Next, we’ll add the `cellFromInputList` function to the `ZkSimple` class. This function converts public inputs into a format compatible with the contract:
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

Finally, add the `getRes` function, which retrieves the verification result:
```ts
 async getRes(provider: ContractProvider) {
  const result = await provider.get('get_res', []);
  return result.stack.readNumber();
}
```

Now, we can run the required tests before deploying the contract. The contract must successfully pass all tests before deployment. To run the tests, execute the following command from the root of the `simple-zk` folder:
```bash
npx blueprint test
```

## 🧑‍💻 Writing tests for the verifier

Let's open the `ZkSimple.spec.ts` file inside the `tests` older and write a test for the verify function. The test is conducted as follows:
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

First, we need to import several packages that will be used in the test:
```ts
import * as snarkjs from "snarkjs";
import path from "path";
import {buildBls12381, utils} from "ffjavascript";
const {unstringifyBigInts} = utils;

* If you run the test, the result will be a TypeScript error, because we don't have a declaration file for the module 'snarkjs' & ffjavascript. This can be addressed by editing the `tsconfig.json` file in the root of the `simple-zk` folder. We'll need to change the _**strict**_ option to **_false_** in that file
* 
We'll also need to import the `circuit.wasm` and `circuit_final.zkey` files which will be used to generate the proof to send to the contract. 
```ts
const wasmPath = path.join(__dirname, "../build/circuits", "circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits", "circuit_final.zkey");
```

Let's fill the `should verify` test. We first need to generate a proof. The proof will later be sent to the contract for verification.
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

To carry out the next step it is necessary to define the `g1Compressed`, `g2Compressed`, and `toHexString` functions. These functions will convert the cryptographic proof into the format expected by the contract.

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

Once we have the proof formatted correctly, we can send it to the contract using the `sendVerify` function. The `sendVerify` function expects the following five parameters:  `pi_a`, `pi_b`, `pi_c`, `pubInputs`, and `value`.
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

Are you ready to verify your first proof on TON Blockchain? To kick things off, let's run the Blueprint test by executing the following command in the terminal:
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

In order to check the repo that contains the code from this tutorial, visit [here](https://github.com/SaberDoTcodeR/zk-ton-doc).

## 🏁 Conclusion 

In this tutorial, you have learned:

* The fundamentals of zero-knowledge proofs, specifically ZK-SNARKs.
* How to write and compile circom circuits.
* How to use MPC and the Powers of TAU to generate verification keys.
* How to work with Snarkjs to export a FunC verifier.
* How to use Blueprint for deploying a verifier and writing tests.

Note: This tutorial covered a basic ZK use case, but zero-knowledge proofs can power many advanced applications across different industries, including:

* private voting systems,
* private lottery systems,
* private auction systems,
* private transactions (for Toncoin or jettons).

If you have any questions or run into any errors, feel free to reach out to the author: [@saber_coder](https://t.me/saber_coder)


## 📌 References

- [TVM June 2023 upgrade](https://docs.ton.org/learn/tvm-instructions/tvm-upgrade)
- [SnarkJs](https://github.com/iden3/snarkjs)
- [SnarkJs FunC fork](https://github.com/kroist/snarkjs)
- [Sample ZK on TON](https://github.com/SaberDoTcodeR/ton-zk-verifier)
- [Blueprint](https://github.com/ton-org/blueprint)


## 📖 See also

- [TON trustless bridge EVM contracts](https://github.com/ton-blockchain/ton-trustless-bridge-evm-contracts)
- [Tonnel network: privacy protocol on TON](http://github.com/saberdotcoder/tonnel-network)
- [TVM challenge](https://blog.ton.org/tvm-challenge-is-here-with-over-54-000-in-rewards)


## 📬 About the author 
- _Saber_ on [Telegram](https://t.me/saber_coder), [GitHub](https://github.com/saberdotcoder), and [LinkedIn](https://www.linkedin.com/in/szafarpoor).

<Feedback />

