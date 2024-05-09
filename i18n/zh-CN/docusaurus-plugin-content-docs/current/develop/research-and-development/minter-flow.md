# 额外代币铸造

## 额外代币

根据 [Ton区块链白皮书 3.1.6](https://ton-blockchain.github.io/docs/tblkch.pdf#page=55)，TON区块链允许其用户定义除Toncoin之外的任意加密货币或代币，前提是满足某些条件。这些额外的加密货币由32位的_currency_ids_标识。定义的额外加密货币列表是区块链配置的一部分，存储在主链中。每个内部消息以及账户余额都包含一个`ExtraCurrencyCollection`特殊字段（附加到消息或保留在余额上的额外代币集合）：

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

在每个区块中，整合者将旧的全局余额（上一个区块结束时所有代币的全局余额）与`ConfigParam7`进行比较。如果`ConfigParam7`中任何代币的任何金额小于全局余额中的金额 - 配置无效。如果`ConfigParam7`中任何代币的任何金额高于全局余额中的金额，将创建一条铸币消息。

这条铸币消息的来源是`-1:0000000000000000000000000000000000000000000000000000000000000000`，并且_Minter_从`ConfigParam2`作为目的地，并包含`ConfigParam7`中比旧全局余额多出来的额外代币。

这里的问题是铸币消息只包含额外代币，没有TON。这意味着即使_Minter_被设置为基本智能合约（在`ConfigParam31`中呈现），铸币消息也会导致交易中止：`compute_ph:(tr_phase_compute_skipped reason:cskip_no_gas)`。

## 高层级铸币流程

_Minter_智能合约在收到创建新额外代币或为现有代币铸造额外代币的请求时应：

1. 检查`ConfigParam6`中确定的费用是否可以从请求消息中扣除
2. 1. 对于现有代币：检查铸造授权（只有_所有者_可以铸造新的）
   2. 对于创建新代币：检查加密货币的id是否未被占用，并存储新代币的所有者
3. 向配置合约发送消息（此类消息应导致`ExtraCurrencyCollection`中的`ConfigParam7`添加）
4. 向`0:0000...0000`发送消息（保证在下一个或随后的区块中回弹）并带有extra_currency id

收到来自`0:0000...0000`的消息后

1. 从回弹消息中读取extra_currency id
2. 如果minter余额上有对应id的代币，将它们发送给这个代币的所有者，并附上`ok`消息
3. 否则向代币所有者发送`fail`消息

## 待解决的问题

1. 向`0:0000...0000`发送消息以延迟请求处理的方法相当粗糙。
2. 当铸造失败时，应考虑这种情况。目前看来，唯一可能的情况是代币数量为0，或者当前余额加上铸造的金额不适合`(VarUInteger 32)`
3. 如何燃烧？乍一看，没有办法。
4. 铸币费用是否应该是禁止性的？换句话说，拥有数百万额外代币是否危险？（大配置下，区块整理过程中由于不受限的字典操作导致潜在的DoS攻击?）
