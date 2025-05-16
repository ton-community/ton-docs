---
description: In this tutorial, you will learn how to fully work with wallets, messages and smart contracts.
---

import Feedback from '@site/src/components/Feedback';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with wallet smart contracts

## 👋 Introduction

Learning how wallets and transactions work on TON before beginning smart contracts development is essential. This knowledge will help developers understand the interaction between wallets, messages, and smart contracts to implement specific development tasks.

:::tip
Before starting this tutorial, we recommend reviewing the [Wallet contracts](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) article.
:::

This section will teach us to create operations without using pre-configured functions to understand development workflows. The references chapter contains all the necessary references for analyzing this tutorial.

## 💡 Prerequisites

This tutorial requires basic knowledge of JavaScript and TypeScript or Golang. It is also necessary to hold at least 3 TON (which can be stored in an exchange account, a non-custodial wallet, or the Telegram bot wallet). It is necessary to have a basic understanding of [cell](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage), [addresses in TON](/v3/documentation/smart-contracts/addresses), [blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains) to understand this tutorial.

:::info MAINNET DEVELOPMENT IS ESSENTIAL  
Working with the TON Testnet often leads to deployment errors, difficulty tracking transactions, and unstable network functionality. Completing most of the development on the TON Mainnet could help avoid potential issues. This may reduce the number of transactions and minimize fees.
:::

## 💿 Source code

All code examples used in this tutorial can be found in the following [GitHub repository](https://github.com/aSpite/wallet-tutorial).

## ✍️ What you need to get started

- Ensure NodeJS is installed.
- Specific Ton libraries are required and include: @ton/ton 13.5.1+, @ton/core 0.49.2+ and @ton/crypto 3.2.0+.

**OPTIONAL**: If you prefer Go instead of JS, install the [tonutils-go](https://github.com/xssnick/tonutils-go) library and the GoLand IDE to develop on TON. This library will be used in this tutorial for the GO version.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```bash
npm i --save @ton/ton @ton/core @ton/crypto
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

## ⚙ Set your environment

To create a TypeScript project, you need to follow these steps in order:

1. Create an empty folder (which we’ll name WalletsTutorial).
2. Open the project folder using the CLI.
3. Use the following commands to set up your project:

```bash
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init --rootDir src --outDir build \ --esModuleInterop --target es2020 --resolveJsonModule --lib es6 \ --module commonjs --allowJs true --noImplicitAny false --allowSyntheticDefaultImports true --strict false
```

:::info
To help us carry out the following process, a `ts-node` executes TypeScript code directly without precompiling. `nodemon` restarts the node application automatically when file changes in the directory are detected.
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

6. Add this script to `package.json` instead of "test", which is included when the project is created.

```json
"start:dev": "npx nodemon"
```

7. Create a `src` folder in the project root and an `index.ts` file in this folder.
8. Next, the following code should be added:

```ts
async function main() {
  console.log("Hello, TON!");
}

main().finally(() => console.log("Exiting..."));
```

9. Run the code using the terminal:

```bash
npm run start:dev
```

10. Finally, the console output will appear.

![](/img/docs/how-to-wallet/wallet_1.png)

:::tip Blueprint
The TON Community created an excellent tool for automating all development processes (deployment, contract writing, testing) called [Blueprint](https://github.com/ton-org/blueprint). However, we will not need such a powerful tool, so the instructions above should be followed.
:::

**OPTIONAL:** When using Golang, follow these instructions:

1. Install the GoLand IDE.
2. Create a project folder and a `go.mod` file with the following content. If the current version of Go is outdated, update it to the required version to proceed with this process:

```
module main

go 1.20
```

3. Type the following command into the terminal:

```bash
go get github.com/xssnick/tonutils-go
```

4. Create the `main.go` file in the root of your project with the following content:

```go
package main

import (
  "log"
)

func main() {
  log.Println("Hello, TON!")
}
```

5. Change the module's name in the `go.mod` to `main`.
6. Run the code above until the output in the terminal is displayed.

:::info
It is also possible to use another IDE since GoLand isn’t free, but it is preferred.
:::

:::warning IMPORTANT
Add all coding components to the `main` function created in the [⚙ Set your environment](/v3/guidelines/smart-contracts/howto/wallet#-set-your-environment) section.

Only the imports required for that specific code section are specified in each new section. Combine new imports with the existing ones as needed.
:::

## 🚀 Let's get started!

In this tutorial, we’ll learn which wallets (versions 3 and 4) are most often used on TON Blockchain and get acquainted with how their smart contracts work. This will allow developers to better understand the different message types on the TON platform to make it simpler to create messages, send them to the blockchain, deploy wallets, and eventually, be able to work with high-load wallets.

Our main task is to build messages using various objects and functions for @ton/ton, @ton/core, and @ton/crypto (ExternalMessage, InternalMessage, Signing, etc.) to understand what messages look like on a bigger scale. To carry out this process, we'll use two main wallet versions (v3 and v4) because exchanges, non-custodial wallets, and most users only use these specific versions.

:::note
This tutorial may not explain particular details on occasion. In these cases, more details will be provided later.

**IMPORTANT:** Throughout this tutorial, the [wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) is used to understand the wallet development process better. Version v3 has two sub-versions: r1 and r2. Currently, only the second version is being used, which means that when we refer to v3 in this document, it implies v3r2.
:::

## 💎 TON blockchain wallets

All wallets operating on the TON Blockchain are smart contracts, and everything running on TON functions as a smart contract. Like most blockchains, TON allows users to deploy and customize smart contracts for various purposes, enabling full wallet customization.
Wallet smart contracts on TON facilitate communication between the platform and other types of smart contracts. However, it’s essential to understand how wallet communication works.

### Wallet сommunication

Generally, TON Blockchain has two message types: `internal` and `external`. External messages allow sending messages to the blockchain from the outside world, thus allowing communication with smart contracts that accept such messages. The function responsible for carrying out this process is as follows:

```func
() recv_external(slice in_msg) impure {
 ;; some code
}
```

Before exploring wallets in more detail, let’s examine how wallets accept external messages. On TON, every wallet stores the owner’s `public key`, `seqno`, and `subwallet_id`. When a wallet receives an external message, it uses the `get_data()` method to retrieve data from its storage. The wallet then performs several verification checks to determine whether to accept the message. This process works as follows:

```func
() recv_external(slice in_msg) impure {
 var signature = in_msg~load_bits(512); ;; get signature from the message body
 var cs = in_msg;
 var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));  ;; get rest values from the message body
 throw_if(35, valid_until <= now()); ;; check the relevance of the message
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
> ["load_bits()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["get_data()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["begin_parse()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_bits)
>
> ["end_parse()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#end_parse)
>
> ["load_int()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["load_uint()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_int)
>
> ["check_signature()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#check_signature)
>
> ["slice_hash()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
>
> ["accept_message()" in docs](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects)

Now, let’s take a closer look.

### Replay protection - seqno

Message replay protection in the wallet smart contract relies on the `seqno` (Sequence Number), which tracks the order of sent messages. Preventing message repetition is critical, as duplicate messages can compromise the system’s integrity. When analyzing wallet smart contract code, the `seqno` is typically managed as follows:

```func
throw_unless(33, msg_seqno == stored_seqno);
```

The code above compares the `seqno` from the incoming message with the `seqno` stored in the smart contract. If the values do not match, the contract returns an error with the `33 exit code`. This ensures that if the sender provides an invalid `seqno`, indicating a mistake in the message sequence, the contract prevents further processing and safeguards against such errors.

:::note
It's also essential to consider that anyone can send external messages. If you send 1 TON to someone, someone else can repeat this message. However, when the seqno increases, the previous external message becomes invalid, and no one will be able to repeat it, thus preventing the possibility of stealing your funds.
:::

### Signature

As mentioned earlier, wallet smart contracts accept external messages. However, since these messages originate from the outside world, their data cannot be fully trusted. Therefore, each wallet stores the owner's public key. When the wallet receives an external message signed with the owner’s private key, the smart contract uses the public key to verify the message’s signature. This ensures the message genuinely comes from the contract owner.

The wallet first extracts the signature from the incoming message to perform this verification. It then loads the public key from storage and validates the signature using the following process:

```func
var signature = in_msg~load_bits(512);
var ds = get_data().begin_parse();
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(35, check_signature(slice_hash(in_msg), signature, public_key));
```

If all verification steps succeed, the smart contract accepts and processes the message:

```func
accept_message();
```

:::info accept_message()
Since external messages do not include the Toncoin required to pay transaction fees, the `accept_message()` function applies a `gas_credit` (currently valued at 10,000 gas units). This allows the contract to perform necessary calculations for free, provided the gas usage does not exceed the `gas_credit` limit. After invoking `accept_message()`, the smart contract deducts all gas costs (in TON) from its balance. You can read more about this process [here](/v3/documentation/smart-contracts/transaction-fees/accept-message-effects).
:::

### Transaction expiration

Another step used to check the validity of external messages is the `valid_until` field. As you can see from the variable name, this is the time in UNIX before the message is valid. If this verification process fails, the contract completes the processing of the transaction and returns the 35 exit code as follows:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
throw_if(35, valid_until <= now());
```

This algorithm safeguards against potential errors, such as when a message is no longer valid but is still sent to the blockchain for an unknown reason.

### Wallet v3 and wallet v4 differences

The key difference between wallet v3 and wallet v4 lies in wallet v4’s support for `plugins`. Users can install or delete these plugins, which are specialized smart contracts capable of requesting a specific amount of TON from the wallet smart contract at a designated time.

Wallet smart contracts automatically send the required amount of TON in response to plugin requests without requiring the owner’s involvement. This functionality mirrors a **subscription model**, which is the primary purpose of plugins. We won’t delve into these details further as they fall outside the scope of this tutorial.

### How wallets facilitate communication with smart contracts

As mentioned, a wallet smart contract accepts external messages, validates them, and processes them if all checks pass. Once the contract accepts a message, it begins a loop to extract messages from the body of the external message, creates internal messages, and sends them to the blockchain as shown below:

```func
cs~touch();
while (cs.slice_refs()) {
 var mode = cs~load_uint(8); ;; load message mode
 send_raw_message(cs~load_ref(), mode); ;; get each new internal message as a cell with the help of load_ref() and send it
}
```

:::tip touch()
On TON, all smart contracts run on the stack-based TON Virtual Machine (TVM). ~ touch() places the variable `cs` on top of the stack to optimize code running for less gas.
:::

Since a single cell can store **a maximum of 4 references**, we can send up to 4 internal messages per external message.

> 💡 Useful links:
>
> ["slice_refs()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)
>
> ["send_raw_message() and message modes" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)
>
> ["load_ref()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#load_ref)

## 📬 External and internal messages

This section will explore `internal` and `external` messages in more detail. We’ll create and send these messages to the network, minimizing reliance on pre-built functions.

To simplify this process, we’ll use a pre-built wallet. Here’s how to proceed:

1. Install the [wallet app](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps) (e.g., Tonkeeper is used by the author)
2. Switch the wallet app to v3r2 address version
3. Deposit 1 TON into the wallet
4. Send the message to another address (you can send it to yourself, to the same wallet).

This way, the Tonkeeper wallet app will deploy the wallet contract, which we can use for the following steps.

:::note
At the time of writing, most wallet apps on TON default to wallet v4. However, since plugins are not required for this tutorial, we’ll use the functionality provided by wallet v3. Tonkeeper allows users to select their preferred wallet version, so it’s recommended to deploy wallet v3.
:::

### TL-B

As mentioned earlier, everything in the TON Blockchain is a smart contract composed of cells. Standards are essential to ensure proper serialization and deserialization of data. For this purpose, `TL-B` was developed as a universal tool to describe various data types, structures, and sequences within cells.

This section will explore [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). This file will be invaluable for future development as it outlines how to assemble different types of cells. Specifically for our purposes, it provides detailed information about the structure and behavior of internal and external messages.

:::info
This guide provides basic information. For further details, please refer to our TL-B [documentation](/v3/documentation/data-formats/tlb/tl-b-language) to learn more about TL-B.
:::

### CommonMsgInfo

Initially, each message must first store `CommonMsgInfo` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L123-L130)) or `CommonMsgInfoRelaxed` ([TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L132-L137)). This allows us to define technical details that relate to the message type, message time, recipient address, technical flags, and fees.

By reading the `block.tlb` file, we can notice three types of CommonMsgInfo: `int_msg_info$0`, `ext_in_msg_info$10`, `ext_out_msg_info$11`. We will not go into specific details detailing the specificities of the `ext_out_msg_info` TL-B structure. That said, it is an external message type that a smart contract can send to use as an external log. For examples of this format, consider having a closer look at the [Elector](https://tonscan.org/address/Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF) contract.

When examining [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L127-L128), you’ll notice that **only `CommonMsgInfo` is available when using the `ext_in_msg_info` type**. It is because fields like `src`, `created_lt`, `created_at`, and others are overwritten by validators during transaction processing. Among these, the `src` field is particularly important. Since the sender’s address is unknown when the message is sent, validators populate this field during verification. This ensures the `src` address is accurate and cannot be tampered with.

However, the `CommonMsgInfo` structure only supports the `MsgAddress` specification. Since the sender’s address is typically unknown, it’s necessary to use `addr_none` (represented by two zero bits `00`). The `CommonMsgInfoRelaxed` structure is used in such cases, as it supports the `addr_none` address. For `ext_in_msg_info` (used for incoming external messages), the `CommonMsgInfo` structure is sufficient because these messages don’t require a sender and always use the [MsgAddressExt](https://hub.com/ton/ton.blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100) structure (represented by `addr_none$00`, meaning two zero bits). This eliminates the need to overwrite the data.

:::note
The numbers after the `$` symbol are the bits that must be stored at the beginning of a specific structure for further identification of these structures during reading (deserialization).
:::

### Internal message creation

Internal messages facilitate communication between contracts. When examining various contract types, such as [NFTs](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/nft/nft-item.fc#L51-L56) and [Jettons](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-wallet.fc#L139-L144), you’ll often encounter the following lines of code, which are commonly used when writing contracts that send messages:

```func
var msg = begin_cell()
 .store_uint(0x18, 6) ;; or 0x10 for non-bounce
 .store_slice(to_address)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
 ;; store something as a body
```

Let’s examine `0x18` and `0x10` (where `x` denotes hexadecimal). These numbers can be represented in binary as `011000` and `010000`, assuming we allocate 6 bits. This means the code above can be rewritten as follows:

```func
var msg = begin_cell()
 .store_uint(0, 1) ;; this bit indicates that we send an internal message according to int_msg_info$0
 .store_uint(1, 1) ;; IHR Disabled
 .store_uint(1, 1) ;; or .store_uint(0, 1) for 0x10 | bounce
 .store_uint(0, 1) ;; bounced
 .store_uint(0, 2) ;; src -> two zero bits for addr_none
 .store_slice(to_address)
 .store_coins(amount)
 .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
 ;; store something as a body
```

Now, let’s go through each option in detail:

|    Option    |                                                                                                                                                                                                                           Explanation                                                                                                                                                                                                                           |
| :----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| IHR Disabled |                Currently, this option is disabled (meaning we store `1`) because Instant Hypercube Routing (IHR) is not yet fully implemented. This option will become relevant once many [Shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards) are active on the network. For more details about the IHR Disabled option, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (chapter 2).                |
|    Bounce    | When sending messages, errors can occur during smart contract processing. Setting the `Bounce` option to `1` (true) is essential to prevent TON loss. If any errors arise during transaction processing, the message will be returned to the sender, and the same amount of TON (minus fees) will be refunded. Refer to [this guide](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for more details on non-bounceable messages. |
|   Bounced    |                                                                                                                                  Bounced messages are those returned to the sender due to an error during transaction processing with a smart contract. This option indicates whether the received message is bounced or not.                                                                                                                                   |
|     Src      |                                                                                                                                                                                 The Src is the sender's address. In this case, two zero bits indicate the `addr_none` address.                                                                                                                                                                                  |

The following two lines of code:

```func
...
.store_slice(to_address)
.store_coins(amount)
...
```

- we specify the recipient and the number of TON to be sent.

Finally, let’s look at the remaining lines of code:

```func
...
 .store_uint(0, 1) ;; Extra currency
 .store_uint(0, 4) ;; IHR fee
 .store_uint(0, 4) ;; Forwarding fee
 .store_uint(0, 64) ;; Logical time of creation
 .store_uint(0, 32) ;; UNIX time of creation
 .store_uint(0, 1) ;; State Init
 .store_uint(0, 1) ;; Message body
 ;; store something as a body
```

|          Option          |                                                                                                                                                       Explanation                                                                                                                                                        |
| :----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Extra currency      |                                                                                                                     This is a native implementation of existing jettons and is not currently in use.                                                                                                                     |
|         IHR fee          |                                                                              As mentioned, IHR is not currently used, so this fee is always zero. For more information, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (section 3.1.8).                                                                               |
|      Forwarding fee      |                                                                        A forwarding message fee. For more information, refer to [fees documentation](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#transactions-and-phases).                                                                         |
| Logical time of creation |                                                                                                                                   The time used to create the correct messages queue.                                                                                                                                    |
|  UNIX time of creation   |                                                                                                                                        The time the message was created in UNIX.                                                                                                                                         |
|        State Init        |                        The code and source data for deploying a smart contract. If the bit is set to `0`, there is no State Init. However, if it’s set to `1`, an additional bit is required to indicate whether the State Init is stored in the same cell (`0`) or written as a reference (`1`).                        |
|       Message body       | This section determines how the message body is stored. If the message body is too large to fit directly into the message, it is stored as a **reference**. In this case, the bit is set to `1` to indicate that the body is stored as a reference. If the bit is `0`, the body resides in the same cell as the message. |

Validators rewrite the above values (including src), excluding the State Init and the Message Body bits.

:::note
If the number value fits within fewer bits than is specified, then the missing zeros are added to the left side of the value. For example, 0x18 fits within 5 bits -> `11000`. However, since 6 bits were specified, the result becomes `011000`.
:::

Next, we’ll prepare a message to send Toncoins to another wallet v3. For example, let’s say a user wants to send 0.5 TON to themselves with the comment "**Hello, TON!**". To learn how to send a message with a comment, refer to this documentation section: [How to send a simple message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-simple-message).

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "@ton/core";

let internalMessageBody = beginCell()
  .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
  .storeStringTail("Hello, TON!") // write our text comment
  .endCell();
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

Above, we created an `InternalMessageBody` to store the body of our message. Note that if the text exceeds the capacity of a single Cell (1023 bits), it’s necessary to **split the data into multiple cells**, as outlined in [this documentation](/v3/documentation/smart-contracts/message-management/internal-messages). However, high-level libraries handle cell creation according to the requirements in this case, so there’s no need to worry about it at this stage.

Next, the `InternalMessage` is created according to the information we have studied earlier as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { toNano, Address } from "@ton/ton";

const walletAddress = Address.parse("put your wallet address");

let internalMessage = beginCell()
  .storeUint(0, 1) // indicate that it is an internal message -> int_msg_info$0
  .storeBit(1) // IHR Disabled
  .storeBit(1) // bounce
  .storeBit(0) // bounced
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(toNano("0.2")) // amount
  .storeBit(0) // Extra currency
  .storeCoins(0) // IHR Fee
  .storeCoins(0) // Forwarding Fee
  .storeUint(0, 64) // Logical time of creation
  .storeUint(0, 32) // UNIX time of creation
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body as a reference
  .endCell();
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

### Creating a message

We must create a `client` to retrieve our wallet smart contract's `seqno` (sequence number). This client will send a request to execute the Get method `seqno` on our wallet. Additionally, we must include the seed phrase (saved during wallet creation [here](#--external-and-internal-messages)) to sign our message. Follow these steps to proceed:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC", // you can replace it on https://testnet.toncenter.com/api/v2/jsonRPC for testnet
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = "put your mnemonic"; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(" "); // get array from string
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

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
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
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys

privateKey := ed25519.NewKeyFromSeed(k)
```

</TabItem>
</Tabs>

To proceed, we must send the `seqno`, `keys`, and `internal message`. Next, we’ll create a [message](/v3/documentation/smart-contracts/message-management/sending-messages) for our wallet and store the data in the sequence outlined at the beginning of the tutorial. This is achieved as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id | We consider this further
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  .storeUint(3, 8) // store mode of our internal message
  .storeRef(internalMessage); // store our internalMessage as a reference

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to the wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "time"
)

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id | We consider this further
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // Message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32). // store seqno
  MustStoreUInt(uint64(3), 8). // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to the wallet smart contract and sign it to get the signature

body := cell.BeginCell().
  MustStoreSlice(signature, 512). // store signature
  MustStoreBuilder(toSign). // store our message
  EndCell()
```

</TabItem>
</Tabs>

Note that no `.endCell()` was used in defining the `toSign` here. In this case, it is necessary **to transfer toSign content directly to the message body**. If writing a cell was required, it would have to be stored as a reference.

:::tip Wallet V4
In addition to the basic verification process we learned above for the Wallet V3, Wallet V4 smart contracts [extract the opcode to determine whether a simple translation or a message associated with the plugin](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L94-L100) is required. To match this version, it is necessary to add the `storeUint(0, 8).` (JS/TS), `MustStoreUInt(0, 8).` (Golang) functions after writing the **sequence number (seqno)** and before specifying the transaction mode.
:::

### External message creation

To deliver an internal message to the blockchain from the outside world, it must be sent within an external message. As previously discussed, we’ll use the `ext_in_msg_info$10` structure since our goal is to send an external message to our contract. Now, let’s create the external message that will be sent to our wallet:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
let externalMessage = beginCell()
  .storeUint(0b10, 2) // 0b10 -> 10 in binary
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
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

|    Option    |                                                                                                                      Explanation                                                                                                                      |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     Src      | The sender address. Since an incoming external message cannot have a sender, there will always be 2 zero bits (an addr_none [TL-B](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L100)). |
|  Import Fee  |                                                                                                   The fee for importing incoming external messages.                                                                                                   |
|  State Init  |                Unlike the Internal Message, the State Init within the external message is needed **to deploy a contract from the outside world**. The State Init used with the Internal Message allows one contract to deploy another.                |
| Message Body |                                                                                               The message must be sent to the contract for processing.                                                                                                |

:::tip 0b10
0b10 (b - binary) denotes a binary record. Two bits are stored in this process: `1` and `0`. Thus, we specify that it's `ext_in_msg_info$10`.
:::

Now that we have a completed message ready to send to our contract, the next step is to serialize it into a `BoC` ([bag of cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)). Once serialized, we can send it using the following code:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
console.log(externalMessage.toBoc().toString("base64"));

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
> More about [Bag of cells](/v3/documentation/data-formats/tlb/cell-boc#bag-of-cells)

As a result, we got the output of our BOC in the console, and the message was sent to our wallet. By copying the base64 encoded string, it is possible to [manually send our message and retrieve the hash using toncenter](https://toncenter.com/api/v2/#/send/send_boc_return_hash_sendBocReturnHash_post).

## 👛 Deploying a wallet

We’ve covered the basics of creating messages to help us deploy a wallet. Previously, we deployed wallets using wallet apps, but we’ll deploy our wallet manually this time.

In this section, we’ll walk through creating a wallet (wallet v3) from scratch. You’ll learn how to compile the wallet smart contract code, generate a mnemonic phrase, obtain a wallet address, and deploy the wallet using external messages and State Init (state initialization).

### Generating a mnemonic

The first step in creating a wallet is generating a `private` and `public` key. We’ll generate a mnemonic seed phrase and extract the keys using cryptographic libraries.

Here’s how to accomplish this:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { mnemonicToWalletKey, mnemonicNew } from "@ton/crypto";

// const mnemonicArray = 'put your mnemonic'.split(' ') // get our mnemonic as array
const mnemonicArray = await mnemonicNew(24); // 24 is the number of words in a seed phrase
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic
console.log(mnemonicArray); // if we want, we can print our mnemonic
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

// mnemonic := strings.Split("put your mnemonic", " ") // get our mnemonic as array
mnemonic := wallet.NewSeed() // get new mnemonic

// The following three lines will extract the private key using the mnemonic phrase. We will not go into cryptographic details. It has all been implemented in the tonutils-go library, but it immediately returns the finished wallet object with the address and ready methods. So we’ll have to write the lines to get the key separately. Goland IDE will automatically import all required libraries (crypto, pbkdf2, and others).
mac := hmac.New(sha512.New, []byte(strings.Join(mnemonic, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len

privateKey := ed25519.NewKeyFromSeed(k) // get private key
publicKey := privateKey.Public().(ed25519.PublicKey) // get public key from private key
log.Println(publicKey) // print publicKey so that at this stage, the compiler does not complain that we do not use our variable
log.Println(mnemonic) // if we want, we can print our mnemonic
```

</TabItem>
</Tabs>

The private key is needed to sign messages, and the public key is stored in the wallet’s smart contract.

:::danger IMPORTANT
Make sure to output the generated mnemonic seed phrase to the console, save it, and use it (as detailed in the previous section) to ensure the same key pair is used each time the wallet’s code is run.
:::

### Subwallet IDs

One of the most notable benefits of wallets being smart contracts is the ability to create **a vast number of wallets** using just one private key. This is because the addresses of smart contracts on TON Blockchain are computed using several factors, including the `stateInit`. The stateInit contains the `code` and `initial data`, which is stored in the blockchain’s smart contract storage.

Changing just one bit within the stateInit can generate a different address. That is why the `subwallet_id` was initially created. The `subwallet_id` is stored in the contract storage and can be used to create many different wallets (with different subwallet IDs) with one private key. This functionality can be handy when integrating various wallet types with centralized services such as exchanges.

The default `subwallet_id` value is `698983191`, as per the [line of code](https://github.com/ton-blockchain/ton/blob/4b940f8bad9c2d3bf44f196f6995963c7cee9cc3/tonlib/tonlib/TonlibClient.cpp#L2420) below taken from the TON Blockchain’s source code:

```cpp
res.wallet_id = td::as<td::uint32>(res.config.zero_state_id.root_hash.as_slice().data());
```

It is possible to retrieve genesis block information (zero_state) from the [configuration file](https://ton.org/global-config.json). Understanding the complexities and details of this is not necessary, but it's important to remember that the default value of the `subwallet_id` is `698983191`.

Each wallet contract checks the `subwallet_id` field for external messages to avoid instances where requests are sent to a wallet with another ID:

```func
var (subwallet_id, valid_until, msg_seqno) = (cs~load_uint(32), cs~load_uint(32), cs~load_uint(32));
var (stored_seqno, stored_subwallet, public_key) = (ds~load_uint(32), ds~load_uint(32), ds~load_uint(256));
throw_unless(34, subwallet_id == stored_subwallet);
```

We will need to add the above value to the initial data of the contract, so the variable needs to be saved as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subWallet = 698983191;
```

</TabItem>
<TabItem value="go" label="Golang">

```go
var subWallet uint64 = 698983191
```

</TabItem>
</Tabs>

### Compiling wallet code

Now that the private and public keys and the `subwallet_id` are clearly defined, we must compile the wallet code. We’ll use the [wallet v3 code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc) from the official repository.

The [@ton-community/func-js](https://github.com/ton-community/func-js) library is necessary to compile wallet code. This library allows us to compile FunC code and retrieve a cell containing the code. To get started, install the library and save it to the `package.json` as follows:

```bash
npm i --save @ton-community/func-js
```

We’ll only use JavaScript to compile code, as the libraries for compiling code are JavaScript-based. However, after compiling is finalized, as long as we have our cell's **base64 output**, it is possible to use this compiled code in languages such as Go and others.

First, we must create two files: `wallet_v3.fc` and `stdlib.fc`. The compiler relies on the `stdlib.fc` library, which contains all the necessary basic functions corresponding to `asm` instructions. You can download the `stdlib.fc` file [here](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc). For the `wallet_v3.fc` file, copy the code from the repository.

Now, we have the following structure for the project we are creating:

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
It’s OK if your IDE plugin conflicts with the `() set_seed(int) impure asm "SETRAND";` in the `stdlib.fc` file.
:::

Remember to add the following line to the beginning of the `wallet_v3.fc` file to indicate that the functions from the stdlib will be used below:

```func
#include "stdlib.fc";
```

Now let’s write code to compile our smart contract and run it using `npm run start:dev`:

```js
import { compileFunc } from "@ton-community/func-js";
import fs from "fs"; // we use fs for reading content of files
import { Cell } from "@ton/core";

const result = await compileFunc({
  targets: ["wallet_v3.fc"], // targets of your project
  sources: {
    "stdlib.fc": fs.readFileSync("./src/stdlib.fc", { encoding: "utf-8" }),
    "wallet_v3.fc": fs.readFileSync("./src/wallet_v3.fc", {
      encoding: "utf-8",
    }),
  },
});

if (result.status === "error") {
  console.error(result.message);
  return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0]; // get buffer from base64 encoded BOC and get cell from this buffer

// now we have base64 encoded BOC with compiled code in the result.codeBoc
console.log("Code BOC: " + result.codeBoc);
console.log("\nHash: " + codeCell.hash().toString("base64")); // get the hash of cell and convert it to base64 encoded string. We will need it further
```

The result will be the following output in the terminal:

```text
Code BOC: te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A==

Hash: idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

Once this process is complete, you can retrieve the same cell (using the base64 encoded output) containing our wallet code using other libraries and languages:

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

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type, and output to the terminal
```

</TabItem>
</Tabs>

The result will be the following output in the terminal:

```text
idlku00WfSC36ujyK2JVT92sMBEpCNRUXOGO4sJVBPA=
```

After the above processes are complete, the hashes match, confirming that the correct code is used within our cell.

### Creating the state init for deployment

Before building a message, it is essential to understand what a State Init is. First, let’s go through the [TL-B scheme](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L141-L143):

|   Option    |                                                                                                                                                                                                                 Explanation                                                                                                                                                                                                                  |
| :---------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| split_depth |         This option is designed for highly loaded smart contracts that can be split and distributed across multiple [shardchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#many-accountchains-shards). For more details on how this works, refer to the [tblkch.pdf](https://ton.org/tblkch.pdf) (section 4.1.6). Since this feature is not needed for wallet smart contracts, only a `0` bit is stored.          |
|   special   | This option is used for **TicTok** smart contracts that are automatically triggered for each block. Regular smart contracts, such as wallets, do not require this functionality. For more details, refer to [this section](/v3/documentation/data-formats/tlb/transaction-layout#tick-tock) or the [tblkch.pdf](https://ton.org/tblkch.pdf) (section 4.1.6). Since this feature is unnecessary for our use case, only a `0` bit is stored. |
|             |
|    code     |                                                                                                                                                                                    `1` bit means the presence of the smart contract code as a reference.                                                                                                                                                                                     |
|    data     |                                                                                                                                                                                    `1` bit means the presence of the smart contract data as a reference.                                                                                                                                                                                     |
|   library   |                      This option refers to a library that operates on the [MasterChain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#masterchain-blockchain-of-blockchains) and can be shared across multiple smart contracts. Since wallets do not require this functionality, its bit is set to `0`. For more information, refer to [tblkch.pdf](https://ton.org/tblkch.pdf) (section 1.8.4).                       |

Next, we’ll prepare the `initial data`, which will be present in our contract’s storage immediately after deployment:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell } from "@ton/core";

const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(698983191, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();
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

The contract `code` and its `initial data` are present at this stage. With this data, we can produce our **wallet address**. The wallet's address depends on the State Init, which includes the code and initial data.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

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

We can build and send the message to the blockchain using the State Init.

:::warning
Keep in mind this concept for your services
:::

To carry out this process, **a minimum wallet balance of 0.1 TON** is required (the balance can be less, but this amount is guaranteed sufficient). To accomplish this, we’ll need to run the code mentioned earlier in the tutorial, obtain the correct wallet address, and send 0.1 TON to this address. Alternatively, you can send this sum manually via your wallet app before sending the deployment message.

Deployment by external messages is presented here primarily for educational purposes; in practice, it's much more convenient to [deploy smart contracts via wallets](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet), which will be described later.

Let’s start with building a message similar to the one we built **in the previous section**:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";
import { toNano } from "@ton/core";

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(
    Address.parse("put your first wallet address from were you sent 0.1 TON")
  )
  .storeCoins(toNano("0.03"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1, which means we have a body as a reference
  .storeRef(internalMessageBody)
  .endCell();

// message for our wallet
const toSign = beginCell()
  .storeUint(subWallet, 32)
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32)
  .storeUint(0, 32) // We put seqno = 0 because after deploying wallet will store 0 as seqno
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), keyPair.secretKey);
const body = beginCell().storeBuffer(signature).storeBuilder(toSign).endCell();
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
  MustStoreAddr(address.MustParseAddr("put your first wallet address from where you sent 0.1 TON")).
  MustStoreBigCoins(tlb.MustFromTON("0.03").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1, which means we have a body as a reference
  MustStoreRef(internalMessageBody).
  EndCell()

// message for our wallet
toSign := cell.BeginCell().
  MustStoreUInt(subWallet, 32).
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32).
  MustStoreUInt(0, 32). // We put seqno = 0 because after deploying, the wallet will store 0 as seqno
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

Once this process is complete, the result is a properly constructed State Init and Message Body.

### Sending an external message

The **main difference** lies in including the external message, as the State Init is stored to ensure proper contract deployment. Since the contract doesn’t yet have its code, it cannot process internal messages. Therefore, we send its code and initial data, enabling it to process our message with the "Hello, TON!" comment **after successful deployment**.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicates that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(contractAddress)
  .storeCoins(0) // Import fee
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();
```

</TabItem>
<TabItem value="go" label="Golang">

```go
externalMessage := cell.BeginCell().
  MustStoreUInt(0b10, 2). // indicates that it is an incoming external message
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

Finally, we can send our message to the blockchain to deploy our wallet and use it.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
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

Note that we sent an internal message using mode `3`. If you must redeploy the same wallet, **the smart contract can be destroyed**. To do this, set the [mode](/v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode160/) to `160` by adding `128` (take the entire balance of the smart contract) + `32` (destroy the smart contract). This will retrieve the remaining TON balance and allow you to deploy the wallet again.

Remember that for each new transaction, the `seqno` must be incremented by one.

:::info
The contract code we used is [verified](https://tonscan.org/tx/BL9T1i5DjX1JRLUn4z9JOgOWRKWQ80pSNevis26hGvc=), so you can see an example [here](https://tonscan.org/address/EQDBjzo_iQCZh3bZSxFnK9ue4hLTOKgsCNKfC8LOUM4SlSCX#source).
:::

## 💸 Working with wallet smart contracts

After completing the first half of this tutorial, we’ve gained a deeper understanding of wallet smart contracts, including how they are developed and used. We’ve also learned how to deploy and destroy them and how to send messages without relying on pre-configured library functions. The next section will focus on building and sending more complex messages to apply what we've learned further.

### Sending multiple messages simultaneously

As you already know, [a single cell can store up to 1023 bits of data and up to 4 references](/v3/documentation/data-formats/tlb/cell-boc#cell) to other cells. In the first section of this tutorial, we explained how internal messages are delivered in a ‘whole’ loop as a link and sent. This means it’s possible to **store up to 4 internal messages within an external message**, allowing four messages to be sent simultaneously.

To accomplish this, we need to create four different internal messages. We can do this manually or through a `loop`. We need to define three arrays: an array of TON amount, an array of comments, and an array of messages. For messages, we need to prepare another array - internalMessages.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const internalMessagesAmount = ["0.01", "0.02", "0.03", "0.04"];
const internalMessagesComment = [
  "Hello, TON! #1",
  "Hello, TON! #2",
  "", // Let's leave the third message without comment
  "Hello, TON! #4",
];
const destinationAddresses = [
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
  "Put any address that belongs to you",
]; // All 4 addresses can be the same

let internalMessages: Cell[] = []; // array for our internal messages
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
  "", // Let's leave the third message without comment
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

[Sending mode](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes) for all messages is set to `mode 3`. However, an array can be created to fulfill different purposes if different modes are required.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "@ton/core";

for (let index = 0; index < internalMessagesAmount.length; index++) {
  const amount = internalMessagesAmount[index];

  let internalMessage = beginCell()
    .storeUint(0x18, 6) // bounce
    .storeAddress(Address.parse(destinationAddresses[index]))
    .storeCoins(toNano(amount))
    .storeUint(0, 1 + 4 + 4 + 64 + 32 + 1);

  /*
It’s unclear whether we’ll have a message body at this stage. Therefore, we’ll only set a bit for the `stateInit`. If we include a comment, it means we have a message body. In that case, set the bit to `1` and store the body as a reference.
 */

  if (internalMessagesComment[index] != "") {
    internalMessage.storeBit(1); // we store Message Body as a reference

    let internalMessageBody = beginCell()
      .storeUint(0, 32)
      .storeStringTail(internalMessagesComment[index])
      .endCell();

    internalMessage.storeRef(internalMessageBody);
  } else internalMessage.storeBit(0);
  /*
 Since we do not have a message body, we indicate that 
 the message body is in this message but do not write it, 
 which means it is absent. In that case, just set the bit to 0.
 */

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
It’s unclear whether we’ll have a message body at this stage. Therefore, we’ll only set a bit for the `stateInit`. If we include a comment, it means we have a message body. In that case, set the bit to `1` and store the body as a reference.
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
 the message body is in this message but do not write it,
 which means it is absent. In that case, just set the bit to 0.
 */
    internalMessage.MustStoreBoolBit(false)
 }
  internalMessages[i] = internalMessage.EndCell()
}
```

</TabItem>
</Tabs>

Now let's use our knowledge from [chapter two](/v3/guidelines/smart-contracts/howto/wallet#-deploying-a-wallet) to build a message for our wallet that can send four messages simultaneously:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

const walletAddress = Address.parse("put your wallet address");
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const mnemonic = "put your mnemonic"; // word1 word2 word3
let getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
let seqno = getMethodResult.stack.readNumber(); // get seqno from response

const mnemonicArray = mnemonic.split(" "); // get array from string
const keyPair = await mnemonicToWalletKey(mnemonicArray); // get Secret and Public keys from mnemonic

let toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32); // store seqno
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
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len
privateKey := ed25519.NewKeyFromSeed(k)              // get private key

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
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
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
```

</TabItem>
</Tabs>

Next, we’ll add the messages that we built earlier in the loop:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
for (let index = 0; index < internalMessages.length; index++) {
  const internalMessage = internalMessages[index];
  toSign.storeUint(3, 8); // store mode of our internal message
  toSign.storeRef(internalMessage); // store our internalMessage as a reference
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
for i := 0; i < len(internalMessages); i++ {
    internalMessage := internalMessages[i]
    toSign.MustStoreUInt(3, 8) // store mode of our internal message
    toSign.MustStoreRef(internalMessage) // store our internalMessage as a reference
}
```

</TabItem>
</Tabs>

Now that the above processes are complete, let’s **sign** our message, **build an external message** (as outlined in previous sections of this tutorial), and **send it** to the blockchain:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { sign } from "@ton/crypto";

let signature = sign(toSign.endCell().hash(), keyPair.secretKey); // get the hash of our message to the wallet smart contract and sign it to get signature

let body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();

let externalMessage = beginCell()
  .storeUint(0b10, 2) // ext_in_msg_info$10
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress) // Destination address
  .storeCoins(0) // Import Fee
  .storeBit(0) // No State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();

client.sendFile(externalMessage.toBoc());
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "github.com/xssnick/tonutils-go/tl"
)

signature := ed25519.Sign(privateKey, toSign.EndCell().Hash()) // get the hash of our message to the wallet smart contract and sign it to get the signature

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
If an error related to the lite-server connection (in Golang) occurs, you may need to run the code repeatedly until the message is successfully sent. This happens because the `tonutils-go` library uses multiple lite-servers from the global configuration specified in the code. However, not all lite-servers may accept the connection.
:::

After completing this process, you can use a TON blockchain explorer to verify that the wallet sent four messages to the specified addresses.

### NFT transfers

In addition to regular messages, users often send NFTs to each other. Unfortunately, not all libraries specifically use methods for interacting with this type of smart contract. As a result, we need to write code that allows us to construct messages for sending NFTs. First, let’s familiarize ourselves with the TON NFT [standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md).

Specifically, we need to thoroughly understand the TL-B schema for [NFT Transfers](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer).

- `query_id`: Query ID has no value in message processing. The NFT contract doesn't validate it; it only reads it. This value can be helpful when a service wants to assign a specific query ID to each message for identification purposes. Therefore, we will set it to 0.

- `response_destination`: After processing the ownership change message, there will be extra TONs. If specified, they will be sent to this address; otherwise, they will remain on the NFT balance.

- `custom_payload`: The custom_payload is used for specific tasks and is not typically required for ordinary NFTs.

- `forward_amount`: If the forward_amount isn’t zero, the specified TON amount will be sent to the new owner, who will then be notified that they received something.

- `forward_payload`: The forward_payload is additional data that can be sent to the new owner along with the `forward_amount`. For example, the forward_payload allows users to [add a comment during the transfer of an NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#forward_payload-format), as demonstrated earlier in the tutorial. However, despite being part of TON’s NFT standard, blockchain explorers do not fully support displaying these details. A similar issue exists when displaying Jettons.

Now, let's build the message itself:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, toNano } from "@ton/core";

const destinationAddress = Address.parse(
  "put your wallet where you want to send NFT"
);
const walletAddress = Address.parse(
  "put your wallet, which is the owner of NFT."
);
const nftAddress = Address.parse("put your nft address");

// We can add a comment, but it will not be displayed in the explorers,
// as they do not support it at the time of writing the tutorial.
const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Hello, TON!")
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32) // Opcode for NFT transfer
  .storeUint(0, 64) // query_id
  .storeAddress(destinationAddress) // new_owner
  .storeAddress(walletAddress) // response_destination for excesses
  .storeBit(0) // we do not have custom_payload
  .storeCoins(toNano("0.01")) // forward_amount
  .storeBit(1) // we store forward_payload as a reference
  .storeRef(forwardPayload) // store forward_payload as a .reference
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x18, 6) // bounce
  .storeAddress(nftAddress)
  .storeCoins(toNano("0.05"))
  .storeUint(1, 1 + 4 + 4 + 64 + 32 + 1 + 1) // We store 1, which means we have the body as a reference
  .storeRef(transferNftBody)
  .endCell();
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
// as they do not support it at the time of writing the tutorial.
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
  MustStoreBigCoins(tlb.MustFromTON("0.01").NanoTON()). // forward_amount
  MustStoreBoolBit(true). // we store forward_payload as a reference
  MustStoreRef(forwardPayload). // store forward_payload as a reference
  EndCell()

internalMessage := cell.BeginCell().
  MustStoreUInt(0x18, 6). // bounce
  MustStoreAddr(nftAddress).
  MustStoreBigCoins(tlb.MustFromTON("0.05").NanoTON()).
  MustStoreUInt(1, 1 + 4 + 4 + 64 + 32 + 1 + 1). // We store 1, which means we have the body as a reference
  MustStoreRef(transferNftBody).
  EndCell()
```

</TabItem>
</Tabs>

The NFT transfer opcode comes from [the same standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#tl-b-schema).
Now, let's complete the message as laid out in this tutorial's previous sections. The correct code to complete the message is in the [GitHub repository](/v3/guidelines/smart-contracts/howto/wallet#-source-code).

The same procedure can also be applied to Jettons. To carry out this process, refer to the TL-B [standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) for Jettons transfers. It’s important to note that a slight difference exists between NFT and Jettons transfers.

### Wallet v3 and wallet v4 get methods

Smart contracts often use [GET methods](/v3/guidelines/smart-contracts/get-methods). However, they don’t run inside the blockchain but on the client side. GET methods have many uses and provide accessibility to different data types for smart contracts. For example, the [get_nft_data() method in NFT smart contracts](https://github.com/ton-blockchain/token-contract/blob/991bdb4925653c51b0b53ab212c53143f71f5476/nft/nft-item.fc#L142-L145) allows users to retrieve specific content, owner, and NFT collection information.

Below we’ll learn more about the basics of GET methods used with [V3](https://github.com/ton-blockchain/ton/blob/e37583e5e6e8cd0aebf5142ef7d8db282f10692b/crypto/smartcont/wallet3-code.fc#L31-L41) and [V4](https://github.com/ton-blockchain/wallet-contract/blob/4111fd9e3313ec17d99ca9b5b1656445b5b49d8f/func/wallet-v4-code.fc#L164-L198). Let’s start with the methods that are the same for both wallet versions:

|        Method        |                                                                                                       Explanation                                                                                                       |
| :------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     int seqno()      |                     This method is essential for retrieving the current seqno and sending messages with the correct value. In previous sections of this tutorial, we frequently called this method.                     |
| int get_public_key() | This method retrieves the public key. While get_public_key() is not widely used, various services can utilize it. For example, some API services allow retrieving multiple wallets associated with the same public key. |

Now, let’s move to the methods that only the V4 wallet makes use of:

|                     Method                     |                                                                                                                  Explanation                                                                                                                   |
| :--------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|             int get_subwallet_id()             |                                                                          Earlier in the tutorial, we considered this. This method allows you to retrive subwallet_id.                                                                          |
| int is_plugin_installed(int wc, int addr_hash) | Let us know if the plugin has been installed. To call this method, you need to pass the [workchain](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules) and the plugin address hash. |
|            tuple get_plugin_list()             |                                                                                           This method returns the address of the installed plugins.                                                                                            |

Let’s consider the `get_public_key` and the `is_plugin_installed` methods. These two methods were chosen because we would first have to get a public key from 256 bits of data, and then we would have to learn how to pass a slice and different types of data to GET methods. This is very useful to help us learn how to properly use these methods.

First, we need a client who is capable of sending requests. Therefore, we’ll use a specific wallet address ([EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF](https://tonscan.org/address/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF)) as an example:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { Address } from "@ton/core";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletAddress = Address.parse(
  "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"
); // my wallet address as an example
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

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletAddress := address.MustParseAddr("EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF") // my wallet address as an example
```

</TabItem>
</Tabs>

Now, we need to call the GET method wallet.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
// I always call runMethodWithError instead of runMethod to be able to check the exit_code of the called method.
let getResult = await client.runMethodWithError(
  walletAddress,
  "get_public_key"
); // run get_public_key GET Method
const publicKeyUInt = getResult.stack.readBigNumber(); // read answer that contains uint256
const publicKey = publicKeyUInt.toString(16); // get hex string from bigint (uint256)
console.log(publicKey);
```

</TabItem>
<TabItem value="go" label="Golang">

```go
getResult, err := client.RunGetMethod(context.Background(), block, walletAddress, "get_public_key") // run get_public_key GET Method
if err != nil {
  log.Fatalln("RunGetMethod err:", err.Error())
  return
}

// We have a response as an array with values and should specify the index when reading it
// In the case of get_public_key, we have only one returned value that is stored at 0 index
publicKeyUInt := getResult.MustInt(0) // read answer that contains uint256
publicKey := publicKeyUInt.Text(16)   // get hex string from bigint (uint256)
log.Println(publicKey)
```

</TabItem>
</Tabs>

After the call is successfully completed, the end result is an extremely large 256-bit number that must be translated into a hex string. The resulting hex string for the wallet address we provided above is as follows: `430db39b13cf3cb76bfa818b6b13417b82be2c6c389170fbe06795c71996b1f8`.
Next, we leverage the [TonAPI](https://docs.tonconsole.com/tonapi/rest-api) (/v1/wallet/findByPubkey method) by inputting the obtained hex string into the system. It is immediately clear that the first element in the array within the answer will identify my wallet.

Then, we switch to the `is_plugin_installed` method. As an example, we’ll again use the wallet we used earlier ([EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k](https://tonscan.org/address/EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k)) and the plugin ([EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ](https://tonscan.org/address/EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ)):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const oldWalletAddress = Address.parse(
  "EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k"
); // my old wallet address
const subscriptionAddress = Address.parseFriendly(
  "EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ"
); // subscription plugin address, which is already installed on the wallet
```

</TabItem>
<TabItem value="go" label="Golang">

```go
oldWalletAddress := address.MustParseAddr("EQAM7M--HGyfxlErAIUODrxBA3yj5roBeYiTuy6BHgJ3Sx8k")
subscriptionAddress := address.MustParseAddr("EQBTKTis-SWYdupy99ozeOvnEBu8LRrQP_N9qwOTSAy3sQSZ") // subscription plugin address which is already installed on the wallet
```

</TabItem>
</Tabs>

Now, we need to retrieve the plugin’s hash address to translate it into a number and send it to the GET Method.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const hash = BigInt(`0x${subscriptionAddress.address.hash.toString("hex")}`);

getResult = await client.runMethodWithError(
  oldWalletAddress,
  "is_plugin_installed",
  [
    { type: "int", value: BigInt("0") }, // pass workchain as int
    { type: "int", value: hash }, // pass plugin address hash as int
  ]
);
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

The response must be `-1`, meaning the result is `true`. It is also possible to send a slice and a cell if required. It would be enough to create and transfer a Slice or Cell instead of using the BigInt, specifying the appropriate type.

### Contract deployment via wallet

In chapter three, we deployed a wallet. To accomplish this, we initially sent some TON and a message from the wallet to deploy a smart contract. However, this process is not broadly used with external messages and is often used mainly for wallets. While developing contracts, the deployment process is initialized by sending internal messages.

To achieve this, we’ll use the V3R2 wallet smart contract introduced in [the third chapter](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code). In this case, we’ll set the `subwallet_id` to `3` or any other number required to generate a different address while using the same private key (this value is customizable):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { beginCell, Cell } from "@ton/core";
import { mnemonicToWalletKey } from "@ton/crypto";

const mnemonicArray = "put your mnemonic".split(" ");
const keyPair = await mnemonicToWalletKey(mnemonicArray); // extract private and public keys from mnemonic

const codeCell = Cell.fromBase64(
  "te6ccgEBCAEAhgABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQCW8oMI1xgg0x/TH9MfAvgju/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOgwAaTIyx/LH8v/ye1UAATQMAIBSAYHABe7Oc7UTQ0z8x1wv/gAEbjJftRNDXCx+A=="
);
const dataCell = beginCell()
  .storeUint(0, 32) // Seqno
  .storeUint(3, 32) // Subwallet ID
  .storeBuffer(keyPair.publicKey) // Public Key
  .endCell();

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();
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
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
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

Next, we’ll retrieve the address from our contract and build the Internal Message. We'll also add the "Deploying..." comment to our message.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, toNano } from "@ton/core";

const contractAddress = new Address(0, stateInit.hash()); // get the hash of stateInit to get the address of our smart contract in workchain with ID 0
console.log(`Contract address: ${contractAddress.toString()}`); // Output contract address to console

const internalMessageBody = beginCell()
  .storeUint(0, 32)
  .storeStringTail("Deploying...")
  .endCell();

const internalMessage = beginCell()
  .storeUint(0x10, 6) // no bounce
  .storeAddress(contractAddress)
  .storeCoins(toNano("0.01"))
  .storeUint(0, 1 + 4 + 4 + 64 + 32)
  .storeBit(1) // We have State Init
  .storeBit(1) // We store State Init as a reference
  .storeRef(stateInit) // Store State Init as a reference
  .storeBit(1) // We store Message Body as a reference
  .storeRef(internalMessageBody) // Store Message Body Init as a reference
  .endCell();
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
Note that the bits have been specified above and that the stateInit and internalMessageBody have been saved as references.
:::

Since the links are stored separately, we could write:

```tlb
4 (0b100) + 2 (0b10) + 1 (0b1) -> (4 + 2 + 1, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
```

Tha also means:

```tlb
(0b111, 1 + 4 + 4 + 64 + 32 + 1 + 1 + 1)
```
Then, save two references.


Next, we’ll prepare a message for our wallet and send it:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { sign } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = "put your mnemonic".split(" ");
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const walletAddress = Address.parse("put the wallet address you will deploy.");
const getMethodResult = await client.runMethod(walletAddress, "seqno"); // run "seqno" GET method from your wallet contract
const seqno = getMethodResult.stack.readNumber(); // get seqno from response

// message for our wallet
const toSign = beginCell()
  .storeUint(698983191, 32) // subwallet_id
  .storeUint(Math.floor(Date.now() / 1e3) + 60, 32) // Message expiration time, +60 = 1 minute
  .storeUint(seqno, 32) // store seqno
  // Do not forget that if we use Wallet V4, we need to add .storeUint(0, 8)
  .storeUint(3, 8)
  .storeRef(internalMessage);

const signature = sign(toSign.endCell().hash(), walletKeyPair.secretKey); // get the hash of our message to wallet smart contract and sign it to get signature
const body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();

const external = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(walletAddress)
  .storeCoins(0) // Import fee
  .storeBit(0) // We do not have State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();

console.log(external.toBoc().toString("base64"));
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

block, err := client.CurrentMasterchainInfo(context.Background()) // get the current block, we will need it in requests to LiteServer
if err != nil {
  log.Fatalln("CurrentMasterchainInfo err:", err.Error())
  return
}

walletMnemonicArray := strings.Split("put your mnemonic", " ")
mac = hmac.New(sha512.New, []byte(strings.Join(walletMnemonicArray, " ")))
hash = mac.Sum(nil)
k = pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
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
  MustStoreUInt(uint64(time.Now().UTC().Unix()+60), 32). // message expiration time, +60 = 1 minute
  MustStoreUInt(seqno.Uint64(), 32).                     // store seqno
  // Do not forget that if we use Wallet V4, we need to add MustStoreUInt(0, 8).
  MustStoreUInt(3, 8).          // store mode of our internal message
  MustStoreRef(internalMessage) // store our internalMessage as a reference

signature := ed25519.Sign(walletPrivateKey, toSign.EndCell().Hash()) // get the hash of our message to the wallet smart contract and sign it to get the signature

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

This concludes our work with ordinary wallets. At this stage, you should have a strong understanding of how to interact with wallet smart contracts, send messages, and be able to use various library types.

## 🔥 High-load wallet v3

You’ll need a specialized wallet called a **High-Load Wallet** to handle many messages quickly. High-Load Wallet V2 was the primary wallet on TON for a long time, but it required careful handling. Otherwise, you risk [locking all funds](https://t.me/tonstatus/88).

[With the introduction of High-Load Wallet V3](https://github.com/ton-blockchain/highload-wallet-contract-v3), this issue has been resolved at the contract architecture level, and it consumes less gas. This chapter will cover the basics of High-Load Wallet V3 and highlight important nuances to keep in mind.

:::note
We will work [with a slightly modified version of wrapper](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts) for the contract, as it protects against some non-obvious mistakes.
:::

### Storage structure

First of all, [TL-B schema](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/scheme.tlb#L1C1-L3C21) will help us in learning the structure of the contract storage:

```
storage$_ public_key:bits256 subwallet_id:uint32 old_queries:(HashmapE 14 ^Cell)
 queries:(HashmapE 14 ^Cell) last_clean_time:uint64 timeout:uint22
 = Storage;
```

:::tip TL-B
You can read more about TL-B [here](/v3/documentation/data-formats/tlb/tl-b-language).
:::

In the contract storage, we can find the following fields:

|      Field      |                                                                                                 Description                                                                                                 |
| :-------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   public_key    |                                                                                         Public key of the contract.                                                                                         |
|  subwallet_id   |                                                        [Wallet ID](#subwallet-ids). It allows you to create many wallets using the same public key.                                                         |
|   old_queries   |                                                   Old queries that have already been processed and are outdated. They are moved here after each timeout.                                                    |
|     queries     |                                                                         Queries that have been processed but are not yet outdated.                                                                          |
| last_clean_time | The time of the last cleanup. If `last_clean_time < (now() - timeout)`, old queries are moved to `old_queries`. If `last_clean_time < (now() - 2 * timeout)`, both `old_queries` and `queries` are cleared. |
|     timeout     |                                                                          The time after which queries are moved to `old_queries`.                                                                           |

We’ll explore how to work with processed queries in more detail in the [Replay protection](#replay-protection) section.

### Shifts and bits numbers as query id

The Query ID is a number that consists of two parts: shift and bit_number:

```func.
int shift = msg_inner_slice~load_uint(KEY_SIZE);
int bit_number = msg_inner_slice~load_uint(BIT_NUMBER_SIZE);
```

The core idea is that each Query ID now occupies only 1 bit in the dictionary while typically avoiding an increase in gas consumption.

To start, the contract, using shift, tries to get the cell at that index in the `old_queries` dictionary:

```func
(cell value, int found) = old_queries.udict_get_ref?(KEY_SIZE, shift);
```

If such a cell is found, it skips `bit_number` bits to reach the bit at index `bit_number` (it’s important to distinguish between `bit_number` as a quantity and `bit_number` as an index). If the bit is set, it means a query with that Query ID has already been processed, and the contract throws an error:

```func
if (found) {
 slice value_slice = value.begin_parse();
 value_slice~skip_bits(bit_number);
 throw_if(error::already_executed, value_slice.preload_int(1));
}
```

The next step is to search the `queries` dictionary:

```func
(cell value, int found) = queries.udict_get_ref?(KEY_SIZE, shift);
```

If such a cell is found, the contract splits it into two parts: `0...bit_number-1` (head) and `bit_number...1023` (tail). It then reads one bit from the beginning of the tail (this bit corresponds to the `bit_number` variable when counting from 0, i.e., it represents the index of the required bit). If the bit is set to `1`, the request with that Query ID has already been processed, and the contract throws an error. Otherwise, the contract sets the bit to `1`, merges the pieces back into a single cell, and writes it back into the `queries` dictionary:

```func
builder new_value = null();
if (found) {
 slice value_slice = value.begin_parse();
 (slice tail, slice head) = value_slice.load_bits(bit_number);
 throw_if(error::already_executed, tail~load_int(1));
 new_value = begin_cell().store_slice(head).store_true().store_slice(tail);
} else {
 new_value = begin_cell().store_zeroes(bit_number).store_true().store_zeroes(CELL_BITS_SIZE - bit_number - 1);
}
```

:::note
If you [familiarize yourself](/v3/documentation/tvm/instructions) with the operation of the `LDSLICEX` opcode (used by the `load_bits` function), you’ll notice that the read data is returned first (head), followed by the remaining data (tail). However, in the contract code, they appear in reverse order.

This happens because, in the stdlib function signature, the returned data [is ordered differently](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/contracts/imports/stdlib.fc#L321): `(slice, slice) load_bits(slice s, int len) asm(s len -> 1 0) "LDSLICEX";`. Here, `-> 1 0` indicates that the argument with index `1` (tail) is returned first, followed by the argument with index `0` (head).
:::

In practice, we’re working with a matrix where `shift` represents the row index and `bit_number` represents the column index. This structure allows us to store up to 1023 queries in a single cell, meaning gas consumption only increases every 1023 queries when a new cell is added to the dictionary. However, this efficiency depends on the sequential growth of values, not random ones. Therefore, it’s crucial to increment the Query ID properly [using a dedicated class for this purpose](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadQueryId.ts).

This approach allows storing massive requests per timeout (1023 \* 8192 = 8,380,416). Still, you may notice that [the class HighloadQueryId supports 8,380,415](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadQueryId.ts#L32). This is to ensure that there will always be 1 bit left for one emergency timeout request if the entire limit is exhausted. This value is set because of the [limit on the maximum possible number of cells in an account stack](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/block/mc-config.h#L395) on the blockchain (as of this writing).

For every cell that can hold 1023 requests, 2 cells in the dictionary are spent (one to store the key, the other for the value). If we take the current maximum shift value, the theoretical maximum is 8192 \* 2 \* 2 (we have two dictionaries: queries and old_queries) = 32,768 cells. If you increase the key size by a bit, it will no longer fit within the current limits.

:::info
In High-Load V2, each Query ID (64-bit) was stored in a separate cell within the dictionary, combining two 32-bit fields: `expire_at` and `query_id`. This approach caused gas consumption to grow rapidly when clearing old queries.
:::

### Replay protection

As we know that external messages in TON [have no sender and can be sent by anyone in the network](#replay-protection---seqno), it is essential to have a list of processed requests to avoid re-processing. For this purpose, High-Load Wallet V3 uses the `queries` and `old_queries` dictionaries and the `last_clean_time` and `timeout` values.

After the contract has completely retrieved all the data it needs from its storage, it checks when the last query dictionary cleanup occurred. If it was more than the `timeout` time ago, the contract moves all queries from queries to old_queries. If the last cleanup was more than `timeout * 2` times ago, the contract cleans up old_queries in addition:

```func
if (last_clean_time < (now() - timeout)) {
 (old_queries, queries) = (queries, null());
 if (last_clean_time < (now() - (timeout * 2))) {
 old_queries = null();
 }
 last_clean_time = now();
}
```

This happens because the contract doesn’t track the exact execution time of each request. For example, suppose the `timeout` is set to 3 hours, but the last request was executed one minute before the timeout. In that case, the request will be considered outdated just one minute later, even though the entire 3-hour period hasn’t elapsed. The second dictionary stores the same queries for at least the specified timeout duration to address this issue.

Theoretically, a query has a lifetime from `timeout` to `timeout * 2`, which means that when tracking which queries are outdated, it is good practice to wait at least `timeout * 2` times to see if the query is obsolete.

### Guaranteed error-free action phase

Once all checks and cleanups are complete, the contract can accept the message, update its storage, and call the commit function. This ensures the compute phase is considered successful, even if an error occurs afterward.

```func
accept_message();

queries~udict_set_ref(KEY_SIZE, shift, new_value.end_cell());

set_data(begin_cell()
 .store_uint(public_key, PUBLIC_KEY_SIZE)
 .store_uint(subwallet_id, SUBWALLET_ID_SIZE)
 .store_dict(old_queries)
 .store_dict(queries)
 .store_uint(last_clean_time, TIMESTAMP_SIZE)
 .store_uint(timeout, TIMEOUT_SIZE)
 .end_cell());


commit();
```

This ensures that when executing further code, the contract doesn’t revert to its previous state if an error occurs in the message the user is trying to send. Without this, the external message would remain valid and could be accepted multiple times, leading to unnecessary balance depletion.

However, we must address another issue: potential errors during the **Action Phase**. While we have a flag to ignore errors (2) when sending a message, it doesn’t cover all cases. Therefore, we need to ensure no errors occur during this phase, as they could cause a state rollback, rendering `commit()` meaningless.

For this reason, instead of sending all messages directly, the contract sends itself a message with the `internal_transfer` opcode. This message is parsed in detail by the contract to ensure that no Action Phase error occurs:

```func
throw_if(error::invalid_message_to_send, message_slice~load_uint(1)); ;; int_msg_info$0
int msg_flags = message_slice~load_uint(3); ;; ihr_disabled:Bool bounce:Bool bounced:Bool
if (is_bounced(msg_flags)) {
 return ();
}
slice message_source_adrress = message_slice~load_msg_addr(); ;; src
throw_unless(error::invalid_message_to_send, is_address_none(message_source_adrress));
message_slice~load_msg_addr(); ;; dest
message_slice~load_coins(); ;; value.coins
message_slice = message_slice.skip_dict(); ;; value.other extra-currencies
message_slice~load_coins(); ;; ihr_fee
message_slice~load_coins(); ;; fwd_fee
message_slice~skip_bits(64 + 32); ;; created_lt:uint64 created_at:uint32
int maybe_state_init = message_slice~load_uint(1);
throw_if(error::invalid_message_to_send, maybe_state_init); ;; throw if state-init included (state-init not supported)
int either_body = message_slice~load_int(1);
if (either_body) {
 message_slice~load_ref();
 message_slice.end_parse();
}
```

If any issue arises while reading the data, it will still occur during the compute phase. However, thanks to `commit()`, this isn’t a problem, and the transaction will still be considered successful. If all data is read successfully, it guarantees that the Action Phase will proceed without errors, as these checks cover all cases where the `IGNORE_ERRORS` (2) flag might fail. The contract can then finalize its work by sending the message.

```func
;; send a message with the IGNORE_ERRORS flag to ignore errors in the action phase

send_raw_message(message_to_send, send_mode | SEND_MODE_IGNORE_ERRORS);
```

### Internal transfer

After `internal_transfer` reaches the contract, it loads the list of actions, sets them in the c5 register, and then applies `set_code` to protect against accidental code changes, which is also an action. Because of this, the number of messages that can be sent is 254 rather than 255, which is the limit on the blockchain. However, the contract can call itself to send more messages, which we will discuss later:

```func
if (op == op::internal_transfer) {
 in_msg_body~skip_query_id();
 cell actions = in_msg_body.preload_ref();
 cell old_code = my_code();
 set_actions(actions);
 set_code(old_code); ;; prevent to change smart contract code
 return ();
}
```

When working with `internal_transfer`, there’s an important nuance to consider. As mentioned earlier, the contract sends a message to itself, but it is entirely collected on the user's side. The challenge lies in accurately calculating the amount of TON to attach to the message.

In the wrapper in the official repository, this field is optional, and if the user does not specify it, [mode becomes 128](https://github.com/ton-blockchain/highload-wallet-contract-v3/blob/d58c31e82315c34b4db55942851dd8d4153975c5/wrappers/HighloadWalletV3.ts#L115), which means that the entire balance is sent. The problem is that there is **an edge case** in such a case.

Imagine we want to send out a large number of tokens. After sending them, the remaining TONs are returned to our wallet because we set our address in the `response_destination` field. If we start sending multiple external messages simultaneously, the following situation can occur:

1. External message A is received, processed, and sent the entire contract balance via `internal_transfer`.
2. Before external message B arrives, part of the commissions from the already completed token transfer reaches the contract. This replenishes the contract balance, allowing the entire balance to be sent again in internal message B, but this time with a tiny amount of TONs.
3. Internal message A is received and processed. Token transfer messages are sent.
4. External message C reaches the contract before internal message B arrives and sends the entire balance again.
5. When internal message B is received, the contract has very little TON left. Even if some additional TON from token transfers arrives, the request fails with exit code `37` during the Action Phase (Insufficient Funds).

As a result, the contract marks the request as processed, even though it wasn’t successfully executed. To avoid this scenario, it’s **recommended to always allocate 1 TON** for `internal_transfer`. Therefore, [we use a modified wrapper](#-high-load-wallet-v3) that requires the user to specify the amount of TONs. This value will suffice for all cases, as the external message size is limited to 64 KB, and a message close to this limit will consume less than 1 TON.

High-Load Wallet V3 can send more than 254 messages, [putting the remaining messages into the 254th message](https://github.com/aSpite/highload-wallet-contract-v3/blob/d4c1752d00b5303782f121a87eb0620d403d9544/wrappers/HighloadWalletV3.ts#L169-L176). This way `internal_transfer` will be processed several times. The wrapper automatically does this, and we won't have to worry about it, but **recommended to take no more than 150 messages at a time** to ensure that even complex messages will fit into an external message.

:::info
Although the external message limit is 64KB, the larger the external message, the more likely it is to be lost in delivery, so 150 messages is the optimal solution.
:::

### GET methods

High-Load Wallet V3 supports the 5 GET methods:

|                    Method                    |                                                                                                  Explanation                                                                                                  |
| :------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|             int get_public_key()             |                                                                                    Returns the public key of the contract.                                                                                    |
|            int get_subwallet_id()            |                                                                                           Returns the subwallet ID.                                                                                           |
|          int get_last_clean_time()           |                                                                                    Returns the time of the last cleaning.                                                                                     |
|              int get_timeout()               |                                                                                          Returns the timeout value.                                                                                           |
| int processed?(int query_id, int need_clean) | Returns whether the query_id has been processed. If need_clean is set to 1, we will first do the cleanup based on `last_clean_time` and `timeout` and then check for query_id in `old_queries` and `queries`. |

:::tip
It’s recommended to pass `true` for `need_clean` unless the situation requires explicitly otherwise. This ensures the most current dictionary states are returned.
:::

Thanks to how the Query ID is structured in High-Load Wallet V3, we can safely resend a message with the same Query ID if it doesn’t arrive initially without worrying about the request being processed twice.

However, in such cases, we must ensure that no more than `timeout` time has passed since the first sending attempt. Otherwise, the request might have already been processed and deleted from the dictionaries. Therefore, it’s recommended to set `timeout` to no less than an hour and no more than 24 hours.

### Deploying high-load wallet v3

To deploy a contract, we need 2 cells: `code` and `date`. For the code, we will use the following cell:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Cell } from "@ton/core";

const HIGHLOAD_V3_CODE = Cell.fromBoc(
  Buffer.from(
    "b5ee9c7241021001000228000114ff00f4a413f4bcf2c80b01020120020d02014803040078d020d74bc00101c060b0915be101d0d3030171b0915be0fa4030f828c705b39130e0d31f018210ae42e5a4ba9d8040d721d74cf82a01ed55fb04e030020120050a02027306070011adce76a2686b85ffc00201200809001aabb6ed44d0810122d721d70b3f0018aa3bed44d08307d721d70b1f0201200b0c001bb9a6eed44d0810162d721d70b15800e5b8bf2eda2edfb21ab09028409b0ed44d0810120d721f404f404d33fd315d1058e1bf82325a15210b99f326df82305aa0015a112b992306dde923033e2923033e25230800df40f6fa19ed021d721d70a00955f037fdb31e09130e259800df40f6fa19cd001d721d70a00937fdb31e0915be270801f6f2d48308d718d121f900ed44d0d3ffd31ff404f404d33fd315d1f82321a15220b98e12336df82324aa00a112b9926d32de58f82301de541675f910f2a106d0d31fd4d307d30cd309d33fd315d15168baf2a2515abaf2a6f8232aa15250bcf2a304f823bbf2a35304800df40f6fa199d024d721d70a00f2649130e20e01fe5309800df40f6fa18e13d05004d718d20001f264c858cf16cf8301cf168e1030c824cf40cf8384095005a1a514cf40e2f800c94039800df41704c8cbff13cb1ff40012f40012cb3f12cb15c9ed54f80f21d0d30001f265d3020171b0925f03e0fa4001d70b01c000f2a5fa4031fa0031f401fa0031fa00318060d721d300010f0020f265d2000193d431d19130e272b1fb00b585bf03",
    "hex"
  )
)[0];
```

</TabItem>
</Tabs>

Unlike the other examples, here we will work [with a ready-made wrapper](https://github.com/aSpite/highload-wallet-contract-v3/blob/main/wrappers/HighloadWalletV3.ts), as it will be quite difficult and time-consuming to build each message manually. To create an instance of the HighloadWalletV3 class, we pass `publicKey`, `subwalletId`, and `timeout` and also the code:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = "put your mnemonic".split(" ");
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(
  HighloadWalletV3.createFromConfig(
    {
      publicKey: walletKeyPair.publicKey,
      subwalletId: 0x10ad,
      timeout: 60 * 60, // 1 hour
    },
    HIGHLOAD_V3_CODE
  )
);

console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs>

Now, we need a regular wallet from which we will deploy the contract:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { WalletContractV3R2 } from "@ton/ton";

const deployerWalletMnemonicArray = "put your mnemonic".split(" ");
const deployerWalletKeyPair = await mnemonicToWalletKey(
  deployerWalletMnemonicArray
); // extract private and public keys from mnemonic
const deployerWallet = client.open(
  WalletContractV3R2.create({
    publicKey: deployerWalletKeyPair.publicKey,
    workchain: 0,
  })
);
console.log(`Deployer wallet address: ${deployerWallet.address.toString()}`);
```

</TabItem>
</Tabs>

If you have a V4 version wallet, you can use the `WalletContractV4` class. Now, all we have to do is to deploy the contract:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
await wallet.sendDeploy(
  deployerWallet.sender(deployerWalletKeyPair.secretKey),
  toNano(0.05)
);
```

</TabItem>
</Tabs>

We can confirm that our wallet has been successfully deployed by checking the address output to the console in a blockchain explorer.

### Sending high-load wallet v3 messages

Sending messages is also done through the wrapper, but we will need to keep the Query ID up to date. First, let's get an instance of our wallet class:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address } from "@ton/core";
import { TonClient } from "@ton/ton";
import { HighloadWalletV3 } from "./wrappers/HighloadWalletV3";
import { mnemonicToWalletKey } from "@ton/crypto";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
  apiKey: "put your api key", // you can get an api key from @tonapibot bot in Telegram
});

const walletMnemonicArray = "put your mnemonic".split(" ");
const walletKeyPair = await mnemonicToWalletKey(walletMnemonicArray); // extract private and public keys from mnemonic
const wallet = client.open(
  HighloadWalletV3.createFromAddress(
    Address.parse("put your high-load wallet address")
  )
);
console.log(`Wallet address: ${wallet.address.toString()}`);
```

</TabItem>
</Tabs>

Now, we need to create an instance of the `HighloadQueryId` class. This class makes working with `shift` and `bit_number` easy. To create it, we use the `fromShiftAndBitNumber` method:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { HighloadQueryId } from "./wrappers/HighloadQueryId";

const queryHandler = HighloadQueryId.fromShiftAndBitNumber(0n, 0n);
```

</TabItem>
</Tabs>

We put zeros here since this is the first request. However, if you've sent any messages before, you'll need to pick an unused combination of these values. Now let's create an array where we will store all our actions and add one action to it to get our TONs back:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import {
  beginCell,
  internal,
  OutActionSendMsg,
  SendMode,
  toNano,
} from "@ton/core";

const actions: OutActionSendMsg[] = [];
actions.push({
  type: "sendMsg",
  mode: SendMode.CARRY_ALL_REMAINING_BALANCE,
  outMsg: internal({
    to: Address.parse("put address of deployer wallet"),
    value: toNano(0),
    body: beginCell().storeUint(0, 32).storeStringTail("Hello, TON!").endCell(),
  }),
});
```

</TabItem>
</Tabs>

Next, we need to fill in the `subwalletId`, `timeout`, `internalMessageValue`, and `createdAt` fields to send the message:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
const subwalletId = 0x10ad;
const timeout = 60 * 60; // must be same as in the contract
const internalMessageValue = toNano(0.01); // in the real case, it is recommended to set the value to 1 TON
const createdAt = Math.floor(Date.now() / 1000) - 60; // LiteServers have some delay in time
await wallet.sendBatch(
  walletKeyPair.secretKey,
  actions,
  subwalletId,
  queryHandler,
  timeout,
  internalMessageValue,
  SendMode.PAY_GAS_SEPARATELY,
  createdAt
);
```

</TabItem>
</Tabs>

After submitting, we should use the `getNext` method in `queryHandler` and save the current value. In a real case, this value should be stored in the database and reset after the `timeout * 2` time.

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
queryHandler.getNext();
```

</TabItem>
</Tabs>

## 🔥 High-load wallet v2 

:::warning
High-load wallet v2 is outdated. Do not use this for new projects.
:::

In some situations, sending a large number of messages per transaction may be necessary. As previously mentioned, ordinary wallets support sending up to 4 messages simultaneously by storing [a maximum of 4 references](/v3/documentation/data-formats/tlb/cell-boc#cell) in a single cell. High-load wallets only allow 255 messages to be sent at once. This restriction exists because the maximum number of outgoing messages (actions) in the blockchain’s config settings is set to 255.

Exchanges are probably the best example of a large-scale use of high-load wallets. Established exchanges like Binance and others have extremely large user bases, which means that a large number of withdrawal messages are processed in short time periods. High-load wallets help address these withdrawal requests.

### High-load wallet FunC code

First, let’s examine [the code structure of a high-load wallet smart contract](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif):

```func
() recv_external(slice in_msg) impure {
 var signature = in_msg~load_bits(512); ;; get signature from the message body
 var cs = in_msg;
 var (subwallet_id, query_id) = (cs~load_uint(32), cs~load_uint(64)); ;; get rest values from the message body
 var bound = (now() << 32); ;; bitwise left shift operation
 throw_if(35, query_id < bound); ;; throw an error if message has expired
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
> [Bitwise operations](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)
>
> [load_dict()](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> [udict_get?()](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get)

You notice some differences from ordinary wallets. Now, let’s take a closer look at more details of how high-load wallets work on TON (except subwallets, as we have gone over this previously).

### Using a query id in place of a seqno

As mentioned, ordinary wallets increment their `seqno` by `1` after each transaction. When using a wallet sequence, we had to wait for this value to update, retrieve it using the GET method, and then send a new message. This process takes a significant amount of time, which high-load wallets are not designed for (as discussed earlier, they are built to send a large number of messages quickly). To address this, high-load wallets on TON use the `query_id`.

If the same message request already exists, the contract won’t accept it, as it has already been processed:

```func
var (stored_subwallet, last_cleaned, public_key, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict()); ;; read values from storage
ds.end_parse(); ;; make sure we do not have anything in ds
(_, var found?) = old_queries.udict_get?(64, query_id); ;; check if we have already had such a request
throw_if(32, found?); ;; if yes throw an error
```

This way, we are **being protected from repeat messages**, which was the role of seqno in ordinary wallets.

### Sending messages

Once the contract accepts the external message, it initiates a loop. During this loop, the contract retrieves the `slices` stored in the dictionary, which contain the message modes and the messages themselves. The contract continues sending new messages until the dictionary is empty.

```func
int i = -1; ;; we write -1 because it will be the smallest value among all dictionary keys
do {
 (i, var cs, var f) = dict.idict_get_next?(16, i); ;; get the key and its corresponding value with the smallest key, which is greater than i
 if (f) { ;; check if any value was found
 var mode = cs~load_uint(8); ;; load message mode
 send_raw_message(cs~load_ref(), mode); ;; load message itself and send it
 }
} until (~ f); ;; if any value was found continue
```

> 💡 Useful link:
>
> ["idict_get_next()" in docs](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)

Note that if a value is found, `f` always equals `-1` (true). The `~ -1` operation (bitwise NOT) will always return `0`, meaning the loop should continue. However, when filling the dictionary with messages, you must start calculating values **greater than `-1`** (e.g., `0`) and increment the value by `1` for each subsequent message. This structure ensures that messages are sent in the correct sequential order.

### Removing expired queries

Typically, [smart contracts on TON pay for their storage](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee). This limits the amount of data smart contracts can store, preventing excessive network load. Messages older than 64 seconds are automatically removed from storage to improve system efficiency. This process works as follows:

```func
bound -= (64 << 32);   ;; clean up records that have expired more than 64 seconds ago
old_queries~udict_set_builder(64, query_id, begin_cell()); ;; add current query to dictionary
var queries = old_queries; ;; copy dictionary to another variable
do {
 var (old_queries', i, _, f) = old_queries.udict_delete_get_min(64);
 f~touch();
 if (f) { ;; check if any value was found
 f = (i < bound); ;; check if more than 64 seconds have elapsed after the expiration
 }
 if (f) {
 old_queries = old_queries'; ;; if yes, save changes in our dictionary
 last_cleaned = i; ;; save last removed query
 }
} until (~ f);
```

> 💡 Useful link:
>
> [udict_delete_get_min()](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_delete_get_min)

It is necessary to interact with the `f` variable several times. Since the [TVM is a stack machine](/v3/documentation/tvm/tvm-overview#tvm-is-a-stack-machine), during each interaction with the `f` variable, it is necessary to pop all values to get the desired variable. The `f~touch()` operation places the f variable at the top of the stack to optimize code execution.

### Bitwise operations

This section might be challenging for those unfamiliar with bitwise operations. The following line of code appears in the smart contract:

```func
var bound = (now() << 32); ;; bitwise left shift operation
```

As a result, 32 bits are added to the number on the right side. This means **existing values are shifted 32 bits to the left**. For example, let’s take the number `3` and convert it to binary, resulting in `11`. Applying the `3 << 2` operation shifts `11` two bit positions to the left, adding two `0`s to the right. This gives us `1100`, which equals `12`.

The first thing to understand about this process is to remember that the `now()` function returns a result of uint32, meaning that the resulting value will be 32 bits. Shifting 32 bits to the left opens space for another uint32, resulting in the correct query_id. This way, the **timestamp and query_id can be combined** within one variable for optimization.

Next, let’s consider the following line of code:

```func
bound -= (64 << 32); ;; clean up the records that have expired more than 64 seconds ago
```

Above, we performed a bitwise shift operation on the number `64` by 32 bits to **subtract 64 seconds** from our timestamp. This allows us to compare past `query_id`s and determine if they are less than the calculated value. If they are, it means they expired more than 64 seconds ago:

```func
if (f) { ;; check if any value has been found
 f = (i < bound); ;; check if more than 64 seconds have elapsed after the expiration
}
```

To better understand this, let’s use the number `1625918400` as an example of a timestamp. Its binary representation (with 32 bits, padded with zeros on the left) is `01100000111010011000101111000000`. By performing a 32-bit left shift, we add 32 zeros to the end of the binary representation of our number.

After this operation, **we can add any `query_id` (uint32)**. By subtracting `64 << 32`, we obtain a timestamp representing the same `query_id` 64 seconds ago. This can be verified by performing the calculation `((1625918400 << 32) - (64 << 32)) >> 32`. This approach allows us to compare the relevant portions of our number (the timestamp) without interference from the `query_id`.

### Storage updates

After all operations are complete, the only task remaining is to save the new values in the storage:

```func
 set_data(begin_cell()
 .store_uint(stored_subwallet, 32)
 .store_uint(last_cleaned, 64)
 .store_uint(public_key, 256)
 .store_dict(old_queries)
 .end_cell());
}
```

### GET methods

The last thing we have to consider before we dive into wallet deployment and message creation is high-load wallet GET methods:

|            Method            |                                                                                                                           Explanation                                                                                                                           |
| :--------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| int processed?(int query_id) | Notifies the user if a request has been processed. This means it returns `-1` if the request has been processed and `0` if it has not. Also, this method may return `1` if the answer is unknown since the request is old and no longer stored in the contract. |
|     int get_public_key()     |                                                                                                   Rerive a public key. We have considered this method before.                                                                                                   |

Let’s look at the `int processed?(int query_id)` method closely to help us understand why we need to make use of the last_cleaned:

```func
int processed?(int query_id) method_id {
 var ds = get_data().begin_parse();
 var (_, last_cleaned, _, old_queries) = (ds~load_uint(32), ds~load_uint(64), ds~load_uint(256), ds~load_dict());
 ds.end_parse();
 (_, var found) = old_queries.udict_get?(64, query_id);
 return found ? true : - (query_id <= last_cleaned);
}
```

The `last_cleaned` value is retrieved from the contract storage and the dictionary of old queries. If the query is found, the method returns `true`. If not, it evaluates the expression `- (query_id <= last_cleaned)`. The `last_cleaned` value contains the last removed request **with the highest timestamp**, as we started deleting requests from the minimum timestamp.

If the `query_id` passed to the method is smaller than the `last_cleaned` value, it’s impossible to determine whether it was ever in the contract. Therefore, the expression `query_id <= last_cleaned` returns `-1`, and the minus before it changes the result to `1`. If the `query_id` is larger than `last_cleaned`, the method confirms that it hasn’t been processed yet.

### Deploying high-load wallet v2

To deploy a high-load wallet, you need to generate a mnemonic key in advance, which the user will use. You can reuse the same key from previous sections of this tutorial.

To begin the process required to deploy a high-load wallet it's necessary to copy [the code of the smart contract](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif) to the same directory where the stdlib.fc and wallet_v3 are located and remember to add `#include "stdlib.fc";` to the beginning of the code. Next, we’ll compile the high-load wallet code as we did in [section three](/v3/guidelines/smart-contracts/howto/wallet#compiling-wallet-code):

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { compileFunc } from "@ton-community/func-js";
import fs from "fs";
import { Cell } from "@ton/core";

const result = await compileFunc({
  targets: ["highload_wallet.fc"], // targets of your project
  sources: {
    "stdlib.fc": fs.readFileSync("./src/stdlib.fc", { encoding: "utf-8" }),
    "highload_wallet.fc": fs.readFileSync("./src/highload_wallet.fc", {
      encoding: "utf-8",
    }),
  },
});

if (result.status === "error") {
  console.error(result.message);
  return;
}

const codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];

// now we have base64 encoded BOC with compiled code in the result.codeBoc
console.log("Code BOC: " + result.codeBoc);
console.log("\nHash: " + codeCell.hash().toString("base64")); // get the hash of cell and convert in to base64 encoded string
```

</TabItem>
</Tabs>

The result will be the following output in the terminal:

```text
Code BOC: te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz

Hash: lJTRzI7fEvBWcaGpugmSEJbrUIEeGSTsZcPGKfu4CBI=
```

With the above result, it is possible to use the base64 encoded output to retrieve the cell with our wallet code in other libraries and languages as follows:

<Tabs groupId="code-examples">
<TabItem value="go" label="Golang">

```go
import (
  "encoding/base64"
  "github.com/xssnick/tonutils-go/tvm/cell"
  "log"
)

base64BOC := "te6ccgEBCQEA5QABFP8A9KQT9LzyyAsBAgEgAgMCAUgEBQHq8oMI1xgg0x/TP/gjqh9TILnyY+1E0NMf0z/T//QE0VNggED0Dm+hMfJgUXO68qIH+QFUEIf5EPKjAvQE0fgAf44WIYAQ9HhvpSCYAtMH1DAB+wCRMuIBs+ZbgyWhyEA0gED0Q4rmMQHIyx8Tyz/L//QAye1UCAAE0DACASAGBwAXvZznaiaGmvmOuF/8AEG+X5dqJoaY+Y6Z/p/5j6AmipEEAgegc30JjJLb/JXdHxQANCCAQPSWb6VsEiCUMFMDud4gkzM2AZJsIeKz" // save our base64 encoded output from compiler to variable
codeCellBytes, _ := base64.StdEncoding.DecodeString(base64BOC) // decode base64 in order to get byte array
codeCell, err := cell.FromBOC(codeCellBytes) // get cell with code from byte array
if err != nil { // check if there is any error
  panic(err)
}

log.Println("Hash:", base64.StdEncoding.EncodeToString(codeCell.Hash())) // get the hash of our cell, encode it to base64 because it has []byte type, and output to the terminal
```

</TabItem>
</Tabs>

Next, we need to retrieve a cell containing its initial data, build a State Init, and calculate the high-load wallet address. After analyzing the smart contract code, we determined that the `subwallet_id`, `last_cleaned`, `public_key`, and `old_queries` are stored sequentially in the storage:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell } from "@ton/core";
import { mnemonicToWalletKey } from "@ton/crypto";

const highloadMnemonicArray =
  "put your mnemonic that you have generated and saved before".split(" ");
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic

const dataCell = beginCell()
  .storeUint(698983191, 32) // Subwallet ID
  .storeUint(0, 64) // Last cleaned
  .storeBuffer(highloadKeyPair.publicKey) // Public Key
  .storeBit(0) // indicates that the dictionary is empty
  .endCell();

const stateInit = beginCell()
  .storeBit(0) // No split_depth
  .storeBit(0) // No special
  .storeBit(1) // We have code
  .storeRef(codeCell)
  .storeBit(1) // We have data
  .storeRef(dataCell)
  .storeBit(0) // No library
  .endCell();

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
  "strings"
)

highloadMnemonicArray := strings.Split("put your mnemonic that you have generated and saved before", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
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

:::caution
Everything we have detailed above follows the same steps as the contract [deployment via wallet](/v3/guidelines/smart-contracts/howto/wallet#contract-deployment-via-wallet) section. To better understand, read the entire [GitHub source code](https://github.com/aSpite/wallet-tutorial).
:::

### Sending high-load wallet v2 messages

Now, let’s program a high-load wallet to send several messages simultaneously. For example, let's take 12 messages per transaction so that the gas fees are small.

:::info High-load balance
The contract balance must be at least 0.5 TON to complete the transaction.
:::

Each message carries its own comment with code, and the destination address will be the wallet from which we deployed:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Address, beginCell, Cell, toNano } from "@ton/core";

let internalMessages: Cell[] = [];
const walletAddress = Address.parse(
  "put your wallet address from which you deployed the high-load wallet"
);

for (let i = 0; i < 12; i++) {
  const internalMessageBody = beginCell()
    .storeUint(0, 32)
    .storeStringTail(`Hello, TON! #${i}`)
    .endCell();

  const internalMessage = beginCell()
    .storeUint(0x18, 6) // bounce
    .storeAddress(walletAddress)
    .storeCoins(toNano("0.01"))
    .storeUint(0, 1 + 4 + 4 + 64 + 32)
    .storeBit(0) // We do not have State Init
    .storeBit(1) // We store Message Body as a reference
    .storeRef(internalMessageBody) // Store Message Body Init as a reference
    .endCell();

  internalMessages.push(internalMessage);
}
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "fmt"
  "github.com/xssnick/tonutils-go/address"
  "github.com/xssnick/tonutils-go/tlb"
  "github.com/xssnick/tonutils-go/tvm/cell"
)

var internalMessages []*cell.Cell
walletAddress := address.MustParseAddr("put your wallet address from which you deployed high-load wallet")

for i := 0; i < 12; i++ {
  comment := fmt.Sprintf("Hello, TON! #%d", i)
  internalMessageBody := cell.BeginCell().
    MustStoreUInt(0, 32).
    MustStoreBinarySnake([]byte(comment)).
    EndCell()

  internalMessage := cell.BeginCell().
    MustStoreUInt(0x18, 6). // bounce
    MustStoreAddr(walletAddress).
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

After completing the above process, the result is an array of internal messages. Next, creating a dictionary for message storage and preparing and signing the message body is necessary. This is completed as follows:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { Dictionary } from '@ton/core';
import { mnemonicToWalletKey, sign } from '@ton/crypto';
import * as crypto from 'crypto';

const dictionary = Dictionary.empty<number, cell>(); // create an empty dictionary with the key as a number and the value as a cell
for (let i = 0; i < internalMessages.length; i++) {
    const internalMessage = internalMessages[i]; // get our message from an array
    dictionary.set(i, internalMessage); // save the message in the dictionary
}

const queryID = crypto.randomBytes(4).readUint32BE(); // Create a random uint32 number, 4 bytes = 32 bits
const now = Math.floor(Date.now() / 1000); // get current timestamp
const timeout = 120; // timeout for message expiration, 120 seconds = 2 minutes
const finalQueryID = (BigInt(now + timeout) << 32n) + BigInt(queryID); // get our final query_id
console.log(finalQueryID); // print query_id. With this query_id, we can call the GET method to check if our request has been processed

const toSign = beginCell()
 .storeUint(698983191, 32) // subwallet_id
 .storeUint(finalQueryID, 64)
    // Here, we create our own method that will save the
    // message mode and a reference to the message
 .storeDict(dictionary, Dictionary.Keys.Int(16), {
        serialize: (src, builder) => {
            buidler.storeUint(3, 8); // save message mode, mode = 3
            builder.storeRef(src); // save message as reference
 },
        // We won't actually use this, but this method
        // will help to read the dictionary that we saved
        parse: (src) => {
            let cell = beginCell()
 .storeUint(src.loadUint(8), 8)
 .storeRef(src.loadRef())
 .endCell();
            return cell;
 }
 }
);

const highloadMnemonicArray = 'put your high-load wallet mnemonic'.split(' ');
const highloadKeyPair = await mnemonicToWalletKey(highloadMnemonicArray); // extract private and public keys from mnemonic
const highloadWalletAddress = Address.parse('put your high-load wallet address');

const signature = sign(toSign.endCell().hash(), highloadKeyPair.secretKey); // get the hash of our message to the wallet smart contract and sign it to get the signature
```

</TabItem>
<TabItem value="go" label="Golang">

```go
import (
  "crypto/ed25519"
  "crypto/hmac"
  "crypto/sha512"
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
log.Println(finalQueryID)                                                    // print query_id. With this query_id, we can call the GET method to check if our request has been processed

toSign := cell.BeginCell().
  MustStoreUInt(698983191, 32). // subwallet_id
  MustStoreUInt(finalQueryID, 64).
  MustStoreDict(dictionary)

highloadMnemonicArray := strings.Split("put your high-load wallet mnemonic", " ") // word1 word2 word3
mac := hmac.New(sha512.New, []byte(strings.Join(highloadMnemonicArray, " ")))
hash := mac.Sum(nil)
k := pbkdf2.Key(hash, []byte("TON default seed"), 100000, 32, sha512.New) // In TON libraries, "TON default seed" is used as salt when getting keys
// 32 is a key len
highloadPrivateKey := ed25519.NewKeyFromSeed(k) // get private key
highloadWalletAddress := address.MustParseAddr("put your high-load wallet address")

signature := ed25519.Sign(highloadPrivateKey, toSign.EndCell().Hash())
```

</TabItem>
</Tabs>

:::note IMPORTANT
Note that when using JavaScript and TypeScript, our messages are saved into an array without a send mode. This happens because, when using the `@ton/ton` library, developers are expected to handle the serialization and deserialization process manually. As a result, the method first saves the message mode and then the message itself. Using the `Dictionary.Values.Cell()` specification for the value method saves the entire message as a cell reference without storing the mode separately.
:::

Next, we’ll create an external message and send it to the blockchain using the following code:

<Tabs groupId="code-examples">
<TabItem value="js" label="JavaScript">

```js
import { TonClient } from "@ton/ton";

const body = beginCell()
  .storeBuffer(signature) // store signature
  .storeBuilder(toSign) // store our message
  .endCell();

const externalMessage = beginCell()
  .storeUint(0b10, 2) // indicate that it is an incoming external message
  .storeUint(0, 2) // src -> addr_none
  .storeAddress(highloadWalletAddress)
  .storeCoins(0) // Import fee
  .storeBit(0) // We do not have State Init
  .storeBit(1) // We store Message Body as a reference
  .storeRef(body) // Store Message Body as a reference
  .endCell();

// We do not need a key here as we will be sending 1 request per second
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
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

Once complete, you can look up your wallet and verify that 12 outgoing messages were sent. You can also call the `processed?` GET method using the `query_id` initially used in the console. If the request is processed correctly, it will return `-1` (true).

## 🏁 Conclusion

This tutorial helped us better understand how different wallet types operate on TON Blockchain. It also taught us how to create external and internal messages without using predefined library methods.

This helps us be independent of libraries and to understand the structure of TON Blockchain more in-depth. We also learned how to use high-load wallets and analyzed many details related to different data types and various operations.

## 🧩 Next steps

Reading the documentation provided above is a complex undertaking, and it’s difficult to understand the entirety of the TON platform. However, it is a good exercise for those passionate about building on the TON. Another suggestion is to begin learning how to write smart contracts on TON by consulting the following resources: [FunC Overview](/v3/documentation/smart-contracts/func/overview), [Best Practices](/v3/guidelines/smart-contracts/guidelines), [Examples of Smart Contracts](/v3/documentation/smart-contracts/contracts-specs/examples), [FunC Cookbook](/v3/documentation/smart-contracts/func/cookbook)

Additionally, it is recommended that readers familiarize themselves with the following documents in more detail: [ton.pdf](https://docs.ton.org/ton.pdf) and [tblkch.pdf](https://ton.org/tblkch.pdf) documents.

## 📬 About the author

If you have any questions, comments, or suggestions, please contact the author of this documentation section on [Telegram](https://t.me/aspite) (@aSpite or @SpiteMoriarty) or [GitHub](https://github.com/aSpite).

## 📖 See also

- Wallets' source code: [V3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc), [V4](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc), [High-load](https://github.com/ton-blockchain/highload-wallet-contract-v3)

The primary sources of code:

- [@ton/ton (JS/TS)](https://github.com/ton-org/ton)
- [@ton/core (JS/TS)](https://github.com/ton-org/ton-core)
- [@ton/crypto (JS/TS)](https://github.com/ton-org/ton-crypto)
- [tonutils-go (GO)](https://github.com/xssnick/tonutils-go).

TON documentation:

- [Internal messages](/v3/documentation/smart-contracts/message-management/internal-messages)

- [External messages](/v3/documentation/smart-contracts/message-management/external-messages)

- [Types of wallet contracts](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#wallet-v4)

- [TL-B](/v3/documentation/data-formats/tlb/tl-b-language)

- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)

External references:

- [Ton deep](https://github.com/xssnick/ton-deep-doc)

- [Block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb)

- [Standards in TON](https://github.com/ton-blockchain/TEPs)

- Useful concept documents(may include outdated information): [ton.pdf](https://docs.ton.org/ton.pdf), [tblkch.pdf](https://ton.org/tblkch.pdf), [tvm.pdf](https://ton.org/tvm.pdf)
  

<Feedback />
