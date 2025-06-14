---
description: チュートリアルの最後に、TON Blockchainにマルチシグコントラクトを展開します。
---

import Feedback from '@site/src/components/Feedback';

# シンプルなマルチシグ契約を結ぶ

:::caution 高度なレベル
This information is **very low-level**. It could be hard for newcomers and designed for advanced people who want to understand [fift](/v3/documentation/smart-contracts/fift/overview). The use of fift is not required in everyday tasks.
:::

## 💡 概要

This tutorial helps you learn how to deploy your multisig contract.\
This tutorial helps you learn how to deploy your multisig contract.\
Recall that an (n, k)-multisig contract is a multisignature wallet with n private key holders, which accepts requests to send messages if the request (aka order, query) collects at least k holders' signatures.

Based on the original multisig contract code and updates by akifoq:

- [Original TON Blockchain multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) と fift ライブラリがマルチシグで動作します。

:::tip starter tip
For anyone new to multisig: [What is Multisig Technology? (video)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 あなたが学ぶもの

- シンプルなマルチシグウォレットを作成してカスタマイズする方法
- How to deploy a multisig wallet using lite-client.
- How to sign a request and send it in a message to the blockchain.

## ⚙️ 環境を設定

私たちが旅を始める前に、あなたの環境を確認し、準備してください。

- Install `func`, `fift`, `lite-client` binaries, and `fiftlib` from the [Installation](/v3/documentation/archive/precompiled-binaries) section.
- Clone the [repository](https://github.com/akifoq/multisig) and open its directory in CLI.

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 始めましょう！

1. コードをfiftにコンパイルします。
2. Prepare multisig owners' keys.
3. Deploy your contract.
4. Interact with the deployed multisig wallet in the blockchain.

### Compile the contract

Compile the contract to Fift with:

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### Prepare multisig owners' keys

#### Create participants' keys

To create a key, you need to run:

```cpp
fift -s new-key.fif $KEY_NAME$
```

- Where `KEY_NAME` is the file name where the private key will be written.

例:

```cpp
fift -s new-key.fif multisig_key
```

We'll receive a `multisig_key.pk` file with the private key inside.

#### 公開鍵を収集

また、スクリプトは以下のフォーマットで公開鍵を発行します。

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

`"Public key = "`の後にあるものはどこかに保存する必要があります！

Let's store it in a file called `keys.txt`. It's important to have one public key per line.

### Deploy your contract

#### ライトクライアント経由でデプロイ

After creating all the keys, you need to collect the public keys into a text file, `keys.txt`.

例:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

その後、次を実行する必要があります。

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

- `$WALLET_ID$` - the wallet number assigned for the current key. It is recommended that each new wallet with the same key use a unique `$WALLET_ID$`.
- `$KEYS_COUNT$` - the number of keys needed for confirmation, usually equal to the number of public keys.

:::info wallet_idの説明
It is possible to create many wallets with the same keys (Alice key, Bob key). What should we do if Alice and Bob already have a treasure? That's why `$WALLET_ID$` is crucial here.
:::

スクリプトは次のようなものを出力します。

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Saving address to file wallet.addr)

Non-bounceable address (for init): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Bounceable address (for later access): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Saved wallet creating query to file wallet-create.boc)
```

:::info
If you have a "public key must be 48 characters long" error, please make sure your `keys.txt` has a Unix-type word wrap - LF. For example, word wrap can be changed via the Sublime text editor.
:::

:::tip
A bounceable address is better to keep - this is the wallet's address.
:::

#### Activate your contract

You need to send some TON to our newly generated _treasure_. For example, 0.5 TON. You can send testnet coins via [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

その後、次のようにライトクライアントを実行する必要があります:

```bash
lite-client -C global.config.json
```

:::info Where to get `global.config.json`?
You can get a fresh config file `global.config.json` for [mainnet](https://ton.org/global-config.json) or [testnet](https://ton.org/testnet-global.config.json).
:::

After starting lite-client, it's best to run the `time` command in the lite-client console to make sure the connection was successful:

```bash
time
```

Okay, lite-client works!

After that, you need to deploy the wallet. Run the command:

```
sendfile ./wallet-create.boc
```

その後、ウォレットは1分以内に動作するようになります。

### Interact with a multisig wallet

#### リクエストを作成

First, you need to create a message request:

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

- `$ADDRESS$` - address where to send coins.
- `$AMOUNT$` - number of coins.
- `$MESSAGE$` - the file name for the compiled message.

例:

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
Use the `-C comment` attribute to add a comment for your transaction. To get more information, run the _create-msg.fif_ file without parameters.
:::

#### ウォレットを選択

Next, you need to choose a wallet to send coins from:

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```

場所

- `$WALLET_ID$` — is an ID of the wallet backed by this multisig contract.
- `$AWAIT_TIME$` — Time in seconds that the smart contract will await signs from multisig wallet's owners for the request.
- `$MESSAGE$` — here is the name of the message boc-file created in the previous step.

:::info
The request expires if the time equals `$AWAIT_TIME$` passed before the request signs. As usual, `$AWAIT_TIME$` equals a couple of hours (7200 seconds).
:::

例:

```
fift -s create-order.fif 0 message -t 7200
```

The ready file will be saved in `order.boc`.

:::info
`order.boc` must be shared with key holders; they must sign it.
:::

#### あなたの部品に署名してください

署名するには、以下を行う必要があります。

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

- `$KEY$` - file name containing the private key to sign, without extension.
- `$KEY_INDEX$` - index of the given key in `keys.txt` (zero-based).

例えば、 `multisig_key.pk` ファイルの場合:

```
fift -s add-signature.fif multisig_key 0
```

#### メッセージを作成

誰もが注文に署名した後、ウォレットのメッセージに変更し、次のコマンドで再度署名する必要があります:

```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

In this case, only one sign of the wallet's owner will be enough. The idea is that you can't attack a contract with invalid signatures.

例:

```
fift -s create-external-message.fif wallet multisig_key 0
```

#### Send sign to TON blockchain

その後、ライトクライアントを再起動する必要があります。

```bash
lite-client -C global.config.json
```

And finally, we want to send our sign! Just run:

```bash
sendfile wallet-query.boc
```

他の皆がリクエストに署名した場合、それは完了します!

You did it, ha-ha! 🚀🚀🚀

## See also

- [Read more about multisig wallets in TON](https://github.com/akifoq/multisig) — _[@akifoq](https://t.me/aqifoq)_
- [Multisig wallet v2](https://github.com/ton-blockchain/multisig-contract-v2)

<Feedback />
