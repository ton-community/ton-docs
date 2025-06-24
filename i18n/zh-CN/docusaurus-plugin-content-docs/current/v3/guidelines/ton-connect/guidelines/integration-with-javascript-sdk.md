import Feedback from '@site/src/components/Feedback';

# 与 JavaScript SDK 的集成手册

:::danger
The page is outdated and will be deleted soon. Learn actual JS flow from [the guideline for web](/v3/guidelines/ton-connect/frameworks/web).
:::

在本教程中，我们将创建一个示例网页应用，支持 TON Connect 2.0 认证。这将允许进行签名验证，以消除在各方之间未建立协议时的身份冒用的可能性。 It will allow for signature verification to eliminate the possibility of fraudulent identity impersonation without the need for agreement establishment between parties.

## 文档链接

1. [@tonconnect/sdk 文档](https://www.npmjs.com/package/@tonconnect/sdk)
2. [钱包应用消息交换协议](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [Tonkeeper 钱包端实现](https://github.com/tonkeeper/wallet/tree/main/src/tonconnect)

## 必要条件

为了使应用和钱包之间的连接流畅，网页应用必须使用可通过钱包应用访问的 manifest。完成此项的必要条件通常是静态文件的主机。例如，假如开发者想利用 GitHub 页面，或使用托管在他们电脑上的 TON Sites 部署他们的网站。这将意味着他们的网页应用站点是公开可访问的。 The prerequisite to accomplish this is typically a host for static files. For example, if a developer wants to make use of GitHub pages, or deploy their website using TON Sites hosted on their computer. This would mean their web app site is publicly accessible.

## 获取钱包支持列表

为了提高 TON 区块链的整体采用率，TON Connect 2.0 需要能够促进大量应用和钱包连接集成。近期，TON Connect 2.0 的持续开发使得连接 Tonkeeper、TonHub、MyTonWallet 和其他钱包与各种 TON 生态系统应用成为可能。我们的使命是最终允许通过 TON Connect 协议在基于 TON 构建的所有钱包类型与应用之间交换数据。目前，这是通过为TON Connect提供加载当前在TON生态系统中运行的可用钱包的广泛列表的能力来实现的。 Of late and of significant importance, the ongoing development of TON Connect 2.0 has allowed for the connection of the Tonkeeper, TonHub, MyTonWallet and other wallets with various TON Ecosystem Apps. It is our mission to eventually allow for the exchange of data between applications and all wallet types built on TON via the TON Connect protocol. For now, this is achieved by enabling TON Connect to load an extensive list of available wallets currently operating within the TON Ecosystem.

目前我们的示例网页应用能够实现以下功能：

1. 加载 TON Connect SDK（旨在简化集成的库），
2. 创建一个连接器（当前没有应用 manifest），
3. 加载支持的钱包列表（来自 [GitHub 上的 wallets.json](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)）。

为了学习目的，让我们来看看以下代码描述的 HTML 页面：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>  <!-- (1) -->
  </head>
  <body>
    <script>
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();  // (2)
        const walletsList = await connector.getWallets();  // (3)
        
        console.log(walletsList);
      }
    </script>
  </body>
</html>
```

如果您在浏览器中加载此页面并查看控制台，可能会得到类似以下内容：

```bash
> Array [ {…}, {…} ]

0: Object { name: "Tonkeeper", imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png", aboutUrl: "https://tonkeeper.com", … }
  aboutUrl: "https://tonkeeper.com"
  bridgeUrl: "https://bridge.tonapi.io/bridge"
  deepLink: undefined
  embedded: false
  imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png"
  injected: false
  jsBridgeKey: "tonkeeper"
  name: "Tonkeeper"
  tondns: "tonkeeper.ton"
  universalLink: "https://app.tonkeeper.com/ton-connect"
```

根据 TON Connect 2.0 规范，钱包应用信息总是使用以下格式：

```js
{
    name: string;
    imageUrl: string;
    tondns?: string;
    aboutUrl: string;
    universalLink?: string;
    deepLink?: string;
    bridgeUrl?: string;
    jsBridgeKey?: string;
    injected?: boolean; // true if this wallet is injected to the webpage
    embedded?: boolean; // true if the DAppis opened inside this wallet's browser
}
```

## 不同钱包应用的按钮显示

按钮可能会根据您的网页应用设计而变化。
当前页面产生以下结果：
The current page produces the following result:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@tonconnect/sdk@latest/dist/tonconnect-sdk.min.js" defer></script>

    // highlight-start
    <style>
      body {
        width: 1000px;
        margin: 0 auto;
        font-family: Roboto, sans-serif;
      }
      .section {
        padding: 20px; margin: 20px;
        border: 2px #AEFF6A solid; border-radius: 8px;
      }
      #tonconnect-buttons>button {
        display: block;
        padding: 8px; margin-bottom: 8px;
        font-size: 18px; font-family: inherit;
      }
      .featured {
        font-weight: 800;
      }
    </style>
    // highlight-end
  </head>
  <body>
    // highlight-start
    <div class="section" id="tonconnect-buttons">
    </div>
    // highlight-end
    
    <script>
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();

        // highlight-start
        let buttonsContainer = $('#tonconnect-buttons');
        
        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          if (!wallet.bridgeUrl && !wallet.injected && !wallet.embedded) {
            // no `bridgeUrl` means this wallet app is injecting JS code
            // no `injected` and no `embedded` -> app is inaccessible on this page
            connectButton.disabled = true;
          }
          
          buttonsContainer.appendChild(connectButton);
        }
	// highlight-end
      };
    </script>
  </body>
</html>
```

请注意以下几点：

1. 如果网页通过钱包应用显示，它会将 `embedded` 选项设置为 `true`。这意味着标记这个登录选项很重要，因为它是最常使用的。 This means it is important to highlight this login option because it's most commonly used.
2. 如果一个特定的钱包只使用 JavaScript 构建（它没有 `bridgeUrl`），并且它没有设置 `injected` 属性（或 `embedded`，为了安全），那么它显然是不可访问的，按钮应该被禁用。

## 无应用 manifest 的连接

在没有应用 manifest 的情况下进行连接时，脚本应该如下更改：

```js
      const $ = document.querySelector.bind(document);
      
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
        
        let buttonsContainer = $('#tonconnect-buttons');

        for (let wallet of walletsList) {
          let connectButton = document.createElement('button');
          connectButton.innerText = 'Connect with ' + wallet.name;
          
          if (wallet.embedded) {
            // `embedded` means we are browsing the app from wallet application
            // we need to mark this sign-in option somehow
            connectButton.classList.add('featured');
          }
          
          // highlight-start
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }));
            };
          } else {
            // wallet app does not provide any auth method
            connectButton.disabled = true;
          }
	  // highlight-end
          
          buttonsContainer.appendChild(connectButton);
        }
      };
```

Now that the above process has been carried out, status changes are being logged (to see whether TON Connect works or not). Showing the modals with QR codes for connectivity is out of the scope of this manual. For testing purposes, it is possible to use a browser extension or send a connection request link to the user’s phone by any means necessary (for example, using Telegram).
Note: we haven't created an app manifest yet. At this time, the best approach is  to analyze the end result if this requirement is not fulfilled.

### 使用 Tonkeeper 登录

为了用 Tonkeeper 登录，创建了以下用于认证的链接（下面提供参考）：

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

当解码时，`r` 参数产生以下 JSON 格式：

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

Upon clicking the mobile phone link, Tonkeeper automatically opens and then closes, dismissing the request. 点击手机链接后，Tonkeeper 自动打开然后关闭，忽略请求。此外，在网页应用页面的控制台出现以下错误：
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`。

这意味着应用 manifest 必须可供下载。

## 使用应用清单连接

从现在开始，需要在某处托管用户文件（主要是tonconnect-manifest.json）。在这个例子中，我们将使用另一个Web应用程序的清单。然而，这不推荐用于生产环境，但允许用于测试目的。 In this instance we’ll use the manifest from another web application. This however  is not recommended for production environments, but allowed for testing purposes.

以下代码片段：

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect();
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
```

必须被这个版本替换：

```js
      window.onload = async () => {
        const connector = new TonConnectSDK.TonConnect({manifestUrl: 'https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json'});
        // highlight-next-line
        window.connector = connector;  // for experimenting in browser console
        
        const walletsList = await connector.getWallets();
        
        const unsubscribe = connector.onStatusChange(
          walletInfo => {
            console.log('Connection status:', walletInfo);
          }
        );
	// highlight-next-line
        connector.restoreConnection();
```

在上方的新版本中，添加了将 `connector` 变量存储在 `window` 中，使其在浏览器控制台中可以访问。此外，添加了 `restoreConnection`，这样用户就不必在每个Web应用程序页面都登录。 Additionally, the `restoreConnection` so users don’t have to log in on each web application page.

### 用Tonkeeper登录

如果我们拒绝钱包的请求，控制台显示的结果将是`Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`。

因此，如果保存了链接，用户能够接受相同的登录请求。这意味着Web应用程序应该能够将认证拒绝视为非最终状态，以确保其正确工作。 This means the web app should be able to handle the authentication decline as non-final so it works correctly.

之后，接受登录请求，浏览器控制台立即反映如下：

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

以上结果考虑了以下内容：

1. **账户**：包含地址（工作链+哈希）、网络（主网/测试网）以及用于提取公钥的walletStateInit的信息。
2. **设备**：包含请求时的名称和钱包应用程序版本（名称应该与最初请求的相同，但这可以进行验证以确保真实性），以及平台名称和支持功能列表。
3. **提供者**：包含http -- 这允许钱包与Web应用程序之间进行的所有请求与响应通过bridge进行服务。

## 登出并请求TonProof

Now we have logged into our Mini App, but... how does the backend know that it is the correct party? To verify this we must request the wallet ownership proof.

This can be completed only using authentication, so we must log out. Therefore, we run the following code in the console:

```js
connector.disconnect();
```

当断开连接过程完成时，将显示 `Connection status: null`。

在添加TonProof之前，让我们更改代码以表明当前实现是不安全的：

```js
let connHandler = connector.statusChangeSubscriptions[0];
connHandler({
  device: {
    appName: "Uber Singlesig Cold Wallet App",
    appVersion: "4.0.1",
    features: [],
    maxProtocolVersion: 3,
    platform: "ios"
  },
  account: {
    /* TON Foundation address */
    address: '0:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8',
    chain: '-239',
    walletStateInit: 'te6ccsEBAwEAoAAFcSoCATQBAgDe/wAg3SCCAUyXuiGCATOcurGfcbDtRNDTH9MfMdcL/+ME4KTyYIMI1xgg0x/TH9Mf+CMTu/Jj7UTQ0x/TH9P/0VEyuvKhUUS68qIE+QFUEFX5EPKj+ACTINdKltMH1AL7AOjRAaTIyx/LH8v/ye1UAFAAAAAAKamjF3LJ7WtipuLroUqTuQRi56Nnd3vrijj7FbnzOETSLOL/HqR30Q=='
  },
  provider: 'http'
});
```

The resulting lines of code in the console are almost identical to those displayed when the connection was initiated in the first place. Therefore, if the backend doesn't perform user authentication correctly as expected, a way to test if it is working correctly is required. To accomplish this, it is possible to act as the TON Foundation within the console, so the legitimacy of token balances and token ownership parameters can be tested. Naturally, the provided code doesn't change any variables in the connector, but the user is able to use the app as desired unless that connector is protected by the closure. Even if that is the case, it is not difficult to extract it using a debugger and coding breakpoints.

现在用户的认证已经得到验证，让我们继续写代码。

## 使用TonProof连接

根据TON Connect的SDK文档，第二个参数指的是`connect()`方法，其中包含将由钱包warp并签名的有效载荷。因此，结果是新的连接代码： Therefore, the result is new connection code:

```js
          if (wallet.embedded || wallet.injected) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              connector.connect({jsBridgeKey: wallet.jsBridgeKey},
                                {tonProof: 'doc-example-<BACKEND_AUTH_ID>'});
            };
          } else if (wallet.bridgeUrl) {
            connectButton.onclick = () => {
              connectButton.disabled = true;
              console.log('Connection link:', connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
              }, {tonProof: 'doc-example-<BACKEND_AUTH_ID>'}));
            };
```

连接链接：

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

展开并简化的`r`参数：

```js
{
  "manifestUrl":
    "https://ratingers.pythonanywhere.com/ratelance/tonconnect-manifest.json",
  "items": [
    {"name": "ton_addr"},
    {"name": "ton_proof", "payload": "doc-example-<BACKEND_AUTH_ID>"}
  ]
}
```

接下来，将url地址链接发送到移动设备并使用Tonkeeper打开。

完成此过程后，接收到以下特定于钱包的信息：

```js
{
  "device": {
    "platform": "android",
    "appName": "Tonkeeper",
    "appVersion": "2.8.0.261",
    "maxProtocolVersion": 2,
    "features": [
      "SendTransaction"
    ]
  },
  "provider": "http",
  "account": {
    "address": "0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad",
    "chain": "-239",
    "walletStateInit": "te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c="
  },
  "connectItems": {
    "tonProof": {
      "name": "ton_proof",
      "proof": {
        "timestamp": 1674392728,
        "domain": {
          "lengthBytes": 28,
          "value": "ratingers.pythonanywhere.com"
        },
        "signature": "trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ==",
        "payload": "doc-example-<BACKEND_AUTH_ID>"
      }
    }
  }
}
```

Let's verify the received signature. 让我们验证接收到的签名。为了完成这一点，签名验证使用Python，因为它可以轻松地与后端交互。要进行这个过程所需的库是`tonsdk`和`pynacl`。 The libraries required to carry out this process are the `pytoniq` and the `pynacl`.

Next, it is necessary to retrieve the wallet's public key. To accomplish this, `tonapi.io` or similar services are not used because the end result cannot be reliably trusted. Instead, this is accomplished by parsing the `walletStateInit`.

确保`address`和`walletStateInit`匹配也至关重要，否则，如果他们在`stateInit`字段中提供自己的钱包，并在`address`字段中提供另一个钱包，则可以用他们的钱包密钥签名有效载荷。

The `StateInit` is made up of two reference types: one for code and one for data. In this context, the purpose is to retrieve the public key so the second reference (the data reference) is loaded. Then 8 bytes are skipped (4 bytes are used for the `seqno` field and 4 for `subwallet_id` in all modern wallet contracts) and the next 32 bytes are loaded (256 bits) -- the public key.

```python
import nacl.signing
import pytoniq

import hashlib
import base64

received_state_init = 'te6cckECFgEAAwQAAgE0ARUBFP8A9KQT9LzyyAsCAgEgAxACAUgEBwLm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDQUGAHgB+gD0BDD4J28iMFAKoSG+8uBQghBwbHVngx6xcIAYUATLBSbPFlj6Ahn0AMtpF8sfUmDLPyDJgED7AAYAilAEgQEI9Fkw7UTQgQFA1yDIAc8W9ADJ7VQBcrCOI4IQZHN0coMesXCAGFAFywVQA88WI/oCE8tqyx/LP8mAQPsAkl8D4gIBIAgPAgEgCQ4CAVgKCwA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYAIBIAwNABmtznaiaEAga5Drhf/AABmvHfaiaEAQa5DrhY/AABG4yX7UTQ1wsfgAWb0kK29qJoQICga5D6AhhHDUCAhHpJN9KZEM5pA+n/mDeBKAG3gQFImHFZ8xhAT48oMI1xgg0x/TH9MfAvgju/Jk7UTQ0x/TH9P/9ATRUUO68qFRUbryogX5AVQQZPkQ8qP4ACSkyMsfUkDLH1Iwy/9SEPQAye1U+A8B0wchwACfbFGTINdKltMH1AL7AOgw4CHAAeMAIcAC4wABwAORMOMNA6TIyx8Syx/L/xESExQAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwIAcIEBCNcY+gDTP8hUIEeBAQj0UfKnghBub3RlcHSAGMjLBcsCUAbPFlAE+gIUy2oSyx/LP8lz+wACAGyBAQjXGPoA0z8wUiSBAQj0WfKnghBkc3RycHSAGMjLBcsCUAXPFlAD+gITy2rLHxLLP8lz+wAACvQAye1UAFEAAAAAKamjFyM60x2mt5eboNyOTE+5RGOe9Ee2rK1Qcb+0ZuiP9vb7QJRlz/c='
received_address = '0:b2a1ecf5545e076cd36ae516ea7ebdf32aea008caa2b84af9866becb208895ad'

state_init = pytoniq.Cell.one_from_boc(base64.b64decode(received_state_init))

address_hash_part = state_init.hash.hex()
assert received_address.endswith(address_hash_part)

public_key = state_init.refs[1].bits.tobytes()[8:][:32]

# bytearray(b'#:\xd3\x1d\xa6\xb7\x97\x9b\xa0\xdc\x8eLO\xb9Dc\x9e\xf4G\xb6\xac\xadPq\xbf\xb4f\xe8\x8f\xf6\xf6\xfb')

verify_key = nacl.signing.VerifyKey(bytes(public_key))
```

在实现了上述代码后，需要查阅正确的文档来检查使用钱包密钥验证和签名了哪些参数：

> ```
> message = utf8_encode("ton-proof-item-v2/") ++  
>           Address ++  
>           AppDomain ++  
>           Timestamp ++  
>           Payload
>
> signature = Ed25519Sign(
>   privkey,
>   sha256(0xffff ++ utf8_encode("ton-connect") ++ sha256(message))
> )
> ```

> 其中：
>
> - `Address` 表示钱包地址编码为序列：
>   - `workchain`：32位有符号整数大端序；
>   - `hash`：256位无符号整数大端序；
> - `AppDomain` 是  Length ++ EncodedDomainName
>   - `Length` 使用32位值表示utf-8编码的app域名长度（以字节为单位）
>   - `EncodedDomainName` 是 `Length` 字节的utf-8编码的域名
> - `Timestamp` 表示签名操作的64位 unix epoch 时间
> - `Payload` 表示可变长度的二进制字符串
> - `utf8_encode` 生成一个没有长度前缀的纯字节字符串。

Let's reimplement this in Python.  The endianness of some of the integers above is not specified, so several examples must be considered. 接下来用Python重实现这一部分。上述部分整数的端序没有详细说明，因此需要考虑几个示例。请参阅以下Tonkeeper实现，详细了解相关示例：： [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42)。

```python
received_timestamp = 1674392728
signature = 'trCkHit07NZUayjGLxJa6FoPnaGHkqPy2JyNjlUbxzcc3aGvsExCmHXi6XJGuoCu6M2RMXiLzIftEm6PAoy1BQ=='

message = (b'ton-proof-item-v2/'
         + 0 .to_bytes(4, 'big') + si.bytes_hash()
         + 28 .to_bytes(4, 'little') + b'ratingers.pythonanywhere.com'
         + received_timestamp.to_bytes(8, 'little')
         + b'doc-example-<BACKEND_AUTH_ID>')
# b'ton-proof-item-v2/\x00\x00\x00\x00\xb2\xa1\xec\xf5T^\x07l\xd3j\xe5\x16\xea~\xbd\xf3*\xea\x00\x8c\xaa+\x84\xaf\x98f\xbe\xcb \x88\x95\xad\x1c\x00\x00\x00ratingers.pythonanywhere.com\x984\xcdc\x00\x00\x00\x00doc-example-<BACKEND_AUTH_ID>'

signed = b'\xFF\xFF' + b'ton-connect' + hashlib.sha256(message).digest()
# b'\xff\xffton-connectK\x90\r\xae\xf6\xb0 \xaa\xa9\xbd\xd1\xaa\x96\x8b\x1fp\xa9e\xff\xdf\x81\x02\x98\xb0)E\t\xf6\xc0\xdc\xfdx'

verify_key.verify(hashlib.sha256(signed).digest(), base64.b64decode(signature))
# b'\x0eT\xd6\xb5\xd5\xe8HvH\x0b\x10\xdc\x8d\xfc\xd3#n\x93\xa8\xe9\xb9\x00\xaaH%\xb5O\xac:\xbd\xcaM'
```

在实现上述参数后，如果有攻击者试图冒充用户并且没有提供有效的签名，将会显示以下错误：`nacl.exceptions.BadSignatureError: Signature was forged or corrupt`。

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## See also

- [Preparing Messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)
- [Sending Messages](/v3/guidelines/ton-connect/guidelines/sending-messages)

## 下一步工作

在编写 dApp 时，还应考虑以下几点：

- 在成功完成连接后（无论是恢复连接还是新连接），应显示 "断开连接" 按钮，而不是多个 "连接 "按钮
- 用户断开连接后，"断开连接" 按钮需要重新创建
- 应检查钱包代码，因为
  - 更新的钱包版本可能会将公钥放在不同的位置，从而产生问题
  - 当前用户可以使用其他类型的合约而不是钱包来登录。值得庆幸的是，这将在预期位置包含公钥 Thankfully, this will contain the public key in the expected location

祝你好运，祝你编写 dApp 玩得开心！

<Feedback />

