# TON Payments

TON Payments - the platform for (micro)payment channels and "lightning network" value transfers. 

It allows "instant" payments, without the need to commit all transactions into the blockchain, pay the associated transaction fees (e.g., for the gas consumed), and wait five seconds until the block
containing the transactions in question is confirmed.

The overall overhead of such instant payments is so small that one can use them for micropayments.

* [TON Payments Overview article](/learn/services/payments)

:::info 
The theory of TON Payments is well described in [TON whitepaper](https://ton.org/docs/ton.pdf), chapter 5.
:::

## Payment Channels

You can find ready-made smart contracts [here](https://github.com/ton-blockchain/payment-channels).

To use payments channels, you don’t need deep knowledge of cryptography. You can use prepared SDKs:

[TonWeb JavaScript SDK](https://github.com/toncenter/tonweb).

[Code example](https://github.com/toncenter/payment-channels-example) of how to use a payments channel.

You can find examples of using payment channels in the [Hack-a-TON #1](https://ton.org/hack-a-ton-1).

:::info
The theory of payment channels is well described in [TON whitepaper](https://ton.org/docs/ton.pdf), chapter 5.1.
:::

## Payment Channel Network

As the technology improves, payments channels will have the capacity to join together in a network off-chain where more than two parties will be able to participate.

Current smart contracts are already designed to support the functionality of uniting into a single off-chain network.

:::info
The theory of payment channel network is described in [TON whitepaper](https://ton.org/docs/ton.pdf), chapter 5.2.
:::