# Extra Currency Minting

## Extracurrency
According to [Ton Blockchain Whitepaper 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55), TON Blockchain allows its users to define arbitrary cryptocurrencies or tokens apart from the Toncoin, provided some conditions are met. Such additional cryptocurrencies are identified by 32-bit _currency\_ids_. The list of defined additional cryptocurrencies is a part of the blockchain configuration,
stored in the masterchain. Each internal message as well as account balance contains a special field for `ExtraCurrencyCollection` (set of extracurrencies attached to a message or kept on balance):
```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## Extracurrency config
A dictionary, or to be precise `ExtraCurrencyCollection`, of all currencies that should be minted is stored in `ConfigParam7`:
```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6` contains data related to minting:

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2` contains address of _Minter_.



## Low-level minting flow
In each block, the collator compares the old global balance (global balance of all currencies at the end of prev block) with `ConfigParam7`. If any amount for any currency in `ConfigParam7` is less than it is in the global balance - the config is invalid. If any amount of any currency in `ConfigParam7` is higher than it is in the global balance a minting message will be created. 

This minting message has source `-1:0000000000000000000000000000000000000000000000000000000000000000` and _Minter_ from `ConfigParam2` as destination and contains excesses of extracurrencies in `ConfigParam7` over old global balance.

The issue here is that the minting message contains extra currencies only and no TON coins. That means that even if _Minter_ is set as a fundamental smart contract (presented in `ConfigParam31`), a minting message will cause the aborted transaction: `compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`.

## High-level minting flow
One of possible high-level minting flows implemented [here](https://github.com/ton-blockchain/governance-contract/tree/50ed2ecacc9e3cff4c77cbcc69aa07b39f5c46a2) (check `*.tolk` files) is as following:

1. There is `ExtraCurrencyAuthorizationConfig`: it is config that contains information which contracts (addresses) has authorization to request minter to mint new extracurrencies. This config has the following scheme:
```tlb
_ (Hashmap 32 std_addr) = ExtraCurrencyAuthorizationConfig;
```
where key - `currency_id` and `std_addr` is _admin_ of this currency (can be in any workchain).
2. Minter accepts mint requests from _admins_, forwards request for mint to Config, Config updates `ConfigParam 7` and responses to Minter. Since extracurrencies would be minted to Minter only on next masterchain block, withdrawing extracurrencies to _admin_ should be delayed. It is done via _Echo_ smart-contract not in masterchain. When response from _Echo_ came to Minter it sends extracurrencies to _admin_. So the scheme is as follows `Admin -> Minter -> Config -> Minter -> Echo (in other workchain to wait until the next masterchain block) -> Minter -> Admin`.

Example of such flow: [minting 2'000'000'000 units of `currency_id=100`](https://testnet.tonviewer.com/transaction/20fe328c04b4896acecb6e96aaebfe6fef90dcc1441e27049302f29770904ef0)

:::danger
Each mint of new extracurrency or increasing supply of existing one requires change of ConfigParam 7, thus changing config and creation keyblock. Too frequent keyblocks slows down shards (each keyblock leads to rotation of validator groups) and lite-client sync. Thus contracts like swap.tolk should not be used in production. Instead schemes with reserves, that minimize minting events, need to be used.
:::


:::Info
Sending of extracurrency to blackhole has the following effect: extracurrency amount is burnt, but since ConfigParam 7 is not changed, on next block Minter will receive burnt amount on it's balance.
:::

## Bird-eye minting flow
How to mint your own extracurrency:
1. Ensure your network has Minter Contract and ConfigParam 2, ConfigParam 6 set.
2. Create Currency Admin contract that controls how extracurrency is minted.
3. Create proposal to validators to add your Currency Admin contract address to ExtraCurrencyAuthorizationConfig for some `currency_id`, and get it accepted.
4. Send `mint` request from Currency Admin contract to Minter. Wait till Minter send back extracurrency.




