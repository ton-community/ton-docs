# Get started Tact

# TACT template project

## Overview

Get tact-template from community repository:

```bash
git clone https://github.com/ton-community/tact-template
cd tact-template
```

This project has ready to use TACT compiler, typescript + jest with [ton-emulator](https://github.com/ton-community/ton-emulator), example how to do tests.

You have three ready-to-use commands configured for template. Try to input them in terminal and look how it works:

```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract
```
## Customize Tact project

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

In this way you can use template project to play with Tact smart contract examples from [examples](https://github.com/ton-community/tact/tree/main/examples). Good luck!