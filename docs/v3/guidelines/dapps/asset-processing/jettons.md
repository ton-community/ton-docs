import Feedback from '@site/src/components/Feedback';

import ThemedImage from '@theme/ThemedImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Button from '@site/src/components/button';

# Jetton processing

## Best practices on jettons processing

Jettons are tokens on TON Blockchain, similar to ERC-20 tokens on Ethereum.

:::info Transaction confirmation
TON transactions become irreversible after a single confirmation. To enhance UX/UI, avoid unnecessary waiting times.
:::

#### Withdrawal

[Highload wallet v3](/v3/documentation/smart-contracts/contracts-specs/highload-wallet#highload-wallet-v3): v3 is the latest solution on TON Blockchain and the gold standard for jetton withdrawals. It enables batched withdrawals.

[Batched withdrawals](https://github.com/toncenter/examples/blob/main/withdrawals-jettons-highload-batch.js): Allow multiple withdrawals to be processed in batches, ensuring fast and cost-effective transactions.

#### Deposits
:::info
It is recommended to set up multiple MEMO deposit wallets for better performance.
:::

[Memo deposits](https://github.com/toncenter/examples/blob/main/deposits-jettons.js): This method lets you use a single deposit wallet, with users adding a memo for identification. It eliminates the need to scan the entire blockchain, though it may be slightly less convenient for users.

[Memo-less deposits](https://github.com/gobicycle/bicycle): This alternative exists but is more difficult to integrate. We can assist with implementation if you prefer this approach. Please notify us before proceeding.

### Additional info

:::caution Transaction notification
Each service in the ecosystem is expected to set `forward_ton_amount` to 0.000000001 TON (1 nanoton) when withdrawing a token to send a jetton Notify on [successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be compliant. It will not be able to be processed by other CEXs and services.
:::

- Prefer to the official JS library from TON Foundation, [tonweb](https://github.com/toncenter/tonweb), for a JS lib example.

- For Java, consider [ton4j](https://github.com/neodix42/ton4j/tree/main). 

- For Go, use [tonutils-go](https://github.com/xssnick/tonutils-go). Currently, we recommend the JS library.


## Content list


:::tip
The following documents provide details on jetton architecture and core TON concepts, which differ from EVM-like and other blockchains. Understanding these concepts is crucial and will greatly aid in grasping TON’s functionality.
:::

This document covers the following topics in order:
1. Overview, 
2. Architecture,
2. Jetton master contract (token minter),
3. Jetton wallet contract (user wallet),
4. Message layouts,
4. Jetton processing (off-chain),
5. Jetton processing (on-chain),
6. Wallet processing,
7. Best practices.

## Overview

:::info
TON transactions are irreversible after just one confirmation. To clearly understand this process, readers should be familiar with the basic principles of asset processing described in [this section of our documentation](/v3/documentation/dapps/assets/overview). It is particularly important to understand [contracts](/v3/documentation/smart-contracts/addresses#everything-is-a-smart-contract), wallets](/v3/guidelines/smart-contracts/howto/wallet), [messages](/v3/documentation/smart-contracts/message-management/messages-and-transactions), and the deployment process.
:::

:::info
For the best user experience, avoid waiting for additional blocks once transactions are finalized on TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Quick jump to the core description of jetton processing:

<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-users-through-a-centralized-wallet" colorType={'primary'} sizeType={'sm'}>Centralized Processing</Button>
<Button href="/v3/guidelines/dapps/asset-processing/jettons#accepting-jettons-from-user-deposit-addresses"
        colorType="secondary" sizeType={'sm'}>
  On-chain processing
</Button>

<br></br><br></br>


TON Blockchain and its ecosystem classify fungible tokens (FTs) as jettons. Because TON Blockchain applies sharding, its fungible token implementation differs from similar blockchain models.

This analysis provides a deeper look into the formal standards detailing jetton [behavior](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) and [metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md). A less formal, sharding-focused overview of jetton architecture is available in our [anatomy of jettons blog post](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons).

We have also included details about our third-party open-source TON payment processor ([bicycle](https://github.com/gobicycle/bicycle)), which allows users to deposit and withdraw both Toncoin and jettons using a separate deposit address without a text memo.



## Jetton architecture

Standardized tokens on TON are implemented using a set of smart contracts, including:
* [Jetton master](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc) smart contract
* [Jetton wallet](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc) smart contracts

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_contracts.png?raw=true',
        dark: '/img/docs/asset-processing/jetton_contracts_dark.png?raw=true',
    }}
/>
<br></br>

## Jetton master smart contract
Standardized tokens on TON use a set of smart contracts, including:

- Jetton master smart contract: Stores general information about the jetton, such as total supply, a metadata link, or the metadata itself.

- Jetton wallet smart contracts: Used for transactions and balance management.

:::warning Beware of jetton scams
Anyone can create a counterfeit version of a valuable jetton by using an arbitrary name, ticker, or image that closely resembles the original. However, counterfeit jettons can be identified by their addresses.
:::

Jettons with the symbol TON or those containing system notification messages such as ERROR or SYSTEM should be displayed in a way that prevents confusion with TON transfers or system notifications. Sometimes, scammers design the `symbol`, `name`, and `image` to mimic the original and mislead users.

To prevent fraud, verify the **original jetton address** (jetton master contract) for specific jetton types. Alternatively, **check the project’s official social media** or website for **accurate information**. Use [Tonkeeper ton-assets list](https://github.com/tonkeeper/ton-assets) ton-assets list to verify assets.


### Retrieving jetton data

To retrieve specific jetton data, use the contract's `get_jetton_data()` method.

This method returns the following data:

| Name                 | Type    | Description          |
|----------------------|---------|----------------------|
| `total_supply`       | `int`   | The total number of issued jettons measured in indivisible units. |
| `mintable`           | `int`   | Indicates whether new jettons can be minted (-1 for mintable, 0 for non-mintable). |
| `admin_address`      | `slice` |                   |
| `jetton_content`     | `cell`  | Data formatted according to [TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md), check [jetton metadata parsing page](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing) for more. |
| `jetton_wallet_code` | `cell`  |                      |


You can also use the [TON Center API](https://toncenter.com/api/v3/#/default/get_jetton_masters_api_v3_jetton_masters_get) `/jetton/masters` method to retrieve already decoded jetton data and metadata. We have also developed methods for (js) [tonweb](https://github.com/toncenter/tonweb/blob/master/src/contract/token/ft/JettonMinter.js#L85) and (js) [ton-core/ton](https://github.com/ton-core/ton/blob/master/src/jetton/jettonMaster.ts#L28), (go) [tongo](https://github.com/tonkeeper/tongo/blob/master/liteapi/jetton.go#L48) and (go) [tonutils-go](https://github.com/xssnick/tonutils-go/blob/33fd62d754d3a01329ed5c904db542ab4a11017b/ton/jetton/jetton.go#L79), (python) [pytonlib](https://github.com/toncenter/pytonlib/blob/d96276ec8a46546638cb939dea23612876a62881/pytonlib/client.py#L742), and many other [SDK](/v3/guidelines/dapps/apis-sdks/sdk).

The example of using [Tonweb](https://github.com/toncenter/tonweb) to run a get method and get url for off-chain metadata:

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: "<jetton_MASTER_ADDRESS>"});
const data = await JettonMinter.getjettonData();
console.log('Total supply:', data.totalSupply.toString());
console.log('URI to off-chain metadata:', data.jettonContentUri);
```

### Jetton minter

Jettons can be either `mintable` or `non-mintable`.

If they are non-mintable, no additional tokens can be minted. To mint jettons for the first time, refer to the [mint your first jetton](/v3/guidelines/dapps/tutorials/mint-your-first-token) page.

If jettons are mintable, the [minter contract](https://github.com/ton-blockchain/minter-contract/blob/main/contracts/jetton-minter.fc) includes a function to mint additional jettons. The admin can trigger this function by sending an internal message with a specified opcode from the admin address.

If the jetton admin wants to restrict jetton creation, there are three approaches:

1. If the contract code cannot be updated, the admin can transfer ownership to the zero address, preventing further minting but also blocking metadata changes.
2. If the source code can be modified, a method can be added to disable minting once triggered.
3. If the contract can be updated, restrictions can be added to the deployed contract.

## Jetton wallet smart contract
`Jetton wallet` contracts are used to **send**, **receive**, and **burn** jettons. Each _jetton wallet contract_ stores wallet balance information for specific users.
In certain cases, token wallets are used for individual token holders for each token type.

`Jetton wallets` should not be confused with blockchain wallets used for storing only the Toncoin asset (e.g., v3R2 wallets, highload wallets). Jetton wallets are dedicated to managing specific jetton types.

### Jetton wallet deployment
When `transferring jettons` between wallets, transactions require TON to cover network **gas fees**. The recipient does not need to deploy a jetton wallet beforehand. If the sender has enough TON to cover fees, the recipient’s jetton wallet will be deployed automatically.

### Retrieving jetton wallet addresses for a given user
To get the `address` of a `jetton wallet` using the `owner address` (the TON wallet address), the `jetton main contract` provides the `get_wallet_address(slice owner_address)` method.

<Tabs groupId="retrieve-wallet-address">
<TabItem value="api" label="API">

> Run `get_wallet_address(slice owner_address)` through `/runGetMethod` method from the [TON Center API](https://toncenter.com/api/v3/#/default/run_get_method_api_v3_runGetMethod_post). In real cases (not test ones) it is important to always check that wallet indeed is attributed to desired jetton Master. Check the code example for more.

</TabItem>
<TabItem value="js" label="js">

```js
import TonWeb from 'tonweb';
const tonweb = new TonWeb();
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: '<jetton_MASTER_ADDRESS>' });
const jettonWalletAddress = await JettonMinter.getjettonWalletAddress(new TonWeb.utils.Address('<OWNER_WALLET_ADDRESS>'));

// It is important to always check that wallet indeed is attributed to desired jetton Master:
const jettonWallet = new TonWeb.token.jetton.jettonWallet(tonweb.provider, {
  address: jettonWalletAddress
});
const jettonData = await jettonWallet.getData();
if (jettonData.JettonMinterAddress.toString(false) !== JettonMinter.address.toString(false)) {
  throw new Error('jetton minter address from jetton wallet doesnt match config');
}

console.log('jetton wallet address:', jettonWalletAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

:::tip
For more examples, read the [TON cookbook](/v3/guidelines/dapps/cookbook#tep-74-jettons-standard).
:::


### Retrieving data for a specific jetton wallet

To retrieve the wallet’s account balance, owner identification information, and other details related to a specific jetton wallet contract, use the get_wallet_data() method within the jetton wallet contract.

This method returns the following data:

| Name                 | Type    |
|----------------------|---------|
| `balance`            | int     |
| `owner`              | slice   |
| `jetton`             | slice   |
| `jetton_wallet_code` | cell    |

<Tabs groupId="retrieve-jetton-wallet-data">
<TabItem value="api" label="API">

> Use the `/jetton/wallets` get method from the [TON Center API](https://toncenter.com/api/v3/#/default/get_jetton_wallets_api_v3_jetton_wallets_get) to retrieve previously decoded jetton wallet data.

</TabItem>

<TabItem value="js" label="js">

```js
import TonWeb from "tonweb";
const tonweb = new TonWeb();
const walletAddress = "EQBYc3DSi36qur7-DLDYd-AmRRb4-zk6VkzX0etv5Pa-Bq4Y";
const jettonWallet = new TonWeb.token.jetton.jettonWallet(tonweb.provider,{address: walletAddress});
const data = await jettonWallet.getData();
console.log('jetton balance:', data.balance.toString());
console.log('jetton owner address:', data.ownerAddress.toString(true, true, true));
// It is important to always check that jetton Master indeed recognize wallet
const JettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: data.JettonMinterAddress.toString(false)});
const expectedjettonWalletAddress = await JettonMinter.getjettonWalletAddress(data.ownerAddress.toString(false));
if (expectedjettonWalletAddress.toString(false) !== new TonWeb.utils.Address(walletAddress).toString(false)) {
  throw new Error('jetton minter does not recognize the wallet');
}

console.log('jetton master address:', data.JettonMinterAddress.toString(true, true, true));
```

</TabItem>
</Tabs>

## Message layouts

:::tip Messages
Read more about messages [here](/v3/documentation/smart-contracts/message-management/messages-and-transactions).
:::

Communication between jetton wallets and TON wallets follows this sequence:

<br></br>
<ThemedImage
    alt=""
    sources={{
        light: '/img/docs/asset-processing/jetton_transfer.png?raw=true',
        dark: '/img/docs/asset-processing/jetton_transfer_dark.png?raw=true',
    }}
/>
<br></br>

#### Message 0
`Sender -> sender's jetton wallet`. _Transfer_ message contains the following data:

| Name                   | Type       | Description                                                                                                                                                                                                             |
|------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `query_id`             | uint64     | Links the three messaging types—transfer, transfer notification, and excesses—to each other. To ensure this process works correctly, **always use a unique query ID**. |
| `amount`               | coins      | Tthe total `ton coin` amount sent with the message.                                                                                                                                                                |
| `destination`          | address    | The address of the new owner of the jettons                                                                                                                                                                                 |
| `response_destination` | address    | The wallet address used to return remaining Toncoin through the excesses message.                                                                                                                                                 |
| `custom_payload`       | maybe cell | Always at least 1 bit in size. Custom data used by either the sender or receiver jetton wallet for internal logic.                                                                                                        |
| `forward_ton_amount`   | coins      | Must be greater than 0 to send a transfer notification message with a `forward payload`. It is **part of `amount` value** and **must be lesser than `amount`**.                                                      |
| `forward_payload`      | maybe cell | Always at least 1 bit in size. If the first 32 bits equal 0x0, it is a simple message.                                                                                                                                            |


#### Message 2'
The `payee’s jetton wallet` → payee. Transfer notification message. This is sent only if `forward_ton_amount` is not zero and contains the following data:

| Name              | Type    |
|-------------------|---------|
| `query_id`        | uint64  |
| `amount`          | coins   |
| `sender`          | address |
| `forward_payload` | cell    |

In this case, the `sender` address refers to Alice’s `jetton wallet`.

#### Message 2''
`payee's jetton wallet -> Sender`. Excess message body. This is sent only if there are remaining Toncoin after paying the fees. Contains the following data:

| Name                 | Type           |
|----------------------|----------------|
| `query_id`           | uint64         |

:::tip jettons standard
A detailed description of the jetton wallet contract fields is available in the [TEP-74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md) `jetton standard`.
:::

## How to send jetton transfers with comments and notifications

This transfer require some ton coins for **fees** and **transfer notification message**.

To send **comment** you need to set up `forward payload`. Set **first 32 bits to 0x0** and add **custom text**, `forward payload` is sent in internal `jetton notify 0x7362d09c` message. It will only be generated if `forward_ton_amount` > 0.

:::info
Recommended `forward_ton_amount` for a jetton transfer with a comment: 1 nanoton.
:::

Finally, to retrieve `Excess 0xd53276db` message you must set up `response destination`.

Sometimes you may get a `709` error when sending a jetton. This error indicates that the amount of Toncoin attached to the message is not enough to send it. Make sure `Toncoin > to_nano(TRANSFER_CONSUMPTION) + forward_ton_amount`, which is usually >0.04 unless the payload being forwarded is very large. The fee depends on various factors, including the jetton code data and whether the recipient needs to deploy a new jetton wallet.
It is recommended to add a supply of Toncoin to the message and set your address as the `response_destination` to receive `Excess 0xd53276db` messages. For example, you can add 0.05 TON to the message by setting `forward_ton_amount` to 1 nanoton (this amount of TON will be attached to the `jetton notify 0x7362d09c` message).

You may also encounter the error [`cskip_no_gas`](/v3/documentation/tvm/tvm-overview#compute-phase-skipped), which indicates that the tokens were successfully transferred, but no other computations were performed. This is a common situation when the `forward_ton_amount` value is 1 nanoton.

:::tip
Check [best practices](/v3/guidelines/dapps/asset-processing/jettons#best-practices) for the _"send jettons with comments"_ example.
:::


## Jetton off-chain processing
:::info Transaction confirmation
TON transactions are irreversible after just one confirmation. To provide the best user experience, avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

There are two ways to accept jettons:
- Using a **centralized hot wallet**.
- Using a wallet with a **separate address** for **each individual user**.

For security reasons,  it is best to use **separate hot wallets** for different jettons (many wallets for each asset type).

When processing funds, it is also recommended to use a cold wallet for storing excess funds that are not involved in automatic deposit and withdrawal processes.

### Adding new jettons for asset processing and initial verification

1. Find the correct [smart contract address](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).
2. Get [metadata](/v3/guidelines/dapps/asset-processing/jettons#retrieving-jetton-data).
3. Check for [scams](/v3/guidelines/dapps/asset-processing/jettons#jetton-master-smart-contract).

### Identifying an unknown jetton when receiving a transfer notification message

If your wallet receives a transfer notification message regarding an unknown jetton, a jetton wallet has been created to hold that specific jetton.

The sender address of the internal message containing the body of the `Transfer Notification` is the address of the new jetton wallet.
This should not be confused with the `sender` field in the [body](/v3/guidelines/dapps/asset-processing/jettons#message-2) of the `Transfer Notification`.

1. Get the jetton master address for the new jetton wallet by [retrieving the wallet data] (/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
2. Get the jetton wallet address for your wallet address (as the owner) using the jetton master contract: [How to get the jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Compare the address returned by the master contract and the actual wallet token address. If they match, that's perfect. If not, you've probably received a scam token that's counterfeit.
4. Retrieve jetton metadata: [How to retrieve jetton metadata](#retrieving-jetton-data).
5. Check the `symbol` and `name` fields for signs of fraud. Warn the user if necessary. [Adding new jettons for asset processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification).


### Accepting jettons from users through a centralized wallet

:::info
To prevent transaction bottlenecks in a single wallet, distribute deposits across multiple wallets and expand as needed.
:::

:::warning Transaction notification:
Each service in the ecosystem is expected to set `forward_ton_amount` to 0.000000001 TON (1 nanoton) when withdrawing a token, in order to send a token notification upon [a successful transfer](https://testnet.tonviewer.com/transaction/a0eede398d554318326b6e13081c2441f8b9a814bf9704e2e2f44f24adb3d407), otherwise the transfer will not be compliant and will not be processed by other CEXs and services.
:::

In this scenario, the payment service creates a unique memo identifier for each sender, revealing the
centralized wallet address and the amounts being sent. The sender sends tokens
to the specified centralized address with a mandatory comment in the comment.

**Pros of this method:** This method is very simple as there are no additional fees when accepting tokens and they are extracted directly to a hot wallet.

**Cons of this method:** This method requires all users to attach a comment to the transfer, which can lead to more deposit errors (forgotten memos, incorrect memos, etc.), and therefore a greater burden on the support staff.

Tonweb examples:

1. [Accepting jetton deposits to an individual HOT wallet with comments (memo)](https://github.com/toncenter/examples/blob/main/deposits-jettons.js)
2. [Jettons withdrawals example](https://github.com/toncenter/examples/blob/main/withdrawals-jettons.js)

#### Preparations

1. [Prepare a list of accepted jettons](/v3/guidelines/dapps/asset-processing/jettons#adding-new-jettons-for-asset-processing-and-initial-verification) (jetton master addresses).
2. Deploy hot wallet (using v3R2 if no jetton withdrawals are expected; highload v3 - if jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).
3. Perform a test jetton transfer using the hot wallet address to initialize the wallet.

#### Processing incoming jettons
1. Download the list of accepted jettons.
2. [Retrieve the jetton wallet address](#retrieving-jetton-wallet-addresses-for-a-given-user) for your deployed hot wallet.
3. Retrieve the jetton master address for each jetton wallet using [retrieving wallet data](/v3/guidelines/dapps/asset-processing/jettons#retrieving-data-for-a-specific-jetton-wallet).
4. Compare the jetton master contract addresses from step 1. and step 3 (immediately above). If the addresses do not match, you should report an address validation error to jetton.
5. Retrieve the list of recent unprocessed transactions using the hot wallet account and repeat (sorting each transaction one at a time). See: [Check contract transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions).
6. Check the input message (in_msg) for transactions and extract the source address from the input message. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L84)
7. If the source address matches the address in the jetton wallet, then the transaction should be processed further. If not, then skip the transaction processing and check the next transaction.
8. Make sure the message body is not empty and that the first 32 bits of the message match the `transfer notification` opcode `0x7362d09c`. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L91) If the message body is empty or the opcode is invalid, skip the transaction.
9. Read other message body data, including `query_id`, `amount`, `sender`, `forward_payload`. [jetton contract message layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts), [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L105)
10. Try extracting text comments from the `forward_payload` data. The first 32 bits should correspond to the text comment opcode `0x00000000`, and the rest to the UTF-8 encoded text. [Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-jettons-single-wallet.js#L110)
11. If the `forward_payload` data is empty or the operation code is invalid - skip the transaction.
12. Compare the received comment with the saved notes. If there is a match (user identification is always possible) - make the transfer.
13. Restart from step 5 and repeat the process until you have gone through the entire list of transactions.

### Accepting jettons from user deposit addresses

To accept jettons from user deposit addresses, the payment service must create an individual address (deposit) for each participant. The service includes multiple parallel processes, such as creating new deposits, scanning blocks for transactions, and withdrawing funds from deposits to a hot wallet.

Since a hot wallet can use one jetton wallet for each jetton type, multiple wallets must be created to initiate deposits. To create many wallets while managing them with one seed phrase (or private key), specify a different subwallet_id when creating a wallet. On TON, version v3 wallets and higher support subwallet creation.


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

1. [Prepare a list of accepted jettons](#adding-new-jettons-for-asset-processing-and-initial-verification).
2. Deploy a hot wallet (using v3R2 if no jetton withdrawals are expected; highload v3 - if jetton withdrawals are expected). [Wallet deployment](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment).

#### Creating deposits

1. Accept a request to create a new deposit for the user.
2. Generate a new subwallet address (/v3R2) based on the hot wallet seed. [Creating a subwallet in Tonweb](#creating-a-subwallet-in-tonweb)
3. The receiving address can be provided to the user as the address used for jetton deposits (this is the address
of the owner of the jetton deposit wallet). No wallet initialization is required, this can
be done when withdrawing jettons from the deposit.
4. For this address, the jetton wallet address must be calculated through the jetton main contract.
[How to get the jetton wallet address for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user).
5. Add the jetton wallet address to the address pool for transaction monitoring and save the subwallet address.

#### Processing transactions

:::info Transaction confirmation
TON transactions are irreversible after one confirmation. To enhance user experience, avoid waiting for additional blocks once transactions are finalized on TON Blockchain. Read more in [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

It is not always possible to determine the exact amount of jettons received from a message, as jetton wallets cannot send `transfer notification`, `excesses` and `internal transfer` messages. They are not standardized. This means that there is no guarantee that an `internal transfer` message can be decoded.

Therefore, to determine the amount received in a wallet, it is necessary to query balances using the get method. To obtain key data when querying balances, blocks are used according to the account state for a specific block in the chain.

[Preparing to accept a block with Tonweb](https://github.com/toncenter/tonweb/blob/master/src/test-block-subscribe.js).

The process is:

1. Prepare to accept a block (by preparing the system to accept new blocks).
2. Extract a new block and store the ID of the previous block.
3. Get transactions from blocks.
4. Filter transactions to only use addresses from the jetton wallet pool for deposit.
5. Decode messages using the `transfer notification` body to get more details, including the
`sender` address, jetton `amount`, and comment. (See: [Processing incoming jettons](#processing-incoming-jettons))
6. If there is at least one transaction with undecodeable output messages (the message body does not contain opcodes for
`transfer notification` and opcodes for `excesses`) or no output messages in
an account, the jetton balance must be queried using the get method for the current block, while the previous
block is used to calculate the balance difference. Now the overall change in the deposit balance is revealed due to the transactions in the block.
7. The transaction data can be used as an identifier for an unidentified jettons transfer (without a `transfer notification`) if there is one such transaction or the block data (if there are multiple in the block).
8. Now you need to check to make sure the deposit balance is correct. If the deposit balance is enough to initiate a transfer between the hot wallet and an existing jetton wallet, you need to withdraw the jettons to make sure the wallet balance has decreased.
9. Restart from step 2 and repeat the entire process.

#### Withdrawals made from deposits

Transfers should not be made from a deposit to a hot wallet with each deposit replenishment due to TON gas fees. Set a minimum jetton threshold before transferring.

By default, jetton deposit wallets are uninitialized since storage fees are not required. Deposit wallets can be deployed when sending transfer messages and immediately destroyed. Engineers must use a special mechanism for message sending [128 + 32](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).


1. Get the list of deposits marked for withdrawal to the hot wallet
2. Get the stored owner addresses for each deposit
3. Messages are then sent to each owner address (by bundling several such messages into a batch) from the high-load
wallet with an attached TON jetton amount. This is determined by adding the fees used to initialize the v3R2 wallet + the fees for sending a message with the `transfer` body + an arbitrary TON amount associated with `forward_ton_amount`
(if necessary). The attached TON amount is determined by adding the fees for initializing the v3R2 wallet (value) +
the fees for sending a message with the `transfer` body (value) + an arbitrary TON amount
for `forward_ton_amount` (value) (if necessary).
4. When the balance on the address becomes non-zero, the account status is changed. Wait a few seconds and check the status of the
account, it will soon change from `nonexists` to `uninit`.
5. For each owner address (with `uninit` status), an external message with v3R2 wallet
init and a body with the message `transfer` must be sent to deposit to the jetton wallet = 128 + 32. For `transfer`, the user must specify the hot wallet address as `destination` and `response destination`.
A text comment can be added to make it easier to identify the transfer.
6. Jetton delivery can be verified using the deposit address to the hot wallet address,
taking into account [processing incoming jettons information found here](#processing-incoming-jettons).

### Jetton withdrawals

:::info Important
**It is recommended that you** read and **understand** the [how jetton transfer works](/v3/guidelines/dapps/asset-processing/jettons#overview) and [how to send jettons with a comment](/v3/guidelines/dapps/asset-processing/jettons#jetton-off-chain-processing) articles before reading this section.

Below, you will find a step-by-step guide on how to process jetton withdrawals.
:::

To withdraw jettons, the wallet sends messages with a `transfer` body to the corresponding jetton wallet.
The jetton wallet then sends the jettons to the recipient. It is important to attach some TON (at least 1 nanoTON)
as the `forward_ton_amount` (and an optional comment to the `forward_payload`) to trigger a `transfer notification`.
See: [Jetton Contract Message Layouts](/v3/guidelines/dapps/asset-processing/jettons#message-layouts)

#### Preparation

1. Prepare a list of jettons to withdraw: [Adding new jettons for asset processing and initial verification](#adding-new-jettons-for-asset-processing-and-initial-verification)
2. Initiate hot wallet deployment. Highload v3 is recommended. [Deploy wallet](/v3/guidelines/dapps/asset-processing/payments-processing#wallet-deployment)
3. Perform a jetton transfer using the hot wallet address to initialize the jetton wallet and fund its balance.

#### Processing withdrawals

1. Download the list of processed jettons
2. Get the jetton wallet addresses for the deployed hot wallet: [How to get jetton wallet addresses for a given user](#retrieving-jetton-wallet-addresses-for-a-given-user)
3. Get the primary jetton addresses for each jetton wallet: [How to get data for jetton wallets](#retrieving-data-for-a-specific-jetton-wallet).

  The `jetton` parameter is required (which is actually the address of the primary jetton contract).

4. Compare the addresses from the primary jetton contracts from step 1 and step 3. If the addresses do not match, then a jetton address validation error should be reported.

5. Receive withdrawal requests that actually specify the jetton type, amount to be transferred, and the recipient wallet address.

6. Check the jetton wallet balance to ensure there are enough funds for the withdrawal.
7. Create a [message](/v3/guidelines/dapps/asset-processing/jettons#message-0).
8. When using a wallet with high load, it is recommended to collect a batch of messages and send one batch at a time to optimize fees.
9. Keep an expiration time for outgoing external messages (this is the time until the wallet successfully
processes the message, after which the wallet will no longer accept the message)
10. Send a single message or multiple messages (message batch).
11. Get a list of the latest unprocessed transactions in the hot wallet account and retry it.
Learn more here: [Check contract transactions](/v3/guidelines/dapps/asset-processing/payments-processing#check-contracts-transactions),
[Tonweb example](https://github.com/toncenter/examples/blob/9f20f7104411771793dfbbdf07f0ca4860f12de2/deposits-single-wallet.js#L43) or
use the TON Center API method `/getTransactions`.
12. View the outgoing messages in the account.
13. If there is a message with the `transfer` operation code, it should be decoded to obtain the `query_id` value.
The received `query_id` should be marked as successfully sent.
14. If the time required to process the current transaction being scanned is greater than the expiration time and no outgoing message with the given `query_id`
is found, the query should optionally be marked as expired and safely resent.
15. Find the incoming messages in the account.
16. If there is a message that uses the `Excess 0xd53276db` opcode, the message should be decoded and the `query_id` value extracted. The `query_id` found should be marked as successfully delivered.
17. Proceed to step 5. Expired queries that were not successfully sent should be returned to the output list.

## Jetton on-chain processing

Generally, to accept and process jettons, a message handler responsible for internal messages uses the `op=0x7362d09c` op code.

:::info Transaction Confirmation
TON transactions are irreversible after one confirmation. For the best user experience, it is recommended to avoid waiting for additional blocks after completing transactions on the TON blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

### On-chain processing recommendations
Below is a `list of best practices` to keep in mind when **doing on-chain jetton processing**:

1. **Identify incoming jettons** using their wallet type, not their master jetton contract. In other words, your contract should communicate (receive and send messages) with a specific jetton wallet (not some unknown wallet using a specific master jetton contract).

2. When linking a jetton wallet and a master jetton, **check** that the **connection is bidirectional**, with the wallet recognizing the master contract and vice versa. For example, if your contract system receives a notification from a jetton wallet (which considers its MySuperJetton to be its master contract), its transfer information should be displayed to the user before showing the `symbol`, `name`, and `image` of the MySuperJetton contract, check that the MySuperJetton wallet is using the correct contract system. In turn, if your contract system for some reason needs to send tokens using the MySuperJetton or MySuperJetton master contracts, check that the X wallet, like the wallet, uses the same contract parameters.
Also, before sending a `transfer` request to X, make sure it recognizes MySuperJetton as its master.
3. The **true power** of decentralized finance (DeFi) comes from the ability to stack protocols on top of each other like Lego blocks. For example, say Token A is swapped for Token B, which in turn is then used as leverage in a lending protocol (where the user provides liquidity), which is then used to buy an NFT and so on. So think about how a contract can serve not only off-chain users, but also on-chain entities by attaching a tokenized value to a transfer notification, adding a custom payload that can be sent with the transfer notification. 
4. **Remember** that not all contracts follow the same standards. Unfortunately, some tokens can be hostile (using attack vectors) and are designed solely to attack unsuspecting users. For security purposes, if the protocol in question is composed of many contracts, do not create a large number of token wallets of the same type. In particular, do not send tokens within the protocol between a deposit contract, a storage contract, or a user account contract, etc. Attackers can intentionally interfere with contract logic by spoofing transfer notifications, token amounts, or payload parameters. Reduce the potential attack surface by using only one wallet in the system per token (for all deposits and withdrawals).
5. It is also **often a good idea** to create subcontracts for each individual token to reduce the likelihood of address spoofing (e.g. where a transfer message is sent to token B using a contract intended for token A).
6. **It is strongly recommended** to work with indivisible units of tokens at the contract level. Logic related to decimal numbers is usually used to improve the display user interface and is not related to the numerical record keeping on the chain.

Learn **more** about [Secure Smart Contract Programming in FunC by CertiK](https://blog.ton.org/secure-smart-contract-programming-in-func). It is recommended to **handle all smart contract exceptions,** so they are never skipped during application development.

## Jetton Wallet Processing Guidelines
In general, all verification procedures used to process jetton offline are also applicable to wallets. For jetton wallet processing, our most important recommendations are as follows:

1. When a wallet receives a transfer notification from an unknown jetton wallet, it is **vital** to trust the jetton wallet and its master address, as it may be a malicious fake. To protect yourself, verify the jetton master (master contract) using the address it provides to ensure that your verification processes recognize the jetton wallet as legitimate. Once you trust the wallet and it has been verified as legitimate, you can allow it to access your account balances and other data in the wallet. If the jetton Master does not recognize this wallet, it is recommended not to initiate or disclose your jetton transfers at all and only show incoming TON transfers (Toncoin attached to transfer notifications).

2. In practice, if a user wants to interact with jetton and not the jetton wallet. In other words, users send wTON/oUSDT/jUSDT, jUSDC, jDAI instead of `EQAjN...`/`EQBLE...`
etc. Often this means that when a user initiates a jetton transfer, the wallet will ask the corresponding jetton master which jetton wallet (owned by the user) should initiate the transfer request. **It is important to never blindly trust** this data from the Master (master contract). Always verify that the jetton wallet actually belongs to the jetton Master it claims to belong to before sending a transfer request to a jetton wallet.
3. **Please be aware** that hostile jetton masters/jetton wallets **may change** their wallets/Masters over time. Therefore, it is imperative that users perform due diligence and verify the legitimacy of any wallets they interact with before each use.
4. **Always make sure** that you display tokens in your interface in a way that **does not mix with TON transfers**, system notifications, etc. Even the `symbol`, `name`, and `image` parameters
can be crafted to mislead users, making victims potential victims of fraud. There have been several cases of malicious tokens being used to simulate TON transfers, notification errors, rewards, or asset freeze announcements.
5. **Always be on guard against potential attackers** creating fake tokens, it is always a good idea to provide users with the functionality needed to eliminate unwanted tokens from their main user interface.


Authors are _[kosrk](https://github.com/kosrk)_, _[krigga](https://github.com/krigga)_, _[EmelyanenkoK](https://github.com/EmelyanenkoK/)_ and _[tolya-yanot](https://github.com/tolya-yanot/)_.


## Best practices

For ready-to-test examples, check [SDKs](/v3/guidelines/dapps/asset-processing/jettons#sdks)  and run them. The following code snippets help understand jetton processing with  practical examples.


### Send jettons with comment
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
  toAddress: jetton_WALLET_ADDRESS, // address of jetton wallet of jetton sender
  amount: TonWeb.utils.toNano('0.05'), // total amount of TONs attached to the transfer message
  seqno: seqno,
  payload: await jettonWallet.createTransferBody({
    jettonAmount: TonWeb.utils.toNano('500'), // jetton amount (in basic indivisible units)
    toAddress: new TonWeb.utils.Address(WALLET2_ADDRESS), // recepient user's wallet address (not jetton wallet)
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
    jetton_MASTER_ADDRESS = "EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE"
    DESTINATION_ADDRESS = "EQAsl59qOy9C2XL5452lGbHU9bI3l4lhRaopeNZ82NRK8nlA"

    USER_jetton_WALLET = (await provider.run_get_method(address=jetton_MASTER_ADDRESS,
                                                        method="get_wallet_address",
                                                        stack=[begin_cell().store_address(USER_ADDRESS).end_cell().begin_parse()]))[0].load_address()
    forward_payload = (begin_cell()
                      .store_uint(0, 32) # TextComment op-code
                      .store_snake_string("Comment")
                      .end_cell())
    transfer_cell = (begin_cell()
                    .store_uint(0xf8a7ea5, 32)          # jetton Transfer op-code
                    .store_uint(0, 64)                  # query_id
                    .store_coins(1 * 10**9)             # jetton amount to transfer in nanojetton
                    .store_address(DESTINATION_ADDRESS) # Destination address
                    .store_address(USER_ADDRESS)        # Response address
                    .store_bit(0)                       # Custom payload is None
                    .store_coins(1)                     # Ton forward amount in nanoton
                    .store_bit(1)                       # Store forward_payload as a reference
                    .store_ref(forward_payload)         # Forward payload
                    .end_cell())

    await wallet.transfer(destination=USER_jetton_WALLET, amount=int(0.05*1e9), body=transfer_cell)
    await provider.close_all()

asyncio.run(main())
```

</details>

</TabItem>
</Tabs>


### Accept jetton transfer with comment parse

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
    jettonMaster,
    OpenedContract,
    jettonWallet,
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

export async function tryProcessjetton(orderId: string) : Promise<string> {

    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'TONCENTER-API-KEY', // https://t.me/tonapibot
    });

    interface jettonInfo {
        address: string;
        decimals: number;
    }

    interface jettons {
        JettonMinter : OpenedContract<jettonMaster>,
        jettonWalletAddress: Address,
        jettonWallet: OpenedContract<jettonWallet>
    }

    const MY_WALLET_ADDRESS = 'INSERT-YOUR-HOT-WALLET-ADDRESS'; // your HOT wallet

    const jettonS_INFO : Record<string, jettonInfo> = {
        'jUSDC': {
            address: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728', //
            decimals: 6
        },
        'jUSDT': {
            address: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
            decimals: 6
        },
    }
    const jettons: Record<string, jettons> = {};

    const prepare = async () => {
        for (const name in jettonS_INFO) {
            const info = jettonS_INFO[name];
            const jettonMaster = client.open(jettonMaster.create(Address.parse(info.address)));
            const userAddress = Address.parse(MY_WALLET_ADDRESS);

            const jettonUserAddress =  await jettonMaster.getWalletAddress(userAddress);
          
            console.log('My jetton wallet for ' + name + ' is ' + jettonUserAddress.toString());

            const jettonWallet = client.open(jettonWallet.create(jettonUserAddress));

            //const jettonData = await jettonWallet;
            const jettonData = await client.runMethod(jettonUserAddress, "get_wallet_data")

            jettonData.stack.pop(); //skip balance
            jettonData.stack.pop(); //skip owneer address
            const adminAddress = jettonData.stack.readAddress();


            if (adminAddress.toString() !== (Address.parse(info.address)).toString()) {
                throw new Error('jetton minter address from jetton wallet doesnt match config');
            }

            jettons[name] = {
                JettonMinter: jettonMaster,
                jettonWalletAddress: jettonUserAddress,
                jettonWallet: jettonWallet
            };
        }
    }

    const jettonWalletAddressTojettonName = (jettonWalletAddress : Address) => {
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
            const jettonName = jettonWalletAddressTojettonName(sourceAddress);
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

type jettonInfo struct {
	address  string
	decimals int
}

type jettons struct {
	JettonMinter        *jetton.Client
	jettonWalletAddress string
	jettonWallet        *jetton.WalletClient
}

func prepare(api ton.APIClientWrapped, jettonsInfo map[string]jettonInfo) (map[string]jettons, error) {
	userAddress := address.MustParseAddr(MyWalletAddress)
	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		return nil, err
	}

	jettons := make(map[string]jettons)

	for name, info := range jettonsInfo {
		jettonMaster := jetton.NewjettonMasterClient(api, address.MustParseAddr(info.address))
		jettonWallet, err := jettonMaster.GetjettonWallet(context.Background(), userAddress)
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

		jettons[name] = jettons{
			JettonMinter:        jettonMaster,
			jettonWalletAddress: jettonUserAddress.String(),
			jettonWallet:        jettonWallet,
		}
	}

	return jettons, nil
}

func jettonWalletAddressTojettonName(jettons map[string]jettons, jettonWalletAddress string) string {
	for name, info := range jettons {
		if info.jettonWallet.Address().String() == jettonWalletAddress {
			return name
		}
	}
	return ""
}

func GetTransferTransactions(orderId string, foundTransfer chan<- *tlb.Transaction) {
	jettonsInfo := map[string]jettonInfo{
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
		jettonName := jettonWalletAddressTojettonName(jettons, sourceAddress.String())
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
            print("FAKE jetton Transfer")
            continue

        if len(forward_payload.bits) < 32:
            print(
                f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton"
            )
        else:
            forward_payload_op_code = forward_payload.load_uint(32)
            if forward_payload_op_code == 0:
                print(
                    f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton and comment: {forward_payload.load_snake_string()}"
                )
            else:
                print(
                    f"jetton transfer from {jetton_sender} with value {jetton_amount} jetton and unknown payload: {forward_payload} "
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
You can find a list of SDKs for different languages ​​(JS, Python, Golang, C#, Rust, etc.) list [here](/v3/guidelines/dapps/apis-sdks/sdk).

## See also

* [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
* [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts)
* [Metadata parsing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/metadata-parsing)

<Feedback />

