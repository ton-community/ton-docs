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

Sometimes the word **'gram'** may appear in the documentation, primarily in code examples; it is simply an outdated name for **toncoin**.

Let's dive in!

## Types of messages

There are three types of messages:

- external—messages sent from outside of the blockchain to a smart contract inside the blockchain. Such messages should be explicitly accepted by smart contracts during the so-called `credit_gas`. If the message is not accepted, the node should not accept it into a block or relay it to other nodes.
- internal—messages sent from one blockchain entity to another. Such messages, in contrast to external ones, may carry some TON and pay for themselves. Thus, smart contracts that receive such messages may not accept it. In this case, gas will be deducted from the message value.
- logs—messages sent from a blockchain entity to the outer world. Generally, there is no mechanism for sending such messages out of the blockchain. In fact, while all nodes in the network have consensus on whether a message was created or not, there are no rules on how to process them. Logs may be directly sent to `/dev/null`, logged to disk, saved an indexed database, or even sent by non-blockchain means (email/telegram/sms), all of these are at the sole discretion of the given node.

## Message layout

We will start with the internal message layout.

TL-B scheme, which describes messages that can be sent by smart contracts, is as follows:

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

Let's put it into words. Serialization of any message consists of three fields: info (header of some sort which describes the source, destination, and other metadata), init (field which is only required for initialization of messages), and body (message payload).

`Maybe` and `Either` and other types of expressions mean the following:

- when we have the field `info:CommonMsgInfoRelaxed`, it means that the serialization of `CommonMsgInfoRelaxed` is injected directly to the serialization cell.
- when we have the field `body:(Either X ^X)`, it means that when we (de)serialize some type `X`, we first put one `either` bit, which is `0` if `X` is serialized to the same cell, or `1` if it is serialized to the separate cell.
- when we have the field `init:(Maybe (Either StateInit ^StateInit))`, it means that we first put `0` or `1` depending on whether this field is empty or not; and if it is not empty, we serialize `Either StateInit ^StateInit` (again, put one `either` bit which is `0` if `StateInit` is serialized to the same cell or `1` if it is serialized to a separate cell).

`CommonMsgInfoRelaxed` layout is as follows:

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

Let's focus on `int_msg_info` for now.
It starts with 1bit prefix `0`, then there are three 1-bit flags, namely whether Instant Hypercube Routing disabled (currently always true), whether message should be bounced if there are errors during its processing, whether message itself is result of bounce. Then source and destination addresses are serialized, followed by the value of the message and four integers related to message forwarding fees and time.

If a message is sent from the smart contract, some of those fields will be rewritten to the correct values. In particular, validator will rewrite `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt` and `created_at`. That means two things: first, another smart-contract during handling message may trust those fields (sender may not forge source address, `bounced` flag, etc); and second, that during serialization we may put to those fields any valid values (anyway those values will be overwritten).

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

However, instead of step-by-step serialization of all fields, usually developers use shortcuts. Thus, let's consider how messages can be sent from the smart contract using an example from [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153).

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

First, it put `0x18` value into 6 bits that is put `0b011000`. What is it?

- First bit is `0`—1bit prefix which indicates that it is `int_msg_info`.

- Then there are 3 bits `1`, `1` and `0`, meaning Instant Hypercube Routing is disabled, messages can be bounced, and that message is not the result of bouncing itself.
- Then there should be sender address, however since it anyway will be rewritten with the same effect any valid address may be stored there. The shortest valid address serialization is that of `addr_none` and it serializes as a two-bit string `00`.

Thus, `.store_uint(0x18, 6)` is the optimized way of serializing the tag and the first 4 fields.

Next line serializes the destination address.

Then we should serialize values. Generally, the message value is a `CurrencyCollection` object with the following scheme:

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32))
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection
           = CurrencyCollection;
```

This scheme means that in addition to the TON value, message may carry the dictionary of additional _extra-currencies_. However, currently we may neglect it and just assume that the message value is serialized as "number of nanotons as variable integer" and "`0` - empty dictionary bit".

Indeed, in the elector code above we serialize coins' amounts via `.store_coins(toncoins)` but then just put a string of zeros with length equal to `1 + 4 + 4 + 64 + 32 + 1 + 1`. What is it?

- First bit stands for empty extra-currencies dictionary.
- Then we have two 4-bit long fields. They encode 0 as `VarUInteger 16`. In fact, since `ihr_fee` and `fwd_fee` will be overwritten, we may as well put there zeroes.
- Then we put zero to `created_lt` and `created_at` fields. Those fields will be overwritten as well; however, in contrast to fees, these fields have a fixed length and are thus encoded as 64- and 32-bit long strings.
- _(we had already serialized the message header and passed to init/body at that moment)_
- Next zero-bit means that there is no `init` field.
- The last zero-bit means that msg_body will be serialized in-place.
- After that, message body (with arbitrary layout) is encoded.

That way, instead of individual serialization of 14 parameters, we execute 4 serialization primitives.

## Full scheme

Full scheme of message layout and the layout of all constituting fields (as well as scheme of ALL objects in TON) are presented in [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb).

## Message size

:::info cell size
Note that any [Cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) may contain up to `1023` bits. If you need to store more data, you should split it into chunks and store in reference cells.
:::

If, for instance, your message body size is 900 bits long, you can not store it in the same cell as the message header.
Indeed, in addition to message header fields, the total size of the cell will be more than 1023 bits, and during serialization there will be `cell overflow` exception. In this case, instead of `0` that stands for "inplace message body flag (Either)" there should be `1` and the message body should be stored in the reference cell.

Those things should be handled carefully due to the fact that some fields have variable sizes.

For instance, `MsgAddress` may be represented by four constructors: `addr_none`, `addr_std`, `addr_extern`, `addr_var` with length from 2 bits ( for `addr_none`) to 586 bits (for `addr_var` in the largest form). The same stands for nanotons' amounts which is serialized as `VarUInteger 16`. That means, 4 bits indicating the byte length of the integer and then indicated earlier bytes for integer itself. That way, 0 nanotons will be serialized as `0b0000` (4 bits which encode a zero-length byte string and then zero bytes), while 100.000.000 TON (or 100000000000000000 nanotons) will be serialized as `0b10000000000101100011010001010111100001011101100010100000000000000000` (`0b1000` stands for 8 bytes and then 8 bytes themselves).

:::info message size
Note that message has general size limits and cell count limits too,
e.g.: maximum message size must not exceed `max_msg_bits`, the number of cells per message must not exceed `max_msg_cells`...

More configuration parameters and there values can be found [here](/v3/documentation/network/configs/blockchain-configs#param-43).
:::

## Message Modes

:::info
For the latest information, refer to the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook).
:::

As you may have noticed, we send messages using `send_raw_message`, which, in addition to consuming the message itself, also accepts a mode parameter. This mode determines how the message is sent, including whether to pay for gas separately and how to handle errors. When the TON Virtual Machine (TVM) processes messages, it behaves differently depending on the mode value. It’s important to note that the mode parameter consists of two components: **mode** and **flag**, which serve different purposes:

- **Mode**: Defines the basic behavior when sending a message, such as whether to carry a balance or wait for message processing results. Different mode values represent different sending characteristics, and they can be combined to meet specific requirements.
- **Flag**: Acts as an addition to the mode, configuring specific message behaviors, such as paying transfer fees separately or ignoring processing errors. The flag is added to the mode to create the final message-sending configuration.

When using the `send_raw_message` function, it’s crucial to choose the appropriate combination of mode and flag for your needs. Refer to the following table to determine the best mode for your use case:

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

1. **+16 flag** - do not use in external messages (e.g. to wallets), because there is no sender to receive the bounced message.

2. **+2 flag** - important in external messages (e.g. to wallets).

:::

## Recommended approach: `mode=3` {#mode3}

```func
send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS); ;; stdlib.fc L833
```

The `sendMode=3` combines `0` mode and two flags:

- `1` (PAY FEES SEPARATELY): Pay transfer fees separately from the message value
- `2` (IGNORE ERRORS): Suppresses specific errors during message processing

This combination is the standard method for sending messages in TON.

---

### Behavior without +2 flag

If the `IGNORE ERRORS` flag is omitted and a message fails to process (e.g., due to insufficient balance), the entire transaction reverts. For wallet contracts, this prevents updates to critical data like the `seqno`.

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

### Error handling with +2 Flag

The `IGNORE ERRORS` flag (`+2`) suppresses these specific errors during the Action Phase:

#### Suppressed errors

1. **Insufficient funds**

   - Message transfer value exhaustion
   - Insufficient balance for message processing
   - Inadequate attached value for forwarding fees
   - Missing extra currency for message transfer
   - Insufficient funds for external message delivery

2. **Oversized message**  
   Exceeds [size limits](#message-size).

3. **Excessive Merkle depth**  
   Message exceeds allowed Merkle tree complexity.

#### Non-suppressed errors

1. Malformed message structure
2. Conflicting mode flags (`64` and `128` used together)
3. Invalid libraries in `StateInit` of outbound message
4. Non-ordinary external messages (e.g., using `+16` or `+32` flags)

---

### Security considerations

#### Current mitigations

- Most wallet apps auto-include `IGNORE ERRORS` in transactions
- Wallet UIs often display transaction simulation results
- V5 wallets enforce `IGNORE ERRORS` usage
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

If a transfer using `sendMode=3` fails due to a suppressed error:

1. Transfer action is not executed
2. Contract state updates persist (no rollback)
3. **Result:** Permanent loss of `jetton_amount` from the balance

---

**Best Practice**  
Always pair `IGNORE ERRORS` with robust client-side validations and real-time balance checks to prevent unintended state changes.
