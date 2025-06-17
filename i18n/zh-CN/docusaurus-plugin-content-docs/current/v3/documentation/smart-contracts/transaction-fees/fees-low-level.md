import Feedback from '@site/src/components/Feedback';

# 低层级费用概述

:::caution
This section describes instructions and manuals for interacting with TON at a low level.
在这里，您可以找到计算 TON 佣金和费用的**原始公式**。
However, most of them are **already implemented through opcodes**!
不过，其中大部分**已通过操作码**实现！因此，您可以**使用它们来代替手工计算**。
:::

This document provides a general idea of transaction fees on TON and particularly computation fees for the FunC code. There is also a [detailed specification in the TVM whitepaper](https://ton.org/tvm.pdf).

## 交易及其阶段

As was described in the [TVM overview](/v3/documentation/tvm/tvm-overview), transaction execution consists of a few phases. During those phases, the corresponding fees may be deducted. 如[TVM 概述](/v3/documentation/tvm/tvm-overview)所述，交易执行由几个阶段组成。在这些阶段中，可能会扣除相应的费用。有一个 [高级费用概述](/v3/documentation/smart-contracts/transaction-fees/fees)。

## 存储费

TON 校验器从智能合约中收取存储费。

在任何交易的**存储阶段**，都会从智能合约余额中收取存储费，用于支付截至当前的账户状态
（包括智能合约代码和数据（如有））的存储费用。智能合约可能因此被冻结。 Even if a contract receives 1 nanoton, it will pay all the debt since the last payment. The smart contract may be frozen as a result. Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one. In particular, it [deduplicates](/v3/documentation/data-formats/tlb/library-cells) data: if there are several equivalent sub-cells referenced in different branches, their content is only stored once.

重要的是要记住，在 TON 上，你既要为智能合约的执行付费，也要为**使用的存储**付费（查看 [@thedailyton 文章](https://telegra.ph/Commissions-on-TON-07-22)）。存储费 "取决于合约大小： cell 数和 cell 位数之和。**存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个**。这意味着拥有 TON 钱包（即使非常小）也需要支付存储费。 It means you have to pay a storage fee for having TON Wallet (even if it's very-very small).

If you have not used your TON Wallet for a significant period of time (1 year), _you will have to pay a significantly larger commission than usual because the wallet pays commission on sending and receiving transactions_.

:::info **Note**:
When a message is bounced from the contract, the contract will pay its current `storage_fee`
:::

### 计算公式

您可以使用此公式大致计算智能合约的存储费用：

```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  * time_delta / 2^16 
```

Let's examine each value more closely:

- `storage_fee` -- `time_delta` 秒内的存储价格
- `cells_count` - 智能合约使用的 cell 数量
- `bits_count` - 智能合约使用的比特数
- `cell_price` -- 单个 cell 的价格
- `bit_price` -- 单个比特的价格

`cell_price` 和 `bit_price` 均可从网络配置[参数 18](/v3/documentation/network/configs/blockchain-configs#param-18)中获取。

Current values are:

- 工作链。
  ```cpp
  bit_price_ps:1
  cell_price_ps:500
  ```
- Masterchain.
  ```cpp
  mc_bit_price_ps:1000
  mc_cell_price_ps:500000
  ```

### 计算器示例

您可以使用此 JS 脚本计算工作链中 1 MB 1 年的存储价格

```js live

// Welcome to LIVE editor!
// feel free to change any variables
// Source code uses RoundUp for the fee amount, so does the calculator

function storageFeeCalculator() {
  
  const size = 1024 * 1024 * 8        // 1MB in bits  
  const duration = 60 * 60 * 24 * 365 // 1 Year in secs

  const bit_price_ps = 1
  const cell_price_ps = 500

  const pricePerSec = size * bit_price_ps +
  + Math.ceil(size / 1023) * cell_price_ps

  let fee = Math.ceil(pricePerSec * duration / 2**16) * 10**-9
  let mb = (size / 1024 / 1024 / 8).toFixed(2)
  let days = Math.floor(duration / (3600 * 24))
  
  let str = `Storage Fee: ${fee} TON (${mb} MB for ${days} days)`
  
  return str
}


```

## 费用计算公式

### Gas

All computation costs are nominated in gas units. 所有计算成本均以 gas 单位计算。 gas 单位的价格由[链配置](/v3/documentation/network/configs/blockchain-configs#param-20and-21)决定（配置 20 用于主链，配置 21 用于基链），只有在验证者达成共识后才能更改。需要注意的是，与其他系统不同，用户不能设定自己的 gas 价格，也没有收费市场。 Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

Current settings in basechain are as follows: 1 unit of gas costs 400 nanotons.

### TVM 指令成本

在最低层级（TVM指令执行），大多数原语的gas价格等于_基本gas价格_，计算为`P_b := 10 + b + 5r`，其中`b`是指令长度（以位为单位），`r`是包含在指令中的cell引用数。

除了这些基本费用外，还有以下费用：

| 指令       | GAS价格   | 描述                                                                                                                                                                                                            |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 创建cell   | **500** | 将构建器转换为cell的操作。                                                                                                                                                                                               |
| 首次解析cell | **100** | 在当前交易期间首次将cell转换为 slice 的操作。                                                                                                                                                                                  |
| 重复解析cell | **25**  | 在同一交易期间已解析过的cell转换为 slice 的操作。                                                                                                                                                                                |
| 抛出异常     | **50**  |                                                                                                                                                                                                               |
| 与元组操作    | **1**   | 此价格将乘以元组元素的数量。                                                                                                                                                                                                |
| 隐式跳转     | **10**  | 当当前continuation cell中的所有指令执行时会进行支付。然而，如果该continuation cell中存在引用，并且执行流跳转到了第一个引用。 However, there are references in that continuation cell, and the execution flow jumps to the first reference. |
| 隐式回跳     | **5**   | 当当前continuation中的所有指令执行完毕，并且执行流回跳到刚刚完成的continuation被调用的那个continuation时，将会进行支付。                                                                                                                                |
| 移动堆栈元素   | **1**   | Price for moving stack elements between continuations. It will charge correspond gas price for every element. However, the first 32 elements moving is free.  |

### FunC 构造的 gas 费用

Almost all FunC functions used in this article are defined in [stablecoin stdlib.fc contract](https://github.com/ton-blockchain/stablecoin-contract) (actually, stdlib.fc with new opcodes is currently **under development** and **not yet presented on the mainnet repos**, but you can use `stdlib.fc` from [stablecoin](https://github.com/ton-blockchain/ton) source code as reference) which maps FunC functions to Fift assembler instructions. FunC中使用的几乎所有函数都在[stdlib.func](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)中定义，它将FunC函数映射到Fift汇编指令。反过来，Fift汇编指令在[asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif)中映射到位序列指令。因此，如果你想了解指令调用的确切成本，你需要在`stdlib.func`中找到`asm`表示，然后在`asm.fif`中找到位序列并计算指令长度（以位为单位）。 So if you want to understand how much exactly the instruction call will cost you, you need to find `asm` representation in `stdlib.fc`, then find bit-sequence in `asm.fif` and calculate instruction length in bits.

然而，通常，与位长度相关的费用与cell解析和创建以及跳转和执行指令数量的费用相比是次要的。

因此，如果你试图优化你的代码，首先从架构优化开始，减少cell解析/创建操作的数量，然后减少跳转的数量。

### 与 cell 进行的操作

一个关于如何通过适当的cell工作显著降低gas成本的示例。

假设你想在出站消息中添加一些编码的有效负载。直接实现将如下： Straightforward implementation will be as follows:

```cpp
slice payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8)
    .end_cell().begin_parse();
}

() send_message(slice destination) impure {
  slice payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_slice(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

What is the problem with this code? 这段代码的问题是什么？`payload_encoding`为了生成 slice 位字符串，首先通过`end_cell()`创建一个cell（+500 gas单位）。然后解析它`begin_parse()`（+100 gas单位）。通过改变一些常用类型，可以不使用这些不必要的操作来重写相同的代码： Then parse it `begin_parse()` (+100 gas units). The same code can be written without those unnecessary operations by changing some commonly used types:

```cpp
;; we add asm for function which stores one builder to the another, which is absent from stdlib
builder store_builder(builder to, builder what) asm(what to) "STB";

builder payload_encoding(int a, int b, int c) {
  return
    begin_cell().store_uint(a,8)
                .store_uint(b,8)
                .store_uint(c,8);
}

() send_message(slice destination) impure {
  builder payload = payload_encoding(1, 7, 12);
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(destination)
    .store_coins(0)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0x33bbff77, 32) ;; op-code (see smart-contract guidelines)
    .store_uint(cur_lt(), 64)  ;; query_id (see smart-contract guidelines)
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```

通过以另一种形式（构建器而不是 slice ）传递位字符串，我们通过非常轻微的代码更改显著降低了计算成本。

### Inline和inline_refs

默认情况下，当你有一个FunC函数时，它会获得自己的`id`，存储在id->function字典的单独叶子中，当你在程序的某个地方调用它时，会在字典中搜索函数并随后跳转。如果函数从代码中的许多地方调用，这种行为是合理的，因为跳转允许减少代码大小（通过一次存储函数体）。然而，如果该函数只在一个或两个地方使用，通常更便宜的做法是将该函数声明为`inline`或`inline_ref`。`inline`修饰符将函数体直接放入父函数的代码中，而`inline_ref`将函数代码放入引用中（跳转到引用仍然比搜索和跳转到字典条目便宜得多）。 Such behavior is justified if your function is called from many places in the code and thus jumps allow to decrease the code size (by storing a function body once). However, if the function is only used once or twice, it is often much cheaper to declare this function as `inline` or `inline_ref`. `inline` modificator places the body of the function right into the code of the parent function, while `inline_ref` places the function code into the reference (jumping to the reference is still much cheaper than searching and jumping to the dictionary entry).

### 字典

TON中的字典是作为cell的树（更准确地说是DAG）被引入的。这意味着如果你搜索、读取或写入字典，你需要解析树的相应分支的所有cell。这意味着 That means that if you search, read, or write to the dictionary, you need to parse all cells of the corresponding branch of the tree. That means that

- a) 字典操作的成本不是固定的（因为分支中节点的大小和数量取决于给定的字典和键）
- b) 优化字典使用是明智的，使用特殊指令如`replace`而不是`delete`和`add`
- c) 开发者应该注意迭代操作（如next和prev）以及`min_key`/`max_key`操作，以避免不必要地遍历整个字典

### 堆栈操作

Note that FunC manipulates stack entries under the hood. That means that the code:

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

将被翻译成几个指令，这些指令改变堆栈上元素的顺序。

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

## 预付费

内部消息会定义一个以 Toncoins 为单位的 `ihr_fee`（转发费），如果目的地分片链通过 IHR 机制收录消息，就会从消息附加值中减去该费用，并将其奖励给目的地分片链的验证者。`fwd_fee` 是使用HR机制所支付的原始转发费用总额；它是根据[24和25配置参数](/v3/documentation/network/configs/blockchain-configs#param-24and-25)和信息生成时的大小自动计算得出的。请注意，新创建的内部出站消息所携带的总值等于 值、`hr_fee` 和 `fwd_fee` 之和。该总和从源账户余额中扣除。在这些部分中，只有值会在信息发送时记入目的地账户。`fwd_fee` 由从源到目的地的HR路径上的验证者收取，而 `ihr_fee` 要么由目的地分片链的验证者收取（如果信息是通过IHR传递的），要么记入目的地账户。 The `fwd_fee` is the original total forwarding fee paid for using the HR mechanism; it is automatically computed from the [24 and 25 configuration parameters](/v3/documentation/network/configs/blockchain-configs#param-24-and-25) and the size of the message at the time the message is generated. Note that the total value carried by a newly created internal outbound message equals the sum of the value, `ihr_fee`, and `fwd_fee`. This sum is deducted from the balance of the source account. Of these components, only the `ihr_fee` value is credited to the destination account upon message delivery. The `fwd_fee` is collected by the validators on the HR path from the source to the destination, and the `ihr_fee` is either collected by the validators of the destination shardchain (if the message is delivered via IHR) or credited to the destination account.

### IHR

:::info What is IHR?
目前（2024年11月），[IHR](/v3/documentation/smart-contracts/shards/infinity-sharding-paradigm#messages-and-instant-hypercube-routing-instant-hypercube-routing)尚未实现，如果将 `ihr_fee` 设置为非零值，那么在收到消息时，它将始终被添加到消息值中。就目前而言，这样做没有实际意义。 To understand why IHR is not currently relevant:

- **IHR is not implemented** and is not yet fully specified
- **IHR would only be relevant** when the network has more than 16 shards and not all shards are neighbors to each other
- **Current network settings forbid splitting deeper than 16 shards**, which means IHR is not relevant in any practical sense

In the current TON network configuration, all message routing uses standard **Hypercube Routing (HR)**, which can handle message delivery efficiently with the current shard topology. The `ihr_fee` field exists in the message structure for future compatibility, but serves no functional purpose today.

If you set the `ihr_fee` to a non-zero value, it will always be added to the message value upon receipt. For now, there are no practical reasons to do this.
:::

### Formula

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             );

ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16);

total_fwd_fees = msg_fwd_fees + ihr_fwd_fees; // ihr_fwd_fees - is 0 for external messages
```

:::info IMPORTANT
Please note that `msg_fwd_fees` above includes `action_fee` below. For a basic message this fee = lump_price = 400000 nanotons, action_fee = (400000 \* 21845) / 65536 = 133331. Or approximately a third of the `msg_fwd_fees`.

`fwd_fee` = `msg_fwd_fees` - `action_fee` = 266669 nanotons = 0,000266669 TON
:::

## 操作费

操作费在计算阶段之后处理操作列表时从源账户余额中扣除。实际上，唯一需要支付操作费的操作是 `SENDRAWMSG`。其他操作，如 `RAWRESERVE` 或 `SETCODE`，在操作阶段不产生任何费用。 Practically, the only action for which you pay an action fee is `SENDRAWMSG`. Other actions, such as `RAWRESERVE` or `SETCODE`, do not incur any fee during the action phase.

```cpp
action_fee = floor((msg_fwd_fees * first_frac)/ 2^16);  //internal

action_fee = msg_fwd_fees;  //external
```

[`first_frac`](/v3/documentation/network/configs/blockchain-configs#param-24and-25)是TON区块链的24和25参数（主链和工作链）的一部分。目前，这两个参数的值都设置为 21845，这意味着 `action_fee` 约为 `msg_fwd_fees` 的三分之一。如果是外部消息操作 `SENDRAWMSG`，`action_fee` 等于 `msg_fwd_fees`。 Currently, both are set to a value of 21845, which means that the `action_fee` is approximately a third of the `msg_fwd_fees`. In the case of an external message action, `SENDRAWMSG`, the `action_fee` is equal to the `msg_fwd_fees`.

:::tip
Remember that an action register can contain up to 255 actions, which means that all formulas related to `fwd_fee` and `action_fee` will be computed for each `SENDRAWMSG` action, resulting in the following sum:

```cpp
total_fees = sum(action_fee) + sum(total_fwd_fees);
```

:::

从 TON 的第四个[全球版本](https://github.com/ton-blockchain/ton/blob/master/doc/GlobalVersions.md)开始，如果 "发送消息 " 操作失败，账户需要支付处理消息单元的费用，称为 `action_fine`。

```cpp
fine_per_cell = floor((cell_price >> 16) / 4)

max_cells = floor(remaining_balance / fine_per_cell)

action_fine = fine_per_cell * min(max_cells, cells_in_msg);
```

## 费用配置文件

所有费用均以纳元或纳元乘以 2^16 来表示[在使用整数时保持准确性](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees)，并且可以更改。配置文件表示当前的费用成本。 The config file represents the current fee cost.

- storage_fees = [p18](https://tonviewer.com/config#18)
- in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
- action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[指向主网实时配置文件的直接链接](https://tonviewer.com/config)

出于教育目的：旧版本示例
:::

## 参考资料

- 基于 @thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) 24.07\*

## 另请参见

- [ TON 收费概述](/v3/documentation/smart-contracts/transaction-fees/fees)
- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)
- [费用计算](/v3/guidelines/smart-contracts/fee-calculation)

<Feedback />

