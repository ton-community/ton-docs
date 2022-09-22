# Tips & Tricks

##  About bounce TONs back

If you have the `throw_if` function (with code != 0) in recv_internal triggered and the bounce flag set([tblkch.pdf 4.2.5](https://newton-blockchain.github.io/tblkch.pdf)), all coins will be sent back.

Read more in the [original discussion](https://t.me/tondev/44958).

## Payload size in bounced messages

A bounced message has only 224 bits in the body, everything else (even references) is lost.

:::info Example
1. You send `msg_body: uint112 + ^[uint112]` to smart-contract to bounce
2. SC returns bounced message with a `msg_body: 0xFFFFFFFF + uint112` **without** `^ref` payload, even though there is enough space for it.
:::

More info about this discussion is [here](https://t.me/tondev_eng/11201).

## About charging gas fees

This information is based on this [discussion](https://github.com/DKeysil/awesome-ton-smart-contracts/issues/1)

`accept_message` simply sets the gas limit to the maximal possible value (the gas that can be bought by both original contract balance and message value, or, more commonly, the maximal gas amount allowed to use in single transaction) and also sets gas credit to zero.

In the case of external messages you need to accept the message in order to make transaction appear in the block (or, more precisely speaking, you need to somehow set gas credit to zero). You can accept message at any time during the TVM execution, even after calling `send_raw_message` primitive. The only way the fees may be charged from the account is to put a transaction into the blockchain, so it's the reason why "transactions" with no `accept_message` are "free".

In the case of internal messages the initial gas limit is set equal to the amount of gas that can be bought by message value. `accept_message` raises that limit. Even without `accept_message` you can spend more coins than the message value by sending some other messages which carry value.

Using `set_gas_limit` in internal messages does not limit the possibility of spending more TON than came with the message when sending other messages that carry value. You can use `raw_reserve` in addition to gas limit to limit spendable amount of coins.

FunC docs:
- [`accept_message`](/develop/func/stdlib#accept_message)
- [`set_gas_limit`](/develop/func/stdlib#set_gas_limit)
- [`raw_reserve`](/develop/func/stdlib#raw_reserve)


Read more in the [original discussion](https://t.me/tondev/45882).


## Spend less gas in huge smart contracts

`touch()` is tip to the compiler how best to organize the stack. The command puts a variable at top of the stack ([func docs](/develop/func/stdlib#impure_touch))

### Example

In this code:

```js reference
https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc#L71-L92
```

`cs~touch();` will place `cs` on top of the stack and then the interaction with the variable will be cheaper.

Read more in the [original discussion](https://t.me/tondev/45956).