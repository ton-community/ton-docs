# Drawing conclusions from TON Hack Challenge

<!-- Author: Dan Volkov https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep -->

The TON Hack Challenge was held on October 23.
There were several smartcontracts deployed in TON mainnet with synthetic security breaches. Every contract had 3000 or 5000 TON on balance, so the participant can hack it and get rewards immediately.

As for me we hacked 6th task of this contest, but in this article I don't want to share my story, I want to tell you some thoughts about breaches in tasks.

Source code and contest rules were hosted on Github here.

## Contracts

### 1. Mutual fund

:::note
Always check functions for `impure` modifier.
:::

The first task was very simple. The attacker can find that `authorize` function was not `impure`. Absence of this modifier allows compiler to skip calls to that function if it returns nothing or return value is unused.

```cpp
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Bank

:::note
Always check for modifying/non-modifying methods.
:::

`udict_delete_get?` was called with `.` instead `~`, so the real dict was untouched.

```cpp
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note
Use signed integers if you really need it.
:::

Voting power was stored in message as an integer. So attacker can send negative value during power transfer and get infinite voting power.

```cpp
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

### 4. Lottery

:::note
Always randomize seed before doing `rand()`
:::

Seed was brought from logical time of the transaction and hacker can bruteforce logical time in the current block to win (cause LT is sequential in the borders of one block).

```cpp
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

### 5. Wallet

:::note
Remember that everything is stored in blockchain.
:::

The wallet was protected with password, it's hash was stored in contract data. But blockchain remembers everything - the password was in the transaction history.

### 6. Vault

:::note
Always check for bounced messages.
Don't forget about errors caused by standard functions.
Make your conditions as strict as possible.
:::

The vault has following code in the database message handler:

```cpp
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

Vault does not have bounce handler and proxy message to database if user sends “check”. In database we can set `msg_addr_none` as an award address cause `load_msg_address` allows it. We are requesting check from vault, database tries to parse `msg_addr_none` using `parse_std_addr` and fails. Message bounces to the vault from database and the op is not `op_not_winner`.

### 7. Better bank

:::note
Never destroy account for fun.
Make `raw_reserve` instead of sending money to yourself.
Think about possible race conditions.
Be careful with hashmap gas consumption.
:::

There were race condition in the contract: you can deposit money, then try to withdraw two times in concurrent messages. There is no guarantee that message with reserved money will be processed, so bank can shutdown after second withdrawal. After that the contract could be redeployed and then anybody can withdraw unowned money.

### 8. Dehasher

:::note
Avoid executing third-party code in your contract.
:::

```cpp
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

There is no way to safe execute third-party code in the contract, cause `out of gas` exception cannot be handled by `CATCH`. Attacker simply can `COMMIT` any state of contract and raise `out of gas`.

## Conclusion

I hope this article would shed light on the non-obvious rules for FunC developers.

## References

Originally written by Dan Volkov

- [Github](https://github.com/dvlkv)
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)
