import Feedback from '@site/src/components/Feedback';

# 发送消息

消息的组成、解析和发送位于[TL-B schemas](/develop/data-formats/tl-b-language)、[交易阶段和TVM](/learn/tvm-instructions/tvm-overview)的交汇处。

事实上，FunC有[send_raw_message](/develop/func/stdlib#send_raw_message)函数，该函数期望一个序列化消息作为参数。

由于TON是一个功能广泛的系统，支持所有这些功能的消息可能看起来相当复杂。尽管如此，大多数情况下并不使用那么多功能，消息序列化在大多数情况下可以简化为： However, most of that functionality is not used in common scenarios, and message serialization, in most cases, can be simplified to:

```func
  cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

因此，开发者不用担忧，如果这份文档中的某些内容在第一次阅读时看起来难以理解，没有关系。只需把握总体思路即可。 Just grasp the general idea.

有时文档中可能会提到\*\*'gram'**这个词，但大多是在代码示例中，它只是**toncoin\*\*的一个过时名称。

Let's dive in!

## 消息类型

有三种类型的消息：

- **External** - messages sent from outside the blockchain to a smart contract inside the blockchain. Smart contracts should explicitly accept such messages during the so-called `credit_gas`. The node should not accept the message into a block or relay it to other nodes if it is not accepted.
- **Internal** - messages sent from one blockchain entity to another. In contrast to external messages, such messages may carry some TON and pay for themselves. Thus, smart contracts that receive such messages may not accept them. In this case, gas will be deducted from the message value.
- **Logs** - messages sent from a blockchain entity to the outer world. Generally, there is no mechanism for sending such messages out of the blockchain. While all nodes in the network have a consensus on whether a message was created, there are no rules for processing them. Logs may be directly sent to `/dev/null`, logged to disk, saved in an indexed database, or even sent by non-blockchain means (email/telegram/sms); these are at the sole discretion of the given node.

## 消息布局

我们将从内部消息布局开始。

描述智能合约可以发送的消息的TL-B方案如下：

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

Let's put it into words: The serialization of any message consists of three fields:

- `info`, a header that describes the source, destination, and other metadata.
- `init`, a field that is only required for initializing messages.
- `body`, the message payload.

`Maybe`、`Either`和其他类型的表达式意味着以下内容：

- 当我们有字段`info:CommonMsgInfoRelaxed`时，意味着`CommonMsgInfoRelaxed`的序列化直接注入到序列化cell中。
- 当我们有字段`body:(Either X ^X)`时，意味着当我们(反)序列化某种类型`X`时，我们首先放置一个`either`位，如果`X`被序列化到同一cell，则为`0`，如果它被序列化到单独的cell，则为`1`。
- When we have the field `init:(Maybe (Either StateInit ^StateInit))`, we first put `0` or `1` depending on whether this field is empty. 当我们有字段`init:(Maybe (Either StateInit ^StateInit))`时，意味着我们首先放置`0`或`1`，要取决于这个字段是否为空；如果不为空，我们序列化`Either StateInit ^StateInit`（再次，放置一个`either`位，如果`StateInit`被序列化到同一cell则为`0`，如果被序列化到单独的cell则为`1`）。

Let's focus on one particular `CommonMsgInforRelaxed` type, the internal message definition declared with the `int_msg_info$0` constructor.

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

It starts with the 1-bit prefix `0`.

Then, there are three 1-bit flags:

- Whether Instant Hypercube Routing is disabled (currently always true)
- 如果在处理操作过程中出现错误，则发送常规信息，不要回滚事务而忽略它
- Whether the message itself is the result of a bounce.

Then, source and destination addresses are serialized, followed by the message value and four integers related to message forwarding fees and time.

If a message is sent from the smart contract, some fields will be rewritten to the correct values. In particular, the validator will rewrite `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt`, and `created_at`. 如果消息是从智能合约发送的，其中一些字段将被重写为正确的值。特别是，验证者将重写`bounced`、`src`、`ihr_fee`、`fwd_fee`、`created_lt`和`created_at`。这意味着两件事：首先，另一个智能合约在处理消息时可以信任这些字段（发送者无法伪造来源地址、`bounced`标志位等）；其次，在序列化时我们可以将任何有效值放入这些字段中（无论如何这些值都将被重写）。

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

However, instead of serializing all fields step-by-step, developers usually use shortcuts. 然而，开发者通常使用快捷方式而不是逐步序列化所有字段。因此，让我们考虑如何使用[elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153)中的示例从智能合约发送消息。

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

首先，它将`0x18`值放入6位，即放入`0b011000`。这是什么？ What is this?

- 第一位是`0` — 1位前缀，表示它是`int_msg_info`。

- 然后有3位`1`、`1`和`0`，表示即时超立方路由被禁用，消息可以在处理过程中出错时回弹，消息本身不是回弹的结果。

- Then, there should be a sender address; however, since it will be rewritten with the same effect, any valid address may be stored there. 然后应该是发送者地址，但由于它无论如何都会被重写，因此可以存储任何有效地址。最短的有效地址序列化是`addr_none`的序列化，它序列化为两位字符串`00`。

因此，`.store_uint(0x18, 6)`是序列化标签和前4个字段的优化后的方式。

下一行序列化目的地址。

Then, we should serialize values. 然后我们应该序列化值。一般来说，消息值是一个`CurrencyCollection`对象，其方案如下：

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

This scheme means the message may carry the dictionary of additional _extra-currencies_ with the TON value. 这个方案意味着除了TON值之外，消息可能还携带了extra-currencies的字典。然而，目前我们可以忽略它，只假设消息值被序列化为“作为变量整数的nanotons数量”和“`0` - 空字典位”。

事实上，在上面的选举人代码中，我们通过`.store_coins(toncoins)`序列化代币数量，但接着只放置了长度等于`1 + 4 + 4 + 64 + 32 + 1 + 1`的零字符串。这代表着什么？ What is it?

- 第一个位表示空的extra-currencies字典。
- Then we have two 4-bit long fields. They encode 0 as `VarUInteger 16`. Since `ihr_fee` and `fwd_fee` will be overwritten, we may as well put them as zeroes.
- 然后我们将零放入`created_lt`和`created_at`字段。这些字段也将被重写；然而，与费用不同，这些字段有固定长度，因此被编码为64位和32位长的字符串。 Those fields will also be overwritten; however, in contrast to fees, these fields have a fixed length and are thus encoded as 64- and 32-bit long strings.
  > _（我们已经序列化了消息头并传递到init/body）_
- 接下来的零位表示没有`init`字段。
- 最后一个零位表示消息体将就地序列化。
- 之后，消息体（具有任意布局）就完成了编码。

这样，我们执行了4个序列化原语，而不是单独序列化了14个参数。

## 完整方案

消息布局和所有构成字段的完整方案（以及TON中所有对象的方案）在[block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)中呈现。

## 消息大小

:::info cell大小
Note that any [Cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) may contain up to `1023` bits. 请注意，任何[Cell](/learn/overviews/cells)最多可包含`1023`位。如果您需要存储更多数据，您应该将其分割成块并存储在引用cell中。
:::

例如，如果您的消息体大小为900位长，您无法将其存储在与消息头相同的cell中。
实际上，除了消息头字段外，cell的总大小将超过1023位，在序列化过程中将出现`cell溢出`异常。在这种情况下，原本代表“就地消息体标志位（Either）”的`0`应该变成`1`，消息体应该存储在引用cell中。 Including the message header fields would make the total cell size exceed 1023 bits, triggering a `cell overflow` exception during serialization.

In this case, use `1` instead of `0` for the in-place message body flag (Either), which will store the message body in a separate reference cell.

由于某些字段具有可变大小，因此应小心处理这些事项。

For instance, `MsgAddress` may be represented by four constructors:

- `addr_none`
- `addr_std`
- `addr_extern`
- `addr_var`

With length from 2 bits for `addr_none` to 586 bits for `addr_var` in the largest form.

The same stands for nanotons' amounts, which is serialized as `VarUInteger 16`.
That means 4 bits indicating the byte length of the integer and then bytes for the integer itself.

That way:

- `0` nanotons serialized as `0b0000` (4 bits indicating zero-length byte string + no bytes)
- `100000000000000000` nanotons (100,000,000 TON) serializes as:
  `0b10000000000101100011010001010111100001011101100010100000000000000000`
  (where `0b1000` specifies 8 bytes length followed by the 8-byte value)

:::info 消息大小
Note that the message has general size limits and cell count limits, too,
e.g., the maximum message size must not exceed `max_msg_bits`, and the number of cells per message must not exceed `max_msg_cells`.

更多配置参数及其值可在 [这里](/develop/howto/blockchain-configs#param-43) 找到。
:::

## 消息模式

:::info
For the latest information, refer to the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook).
:::

如您可能已经注意到，我们使用`send_raw_message`发送消息，除了消耗消息本身外，还接受mode（模式）。要了解最适合您需求的模式，请查看以下表格： This mode determines how the message is sent, including whether to pay for gas separately and how to handle errors. The TON Virtual Machine (TVM) processes messages differently depending on the mode value. It’s important to note that the mode parameter consists of two components, **mode** and **flag**, which serve different purposes:

- **Mode**: Defines the basic behavior when sending a message, such as whether to carry a balance or wait for message processing results. Different mode values represent different sending characteristics, which can be combined to meet specific requirements.
- flag：作为模式的附加功能，用于配置特定的报文行为，如单独支付转账费用或忽略处理错误。将标记添加到模式中可创建最终的报文发送模式。 The flag is added to the mode to create the final message-sending configuration.

使用`send_raw_message`函数时，根据需要选择合适的模式和标记组合非常重要。要找出最适合您需要的模式，请参阅下表： Refer to the following table to determine the best mode for your use case:

| Mode  | 描述                            |
| :---- | :---------------------------- |
| `0`   | 普通消息                          |
| `64`  | 除了新消息中最初指示的值之外，携带来自入站消息的所有剩余值 |
| `128` | 携带当前智能合约的所有余额，而不是消息中最初指示的值    |

| Flag  | 描述                                                                                                                |
| :---- | :---------------------------------------------------------------------------------------------------------------- |
| `+1`  | 发送普通信息并单独支付转账费用                                                                                                   |
| `+2`  | 忽略在 Action Phase 处理该信息时出现的一些错误（请查看下面的注释）                                                                          |
| `+16` | In the case of action failure, bounce the transaction. No effect if `+2` is used. |
| `+32` | 如果当前账户的结果余额为零，则必须销毁该账户（通常与Mode 128一起使用）                                                                           |

:::info +16 flag
If a contract receives a bounceable message, it processes the `storage` phase **before** the `credit` phase. 否则，它将在 `storage` 阶段 **之前** 处理`credit` 阶段。

[检查`bounce-enable` flag的源代码](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810)。
:::

:::warning

1. **+16 flag** - 不要在外部报文（如发给钱包的报文）中使用，因为没有发件人接收被退回的报文。

2. **+2 flag** - 这在外部消息（例如，发送到钱包）中非常重要。

:::

## Recommended approach: mode=3 {#mode3}

```func
send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS); ;; stdlib.fc L833
```

`mode` = 0, `flag` = 2

- `+1` : Pay transfer fees separately from the message value
- `+2` : Suppresses specific errors during message processing

This combination is the standard method for sending messages in TON.

---

### +2 flag

If the `IGNORE_ERRORS` flag is omitted and a message fails to process (e.g., due to insufficient balance), the transaction reverts. For wallet contracts, this prevents updates to critical data like the `seqno`.

```func
要为`send_raw_message`构建一个模式，您只需通过将Mode和Flag结合来组合它们。例如，如果您想发送常规消息并单独支付转账费用，请使用Mode`0`和Flag`+1`得到`mode = 1`。如果您想发送整个合约余额并立即销毁它，请使用Mode`128`和Flag`+32`得到`mode = 160`。
```

As a result, unprocessed external messages can be replayed until they expire or drain the contract's balance.

---

### 在action失败的情况下 - 弹回交易。如果使用了`+2`则无效。

The `IGNORE ERRORS` flag (`+2`) suppresses these specific errors during the Action Phase:

#### Suppressed errors

1. **Insufficient funds**

  - Message transfer value exhaustion
  - Insufficient balance for message processing
  - 没有足够的信息附加值来支付转发费用。
  - 没有足够的额外货币与消息一起发送。
  - 没有足够的资金支付出站外部消息。

2. **[Oversized message](#message-size)**

3. **Excessive Merkle depth**

  Message exceeds allowed Merkle tree complexity.

#### Non-suppressed errors

1. Malformed message structure
2. `mode` = 128, `flag` = 32 + 16
3. 出站消息在 StateInit 中有无效的库。
4. 外部消息不是普通消息，或包含 +16 或 +32 标志，或两者兼有。

---

### Security considerations

#### Current mitigations

- Most wallet apps auto-include `IGNORE_ERRORS` in transactions
- Wallet UIs often display transaction simulation results
- V5 wallets enforce `IGNORE_ERRORS` usage
- Validators limit message replays per block

#### Potential risks

- **Race conditions** causing stale backend balance checks
- **Legacy wallets** (V3/V4) without enforced checks
- **Incomplete validations** by wallet applications

---

### Example: jetton transfer pitfall

Consider this simplified Jetton wallet code:

```func
() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
int jetton_amount = in_msg_body~load_coins();
balance -= jetton_amount;
send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
save_data(status, balance, owner_address, jetton_master_address); }
```

If a transfer using `mode=3` fails due to a suppressed error:

1. Transfer action is not executed
2. Contract state updates persist (no rollback)
3. **Result:** permanent loss of `jetton_amount` from the balance

**Best practice**

Always pair `IGNORE_ERRORS` with robust client-side validations and real-time balance checks to prevent unintended state changes.

<Feedback />

