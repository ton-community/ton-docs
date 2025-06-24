import Feedback from '@site/src/components/Feedback';

# 外部消息

外部消息是`从外部发送`到 TON 区块链中的智能合约，以使它们执行特定操作。

例如，钱包智能合约期望接收包含钱包所有者签名的订单的外部消息（例如，从钱包智能合约发送的内部消息）。当这样的外部消息被钱包智能合约接收时，它首先检查签名，然后接受消息（通过运行 TVM 原语 `ACCEPT`），然后执行所需的任何操作。 When such an external message is received by the wallet smart contract, it first checks the signature, then accepts the message (by running the TVM primitive `ACCEPT`), and then performs whatever actions are required.

## Replay protection

:::caution
Stay vigilant and check replay protection in contracts for external-in messages.
:::

Notice that all external messages must be protected against replay attacks. 请注意，所有外部消息`必须受到保护`，以防止重放攻击。验证者通常会从建议的外部消息池中移除一条外部消息（从网络接收）；然而，在某些情况下，`另一个验证者`可能会两次处理同一个外部消息（从而为同一个外部消息创建第二个交易，导致原始操作的重复）。更糟糕的是，`恶意行为者可以从`包含要处理的交易的区块中提取外部消息并稍后重新发送。这可能会迫使钱包智能合约重复付款，例如。 Even worse, a `malicious actor could extract` the external message from the block containing the processing transaction and re-send it later. This could force a wallet smart contract to repeat a payment.

The simplest way to protect smart contracts from replay attacks related to external messages is to store a 32-bit counter `cur-seqno` in the persistent data of the smart contract, and to expect a `req-seqno` value in (the signed part of) any inbound external messages. Then an external message is accepted only if both the signature is valid and `req-seqno` equals `cur-seqno`. After successful processing, the `cur-seqno` value in the persistent data is increased by one, so the same external message will never be accepted again.

And one could also include an `expire-at` field in the external message, and accept an external message only if the current Unix time is less than the value of this field. This approach can be used in conjunction with `seqno`; alternatively, the receiving smart contract could store the set of (the hashes of) all recent (not expired) accepted external messages in its persistent data, and reject a new external message if it is a duplicate of one of the stored messages. Some garbage collection of expired messages in this set should also be performed to avoid bloating the persistent data.

:::note
一般来说，外部消息以一个 256 位签名（如果需要）、一个 32 位 `req-seqno`（如果需要）、一个 32 位 `expire-at`（如果需要），以及可能的 32 位 `op` 和其他根据 `op` 所需的参数开始。外部消息的布局不需要像内部消息那样标准化，因为外部消息不用于不同（由不同开发者编写和不同所有者管理）智能合约之间的互动。 The layout of external messages does not need to be as standardized as that of internal messages because external messages are not used for interaction between different smart contracts (written by different developers and managed by different owners).\
:::

<Feedback />

