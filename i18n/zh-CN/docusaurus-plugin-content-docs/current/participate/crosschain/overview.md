# 跨链桥

去中心化的跨链桥在TON区块链上运行，允许您将资产从TON区块链转移到其他区块链，反之亦然。

## Toncoin 跨链桥

Toncoin 跨链桥允许您在TON区块链和以太坊区块链之间，以及TON区块链和BNB智能链之间转移Toncoin。

跨链桥由[去中心化预言机](/participate/crosschain/bridge-addresses)管理。

### 如何使用？

跨链桥的前端托管在 https://ton.org/bridge。

:::info
[跨链桥前端源代码](https://github.com/ton-blockchain/bridge)
:::

### TON-以太坊智能合约源代码

* [FunC (TON端)](https://github.com/ton-blockchain/bridge-func)
* [Solidity (以太坊端)](https://github.com/ton-blockchain/bridge-solidity/tree/eth_mainnet)


### TON-BNB智能链智能合约源代码

* [FunC (TON端)](https://github.com/ton-blockchain/bridge-func/tree/bsc)
* [Solidity (BSC端)](https://github.com/ton-blockchain/bridge-solidity/tree/bsc_mainnet)


### 区块链配置

您可以通过检查相应的配置来获取实际的跨链桥的智能合约地址和预言机地址：

TON-以太坊: [#71](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L738)。

TON-BSC: [#72](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L739)。

TON-Polygon: [#73](https://github.com/ton-blockchain/ton/blob/35d17249e6b54d67a5781ebf26e4ee98e56c1e50/crypto/block/block.tlb#L740)。


### 文档

* [跨链桥如何工作](https://github.com/ton-blockchain/TIPs/issues/24)

### 跨链路线图

* https://t.me/tonblockchain/146

## Tonana 跨链桥

### 如何参与？

:::caution 草案   
这是一篇概念文章。我们仍在寻找有经验的人来撰写。
:::

您可以在这里找到前端：https://tonana.org/

源代码在这里：https://github.com/tonanadao
