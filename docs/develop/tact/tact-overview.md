# Overview

## What is Tact?

Tact is a high-level programming language for TON blockchain that is focused on efficiency and simplicity. It is designed to be easy to learn and use, and to be a good fit for smart contracts. Tact is a statically typed language with a simple syntax and a powerful type system.


:::info Tact seeks contributors!
Tact is active development and offers a wide range of tasks for participants to work on. Noticed some issue? Report this with [issue](https://github.com/ton-core/tact/issues). Have any suggest how to improve Tact?
Just create [pull request](https://github.com/ton-core/tact/pulls) with your updates. Have any question? Ask community in [chat](https://t.me/tactlang).
:::

## Getting started from template

To get started, you can use the template project. It contains a simple contract that can be deployed to the TON blockchain, example of implementing unit tests and helper functions for contract deployment.

To create a project from template, just create a new repository from the template project: https://github.com/ton-core/tact-template.

## Getting started from scratch

Tact is distributed via `npm` package manager and is meant to be installed to typescript/javascript projects:

```bash
yarn add tact
```

## Tact concept
### Strong type system
Tact offers algebraic data types compatible with TL-B scheme. Arithmetic is always safe because integers have precise bounds. Tact compiler helps you perform necessary checks and does not produce silent failures or unexpected truncation.

### Actor-oriented
Tact is designed specifically for the TON actor model. Strongly typed messages enforce communication contracts between actors.

### Gas control
Blockchain programs have strict execution cost model. Every operation must be paid for in real time and execution may fail mid-way if it runs out of gas.

Tact makes cross-contract messages safe with precise gas commitments and compiler checks of the execution costs. Variable costs are either statically bounded, or checked explicitly in runtime.

### Tact and FunC
FunC is a lower-level language aimed at developers who are deeply familiar with TON architecture. FunC liberates developers from writing raw Fift code, while providing the same level of control. Unfortunately, the precision of FunC makes it harder to write complex multi-contract systems.
Tact enables developers to go even further: you can write the entire suites of smart contracts with strongly typed interfaces and statically verified execution costs. With Tact you can focus on your problem and worry less about blockchain idiosyncrasies.

### Typescript Libraries

Tact language has built-in support for `ton` and `ton-core` typescript libraries. Compiler generates code for these libraries automatically and you can use libraries like [ton-emulator](https://github.com/ton-community/ton-emulator), [@ton-community/sandbox](https://github.com/ton-community/sandbox).

### Tact contract in Typescript

Compiler generates files named `{project}_{contract}.ts` for each contract in your project that contains ready-to use strongly typed wrappers to work with a contract in any environment: for testing, deployments, etc.

### Tact is just getting started
Tact is a very new project. Currently work in progress, check last version [Tact](https://github.com/ton-core/tact).
Original documentation introduced by ton-core community placed [here](https://docs.tact-lang.org/). 


