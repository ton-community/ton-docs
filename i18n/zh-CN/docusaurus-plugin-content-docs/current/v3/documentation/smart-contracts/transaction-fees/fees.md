import Feedback from '@site/src/components/Feedback';

# 交易费用

每个TON用户都应该记住，_手续费取决于许多因素_。

## Gas

All [computation costs](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) are nominated in gas units and fixed in a certain gas amount.

The price of gas units is determined by the [chain configuration](https://tonviewer.com/config#20) and may be changed only by consensus of validators. Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

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

Even if TON price increases 100 times, transactions will remain ultra-cheap; about $0.01. Moreover, validators may lower this value if they see commissions have become expensive [read why they're interested](#gas-changing-voting-process).

:::info
当前 gas 量分别写入主链和基链的网络配置 [param 20](https://tonviewer.com/config#20) 和 [param 21](https://tonviewer.com/config#21)。
:::

### Gas changing voting process

像TON的许多其他参数一样，gas费用是可配置的，可以通过主网上的特殊投票来更改。

Changing any parameter requires approval from 66% of the validators' votes.

#### gas 价格会更贵吗？

> _这是否意味着有一天gas价格可能会上涨1000倍甚至更多？_

从技术上讲，是的；但实际上，不会。

Validators receive a small fee for processing transactions, and charging higher commissions would lead to a decrease in the number of transactions, making the validating process less beneficial.

### 如何计算费用？

TON 的费用很难提前计算，因为其金额取决于交易运行时间、账户状态、信息内容和大小、区块链网络设置以及其他一些变量，在交易发送之前无法计算。

这就是为什么即使NFT市场通常会额外收取大约1 TON的TON，并在稍后返还(_`1 - transaction_fee`_)。

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

查看[低级收费概述](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)，了解更多佣金计算公式；查看[收费计算](/v3/guidelines/smart-contracts/fee-calculation)，了解如何使用新的 TVM 操作码计算 FunC 合约中的收费。
:::

不过，让我们进一步了解一下 TON 的收费功能。

## Basic fees formula

根据[低层级费用概述](/develop/howto/fees-low-level)，TON上的费用按照以下公式计算：

```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees
                + action_fees
                + out_fwd_fees
```

```jsx live
// Welcome to LIVE editor!
// feel free to change any variables
// Check https://retracer.ton.org/?tx=b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262

function FeeCalculator() {
  // https://tonviewer.com/config#25
  const lump_price = 400000;
  const bit_price = 26214400;
  const cell_price = 2621440000;
  const ihr_price_factor = 98304;
  const first_frac = 21845;
  const nano = 10 ** -9;
  const bit16 = 2 ** 16;

  const ihr_disabled = 0; // First of all define is ihr gonna be counted

  let fwd_fee =
    lump_price + Math.ceil((bit_price * 0 + cell_price * 0) / bit16);

  if (ihr_disabled) {
    var ihr_fee = 0;
  } else {
    var ihr_fee = Math.ceil((fwd_fee * ihr_price_factor) / bit16);
  }

  let total_fwd_fees = fwd_fee + ihr_fee;
  let gas_fees = 0.0011976; // Gas fees out of scope here
  let storage_fees = 0.000000003; // And storage fees as well
  let total_action_fees = +((fwd_fee * first_frac) / bit16).toFixed(9);
  let import_fee =
    lump_price + Math.ceil((bit_price * 528 + cell_price * 1) / bit16);
  let total_fee =
    gas_fees + storage_fees + total_action_fees * nano + import_fee * nano;

  return (
    <div>
      <p> Total fee: {+total_fee.toFixed(9)} TON</p>
      <p> Action fee: {+(total_action_fees * nano).toFixed(9)} TON </p>
      <p> Fwd fee: {+(total_fwd_fees * nano).toFixed(9)} TON </p>
      <p> Import fee: {+(import_fee * nano).toFixed(9)} TON </p>
      <p> IHR fee: {+(ihr_fee * nano).toFixed(9)} TON </p>
    </div>
  );
}
```

## 交易费要素

- `storage_fees`是您为在区块链上存储智能合约而支付的金额。实际上，您支付的是智能合约在区块链上存储的每一秒钟。 In fact, you pay for every second the smart contract is stored on the blockchain.
  - _示例_：您的TON钱包也是一个智能合约，每次您接收或发送交易时都会支付存储费用。阅读更多关于[如何计算存储费用](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee)。 Read more about [how storage fees are calculated](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
- `in_fwd_fees` 是只从区块链之外导入消息的收费，如`external` 消息。 每次您进行交易时，它都必须递交给将处理它的验证器。 对于从合同到订约的普通信息，这笔费用不适用。请阅读[TON Blockchain paper](https://docs.ton.org/tblkch.pdf) 了解更多关于入站信息的信息。 Every time you make a transaction, it must be delivered to the validators who will process it. For ordinary messages from contract to contract this fee is not applicable. Read [the TON Blockchain paper](https://docs.ton.org/tblkch.pdf) to learn more about inbound messages.
  - _示例_：您使用的每个钱包应用程序（如Tonkeeper）进行的每笔交易都需要首先在验证节点之间分发。
- `computation_fees` 是您为在虚拟机中执行代码而支付的金额。代码越大，必须支付的费用就越多。 The larger the code, the more fees must be paid.
  - _示例_：每次您使用钱包（即智能合约）发送交易时，您都会执行钱包合约的代码并为此付费。
- `action_fees` 是发送智能合约发出的消息的费用，更新智能合约代码，更新库等。
- `out_fwd_fees` 代表从TON区块链发送消息到外部服务（例如，日志）和外部区块链的费用。

## 常见问题

Here are the most frequently asked questions by visitors of TON:

### 发送 Jettons 的费用？

The average fee for sending any amount of TON is 0.0055 TON.

### Fees for sending Jettons?

The average fee for sending any amount of a custom Jettons is 0.037 TON.

### 铸造 NFT 的成本？

The average fee for minting one NFT is 0.08 TON.

### 在 TON 上保存数据的成本？

在TON上保存1 MB数据一年的成本为6.01 TON。请注意，您通常不需要在链上存储大量数据。如果您需要去中心化存储，请考虑[TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon)。 Note that you usually don't need to store large amounts of data on-chain. Consider using [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) if you need decentralized storage.

### Is it possible to send a gasless transaction?

In TON, gasless transactions are possible using [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) a relayer that pays the gas fee for transaction.

### 如何计算？

TON Blockchain中有一篇关于 [费用计算](/v3/guidelines/smart-contracts/fee-calculation) 的文章。

## 参考文献

- 根据[@thedailyton文章](https://telegra.ph/Commissions-on-TON-07-22)改编，原作者[menschee](https://github.com/menschee)\*

## 参阅

- ["低级收费概述"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)--了解佣金计算公式。
- [在 FunC 中计算远期费用的智能合约函数](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

<Feedback />

