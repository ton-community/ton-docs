# Types of Wallet Apps

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it.
:::

## Overview

This article describes wallets from development perspective.

If you want to find a wallet to install open the [ton.org/wallets](https://ton.org/wallets).

## Noncustodial wallets

* [TON Wallet Chrome Extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) — one of the first wallets in TON ecosystem developed by TON Foundation.
* [Tonkeeper](https://tonkeeper.com/) - is the alternative wallet, that "user choice" of now days. 
* [Tonhub](https://tonhub.com/) - is another rapidly developing wallet with new advanced features(Extension, Ton Whales Staking UI). 

## Features and options table
| Wallet     | Source repositories                                     | Jetton    | NFT transfers          | Authorization                                               | Wallet contract | Testnet                                               |
|------------|---------------------------------------------------------|-----------|------------------------|-------------------------------------------------------------|-----------------|-------------------------------------------------------|
| TON Wallet | [Github*](https://github.com/ton-blockchain/wallet-ios) | No        | No                     | No                                                          | wallet v3       | Testnet supported                                     |
| Tonkeeper  | [Github](https://github.com/tonkeeper/wallet)           | Supported | Supported              | [ton-connect](https://github.com/tonkeeper/ton-connect)     | wallet v4       | Testnet supported                                     |
| Tonhub     | [Github](https://github.com/tonwhales/wallet)           | Supported | Supported as extension | [tonhub connector](https://developers.tonhub.com/docs/apps) | wallet v4       | [Sandbox](https://developers.tonhub.com/docs/sandbox) |

  > *TON wallet clients for every supported OS placed in nearby repositories.  

## TON Wallet
![TON wallet](/img/docs/TonWallet.png?raw=true)

TON wallet - represent fundamental functions store and transfer of toncoins.

- Pros:
  - Original wallet from TON Foundation developers means, that wallet works how it must from the sight of core developers.
  - Multiplatform architecture. You can try to find out how it works for anything platform developing.
  - Rare updating of wallet makes this wallet good enough for first steps because project scope simple.
- Cons:
  - Rare updating of wallet leads to the fact that this wallet have no all up-to-date features(TON DNS, wallet-v4 contract not supported).
  - Current UI needs significant improvement, as currently it has not enough user-friendly. (A lot of complains from users in Play and App stores)


# Tonkeeper
![Tonkeeper](/img/docs/Tonkeeper.png?raw=true)
[Tonkeeper](https://tonkeeper.com/) - is the most downloaded wallet, developed by Tonkeeper team and have active support for both: users and developers.

- Pros
  - Most popular mobile wallet, as it has 100k+ downloads from stores. Therefore most testable by users.
  - Support all up-to-date features and unique feature - native transfer NFT

- Cons
  - Tonkeeper support only mobile platforms iOS and Android.

- Using with testnet.
  > Using with testnet: To switch Tonkeeper application from Mainnet to Testnet move to settings, in the bottom of the settings screen tap several times on Tonkeeper icon and switch to testnet in del menu, vice verca.



# Tonhub
![Tonhub](/img/docs/Tonhub.png?raw=true)

Tonhub - is another full-fledged TON wallet, that has basic up-to-date features support


- Pros
  - Advanced extension feature, that allows open 3d party services from built-in Tonhub browser.
  - Independent testnet and application Sandbox for developing
- Cons
  - Has no support of testnet environment.

> Using Sandbox environment [here](https://developers.tonhub.com/docs/sandbox).



## Custodial wallets

* @wallet — bot application to send and receive TON inside Telegram.
* @cryptobot — telegram bot 