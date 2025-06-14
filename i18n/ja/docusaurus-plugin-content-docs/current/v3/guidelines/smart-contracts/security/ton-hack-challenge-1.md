import Feedback from '@site/src/components/Feedback';

# TON Hack Challenge から結論を描く

TON Hack Challengeは10月23日に開催されました。
合成セキュリティ侵害を伴ういくつかのスマートコントラクトがTONメインネットに配備されていました。 すべての契約に3000または5000トンの残高があり、参加者はそれをハックし、すぐに報酬を得ることができます。
There were several smart contracts deployed to the TON mainnet with synthetic security breaches. Every contract had a balance of 3000 or 5000 TON, allowing participant to hack it and get rewards immediately.

ソースコードとコンテストのルールはGitHub [here](https://github.com/ton-blockchain/hack-challenge-1)でホストされています。

## 契約

### 1. 相互基金

:::note セキュリティルール
[`impure`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier) 修飾子を常にチェックしてください。
:::

The first task was very simple. The attacker could find that `authorize` function was not `impure`. The absence of this modifier allows a compiler to skip calls to that function if it returns nothing or the return value is unused.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. 銀行

:::note セキュリティルール
[modifying/non-modifying](/v3/documentation/smart-contrits/func/docs/statements#methods-calls) メソッドを常に確認してください。
:::

`udict_delete_get?` は `~` の代わりに `.` で呼び出されたので、実際の dict は変更されませんでした。

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note セキュリティルール
本当に必要な場合は、符号付き整数を使用します。
:::

投票電力は整数としてメッセージに格納されました. だから、攻撃者は電力転送中に負の値を送信し、無限の投票電力を得ることができます.

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

### 4. 宝くじ（くじ）

:::note セキュリティルール
[`rand()`](/v3/documentation/smart-contracts/func/docs/stdlib#rand) を行う前にシードをランダム化する
:::

シードは取引の論理的な時期から持ち込まれました。 そして、ハッカーは現在のブロック内の論理的な時間を残忍に強制することによって勝利することができます(Ltは1ブロックの境界で順番になります)。

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

### 5. ウォレット

:::note セキュリティルール
すべてがブロックチェーンに保存されていることを忘れないでください。
:::

ウォレットはパスワードで保護されており、ハッシュがコントラクトデータに保存されています。しかし、ブロックチェーンはすべてを覚えています - パスワードはトランザクション履歴にありました。 However, the blockchain remembers everything—the password was in the transaction history.

### 6. Vault

:::note セキュリティルール
Always check for [bounced](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) messages.
[bounced](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) メッセージを常に確認してください。
[standard](/v3/documentation/smart-contracts/func/docs/stdlib/) 関数によって引き起こされるエラーを忘れないでください。
あなたの条件を可能な限り厳密にしてください。
Make your conditions as strict as possible.
:::

格納域には、次のコードがデータベースメッセージハンドラに含まれています:

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

Vault does not have a bounce handler or proxy message to the database if the user sends “check”. In the database we can set `msg_addr_none` as an award address because `load_msg_address` allows it. Vaultは、ユーザーが「チェック」を送信した場合、バウンスハンドラやプロキシメッセージをデータベースに持っていません。 `load_msg_address`で許可されているため、データベースでは`msg_addr_none`をアワードアドレスとして設定できます。 保管庫からの確認を要求しています。データベースは、[`parse_std_addr`](/v3/documentation/smart-contrits/func/docs/stdlib#parse_std_addr) を使用して `msg_addr_none` を解析しようとして失敗します。 メッセージはデータベースから格納域に跳ね返り、opは`op_not_winner`ではありません。 Message bounces to the vault from the database and op is not `op_not_winner`.

### 7. より良い銀行

:::note セキュリティルール
Never destroy account for fun.
Make [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) instead of sending money to yourself.
Think about possible race conditions.
Be careful with hashmap gas consumption.
:::

競合条件がありました:あなたはお金を入金し、同時メッセージでそれを2回撤回しようとすることができます。 予約金を含むメッセージが処理される保証はないので、銀行は2回目の引き出し後にシャットダウンすることができます。 その後、契約は再配備され、誰でも請求されていないお金を引き出すことができます。 There is no guarantee that a message with reserved money will be processed, so the bank can shut down after a second withdrawal. After that, the contract could be redeployed and anybody could withdraw unclaimed money.

### 8.デハッシャー Dehasher

:::note セキュリティルール
契約内でサードパーティーのコードを実行しないでください。
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

[`Out of gas`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) 例外が `CATCH` で処理できないため、サードパーティのコードをコントラクト内で安全に実行する方法はありません。攻撃者はコントラクトの任意の状態を [`COMMIT`](/v3/documentation/tvm/instructions#F80F) して `out of gas` を発生させることができます。 The attacker simply can [`COMMIT`](/v3/documentation/tvm/instructions#F80F) any state of contract and raise `out of gas`.

## 結論

この記事はFunC開発者のための非明白なルールにいくつかの光を当てていることを願っています。

## 参照

- [dvlkv on GitHub](https://github.com/dvlkv) - _Dan Volkov_
- [Original article](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep) - _Dan Volkov_

<Feedback />

