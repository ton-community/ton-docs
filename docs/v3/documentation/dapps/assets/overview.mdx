import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Asset processing overview

Here you can find a **short overview** on [how TON transfers work](/v3/documentation/dapps/assets/overview#overview-on-messages-and-transactions), what [asset types](/v3/documentation/dapps/assets/overview#digital-asset-types-on-ton) can you find in TON (and what about will you read [next](/v3/documentation/dapps/assets/overview#read-next)) and how to [interact with ton](/v3/documentation/dapps/assets/overview#interaction-with-ton-blockchain) using your programming language, it's recommended to understand all information, discovered below, before going to the next pages.

## Overview on messages and transactions

Embodying a fully asynchronous approach, TON Blockchain involves a few concepts which are uncommon to traditional blockchains. Particularly, each interaction of any actor with the blockchain consists of a graph of asynchronously transferred [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions) between smart contracts and/or the external world. Each transaction consists of one incoming message and up to 255 outgoing messages.

There are 3 types of messages, that are fully described [here](/v3/documentation/smart-contracts/message-management/sending-messages#types-of-messages). To put it briefly:
* [external message](/v3/documentation/smart-contracts/message-management/external-messages):
  *  `external in message` (sometimes called just `external message`) is message that is sent from *outside* of the blockchain to a smart contract *inside* the blockchain.
  *  `external out message` (usually called `logs message`) is sent from a *blockchain entity* to the *outer world*.
* [internal message](/v3/documentation/smart-contracts/message-management/internal-messages) is sent from one *blockchain entity* to *another*, can carry some amount of digital assets and arbitrary portion of data.

The common path of any interaction starts with an external message sent to a `wallet` smart contract, which authenticates the message sender using public-key cryptography, takes charge of fee payment, and sends internal blockchain messages. That messages queue form directional acyclic graph, or a tree.

For example:

![](/img/docs/asset-processing/alicemsgDAG.svg)

* `Alice` use e.g [Tonkeeper](https://tonkeeper.com/) to send an `external message` to her wallet.
* `external message` is the input message for `wallet A v4` contract with empty source (a message from nowhere, such as [Tonkeeper](https://tonkeeper.com/)).
* `outgoing message` is the output message for `wallet A v4` contract and input message for `wallet B v4` contract with `wallet A v4` source and `wallet B v4` destination.

As a result there are 2 transactions with their set of input and output messages.

Each action, when contract take message as input (triggered by it), process it and generate or not generate outgoing messages as output, called `transaction`. Read more about transactions [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction).

That `transactions` can span a **prolonged period** of time. Technically, transactions with queues of messages are aggregated into blocks processed by validators. The asynchronous nature of the TON Blockchain **does not allow to predict the hash and lt (logical time) of a transaction** at the stage of sending a message.

The `transaction` accepted to the block is final and cannot be modified.

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Smart contracts pay several types of [fees](/v3/documentation/smart-contracts/transaction-fees/fees) for transactions (usually from the balance of an incoming message, behavior depends on [message mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)). Amount of fees depends on workchain configs with maximal fees on `masterchain` and substantially lower fees on `basechain`.

## Digital asset types on TON

TON has three types of digital assets.
- Toncoin, the main token of the network. It is used for all basic operations on the blockchain, for example, paying gas fees or staking for validation.
- Contract assets, such as tokens and NFTs, which are analogous to the ERC-20/ERC-721 standards and are managed by arbitrary contracts and thus can require custom rules for processing. You can find more info on it's processing in [process NFTs](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) and [process Jettons](/v3/guidelines/dapps/asset-processing/jettons) articles.
- Native token, which is special kind of assets that can be attached to any message on the network. But these asset is currently not in use since the functionality for issuing new native tokens is closed.

## Interaction with TON Blockchain
Basic operations on TON Blockchain can be carried out via TonLib. It is a shared library which can be compiled along with a TON node and expose APIs for interaction with the blockchain via so-called lite servers (servers for lite clients). TonLib follows a trustless approach by checking proofs for all incoming data; thus, there is no necessity for a trusted data provider. Methods available to TonLib are listed [in the TL scheme](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234). They can be used either as a shared library via [wrappers](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks).

## Read next

After reading this article you can check:
1. [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing) to get how to work with `TON coins`
2. [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons) to get how to work with `jettons` (sometime called `tokens`)
3. [NFT processing](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) to get how to work with `NFT` (that is the special type of `jetton`)

<Feedback />

