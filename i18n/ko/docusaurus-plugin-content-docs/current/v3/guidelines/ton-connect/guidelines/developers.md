import Feedback from '@site/src/components/Feedback';

# TON Connect SDK들

## SDK 목록

:::info
We recommend using the [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) kit for your DApps. Only switch to lower levels of the SDK or reimplement your protocol version if your product requires it.
:::

TON Connect를 위한 유용한 라이브러리 목록입니다.

- [TON Connect React](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-react)
- [TON Connect JS SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-js-sdk)
- [TON Connect Vue](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-vue)
- [TON Connect Python SDK](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-python)
- [TON Connect Dart](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-dart)
- [TON Connect C#](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-c)
- [TON Connect Unity](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-unity)
- [TON Connect Go](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](https://github.com/ton-connect/sdk/tree/main/packages/ui-react) - React 애플리케이션을 위한 TON Connect 사용자 인터페이스(UI)

`@tonconnect/ui-react` is a React UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in React apps.

- `@tonconnect/ui-react` DApp 예시: [GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
- `demo-dapp-with-react-ui` 배포 예시: [GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API 문서](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)

## TON Connect JS SDK

The TON Connect repository contains the following main packages:

- [@tonconnect/ui](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-ui) - TON Connect 사용자 인터페이스(UI)
- [@tonconnect/sdk](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-sdk) - TON Connect SDK
- [@tonconnect/protocol](/v3/guidelines/ton-connect/guidelines/developers#ton-connect-protocol-models) - TON Connect 프로토콜 사양

### TON Connect UI

TON Connect UI is a UI kit for TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol. It allows you to integrate TON Connect into your app more efficiently using our UI elements, such as the **connect wallet** button, **select wallet** dialog, and **confirmation** modals.

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API 문서](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

The TON Connect **User Interface (UI)** is a framework that allows developers to improve and unify the user **experience (UX)** for TON application users.

Developers can easily integrate TON Connect with apps using simple UI elements such as the connect wallet button, select wallet dialog, and confirmation modals. Here are three primary examples of how TON Connect improves UX in apps:

- Example of app functionality in the DApp browser: [GitHub](https://ton-connect.github.io/demo-dapp/)
- Example of a backend partition of the DApp above: [GitHub](https://github.com/ton-connect/demo-dapp-backend)
- Go를 사용한 브릿지 서버: [GitHub](https://github.com/ton-connect/bridge)

This kit simplifies the implementation of TON Connect in apps built for the TON Blockchain. Standard frontend frameworks are supported, as are applications that don’t use predetermined frameworks.

### TON Connect SDK

The TON Connect SDK is the lowest level of the three frameworks that help developers integrate TON Connect into their applications. It primarily connects apps to TON wallet apps via the TON Connect protocol.

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect 프로토콜 모델

This package contains protocol requests, protocol responses, event models, and encoding and decoding functions. Developers may use this to integrate TON Connect to wallet apps written in TypeScript. In order to integrate TON Connect into a DApp, use the [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk).

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)

## TON Connect Vue

TON Connect UI Vue is a Vue UI kit for the TON Connect SDK. Use it to connect your app to TON wallets via the TON Connect protocol in Vue apps.

- `@townsquarelabs/ui-vue` DApp 예시: [GitHub](https://github.com/TownSquareXYZ/demo-dapp-with-vue-ui)
- `demo-dapp-with-vue-ui` 배포 예시: [GitHub](https://townsquarexyz.github.io/demo-dapp-with-vue-ui/)

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

Python 앱에 TON Connect를 연결하기 위한 라이브러리입니다.

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

- [GitHub](https://github.com/romanovichim/dartTonconnect)

## TON Connect C\\#

C# SDK for TON Connect 2.0. An analog of the `@tonconnect/sdk` library.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 $ dotnet add package TonSdk.Connect
```

- [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)

## TON Connect Unity

TON Connect 2.0을 위한 Unity 애셋입니다. `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`를 사용합니다.

Use it to integrate the TON Connect protocol with your game.

- [GitHub](https://github.com/continuation-team/unity-ton-connect)
- [문서](https://docs.tonsdk.net/user-manual/unity-tonconnect-2.0/getting-started)

## TON Connect Go

TON Connect 2.0을 위한 Go SDK입니다.

Use it to connect your app to TON wallets via the TON Connect protocol.

```bash
 go get github.com/cameo-engineering/tonconnect
```

- [GitHub](https://github.com/cameo-engineering/tonconnect)

## General questions and concerns

If you encounter any additional issues during the implementation of TON Connect, contact developers with [GitHub issues](https://github.com/ton-blockchain/ton-connect/issues).

## See also

- [Step-by-step guide for building your first web client](https://helloworld.tonstudio.io/03-client/)
- [[YouTube] TON 스마트 컨트랙트 | 10 | 텔레그램 DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU\\&t=254s\\&ab_channel=AlefmanVladimir%5BEN%5D)
- [Ton Connect 시작하기](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [Integration manual](/v3/guidelines/ton-connect/guidelines/integration-with-javascript-sdk)
- [[YouTube] TON Dev Study TON Connect 프로토콜 [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)

<Feedback />

