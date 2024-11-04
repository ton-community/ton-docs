# Types of Wallet Contracts

You may have heard about different versions of wallets on the TON Blockchain. But what do these versions actually mean, and how do they differ?

In this article, we’ll explore the various versions and modifications of TON wallets.

:::info
Before we start, there is some amount of therminology and concepts, that you should be familiar with to fully understand the article, such as: 

 - Message managment, because this is main functionality of the wallets.
 - Func language, because we will heavely relly on implementations made by it.

:::

## Basic concept

To break the tension, at first we should understand that wallets is not some specific entity in ToN ecosystem, it is still just a smart-contract consist of code and data, and, in that sence, is equal to any other actor(i.e. smart-contract) in ToN. 

As your own custom smart-contract, or any other one, it can recieve external and internal messages, send internal messages and logs, provide get methods.
So the question is how they doing that and what functionality they providing, which is differs between versions.

You can consider each wallet version as smart-contract implementation, providing standart external interface, allowing different external clients to interact with the wallets in the same way. You can find those implementation in FunC and Fift languages in main ToN monorepo:

 * [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/) 


## Basic wallets

### Wallet V1

This is the simplest one. It only allows you to send four transactions at the time and it doesn't check anything besides your signature and seqno.

Wallet source code:
 * [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc) 

This version isn't even used in regular apps because it has some major issues:
 - No easy way to retrieve the seqno and public key from the contract
 - No `valid_until` check, so you can't be sure that the transaction won't be confirmed too late.

The first issue is fixed in `V1R2` and secodn in `V1R3`. That `R` stands for `revision`. Usually revisions are just small updates which only add get-methods, you cand find all of those in changes history of wallet-code.fc. Hereinafter we will consider only the latest revisions.

Nevertheless, because each subsequent version inherits the functionality of the previous one, we should still stick to it, this will help us with later versions.

#### Persistend memory layout
 - <b>seqno</b>: 32-bit long sequence number.
 - <b>public-key</b>: 256-bit long public key.

#### External message layout
1. Data:
    - <b>signature</b>: 512-bit long ed25519 signature.
    - <b>msg-seqno</b>: 32-bit long sequence number.
    - <b>valid-until</b>: 32-bit long Unix-time integer.
    - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.

As you can see main functionality of the wallet is to provide safe way for communicating with ToN blockchain from the outside world. `secno` mechanism is protecting from reply attacks, `Ed25519 signature` provides authorized access to wallet functionality and `valid-until` provide time-point limit after those message shoudn't be accepted. We will not dwell in detail on each of these mechanisms, because they are described in detail in the [external message](/v3/documentation/smart-contracts/message-management/external-messages) documentation page and they are quite common among smart-contracts recieving external messages. Payload data is up to 4 references to cells and corresponding number of modes that will be directly transfered to [send_raw_message(cell msg, int mode)](https://docs.ton.org/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) method.

:::caution
Note that wallet doesn't provide any validation of internal messages you sending through it, so this is programmers(i.e. external client) responsibility to serialize data corresponding to [internal message layout](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

#### Exit codes
| Exit code      | Meaning                                                           |
|----------------|-------------------------------------------------------------------|
| 0x23           | `valid_until` check failed, transaction confirmation try too late |
| 0x21           | `seqno` check failed, reply protection accured                    |
| 0x22           | `Ed25519 signature` check failed                                  |
| 0x0            | Standard successful execution exit code.                          |

:::info
Note that [TVM](https://docs.ton.org/v3/documentation/tvm/tvm-overview) has [standart exit codes](https://docs.ton.org/v3/documentation/tvm/tvm-exit-codes) (`0x0` - is one of them), so you can get one of them too, for example, if you run out of [gas](https://docs.ton.org/develop/smart-contracts/fees) you will get `0xD` code.
:::

#### Get methods
1. int seqno() returns current stored seqno
2. int get_public_key returns current stored public key

### Wallet V2

Doens't see any difference for now compare to previous, here is wallet source code:

 * [ton/crypto/smartcont/new-wallet-v2.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v2.fif)

### Wallet V3

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key (so you can have only one seed phrase and lots of wallets). And, as before, `V3R2` only adds the get-method for public key.

Wallet source code:
 * [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Basically, `subwallet_id` is just a number added to the contract state when it is deployed. And since the contract address in TON is a hash of its state and code, the wallet address will change with a different `subwallet_id`. This version is the most used right now. It covers most use-cases and remains clean, simple and mostly same as previous versions. All get methods remains the same.

#### Persistend memory layout
 - <b>seqno</b>: 32-bit long sequence number.
 - <b>subwallet</b>: 32-bit long subwallet-id.
 - <b>public-key</b>: 256-bit long public key.

#### External message layout
1. Data:
    - <b>signature</b>: 512-bit long ed25519 signature.
    - <b>subwallet-id</b>: 32-bit long subwallet-id.
    - <b>msg-seqno</b>: 32-bit long sequence number.
    - <b>valid-until</b>: 32-bit long Unix-time integer.
    - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.

#### Exit codes
| Exit code      | Meaning                                                           |
|----------------|-------------------------------------------------------------------|
| 0x23           | `valid_until` check failed, transaction confirmation try too late |
| 0x23           | `Ed25519 signature` check failed                                  |
| 0x21           | `seqno` check failed, reply protection accured                    |
| 0x22           | `subwallet-id` not correspond to the stored one                   |
| 0x0            | Standard successful execution exit code.                          |

### Wallet V4

It is the most modern wallet version at the moment. It still has all the functionality of the previous versions, but also introduces something very powerful — `plugins`.

Wallet source code:
 * [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

This feature allows developers to implement complex logic that will work in tandem with a user's wallet. For example, some DApp may require a user to pay a small amount of coins every day to use some features, so the user would need to install the plugin on their wallet by signing a transaction. This plugin would send coins to the destination address daily when requested by an external message.

#### Plugins

Plugins are basically just other smart-contracts in TON that developers are free to realize the way they wanted to. In relation to wallet they are just addresses of smart-contracts stored in [dictionary](https://docs.ton.org/v3/documentation/smart-contracts/func/docs/dictionaries) in wallet persisten memory, that are allowed to request funds and remove themselves from "allowed list" through sending internal messages to wallet.

#### Persistend memory layout
 - <b>seqno</b>: 32-bit long sequence number.
 - <b>subwallet-id</b>: 32-bit long subwallet-id.
 - <b>public-key</b>: 256-bit long public key.
 - <b>plugins</b>: dictionary containing plugins(might be empty)

#### Recieving internal messages

All previous versions of wallets has pretty straightforward realization of recieving internal messages, they are just accepting incoming funds from any reciever ignoring internal message body if there is one, or, in other words, have empty recv_internal method. But as was sad before fourth version of wallet has 2 additional availible operations, lets see internal message body layout:

- <b>op-code?</b>: 32-bit long operation code. This is optional field, any message containing less then 32 bit in message body, incorrect op-code, or sender address that wasn't registred as plugin will be considered as simple transfer similar to previous wallet versions.
- <b>query-id</b>: 64-bit long integer. This field doesn't have any effect on smart-contract behaivour, it is used to track chain's of messages between contracts.
1. op-code = 0x706c7567, crc32("plug") - request funds operation code
    - <b>toncoins</b>: VARUINT16 amount of requested toncoins.
    - <b>extra_currencies</b>: dictionary containing amount of requsted extra currencies(might be empty).
2. op-code = 0x64737472, crc32("dstr") - request removing of plugin-sender from "allowed list".

#### External message layout

 - <b>signature</b>: 512-bit long ed25519 signature.
 - <b>subwallet-id</b>: 32-bit long subwallet-id.
 - <b>valid-until</b>: 32-bit long Unix-time integer.
 - <b>msg-seqno</b>: 32-bit long sequence number.
 - <b>op-code</b>: 32-bit long operation code.
1. op-code = 0x0, simple send.
    - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
    - <b>(0-4)messages</b>:Up to four references to cells containing messages.
2. op-code = 0x1, deploy and install plugin. 
    - <b>workchain</b>: 8-bit long integer.
    - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
    - <b>state-init</b>: Cell reference containing plugin initital state.
    - <b>body</b>: Cell reference containing body.
3. op-code = 0x2/0x3, install plugin/remove plugin.
    - <b>wc_n_address</b>: 8-bit long workchain_id + 256-bit long plugin address.
    - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
    - <b>query-id</b>: 64-bit long integer.

As you can see fourth version still provide standart functionality though `0x0` op-code similar to previous versions. `0x2` and `0x3` operations provide manipulations for plugins dictionary, note that in case of `0x2` you need to deploy plugin with that address by yourself. `0x1` op-code in contrast also provide deployment process with `state_init` field.

:::tip
If `state_init` name doesn't tell you much by itself take a look at those references:
 * [addresses-in-ton-blockchain](https://docs.ton.org/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
 * [send-a-deploy-message](https://docs.ton.org/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
 * [internal-message-layout](https://docs.ton.org/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
:::

#### Exit codes
| Exit code      | Meaning                                                                  |
|----------------|--------------------------------------------------------------------------|
| 0x24           | `valid_until` check failed, transaction confirmation try too late        |
| 0x23           | `Ed25519 signature` check failed                                         |
| 0x21           | `seqno` check failed, reply protection accured                           |
| 0x22           | `subwallet-id` not correspond to the stored one                          |
| 0x27           | plugins dictionary manipulation failed(0x1-0x3 recv_external op-codes)   |
| 0x50           | Not enough funds for funds request                                       |
| 0x0            | Standard successful execution exit code.                                 |

#### Get methods
1. int seqno() returns current stored seqno.
2. int get_public_key() returns current stored public key.
3. int get_subwallet_id() returns current subwallet-id.
4. int is_plugin_installed(int wc, int addr_hash) checks if plugin with defined workchain-id and address-hash installed.
5. tuple get_plugin_list() returns list of plugins.

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
| Global          | 0x2167da4b      | [Encrypted Comment](v3/documentation/smart-contracts/message-management/internal-messages#messages-with-encrypted-comments) |
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