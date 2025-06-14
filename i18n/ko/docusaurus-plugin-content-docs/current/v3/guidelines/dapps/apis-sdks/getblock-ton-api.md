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

![GetBlock.io\_main\_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. Select TON Blockchain

After signing in, go to the "My Endpoints" section. Choose TON from the "Protocols" dropdown menu and select the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![GetBlock\계정\\_대시보드](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL

Click the **Get** button to generate your TON Blockchain endpoint URL. The structure of the endpoint will be: `https://go.getblock.io/[ACCESS TOKEN]/`.

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

사용자는 여러 엔드포인트를 생성하고, 토큰이 유출된 경우 교체하거나, 사용하지 않는 엔드포인트를 삭제할 수 있는 유연성을 갖추고 있습니다.

![GetBlock\_계정\_끝점](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with TON Blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free requests and user limits

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### Shared nodes

- 여러 클라이언트가 동시에 동일한 노드를 사용하는 초기 진입 기회;
- 초당 요청 수(RPS)가 200으로 증가;
- 개인 사용 또는 완전한 생산 애플리케이션에 비해 낮은 거래량과 자원 요구 사항을 가진 애플리케이션에 적합;
- 제한된 예산을 가진 개인 개발자나 소규모 팀에게 더 경제적인 옵션.

Shared nodes provide a cost-effective solution for accessing TON Blockchain infrastructure without the need for significant upfront investment or commitment.

개발자가 애플리케이션을 확장하고 추가 자원을 필요로 할 경우, 구독 요금제를 쉽게 업그레이드하거나 필요에 따라 전용 노드로 전환할 수 있습니다.

### Dedicated nodes

- One node is exclusively allocated to a single client;
- No request limits;
- 아카이브 노드, 다양한 서버 위치 및 사용자 지정 설정에 대한 접근 허용;
- 프리미엄 수준의 서비스와 지원 보장;

이는 높은 처리량, 빠른 노드 연결 속도, 확장 시 보장된 자원을 필요로 하는 개발자 및 분산 애플리케이션(dApps)을 위한 차세대 솔루션입니다.

## GetBlock의 TON HTTP API 사용 방법

In this section, we delve into the practical usage of the TON HTTP API provided by GetBlock. We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### 일반적인 API 호출의 예

You can use the `/getAddressBalance` method to get the balance for a specific TON address:

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \    
--header 'Content-Type: application/json' 
```

`ACCESS-TOKEN`을 GetBlock에서 제공한 실제 액세스 토큰으로 교체하세요.

This will output the balance in nanotons.

![getAddressBalance_response_on_TON_Blockchain](/img/docs/getblock-img/unnamed-2.png)

TON 블록체인을 쿼리할 수 있는 다른 방법도 있습니다:

| # | 메서드  | 엔드포인트              | 설명                                                                                                                      |
| - | ---- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1 | GET  | getAddressState    | Returns the current state of a specified address (uninitialized, active, or frozen). |
| 2 | GET  | getMasterchainInfo | Fetches the state of the masterchain.                                                                   |
| 3 | GET  | getTokenData       | Retrieves details about an NFT or jetton associated with the address.                                   |
| 4 | GET  | packAddress        | Converts a TON address from raw format to human-readable format.                                        |
| 5 | POST | sendBoc            | Sends serialized BOC files with external messages for blockchain execution.                             |

For a comprehensive list of methods and detailed API documentation, please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/).

### Deploying smart contracts

Developers can utilize the TON library to deploy and interact with contracts. The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![TON 블루프린트 IDE 이미지](/img/docs/getblock-img/unnamed-6.png)

By following this guide, developers can easily access TON Blockchain using GetBlock's infrastructure. Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

Feel free to learn more at the website or drop a line to GetBlock’s support via live chat, Telegram, or a website form.

<Feedback />

