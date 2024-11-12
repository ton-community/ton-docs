# Frequently Asked Questions

This section covers the most popular questions about TON Blockchain.

## Overview

### Could you share a brief overview of TON?

- [Introduction to The Open Network](/v3/concepts/dive-into-ton/introduction)
- [The TON Blockchain is based on PoS consensus](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [TON Whitepapers](/v3/documentation/whitepapers/overview)

### What are some of the main similarities and differences to EVM blockchains?

- [Ethereum to TON](/v3/concepts/dive-into-ton/go-from-ethereum/tvm-vs-evm)
- [Comparison of TON, Solana and Ethereum 2.0](https://ton.org/comparison_of_blockchains.pdf)


### Does TON have a test environment?

- [Testnet](/v3/documentation/smart-contracts/getting-started/testnet)

## TON and L2

### Why is workchains better than L1 → L2?

Workchains in TON, offer a number of advantages over traditional L1 and L2 layer architecture.

1. One of the key advantages of a blockchain is the instantaneous processing of transactions. In traditional L2 solutions, there can be delays in moving assets between layers. Workchains eliminate this problem by providing seamless and instantaneous transactions between different parts of the network. This is especially important for applications requiring high speed and low latency.
2. Workchains support cross-shard activity, which means that users can interact between different shardchains or workchains within the same network. In current L2 solutions, cross-shard operations are often complex and require additional bridges or interoperability solutions. In TON, for example, users can easily exchange tokens or perform other transactions between different shardchains without complex procedures.
3. Scalability is one of the main challenges for modern blockchain systems. In traditional L2 solutions, scalability is limited by the capacity of the sequencer. If the TPS (transactions per second) on L2 exceeds the sequencer's capacity, it can lead to problems. In workchains in TON, this problem is solved by dividing the shard. When the load on a shard exceeds its capacity, the shard is automatically divided into two or more shards, allowing the system to scale almost without limit.

### Is there a need for L2 on the TON?

At any transaction cost, there will always be applications that cannot sustain such a fee but can function at a much lower cost. Similarly, regardless of the latency achieved, there will always be applications that require even lower latency. Therefore, it is conceivable that there might eventually be a need for L2 solutions on the TON platform to cater to these specific requirements.

## MEV

### Is front running possible in TON?

In the TON blockchain, deterministic transaction order plays a key role in preventing frontrunning. This means that the order of transactions within a blockchain is predetermined and deterministic. No participant can change this order once transactions have entered the pool. This system eliminates the possibility of manipulating the order of transactions for profit, which differentiates TON from other blockchains such as Ethereum, where validators can change the order of transactions within a block, creating opportunities for MEV (maximum extractable value).

In addition, the current TON architecture lacks a market-based mechanism for determining transaction fees. Commissions are fixed and not subject to change depending on transaction priorities, which makes frontrunning less attractive. Because of the fixed fees and deterministic order of transactions, it is non-trivial to do frontrunning in TON.

## Block

### What is the RPC method used to retrieve block information?

Blocks produced by Validators. Existing blocks available via Liteservers. Liteservers accessible via Lite Clients. On top of Lite Client built 3rd-party tools like wallets, explorers, dapps, etc.

- To access the Lite Client core check out this section of our GitHub:  [ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)


Additionally, here are three high-level third-party block explorers:
- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

Read more in the [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) section of our documentation.

### Block time

_2-5s_

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:
* [Comparison of Blockchains document](https://ton.org/comparison_of_blockchains.pdf)
* [Comparison of Blockchains table (much less informative than the document, but more visual)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Time-to-finality

_Under 6 sec._

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:
* [Comparison of Blockchains document](https://ton.org/comparison_of_blockchains.pdf)
* [Comparison of Blockchains table (much less informative than the document, but more visual)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### Average block size

```bash 
max block size param 29
max_block_bytes:2097152
```

:::info
Find more actual params in [Network Configs](/v3/documentation/network/configs/network-configs).
:::

### What is the layout of blocks on TON?

Detailed explanations on each field of the layout:

- [Block layout](/v3/documentation/data-formats/tlb/block-layout)

## Transactions

### RPC method to get transactions data

- [see answer above](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### Is TON transaction asynchronous or synchronous? Is it possible to access documentation that show how this system works?

TON Blockchain messages asynchronous:
- sender prepares the transaction body(message boc) and broadcasts it via Lite Client (or higher-level tool)
- Lite Client returns status of broadcast, not result of executing the Transaction
- sender checks desired result by listening target account(address) state or the whole blockchain state

An explanation of how TON asynchronous messaging works is explained using an example related to Wallet smart contracts:
- [How TON wallets work and how to access them using JavaScript](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

Example for Wallet contract transfer (low-level):
- https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go

### Is it possible to determine if a transaction is 100% finalized? Is querying the transaction level data sufficient to obtain this information?

**Short answer:** To ensure the transaction is finalized, the receiver's account must be checked.

To learn more about transaction verification, please see the following examples:
- Go: [Wallet example](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python: [Storefront bot with payments in TON](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript: [Bot being used for dumpling sales](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### What is the layout of a transaction in TON?

Detailed explanations on each field of the layout:
- [Transaction layout](/v3/documentation/data-formats/tlb/transaction-layout)

### Is transaction batching possible?

Yes, transaction batching on TON can be accomplished in two distinct ways:
- By utilizing the asynchronous nature of TON, i.e. sending independent transactions to the network
- By making use of smart contracts which receive task and execute it as a batch

Example of using batch-featured contract (high-load wallet):
- https://github.com/tonuniverse/highload-wallet-api

Default wallets (v3/v4) also support sending multiple messages (up to 4) in one transaction.

## Standards

### What accuracy of currencies is available for TON?

_9 digits_

:::info
Number of decimal places supported by Mainnet : 9 digits.
:::

### Are there any standardized protocols for minting, burning, and transferring fungible and non-fungible tokens in transactions?

Non-fungible tokens (NFTs):
- [TEP-62: NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [NFT documentation](/v3/documentation/dapps/defi/tokens#nft)

Jettons (tokens):
- [TEP-74: Jettons standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [Distributed tokens overview](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [Fungible token documentation(Jettons)](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

Other Standards:
- https://github.com/ton-blockchain/TEPs

### Are there examples of parsing events with Jettons(Tokens) and NFT?

On TON, all data is transmitted as boc-messages. This means that using NFTs in transactions is not an exceptional event. Rather, it is a regular message that is sent to or received from a (NFT- or Wallet-)contract, much like a transaction involving a standard wallet.

However, certain indexed APIs allow you to view all messages sent to or from a contract, and filter them based on your specific requirements.

- https://docs.tonconsole.com/tonapi/rest-api

To better understand how this process works, please refer [Payments Processing](/v3/guidelines/dapps/asset-processing/payments-processing) section.


## Account Structure

### What is the address format?

- [Smart Contract Address](/v3/documentation/smart-contracts/addresses)

### Is it possible to have a named account similar to ENS

Yes, use TON DNS:
- [TON DNS & Domains](/v3/guidelines/web3/ton-dns/dns)

### How to distinguish between a normal account and a smart contract?

- [Everything is a smart contract](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### How to tell if the address is a token address?

For a **Jettons** contract must implement [standard's interface](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and return data on _get_wallet_data()_ or _get_jetton_data()_ methods.

### Are there any special accounts (e.g. accounts owned by the network) that have different rules or methods from the rest?

There is a special master blockchain inside a TON called Masterchain. It consists of network-wide contracts with network configuration, validator-related contracts, etc:

:::info
Read more about masterchain, workchains and shardchains in TON Blockchain overview article: [Blockchain of Blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains).
:::

Good example is smart governance contract, which is a part of masterchain:
- [Governance contracts](/v3/documentation/smart-contracts/contracts-specs/governance)

## Smart Contracts

### Is it possible to detect contract deployment events on TON?

[Everything in TON is a smart contract](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract).

Account address is generated deterministically from its _initial state_, which includes _initial code_ and _initial data_ (for wallets, initial data includes public key among other parameters).
When any component changes, the address changes accordingly.

Smart contract can exist in uninitialized state, meaning that its state is not available in blockchain but contract has non-zero balance. Initial state itself can be sent to the network later with an internal or external message, so those can be monitored to detect contract deployment.

To protect message chains from being halted at non-existing contracts TON use "bounce" feature. Read more in these articles:

- [Deploying wallet via TonLib](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [Paying for processing queries and sending responses](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### Does the upgradability of a smart-contract pose a threat to its users?

Currently, the ability to update smart contracts is a normal practice and is widely used in most modern protocols. This is because upgradability allows for bug fixes, adding new features and improving security.

How to mitigate the risks:

1. Pay attention to projects with a good reputation and well-known development teams.
2. Reputable projects always conduct independent code audits to make sure the code is safe and reliable. Look for projects that have several completed audits from reputable auditing firms.
3. An active community and positive feedback can serve as an additional indicator of a project's reliability.
4. Examine exactly how the project implements the update process. The more transparent and decentralized the process, the less risk to users.

### How can users be sure that the contract owner will not change certain conditions (via an update)?

The contract must be verified, this allows you to check the source code and ensure that there is no update logic to ensure it remains unchanged. If the contract does indeed lack mechanisms to change the code, the terms of the contract will remain unchanged after deployment.

Sometimes the logic for updating may exist, but the rights to change the code may be moved to an "empty" address, which also precludes changes.

### Is it possible to re-deploy code to an existing address or does it have to be deployed as a new contract?

Yes, this is possible. If a smart contract carries out specific instructions (`set_code()`) its code can be updated and the address will remain the same.

If the contract cannot initially execute `set_code()` (via its code or execution of other code coming from the outside), then its code cannot be changed ever. No one will be able to redeploy contract with other code at the same address.

### Can smart contract be deleted?

Yes, either as a result of storage fee accumulation (contract needs to reach -1 TON balance to be deleted) or by sending a message with [mode 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### Are smart contract addresses case sensitive?

Yes, smart contract addresses are case sensitive because they are generated using the [base64 algorithm](https://en.wikipedia.org/wiki/Base64).  You can learn more about smart contract addresses [here](/v3/documentation/smart-contracts/addresses).


### Is the Ton Virtual Machine (TVM) EVM-compatible?

  The TVM is not compatible with the Ethereum Virtual Machine (EVM) because TON leverages a completely different architecture (TON is asynchronous, while Ethereum is synchronous).

  [Read more on asynchronous smart contracts](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25).

### Is it possible to write on Solidity for TON?

  Relatedly, the TON ecosystem does not support development in Ethereum’s Solidity programming language.

  But if you add asynchronous messages to the Solidity syntax and the ability to interact with data at a low level, then you get FunC. FunC features a syntax that is common to most modern programming languages and is designed specifically for development on TON.


## Remote Procedure Calls (RPCs)

### Recommended node providers for data extraction include:

API types:
- Read more about different [API Types](/v3/guidelines/dapps/apis-sdks/api-types) (Indexed, HTTP, and ADNL)

Node providers partners:

- https://toncenter.com/api/v2/
- [getblock.io](https://getblock.io/)
- https://www.orbs.com/ton-access/
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api) 
- [nownodes.io](https://nownodes.io/nodes)
- https://dton.io/graphql

TON directory with projects from TON Community:

- [ton.app](https://ton.app/)

###  Provided below are two main resources used to obtain information related to public node endpoints on TON Blockchain (for both TON Mainnet and TON Testnet).

- [Network Configs](/v3/documentation/network/configs/network-configs)
- [Examples and tutorials](/v3/guidelines/dapps/overview#tutorials-and-examples)
