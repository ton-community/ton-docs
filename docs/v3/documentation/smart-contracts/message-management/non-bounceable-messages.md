import Feedback from '@site/src/components/Feedback';

# Non-bounceable messages

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children}
</span>
);

Most internal messages between contracts should be bounceable (with the "bounce" bit set). This ensures:

1. If the destination contract doesn't exist or fails to process the message:

   - The message bounces back
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
The query contained in the body of a bounced message <Highlight color="#186E8A">should never be executed</Highlight>.
:::

Non-bounceable messages are essential for account initialization. A new account cannot be created without receiving at least one non-bounceable internal message containing its `StateInit` (with contract code and initial data).

For all other cases:

- The message body should typically be empty
- Only use when bounce handling isn't needed
- Avoid them for regular contract interactions

## Best practice

It is a good idea not to allow the end user (e.g., of a wallet) to send unbounceable messages containing large amounts of value (e.g., more than five Toncoins) or to warn them if they do. To prevent loss of big funds, break process in two steps:

1.  Send a small amount first, initialize the new smart contract
2.  Next, send a more considerable amount.

<Feedback />

