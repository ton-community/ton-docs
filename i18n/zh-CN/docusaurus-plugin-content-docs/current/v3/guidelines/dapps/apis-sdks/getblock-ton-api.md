import Feedback from '@site/src/components/Feedback';

# GetBlock 的 TON API

:::tip TON infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Provides various statistics of node activity in the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard that updates every 5 minutes.
  :::

本指南将介绍获取和使用 GetBlock 私有 RPC 端点访问 TON 区块链的基本步骤。

:::info
[GetBlock](https://getblock.io/)是一家 Web3 基础设施提供商，为客户与包括 TON 在内的各种区块链网络交互提供基于 HTTP 的 API 端点。
:::

## 如何访问 TON 区块链终端

要开始使用 GetBlock 端点，用户需要登录自己的账户，获取一个 TON 端点 URL，然后就可以开始使用了。更多详细指导，敬请关注。 Follow these instructions:

### 3. 生成您的端点URL

访问 GetBlock 网站，找到主页上的 "免费开始 "按钮。使用电子邮件地址或连接 MetaMask 钱包注册账户。 Sign up using your email address or by connecting your MetaMask wallet.

![GetBlock.io\_main\_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. 2.选择 TON 区块链

After signing in, go to the "My Endpoints" section. 选择所需的网络和 API 类型（JSON-RPC 或 JSON-RPC(v2)）。

![GetBlock\account\\_dashboard](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL

点击 “Get” 按钮生成 TON 区块链端点 URL。 GetBlock API 中的所有端点都遵循一致的结构：`https://go.getblock.io/[ACCESS TOKEN]/`。

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

用户可以灵活地生成多个端点、在令牌受损时滚动令牌或删除未使用的端点。

![GetBlock\_account\_endpoints](/img/docs/getblock-img/unnamed-3.png)

现在，您可以使用这些 URL 与 TON 区块链进行交互、查询数据、发送交易以及构建去中心化应用程序，而无需进行繁琐的基础设施设置和维护。

### 免费申请和用户限制

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### 共享节点

- 多个客户同时使用同一节点的初级机会；
- 速率限制增至 200 RPS；
- 非常适合个人使用，或与全面扩展的生产应用相比，交易量和资源需求较低的应用；
- 对于预算有限的个人开发者或小型团队来说，这是一个更经济实惠的选择。

共享节点为访问 TON 区块链基础设施提供了一个具有成本效益的解决方案，无需大量的前期投资或承诺。

当开发人员扩展其应用程序并需要更多资源时，他们可以轻松升级订阅计划，或在必要时过渡到专用节点。

### 专用节点

- 一个节点专门分配给一个客户；
  没有请求限制；
- No request limits;
- 打开对存档节点、各种服务器位置和自定义设置的访问；
- 保证为客户提供优质服务和支持。

这是针对开发人员和去中心化应用程序（dApp）的下一代解决方案，这些应用程序需要增强吞吐量、提高节点连接速度，并在扩展时保证资源。

## 如何使用 GetBlock 的 TON HTTP API

在本节中，我们将深入探讨 GetBlock 提供的 TON HTTP API 的实际用法。我们将通过实例来展示如何有效利用生成的端点进行区块链交互。 We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### 常见应用程序接口调用示例

让我们从一个简单的例子开始，使用 ‘/getAddressBalance’ 方法，使用 curl 命令检索特定地址的余额。

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \

--header 'Content-Type: application/json'
```

确保将 `ACCESS-TOKEN` 替换为 GetBlock 提供的实际访问令牌。

这将以 nanotons 为单位输出余额。

![getAddressBalance\_response\_on\_TON\_blockchain](/img/docs/getblock-img/unnamed-2.png)

查询 TON 区块链的其他一些可用方法：

| # | 方法   | Endpoint           | 说明                                                    |
| - | ---- | ------------------ | ----------------------------------------------------- |
| 1 | GET  | getAddressState    | 返回 TON 区块链上指定地址的当前状态（未初始化、激活或冻结）。                     |
| 2 | GET  | getMasterchainInfo | Fetches the state of the masterchain. |
| 3 | GET  | getTokenData       | 检索与指定 TON 帐户相关的 NFT 或 Jetton 的详细信息                    |
| 4 | GET  | packAddress        | 将 TON 地址从原始格式转换为人类可读格式                                |
| 5 | POST | sendBoc            | 将序列化的 BOC 文件和外部信息一起发送到区块链以供执行                         |

请参阅 GetBlock 的 [文档](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/)，以获取包含示例和附加方法列表的全面 API 参考。

### 部署智能合约

Developers can utilize the TON library to deploy and interact with contracts. 该库将初始化一个客户端，通过 GetBlock HTTP API 端点连接到网络。

![Image from TON Blueprint IDE](/img/docs/getblock-img/unnamed-6.png)

本教程将为希望有效利用 GetBlock API 和 TON 区块链的开发人员提供全面指导。 Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

欢迎通过 网站 了解更多信息，或通过即时聊天、Telegram或网站表格向 GetBlock 支持人员留言。

<Feedback />

