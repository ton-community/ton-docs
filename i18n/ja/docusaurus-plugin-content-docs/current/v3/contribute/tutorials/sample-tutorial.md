import Feedback from '@site/src/components/Feedback';

# チュートリアルの構成例

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

## Introduction

「イントロ」の見出しは **必ず** H2: `## はじめに`

このセクションでは、このチュートリアルの背景と、なぜそれが重要なのか、このチュートリアルで何を作り、何を学ぶのかを説明します。

- このセクションを5歳に説明しているように説明してください（**[ELI5](https://www.dictionary.com/e/slang/eli5/)**）
- 最大5～6行ですべてを説明してください。

_例:_

> スマートコントラクトは、TON ブロックチェーン上で動作するコンピュータープログラムであり、特にその [TVM](/v3/documentation/tvm/tvm-overview) (_TON Virtual Machine_) 上で動作します。 コントラクトは、TON のいくつかのアドレスに格納されているコード (_compiled TVM instructions_) とデータ (_persistent state_) で作られています。 The contract is made of code (_compiled TVM instructions_) and data (_persistent state_) that are stored at some address on TON.

## 前提条件

「前提条件」の見出しは**必ず**H2: `##前提条件`

This section is for you to explain any prior knowledge needed or any existing tutorials that need to be completed first. Any tokens that are needed—mention them here.

_例:_

> このチュートリアルでは、testnet で Jetton をミントします。続ける前に、 [testnet](/v3/documentation/smart-contracts/getting-started/testnet のウォレットに十分な残高があることを確認してください。 Before we continue, make sure that your [testnet](/v3/documentation/smart-contracts/getting-started/testnet) wallet has sufficient balance.

## 必要条件

「必要条件」の見出しは**必ず**H2: `##必要条件`

**オプション :** チュートリアルがあれば、このセクションにビデオコンテンツを埋め込んでください。

**必要条件**セクションには、チュートリアルを**開始する前**にインストールが必要な技術について説明をしてください。このチュートリアルでは扱わないものとして、_TONウォレットの拡張機能やNode. jsなど_が例に挙げられます。ただし、チュートリアル中にインストールするパッケージについてはリストアップしないでください。

_例:_

- このチュートリアルでは、TON ウォレットの拡張機能が必要です。 [ここから](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhhjchkhmiggakijnkhfnd)インストールしてください。
- NodeJS 12.0.1+がインストールされていることを確認してください。

## チュートリアルの本文

- 「チュートリアル本文」を見出しとして使用せず、資料に関連する独自の見出しを使用してください。
  - 他に何も思いつかなければ、"始める"でも構いません。
- チュートリアルを通して読者をガイドするために必要なテキストコンテンツを追加します。そして、_**チュートリアルを提出する前に、スペルや文法用のコンテンツ**_を校正することを忘れないでください。
  - [Grammarly](http://grammarly.com)は、文法ミスを避けるのに役立つ優れた無料プログラムです。

### キーポイント

- 見出しとして「チュートリアルの本文」を使用しないでください!

- **すべての小見出しをH3に保持します** 。H4またはそれ以下にしないでください。
  - Markdown構文では、H2ヘッダに2つのハッシュマークが使用されます: ##
  - H3の見出しには3つのハッシュマークが使われる：###

- Add only necessary comments to code blocks. コードブロックに必要なコメントのみを追加します。 _**入力コードブロックに # スタイルコメントを追加しないでください。**_

- 関連するすべてのコードブロックを追加:
  - ## Markdown syntax for code blocks consists of three backticks at the beginning and end of the code block.  Also, make sure that there is a newline before and after the backticks in all code blocks. _For example_:
    \`js  
    const testVariable = 'some string';  
    someFunctionCall();  
    \`

  - すべてのコードブロックは、_**必ず**_構文ハイライトタイプを持っています。わからない場合は\`\`\\`text を使用してください。 Use \`\`\`text if you are not sure.

  - \\`\`\\`text はターミナル出力、ターミナルコマンド、プレーンテキストに使用する必要があります。

  - \`javascript *または* `js は JavaScript コードに使用できます。

  - \`typescript または `ts は TypeScript コードに使用できます。

  - \\`\`\\`jsx はReactJSのコードです。

  - \\`\`\\`cpp は Funcのコードです。

  - GraphQL 構文を強調表示する場合は \\`\`\\`graphql を使用します。

  - Use \\`\`\`json when highlighting valid JSON. 有効なJSONを強調表示する場合は、JSONを使用してください。(無効なJSONの例には、かわりに\\`\`\\`textを使用してください)。

  - \\`\`\\`bashは#スタイルのコメントが必要なコードブロックで_のみ_ 使用されるべきです。 多くの場合、# 文字はマークダウンの見出しとしてレンダリングされるため、これは慎重に行う必要があります。 通常、これが発生すると、目次が影響を受けます。 This must be done carefully because in many situations the # character will render as a markdown heading. Typically, the Table of Contents will be affected if this occurs.

- `事前に書式設定されたテキスト` を使用しないでください。代わりに、**bold** か _italic_ テキストのみを使用してください。

- 予想される端末出力を反映させる画像またはコードブロックを追加します。

- チュートリアルを書くときは、エラー主体のアプローチを取りましょう。よくあるエラーとトラブルシューティングの手順を追加しましょう。\*例えば Add common errors and troubleshooting steps. _For example:_

> **`node deploy:testnet`コマンド実行時にエラーが発生したため、Testnetに接続できません。**
>
> 一般的な原因をいくつか見てみましょう:

- .env\\`で生成したtestnetウォレットに十分な資金があることを確認してください。なければ、ファセット提供者からtestnetコインを追加してください。 If not, please add some testnet coins from the faucet giver.
- それでも同じ問題が発生している場合は、[Dev Chat](https://t.me/TonDev_eng/)で開発者に問い合わせてください。

>

## 結論

結論の見出しは必ず\*\*H2: `##結論`とすること。

This section should summarize what was learned in the tutorial, reinforce key points, and congratulate the learner on completing the tutorial. Use a maximum of 5–6 lines.
_For example_:

> We created a simple new FunC contract with counter functionality. We then built and deployed it on-chain, and finally interacted with it by calling a getter and sending a message.

このコードをメインネットにデプロイする場合は、トークンがマーケットに上場されている場合は送金方法を無効にするなど、他にも考慮すべき点がいくつかあります。

>

## See Also

次のステップの見出しは必ず\*\*H2: `# こちらもおすすめ`とすること。

Use this section to explain what can be done next after this tutorial to continue learning.
Feel free to add recommended projects and articles relating to this tutorial.
If you're working on any other advanced tutorials, you can briefly mention them here.
Typically, only related pages from docs.ton.org are placed here.

## 著者について _(任意 )_

作者についての見出しは**必ず** H2でなければなりません: `## 著者について`

Keep it short. One or two lines at most. You can include a link to your GitHub profile + Telegram profile. Please refrain from adding your LinkedIn or Twitter here.

## 参照 _(任意 )_

参照見出しは **必ず** H2: `## 参照`

このチュートリアルを書くにあたって、他のドキュメントやGitHubのリポジトリ、既存のチュートリアルから何らかの助けを借りた場合は、このセクションは**必ず**記載しなければなりません。

可能な限り、出典の名前と文書へのリンクを追加して、出典をクレジットします。

If it is not a digital document, include an ISBN or other form of reference. <Feedback />

