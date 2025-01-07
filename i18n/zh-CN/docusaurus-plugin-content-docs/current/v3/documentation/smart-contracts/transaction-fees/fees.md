# 交易费用

每个TON用户都应该记住，*手续费取决于许多因素*。

## Gas

所有费用都以Gas计算。这是TON中用作费用的特殊货币。

所有费用都以一定数量的gas来指定和固定，但gas价格本身并不固定。今天的gas价格为：

当前的基础链设置如下：1 单位 gas 耗费 400  nanotons  。

```cpp
1 gas = 26214400 / 2^16 nanotons = 0,000 000 4 TON
```

主链的当前设置如下：1 单位 gas 耗费 10000  nanotons  。

```cpp
1 gas = 655360000 / 2^16 nanotons = 0,000 01 TON
```

### 平均交易成本

> **TLDR：** 今天，每笔交易的成本约为 **~0.005  TON**

像TON的许多其他参数一样，gas费用是可配置的，可以通过主网上的特殊投票来更改。

:::info
当前 gas 量分别写入主链和基链的网络配置 [param 20](https://tonviewer.com/config#20) 和 [param 21](https://tonviewer.com/config#21)。
:::

### Gas 的成本会更高吗？

与 TON 的许多其他参数一样， gas 费也是可配置的，可以通过主网的特别投票进行更改。

从技术上讲，是的；但实际上，不会。

#### gas 价格会更贵吗？

> *这是否意味着有一天gas价格可能会上涨1000倍甚至更多？*

TON上的费用难以提前计算，因为它们的数量取决于交易运行时间、账户状态、消息内容和大小、区块链网络设置以及无法在交易发送之前计算的其他许多变量。阅读关于[计算费用](/develop/howto/fees-low-level#computation-fees)的低层级文章概述。

这就是为什么即使NFT市场通常会额外收取大约1 TON的TON，并在稍后返还(*`1 - transaction_fee`*)。

### 如何计算费用？

TON 的费用很难提前计算，因为其金额取决于交易运行时间、账户状态、信息内容和大小、区块链网络设置以及其他一些变量，在交易发送之前无法计算。

根据[低层级费用概述](/develop/howto/fees-low-level)，TON上的费用按照以下公式计算：

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

查看[低级收费概述](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)，了解更多佣金计算公式；查看[收费计算](/v3/guidelines/smart-contracts/fee-calculation)，了解如何使用新的 TVM 操作码计算 FunC 合约中的收费。
:::

不过，让我们进一步了解一下 TON 的收费功能。

## 存储费

TON验证者从智能合约收取存储费用。

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## 交易费要素

- `storage_fees`是您为在区块链上存储智能合约而支付的金额。实际上，您支付的是智能合约在区块链上存储的每一秒钟。
  - *示例*：您的TON钱包也是一个智能合约，每次您接收或发送交易时都会支付存储费用。阅读更多关于[如何计算存储费用](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee)。
- `in_fwd_fees` 是只从区块链之外导入消息的收费，如`external` 消息。 每次您进行交易时，它都必须递交给将处理它的验证器。 对于从合同到订约的普通信息，这笔费用不适用。请阅读[TON Blockchain paper](https://docs.ton.org/tblkch.pdf) 了解更多关于入站信息的信息。
  - *示例*：您使用的每个钱包应用程序（如Tonkeeper）进行的每笔交易都需要首先在验证节点之间分发。
- `computation_fees` 是您为在虚拟机中执行代码而支付的金额。代码越大，必须支付的费用就越多。
  - *示例*：每次您使用钱包（即智能合约）发送交易时，您都会执行钱包合约的代码并为此付费。
- `action_fees` 是发送智能合约发出的消息的费用，更新智能合约代码，更新库等。
- `out_fwd_fees` 代表从TON区块链发送消息到外部服务（例如，日志）和外部区块链的费用。

## 常见问题

如果您在相当长的时间内（1年）没有使用您的TON钱包，*您将不得不支付比平常更大的手续费，因为钱包在发送和接收交易时支付手续费*。

### 公式

您可以使用以下公式大致计算智能合约的存储费用：

### 发送 Jettons 的费用？

让我们更仔细地检查每个值：

### 铸造 NFT 的成本？

`cell_price`和`bit_price`都可以从网络配置[参数18](https://explorer.toncoin.org/config?workchain=-1\&shard=8000000000000000\&seqno=22185244\&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382\&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18)中获得。

### 在 TON 上保存数据的成本？

在TON上保存1 MB数据一年的成本为6.01 TON。请注意，您通常不需要在链上存储大量数据。如果您需要去中心化存储，请考虑[TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon)。

### 计算器示例

您可以使用此JS脚本计算工作链中1 MB存储1年的存储价格

### 如何计算？

TON Blockchain中有一篇关于 [费用计算](/v3/guidelines/smart-contracts/fee-calculation) 的文章。

## 参考文献

- 根据[@thedailyton文章](https://telegra.ph/Commissions-on-TON-07-22)改编，原作者[menschee](https://github.com/menschee)\*

## 参阅

- ["低级收费概述"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)--了解佣金计算公式。
- [在 FunC 中计算远期费用的智能合约函数](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)
