# Introduction


Right now, there are three great approaches of how to start developing TON smart contracts:
* [TON Hello World: Step-by-step guide for writing your first smart contract in FunC](https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* [TON Learn FunC journey: 10 zero-to-hero lessons](https://blog.ton.org/func-journey) ([Ru version](https://github.com/romanovichim/TonFunClessons_ru))
* [Introduction to FunC: how to start developing on TON?](https://dev.to/dvlkv/introduction-in-func-how-to-start-developing-in-ton-50hp)

## Environment

### Local

A local environment allows you to develop contracts _faster_, with more comfort, and use bonuses like [IDE plugins](/develop/smart-contracts/environment/ide-plugins) with syntax highlight for smart contracts development.

Read more in the [INSTALLATION](/develop/smart-contracts/environment/installation) guide.

### Online

You can try to deploy TON smart contracts online using [Glitch Workspace](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git).

Glitch runs the [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) environment directly in the browser, so it is almost identical to the local setup but doesn't require installing anything to your device.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button-v2.svg)](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git)


## Development Toolkit

Start developing, testing, and debugging smart contracts easily with these resources:

### JavaScript SDK

* [Choose your JavaScript SDK](/develop/smart-contracts/sdk/javascript)

### Other Tools

* [disintar/toncli](/develop/smart-contracts/sdk/toncli)—Comfy CLI to build, deploy, and test FunC contracts
* [MyLocalTON](/participate/nodes/local-ton)—Run your private TON Blockchain
* [tonwhales.com/tools/boc](https://tonwhales.com/tools/boc)—BOC parser
* [tonwhales.com/tools/introspection-id](https://tonwhales.com/tools/introspection-id)—crc32 generator

## TON Virtual Machine

TON smart contracts are executed on their own TON Virtual Machine (TVM).  
TVM is built on the stack principle, which makes it efficient and easy to implement.  

You can read more about how TVM works in [TVM bird's-eye overview](/learn/tvm-instructions/tvm-overview).

## FunC language

High-level language FunC is used to program smart contracts on TON.

Feel free to read more about FunC in [DOCUMENTATION](/develop/func/overview.md) section.


## Smart Contract Examples

:::info little tip
Feel free to focus on smart contracts written using _FunC_  (***.fc**) instead of low-level *Fift* (***.fif**) language. It would be a better experience.
:::

Standard basic smart contracts like wallets, electors (manage validation on TON), multi-signature wallets, etc. can be a reference when studying.

If you're already familiar with smart contracts, you can try to read the following articles:

- [Fungible (Jettons), Non-Fungible (NFT), Semi-Fungible Tokens smart contracts](https://github.com/ton-blockchain/token-contract/tree/main)
- [Standard smart contracts examples](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [Wallet V4 smart contract example](https://github.com/ton-blockchain/wallet-contract)
- [Math.func library](https://github.com/TonoxDeFi/math.func)—a ready-to-use library made by community

## Smart Contract Guidelines

TON allows you to do anything, but if you want to discover full power of the TON Blockchain, you must follow the _smart contract guidelines_ when developing a smart contract.

* [Smart contract guidelines](/develop/smart-contracts/guidelines)

## Fift language

:::caution advanced level
This information is **very low level** and can be hard to understand for newcomers.  
So feel free to read about it later.
:::

Messages to smart contracts are binary data. To construct such messages, you can use one of the SDKs **or** the special programming language Fift.

Since Fift is close to TVM opcodes, it also helps to test the limits of your brain.

- [Introduction to Fift](http://blog.ton.org/introduction-to-fift) by TON Society
- [Fift documentation](https://ton.org/fiftbase.pdf)
- [Fift scripts for standard smart contracts](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)


## FAQ

- **Is TVM compatible with EVM?**

   TVM cannot be compatible with Ethereum Virtual Machine (EVM) because TON has a different modern architecture. (TON is asynchronous, Ethereum is synchronous.)

   [Read more](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

- **Is it possible to write on Solidity for TON?**

   No, you cannot write on Solidity for TON. 

   But if you add asynchronous messages to the Solidity syntax and the ability to interact with data at a low level, then you get FunC. FunC features a syntax that is common to most modern programming languages and is designed specifically for TON.
