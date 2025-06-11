---
description: در پایان آموزش، شما یک قرارداد مولتی‌سیگ را در بلاکچین TON پیاده‌سازی خواهید کرد.
---

import Feedback from '@site/src/components/Feedback';

# یک قرارداد چند امضایی ساده با fift بسازید

:::caution سطح پیشرفته
This information is **very low-level**. It could be hard for newcomers and designed for advanced people who want to understand [fift](/v3/documentation/smart-contracts/fift/overview). The use of fift is not required in everyday tasks.
:::

## 💡 مرور کلی

This tutorial helps you learn how to deploy your multisig contract.\
Recall that an (n, k)-multisig contract is a multisignature wallet with n private key holders, which accepts requests to send messages if the request (aka order, query) collects at least k holders' signatures.

Based on the original multisig contract code and updates by akifoq:

- [Original TON Blockchain multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) همراه با کتابخانه‌های fift برای کار با مولتی‌سیگ.

:::tip راهنمایی شروع
For anyone new to multisig: [What is Multisig Technology? (video)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 آنچه خواهید آموخت

- چگونه یک کیف پول مولتی‌سیگ ساده ایجاد و سفارشی کنید.
- How to deploy a multisig wallet using lite-client.
- How to sign a request and send it in a message to the blockchain.

## ⚙ محیط خود را تنظیم کنید

قبل از اینکه سفر خود را آغاز کنیم، محیط خود را بررسی و آماده کنید.

- Install `func`, `fift`, `lite-client` binaries, and `fiftlib` from the [Installation](/v3/documentation/archive/precompiled-binaries) section.
- Clone the [repository](https://github.com/akifoq/multisig) and open its directory in CLI.

```bash
git clone https://github.com/akifoq/multisig.git
cd ~/multisig
```

## 🚀 بیایید شروع کنیم!

1. کد را به ففت کامپایل کنید.
2. Prepare multisig owners' keys.
3. قرارداد خود را پیاده‌سازی کنید.
4. Interact with the deployed multisig wallet in the blockchain.

### قرارداد را کامپایل کنید

قرارداد را به ففت کامپایل کنید:

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

برای مثال:

```cpp
fift -s new-key.fif multisig_key
```

We'll receive a `multisig_key.pk` file with the private key inside.

#### کلیدهای عمومی را جمع‌آوری کنید

همچنین، اسکریپت یک کلید عمومی در قالب زیر صادر خواهد کرد:

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

هر چیزی پس از `"Public key = "` باید جایی ذخیره شود!

Let's store it in a file called `keys.txt`. It's important to have one public key per line.

### قرارداد خود را پیاده‌سازی کنید

#### از طریق لایت‌کلاینت پیاده‌سازی کنید

After creating all the keys, you need to collect the public keys into a text file, `keys.txt`.

برای مثال:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

بعد از آن، شما نیاز دارید که اجرا کنید:

```cpp
fift -s new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

- `$WALLET_ID$` - the wallet number assigned for the current key. It is recommended that each new wallet with the same key use a unique `$WALLET_ID$`.
- `$KEYS_COUNT$` - the number of keys needed for confirmation, usually equal to the number of public keys.

:::info توضیح wallet_id
It is possible to create many wallets with the same keys (Alice key, Bob key). What should we do if Alice and Bob already have a treasure? That's why `$WALLET_ID$` is crucial here.
:::

اسکریپت چیزی شبیه به این خروجی خواهد داد:

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

#### قرارداد خود را فعال کنید

You need to send some TON to our newly generated _treasure_. For example, 0.5 TON. You can send testnet coins via [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

بعد از آن، شما نیاز دارید که لایت‌کلاینت را اجرا کنید:

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

پس از آن، کیف پول در عرض یک دقیقه آماده به کار خواهد شد.

### Interact with a multisig wallet

#### یک درخواست ایجاد کنید

First, you need to create a message request:

```cpp
fift -s create-msg.fif $ADDRESS$ $AMOUNT$ $MESSAGE$
```

- `$ADDRESS$` - address where to send coins.
- `$AMOUNT$` - number of coins.
- `$MESSAGE$` - the file name for the compiled message.

برای مثال:

```cpp
fift -s create-msg.fif EQApAj3rEnJJSxEjEHVKrH3QZgto_MQMOmk8l72azaXlY1zB 0.1 message
```

:::tip
Use the `-C comment` attribute to add a comment for your transaction. To get more information, run the _create-msg.fif_ file without parameters.
:::

#### یک کیف پول انتخاب کنید

Next, you need to choose a wallet to send coins from:

```
fift -s create-order.fif $WALLET_ID$ $MESSAGE$ -t $AWAIT_TIME$
```

جایی که

- `$WALLET_ID$` — is an ID of the wallet backed by this multisig contract.
- `$AWAIT_TIME$` — Time in seconds that the smart contract will await signs from multisig wallet's owners for the request.
- `$MESSAGE$` — here is the name of the message boc-file created in the previous step.

:::info
The request expires if the time equals `$AWAIT_TIME$` passed before the request signs. As usual, `$AWAIT_TIME$` equals a couple of hours (7200 seconds).
:::

به عنوان مثال:

```
fift -s create-order.fif 0 message -t 7200
```

The ready file will be saved in `order.boc`.

:::info
`order.boc` must be shared with key holders; they must sign it.
:::

#### بخش خود را امضا کنید

برای امضا، شما باید این کارها را انجام دهید:

```bash
fift -s add-signature.fif $KEY$ $KEY_INDEX$
```

- `$KEY$` - file name containing the private key to sign, without extension.
- `$KEY_INDEX$` - index of the given key in `keys.txt` (zero-based).

به عنوان مثال، برای فایل `multisig_key.pk` ما:

```
fift -s add-signature.fif multisig_key 0
```

#### ایجاد پیام

بعد از اینکه همه سفارش را امضا کردند، باید به یک پیام برای کیف پول تبدیل شود و دوباره با فرمان زیر امضا شود:

```
fift -s create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

In this case, only one sign of the wallet's owner will be enough. The idea is that you can't attack a contract with invalid signatures.

برای مثال:

```
fift -s create-external-message.fif wallet multisig_key 0
```

#### Send sign to TON blockchain

بعد از آن، شما نیاز دارید که دوباره کلاینت سبک را راه‌اندازی کنید:

```bash
lite-client -C global.config.json
```

And finally, we want to send our sign! Just run:

```bash
sendfile wallet-query.boc
```

اگر همه دیگران درخواست را امضا کردند، تکمیل خواهد شد!

You did it, ha-ha! 🚀🚀🚀

## See also

- [Read more about multisig wallets in TON](https://github.com/akifoq/multisig) — _[@akifoq](https://t.me/aqifoq)_
- [Multisig wallet v2](https://github.com/ton-blockchain/multisig-contract-v2)

<Feedback />
