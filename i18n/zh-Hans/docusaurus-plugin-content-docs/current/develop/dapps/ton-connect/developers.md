# TON Connect SDK

## SDK 列表

:::info
如果可能，建议您为您的 dApps 使用 [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) 工具包。仅当您的产品确实需要时，才切换到 SDK 的更低层级或重新实现协议版本。
:::

本页内容包括 TON Connect 的有用的库列表。

* [TON Connect React](/develop/dapps/ton-connect/developers#ton-connect-react) 
* [TON Connect JS SDK](/develop/dapps/ton-connect/developers#ton-connect-js-sdk)
* [TON Connect Python SDK](/develop/dapps/ton-connect/developers#ton-connect-python)
* [TON Connect Dart](/develop/dapps/ton-connect/developers#ton-connect-dart)
* [TON Connect C#](/develop/dapps/ton-connect/developers#ton-connect-c)
* [TON Connect Unity](/develop/dapps/ton-connect/developers#ton-connect-unity)
* [TON Connect Go](/develop/dapps/ton-connect/developers#ton-connect-go)

## TON Connect React

- [@tonconnect/ui-react](/develop/dapps/ton-connect/developers#ton-connect-ui-react) - 适用于 React 应用的 TON Connect 用户界面（UI）

TonConnect UI React 是一个 React UI 工具包，用于在 React 应用中通过 TonConnect 协议连接您的应用程序至 TON 钱包。

* 包含 `@tonconnect/ui-react` 的 DApp 示例：[GitHub](https://github.com/ton-connect/demo-dapp-with-react-ui)
* 部署的 `demo-dapp-with-react-ui` 示例：[GitHub](https://ton-connect.github.io/demo-dapp-with-react-ui/)

```bash
npm i @tonconnect/ui-react
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui-react)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui-react)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui_react.html)


## TON Connect JS SDK

TON Connect 存储库包含以下主要包：

- [@tonconnect/ui](/develop/dapps/ton-connect/developers#ton-connect-ui) - TON Connect 用户界面（UI）
- [@tonconnect/sdk](/develop/dapps/ton-connect/developers#ton-connect-sdk)  - TON Connect SDK
- [@tonconnect/protocol](/develop/dapps/ton-connect/developers#ton-connect-protocol-models) - TON Connect 协议规范


### TON Connect UI

TonConnect UI 是 TonConnect SDK 的一个 UI 工具包。使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。它允许您使用我们的 UI 元素（如“连接钱包按钮”、“选择钱包对话框”和确认modals）更轻松地将 TonConnect 集成到您的应用中。

```bash
npm i @tonconnect/ui
```

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/ui)
- [NPM](https://www.npmjs.com/package/@tonconnect/ui)
- [API 文档](https://ton-connect.github.io/sdk/modules/_tonconnect_ui.html)

TON Connect 用户界面（UI）是一个框架，允许开发者提高应用用户的用户体验（UX）。

TON Connect 可以通过简单的 UI 元素（如“连接钱包按钮”、“选择钱包对话框”和确认模态）轻松地与应用集成。这里有三个主要示例，展示了 TON Connect 如何在应用中提升 UX：

* DApp 浏览器中的应用功能示例：[GitHub](https://ton-connect.github.io/demo-dapp/)
* 上述 DApp 的后端部分示例：[GitHub](https://github.com/ton-connect/demo-dapp-backend)
* 使用 Go 的 Bridge 服务器：[GitHub](https://github.com/ton-connect/bridge)

此工具包将简化用 TON Connect 实现到 TON 区块链为目标平台所构建的应用中。它支持标准的前端框架，以及不使用预定框架的应用。


### TON Connect SDK

这三个框架中最底层的一个是 TON Connect SDK，它帮助开发者将 TON Connect 集成到他们的应用程序中。它主要用于通过 TON Connect 协议将应用程序连接到 TON 钱包。

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
- [NPM](https://www.npmjs.com/package/@tonconnect/sdk)

### TON Connect 协议模型

该包含协议请求、协议响应、事件模型以及编码和解码功能。它可用于将 TON Connect 集成到用 TypeScript 编写的钱包应用中。为了将 TON Connect 集成到 DApp 中，应该使用 [@tonconnect/sdk](https://www.npmjs.com/package/@tonconnect/sdk)。

- [GitHub](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [NPM](https://www.npmjs.com/package/@tonconnect/protocol)



## TON Connect Python

### pytonconnect

TON Connect 2.0 的 Python SDK。相当于 `@tonconnect/sdk` 库。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
pip3 install pytonconnect
```

- [GitHub](https://github.com/XaBbl4/pytonconnect)


### ClickoTON-Foundation tonconnect

用于将 TON Connect 连接到 Python 应用的库

```bash
git clone https://github.com/ClickoTON-Foundation/tonconnect.git
pip install -e tonconnect
```

[GitHub](https://github.com/ClickoTON-Foundation/tonconnect)


## TON Connect Dart

TON Connect 2.0 的 Dart SDK。相当于 `@tonconnect/sdk` 库。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
 $ dart pub add darttonconnect
```

* [GitHub](https://github.com/romanovichim/dartTonconnect)


## TON Connect C#

TON Connect 2.0 的 C# SDK。相当于 `@tonconnect/sdk` 库。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
 $ dotnet add package TonSdk.Connect
```

* [GitHub](https://github.com/continuation-team/TonSdk.NET/tree/main/TonSDK.Connect)


## TON Connect Go

TON Connect 2.0 的 Go SDK。

使用它可以通过 TonConnect 协议将您的应用程序连接到 TON 钱包。

```bash
 go get github.com/cameo-engineering/tonconnect
```

* [GitHub](https://github.com/cameo-engineering/tonconnect)

## 常见问题和关注点

如果我们的开发者或社区成员在使用 TON Connect 2.0 期间遇到任何额外问题，请联系 [Tonkeeper 开发者](https://t.me/tonkeeperdev) 频道。

如果您遇到任何额外的问题，或者想提出有关如何改进 TON Connect 2.0 的提议，请通过适当的 [GitHub 目录](https://github.com/ton-connect/) 直接联系我们。

## TON Connect Unity

:::danger
此库目前已过时。

请为您的 Unity 应用使用 [@ton-connect/ui](https://www.npmjs.com/package/@tonconnect/ui)。
:::

TON Connect 2.0 的 Unity 资源。使用 `continuation-team/TonSdk.NET/tree/main/TonSDK.Connect`。

使用它将 TonConnect 协议与您的游戏集成。

* [GitHub](https://github.com/continuation-team/unity-ton-connect)

## 参阅

* [构建您的第一个 Web 客户端的分步指南](https://ton-community.github.io/tutorials/03-client/)
* [[YouTube] TON 智能合约 | 10 | Telegram DApp[EN]](https://www.youtube.com/watch?v=D6t3eZPdgAU&t=254s&ab_channel=AlefmanVladimir%5BEN%5D)
* [Ton Connect 入门](https://github.com/ton-connect/sdk/tree/main/packages/sdk)
* [集成手册](/develop/dapps/ton-connect/integration)
* [[YouTube] TON Dev 研究 TON Connect 协议 [RU]](https://www.youtube.com/playlist?list=PLyDBPwv9EPsCJ226xS5_dKmXXxWx1CKz_)