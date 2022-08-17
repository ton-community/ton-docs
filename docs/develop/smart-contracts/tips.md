# Tips & Tricks

###  [About bounce TONs back](https://t.me/tondev/44958)

If you have the `throw_if` function (with code != 0) in recv_internal triggered and the bounce flag set([tblkch.pdf 4.2.5](https://newton-blockchain.github.io/tblkch.pdf)), all coins will be sent back

### [About charging gas fees](https://t.me/tondev/45882)

This information is based on this [discussion](https://github.com/DKeysil/awesome-ton-smart-contracts/issues/1)

`accept_message` simply sets the gas limit to the maximal possible value (the gas that can be bought by both original contract balance and message value, or, more commonly, the maximal gas amount allowed to use in single transaction) and also sets gas credit to zero.

In the case of external messages you need to accept the message in order to make transaction appear in the block (or, more precisely speaking, you need to somehow set gas credit to zero). You can accept message at any time during the TVM execution, even after calling `send_raw_message` primitive. The only way the fees may be charged from the account is to put a transaction into the blockchain, so it's the reason why "transactions" with no `accept_message` are "free".

In the case of internal messages the initial gas limit is set equal to the amount of gas that can be bought by message value. `accept_message` raises that limit. Even without `accept_message` you can spend more coins than the message value by sending some other messages which carry value.

Using `set_gas_limit` in internal messages does not limit the possibility of spending more TON than came with the message when sending other messages that carry value. You can use `raw_reserve` in addition to gas limit to limit spendable amount of coins.

FunC docs:
- [`accept_message`](https://ton.org/#/func/stdlib?id=accept_message)
- [`set_gas_limit`](https://ton.org/#/func/stdlib?id=set_gas_limit)
- [`raw_reserve`](https://ton.org/#/func/stdlib?id=raw_reserve)

### [Spend less gas in huge smart contracts](https://t.me/tondev/45956)

`touch()` is tip to the compiler how best to organize the stack. The command puts a variable at top of the stack ([func docs](https://ton.org/#/func/stdlib?id=impure_touch))

example:
In this [code](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L90) `cs~touch();` will place `cs` on top of the stack and then the interaction with the variable will be cheaper