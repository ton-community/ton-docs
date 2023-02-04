# Getting started Tact

## Getting started from scratch

Tact is distributed via `npm` package manager and is meant to be installed to typescript/javascript projects:

```bash
yarn add tact
```


## Getting started from template

To get started, you can use the template project. It contains a simple contract that can be deployed to the TON blockchain, example of implementing unit tests and helper functions for contract deployment.

To create a project from template, just create a new repository from the template project: https://github.com/ton-core/tact-template.

```bash
git clone https://github.com/ton-core/tact-template
cd tact-template
```

## Using Tact template

You have three ready-to-use commands configured for template. Try to input them in terminal and look how it works:

```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract
```
## Customize Tact template

If you want to go further and try to find little more about tact let's find out how it works.

To launch your own contract you should:

1. Specify `contract.tact` that will be used in `yarn build`
2. Specify `contract.spec.ts` tests for using `yarn tests` for launching local tests on your local IDE. Not necessary for deployment. 
3. Specify `contract.deploy.ts` according to your `contract.tact` to generate a deployment link. In particular, it is necessary to correctly call the Init() function from the contract. From the beginning in the template project using Tonhub endpoint in the deeplink, that means you can deploy your smart contract via [Tonhub/Sandbox](https://ton.org/docs/participate/wallets/apps#tonhub) application. 
4. If you refactor template project to your own contract, you should update `tact.config.json` correspondingly.
```json
{
"projects": [{
    "name": "sample",
    "path": "./sources/contract.tact",
    "output": "./sources/output"
}]
}
```
Where:
* `path` - is path to *.tact contract file it will be used when `yarn build` run.
* `output` - is path to building files when yarn build run. `yarn test` & `yarn deploy` use these output files.

In this way you can use template project to play with Tact smart contract examples from [examples](https://github.com/ton-core/tact/tree/main/examples). Good luck!