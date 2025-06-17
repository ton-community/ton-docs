import Feedback from '@site/src/components/Feedback';

import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 资产处理概述

在这里您可以找到关于[TON转账如何工作](/v3/documentation/dapps/assets/overview#overview-on-messages-and-transactions)的**简短概述**、您可以在 TON 中找到哪些 [资产类型](/v3/documentation/dapps/assets/overview#digital-asset-types-on-ton)（以及您将阅读 [下一个](/v3/documentation/dapps/assets/overview#read-next)），以及如何使用您的编程语言 [与 TON 交互](/v3/documentation/dapps/assets/overview#interaction-with-ton-blockchain)、建议在进入下一页之前，先了解下面发现的所有信息。

## 消息和交易概述

Embodying a fully asynchronous approach, TON Blockchain involves a few concepts which are uncommon to traditional blockchains. Particularly, each interaction of any actor with the blockchain consists of a graph of asynchronously transferred [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions) between smart contracts and/or the external world. Each transaction consists of one incoming message and up to 255 outgoing messages.

[这里](/v3/documentation/smart-contracts/message-management/sending-messages#types-of-messages) 全面介绍了 3 种信息类型。简而言之 To put it briefly:

- [external message](/v3/documentation/smart-contracts/message-management/external-messages):
  - `external in message`（有时也称为 `external message`）是指从区块链外部_向区块链内部_的智能合约发送的消息。
  - `external in message`（有时也称为 `external message`）是指从区块链外部_向区块链内部_的智能合约发送的消息。
- [internal message](/v3/documentation/smart-contracts/message-management/internal-messages)从一个_区块链实体_发送到_另一个_，可携带一定数量的数字资产和任意部分的数据。

任何交互的共同路径都是从向 `钱包` 智能合约发送外部消息开始的，`钱包` 智能合约使用公钥加密技术验证消息发送者的身份，负责支付费用，并发送内部区块链消息。信息队列形成定向非循环图或树状图。 That messages queue form directional acyclic graph, or a tree.

例如

![](/img/docs/asset-processing/alicemsgDAG.svg)

- `Alice` 使用 [Tonkeeper](https://tonkeeper.com/) 向她的钱包发送 `external message`。
- `external message` 是 `wallet A v4` 合约的输入信息，其来源为空（不知从何而来的信息，如 [Tonkeeper](https://tonkeeper.com/)）。
- `outgoing message` 是  `wallet A v4`  合约的输出信息和 `wallet B v4` 合约的输入信息，`wallet A v4` 是来源地，`wallet B v4` 是目的地。

因此，有 2 个事务及其输入和输出信息集。

当合约将消息作为输入（由其触发）时，对其进行处理并生成或不生成外发消息作为输出的每个动作都称为 "事务"。点击 [这里 ](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction)阅读更多关于事务的信息。 Read more about transactions [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions#what-is-a-transaction).

That `transactions` can span a **prolonged period** of time. Technically, transactions with queues of messages are aggregated into blocks processed by validators. 这种 "事务" 可以跨越一段**长**的时间。从技术上讲，具有信息队列的交易被汇总到验证器处理的区块中。TON区块链的异步性质**无法在发送消息阶段预测交易**的哈希值和逻辑时间。

区块接受的 "交易" 是最终的，不能修改。

:::info 交易确认
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

智能合约为交易支付多种类型的[手续费](/v3/documentation/smart-contracts/transaction-fees/fees)（通常从收到的消息余额中支付，行为取决于[消息模式](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)）。费用金额取决于工作链配置，"主链 "上的费用最高，"基础链 "上的费用最低。 Amount of fees depends on workchain configs with maximal fees on `masterchain` and substantially lower fees on `basechain`.

## TON 上的数字资产类型

TON 拥有三类数字资产。

- Toncoin 是网络的主要代币。它可用于区块链上的所有基本操作，例如支付
  gas 费或为验证进行押注。 It is used for all basic operations on the blockchain, for example, paying gas fees or staking for validation.
- Contract assets, such as tokens and NFTs, which are analogous to the ERC-20/ERC-721 standards and are managed by arbitrary contracts and thus can require custom rules for processing. You can find more info on it's processing in [process NFTs](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) and [process Jettons](/v3/guidelines/dapps/asset-processing/jettons) articles.
- Native token, which is special kind of assets that can be attached to any message on the network. But these asset is currently not in use since the functionality for issuing new native tokens is closed.

## 与 TON 区块链的互动

Basic operations on TON Blockchain can be carried out via TonLib. It is a shared library which can be compiled along with a TON node and expose APIs for interaction with the blockchain via so-called lite servers (servers for lite clients). TonLib follows a trustless approach by checking proofs for all incoming data; thus, there is no necessity for a trusted data provider. TON 区块链上的基本操作可通过 TonLib 进行。它是一个共享库，可以与 TON 节点一起编译，并通过所谓的精简版服务器（精简版客户端的服务器）公开与区块链交互的 API。TonLib 采用无信任方法，检查所有传入数据的证明；因此，无需可信数据提供者。TonLib 可用的方法在[TL 方案](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234) 中列出。这些方法可通过[wrappers](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks) 作为共享库使用。 They can be used either as a shared library via [wrappers](/v3/guidelines/dapps/asset-processing/payments-processing/#sdks).

## 阅读下一页

阅读本文后，您可以查看

1. [支付处理](/v3/guidelines/dapps/asset-processing/payments-processing)，了解如何使用 "TON coins"。
2. [Jetton处理](/v3/guidelines/dapps/asset-processing/jettons) 以了解如何使用 "jettons"（有时称为 "tokens"）。
3. [NFT处理](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) 以了解如何使用 "NFT"（即 "jetton "的特殊类型）。

<Feedback />

