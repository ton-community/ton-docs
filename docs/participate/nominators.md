# Nominator Pools

## Overview 

With TON smart contracts, you can implement any staking and deposit mechanics you want.

However, there is "native staking" in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

The one who lends to validator is called the **nominator**.

A smart contract, called a **nominator pool**, provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. Also, the smart contract guarantees the distribution of the reward.

## How to participate?

* [The list of the TON nominator pools](https://tonvalidators.org/)

## Source code

* [Nominator Pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
The theory of nominators is described in [TON Whitepaper](https://ton.org/docs/ton.pdf), chapters 2.6.3, 2.6.25.
:::