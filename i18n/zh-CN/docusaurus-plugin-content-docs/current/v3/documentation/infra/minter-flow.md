import Feedback from '@site/src/components/Feedback';

# 额外代币

## 额外代币铸造

根据 [Ton区块链白皮书 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55)，TON区块链允许其用户定义除Toncoin之外的任意加密货币或代币，前提是满足某些条件。这些额外的加密货币由32位的_currency_ids_标识。定义的额外加密货币列表是区块链配置的一部分，存储在主链中。每个内部消息以及账户余额都包含一个`ExtraCurrencyCollection`特殊字段（附加到消息或保留在余额上的额外代币集合）： These additional cryptocurrencies are identified by 32-bit **currency\_ids**. The list of these defined cryptocurrencies is a part of the blockchain configuration stored in the MasterChain. Each internal message and account balance includes a special field for `ExtraCurrencyCollection`, which is a set of extracurrencies attached to a message or maintained in a balance:

```tlb
extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;
currencies$_ grams:Grams other:ExtraCurrencyCollection = CurrencyCollection;
```

## 额外代币配置

所有应该被铸造的代币的字典，准确来说是`ExtraCurrencyCollection`，存储在`ConfigParam7`中：

```tlb
_ to_mint:ExtraCurrencyCollection = ConfigParam 7;
```

`ConfigParam 6`包含与铸造相关的数据：

```tlb
_ mint_new_price:Grams mint_add_price:Grams = ConfigParam 6;
```

`ConfigParam2`包含_Minter_的地址。

## 低层级铸币流程

在每个区块中，整合者将旧的全局余额（上一个区块结束时所有代币的全局余额）与`ConfigParam7`进行比较。如果`ConfigParam7`中任何代币的任何金额小于全局余额中的金额 - 配置无效。如果`ConfigParam7`中任何代币的任何金额高于全局余额中的金额，将创建一条铸币消息。 If any amount for any currency in `ConfigParam7` is less than it is in the global balance, the config is invalid. If any amount of any currency in `ConfigParam7` is higher than it is in the global balance, a minting message will be created.

这条铸币消息的来源是`-1:0000000000000000000000000000000000000000000000000000000000000000`，并且_Minter_从`ConfigParam2`作为目的地，并包含`ConfigParam7`中比旧全局余额多出来的额外代币。

The problem here is that the minting message includes only additional currencies and no Toncoins.  这里的问题是铸币消息只包含额外代币，没有TON。这意味着即使_Minter_被设置为基本智能合约（在`ConfigParam31`中呈现），铸币消息也会导致交易中止：`compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`。

## 高层级铸币流程

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

