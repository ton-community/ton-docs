import Button from '@site/src/components/button'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Payments processing

This page contains an overview on TON transactions and specific details that explain how to work with ton wallets and process (send and accept) digital assets on the TON blockchain.

## Global overview
Embodying a fully asynchronous approach, TON Blockchain involves a few concepts which are uncommon to traditional blockchains. Particularly, each interaction of any actor with the blockchain consists of a graph of asynchronously transferred [messages](/develop/smart-contracts/guidelines/message-delivery-guarantees) between smart contracts and/or the external world. Each transaction consists of one incoming message and up to 512 outgoing messages.

There are 3 types of messages, that are fully described [here](/develop/smart-contracts/messages#types-of-messages). To put it briefly:
* [external message](/develop/smart-contracts/guidelines/external-messages):
  *  `external in message` (sometimes called just `external message`) is message that is sent from *outside* of the blockchain to a smart contract *inside* the blockchain.
  *  `external out message` (usually called `logs message`) is sent from a *blockchain entity* to the *outer world*.
* [internal message](/develop/smart-contracts/guidelines/internal-messages) is sent from one *blockchain entity* to *another*, can carry some amount of digital assets and arbitrary portion of data.

The common path of any interaction starts with an external message sent to a `wallet` smart contract, which authenticates the message sender using public-key cryptography, takes charge of fee payment, and sends internal blockchain messages. That messages queue form directional acyclic graph, or a tree.

For example:

![](/img/docs/asset-processing/alicemsgDAG.svg)

* `external message` is the input message for `wallet A v4` contract with empty soure (a message from nowhere, such as [Tonkeeper](https://tonkeeper.com/)).
* `outgoing message` is the output message for `wallet A v4` contract and input message for `wallet B v4` contract with `wallet A v4` source and `wallet B v4` destination.

As a result there are 2 transactions with their set of input and output messages.

Each action, when contract take message as input (triggered by it), process it and generate or not generate outgoing messages as output, called `transaction`. Read more about transactions [here](/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-transaction).

That `transactions` can span a **prolonged period** of time. Technically, transactions with queues of messages are aggregated into blocks processed by validators. The asynchronous nature of the TON Blockchain **does not allow to predict the hash and lt (logical time) of a transaction** at the stage of sending a message.

The `transaction` accepted to the block is final and cannot be modified.

:::info Transaction Confirmation
TON transactions are irreversible after just one confirmation. For the best user experience, it is suggested to avoid waiting on additional blocks once transactions are finalized on the TON Blockchain. Read more in the [Catchain.pdf](https://docs.ton.org/catchain.pdf#page=3).
:::

Smart contracts pay several types of [fees](/develop/smart-contracts/fees) for transactions (usually from the balance of an incoming message, behavior depends on [message mode](/develop/smart-contracts/messages#message-modes)). Amount of fees depends on workchain configs with maximal fees on `masterchain` and substantially lower fees on `basechain`.

## Digital asset types on TON

TON has three types of digital assets.
- Toncoin, the main token of the network. It is used for all basic operations on the blockchain, for example, paying gas fees or staking for validation.
- Contract assets, such as tokens and NFTs, which are analogous to the ERC-20/ERC-721 standards and are managed by arbitrary contracts and thus can require custom rules for processing. You can find more info on it's processing in [process NFTs](/develop/dapps/asset-processing/nfts) and [process Jettons](/develop/dapps/asset-processing/jettons) articles.
- Native token, which is special kind of assets that can be attached to any message on the network. But these asset is currently not in use since the functionality for issuing new native tokens is closed.

## Interaction with TON blockchain
Basic operations on TON Blockchain can be carried out via TonLib. It is a shared library which can be compiled along with a TON node and expose APIs for interaction with the blockchain via so-called lite servers (servers for lite clients). TonLib follows a trustless approach by checking proofs for all incoming data; thus, there is no necessity for a trusted data provider. Methods available to TonLib are listed [in the TL scheme](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234). They can be used either as a shared library via [wrappers](/develop/dapps/asset-processing/#repositories).

## Wallet smart contract

Wallet smart contracts are contracts on the TON Network which serve the task of allowing actors outside the blockchain to interact with blockchain entities. Generally, it solves three challenges:
* authenticates owner: Rejects to process and pay fees for non-owners' requests.
* replays protection: Prohibits the repetitive execution of one request, for instance sending assets to some other smart contract.
* initiates arbitrary interaction with other smart contracts.

Standard solution for the first challenge is public-key cryptography: `wallet` stores the public key and checks that an incoming message with a request is signed by the corresponding private key which is known only by the owner. 

The solution to the third challenge is common as well; generally, a request contains a fully formed inner message `wallet` sends to the network. However, for replay protection, there are a few different approaches.

### Seqno-based wallets
Seqno-based wallets follow the most simple approach to sequencing messages. Each message has a special `seqno` integer that must coincide with the counter stored in the `wallet` smart contract. `wallet` updates its counter on each request, thus ensuring that one request will not be processed twice. There are a few `wallet` versions that differ in publicly available methods: the ability to limit requests by expiration time, and the ability to have multiple wallets with the same public key. However, an inherent requirement of that approach is to send requests one by one, since any gap in `seqno` sequence will result in the inability to process all subsequent requests.

### High-load wallets
This `wallet` type follows an approach based on storing the identifier of the non-expired processed requests in smart-contract storage. In this approach, any request is checked for being a duplicate of an already processed request and, if a replay is detected, dropped. Due to expiration, the contract may not store all requests forever, but it will remove those that cannot be processed due to the expiration limit. Requests to this `wallet` may be sent in parallel without interfering with each other; however, this approach requires more sophisticated monitoring of request processing.

### Wallet deployment
To deploy a wallet via TonLib one needs to:
1. Generate a private/public key pair via [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L213) or its wrapper functions (example in [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Note that the private key is generated locally and does not leave the host machine.
2. Form [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L60) structure corresponding to one of the enabled `wallets`. Currently `wallet.v3`, `wallet.v4`, `wallet.highload.v1`, `wallet.highload.v2` are available.
3. Calculate the address of a new `wallet` smart contract via the [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L249) method. We recommend using a default revision `0` and also deploying wallets in the basechain `workchain=0` for lower processing and storage fees.
4. Send some Toncoin to the calculated address. Note that you need to send them in `non-bounce` mode since this address has no code yet and thus cannot process incoming messages. `non-bounce` flag indicates that even if processing fails, money should not be returned with a bounce message. We do not recommend using the `non-bounce` flag for other transactions, especially when carrying large sums, since the bounce mechanism provides some degree of protection against mistakes.
5. Form the desired [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L148), for instance `actionNoop` for deploy only. Then use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260) to initiate interactions with the blockchain.
6. Check the contract in a few seconds with [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L254) method.

:::tip
Read more in the [Wallet Tutorial](/develop/smart-contracts/tutorials/wallet#-deploying-a-wallet)
:::

## Work with transfers

### Check contract's transactions
A contract's transactions can be obtained using [getTransactions](https://toncenter.com/api/v2/). This method allows to get 10 transactions from some `transactionId` and earlier. To process all incoming transactions, the following steps should be followed:
1. The latest `last_transaction_id` can be obtained using [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L235)
2. List of 10 transactions should be loaded via the `getTransactions` method.
3. Unseen transactions from this list should be processed.
4. Incoming payments are transactions in which the incoming message has a source address; outgoing payments are transactions in which the incoming message has no source address and also presents the outgoing messages. These transactions should be processed accordingly.
5. If all of those 10 transactions are unseen, the next 10 transactions should be loaded and steps 2,3,4,5 should be repeated.

### Checking transaction's flow
It's possible to track messages flow during transaction processing. Since the message flow is a DAG it's enough to get the input `in_msg` or output `out_msgs` messages of current transaction using [getTransactions](https://toncenter.com/api/v2/#/transactions/get_transactions_getTransactions_get) method to find incoming transaction with [tryLocateResultTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_result_tx_tryLocateResultTx_get) or outgoing transactions with [tryLocateSourceTx](https://testnet.toncenter.com/api/v2/#/transactions/get_try_locate_source_tx_tryLocateSourceTx_get).

### Send payments

1. Service should deploy a `wallet` and keep it funded to prevent contract destruction due to storage fees. Note that storage fees are generally less than 1 Toncoin per year.
2. Service should get from the user `destination_address` and optional `comment`. Note that for the meantime, we recommend either prohibiting unfinished outgoing payments with the same (`destination_address`, `value`, `comment`) set or proper scheduling of those payments; that way, the next payment is initiated only after the previous one is confirmed.
3. Form [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L98) with `comment` as text.
4. Form [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L108) which contains `destination_address`, empty `public_key`, `amount` and `msg.dataText`.
5. Form [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L149) which contains a set of outgoing messages.
6. Use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260) queries to send outgoing payments.
7. Service should regularly poll the getTransactions method for the `wallet` contract. Matching confirmed transactions with the outgoing payments by (`destination_address`, `value`, `comment`) allows to mark payments as finished; detect and show the user the corresponding transaction hash and lt (logical time).
8. Requests to `v3` of `high-load` wallets have an expiration time equal to 60 seconds by default. After that time unprocessed requests can be safely resent to the network (see steps 3-6).

## Invoice-based payment accept
To accept payments based on attached comments, the service should
1. Deploy the `wallet` contract.
2. Generate a unique `invoice` for each user. String representation of uuid32 will be enough.
3. Users should be instructed to send Toncoin to the service's `wallet` contract with an attached `invoice` as a comment.
4. Service should regularly poll the getTransactions method for the `wallet` contract.
5. For new transactions, the incoming message should be extracted, `comment` matched against the database, and the **incoming message value** deposited to the user's account.

To calculate the **incoming message value** that the message brings to the contract, one needs to parse the transaction. It happens when the message hits the contract. A transaction can be obtained using [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L236). For an incoming wallet transaction, the correct data consists of one incoming message and zero outgoing messages. Otherwise, either an external message is sent to the wallet, in which case the owner spends Toncoin, or the wallet is not deployed and the incoming transaction bounces back.

Anyway, in general, the amount that a message brings to the contract can be calculated as the value of the incoming message minus the sum of the values of the outgoing messages minus the fee: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Technically, transaction representation contains three different fields with `fee` in name: `fee`, `storage_fee`, and `other_fee`, that is, a total fee, a part of the fee related to storage costs, and a part of the fee related to transaction processing. Only the first one should be used.

### Invoices with TON Connect

Best suited for dApps that need to sign multiple payments/transactions within a session or need to maintain a connection to the wallet for some time.

- ✅ There's a permanent communication channel with the wallet, information about the user's address
- ✅ Users only need to scan a QR code once
- ✅ It's possible to find out whether the user confirmed the transaction in the wallet, track the transaction by the returned BOC
- ✅ Ready-made SDKs and UI kits are available for different platforms

- ❌ If you only need to send one payment, the user needs to take two actions: connect the wallet and confirm the transaction
- ❌ Integration is more complex than the ton:// link


<Button href="/develop/dapps/ton-connect/"
colorType="primary" sizeType={'lg'}>
Learn More
</Button>

### Invoices with ton:// link

:::warning
Ton link is deprecated, avoid using it
:::

If you need an easy integration for a simple user flow, it is suitable to use the ton:// link.
Best suited for one-time payments and invoices.

```bash
ton://transfer/<destination-address>?
    [nft=<nft-address>&]
    [fee-amount=<nanocoins>&]
    [forward-amount=<nanocoins>] 
```

- ✅ Easy integration
- ✅ No need to connect a wallet

- ❌ Users need to scan a new QR code for each payment
- ❌ It's not possible to track whether the user has signed the transaction or not
- ❌ No information about the user's address
- ❌ Workarounds are needed on platforms where such links are not clickable (e.g. messages from bots for Telegram desktop clients )


[Learn more about ton links here](https://github.com/tonkeeper/wallet-api#payment-urls)

## Explorers

The blockchain explorer is https://tonscan.org.

To generate a transaction link in the explorer, the service needs to get the lt (logic time), transaction hash, and account address (account address for which lt and txhash were retrieved via the getTransactions method). https://tonscan.org and https://explorer.toncoin.org/ may then show the page for that tx in the following format:

`https://tonviewer.com/transaction/{txhash as base64url}`

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`

## Best Practices

### Wallet creation

<Tabs groupId="example-create_wallet">
<TabItem value="js" label="js">

- **toncenter:** 
  - [Wallet creation + get wallet address](https://github.com/toncenter/examples/blob/main/common.js)

- **ton-community/ton:**
  - [Wallet creation + get balance](https://github.com/ton-community/ton#usage)

</TabItem>
<TabItem value="python" label="python">

- **psylopunk/pythonlib:** 
  - [Wallet creation + get wallet address](https://github.com/psylopunk/pytonlib/blob/main/examples/generate_wallet.py)

</TabItem>
<TabItem value="go" label="go">

- **xssnick/tonutils-go:** 
  - [Wallet creation + get balance](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>
</Tabs>

### Toncoin Deposits (Get toncoins)

<Tabs groupId="example-toncoin_deposit">
<TabItem value="js" label="js">

- **toncenter:** 
  - [Process Toncoins deposit](https://github.com/toncenter/examples/blob/main/deposits.js) 
  - [Process Toncoins deposit multi wallets](https://github.com/toncenter/examples/blob/main/deposits-multi-wallets.js)

</TabItem>
</Tabs>

### Toncoin Withdrawals (Send toncoins)

<Tabs groupId="example-toncoin_withdrawals">
<TabItem value="js" label="js">

- **toncenter:**
  - [Withdraw Toncoins from a wallet in batches](https://github.com/toncenter/examples/blob/main/withdrawals-highload-batch.js)
  - [Withdraw Toncoins from a wallet](https://github.com/toncenter/examples/blob/main/withdrawals-highload.js)

- **ton-community/ton:**
  - [Withdraw Toncoins from a wallet](https://github.com/ton-community/ton#usage)

</TabItem>
<TabItem value="python" label="python">

- **psylopunk/pythonlib:**
  - [Withdraw Toncoins from a wallet](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)

</TabItem>
<TabItem value="go" label="go">

- **xssnick/tonutils-go:**
  - [Withdraw Toncoins from a wallet](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#wallet)

</TabItem>
</Tabs>

### Get contract's transactions

<Tabs groupId="example-get_transactions">
<TabItem value="js" label="js">

- **ton-community/ton:**
  - [Client with getTransaction method](https://github.com/ton-community/ton/blob/master/src/client/TonClient.ts)

</TabItem>
<TabItem value="python" label="python">

- **psylopunk/pythonlib:**
  - [Get transactions](https://github.com/psylopunk/pytonlib/blob/main/examples/transactions.py)

</TabItem>
<TabItem value="go" label="go">

- **xssnick/tonutils-go:**
  - [Get transactions](https://github.com/xssnick/tonutils-go?tab=readme-ov-file#account-info-and-transactions)

</TabItem>
</Tabs>

## SDKs

You can find a list of SDKs for various languages (js, python, golang, C#, Rust, etc.) list [here](/develop/dapps/apis/sdk).
