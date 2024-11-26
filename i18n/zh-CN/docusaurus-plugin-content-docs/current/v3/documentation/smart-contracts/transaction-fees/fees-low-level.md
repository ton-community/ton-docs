# 低层级费用概述

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

:::caution
Here you will find the **raw formulas** for calculating commissions and fees on TON.

不过，其中大部分**已通过操作码**实现！因此，您可以**使用它们来代替手工计算**。
:::

如[TVM概述](/learn/tvm-instructions/tvm-overview)中所述，交易执行包括几个阶段(phase)。在这些阶段期间，可能会扣除相应的费用。

## 交易及其阶段

如[TVM 概述](/v3/documentation/tvm/tvm-overview)所述，交易执行由几个阶段组成。在这些阶段中，可能会扣除相应的费用。有一个 [高级费用概述](/v3/documentation/smart-contracts/transaction-fees/fees)。

## 存储费

TON 校验器从智能合约中收取存储费。

在任何交易的**存储阶段**，都会从智能合约余额中收取存储费，用于支付截至当前的账户状态
（包括智能合约代码和数据（如有））的存储费用。智能合约可能因此被冻结。

重要的是要记住，在 TON 上，你既要为智能合约的执行付费，也要为**使用的存储**付费（查看 [@thedailyton 文章](https://telegra.ph/Commissions-on-TON-07-22)）。存储费 "取决于合约大小： cell 数和 cell 位数之和。**存储和转发费用只计算唯一的哈希 cell ，即 3 个相同的哈希 cell 算作一个**。这意味着拥有 TON 钱包（即使非常小）也需要支付存储费。

所有计算成本都以gas单位标明。gas单位的价格由链配置（主链的Config 20和基本链的Config 21）决定，只能通过验证者的共识更改。请注意，与其他系统不同，用户不能设置自己的gas价格，也没有费用市场。

### 计算公式

您可以使用此公式大致计算智能合约的存储费用：

```cpp
  storage_fee = (cells_count * cell_price + bits_count * bit_price)
  * time_delta / 2^16 
```

除了这些基本费用外，还有以下费用：

- `storage_fee` -- `time_delta` 秒内的存储价格
- `cells_count` - 智能合约使用的 cell 数量
- `bits_count` - 智能合约使用的比特数
- `cell_price` -- 单个 cell 的价格
- `bit_price` -- 单个比特的价格

`cell_price` 和 `bit_price` 均可从网络配置[参数 18](/v3/documentation/network/configs/blockchain-configs#param-18)中获取。

FunC中使用的几乎所有函数都在[stdlib.func](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)中定义，它将FunC函数映射到Fift汇编指令。反过来，Fift汇编指令在[asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif)中映射到位序列指令。因此，如果你想了解指令调用的确切成本，你需要在`stdlib.func`中找到`asm`表示，然后在`asm.fif`中找到位序列并计算指令长度（以位为单位）。

- 工作链。
  ```cpp
  bit_price_ps:1
  cell_price_ps:500
  ```
- 主链
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

## 预付费

内部邮件会定义一个以 Toncoin 为单位的 `ihr_fee`（转发费），如果目的地分片链通过 IHR 机制收录了邮件，就会从邮件附加值中减去该费用，并将其奖励给目的地分片链的验证者。`转发费`（fwd_fee）是使用人力资源机制所支付的原始转发费总额；它是根据一些配置参数和信息生成时的大小自动计算得出的。请注意，新创建的内部出站报文所携带的总价值等于价值、`ihr_fee` 和 `fwd_fee` 之和。该总和从源账户余额中扣除。在这些部分中，只有 value 会在信息发送时记入目的地账户。`fwd_fee` 由从源到目的地的HR路径上的验证者收取，而 `ihr_fee` 要么由目的地分片链的验证者收取（如果信息是通过IHR传递的），要么记入目的地账户。

:::info
`fwd_fee` covers 2/3 of the cost, as 1/3 is allocated to the `action_fee` when the message is created.

```cpp
auto fwd_fee_mine = msg_prices.get_first_part(fwd_fee);
auto fwd_fee_remain = fwd_fee - fwd_fee_mine;

fees_total = fwd_fee + ihr_fee;
fees_collected = fwd_fee_mine;

ap.total_action_fees += fees_collected;
ap.total_fwd_fees += fees_total;
```

:::

## Inline和inline_refs

### Gas

所有计算成本均以 gas 单位计算。 gas 单位的价格由[链配置](/v3/documentation/network/configs/blockchain-configs#param-20and-21)决定（配置 20 用于主链，配置 21 用于基链），只有在验证者达成共识后才能更改。需要注意的是，与其他系统不同，用户不能设定自己的 gas 价格，也没有收费市场。

TON中的字典是作为cell的树（更准确地说是DAG）被引入的。这意味着如果你搜索、读取或写入字典，你需要解析树的相应分支的所有cell。这意味着

### TVM 指令成本

在最低层级（TVM指令执行），大多数原语的gas价格等于_基本gas价格_，计算为`P_b := 10 + b + 5r`，其中`b`是指令长度（以位为单位），`r`是包含在指令中的cell引用数。

注意FunC在底层操作堆栈条目。这意味着代码：

| 指令       | GAS价格   | 描述                                                                              |
| -------- | ------- | ------------------------------------------------------------------------------- |
| 创建cell   | **500** | 将构建器转换为cell的操作。                                                                 |
| 首次解析cell | **100** | 在当前交易期间首次将cell转换为 slice 的操作。                                                    |
| 重复解析cell | **25**  | 在同一交易期间已解析过的cell转换为 slice 的操作。                                                  |
| 抛出异常     | **50**  |                                                                                 |
| 与元组操作    | **1**   | 此价格将乘以元组元素的数量。                                                                  |
| 隐式跳转     | **10**  | 当当前continuation cell中的所有指令执行时会进行支付。然而，如果该continuation cell中存在引用，并且执行流跳转到了第一个引用。 |
| 隐式回跳     | **5**   | 当当前continuation中的所有指令执行完毕，并且执行流回跳到刚刚完成的continuation被调用的那个continuation时，将会进行支付。  |
| 移动堆栈元素   | **1**   | 在continuations之间移动堆栈元素的价格。每个元素都将收取相应的gas价格。然而，前32个元素的移动是免费的。                    |

### FunC 构造的 gas 费用

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

然而，通常，与位长度相关的费用与cell解析和创建以及跳转和执行指令数量的费用相比是次要的。

因此，如果你试图优化你的代码，首先从架构优化开始，减少cell解析/创建操作的数量，然后减少跳转的数量。

### 与 cell 进行的操作

一个关于如何通过适当的cell工作显著降低gas成本的示例。

假设你想在出站消息中添加一些编码的有效负载。直接实现将如下：

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

这段代码的问题是什么？`payload_encoding`为了生成 slice 位字符串，首先通过`end_cell()`创建一个cell（+500 gas单位）。然后解析它`begin_parse()`（+100 gas单位）。通过改变一些常用类型，可以不使用这些不必要的操作来重写相同的代码：

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

默认情况下，当你有一个FunC函数时，它会获得自己的`id`，存储在id->function字典的单独叶子中，当你在程序的某个地方调用它时，会在字典中搜索函数并随后跳转。如果函数从代码中的许多地方调用，这种行为是合理的，因为跳转允许减少代码大小（通过一次存储函数体）。然而，如果该函数只在一个或两个地方使用，通常更便宜的做法是将该函数声明为`inline`或`inline_ref`。`inline`修饰符将函数体直接放入父函数的代码中，而`inline_ref`将函数代码放入引用中（跳转到引用仍然比搜索和跳转到字典条目便宜得多）。

### 字典

\*2022年7月24日，基于@thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) \*

- a) 字典操作的成本不是固定的（因为分支中节点的大小和数量取决于给定的字典和键）
- b) 优化字典使用是明智的，使用特殊指令如`replace`而不是`delete`和`add`
- c) 开发者应该注意迭代操作（如next和prev）以及`min_key`/`max_key`操作，以避免不必要地遍历整个字典

### 堆栈操作

注意FunC在底层操作堆栈条目。这意味着代码：

```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```

将被翻译成几个指令，这些指令改变堆栈上元素的顺序。

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

## 操作费

操作费在计算阶段后执行的操作列表处理过程中从源账户余额中扣除。
这些都是导致支付费用的操作：

- `SENDRAWMSG` 发送原始信息。
- `RAWRESERVE` 创建一个输出操作，用于保留 N  nanotons  。
- `RAWRESERVEX` 与 `RAWRESERVE` 类似，但也接受包含额外货币的字典。
- `SETCODE` 创建一个输出操作，用于更改该智能合约代码。
- `SETLIBCODE` 创建一个输出操作，通过添加或删除带有给定代码的库来修改该智能合约库的集合。
- 与 `SETLIBCODE` 类似，`CHANGELIB` 创建一个输出操作，但不接受库代码，而是接受其散列。
- `FB08-FB3F` 保留给输出动作基元。

## 费用计算公式

### storage_fees

```cpp
storage_fees = ceil(
                    (account.bits * bit_price
                    + account.cells * cell_price)
               * period / 2 ^ 16)
```

### in_fwd_fees, out_fwd_fees

```cpp
msg_fwd_fees = (lump_price
             + ceil(
                (bit_price * msg.bits + cell_price * msg.cells) / 2^16)
             )
             
ihr_fwd_fees = ceil((msg_fwd_fees * ihr_price_factor) / 2^16)
```

:::info
Only unique hash cells are counted for storage and fwd fees i.e. 3 identical hash cells are counted as one.

特别是，它可以重复数据：如果在不同分支中引用了多个等效子 cell ，则其内容只需存储一次。

阅读有关 [重复数据删除](/v3/documentation/data-formats/ltb/library-cells) 的更多信息。
:::

// 消息的根cell中的位不包括在msg.bits中（lump_price支付它们）

### action_fees

```cpp
action_fees = sum(out_ext_msg_fwd_fee) + sum(int_msg_mine_fee)
```

## 费用配置文件

所有费用均以纳元或纳元乘以 2^16 来表示[在使用整数时保持准确性](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#forward-fees)，并且可以更改。配置文件表示当前的费用成本。

- storage_fees = [p18](https://tonviewer.com/config#18)
- in_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- computation_fees = [p20](https://tonviewer.com/config#20), [p21](https://tonviewer.com/config#21)
- action_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)
- out_fwd_fees = [p24](https://tonviewer.com/config#24), [p25](https://tonviewer.com/config#25)

:::info
[指向主网实时配置文件的直接链接](https://tonviewer.com/config)

出于教育目的：[旧版本示例](https://explorer.toncoin.org/config?workchain=-1\&shard=8000000000000000\&seqno=22185244\&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382\&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

## 参考资料

- 基于 @thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) 24.07\*

## 另请参见

- [ TON 收费概述](/v3/documentation/smart-contracts/transaction-fees/fees)
- [事务和阶段](/v3/documentation/tvm/tvm-overview#transactions-and-phases)
- [费用计算](/v3/guidelines/smart-contracts/fee-calculation)
