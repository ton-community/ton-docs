import Button from '@site/src/components/button'

# TON 节点类型

深入了解开放网络（TON）的世界时，理解不同的节点类型及其功能至关重要。本文为希望与TON区块链互动的开发者详细介绍了每种节点类型。

## 全节点

TON中的**全节点**是与区块链保持同步的节点。

它保留了区块链的_当前状态_，可以包含整个区块历史或其部分。这使其成为TON区块链的支柱，促进网络的去中心化和安全。

<Button href="/participate/run-nodes/full-node"
colorType="primary" sizeType={'sm'}>

运行全节点

</Button>

## 验证者节点

当**验证者节点**持有足够数量的Toncoin作为质押代币时，它将被激活。验证者节点对网络的运行至关重要，参与新网络区块的验证。

TON基于权益证明机制运行，其中验证者在维护网络功能方面发挥着关键作用。验证者会因其贡献而[以Toncoin获得奖励](/participate/network-maintenance/staking-incentives)，激励网络参与并确保网络安全。

[作为验证者运行全节点](/participate/run-nodes/full-node#become-a-validator)

## 全节点 + Liteserver

当在全节点上激活端点时，节点将承担**Liteserver**的角色。这种节点类型可以处理并响应来自轻客户端的请求，允许与TON区块链无缝互动。

### 轻客户端：与 TON 交互的SDK

Liteservers使与轻客户端的快速通信成为可能，便于执行检索余额或提交交易等任务，而不需要完整的区块历史。

每个支持ADNL协议的SDK都可以使用`config.json`文件作为轻客户端。`config.json`文件包含了可以用来连接TON区块链的端点列表。

[选择TON SDK](/develop/dapps/apis/sdk)

每个不支持ADNL的SDK通常使用HTTP中间件来连接TON区块链。它的安全性和速度不如ADNL，但使用起来更简单。

### 与 TON 的互动：公共Liteservers（端点）

TON基金会提供了几个公共Liteservers，集成到全局配置中，可供普遍使用。这些端点，如标准钱包使用的端点，确保即使不设置个人liteserver，也能与TON区块链进行交互。

- [公共Liteserver配置 - 主网](https://ton.org/global-config.json)
- [公共Liteserver配置 - 测试网](https://ton.org/testnet-global.config.json)

在您的应用程序中使用下载的`config.json`文件与TON SDK。

#### 故障排除

##### 故障排除

如果您看到此错误，这意味着您尝试连接的liteserver不可用。解决公共liteservers问题的正确方法如下：

1. 从tontech链接下载config.json文件：

```bash
wget https://api.tontech.io/ton/wallet-mainnet.autoconf.json -O /usr/bin/ton/global.config.json
```

它会从配置文件中移除响应慢的liteservers。

2. 在您的应用程序中使用下载的`config.json`文件与TON SDK(/participate/nodes/node-types#lite-clients-the-sdks-to-interact-with-ton)。

### 作为 Liteserver 运行全节点

如果你的项目需要高度_安全_，你可以运行自己的 Liteserver。要将完整节点作为 Liteserver 运行，只需在节点配置文件中启用 Liteserver 模式即可：

[在节点中启用 Liteserver](/participate/run-nodes/full-node#enable-liteserver-mode)

## 归档节点

[在节点中启用Liteserver](/participate/run-nodes/full-node#enable-liteserver-mode)

这种节点对于创建需要完整区块链历史的区块链浏览器或其他工具至关重要。

**归档节点**本质上是存档整个区块历史的全节点。
