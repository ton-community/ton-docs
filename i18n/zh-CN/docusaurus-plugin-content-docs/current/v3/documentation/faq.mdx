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

1. 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)
2. 工作链支持跨分片活动，这意味着用户可以在同一网络中的不同分片链或工作链之间进行交互。在当前的 L2 解决方案中，跨分片操作通常比较复杂，需要额外的桥接或互操作性解决方案。例如，在 TON 中，用户可以轻松地在不同分片链之间交换代币或执行其他交易，而无需复杂的程序。
3. 可扩展性是现代区块链系统面临的主要挑战之一。在传统的 L2 解决方案中，可扩展性受到定序器容量的限制。如果 L2 上的 TPS（每秒交易量）超过排序器的容量，就会导致问题。在 TON 的工作链中，这个问题可以通过划分分片来解决。当一个分片上的负载超过其容量时，该分片会被自动划分为两个或更多分片，从而使系统几乎可以无限制地扩展。

### TON 是否需要 L2？

在任何交易成本下，总有一些应用无法承受这样的费用，但却能以更低的成本运行。同样，无论实现的延迟时间有多长，总有一些应用程序需要更低的延迟时间。因此，可以想象，最终可能需要在 TON 平台上提供 L2 解决方案，以满足这些特定要求。

## MEV

### 区块时间

*2-5秒*

此外，目前的 TON 架构缺乏确定交易费用的市场机制。佣金是固定的，不会根据交易的优先顺序发生变化，这就降低了前置运行的吸引力。由于固定的费用和交易顺序的确定性，在 TON 中进行前置运行并非易事。

## 最终确定时间

### 获取区块信息的RPC方法是什么？

验证器生成的区块。可通过 Liteservers 访问的现有区块。通过 Liteservers 访问 Lite Clients。在 Lite Client 的基础上构建第三方工具，如钱包、explorers、dapps 等。

- 要访问轻客户端核心，请查看我们GitHub的这个部分：[ton-blockchain/tonlib](https://github.com/ton-blockchain/ton/tree/master/tonlib)

此外，这里有三个高级第三方区块浏览器：

- https://explorer.toncoin.org/last
- https://toncenter.com/
- https://tonwhales.com/explorer

如需了解更多信息，请参阅我们文档中的 [ TON 级探索者](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton) 部分。

### 区块时间

*2-5秒*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- [区块链比较文件](https://ton.org/comparison_of_blockchains.pdf)
- [区块链比较表（信息量比文档少得多，但更直观）](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)
  :::

### 获取交易数据的RPC方法是什么？

*小于6秒*

:::info
Compare TON's on-chain metrics, including block time and time-to-finality, to Solana and Ethereum by reading our analysis at:

- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果

### 平均区块大小

```bash
max block size param 29
max_block_bytes:2097152
```

:::info:::

### TON 上的区块布局是怎样的？

钱包合约转账的示例（低层级）：

- [区块布局](/v3/documentation/data-formats/tlb/block-layout)

## 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

### 获取交易数据的RPC方法是什么？

- [见上面的答复](/v3/documentation/faq#are-there-any-standardized-protocols-for-minting-burning-and-transferring-fungible-and-non-fungible-tokens-in-transactions)

### TON 交易是异步的还是同步的？是否有文档显示这个系统是如何工作的？

TON区块链消息是异步的：

- 发送者准备交易正文（消息boc）并通过轻客户端（或更高级工具）广播
- 轻客户端返回广播状态，而非执行交易的结果
- 发送者通过监听目标账户（地址）状态或整个区块链状态来检查期望结果

是的，TON上可以通过两种不同的方式实现交易批量处理：

- 通过利用TON的异步特性，即向网络发送独立的交易

使用批量处理特性的合约示例（高负载钱包）：

- https://github.com/tonuniverse/highload-wallet-api

### 是否可以确定交易100%完成？查询交易级数据是否足以获得这些信息？

\*\*简短回答：\*\*要确保交易已完成，必须检查接收者的账户。

默认钱包（v3/v4）也支持在一笔交易中发送多达4条消息。

- Go: [钱包示例](https://github.com/xssnick/tonutils-go/blob/master/example/wallet/main.go)
- Python：[使用 TON 付款的店面机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot)
- JavaScript：[用于销售饺子的机器人](/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js)

### TON 的货币精度是多少？

*9位小数*

- [交易布局](/v3/documentation/data-formats/tlb/transaction-layout)

### 是否有标准化的协议用于铸造、销毁和交易中转移可替代和不可替代代币？

Jettons（代币）：

- [TEP-74：Jettons标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- [分布式代币概览](https://telegra.ph/Scalable-DeFi-in-TON-03-30)

其他标准：

- https://github.com/ton-blockchain/TEPs

其他标准：

## 标准

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

在TON上，所有数据都以boc消息的形式传输。这意味着在交易中使用NFT并不是特殊事件。相反，它是发送给或从（NFT或钱包）合约接收的常规消息，就像涉及标准钱包的交易一样。

:::info
Mainnet支持的小数位数：9位。
:::

### 账户结构

要更好地理解这个过程是如何工作的，请参阅[支付处理](/develop/dapps/asset-processing/)部分。

- [智能合约地址](/learn/overviews/addresses)
- [NFT 文档](/v3/documentation/dapps/defi/tokens#nft)

Jettons（代币）：

- [智能合约地址](/learn/overviews/addresses)
- [分布式 TON 代币概述](https://telegra.ph/Scalable-DeFi-in-TON-03-30)
- [可替换标记文档（Jettons）](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)

其他标准：

- https://github.com/ton-blockchain/TEPs

### 是否有用 Jettons（代币）和 NFT 解析事件的示例？

在TON上，所有数据都以boc消息的形式传输。这意味着在交易中使用NFT并不是特殊事件。相反，它是发送给或从（NFT或钱包）合约接收的常规消息，就像涉及标准钱包的交易一样。

对于**Jettons**合约必须实现[标准的接口](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)并在_get_wallet_data()_或_get_jetton_data()_方法上返回数据。

- https://docs.tonconsole.com/tonapi/rest-api

TON内有一个特殊的主链叫做Masterchain。它由网络范围内的合约组成，包括网络配置、与验证者相关的合约等：

## 是否有特殊账户（例如，由网络拥有的账户）与其他账户有不同的规则或方法？

### 地址格式是什么？

- [治理合约](/develop/smart-contracts/governance)

### 智能合约

是的，请使用TON DNS：

- [TON DNS 与域名](/v3/guidelines/web3/ton-dns/dns)

### 是否可以检测到 TON 上的合约部署事件？

- [万物皆智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)

### 如何判断地址是否为代币地址？

智能合约可以存在于未初始化状态，意味着其状态在区块链中不可用但合约有非零余额。初始状态本身可以稍后通过内部或外部消息发送到网络，因此可以监控这些来检测合约部署。

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

:::info
在 TON 区块链概述文章中阅读更多有关主链、工作链和分片链的信息：[区块链中的区块链](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)。
:::

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

- [治理合约](/v3/documentation/smart-contracts/contracts-specs/governance)

## 智能合约地址是否区分大小写？

### 是否可以检测到 TON 上的合约部署事件？

[TON中的一切都是智能合约](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract)。

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

[了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

- [通过 TonLib 部署钱包](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
- [为处理查询和发送回复付费](/v3/documentation/smart-contracts/transaction-fees/forward-fees)

### 是否可以为 TON 编写 Solidity？

目前，更新智能合约的能力是一种正常做法，在大多数现代协议中都得到了广泛应用。这是因为升级功能可以修复漏洞、添加新功能并提高安全性。

但如果您在Solidity语法中添加异步消息并能够与数据进行低层级交互，那么您可以使用FunC。FunC具有大多数现代编程语言通用的语法，并专为TON上的开发设计。

1. 关注声誉良好、开发团队知名的项目。
2. 信誉良好的项目总是会进行独立的代码审计，以确保代码安全可靠。请寻找那些已由信誉良好的审计公司完成过多次审计的项目。
3. 活跃的社区和积极的反馈可以作为项目可靠性的额外指标。
4. 检查项目实施更新流程的具体方式。流程越透明、越分散，用户面临的风险就越小。

### 推荐的节点提供商用于数据提取包括：

节点提供商合作伙伴：

有时，更新的逻辑可能存在，但更改代码的权利可能被转移到一个 "空"(empty) 地址，这也会阻止更改。

### 是否可以将代码重新部署到现有地址，还是必须作为新合约部署？

是的，这是可能的。如果智能合约执行特定指令（`set_code()`），其代码可以被更新并且地址将保持不变。

TON社区项目目录：

### 智能合约可以被删除吗？

是的，可以是存储费累积的结果（合约余额需要达到 -1  TON 才会被删除），也可以通过发送[模式 160](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) 信息来删除。

### 智能合约地址是否区分大小写？

是的，智能合约地址是区分大小写的，因为它们是使用 [base64 算法](https://en.wikipedia.org/wiki/Base64) 生成的。  你可以在 [这里](/v3/documentation/smart-contracts/addresses) 了解有关智能合约地址的更多信息。

### Ton 虚拟机（TVM）与 EVM 兼容吗？

TVM与以太坊虚拟机（EVM）不兼容，因为TON采用了完全不同的架构（TON是异步的，而以太坊是同步的）。

[了解更多关于异步智能合约](https://telegra.ph/Its-time-to-try-something-new-Asynchronous-smart-contracts-03-25)。

### 是否可以为 TON 编写 Solidity？

相关地，TON生态系统不支持在以太坊的Solidity编程语言中开发。

但如果您在Solidity语法中添加异步消息并能够与数据进行低层级交互，那么您可以使用FunC。FunC具有大多数现代编程语言通用的语法，并专为TON上的开发设计。

## 远程过程调用(RPC)

### 推荐的节点提供商用于数据提取包括：

API类型：

- 了解有关不同 [API 类型](/v3/guidelines/dapps/apis-sdks/api-types) （索引、HTTP 和 ADNL）的更多信息

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
