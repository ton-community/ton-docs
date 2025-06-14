import Feedback from '@site/src/components/Feedback';

# 从 TON Hack 挑战赛中得出结论

TON Hack挑战赛于10月23日举行。在TON主网上部署了几个带有人为安全漏洞的智能合约。每个合约都有3000或5000 TON的余额，允许参与者攻击它并立即获得奖励。
There were several smart contracts deployed to the TON mainnet with synthetic security breaches. Every contract had a balance of 3000 or 5000 TON, allowing participant to hack it and get rewards immediately.

源代码和比赛规则托管在Github [这里](https://github.com/ton-blockchain/hack-challenge-1)。

## 合约

### 1. 互助基金

:::note 安全规则
始终检查函数是否有[`impure`](/develop/func/functions#impure-specifier)修饰符。
:::

The first task was very simple. The attacker could find that `authorize` function was not `impure`. The absence of this modifier allows a compiler to skip calls to that function if it returns nothing or the return value is unused.

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

Voting power was stored in message as an integer. So the attacker could send a negative value during power transfer and get infinite voting power.

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

钱包受密码保护，其哈希存储在合约数据中。然而，区块链记住一切——密码在交易历史中。 However, the blockchain remembers everything—the password was in the transaction history.

### 6. 资金库

:::note 安全规则
Always check for [bounced](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) messages.
Don't forget about errors caused by [standard](/v3/documentation/smart-contracts/func/docs/stdlib) functions.
Make your conditions as strict as possible.
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

Vault does not have a bounce handler or proxy message to the database if the user sends “check”. In the database we can set `msg_addr_none` as an award address because `load_msg_address` allows it. We are requesting a check from the vault, database tries to parse `msg_addr_none` using [`parse_std_addr`](/v3/documentation/smart-contracts/func/docs/stdlib#parse_std_addr), and fails. Message bounces to the vault from the database and op is not `op_not_winner`.

### 7. 更好的银行

:::note 安全规则
Never destroy account for fun.
Make [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) instead of sending money to yourself.
Think about possible race conditions.
Be careful with hashmap gas consumption.
:::

合约中存在竞争条件：你可以存入钱，然后尝试在并发消息中两次提取它。无法保证保留有资金的消息会被处理，所以银行在第二次提款后可能会关闭。之后，合约可以被重新部署，任何人都可以提取未领取的资金。 There is no guarantee that a message with reserved money will be processed, so the bank can shut down after a second withdrawal. After that, the contract could be redeployed and anybody could withdraw unclaimed money.

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

在合约中安全执行第三方代码是不可能的，因为[`out of gas`](/learn/tvm-instructions/tvm-exit-codes#standard-exit-codes)异常不能被`CATCH`处理。攻击者可以简单地[`COMMIT`](/learn/tvm-instructions/instructions#11-application-specific-primitives)合约的任何状态，并引发`out of gas`。 The attacker simply can [`COMMIT`](/v3/documentation/tvm/instructions#F80F) any state of contract and raise `out of gas`.

## 结论

希望这篇文章能对FunC开发者揭示一些不明显的规则。

## 参考资料

- [dvlkv on GitHub](https://github.com/dvlkv) - _Dan Volkov_
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep) - _Dan Volkov_

<Feedback />

