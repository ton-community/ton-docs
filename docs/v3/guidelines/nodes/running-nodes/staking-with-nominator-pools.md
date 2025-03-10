# Staking with Nominator Pools

## Overview

With TON smart contracts, you can implement any staking and deposit mechanics you want.

However, there is "native staking" in TON Blockchain - you can lend Toncoin to validators for staking and share the reward for validation.

The one who lends to validator is called the **nominator**.

A smart contract, called a [**nominator pool**](/v3/documentation/smart-contracts/contracts-specs/nominator-pool), provides the ability for one or more nominators to lend Toncoin in a validator stake, and ensures that the validator can use that Toncoin only for validation. Also, the smart contract guarantees the distribution of the reward.

## Validators vs Nominators

If you are familiar with cryptocurrencies, you must have heard about **validators** and **nominators**. These words often appear in crypto-related channels (our channel is no exception). Now, the time has come to find out what they are – the two major actors ruling the blockchain.

### Validators

First, let's start with validators. A validator is a network node that helps keep the blockchain running by verifying (or validating) suggested blocks and recording them on the blockchain.

To become a validator, you must meet two requirements: have a high-performance server and obtain a serious amount of TON (at least 300,000) in order to make a stake. At the time of writing, there are up to 400 validators per round on TON.

### Nominators

:::info
New version of Nominator Pool available, read more in the Single Nominator and Vesting Contract pages.
:::

It's evident that not everyone can afford to have 100,000s of Toncoin on their balance – here's where nominators come into play. Simply put, the nominator is a user who lends his TON to validators. Every time the validator earns a reward by validating blocks, it is distributed between the involved participants.

Some time ago, Ton Whales ran the first staking pool on TON with a minimum deposit of 50 TON. Later, TON Foundation launched the first open nominator pool. Now, users may stake Toncoin in a fully-decentralized way, starting with **10,000 TON**.

_From [TON Community post](https://t.me/toncoin/543)._

There should always be **10 TON** on the pool balance - this is the minimum balance for the network storage fee.

## Cost per month

Since validation round lasts ~18 hours, takes about **5 TON** per validation round and 1 Nominator Pool takes part in even and odd validation rounds it will take **~105 TON per month** to operate the Pool.

## How to participate?

- [The list of the TON nominator pools](https://tonvalidators.org/)

## Source code

- [Nominator Pool smart contract source code](https://github.com/ton-blockchain/nominator-pool)

:::info
The theory of nominators is described in [TON Whitepaper](https://docs.ton.org/ton.pdf), chapters 2.6.3, 2.6.25.
:::
