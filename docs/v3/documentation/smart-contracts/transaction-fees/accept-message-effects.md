import Feedback from '@site/src/components/Feedback';

# Accept message effects

The `accept_message` and `set_gas_limit` TVM primitives play a crucial role in managing gas limits and transaction processing in TON smart contracts. While their basic functionality is documented in the [stdlib reference](/v3/documentation/smart-contracts/func/docs/stdlib#accept_message), their effects on transaction processing, gas limits, and contract balances can be complex and have important security implications. This page explores these effects in detail, particularly focusing on how they impact external and internal message processing.

## External messages

External messages follow this processing flow:
- The `gas_limit` is initially set to `gas_credit` ([Param20/Param21](v3/documentation/network/configs/blockchain-configs#param-20-and-21)), which equals 10k gas units
- During credit spending, a contract must call `accept_message` to `set_gas_limit`, indicating its readiness to pay processing fees
- If `gas_credit` is depleted or computation completes without `accept_message`, the message is discarded (as if it never existed)
- Otherwise, a new gas limit is set to either:
  - `contract_balance/gas_price` (with `accept_message`)
  - A custom value (with `set_gas_limit`)
- After transaction completion, full computation fees are deducted from the contract balance (making `gas_credit` truly a credit, not free gas)


If an error occurs after `accept_message` (in either Compute or Action phase):
- The transaction is recorded on the blockchain
- Fees are deducted from the contract balance
- Storage remains unchanged
- Actions are not applied

**Critical Security Consideration:**
If a contract accepts an external message and then throws an exception (due to invalid message data or serialization errors), it:
- Pays for processing
- Cannot prevent message replay
- Will continue accepting the same message until its balance is depleted

## Internal message 

When a contract receives an internal message from another contract:
- Default gas limit: `message_value`/`gas_price` (message covers its own processing)
- The contract can modify this limit using `accept_message`/`set_gas_limit`

Note that manual settings of gas limits do not interfere with bouncing behavior; messages will be bounced if sent in bounceable mode and contain enough money to pay for their processing and the creation of bounce messages.

:::info example
**Case 1:**
If you send a bounceable message with 0.1 TON in the basechain that is accepted by a contract with a 1 TON balance, and the computation costs 0.005 TON, with a message fee of 0.001 TON, then the bounce message will contain `0.1 - 0.005 - 0.001` = `0.094` TON.

**Case 2:**
If in the same example, the computation cost is 0.5 (instead of 0.005), there will be no bounce (the message balance would be `0.1 - 0.5 - 0.001 = -0.401`, thus no bounce), and the contract balance will be `1 + 0.1 - 0.5` = `0.6` TON.
:::

<Feedback />

