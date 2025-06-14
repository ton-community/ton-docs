import Feedback from '@site/src/components/Feedback';

# TON ペイメント

TON ペイメントはマイクロペイメントチャネルのプラットフォームです。

すべてのトランザクションをブロックチェーンにコミットし、関連する取引手数料（例えば、消費されたガス代）を支払い、問題のトランザクションを含むブロック
が確認されるまで5秒間待つ必要がなしに、即時決済が可能になります。

このような即時支払いの全体的な費用は非常に最小限であるため、ゲーム、API、およびオフチェーンアプリのマイクロペイメントに使用できます。[例はこちらを参照してください。](/v3/documentation/dapps/defi/ton-payments#examples) [See examples](/v3/documentation/dapps/defi/ton-payments#examples).

- [TONでの支払い](https://blog.ton.org/ton-payments)

## ペイメントチャンネル

### スマートコントラクト

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

ペイメントチャンネルを使うのに、暗号に関する深い知識は必要ありません。

用意されたSDKを使うことができます：

- [toncenter/tonweb](https://github.com/toncenter/tonweb) JavaScript SDK
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example)-tonwebでペイメントチャンネルを使用する方法。

### 使用例

[Hack-a-TON #1](https://ton.org/hack-a-ton-1)の受賞者の中から、決済チャネルの使用例を探す：

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON)-OnlyTONs支払いプロジェクト（[ウェブサイト](https://main.d3puvu1kvbh8ti.amplifyapp.com/), [ビデオ](https://www.youtube.com/watch?v=38JpX1vRNTk))
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario)-OnlyGrams決済プロジェクト（[ウェブサイト](https://onlygrams.io/), [ビデオ](https://www.youtube.com/watch?v=gm5-FPWn1XM))
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton)-Pay-per-Request API usage in TON ([ビデオ](https://www.youtube.com/watch?v=7lAnbyJdpOA&feature=youtu.be))
- [illright/diamonds](https://github.com/illright/diamonds)—Pay-per-Minute 学習プラットフォーム ([website](https://diamonds-ton.vercel.app/), [video](https://www.youtube.com/watch?v=g9wmdOjAv1s))

## See also

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON Connect](/v3/guidelines/ton-connect/overview)

<Feedback />

