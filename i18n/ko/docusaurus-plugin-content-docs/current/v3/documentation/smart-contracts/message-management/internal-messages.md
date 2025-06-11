import Feedback from '@site/src/components/Feedback';

# 내부 메시지

## 개요

스마트 컨트랙트는 **내부 메시지**라고 하는 것을 보내서 서로 상호작용합니다. 내부 메시지가 의도한 목적지에 도달하면, 해당 목적지 계정을 대신하여 일반적인 트랜잭션이 생성되고, 내부 메시지는 이 계정(스마트 컨트랙트)의 코드와 영구 데이터에 지정된 대로 처리됩니다.

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

메시지 본문은 일반적으로 다음 필드로 시작합니다:

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

동일한 형식이 NFT와 [jetton](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#forward_payload-format) 전송의 코멘트에도 사용됩니다.

For instance, users may indicate the purpose of a simple transfer from their wallet to another user’s wallet in this text field. On the other hand, if the comment begins with the byte `0xff`, the remainder is a "binary comment", which should not be displayed to the end user as text (only as a hex dump if necessary). The intended use of "binary comments" is, e.g., to contain a purchase identifier for payments in a store, to be automatically generated and processed by the store’s software.

Most smart contracts should not perform non-trivial actions or reject the inbound message on receiving a simple transfer message. In this way, once `op` is found to be zero, the smart contract function for processing inbound internal messages (usually called `recv_internal()`) should immediately terminate with a zero exit code indicating success (e.g., by throwing exception `0`, if the smart contract has installed no custom exception handler). This will lead to the receiving account being credited with the value transferred by the message without any further effect.

### Messages with encrypted comments

If `op` is `0x2167da4b`, then the message is a transfer message with the encrypted comment. This message is serialized as follows:

입력:

- `pub_1`과 `priv_1` - 발신자의 Ed25519 공개 키와 개인 키, 각각 32바이트
- `pub_2` - 수신자의 Ed25519 공개 키, 32바이트
- `msg` - 암호화할 메시지, 임의의 바이트 문자열. `len(msg) <= 960`

#### Encryption algorithm

1. `priv_1`과 `pub_2`를 사용하여 `shared_secret`를 계산합니다.
2. `salt`를 `isBounceable=1`과 `isTestnetOnly=0`를 가진 발신자 지갑 주소의 [bas64url 표현](/v3/documentation/smart-contracts/addresses#user-friendly-address)으로 합니다.
3. Select byte string `prefix` of length between 16 and 31 such that `len(prefix+msg)` is divisible by 16. The first byte of `prefix` equals `len(prefix)`, and the other bytes are random. Let `data = prefix + msg`.
4. `msg_key`를 `hmac_sha512(salt, data)`의 첫 16바이트로 합니다.
5. `x = hmac_sha512(shared_secret, msg_key)`를 계산합니다. `key=x[0:32]`와 `iv=x[32:48]`로 합니다.
6. `key`와 `iv`를 사용하여 CBC 모드의 AES-256으로 `data`를 암호화합니다.
7. 암호화된 코멘트를 다음과 같이 구성합니다:
  1. `pub_xor = pub_1 ^ pub_2` - 32 bytes. This allows each party to decrypt the message without looking up the other’s public key.
  2. `msg_key` - 16바이트.
  3. 암호화된 `data`.
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

"쿼리" 메시지는 최상위 비트가 0인 `op`를 가져야 합니다(즉, `1 .. 2^31-1` 범위에서), "응답" 메시지는 최상위 비트가 1인 `op`를 가져야 합니다(즉, `2^31 .. 2^32-1` 범위에서). 메서드가 쿼리도 응답도 아닌 경우(따라서 해당 메시지 본문에 `query_id` 필드가 포함되지 않음), "쿼리" 범위 `1 .. 2^31 - 1`의 `op`를 사용해야 합니다.

### Handling of standard response messages

`op`가 `0xffffffff`와 `0xfffffffe`인 몇 가지 "표준" 응답 메시지가 있습니다. 일반적으로 `0xfffffff0`부터 `0xffffffff`까지의 `op` 값은 이러한 표준 응답을 위해 예약되어 있습니다.

- `op` = `0xffffffff` means "operation not supported". It is followed by the 64-bit `query_id` extracted from the original query and the 32-bit `op` of the original query. All but the simplest smart contracts should return this error when they receive a query with an unknown `op` in the range `1 .. 2^31-1`.
- `op` = `0xfffffffe` means "operation not allowed". It is followed by the 64-bit `query_id` of the original query, followed by the 32-bit `op` extracted from the original query.

알 수 없는 "응답"(범위 `2^31 .. 2^32-1`의 `op`)은 무시되어야 합니다(특히, 이들에 대한 응답으로 `op`가 `0xffffffff`인 응답이 생성되어서는 안 됨). 이는 예상치 못한 반송된 메시지("반송됨" 플래그가 설정된)와 마찬가지입니다.

## Known op codes

:::info
Also op-code, op::code and operational code
:::

| Contract type | Hex code   | OP::code                                                                                               |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
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

