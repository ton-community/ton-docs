import Feedback from '@site/src/components/Feedback';

# Transaction fees

TON のすべてのユーザーは、_comment が多くの factors_ に依存することに注意してください。

## ガス

すべての[計算コスト](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) はガスユニットにノミネートされ、一定のガス量で固定されます。

ガス単位の価格は[チェーンコンフィグレーション](https://tonviewer.com/config#20)によって決定され、バリデータの合意によってのみ変更される可能性があります。 他のシステムとは異なり、ユーザーは自分のガス価格を設定することはできず、手数料市場は存在しないことに注意してください。 Note that unlike in other systems, the user cannot set his own gas price, and there is no fee market.

現在のベーチェインの設定は次のとおりです。 1単位のガスコストは400ナノトンです。

```cpp
1 gas = 26214400 / 2^16 nanotons = 0.000 000 4 TON
```

マスターチェーンの現在の設定は以下のとおりです。 1単位のガスコスト10000ナノトン。

```cpp
1 gas = 655360000 / 2^16 nanotons = 0.000 01 TON
```

### 平均取引コスト

> **TLDR:** Today, basic transaction costs around **~0.0025 TON**

Even if TON price increases 100 times, transactions will remain ultra-cheap; about $0.01. Moreover, validators may lower this value if they see commissions have become expensive [read why they're interested](#gas-changing-voting-process).

:::info
現在のガス量はネットワーク設定 [param 20](https://tonviewer.com/config#20)と[param 21](https://tonviewer.com/config#21)に記載されています。
:::

### ガス変化投票プロセス

ガス料金は、TONの他の多くのパラメータと同様に設定可能であり、メインネットで行われた特別な投票によって変更される可能性があります。

Changing any parameter requires approval from 66% of the validators' votes.

#### ガソリンはもっと費用がかかるでしょうか。

> _Does it mean that one day gas prices could rise by 1,000 times or even more?_

技術的には、はい、しかし、実際にはありません。

バリデータは取引を処理するための少額の手数料を受け取ります 手数料を上げると取引件数が減少し 検証プロセスが不利益になります

### 手数料はどのように計算されますか？

TON の手数料は、トランザクション実行時間、口座の状態、メッセージの内容、サイズに依存するため、事前に計算することは困難です。 ブロックチェーンネットワークの設定、およびトランザクションが送信されるまで計算できない他の変数の数。

That is why NFT marketplaces typically require an extra amount of TON (~1 TON) and refund the remaining amount (1 - transaction_fee) after the transaction.

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

[低レベルの手数料概要](/v3/documentation/smart-contraction/transaction-fees/low-level) で、手数料や[手数料計算](/v3/guidelines/smart-contracts/fee-calculation)の計算方法を確認し、新しいTVMオプションを使用してFunC契約の手数料を計算する方法を学びましょう。
:::

しかし、料金がTON上でどのように機能するかについて詳しくお読みしましょう。

## Basic fees formula

TONの手数料はこの式で計算されます:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees // also named import_fee
                + computation_fees
                + action_fees
                + out_fwd_fees
```

```jsx live
// Welcome to LIVE editor!
// feel free to change any variables
// Check https://retracer.ton.org/?tx=b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262

function FeeCalculator() {
  // https://tonviewer.com/config#25
  const lump_price = 400000;
  const bit_price = 26214400;
  const cell_price = 2621440000;
  const ihr_price_factor = 98304;
  const first_frac = 21845;
  const nano = 10 ** -9;
  const bit16 = 2 ** 16;

  const ihr_disabled = 0; // First of all define is ihr gonna be counted

  let fwd_fee =
    lump_price + Math.ceil((bit_price * 0 + cell_price * 0) / bit16);

  if (ihr_disabled) {
    var ihr_fee = 0;
  } else {
    var ihr_fee = Math.ceil((fwd_fee * ihr_price_factor) / bit16);
  }

  let total_fwd_fees = fwd_fee + ihr_fee;
  let gas_fees = 0.0011976; // Gas fees out of scope here
  let storage_fees = 0.000000003; // And storage fees as well
  let total_action_fees = +((fwd_fee * first_frac) / bit16).toFixed(9);
  let import_fee =
    lump_price + Math.ceil((bit_price * 528 + cell_price * 1) / bit16);
  let total_fee =
    gas_fees + storage_fees + total_action_fees * nano + import_fee * nano;

  return (
    <div>
      <p> Total fee: {+total_fee.toFixed(9)} TON</p>
      <p> Action fee: {+(total_action_fees * nano).toFixed(9)} TON </p>
      <p> Fwd fee: {+(total_fwd_fees * nano).toFixed(9)} TON </p>
      <p> Import fee: {+(import_fee * nano).toFixed(9)} TON </p>
      <p> IHR fee: {+(ihr_fee * nano).toFixed(9)} TON </p>
    </div>
  );
}
```

## 取引手数料の要素

- 「storage_fees」は、ブロックチェーンにスマート コントラクトを保存するために支払う金額です。実際、スマート コントラクトがブロックチェーンに保存されるごとに料金が発生します。 In fact, you pay for every second the smart contract is stored on the blockchain.
  - _例_: TON ウォレットもスマート コントラクトであり、トランザクションを送受信するたびに保管料を支払います。 [ストレージ料金の計算方法](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee) について詳しく読んでください。 Read more about [how storage fees are calculated](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
- 「in_fwd_fees」は、ブロックチェーンの外部からのみメッセージをインポートする場合の料金です。トランザクションを行うたびに、トランザクションを処理するバリデーターにトランザクションを配信する必要があります。契約から契約への通常のメッセージには、この料金は適用されません。受信メッセージの詳細については、[TON ブロックチェーンの論文](https://docs.ton.org/tblkch.pdf) をお読みください。 Every time you make a transaction, it must be delivered to the validators who will process it. For ordinary messages from contract to contract this fee is not applicable. Read [the TON Blockchain paper](https://docs.ton.org/tblkch.pdf) to learn more about inbound messages.
  - _例_: ウォレット アプリ (Tonkeeper など) で行う各トランザクションは、まず検証ノード間で分散する必要があります。
- 「computation_fees」は、仮想マシンでコードを実行するために支払う金額です。コードが大きくなるほど、支払わなければならない料金も高くなります。 The larger the code, the more fees must be paid.
  - _例_: ウォレット (スマート コントラクト) でトランザクションを送信するたびに、ウォレット コントラクトのコードを実行して、その代金を支払います。
- 「action_fees」は、スマート コントラクトによって作成された送信メッセージの送信、スマート コントラクト コードの更新、ライブラリの更新などに対する料金です。
- 「out_fwd_fees」は、オフチェーン サービス (ログなど) や外部ブロックチェーンと対話するために TON ブロックチェーンの外部にメッセージを送信するための料金を表します。

## よくある質問

Here are the most frequently asked questions by visitors of TON:

### TONを送金するための手数料はいくらですか？

任意の量の TON を送信する場合の平均手数料は 0.0055 TON です。

### Jettonを送金するための手数料はいくらですか？

任意の量のカスタム Jetton を送信する場合の平均料金は 0.037 TONです。

### NFT をミントするのにかかるコストはどのくらいですか？

1 つの NFT をミントするための平均手数料は 0.08 TONです。

### TON上でデータを保存するのにはいくらかかりますか？

Saving 1 MB of data for one year on TON will cost 6.01 TON. Note that you usually don't need to store large amounts of data on-chain. Consider using [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) if you need decentralized storage.

### ガスレストランザクションを送信することはできますか?

TON では、トランザクションのガス料金を支払う中継者である [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) を使用して、ガスレストランザクションが可能です。

### How to calculate fees?

TON Blockchainの[手数料計算](/v3/guidelines/smart-contracts/fee-calculation)に関する記事があります。

## 参照

- Based on the [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22) - _[menschee](https://github.com/menschee)_

## See also

- [Low-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)—read about the formulas for calculating commissions.
- [FunCの転送手数料を計算するスマートコントラクト機能](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

<Feedback />

