import Feedback from '@site/src/components/Feedback';

# JavaScript SDKとの統合マニュアル

:::danger
The page is outdated and will be deleted soon. Learn actual JS flow from [the guideline for web](/v3/guidelines/ton-connect/frameworks/web).
:::

このチュートリアルでは、TON Connect 2.0認証をサポートするサンプルWebアプリを作成します。これにより、当事者間で合意を確立することなく、署名検証を行い、不正なIDのなりすましの可能性を排除することができます。 It will allow for signature verification to eliminate the possibility of fraudulent identity impersonation without the need for agreement establishment between parties.

## ドキュメントリンク

1. [トンコネクト/sdkドキュメント](https://www.npmjs.com/package/@tonconnect/sdk)
2. [ウォレット・アプリケーション・メッセージ交換プロトコル](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [ウォレット側のTonkeeper実装](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## 前提条件

アプリとウォレット間の接続性を流暢にするために、ウェブアプリはウォレットアプリケーションからアクセス可能なマニフェストを使用する必要があります。これを実現するための前提条件は、通常、静的ファイルのホストです。たとえば、開発者が GitHub ページを利用したり、自分のコンピュータにホストされている TON サイトを使用してウェブサイトをデプロイしたい場合です。これは、彼らのウェブ・アプリケーション・サイトが一般にアクセス可能であることを意味します。 The prerequisite to accomplish this is typically a host for static files. For example, if a developer wants to make use of GitHub pages, or deploy their website using TON Sites hosted on their computer. This would mean their web app site is publicly accessible.

## ウォレットサポートリストの取得

TONブロックチェーンの全体的な普及を促進するためには、TONコネクト2.0が膨大な数のアプリケーションとウォレットの接続統合を促進できることが必要です。特に重要なのは、TONコネクト2.0の継続的な開発により、Tonkeeper、TonHub、MyTonWallet、その他のウォレットと様々なTONエコシステムのアプリとの接続が可能になったことです。最終的には、TONコネクトプロトコルを介して、アプリケーションとTON上に構築されたすべての種類のウォレット間のデータ交換を可能にすることが私たちの使命です。現時点では、TONエコシステム内で現在稼働している利用可能なウォレットの広範なリストをTONコネクトでロードできるようにすることで実現しています。 Of late and of significant importance, the ongoing development of TON Connect 2.0 has allowed for the connection of the Tonkeeper, TonHub, MyTonWallet and other wallets with various TON Ecosystem Apps. It is our mission to eventually allow for the exchange of data between applications and all wallet types built on TON via the TON Connect protocol. For now, this is achieved by enabling TON Connect to load an extensive list of available wallets currently operating within the TON Ecosystem.

現在、私たちのサンプルのウェブ・アプリでは、以下のことが可能です：

1. TON Connect SDK（統合を簡素化するためのライブラリ）をロード
2. コネクタを作成（現在はアプリケーション・マニフェストなし）
3. サポートされているウォレットのリストをロード (GitHubの[wallets.json](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)から)

学習のために、以下のコードで記述されたHTMLページを見てみましょう：

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

ブラウザでこのページを読み込んでコンソールを見ると、そのようなものが表示されることがあります：

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

TONコネクト2.0の仕様によると、ウォレットアプリの情報は常に以下のフォーマットを使用します：

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

## 各種ウォレットアプリのボタン表示

ボタンはウェブアプリケーションのデザインによって異なる場合があります。
現在のページでは次のような結果になっています：
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

以下の点にご注意ください：

1. ウェブページがウォレットアプリケーションを通して表示される場合、プロパティ `embedded` オプションを `true` に設定します。つまり、このログインオプションは最も一般的に使用されるため、強調表示することが重要です。 This means it is important to highlight this login option because it's most commonly used.
2. 特定のウォレットがJavaScriptのみを使用して構築され(`bridgeUrl`を持たない)、プロパティ`injected`(または安全のために`embedded`)を設定していない場合、それは明らかにアクセス不可能であり、ボタンは無効にされるべきです。

## アプリのマニフェストを使用しない接続

アプリマニフェストなしで接続が行われた場合、スクリプトは以下のように変更する必要があります：

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

### Tonkeeperでログイン

Tonkeeperにログインするためには、認証のために以下のリンクを作成します：

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

`r`パラメータをデコードすると、以下のようなJSON形式になります：

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

Upon clicking the mobile phone link, Tonkeeper automatically opens and then closes, dismissing the request. 携帯電話のリンクをクリックすると、Tonkeeper が自動的に開き、その後閉じてリクエストを拒否します。さらに、Web アプリのページコンソールに以下のエラーが表示されました：
`エラー：[TON_CONNECT_SDK_ERROR] null/tonconnect-manifest.json` を取得できません。

これは、アプリマニフェストがダウンロード可能でなければならないことを意図しています。

## アプリマニフェストの使用との接続

この時点から、ユーザーファイル（主に tonconnect-manifest.json）をどこかにホストする必要があります。この例では、別のウェブアプリケーションのマニフェストを使用します。しかし、これは本番環境では推奨されませんが、テスト目的であれば許可されます。 In this instance we’ll use the manifest from another web application. This however  is not recommended for production environments, but allowed for testing purposes.

次のコード・スニペット：

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

このバージョンと入れ替えなければならない：

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

上記の新しいバージョンでは、`window` に `connector` 変数を保存する機能が追加され、ブラウザのコンソールからアクセスできるようになった。さらに、`restoreConnection`が追加されたので、ユーザはウェブアプリケーションの各ページでログインする必要がなくなった。 Additionally, the `restoreConnection` so users don’t have to log in on each web application page.

### Tonkeeperでログイン

ウォレットからのリクエストを拒否すると、コンソールに`Error：[TON_CONNECT_SDK_ERROR] Wallet declined the request`と表示されます。

したがって、リンクが保存されていれば、ユーザーは同じログイン要求を受け入れることができます。つまり、ウェブアプリは、認証の拒否を最終的なものではないとして扱うことができ、正しく動作するはずです。 This means the web app should be able to handle the authentication decline as non-final so it works correctly.

その後、ログイン・リクエストは受け付けられ、ブラウザ・コンソールに次のように即座に反映されます：

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

上記の結果は、以下を考慮します：

1. **アカウント**：情報：アドレス（ワークチェーン+ハッシュ）、ネットワーク（メインネット/テストネット）、公開鍵抽出に使用されるウォレットstateInitが含まれます。
2. **デバイス**: 情報: 名前とウォレットアプリケーションのバージョン(名前は最初に要求されたものと同じであるべきですが、これは真正性を保証するために検証することができます)、プラットフォーム名とサポートされている機能リストが含まれています。
3. **プロバイダ**: http を含んでいます。これは、ウォレットと Web アプリケーション間のすべてのリクエストと応答をブリッジ経由で提供することを可能にします。

## ログアウトしてTonProofをリクエストする

Now we have logged into our Mini App, but... how does the backend know that it is the correct party? To verify this we must request the wallet ownership proof.

これは認証を使ってのみ完了するので、ログアウトしなければいけません。そこで、コンソールで以下のコードを実行します： Therefore, we run the following code in the console:

```js
connector.disconnect();
```

接続解除が完了すると、`Connection status: null`と表示されます。

TonProofを追加する前に、現在の実装が安全でないことを示すためにコードを変更してみましょう：

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

Now that the authentication of the user has been verified, let's proceed to writing the code.

## TonProofを使用した接続

TON ConnectのSDKドキュメントによると、第2引数は`connect()`メソッドを指し、このメソッドにはウォレットによってラップされ署名されるペイロードが含まれる。したがって、結果は新しい接続コードとなります： Therefore, the result is new connection code:

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

接続リンク：

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

r\\`パラメータの拡張と簡略化：

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

次に、URLアドレスのリンクがモバイル・デバイスに送信され、Tonkeeperで開きます。

このプロセスが完了すると、以下の財布固有の情報が受け取られます：

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

Let's verify the received signature. 受信した署名を検証しましょう。これを達成するために、署名検証は Python を使用します。なぜなら、バックエンドと簡単にやり取りできるからです。 このプロセスを実行するために必要なライブラリは、 `pytoniq` と `pynacl` です。 The libraries required to carry out this process are the `pytoniq` and the `pynacl`.

Next, it is necessary to retrieve the wallet's public key. To accomplish this, `tonapi.io` or similar services are not used because the end result cannot be reliably trusted. Instead, this is accomplished by parsing the `walletStateInit`.

また、`address`と`walletStateInit`が一致していることを確認することも重要です。でなければ、`stateInit`フィールドに自分のウォレットを、`address`フィールドに別のウォレットを指定することで、ペイロードが自分のウォレット鍵で署名されてしまう可能性があります。

The `StateInit` is made up of two reference types: one for code and one for data. In this context, the purpose is to retrieve the public key so the second reference (the data reference) is loaded. `StateInit`はコードとデータの2つの参照タイプから構成されます。このコンテキストでは、公開鍵を取得することが目的なので、2番目の参照（データ参照）がロードされます。その後、8バイトがスキップされ（4バイトは `seqno` フィールドに、4バイトは `subwallet_id` フィールドに使用されます。

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

上記のシーケンスコードが実装された後、どのパラメータが検証され、ウォレットキーを使って署名されるかをチェックするために、正しいドキュメントが参照されます：

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

> Whereby the:
>
> - `Address` はシーケンスとしてエンコードされたウォレットアドレス
>   - `workchain`: 32 ビット符号付き整数 ビッグエンディアン;
>   - `hash`：256ビットの符号なし整数ビッグエンディアン；
> - `AppDomain` は Length ++ EncodedDomainName
>   - `Length`は、Utf-8エンコードされたアプリのドメイン名の長さの32ビット値
>   - `EncodedDomainName` id `Length` バイトの utf-8 エンコードされたアプリのドメイン名
> - `Timestamp` は 64 ビットユニックス エポック時間
> - `Payload` は可変長のバイナリ文字列
> - `utf8_encode` は長さの接頭辞がないプレーンバイト文字列を生成

Let's reimplement this in Python.  The endianness of some of the integers above is not specified, so several examples must be considered. これをPythonで再実装してみましょう。  上記の整数のいくつかはエンディアンが指定されていないので、いくつかの例を考慮する必要があります。以下のTonkeeperの実装を参照してください：[ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

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

上記のパラメータを実装した後、攻撃者がユーザを偽装しようとし、有効な署名を提供しない場合、次のエラーが表示されます:

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## See also

- [Preparing Messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)
- [Sending Messages](/v3/guidelines/ton-connect/guidelines/sending-messages)

## 次のステップ

dAppを書くときは、以下も考慮する必要があります。

- 接続が正常に完了した後 (復元または新しい接続)、複数の `Connect` ボタンの代わりに `Disconnect` ボタンが表示されます。
- ユーザーが切断された後、 `切断` ボタンを再作成する必要があります
- ウォレットコードをチェックする必要があります
  - 新しいウォレットのバージョンでは、別の場所に公開鍵を配置し、問題を引き起こす可能性があります
  - 現在のユーザーはウォレットの代わりに別のタイプのコントラクトを使用してサインインすることができます。 ありがたいことに、これは予想される場所に公開鍵が含まれます Thankfully, this will contain the public key in the expected location

幸運を祈り、楽しくdAppを書く!

<Feedback />

