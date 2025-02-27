# Getting started 

Welcome to The Open Network (TON) quick start guide! This guide will give you starting point for further research of TON concepts and basic practical expereince of developing application with TON exosystem.

## Prerequisites

- Basic programming knowledge.
- Around __30 minutes__ of your time.

> **Note**: We will provide short explanation of core concets during guide, but if you prefer nore theoretical approuch you can checkout core concepts of TON blockhain here: [TON blockhain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).

## What You'll Learn

- Interact with TON ecosystem: Wallets and explorers.
- Setup development environment: use Blueprint SDK for developing smart-contracts using FunC, Tact and Tolk
- Send transactions and read from blockhain using your prefered programming language and availible SDK's
- Core concepts of TON blockhain and further learning-curve.
- Basic templates ready for implementation your project logick.

### Creating a TON Wallet with TonKeeper

1. Download [TonKeeper](https://tonkeeper.com/) from your device's app store
2. Open the app and select "Create Wallet"
3. Follow the instructions to create a new wallet
4. **IMPORTANT**: Write down your recovery phrase and store it securely. This is the only way to restore your wallet if you lose access.

### Sending Messages and Using Devnet

TonKeeper allows you to send transactions and messages on the TON blockchain:

1. To send TON coins, tap the "Send" button
2. Enter the recipient's address or scan their QR code
3. Enter the amount and confirm the transaction

For developers testing applications:

1. Go to Settings > Features
2. Enable Developer Mode
3. Go back to Settings and select "Network"
4. Switch from "Mainnet" to "Testnet" to use the development network
5. You can request test TON coins from a [testnet faucet](https://t.me/testgiver_ton_bot)

### Exploring the Blockchain with TonViewer

[TonViewer](https://tonviewer.com/) is a blockchain explorer that allows you to:

1. Check transaction history of any address
2. Verify contract deployments
3. Inspect smart contract data
4. Monitor network activity

To use TonViewer:

1. Visit [tonviewer.com](https://tonviewer.com/)
2. Enter an address, transaction ID, or block hash in the search bar
3. For development purposes, make sure to switch to "Testnet" view when testing applications

## For Developers: Setting Up Your Development Environment

### Installing Node.js and TON SDK

1. Install Node.js (version 16 or later recommended):
- Linux: `sudo apt update && sudo apt install nodejs npm`
- macOS with Homebrew: `brew install node`
- Windows: Download from [nodejs.org](https://nodejs.org/)

2. Verify installation:
```bash
node --version
npm --version
```

3. Install TON SDK:
```bash
npm install --global @ton/ton
```

### Setting Up Blueprint for Smart Contract Development

[Blueprint](https://github.com/ton-community/blueprint) is a development environment for TON smart contracts:

1. Install Blueprint:
```bash
npm install --global @ton/blueprint
```

2. Create a new project:
```bash
mkdir my-ton-project
cd my-ton-project
npx @ton/blueprint create
```

3. Follow the interactive prompts to set up your project

## Your First TON Project: Hello World

### Creating a Simple Smart Contract

Let's create a simple "Hello World" contract that stores a greeting message and allows anyone to read it.

1. If you haven't already, create a new Blueprint project:
```bash
npx @ton/blueprint create hello-world
```

2. Navigate to your project:
```bash
cd hello-world
```

3. Create a new contract in the `contracts` directory. Here's a simple example in FunC:

```func
;; Simple Hello World Contract

() recv_internal(int msg_value, cell in_msg, slice in_msg_body) impure {
    ;; Accept any incoming message
}

(slice) get_greeting() method_id {
    return "Hello, TON!";
}
```

### Deploying to the TON Blockchain
1. Compile your contract:
```bash
npx @ton/blueprint build
```

2. Run the deploy script:
```bash
npx @ton/blueprint run
```

3. Select the deployment script and follow the prompts

### Interacting with Your Contract

Once deployed, you can interact with your contract:

1. Run a script to call the `get_greeting` method:
```bash
npx @ton/blueprint run
```

2. Select your script to get the greeting

## Next Steps

Congratulations! You've set up your TON development environment and deployed your first smart contract. Here are some next steps to continue your journey:

- Explore more complex smart contract examples in the [TON examples repository](https://github.com/ton-community/ton-docs/tree/main/examples)
- Learn about [TON virtual machine (TVM)](../../../develop/smart-contracts/environment/tvm-overview) for more advanced contract development
- Dive into [FunC programming language](../../../develop/smart-contracts/sdk/func) for writing efficient contracts
- Discover [TON payments](../../../develop/dapps/asset-processing/payments) integration for applications

Happy building on TON!



