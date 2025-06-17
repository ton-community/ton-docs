import Feedback from '@site/src/components/Feedback';

# 非弹回消息

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

Most internal messages between contracts should be bounceable (with the "bounce" bit set). This ensures:

1. If the destination contract doesn't exist or fails to process the message:

   - 在某些情况下，必须使用`不可弹回内部消息`。例如，没有发送至少一条不可弹回内部消息给它们，就无法创建新账户。除非这条消息包含一个带有新智能合约的代码和数据的`StateInit`，否则在不可弹回内部消息中拥有非空主体是没有意义的。
   - Returns remaining value (minus fees)
   - Contains:
      - `0xffffffff` (32-bit)
      - Original message body (256-bit)
      - "bounce" flag cleared
      - "bounced" flag set

2. Contracts must:
   - Check the "bounced" flag on all incoming messages
   - Either:
      - Accept silently (terminate with exit code 0)
      - Identify and handle the failed request
   - Never execute the bounced message's original query

:::info
弹回消息主体中包含的查询<Highlight color="#186E8A">永远不应执行</Highlight>。
:::

Non-bounceable messages are essential for account initialization. A new account cannot be created without receiving at least one non-bounceable internal message containing its `StateInit` (with contract code and initial data).

For all other cases:

- The message body should typically be empty
- Only use when bounce handling isn't needed
- Avoid them for regular contract interactions

## Best practice

不允许最终用户（例如，钱包的用户）发送包含大量价值（例如，超过五个Toncoin）的不可弹回消息是一个好主意，或者如果他们这样做了就警告他们。更好的做法是先发送少量金额，接着初始化新的智能合约，然后再发送更大的金额。 To prevent loss of big funds, break process in two steps:

1. Send a small amount first, initialize the new smart contract
2. Next, send a more considerable amount.

<Feedback />

