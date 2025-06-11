import Feedback from '@site/src/components/Feedback';

# نتیجه‌گیری از چالش هک TON

The TON Hack Challenge was held on October 23.
There were several smart contracts deployed to the TON mainnet with synthetic security breaches. Every contract had a balance of 3000 or 5000 TON, allowing participant to hack it and get rewards immediately.

قوانین مسابقه و کد منبع در GitHub [اینجا](https://github.com/ton-blockchain/hack-challenge-1) میزبانی شده‌اند.

## قراردادها

### 1. Mutual fund

:::note قانون امنیتی
همیشه توابع را برای اصلاح‌کننده [`impure`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier) بررسی کنید.
:::

The first task was very simple. The attacker could find that `authorize` function was not `impure`. The absence of this modifier allows a compiler to skip calls to that function if it returns nothing or the return value is unused.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Bank

:::note قانون امنیتی
همیشه به دنبال روش‌های [تغییر/غیرتغییر](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) باشید.
:::

`udict_delete_get?` با `.` به‌جای `~` فراخوانده شد، بنابراین دیکشنری واقعی دست نخورده باقی ماند.

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note قانون امنیتی
اگر به واقع نیاز دارید، از اعداد صحیح با علامت استفاده کنید.
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

### 4. Lottery

:::note قانون امنیتی
همیشه قبل از انجام [`rand()`](/v3/documentation/smart-contracts/func/docs/stdlib#rand) بذر را تصادفی‌سازی کنید
:::

بذر از زمان منطقی تراکنش گرفته شده بود و یک هکر می‌تواند با نیروی محاسباتی زمان منطقی را در بلوک فعلی شکست دهد و برنده شود (زیرا lt در مرزهای یک بلوک متوالی است).

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

### 5. Wallet

:::note قانون امنیتی
به یاد داشته باشید که همه چیز در بلاک‌چین ذخیره می‌شود.
:::

The wallet was protected with password, it's hash was stored in contract data. However, the blockchain remembers everything—the password was in the transaction history.

### 6. Vault

:::note قانون امنیتی
Always check for [bounced](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) messages.
Don't forget about errors caused by [standard](/v3/documentation/smart-contracts/func/docs/stdlib) functions.
Make your conditions as strict as possible.
:::

خزانه دارای کد زیر در مدیریت پیام پایگاه داده است:

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

### 7. Better bank

:::note قانون امنیتی
Never destroy account for fun.
Make [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) instead of sending money to yourself.
Think about possible race conditions.
Be careful with hashmap gas consumption.
:::

There were race conditions in the contract: you could deposit money, then try to withdraw it twice in concurrent messages. There is no guarantee that a message with reserved money will be processed, so the bank can shut down after a second withdrawal. After that, the contract could be redeployed and anybody could withdraw unclaimed money.

### 8. Dehasher

:::note قانون امنیتی
از اجرای کدهای شخص دیگر در قرارداد خود اجتناب کنید.
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

There is no way to safe execute a third-party code in the contract, because [`out of gas`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) exception cannot be handled by `CATCH`. The attacker simply can [`COMMIT`](/v3/documentation/tvm/instructions#F80F) any state of contract and raise `out of gas`.

## نتیجه‌گیری

امیدواریم این مقاله برخی از قوانین غیر واضح برای توسعه‌دهندگان FunC را روشن کرده باشد.

## منابع

- [dvlkv on GitHub](https://github.com/dvlkv) - _Dan Volkov_
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep) - _Dan Volkov_

<Feedback />

