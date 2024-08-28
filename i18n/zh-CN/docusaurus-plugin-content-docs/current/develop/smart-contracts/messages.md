# 发送消息

消息的组成、解析和发送位于[TL-B schemas](/develop/data-formats/tl-b-language)、[交易阶段和TVM](/learn/tvm-instructions/tvm-overview)的交汇处。

事实上，FunC有[send_raw_message](/develop/func/stdlib#send_raw_message)函数，该函数期望一个序列化消息作为参数。

由于TON是一个功能广泛的系统，支持所有这些功能的消息可能看起来相当复杂。尽管如此，大多数情况下并不使用那么多功能，消息序列化在大多数情况下可以简化为：

```func
  cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

因此，开发者不用担忧，如果这份文档中的某些内容在第一次阅读时看起来难以理解，没有关系。只需把握总体思路即可。

有时文档中可能会提到\*\*'gram'**这个词，但大多是在代码示例中，它只是**toncoin\*\*的一个过时名称。

让我们深入了解！

## 消息类型

有三种类型的消息：

- 外部消息 — 从区块链外部发送到区块链内部智能合约的消息。这类消息应该在所谓的`credit_gas`阶段被智能合约明确接受。如果消息未被接受，节点不应该将其纳入进区块或转发给其他节点。
- 内部消息 — 从一个区块链实体发送到另一个区块链实体的消息。与外部消息不同，这类消息可以携带一些TON并为自己支付费用。接收此类消息的智能合约可能没有接受它，在这种情况下，消息价值中的gas将被扣除。
- 日志 — 从区块链实体发送到外部世界的消息。一般来说，没有将这类消息发送出区块链的机制。实际上，尽管网络中的所有节点对是否创建了消息达成共识，但没有关于如何处理它们的规则。日志可能被直接发送到`/dev/null`，记录到磁盘，保存到索引数据库，甚至通过非区块链手段（电子邮件/Telegram/短信）发送，所有这些都取决于给定节点的自行决定。

## 消息布局

我们将从内部消息布局开始。

描述智能合约可以发送的消息的TL-B方案如下：

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

让我们用语言来描述。任何消息的序列化都包括三个字段：info（某种标题，描述来源、目的地和其他元数据）、init（仅在消息初始化时需要的字段）和body（消息有效载荷）。

`Maybe`、`Either`和其他类型的表达式意味着以下内容：

- 当我们有字段`info:CommonMsgInfoRelaxed`时，意味着`CommonMsgInfoRelaxed`的序列化直接注入到序列化cell中。
- 当我们有字段`body:(Either X ^X)`时，意味着当我们(反)序列化某种类型`X`时，我们首先放置一个`either`位，如果`X`被序列化到同一cell，则为`0`，如果它被序列化到单独的cell，则为`1`。
- 当我们有字段`init:(Maybe (Either StateInit ^StateInit))`时，意味着我们首先放置`0`或`1`，要取决于这个字段是否为空；如果不为空，我们序列化`Either StateInit ^StateInit`（再次，放置一个`either`位，如果`StateInit`被序列化到同一cell则为`0`，如果被序列化到单独的cell则为`1`）。

`CommonMsgInfoRelaxed`的布局如下：

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

让我们现在专注于`int_msg_info`。
它以1位的前缀`0`开始，然后有三个1位的标志位，分别表示是否禁用即时超立方路由（目前始终为真）、是否在处理过程中出错时弹回消息，以及消息本身是否是弹回的结果。然后序列化来源和目的地址，接着是消息值和四个与消息转发费用和时间有关的整数。

如果消息是从智能合约发送的，其中一些字段将被重写为正确的值。特别是，验证者将重写`bounced`、`src`、`ihr_fee`、`fwd_fee`、`created_lt`和`created_at`。这意味着两件事：首先，另一个智能合约在处理消息时可以信任这些字段（发送者无法伪造来源地址、`bounced`标志位等）；其次，在序列化时我们可以将任何有效值放入这些字段中（无论如何这些值都将被重写）。

消息的直接序列化如下所示：

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee 
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```

然而，开发者通常使用快捷方式而不是逐步序列化所有字段。因此，让我们考虑如何使用[elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153)中的示例从智能合约发送消息。

```func
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 32);
  }
  send_raw_message(msg.end_cell(), mode);
}
```

首先，它将`0x18`值放入6位，即放入`0b011000`。这是什么？

- 第一位是`0` — 1位前缀，表示它是`int_msg_info`。

- 然后有3位`1`、`1`和`0`，表示即时超立方路由被禁用，消息可以在处理过程中出错时回弹，消息本身不是回弹的结果。

- 然后应该是发送者地址，但由于它无论如何都会被重写，因此可以存储任何有效地址。最短的有效地址序列化是`addr_none`的序列化，它序列化为两位字符串`00`。

因此，`.store_uint(0x18, 6)`是序列化标签和前4个字段的优化后的方式。

下一行序列化目的地址。

然后我们应该序列化值。一般来说，消息值是一个`CurrencyCollection`对象，其方案如下：

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

这个方案意味着除了TON值之外，消息可能还携带了extra-currencies的字典。然而，目前我们可以忽略它，只假设消息值被序列化为“作为变量整数的nanotons数量”和“`0` - 空字典位”。

事实上，在上面的选举人代码中，我们通过`.store_coins(toncoins)`序列化代币数量，但接着只放置了长度等于`1 + 4 + 4 + 64 + 32 + 1 + 1`的零字符串。这代表着什么？

- 第一个位表示空的extra-currencies字典。
- 然后我们有两个长度为4位的字段。它们以`VarUInteger 16`编码为0。事实上，由于`ihr_fee`和`fwd_fee`将被重写，我们同样可以在那里放置零。
- 然后我们将零放入`created_lt`和`created_at`字段。这些字段也将被重写；然而，与费用不同，这些字段有固定长度，因此被编码为64位和32位长的字符串。
- *（我们已经序列化了消息头并传递到init/body）*
- 接下来的零位表示没有`init`字段。
- 最后一个零位表示消息体将就地序列化。
- 之后，消息体（具有任意布局）就完成了编码。

这样，我们执行了4个序列化原语，而不是单独序列化了14个参数。

## 完整方案

消息布局和所有构成字段的完整方案（以及TON中所有对象的方案）在[block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)中呈现。

## 消息大小

:::info cell大小
请注意，任何[Cell](/learn/overviews/cells)最多可包含`1023`位。如果您需要存储更多数据，您应该将其分割成块并存储在引用cell中。
:::

例如，如果您的消息体大小为900位长，您无法将其存储在与消息头相同的cell中。
实际上，除了消息头字段外，cell的总大小将超过1023位，在序列化过程中将出现`cell溢出`异常。在这种情况下，原本代表“就地消息体标志位（Either）”的`0`应该变成`1`，消息体应该存储在引用cell中。

由于某些字段具有可变大小，因此应小心处理这些事项。

例如，`MsgAddress`可以由四个构造器表示：`addr_none`、`addr_std`、`addr_extern`、`addr_var`，长度从2位（对于`addr_none`）到586位（对于最大形式的`addr_var`）。nanotons的数量也是如此，它被序列化为`VarUInteger 16`。这意味着，4位指示整数的字节长度，然后指示整数本身的较前面的字节。这样，0 nanotons将被序列化为`0b0000`（4位编码着零字节长度字符串，然后是零字节），而100,000,000 TON（或100000000000000000 nanotons）将被序列化为`0b10000000000101100011010001010111100001011101100010100000000000000000`（`0b1000`表示8个字节长度，然后是8个字节其本身）。

:::info 消息大小

更多配置参数及其值可在 [这里](/develop/howto/blockchain-configs#param-43) 找到。
:::

## 消息模式

如您可能已经注意到，我们使用`send_raw_message`发送消息，除了消耗消息本身外，还接受mode（模式）。要了解最适合您需求的模式，请查看以下表格：

| Mode  | 描述                            |
| :---- | :---------------------------- |
| `0`   | 普通消息                          |
| `64`  | 除了新消息中最初指示的值之外，携带来自入站消息的所有剩余值 |
| `128` | 携带当前智能合约的所有余额，而不是消息中最初指示的值    |

| Flag  | 描述                                       |
| :---- | :--------------------------------------- |
| `+1`  | 单独支付转账费用                                 |
| `+2`  | 忽略在 Action Phase 处理该信息时出现的一些错误（请查看下面的注释） |
| `+16` | 在action失败的情况下 - 弹回交易。如果使用了`+2`则无效。       |
| `+32` | 如果当前账户的结果余额为零，则必须销毁该账户（通常与Mode 128一起使用）  |

:::info +2 flag

1. Toncoins 不足：
   - 没有足够的值与消息一起传送(所有入站消息值都已消耗)。
   - 没有足够的资金来处理消息。
   - 没有足够的信息附加值来支付转发费用。
   - 没有足够的额外货币与消息一起发送。
   - 没有足够的资金支付出站外部消息。
2. 消息过大（请查看 [消息大小](messages#message-size) 以获取更多信息）。
3. 消息的 Merkle 深度太大。

但在以下情况下，它不会忽略错误：

1. 消息的格式无效。
2. 消息模式包括 64 和128 modes。
3. 出站消息在 StateInit 中有无效的库。
4. 外部消息不是普通消息，或包含 +16 或 +32 标志，或两者兼有。
   ::：

要为`send_raw_message`构建一个模式，您只需通过将Mode和Flag结合来组合它们。例如，如果您想发送常规消息并单独支付转账费用，请使用Mode`0`和Flag`+1`得到`mode = 1`。如果您想发送整个合约余额并立即销毁它，请使用Mode`128`和Flag`+32`得到`mode = 160`。
