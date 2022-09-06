# Introduction


Right now there is 2 great approaches how to start developing TON smart contracts:
* [TON Hello World: Step by step guide for writing your first smart contract in FunC](https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* [TON Learn Guides: 10 zero-to-hero lessons](https://github.com/romanovichim/TonFunClessons_Eng) ([Ru version](https://github.com/romanovichim/TonFunClessons_ru))

## Environment

### Online

You can try to deploy TON smart contracts online using [Glitch Workspace](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git).

Glitch runs the [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) environment directly in the browser, so it is almost identical to the local setup but doesn't require installing anything on your machine.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button-v2.svg)](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git)

:::info
Online IDE is perfect for hackathons, contests, or just to try TON development.
:::

### Local

A local environment allows you to develop contracts _faster_, with more comfort, and use bonuses like [IDE plugins](/develop/smart-contracts/environment/ide-plugins) with syntax highlight for smart contracts development.

Continue in the [INSTALLATION](/develop/smart-contracts/environment/installation) guide.

## Development Toolkit

Start developing, testing and debugging smart contracts easily with these resources:

* [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) - All-in-one templates to build, deploy and test FunC contracts
* [toncli](https://github.com/disintar/toncli) — Comfy CLI to build, deploy and test FunC contracts.
* [MyLocalTON](/participate/nodes/local-ton.md) - Run your private TON blockchain
* [ton-contract-executor](https://github.com/Naltox/ton-contract-executor) - Library for running contracts locally


## TON Virtual Machine

TON smart contracts are executed on their own TON Virtual Machine (TVM).  
TVM is built on the stack principle, which makes it efficient and easy to implement.  

You can read more about how TVM works in [TVM bird's-eye overview](/learn/tvm-instructions/tvm_overview).

## FunC language

High-level language FunC is used to program smart contracts on TON.

Feel free to read more about FunC in [DOCUMENTATION](/develop/func/overview.md) section.

## Smart Contract Guidelines

TON allows you to do anything, but on production smart contracts must be followed _smart contract guidelines_ if you want to discover the full power of the TON blockchain:

* [Smart Contract Guidelines](/develop/smart-contracts/guidelines)

## Fift language

:::caution advanced level
This information is **very low level** and could be hard to understand for newcomers.  
So feel free to read about it later.
:::

Messages to smart contracts are binary data. To construct such messages, you can use one of the SDKs **or** the special programming language Fift.

Since Fift is close to TVM opcodes, it also helps to know the limits of your brain.

- [Fift documentation](https://ton-blockchain.github.io/fiftbase.pdf)
- [Fift scripts for standard smart contracts](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)


## FAQ

- **Is TVM compatible with EVM?**

   TVM cannot be compatible with the Ethereum Virtual Machine (EVM) because the TON has a different modern architecture (TON asynchronous, Ethereum synchronous).

   [Read more](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

- **Is it possible to write on Solidity for TON?**

   No, you can't write on Solidity for TON. 

   But if you add asynchronous messages to Solidity syntax and the ability to interact with data at a low level, then you get FunC. FunC has a familiar syntax similar to most modern programming languages and is designed specifically for TON.
