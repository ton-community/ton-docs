# Getting Started

```
// TODO adapt to docs style this from awesome-ton-smart-constracts
```

It's a list of links to articles and tools which can help you to start developing smart-contracts for [TON](https://ton.org) blockchain

## What is smart-contract?
Self executing program hosted at blockchain. For example in the TON blockchain every wallet is smart-contract.

Smart-contract have state and persistent storage, which can contain any sort of variables.

Smart-contract can store data, move funds to other smart-contracts, compute something.

## How to start using or developing smart-contracts?

To begin with, you must pay attention to two existing programming languages related to developing smart contracts in TON: [FunC](https://ton.org/docs/#/func) and [Fift](https://ton-blockchain.github.io/docs/fiftbase.pdf). FunC is used to write the logic of contracts, it is compiled to fift-asm code, which can then be translated to bytecode for TVM. The functionality of Fift is very wide. To begin with, fift-asm is an [Asm.fif](https://github.com/newton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif) program that allows you to translate asm-like(fift-asm) code into byte code for TVM. We also use Fift to automatically test and write queries to smart contracts.

You can get the binaries of the FunC compiler and the Fift interpreter by building code from [newton-blockchain/ton](https://github.com/newton-blockchain/ton) repo.

You can use [toncli](https://github.com/disintar/toncli) to easily and conveniently develop smart contracts using FunC and Fift, especially useful if you are a beginner. The [tonweb](https://github.com/toncenter/tonweb) library is available for writing web interfaces. The official [documentation](https://ton.org/docs/#/docs) can also help you a lot.

## Chats with other developers
* 🇺🇸 [TonDev Chat](https://t.me/tondev_eng) - TON Developers chat
* 🇺🇸 [TON Society Chat](https://t.me/tonsociety_chat) - Global Hub for TON Builders
* 🇺🇸 [Tonic Discord](https://discord.gg/tWxm8nrKt8) — Discord community for TON developers
* 🇺🇸 [Smart-Contracts Dev Chat](https://t.me/tonsc_chat) — chat focused on smart-contracts development.
* 🇷🇺 [TonDevRu Chat](https://t.me/tondev) - TON Developers chat

## About fift and func which are used to develop smart contracts:
1. [Fift official docs](https://ton-blockchain.github.io/docs/fiftbase.pdf)
2. [FunC official docs](https://ton.org/docs/#/func)
3. [Fift instructions in C++](https://github.com/newton-blockchain/ton/blob/9875f02ef4ceba5b065d5e63c920f91aec73224e/crypto/fift/words.cpp#L2723-L3110)

## About TL-B

TL-B (Type Language - Binary) serves to describe the type system, constructors, and existing functions. For example we can use TL-B schemes to build binary structures associated with the TON blockchain. Special TL-B parsers can read schemes to deserialize binary data into different objects. (definition from the [documentation](https://github.com/tonuniverse/TL-B-docs))

1. [Documentation with examples](https://github.com/tonuniverse/TL-B-docs)
2. [Some about TL-B are described in tvm.pdf](https://newton-blockchain.github.io/docs/tvm.pdf)

### Smart contracts examples:
1. [Official smart contracts (wallets, givers, etc.)](https://github.com/newton-blockchain/ton/tree/master/crypto/smartcont)
2. https://github.com/ton-blockchain/wallet-contract
3. Telegram contests, a lot of different smart contracts
    1. https://contest.com/blockchain
    2. https://contest.com/blockchain-2 & https://contest.com/blockchain-2-bonus
4. [Gambling smart contract](https://github.com/deNULL/ton-gamble)
5. [Auction smart contract](https://github.com/deNULL/ton-auction)
6. [Smart contract with text sending](https://github.com/akifoq/ton-samples/blob/master/text/main.fc)
7. [Example of simple token contract](https://github.com/akifoq/TonToken)
8. [Official draft fungible, non-fungible token contracts](https://github.com/ton-blockchain/token-contract)
    * [NFT standart discussion](https://github.com/ton-blockchain/TIPs/issues/62)
9. [Wallet v4 contract (Supports external plugins installation)](https://github.com/ton-blockchain/wallet-contract)
    * [Subscribtion plugin](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)
10. [TRC-20 (like ERC-20) token contract](https://github.com/cod1ng-studio/TRC20)
11. [Examples of using fift runvm to run transactions](https://github.com/disintar/toncli/tree/master/src/toncli/projects/external_code)
12. [Slotmachine game smart contract](https://gregory-wimbelson.gitbook.io/ton-cookbook/)

### Articles about smartcontracts:
1. Official guidelines - https://ton.org/docs/#/howto/smart-contract-guidelines
2. Develop, deploy and use lottery smart contract - https://habr.com/ru/post/494528/
3. Extend wallet smart contract and deploy it - https://telegra.ph/Hello-World-TON-smart-contract-for-15-minutes-11-20

### Deploy smart contract:
1. [Smart contract deployer](https://deployer.tonsc.org/) by t.me/ProjectManageRR
2. [TON CLI](https://github.com/disintar/toncli) by t.me/disintar
3. [Documented generate.fif](https://gist.github.com/tvorogme/fdb174ac0740b6a52d1dbdf85f4ddc63) by t.me/disintar
4. [Lite-client installation guide](https://ton.org/docs/#/howto/getting-started). Via lite-client you can send .boc file to deploy smart contract to blockchain
5. [Compilation and deploy of the gambling smart contract](https://gregory-wimbelson.gitbook.io/ton-cookbook/compilation-and-deploy-of-the-ton-smart-contract)

### IDE plugins and syntax highlighting
1. [Intellij Platform plugin](https://github.com/andreypfau/intellij-ton)
2. [neovim FunC syntax highlighting](https://github.com/PythoNyashka/neovim-ton-dev)
3. Visual Studio Code [fift syntax highlighting](https://marketplace.visualstudio.com/items?itemName=dotcypress.language-fift)
   and [FunC syntax highlighting](https://marketplace.visualstudio.com/items?itemName=raiym.FunC)
