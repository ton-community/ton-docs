import Feedback from '@site/src/components/Feedback';

# HTTP API by GetBlock

:::tip TON infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Provides various statistics of node activity in the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard that updates every 5 minutes.
  :::

This guide covers essential steps in acquiring and using private RPC endpoints by GetBlock to access TON Blockchain.

:::info
[GetBlock](https://getblock.io/) is a Web3 infrastructure provider that offers HTTP-based API endpoints for clients to interact with multiple blockchain networks, including TON.
:::

## How to access TON Blockchain endpoints

To start using GetBlock’s endpoints, users need to log in to their accounts, and retrieve a TON endpoint URL. Follow these instructions:

### 1. Create a GetBlock account

Visit the GetBlock website and click on the "Get Started for Free" button. Sign up using your email address or by connecting your MetaMask wallet.

![GetBlock.io_main_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. Select TON Blockchain

After signing in, go to the "My Endpoints" section. Choose TON from the "Protocols" dropdown menu and select the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![GetBlock_account__dashboard](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL

Click the **Get** button to generate your TON Blockchain endpoint URL. The structure of the endpoint will be: `https://go.getblock.io/[ACCESS TOKEN]/`.

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

ユーザーには、複数のエンドポイントを生成したり、漏洩した場合にトークンをロールしたり、未使用のエンドポイントを削除したりする柔軟性があります。

![GetBlock_account__dashboard](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with TON Blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free requests and user limits

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### Shared nodes

- 同じノードを複数のクライアントが同時に利用するエントリーレベルの機会；
- レートの上限が200RPSに引き上げられました；
- フルスケールのプロダクション・アプリケーションに比べ、トランザクション量やリソース要件が少ないアプリケーションや個人での使用に適しています；
- 予算が限られている個人開発者や小規模チームにとって、より手頃なオプションです。

Shared nodes provide a cost-effective solution for accessing TON Blockchain infrastructure without the need for significant upfront investment or commitment.

開発者は、アプリケーションの規模が拡大し、追加のリソースが必要になった場合、サブスクリプションプランを簡単にアップグレードしたり、必要に応じて専用ノードに移行したりすることができます。

### Dedicated nodes

- One node is exclusively allocated to a single client;
- No request limits;
- アーカイブノード、様々なサーバーロケーション、カスタム設定へのアクセスを提供します；
- プレミアムレベルのサービスとサポートを顧客に保証します。

これは、スループットの向上、ノード接続の高速化、スケールに応じたリソースの保証を必要とする開発者や分散型アプリケーション（dApps）向けの次世代ソリューションです。

## GetBlock による TON HTTP API の使用方法

In this section, we delve into the practical usage of the TON HTTP API provided by GetBlock. We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### 一般的なAPIコールの例

You can use the `/getAddressBalance` method to get the balance for a specific TON address:

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \    
--header 'Content-Type: application/json' 
```

ACCESS-TOKEN\\`は、GetBlockが提供する実際のアクセストークンに置き換えてください。

これはナノトン単位でバランスを出力します。

![getAddressBalance_response_on_TON_Blockchain](/img/docs/getblock-img/unnamed-2.png)

TONブロックチェーンに問い合わせるために利用可能な他のメソッド：

| # | メソッド | エンドポイント            | 説明                                                                                                                      |
| - | ---- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1 | GET  | getAddressState    | Returns the current state of a specified address (uninitialized, active, or frozen). |
| 2 | GET  | getMasterchainInfo | Fetches the state of the masterchain.                                                                   |
| 3 | GET  | getTokenData       | Retrieves details about an NFT or jetton associated with the address.                                   |
| 4 | GET  | packAddress        | Converts a TON address from raw format to human-readable format.                                        |
| 5 | POST | sendBoc            | Sends serialized BOC files with external messages for blockchain execution.                             |

For a comprehensive list of methods and detailed API documentation, please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/).

### スマートコントラクトの導入

Developers can utilize the TON library to deploy and interact with contracts. The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![Image from TON Blueprint IDE](/img/docs/getblock-img/unnamed-6.png)

By following this guide, developers can easily access TON Blockchain using GetBlock's infrastructure. Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

Feel free to learn more at the website or drop a line to GetBlock’s support via live chat, Telegram, or a website form.

<Feedback />

