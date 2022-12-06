# Overview

A high-level language FunC is used to program smart contracts on TON.

FunC is a domain-specific, C-like, statically typed language.

FunC programs are compiled into Fift assembler code, which generates corresponding bytecode for the [TON Virtual Machine](/learn/tvm-instructions/tvm_overview).

Further this bytecode (actually a [tree of cells](/learn/overviews/Cells), like any other data in the TON Blockchain) can be used for creating smart contracts in the blockchain or can be run on a local instance of TVM.

You can find more information about FunC in the [DOCUMENTATION](/develop/func/types) section.

:::info
FunC documentation was initially written by [@akifoq](https://github.com/akifoq).
:::

Here is a simple example method for sending money written in FunC:

```func
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

To compile FunC locally you need binaries setup on your machine. FunC compiler binaries for Windows, MacOS (Intel/M1), and Ubuntu can be downloaded from:
* [Environment Setup Page](/develop/smart-contracts/environment/installation)

:::info
At the same time you can always make binaries from sources like:  
[FunC compiler source code](https://github.com/ton-blockchain/ton/tree/master/crypto/func) (read [how to compile](/develop/howto/compile#func) a FunC compiler from sources).
:::

## Tutorials

:::tip starter tip
The best place to start to develop using FunC: [INTRODUCTION](/develop/smart-contracts/)
:::

Other materials gracefully provided by the experts from the community:

* [Learn FunC in Y Minutes](https://learnxinyminutes.com/docs/func/) by **@romanovichim**
* [TON Hello World: part 1](https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func): Step by step guide for writing your first smart contract in FunC by **Tal Kol** using **ton.js**
* [TON Hello World: part 2](https://blog.ton.org/step-by-step-guide-for-writing-your-first-smart-contract-in-func-2): The second part of the guide by **Tal Kol** about testing and debugging
* [10 FunC Lessons](https://github.com/romanovichim/TonFunClessons_Eng) by **@romanovichim**, using **toncli** and **toncli** tests v1
* [10 FunC lessons](https://github.com/romanovichim/TonFunClessons_ru) by **@romanovichim**, using **toncli** and **toncli** tests v1 in Russian
* [FunC Quiz](https://t.me/toncontests/60) by **Vadim**—Good for selfcheck. It will take 10–15 minutes. The questions are mainly about FunС with a few general questions about TON
* [FunC Quiz](https://t.me/toncontests/58?comment=14888) by **Vadim**—FunC Quiz in Russian

## Contests

Participating in [contests](https://t.me/toncontests) is a great way to learn FunC.

You can also study previous competitions for learning purposes:
* TON Smart Challenge #2 (good for getting started):
  [Contest Page](https://ton.org/ton-smart-challenge-2),
  [Tasks](https://github.com/ton-blockchain/func-contest2),
  [Solutions](https://github.com/ton-blockchain/func-contest2-solutions),
  [Tests](https://github.com/ton-blockchain/func-contest2-tests).

* TON Smart Challenge #1 (good for beginners):
  [Contest Page](https://ton.org/contest),
  [Tasks](https://github.com/ton-blockchain/func-contest1),
  [Solutions](https://github.com/ton-blockchain/func-contest1-solutions),
  [Tests](https://github.com/ton-blockchain/func-contest1-tests).

## Smart contract examples

Standard basic smart contracts like wallets, electors (manages validation on TON), multi-signature wallets, etc. can be a reference when studying.

* [Smart contract examples](/develop/smart-contracts/#smart-contracts-examples)