import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# Jetton Processing

## Best Practices on Jettons Processing

Jettons are tokens on TON Blockchain - one can consider them similarly to ERC-20 tokens on Ethereum.

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best UX/UI avoid additional waiting. 
:::

#### Withdrawal

[Highload Wallet v3](/participate/wallets/contracts#highload-wallet-v3) - this is TON Blockchain latest solution which is the gold standard for jetton withdrawals. It allows you to take advantage of batched withdrawals.

[Batched withdrawals](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - Meaning that multiple withdrawals are sent in batches, allowing for quick and cheap withdrawals.

#### Deposits
:::info
It is suggested to set several MEMO deposit wallets for better performance.
:::

[Memo Deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - This allows you to keep one deposit wallet, and users add a memo in order to be identified by your system. This means that you don’t need to scan the entire blockchain, but is slightly less easy for users.

[Memo-less deposits](https://github.com/gobicycle/bicycle) - This solution also exists, but is more difficult to integrate. However, we can assist with this, if you would prefer to take this route. Please notify us before deciding to implement this approach.

### Additional Info

:::caution Transaction Notification
if you will be allowing your users set a custom memo when withdrawing jettons - make sure to set forwardAmount to 0.000000001 TON (1 nanoton) whenever a memo (text comment) is attached, otherwise the transfer will not be standard compliant and will not be able to be processed by other CEXes and other such services.
:::

- Please find the JS lib example - [tonweb](https://github.com/toncenter/tonweb) - which is the official JS library from the TON Foundation. 

- If you want to use Java, you can look into [ton4j](https://github.com/neodix42/ton4j/tree/main). 

- For Go, one should consider [tonutils-go](https://github.com/xssnick/tonutils-go). At the moment, we recommend the JS lib.


## Content List


:::tip
In following docs offers details about Jettons architecture generally, as well as core concepts of TON which may be different from EVM-like and other blockchains. This is crucial reading in order for one to grasp a good understanding of TON, and will greatly help you.
:::

This document describes the following in order:
1. Overview 
2. Architecture
2. Jetton Master Contract (Token Minter)
3. Jetton Wallet Contract (User Wallet)
4. Message Layouts
4. Jetton Processing (off-chain)
5. Jetton Processing (on-chain)
6. Wallet processing
7. Best Practices

## Overview

:::info
TON transactions are irreversible after just one confirmation.
For clear understanding, the reader should be familiar with the basic principles of asset processing described in [this section of our documentation](/develop/dapps/asset-processing/). In particular, it is important to be familiar with [contracts](/learn/overviews/addresses#everything-is-a-smart-contract), [wallets](/develop/smart-contracts/tutorials/wallet), [messages](/develop/smart-contracts/guidelines/message-delivery-guarantees) and deployment process.
:::

:::Info
For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Quick jump to the core description of jetton processing:

````mdx-code-block 
<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>
````
Centralized Proccessing
````mdx-code-block 
</Button>
````
````mdx-code-block 
<Button href="/develop/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>
````
On-Chain Processing
````mdx-code-block 
</Button>
````

<br></br><br></br>


TON Blockchain and its underlying ecosystem classifies fungible tokens (FTs) as jettons. Because sharding is applied on TON Blockchain, our implementation of fungible tokens is unique when compared to similar blockchain models.

In this analysis, we take a deeper dive into the formal standards detailing jetton [behavior](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and [metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
A less formal sharding-focused overview of jetton architecture can be found in our
[anatomy of jettons blog post](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons).

We have also provided specific details discussing our third-party open-source TON Payment Processor ([bicycle](https://github.com/gobicycle/bicycle)) which allows users to deposit and withdraw both Toncoin and jettons using a separate deposit address without using a text memo.




## Jetton Architecture

Standardized tokens on TON are implemented using a set of smart contracts, including:
* [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) smart contract
* [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) smart contracts
````mdx-code-block
<p align="center">
  <br />
    <img width="420" src="/img/docs/asset-processing/jetton_contracts.svg" alt="contracts scheme" />
      <br />
</p>
````
## Jetton master smart contract
The jetton master smart contract stores general information about the jetton (

including the total supply, a metadata link, or the metadata itself).

It is possible for any user to create a counterfeit clone of a valuable jetton (using an arbitrary name, ticker, image, etc.) that is nearly identical to the original. Thankfully, counterfeit jettons are distinguishable by their addresses and can be identified quite easily.

To eliminate the possibility of fraud for TON users, please look up the original jetton address (Jetton master contract) for specific jetton types or follow the project’s official social media channel or website to find the correct information. Check assets to eliminate the possibility of fraud with [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets).

### Retrieving Jetton data

To retrieve more specific Jetton data, the `get_jetton_data()` get method is used.

This method returns the following data:

| Name               | Type  | Description |
|--------------------|-------|-------------------- |
| `total_supply`       | `int`  | the total number of issued jettons measured in indivisible units. |
| `mintable`          | `int`   | details whether new jettons can be minted or not. This value is either -1 (can be minted) or 0 (cannot be minted). |
| `admin_address`      | `slice` |   |
| `jetton_content`     | `cell` | data in accordance with [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md). |
| `jetton_wallet_code` | `cell`  |  |



It is also possible to use the method `/jetton/masters` from the [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) to retrieve the already decoded Jetton data and metadata. We have also developed methods for (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) and (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) and (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) and many other SDKs.

Example of using [Tonweb](https://github.com/toncenter/tonweb) to run a get method and get url for off-chain metadata:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

#### Jetton metadata
More info on parsing metadata is provided [here](/develop/dapps/asset-processing/metadata).

## Jetton Wallet smart contracts
Jetton wallet contracts are used to send, receive, and burn jettons. Each _jetton wallet contract_ stores wallet balance information for specific users. 
In specific instances, jetton wallets are used for individual jetton holders for each jetton type.

Jetton wallets should not be confused with wallet’s meant for blockchain interaction and storing 
only the Toncoin asset (e.g., v3R2 wallets, highload wallets, and others), 
which is responsible for supporting and managing only a specific jetton type.

Jetton wallets make use of smart contracts and are managed using internal messages between 
the owner's wallet and the jetton wallet. For instance, say if Alice manages a wallet with jettons inside, 
the scheme is as follows: Alice owns a wallet designed specifically for jetton use (such as wallet version v3r2). 
When Alice initiates the sending of jettons in a wallet she manages, she sends external messages to her wallet, 
and as a result, _her wallet_ sends an internal message to _her jetton wallet_ and 
then the jetton wallet actually executes the token transfer.

### Retrieving Jetton wallet addresses for a given user
To retrieve a jetton wallet address using an owner address (a TON Wallet address), 
the Jetton master contract provides the get method `get_wallet_address(slice owner_address)`.

#### Retrieve using API
The application serializes the owner’s address to a cell using 
the `/runGetMethod` method from the [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post).

#### Retrieve using SDK
This process can also be initiated using ready to use methods present in our various SDKs, for instance,  
using the Tonweb SDK, this process can be initiated by entering the following strings:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const address = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address("<OWNER_WALLET_ADDRESS>"));
// It is important to always check that wallet indeed is attributed to desired Jetton Master:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== new TonWeb.utils.Address(info.address).toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton wallet address:', address.toString(true, true, true));
```
:::tip
For more examples read the [TON Cookbook](/develop/dapps/cookbook#how-to-calculate-users-jetton-wallet-address).
:::

### Retrieving data for a specific Jetton wallet

To retrieve the wallet’s account balance, owner identification information, and other info related to a specific jetton wallet contract, the `get_wallet_data()` get method is used within the jetton wallet contract.


This method returns the following data:

| Name               | Type  |
|--------------------|-------|
| balance            | int   |
| owner              | slice |
| jetton             | slice |
| jetton_wallet_code | cell  |

It is also possible to use the `/jetton/wallets` get method using the [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) to retrieve previously decoded jetton wallet data (or methods within an SDK). For instance, using Tonweb:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('Jetton balance:', data.balance.toString());
console.log('Jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that Jetton Master indeed recognize wallet
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.jettonMinterAddress.toString(false)});
const expectedJettonWalletAddress = await jettonMinter.getJettonWalletAddress(data.ownerAddress.toString(false));
if (expectedJettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('Jetton master address:', data.jettonMinterAddress.toString(true, true, true));
```

### Jetton Wallet Deployment
When transferring jettons between wallets, transactions (messages) require a certain amount of TON 
as payment for network gas fees and the execution of actions according to the Jetton wallet contract's code. 
This means that the recipient does not need to deploy a jetton wallet prior to receiving jettons. 
The recipient's jetton wallet will be deployed automatically as long as the sender holds enough TON 
in the wallet to pay the required gas fees.

## Message Layouts

:::tip Messages
Read more about Messages [here](/develop/smart-contracts/guidelines/message-delivery-guarantees).
:::

Communication between Jetton wallets and TON wallets occurs through the following communication sequence:

![](/img/docs/asset-processing/jetton_transfer.svg)


`Sender -> sender' jetton wallet` means the _transfer_ message body contains the following data:


| Name                 | Type    |
|----------------------|---------|
| `query_id `            | uint64  |
| `amount  `             | coins   |
| `destination  `        | address |
| `response_destination` | address |
| `custom_payload  `     | cell    |
| `forward_ton_amount`   | coins   |
| `forward_payload`      | cell    |

`payee' jetton wallet -> payee`  means the message notification body contains the following data:


| Name            | Type    |
|-----------------|---------|
| query_id    `    | uint64  |
| amount   `       | coins   |
| sender  `        | address |
| forward_payload` | cell    |

`payee' jetton wallet -> Sender` means the excess message body contains the following data:


| Name                 | Type           |
|----------------------|----------------|
| `query_id`             | uint64         |

A detailed description of the jetton wallet contract fields can be found in the [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) Jetton standard interface description.

Messages using the `Transfer notification` and `Excesses` parameters are optional and depend on the amount of TON attached 
to the `Transfer` message and the value of the `forward_ton_amount` field.

The `query_id` identifier allows applications to link three messaging types `Transfer`, `Transfer notification` and `Excesses` to each other. 
For this process to be carried out correctly it is recommended to always use a unique query id.

### How to send Jetton transfers with comments and notifications

In order to make a transfer with a notification (which is then used in-wallet for notification purposes), 
a sufficient amount of TON must be attached to the message being sent by setting a non-zero `forward_ton_amount` 
value and, if necessary, attaching a text comment to the `forward_payload`.
A text comment is encoded similarly to a text comment when sending Toncoin.

[Fees for sending Jettons](https://docs.ton.org/develop/smart-contracts/fees#fees-for-sending-jettons)

However, the commission depends on several factors including the Jetton code details and the need to deploy a new Jetton wallet for recipients.
Therefore, it is recommended to attach Toncoin with a margin and then set the address as the  `response_destination`
to retrieve `Excesses` messages. For example, 0.05 TON can be attached to the message while setting the `forward_ton_amount`
value to 0.01 TON (this amount of TON will be attached to the `Transfer notification` message).

[Jetton transfers with comment examples using the Tonweb SDK](https://github.com/toncenter/tonweb/blob/b550969d960235314974008d2c04d3d4e5d1f546/src/test-jetton.js#L128):

```js
// first 4 bytes are tag of text comment
const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('text comment')]);

await wallet.methods.transfer({
    secretKey: keyPair.secretKey,
    toAddress: JETTON_WALLET_ADDRESS, // address of Jetton wallet of Jetton sender
    amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
    seqno: seqno,
    payload: await jettonWallet.createTransferBody({
        jettonAmount: TonWeb.utils.toNano('500'), // Jetton amount (in basic indivisible units)
        toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recipient user's wallet address (not Jetton wallet)
        forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
        forwardPayload: comment, // text comment for Transfer notification message
        responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
    }),
    sendMode: 3,
}).send()
```

:::tip
For more examples read the [TON Cookbook](/develop/dapps/cookbook#how-to-construct-a-message-for-a-jetton-transfer-with-a-comment).
:::


## Jetton off-chain processing

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Several scenarios that allow a user to accept Jettons are possible. Jettons can be accepted within a centralized hot wallet; as well, they can also be accepted using a wallet with a separate address for each individual user.

To process Jettons, unlike individualized TON processing, a hot wallet is required (a v3R2, highload wallet) in addition 
to a Jetton wallet or more than one Jetton wallet. Jetton hot wallet deployment is described in the [wallet deployment](/develop/dapps/asset-processing/#wallet-deployment) of our documentation. 
That said, deployment of Jetton wallets according to the [Jetton wallet deployment](#jetton-wallet-deployment) criteria is not required. 
However, when Jettons are received, Jetton wallets are deployed automatically, meaning that when Jettons are withdrawn, 
it is assumed that they are already in the user’s possession.

For security reasons it is preferable to be in possession of separate hot wallets for separate Jettons (many wallets for each asset type).

When processing funds, it is also recommended to provide a cold wallet for storing excess funds which do not participate in the automatic deposit and withdrawal processes.

### Adding new Jettons for asset processing and initial verification

1. To find the correct smart contract token master address please see the following source: [How to find the right Jetton master contract](#jetton-master-smart-contract)
2. Additionally, to retrieve the metadata for a specific Jetton please see the following source: [How to receive Jetton metadata](#retrieving-jetton-data).
   In order to correctly display new Jettons to users, the correct `decimals` and `symbol` are needed.

For the safety of all of our users, it is critical to avoid Jettons that could be  counterfeited (fake). For example, 
Jettons with the  `symbol`==`TON` or those that contain system notification messages, such as: 
`ERROR`, `SYSTEM`, and others. Be sure to check that jettons are displayed in your interface in such a way that they cannot 
be mixed with TON transfers, system notifications, etc.. At times, even the `symbol`,`name` and `image`
will be created to look nearly identical to the original with the hopes of misleading users.

### Identification of an unknown Jetton when receiving a transfer notification message

1. If a transfer notification message is received within your wallet regarding an unknown Jetton, then your wallet 
has been created to hold the specific Jetton. Next, it is important to perform several verification processes.
2. The sender address of the internal message containing the `Transfer notification` body is the address of the new Jetton wallet. 
Not to be confused with the `sender` field in the `Transfer notification`  body, the address of the Jetton wallet
is the address from the source of the message.
3. Retrieving the Jetton master address for the new Jetton wallet: [How to retrieve data for the Jetton wallet](#retrieving-jetton-data).
   To carry out this process, the `jetton` parameter is required and is the address that makes up the Jetton master contract.
4. Retrieving the Jetton wallet address for your wallet address (as an owner) using the Jetton master contract: [How to retrieve Jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
5. Compare the address returned by the master contract and the actual address of the wallet token. 
If they match, it’s ideal. If not, then you likely received a scam token that is counterfeit.
6. Retrieving Jetton metadata: [How to receive Jetton metadata](#retrieving-jetton-data). 
7. Check the `symbol` and `name` fields for signs of a scam. Warn the user if necessary. [Adding a new Jettons for processing and initial checks](#adding-new-jettons-for-asset-processing-and-initial-verification).


### Accepting Jettons from users through a centralized wallet

:::info
To prevent a bottleneck in incoming transactions to a single wallet, it is suggested to accept deposits across multiple wallets and to expand the number of these wallets as needed.
:::


:::caution Transaction Notification
if you will be allowing your users set a custom memo when withdrawing jettons - make sure to set forwardAmount to 0.000000001 TON (1 nanoton) whenever a memo (text comment) is attached, otherwise the transfer will not be standard compliant and will not be able to be processed by other CEXes and other such services.
:::

In this scenario, the payment service creates a unique memo identifier for each sender disclosing 
the address of the centralized wallet and the amounts being sent. The sender sends the tokens 
to the specified centralized address with the obligatory memo in the comment.

**Pros of this method:** this method is very simple because there are no additional fees when accepting tokens and they are retrieved directly in the hot wallet.

**Cons of this method:** this method requires that all users attach a comment to the transfer which can lead to a greater number of deposit mistakes (forgotten memos, incorrect memos, etc.), meaning a higher workload for support staff.

Tonweb examples:

1. [Accepting Jetton deposits to an individual HOT wallet with comments (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons-single-wallet.js)
2. [Jettons withdrawals example](https://github.com/toncenter/examples/blob/main/jettons-withdrawals.js)

#### Preparations

1. Prepare a list of accepted Jettons: [Adding new Jettons for processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification).
2. Hot wallet deployment (using v3R2 if no Jetton withdrawals are expected; highload v2 - if Jetton withdrawals are expected) [Wallet deployment](/develop/dapps/asset-processing/#wallet-deployment).
3. Perform a test Jetton transfer using the hot wallet address to initialize the wallet.

#### Processing incoming Jettons
1. Load the list of accepted Jettons
2. Retrieve a Jetton wallet address for your deployed hot wallet: [How to retrieve a Jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Retrieve a Jetton master address for each Jetton wallet: [How to retrieve data for a Jetton wallet](#retrieving-data-for-a-specific-jetton-wallet).
   To carry out this process, the `jetton` parameter is required (which is actually the address 
of the Jetton master contract).
4. Compare the addresses of the Jetton master contracts from step 1. and step 3 (directly above). 
If the addresses do not match, a Jetton address verification error must be reported.
5. Retrieve a list of the most recent unprocessed transactions using a hot wallet account and
iterate it (by sorting through each transaction one by one). See:  [Checking contract's transactions](https://docs.ton.org/develop/dapps/asset-processing/#checking-contracts-transactions), 
or use the [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) 
or use Toncenter API `/getTransactions` method.
6. Check the input message (in_msg) for transactions and retrieve the source address from the input message. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. If the source address matches the address within a Jetton wallet, then it is necessary to continue processing the transaction. 
If not, then skip processing the transaction and check the next transaction.
8. Ensure that the message body is not empty and that the first 32 bits of the message match the `transfer notification` op code `0x7362d09c`. 
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   If the message body is empty or the op code is invalid - skip the transaction.
9. Read the message body’s other data, including the `query_id`, `amount`, `sender`, `forward_payload`. 
[Jetton contracts message layouts](#jetton-contract-message-layouts), [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. Try to retrieve text comments from the `forward_payload` data. The first 32 bits must match 
the text comment op code `0x00000000` and the remaining - UTF-8 encoded text.
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. If the `forward_payload` data is empty or the op code is invalid - skip the transaction.
12. Compare the received comment with the saved memos. If there is a match (user identification is always possible) - deposit the transfer.
13. Restart from step 5 and repeat the process until you have walked through the entire list of transactions.

### Accepting Jettons from user deposit addresses

To accept Jettons from user deposit addresses, it is necessary that the payment service creates its 
own individual address (deposit) for each participant sending funds. The service provision in this case involves 
the execution of several parallel processes including creating new deposits, scanning blocks for transactions, 
withdrawing funds from deposits to a hot wallet, and so on.

Because a hot wallet can make use of one Jetton wallet for each Jetton type, it is necessary to create multiple 
wallets to initiate deposits. In order to create a large number of wallets, but at the same time manage them with 
one seed phrase (or private key), it is necessary to specify a different `subwallet_id` when creating a wallet. 
On TON, the functionality required to create a subwallet is supported by version v3 wallets and higher.


#### Creating a subwallet in Tonweb

```Tonweb
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### Preparation

1. Prepare a list of accepted Jettons: [Adding new Jettons for processing and initial checks](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Hot wallet [Wallet Deployment](/develop/dapps/asset-processing/#wallet-deployment)

#### Creating deposits

1. Accept a request to create a new deposit for the user.
2. Generate a new subwallet (v3R2) address based on the hot wallet seed. [Creating a subwallet in Tonweb](#creating-a-subwallet-in-tonweb)
3. The receiving address can be given to the user as the address used for Jetton deposits (this is the address of 
the owner of the deposit Jetton wallet). Wallet initialization is not required, this can be 
accomplished when withdrawing Jettons from the deposit.
4. For this address, it is necessary to calculate the address of the Jetton wallet through the Jetton master contract. 
[How to retrieve a Jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user).  
5. Add the Jetton wallet address to the address pool for transaction monitoring and save the subwallet address.

#### Processing transactions

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

It is not always possible to determine the exact amount of Jettons received from the message, because Jetton 
wallets may not send `transfer notification`, `excesses`, and `internal transfer` messages are not standardized. This means 
that there is no guarantee that the `internal transfer` message can be decoded.

Therefore, to determine the amount received in the wallet, balances need to be requested using the get method. 
To retrieve key data when requesting balances, blocks are used according to the account’s state for a particular block on-chain. 
[Preparation for block acceptance using Tonweb](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js).

This process is conducted as follows:

1. Preparation for block acceptance (by readying the system to accept new blocks).
2. Retrieve a new block and save the previous block ID.
3. Receive transactions from blocks.
4. Filter transactions used only with addresses from the deposit Jetton wallet pool.
5. Decode messages using the `transfer notification` body to receive more detailed data including the 
`sender` address, Jetton `amount` and comment. (See: [Processing incoming Jettons](#processing-incoming-jettons))
6. If there is at least one transaction with non-decodable out messages (the message body does not contain op codes for 
`transfer notification` and op codes for `excesses`) or without out messages present within the
account, then the Jetton balance must be requested using the get method for the current block, while the previous 
block is used to calculate the difference in balances. Now the total balance deposit changes are revealed due 
to the transactions being conducted within the block.
7. As an identifier for an unidentified transfer of Jettons (without a `transfer notification`), transaction data 
can be used if there is one such transaction or block data present (if several are present within a block).
8. Now it’s necessary to check to ensure the deposit balance is correct. If the deposit balance is sufficient enough to initiate a transfer between a hot wallet and the existing Jetton wallet, Jettons need to be withdrawn to ensure the wallet balance has decreased.
9. Restart from step 2 and repeat the entire process.

#### Withdrawals made from deposits

Transfers should not be made from a deposit to a hot wallet with each deposit replenishment, 
because of the fact that a commission in TON is taken for the transfer operation (paid in network gas fees). 
It is important to determine a certain minimum amount of Jettons which are required to make a 
transfer worthwhile (and thus deposit).

By default, wallet owners of Jetton deposit wallets are not initialized. This is because there is no predetermined 
requirement to pay storage fees. Jetton deposit wallets can be deployed when sending messages with a
`transfer`  body which can then be destroyed immediately. To do this, the engineer must use a special
mechanism for sending messages: 128 + 32.


1. Retrieve a list of deposits marked for withdrawal to a hot wallet
2. Retrieve saved owner addresses for each deposit
3. Messages are then sent to each owner address (by combining several such messages into a batch) from a highload 
wallet with an attached TON Jetton amount. This is determined by adding the fees used for v3R2 wallet 
initialization + the fees for sending a message with the  `transfer` body + an arbitrary TON amount related to the `forward_ton_amount` 
(if necessary). The attached TON amount is determined by adding the fees for v3R2 wallet initialization (value) + 
the fees for sending a message with the `transfer` body (value) + an arbitrary TON amount 
for `forward_ton_amount` (value) (if necessary).
4. When the balance on the address becomes non-zero, the account status changes. Wait a few seconds and check the status 
of the account, it will soon change from the `nonexists` state to `uninit`.
5. For each owner address (with `uninit` status), it is necessary to send an external message with the v3R2 wallet 
init and body with the `transfer` message for depositing into the Jetton wallet = 128 + 32. For the `transfer`,
the user must specify the address of the hot wallet as the `destination` and `response destination`.
A text comment can be added  to make it simpler to identify the transfer.
6. It is possible to verify Jetton delivery using the deposit address to the hot wallet address by 
taking into consideration the [processing of incoming Jettons info found here](#processing-incoming-jettons).

### Jetton withdrawals

To withdraw Jettons, the wallet sends messages with the `transfer` body to its corresponding Jetton wallet. 
The Jetton wallet then sends the Jettons to the recipient. In good faith, it is important to attach some TON 
as the  `forward_ton_amount` (and optional comment to `forward_payload`) to trigger a `transfer notification`. 
See: [Jetton contracts message layouts](#jetton-contract-message-layouts) 

#### Preparation

1. Prepare a list of Jettons for withdrawals: [Adding new Jettons for processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Hot wallet deployment is initiated. Highload v2 is recommended. [Wallet Deployment](/develop/dapps/asset-processing/#wallet-deployment)
3. Carry out a Jetton transfer using a hot wallet address to initialize the Jetton wallet and replenish its balance.

#### Processing withdrawals

1. Load a list of processed Jettons
2. Retrieve Jetton wallet addresses for the deployed hot wallet: [How to retrieve Jetton wallet addresses for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Retrieve Jetton master addresses for each Jetton wallet: [How to retrieve data for Jetton wallets](#retrieving-data-for-a-specific-jetton-wallet).
   A `jetton` parameter is required (which is actually the address of Jetton master contract).
4. Compare the addresses from Jetton master contracts from step 1. and step 3. If the addresses do not match, then a Jetton address verification error should be reported.
5. Withdrawal requests are received which actually indicate the type of Jetton, the amount being transferred, and the recipient wallet address.
6. Check the balance of the Jetton wallet to ensure there are enough funds present to carry out withdrawal.
7. Generate a message using the Jetton `transfer` body by filling in the required fields, including: the query_id, amount being sent, 
destination (the recipient's non-Jetton wallet address), response_destination (it is recommended to specify the user’s hot wallet), 
forward_ton_amount (it is recommended to set this to at least 0.05 TON to invoke a `transfer notification`), `forward_payload`
   (optional, if sending a comment is needed). [Jetton contracts message layouts](#jetton-contract-message-layouts), 
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/jettons-withdrawals.js#L69)
   In order to check the successful validation of the transaction, it is necessary to assign a unique value to the
   `query_id` for each message.
8. When using a highload wallet, it is recommended that a batch of messages is collected and that one batch at a time is sent to optimize fees.
9. Save the expiration time for outgoing external messages (this is the time until the wallet successfully 
processes the message, after this is completed, the wallet will no longer accept the message)
10. Send a single message or more than one message (batch messaging).
11. Retrieve the list of the latest unprocessed transactions within the hot wallet account and iterate it. 
Learn more here: [Checking contract's transactions](/develop/dapps/asset-processing/#checking-contracts-transactions), 
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) or
use the Toncenter API `/getTransactions` method.
12. Look at outgoing messages in the account.
13. If a message exists with the `transfer` op code, then it should be decoded to retrieve the `query_id` value.
Retrieved `query_id`s  need to be marked as successfully sent.
14. If the time it takes for the current scanned transaction to be processed is greater than 
the expiration time and the outgoing message with the given `query_id`
is not found, then the request should (this is optional) be marked as expired and should be safely resent.
15. Look for incoming messages in the account.
16. If a message exists that uses the `excesses` op code, the message should be decoded and the `query_id`
value should be retrieved. A found `query_id` must be marked as successfully delivered.
17. Go to step 5. Expired requests that have not been successfully sent should be pushed back to the withdrawal list.

## Jetton processing on-chain

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Generally, to accept and process jettons, a message handler responsible for internal messages uses the `op=0x7362d09c` op code.

Below is a list of recommendations that must be considered when carrying out on-chain jetton processing:

1. Identify incoming jettons using their wallet type, not their Jetton master contract. In other words, your contract should interact (receive and send messages) with a specific jetton wallet (not with some unknown wallet using a specific Jetton master contract).
2. When linking a Jetton Wallet and a Jetton Master, check that this connection is bidirectional where the wallet recognizes the master contract and vice versa. For instance, if your contract-system receives a notification from a jetton wallet (which considers its MySuperJetton as its master contract) its transfer information must be displayed to the user, prior to showing the `symbol`, `name` and `image`
of the MySuperJetton contract, check that the MySuperJetton wallet uses the correct contract system. In turn, if your contract system for some reason needs to send jettons using the MySuperJetton or MySuperJetton master contracts verify that wallet X as is the wallet using the same contract parameters. 
Additionally, prior to sending a  `transfer` request to X, make sure it recognizes MySuperJetton as its master.
3. The true power of decentralized finance (DeFi) is based on the ability to stack protocols on top of each other like lego blocks. For instance, say jetton A is swapped for jetton B, which in turn, is then used as leverage within a lending protocol (when a user supplies liquidity) which is then used to buy an NFT .... and so on. Therefore, consider how the contract is able to serve, not only off-chain users, but on-chain entities as well by attaching tokenized value to a transfer notification, adding a custom payload that can be sent with a transfer notification.
4. Be aware that not all contracts follow the same standards. Unfortunately, some jettons may be hostile (using attack-based vectors) and created for the sole purposes of attacking unsuspecting users. For security purposes, if the protocol in question consists of many contracts, do not create a large number of jetton wallets of the same type. In particular, do not send jettons inside the protocol between the deposit contract, vault contract, or user account contract etc. Attackers may intentionally interfere with contract logic by forging transfer notifications, jetton amounts, or payload parameters. Reduce the potential for attack potential by using only one wallet in the system per jetton (for all deposits and withdrawals).
5. It is also often a good idea to create subcontracts for each individualized jetton to reduce the chances of address spoofing (for example, when a transfer message is sent to jetton B using a contract intended for jetton A).
6. It is strongly recommended to work with indivisible jetton units on the contract level. Decimal-related logic is typically used to enhance the diplay’s user interface (UI), and is not related to numerical on-chain record keeping.
7. To learn more about [Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func), feel free to read this resource. It is recommended that developers handle all smart contract exceptions so they are never skipped during application development.

## Jetton wallet processing
Generally, all verification procedures used for off-chain jetton processing are suitable for wallets as well. For Jetton wallet processing our most important recommendations are as follows:

1. When a wallet receives a transfer notification from an unknown jetton wallet, it is vitally important to trust the jetton wallet and its master address because it could be a malicious counterfeit. To protect yourself, check the Jetton Master (the master contract) using its provided address to ensure your verification processes recognize the jetton wallet as legitimate. After you trust the wallet and it is verified as legitimate, you can allow it to access your account balances and other in-wallet data. If the Jetton Master does not recognize this wallet it is recommended to not initiate or disclose your jetton transfers at all and to only show incoming TON transfers (of Toncoin attached to the transfer notifications) only.
2. In practice, if the user wants to interact with a Jetton and not a jetton wallet. In other words, users send wTON/oUSDT/jUSDT, jUSDC, jDAI instead of `EQAjN...`/`EQBLE...`
   etc.. Often this means that when a user is initiating a jetton transfer, the wallet asks the corresponding jetton master which jetton wallet (owned by the user) should initiate the transfer request. It is important to never blindly trust this data from the Master (the master contract). Prior to sending the transfer request to a jetton wallet, always ensure that the jetton wallet indeed belongs to the Jetton Master it claims to belong to.
3. Be aware that hostile Jetton Masters/jetton wallets may change their wallets/Masters over time. Therefore, it is imperative that users do their due diligence and check the legitimacy of any wallets they interact with prior to each use. 
4. Always ensure that you display jettons in your interface in a manner that will not mix with TON transfers, system notifications, etc.. Even the `symbol`,`name` and `image`
parameters can be crafted to mislead users, leaving those affected as potential fraud victims. There have been several instances, when malicious jettons were used to impersonate TON transfers, notification errors, reward earnings, or asset freezing announcements.
5. Always be on the lookout for potential malicious actors that create counterfeit jettons, it is always a good idea to give users the functionality needed to eliminate unwanted jettons in their main user interface.


Authored by [kosrk](https://github.com/kosrk), [krigga](https://github.com/krigga), [EmelyanenkoK](https://github.com/EmelyanenkoK/) and [tolya-yanot](https://github.com/tolya-yanot/).


## Best Practices
Here we have provided several examples of jetton code processing created by TON Community members:

<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

```js
const transfer = await wallet.methods.transfer({
  secretKey: keyPair.secretKey,
  toAddress: jettonWalletAddress,
  amount: 0,
  seqno: seqno,
  sendMode: 128 + 32, // mode 128 is used for messages that are to carry all the remaining balance; mode 32 means that the current account must be destroyed if its resulting balance is zero;
  payload: await jettonWallet.createTransferBody({
    queryId: seqno, // any number
    jettonAmount: jettonBalance, // jetton amount in units
    toAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
    responseAddress: new TonWeb.utils.Address(MY_HOT_WALLET_ADDRESS),
  }),
});
await transfer.send();
```

</TabItem>
<TabItem value="tonutils-go" label="Golang">

```go
client := liteclient.NewConnectionPool()

// connect to testnet lite server
err := client.AddConnectionsFromConfigUrl(context.Background(), "https://ton.org/global.config.json")
if err != nil {
   panic(err)
}

ctx := client.StickyContext(context.Background())

// initialize ton api lite connection wrapper
api := ton.NewAPIClient(client)

// seed words of account, you can generate them with any wallet or using wallet.NewSeed() method
words := strings.Split("birth pattern then forest walnut then phrase walnut fan pumpkin pattern then cluster blossom verify then forest velvet pond fiction pattern collect then then", " ")

w, err := wallet.FromSeed(api, words, wallet.V3R2)
if err != nil {
   log.Fatalln("FromSeed err:", err.Error())
   return
}

token := jetton.NewJettonMasterClient(api, address.MustParseAddr("EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw"))

// find our jetton wallet
tokenWallet, err := token.GetJettonWallet(ctx, w.WalletAddress())
if err != nil {
   log.Fatal(err)
}

amountTokens := tlb.MustFromDecimal("0.1", 9)

comment, err := wallet.CreateCommentCell("Hello from tonutils-go!")
if err != nil {
   log.Fatal(err)
}

// address of receiver's wallet (not token wallet, just usual)
to := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
transferPayload, err := tokenWallet.BuildTransferPayload(to, amountTokens, tlb.ZeroCoins, comment)
if err != nil {
   log.Fatal(err)
}

// your TON balance must be > 0.05 to send
msg := wallet.SimpleMessage(tokenWallet.Address(), tlb.MustFromTON("0.05"), transferPayload)

log.Println("sending transaction...")
tx, _, err := w.SendWaitTransaction(ctx, msg)
if err != nil {
   panic(err)
}
log.Println("transaction confirmed, hash:", base64.StdEncoding.EncodeToString(tx.Hash))
```

</TabItem>
<TabItem value="TonTools" label="Python">

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</TabItem>
</Tabs>


### Jetton Transfer with Comment parse

```ts
import {
    Address,
    TonClient,
    Cell,
    beginCell,
    storeMessage,
    JettonMaster,
    OpenedContract,
    JettonWallet,
    Transaction
} from '@ton/ton';


export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function tryProcessJetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface JettonInfo {
        address: string;
        decimals: number;
    }

    interface Jettons {
        jettonMinter : OpenedContract<JettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<JettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const JETTONS_INFO : Record<string, JettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, Jettons> = {};

    const prepare = async () => {
        for (const name in JETTONS_INFO) {
            const info = JETTONS_INFO[name];
            const jettonMaster = client.open(JettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(JettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                jettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressToJettonName = (jettonWalletAddress : Address) => {
        const jettonWalletAddressString = jettonWalletAddress.toString();
        for (const name in jettons) {
            const jetton = jettons[name];

            if (jetton.jettonWallet.address.toString() === jettonWalletAddressString) {
                return name;
            }
        }
        return null;
    }

    // Subscribe

    const Subscription = async ():Promise<Transaction[]> =>{

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
      });

        const myAddress = Address.parse('INSERT-YOUR-HOT-WALLET'); // Address of receiver TON wallet
        const transactions = await client.getTransactions(myAddress, {
            limit: 5,
        });
        return transactions;
    }




    return retry(async () => {

        await prepare();
       const Transactions = await Subscription();

        for (const tx of Transactions) {

            const sourceAddress = tx.inMessage?.info.src;
            if (!sourceAddress) {
                // external message - not related to jettons
                continue;
            }

            if (!(sourceAddress instanceof Address)) {
                continue;
            }

            const in_msg = tx.inMessage;

            if (in_msg?.info.type !== 'internal') {
                // external message - not related to jettons
                continue;
            }

            // jetton master contract address check
            const jettonName = jettonWalletAddressToJettonName(sourceAddress);
            if (!jettonName) {
                // unknown or fake jetton transfer
                continue;
            }

            if (tx.inMessage === undefined || tx.inMessage?.body.hash().equals(new Cell().hash())) {
                // no in_msg or in_msg body
                continue;
            }

            const msgBody = tx.inMessage;
            const sender = tx.inMessage?.info.src;
            const originalBody = tx.inMessage?.body.beginParse();
            let body = originalBody?.clone();
            const op = body?.loadUint(32);
            if (!(op == 0x7362d09c)) {
                continue; // op == transfer_notification
            }

            console.log('op code check passed', tx.hash().toString('hex'));

            const queryId = body?.loadUint(64);
            const amount = body?.loadCoins();
            const from = body?.loadAddress();
            const maybeRef = body?.loadBit();
            const payload = maybeRef ? body?.loadRef().beginParse() : body;
            const payloadOp = payload?.loadUint(32);
            if (!(payloadOp == 0)) {
                console.log('no text comment in transfer_notification');
                continue;
            }

            const comment = payload?.loadStringTail();
            if (!(comment == orderId)) {
                continue;
            }
            
            console.log('Got ' + jettonName + ' jetton deposit ' + amount?.toString() + ' units with text comment "' + comment + '"');
            const txHash = tx.hash().toString('hex');
            return (txHash);
        }
        throw new Error('Transaction not found');
    }, {retries: 30, delay: 1000});
}

```


## See Also

* [Payments Processing](/develop/dapps/asset-processing/)
* [NFT processing on TON](/develop/dapps/asset-processing/nfts)
* [Metadata parsing on TON](/develop/dapps/asset-processing/metadata)
