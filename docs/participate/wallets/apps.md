# Wallet Apps

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it.
:::

## Overview

This article describes wallets from a developmental perspective. The end goal  is to create wallet applications that support TON mass adoption.

If you want to find a wallet to install, open [ton.org/wallets](https://ton.org/wallets).

## Non-custodial wallets

* [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) — one of the first wallets in the TON ecosystem developed by TON Foundation.
* [Tonkeeper](https://tonkeeper.com/) - is an alternative wallet, that is a favourite among users today. 
* [Tonhub](https://tonhub.com/) - is another rapidly developing wallet with new advanced features (Extension, Ton Whales Staking UI). 

### Basics features
| Wallet     | Source repositories                                     | Jetton    | NFT transfers | Authorization                                               | Wallet contract                                                                                              | Test environment                                      |
|------------|---------------------------------------------------------|-----------|---------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| TON Wallet | [Github*](https://github.com/ton-blockchain/wallet-ios) | No        | No            | No                                                          | [wallet v3](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)              | Testnet                                               |
| Tonkeeper  | [Github](https://github.com/tonkeeper/wallet)           | Supported | Supported     | [ton-connect](https://github.com/tonkeeper/ton-connect)     | [wallet v4](https://github.com/ton-blockchain/wallet-contract/tree/3fd1d7ae39f1c46ec1f2be54c4040d8d87505e0f) | Testnet                                               |
| Tonhub     | [Github](https://github.com/tonwhales/wallet)           | Supported | Supported**   | [tonhub connector](https://developers.tonhub.com/docs/apps) | [wallet v4](https://github.com/ton-blockchain/wallet-contract/tree/3fd1d7ae39f1c46ec1f2be54c4040d8d87505e0f) | [Sandbox](https://developers.tonhub.com/docs/sandbox) |

  > *TON Wallet clients for every supported OS placed in nearby repositories.

  > **Tonhub extension opens a built-in browser which allows for NFT market placements.

### TON Wallet

|                                                                                                                                                                                                                       |                                                                                                                                                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![TON wallet](/img/docs/TonWallet.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | TON Wallet was the first step in mass-adoption blockchain technology available to ordinary users. It demonstrates how a wallet must works on TON Blockchain. |


#### Pros and Cons
- ✅ The original wallet developed by TON Foundation. TON Wallet works according to the vision of TON Blockchain's core developers.
- ✅ Multi-platform architecture support. It works in Linux, Windows, MacOS, iOS, Android and as well as a Chrome plugin.
- ✅ Updates are rare. There is huge potential for contributions to be made by newcomers because the current project is relatively simple.
- ❌ Rare updates. This wallet does not have not all up-to-date features (TON DNS address, wallet-v4 contract not supported).
- ❌ The current UI is outdated and is worse than alternative wallets.


### Tonkeeper


|                                                                                                                                                                                                                      |                                                                                                                                                            |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonkeeper](/img/docs/Tonkeeper.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | [Tonkeeper](https://tonkeeper.com/) - is the most downloaded wallet, developed by the Tonkeeper team and has active support from both users and developers.   |

#### Pros and Cons
- ✅ Most popular mobile wallet with over 100k downloads from various stores. This app is most popular with users.
- ✅ Supports all up-to-date features including native NFT transfer between user wallets.
- ❌ Tonkeeper is only supported by mobile iOS and Android platforms. Tonkeeper's team plans to only support mobile platforms.
- ❌ To contribute requires advanced skills. A lot of the job already done and it will be hard for newcomers to add something significant.

#### Tonkeeper test environment
To switch Tonkeeper application between Mainnet and Testnet; move to settings, at the bottom of the settings screen tap several times on the Tonkeeper icon and switch net in the dev menu.


### Tonhub

|                                                                                                                                                                                                                |                                                                                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;![Tonhub](/img/docs/Tonhub.png?raw=true) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | [Tonhub](https://tonhub.com/) - is another fully-fledged TON wallet, that has basic up-to-date features support. Ton Whales are rapidly increasing the capabilities of the wallet.




#### Pros and Cons

 - ✅ Advanced extension feature that accomodates open 3rd party services from the built-in Tonhub browser.
 - ✅ Independent Testnet and application Sandbox for development.
 - ✅ Supports MacOS.
 - ❌ The Testnet environment has no support .
 - ❌ To contribute requires requires advanced skills.

#### Tonhub test environment

Instead of Testnet, use the Sandbox environment [here](https://developers.tonhub.com/docs/sandbox).



## Custodial wallets

* @wallet — bot application to send and receive TON inside Telegram.
* @cryptobot — telegram bot 