import Feedback from '@site/src/components/Feedback';

# TON Blockchain for games

## 튜토리얼 내용

In this tutorial, we will explore how to integrate TON Blockchain into a game. As an example, we will use a Flappy Bird clone built with Phaser and gradually add GameFi features. To improve readability, we will use short code snippets and pseudocode. Additionally, we will provide links to real code blocks for better understanding. The complete implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

![GameFi 기능이 없는 Flappy Bird 게임](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

We will implement the following:

- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool for increasing user engagement.
- Game currency. On the TON blockchain, it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn game coins and spend them later.
- Game shop. We will allow users to purchase in-game items using either in-game currency or TON coins.

## 준비사항

### GameFi SDK 설치

First, we need to set up the game environment by installing `assets-sdk`. This package is designed to provide developers with everything required to integrate blockchain into games. The library can be used either from the CLI or within Node.js scripts. In this tutorial, we will use the CLI approach.

```sh
npm install -g @ton-community/assets-sdk@beta
```

### 마스터 지갑 생성

Next, we need to create a master wallet. This wallet will be used to mint jettons, collections, NFTs, and SBTs, as well as to receive payments.

```sh
assets-cli setup-env
```

You will be asked a few questions during the setup.

| 필드           | 힌트                                                                                                                                                                                                                                                                                                                    |
| :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Network      | Select `testnet` since this is a test game.                                                                                                                                                                                                                                                           |
| Type         | Select `highload-v2`wallet type, as it offers the best performance for use as a master wallet.                                                                                                                                                                                                        |
| Storage      | Storage is used to hold `NFT`/`SB`T files. You can choose between `Amazon S3` (centralized) or `Pinata` (decentralized).  For this tutorial, we'll use Pinata since decentralized storage is more illustrative for a Web3 game. |
| IPFS gateway | This service loads asset metadata from  `pinata`, \\`ipfs.io,  or a custom service URL.                                                                                                                                                                                              |

The script will output a link where you can view the created wallet's state.

![Nonexist 상태의 새 지갑](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see, the wallet has not actually been created yet. To finalize the creation, we need to deposit funds into it. In a real-world scenario, you can fund the wallet however you prefer using its address. In our case, we will use the [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Open it to claim 5 test TON coins.

A little later, you should see 5 TON in the wallet, and its status will change to Uninit. The wallet is now ready. After the first transaction, its status will change to Active.
![Wallet status after top-up](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### 게임 내 화폐 발행

We are going to create an in-game currency to reward users.

```sh
assets-cli deploy-jetton
```

You will be asked a few questions during the setup:

| 필드          | 힌트                                                                                                                                                                                                                                |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name        | 토큰 이름, 예: `Flappy Jetton`                                                                                                                                                                                         |
| Description | 토큰 설명, 예: A vibrant digital token from the Flappy Bird universe.                                                                                                                                  |
| Image       | 준비된 [jetton 로고](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png)를 다운로드하고 파일 경로를 지정하세요. 물론 다른 이미지를 사용할 수도 있습니다. |
| Symbol      | `FLAP` 또는 사용하고 싶은 약어를 입력하세요.                                                                                                                                                                                      |
| Decimals    | 화폐의 소수점 이하 자릿수입니다. 우리의 경우 `0`으로 하겠습니다.                                                                                                                                                            |

The script will output a link where you can view the created jetton's state. It will have an **Active** status. The wallet’s status will change from **Uninit** to **Active**.

![게임 내 화폐 / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### SBT를 위한 컬렉션 생성

For our demo game, we will reward users after their first and fifth games. To do this, we will mint two collections, where SBTs will be assigned when users meet the required conditions—playing for the first and fifth time:

```sh
assets-cli deploy-nft-collection
```

| 필드          | 첫 번째 게임                                                                                                                         | 다섯 번째 게임                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ |
| Type        | `sbt`                                                                                                                           | `sbt`                                                                                                                           |
| Name        | Flappy First Flight                                                                                                             | Flappy High Fiver                                                                                                               |
| Description | 당신의 첫 Flappy Bird 게임 여정을 기념합니다!                                                                                                 | 다섯 번째 플레이를 기념하는 Flappy High Fiver NFT입니다!                                                                                       |
| Image       | [이미지](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png)를 다운로드할 수 있습니다 | [이미지](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png)를 다운로드할 수 있습니다 |

Now that we are fully prepared, let's proceed to implementing the game logic.

## 지갑 연결하기

The process begins with the user connecting their wallet. Let's integrate wallet connectivity.

To interact with the blockchain from the client side, we need to install the GameFi SDK for Phaser:

```sh
npm install --save @ton/phaser-sdk@beta
```

Now, let's set up GameFi SDK and create an instance of it:

```typescript
import { GameFi } from '@ton/phaser-sdk'

const gameFi = await GameFi.create({
    network: 'testnet'
    connector: {
        // if tonconnect-manifest.json is placed in the root you can skip this option
        manifestUrl: '/assets/tonconnect-manifest.json',
        actionsConfiguration: {
            // address of your Telegram Mini App to return to after the wallet is connected
            // url you provided to BothFather during the app creation process
            // to read more please read https://github.com/ton-community/flappy-bird#telegram-bot--telegram-web-app
            twaReturnUrl: URL_YOU_ASSIGNED_TO_YOUR_APP
        },
        contentResolver: {
            // some NFT marketplaces don't support CORS, so we need to use a proxy
            // you are able to use any format of the URL, %URL% will be replaced with the actual URL
            urlProxy: `${YOUR_BACKEND_URL}/${PROXY_URL}?url=%URL%`
        },
        // where in-game purchases come to
        merchant: {
            // in-game jetton purchases (FLAP)
            // use address you got running `assets-cli deploy-jetton`
            jettonAddress: FLAP_ADDRESS,
            // in-game TON purchases
            // use master wallet address you got running `assets-cli setup-env`
            tonAddress: MASTER_WALLET_ADDRESS
        }
    },

})
```

> 초기화 옵션에 대해 자세히 알아보려면 [라이브러리 문서](https://github.com/ton-org/game-engines-sdk)를 읽어보세요.

> `tonconnect-manifest.json`이 무엇인지 알아보려면 ton-connect [매니페스트 설명](/v3/guidelines/ton-connect/guidelines/creating-manifest)을 확인하세요.

Next, we are ready to create a **Wallet Connect** button. Let’s create a UI scene in Phaser that will contain the **Connect** button:

```typescript
class UiScene extends Phaser.Scene {
    // receive gameFi instance via constructor
    private gameFi: GameFi;

    create() {
        this.button = this.gameFi.createConnectButton({
            scene: this,
            // you can calculate the position for the button in your UI scene
            x: 0,
            y: 0,
            button: {
                onError: (error) => {
                    console.error(error)
                }
                // other options, read the docs
            }
        })
    }
}
```

> [connect 버튼](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82)과 [UI 씬](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45)을 만드는 방법을 읽어보세요.

To monitor when a user connects or disconnects their wallet, use the following code snippet:

```typescript
function onWalletChange(wallet: Wallet | null) {
    if (wallet) {
        // wallet is ready to use
    } else {
        // wallet is disconnected
    }
}
const unsubscribe = gameFi.onWalletChange(onWalletChange)
```

> 더 복잡한 시나리오에 대해서는 [지갑 연결 흐름](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16)의 전체 구현을 확인하세요.

Read how [game UI managing](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50) can be implemented.

Now that we have the user's wallet connected, we can move forward.

![지갑 연결 버튼](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![지갑 연결 확인](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![지갑이 연결됨](/img/tutorials/gamefi-flappy/wallet-connected.png)

## 업적 & 보상 구현하기

To implement the achievements and reward system, we need to set up an endpoint that will be triggered each time a user plays.

### `/played` 엔드포인트

We need to create an endpoint `/played ` which does the following:

- receives a request body containing the user’s wallet address and Telegram initial data, which is passed to the Mini App during launch. The initial data must be parsed to extract authentication details and verify that the user is sending the request on their own behalf.
- tracks and stores the number of games a user has played.
- checks whether this is the user’s first or fifth game. If so, it rewards the user with the corresponding SBT.
- rewards the user with 1 FLAP for each game played.

> [/played 엔드포인트](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197) 코드를 읽어보세요.

### `/played` 엔드포인트 요청하기

Every time the bird hits a pipe or falls, the client code must call the `/played` endpoint, passing the correct request body:

```typescript
async function submitPlayed(endpoint: string, walletAddress: string) {
    return await (await fetch(endpoint + '/played', {
        body: JSON.stringify({
            tg_data: (window as any).Telegram.WebApp.initData,
            wallet: walletAddress
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })).json()
}

const playedInfo = await submitPlayed('http://localhost:3001', wallet.account.address);
```

> [submitPlayer 함수](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10) 코드를 읽어보세요.

Let’s play for the first time and ensure we receive a FLAP token and an SBT. Click the Play button, fly through a pipe or two, then crash into a pipe. Everything works!

![토큰과 SBT로 보상받음](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Play four more times to earn the second SBT, then open your TON Space Wallet. Here are your collectibles:
![Achievements as SBT in Wallet](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Implementing the game shop

To set up an in-game shop, we need two components. The first is an endpoint that provides information about users' purchases. The second is a global loop that monitors user transactions and assigns game properties to item owners.

### `/purchases` 엔드포인트

이 엔드포인트는 다음을 수행합니다:

- receive `auth` query parameter containing Telegram Mini App initial data.
- retrieves the items a user has purchased and responds with a list of those items.

> [/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303) 엔드포인트 코드를 읽어보세요.

### 구매 루프

o track user payments, we need to monitor transactions in the master wallet. Each transaction must include a message in the format `userId`:`itemId`. We will store the last processed transaction, retrieve only new ones, assign purchased properties to users based on `userId` and `itemId`, and update the last transaction hash. This process will run in an infinite loop.

> Read the [purchase loop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110) code.

### 상점의 클라이언트 사이드

On the client side, we have a **Shop** button.

![상점 입장 버튼](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks this button, the **Shop Scene** opens. The shop contains a list of items available for purchase. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is processed.

Opening the **Shop Scene** will trigger the loading of purchased items and refresh the list every 10 seconds.

```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> [showShop 함수](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191) 코드를 읽어보세요.

Now, we need to implement the purchase process. To do this, we will first create a GameFi SDK instance and then use the `buyWithJetton` method:

```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![구매할 게임 속성](/img/tutorials/gamefi-flappy/purchase-item.png)
![구매 확인](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![속성 사용 준비 완료](/img/tutorials/gamefi-flappy/purchase-done.png)

It is also possible to pay with TON coins:

```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Afterword

That’s it for this tutorial! We explored the basic GameFi features, but the SDK offers additional functionality, such as player-to-player transfers and utilities for working with NFTs and collections. More features will be introduced in the future.

To learn about all available GameFi features, read the documentation for [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) and [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

Let us know your thoughts in [Discussions](https://github.com/ton-org/game-engines-sdk/discussions)!

The complete implementation is available in the [flappy-bird](https://github.com/ton-community/flappy-bird) repository.

<Feedback />

