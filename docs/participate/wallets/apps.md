# Wallet Apps

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it.
:::

## Overview

This article describes wallets from development perspective. The global task is creating wallet applications that deliver TON to mass adoption.

If you want to find a wallet to install open the [ton.org/wallets](https://ton.org/wallets).

## Noncustodial wallets

* [TONcoin Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) — one of the first wallets in TON ecosystem developed by TON Foundation.
* [Tonkeeper](https://tonkeeper.com/) - is the alternative wallet, that "user choice" nowadays. 
* [Tonhub](https://tonhub.com/) - is another rapidly developing wallet with new advanced features(Extension, Ton Whales Staking UI). 

### Basics features
| Wallet     | Source repositories                                     | Jetton    | NFT transfers | Authorization                                               | Wallet contract                                                                                              | Test environment                                      |
|------------|---------------------------------------------------------|-----------|---------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| TON Wallet | [Github*](https://github.com/ton-blockchain/wallet-ios) | No        | No            | No                                                          | [wallet v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)              | Testnet                                               |
| Tonkeeper  | [Github](https://github.com/tonkeeper/wallet)           | Supported | Supported     | [ton-connect](https://github.com/tonkeeper/ton-connect)     | [wallet v4](https://github.com/ton-blockchain/wallet-contract/tree/3fd1d7ae39f1c46ec1f2be54c4040d8d87505e0f) | Testnet                                               |
| Tonhub     | [Github](https://github.com/tonwhales/wallet)           | Supported | Supported**   | [tonhub connector](https://developers.tonhub.com/docs/apps) | [wallet v4](https://github.com/ton-blockchain/wallet-contract/tree/3fd1d7ae39f1c46ec1f2be54c4040d8d87505e0f) | [Sandbox](https://developers.tonhub.com/docs/sandbox) |

  > *TONcoin wallet clients for every supported OS placed in nearby repositories.

  > **Tonhub extension allows open NFT market placements via built-in browser.

### TONcoin Wallet

|                                                                                                                                                                                                                       |                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![TON wallet](/img/docs/TonWallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Toncoin wallet was the first step in mass adoption blockchain technology to ordinary users. It represents how the wallet must works on the TON blockchain. |


#### Pros-cons
- ✅ Original wallet developed TON Foundation means. TONcoin wallet works how it must from the sight of TON Blockchain core developers.
- ✅ Multiplatform architecture support. You can research how it works in Linux, Windows, MacOS, iOS, Android, and convenient for development Chrome version.
- ✅ Rare updates. Huge potential for contribution by newcomers, because the current project is simple enough.
- ❌ Rare updates. This wallet has no all up-to-date features (TON DNS address, wallet-v4 contract not supported).
- ❌ The current UI is outdated and loses to alternative wallets.


### Tonkeeper


|                                                                                                                                                                                                                      |                                                                                                                                                            |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonkeeper](/img/docs/Tonkeeper.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | [Tonkeeper](https://tonkeeper.com/) - is the most downloaded wallet, developed by Tonkeeper team and have active support for both: users and developers.   |

#### Pros-cons
- ✅ Most popular mobile wallet, as it has 100k+ downloads from stores. This app most testable by users.
- ✅ Support all up-to-date features including native transfer NFT between user's wallets.
- ❌ Tonkeeper support only mobile platforms iOS and Android. Tonkeeper's team plans support only mobile platforms.
- ❌ Contributors' level requires advanced skills. A lot of job already done and it will be hard to newcomers add something significant.

#### Tonkeeper test environment
To switch Tonkeeper application between Mainnet and Testnet move to settings, in the bottom of the settings screen tap several times on Tonkeeper icon and switch net in the dev menu.


### Tonhub

|                                                                                                                                                                                                                |                                                                                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonhub](/img/docs/Tonhub.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | [Tonhub](https://tonhub.com/) - is another full-fledged TON wallet, that has basic up-to-date features support. Ton Whales are rapidly increasing the capabilities of the wallet. |




#### Pros-cons

 - ✅ Advanced extension feature, that allows open 3d party services from built-in Tonhub browser.
 - ✅ Independent Testnet and application Sandbox for developing.
 - ✅ Support MacOS.
 - ❌ Has no support the Testnet environment.
 - ❌ Contributors' level requires advanced skills.

#### Tonhub test environment

Instead of Testnet, using Sandbox environment, see more [here](https://developers.tonhub.com/docs/sandbox).



## Custodial wallets

* @wallet — bot application to send and receive TON inside Telegram.
* @cryptobot — telegram bot 