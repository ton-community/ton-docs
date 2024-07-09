# TON Connect SDKs

## SDK List

:::info
If possible, it is recommended to use the [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) kit for your dApps. Only switch to lower levels of the SDK or reimplement your version of the protocol if it is really necessary for your product.
:::

This page contents the list of useful libraries for TON Connect.

* [TON Connect React](/develop/dapps/ton-connect/developers#ton-connect-react) 
* [TON Connect JS SDK](/develop/dapps/ton-connect/developers#ton-connect-js-sdk)
* [TON Connect Python SDK](/develop/dapps/ton-connect/developers#ton-connect-python)
* [TON Connect Dart](/develop/dapps/ton-connect/developers#ton-connect-dart)
* [TON Connect C#](/develop/dapps/ton-connect/developers#ton-connect-c)
* [TON Connect Unity](/develop/dapps/ton-connect/developers#ton-connect-unity)
* [TON Connect Go](/develop/dapps/ton-connect/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) - TON Connect User Interface (UI) for React applications

TonConnect UI React is a React UI kit for TonConnect SDK. Use it to connect your app to TON wallets via TonConnect protocol in React apps.

* Example of a DAppwith `@tonconnect/ui-react`: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
* Example of deployed `demo-dapp-with-react-ui`: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)


## TON Connect JS SDK

The TON Connect repository contains following main packages:

- [@tonconnect/ui](/develop/dapps/ton-connect/developers#ton-connect-ui) - TON Connect User Interface (UI)
- [@tonconnect/sdk](/develop/dapps/ton-connect/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/develop/dapps/ton-connect/developers#ton-connect-protocol-models) - TON Connect protocol specifications


### TON Connect UI

TonConnect UI is a UI kit for TonConnect SDK. Use it to connect your app to TON wallets via TonConnect protocol. It allows you to integrate TonConnect to your app easier using our UI elements such as "connect wallet button", "select wallet dialog" and confirmation modals.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

The TON Connect User Interface (UI) is a framework that allows developers to improve the user experience (UX) for application users.

TON Connect can easily be integrated with apps using simple UI elements such as the "connect wallet button", "select wallet dialog" and confirmation modals. Here are three main examples of how TON Connect improves UX in apps:

* Example of app functionality in the DAppbrowser: [GitHub](https://ton-connect.github.io/demo-dapp/)
* Example of a backend partition of the DAppabove: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
* Bridge server using Go: [GitHub](https://github.com/ton-connect/bridge)


This kit will simplify the implementation of TON Connect in apps built for TON Blockchain. Standard frontend frameworks are supported, as well as applications that don’t use predetermined frameworks.


### TON Connect SDK

The most low-level of the three frameworks that helps developers integrate TON Connect into their applications is the TON Connect SDK. It is primarily used to connect apps to TON Wallets via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect protocol models

This package contains protocol requests, protocol responses, event models and encoding and decoding functions. It can be used to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a DAppthe [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk) should be used.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)



## TON Connect Python

### pytonconnect

Python SDK for TON Connect 2.0. Analogue of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via TonConnect protocol.

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)


### ClickoTON-Foundation tonconnect

Library for connecting TON Connect to Python apps

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)


## TON Connect Dart

Dart SDK for TON Connect 2.0. Analogue of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via TonConnect protocol.

```bash
 $ dart pub add darttonconnect
```

* [GitHub](https://github.com/romanovichim/dartTonconnect)


## TON Connect C#

C# SDK for TON Connect 2.0. Analogue of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via TonConnect protocol.

```bash
 $ dotnet add package TonSdk.Connect
```

* [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)


## TON Connect Go

Go SDK for TON Connect 2.0.

Use it to connect your app to TON wallets via TonConnect protocol.

```bash
 go get github.com/cameo-engineering/tonconnect
```

* [GitHub](https://github.com/cameo-engineering/tonconnect)

## General Questions and Concerns

If any of our developers or community members encounter any additional issues during the implementation of TON Connect 2.0, please contact the [Tonkeeper developer](https://t.me/tonkeeperdev) channel.

If you experience any additional issues, or would like to present a proposal on how to improve TON Connect 2.0, please contact us directly through the appropriate [GitHub directory](https://github.com/ton-connect/).

## TON Connect Unity

Unity asset for TON Connect 2.0. Uses `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`.

Use it to integrate TonConnect protocol with your game.

* [GitHub](https://github.com/continuation-team/unity-ton-connect)
* [Docs](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)

## See Also

* [Step by step guide for building your first web client](https://ton-community.github.io/tutorials/03-client/)
* [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU&t=254s&ab_channel=AlefmanVladimir%5BEN%5D)
* [Ton Connect Getting started](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
* [Integration Manual](/develop/dapps/ton-connect/integration)
* [[YouTube] TON Dev Study TON Connect Protocol [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)
