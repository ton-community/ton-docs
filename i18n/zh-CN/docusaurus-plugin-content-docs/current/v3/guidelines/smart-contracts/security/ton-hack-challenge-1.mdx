# 从 TON Hack 挑战赛中得出结论

TON Hack挑战赛于10月23日举行。在TON主网上部署了几个带有人为安全漏洞的智能合约。每个合约都有3000或5000 TON的余额，允许参与者攻击它并立即获得奖励。

源代码和比赛规则托管在Github [这里](https://github.com/ton-blockchain/hack-challenge-1)。

## 合约

### 1. 互助基金

:::note 安全规则
始终检查函数是否有[`impure`](/develop/func/functions#impure-specifier)修饰符。
:::

第一个任务非常简单。攻击者可以发现`authorize`函数没有`impure`。这个修饰符的缺失允许编译器在函数不返回任何内容或返回值未使用时跳过对该函数的调用。

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. 银行

:::note 安全规则
始终检查[修改/非修改](/develop/func/statements#methods-calls)方法。
:::

使用`.`而不是`~`调用了`udict_delete_get?`，所以真正的 dict 没有被触及。

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note 安全规则
如果你真的需要，使用符号整数。
:::

投票权在消息中以整数形式存储。所以攻击者可以在转移投票权时发送一个负值，并获得无限投票权。

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; No need to check that result from_votes is positive: set_voting_power will throw for negative votes
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. 彩票

:::note 安全规则
在执行[`rand()`](/develop/func/stdlib#rand)之前，始终随机化seed。
:::

seed来自交易的逻辑时间，黑客可以通过暴力破解当前区块中的逻辑时间来赢得比赛（因为lt在一个区块的边界内是连续的）。

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; forbid too large jackpot
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...send reward... }
```

### 5. 钱包

:::note 安全规则
记住区块链上存储的一切。
:::

钱包受密码保护，其哈希存储在合约数据中。然而，区块链记住一切——密码在交易历史中。

### 6. 资金库

:::note 安全规则
始终检查[bounced](/develop/smart-contracts/guidelines/non-bouncable-messages)消息。
不要忘记由[标准](/develop/func/stdlib/)函数引起的错误。
尽可能使条件严格。
:::

资金库在数据库消息处理程序中有以下代码：

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

如果用户发送“支票”，资金库没有弹回处理程序或代理消息到数据库。在数据库中，我们可以设置`msg_addr_none`作为奖励地址，因为`load_msg_address`允许它。我们向资金库请求支票，数据库尝试解析`msg_addr_none`使用[`parse_std_addr`](/develop/func/stdlib#parse_std_addr)，并失败。消息从数据库弹回到金库，并且op不是`op_not_winner`。

### 7. 更好的银行

:::note 安全规则
永远不要为了好玩而销毁账户。做[`raw_reserve`](/develop/func/stdlib#raw_reserve)而不是把钱发给自己。考虑可能的竞争条件。小心哈希映射的gas费用消耗。
:::

合约中存在竞争条件：你可以存入钱，然后尝试在并发消息中两次提取它。无法保证保留有资金的消息会被处理，所以银行在第二次提款后可能会关闭。之后，合约可以被重新部署，任何人都可以提取未领取的资金。

### 8. 驱逐者

:::note 安全规则
避免在合约中执行第三方代码。
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; restore c4 if dehasher spoiled it
  set_data(c4);
  ;; clean actions if dehasher spoiled them
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

在合约中安全执行第三方代码是不可能的，因为[`out of gas`](/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes)异常不能被`CATCH`处理。攻击者可以简单地[`COMMIT`](/learn/tvm-instructions/instructions#11-application-specific-primitives)合约的任何状态，并引发`out of gas`。

## 结论

希望这篇文章能对FunC开发者揭示一些不明显的规则。

## 参考资料

原文作者 Dan Volkov

- [dvlkv on Github](https://github.com/dvlkv)
- [原文链接](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)
