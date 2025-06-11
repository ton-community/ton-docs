import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

この記事では、TONアプリケーションを開発したい人のために考慮すべき要素をレビューし、議論します。

## Checklist

### 1. 名前の衝突数

Func variables and functions may contain almost any legit character. I.e. 関数変数と関数は、ほとんどすべての正当な文字を含むことができます。すなわち、`var++`、`~bits`、`foo-bar+baz`は、有効な変数と関数名です。

Func コードを書いたり検査したりするときは、Linter を使用する必要があります。

- format@@0(/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. スロー値を確認する

Each time the TVM execution stops normally, it stops with exit codes `0` or `1`. TVM の実行が正常に停止するたびに、終了コード `0` または `1` で停止します。 自動的に行われますが。 `0`と`1`が`throw(0)`または`throw(1)`コマンドで直接スローされた場合、TVMの実行は予期しない方法で直接中断することができます。

- format@@0(/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- format@@0(/v3/documentation/tvm/tvm-exit-codes)

### 3. Func は厳密に型付けされた言語で、データ構造が格納されているものを正確に保持しています。

It is crucial to keep track of what the code does and what it may return. Keep in mind that the compiler cares only about the code and only in its initial state. After certain operations stored values of some variables can change.

Reading unexpected variables values and calling methods on data types that are not supposed to have such methods (or their return values are not stored properly) are errors and are not skipped as "warnings" or "notices" but lead to unreachable code. 予期しない変数の値とそのようなメソッドを持っているはずではないデータ型のメソッドを呼び出すことはエラーであり、「警告」や「警告」としてスキップされることはありませんが、到達不能なコードにつながります。 予期しない値を保存すると問題が発生することがありますが、それを読むと問題が発生する可能性があります。 を選択します。 error code 5 (integer out of expected range) は整数変数に対してスローされます。

### 4. メッセージにモードがあります

It is essential to check the message mode, in particular its interaction with previous messages sent and fees. A possible failure is not accounting for storage fees, in which case contract may run out of TON leading to unexpected failures when sending outgoing messages. You can view the message modes [here](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- format@@0(/v3/guidelines/dapps/asset-processing/payments-processing/#seqno-based-wallets)
- format@@0(/v3/guidelines/dapps/asset-processing/payments-processing/#high-load-wallets)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

It means the code of the contract can be changed. 契約のコードを変更できることを意味します。 [`SETCODE`](/v3/documentation/smart-contrits/func/docs/stdlib#set_code) TVM ディレクティブを使用して、永続的に変更することができます。 または実行時に、実行終了まで、TVM コード レジストリを新しいセル値に設定します。

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

The computational phase executes the code of smart contracts and only then the actions are performed (sending messages, code modification, changing libraries, and others). 計算フェーズでは、スマートコントラクトのコードが実行され、アクションが実行されます (メッセージの送信、コード変更、ライブラリの変更など)。 したがって、Ethereumベースのブロックチェーンとは異なり、送信されたメッセージが失敗すると予想された場合、計算フェーズの終了コードは表示されません。 計算段階ではなく、後に行動段階で行われるようになりました

- format@@0(/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 8. TON contracts are autonomous

ブロックチェーン内の契約は、他のバリデータセットによって処理された別々のシャードに存在することができます。 つまり開発者は他の契約からデータを引き出すことはできません このように、通信は非同期であり、メッセージを送信することによって行われます。 Thus, any communication is asynchronous and done by sending messages.

- format@@0(/v3/documentation/smart-contracts/message-management/sending-messages)
- format@@0(/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

TON スマートコントラクトのプログラミングを始める前に、コード フローの終了コードのロードマップを考えると便利です(ドキュメント化されています)。

### 10. Func functions that have method_id identifiers have method IDs

They can be either set explicitly `"method_id(5)"`, or implicitly by a func compiler. In this case, they can be found among methods declarations in the .fift assembly file. Two of them are predefined: one for receiving messages inside of blockchain `(0)`, commonly named `recv_internal`, and one for receiving messages from outside `(-1)`, `recv_external`.

### 11. TON crypto address may not have any coins or code

Smart contracts addresses in TON blockchain are deterministic and can be precomputed. TONブロックチェーンのスマートコントラクトアドレスは決定的で、事前計算することができます。 Tonアカウント アドレスに関連付けられている場合は、特別なフラグを持つメッセージが送信された場合、ストレージや TON コインを持たない状態で初期化されていない(デプロイされていない場合)または凍結されていることを意味するコードを含まない場合もあります。

### 12. TON addresses may have three representations

TON addresses may have three representations.
A full representation can either be "raw" (`workchain:address`) or "user-friendly". The last one is the one users encounter most often. It contains a tag byte, indicating whether the address is `bounceable` or `not bounceable`, and a workchain id byte. This information should be noted.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

関数の場合、メソッドの可視性を設定するのはあなた次第のSolidityとは異なります。 可視性は、エラーを表示するか、 `もし` 文によって、より複雑な方法で制限されます。

### 14. Keep an eye on gas before sending bounced messages

スマートコントラクトがバウンスされたメッセージにユーザーから提供された値を送信した場合。 対応するガス料金が返された金額から引かれていることを確認してください

### 15. Monitor the callbacks and their failures

TON blockchain is asynchronous. That means the messages do not have to arrive successively. e.g. when a fail notification of an action arrives, it should be handled properly.

### 16. Check if the bounced flag was sent receiving internal messages

対処すべきバウンスメッセージ(エラー通知)を受信することができます。

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## 参照

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />

