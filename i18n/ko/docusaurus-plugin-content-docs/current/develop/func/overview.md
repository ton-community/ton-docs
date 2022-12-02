# Overview

High-level language FunC is used to program smart contracts on TON.

FunC is a domain-specific C-like statically typed language.

FunC programs are compiled into Fift assembler code, which generates corresponding bytecode for the [TON Virtual Machine](/learn/tvm-instructions/tvm_overview).

Further this bytecode (actually a [tree of cells](/learn/overviews/Cells), like any other data in TON Blockchain) can be used for creating a smart contract in the blockchain or can be run on a local instance of TVM.

You can find more information about FunC in [DOCUMENTATION](/develop/func/types) section.

:::info
FunC documentation initially written by [@akifoq](https://github.com/akifoq).
:::

Here is a simple example method to send money written on FunC:

```cpp
() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_grams(amount)
        .end_cell();

    send_raw_message(msg, 64);
}
```

## Compiler

To compile FunC local you need binaries setup on your machine. FunC compiler binaries for Windows, MacOS (Intel/M1), Ubuntu can be downloaded from:
* [Environment Setup Page](/develop/smart-contracts/environment/installation)

:::info
At the same time you always can make binaries from sources:  
[FunC compiler source code](https://github.com/ton-blockchain/ton/tree/master/crypto/func) (read [how to compile](/develop/howto/compile#func) FunC compiler from sources).
:::

## Tutorials

:::tip starter tip
The best place to start to develop using FunC: [INTRODUCTION](/develop/smart-contracts/)
:::

Other materials gracefully provided by the experts from the community:

* [Learn FunC in Y Minutes](https://learnxinyminutes.com/docs/func/) by **@romanovichim**.
* [10 FunC Lessons](https://github.com/romanovichim/TonFunClessons_Eng) by **@romanovichim** using **toncli** and **toncli** tests v1.
* [10 уроков FunC](https://github.com/romanovichim/TonFunClessons_ru) от **@romanovichim**, используя **toncli** и **toncli**-тесты v1.
* [TON Hello World: part 1](https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func): Step by step guide for writing your first smart contract in FunC by **TON Society** using **ton.js**.
* [TON Hello World: part 2](https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func-2): The second part of the guide by **TON Society** about testing and debugging.
* [FunC Quiz](https://t.me/toncontests/60) by **Vadim** - Good for selfcheck. It will take 10–15 minutes. The questions are mainly about FunС with a few general questions about TON.
* [FunC тест](https://t.me/toncontests/58?comment=14888) от **Vadim** - FunC Quiz на русском.

## Contests

Participating in [contests](https://t.me/toncontests) is a great way to learn FunC.

Also, for learning purposes, you can study past contests:

* TON Smart Challenge #2 (suitable for getting started):
  [Contest Page](https://ton.org/ton-smart-challenge-2),
  [Tasks](https://github.com/ton-blockchain/func-contest2),
  [Solutions](https://github.com/ton-blockchain/func-contest2-solutions),
  [Tests](https://github.com/ton-blockchain/func-contest2-tests).

* TON Smart Challenge #1 (suitable for beginners):
  [Contest Page](https://ton.org/contest),
  [Tasks](https://github.com/ton-blockchain/func-contest1),
  [Solutions](https://github.com/ton-blockchain/func-contest1-solutions),
  [Tests](https://github.com/ton-blockchain/func-contest1-tests).

## Smart Contracts Examples

Standard basic smart contracts like wallets, elector (manages validation on TON), multi-signature wallet, etc. can be a reference when studying.

* [Smart contract examples](/develop/smart-contracts/#smart-contracts-examples)