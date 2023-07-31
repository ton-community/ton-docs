---
description: In this tutorial, you will learn how to fully work with wallets, transactions and smart contracts.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working With Wallet Smart Contracts

## 👋 Introduction

Learning how wallets and transactions work on TON before beginning smart contracts development is essential. This knowledge will help developers understand the interaction between wallets, transactions, and smart contracts to implement specific development tasks.

In this section we’ll learn to create operations without using pre-configured functions to understand development workflows. All references necessary for the analysis of this tutorial are located in the references chapter.

## 💡 Prerequisites

This tutorial requires basic knowledge of Javascript, Typescript, and Golang. It is also necessary to hold at least 3 TON tokens (which can be stored in a stock account, a non-custodial wallet, or by using the telegram bot wallet). It is necessary to have a basic understanding of [cell](/learn/overviews/cells), [addresses in TON](/learn/overviews/addresses), [blockchain of blockchains](/learn/overviews/ton-blockchain) to understand this tutorial.

:::info MAINNET DEVELOPMENT IS ESSENTIAL   
Working with the TON Testnet often leads to deployment errors, difficulty tracking transactions, and unstable network functionality. Therefore, it could be beneficial to complete most development on the TON Mainnet to potentially avoid these issues, which might be necessary to reduce the number of transactions and thereby possibly minimize fees.
:::

## ✍️ What You Need To Get Started

- Ensure NodeJS is installed.
- Specific Ton libraries are required and include: @ton/ton 13.4.1+, @ton/core 0.48.0+ and @ton/crypto 3.2.0+.

**OPTIONAL**: If you prefer to use GO instead JS, it is  necessary to install the [tonutils-go](https://github.com/xssnick/tonutils-go) library and the GoLand IDE to conduct development on TON. This library will be used in this tutorial for the GO version.


<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save ton ton-core ton-crypto
```

</TabItem>
<TabItem value="go" label="Golang">

```bash
go get github.com/xssnick/tonutils-go
go get github.com/xssnick/tonutils-go/adnl
go get github.com/xssnick/tonutils-go/address
```

</TabItem>
</Tabs>

## ⚙ Set Your Environment

In order to create a TypeScript project its necessary to conduct the following steps in order:
1. Create an empty folder (which we’ll name WalletsTutorial).
2. Open the project folder using the CLI.
3. Use the followings commands to set up your project:
```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```
:::info
To help us carry out the next process a `ts-node` is used to execute TypeScript code directly without precompiling. `nodemon` is used to restart the node application automatically when file changes in the directory are detected.
:::
4. Next, remove these lines from `tsconfig.json`:
```json
  "files": [
    "\\",
    "\\"
  ]
```
5. Then, create a `nodemon.json` config in your project root with the following content:
```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```
6. Add this script to `package.json` instead of "test", which is added when the project is created:
```json
"start:dev": "npx nodemon"
```
7. Create `src` folder in the project root and `index.ts` file in this folder.
8. Next, the following code should be added:
```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```
9. Run the code using terminal:
```bash
npm run start:dev
```
10. Finally, the console output will appear.

:::tip Blueprint
The TON Community has created an excellent tool for automating all processes (deploy, contract writing, tests) called [Blueprint](https://github.com/ton-community/blueprint). You can get a ready project with a single command from this library, however, we will not be needing such a powerful tool, so I suggest sticking to the instructions above.
:::

**OPTIONAL: ** For Golang, use the following instructions:

1. Install GoLand IDE.
2. Create project folder and `go.mod` file with the following content (you may change the **version of Go** if you have a different one):
```
module main

go 1.20
```
3. Type this command to terminal:
```bash
go get github.com/xssnick/tonutils-go
```
4. Create `main.go` file in the root of your project with following content:
```go
package main

import (
	"log"
)

func main() {
	log.Println("Hello, TON!")
}

```
5. Change the name of a module in `go.mod` to main.
6. Run and see the output in the terminal.

:::info
You can also use any other IDE since GoLand is not free, but it is the most convenient choice.
:::

:::warning IMPORTANT
All code parts should be added to the `main` function we created in the [⚙ Set your environment](/develop/smart-contracts/tutorials/wallet#-set-your-environment) section.

Also, only the imports required for a specific code section will be specified in each new section. You will need to add new imports to old ones.

All code examples used in this tutorial can be found in [my GitHub repository](https://github.com/aSpite/wallet-tutorial).
:::

## 🚀 Let's get started!

First of all, you will learn which wallets (v3 and v4) are used in TON and get acquainted with the work of their smart contracts. Then you will get to know the types of transactions on TON, and after that, we will start creating transactions, sending them to the blockchain, deploying our wallet, and in the end, working with high-load wallets.

Our main task is to build transactions using various objects and functions from ton-core, ton, and ton-crypto (ExternalMessage, InternalMessage, Signing, and etc.) to understand what transactions look like on a bigger scale. We will consider only two versions of wallets: `v3` and `v4`. Exchanges, majority of users, and non-custodial wallets are using these two versions.

:::note 
There may be occasions in this tutorial when there is no explanation for any particular detail. In this case, you will be provided with an explanation on the later stages of this tutorial.

**IMPORTANT:** We will use [Wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) to understand the working process. The reasons for this are described in the next chapter. Version v3 has two sub-versions: r1 and r2. At the moment, only the second one is being used, so when we say v3 it means v3r2.
:::

## 💎 Wallets in terms of TON blockchain

Wallets in TON blockchain are actually smart contracts. So everything in TON is a smart contract. And as we know, we can deploy smart contracts into the network ourselves and change them any way we want. Thanks to this unique feature, we can **customize our wallets**.

It is wallet smart contracts that help us communicate with other smart contracts. But in this case, the question arises: 

### How to communicate with the wallet?

Here we are assisted by so-called external transactions. Generally, there are two types of transactions in TON blockchain: `internal` and `external`. External transactions allow us to send messages to blockchain from the outer world, thus communicating with smart contracts that accept such transactions. The function responsible for this logic is as follows:

```func
() recv_external(slice in_msg) impure {
    ;; some code
}
```

Before we go into more details about wallets, let’s look at how the wallet accepts an external transaction. First of all, each wallet holds the owner’s `public key`, `seqno` and `subwallet_id`. When receiving an external transaction, the wallet uses `get_data()` to retrieve data from its storage. It then conducts several checks and decides whether or not to accept the transaction:

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
  throw_if(35, valid_until <= now()); ;; check the relevance of the transaction
  var ds = get_data().begin_parse(); ;; get data from storage and convert it into a slice to be able to read values
  var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256)); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds variable
  throw_unless(33, msg_seqno == stored_seqno);
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  accept_message();
```

> 💡 Useful links:
>
> ["load_bits()" in docs](/develop/func/stdlib/#load_bits)
>
> ["get_data()" in docs](/develop/func/stdlib/#load_bits)
>
> ["begin_parse()" in docs](/develop/func/stdlib/#load_bits)
>
> ["end_parse()" in docs](/develop/func/stdlib/#end_parse)
>
> ["load_int()" in docs](/develop/func/stdlib/#load_int)
>
> ["load_uint()" in docs](/develop/func/stdlib/#load_int)
>
> ["check_signature()" in docs](/develop/func/stdlib/#check_signature)
>
> ["slice_hash()" in docs](/develop/func/stdlib/#slice_hash)
>
> ["accept_message()" in docs](/develop/smart-contracts/guidelines/accept)

Now let’s take a closer look.

### Replay protection - Seqno

It is very important not to repeat the transaction that has already been sent when working with wallets because, in this case, it can lead to some undesirable results. And if we take a look at the code of wallet smart contracts, we see the `seqno` (Sequence Number) there:

```func
throw_unless(33, msg_seqno == stored_seqno);
```

This line of code above checks the seqno, which comes in the transaction and checks it with seqno, which is stored in a smart contract. The contract returns an error with `33 exit code` if they do not match. So if the sender passed invalid seqno, it means that he made some mistake in the transaction sequence, and the contract protects against such cases.

### Signature

As mentioned earlier, wallet smart contracts accept external transactions. However, they come from the outer world, and **we should not trust this data**, so each wallet keeps the owner's public key in its storage. The smart contract verifies the signature with the public key when receiving an external transaction that the owner signed with the private key. It verifies that the transaction is actually from the owner. 

To do that, it first gets the signature from the incoming message, then loads the public key from storage and validates the signature:

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

And if all checks are passed, the smart contract accepts the message and processes it:

```func
accept_message();
```

:::info accept_message()
Since the transaction comes from the outer world, it can not contain TON to pay the fees. So in the TON, there is `gas_credit` (at the time of writing tutorial, its value is 10,000 gas units), which allows you to carry out the necessary calculations for free within the gas that does not exceed `gas_credit`. After `accept_message()` function, all the spent gas is taken from the balance of the smart contract. You can read more about it in [docs](/develop/smart-contracts/guidelines/accept).
:::

### Transaction expiration

Another step in checking external transactions is `valid_until` field. As you can see from the variable name, this is the time in UNIX before the transaction is valid. If this check fails, the contract completes the processing of the transaction with `32 exit code`.

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

This is only a protection against various errors when the transaction is no longer valid but for some reason, was still sent to the blockchain.

### Differences between Wallet v3 and Wallet v4

The only difference between these versions is that Wallet v4 has `plugins` that can be installed and deleted. These are special smart contracts, which have the right to ask once at a particular time a certain number of TON from a wallet smart contract. 

Wallet smart contract, in turn, will send the required amount of TON in response without the need for the owner to participate. This is similar to the **subscription model** for which plugins are created. We will be going into these details in this tutorial, as this is not our main task, and wallets are identical in all other cases.

### So how do wallets help us to communicate with other smart contracts?

As we already know, a wallet smart contract accepts external transactions, validates them and accepts them if all checks are passed. The contract then starts the loop of retrieving messages from the body of external messages, creates internal messages and sends them to the blockchain:

```func
cs~touch();
while (cs.slice_refs()) {
    var mode = cs~load_uint(8); ;; load transaction mode
    send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip touch()
All smart contracts run on TVM (Ton Virtual Machine), which is a stack machine. ~ touch() places the variable cs on top of the stack, thus optimizing the running of the code for less gas.
:::

Since a **maximum of 4 refs** can be stored in one cell, we can send four transactions per external transaction.

> 💡 Useful links:
>
> ["slice_refs()" in docs](/develop/func/stdlib/#slice_refs)
>
> ["send_raw_message() and transaction modes" in docs](/develop/func/stdlib/#send_raw_message)
>
> ["load_ref()" in docs](/develop/func/stdlib/#load_ref)

## 📬 External and Internal transactions

In this section, you will learn more about `internal` and `external` transactions, and we will create transactions and send them to the network, trying to minimize the use of  pre-cooked functions. 

We will use a ready-made wallet to make the task easier and help to concentrate on the study. To do this, you can use Tonkeeper, deposit 1 TON to this wallet, and send the transaction to any address (you can even use the same wallet address). This way, the wallet app (Tonkeeper) will deploy the wallet, and we can send the necessary transactions to the network.

:::note
At the time of writing the tutorial all wallets by default use Wallet v4. We will not use plugins, so we need the functionality provided by Wallet v3. Tonkeeper allows you to choose the version of the wallet, so I recommend to deploy v3 by sending transaction from this wallet to any address.
:::

### TL-B

As you may already know, everything in TON Blockchain is a `cell`. And to properly serialize and deserialize the data we need standards. To do this, `TL-B` was invented, with which you could learn about what, how and in what sequence should be stored inside cells. 

In this section, we will look at [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). This file will be very useful during future development, as it will describe how different cells should be assembled. In our case, we will refer to details related to internal and external transactions.

:::info
At this stage you do not need to understand TL-B, as the information described will be clear even without it. However, information on TL-B, in any case, will not be excessive, as you can return to this tutorial in the future.

You can read about it in the [documentation](/learn/overviews/tl-b-language) or read a [very useful article](https://github.com/xssnick/ton-deep-doc/blob/master/TL-B.md) from [@xssnik](https://t.me/xssnik).
:::

### CommonMsgInfo

Each message must first store `CommonMsgInfo` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123-L130)) or `CommonMsgInfoRelaxed` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L132-L137)). This allows to define some technical details that relate to the transaction: *type*, *time*, *recipient* *address*, *technical flags*, *fees*. 

From `block.tlb` we can conclude that we have three types of transactions: `int_msg_info$0`, `ext_in_msg_info$10`, `ext_out_msg_info$11`. We already know that these are internal and external transactions. We will not go into details of ext_out_msg_info. It is just an external transaction that a smart contract can send, and the only use for that is **logs**. Such transactions you can see, for example, on the [Elector](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF) contract.

[Looking at TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128), you will notice that **only CommonMsgInfo is available for ext_in_msg_info**. This is because fields such as `src`, `created_lt`, `created_at`, and some others are rewritten by validators during transaction handling. In this case, we are interested in `src` because when the transaction is sent, the sender is unknown, and it will be written by validators when checking. This ensures that the address in the src field is correct and cannot be faked.

However, CommonMsgInfo only supports `MsgAddress`, but we do not know the sender’s address and want to write `addr_none` (two zero bits). In this case, we use CommonMsgInfoRelaxed, which **supports addr_none**, to describe such a structure. And for ext_in_msg_info (incoming external message), we use CommonMsgInfo only because such a message cannot have a sender and will always be [MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) (that is, addr_none$00, meaning two zero bits), so there is no need to overwrite the data.

:::note
The numbers after $ are the bits that you need to store at the beginning of the cell in order to identify the type of message. We will consider this later.
:::

### Internal transaction creation

First, consider internal transactions, as they are used to send messages between contracts. If you look at many contracts ([NFT](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-item.fc#L51-L56), [Jetons](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L139-L144)) that send messages or tutorials where the writing of contracts is considered, you can see that many use the following lines:

```func
var msg = begin_cell()
  .store_uint(0x18, 6) ;; or 0x10 for non-bounce
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
  ;; store something as a body
```

Let’s start with `0x18` and `0x10` (x - hexadecimal). This is a hexadecimal number that looks like this (given that we allocate 6 bits): `011000` and `010000`. This means that the code shown above can be overwritten so:

```func
var msg = begin_cell()
  .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0  
  .store_uint(1, 1) ;; IHR Disabled
  .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
  .store_uint(0, 1) ;; bounced
  .store_uint(0, 2) ;; src -> two zero bits for addr_none
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
  ;; store something as a body
```
Now let’s go through each option in detail:

Option | Explanation
:---: | :---:
IHR Disabled | Currently, this option is always disabled (which means we store 1), as Instant Hypercube Routing is not fully implemented. In addition, we will need it when there is a lot of [Shardchains](/learn/overviews/ton-blockchain#many-accountchains-shards). You can read more about it in [tblkch.pdf](https://ton.org/tblkch.pdf) (chapter 2).
Bounce | While sending transactions, a variety of errors can occur during processing by a smart contract. To avoid losing TON, you can set the Bounce option to 1 (true). In this case, if any errors occur during the transaction processing by the contract, this transaction will be returned to us, and we will receive the same amount sent minus fees. You can read more about it in [docs](/develop/smart-contracts/guidelines/non-bouncable-messages).
Bounced | As you may have already realized, there may be transactions on the network that returned to the sender because an error occurred while processing this transaction with a smart contract. It is called a bounced transaction. This bit tells you whether the transaction received is bounced or not.
Src | The sender address. In this case, we write two zero bits to indicate addr_none.

The following two lines are clear: we specify the recipient and the number of TON to be sent. 

Finally, let’s look at the last line:

```func
  var msg = begin_cell()
  .store_uint(0x18, 6) ;; 011000
  .store_slice(to_address)
  .store_coins(amount)
  .store_uint(0, 1) ;; Extra currency
  .store_uint(0, 4) ;; IHR fee
  .store_uint(0, 4) ;; Forwarding fee
  .store_uint(0, 64) ;; Logical time of creation
  .store_uint(0, 32) ;; UNIX time of creation
  .store_uint(0, 1) ;; State Init
  .store_uint(0, 1) ;; Message body
  ;; store something as a body
```
Option | Explanation
:---: | :---:
Extra currency | This is a native implementation of existing tokens. Not currently in use.
IHR fee | As mentioned, the IHR is not currently in use, so it is always zero. However, you can read about it in [tblkch.pdf](https://ton.org/tblkch.pdf) (3.1.8).
Forwarding fee | Fee for forwarding message. You can read about it in [tblkch.pdf](https://ton.org/tblkch.pdf) (3.1.8).
Logical time of creation | The time used to create the correct transaction queue. 
UNIX tome of creation | The time the transaction was created in UNIX.
State Init | Code and source data for deploying a smart contract. Next, in the tutorial, this will be considered. If the bit is set to `0`, it means that we do not have a State Init. But if it is set to `1`, then there you need to write another bit, which will indicate whether the State Init is stored in **the same cell** (0) or written **as a reference** (1).
Message body | This bit is responsible for how we store the message body. Sometimes the message body can be large and not fit into the message itself, so it should be stored as a **reference** and set the bit to `1` to show that you should expect the body as a reference. If the bit is `0`, the body is in the same cell as the message.

All these values (including src), **excluding the State Init and Message Body bits**, are rewritten by validators.

:::note
If the number fits in fewer bits than we specified, then the missing zeros are added to the left. For example, 0x18 fits in 5 bits -> `11000`. But since we specified 6 bits, it will become `011000`.
:::

We can now start preparing our transaction, which will be sent to our wallet v3. First, let’s say user wants to send 0.5 TON to themeself with the text "**Hello, TON!**" ([How to send message with a comment](/develop/func/cookbook#how-to-send-a-simple-message)).

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "ton";

let internalMessageBody = beginCell().
  storeUint(0, 32). // write 32 zero bits to indicate that a text comment will follow
  storeStringTail("Hello, TON!"). // write our text comment
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32). // write 32 zero bits to indicate that a text comment will follow
  MustStoreStringSnake("Hello, TON!"). // write our text comment
  EndCell()
```

</TabItem>
</Tabs>

We have created an `InternalMessageBody` in which we store the body of our message. Note that when storing text, that does not fit into a single Cell (1023 bits), you will **need to split it into several cells** according to [the following documentation](/develop/smart-contracts/guidelines/internal-messages). But in our case the function from the library makes this for us, so at this stage there is no need to worry about it.

Then create `InternalMessage` according to the information we have studied earlier:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from "ton";

const walletAddress = Address.parse('put your wallet address');

let internalMessage = beginCell().
  storeUint(0, 1). // indicate that it is an internal message -> int_msg_info$0
  storeBit(1). // IHR Disabled
  storeBit(1). // bounce
  storeBit(0). // bounced
  storeUint(0, 2). // src -> addr_none
  storeAddress(walletAddress).
  storeCoins(toNano("0.2")). // amount
  storeBit(0). // Extra currency
  storeCoins(0). // IHR Fee
  storeCoins(0). // Forwarding Fee
  storeUint(0, 64). // Logical time of creation
  storeUint(0, 32). // UNIX time of creation
  storeBit(0). // No State Init
  storeBit(1). // We store Message Body as a reference
  storeRef(internalMessageBody). // Store Message Body as a reference
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

walletAddress := address.MustParseAddr("put your address")

internalMessage := cell.BeginCell().
  MustStoreUInt(0, 1). // indicate that it is an internal message -> int_msg_info$0
  MustStoreBoolBit(true). // IHR Disabled
  MustStoreBoolBit(true). // bounce
  MustStoreBoolBit(false). // bounced
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress).
  MustStoreCoins(tlb.MustFromTON("0.2").NanoTON().Uint64()).   // amount
  MustStoreBoolBit(false). // Extra currency
  MustStoreCoins(0). // IHR Fee
  MustStoreCoins(0). // Forwarding Fee
  MustStoreUInt(0, 64). // Logical time of creation
  MustStoreUInt(0, 32). // UNIX time of creation
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

### Message creation for wallet

We need to get `seqno` of our wallet smart contract. To do this, create `Client`, using which we will send a request to run the Get method "seqno" of our wallet. We will also add mnemonic, which we can get from the **Tonkeeper** settings to sign our transaction in the next steps:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse('put your wallet address');
const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(Address.parse(walletAddress), "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection) // create client

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

// The next three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. With the tonutils-go library, this is all implemented, but we’re doing it again to get a full understanding.
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

Thus, we have the following objects that we want to send: `seqno`, `keys`, `internal message`. Now we need to create a message for our wallet and store the data in this message in the sequence which was at the beginning of the tutorial: 

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from 'ton-crypto';

let toSign = beginCell().
  storeUint(698983191, 32). // subwallet_id | We consider this further
  storeUint(Math.floor(Date.now() / 1e3) + 60, 32). // Transaction expiration time, +60 = 1 minute
  storeUint(seqno, 32). // store seqno
  storeUint(3, 8). // store mode of our internal transaction
  storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell().
  storeBuffer(signature). // store signature
  storeBuilder(toSign). // store our message
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Transaction expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal transaction
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

Note that here no `.endCell()` was used after `toSign`. The fact is that in this case **we can transfer toSign content directly to the body**. If we wanted to write a cell, we would have to store it as a reference.

:::tip Wallet V4
Wallet V4 code, after all the checks that we reviewed in the first part of the tutorial, additionally [extracts the opcode to determine whether it is a simple   translation or transaction associated with the plugin](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100). To match this version, we need to add `storeUint(0, 8).` (JS/TS), `MustStoreUInt(0, 8).` (Golang) after writing seqno and before specifying the mod of the transaction.
:::

### External transaction creation

To deliver any internal message to a blockchain from the outer world, we need to send it inside an external transaction. As we have previously considered, we are only interested in `ext_in_msg_info$10`, as the goal is to send an external message to our contract. Let's create an external message that will be sent to our wallet:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell().
  storeUint(0b10, 2). // 0b10 -> 10 in binary
  storeUint(0, 2). // src -> addr_none
  storeAddress(walletAddress). // Destination address
  storeCoins(0). // Import Fee
  storeBit(0). // No State Init
  storeBit(1). // We store Message Body as a reference
  storeRef(body). // Store Message Body as a reference
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // 0b10 -> 10 in binary
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

Option | Explanation
:---: | :---:
Src | The sender address. Since an incoming external message cannot have a sender, there will always be 2 zero bits, that is addr_none. ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100))
Import Fee | Fee to import incoming external message.
State Init | Unlike the Internal Message, the State Init in the external message is needed **to deploy a contract from the outer world**. The State Init in the Internal Message allows one contract to deploy another.
Message Body | The message that we want to pass to the contract for processing.

:::tip 0b10
0b10 (b - binary) means a binary record. We store two bits: `1` and `0`. Thus we specify that it is `ext_in_msg_info$10`.
:::

Now we have a completed message that is ready to be sent to our contract. To do this, it should first be serialized to `BOC` (Bag of Cells), then be sent:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"))

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tl"
)

log.Println(base64.StdEncoding.EncodeToString(externalMessage.ToBOCWithFlags(false)))

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

> 💡 Useful link:
>
> [More about Bag of Cells](https://github.com/xssnick/ton-deep-doc/blob/master/Cells-BoC.md) from [@xssnik](https://t.me/xssnik)

We also output our BOC to the console. By copying the base64 encoded string, we can [manually send our transaction and get the hash using toncenter](https://toncenter.com/api/v2/#/send/send_boc_return_hash_sendBocReturnHash_post).

## 👛 Deploying our wallet

At this stage, you already know how to interact with wallet smart contracts without using pre-prepared methods for this. In the past, we have facilitated our work by giving away the piece by deploying to Tonkeeper, but now we need **to deploy our wallet manually**.

We will create our wallet from scratch. You will learn how to compile the code of a wallet smart contract, generate a mnemonic, receive a wallet address and deploy it using external transactions and State Init. We will use wallet v3 for convenience.

### Generating mnemonic

The first thing to start with is to get a `private` and `public` key. We generate a mnemonic phrase and then extract private and public keys using cryptographic libraries:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from "ton-crypto";

const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray) // if we want, we can print our mnemonic
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"log"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"golang.org/x/crypto/pbkdf2"
	"strings"
)

mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished object of the wallet with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " "))) 
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len 

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

The private key will be needed further to sign transactions, and the public key - to store in the storage of our contract.

:::danger IMPORTANT
You should output the generated mnemonic to the console, **save** and use it, as in the previous section, in order to deal with the same key pair every time you run the code.
:::

### What is Subwallet ID?

One of the most notable benefits of wallets being smart contracts is the ability to create **a vast number of wallets** using just one private key. This is because the address of any smart contract in TON Blockchain is computed from several factors, one of which is `stateInit`. The stateInit contains the `code` and `initial data`, which should be stored in the smart contract storage. 

And by changing just one bit in stateInit, you can get a different address. That is why `subwallet_id` was invented, which is constantly stored in the contract storage. You can get many different wallets with one private key by changing it. For instance, it can be very useful when accepting a different wallet in different centralized services. 

The default subwallet_id value is `698983191` according to the [next line](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420) from the source code of TON Blockchain:

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

We can get information about genesis block (zero_state) from [config file](https://ton.org/global-config.json). Understanding this part is unnecessary and is written for those may be interested in details. Just remember that the default value of `subwallet_id` is `698983191`.

Each wallet contract checks this field for external transactions to avoid the cases when the request was to be sent to another wallet:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

We will need to add this value to the starting date of the contract, so save it in the variable:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint32 = 698983191 // we use 32 bit for subwallet_id
```

</TabItem>
</Tabs>

### Compiling our wallet code

Now that we have the private and public keys, subwallet_id, we need to get our wallet code. To do this, we will use the [wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) from the official repository. 

We will use the [@ton-community/func-js](https://github.com/ton-community/func-js) library to compile the code. With it, we can compile our FunC code and get a cell containing the code. First, let's install library and save (--save) it to `package.json`:

```bash
npm i --save @ton-community/func-js
```

We will only use JavaScript to compile code, as the libraries for compiling code are developed here. However, after compiling, we only need to   keep the **base64 output** of our cell and it is possible to use it in other languages (like Go) as well.

First, we need to create two files: `wallet_v3.fc` and `stdlib.fc`. The compiler works with  stdlib.fc library. All necessary and basic functions, which are corresponding with `asm` instructions were created here. We can download stdlib.fc from [here](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc). In `wallet_v3.fc`, it is necessary to copy the code mentioned above. Now we have the following structure of our project:

```
.
├── src/
│   ├── main.ts
│   ├── wallet_v3.fc
│   └── stdlib.fc
├── nodemon.json
├── package-lock.json
├── package.json
└── tsconfig.json
```

:::info
Do not worry if your IDE plugin conflicts with `() set_seed(int) impure asm "SETRAND";` in `stdlib.fc`.
:::

Remember to add the following line to the beginning of wallet_v3.fc to indicate that the functions from stdlib will be used below: 

```func
#include "stdlib.fc";
```

Now let’s write code to compile our smart contract and run it using `npm run start:dev`:

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'; // we use fs for reading content of files
import { Cell } from "ton-core";

const result = await compileFunc({
targets: ['wallet_v3.fc'], // targets of your project
sources: {
    "stdlib.fc": fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
    "wallet_v3.fc": fs.readFileSync('./src/wallet_v3.fc', { encoding: 'utf-8' }),
}
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string. We will need it further
```

You should get the following output to the terminal:

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

And now we can, using base64 encoded output, get the same cell with our wallet code in other libraries in other languages:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there are any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>



You should get the following output to the terminal:

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

So we have confirmed that we have the right code in our cell because the hashes match.

### Creating State Init for deploy

Before building a transaction, we will understand what is a State Init. First lets go through the [TL-B scheme](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143):

Option | Explanation
:---: | :---:
split_depth | This option is intended for highly loaded smart contracts that can be split and located on several [shardchains](/learn/overviews/ton-blockchain#many-accountchains-shards). Information about this can be found in [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6). We will store bit `0` since we have just a wallet smart contract.
special | Used for TicTok. Such smart contracts are automatically called every block. Not needed for ordinary contracts. Information about this can be found in [tblkch.pdf](https://ton.org/tblkch.pdf) (4.1.6). We will store bit `0` because we do not need such a function.
code | The presence of bit `1` means the presence of the smart contract code as a reference.
data | The presence of bit `1` means the presence of the smart contract data as a reference.
library | A library that is resided on the [masterchain](/learn/overviews/ton-blockchain#masterchain-blockchain-of-blockchains) and can be used by different smart contracts. We will not use this, so we will set bit to `0`. Information about this can be found in [tblkch.pdf](https://ton.org/tblkch.pdf) (1.8.4).

Now we need to prepare the `initial data`, which will be in the storage of our contract immediately after the deployment:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "ton-core";

const dataCell = beginCell().
  storeUint(0, 32). // Seqno
  storeUint(698983191, 32). // Subwallet ID
  storeBuffer(keyPair.publicKey). // Public Key
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32). // Seqno
  MustStoreUInt(698983191, 32). // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()
```

</TabItem>
</Tabs>

At this stage, we have both the contract `code` and its `initial data`. With this data, we can finally get our **wallet address**. As previously considered, the address of the wallet depends on the State Init, which includes the code and initial data.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "ton-core";

const stateInit = beginCell().
  storeBit(0). // No split_depth
  storeBit(0). // No special
  storeBit(1). // We have code
  storeRef(codeCell).
  storeBit(1). // We have data
  storeRef(dataCell).
  storeBit(0). // No library
  endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
)

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true). // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String()) // Output contract address to console
```

</TabItem>
</Tabs>

With State Init, we can now build the transaction and send it to the blockchain. But keep in mind that we need to have **at least 0.1 TON** on balance (it can be less, but this amount is guaranteed to be enough). To do this, you need to run the entire code earlier, get the wallet address and send 0.1 TON to your wallet.

Let’s start with building the transaction we built *in the previous section*:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "ton-crypto";
import { toNano } from "ton-core";

const internalMessageBody = beginCell().
  storeUint(0, 32).
  storeStringTail("Hello, TON!").
  endCell();

const internalMessage = beginCell().
  storeUint(0x10, 6). // no bounce
  storeAddress(Address.parse("put your first wallet address from were you sent 0.1 TON")).
  storeCoins(toNano("0.03")).
  storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  storeRef(internalMessageBody).
  endCell();

// transaction for our wallet
const toSign = beginCell().
  storeUint(subWallet, 32).
  storeUint(Math.floor(Date.now() / 1e3) + 60, 32).
  storeUint(0, 32). // We put seqno = 0, because after deploying wallet will store 0 as seqno
  storeUint(3, 8).
  storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell().
  storeBuffer(signature).
  storeBuilder(toSign).
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tlb"
  "time"
)

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(address.MustParseAddr("put your first wallet address from were you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// transaction for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0, because after deploying wallet will store 0 as seqno
  MustStoreUInt(3, 8).
  MustStoreRef(internalMessage)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash())
body := cell.BeginCell().
  MustStoreSlice(signature, 512).
  MustStoreBuilder(toSign).
	EndCell()
```

</TabItem>
</Tabs>

Now we have State Init and Message Body.

### Sending an external transaction

The **main change** will be in the external message, because here the State Init will be stored for deploying. Since the contract does not have its own code yet, it cannot process any internal messages. So we send its code and the initial data and **after the deployment it can process our message** with "Hello, TON!":

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell().
  storeUint(0b10, 2). // indicate that it is an incoming external transaction
  storeUint(0, 2). // src -> addr_none
  storeAddress(contractAddress).
  storeCoins(0). // Import fee
  storeBit(1). // We have State Init
  storeBit(1). // We store State Init as a reference
  storeRef(stateInit). // Store State Init as a reference
  storeBit(1). // We store Message Body as a reference
  storeRef(body). // Store Message Body as a reference
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicate that it is an incoming external transaction
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(contractAddress).
  MustStoreCoins(0). // Import fee
  MustStoreBoolBit(true). // We have State Init
  MustStoreBoolBit(true).  // We store State Init as a reference
  MustStoreRef(stateInit). // Store State Init as a reference
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()
```

</TabItem>
</Tabs>

Finally, we can send our transaction to blockchain to deploy our wallet and use it.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "ton";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)
if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

Note that we have sent an internal transaction with mode `3`. If you want to repeat the deploying of the same wallet, **you can destroy the smart contract**. To do this, set the mode 128 (take the entire balance of the smart contract) + 32 (destroy the smart contract) = `160` to get all the remaining TON on the balance back and be able to deploy the wallet again. 

**Do not forget** that with each new transaction you will need **to increase seqno by one**.

:::info
At the time of writing this contract I [verified](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=) this code. On [this wallet](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX) you can see [the code](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source) that should be on your wallet.
:::

## 💸 Working with wallet smart contracts

Now we can work fully with wallet smart contracts. We can deploy and destroy them, send the needed transactions and not depend on pre-prepared library methods. During the study, we sent transactions with TON and comments. To apply more studies in practice, we will try to build and send more complex transactions.

### Sending multiple messages simultaneously

As you may already know, [one cell can store up to 1023 bits of data and up to 4 references](/develop/data-formats/cell-boc#cell) to other cells. In the first section of the tutorial we covered that internal messages are delivered in a while loop as a link and sent. This means it is possible to **store up to 4 internal messages inside the external**. This way, we can send four transactions at once.

To do this, it is necessary to create 4 different internal messages. We can do this manually or through a `loop`. Create `three arrays`: in first TON amount for each transaction will be stored; in the second - a comment; and the last - the destination address. We will also create another array for our messages:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "ton-core";

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third transaction without comment
  "Hello, TON! #4" 
]
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you"
] // All 4 addresses can be the same

let internalMessages:Cell[] = []; // array for our internal messages
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tvm/cell"
)

internalMessagesAmount := [4]string{"0.01", "0.02", "0.03", "0.04"}
internalMessagesComment := [4]string{
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third transaction without comment
  "Hello, TON! #4",
}
destinationAddresses := [4]string{
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
} // All 4 addresses can be the same

var internalMessages [len(internalMessagesAmount)]*cell.Cell // array for our internal messages
```

</TabItem>
</Tabs>

For transactions mode, we will not create an array because all transactions will be sent with `mode 3`, but if you require different modes, you can create an array for that too. Now create a loop in which our internal messages will be built and add them to the array:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "ton-core";

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];
  
  let internalMessage = beginCell().
      storeUint(0x18, 6). // bounce
      storeAddress(Address.parse(destinationAddresses[index])).
      storeCoins(toNano(amount)).
      storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);
      
  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if(internalMessagesComment[index] != "") {
    internalMessage.storeBit(1) // we store Message Body as a reference

    let internalMessageBody = beginCell().
      storeUint(0, 32).
      storeStringTail(internalMessagesComment[index]).
      endCell();

    internalMessage.storeRef(internalMessageBody);
  } 
  else 
    /*
        Since we do not have a message body, we indicate that 
        the message body is in this message, but do not write it, 
        which means it is absent. We could write bit 1 and store 
        Message Body as an empty cell (beginCell().endCell())
    */
    internalMessage.storeBit(0);
  
  internalMessages.push(internalMessage.endCell());
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
)

for i := 0; i < len(internalMessagesAmount); i++ {
  amount := internalMessagesAmount[i]

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(address.MustParseAddr(destinationAddresses[i])).
    MustStoreBigCoins(tlb.MustFromTON(amount).NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32+1)

  /*
      At this stage, it is not clear if we will have a message body. 
      So put a bit only for stateInit, and if we have a comment, in means 
      we have a body message. In that case, set the bit to 1 and store the 
      body as a reference.
  */

  if internalMessagesComment[i] != "" {
    internalMessage.MustStoreBoolBit(true) // we store Message Body as a reference

    internalMessageBody := cell.BeginCell().
      MustStoreUInt(0, 32).
      MustStoreStringSnake(internalMessagesComment[i]).
      EndCell()

    internalMessage.MustStoreRef(internalMessageBody)
  } else {
    /*
        Since we do not have a message body, we indicate that
        the message body is in this message, but do not write it,
        which means it is absent. We could write bit 1 and store
        Message Body as an empty cell (beginCell().endCell())
    */
    internalMessage.MustStoreBoolBit(false)
  }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

Now lets use our knowledge from **chapter two** of the tutorial to build a transaction for our wallet, which will send 4 transactions simultaneously:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "ton";
import { mnemonicToWalletKey } from "ton-crypto";

const walletAddress = Address.parse('put your wallet address');
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = 'put your mnemonic'; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(' '); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic 

let toSign = beginCell().
  storeUint(698983191, 32). // subwallet_id
  storeUint(Math.floor(Date.now() / 1e3) + 60, 32). // Transaction expiration time, +60 = 1 minute
  storeUint(seqno, 32); // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
	"context"
	"crypto/ed25519"
	"crypto/hmac"
	"crypto/sha512"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"golang.org/x/crypto/pbkdf2"
	"log"
	"strings"
	"time"
)

walletAddress := address.MustParseAddr("put your wallet address")

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

mnemonic := strings.Split("put your mnemonic", " ") // word1 word2 word3
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // transaction expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add .MustStoreUInt(0, 8) 
```

</TabItem>
</Tabs>

And now add our messages that we built earlier in the loop:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8) // store mode of our internal transaction
  toSign.storeRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
		internalMessage := internalMessages[i]
		toSign.MustStoreUInt(3, 8) // store mode of our internal transaction
		toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

What is left to do is to **sign** our message,  **build external message** as in previous chapters and  **send it** to the blockchain:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "ton-crypto";

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature

let body = beginCell().
    storeBuffer(signature). // store signature
    storeBuilder(toSign). // store our message
    endCell();

let externalMessage = beginCell().
    storeUint(0b10, 2). // ext_in_msg_info$10
    storeUint(0, 2). // src -> addr_none
    storeAddress(walletAddress). // Destination address
    storeCoins(0). // Import Fee
    storeBit(0). // No State Init
    storeBit(1). // We store Message Body as a reference
    storeRef(body). // Store Message Body as a reference
    endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

:::info Connection error
If you get an error with the lite-server connection (Golang), just run the code until you can send the transaction. This is because the tonutils-go library uses many lite-servers from the global config that we have specified in the code, but not all lite-servers can accept our connection.
:::

After that, we can go to any explorer and see that **our wallet sent four transactions** to the addresses you previously specified.

### NFT Transfer

In addition to regular translations, users often send NFT to each other. At the same time, not all libraries contain methods to help with this type of smart contract. So we will write a code that will build a transaction for sending an NFT. But before that, we lets look at some details of the [standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md).

We need [TL-B from this standard for the NFT transfer](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer). As you may already know, TL-B describes various structures in TON Blockchain. Let’s look at some points that may not be immediately clear:

- `query_id`: This value can be set to 0. It is needed to separate different NFT transfer requests. Used in different services, that is, what query_id will be, depends only on the service and the purpose for which it will use it.

- `response_destination`: After processing the ownership change transaction there will be extra TON. They will be sent to this address, if specified, otherwise remain on the NFT balance.

- `custom_payload`: Needed for specific tasks. Not used in ordinary NFT.

- `forward_amount`: If this field is not zero, the specified amount of TON will be sent to the new owner. That way new owner will be notified that he received something.

- `forward_payload`: This is an additional data that can be sent to the new owner together with forward_amount. For example, using forward_payload you can [add a comment during the transfer of the NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format), as we did earlier in the tutorial. However, the problem is that although it is written in the standard, the explorers do not fully support it. **In the case of Jettons the same problem is present**.

Now let's move on to building the transaction itself:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "ton-core";

const destinationAddress = Address.parse("put your wallet where you want to send NFT");
const walletAddress = Address.parse("put your wallet which is the owner of NFT")
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers, 
// as it is not supported by them at the time of writing the tutorial.
const forwardPayload = beginCell().
  storeUint(0, 32).
  storeStringTail("Hello, TON!").
  endCell();

const transferNftBody = beginCell().
  storeUint(0x5fcc3d14, 32). // Opcode for NFT transfer
  storeUint(0, 64). // query_id
  storeAddress(destinationAddress). // new_owner
  storeAddress(walletAddress). // response_destination for excesses
  storeBit(0). // we do not have custom_payload
  storeCoins(toNano("0.01")). // forward_payload
  storeBit(1). // we store forward_payload as a reference
  storeRef(forwardPayload). // store forward_payload as a reference
  endCell();

const internalMessage = beginCell().
  storeUint(0x18, 6). // bounce
  storeAddress(nftAddress).
  storeCoins(toNano("0.05")).
  storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  storeRef(transferNftBody).
  endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

destinationAddress := address.MustParseAddr("put your wallet where you want to send NFT")
walletAddress := address.MustParseAddr("put your wallet which is the owner of NFT")
nftAddress := address.MustParseAddr("put your nft address")

// We can add a comment, but it will not be displayed in the explorers,
// as it is not supported by them at the time of writing the tutorial.
forwardPayload := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Hello, TON!").
  EndCell()

transferNftBody := cell.BeginCell().
  MustStoreUInt(0x5fcc3d14, 32). // Opcode for NFT transfer
  MustStoreUInt(0, 64). // query_id
  MustStoreAddr(destinationAddress). // new_owner
  MustStoreAddr(walletAddress). // response_destination for excesses
  MustStoreBoolBit(false). // we do not have custom_payload
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_payload
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1 that means we have body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

Opcode came from [the same standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema). All we have to do now is complete the transaction, as in the previous chapters. You can find the fully working code in the GitHub repository, which was attached at the beginning of the tutorial.

Then you can do the same with `Jettons`. You just need to read the TL-B for the transfer of tokens from [standart](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and understand how to collect the transaction. There is a small difference betwenn NFT and Jettons transfer.

### Get methods in Wallet V3 and Wallet v4

Smart contracts can have GET methods. These are functions that can take arguments, process various data and return a response. However, the essence of GET methods is that they are run not inside the blockchain, but **on the client side**. These methods are very useful and provide different data on smart contracts. For example, [get_nft_data() method in NFT smart contracts](https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L142-L145) allows you to get **content**, **owner**, **collection** .

We will study the basic GET methods of [V3](https://github.com/ton-blockchain/ton/blob/e37583e5e6e8cd0aebf5142ef7d8db282f10692b/crypto/smartcont/wallet3-code.fc#L31-L41) and [V4](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L164-L198) Wallets, as well as learn how to pass arguments and read the response. Let’s start with the methods that are the same for the two versions:

Method | Explanation
:---: | :---:
int seqno() | At this stage you already know what seqno is. This method is needed to receive the **current seqno** and send transactions with the correct value. In previous chapters, we were calling this method all the time.
int get_public_key() | Getting a public key. Not broadly used, can be used by different services. For example, some API services allow you to find all wallets with the same public key. In this case, it is useful to be able to receive the keys in advance through this method.

Now let’s move to the methods that only V4 possesses:

Method | Explanation
:---: | :---:
int get_subwallet_id() | Earlier in the tutorial we considered this. This method allows you to get subwallet_id.
int is_plugin_installed(int wc, int addr_hash) | Lets us know if the plugin has been installed. To call, you should pass the [workchain](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules) and the plugin address hash.
tuple get_plugin_list() | This method returns the address of the plugins that are installed.

We look at two methods: `get_public_key` and `is_plugin_installed`. They have been chosen because at first we would have to get a public key from 256 bits of data, and after that we would have to learn how to pass a slice and different types of data to GET methods. This will be very useful in learning how to use these methods.

First we need a client who will send requests. I will use my wallet address ([EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)) as an example:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "ton";
import { Address } from "ton-core";

const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "put your api key" // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"); // my wallet address as an example
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/ton"
  "log"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

Now we need to call GET method wallet.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method. 
let getResult = await client.runMethodWithError(walletAddress, "get_public_key"); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey)
```

</TabItem>
<TabItem value="go" label="Golang">

```go
// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

After the call we get a huge number (256 bits), which must be translated into hex string. Hex string for my address: `430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`. Now we can use [TonAPI](https://tonapi.io/swagger-ui) (/v1/wallet/findByPubkey method), put the obtained hex string and see that the first element in the array in the answer will point to my wallet.

Now we can switch to `is_plugin_installed`. As an example I will use my old wallet ([EQAM7M-HGyfxlErAIUODrxBA3y5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k)) and the plugin ([EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)) that will be installed for at least a few decades:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse("EQAM7M-HGyfxlErAIUODrxBA3y5roBeYiTuy6BHgJ3Sx8k"); // my old wallet address
const subscriptionAddress = Address.parseFriendly("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"); // subscription plugin address which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

Now we need to get the hash address of our plugin. After that we can translate it into number and send it to GET Method. 

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`) ;

getResult = await client.runMethodWithError(oldWalletAddress, "is_plugin_installed", 
[
    {type: "int", value: BigInt("0")}, // pass workchain as int
    {type: "int", value: hash} // pass plugin address hash as int
]);
console.log(getResult.stack.readNumber()); // -1
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "math/big"
)

hash := big.NewInt(0).SetBytes(subscriptionAddress.Data())
// runGetMethod will automatically identify types of passed values
getResult, err = client.RunGetMethod(context.Background(), block, oldWalletAddress,
  "is_plugin_installed",
  0,    // pass workchain
  hash) // pass plugin address
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

log.Println(getResult.MustInt(0)) // -1
```

</TabItem>
</Tabs>

In the response we have to get `-1`, which means true. We could send a **slice** and a **cell** if required. It would be enough to create a Slice or Cell and transfer it instead of BigInt, specifying the appropriate type.

### Contract deploy via wallet

In chapter three, we deployed our wallet. To do this, we first sent some TON and then a transaction from this wallet to deploy the contract. However, it is not broadly used with external transactions and is primarily used for wallets. While developing contracts, the deployment process is initialized by **internal messages**. 

We will use the smart V3R2 wallet contract that was used in [the third chapter](/develop/smart-contracts/tutorials/wallet#compiling-our-wallet-code). In this case, set `subwallet_id` to `3` or any other number that you want to get a different address when using the same private key (changeable):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from 'ton-core';
import { mnemonicToWalletKey } from 'ton-crypto';

const mnemonicArray = 'put your mnemonic'.split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64('te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==');
const dataCell = beginCell().
    storeUint(0, 32). // Seqno
    storeUint(3, 32). // Subwallet ID
    storeBuffer(keyPair.publicKey). // Public Key
    endCell();

const stateInit = beginCell().
    storeBit(0). // No split_depth
    storeBit(0). // No special
    storeBit(1). // We have code
    storeRef(codeCell).
    storeBit(1). // We have data
    storeRef(dataCell).
    storeBit(0). // No library
    endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "golang.org/x/crypto/pbkdf2"
  "strings"
)

mnemonicArray := strings.Split("put your mnemonic", " ")
// The following three lines will extract the private key using the mnemonic phrase.
// We will not go into cryptographic details. In the library tonutils-go, it is all implemented,
// but it immediately returns the finished object of the wallet with the address and ready-made methods.
// So we’ll have to write the lines to get the key separately. Goland IDE will automatically import
// all required libraries (crypto, pbkdf2 and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key

BOCBytes, _ := base64.StdEncoding.DecodeString("te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==")
codeCell, _ := cell.FromBOC(BOCBytes)
dataCell := cell.BeginCell().
  MustStoreUInt(0, 32).           // Seqno
  MustStoreUInt(3, 32).           // Subwallet ID
  MustStoreSlice(publicKey, 256). // Public Key
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()
```

</TabItem>
</Tabs>

Now we will get the address of our contract and build InternalMessage. Also we wil add "Deploying..." comment to our transaction.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from 'ton-core';

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell().
    storeUint(0, 32).
    storeStringTail('Deploying...').
    endCell();

const internalMessage = beginCell().
    storeUint(0x10, 6). // no bounce
    storeAddress(contractAddress).
    storeCoins(toNano('0.01')).
    storeUint(0, 1 + 4 + 4 + 64 + 32).
    storeBit(1). // We have State Init
    storeBit(1). // We store State Init as a reference
    storeRef(stateInit). // Store State Init as a reference
    storeBit(1). // We store Message Body as a reference
    storeRef(internalMessageBody). // Store Message Body Init as a reference
    endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "log"
)

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())   // Output contract address to console

internalMessageBody := cell.BeginCell().
  MustStoreUInt(0, 32).
  MustStoreStringSnake("Deploying...").
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x10, 6). // no bounce
  MustStoreAddr(contractAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()).
  MustStoreUInt(0, 1+4+4+64+32).
  MustStoreBoolBit(true).            // We have State Init
  MustStoreBoolBit(true).            // We store State Init as a reference
  MustStoreRef(stateInit).           // Store State Init as a reference
  MustStoreBoolBit(true).            // We store Message Body as a reference
  MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
  EndCell()
```

</TabItem>
</Tabs>

:::info
Note that we have specified the bits, and then save stateInit and internalMessageBody as references. Since the links are stored separately, we could write 4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) which means (0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1) and then save two references.
:::

Next, we only need to prepare a message for our wallet and send it:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from 'ton';
import { sign } from 'ton-crypto';

const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = 'put your mnemonic'.split(' ');
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse('put your wallet address with which you will deploy');
const getMethodResult = await client.runMethod(walletAddress, 'seqno'); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// transaction for our wallet
const toSign = beginCell().
    storeUint(698983191, 32). // subwallet_id
    storeUint(Math.floor(Date.now() / 1e3) + 60, 32). // Transaction expiration time, +60 = 1 minute
    storeUint(seqno, 32). // store seqno
    // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8) 
    storeUint(3, 8).
    storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell().
    storeBuffer(signature). // store signature
    storeBuilder(toSign). // store our message
    endCell();

const external = beginCell().
    storeUint(0b10, 2). // indicate that it is an incoming external transaction
    storeUint(0, 2). // src -> addr_none
    storeAddress(walletAddress).
    storeCoins(0). // Import fee
    storeBit(0). // We do not have State Init
    storeBit(1). // We store Message Body as a reference
    storeRef(body). // Store Message Body as a reference
    endCell();

console.log(external.toBoc().toString('base64'));
client.sendFile(external.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
  "time"
)

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

block, err := client.CurrentMasterchainInfo(context.Background()) // get current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
walletPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
walletAddress := address.MustParseAddr("put your wallet address with which you will deploy")

getMethodResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "seqno") // run "seqno" GET method from your wallet contract
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}
seqno := getMethodResult.MustInt(0) // get seqno from response

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32).                          // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // transaction expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32).                     // store seqno
  // Do not forget that if we use Wallet V4, we need to add .MustStoreUInt(0, 8)
  MustStoreUInt(3, 8).          // store mode of our internal transaction
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(walletPrivateKey, toSign.EndCell().Hash()) // get the hash of our message to wallet smart contract and sign it to get signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign).       // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2).       // ext_in_msg_info$10
  MustStoreUInt(0, 2).          // src -> addr_none
  MustStoreAddr(walletAddress). // Destination address
  MustStoreCoins(0).            // Import Fee
  MustStoreBoolBit(false).      // No State Init
  MustStoreBoolBit(true).       // We store Message Body as a reference
  MustStoreRef(body).           // Store Message Body as a reference
  EndCell()

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

This concludes our work with ordinary wallets. At this stage, you fully understand how to interact with wallet smart contracts, send the required transactions, and not to be dependent on a specific library.

## 🔥 High-load wallet

In some situations, sending a large number of transactions per message may be necessary. As previously reviewed, ordinary wallets support sending up to 4 transactions at a time. This was because [a maximum of 4 references](/develop/data-formats/cell-boc#cell) can be stored in a single cell. High-load wallets allow sending 255 transactions at once. This restriction exists because the maximum out messages in the blockchain config is set to 255.

Exchanges are the best example. With many users, it is necessary to send a lot of transactions for withdrawal per second.

### High-load wallet FunC code

First, let’s take a look at [the code of the high-load wallet smart contract](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc) , as we have done before: 

```func
() recv_external(slice in_msg) impure {
  var signature = in_msg~load_bits(512); ;; get signature from the message body
  var cs = in_msg;
  var (subwallet_id, query_id) = (cs~load_uint(32), cs~load_uint(64)); ;; get rest values from the message body
  var bound = (now() << 32); ;; bitwise left shift operation
  throw_if(35, query_id < bound); ;; throw an error if transaction has expired
  var ds = get_data().begin_parse();
  var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
  ds.end_parse(); ;; make sure we do not have anything in ds
  (_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
  throw_if(32, found?); ;; if yes throw an error
  throw_unless(34, subwallet_id == stored_subwallet);
  throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
  var dict = cs~load_dict(); ;; get dictionary with messages
  cs.end_parse(); ;; make sure we do not have anything in cs
  accept_message();
```

> 💡 Useful links:
>
> ["Bitwise operations" in docs](/develop/func/stdlib/#dict_get)
>
> ["load_dict()" in docs](/develop/func/stdlib/#load_dict)
>
> ["udict_get?()" in docs](/develop/func/stdlib/#dict_get)

You can notice some differences from ordinary wallets. Now let’s take a closer look to every detail (except subwallet, since we have already studied this).

### Query ID instead of Seqno

As we have previously learned, ordinary wallets seqno is increased by `1` with each transaction. We had to wait until this value was updated, then get it using the GET method and send a new transaction. This took quite a lot of time ahead, which cannot be allowed in highload wallets. Therefore, `query_id` is used here.

This field allows us to identify each request, and if we already have some request, the contract will not accept it, as it has already been processed:

```func
var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
ds.end_parse(); ;; make sure we do not have anything in ds
(_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
throw_if(32, found?); ;; if yes throw an error
```

This way, we are **being protected from repeated transactions**, which was the role of seqno in ordinary wallets. 

### Sending transactions

After the contract has accepted the external message, a loop starts, in which the `slices` stored in the dictionary are taken. These slices store transactions modes and the transactions themselves. Sending takes place until the dictionary is empty:

```func
int i = -1; ;; we write -1 because it will be the smallest value among all dictionary keys
do {
  (i, var cs, var f) = dict.idict_get_next?(16, i); ;; get the key and its corresponding value with the smallest key, which is greater than i
  if (f) { ;; check if any value was found
    var mode = cs~load_uint(8); ;; load transaction mode
    send_raw_message(cs~load_ref(), mode); ;; load transaction itself and send it
  }
} until (~ f); ;; if any value was found continue
```

> 💡 Useful link:
>
> ["idict_get_next()" in docs](/develop/func/stdlib/#dict_get_next)

Note that if a value is found, `f` will be -1 (true). The `~ -1` operation (bitwise not) will return 0, meaning that the loop should be continued. At the same time, when we fill the dictionary with our transactions, it is necessary to start the count **with a value greater than -1** (for example, 0) and continue increasing by 1 with each transaction. So all transactions will be sent in the sequence we wanted.

### Old queries removing

As you know, [smart contracts in TON pay for their storage](develop/smart-contracts/fees#storage-fee). So they can not store a lot of data in it, otherwise each transaction will be very expensive. For this, transactions that have expired more than 64 seconds ago are removed from the storage:

```func
bound -= (64 << 32);   ;; clean up records that have expired more than 64 seconds ago
old_queries~udict_set_builder(64, query_id, begin_cell()); ;; add current query to dictionary
var queries = old_queries; ;; copy dictionary to another variable
do {
  var (old_queries', i, _, f) = old_queries.udict_delete_get_min(64);
  f~touch();
  if (f) { ;; check if any value was found
    f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
  }
  if (f) { 
    old_queries = old_queries'; ;; if yes save changes in our dictionary
    last_cleaned = i; ;; save last removed query
  }
} until (~ f);
```

> 💡 Useful link:
>
> ["udict_delete_get_min()" in docs](/develop/func/stdlib/#dict_delete_get_min)

Note that we have to interact with the `f` variable several times. Since [TVM is a stack machine](learn/tvm-instructions/tvm-overview#tvm-is-a-stack-machine), at each interaction with `f` it is necessary to pop all values to get the desired variable. The `f~touch()` operation places the variable at the top of the stack to optimize code execution.

### Bitwise left shift operation

This section may seem a bit complicated for those who have not previously worked with bruised operations. The following line can be seen in the smart contract code:

```func
var bound = (now() << 32); ;; bitwise left shift operation
```

As a result 32 bits are added to the number on the right side. This means that **existing values are moved to 32 bits to the left**. For example, take the number 3, translate it into a binary form, and get 11. Applying the `3 << 2` operation, 11 is moved by two bits. That is, two bits are added to the right. In the end, we have 1100, which is 12.

First thing to do in order to understand why this is done is to remember that `now()` returns us uint32, which means that the number will be 32 bits. By shifting it to 32 bits to the left, we get space for another uint32, which is query_id. This way, **timestamp and query_id can be combined** within one variable for optimization.

Next, consider the following line:

```func
bound -= (64 << 32); ;; clean up the records that have expired more than 64 seconds ago
```

Here we perform the operation of shifting the number 64 by 32 bits. We do this in order to **subtract 64 seconds** from our timestamp. This way we will be able to compare past query_ids and see if they are less than the received value. If so, they expired more than 64 seconds ago:

```func
if (f) { ;; check if any value has been found
  f = (i < bound); ;; check if more than 64 seconds have elapsed after expiration
}
```

To understand this better, take `1625918400` as an example of timestamp. Its binary representation (with the left-handed addition of zeros for 32 bits) is 01100000111010011000101111000000. By performing a bitwise left shift by 32 bits, we get 32 zeros at the end of the binary representation of our number. 

After that **we can add any query_id (uint32)**. Then subtracting `64 << 32`, we get a timestamp that was 64 seconds ago with the same query_id. We can make sure of that by performing `((1625918400 << 32) - (64 << 32)) >> 32`. This way we can compare the necessary part of our number (which is timestamp) and at the same time query_id does not interfere.

### Storage update

After all the operations are done, only remaining thing is to save new values in the storage:

```func
  set_data(begin_cell()
    .store_uint(stored_subwallet, 32)
    .store_uint(last_cleaned, 64)
    .store_uint(public_key, 256)
    .store_dict(old_queries)
    .end_cell());
}
```

### GET Methods

The last thing we have to consider before we go to deployment and transactions creation is GET methods of high-load wallet: 

Method | Explanation
:---: | :---:
int processed?(int query_id) | Lets us know if a particular request has been processed. Returns `-1` if yes and `0` if no. Also, this method may return `1` if the answer is unknown since this request is old and no longer stored in the contract.
int get_public_key() | Getting a public key. We have considered this method before.

Let’s look at `int processed?(int query_id)` closely because it will help us to understand why we need last_cleaned:

```func
int processed?(int query_id) method_id {
  var ds = get_data().begin_parse();
  var (_, last_cleaned, _, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict());
  ds.end_parse();
  (_, var found) = old_queries.udict_get?(64, query_id);
  return found ? true : - (query_id <= last_cleaned);
}
```

We get `last_cleaned` from the storage of the contract and a dictionary of old queries. If the query is found, it will be returned true, and if not, the expression `- (query_id <= last_cleaned)`. last_cleaned contains the last removed request **with the highest timestamp**, as we started with the minimum timestamp when deleting the requests. 

This means that if the query_id passed to the method is smaller than last_cleaned, it is impossible to determine whether it was ever in the contract or not, so the `query_id <= last_cleaned` returns -1, and the minus before this expression changes the answer to 1. If query_id is larger than last_cleaned, then it has not yet been processed.

### Deploying high-load wallet

Here we will only go into a few details as they were detailed previously in this tutorial. It is necessary to generate a mnemonic key in advance, which you will use. You can use the same key that was used in any of the previous chapters of this tutorial. 

First, we need to copy [the code of the smart contract](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc) to the same directory where stdlib.fc and wallet_v3 are located and remember to add the code `#include "stdlib.fc";` to the beginning of the code. Then we should compile the code of high-load wallet as we did in [chapter three](/develop/smart-contracts/tutorials/wallet#compiling-our-wallet-code):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { compileFunc } from '@ton-community/func-js';
import fs from 'fs'
import { Cell } from 'ton-core';

const result = await compileFunc({
    targets: ['highload_wallet.fc'], // targets of your project
    sources: {
        'stdlib.fc': fs.readFileSync('./src/stdlib.fc', { encoding: 'utf-8' }),
        'highload_wallet.fc': fs.readFileSync('./src/highload_wallet.fc', { encoding: 'utf-8' }),
    }
});

if (result.status === 'error') {
console.error(result.message)
return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, 'base64'))[0];

// now we have base64 encoded BOC with compiled code in result.codeBoc
console.log('Code BOC: ' + result.codeBoc);
console.log('\nHash: ' + codeCell.hash().toString('base64')); // get the hash of cell and convert in to base64 encoded string

```

</TabItem>
</Tabs>

You should get the following output to the terminal:

```text
Code BOC: te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz

Hash: lJTRzI7fEvBWcaGpugmSEJbrUIEeGSTsZcPGKfu4CBI=
```

And now we can, using base64 encoded output, get the same cell with our wallet code in other libraries in other languages:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

base64BOC := "te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there is any error
  panic(err) 
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type and output to the terminal
```

</TabItem>
</Tabs>

Now we need to get a cell with an initial data, build State Init and get high-load wallet address. We have already studied the smart contract code and have realized that subwallet_id, last_cleaned, public_key and old_queries are sequentially stored in the storage:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell } from 'ton-core';
import { mnemonicToWalletKey } from 'ton-crypto';

const highloadMnemonicArray = 'put your mnemonic that you have generated and saved before'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic

const dataCell = beginCell().
    storeUint(698983191, 32). // Subwallet ID
    storeUint(0, 64). // Last cleaned
    storeBuffer(highloadKeyPair.publicKey). // Public Key
    storeBit(0). // indicate that the dictionary is empty
    endCell();

const stateInit = beginCell().
    storeBit(0). // No split_depth
    storeBit(0). // No special
    storeBit(1). // We have code
    storeRef(codeCell).
    storeBit(1). // We have data
    storeRef(dataCell).
    storeBit(0). // No library
    endCell();

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "github.com/xssnick/tonutils-go/address"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "strings"
)

highloadMnemonicArray := strings.Split("put your mnemonic that you have generated and saved before", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k)                      // get private key
highloadPublicKey := highloadPrivateKey.Public().(ed25519.PublicKey) // get public key from private key

dataCell := cell.BeginCell().
  MustStoreUInt(698983191, 32).           // Subwallet ID
  MustStoreUInt(0, 64).                   // Last cleaned
  MustStoreSlice(highloadPublicKey, 256). // Public Key
  MustStoreBoolBit(false).                // indicate that the dictionary is empty
  EndCell()

stateInit := cell.BeginCell().
  MustStoreBoolBit(false). // No split_depth
  MustStoreBoolBit(false). // No special
  MustStoreBoolBit(true).  // We have code
  MustStoreRef(codeCell).
  MustStoreBoolBit(true). // We have data
  MustStoreRef(dataCell).
  MustStoreBoolBit(false). // No library
  EndCell()

contractAddress := address.NewAddress(0, 0, stateInit.Hash()) // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
log.Println("Contract address:", contractAddress.String())    // Output contract address to console
```

</TabItem>
</Tabs> 

Everything else we do is the same as in [Contract deploy via wallet](http://localhost:3000/docs/develop/smart-contracts/tutorials/wallet#contract-deploy-via-wallet) section. If you want to see the fully working code, you can visit the repository indicated at the beginning of the tutorial, where all the sources are stored.

### Sending transactions from high-load wallet

Now we need to send several messages at the same time from our highload wallet. For example, let's take 12 transactions per message so that the commission is small. Each message will have its own comment with a code, and the destination address will be our wallet from which we deployed:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, Cell, toNano } from 'ton-core';

let internalMessages:Cell[] = [];
const walletAddress = Address.parse('put your wallet address from which you deployed high-load wallet');

for (let i = 0; i < 12; i++) {
    const internalMessageBody = beginCell().
        storeUint(0, 32).
        storeStringTail(`Hello, TON! #${i}`).
        endCell();

    const internalMessage = beginCell().
        storeUint(0x18, 6). // bounce
        storeAddress(walletAddress).
        storeCoins(toNano('0.01')).
        storeUint(0, 1 + 4 + 4 + 64 + 32).
        storeBit(0). // We do not have State Init
        storeBit(1). // We store Message Body as a reference
        storeRef(internalMessageBody). // Store Message Body Init as a reference
        endCell();

    internalMessages.push(internalMessage);
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

var internalMessages []*cell.Cell
wallletAddress := address.MustParseAddr("put your wallet address from which you deployed high-load wallet")

for i := 0; i < 12; i++ {
  comment := fmt.Sprintf("Hello, TON! #%d", i)
  internalMessageBody := cell.BeginCell().
    MustStoreUInt(0, 32).
    MustStoreBinarySnake([]byte(comment)).
    EndCell()

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(wallletAddress).
    MustStoreBigCoins(tlb.MustFromTON("0.001").NanoTON()).
    MustStoreUInt(0, 1+4+4+64+32).
    MustStoreBoolBit(false). // We do not have State Init
    MustStoreBoolBit(true). // We store Message Body as a reference
    MustStoreRef(internalMessageBody). // Store Message Body Init as a reference
    EndCell()

  messageData := cell.BeginCell().
    MustStoreUInt(3, 8). // transaction mode
    MustStoreRef(internalMessage).
    EndCell()

	internalMessages = append(internalMessages, messageData)
}
```

</TabItem>
</Tabs>

We now have an array of internal messages. We need to create a dictionary in which we will store our messages and also prepare and sign the body:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Dictionary } from 'ton-core';
import { mnemonicToWalletKey, sign } from 'ton-crypto';
import * as crypto from 'crypto';

const dictionary = Dictionary.empty<number, Cell>(); // create an empty dictionary with the key as a number and the value as a cell
for (let i = 0; i < internalMessages.length; i++) {
    const internalMessage = internalMessages[i]; // get our message from an array
    dictionary.set(i, internalMessage); // save the message in the dictionary
}

const queryID = crypto.randomBytes(4).readUint32BE(); // create a random uint32 number, 4 bytes = 32 bits
const now = Math.floor(Date.now() / 1000); // get current timestamp
const timeout = 120; // timeout for message expiration, 120 seconds = 2 minutes
const finalQueryID = (BigInt(now + timeout) << 32n) + BigInt(queryID); // get our final query_id
console.log(finalQueryID); // print query_id. With this query_id we can call GET method to check if our request has been processed

const toSign = beginCell().
    storeUint(698983191, 32). // subwallet_id
    storeUint(finalQueryID, 64).
    // Here we create our own method that will save the 
    // transaction mode and a reference to the transaction
    storeDict(dictionary, Dictionary.Keys.Int(16), {
        serialize: (src, buidler) => {
            buidler.storeUint(3, 8); // save transaction mode, mode = 3
            buidler.storeRef(src); // save transaction as reference
        },
        // We won't actually use this, but this method 
        // will help to read our dictionary that we saved
        parse: (src) => {
            let cell = beginCell().
                storeUint(src.loadUint(8), 8).
                storeRef(src.loadRef()).
                endCell();
            return cell;
        }
    }
);

const highloadMnemonicArray = 'put your high-load wallet mnemonic'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic
const highloadWalletAddress = Address.parse('put your high-load wallet address');

const signature = sign(toSign.endCell().hash(), highloadKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
  "fmt"
  "golang.org/x/crypto/pbkdf2"
  "log"
  "math/big"
  "math/rand"
  "strings"
  "time"
)

dictionary := cell.NewDict(16) // create an empty dictionary with the key as a number and the value as a cell
for i := 0; i < len(internalMessages); i++ {
  internalMessage := internalMessages[i]                             // get our message from an array
  err := dictionary.SetIntKey(big.NewInt(int64(i)), internalMessage) // save the message in the dictionary
  if err != nil {
    return
  }
}

queryID := rand.Uint32()
timeout := 120                                                               // timeout for message expiration, 120 seconds = 2 minutes
now := time.Now().Add(time.Duration(timeout)*time.Second).UTC().Unix() << 32 // get current timestamp + timeout
finalQueryID := uint64(now) + uint64(queryID)                                // get our final query_id
log.Println(finalQueryID)                                                    // print query_id. With this query_id we can call GET method to check if our request has been processed

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id
  MustStoreUInt(finalQueryID, 64).
  MustStoreDict(dictionary)

highloadMnemonicArray := strings.Split("put your high-load wallet mnemonic", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
highloadWalletAddress := address.MustParseAddr("put your high-load wallet address")

signature := ed25519.Sign(highloadPrivateKey, toSign.EndCell().Hash())
```

</TabItem>
</Tabs>

:::note IMPORTANT
Note that on JS/TS we saved the messages into an array without a mode. TIt happens because the ton library leaves the implementation of serialization and de-serialization to the developer. Thus, we pass there a method that first saves the transaction mode, after which it saves the transaction itself. If we wrote `Dictionary.Values.Cell()` for value method, it would save our entire message as a cell reference without saving the fashion separately.
:::

Now we have to create an external message and send it to the blockchain:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from 'ton';

const body = beginCell().
    storeBuffer(signature). // store signature
    storeBuilder(toSign). // store our message
    endCell();

const externalMessage = beginCell().
    storeUint(0b10, 2). // indicate that it is an incoming external transaction
    storeUint(0, 2). // src -> addr_none
    storeAddress(highloadWalletAddress).
    storeCoins(0). // Import fee
    storeBit(0). // We do not have State Init
    storeBit(1). // We store Message Body as a reference
    storeRef(body). // Store Message Body as a reference
    endCell();

// We do not need a key here as we will be sending 1 request per second
const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    // apiKey: 'put your api key' // you can get an api key from @tonapibot bot in Telegram
});

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "context"
  "github.com/xssnick/tonutils-go/liteclient"
  "github.com/xssnick/tonutils-go/tl"
  "github.com/xssnick/tonutils-go/ton"
)

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()

externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // ext_in_msg_info$10
  MustStoreUInt(0, 2). // src -> addr_none
  MustStoreAddr(highloadWalletAddress). // Destination address
  MustStoreCoins(0). // Import Fee
  MustStoreBoolBit(false). // No State Init
  MustStoreBoolBit(true). // We store Message Body as a reference
  MustStoreRef(body). // Store Message Body as a reference
  EndCell()

connection := liteclient.NewConnectionPool()
configUrl := "https://ton-blockchain.github.io/global.config.json"
err := connection.AddConnectionsFromConfigUrl(context.Background(), configUrl)
if err != nil {
  panic(err)
}
client := ton.NewAPIClient(connection)

var resp tl.Serializable
err = client.Client().QueryLiteserver(context.Background(), ton.SendMessage{Body: externalMessage.ToBOCWithFlags(false)}, &resp)

if err != nil {
  log.Fatalln(err.Error())
  return
}
```

</TabItem>
</Tabs>

After that we can go into any explorer and see 12 outgoing transactions on our wallet. We also can call GET method `processed?` with the query_id we had in the console and get `-1` (true), which means that our request has been processed. 

## 🏁 Conclusion

This tutorial studied wallets in TON Blockchain within the smallest details. At the same time, we learned how to create external and internal messages ourselves without using pre-prepared library methods. 

This helps us not only to be independent on libraries but also to understand the structure of TON Blockchain better. Additionally, we learned how to use the high-load wallet and analysed a lot of details about various operations with different types of data.

## 🧩 Next Steps

After thoroughly studying this tutorial, I recommend that you familiarize yourself with the following documents in more detail.: [ton.pdf](https://ton.org/ton.pdf) and [tblkch.pdf](https://ton.org/tblkch.pdf).

It will be hard to understand everything, but it will be very useful in any case. Next, you can start learning how to write smart contracts: [FunC Overview](https://docs.ton.org/develop/func/overview), [Best Practices](https://docs.ton.org/develop/smart-contracts/guidelines), [FunC Cookbook](https://docs.ton.org/develop/func/cookbook)

## 📬 About the Author

If you have any issues or suggestions, you can always write to me on [Telegram](https://t.me/aspite) (@SpiteMoriarty). Also, you can visit my [GitHub](https://github.com/aSpite).

## 📖 See Also

- Wallets' source code: [V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc), [V4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc), [High-load](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc)

- Useful official documents: [ton.pdf](https://ton.org/ton.pdf), [tblkch.pdf](https://ton.org/tblkch.pdf), [tvm.pdf](https://ton.org/tvm.pdf)

The main sources of code:

  - [ton (JS/TS)](https://github.com/ton-core/ton)
  - [ton-core (JS/TS)](https://github.com/ton-core/ton-core)
  - [ton-crypto (JS/TS)](https://github.com/ton-core/ton-crypto)
  - [tonutils-go (GO)](https://github.com/xssnick/tonutils-go).

Official documentation:

  - [Internal messages](/develop/smart-contracts/guidelines/internal-messages)

  - [External messages](/develop/smart-contracts/guidelines/external-messages)

  - [Types of Wallet Contracts](/participate/wallets/contracts#wallet-v4)
  
  - [TL-B](/develop/data-formats/tl-b-language)

  - [Blockchain of Blockchains](https://docs.ton.org/learn/overviews/ton-blockchain)

External references:

- [Ton Deep](https://github.com/xssnick/ton-deep-doc)

- [Block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)

- [Standards in TON](https://github.com/ton-blockchain/TEPs)