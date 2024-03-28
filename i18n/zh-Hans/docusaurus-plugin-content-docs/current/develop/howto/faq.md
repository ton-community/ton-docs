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

## 区块

### 获取区块信息的RPC方法是什么？

验证者生产区块。现有区块通过Liteservers可用。Liteservers通过轻客户端访问。在轻客户端之上构建了第三方工具，如钱包、浏览器、dapps等。

- 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

此外，这里有三个高级第三方区块浏览器：
- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

在我们文档的[Explorers in TON](/participate/explorers)部分阅读更多。

### 区块时间

_2-5秒_

:::info
通过阅读我们在[ton.org/analysis](https://ton.org/analysis)上的分析，比较TON的链上指标，包括区块时间和最终确定时间。
:::

### 最终确定时间

_小于6秒_

:::info
通过阅读我们在[ton.org/analysis](https://ton.org/analysis)上的分析，比较TON的链上指标，包括区块时间和最终确定时间。
:::

### 平均区块大小

```bash 
max block size param 29
max_block_bytes:2097152
```

:::info
在[Network Configs](/develop/howto/network-configs)中找到更多实际参数。
:::

### TON 上的区块布局是怎样的？

对布局中每个字段的详细解释：

- [区块布局](/develop/data-formats/block-layout)

## 交易

### 获取交易数据的RPC方法是什么？

- [请参见上面的答案](/develop/howto/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### TON 交易是异步的还是同步的？是否有文档显示这个系统是如何工作的？

TON区块链消息是异步的：
- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果
- 发送者通过监听目标账户（地址）状态或整个区块链状态来检查期望结果

使用一个与钱包智能合约相关的例子来解释TON异步消息传递是如何工作的：
- [TON钱包如何工作，以及如何使用JavaScript访问它们](https://blog.ton.org/how-ton-wallets-work-and-how-to-access-them-from-javascript#1b-sending-a-transfer)

钱包合约转账的示例（低层级）：
- https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go

### 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

**简短回答：**要确保交易已完成，必须检查接收者的账户。

要了解有关交易验证的更多信息，请参阅以下示例：
- Go: [钱包示例](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python: [带支付的Storefront bot](/develop/dapps/tutorials/accept-payments-in-a-telegram-bot)
- JavaScript: [饺子销售机器人](/develop/dapps/tutorials/accept-payments-in-a-telegram-bot-js)

### TON 中交易的布局是怎样的？

对布局中每个字段的详细解释：
- [交易布局](/develop/data-formats/transaction-layout)

### 是否可以批量处理交易？

是的，TON上可以通过两种不同的方式实现交易批量处理：
- 通过利用TON的异步特性，即向网络发送独立的交易
- 通过使用接收任务并将其作为批处理执行的智能合约

使用批量处理特性的合约示例（高负载钱包）：
- https://github.com/tonuniverse/highload-wallet-api

默认钱包（v3/v4）也支持在一笔交易中发送多达4条消息。

## 标准

### TON 的货币精度是多少？

_9位小数_

:::info
Mainnet支持的小数位数：9位。
:::

### 是否有标准化的协议用于铸造、销毁和交易中转移可替代和不可替代代币？

非同质化代币（NFT）：
- [TEP-62：NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
- [NFT文档](/develop/dapps/defi/tokens#nft)

Jettons（代币）：
- [TEP-74：Jettons标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [分布式代币概览](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [可替代代币文档（Jettons）](/develop/dapps/defi/tokens#jettons)

其他标准：
- https://github.com/ton-blockchain/TEPs

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

在TON上，所有数据都以boc消息的形式传输。这意味着在交易中使用NFT并不是特殊事件。相反，它是发送给或从（NFT或钱包）合约接收的常规消息，就像涉及标准钱包的交易一样。

然而，某些索引的API允许您查看发送到或从合约发送的所有消息，并根据您的特定需求对它们进行过滤。

- https://tonapi.io/swagger-ui

要更好地理解这个过程是如何工作的，请参阅[支付处理](/develop/dapps/asset-processing/)部分。

## 账户结构

### 地址格式是什么？

- [智能合约地址](/learn/overviews/addresses)

### 是否可以拥有类似于 ENS 的命名账户

是的，请使用TON DNS：
- [TON DNS和域名](/participate/web3/dns)

### 如何区分普通账户和智能合约？

- [一切都是智能合约](/learn/overviews/addresses#everything-is-a-smart-contract)

### 如何判断地址是否为代币地址？

对于**Jettons**合约必须实现[标准的接口](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)并在_get_wallet_data()_或_get_jetton_data()_方法上返回数据。

### 是否有特殊账户（例如，由网络拥有的账户）与其他账户有不同的规则或方法？

TON内有一个特殊的主链叫做Masterchain。它由网络范围内的合约组成，包括网络配置、与验证者相关的合约等：

:::info
在TON区块链概述文章中阅读更多关于masterchain、workchains和shardchains的信息：[Blockchain of Blockchains](/learn/overviews/ton-blockchain)。
:::

一个很好的例子是治理智能合约，它是masterchain的一部分：
- [治理合约](/develop/smart-contracts/governance)

## 智能合约

### 是否可以检测到 TON 上的合约部署事件？

[TON中的一切都是智能合约](/learn/overviews/addresses#everything-is-a-smart-contract)。

账户地址是从其_初始状态_确定生成的，其中包括_初始代码_和_初始数据_（对于钱包，初始数据包括公钥在内的其他参数）。当任何组件发生变化时，地址相应改变。

智能合约可以存在于未初始化状态，意味着其状态在区块链中不可用但合约有非零余额。初始状态本身可以稍后通过内部或外部消息发送到网络，因此可以监控这些来检测合约部署。

为了防止消息链在不存在的合约处中断，TON使用了“弹回”功能。在这些文章中了解更多信息：

- [通过TonLib部署钱包](https://ton.org/docs/develop/dapps/asset-processing/#deploying-wallet)
- [支付查询处理费用并发送响应](https://ton.org/docs/develop/smart-contracts/guidelines/processing)

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

如果合约最初无法执行`set_code()`（通过其代码或来自外部的其他代码的执行），那么它的代码将永远无法更改。没有人能够在同一地址重新部署带有其他代码的合约。

### 智能合约可以被删除吗？

是的，要么是由于存储费用累积的结果（合约需要达到-1 TON余额才能被删除），要么是通过发送带有[mode 160](https://docs.ton.org/develop/smart-contracts/messages#message-modes)的消息。

### 智能合约地址是否区分大小写？

是的，智能合约地址是区分大小写的，因为它们是使用[base64算法](https://en.wikipedia.org/wiki/Base64)生成的。您可以在[这里](/learn/overviews/addresses)了解更多关于智能合约地址的信息。

### Ton 虚拟机（TVM）与 EVM 兼容吗？

  TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

  [了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

### 是否可以为 TON 编写 Solidity？

  相关地，TON生态系统不支持在以太坊的Solidity编程语言中开发。

  但如果您在Solidity语法中添加异步消息并能够与数据进行低层级交互，那么您可以使用FunC。FunC具有大多数现代编程语言通用的语法，并专为TON上的开发设计。


## 远程过程调用(RPC)

### 推荐的节点提供商用于数据提取包括：

API类型：
- 了解更多关于不同[API类型](/develop/dapps/apis/)（索引、HTTP和ADNL）

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

- [网络配置](/develop/howto/network-configs)
- [示例和教程](/develop/dapps/#examples)
