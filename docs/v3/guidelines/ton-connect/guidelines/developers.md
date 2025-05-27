import Feedback from '@site/src/components/Feedback';

# TON Connect SDKs

## SDK List

:::info
We recommend using the [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) kit for your DApps. Only switch to lower levels of the SDK or reimplement your protocol version if your product requires it.
:::

This page contains the list of useful libraries for TON Connect.

* [TON Connect React](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react) 
* [TON Connect JS SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-js-sdk)
* [TON Connect Vue](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue)
* [TON Connect Python SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-python)
* [TON Connect Dart](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-dart)
* [TON Connect C#](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-c)
* [TON Connect Unity](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-unity)
* [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) - TON Connect User Interface (UI) for React applications

`@tonconnect/ui-react` is a React UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in React apps.

* Example of a DApp with `@tonconnect/ui-react`: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
* Example of deployed `demo-dapp-with-react-ui`: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)


## TON Connect JS SDK

The TON Connect repository contains the following main packages:

- [@tonconnect/ui](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-ui) - TON Connect User Interface (UI)
- [@tonconnect/sdk](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-protocol-models) - TON Connect protocol specifications


### TON Connect UI

TON Connect UI is a UI kit for TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol. It allows you to integrate TON Connect into your app more efficiently using our UI elements, such as the **connect wallet** button, **select wallet** dialog, and **confirmation** modals.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API Documentation](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

The TON Connect **User Interface (UI)** is a framework that allows developers to improve and unify the user **experience (UX)** for TON application users.

Developers can easily integrate TON Connect with apps using simple UI elements such as the connect wallet button, select wallet dialog, and confirmation modals. Here are three primary examples of how TON Connect improves UX in apps:

* Example of app functionality in the DApp browser: [GitHub](https://ton-connect.github.io/demo-dapp/)
* Example of a backend partition of the DApp above: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
* Bridge server using Go: [GitHub](https://github.com/ton-connect/bridge)


This kit simplifies the implementation of TON Connect in apps built for the TON Blockchain. Standard frontend frameworks are supported, as are applications that don’t use predetermined frameworks.


### TON Connect SDK

The TON Connect SDK is the lowest level of the three frameworks that help developers integrate TON Connect into their applications. It primarily connects apps to TON wallet apps via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect protocol models

This package contains protocol requests, protocol responses, event models, and encoding and decoding functions. Developers may use this to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a DApp, use the [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk).

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)


## TON Connect Vue

TON Connect UI Vue is a Vue UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in Vue apps.

* Example of a DApp with `@townsquarelabs/ui-vue`: [GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
* Example of deployed `demo-dapp-with-vue-ui`: [GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

## TON Connect Python

### pytonconnect

Python SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

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

Dart SDK for TON Connect 2.0. analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dart pub add darttonconnect
```

* [GitHub](https://github.com/romanovichim/dartTonconnect)


## TON Connect C#

C# SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dotnet add package TonSdk.Connect
```

* [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON Connect Unity

Unity asset for TON Connect 2.0. Uses `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`.

Use it to integrate the TON Connect protocol with your game.

* [GitHub](https://github.com/continuation-team/unity-ton-connect)
* [Docs](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)


## TON Connect Go

Go SDK for TON Connect 2.0.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 go get github.com/cameo-engineering/tonconnect
```

* [GitHub](https://github.com/cameo-engineering/tonconnect)



## General questions and concerns

If you encounter any additional issues during the implementation of TON Connect, contact developers with [GitHub issues](https://github.com/ton-blockchain/ton-connect/issues).

## See also

* [Step-by-step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)
* [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU&t=254s&ab_channel=AlefmanVladimir%5BEN%5D)
* [Ton Connect Getting started](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
* [Integration manual](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
* [[YouTube] TON Dev Study TON Connect Protocol [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)

<Feedback />

