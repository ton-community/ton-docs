import Feedback from '@site/src/components/Feedback';

# TON Connect for business

TONコネクトは、トラフィックを呼び込み、ユーザーのリテンションを高める強力な機能を提供することで、ビジネス向けにカスタマイズできるように構築されています。

## プロダクトの特徴

- 個人情報の漏洩を抑えた安全かつプライベートな認証
- 単一ユーザー・セッション内で、TON上で任意のトランザクション署名が可能
- アプリケーションとユーザー・ウォレット間のインスタント・コネクティビティ
- ウォレット内で直接、アプリケーションを自動利用可能

## TONコネクトの採用

### 基本ステップ

開発者がTON Connectをアプリケーションに統合するには、専用のTON Connect SDKを使用します。このプロセスは非常に簡単で、必要に応じて適切なドキュメントにアクセスすることで実行できます。 The process is quite simple and can be performed by accessing the correct documentation when needed.

TONコネクトにより、ユーザーはQRコードまたはユニバーサルコネクティビティリンクを介して、アプリケーションを多数のウォレットに接続することができます。アプリは、内蔵のブラウザ拡張機能を使用してウォレット内で開くこともでき、TONコネクトに今後追加される機能を常に最新に保つことが重要です。 Apps can also be opened within a wallet using a built-in browser extension and it is critical to keep up to date with additional features that are added to TON Connect moving forward.

### 一般的な実施例

By using the [TON Connect SDK](https://github.com/ton-connect/sdk), detailed instructions to integrate TON Connect allows developers to:

- TONウォレットとアプリケーションを接続
- 対応するウォレットのアドレスを使ってバックエンドにログインす
- リクエストトランザクションの送信とインウォレット署名（リクエストの受付）

このソリューションで何が可能かをより理解するには、GitHubで公開されているデモアプリをご覧ください：[https://github.com/ton-connect/](https://github.com/ton-connect/demo-dapp)

### 現在サポートされている技術スタック：

- すべてのウェブアプリケーション - サーバーレスおよびバックエンド
- リアクトネイティブ・モバイルアプリ
- SDK for mobile applications in Swift, Java, Kotlin

TON Connect is an open protocol and can be used to develop DApps with any programming language or development environment.

For JavaScript (JS) applications, the TON developer community created a JavaScript SDK that allows developers to integrate TON Connect seamlessly in minutes. SDKs designed to operate with additional programming languages will be available in the future.

<Feedback />

