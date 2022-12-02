# Using tonstarter-contracts

A tonstarter-contracts project relies on the _TON Contract Executor_ library. Tests are running inside Node.js by running TVM in web-assembly using _ton-contract-executor_.

Read this article first to understand all approaches to testing on TON:

* [TON Hello World: Step-by-step guide for writing your first smart contract in FunC (part 2) — Testing and Debugging](https://society.ton.org/ton-hello-world-guide-for-writing-first-smart-contract-in-func-part-2)

## Testing using TON Contract Executor

This library allows you to run TON Virtual Machine locally and execute a contract. That allows you to write, debug, and fully test your contracts before launching them on the network.

TON Contract executor allows you to:

* execute smart contracts from FunC source code
* execute smart contracts from existing data and code Cells
* get TVM executing logs
* debug your contracts via debug primitives
* handle internal state changes of contract data
* allows calling of so-called get-methods of smart contracts
* allows sending and debugging internal messages
* allows sending and debugging external messages
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
- you don't need to compile a smart contract from a terminal
- you don't need to deploy contract to the blockchain
- TVM runs from JavaScript on your local machine

Code example:

```js

it('should update contract state between calls', async () => {
  const source = `
            () main() {
                ;; noop
            }
            int test() method_id {
                ;; Load seq from data
                slice ds = get_data().begin_parse();
                var seq = ds~load_uint(32);
                ds.end_parse();
                ;; Store new seq
                set_data(begin_cell().store_uint(seq + 1, 32).end_cell());
                return seq;
            }
        `
  let dataCell = new Cell()
  dataCell.bits.writeUint(0, 32)

  let contract = await SmartContract.fromFuncSource(source, dataCell, {getMethodsMutate: true})

  let res = await contract.invokeGetMethod('test', [])
  expect(res.result[0]).toEqual(new BN(0))

  let res2 = await contract.invokeGetMethod('test', [])
  expect(res2.result[0]).toEqual(new BN(1))

  let res3 = await contract.invokeGetMethod('test', [])
  expect(res3.result[0]).toEqual(new BN(2))
})

```

### Simple counter project

:::tip
You can see examples even using [Online IDE](https://glitch.com/edit/#!/remix/clone-from-repo?&REPO_URL=https%3A%2F%2Fgithub.com%2Fton-defi-org%2Ftonstarter-contracts.git) with a pre-defined repository.
:::

Feel free to check repository code to find how _counter smart contract_ testing works:
* [main.fc](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/contracts/main.fc) — original smart contract code example
* [counter.spec.ts](https://github.com/ton-defi-org/tonstarter-contracts/blob/main/test/counter.spec.ts) — test that covers counter methods


To start and experiment just copy repository from GitHub:
```bash
git clone https://github.com/ton-defi-org/tonstarter-contracts
cd tonstarter-contracts
```

#### Build project

Let us build a simple counter smart contract from boilerplate project.

```bash
npm run build
```

#### Local tests

After that, to see how tests work, just write in tonstarter-contracts and read the console.

```bash
npm run test
```

You'll see in console result of basic tests checks.

#### Deploying contract

In case you want test a smart contract in mainnet or testnet, use commands and read console.

```bash
npm run deploy # mainnet
npm run deploy:testnet # testnet
```

:::tip
Read console carefully, it has useful information about the wallet, contract, faucet, etc.
:::

Right now you have a battle-tested counter smart contract in the TON Blockchain! Yahoo!