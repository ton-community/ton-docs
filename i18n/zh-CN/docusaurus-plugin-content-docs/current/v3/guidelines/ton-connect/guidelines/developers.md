import Feedback from '@site/src/components/Feedback';

# TON Connect SDKs

## SDK 列表

:::info
We recommend using the [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) kit for your DApps. Only switch to lower levels of the SDK or reimplement your protocol version if your product requires it.
:::

本页内容包括 TON Connect 的有用的库列表。

- [TON Connect React](/develop/dapps/ton-connect/developers#ton-connect-react)
- [TON Connect JS SDK](/develop/dapps/ton-connect/developers#ton-connect-js-sdk)
- [TON Connect Python SDK](/develop/dapps/ton-connect/developers#ton-connect-python)
- [TON Connect Dart](/develop/dapps/ton-connect/developers#ton-connect-dart)
- [TON Connect C#](/develop/dapps/ton-connect/developers#ton-connect-c)
- [TON Connect Unity](/develop/dapps/ton-connect/developers#ton-connect-unity)
- [TON Connect Go](/develop/dapps/ton-connect/developers#ton-connect-go)
- [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) - 适用于 React 应用的 TON Connect 用户界面（UI）

`@tonconnect/ui-react` is a React UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in React apps.

- 包含 `@tonconnect/ui-react` 的 DApp 示例：[GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
- 部署的 `demo-dapp-with-react-ui` 示例：[GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## TON Connect JS SDK

The TON Connect repository contains the following main packages:

- [@tonconnect/ui](/develop/dapps/ton-connect/developers#ton-connect-ui) - TON Connect 用户界面（UI）
- [@tonconnect/sdk](/develop/dapps/ton-connect/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/develop/dapps/ton-connect/developers#ton-connect-protocol-models) - TON Connect 协议规范

### TON Connect UI

TON Connect UI is a UI kit for TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol. It allows you to integrate TON Connect into your app more efficiently using our UI elements, such as the **connect wallet** button, **select wallet** dialog, and **confirmation** modals.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

The TON Connect **User Interface (UI)** is a framework that allows developers to improve and unify the user **experience (UX)** for TON application users.

Developers can easily integrate TON Connect with apps using simple UI elements such as the connect wallet button, select wallet dialog, and confirmation modals. Here are three primary examples of how TON Connect improves UX in apps:

- DApp 浏览器中的应用功能示例：[GitHub](https://ton-connect.github.io/demo-dapp/)
- Example of a backend partition of the DApp above: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
- 使用 Go 的 Bridge 服务器：[GitHub](https://github.com/ton-connect/bridge)

This kit simplifies the implementation of TON Connect in apps built for the TON Blockchain. Standard frontend frameworks are supported, as are applications that don’t use predetermined frameworks.

### TON Connect SDK

The TON Connect SDK is the lowest level of the three frameworks that help developers integrate TON Connect into their applications. It primarily connects apps to TON wallet apps via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect 协议模型

This package contains protocol requests, protocol responses, event models, and encoding and decoding functions. Developers may use this to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a DApp, use the [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk).

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)

## TON Connect Vue

TON Connect UI Vue is a Vue UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in Vue apps.

- 使用 `@townsquarelabs/ui-vue` 的 DApp 示例：[GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
- 已部署的 `demo-dapp-with-vue-ui` 示例：[GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

```bash
npm i @townsquarelabs/ui-vue
```

- [GitHub](https://github.com/TownSquareXYZ/tonconnect-ui-vue)
- [NPM](https://www.npmjs.com/package/@townsquarelabs/ui-vue)

## TON Connect Python

### TON 连接 Python

Python SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)

### ClickoTON-Foundation tonconnect

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)

## TON Connect C\\\\#

Dart SDK for TON Connect 2.0. analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dart pub add darttonconnect
```

- [GitHub](https://github.com/romanovichim/dartTonconnect)

## TON Connect C\#

C# SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dotnet add package TonSdk.Connect
```

- [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON 连接统一

Unity asset for TON Connect 2.0. Uses `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`.

Use it to integrate the TON Connect protocol with your game.

- [GitHub](https://github.com/continuation-team/unity-ton-connect)
- [文档](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)

## TON Connect Go

TON Connect 2.0 的 Unity 资产。使用`continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`。

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 go get github.com/cameo-engineering/tonconnect
```

- [GitHub](https://github.com/cameo-engineering/tonconnect)

## General questions and concerns

If you encounter any additional issues during the implementation of TON Connect, contact developers with [GitHub issues](https://github.com/ton-blockchain/ton-connect/issues).

## See also

- [Step-by-step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)
- [[YouTube] TON Smart Contracts | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU\\\&t=254s\\\&ab_channel=AlefmanVladimir%5BEN%5D)
- [Ton Connect 入门](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [Integration manual](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
- [[YouTube] TON Dev Study TON Connect Protocol [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)

<Feedback />

