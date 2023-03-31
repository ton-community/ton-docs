# Javascript SDK

Choose your Javascript SDK for smart contract development on TON.

## ton-compiler

### Overview

Packaged FunC compiler for TON smart contracts:
* GitHub: [ton-community/ton-compiler](https://github.com/ton-community/ton-compiler)
* NPM: [ton-compiler](https://www.npmjs.com/package/ton-compiler)

### Installation

```bash npm2yarn
npm install ton-compiler
```

### Features

* Multiple FunC compiler versions
* Doesn't need to install and compile TON
* Programmatic and CLI interfaces
* Ready to use in unit-testing

### How to use

This packages adds `ton-compiler` binary to a project.

FunC compilation is a multi-stage process. One is compiling Func to Fift code that is then compiled to a binary representation. Fift compiler already has Asm.fif bundled.

FunC stdlib is bundled but could be disabled at runtime.

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

It's more low-level than ton-compiler, so use it only if ton-compiler doesn't work for you.

* GitHub: [ton-community/func-js](https://github.com/ton-community/func-js)
* NPM: [@ton-community/func-js](https://www.npmjs.com/package/@ton-community/func-js)

### Installation

```bash npm2yarn
npm install @ton-community/func-js
```

### Features

* No need to compile of download FunC binaries
* Works both in Node.js & **WEB** (WASM support is required)
* Compiles straight to BOC with code Cell
* Assembly is returned fot debugging purposes
* Does not depend on file-system


### How to use

Internally, this package uses both FunC compiler and Fift interpreter combined to single lib compiled to WASM.

Simple schema:

```bash
(your code) -> WASM(FunC -> Fift -> BOC)
```

Sources to the internal lib could be found [here](https://github.com/ton-blockchain/ton/tree/testnet/crypto/funcfiftlib).

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

Note that all FunC source file contents used in your project should be passed to `sources`, including:

* entry points
* stdlib.fc (if you use it)
* all files included in entry points
