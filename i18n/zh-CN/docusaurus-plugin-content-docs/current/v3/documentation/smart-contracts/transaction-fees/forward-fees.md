import Feedback from '@site/src/components/Feedback';

# 转发费用

This page explains how smart contracts handle message forwarding fees and value transfers between contracts.

## Overview

一般来说，如果智能合约想向另一个智能合约发送查询，它应该支付发送内部消息到目标智能合约的费用（消息转发费），在目的地处理这条消息的费用（Gas费），以及在需要时发送回复的费用（消息转发费）。

- Sending the internal message (message forwarding fees)
- Processing the message (gas fees)
- Sending back the answer, if required (message forwarding fees)

## Standard message handling

:::note
In most cases, the sender:

1. Attaches a small amount of Toncoin (typically one Toncoin) to the internal message
2. Sets the "bounce" flag (sends a bounceable internal message)

The receiver then returns the unused portion of the received value with the answer, deducting message forwarding fees. This is typically done using `SENDRAWMSG` with `mode = 64`.
:::

## Message bouncing

### Automatic bouncing

If the receiver cannot parse the received message and terminates with a non-zero exit code (for example, due to an unhandled cell deserialization exception), the message automatically bounces back to its sender. The bounced message:

- Has its "bounce" flag cleared
- Has its "bounced" flag set
- Contains 32 bits `0xffffffff` followed by 256 bits from the original message

### Handling bounced messages

Always check the "bounced" flag of incoming internal messages before parsing the `op` field. This prevents processing a bounced message as a new query.

If the "bounced" flag is set:

- You can identify the failed query by deserializing `op` and `query_id`
- Take appropriate action based on the failure
- Alternatively, terminate with zero exit code to ignore bounced messages

:::note
The "bounced" flag cannot be forged because it's rewritten during sending. If a message has the "bounced" flag set, it's definitely a result of a bounced message from the receiver.
:::

## Error handling

If the receiver successfully parses the incoming query but:

- The requested method `op` is not supported
- Another error condition is met

另一方面，接收者可能成功解析了传入的查询，并发现所请求的方法`op`不受支持，或者遇到了另一个错误条件。然后应该发送一个`op`等于`0xffffffff`或其他适当值的响应，如上所述，使用`SENDRAWMSG`并设置`mode = 64`。

## Value transfer with confirmation

Some operations require both value transfer and confirmation. For example, the validator elections smart contract receives:

- An election participation request
- The stake as the attached value

### Implementation

1. The sender attaches exactly one Toncoin to the intended value
2. If an error occurs (e.g., stake not accepted):
   - Return the full received amount (minus processing fees)
   - Include an error message using `SENDRAWMSG` with `mode = 64`
3. On success:
   - Create a confirmation message
   - Return exactly one Toncoin (minus message transferring fees)
   - Use `SENDRAWMSG` with `mode = 1`

<Feedback />

