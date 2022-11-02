# Mint your first Jetton

Welcome, dev! It's great to have you here. 👋

In this article, we'll tell you about creating your first fungible token (jetton) to TON.

Mint will take place using the [jetton.live](https://www.jetton.live) browser service.

## 📖 What you'll learn

In this article, you'll learn how to:

- deploy a Jetton using your browser
- customize your token
- manage and use your token
- editing token parameters


## 📌 Prepare before you start

1. Need to have a wallet [TonHub](https://ton.app/wallets/tonhub-wallet) or [Chrome Extension](https://ton.app/wallets/chrome-plugin).
2. Have on your balance more than 0.25 TONCOIN + blockchain commission. 

:::tip Starter tip
 ~0.5 TONCOIN is definitely enough for this tutorial.
:::
 
## 🚀 Let's get started!

Use your web browser to open the service [jetton.live](https://www.jetton.live).

<img src="/img/tutorials/Jetton/jetton-main-page.png" alt="drawing"/>

### Deploy a Jetton using your browser

#### Connect Wallet

Click the `Connect Wallet` button to connect your wallet [TonHub](https://ton.app/wallets/tonhub-wallet) or [Chrome Extension](https://ton.app/wallets/chrome-plugin).

<img src="/img/tutorials/Jetton/jetton-connect-wallet.png" alt="drawing"/>

**Scan the QR-code** if the [TonHub](https://ton.app/wallets/tonhub-wallet) or **sign in** the wallet if it's a browser [Chrome Extension](https://ton.app/wallets/chrome-plugin).

#### Fill in the information in the fields

1. Name (usually 1-3 words).
2. Symbol (usually 3-5 uppercase characters).
3. Amount (for example: 1,000,000).
4. Description of the token (optional).
5. Token logo URL (optional).
6. Deploy your token (jetton) and complete the transaction on the wallet.


#### Token logo URL

If you want to have an attractive Jetton token, you need a beautiful logo hosted somewhere.  For example:

* https://bitcoincash-example.github.io/website/logo.png

#### How to create your logo URL?

 1. Prepare **256x256** PNG image of the token logo with transparent background.
 2. Get link to your logo. A good solution is [GitHub Pages](https://pages.github.com/). Let's use them.
 3. [Create a new public repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) with the name `website`.
 4. Upload your prepared image to git and enable `GitHub Pages`.
    1. [Add GitHub Pages to your repository](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
    2. [Upload your image and get link](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
 5. If you have your own domain then it would be good to use `.org` instead `github.io`.
 

 ## 💸 Send and receive Jettons
 On the right side of the screen, you see a connected wallet that can **receive tokens.**

 <img src="/img/tutorials/Jetton/jetton-receive-tokens.png" alt="drawing"/>

 Just below you can **send tokens** to multi-currency wallets like a [Tonkeeper](https://tonkeeper.com/) or [TonHub](https://ton.app/wallets/tonhub-wallet) and another.

 <img src="/img/tutorials/Jetton/jetton-send-tokens.png" alt="drawing"/>


:::info
 You always also **burn** your Jettons to reduce their number.
:::


 ### 📱 Send tokens from phone using a Tonkeeper

Prerequisites:

1. You must already have a token on your balance to send it
2. At least 0.1 TONCOIN to pay the sending fees

#### Step-by-step Guide

Then select the **your token**, the your **amount** to send, and the **recipient's address.**

<img src="/img/tutorials/Jetton/jetton-send-tutorial.png" alt="drawing"/>

 ## ✏️ Jetton (token) customization

With [FunC](https://www.tonspace.co/develop/func/overview) language you can change the behavior of the token in your favor.

To make any changes, start from here:

* https://github.com/ton-blockchain/minter-contract

### Step-by-Step Guide
 1. Check you have all "Dependencies and Requirements" from [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) repo.
 2. Clone [minter-contract repository](https://github.com/ton-blockchain/minter-contract) and rename project. 
 3. To install you need to open a terminal at the root and run.

 ```bash npm2yarn
 npm install
 ```

 4. Edit the original smart contract files in this way in root terminal. All contract files are in `contracts/*.fc`

 5. Build a project by using: 

 ```bash npm2yarn
 npm run build
 ```

 6. You can test your changes by using:

 ```bash npm2yarn
 npm run test
 ```

 7. Edit the **name** and other metadata of the token in `build/jetton-minter.deploy.ts` by changing JettonParams object:

 ```js
// This is example data - Modify these params for your own jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
   
 const jettonParams = {
  owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
  name: "MyJetton",
  symbol: "JET1",
  image: "https://www.linkpicture.com/q/download_183.png", // Image url
  description: "My jetton",
};
 ```

 8.1 To deploy a token use command:

 ```bash npm2yarn
 npm run deploy
 ```

 8.2 Result of step 8:

 ```bash npm2yarn
    PS C:\Users\NameUser\minter-contract-main> npm run deploy
    > @ton-defi.org/jetton-deployer-contracts@0.0.2 deploy
    > ts-node ./build/_deploy.ts
    =================================================================
    Deploy script running, let's find some contracts to deploy..
    * We are working with 'mainnet'
    * Config file '.env' found and will be used for deployment!
     - Wallet address used to deploy from is: YOUR-ADDRESS-WALLET
     - Wallet balance is YOUR-QUANTITY-TON, which will be used for gas
    * Found root contract 'build/jetton-minter.deploy.ts - let's deploy it':
    Require stack:
    - C:\Users\NameUser\minter-contract-main\build\jetton-minter.deploy.ts
    - C:\Users\NameUser\minter-contract-main\build\_deploy.ts
        at Function.Module._resolveFilename (node:internal/modules/cjs/loader:995:15)
        at Function.Module._resolveFilename.sharedData.moduleResolveFilenameHook.installedValue [as _resolveFilename] (C:\Users\slavi\Desktop\minter-contract-main\node_modules\@cspotcode\source-map-support\source-map-support.js:811:30)
        at Function.Module._load (node:internal/modules/cjs/loader:841:27)
        at Module.require (node:internal/modules/cjs/loader:1061:19)
        at require (node:internal/modules/cjs/helpers:103:18)
        at Object.<anonymous> (C:\Users\NameUser\minter-contract-main\build\jetton-minter.deploy.ts:3:54)
        at Module._compile (node:internal/modules/cjs/loader:1159:14)
        at Module.m._compile (C:\Users\NameUser\minter-contract-main\node_modules\ts-node\src\index.ts:1597:23)
        at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
      requireStack: [
        'C:\\Users\\NameUser\\minter-contract-main\\build\\jetton-minter.deploy.ts',
        'C:\\Users\\NameUser\\minter-contract-main\\build\\_deploy.ts'
      ]
    }
 ```

:::info
Don't forget that you need to have more than 0.25 TON + blockchain commission.
:::
 
## References

 - Project: https://github.com/ton-blockchain/minter-contract
 - By delovoyhomie ([Telegram @delovoyslava](https://t.me/delovoyslava), [delovoyhomie on GitHub](https://github.com/delovoyhomie))
