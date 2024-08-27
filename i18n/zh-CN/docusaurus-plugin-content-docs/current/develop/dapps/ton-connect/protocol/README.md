# 协议规范

了解 TON Connect 运行原理。

## 这一部分适用于谁？

- 如果你实现一个钱包
- 如果你开发一个 SDK
- 如果你想了解 TON Connect 如何工作

## 部分概述

- [协议工作流程](/develop/dapps/ton-connect/protocol/workflow) 是 TON Connect 涉及所有协议的概述。
- [桥接 API](/develop/dapps/ton-connect/protocol/bridge) 指定了数据如何在应用和钱包之间传输。
- [会话协议](/develop/dapps/ton-connect/protocol/session) 确保在桥接上进行端到端加密通信。
- [请求协议](/develop/dapps/ton-connect/protocol/requests-responses) 为应用和钱包定义了请求和响应。
- [钱包指南](/develop/dapps/ton-connect/protocol/wallet-guidelines) 为钱包开发者定义了指南。

## 常见问题解答

#### 我正在构建一个 HTML/JS 应用，我应该阅读什么？

只需使用 [支持的 SDKs](/develop/dapps/ton-connect/developers) 不必担心底层协议。

#### 我需要我最喜爱的语言的 SDK

请以 [JS SDK](/develop/dapps/ton-connect/developers) 为参考，并查看上述协议文档。

#### 如何检测应用是否嵌入在钱包中？

JS SDK 为开发者做了这件事; 只需获取钱包列表 `connector.getWallets()` 并检查相应列表项的 `embedded` 属性。如果你构建自己的 SDK，你应该检查 `window.[targetWalletJsBridgeKey].tonconnect.isWalletBrowser`。

#### 如何检测钱包是否为浏览器扩展？

如同嵌入式应用（见上文），JS SDK 通过相应的 `connector.getWallets()` 列表项的 `injected` 属性为你提供检测。如果你构建自己的 SDK，你应该检查 `window.[targetWalletJsBridgeKey].tonconnect` 是否存在。

#### 如何使用 tonconnect 实现后端授权？

[查看 dapp-backend 的例子](https://github.com/ton-connect/demo-dapp-backend)

#### 如何制作我自己的bridge？

除非你正在构建一个钱包，否则你不需要这样做。

如果你构建一个钱包，你需要提供一个bridge。请参见我们的 [Go 参考实现](https://github.com/ton-connect/bridge)。

请记住，钱包方面的bridge API 并非强制性的。

对于快速开始，你可以使用通用的 TON Connect bridge https://bridge.tonapi.io/bridge。

#### 我制作一个钱包，如何将它添加到钱包列表中？

提交一个拉请求至 [wallets-list](https://github.com/ton-blockchain/wallets-list) 库，并填写所有必要的元数据。

应用也可以通过 SDK 直接添加钱包。
