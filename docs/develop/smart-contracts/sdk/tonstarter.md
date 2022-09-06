# Using tonstarter-contracts

## Overview

A _tonstarter-contracts_ based on TypeScript, TON Contract Executor and mochajs. 

Good solution for **JavaScript** stack developers.

* [GitHub repository](https://github.com/ton-defi-org/tonstarter-contracts)
* [Online IDE using Glitch](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git)

## Quick Start

To start developing on your local machine just clone repository:

```bash
git clone https://github.com/ton-defi-org/tonstarter-contracts
cd tonstarter-contracts
```
or use pre-defined Online IDE provided before.

After that feel free to go:
* [TON Hello World: Step by step guide for writing your first smart contract in FunC](https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* ... or continue to [Testing & Debugging](/develop/smart-contracts/testing/tonstarter) section to test example smart contract.


## What does SDK contain?

Directory structure looks like:

* `contracts/*.fc` - Smart contracts for TON blockchain written in [FunC](https://ton.org/docs/#/func) language
* `test/*.spec.ts` - Test suite for the contracts in TypeScript ([MochaJS](https://mochajs.org/) test runner)
* `build/_build.ts` - Build script to compile the FunC code to [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf) and [TVM](https://ton-blockchain.github.io/docs/tvm.pdf) opcodes
* `build/_deploy.ts` - Deploy script to deploy the compiled code to TON
* `build/_setup.ts` - Setup script to install build dependencies

:::info
An optimal setup to develop fully tested contracts in the most seamless way possible.
:::

## Principles

* **Cross-platform support** - works on Mac M1, Mac Intel, Windows or Linux.
* **Strong belief in tests** - contracts often manage money - they must be developed under high scrutiny.
* **Clear and documented code** to help users audit the contracts sources and understand what they do.
* **Reliance on modern TypeScript** to develop clean and typed scripts and tests in a modern framework.
* **Reliance on TypeScript for deployment** instead of working with `fift` CLI tools - it's simply easier.
* **Tests are executed in JavaScript** with TVM in web-assembly - a great balance of speed and convenience.
* Following of the TON contract [best practices](/develop/smart-contracts/guidelines) appearing in the official docs.
