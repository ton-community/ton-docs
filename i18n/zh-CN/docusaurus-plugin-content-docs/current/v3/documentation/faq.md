import Feedback from '@site/src/components/Feedback';

# 常见问题解答

本节涵盖了关于TON区块链最受欢迎的问题。

## 概述

### 能分享一下关于 TON 的简要概述吗？

- [The Open Network简介](/learn/introduction)
- [TON区块链基于PoS共识](https://blog.ton.org/the-ton-blockchain-is-based-on-pos-consensus)
- [TON白皮书](/learn/docs)

### TON 与 EVM 区块链的主要相似之处和不同之处是什么？

- [从以太坊到TON](/learn/introduction#ethereum-to-ton)
- [TON、Solana和以太坊2.0的比较](https://ton.org/comparison_of_blockchains.pdf)

### TON 有测试环境吗？

- [Testnet测试网](/develop/smart-contracts/environment/testnet)

## 在任何交易成本下，总有一些应用无法承受这样的费用，但却能以更低的成本运行。同样，无论实现的延迟时间有多长，总有一些应用程序需要更低的延迟时间。因此，可以想象，最终可能需要在 TON 平台上提供 L2 解决方案，以满足这些特定要求。

### Why are workchains better than L1 → L2?

Workchains in TON offer several advantages over traditional L1 and L2 layer architecture:

1. **Instantaneous transactions**

One of blockchain's key advantages is the instantaneous processing of transactions. In traditional L2 solutions, there can be delays in moving assets between layers. WorkChains eliminate this problem by providing seamless and instantaneous transactions across the network. This is especially important for applications requiring high speed and low latency.

2. **Cross-shard activity**

WorkChains support cross-shard activity, allowing users to interact between different ShardChains or WorkChains within the same network. In current L2 solutions, cross-shard operations are complex and often require additional bridges or interoperability solutions. In TON, users can easily exchange tokens or perform other transactions between different ShardChains without complicated procedures.

3. **Scalability**

Scalability is a significant challenge for modern blockchain systems. In traditional L2 solutions, scalability is limited by the capacity of the sequencer. If the transactions per second (TPS) on L2 exceed the sequencer's capacity, it can cause problems. In TON, WorkChains solve this problem by dividing a shard when the load exceeds its capacity. This allows the system to scale almost without limits.

### TON 是否需要 L2？

While the TON platform offers highly optimized transaction fees and low latency, some applications may require lower transaction costs or further reduced latency. L2 solutions may be needed to meet specific application requirements in such cases. Thus, the need for L2 on TON could arise.

## MEV (Maximum Extractable Value)

### Is front-running possible in TON?

In the TON Blockchain, deterministic transaction ordering is critical to prevent front-running. Once transactions enter the pool, their order is predetermined and cannot be altered by any participant. This system ensures that no one can manipulate the order of transactions for profit.
Unlike blockchains such as Ethereum, where validators can change the order of transactions within a block, creating opportunities for MEV, TON’s architecture eliminates this possibility.

Additionally, TON does not rely on a market-based mechanism to determine transaction fees. Commissions are fixed and do not fluctuate based on transaction priority. This lack of fee variability further reduces the incentive and feasibility of front-running.
Due to the combination of fixed fees and deterministic transaction ordering,front-running in TON is not a trivial task.

## 区块

### 获取区块信息的RPC方法是什么？

验证器生成的区块。可通过 Liteservers 访问的现有区块。通过 Liteservers 访问 Lite Clients。在 Lite Client 的基础上构建第三方工具，如钱包、explorers、dapps 等。 Additionally, third-party tools like wallets, explorers, and dApps are built on top of lite clients.

To access the core lite client, visit our GitHub repository:

要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

此外，这里有三个高级第三方区块浏览器：

- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

如需了解更多信息，请参阅我们文档中的 [ TON 级探索者](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) 部分。

### 区块时间

_2-5秒_

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- [区块链比较文件](https://ton.org/comparison_of_blockchains.pdf)
- [区块链比较表（信息量比文档少得多，但更直观）](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### 最终确定时间

Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)
- 在 TON 区块链概述文章中阅读更多有关主链、工作链和分片链的信息：[区块链中的区块链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)。
  :::

### 平均区块大小

```bash
max block size param 29
max_block_bytes:2097152
```

:::info
是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。
:::

### TON 上的区块布局是怎样的？

[区块布局](/v3/documentation/data-formats/tlb/block-layout)

## Transactions

### 获取交易数据的RPC方法是什么？

For details, please refer to the previous answer:

- [见上面的答复](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### Is the TON transaction asynchronous or synchronous? Can I access documentation that shows how this system works?

TON区块链消息是异步的：

- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果
- 发送者通过监听目标账户（地址）状态或整个区块链状态来检查期望结果

An explanation of how TON asynchronous messaging works is provided in the context of **wallet smart contracts**:

- [How TON wallets work and how to access them using JavaScript](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

钱包合约转账的示例（低层级）：

- [分布式 TON 代币概述](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

### 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？ 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

\*\*简短回答：\*\*要确保交易已完成，必须检查接收者的账户。
For more details on transaction verification, refer to the following examples:

- Go: [钱包示例](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python：[使用 TON 付款的店面机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript：[用于销售饺子的机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### TON 交易是异步的还是同步的？是否有文档显示这个系统是如何工作的？

Detailed explanations of each field in the transaction layout can be found here:

- [交易布局](/v3/documentation/data-formats/tlb/transaction-layout)

### Is transaction batching possible?

是的，TON上可以通过两种不同的方式实现交易批量处理：

1. **Asynchronous transactions:** by sending independent transactions to the network.
2. **Using smart contracts:** smart contracts can receive tasks and execute them in batches.

使用批量处理特性的合约示例（高负载钱包）：

- https://github.com/tonuniverse/highload-wallet-api

默认钱包（v3/v4）也支持在一笔交易中发送多达4条消息。

## 标准

### TON 的货币精度是多少？

_9位小数_

:::info
Mainnet supports a 9-digit accuracy for currencies.
:::

### 是否有标准化的协议用于铸造、销毁和交易中转移可替代和不可替代代币？

Non-fungible tokens (NFTs):

- https://github.com/ton-blockchain/TEPs
- [NFT 文档](/v3/documentation/dapps/defi/tokens#nft)

Jettons（代币）：

- [TEP-74：Jettons标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [分布式代币概览](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [可替换标记文档（Jettons）](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

其他标准：

- https://github.com/ton-blockchain/TEPs

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

On TON, all data is transmitted as BOC (Binary Object Container) messages. Using NFTs in transactions is treated as a regular message, similar to a transaction involving a standard wallet.

Certain indexed APIs allow you to view all messages sent to or from a contract and filter them based on your needs.

- https://docs.tonconsole.com/tonapi/rest-api

要更好地理解这个过程是如何工作的，请参阅[支付处理](/develop/dapps/asset-processing/)部分。

## 账户结构

### 地址格式是什么？

- [万物皆智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### Is it possible to have a named account similar to ENS

是的，请使用TON DNS：

- [TON DNS 与域名](/v3/guidelines/web3/ton-dns/dns)

### How to distinguish between a normal account and a smart contract?

- [治理合约](/develop/smart-contracts/governance)

### 如何判断地址是否为代币地址？

To identify a **Jetton** contract:

- 对于**Jettons**合约必须实现[标准的接口](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)并在_get_wallet_data()_或_get_jetton_data()_方法上返回数据。
- It should respond to:
  - Jettons（代币）：
  - `get_jetton_data()` —  for the main Jetton master contract

### 是否有特殊账户（例如，由网络拥有的账户）与其他账户有不同的规则或方法？

Yes. TON includes a special master blockchain called the **MasterChain**, which holds contracts critical for network operations, including network-wide contracts with network configuration, validator-related contracts, etc.

:::info
TON内有一个特殊的主链叫做Masterchain。它由网络范围内的合约组成，包括网络配置、与验证者相关的合约等：
:::

A good example is a smart governance contract, which is a part of MasterChain:

- [治理合约](/v3/documentation/smart-contracts/contracts-specs/governance)

## 智能合约

### 是否可以检测到 TON 上的合约部署事件？

[TON中的一切都是智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)。

An account address in TON is deterministically derived from its _initial state_, consisting of the _initial code_  and _initial data_. For wallets, the initial data typically includes a public key and other parameters.
If any part of the initial state changes, the resulting address will also change.

智能合约可以存在于未初始化状态，意味着其状态在区块链中不可用但合约有非零余额。初始状态本身可以稍后通过内部或外部消息发送到网络，因此可以监控这些来检测合约部署。 The initial state can be submitted to the network later via internal or external messages—these messages can be monitored to detect when a contract is deployed.

To prevent message chains from getting stuck due to missing contracts, TON uses a "bounce" feature. You can read more about it in the following articles:

- [通过 TonLib 部署钱包](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [为处理查询和发送回复付费](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### Does the upgradability of a smart-contract pose a threat to its users?

目前，更新智能合约的能力是一种正常做法，在大多数现代协议中都得到了广泛应用。这是因为升级功能可以修复漏洞、添加新功能并提高安全性。 Upgradability allows developers to fix bugs, add new features, and enhance security over time.

How to mitigate the risks:

1. 关注声誉良好、开发团队知名的项目。
2. Reputable projects typically undergo independent code audits to ensure the smart contract is secure and reliable. Look for multiple completed audits from trusted auditing firms.
3. 活跃的社区和积极的反馈可以作为项目可靠性的额外指标。
4. Review how the project handles updates. The more transparent and decentralized the upgrade process is, the lower the risk for users.

### How can users be sure that the contract owner will not change certain conditions via an update?

The contract must be verified, which means its source code is publicly available for inspection. This allows users to confirm whether any upgrade logic is present. If the contract contains no mechanisms for modification, its behavior and terms are guaranteed to remain unchanged after deployment.

有时，更新的逻辑可能存在，但更改代码的权利可能被转移到一个 "空"(empty) 地址，这也会阻止更改。 This effectively removes the ability to make future changes.

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

However, if a contract is not designed to execute `set_code()` internally or via external code, it is immutable. In this case, the contract's code cannot be changed, and it is impossible to redeploy a different contract to the same address.

### 智能合约可以被删除吗？

Yes. A smart contract can be deleted in one of two ways:

- Through storage fee accumulation—if the contract’s balance drops to -1 TON, it will be automatically deleted.
- By sending a message with [mode 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 智能合约地址是否区分大小写？

是的，智能合约地址是区分大小写的，因为它们是使用 [base64 算法](https://en.wikipedia.org/wiki/Base64) 生成的。  你可以在 [这里](/v3/documentation/smart-contracts/addresses) 了解有关智能合约地址的更多信息。 You can learn more about how smart contract addresses work [here](/v3/documentation/smart-contracts/addresses).

### Ton 虚拟机（TVM）与 EVM 兼容吗？

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。
TON uses an entirely different architecture: **asynchronous**, while Ethereum operates synchronously.

[了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

### 是否可以为 TON 编写 Solidity？

相关地，TON生态系统不支持在以太坊的Solidity编程语言中开发。

However, extending Solidity with asynchronous messaging and low-level data access would end up with something like FunC.

FunC is TON's native smart contract language. It features a syntax similar to many modern programming languages and was explicitly built for TON's architecture.

## 远程过程调用(RPC)

### 推荐的节点提供商用于数据提取包括：

API类型：

了解有关不同 [API 类型](/v3/guidelines/dapps/apis-sdks/api-types) （索引、HTTP 和 ADNL）的更多信息

节点提供商合作伙伴：

- https://toncenter.com/api/v2/
- [getblock.io](https://getblock.io/)
- https://www.orbs.com/ton-access/
- [toncenter/ton-http-api](https://github.com/toncenter/ton-http-api)
- [nownodes.io](https://nownodes.io/nodes)
- https://dton.io/graphql

TON社区项目目录：

- [ton.app](https://ton.app/)

### 以下提供了两个主要资源，用于获取与TON区块链公共节点端点相关的信息（适用于TON Mainnet和TON Testnet）。

- [网络配置](/v3/documentation/network/configs/network-configs)
- [示例和教程](/v3/guidelines/dapps/overview#tutorials-and-examples)

<Feedback />

