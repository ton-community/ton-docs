# Using tonstarter-contracts

A tonstarter-contracts project rely on _TON Contract Executor_ library. Tests are running inside Node.js by running TVM in web-assembly using _ton-contract-executor_.

Read this article first to understand all approaches to test in TON:

* [TON Hello World: Step-by-step guide for writing your first smart contract in FunC (part 2) — Testing and Debugging](https://society.ton.org/ton-hello-world-guide-for-writing-first-smart-contract-in-func-part-2)

## Testing using TON Contract Executor

This library allows you to run Ton Virtual Machine locally and execute contract. That allows you to write & debug & fully test your contracts before launching them to the network.

TON Contract executor allows you to:

* execute smart contracts from FunC source code
* execute smart contracts from existing data & code Cells
* get TVM executing logs
* debug your contracts via debug primitives
* it handles internal state changes of contract data
* allows calling of so-called GET methods of smart contracts
* allows sending & debugging internal messages
* allows sending & debugging external messages
* allows debugging of messages sent by smart contract
* handle changes in smart contract code
* allows manipulations with C7 register of smart contract (including time, random seed, network config, etc.)
* allows you to make some gas optimizations

:::info
Basically you can **develop**, **debug**, and **fully cover your contract with unit-tests** fully locally without deploying it to the network.
:::

#### Links

* [GitHub repository](https://github.com/Naltox/ton-contract-executor)
* [npm.js](https://www.npmjs.com/package/ton-contract-executor)

## Examples

### Testing from JavaScript

With ton-contract-executor you can emulate TVM in JavaScript.

To summarize:
- you don't need to compile smart-contract from terminal
- you don't need to deploy contract to the blockchain
- TVM runs from JavaScript on your local machine

Code example:

```js reference
https://github.com/Naltox/ton-contract-executor/blob/8b352d0cf96553e9ded19a102a890e17c973d017/src/smartContract/SmartContract.spec.ts#L92-L125
```

### Simple counter project

:::tip
You can see examples even using [Online IDE](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git) with a pre-defined repository.
:::

Feel free to check repository code to find how _counter smart contract_ testing works:
* [main.fc](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/contracts/main.fc) — original smart contract code example.
* [counter.spec.ts](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/test/counter.spec.ts) — test that cover counter methods.


To start and experiment just copy repository from GitHub:
```bash
git clone https://github.com/ton-defi-org/tonstarter-contracts
cd tonstarter-contracts
```

#### Build project

Let us build a simple counter smart contract from boilerplate project:

```bash
npm run build
```

#### Local tests

After that to see how tests work just write in tonstarter-contracts and read the console:

```bash
npm run test
```

You'll see in console result of basic tests checks.

#### Deploying contract

In case you want test smart contract in mainnet or testnet use commands and read console:

```bash
npm run deploy # mainnet
npm run deploy:testnet # testnet
```

:::tip
Read console carefully, it has useful information about wallet, contract, faucet etc.
:::

Right now you have a battle-tested counter smart contract in TON blockchain! Yahoo!