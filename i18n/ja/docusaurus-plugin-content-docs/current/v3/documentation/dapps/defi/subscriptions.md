import Feedback from '@site/src/components/Feedback';

# Content subscriptions

TONブロックチェーンのトランザクションは高速で、ネットワーク手数料も低いため、スマートコントラクトを通じてオンチェーンで定期的な支払いを処理することができます。

例えば、ユーザーはデジタル・コンテンツ（あるいはその他のもの）を購読することができ、1TONの月額料金を請求されます。

:::tip
このコンテンツはバージョンv4のウォレット専用です。古いウォレットにはこの機能はありません。 Older wallets don't have this functionality; it is eligible to change in future versions as well.
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

一方、ユーザーは知識がなければサブスクリプションをインストールできません。
:::

## フローの例

- ユーザーは v4 ウォレットを使用します。プラグインとして知られる追加のスマートコントラクトは、その機能を拡張できます。 It allows additional smart contracts, known as plugins, to extend its functionality.

   その機能を確認した後、ユーザーは自分のウォレットの信頼できるスマートコントラクト（プラグイン）のアドレスを承認することができます。その後、信頼できるスマートコントラクトはウォレットからトンコインを引き出すことができます。これは他のブロックチェーンにおける「無限承認」に似ています。 Following that, the trusted smart contracts can withdraw Toncoin from the wallet. This is similar to "Infinite Approval" in some other blockchains.

- 中級サブスクリプションスマートコントラクトは、各ユーザーとサービスの間でウォレットプラグインとして使用されます。

   このスマートコントラクトは、ユーザーのウォレットから指定された量のToncoinが指定された期間内に1回以上引き落とされないことを保証します。

- このサービスのバックエンドは、サブスクリプションスマートコントラクトに外部メッセージを送信することで、定期的に支払いを開始します。

- ユーザーまたはサービスのいずれかが、サブスクリプションの必要性がなくなったと判断し、それを終了することができます。

## スマートコントラクトの例

- [ウォレットv4スマートコントラクト　ソースコード](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [サブスクリプションスマートコントラクト　ソースコード](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## 実装

A good example of implementation is decentralized subscriptions for Toncoin to private channels in Telegram by the [@donate](https://t.me/donate) bot and the [Tonkeeper wallet](https://tonkeeper.com). <Feedback />

