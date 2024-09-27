# Protocol specifications

Understand how TON Connect works under the hood.

## Who is this section for?

- If you implement a wallet
- If you develop an SDK
- If you want to learn how TON Connect works

## Sections overview

* [Protocol workflows](/develop/dapps/ton-connect/protocol/workflow) is an overview of all the protocols involved in TON Connect.
* [Bridge API](/develop/dapps/ton-connect/protocol/bridge) specifies how the data is transmitted between the app and the wallet.
* [Session protocol](/develop/dapps/ton-connect/protocol/session) ensures end-to-end encrypted communication over the bridge.
* [Requests protocol](/develop/dapps/ton-connect/protocol/requests-responses) defines requests and responses for the app and the wallet.
* [Wallet guidelines](/develop/dapps/ton-connect/protocol/wallet-guidelines) defines guidelines for wallet developers.

## FAQ

#### I am building an HTML/JS app, what should I read?

Simply use the [Supported SDKs](/develop/dapps/ton-connect/developers) and do not worry about the underlying protocols.

#### I need an SDK in my favorite language

Please take the [JS SDK](/develop/dapps/ton-connect/developers) as a reference and check out the protocol docs above.

#### How do you detect whether the app is embedded in the wallet?

JS SDK does that for you; just get wallets list `connector.getWallets()` and check `embedded` property of the corresponding list item. If you build your own SDK you should check `window.[targetWalletJsBridgeKey].tonconnect.isWalletBrowser`.

#### How do you detect if the wallet is a browser extension?

Like with embedded apps (see above), JS SDK detects it for you via `injected` property of the corresponding `connector.getWallets()` list item. If you build your own SDK you should check that `window.[targetWalletJsBridgeKey].tonconnect` exists.

#### How to implement backend authorization with tonconnect?

[See an example of dapp-backend](https://github.com/ton-connect/demo-dapp-backend)

#### How do I make my own bridge?

You don’t need to, unless you are building a wallet.

If you build a wallet, you will need to provide a bridge. See our [reference implementation in Go](https://github.com/ton-connect/bridge).

Keep in mind that the wallet’s side of the bridge API is not mandated.

For a quick start you can use the common TON Connect bridge [github.com/ton-connect/bridge2](https://github.com/ton-connect/bridge2).

#### I make a wallet, how do I add it to the list of wallets?

Submit a pull request for the [wallets-list](https://github.com/ton-blockchain/wallets-list) repository and fill our all the necessary metadata.

Apps may also add wallets directly through the SDK.
