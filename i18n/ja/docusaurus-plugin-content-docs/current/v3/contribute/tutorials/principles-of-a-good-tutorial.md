import Feedback from '@site/src/components/Feedback';

# 良いチュートリアルの原則

:::danger
This page is outdated and will be updated soon.
See the [How to contribute](/v3/contribute/).
:::

この原則を記した[talkol](https://github.com/talkol)のオリジナルコメント：

- [TONフットステップ#7へのオリジナルコメント](https://github.com/ton-society/ton-footsteps/issues/7#issuecomment-1187581181)

以下は、新規投稿者のためのこれらのポイントの概要です。

## 原則

1. The full flow should run on the user's client. There shouldn't be any third-party services involved. 全フローは、ユーザーのクライアント上で実行する必要があります。サードパーティのサービスは一切含むべきではありません。 ユーザーがリポジトリを簡単にクローンしてすぐに実行できるようにする必要があります。

2. READMEは非常に詳細であるべきです. Do not assume the users know anything. ユーザーが何を知っていると仮定しないでください。チュートリアルで必要な場合は、 FunC compiler またはLite-clientをデバイスにインストールする方法も説明します。 このドキュメントの他のチュートリアルからこれらの部分をコピーできます。 You can copy these parts from other tutorials in this documentation.

3. リポジトリに使用される契約のソースコード全体が含まれていれば、ユーザーが標準コードにマイナーな変更を加えられるようなるので良いでしょう。たとえば、Jettonスマートコントラクトを使用すると、ユーザーはカスタム動作を実験できます。 For example, the Jetton smart contract allows users to experiment with custom behavior.

4. 可能であれば、ユーザーがコードをダウンロードしたり設定したりすることなくプロジェクトをデプロイしたり実行したりできるような、ユーザーフレンドリーなインターフェースを作りましょう。この場合も、スタンドアロンで GitHub Pages から提供され、ユーザーのデバイス上で 100% クライアントサイドで実行されるようにする必要があります。例: https://minter.ton.org/ Notice that this should still be standalone and served from GitHub Pages to run 100% client-side on the user's device. Example: https://minter.ton.org/

5. すべてのフィールド選択の意味をユーザーに説明し、最適な方法を説明する。

6. Explain everything there is to know about security. セキュリティについて知っておくべきことをすべて説明しましょう。 クリエイターが間違いを犯したり、危険なスマートコントラクト/ボット/ウェブサイトを作成したりしないことを十分に説明しなければなりません。あなたは彼らに最高のセキュリティ設定手順を教えています。

7. 理想的には、リポジトリにあなたのチュートリアルの文脈でどのように実装するのが最適かを読者に示す、よく書かれた内容が含まれているべきです。

8. The repository should have its own easy-to-understand compilation/deployment scripts. リポジトリは、独自のわかりやすいcompilation/deployment スクリプトを持つべきである。ユーザーは、`npm install`するだけで、それらを使うことができるはずです。

9. GitHubのリポジトリだけで十分なこともあるし、完全な記事を書く必要がないこともある。リポジトリに必要なコードをまとめたREADMEがあればいい。この場合、ユーザーが読みやすく理解しやすいように、コードにはしっかりとコメントをつけましょう。 Just a README with all the code you need in the repository. In this case, the code should be well-commented so that the user can easily read and understand it.
  <Feedback />

