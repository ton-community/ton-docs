import Feedback from '@site/src/components/Feedback';

# Extra currency minting

## Extracurrency

According to [TON Blockchain Whitepaper 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55), the TON Blockchain allows users to create arbitrary cryptocurrencies or tokens, in addition to the Toncoin, provided certain conditions are met. These additional cryptocurrencies are identified by 32-bit **currency\_ids**. The list of these defined cryptocurrencies is a part of the blockchain configuration stored in the MasterChain. Each internal message and account balance includes a special field for `ExtraCurrencyCollection`, which is a set of extracurrencies attached to a message or maintained in a balance:

```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## Extracurrency config

A dictionary, specifically `ExtraCurrencyCollection`, containing all currencies to be minted is stored in `ConfigParam7`:

```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6` contains data related to the minting:

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2` contains the address of  **minter**.

## Low-level minting flow

In each block, the collator compares the old global balance (the global balance of all currencies at the end of the previous block) with `ConfigParam7`. If any amount for any currency in `ConfigParam7` is less than it is in the global balance, the config is invalid. If any amount of any currency in `ConfigParam7` is higher than it is in the global balance, a minting message will be created.

This minting message has source `-1:0000000000000000000000000000000000000000000000000000000000000000` and **minter** from `ConfigParam2` as destination and contains excesses of extracurrencies in `ConfigParam7` over the old global balance.

The problem here is that the minting message includes only additional currencies and no Toncoins.  As a result, even if the **Minter** is designated as a fundamental smart contract (as indicated in `ConfigParam31`), a minting message will lead to an aborted transaction with the error: `compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`.

## High-level minting flow

One possible high-level minting flow, which is implemented [here](https://github.com/ton-blockchain/governance-contract/tree/50ed2ecacc9e3cff4c77cbcc69aa07b39f5c46a2) (check `*.tolk` files) is as follows:
  
1. There is `ExtraCurrencyAuthorizationConfig`: the config contains information on which contracts (addresses) have authorization to request minter to mint new extracurrencies. This config has the following scheme:

```tlb
_ (Hashmap 32 std_addr) = ExtraCurrencyAuthorizationConfig;
```

where key - `currency_id` and `std_addr` is _admin_ of this currency (can be in any WorkChain).

2. Minter accepts mint requests from **admins**, forwards requests for mint to **config**, **config** updates `ConfigParam 7`, and responds to **minter**. Since extracurrencies would be minted to **minter** only on the next MasterChain block, withdrawing extra currencies to **admin** should be delayed. It is done via **echo** smart-contract, not in MasterChain. When a response from **echo** comes to **minter**, it sends extracurrencies to **admin**. So the scheme is as follows: 

	`Admin -> Minter -> Config -> Minter -> Echo (in other workchain to wait 	until the next masterchain block) -> Minter -> Admin`

An example of this flow is as follows: [minting 2'000'000'000 units of `currency_id=100`](https://testnet.tonviewer.com/transaction/20fe328c04b4896acecb6e96aaebfe6fef90dcc1441e27049302f29770904ef0)

:::danger
Each minting of new extracurrency or an increase in the supply of existing currency necessitates a change to `ConfigParam7`, which in turn alters the configuration and creation of keyblocks. Frequent keyblock generation can slow down shard performance since each key block causes a rotation of validator groups and affects the synchronization of liteclients. Therefore, contracts like `swap.tolk` should not be utilized in production environments. Instead, it is advisable to use schemes that involve reserves to minimize minting events.
:::

:::info
Sending of extracurrency to blackhole has the following effect: extracurrency amount is burnt, but since `ConfigParam7` is not changed, on the next block, **minter** will receive the burnt amount on its balance.
:::


## How to mint your own extracurrency

1. Ensure that your network has the **minter contract** and that `ConfigParam2` and `ConfigParam6` are set correctly.

2. Create a **currency admin contract** that will control how the extra currency is minted.

3. Submit a proposal to the validators to add your **currency admin** contract address to the `ExtraCurrencyAuthorizationConfig` for a specific `currency_id` and obtain their approval.

4. Send a `mint` request from the **currency admin contract** to the **minter**. Wait for the **minter** to return the extra currency.
<Feedback />

