import Feedback from '@site/src/components/Feedback';

# The differences of blockchains

## Introduction

In this chapter, we will examine the key differences between the Ethereum blockchain and the TON blockchain. The analysis will include an overview of the network architectures, highlight their unique features, and evaluate the advantages and disadvantages of each.

Starting with an overview of the Ethereum and TON ecosystems, we can note that both platforms offer a similar structure of participants and services, including users who hold assets and make transactions, validators who keep the network up and running and secure, and application developers who use the blockchain as the basis for their products and services. Both ecosystems include custodial and non-custodial services that give users different control over their assets.

Additionally, it is worth highlighting that both platforms facilitate the creation of **decentralized applications (DApps)**, offering developers powerful tools and standards for development.

However, despite the similarities in overall structure and features offered, the key technological aspects and network design approaches of Ethereum and TON differ significantly. These differences lay the foundation for a thorough understanding of each platform's unique advantages and limitations, which is particularly important for developers seeking to maximize the capabilities of each network. In the following subsections, we will explore these differences in more detail, focusing on the network architecture, models, transaction mechanisms, and transaction settlement system to provide developers with the necessary insights.

## Differences between TON and Ethereum

### Account

In the first subsection, we compared Ethereum and TON, highlighting their key architectural differences and the main challenges faced by Ethereum. Of particular note are the different approaches to organizing interactions in these blockchains and using models. These differences come from the unique architectural choices of each platform. For developers accustomed to Ethereum, it is essential to deeply understand these differences to effectively transition to developing on TON. This understanding will allow the architecture to adapt and optimize the interaction of smart contracts in the new environment.

#### Ethereum

Ethereum uses an account-based model to track balances. An account stores information about different coin balances, like a regular bank account. There are two types of accounts:

- **Externally-owned accounts (EOAs)** - externally managed accounts are controlled by the user using public and private key pairs. The public key allows others to send payments to the account.
- Contract accounts are controlled by smart contract code rather than private keys. Contract accounts cannot initiate transactions independently because they do not have a private key.

When an Ethereum user creates a wallet, an EOA is added to the global state on all nodes in the decentralized network. Deploying a smart contract creates a contract account capable of storing and distributing funds programmatically based on certain conditions. All account types have balances and storage and can trigger transactions by calling functions in other accounts. This structure provides Ethereum's ability to serve as programmable money.

Ethereum has synchronous transaction processing, where each transaction is processed sequentially and in strict order. Synchronous processing ensures that the state of the blockchain always remains consistent and predictable for all participants in the network. All transactions are atomic; they either complete successfully or unsuccessfully without partial or incomplete execution. Moreover, when a smart contract invokes another smart contract, the invocation occurs instantaneously within the same transaction. But here again, there are disadvantages — a transaction can grow as much as it can. A negative effect of synchronicity is still overloading, as computations cannot run in parallel. The number of contracts and users grows, and the inability to parallelize computations becomes a major limiting factor in the growth of the network.

#### TON

The actor model is an approach to parallel and distributed computing where the main element is an actor - an independent executable block of code. Initially developed for cluster computing, this model is widely used in micro-server architectures to meet the needs of modern distributed systems due to its ability to scale, parallelism, and fault tolerance. Actors receive and process messages, depending on the logic of the message, respond by accepting local changes or performing actions in response, and can create other actors or send messages onward. They are thread-safe and reentrant, eliminating the need for locks and simplifying parallel processing of tasks. This model is ideal for building scalable and reliable server solutions, providing efficient concurrent access control and support for synchronous and asynchronous messaging.

In TON, smart contracts represent everything and are called actors within the actor model context. A smart contract is an object with address, code, data, and balance properties. It can store data and behaves according to instructions received from other smart contracts. After a contract receives a message and processes it by executing its code in the TVM, various scenarios can occur:

- The contract changes its properties `code`, `data`, and `balance`
- コントラクトは任意で送信メッセージを生成します
- 次のイベントが発生するまでコントラクトはスタンバイモードになります

The result of the scripts is always the creation of a transaction. The transactions themselves are asynchronous, meaning that the system can continue processing other transactions while waiting for past transactions to complete. This approach provides more flexibility when processing complex transactions. Sometimes a single transaction may require multiple smart contract calls to be executed in a specific sequence. Because these calls are asynchronous, developers can more easily design and implement complex transaction flows that may involve multiple concurrent operations.

A developer coming from Ethereum needs to realize that smart contracts in the TON blockchain can only communicate with each other by sending asynchronous messages, which means that if there is a need to request data from another contract and an immediate response is required, this will not be possible. Instead, clients outside the network must call `get methods`, much like a wallet in Ethereum that uses RPC nodes such as Infura to request smart contract states. This is an important limitation for several reasons. For example, flash loans are transactions executed within a single block, relying on the ability to borrow and repay in the same transaction.

The synchronous nature of Ethereum's EVM facilitates such transactions, whereas the asynchronous nature of all transactions in TON makes executing a flash loan infeasible. Oracles, which provide smart contracts with external data, also involve a more intricate design process in TON. What Oracles are and how to use them in TON can be found [here](/v3/documentation/dapps/oracles/about_blockchain_oracles/).

### Wallets

#### Ethereum

We have already discussed that in Ethereum, a user's wallet is generated based on their address, which is in a 1-to-1 relationship with their public key.

In Ethereum, developers use multi-signature wallets like gnosis. They are just introducing so-called **account abstraction** with the ERC-4337 standard. This standard extends the functionality of wallets, such as sending transactions without a native token, recovering accounts after loss, etc.

Still, it's worth noting that wallet accounts are much more expensive to use in terms of gas fees compared to EOA in Ethereum.

#### TON

In TON, all wallets are smart contracts that the user must deploy. Since developers can configure smart contracts in different ways and have other features, there are several versions of wallets, which you can read about [here](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts/).

Because wallets are smart contracts, users can have multiple wallets with different addresses and initial parameters. To send a transaction, the user must sign the message with their private key and send it to their wallet contract, which forwards it to the smart contract of a particular DApp application. This approach dramatically increases flexibility in wallet design, and developers can add new versions of the wallet in the future.

### Transaction

#### Ethereum

Recall that in Ethereum transactions are cryptographically signed instructions from accounts. An account will initiate a transaction to update the state of the Ethereum network. The most straightforward transaction is transferring ETH from one account to another.

Transaction flow

1. A transaction hash is cryptographically generated: `0x97d99bc7729211111a21b12c933c949d4f31684f1d6954ff477d0477538ff017`
2. The transaction is then broadcast to the network and added to a transaction pool consisting of all other pending network transactions.
3. A validator must pick your transaction and include it in a block to verify and consider it successful.
4. As time passes, the block containing your transaction will be upgraded to `justified` and then `finalized.` These upgrades ensure that your transaction was successful and will never be altered. Once a block is finalized, it could only ever be changed by a network-level attack that would cost many billions of dollars.

#### TON

In TON, the entity that transfers data between two contracts is called a message. For example, a message contains arbitrary data about a token transfer sent to a specified address. When the message arrives at the contract, the contract processes this according to the code. The contract updates its state and optionally sends a new message. [Transaction](/v3/documentation/smart-contracts/message-management/messages-and-transactions/) is an entire flow from receiving messages to executing actions on the account.

For example, consider the interaction of accounts where we have messages from contract **A** to contract **B**. In this case, we have one message and two transactions.

But initially, to change the state of the blockchain, you need an outside signal. To invoke a smart contract, you need to send an external message to the validators, and they will apply it to the smart contract.

As we already discussed, a wallet is a smart contract, so this external message usually first goes to the wallet's smart contract, which records them as the first transaction, and that first transaction usually contains an embedded message for the actual destination contract.

When the wallet smart contract receives the message, it processes it and delivers it to the destination contract. In our example, contract **A** could be a wallet; when it receives the external message, it will have the first transaction.

We can represent the sequence of transactions as a chain. In this representation, each smart contract has its transactions, which means that each contract has its blockchain, so the network can process the transactions independently.

:::info
Read more in [Blockchain of blockchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)
:::

### Gas

#### Ethereum

In Ethereum, users pay fees in their native currency, ether (ETH). Usually, one quotes gas prices in gwei, which is a denomination of ETH. Each gwei is equal to one billionth of an ETH.

For example, 0.000000001 ether is equal to 1 gwei.

The gas cost is divided into a base fee set by the protocol and a `priority fee` that the user adds to speed up transaction processing by validators.

The `total fee` is equal:

```
total fee = units of gas used * (base fee + priority fee).
```

Additionally, storage in Ethereum is essentially free, meaning that once data is stored on the blockchain, there is no ongoing cost for keeping it there.

#### TON

The contract nominates all computation costs in gas units and fixes them in a specific gas amount. The blockchain config defines the gas, and one pays for it in Toncoins.

The chain configuration determines the price of gas units and may be changed only by consensus of validators. Note that, unlike in other systems, the user cannot set their gas price, and there is no fee market.
In TON, the calculation of transaction fees is complex. It includes several types of fees:

- fees for storing smart contracts in the blockchain
- fees for importing messages into the blockchain
- fees for executing code on a virtual machine
- fees for processing actions after code execution
- fees for sending messages outside the TON blockchain

The price of gas and some other parameters can be changed by voting on the main network. Unlike Ethereum, TON users cannot set the gas price themselves. Also, the developer needs to return the remaining gas funds to the owner manually, otherwise they will remain locked. Smart contract storage also affects the price: if a wallet's smart contract remains unused for a long time, the next transaction will incur higher costs.

:::info
Read more about [gas](/v3/documentation/smart-contracts/transaction-fees/fees/)
:::

### Architecture

#### Ethereum

Ethereum inherits and extends the foundational principles of Bitcoin. This approach gives developers the flexibility to create complex DApps. A unique feature of Ethereum is its ability to provide each account with an individualized data store, allowing transactions to perform token transfers and change the state of the blockchain by interacting with smart contracts. As we know, this ability to synchronously interact between accounts offers great promise for application development, but also raises the issue of scalability. Each transaction on the Ethereum network requires nodes to update and maintain the entire state of the blockchain, which leads to significant latency and increases the cost of gas as network utilization increases.

#### TON

TON offers an alternative approach to improve scalability and performance in response to these challenges. Designed to provide developers with maximum flexibility to create various applications, TON uses the concept of shards and the MasterChain to optimize the block creation process. Each TON ShardChain and MasterChain generates a new block on average every 3 seconds, ensuring fast transaction execution. Unlike Ethereum, where state updates are synchronous, TON implements asynchronous messaging between smart contracts, allowing each transaction to be processed independently and in parallel, significantly speeding up transaction processing on the network. Sections and articles to familiarize yourself with:

- [Shards](/v3/documentation/smart-contracts/shards/shards-intro/)
- [Comparison of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)

In conclusion, by comparing TON and Ethereum's architecture and technological underpinnings, it's clear that TON offers significant advantages. With its innovative approach to asynchronous transaction processing and unique shard and MasterChain architecture, TON demonstrates the potential to support millions of transactions per second without compromising security or centralization. High scalability provides the platform with outstanding flexibility and efficiency, making it ideal for various applications.

## See also

- [Smart contract addresses](/v3/concepts/dive-into-ton/ton-blockchain/smart-contract-addresses/)

<Feedback />

