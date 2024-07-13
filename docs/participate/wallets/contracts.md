# Types of Wallet Contracts

You have probably heard somewhere about different versions of wallets in TON Blockchain. But what do these versions really mean and how do they differ?

In this article, we'll look at all versions and modifications of TON wallets.

## How can wallets be different?

Before we start, we need to understand how wallets can differ at all.

If we look at Ethereum, Solana or almost any other blockchain, there are not different types or versions of wallets. But why do they exist in TON? It's because wallets in TON are made by smart contracts. Basically, any wallet (even yours) is a smart contract running on TON Blockchain which can accept and send transactions to other wallets which are also smart contracts.

These smart contracts can be set up in different ways and can have different features. That's why there are several versions of wallets in TON.

## Basic wallets

### Wallet V1

This is the simplest one. It only allows you to send one transaction at the time and it doesn't check anything besides your signature and seqno.

This version isn't even used in regular apps because it has some major issues:
 - No easy way to retrieve the seqno and public key from the contract
 - No `valid_until` check, so you can't be sure that the transaction won't be confirmed too late.

The first issue is fixed in `V1R2` and `V1R3`. That `R` letter means `revision`. Usually revisions are just small updates which only add get-methods which allows you to retrieve seqno and public key from the contract.
But this version also has a second issue, which is fixed in the next version.

Wallet source code:
 * [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc) 

### Wallet V2

This version introduces the `valid_until` parameter which is used to set a time limit for a transaction in case you don't want it to be confirmed too late. This version also doesn't have the get-method for public key, which is added in `V2R2`.

It can be used in most cases, but it misses one cool feature, which was added in `V3`.

Wallet source code:
 * [ton/crypto/smartcont/new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)

### Wallet V3

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key (so you can have only one seed phrase and lots of wallets). And, as before, `V3R2` only adds the get-method for public key.

Basically, `subwallet_id` is just a number which is added to the contract state when it is deployed. And since the contract address in TON is a hash of its state and code, the wallet address will change with a different `subwallet_id`.

This version is the most used right now. It covers most use-cases and remains clean and simple.

Wallet source code:
 * [ton/crypto/smartcont/wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

### Wallet V4

It is the most modern wallet version at the moment. It still has all the functionality of the previous versions, but also introduces something very powerful — `plugins`.

This feature allows developers to implement complex logic that will work in tandem with a user's wallet. For example, some DApp may require a user to pay a small amount of coins every day to use some features, so the user will need to install the plugin on their wallet by signing a transaction. This plugin will send coins to the destination address every day when it will be reqested by an external message.

This is a very customizable feature which is unique to TON Blockchain.

Wallet source code:
 * [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

### Wallet V5

:::warning
This is an experimental version that is in public beta testing.
The TON Core team started to audit and test this v5-beta smart contract. The smart contract code will change in the course of this work, but will try to keep its interface intact. The TON Core team plans to complete this work by June 20. We ask all wallets in the TON ecosystem to support the final smart contract after the audit.
:::

This is an extensible wallet specification developed by the Tonkeeper team, aimed at replacing V4 and allowing arbitrary extensions.

The W5 wallet standard offers many benefits that improve the experience for both users and merchants. W5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers.

Users will have access to a 25% reduction in blockchain fees, a new flexible plugin interface for developers, and an internal message signature that enables delegation of gas payments.

In addition to retaining the previous functionality (v4), the new contract allows you to send up to 255 messages at a time, as well as to make full-fledged gasless transactions (e.g., payment of network fees when transferring USDt in USDt itself) and other features. We believe it will enhance the usability and capabilities for TON users.

:::tip
In the final version of this technology, users wallets will allow transactions to be initiated by the user but paid for by another contract. Consequently, there will be services (such as [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)) that provide this functionality: they pay the transaction fees in TONs on behalf of the user, but charge a fee in tokens. This means they cover the TON fees only for transactions that include a payment to the service.
:::

#### UI Preparation and Beta Testing

- <b>UI</b>: Already now, wallet teams can start UI preparations. You can use the v5-beta smart contract as a test smart contract, but keep in mind that it will can change. UI suggestion: wallets that have multi-accounts could support the new v5 smart contract as a separate account in the UI. Provide a “Transfer funds between your accounts” functionality.
- <b>Beta</b>: If you build v5 functionality into public versions of your products, please mark it as “beta” and do not use the v5 contract by default, but only when explicitly enabled in the settings. Please observe this rule to prevent too wide distribution of the non-final beta version of the v5 smart contract.
- <b>Release</b>: The final smart contract will be ready around June 20, after which wallets can enable v5 by default using the final smart contract. It will be written about here.

#### Preparing for Gasless Transactions

The v5 wallet smart contract allows the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself.

#### Flow

1. When sending USDt, the user signs one message containing two outgoing USDt transfers:
    1. USDt transfer to the recipient's address.
    2. Transfer of a small amount of USDt in favor of the Service.
2. This signed message is sent off-chain by HTTPS to the Service backend. The Service backend sends it to the TON blockchain, paying Toncoins for network fees.

Beta version of the gasless backend API is available on [tonapi.io/api-v2](https://tonapi.io/api-v2). If you are developing any wallet app and have feedback about these methods please share it ton [@tonapitech](https://t.me/tonapitech) chat.

Wallet source code:
 * [tonkeeper/w5](https://github.com/tonkeeper/w5)

## Special wallets

Sometimes the functionality of basic wallets isn't enough. That's why there are several types of specialized wallet: `high-load`, `lockup` and `restricted`.

Let's have a look at them.

### Highload Wallet v3

This wallet is made for who need to send transactions at very high rates. For example, crypto exchanges.

- [Source code](https://github.com/ton-blockchain/highload-wallet-contract-v3)

Any given external message (transfer request) to a highload v3 contains:
- a signature (512 bits) in the top level cell - the other parameters are in the ref of that cell
- subwallet ID (32 bits)
- message to send as a ref (the serialized internal message that will be sent)
- send mode for the message (8 bits)
- composite query ID - 13 bits of "shift" and 10 bits of "bit number", however the 10 bits of bit number can only go up to 1022, not 1023, and also the last such usable query ID (8388605) is reserved for emergencies and should not be normally used
- created at, or message timestamp
- timeout

Timeout is stored in highload as a parameter and is checked against the timeout in all requests - so the timeout for all requests is equal. The message should be not older than timeout at the time of arrival to the highload wallet, or in code it is required that `created_at > now() - timeout`. Query IDs are stored for the purposes of replay protection for at least timeout and possibly up to 2 * timeout, however one should not expect them to be stored for longer than timeout. Subwallet ID is checked against the one stored in the wallet. Inner ref's hash is checked along with the signature against the public key of the wallet.

Highload v3 can only send 1 message from any given external message, however it can send that message to itself with a special op code, allowing one to set any action cell on that internal message invocation, effectively making it possible to send up to 254 messages per 1 external message (possibly more if another message is sent to highload wallet again among these 254).

Highload v3 will always store the query ID (replay protection) once all the checks pass, however a message may not be sent due to some conditions, including but not limited to:
- **containing state init** (such messages, if required, may be sent using the special op code to set the action cell after an internal message from highload wallet to itself)
- not enough balance
- invalid message structure (that includes external out messages - only internal messages may be sent straight from the external message)

Highload v3 will never execute multiple externals containing the same `query_id` **and** `created_at` - by the time it forgets any given `query_id`, the `created_at` condition will prevent such a message from executing. This effectively makes `query_id` **and** `created_at` together the "primary key" of a transfer request for highload v3.

When iterating (incrementing) query ID, it is cheaper (in terms of TON spent on fees) to iterate through bit number first, and then the shift, like when incrementing a regular number. After you've reached the last query ID (remember about the emergency query ID - see above), you can reset query ID to 0, but if highload's timeout period has not passed yet, then the replay protection dictionary will be full and you will have to wait for the timeout period to pass.




### Highload wallet v2

:::danger
Legacy contract, it is suggest to use High-load wallet v3.
:::

This wallet is made for those who need to send hundreds of transactions in a short period of time. For example, crypto exchanges.

It allows you to send up to `254` transactions in one smart contract call. It also uses a slightly different approach to solve replay attacks instead of seqno, so you can call this wallet several times at once to send even thousands of transactions in a second.

:::caution Limitations
Note, when dealing with highload-wallet the following limits need to be checked and taken into account.
:::

1. **Storage size limit.** Currently, size of contract storage should be less than 65535 cells. If size of
old_queries will grow above this limit, exception in ActionPhase will be thrown and transaction will fail.
Failed transaction may be replayed.
2. **Gas limit.** Currently, gas limit is 1'000'000 GAS units, that means that there is a limit of how much
old queries may be cleaned in one tx. If number of expired queries will be higher, contract will stuck.

That means that it is not recommended to set too high expiration date:
number of queries during expiration timespan should not exceed 1000.

Also, number of expired queries cleaned in one transaction should be below 100.



Wallet source code:
 * [ton/crypto/smartcont/highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/highload-wallet-v2-code.fc)

### Lockup wallet

If you, for some reason, need to lock coins in a wallet for some time without the possibility to withdraw them before that time passes, have a look at the lockup wallet.

It allows you to set the time until which you won't be able to withdraw anything from the wallet. You can also customize it by setting unlock periods so that you will be able to spend some coins during these set periods.

For example: you can create a wallet which will hold 1 million coins with total vesting time of 10 years. Set the cliff duration to one year, so the funds will be locked for the first year after the wallet is created. Then, you can set the unlock period to one month, so `1'000'000 TON / 120 months = ~8333 TON` will unlock every month.

Wallet source code:
 * [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Restricted wallet

This wallet's function is to act like a regular wallet, but restrict transfers to only one pre-defined destination address. You can set the destination when you create this wallet and then you'll be only able to transfer funds from it to that address. But note that you can still transfer funds to validation contracts so you can run a validator with this wallet.

Wallet source code:
 * [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## Conclusion

As you see, there are many different versions of wallets in TON. But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets if you want to have some additional functionality like a periodic unlocking of funds.

## See Also

 - [Sources of basic wallets](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
 - [More technical description of versions](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
 - [Wallet V4 sources and detailed description](https://github.com/ton-blockchain/wallet-contract)
 - [Lockup wallet sources and detailed description](https://github.com/ton-blockchain/lockup-wallet-contract)
 - [Restricted wallet sources](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
