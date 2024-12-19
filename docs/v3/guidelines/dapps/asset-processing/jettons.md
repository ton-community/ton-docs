import ThemedImage from '@theme/ThemedImage';
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

[Highload Wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3) - this is TON Blockchain latest solution which is the gold standard for jetton withdrawals. It allows you to take advantage of batched withdrawals.

[Batched withdrawals](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js) - Meaning that multiple withdrawals are sent in batches, allowing for quick and cheap withdrawals.

#### Deposits
:::info
It is suggested to set several MEMO deposit wallets for better performance.
:::

[Memo Deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js) - This allows you to keep one deposit wallet, and users add a memo in order to be identified by your system. This means that you don’t need to scan the entire blockchain, but is slightly less easy for users.

[Memo-less deposits](https://github.com/gobicycle/bicycle) - This solution also exists, but is more difficult to integrate. However, we can assist with this, if you would prefer to take this route. Please notify us before deciding to implement this approach.

### Additional Info

:::caution Transaction Notification
It is expected that every service in the Ecosystem will set the `forward_ton_amount` to 0.000000001 TON (1 nanoton) when a jetton withdrawal is made in order to send a Jetton Notify upon [successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be standard compliant and will not be able to be processed by other CEXes and services.
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
For clear understanding, the reader should be familiar with the basic principles of asset processing described in [this section of our documentation](/v3/documentation/dapps/assets/overview). In particular, it is important to be familiar with [contracts](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract), [wallets](/v3/guidelines/smart-contracts/howto/wallet), [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions) and deployment process.
:::

:::info
For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Quick jump to the core description of jetton processing:

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>Centralized Processing</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>
  On-Chain Processing
</Button>

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

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_contracts.svg?raw=true',
        dark: '/img/docs/asset-processing/jetton_contracts_dark.svg?raw=true',
    }}
/>
<br></br>

## Jetton master smart contract
The jetton master smart contract stores general information about the jetton (including the total supply, a metadata link, or the metadata itself).

:::warning Beware of Jetton scam
It is possible for any user to create a counterfeit **clone** of a valuable jetton (using an arbitrary name, ticker, image, etc.) that is **nearly identical to the original**. Thankfully, counterfeit jettons are **distinguishable by their addresses** and can be identified quite easily.

Jettons with the  `symbol`==`TON` or those that contain system notification messages, such as:
`ERROR`, `SYSTEM`, and others. Be sure to check that jettons are displayed in your interface in such a way that they cannot
be mixed with TON transfers, system notifications, etc.. At times, even the `symbol`,`name` and `image`
will be created to look nearly identical to the original with the hopes of misleading users.

To eliminate the possibility of fraud for TON users, please look up the **original jetton address** (Jetton master contract) for specific jetton types or **follow the project’s official social media** channel or website to find the **correct information**. Check assets to eliminate the possibility of fraud with [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets).
:::

### Retrieving Jetton data

To retrieve more specific Jetton data use contract's _get_ method `get_jetton_data()`.

This method returns the following data:

| Name                 | Type    | Description          |
|----------------------|---------|----------------------|
| `total_supply`       | `int`   | the total number of issued jettons measured in indivisible units. |
| `mintable`           | `int`   | details whether new jettons can be minted or not. This value is either -1 (can be minted) or 0 (cannot be minted). |
| `admin_address`      | `slice` |                      |
| `jetton_content`     | `cell`  | data in accordance with [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), check [jetton metadata parsing page](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) for more. |
| `jetton_wallet_code` | `cell`  |                      |


It is also possible to use the method `/jetton/masters` from the [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) to retrieve the already decoded Jetton data and metadata. We have also developed methods for (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) and (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/JettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) and (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742) and many other [SDKs](/v3/guidelines/dapps/apis-sdks/sdk).

Example of using [Tonweb](https://github.com/toncenter/tonweb) to run a get method and get url for off-chain metadata:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<JETTON_MASTER_ADDRESS>"});
const data = await jettonMinter.getJettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

As mentioned before, jettons can be either `mintable` or `non-mintable`.

If they are non-mintable, the logic becomes simple—there is no way to mint additional tokens. To mint jettons for the first time, refer to the [Mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token) page.

If the jettons are mintable, there is a special function in the [minter contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) to mint additional jettons. This function can be called by sending an `internal message` with a specified opcode from the admin address.

If the jetton admin wants to restrict jetton creation, there are three ways to do it:

1. If you can't or do not want to update the contract's code, the admin needs to transfer ownership from the current admin to the zero address. This will leave the contract without a valid admin, thus preventing anyone from minting jettons. However, it will also prevent any changes to the jetton metadata.
2. If you have access to source code and can change it, you can create a method in the contract that sets a flag to abort any minting process after it is called, and add a statement to check this flag in the mint function.
3. If you can update contract's code, you can add restrictions by updating the code of the already deployed contract.

## Jetton wallet smart contract
`Jetton wallet` contracts are used to **send**, **receive**, and **burn** jettons. Each _jetton wallet contract_ stores wallet balance information for specific users.
In specific instances, jetton wallets are used for individual jetton holders for each jetton type.

`Jetton wallets` **should not be confused with wallet’s** meant for blockchain interaction and storing
only the Toncoin asset (e.g., v3R2 wallets, highload wallets, and others),
which is responsible for supporting and managing **only a specific jetton type**.

### Jetton Wallet Deployment
When `transferring jettons` between wallets, transactions (messages) require a certain amount of TON
as payment for network **gas fees** and the execution of actions according to the Jetton wallet contract's code.
This means that the **recipient does not need to deploy a jetton wallet prior to receiving jettons**.
The recipient's jetton wallet will be deployed automatically as long as the sender holds enough TON
in the wallet to pay the required gas fees.

### Retrieving Jetton wallet addresses for a given user
To retrieve a `jetton wallet` `address` using an `owner address` (a TON Wallet address),
the `Jetton master contract` provides the get method `get_wallet_address(slice owner_address)`.

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> Run `get_wallet_address(slice owner_address)` through `/runGetMethod` method from the [Toncenter API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post). In real cases (not test ones) it is important to always check that wallet indeed is attributed to desired Jetton Master. Check code example for more.

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<JETTON_MASTER_ADDRESS>' });
const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired Jetton Master:
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('Jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
For more examples read the [TON Cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard).
:::


### Retrieving data for a specific Jetton wallet

To retrieve the wallet’s account balance, owner identification information, and other info related to a specific jetton wallet contract use the `get_wallet_data()` get method within the jetton wallet contract.


This method returns the following data:

| Name                 | Type    |
|----------------------|---------|
| `balance`            | int     |
| `owner`              | slice   |
| `jetton`             | slice   |
| `jetton_wallet_code` | cell    |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> Use the `/jetton/wallets` get method from the [Toncenter API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) to retrieve previously decoded jetton wallet data.

</TabItem>

<TabItem value="js" label="js">

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

</TabItem>
</Tabs>

## Message Layouts

:::tip Messages
Read more about Messages [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions).
:::

Communication between Jetton wallets and TON wallets occurs through the following communication sequence:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_transfer.svg?raw=true',
        dark: '/img/docs/asset-processing/jetton_transfer_dark.svg?raw=true',
    }}
/>
<br></br>

#### Message 0
`Sender -> sender's jetton wallet`. _Transfer_ message contains the following data:

| Name                   | Type       | Description                                                                                                                                                                                                             |
|------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `query_id`             | uint64     | Allows applications to link three messaging types `Transfer`, `Transfer notification` and `Excesses` to each other. For this process to be carried out correctly it is recommended to **always use a unique query id**. |
| `amount`               | coins      | Total `ton coin` amount, that will be send with message.                                                                                                                                                                |
| `destination`          | address    | Address of the new owner of the jettons                                                                                                                                                                                 |
| `response_destination` | address    | Wallet address used to return remained ton coins with excesses message.                                                                                                                                                 |
| `custom_payload`       | maybe cell | Size always is >= 1 bit. Custom data (which is used by either sender or receiver jetton wallet for inner logic).                                                                                                        |
| `forward_ton_amount`   | coins      | Must be > 0 if you want to send `transfer notification message` with `forward payload`. It's a **part of `amount` value** and **must be lesser than `amount`**                                                          |
| `forward_payload`      | maybe cell | Size always is >= 1 bit. If first 32 bits = 0x0 it's just a simple message.                                                                                                                                             |


#### Message 2'
`payee's jetton wallet -> payee`.  Transfer notification message. **Only sent if** `forward_ton_amount` **not zero**. Contains the following data:

| Name              | Type    |
|-------------------|---------|
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

Here `sender` address is an address of Alice's `Jetton wallet`.

#### Message 2''
`payee's jetton wallet -> Sender`. Excess message body. **Only sent if any ton coins are left after paying the fees**. Contains the following data:

| Name                 | Type           |
|----------------------|----------------|
| `query_id`           | uint64         |

:::tip Jettons standard
A detailed description of the jetton wallet contract fields can be found in the [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `Jetton standard` interface description.
:::

## How to send Jetton transfers with comments and notifications

This transfer require some ton coins for **fees** and **transfer notification message**.

To send **comment** you need to set up `forward payload`. Set **first 32 bits to 0x0** and append **your text**, `forward payload` is sent in `jetton notify 0x7362d09c` internal message. It will be generated only if `forward_ton_amount` > 0. 
:::info
Recommended `forward_ton_amount` for jetton transfer with comment is 1 nanoton.
:::

Finally, to retrieve `Excess 0xd53276db` message you must set up `response destination`.

Sometimes, you may encounter an error `709` when sending a jetton. This error indicates that the amount of Toncoin attached to the message is not sufficient to send it. Make sure that `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`, which is typically >0.04 unless the forward payload is very large. The commission depends on various factors, including the Jetton code details and whether a new Jetton wallet needs to be deployed for the recipient.
It is recommended to add a margin of Toncoin to the message and set your address as the  `response_destination` to retrieve `Excess 0xd53276db` messages. For instance, you can add 0.05 TON to the message, while setting the `forward_ton_amount` to 1 nanoton (this amount of TON will be attached to the `jetton notify 0x7362d09c` message).

You may also encounter the error [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#compute-phase-skipped), which indicates that the jettons were successfully transferred, but no other calculations were performed. This is a common situation when the value of `forward_ton_amount` is equal to 1 nanoton.

:::tip
Check [best practices](/v3/guidelines/dapps/asset-processing/jettons#best-practices) for _"send jettons with comments"_ example.
:::


## Jetton off-chain processing
:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

There are two ways to accept Jettons:
- within a **centralized hot wallet**.
- using a wallet with a **separate address** for **each individual user**.

For security reasons it is preferable to be in possession of **separate hot wallets** for **separate Jettons** (many wallets for each asset type).

When processing funds, it is also recommended to provide a cold wallet for storing excess funds which do not participate in the automatic deposit and withdrawal processes.

### Adding new Jettons for asset processing and initial verification

1. Find correct [smart contract address](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).
2. Get [metadata](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data).
3. Check for a [scam](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).

### Identification of an unknown Jetton when receiving a transfer notification message

If a transfer notification message is received within your wallet regarding an unknown Jetton, then your wallet
has been created to hold the specific Jetton.

The sender address of the internal message containing the `Transfer notification` body is the address of the new Jetton wallet.
It should not to be confused with the `sender` field in the `Transfer notification` [body](/v3/guidelines/dapps/asset-processing/jettons#message-2).

1. Retrieve the Jetton master address for the new Jetton wallet by [getting wallet data](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
2. Retrieve the Jetton wallet address for your wallet address (as an owner) using the Jetton master contract: [How to retrieve Jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Compare the address returned by the master contract and the actual address of the wallet token.
   If they match, it’s ideal. If not, then you likely received a scam token that is counterfeit.
4. Retrieve Jetton metadata: [How to receive Jetton metadata](#retrieving-jetton-data).
5. Check the `symbol` and `name` fields for signs of a scam. Warn the user if necessary. [Adding a new Jettons for processing and initial checks](#adding-new-jettons-for-asset-processing-and-initial-verification).


### Accepting Jettons from users through a centralized wallet

:::info
To prevent a bottleneck in incoming transactions to a single wallet, it is suggested to accept deposits across multiple wallets and to expand the number of these wallets as needed.
:::

:::caution Transaction Notification
It is expected that every service in the Ecosystem will set the `forward_ton_amount` to 0.000000001 TON (1 nanoton) when a jetton withdrawal is made in order to send a Jetton Notify upon [successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be standard compliant and will not be able to be processed by other CEXes and services.
:::

In this scenario, the payment service creates a unique memo identifier for each sender disclosing
the address of the centralized wallet and the amounts being sent. The sender sends the tokens
to the specified centralized address with the obligatory memo in the comment.

**Pros of this method:** this method is very simple because there are no additional fees when accepting tokens and they are retrieved directly in the hot wallet.

**Cons of this method:** this method requires that all users attach a comment to the transfer which can lead to a greater number of deposit mistakes (forgotten memos, incorrect memos, etc.), meaning a higher workload for support staff.

Tonweb examples:

1. [Accepting Jetton deposits to an individual HOT wallet with comments (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [Jettons withdrawals example](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### Preparations

1. [Prepare a list of accepted Jettons](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) (Jetton master addresses).
2. Deploy hot wallet (using v3R2 if no Jetton withdrawals are expected; highload v3 - if Jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).
3. Perform a test Jetton transfer using the hot wallet address to initialize the wallet.

#### Processing incoming Jettons
1. Load the list of accepted Jettons.
2. [Retrieve a Jetton wallet address](#retrieving-jetton-wallet-addresses-for-a-given-user) for your deployed hot wallet.
3. Retrieve a Jetton master address for each Jetton wallet using [getting wallet data](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
4. Compare the addresses of the Jetton master contracts from step 1. and step 3 (directly above).
   If the addresses do not match, a Jetton address verification error must be reported.
5. Retrieve a list of the most recent unprocessed transactions using a hot wallet account and
   iterate it (by sorting through each transaction one by one). See:  [Checking contract's transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions).
6. Check the input message (in_msg) for transactions and retrieve the source address from the input message. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. If the source address matches the address within a Jetton wallet, then it is necessary to continue processing the transaction.
   If not, then skip processing the transaction and check the next transaction.
8. Ensure that the message body is not empty and that the first 32 bits of the message match the `transfer notification` op code `0x7362d09c`.
   [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91)
   If the message body is empty or the op code is invalid - skip the transaction.
9. Read the message body’s other data, including the `query_id`, `amount`, `sender`, `forward_payload`.
   [Jetton contracts message layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts), [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
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

```js
const WalletClass = tonweb.wallet.all['v3R2'];
const wallet = new WalletClass(tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0,
    walletId: <SUBWALLET_ID>,
});
```

#### Preparation

1. [Prepare a list of accepted Jettons](#adding-new-jettons-for-asset-processing-and-initial-verification).
2. Deploy hot wallet (using v3R2 if no Jetton withdrawals are expected; highload v3 - if Jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).

#### Creating deposits

1. Accept a request to create a new deposit for the user.
2. Generate a new subwallet (/v3R2) address based on the hot wallet seed. [Creating a subwallet in Tonweb](#creating-a-subwallet-in-tonweb)
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
wallets may not send `transfer notification`, `excesses`, and `internal transfer` messages. They are not standardized. This means
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
because a commission in TON is taken for the transfer operation (paid in network gas fees).
It is important to determine a certain minimum amount of Jettons which are required to make a
transfer worthwhile (and thus deposit).

By default, wallet owners of Jetton deposit wallets are not initialized. This is because there is no predetermined
requirement to pay storage fees. Jetton deposit wallets can be deployed when sending messages with a
`transfer`  body which can then be destroyed immediately. To do this, the engineer must use a special
mechanism for sending messages: [128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).


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

:::info Important
It's **recommended** to read and **understand** [how does jetton transfer work](/v3/guidelines/dapps/asset-processing/jettons#overview) and [how to send jettons with comment](/v3/guidelines/dapps/asset-processing/jettons#jetton-off-chain-processing) articles before reading this section.

Below you'll find step-by-step guide how to process jetton withdrawals.
:::

To withdraw Jettons, the wallet sends messages with the `transfer` body to its corresponding Jetton wallet.
The Jetton wallet then sends the Jettons to the recipient. It is important to attach some TON (1 nanoTON at least)
as the  `forward_ton_amount` (and optional comment to `forward_payload`) to trigger a `transfer notification`.
See: [Jetton contracts message layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)

#### Preparation

1. Prepare a list of Jettons for withdrawals: [Adding new Jettons for processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Hot wallet deployment is initiated. Highload v3 is recommended. [Wallet Deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. Carry out a Jetton transfer using a hot wallet address to initialize the Jetton wallet and replenish its balance.

#### Processing withdrawals

1. Load a list of processed Jettons
2. Retrieve Jetton wallet addresses for the deployed hot wallet: [How to retrieve Jetton wallet addresses for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Retrieve Jetton master addresses for each Jetton wallet: [How to retrieve data for Jetton wallets](#retrieving-data-for-a-specific-jetton-wallet).
   A `jetton` parameter is required (which is actually the address of Jetton master contract).
4. Compare the addresses from Jetton master contracts from step 1. and step 3. If the addresses do not match, then a Jetton address verification error should be reported.
5. Withdrawal requests are received which actually indicate the type of Jetton, the amount being transferred, and the recipient wallet address.
6. Check the balance of the Jetton wallet to ensure there are enough funds present to carry out withdrawal.
7. Generate a [message](/v3/guidelines/dapps/asset-processing/jettons#message-0).
8. When using a highload wallet, it is recommended that a batch of messages is collected and that one batch at a time is sent to optimize fees.
9. Save the expiration time for outgoing external messages (this is the time until the wallet successfully
   processes the message, after this is completed, the wallet will no longer accept the message)
10. Send a single message or more than one message (batch messaging).
11. Retrieve the list of the latest unprocessed transactions within the hot wallet account and iterate it.
    Learn more here: [Checking contract's transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions),
    [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) or
    use the Toncenter API `/getTransactions` method.
12. Look at outgoing messages in the account.
13. If a message exists with the `transfer` op code, then it should be decoded to retrieve the `query_id` value.
    Retrieved `query_id`s  need to be marked as successfully sent.
14. If the time it takes for the current scanned transaction to be processed is greater than
    the expiration time and the outgoing message with the given `query_id`
    is not found, then the request should (this is optional) be marked as expired and should be safely resent.
15. Look for incoming messages in the account.
16. If a message that uses the `Excess 0xd53276db` op code exists, the message should be decoded and the `query_id`
    value should be retrieved. A found `query_id` must be marked as successfully delivered.
17. Go to step 5. Expired requests that have not been successfully sent should be pushed back to the withdrawal list.

## Jetton on-chain processing

Generally, to accept and process jettons, a message handler responsible for internal messages uses the `op=0x7362d09c` op code.

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

### On-chain processing recommendations
Below is a `list of recommendations` that must be considered when **carrying out on-chain jetton processing**:

1. **Identify incoming jettons** using their wallet type, not their Jetton master contract. In other words, your contract should interact (receive and send messages) with a specific jetton wallet (not with some unknown wallet using a specific Jetton master contract).
2. When linking a Jetton Wallet and a Jetton Master, **check** that this **connection is bidirectional** where the wallet recognizes the master contract and vice versa. For instance, if your contract-system receives a notification from a jetton wallet (which considers its MySuperJetton as its master contract) its transfer information must be displayed to the user, prior to showing the `symbol`, `name` and `image`
   of the MySuperJetton contract, check that the MySuperJetton wallet uses the correct contract system. In turn, if your contract system for some reason needs to send jettons using the MySuperJetton or MySuperJetton master contracts verify that wallet X as is the wallet using the same contract parameters.
   Additionally, prior to sending a  `transfer` request to X, make sure it recognizes MySuperJetton as its master.
3. The **true power** of decentralized finance (DeFi) is based on the ability to stack protocols on top of each other like lego blocks. For instance, say jetton A is swapped for jetton B, which in turn, is then used as leverage within a lending protocol (when a user supplies liquidity) which is then used to buy an NFT .... and so on. Therefore, consider how the contract is able to serve, not only off-chain users, but on-chain entities as well by attaching tokenized value to a transfer notification, adding a custom payload that can be sent with a transfer notification.
4. **Be aware** that not all contracts follow the same standards. Unfortunately, some jettons may be hostile (using attack-based vectors) and created for the sole purposes of attacking unsuspecting users. For security purposes, if the protocol in question consists of many contracts, do not create a large number of jetton wallets of the same type. In particular, do not send jettons inside the protocol between the deposit contract, vault contract, or user account contract etc. Attackers may intentionally interfere with contract logic by forging transfer notifications, jetton amounts, or payload parameters. Reduce the potential for attack potential by using only one wallet in the system per jetton (for all deposits and withdrawals).
5. It is also **often a good idea** to create subcontracts for each individualized jetton to reduce the chances of address spoofing (for example, when a transfer message is sent to jetton B using a contract intended for jetton A).
6. It is **strongly recommended** to work with indivisible jetton units on the contract level. Decimal-related logic is typically used to enhance the diplay’s user interface (UI), and is not related to numerical on-chain record keeping.

To learn **more** about [Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func), feel free to read this resource. It is recommended that developers **handle all smart contract exceptions,** so they are never skipped during application development.

## Jetton wallet processing recommendations
Generally, all verification procedures used for off-chain jetton processing are suitable for wallets as well. For Jetton wallet processing our most important recommendations are as follows:

1. When a wallet receives a transfer notification from an unknown jetton wallet, it is **vitally important** to trust the jetton wallet and its master address because it could be a malicious counterfeit. To protect yourself, check the Jetton Master (the master contract) using its provided address to ensure your verification processes recognize the jetton wallet as legitimate. After you trust the wallet and it is verified as legitimate, you can allow it to access your account balances and other in-wallet data. If the Jetton Master does not recognize this wallet it is recommended to not initiate or disclose your jetton transfers at all and to only show incoming TON transfers (of Toncoin attached to the transfer notifications) only.
2. In practice, if the user wants to interact with a Jetton and not a jetton wallet. In other words, users send wTON/oUSDT/jUSDT, jUSDC, jDAI instead of `EQAjN...`/`EQBLE...`
   etc.. Often this means that when a user is initiating a jetton transfer, the wallet asks the corresponding jetton master which jetton wallet (owned by the user) should initiate the transfer request. It is **important to never blindly trust** this data from the Master (the master contract). Prior to sending the transfer request to a jetton wallet, always ensure that the jetton wallet indeed belongs to the Jetton Master it claims to belong to.
3. **Be aware** that hostile Jetton Masters/jetton wallets **may change** their wallets/Masters over time. Therefore, it is imperative that users do their due diligence and check the legitimacy of any wallets they interact with prior to each use.
4. **Always ensure** that you display jettons in your interface in a manner that **will not mix with TON transfers**, system notifications, etc.. Even the `symbol`,`name` and `image`
   parameters can be crafted to mislead users, leaving those affected as potential fraud victims. There have been several instances, when malicious jettons were used to impersonate TON transfers, notification errors, reward earnings, or asset freezing announcements.
5. **Always be on the lookout for potential malicious actors** that create counterfeit jettons, it is always a good idea to give users the functionality needed to eliminate unwanted jettons in their main user interface.


Authored by [kosrk](https://github.com/kosrk), [krigga](https://github.com/krigga), [EmelyanenkoK](https://github.com/EmelyanenkoK/) and [tolya-yanot](https://github.com/tolya-yanot/).


## Best Practices

If you want ready to test examples check [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks) and try to run them. Below are code snippets that will help you understand jetton processing through code examples.

### Send Jettons with comment
<Tabs groupId="code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Source code
</summary>

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
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not Jetton wallet)
    forwardAmount: TonWeb.utils.toNano('0.01'), // some amount of TONs to invoke Transfer notification message
    forwardPayload: comment, // text comment for Transfer notification message
    responseAddress: walletAddress // return the TONs after deducting commissions back to the sender's wallet address
  }),
  sendMode: 3,
}).send()
```

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Source code
</summary>

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

</details>

</TabItem>
<TabItem value="TonTools" label="Python">

<details>
<summary>
Source code
</summary>

```py
my_wallet = Wallet(provider=client, mnemonics=my_wallet_mnemonics, version='v4r2')

# for TonCenterClient and LsClient
await my_wallet.transfer_jetton(destination_address='address', jetton_master_address=jetton.address, jettons_amount=1000, fee=0.15) 

# for all clients
await my_wallet.transfer_jetton_by_jetton_wallet(destination_address='address', jetton_wallet='your jetton wallet address', jettons_amount=1000, fee=0.1)  
```

</details>

</TabItem>

<TabItem value="pytoniq" label="Python">

<details>
<summary>
Source code
</summary>

```py
from pytoniq import LiteBalancer, WalletV4R2, begin_cell
import asyncio

mnemonics = ["your", "mnemonics", "here"]

async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()

    wallet = await WalletV4R2.from_mnemonic(provider=provider, mnemonics=mnemonics)
    USER_ADDRESS = wallet.address
    JETTON_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_JETTON_WALLET = (await provider.run_get_method(address=JETTON_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # Jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # Jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_JETTON_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>


### Accept Jetton Transfer with comment parse

<Tabs groupId="parse-code-examples">
<TabItem value="tonweb" label="JS (tonweb)">

<details>
<summary>
Source code
</summary>

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
                continue; // op != transfer_notification
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

</details>

</TabItem>
<TabItem value="tonutils-go" label="Golang">

<details>
<summary>
Source code
</summary>

```go
import (
	"context"
	"fmt"
	"log"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

const (
	MainnetConfig   = "https://ton.org/global.config.json"
	TestnetConfig   = "https://ton.org/global.config.json"
	MyWalletAddress = "INSERT-YOUR-HOT-WALLET-ADDRESS"
)

type JettonInfo struct {
	address  string
	decimals int
}

type Jettons struct {
	jettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]JettonInfo) (map[string]Jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]Jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewJettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetJettonWallet(context.Background(), userAddress)
		if err != nil {
			return nil, err
		}

		jettonUserAddress := jettonWallet.Address()

		jettonData, err := api.RunGetMethod(context.Background(), block, jettonUserAddress, "get_wallet_data")
		if err != nil {
			return nil, err
		}

		slice := jettonData.MustCell(0).BeginParse()
		slice.MustLoadCoins() // skip balance
		slice.MustLoadAddr()  // skip owneer address
		adminAddress := slice.MustLoadAddr()

		if adminAddress.String() != info.address {
			return nil, fmt.Errorf("jetton minter address from jetton wallet doesnt match config")
		}

		jettons[name] = Jettons{
			jettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressToJettonName(jettons map[string]Jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]JettonInfo{
		"jUSDC": {address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728", decimals: 6},
		"jUSDT": {address: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA", decimals: 6},
	}

	client := liteclient.NewConnectionPool()

	cfg, err := liteclient.GetConfigFromUrl(context.Background(), MainnetConfig)
	if err != nil {
		log.Fatalln("get config err: ", err.Error())
	}

	// connect to lite servers
	err = client.AddConnectionsFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatalln("connection err: ", err.Error())
	}

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client, ton.ProofCheckPolicySecure).WithRetry()
	master, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	// address on which we are accepting payments
	treasuryAddress := address.MustParseAddr("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")

	acc, err := api.GetAccount(context.Background(), master, treasuryAddress)
	if err != nil {
		log.Fatalln("get masterchain info err: ", err.Error())
	}

	jettons, err := prepare(api, jettonsInfo)
	if err != nil {
		log.Fatalln("can't prepare jettons data: ", err.Error())
	}

	lastProcessedLT := acc.LastTxLT

	transactions := make(chan *tlb.Transaction)

	go api.SubscribeOnTransactions(context.Background(), treasuryAddress, lastProcessedLT, transactions)

	log.Println("waiting for transfers...")

	// listen for new transactions from channel
	for tx := range transactions {
		if tx.IO.In == nil || tx.IO.In.MsgType != tlb.MsgTypeInternal {
			// external message - not related to jettons
			continue
		}

		msg := tx.IO.In.Msg
		sourceAddress := msg.SenderAddr()

		// jetton master contract address check
		jettonName := jettonWalletAddressToJettonName(jettons, sourceAddress.String())
		if len(jettonName) == 0 {
			// unknown or fake jetton transfer
			continue
		}

		if msg.Payload() == nil || msg.Payload() == cell.BeginCell().EndCell() {
			// no in_msg body
			continue
		}

		msgBodySlice := msg.Payload().BeginParse()

		op := msgBodySlice.MustLoadUInt(32)
		if op != 0x7362d09c {
			continue // op != transfer_notification
		}

		// just skip bits
		msgBodySlice.MustLoadUInt(64)
		amount := msgBodySlice.MustLoadCoins()
		msgBodySlice.MustLoadAddr()

		payload := msgBodySlice.MustLoadMaybeRef()
		payloadOp := payload.MustLoadUInt(32)
		if payloadOp == 0 {
			log.Println("no text comment in transfer_notification")
			continue
		}

		comment := payload.MustLoadStringSnake()
		if comment != orderId {
			continue
		}

		// process transaction
		log.Printf("Got %s jetton deposit %d units with text comment %s\n", jettonName, amount, comment)
		foundTransfer <- tx
	}
}
```

</details>
</TabItem>

<TabItem value="pythoniq" label="Python">

<details>
<summary>
Source code
</summary>

```py
import asyncio

from pytoniq import LiteBalancer, begin_cell

MY_WALLET_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"


async def parse_transactions(provider: LiteBalancer, transactions):
    for transaction in transactions:
        if not transaction.in_msg.is_internal:
            continue
        if transaction.in_msg.info.dest.to_str(1, 1, 1) != MY_WALLET_ADDRESS:
            continue

        sender = transaction.in_msg.info.src.to_str(1, 1, 1)
        value = transaction.in_msg.info.value_coins
        if value != 0:
            value = value / 1e9

        if len(transaction.in_msg.body.bits) < 32:
            print(f"TON transfer from {sender} with value {value} TON")
            continue

        body_slice = transaction.in_msg.body.begin_parse()
        op_code = body_slice.load_uint(32)
        if op_code != 0x7362D09C:
            continue

        body_slice.load_bits(64)  # skip query_id
        jetton_amount = body_slice.load_coins() / 1e9
        jetton_sender = body_slice.load_address().to_str(1, 1, 1)
        if body_slice.load_bit():
            forward_payload = body_slice.load_ref().begin_parse()
        else:
            forward_payload = body_slice

        jetton_master = (
            await provider.run_get_method(
                address=sender, method="get_wallet_data", stack=[]
            )
        )[2].load_address()
        jetton_wallet = (
            (
                await provider.run_get_method(
                    address=jetton_master,
                    method="get_wallet_address",
                    stack=[
                        begin_cell()
                        .store_address(MY_WALLET_ADDRESS)
                        .end_cell()
                        .begin_parse()
                    ],
                )
            )[0]
            .load_address()
            .to_str(1, 1, 1)
        )

        if jetton_wallet != sender:
            print("FAKE Jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"Jetton transfer from {jetton_sender} with value {jetton_amount} Jetton and unknown payload: {forward_payload} "
                )

        print(f"Transaction hash: {transaction.cell.hash.hex()}")
        print(f"Transaction lt: {transaction.lt}")


async def main():
    provider = LiteBalancer.from_mainnet_config(1)
    await provider.start_up()
    transactions = await provider.get_transactions(address=MY_WALLET_ADDRESS, count=5)
    await parse_transactions(provider, transactions)
    await provider.close_all()


if __name__ == "__main__":
    asyncio.run(main())
```

</details>
</TabItem>
</Tabs>

## SDKs
You can find a list of SDKs for various languages (js, python, golang, C#, Rust, etc.) list [here](/v3/guidelines/dapps/apis-sdks/sdk).

## See Also

* [Payments Processing](/v3/guidelines/dapps/asset-processing/payments-processing)
* [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
* [Metadata parsing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)
