# 交易费用

每个TON用户都应该记住，_手续费取决于许多因素_。

## Gas

所有费用都以Gas计算。这是TON中用作费用的特殊货币。

所有费用都以一定数量的gas来指定和固定，但gas价格本身并不固定。今天的gas价格为：

```cpp
1 gas = 1000 nanotons = 0,000 001 TON
```

### 平均交易成本

> **简而言之：** 今天，每笔交易的成本约为 **~0.005 TON**

即使TON价格上涨100倍，交易仍将非常便宜；不到$0.01。此外，如果验证者认为手续费变得昂贵，他们可以降低这个值[阅读他们为何感兴趣](#gas-changing-voting-process)。

:::info
当前的gas数量写在网络配置[参数20](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20)中。
:::

### Gas 变更投票过程

像TON的许多其他参数一样，gas费用是可配置的，可以通过主网上的特殊投票来更改。

更改任何参数都需要获得66％的验证者投票。

#### Gas 的成本会更高吗？

> *这是否意味着有一天gas价格可能会上涨1000倍甚至更多？*

从技术上讲，是的；但实际上，不会。

验证者从处理交易中获得少量费用，收取更高的手续费将导致交易数量减少，使验证过程变得不那么有利。

### 如何计算费用？

TON上的费用难以提前计算，因为它们的数量取决于交易运行时间、账户状态、消息内容和大小、区块链网络设置以及无法在交易发送之前计算的其他许多变量。阅读关于[计算费用](/develop/howto/fees-low-level#computation-fees)的低层级文章概述。

这就是为什么即使NFT市场通常会额外收取大约1 TON的TON，并在稍后返还(_`1 - transaction_fee`_)。

然而，让我们了解更多关于费用应该如何在TON上发挥作用。

## 基本费用公式

根据[低层级费用概述](/develop/howto/fees-low-level)，TON上的费用按照以下公式计算：

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

## 交易费用的元素

* `storage_fees`是您为在区块链上存储智能合约而支付的金额。实际上，您支付的是智能合约在区块链上存储的每一秒钟。
  * _示例_：您的TON钱包也是一个智能合约，每次您接收或发送交易时都会支付存储费用。阅读更多关于[如何计算存储费用](/develop/smart-contracts/fees#storage-fee)。
* `in_fwd_fees`是从区块链外部导入消息的费用。每次您进行交易时，都必须将其传送给将处理它的验证者。
  * _示例_：您使用的每个钱包应用程序（如Tonkeeper）进行的每笔交易都需要首先在验证节点之间分发。
* `computation_fees`是您为在虚拟机中执行代码而支付的金额。代码越大，必须支付的费用就越多。
  * _示例_：每次您使用钱包（即智能合约）发送交易时，您都会执行钱包合约的代码并为此付费。
* `action_fees`是智能合约发送外部消息所收取的费用。
* `out_fwd_fees`代表从TON区块链发送消息到外部服务（例如，日志）和外部区块链的费用。
  * 由于尚未实施，因此目前未使用。因此目前等于0。

## 存储费

TON验证者从智能合约收取存储费用。

存储费用是在任何交易的**存储阶段**从智能合约余额中收取的。阅读更多关于阶段以及TVM如何工作的内容[在此](/learn/tvm-instructions/tvm-overview#transactions-and-phases)。

重要的是要记住，在TON上，您既要为智能合约的执行付费，也要为**使用的存储**付费：

```cpp
bytes * second
```

这意味着您必须为拥有TON钱包支付存储费用（即使非常非常小）。

如果您在相当长的时间内（1年）没有使用您的TON钱包，_您将不得不支付比平常更大的手续费，因为钱包在发送和接收交易时支付手续费_。

### 公式

您可以使用以下公式大致计算智能合约的存储费用：

```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  / 2^16 * time_delta
```

让我们更仔细地检查每个值：

* `price` — 存储`time_delta`秒的价格
* `cells_count` — 智能合约使用的cell数量
* `bits_count` — 智能合约使用的位数
* `cell_price` — 单个cell的价格
* `bit_price` — 单个位的价格

`cell_price`和`bit_price`都可以从网络配置[参数18](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18)中获得。

当前值为：

* 工作链
    ```cpp
    bit_price_ps:1
    cell_price_ps:500
    ```
* 主链
    ```cpp
    mc_bit_price_ps:1000
    mc_cell_price_ps:500000
    ```

### 计算器示例

您可以使用此JS脚本计算工作链中1 MB存储1年的存储价格

```js live

// 欢迎使用LIVE编辑器！
// 随意更改任何变量
  
function storageFeeCalculator() {
  
  const size = 1024 * 1024 * 8		    // 1MB的位  
  const duration = 60 * 60 * 24 * 365	// 1年的秒数

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.ceil(size / 1023) * cell_price_ps

  let fee = (pricePerSec * duration / 2**16 * 10**-9)
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`
  
  return str
}


```

## 常见问题解答

这里是TON访客最常问的问题：

### 发送 TON 的费用？

发送任何数量的TON的平均费用为0.0055 TON。

### 发送 Jettons 的费用？

发送任何数量的自定义Jettons的平均费用为0.037 TON。

### 铸造 NFT 的成本？

铸造一个NFT的平均费用为0.08 TON。

### 在 TON 上保存数据的成本？

在TON上保存1 MB数据一年的成本为6.01 TON。请注意，您通常不需要在链上存储大量数据。如果您需要去中心化存储，请考虑[TON Storage](/participate/ton-storage/storage-daemon)。

### 如何在 FunC 中计算费用？

* [在FunC中计算转发费用的智能合约函数](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

## 参考资料

* ["低层级费用概述"](/develop/howto/fees-low-level#fees-calculation-formulas) — 阅读有关计算佣金的公式。
* *基于[@thedailyton文章](https://telegra.ph/Commissions-on-TON-07-22)最初由[menschee](https://github.com/menschee)撰写*
