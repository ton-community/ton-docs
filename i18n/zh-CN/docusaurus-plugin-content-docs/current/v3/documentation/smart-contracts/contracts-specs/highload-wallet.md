import Feedback from '@site/src/components/Feedback';

# 高负载钱包

When working with many messages in a short period, there is a need for special wallet called Highload wallet. 在短时间内处理大量信息时，需要使用名为 "Highload Wallet "的特殊钱包。在很长一段时间里，Highload Wallet V2 是 TON 的主要钱包，但使用时必须非常小心。否则，您可能会[锁定所有资金](https://t.me/tonstatus/88)。 Otherwise, you could [lock all funds](https://t.me/tonstatus/88).

[随着 Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3)的问世，这一问题已在合约架构层面得到解决，而且耗 gas 量更少。本章将介绍 Highload Wallet V3 的基础知识和需要记住的重要细微差别。 This chapter will cover the basics of Highload Wallet V3 and important nuances to remember.

## 高负载钱包 v3

该钱包专为需要以极高的速度发送交易的用户设计。例如，加密货币交易所。 For example, crypto exchanges.

- [源代码](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

向 Highload v3 发送的任何给定外部报文（传输请求）都包含：

- 顶层 cell 中的签名（512 位）--其他参数位于该 cell 的 ref 中
- 子钱包 ID（32 位）
- 作为 ref 发送的消息（将被发送的序列化内部消息）
- 报文的发送模式（8 位）
- 复合查询 ID - 13 位 "位移 "和 10 位 "位数"，但 10 位位数只能到 1022，而不是 1023，而且最后一个可用的查询 ID（8388605）是为紧急情况保留的，通常不应使用
- 创建于, 或消息时间戳
- 超时

Timeout is stored in Highload as a parameter and is checked against the timeout in all requests - so the timeout for all requests is equal. The message should be not older than timeout at the time of arrival to the Highload wallet, or in code it is required that `created_at > now() - timeout`. Query IDs are stored for the purposes of replay protection for at least timeout and possibly up to 2 \* timeout, however one should not expect them to be stored for longer than timeout. Subwallet ID is checked against the one stored in the wallet. Inner ref's hash is checked along with the signature against the public key of the wallet.

Highload v3 只能从任何给定的外部信息中发送 1 条信息，但它可以通过一个特殊的操作码将信息发送给自己，这样就可以在调用内部信息时设置任何操作 cell ，从而有效地使 1 条外部信息可以发送多达 254 条信息（如果在这 254 条信息中还有另一条信息发送到 Highload 钱包，那么发送的信息数量可能会更多）。

一旦所有检查都通过，Highload v3 将始终存储查询 ID（重放保护），但由于某些情况，包括但不限于以下情况，可能无法发送信息：

- **包含状态初始**（如有需要，可使用特殊操作码发送此类信息，以便在高负载钱包向自身发送内部信息后设置操作 cell ）
- 余额不足
- 无效的报文结构（包括外部输出报文--只有内部报文可以直接从外部报文发送）

Highload v3 绝不会执行包含相同 `query_id` **和** `created_at` 的多个外部请求--当它忘记任何给定的 `query_id` 时，`created_at` 条件将阻止此类信息的执行。这实际上使 `query_id` **和** `created_at` 成为 Highload v3 传输请求的 "主键"。 This effectively makes `query_id` **and** `created_at` together the "primary key" of a transfer request for Highload v3.

When iterating (incrementing) query ID, it is cheaper (in terms of TON spent on fees) to iterate through bit number first, and then the shift, like when incrementing a regular number. After you've reached the last query ID (remember about the emergency query ID - see above), you can reset query ID to 0, but if Highload's timeout period has not passed yet, then the replay protection dictionary will be full and you will have to wait for the timeout period to pass.

## 高负载钱包 V2

:::danger
建议使用 Highload wallet v3。
:::

该钱包专为需要在短时间内发送数百笔交易的用户设计。例如，加密货币交易所。 For example, crypto exchanges.

It allows you to send up to `254` transactions in one smart contract call. 它允许你在一次智能合约调用中发送多达 254 个交易。它还使用了一种略有不同的方法来解决重放攻击，而不是 seqno，所以你可以同时多次调用这个钱包，甚至在一秒钟内发送数千个交易。

:::caution 局限性
注意，在处理高负载钱包时，需要检查并考虑以下限制。
:::

1. **Storage size limit.** Currently, size of contract storage should be less than 65535 cells. If size of
  old_queries will grow above this limit, exception in ActionPhase will be thrown and transaction will fail.
  Failed transaction may be replayed.
2. **gas 限制。** 目前， gas 限制为 1'000'000 GAS 单位，这意味着一个 tx 中可清理的
  旧查询次数是有限制的。如果过期查询次数较多，合约就会卡住。 If number of expired queries will be higher, contract will stuck.

这意味着不建议设置过高的过期日期：
，过期时间跨度内的查询次数不应超过 1000 次。

此外，一次交易中清理的过期查询次数应低于 100 次。

## 如何

您还可以阅读 [Highload Wallet Tutorials](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) 一文。

钱包源代码：

- [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

<Feedback />

