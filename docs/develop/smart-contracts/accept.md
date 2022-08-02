# accept_message effects

`accept_message` as well as `set_gas_limit` while doing exactly what it said in [stdlib reference](func/stdlib?id=accept_message) may cause not that straightforward effects.

## External messages
External messages are processed as following: `gas_limit` is set to `gas_credit` (ConfigParam 20 and ConfigParam 21) equal to 10k gas. During spending those credit, contract should call `accept_message` to `set_gas_limit` indicate that it is ready to pay fees for message processing. If `gas_credit` is reached or computation are finished, while `accept_message` is not called, this message will be completely discarded (like it never exists at all). Otherwise, new gas limit is equal either `contract_balance/gas_price` (in case of `accept_message`) or to custom number (in case of `set_gas_limit`) will be set; after transaction end, full computation fees will be deducted from the contract balance (that way `gas_credit` is **credit** indeed, not a free gas).

Note, that if after `accept_message` some error will be thrown (both in ComputePhase or ActionPhase) transaction will be written to blockchain and fees will be deducted from contract balance, but storage will not be updated and actions will not be applied as in any transaction with error exit code. That way, if contract accepted external message and then throw an exception due to some error in message data or due to sending wrongly serialized message, it will pay for processing but has not opporunity to prevent message replay. The same message will be accepted by contract over and over until it consumes the whole balance.

## Internal message

By default when contract gets internal message gas limit is set to `message_balance/gas_price`, in other words, message pays for it's processing. By using `accept_message`/`set_gas_limit` contract may change gas limit during execution. Note, that manual setting of gas limit does not interfere with bouncing behavior: message will be bounced if sent in bouncable mode and contain enough money to pay for it's processing and creation of bounce message.

For instance if you send bouncable message with 0.1 TON in basechain, which was accepted by contract with 1 TON balance, computation costs 0.005 TON and message fee is 0.001 TON, then bounce message will contain `0.1 - 0.005 - 0.001 ` = `0.094` TON.

If, in the same example, computation cost will be 0.5 (instead of 0.005), there will be no bounce (message balance should be `0.1 - 0.5 - 0.001 = -0.401`, thus no bounce) and contract balance will be `1 + 0.1 - 0.5` = `0.6` TON
