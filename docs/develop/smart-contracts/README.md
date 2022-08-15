# Introduction


:::tip start tip
If you feel stacked and don't know where to start just choose one of the links below.

Later you will discover documentation by doing.
:::

## Quick Start

Right now there is 2 great approaches how to start developing TON smart contracts:
* [TON Hello World: Step by step guide for writing your first smart contract in FunC](https://society.ton.org/ton-hello-world-step-by-step-guide-for-writing-your-first-smart-contract-in-func)
* [TON Learn Guides: 10 zero-to-hero lessons](https://github.com/romanovichim/TonFunClessons_Eng)


## TON Virtual Machine (TVM)

TON smart contracts are executed on their own TON Virtual Machine (TVM).

TVM is built on the stack principle, which makes it efficient and easy to implement.

:::info
You can read more about how TVM works in bird's-eye overview [**here**](/develop/smart-contracts/tvm_overview.md).
:::

## FunC

High-level language FunC is used to program smart contracts on TON.

:::info documentation
Feel free to read more about FunC in [documentation](/docs/develop/func/overview.md).
:::

## Standard Smart Contracts

Standard basic smart contracts like wallets, elector (manages validation on TON), multi-signature wallet, etc. can be a reference when studying.

[Standard smart contracts](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)

## Smart Contract Guidelines

TON allows you to do anything, but product smart contracts must be followed [smart contract guidelines](/docs/develop/smart-contracts/guidelines). 

## Fift

:::caution
This part of TON is very low-level and could be very hard to understand for newcomer. Feel free to omit it right now, you always can return later.
:::

Messages to smart contracts are binary data. To construct such messages, you can use one of the [SDKs](/docs/develop/apis/) **or** the special programming language Fift.

Since Fift is close to TVM opcodes, it also helps to know the limits of your brain.

[Fift documentation](https://ton-blockchain.github.io/docs/fiftbase.pdf)

[Fift scripts for standard smart contracts](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)


## FAQ

- **Is TVM compatible with EVM?**

   TVM cannot be compatible with the Ethereum Virtual Machine (EVM) because the TON has a different modern architecture (TON asynchronous, Ethereum synchronous).

   [Read more](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

- **Is it possible to write on Solidity for TON?**

   No, you can't write on Solidity for TON. 

   But if you add asynchronous messages to Solidity syntax and the ability to interact with data at a low level, then you get FunC. FunC has a familiar syntax similar to most modern programming languages and is designed specifically for TON.
