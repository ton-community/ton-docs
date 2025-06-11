import Feedback from '@site/src/components/Feedback';

# POWギバー

:::warning 非推奨
この情報は古く、関連性がなくなる可能性があります。スキップすることができます。 You can skip it.
:::

The aim of this text is to describe how to interact with Proof-of-Work Giver smart contracts to obtain Toncoin. We assume familiarity with TON Blockchain Lite Client as explained in `Getting Started`, and with the procedure required to compile the Lite Client and other software. For obtaining the larger amount of Toncoin required for running a validator, we also assume acquaintance with the `Full Node` and `Validator` pages. You will also need a dedicated server powerful enough for running a Full Node in order to obtain the larger amount of Toncoin. Obtaining small amounts of Toncoin does not require a dedicated server and may be done in several minutes on a home computer.

> Note that, at the moment, large resources are required for any mining due to the large number of miners.

## 1. Proof-of-Work ギバー スマートコントラクト

少数の悪意ある者がすべてのToncoinを収集するのを防ぐため、ネットワークのマスターチェーンに特殊な「Proof-of-Work ギバー」スマートコントラクトが導入されています。これらのスマートコンタクトのアドレスは以下の通りです： The addresses of these smart contacts are:

少量型ギバー（数分ごとに10～100 Toncoinを贈与）：

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

多量型ギバー（少なくとも1日1回、1万Toncoinを贈与）：

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> Note that at the current moment all large givers are depleted.

The first ten smart contracts enable a user willing to obtain a small amount of Toncoin to obtain some without spending too much computing power (typically, several minutes of work on a home computer should suffice). The remaining smart contracts are for obtaining larger amounts of Toncoin required for running a validator in the network; typically, a day of work on a dedicated server powerful enough to run a validator should suffice to obtain the necessary amount.

> Note that at the moment, due to a large number of miners, large resources are required for mining small givers.

これらの「Proof-of-Work ギバー」スマートコントラクトのうちの1つを（目的に応じてこれら2つのリストのうちの1つから）ランダムに選択し、マイニングと同様の手順でこのスマートコントラクトからToncoinを入手する必要があります。基本的には、選択した「Proof-of-Work ギバー」スマートコントラクトに、Proof-of-Work と自分のウォレットアドレスを含む外部メッセージを提示する必要があります。 Essentially, you have to present an external message containing the proof of work and the address of your wallet to the chosen "proof-of-work giver" smart contract, and then the necessary amount will be sent to you.

## 2. マイニングプロセス

「Proof-of-Work」を含む外部メッセージを作成するには、GitHubリポジトリにあるTONソースからコンパイルされた特別なマイニングユーティリティを実行する必要があります。このユーティリティはビルドディレクトリの `./crypto/pow-miner` ファイルにあり、ビルドディレクトリで `make pow-miner` とタイプすることでコンパイルできます。 The utility is located in file `./crypto/pow-miner` with respect to the build directory and can be compiled by typing `make pow-miner` in the build directory.

However, before running `pow-miner`, you need to know the actual values of `seed` and `complexity` parameters of the chosen "proof-of-work giver" smart contract. This can be done by invoking the get-method `get_pow_params` of this smart contract. For instance, if you the use giver smart contract, `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN` you can simply type:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

in the Lite Client console and obtain an output like:

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

"result: "行の最初の2つの大きな数字は、このスマートコントラクトの`seed`と`complexity`です。この例では、シードは `229760179690128740373110445116482216837` で、複雑度は `53919893334301279589334030174039261347274288845081144962207220498432` となります。 In this example, the seed is `229760179690128740373110445116482216837`, and the complexity is `53919893334301279589334030174039261347274288845081144962207220498432`.

次に、以下のように`pow-miner`ユーティリティを起動します：

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

こちら

- `<num-threads>`はマイニングに使用したいCPUコア数です。
- `<timeout-in-sec>`は、マイナーが失敗を認める前に実行する最大秒数です。
- `<your-wallet-address>`はあなたのウォレットアドレスです（まだ初期化されていない可能性があります）。マスターチェーンかワークチェーンのどちらかにあります（バリデータをコントロールするにはマスターチェーンのウォレットが必要なことに注意してください）。
- `<seed>`と`<complexity>`は、get-method `get-pow-params` を実行して得られた最新の値です。
- `<pow-giver-address>` は、選択されたProof-of-Work ギバーのスマートコントラクトのアドレスです。
- `<boc-filename>` は出力ファイルのファイル名で、成功した場合、外部メッセージとProof-of-Work が保存されます。

例えば、あなたのウォレットアドレスが`kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`の場合、次のように実行します：

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

プログラムはある程度の時間（この場合、最大でも100秒）実行され、正常に終了して（終了コードがゼロ）、必要なProof-of-Workをファイル`mined.boc`に保存するか、Proof-of-Workが見つからなかった場合はゼロ以外の終了コードで終了します。

失敗した場合は、次のように表示されます：

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

and the program will terminate with a non-zero exit code. そして、プログラムは0以外の終了コードで終了します。その後、`seed`と`complexity`を再度取得し（より多くの成功したマイナーからのリクエストを処理した結果、その間に変更された可能性があるため）、新しいパラメータで`pow-miner`を再実行し、成功するまでこのプロセスを何度も繰り返す必要があります。

失敗した場合は、次のように表示されます：

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

次に、Lite Clientを使って、ファイル`mined.boc`からProof-of-Workを与えるスマートコントラクトに外部メッセージを送信することができます（これはできるだけ早く行う必要がある）：

```
> sendfile mined.boc
... external message status is 1
```

数秒間待ってウォレットの状態を確認できます。：

:::info
Please note here and further that the code, comments, and/or documentation may contain parameters, methods, and definitions such as “gram”, “nanogram”, etc. That is a legacy of the original TON code, developed by the Telegram. Gram cryptocurrency was never issued. コード、コメント、およびドキュメントには、パラメータ、メソッド、および「gram」、「nanogram」などの定義が含まれている場合があります。 それはTelegramによって開発されたオリジナルのTONコードの遺産です。グラム暗号通貨は発行されませんでした。 TONの通貨はToncoinで、TON testnetの通貨はTest Toncoinです。
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

この `seed` と `complexity` を持つ有効なProof-of-Workをあなたより前に誰も送っていない場合、Proof-of-WorkのギバーはあなたのProof-of-Work受け入れ、あなたのウォレットの残高に反映されます(外部メッセージを送信してから10秒か20秒経過すると、この現象が起こる可能性があります。ライトクライアントの状態をリフレッシュするためにウォレットの残高を確認する前に、必ず何度か試行し、その都度 `last` と入力してください)。成功した場合、残高が増加していることが確認できます（ウォレットが存在しなかった場合は、未初期化状態で作成されたことも確認できます）。失敗した場合は、新しい `seed` と `complexity` を取得して、採掘プロセスを最初からやり直す必要があります。 In the case of success, you will see that the balance has been increased (and even that your wallet has been created in an uninitialized state if it did not exist before). In the case of failure, you will have to obtain the new `seed` and `complexity` and repeat the mining process from the very beginning.

もしあなたが運良くウォレットの残高が増えていたら、ウォレットを初期化することをお勧めします（ウォレット作成に関するより詳しい情報は`Step-by-Step`にあります）：

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

これであなたも 100 Toncoinの幸せな所有者です。おめでとうございます！ Congratulations!

## 3. 失敗した場合のマイニングプロセスの自動化

Toncoinを長期間入手できない場合、同じproof-of-Workのギバーのスマートコントラクトから同時にマイニングしている他のユーザーが多すぎることに起因している可能性があります。上記のリストの中から、別のProof-of-Work提供スマートコントラクトを選択すべきかもしれません。あるいは、成功するまで（`pow-miner`の終了コードをチェックすることで検出される）、正しいパラメータで`pow-miner`を自動的に何度も実行し、`-c 'sendfile mined.boc'`パラメータでLite Clientを呼び出して、外部メッセージが見つかった直後に送信する簡単なスクリプトを書くこともできます。 Maybe you should choose another proof-of-work giver smart contract from one of the lists given above. Alternatively, you can write a simple script to automatically run `pow-miner` with the correct parameters again and again until success (detected by checking the exit code of `pow-miner`) and invoke the Lite Client with the parameter `-c 'sendfile mined.boc'` to send the external message immediately after it is found.

<Feedback />

