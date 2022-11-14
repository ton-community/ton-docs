---
description: At the end of the tutorial, you will have deployed multisig contract in TON Blockchain.
---

# How to make a simple multisig contract

At the end of tutorial you'll have a contract, that will send TON only if it receives approve from all the participants (wallet addresses) from list.

Based on original multisig contract code and updates by akifoq:
- [original TON Blockchain multisig-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc)
- [akifoq/multisig](https://github.com/akifoq/multisig) with fift libraries to work with multisig.

:::tip starter tip
For anyone new with multisig: [What is Multisig Technology? (video)](https://www.youtube.com/watch?v=yeLqe_gg2u0)
:::

## 📖 What you'll learn

- how to install and use TON binaries to interact with smart-contracts
- how to create and customize a simple multisig wallet 
- how to deploy smart-contract using lite-client

## ✍️ What you need to start

- Install `func`, `fift`, and `lite-client` binaries from the [Installation](/develop/smart-contracts/environment/installation) section.


## 🚀 Let's get started!

1. First, we need to compile the code to fift.
2. After, we interact with compiled code with command-line to customize the contract.
3. And finally, we'll interact with contract in TON blockchain!

### Compile the contract

Compile the contract to Fift with:

```cpp
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```

### Create participants keys

#### Create a signer's key

To create a key you need to run:

```cpp
fift -s ./multisig/new-key.fif $KEY_NAME$
```

* Where `KEY_NAME` is the name of the file where the private key will be written.

For example:

```cpp
fift -s ./multisig/new-key.fif super-secret-key
```

We'll receive a file `super-secret-key.txt` with private key inside.

#### Collect public keys

Also, the script will issue a public key in the format:

```
Public key = Pub5XqPLwPgP8rtryoUDg2sadfuGjkT4DLRaVeIr08lb8CB5HW
```

Anything after `"Public key = "` needs to be saved somewhere!

Let's store in file `keys.txt`. One Public Key per line, it's important.

### Deploy your contract

After creating all the keys, you need to collect the public keys into a text file `keys.txt`.

For example:

```bash
PubExXl3MdwPVuffxRXkhKN1avcGYrm6QgJfsqdf4dUc0an7/IA
PubH821csswh8R1uO9rLYyP1laCpYWxhNkx+epOkqwdWXgzY4
```

After that, you need to run:

```cpp
fift -s ./multisig/new-multisig.fif 0 $WALLET_ID$ wallet $KEYS_COUNT$ ./keys.txt
```

* `$WALLET_ID$` is the wallet number if there are many with _the same set of keys_. For example, it's not your first multisig with your business partner. You can just enter 0.
* `$KEYS_COUNT$` - the number of keys needed for confirmation, usually equal to the number of public keys

:::info wallet_id explained
It's possible to create many wallets with the same keys (Alice key, Bob key). What to do if Alice and Bob already have treasure? That's why `$WALLET_ID$` is crucial here.
:::

The script will output something like:

```bash
new wallet address = 0:4bbb2660097db5c72dd5e9086115010f0f8c8501e0b8fef1fe318d9de5d0e501

(Saving address to file wallet.addr)

Non-bounceable address (for init): 0QBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAbel

Bounceable address (for later access): kQBLuyZgCX21xy3V6QhhFQEPD4yFAeC4_vH-MY2d5dDlAepg

(Saved wallet creating query to file wallet-create.boc)
```

:::tip
Bounceable address is better to keep - this is the address of the wallet.
:::

### Activate your contract

You need to send some TON to our newly generated _treasure_. For example 0.5 TON.

After that, you need to run lite-client:

```bash
lite-client -C ./multisig/global-config.json
```

After starting lite-client, it's best to run the `time` command in lite-client console to make sure the connection was successful:

```bash
time
```

Okay, lite-client is works!

After you need to deploy the wallet. run the command:

```
sendfile ./wallet-create.boc
```

After that, the wallet will be ready to work within a minute.


## 🦄 Sign & send some TON using multisig

### Create a request

First you need to create a message request:

```cpp
fift -s ./multisig/create-msg.fif $ADDRESS$ $AMOUNT$ message
```

* `$ADDRESS$` - address where to send coins
* `$AMOUNT$` - number of coins
* `message` here is a name of file for compiled message (`message.boc`).

:::tip
To add comment for your transaction, use `-C comment` attribute. To get more information, run _create-msg.fif_ file without parameters.
:::

### Choose a wallet

Next you need to choose a wallet to send a coins from:

```
fift -s ./multisig/create-order.fif $WALLET_ID$ message -t 7200
```

* `$WALLET_ID$` — is an ID of wallet backed by this multisig contract.
* The `-t` parameter is the time in seconds that everyone will need to sign the message and send it to the network. Usually a couple of hours (7200 seconds)
* `message` here is a name of created `message.boc` on the previous step.

For example:

```
fift -s ./multisig/create-order.fif 0 message -t 7200
```

Ready file will be saved in `order.boc`

:::info
`order.boc` needs to be shared with key holders, they have to sign it.
:::

### Sign your part

To sign, you need to do:

```bash
fift -s ./multisig/add-signature.fif $KEY$ $KEY_INDEX$
```

* `$KEY$` - name of the file containing the private key to sign, without extension.
* `$KEY_INDEX$` - index of the given key in `keys.txt` (zero-based)

For example, for our `super-secret-key.txt` file:

```
fift -s ./multisig/add-signature.fif super-secret-key 0
```

### Create a message

After everyone has signed the order, it needs to be turned into a message for the wallet and signed again with the following command:
```
fift -s ./multisig/create-external-message.fif wallet $KEY$ $KEY_INDEX$
```

For example:
```
fift -s ./multisig/create-external-message.fif wallet super-secret-key 0
```

### Send sign to TON Blockchain

After that, you need to start the light client again:

```bash
lite-client -C ./multisig/global-config.json
```

And after finally, we want to send our sign! Just run:

```bash
sendfile wallet-query.boc
```

If everyone else signed the request, it will be completed!

You did it, ha-ha! 🚀🚀🚀

## What's next?

- [Read more about multisig wallets in TON](https://github.com/akifoq/multisig) from akifoq