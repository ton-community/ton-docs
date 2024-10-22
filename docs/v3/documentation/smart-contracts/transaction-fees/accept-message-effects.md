# Accept Message Effects

`accept_message` and `set_gas_limit` may cause not that straightforward effects when doing exactly what is said in the [stdlib reference](/v3/documentation/smart-contracts/func/docs/stdlib#accept_message).

## External messages

External messages are processed as follows: 
- The `gas_limit` is set to `gas_credit` (ConfigParam 20 and ConfigParam 21), which is equal to 10k gas.
- During the spending of those credits, a contract should call `accept_message` to `set_gas_limit`, indicating that it is ready to pay fees for message processing.
- If `gas_credit` is reached or computation is finished, and `accept_message` is not called, the message will be completely discarded (as if it never existed at all).
- Otherwise, a new gas limit, equal to `contract_balance/gas_price` (in the case of `accept_message`) or a custom number (in the case of `set_gas_limit`), will be set; after the transaction ends, full computation fees will be deducted from the contract balance (in this way, `gas_credit` is indeed **credit**, not free gas).


Note that if, after `accept_message`, some error is thrown (either in ComputePhase or ActionPhase), the transaction will be written to the blockchain, and fees will be deducted from the contract balance. However, storage will not be updated, and actions will not be applied, as is the case in any transaction with an error exit code. 

As a result, if the contract accepts an external message and then throws an exception due to an error in the message data or the sending of an incorrectly serialized message, it will pay for processing but will have no way of preventing message replay. **The same message will be accepted by the contract over and over until it consumes the entire balance.**



## Internal message

By default, when a contract receives an internal message, the gas limit is set to `message_balance`/`gas_price`. In other words, the message pays for its processing. By using `accept_message`/`set_gas_limit`, the contract may change the gas limit during execution. 

Note that manual settings of gas limits do not interfere with bouncing behavior; messages will be bounced if sent in bounceable mode and contain enough money to pay for their processing and the creation of bounce messages.

:::info example
For instance, if you send a bounceable message with 0.1 TON in the basechain that is accepted by a contract with a 1 TON balance, and the computation costs 0.005 TON, with a message fee of 0.001 TON, then the bounce message will contain `0.1 - 0.005 - 0.001` = `0.094` TON.

If in the same example, the computation cost is 0.5 (instead of 0.005), there will be no bounce (the message balance would be `0.1 - 0.5 - 0.001 = -0.401`, thus no bounce), and the contract balance will be `1 + 0.1 - 0.5` = `0.6` TON.
:::
