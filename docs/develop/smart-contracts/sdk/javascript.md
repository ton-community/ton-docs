# Javascript SDK

Choose your Javascript SDK for smart-contract development on TON.

## ton-compiler

### Overview

Packaged FunC compiler for TON smart contracts.
* GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
* NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### Features

* Multiple func compiler versions
* Doesn't need to install and compile TON
* Programmatic and CLI interfaces
* Ready to use in unit-testing (with tonstarter-contracts)

### Installation

Install environment to compile smart contracts in one line of code:

```bash npm2yarn
npm install ton-compiler
```

### How to use

This packages adds `ton-compiler` binary to a project.

FunC compilation is a multi-stage process. One is compiling Func to Fift code that then compiled to a binary representation. Fift compiler already have Asm.fif bundled.

Func stdlib is bundled, but could be disabled at runtime.

#### Console Use

```bash
# Compile to binary form (for contract creation)
ton-compiler --input ./wallet.fc --output ./wallet.cell

# Compile to fift (useful for debuging)
ton-compiler --input ./wallet.fc --output-fift ./wallet.fif

# Compile to fift and fift
ton-compiler --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Disable stdlib
ton-compiler --no-stdlib --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif

# Pick version
ton-compiler --version "legacy" --input ./wallet.fc --output ./wallet.cell --output-fift ./wallet.fif
```

#### Programmatic Use

```javascript
import { compileContract } from "ton-compiler";
let result = await compileContract({ code: 'source code', stdlib: true, version: 'latest' });
if (result.ok) {
  console.log(result.fift); // Compiled Fift assembler
  console.log(result.cell); // Compiled cell Buffer
} else {
  console.warn(result.logs); // Output logs
}
```

## func-js

### Overview

_Cross-platform_ bindings for TON FunC compiler.

It's more low-level than ton-compiler, so use it only if ton-compiler not working for you.

* GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
* NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### Features

* No need to compile of download FunC binaries
* Works both in Node.js & **WEB** (WASM support is required)
* Compiles straight to BOC with code Cell
* Assembly is returned fot debugging purposes
* Does not depend on file-system

### Installation

Install environment to compile smart contracts in one line of code:

```bash npm2yarn
npm install @ton-community/func-js
```

### How to use

Internally this package uses both FunC compiler and Fift interpreter combined to single lib compiled to WASM.

Simple schema:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

Sources for the internal lib could be found [here](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib).

### Usage example

```javascript
import {compileFunc, compilerVersion} from '@ton-community/func-js';
import {Cell} from 'ton';

async function main() {
    // You can get compiler version 
    let version = await compilerVersion();
    
    let result = await compileFunc({
        // Entry points of your project
        entryPoints: ['main.fc'],
        // Sources
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "main.fc": "<contractCode>",
            // Rest of the files which are included in main.fc if some
        }
    });

    if (result.status === 'error') {
        console.error(result.message)
        return;
    }

    // result.codeBoc contains base64 encoded BOC with code cell 
    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
    
    // result.fiftCode contains assembly version of your code (for debug purposes)
    console.log(result.fiftCode)
}
```

Note that all FunC source files contents used in your project should be passed to `sources`, including:

* entry points
* stdlib.fc (if you use it)
* all files included in entry points



## tonstarter-contracts

### Overview

Project boilerplate for smart contract development and testing based on TypeScript.

* [GitHub repository](https://github.com/ton-defi-org/tonstarter-contracts)
* [Online IDE using Glitch](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git)

### Quick Start

To start developing on your local machine just clone repository:

```bash
git clone https://github.com/ton-defi-org/tonstarter-contracts
cd tonstarter-contracts
```
or use pre-defined Online IDE provided before.

#### Project upgrade needed

tonstarter-contracts still use old versions of ton-compiler, so please install and upgrade ton-compiler or func-js with your hands.

:::tip OPEN-SOURCE OPPORTUNITY
Pull Requests to the tonstarter-contracts are welcome!
:::

### Where to go next?

After that feel free to go:
* [TON Hello World: Step by step guide for writing your first smart contract in FunC](https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* ... or continue to [Testing & Debugging](/develop/smart-contracts/testing/tonstarter) section to test example smart contract.


### Directory structure

Directory structure looks like:

* `contracts/*.fc` - Smart contracts for TON blockchain written in [FunC](https://ton.org/docs/#/func) language
* `test/*.spec.ts` - Test suite for the contracts in TypeScript ([MochaJS](https://mochajs.org/) test runner)
* `build/_build.ts` - Build script to compile the FunC code to [Fift](https://ton.org/docs/fiftbase.pdf) and [TVM](https://ton.org/docs/tvm.pdf) opcodes
* `build/_deploy.ts` - Deploy script to deploy the compiled code to TON
* `build/_setup.ts` - Setup script to install build dependencies

:::info
An optimal setup to develop fully tested contracts in the most seamless way possible.
:::

### Principles

* **Cross-platform support** - works on Mac M1, Mac Intel, Windows or Linux.
* **Strong belief in tests** - contracts often manage money - they must be developed under high scrutiny.
* **Clear and documented code** to help users audit the contracts sources and understand what they do.
* **Reliance on modern TypeScript** to develop clean and typed scripts and tests in a modern framework.
* **Reliance on TypeScript for deployment** instead of working with `fift` CLI tools - it's simply easier.
* **Tests are executed in JavaScript** with TVM in web-assembly - a great balance of speed and convenience.
* Following of the TON contract [best practices](/develop/smart-contracts/guidelines) appearing in the official docs.
