# Jettons

## What is a Jetton?

**Jetton** is a fungible token standard on **The Open Network (TON)** blockchain, similar to **ERC-20 tokens** on Ethereum. It allows developers to create and manage custom tokens for various purposes, which can be used within decentralized applications and services on the TON blockchain, such as stablecoins, game tokens, governance tokens, and more. Unlike the native token **Toncoin (TON)** used for system operations, Jettons are custom tokens designed for specific use cases within the TON ecosystem.

## How Do Jettons Work?

Jettons are implemented using **a smart contract-based architecture** that ensures their creation, management, and interaction within the TON blockchain. The core components of the Jetton architecture include:

- [Jetton Master Contract](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)
- [Jetton Wallet Contract](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)
- [Jetton Minter Contract (optional)](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)

These contracts create, manage, and transfer custom tokens (Jettons) within the TON ecosystem.

### 1. Jetton Master Contract

At the core of each jetton is the **Jetton Master Contract**. This contract serves as the blueprint and defines the rules for a specific type of jetton. The Jetton Master Contract holds key information such as:

- **[Metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)**: The token’s name, symbol, decimals, and other standard details.
- **Minting Rules**: The logic to create (mint) new tokens and control the total supply.
- **Circulating Supply**: The amount of jettons in circulation, tracked by the master contract.

This contract is deployed once per jetton type and serves as the anchor for the specific token. It controls how the token [behaves](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and ensures consistency in its use across the TON network.

### 2. Jetton Wallet Contract

Once a jetton has been created, users need a **Jetton Wallet Contract** to **store, send, and receive tokens**.

- **Wallets for Jetton Holders**: Each user who holds jettons will have a separate Jetton Wallet Contract that tracks their balance for that particular jetton type.
- **Sending and Receiving Jettons**: The Jetton Wallet contract allows users to send and receive tokens by transferring them to other wallets.
- **Burning Jettons**: In some cases, users may burn (destroy) their tokens via the wallet contract, reducing the total circulating supply.

Transactions between Jetton wallets require a certain amount of Toncoin (TON) to cover **gas fees** for the network to process the transaction.

- **Wallet Creation on Transfer**: If the recipient does not already have a wallet for the specific jetton, a new wallet is deployed automatically when they receive the tokens, as long as the sender has enough TON to cover the gas fees.

:::note Jetton Wallets should not be confused with general blockchain wallets for managing Toncoin or other assets. :::

### 3. Jetton Minter Contract (Optional)

Sometimes, jettons may need to be minted (created) after the initial deployment. This is where the **Jetton Minter Contract** comes into play.

- **Minting New Tokens**: The Minter Contract allows the creation of new jettons and increases the total supply. However, this contract is optional — if minting is not permitted, the jetton becomes non-mintable, and the total supply is fixed.
- **Non-Mintable**: If a jetton does not have a Minter contract, the logic is simplified—once the initial supply is created, no additional tokens can be minted. To mint jettons for the first time, refer to the [Mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token) page.

## See Also

- [Jetton Processing](/v3/guidelines/dapps/asset-processing/jettons)
- [Sharding TON Smart Contracts](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
Тест изменений
