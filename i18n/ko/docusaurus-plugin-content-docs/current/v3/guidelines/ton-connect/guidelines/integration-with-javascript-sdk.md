import Feedback from '@site/src/components/Feedback';

# JavaScript SDK를 이용한 통합 매뉴얼

:::danger
The page is outdated and will be deleted soon. Learn actual JS flow from [the guideline for web](/v3/guidelines/ton-connect/frameworks/web).
:::

In this tutorial, we’ll create a sample web app that supports TON Connect 2.0 authentication. It will allow for signature verification to eliminate the possibility of fraudulent identity impersonation without the need for agreement establishment between parties.

## 문서 링크

1. [@tonconnect/sdk 문서](https://www.npmjs.com/package/@tonconnect/sdk)
2. [지갑-앱 메시지 교환 프로토콜](https://github.com/ton-connect/docs/blob/main/requests-responses.md)
3. [Tonkeeper의 지갑 측 구현](https://github.com/tonkeeper/wallet/tree/main/packages/mobile/src/tonconnect)

## 전제 조건

In order for connectivity to be fluent between apps and wallets, the web app must make use of manifest that is accessible via wallet applications. The prerequisite to accomplish this is typically a host for static files. For example, if a developer wants to make use of GitHub pages, or deploy their website using TON Sites hosted on their computer. This would mean their web app site is publicly accessible.

## 지갑 지원 목록 가져오기

To increase the overall adoption of TON Blockchain, it is necessary that TON Connect 2.0 is able to facilitate a vast number of application and wallet connectivity integrations. Of late and of significant importance, the ongoing development of TON Connect 2.0 has allowed for the connection of the Tonkeeper, TonHub, MyTonWallet and other wallets with various TON Ecosystem Apps. It is our mission to eventually allow for the exchange of data between applications and all wallet types built on TON via the TON Connect protocol. For now, this is achieved by enabling TON Connect to load an extensive list of available wallets currently operating within the TON Ecosystem.

현재 샘플 웹앱은 다음과 같은 기능을 제공합니다:

1. TON Connect SDK 로드 (통합 단순화를 위한 라이브러리)
2. 커넥터 생성 (현재는 앱 manifest 없이)
3. 지원되는 지갑 목록 로드 ([GitHub의 wallets.json](https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json)에서)

학습을 위해 다음 코드로 구현된 HTML 페이지를 살펴보겠습니다:

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

If you load this page in a browser and check the console, you may see something like this:

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

TON Connect 2.0 사양에 따라 지갑 앱 정보는 항상 다음과 같은 형식을 사용합니다:

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

## 다양한 지갑 앱을 위한 버튼 표시

버튼은 웹 애플리케이션 디자인에 따라 다양할 수 있습니다.
현재 페이지는 다음과 같은 결과를 보여줍니다:

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

다음 사항에 유의하세요:

1. 웹 페이지가 지갑 애플리케이션을 통해 표시되는 경우 `embedded` 옵션이 `true`로 설정됩니다. 가장 일반적으로 사용되는 로그인 옵션이므로 이를 강조하는 것이 중요합니다.
2. 특정 지갑이 JavaScript만으로 구축되었고(즉, `bridgeUrl`이 없음) `injected`나 `embedded` 속성이 설정되지 않은 경우, 분명히 접근할 수 없으므로 버튼을 비활성화해야 합니다.

## 앱 manifest 없이 연결

앱 manifest 없이 연결하는 경우 스크립트를 다음과 같이 변경해야 합니다:

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

이제 위 과정을 거치면 상태 변경이 로깅됩니다(TON Connect가 작동하는지 확인하기 위해). QR 코드가 있는 모달을 표시하는 것은 이 매뉴얼의 범위를 벗어납니다. 테스트를 위해서는 브라우저 확장을 사용하거나 필요한 방법으로(예: 텔레그램을 통해) 사용자의 휴대폰으로 연결 요청 링크를 보낼 수 있습니다.
참고: 아직 앱 manifest를 만들지 않았습니다. 이 시점에서는 이 요구사항이 충족되지 않을 때의 결과를 분석하는 것이 가장 좋은 접근 방식입니다.

### Tonkeeper로 로그인하기

Tonkeeper로 로그인하기 위해 다음과 같은 인증 링크가 생성됩니다(참조용으로 제공):

```
https://app.tonkeeper.com/ton-connect?v=2&id=3c12f5311be7e305094ffbf5c9b830e53a4579b40485137f29b0ca0c893c4f31&r=%7B%22manifestUrl%22%3A%22null%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
```

복호화하면 `r` 매개변수는 다음과 같은 JSON 형식을 나타냅니다:

```js
{"manifestUrl":"null/tonconnect-manifest.json","items":[{"name":"ton_addr"}]}
```

모바일폰 링크를 클릭하면 Tonkeeper가 자동으로 열린 다음 요청을 거부하며 닫힙니다. 또한 웹앱 페이지 콘솔에 다음과 같은 오류가 나타납니다:
`Error: [TON_CONNECT_SDK_ERROR] Can't get null/tonconnect-manifest.json`.

This indicates that the application manifest must be available for download.

## 앱 manifest를 사용한 연결

이제부터는 사용자 파일(주로 tonconnect-manifest.json)을 어딘가에 호스팅해야 합니다. 여기서는 다른 웹 애플리케이션의 manifest를 사용합니다. 이는 프로덕션 환경에서는 권장되지 않지만 테스트 목적으로는 허용됩니다.

다음 코드 스니펫:

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

다음 버전으로 대체되어야 합니다:

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

위의 새 버전에서는 브라우저 콘솔에서 접근할 수 있도록 `connector` 변수를 `window`에 저장했습니다. 또한 사용자가 웹 애플리케이션 페이지마다 로그인할 필요가 없도록 `restoreConnection`을 추가했습니다.

### Tonkeeper로 로그인하기

지갑에서 요청을 거부하면 콘솔에 다음과 같은 결과가 나타납니다: `Error: [TON_CONNECT_SDK_ERROR] Wallet declined the request`

따라서 링크가 저장되어 있으면 사용자가 동일한 로그인 요청을 수락할 수 있습니다. 이는 웹앱이 인증 거부를 최종 상태가 아닌 것으로 처리하여 올바르게 작동해야 함을 의미합니다.

이후 로그인 요청이 수락되면 브라우저 콘솔에 다음과 같이 즉시 반영됩니다:

```bash
22:40:13.887 Connection status:
Object { device: {…}, provider: "http", account: {…} }
  account: Object { address: "0:b2a1ec...", chain: "-239", walletStateInit: "te6cckECFgEAAwQAAgE0ARUBFP8A9..." }
  device: Object {platform: "android", appName: "Tonkeeper", appVersion: "2.8.0.261", …}
  provider: "http"
```

위 결과는 다음을 포함합니다:

1. **계정**: 주소(workchain+hash), 네트워크(mainnet/testnet), 공개 키 추출에 사용되는 지갑 stateInit
2. **기기**: 지갑 앱의 이름과 버전(요청한 것과 동일한지 확인하여 진위 여부 검증), 플랫폼 이름, 지원 기능 목록
3. **제공자**: http - 지갑과 웹앱 간의 모든 요청과 응답이 브릿지를 통해 처리됨을 의미

## 로그아웃 및 TonProof 요청

이제 미니앱에 로그인했지만... 백엔드는 어떻게 올바른 당사자인지 알 수 있을까요? 이를 확인하려면 지갑 소유권 증명을 요청해야 합니다.

이는 인증을 통해서만 가능하므로 먼저 로그아웃해야 합니다. 콘솔에서 다음 코드를 실행합니다:

```js
connector.disconnect();
```

연결 해제가 완료되면 `Connection status: null`이 표시됩니다.

TonProof를 추가하기 전에 현재 구현이 안전하지 않다는 것을 보여주기 위해 코드를 수정해보겠습니다:

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

콘솔의 결과 라인은 처음 연결이 시작될 때 표시된 것과 거의 동일합니다. 따라서 백엔드가 예상대로 사용자 인증을 수행하지 않는 경우 작동 여부를 테스트하는 방법이 필요합니다. 이를 위해 콘솔에서 TON Foundation처럼 행동하여 토큰 잔액과 토큰 소유권 매개변수의 정당성을 테스트할 수 있습니다. 물론 제공된 코드는 커넥터의 변수를 변경하지는 않지만, 클로저로 보호되지 않은 경우 사용자는 원하는 대로 앱을 사용할 수 있습니다. 그렇더라도 디버거와 코드 중단점을 사용하면 추출하기 어렵지 않습니다.

이제 사용자 인증이 확인되었으므로 코드 작성을 진행하겠습니다.

## TonProof를 사용한 연결

TON Connect의 SDK 문서에 따르면 `connect()` 메서드의 두 번째 인자는 지갑이 래핑하고 서명할 페이로드를 포함합니다. 따라서 새로운 연결 코드는 다음과 같습니다:

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

연결 링크:

```
https://app.tonkeeper.com/ton-connect?v=2&id=4b0a7e2af3b455e0f0bafe14dcdc93f1e9e73196ae2afaca4d9ba77e94484a44&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fratingers.pythonanywhere.com%2Fratelance%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%2C%7B%22name%22%3A%22ton_proof%22%2C%22payload%22%3A%22doc-example-%3CBACKEND_AUTH_ID%3E%22%7D%5D%7D
```

확장 및 단순화된 `r` 매개변수:

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

다음으로 url 주소 링크를 모바일 기기로 보내고 Tonkeeper로 열어야 합니다.

이 과정이 완료되면 다음과 같은 지갑별 정보를 받습니다:

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

받은 서명을 확인해보겠습니다. 이를 위해 백엔드와 쉽게 상호작용할 수 있는 Python을 사용하여 서명을 확인합니다. `pytoniq`와 `pynacl` 라이브러리가 필요합니다.

다음으로 지갑의 공개 키를 가져와야 합니다. 결과를 신뢰할 수 없으므로 `tonapi.io`나 유사한 서비스는 사용하지 않습니다. 대신 `walletStateInit`를 파싱하여 이를 수행합니다.

또한 `address`와 `walletStateInit`가 일치하는지 확인하는 것이 중요합니다. 그렇지 않으면 `stateInit` 필드에 자신의 지갑을 제공하고 `address` 필드에 다른 지갑을 제공하여 페이로드에 자신의 지갑 키로 서명할 수 있습니다.

`StateInit`는 코드용과 데이터용의 두 가지 참조 타입으로 구성됩니다. 여기서는 공개 키를 가져오는 것이 목적이므로 두 번째 참조(데이터 참조)를 로드합니다. 그런 다음 8바이트를 건너뛰고(4바이트는 모든 최신 지갑 계약의 `seqno` 필드용, 4바이트는 `subwallet_id`용) 다음 32바이트(256비트)를 로드합니다 - 이것이 공개 키입니다.

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

위의 시퀀싱 코드가 구현된 후, 지갑 키를 사용하여 확인 및 서명되는 매개변수를 확인하기 위해 올바른 문서를 참조합니다:

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

> 여기서:
>
> - `Address`는 다음 시퀀스로 인코딩된 지갑 주소를 나타냅니다:
>   - `workchain`: 32비트 부호있는 정수(빅 엔디안)
>   - `hash`: 256비트 부호없는 정수(빅 엔디안)
> - `AppDomain`은 Length ++ EncodedDomainName입니다
>   - `Length`는 utf-8로 인코딩된 앱 도메인 이름 길이를 바이트 단위로 나타내는 32비트 값 사용
>   - `EncodedDomainName`은 `Length`-바이트 utf-8로 인코딩된 앱 도메인 이름
> - `Timestamp`는 서명 작업의 64비트 유닉스 에포크 시간을 나타냅니다
> - `Payload`는 가변 길이 바이너리 문자열을 나타냅니다
> - `utf8_encode`는 길이 접두사가 없는 일반 바이트 문자열을 생성합니다

이를 Python으로 다시 구현해보겠습니다.  위의 일부 정수의 엔디안은 지정되지 않았으므로 여러 예시를 고려해야 합니다. 관련 예시가 포함된 다음 Tonkeeper 구현을 참조하세요: [ConnectReplyBuilder.ts](https://github.com/tonkeeper/wallet/blob/77992c08c663dceb63ca6a8e918a2150c75cca3a/src/tonconnect/ConnectReplyBuilder.ts#L42).

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

위의 매개변수를 구현한 후, 공격자가 사용자를 가장하고 유효한 서명을 제공하지 않으면 다음 오류가 표시됩니다:

```bash
nacl.exceptions.BadSignatureError: Signature was forged or corrupt.
```

## See also

- [Preparing Messages](/v3/guidelines/ton-connect/guidelines/preparing-messages)
- [Sending Messages](/v3/guidelines/ton-connect/guidelines/sending-messages)

## 다음 단계

dApp을 작성할 때는 다음 사항도 고려해야 합니다:

- 성공적인 연결이 완료된 후(복원된 연결이나 새 연결)에는 여러 `Connect` 버튼 대신 `Disconnect` 버튼이 표시되어야 합니다
- 사용자가 연결을 해제한 후에는 `Disconnect` 버튼을 다시 생성해야 합니다
- 지갑 코드를 확인해야 합니다. 이유는 다음과 같습니다:
  - 새로운 지갑 버전은 공개 키를 다른 위치에 배치하여 문제가 발생할 수 있습니다
  - 현재 사용자가 지갑 대신 다른 유형의 계약을 사용하여 로그인할 수 있습니다. 다행히도 이는 예상된 위치에 공개 키가 포함됩니다

dApp 작성에 행운을 빕니다!

<Feedback />

