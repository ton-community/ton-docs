import Feedback from '@site/src/components/Feedback';

# Internal messages

## Overview

Smart contracts interact with each other by sending so-called **internal messages**. When an internal message reaches its intended destination, an ordinary transaction is created on behalf of the destination account, and the internal message is processed as specified by the code and the persistent data of this account (smart contract).

:::info
In particular, the processing transaction can create one or several outbound internal messages, some of which may be addressed to the source address of the internal message being processed. This can be used to create simple "client-server applications" when a query is encapsulated in an internal message and sent to another smart contract, which processes the query and sends back a response again as an internal message.
:::

This approach requires distinguishing whether an internal message is a:

1. **Query** - initiating an action/request
2. **Response** - replying to a query
3. **Simple transfer** - requiring no processing (like basic value transfers)

Additionally, when receiving responses, there must be a clear way to match them to their original queries.

To implement this, the following message layout approaches are recommended (note: TON Blockchain imposes no message body restrictions - these are purely advisory):

### Internal message structure

The body of the message can be embedded into the message itself or stored in a separate cell referenced by the message, as indicated by the TL-B scheme fragment:

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

The receiving smart contract should accept at least internal messages with embedded message bodies (whenever they fit into the cell containing the message). Suppose it accepts message bodies in separate cells (using the `right` constructor of `(Either X ^X)`). In that case, the processing of the inbound message should not depend on the specific embedding option chosen for the message body. On the other hand, it is perfectly valid not to support message bodies in separate cells for simpler queries and responses.

### Internal message body

The message body typically begins with the following fields:

- A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed or the `method` of the smart contract to be invoked.
- A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
- The remainder of the message body is specific for each supported value of `op`.

### Simple message with a comment

If `op` is zero, the message is a "simple transfer message with the comment". The comment is contained in the remainder of the message body (without any `query_id` field, i.e., starting from the fifth byte). If it does not begin with the byte `0xff`, the comment is a text one; it can be displayed "as is" to the end user of a wallet (after filtering out invalid and control characters and checking that it is a valid UTF-8 string).

When a comment is long enough that it doesn’t fit in a cell, the non-fitting end of the line is put to the first reference of the cell. This process continues recursively to describe comments that don’t fit in two or more cells:

```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
 ↳1st_ref("string continuation" up to 127 bytes)
 ↳1st_ref("string continuation" up to 127 bytes)
 ↳....
```

The same format is used for comments for NFT and [jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format) transfers.

For instance, users may indicate the purpose of a simple transfer from their wallet to another user’s wallet in this text field. On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store’s software.

Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a simple transfer message. In this way, once `op` is found to be zero, the smart contract function for processing inbound internal messages (usually called `recv_internal()`) should immediately terminate with a zero exit code indicating success (e.g., by throwing exception `0`, if the smart contract has installed no custom exception handler). This will lead to the receiving account being credited with the value transferred by the message without any further effect.

### Messages with encrypted comments

If `op` is `0x2167da4b`, then the message is a transfer message with the encrypted comment. This message is serialized as follows:

Input:

- `pub_1` and `priv_1` - Ed25519 public and private keys of the sender, 32 bytes each.
- `pub_2` - Ed25519 public key of the receiver, 32 bytes.
- `msg` - a message to be encrypted, arbitrary byte string. `len(msg) <= 960`.

#### Encryption algorithm

1. Calculate `shared_secret` using `priv_1` and `pub_2`.
2. Let `salt` be the [bas64url representation](/v3/documentation/smart-contracts/addresses#user-friendly-address) of the sender wallet address with `isBounceable=1` and `isTestnetOnly=0`.
3. Select byte string `prefix` of length between 16 and 31 such that `len(prefix+msg)` is divisible by 16. The first byte of `prefix` equals `len(prefix)`, and the other bytes are random. Let `data = prefix + msg`.
4. Let `msg_key` be the first 16 bytes of `hmac_sha512(salt, data)`.
5. Calculate `x = hmac_sha512(shared_secret, msg_key)`. Let `key=x[0:32]` and `iv=x[32:48]`.
6. Encrypt `data` using AES-256 in CBC mode with `key` and `iv`.
7. Construct the encrypted comment:
   1. `pub_xor = pub_1 ^ pub_2` - 32 bytes. This allows each party to decrypt the message without looking up the other’s public key.
   2. `msg_key` - 16 bytes.
   3. Encrypted `data`.
8. The body of the message starts with the 4-byte tag `0x2167da4b`. Then, this encrypted comment is stored:
   1. The byte string is divided into segments and is stored in a chain of cells `c_1,...,c_k` (`c_1` is the root of the body). Each cell (except for the last one) has a reference to the next.
   2. `c_1` contains up to 35 bytes (not including the 4-byte tag); all other cells contain up to 127 bytes.
   3. This format has limitations: `k <= 16`, max string length is 1024.

Comments for NFT and jetton transfers follow the same format. Note that the public key of the sender and receiver addresses (not jetton-wallet addresses) should be used.

:::info  
Learn from examples of the message encryption algorithm:

- [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
- [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
  :::

### Simple transfer messages without comments

A simple transfer message without comment has an empty body even without an `op` field.
The above considerations apply to such messages as well. Note that such messages should have their bodies embedded into the message cell.

### Distinction between query and response messages

We expect "query" messages to have an `op` with the high-order bit clear, i.e., in the range `1 .. 2^31-1`, and "response" messages to have an `op` with the high-order bit set, i.e., in the range `2^31 .. 2^32-1`. If a method is neither a query nor a response (so that the corresponding message body does not contain a `query_id` field), it should use an `op` in the "query" range `1 .. 2^31 - 1`.

### Handling of standard response messages

There are some "standard" response messages with the `op` equal to `0xffffffff` and `0xfffffffe`. In general, the values of `op` from `0xfffffff0` to `0xffffffff` are reserved for such standard responses.

- `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
- `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.

Notice that unknown "responses" (with an `op` in the range `2^31 .. 2^32-1`) should be ignored (in particular, no response with an `op` equal to `0xffffffff` should be generated in response to them), just as unexpected bounced messages (with the "bounced" flag set).

## Known op codes

:::info
Also op-code, op::code and operational code
:::

| Contract type | Hex code   | OP::code                                                                                                                               |
| ------------- | ---------- |----------------------------------------------------------------------------------------------------------------------------------------|
| Global        | 0x00000000 | Text comment                                                                                                                           |
| Global        | 0xffffffff | Bounce                                                                                                                                 |
| Global        | 0x2167da4b | [Encrypted comment](/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments)           |
| Global        | 0xd53276db | Excesses                                                                                                                               |
| Elector       | 0x4e73744b | New stake                                                                                                                              |
| Elector       | 0xf374484c | New stake confirmation                                                                                                                 |
| Elector       | 0x47657424 | Recover stake request                                                                                                                  |
| Elector       | 0x47657424 | Recover stake response                                                                                                                 |
| Wallet        | 0x0f8a7ea5 | Jetton transfer                                                                                                                        |
| Wallet        | 0x235caf52 | [Jetton call to](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7)           |
| Jetton        | 0x178d4519 | Jetton internal transfer                                                                                                               |
| Jetton        | 0x7362d09c | Jetton notify                                                                                                                          |
| Jetton        | 0x595f07bc | Jetton burn                                                                                                                            |
| Jetton        | 0x7bdd97de | Jetton burn notification                                                                                                               |
| Jetton        | 0xeed236d3 | Jetton set status                                                                                                                      |
| Jetton-Minter | 0x642b7d07 | Jetton mint                                                                                                                            |
| Jetton-Minter | 0x6501f354 | Jetton change admin                                                                                                                    |
| Jetton-Minter | 0xfb88e119 | Jetton claim admin                                                                                                                     |
| Jetton-Minter | 0x7431f221 | Jetton drop admin                                                                                                                      |
| Jetton-Minter | 0xcb862902 | Jetton change metadata                                                                                                                 |
| Jetton-Minter | 0x2508d66a | Jetton upgrade                                                                                                                         |
| Vesting       | 0xd372158c | [Top up](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vesting       | 0x7258a69b | Add whitelist                                                                                                                          |
| Vesting       | 0xf258a69b | Add whitelist response                                                                                                                 |
| Vesting       | 0xa7733acd | Send                                                                                                                                   |
| Vesting       | 0xf7733acd | Send response                                                                                                                          |
| Dedust        | 0x9c610de3 | Dedust swap extout                                                                                                                     |
| Dedust        | 0xe3a0d482 | Dedust swap jetton                                                                                                                     |
| Dedust        | 0xea06185d | Dedust swap internal                                                                                                                   |
| Dedust        | 0x61ee542d | Swap external                                                                                                                          |
| Dedust        | 0x72aca8aa | Swap peer                                                                                                                              |
| Dedust        | 0xd55e4686 | Deposit liquidity internal                                                                                                             |
| Dedust        | 0x40e108d6 | Deposit liquidity jetton                                                                                                               |
| Dedust        | 0xb56b9598 | Deposit liquidity all                                                                                                                  |
| Dedust        | 0xad4eb6f5 | Pay out from pool                                                                                                                      |
| Dedust        | 0x474а86са | Payout                                                                                                                                 |
| Dedust        | 0xb544f4a4 | Deposit                                                                                                                                |
| Dedust        | 0x3aa870a6 | Withdrawal                                                                                                                             |
| Dedust        | 0x21cfe02b | Create vault                                                                                                                           |
| Dedust        | 0x97d51f2f | Create volatile Pool                                                                                                                   |
| Dedust        | 0x166cedee | Cancel deposit                                                                                                                         |
| StonFi        | 0x25938561 | Swap internal                                                                                                                          |
| StonFi        | 0xf93bb43f | Payment request                                                                                                                        |
| StonFi        | 0xfcf9e58f | Provide liquidity                                                                                                                      |
| StonFi        | 0xc64370e5 | Swap success                                                                                                                           |
| StonFi        | 0x45078540 | Swap success ref                                                                                                                       |

:::info
[DeDust docs](https://docs.dedust.io/docs/swaps)

[StonFi docs](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

<Feedback />

