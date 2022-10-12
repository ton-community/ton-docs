# Asset processing on TON
This document contains overview and specific details which explain how to process (send and accept) digital assets on TON network.


## Global overview
Embodying fully asynchronous approach TON blockchain involves a few concepts which are uncommon to traditional blockchains. In particular each interaction of any actor with blockchain consist of graph of asynchronously transferred messages between smart-contracts and/or external world. Common path of any interaction start from external message sent to `wallet` smart-contract which authenticate message sender using public-key cryptography, take duty of fee payment and sending inner blockchain messages. That way transactions on TON network is not synonym of interaction of user with blockchain, but merely node of the message graph: result of accepting and processing of message by smart-contract which may or may not lead to arising of new messages. Interaction may consist of arbitrary number of messages and transactions and span across prolonged period of time. Technically transactions with queues of messages are aggregated to blocks processed by validators. Asynchronous nature of **TON blockchain does not allow to predict hash and lt (logical time) of transaction** on the stage of sending message. Transactions accepted to block are final and will not be tampered.

**Each inner blockchain message, that is message from one smart-contract to another, bear some amount of digital assets as well as arbitrary portion of data.**

Smart-contract guidelines recommend to treat data payload starting with 32 binary zeroes as human-readable text message. Most software like wallets and libraries support this specification and allows to send text comment along with TON coins as well as display comments in other messages.

Smart-contracts **pay fees for transactions** (usually from balance of incoming message) as well as **storage fee for contract's stored code and data**. Fees depend on workchain configs with maximal fees on `masterchain` and substantially lower fees on `basechain`.


## Digital assets on TON
TON has three types of digital assets. First is TON Coin, main token of the network. It is used for all basic operations on blockchain like paying gas fees or staking for validation. The second type is native tokens which are special kinds of assets which can be attached to any message in the network. This assets are currently not in use since functionality of issuing new native tokens is closed. Finally, the third type is contract assets: analogous to ERC20, assets which are managed by arbitrary contracts (there are a few proposed specifications) and thus can require custom rules for processing.

### Simple TON coin transfer
To send TON coins user need to send request via external message, that is message from outer world to the blockchain, to special `wallet` smart-contract (see below). Upon receiving this request `wallet` will send inner message with desired amount of assets and optional data payload, for instance text comment.

## Wallet smart-contract
Wallet smart-contracts are contracts on TON-network which serve task to allow actor outside blockchain to interact with blockchain entities. Generally it solves three challenges:
* authenticate owner: reject to process and pay fees for non-owners requests
* replay protection: prohibit repetitive execution of one request, for instance sending assets to some other smart-contract
* initiate arbitrary interaction with other smart-contracts

Standart solution for the first challenge is public-key cryptography: `wallet` stores public key and check that incoming message with request is signed by corresponding private key which known to owner only. Solution to the third challenge is common as well, generally request contains a fully formed inner message which `wallet` sends to network. However, for replay protection there is a few different approaches.

### Seqno-based wallets
Seqno-based wallets follow the most simple approach of sequencing message. Each message has special `seqno` integer which should coincide with counter stored in `wallet` smart-contract. `wallet` updates counter on each request thus ensuring that one request will not be processed twice. There are a few `wallet` versions that differs in publicly available methods, ability to limit request by expiration time and to have multiple wallets with the same public key. However inherent requirement of that approach is to send requests one by one, since any gap in `seqno` sequence will result in inability to process of all subsequent requests.

### High-load wallets
This `wallet` type follows approach based on storing identificator of the non-expired processed requests in smart-contract storage. In this approach any request is checked of being duplicate of already processed request and, if replay is detected, dropped. Due to presence of expiration contract may not store all request forever, but remove those that can not be processed due to expiration limit. Requests to this `wallet` may be sent in parallel without interference with each other, however this approach requires more sophisticated monitoring of request processing.

## Interaction with blockchain
Basic operations on TON blockchain can be carried out via tonlib. It is shared library which can be compiled along with TON node and expose API for interaction with blockchain via so called liteservers (servers for lite-clients). Tonlib follows trustless approach by checking proofs for all incoming data, thus there is no necessity in trusted data provider. Methods available to tonlib are listed [in TL scheme](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L234). They can be used either as shared library, via wrappers like [pyTON](https://github.com/EmelyanenkoK/pyTON) or [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2) (technically those are wrappers for `tonlibjson`) or through `tonlib-cli`.


## Deploying wallet
To deploy wallet via Tonlib one need:
1. Generate private/public key pair via [createNewKey](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L213) or it's wrapper functions (example in [tonlib-go](https://github.com/mercuryoio/tonlib-go/tree/master/v2#create-new-private-key)). Note that private key is generated locally and do not leave host machine.
2. Form [InitialAccountWallet](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L60) structure corresponding to one of enabled `wallets`. Currently `wallet.v3`, `wallet.highload.v1`, `wallet.highload.v2` are available.
3. Calculate address of new `wallet` smart-contract via [getAccountAddress](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L249) method. We recommend to use default revision `0` and also to deploy wallets in basechain `workchain=0` for lower processing and storage fees.
4. Send some TON Coins to calculated address. Note that you need to send them in `non-bounce` regime since this address has no code yet and thus cannot process incoming message. `non-bounce` flag indicate that even if processing will fail money should not be returned back with bounce message. We do not recommend to use `non-bounce` flag for other transactions, especially carrying large sums, since bounce mechanism provides some degree of protection against mistakes.
5. Form desired [action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L148), for instance `actionNoop` for deploy only. Than use [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255) and [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260) to initiate interaction with blockchain.
6. Check contract in a few seconds by [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L254) method.

## Incoming message value
To calculate incoming value which message bring to the contract, one need to parse transaction which happens when message hits contract. Transaction can be obtained by [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L236). For incoming wallet transaction, correct data consist of one incoming message and zero outcoming messages. Otherwise that either external message to wallet, that is owner spends TON Coins or wallet is not deployed and incoming transaction bounces back.
Anyway, in general case amount which message brings to the contract can be calculated as value of incoming message minus sum of value of outcoming messages minus fee: `value_{in_msg} - SUM(value_{out_msg}) - fee`. Technically, transaction representation contains three different fields with `fee` in name: `fee`, `storage_fee` and `other_fee`, that is total fee, part of the fee related to storage costs and part of the fee related to transaction processing. Only the first one should be used.

## Checking contract's transactions
Transaction for contract can be obtained by [getTransactions](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L236). This method allows to get 10 transactions from some `transactionId` and earlier. To process all incoming transactions the following steps should be done:
1. Latest `last_transaction_id` can be obtained via [getAccountState](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L235)
2. List of 10 transactions should be loaded via `getTransactions` method.
3. Unseen transactions from this list should be processed.
4. Transactions where incoming message has source address are incoming payments; transactions where incoming message has no source address and also outcoming messages presented are outcoming payments. Those transactions should be processed accordingly.
5. If all of those 10 transactions are unseen, next 10 transaction should be loaded and steps 2,3,4,5 should be repeated.


## Accepting payments
There are a few approaches to accept payments that differs in method of distinguishing users.
### Invoice based approach
To accept payments basing on attached comments, service should
1. Deploy `wallet` contract
2. Generate unique `invoice` for each user. String representation of uuid32 will be enough.
3. Users should be instructed to send TON coins to service's `wallet` contract with attached `invoice` as comment.
4. Service should regularly poll getTransactions method for `wallet` contract.
5. For new transactions incoming message should be extracted, `comment` matched against database and value (see **Incoming message value** paragraph) deposited to user account.

## Sending payments

1. Service should deploy `wallet` and keep it funded to prevent contract destruction due to storage fees. Note storage fees are generally less than 1 TON Coin per year.
2. Service should get from user `destination_address` and optional `comment`. Note, for now we recommend either prohibit unfinished outgoing payments with the same (`destination_address`, `value`, `comment`) set or proper scheduling of those payments in that way that next payment is initiated only after previous one is confirmed.
3. Form [msg.dataText](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L98) with `comment` as text.
4. Form [msg.message](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L108) which contains `destination_address`, empty `public_key`, `amount` and `msg.dataText`.
5. Form [Action](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L149) which contains set of outgoing messages.
6. Use create [createQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L255) and send [sendQuery](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl#L260) query to send outgoing payment.
7. Service should regularly poll getTransactions method for `wallet` contract. Matching confirmed transactions with outgoing payments by (`destination_address`, `value`, `comment`) allows to mark payment as finished; detect and show user corresponding transaction hash and lt (logical time).
8. Requests to `v3` of `high-load` wallets have expiration time equal to 60 seconds by default. After that time unprocessed requests can be safely resent to the network (see steps 3-6).

## Explorers

Blockchain explorer - https://tonscan.org

To generate link to transaction in explorer, service need to get lt (logic time), transaction hash and account address (account address for which lt and txhash was retrieved via getTransactions method). https://tonscan.org and https://explorer.toncoin.org/ may then show page for that tx in the following format:

`https://tonscan.org/tx/{lt as int}:{txhash as base64url}:{account address}`

`https://explorer.toncoin.org/transaction?account={account address}&lt={lt as int}&hash={txhash as base64url}`
