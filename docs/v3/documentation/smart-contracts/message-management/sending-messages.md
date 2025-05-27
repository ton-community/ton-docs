import Feedback from '@site/src/components/Feedback';

# Sending messages

Composition, parsing, and sending messages lie at the intersection of [TL-B schemas](/v3/documentation/data-formats/tlb/tl-b-language), [transaction phases, and TVM](/v3/documentation/tvm/tvm-overview).

Indeed, FunC exposes the [send_raw_message](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) function which expects a serialized message as an argument.

Since TON is a comprehensive system with wide functionality, messages that need to support all of this functionality may appear quite complicated. However, most of that functionality is not used in common scenarios, and message serialization, in most cases, can be simplified to:

```func
 cell msg = begin_cell()
 .store_uint(0x18, 6)
 .store_slice(addr)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
 .store_slice(message_body)
 .end_cell();
```

Therefore, the developer should not worry; if something in this document seems incomprehensible on first reading, that's okay. Just grasp the general idea.

Sometimes, the word **`gram`** appears in the documentation, primarily in code examples; it is simply an outdated name for **Toncoin**.

Let's dive in!

## Types of messages

There are three types of messages:

- **External** - messages sent from outside the blockchain to a smart contract inside the blockchain. Smart contracts should explicitly accept such messages during the so-called `credit_gas`. The node should not accept the message into a block or relay it to other nodes if it is not accepted.
- **Internal** - messages sent from one blockchain entity to another. In contrast to external messages, such messages may carry some TON and pay for themselves. Thus, smart contracts that receive such messages may not accept them. In this case, gas will be deducted from the message value.
- **Logs** - messages sent from a blockchain entity to the outer world. Generally, there is no mechanism for sending such messages out of the blockchain. While all nodes in the network have a consensus on whether a message was created, there are no rules for processing them. Logs may be directly sent to `/dev/null`, logged to disk, saved in an indexed database, or even sent by non-blockchain means (email/telegram/sms); these are at the sole discretion of the given node.

## Message layout

We will start with the internal message layout.

TL-B scheme, which describes messages that smart contracts can send, is as follows:

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed
 init:(Maybe (Either StateInit ^StateInit))
 body:(Either X ^X) = MessageRelaxed X;
```

Let's put it into words: The serialization of any message consists of three fields:

- `info`, a header that describes the source, destination, and other metadata.
- `init`, a field that is only required for initializing messages.
- `body`, the message payload.

`Maybe` and `Either` and other types of expressions mean the following:

- When we have the field `info:CommonMsgInfoRelaxed`, it means that the serialization of `CommonMsgInfoRelaxed` is injected directly into the serialization cell.
- When we have the field `body:(Either X ^X)`, it means that when we (de)serialize some type `X`, we first put one `either` bit, which is `0` if `X` is serialized to the same cell, or `1` if it is serialized to the separate cell.
- When we have the field `init:(Maybe (Either StateInit ^StateInit))`, we first put `0` or `1` depending on whether this field is empty. If it is not empty, we serialize `Either StateInit ^StateInit` (again, put one `either` bit, which is `0` if `StateInit` is serialized to the same cell or `1` if it is serialized to a separate cell).

Let's focus on one particular `CommonMsgInforRelaxed` type, the internal message definition declared with the `int_msg_info$0` constructor.

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
 src:MsgAddress dest:MsgAddressInt
 value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
 created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

It starts with the 1-bit prefix `0`.

Then, there are three 1-bit flags:

- Whether Instant Hypercube Routing is disabled (currently always true)
- Whether a message should be bounced if there are errors during its processing
- Whether the message itself is the result of a bounce.

Then, source and destination addresses are serialized, followed by the message value and four integers related to message forwarding fees and time.

If a message is sent from the smart contract, some fields will be rewritten to the correct values. In particular, the validator will rewrite `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt`, and `created_at`. That means two things: first, another smart contract while handling the message may trust those fields (sender may not forge source address, `bounced` flag, etc.), and second, during serialization, we may put to those fields any valid values because those values will be overwritten anyway.

Straight-forward serialization of the message would be as follows:

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

However, instead of serializing all fields step-by-step, developers usually use shortcuts. Thus, let's consider how messages can be sent from the smart contract using an example from [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153).

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

First, it combined `0b011000` into the `0x18` value. What is this?

- The first bit is a `0` - 1-bit prefix, which indicates that it is `int_msg_info`.

- Then there are 3 bits `1`, `1`, and `0`, meaning Instant Hypercube Routing is disabled, messages can be bounced, and that message is not the result of bouncing itself.
- Then, there should be a sender address; however, since it will be rewritten with the same effect, any valid address may be stored there. The shortest valid address serialization is that of `addr_none`, which serializes as a two-bit string `00`.

Thus, `.store_uint(0x18, 6)` is the optimized serialization method for the tag and the first four fields.

The following line serializes the destination address.

Then, we should serialize values. Generally, the message value is a `CurrencyCollection` object with the following scheme:

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection
 = CurrencyCollection;
```

This scheme means the message may carry the dictionary of additional _extra-currencies_ with the TON value. However, we may neglect it and assume that the message value is serialized as number of nanotons as variable integer and "`0` - empty dictionary bit".

Indeed, in the elector code above, we serialize coins amounts via `.store_coins(toncoins)` but then just put a string of zeros with a length equal to `1 + 4 + 4 + 64 + 32 + 1 + 1`. What is it?

- The first bit stands for empty extra-currencies dictionary.
- Then we have two 4-bit long fields. They encode 0 as `VarUInteger 16`. Since `ihr_fee` and `fwd_fee` will be overwritten, we may as well put them as zeroes.
- Then we put zero to the `created_lt` and `created_at` fields. Those fields will also be overwritten; however, in contrast to fees, these fields have a fixed length and are thus encoded as 64- and 32-bit long strings.
  > _We had already serialized the message header and passed to init/body at that moment_
- Next zero-bit means that there is no `init` field.
- The last zero-bit means that msg_body will be serialized in-place.
- After that, the message body (with an arbitrary layout) is encoded.

Instead of individual serialization of 14 parameters, we execute 4 serialization primitives.

## Full scheme

The entire scheme of the message layout and the layout of all constituting fields, as well as the scheme of ALL objects in TON, are presented in [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb).

## Message size

:::info cell size
Note that any [Cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) may contain up to `1023` bits. If you need to store more data, you should split it into chunks and store it in reference cells.
:::

For example, if your message body is 900 bits long, you can't store it in the same cell as the message header. Including the message header fields would make the total cell size exceed 1023 bits, triggering a `cell overflow` exception during serialization.

In this case, use `1` instead of `0` for the in-place message body flag (Either), which will store the message body in a separate reference cell.

Those things should be handled carefully because some fields have variable sizes.

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

:::info message size
Note that the message has general size limits and cell count limits, too,
e.g., the maximum message size must not exceed `max_msg_bits`, and the number of cells per message must not exceed `max_msg_cells`.

More configuration parameters and their values can be found [here](/v3/documentation/network/configs/blockchain-configs#param-43).
:::

## Message modes

:::info
For the latest information, refer to the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook).
:::

As you may have noticed, we send messages using `send_raw_message`, which also accepts a mode parameter and consumes the message. This mode determines how the message is sent, including whether to pay for gas separately and how to handle errors. The TON Virtual Machine (TVM) processes messages differently depending on the mode value. It’s important to note that the mode parameter consists of two components, **mode** and **flag**, which serve different purposes:

- **Mode**: Defines the basic behavior when sending a message, such as whether to carry a balance or wait for message processing results. Different mode values represent different sending characteristics, which can be combined to meet specific requirements.
- **Flag**: Acts as an addition to the mode, configuring specific message behaviors, such as paying transfer fees separately or ignoring processing errors. The flag is added to the mode to create the final message-sending configuration.

When using the `send_raw_message` function, choosing the appropriate combination of mode and flag for your needs is crucial. Refer to the following table to determine the best mode for your use case:

| Mode  | Description                                                                                                            |
| :---- | :--------------------------------------------------------------------------------------------------------------------- |
| `0`   | Ordinary message                                                                                                       |
| `64`  | Carry all the remaining value of the inbound message in addition to the value initially indicated in the new message   |
| `128` | Carry all the remaining balance of the current smart contract instead of the value originally indicated in the message |

| Flag  | Description                                                                             |
| :---- | :-------------------------------------------------------------------------------------- |
| `+1`  | Pay transfer fees separately from the message value                                     |
| `+2`  | Ignore some errors arising while processing this message during the action phase        |
| `+16` | In the case of action failure, bounce the transaction. No effect if `+2` is used.       |
| `+32` | Destroy the current account if its resulting balance is zero (often used with Mode 128) |

:::info +16 Flag
If a contract receives a bounceable message, it processes the `storage` phase **before** the `credit` phase. Otherwise, it processes the `credit` phase **before** the `storage` phase.

For more details, check the [source code with checks for the `bounce-enable` flag](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810).
:::

:::warning

1. **+16 flag** - do not use it in external messages (e.g., to wallets) because there is no sender to receive the bounced message.

2. **+2 flag** - important in external messages (e.g. to wallets).

:::

## Recommended approach: mode=3 {#mode3}

```func
send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS); ;; stdlib.fc L833
```

The `mode=3` combines the `0` mode and two flags:

- `+1` : Pay transfer fees separately from the message value
- `+2` : Suppresses specific errors during message processing

This combination is the standard method for sending messages in TON.

---

### Behavior without +2 flag

If the `IGNORE_ERRORS` flag is omitted and a message fails to process (e.g., due to insufficient balance), the transaction reverts. For wallet contracts, this prevents updates to critical data like the `seqno`.

```func
throw_unless(33, msg_seqno == stored_seqno);
throw_unless(34, subwallet_id == stored_subwallet);
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
accept_message();
set_data(begin_cell()
 .store_uint(stored_seqno + 1, 32)
 .store_uint(stored_subwallet, 32)
 .store_uint(public_key, 256)
 .store_dict(plugins)
 .end_cell());
commit(); ;; This will be reverted on action error.
```

As a result, unprocessed external messages can be replayed until they expire or drain the contract's balance.

---

### Error handling with +2 flag

The `IGNORE ERRORS` flag (`+2`) suppresses these specific errors during the Action Phase:

#### Suppressed errors

1. **Insufficient funds**

   - Message transfer value exhaustion
   - Insufficient balance for message processing
   - Inadequate attached value for forwarding fees
   - Missing extra currency for message transfer
   - Insufficient funds for external message delivery

2. **[Oversized message](#message-size)**

3. **Excessive Merkle depth**

   Message exceeds allowed Merkle tree complexity.

#### Non-suppressed errors

1. Malformed message structure
2. Conflicting mode flags (`+64` and `+128` used together)
3. Invalid libraries in `StateInit` of the outbound message
4. Non-ordinary external messages (e.g., using `+16` or `+32` flags)

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

