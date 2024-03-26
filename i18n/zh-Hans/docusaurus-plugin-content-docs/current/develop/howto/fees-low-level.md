# 低层级费用概述

:::caution
本节描述了与TON进行低层级交互的说明和手册。
:::

本文档提供了TON上交易费用的一般概念，特别是对FunC代码的计算费用。还有一个[TVM白皮书中的详细规范](https://ton.org/tvm.pdf)。

## 交易及其阶段

如[TVM概述](/learn/tvm-instructions/tvm-overview)中所述，交易执行包括几个阶段(phase)。在这些阶段期间，可能会扣除相应的费用。

通常：
```cpp
transaction_fee = storage_fees
                + in_fwd_fees
                + computation_fees 
                + action_fees 
                + out_fwd_fees
```
其中：
   * `storage_fees`—与合约在链状态中占用空间相关的费用
   * `in_fwd_fees`—将传入消息导入区块链的费用（仅适用于之前未在链上的消息，即`external`消息。对于合约到合约的普通消息，此费用不适用）
   * `computation_fees`—与执行TVM指令相关的费用
   * `action_fees`—与处理action列表（发送消息、设置库等）相关的费用
   * `out_fwd_fees`—与将出站消息导入区块链相关的费用

## 计算费用

### Gas
所有计算成本都以gas单位标明。gas单位的价格由链配置（主链的Config 20和基本链的Config 21）决定，只能通过验证者的共识更改。请注意，与其他系统不同，用户不能设置自己的gas价格，也没有费用市场。

基本链当前的设置如下：1个gas单位的成本是1000 nanotons。

## TVM 指令成本
在最低层级（TVM指令执行），大多数原语的gas价格等于_基本gas价格_，计算为`P_b := 10 + b + 5r`，其中`b`是指令长度（以位为单位），`r`是包含在指令中的cell引用数。

除了这些基本费用外，还有以下费用：

| 指令                       | GAS价格   | 描述                                                                                                                                                                                   | 
|---------------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 创建cell                  | **500**    | 将构建器转换为cell的操作。                                                                                                                                                    |
| 首次解析cell              | **100**    | 在当前交易期间首次将cell转换为切片的操作。                                                                                                            | 
| 重复解析cell              | **25**     | 在同一交易期间已解析过的cell转换为切片的操作。                                                                                                |
| 抛出异常                    | **50**     |                                                                                                                                                                                       | 
| 与元组操作                  | **1**      | 此价格将乘以元组元素的数量。                                                                                                                                                       | 
| 隐式跳转                    | **10**     | 当当前continuation cell中的所有指令执行时会进行支付。然而，如果该continuation cell中存在引用，并且执行流跳转到了第一个引用。                                                            | 
| 隐式回跳                  | **5**      | 当当前continuation中的所有指令执行完毕，并且执行流回跳到刚刚完成的continuation被调用的那个continuation时，将会进行支付。                                                                                                             |                                                                                      
| 移动堆栈元素                | **1**      | 在continuations之间移动堆栈元素的价格。每个元素都将收取相应的gas价格。然而，前32个元素的移动是免费的。                                                                                         |                                                                                       


## FunC 构造的 gas 费用

FunC中使用的几乎所有函数都在[stdlib.func](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc)中定义，它将FunC函数映射到Fift汇编指令。反过来，Fift汇编指令在[asm.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/fift/lib/Asm.fif)中映射到位序列指令。因此，如果你想了解指令调用的确切成本，你需要在`stdlib.func`中找到`asm`表示，然后在`asm.fif`中找到位序列并计算指令长度（以位为单位）。

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

这段代码的问题是什么？`payload_encoding`为了生成切片位字符串，首先通过`end_cell()`创建一个cell（+500 gas单位）。然后解析它`begin_parse()`（+100 gas单位）。通过改变一些常用类型，可以不使用这些不必要的操作来重写相同的代码：

```cpp
;; 我们为stdlib中不存在的函数添加asm，该函数将一个构建器存储到另一个构建器中
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
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息头（见发送消息页面）
    .store_uint(0x33bbff77, 32) ;; 操作码（见智能合约指南）
    .store_uint(cur_lt(), 64)  ;; query_id（见智能合约指南）
    .store_builder(payload)
  .end_cell();
  send_raw_message(msg, 64);
}
```
通过以另一种形式（构建器而不是切片）传递位字符串，我们通过非常轻微的代码更改显著降低了计算成本。

### Inline和inline_refs
默认情况下，当你有一个FunC函数时，它会获得自己的`id`，存储在id->function字典的单独叶子中，当你在程序的某个地方调用它时，会在字典中搜索函数并随后跳转。如果函数从代码中的许多地方调用，这种行为是合理的，因为跳转允许减少代码大小（通过一次存储函数体）。然而，如果该函数只在一个或两个地方使用，通常更便宜的做法是将该函数声明为`inline`或`inline_ref`。`inline`修饰符将函数体直接放入父函数的代码中，而`inline_ref`将函数代码放入引用中（跳转到引用仍然比搜索和跳转到字典条目便宜得多）。

### 字典
TON中的字典是作为cell的树（更准确地说是DAG）被引入的。这意味着如果你搜索、读取或写入字典，你需要解析树的相应分支的所有cell。这意味着
   * a) 字典操作的成本不是固定的（因为分支中节点的大小和数量取决于给定的字典和键）
   * b) 优化字典使用是明智的，使用特殊指令如`replace`而不是`delete`和`add`
   * c) 开发者应该注意迭代操作（如next和prev）以及`min_key`/`max_key`操作，以避免不必要地遍历整个字典

### 堆栈操作
注意FunC在底层操作堆栈条目。这意味着代码：
```cpp
(int a, int b, int c) = some_f();
return (c, b, a);
```
将被翻译成几个指令，这些指令改变堆栈上元素的顺序。

当堆栈条目数量大（10+），并且它们以不同的顺序被积极使用时，堆栈操作费用可能变得不可忽视。

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
// 消息的根cell中的位不包括在msg.bits中（lump_price支付它们）

### action_fees
```cpp
action_fees = sum(out_ext_msg_fwd_fee) + sum(int_msg_mine_fee)
```

### 配置文件

所有费用都以一定量的gas提名，并且可能会更改。配置文件表示当前费用成本。

* storage_fees = [p18](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam18)
* in_fwd_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)
* computation_fees = [p20](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam20), [p21](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam21)
* action_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)
* out_fwd_fees = [p24](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam24), [p25](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05#configparam25)

:::info
[直接链接到主网配置文件](https://explorer.toncoin.org/config?workchain=-1&shard=8000000000000000&seqno=22185244&roothash=165D55B3CFFC4043BFC43F81C1A3F2C41B69B33D6615D46FBFD2036256756382&filehash=69C43394D872B02C334B75F59464B2848CD4E23031C03CA7F3B1F98E8A13EE05)
:::

*2022年7月24日，基于@thedailyton [文章](https://telegra.ph/Fees-calculation-on-the-TON-Blockchain-07-24) *
