# Internal messages

## Overview 

Smart contracts interact with each other by sending so-called **internal messages**. When an internal message reaches its intended destination, an ordinary transaction is created on behalf of the destination account, and the internal message is processed as specified by the code and the persistent data of this account (smart contract). 

:::info
In particular, the processing transaction can create one or several outbound internal messages, some of which may be addressed to the source address of the internal message being processed. This can be used to create simple "client-server applications" when a query is encapsulated in an internal message and sent to another smart contract, which processes the query and sends back a response again as an internal message.
:::

This approach leads to the necessity of distinguishing whether an internal message is intended as a "query", "response", or doesn't require any additional processing (like a "simple money transfer"). Furthermore, when a response is received, there must be a way to determine which query it corresponds to.

To achieve this goal, the following approaches for the internal message layout can be used (note that TON Blockchain does not enforce any restrictions on the message body, so these are indeed just recommendations).

### Internal Message Structure

The body of the message can be embedded into the message itself or stored in a separate cell referenced by the message, as indicated by the TL-B scheme fragment:

```tlb
message$_ {X:Type} ... body:(Either X ^X) = Message X;
```

The receiving smart contract should accept at least internal messages with embedded message bodies (whenever they fit into the cell containing the message). If it accepts message bodies in separate cells (using the `right` constructor of `(Either X ^X)`), the processing of the inbound message should not depend on the specific embedding option chosen for the message body. On the other hand, it is perfectly valid not to support message bodies in separate cells for simpler queries and responses.

### Internal Message Body 
The message body typically begins with the following fields:

    * A 32-bit (big-endian) unsigned integer `op`, identifying the `operation` to be performed, or the `method` of the smart contract to be invoked.
    * A 64-bit (big-endian) unsigned integer `query_id`, used in all query-response internal messages to indicate that a response is related to a query (the `query_id` of a response must be equal to the `query_id` of the corresponding query). If `op` is not a query-response method (e.g., it invokes a method that is not expected to send an answer), then `query_id` may be omitted.
    * The remainder of the message body is specific for each supported value of `op`.

### Simple Message with Comment

If `op` is zero, then the message is a "simple transfer message with comment". The comment is contained in the remainder of the message body (without any `query_id` field, i.e., starting from the fifth byte). If it does not begin with the byte `0xff`, the comment is a text one; it can be displayed "as is" to the end user of a wallet (after filtering out invalid and control characters and checking that it is a valid UTF-8 string). 

   When comment is long enough that it doesn't fit in a cell, non-fitting end of the line is put to the first reference of the cell. This process continues recursively to describe comments that don't fit in two or more cells:   
```
root_cell("0x00000000" - 32 bit, "string" up to 123 bytes)
         ↳1st_ref("string continuation" up to 127 bytes)
                 ↳1st_ref("string continuation" up to 127 bytes)
                         ↳....
```
   The same format is used for comments for NFT and [jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format) transfers.
   
   For instance, users may indicate the purpose of a simple transfer from their wallet to the wallet of another user in this text field. On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store's software.

   Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a "simple transfer message". In this way, once `op` is found to be zero, the smart contract function for processing inbound internal messages (usually called `recv_internal()`) should immediately terminate with a zero exit code indicating success (e.g., by throwing exception `0`, if no custom exception handler has been installed by the smart contract). This will lead to the receiving account being credited with the value transferred by the message without any further effect.

### Messages with Encrypted Comments

If `op` is `0x2167da4b`, then the message is a "transfer message with encrypted comment". This message is serialized as follows:

   Input:
   
   * `pub_1` and `priv_1` - Ed25519 public and private keys of the sender, 32 bytes each.
   * `pub_2` - Ed25519 public key of the receiver, 32 bytes.
   * `msg` - a message to be encrypted, arbitrary byte string. `len(msg) <= 960`.
   
   Encryption algo is as follows:
   
   1. Calculate `shared_secret` using `priv_1` and `pub_2`.
   2. Let `salt` be the [bas64url representation](/v3/documentation/smart-contracts/addresses#user-friendly-address) of the sender wallet address with `isBounceable=1` and `isTestnetOnly=0`.
   3. Select byte string `prefix` of length between 16 and 31 such that `len(prefix+msg)` is divisible by 16. The first byte of `prefix` is equal to `len(prefix)`, other bytes are random. Let `data = prefix + msg`.
   4. Let `msg_key` be the first 16 bytes of `hmac_sha512(salt, data)`.
   5. Calculate `x = hmac_sha512(shared_secret, msg_key)`. Let `key=x[0:32]` and `iv=x[32:48]`.
   6. Encrypt `data` using AES-256 in CBC mode with `key` and `iv`.
   7. Construct the encrypted comment:
       1. `pub_xor = pub_1 ^ pub_2` - 32 bytes. This allows each party to decrypt the message without looking up other's public key.
       2. `msg_key` - 16 bytes.
       3. Encrypted `data`.
   8. The body of the message starts with the 4-byte tag `0x2167da4b`. Then this encrypted comment is stored:
       1. Byte string is divided into segments and is stored in a chain of cells `c_1,...,c_k` (`c_1` is the root of the body). Each cell (except for the last one) has a reference to the next.
       2. `c_1` contains up to 35 bytes (not including 4-byte tag), all other cells contain up to 127 bytes.
       3. This format has the following limitations: `k <= 16`, max string length is 1024.

   The same format is used for comments for NFT and jetton transfers, note that public key of sender address and receiver address (not jetton-wallet addresses) should be used.
   
:::info
Learn from examples of the message encryption algorithm:
* [encryption.js](https://github.com/toncenter/ton-wallet/blob/master/src/js/util/encryption.js)
* [SimpleEncryption.cpp](https://github.com/ton-blockchain/ton/blob/master/tonlib/tonlib/keys/SimpleEncryption.cpp)
:::

### Simple Transfer Messages Without Comments
A "simple transfer message without comment" has an empty body (without even an `op` field). The above considerations apply to such messages as well. Note that such messages should have their bodies embedded into the message cell.

### Distinction Between Query and Response Messages
We expect "query" messages to have an `op` with the high-order bit clear, i.e., in the range `1 .. 2^31-1`, and "response" messages to have an `op` with the high-order bit set, i.e., in the range `2^31 .. 2^32-1`. If a method is neither a query nor a response (so that the corresponding message body does not contain a `query_id` field), it should use an `op` in the "query" range `1 .. 2^31 - 1`.

### Handling of Standard Response Messages
There are some "standard" response messages with the `op` equal to `0xffffffff` and `0xfffffffe`. In general, the values of `op` from `0xfffffff0` to `0xffffffff` are reserved for such standard responses.

    * `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query, and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
    * `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.

   Notice that unknown "responses" (with an `op` in the range `2^31 .. 2^32-1`) should be ignored (in particular, no response with an `op` equal to `0xffffffff` should be generated in response to them), just as unexpected bounced messages (with the "bounced" flag set).
