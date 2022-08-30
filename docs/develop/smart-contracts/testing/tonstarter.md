# Using tonstarter-contracts

A tonstarter-contracts project rely on _TON Contract Executor_ library. Tests are running inside Node.js by running TVM in web-assembly using _ton-contract-executor_.

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it.
:::

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

## Example

:::tip
You can see examples even using [Online IDE](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git) with a pre-defined repository.
:::

Feel free to check repository code to find how _counter smart contract_ testing works:
* [main.fc](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/contracts/main.fc) — original smart contract code example.
* [counter.spec.ts](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/test/counter.spec.ts) — test that cover counter methods.

### Simple counter

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