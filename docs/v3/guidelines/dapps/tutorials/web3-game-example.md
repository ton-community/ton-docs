# TON blockchain for games

## What’s in the tutorial
In this tutorial we will consider how to add the TON blockchain to a game. For our example, we will use a Flappy Bird clone written in Phaser and will add GameFi features step by step. In the tutorial we will use short code pieces and pseudocode to make it more readable. Also, we will provide links to real code blocks to help you understand better. The whole implementation can be found in the [demo repo](https://github.com/ton-community/flappy-bird).

![Flappy Bird game without GameFi features](/img/tutorials/gamefi-flappy/no-gamefi-yet.png)

We are going to implement the following:
- Achievements. Let’s reward our users with [SBTs](/v3/concepts/glossary#sbt). The achievement system is a great tool to increase user engagement.
- Game currency. In TON blockchain it’s easy to launch your own token (jetton). The token can be used to create an in-game economy. Our users will be able to earn the game coins to spend them later.
- Game shop. We will provide users with the possibility to purchase in-game items using either in-game currency or the TON coin itself.

## Preparations

### Install GameFi SDK
First, we will set up the game environment. To do that we need to install `assets-sdk`. The package is designed to prepare everything developers need to integrate the blockchain into games. The lib can be used either from CLI or from Node.js scripts. In this tutorial we stick with the CLI approach.
```sh
npm install -g @ton-community/assets-sdk@beta
```

### Create a master wallet
Next, we need to create a master wallet. The master wallet is a wallet we will use to mint the jetton, collections, NFTs, SBTs and receive payments.
```sh
assets-cli setup-env
```
You will be asked a few questions:

Field | Hint
:----- | :-----
Network | Select `testnet` as far it’s a test game.
Type | Select `highload-v2`type of wallet as far it’s the best, performant option to use as a master wallet.
Storage | The storage will be used to store `NFT`/`SB`T files. `Amazon S3` (centralized) or `Pinata` (decentralized).  For the tutorial let’s use `Pinata` as far as decentralized storage will be more illustrative for the Web3 game.
IPFS gateway | Service to load assets metadata from: `pinata`, `ipfs.io` or enter other service URL.

The script outputs the link you can open to see the created wallet state.

![New wallet in Nonexist status](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

As you can see the wallet is not actually created yet. To the wallet be really created we need to deposit some funds into it. In the real-world scenario, you can deposit the wallet any way you prefer using the wallet address. In our case we will use [Testgiver TON Bot](https://t.me/testgiver_ton_bot). Please open it to claim 5 test TON coins.

A bit later you could see 5 TON on the wallet and its status became `Uninit`. The wallet is ready. After the first usage it changes status to `Active`.

![Wallet status after top-up](/img/tutorials/gamefi-flappy/wallet-nonexist-status.png)

### Mint in-game currency
We are going to create in-game currency to reward users with it:
```sh
assets-cli deploy-jetton
```
You will be asked a few questions:

Field | Hint
:----- | :-----
Name | Token name, for example ` Flappy Jetton `.
Description | Token description, for instance: A vibrant digital token from the Flappy Bird universe.
Image | Download prepared [jetton logo](https://raw.githubusercontent.com/ton-community/flappy-bird/ca4b6335879312a9b94f0e89384b04cea91246b1/scripts/tokens/flap/image.png) and specify file path. Of course, you can use any image.
Symbol | `FLAP` or enter any abbreviation you want to use.
Decimals | How many zeros after the dot your currency will have. Let’ it be `0` in our case.

The script outputs the link you can open to see the created jetton state. It will have `Active` status. The wallet status will change the status from `Uninit` to `Active`.

![In-game currency / jetton](/img/tutorials/gamefi-flappy/jetton-active-status.png)

### Create collections for SBTs
Just for example, in the demo game we will reward users for the first and the fifth games. So, we will mint two collections to put SBTs into them when users achieve related conditions – play first and fifth time:
```sh
assets-cli deploy-nft-collection
```

Field | First game | Fifth game
:----- | :----- | :-----
Type | `sbt` | `sbt`
Name | Flappy First Flight | Flappy High Fiver
Description | Commemorating your inaugural journey in the Flappy Bird game! | Celebrate your persistent play with the Flappy High Fiver NFT!
Image | You can download [the image](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/first-time/image.png) here | You can download [the image](https://raw.githubusercontent.com/ton-community/flappy-bird/article-v1/scripts/tokens/five-times/image.png) here

We are fully prepared. So, let’s go to the logic implementation.

## Connecting wallet
Everything starts from a user connects his wallet. So, let’s add wallet connect integration. To work with the blockchain from the client side we need to install GameFi SDK for Phaser:
```sh
npm install --save @ton/phaser-sdk@beta
```
Now let’s setup GameFi SDK and create an instance of it:
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
> To learn more about initialization options please read the [library documentation](https://github.com/ton-org/game-engines-sdk).

> To learn what `tonconnect-manifest.json` is please check ton-connect [manifest description](/v3/guidelines/ton-connect/guidelines/creating-manifest).

Now we are ready to create a wallet connect button. Let’s create a UI scene in Phaser which will contain the connect button:
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

> Read how to create [connect button](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L82) and the [UI scene](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/connect-wallet-ui.ts#L45).

To watch when a user connects or disconnects his wallet let’s use the following piece of code:
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

> To learn about more complex scenarios please check out the full implementation of [wallet connect flow](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L16).

Read how [game UI managing](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/index.ts#L50) might be implemented.

Now we have the user wallet connected and we can move forward.

![Connect wallet button](/img/tutorials/gamefi-flappy/wallet-connect-button.png)
![Confirm wallet connection](/img/tutorials/gamefi-flappy/wallet-connect-confirmation.png)
![Wallet is connected](/img/tutorials/gamefi-flappy/wallet-connected.png)


## Implementing achievements & rewards
To implement achievements and reward system we need to prepare an endpoint which will be requested per user try.

### `/played` endpoint
We need to create an endpoint `/played ` which must do the following:
- receive a body with a user wallet address and Telegram initial data passed to Mini App during the app launch. The initial data needs to be parsed to extract authentication data and ensure a user sends the request only on its behalf.
- the endpoint must calculate and store the number of games a user played.
- the endpoint must check if it’s the first or fifth game for a user and if so, reward a user with related SBT.
- the endpoint must reward a user with 1 FLAP for each game.

> Read [/played endpoint](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L197) code.

### Request `/played` endpoint
Every time the bird hits a pipe or falls down the client code must call `/played` endpoint passing the correct body:
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

> Read [submitPlayer function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/game-scene.ts#L10) code.

Let’s play the first time and ensure we will be rewarded with a FLAP token and SBT. Click the Play button, fly through a pipe or two and then hit into a tube. Alright, everything works!

![Rewarded with token and SBT](/img/tutorials/gamefi-flappy/sbt-rewarded.png)

Play 4 more times to get the second SBT, then open your Wallet, TON Space. Here your collectibles are:

![Achievements as SBT in Wallet](/img/tutorials/gamefi-flappy/sbts-in-wallet.png)

## Implementing game shop
To have an in-game shop we need to have two components. The first is an endpoint that provides info about users purchases. The second is a global loop to watch user transactions and assign game properties to its owners.

### `/purchases` endpoint
The endpoint does the following:
- receive `auth` get param with Telegram Mini Apps initial data.
- the endpoint gets items a user purchased and responds with the items list.

> Read [/purchases](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L303) endpoint code.

### Purchases loop
To know when users make payments, we need to watch the master wallet transactions. Every transaction must contain a message `userId`:`itemId`. We will remember the last processed transaction, get only new ones, assign users properties they bought using `userId` and `itemId`, rewrite the last transaction hash. This will work in an infinite loop.

> Read [purchase loop](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/server/src/index.ts#L110) code.

### Client side for the shop

On the client side we have the Shop button.

![Enter shop button](/img/tutorials/gamefi-flappy/shop-enter-button.png)

When a user clicks the button, the shop scene is opened. The shop scene contains the list of items a user can buy. Each item has a price and a Buy button. When a user clicks the Buy button, the purchase is made.

Opening the Shop will trigger purchased items loading and updating it every 10 seconds:
```typescript
// inside of fetchPurchases function
await fetch('http://localhost:3000/purchases?auth=' + encodeURIComponent((window as any).Telegram.WebApp.initData))
// watch for purchases
setTimeout(() => { fetchPurchases() }, 10000)
```

> Read [showShop function](https://github.com/ton-community/flappy-bird/blob/article-v1/workspaces/client/src/ui.ts#L191) code.

Now we need to implement the purchase itself. To do that, we will create GameFi SDK instance first and then use `buyWithJetton` method:
```typescript
gameFi.buyWithJetton({
    amount: BigInt(price),
    forwardAmount: BigInt(1),
    forwardPayload: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + itemId
});
```

![Game prop to purchase](/img/tutorials/gamefi-flappy/purchase-item.png)
![Purchase confirmation](/img/tutorials/gamefi-flappy/purchase-confirmation.png)
![Property is ready to use](/img/tutorials/gamefi-flappy/purchase-done.png)

It's also possible to pay with the TON coin:
```typescript
import { toNano } from '@ton/phaser-sdk'

gameFi.buyWithTon({
    amount: toNano(0.5),
    comment: (window as any).Telegram.WebApp.initDataUnsafe.user.id + ':' + 1
});
```

## Afterword

That’s it for this tutorial! We considered the basic GameFi features, but the SDK delivers more functionality like transfers between players, utils to work NFTs and collections, etc. We will deliver even more features in the future.

To learn about all the GameFi features you can use read the docs of [ton-org/game-engines-sdk](https://github.com/ton-org/game-engines-sdk) and [@ton-community/assets-sdk](https://github.com/ton-community/assets-sdk).

So, let us know what you think in the [Discussions](https://github.com/ton-org/game-engines-sdk/discussions)!


The complete implementation is available in [flappy-bird](https://github.com/ton-community/flappy-bird) repo.
