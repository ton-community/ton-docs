# Types of Wallet Contracts

You may have heard about different versions of wallets on the TON Blockchain. But what do these versions actually mean, and how do they differ?

In this article, we’ll explore the various versions and modifications of TON wallets.

## How can wallets be different?

Before diving in, let’s understand how wallets on TON can differ.

In blockchains like Ethereum, Solana, and others, there are no distinct types or versions of wallets. So why are there different wallet versions in TON? It’s because, in TON, wallets are implemented as smart contracts.

These smart contracts can be set up in different ways and can have different features. That's why there are several versions of wallets in TON.

## Basic wallets

### Wallet V1

This is the simplest one. It only allows you to send one transaction at the time and it doesn't check anything besides your signature and seqno.

This version isn't even used in regular apps because it has some major issues:
 - No easy way to retrieve the seqno and public key from the contract
 - No `valid_until` check, so you can't be sure that the transaction won't be confirmed too late.

The first issue is fixed in `V1R2` and `V1R3`. That `R` stands for `revision`. Usually revisions are just small updates which only add get-methods which allows you to retrieve seqno and public key from the contract.
However, the second issue is fixed in the next version.

Wallet source code:
 * [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc) 

### Wallet V2

This version introduces the `valid_until` parameter which is used to set a time limit for a transaction in case you don't want it to be confirmed too late. This version also doesn't have the get-method for public key, which is added in `V2R2`.

It can be used in most cases, but it misses one cool feature, which was added in `V3`.

Wallet source code:
 * [ton/crypto/smartcont/new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)

### Wallet V3

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key (so you can have only one seed phrase and lots of wallets). And, as before, `V3R2` only adds the get-method for public key.

Basically, `subwallet_id` is just a number added to the contract state when it is deployed. And since the contract address in TON is a hash of its state and code, the wallet address will change with a different `subwallet_id`.

This version is the most used right now. It covers most use-cases and remains clean and simple.

Wallet source code:
 * [ton/crypto/smartcont/wallet-v3-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3-code.fif)

### Wallet V4

It is the most modern wallet version at the moment. It still has all the functionality of the previous versions, but also introduces something very powerful — `plugins`.

This feature allows developers to implement complex logic that will work in tandem with a user's wallet. For example, some DApp may require a user to pay a small amount of coins every day to use some features, so the user would need to install the plugin on their wallet by signing a transaction. This plugin would send coins to the destination address daily when requested by an external message.

This is a very customizable feature which is unique to TON Blockchain.

Wallet source code:
 * [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

### Wallet V5

This is an extensible wallet specification developed by the Tonkeeper team, aimed at replacing V4 and allowing arbitrary extensions.

The W5 wallet standard offers many benefits that improve the experience for both users and merchants. W5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers.

Users will have access to a 25% reduction in blockchain fees, a new flexible plugin interface for developers, and an internal message signature that enables delegation of gas payments.

In addition to retaining the previous functionality (v4), the new contract allows you to send up to 255 messages at a time, as well as to make full-fledged gasless transactions (e.g., payment of network fees when transferring USDt in USDt itself) and other features. We believe it will enhance the usability and capabilities for TON users.

:::tip
Wallet V5 wallets allow transactions to be initiated by the user but paid for by another contract. Consequently, there will be services (such as [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)) that provide this functionality: they pay the transaction fees in TONs on behalf of the user, but charge a fee in tokens.
:::

#### UI Preparation and Beta Testing

- <b>UI</b>: Already now, wallet teams can start UI preparations. You can use the v5-beta smart contract as a test smart contract, but keep in mind that it will can change. UI suggestion: wallets that have multi-accounts could support the new v5 smart contract as a separate account in the UI. Provide a “Transfer funds between your accounts” functionality.
- <b>Beta</b>: If you build v5 functionality into public versions of your products, please mark it as “beta” and do not use the v5 contract by default, but only when explicitly enabled in the settings. Please observe this rule to prevent too wide distribution of the non-final beta version of the v5 smart contract.
- <b>Release</b>: The final smart contract will be ready around June 20, after which wallets can enable v5 by default using the final smart contract. It will be updated here.

#### Preparing for Gasless Transactions

The v5 wallet smart contract allows the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself.

#### Flow

1. When sending USDt, the user signs one message containing two outgoing USDt transfers:
    1. USDt transfer to the recipient's address.
    2. Transfer of a small amount of USDt in favor of the Service.
2. This signed message is sent off-chain by HTTPS to the Service backend. The Service backend sends it to the TON blockchain, paying Toncoins for network fees.

Beta version of the gasless backend API is available on [tonapi.io/api-v2](https://tonapi.io/api-v2). If you are developing any wallet app and have feedback about these methods please share it ton [@tonapitech](https://t.me/tonapitech) chat.

Wallet source code:
 * [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## Special wallets

Sometimes the functionality of basic wallets isn't enough. That's why there are several types of specialized wallet: `high-load`, `lockup` and `restricted`.

Let's have a look at them.

### Highload Wallets

When working with many messages in a short period, there is a need for special wallet called Highload Wallet. Read [the article](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) for more information.

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

## Known op codes

:::info
Also op-code, op::code and operational code
:::


| Contract type   | Hex code        | OP::Code                   |
|-----------------|-----------------|----------------------------|
| Global          | 0x00000000      | Text Comment               |
| Global          | 0xffffffff      | Bounce                     |
| Global          | 0x2167da4b      | [Encrypted Comment](/v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments) |
| Global          | 0xd53276db      | Excesses                   |
| Elector         | 0x4e73744b      | New Stake                  |
| Elector         | 0xf374484c      | New Stake Confirmation     |
| Elector         | 0x47657424      | Recover Stake Request      |
| Elector         | 0x47657424      | Recover Stake Response     |
| Wallet          | 0x0f8a7ea5      | Jetton Transfer            |
| Wallet          | 0x235caf52      | [Jetton Call To](https://testnet.tonviewer.com/transaction/1567b14ad43be6416e37de56af198ced5b1201bb652f02bc302911174e826ef7) |
| Jetton          | 0x178d4519      | Jetton Internal Transfer   |
| Jetton          | 0x7362d09c      | Jetton Notify              |
| Jetton          | 0x595f07bc      | Jetton Burn                |
| Jetton          | 0x7bdd97de      | Jetton Burn Notification   |
| Jetton          | 0xeed236d3      | Jetton Set Status          |
| Jetton-Minter   | 0x642b7d07      | Jetton Mint                |
| Jetton-Minter   | 0x6501f354      | Jetton Change Admin        |
| Jetton-Minter   | 0xfb88e119      | Jetton Claim Admin         |
| Jetton-Minter   | 0x7431f221      | Jetton Drop Admin          |
| Jetton-Minter   | 0xcb862902      | Jetton Change Metadata     |
| Jetton-Minter   | 0x2508d66a      | Jetton Upgrade             |
| Vesting         | 0xd372158c      | [Top Up](https://github.com/ton-blockchain/liquid-staking-contract/blob/be2ee6d1e746bd2bb0f13f7b21537fb30ef0bc3b/PoolConstants.ts#L28) |
| Vesting         | 0x7258a69b      | Add Whitelist              |
| Vesting         | 0xf258a69b      | Add Whitelist Response     |
| Vesting         | 0xa7733acd      | Send                       |
| Vesting         | 0xf7733acd      | Send Response              |
| Dedust          | 0x9c610de3      | Dedust Swap ExtOut         |
| Dedust          | 0xe3a0d482      | Dedust Swap Jetton         |
| Dedust          | 0xea06185d      | Dedust Swap Internal       |
| Dedust          | 0x61ee542d      | Swap External              |
| Dedust          | 0x72aca8aa      | Swap Peer                  |
| Dedust          | 0xd55e4686      | Deposit Liquidity Internal |
| Dedust          | 0x40e108d6      | Deposit Liquidity Jetton   |
| Dedust          | 0xb56b9598      | Deposit Liquidity all      |
| Dedust          | 0xad4eb6f5      | Pay Out From Pool          |
| Dedust          | 0x474а86са      | Payout                     |
| Dedust          | 0xb544f4a4      | Deposit                    |
| Dedust          | 0x3aa870a6      | Withdrawal                 |
| Dedust          | 0x21cfe02b      | Create Vault               |
| Dedust          | 0x97d51f2f      | Create Volatile Pool       |
| Dedust          | 0x166cedee      | Cancel Deposit             |
| StonFi          | 0x25938561      | Swap Internal              |
| StonFi          | 0xf93bb43f      | Payment Request            |
| StonFi          | 0xfcf9e58f      | Provide Liquidity          |
| StonFi          | 0xc64370e5      | Swap Success               |
| StonFi          | 0x45078540      | Swap Success ref           |

:::info
[DeDust docs](https://docs.dedust.io/docs/swaps)

[StonFi docs](https://docs.ston.fi/docs/developer-section/architecture#calls-descriptions)
:::

## Conclusion

As you see, there are many different versions of wallets in TON. But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets if you want to have some additional functionality like a periodic unlocking of funds.

## See Also
 - [Working With Wallet Smart Contracts](/v3/guidelines/smart-contracts/howto/wallet)
 - [Sources of basic wallets](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
 - [More technical description of versions](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
 - [Wallet V4 sources and detailed description](https://github.com/ton-blockchain/wallet-contract)
 - [Lockup wallet sources and detailed description](https://github.com/ton-blockchain/lockup-wallet-contract)
 - [Restricted wallet sources](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
