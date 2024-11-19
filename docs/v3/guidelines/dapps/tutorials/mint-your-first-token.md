# Mint your first Jetton

Welcome, dev! It's great to have you here. 👋

In this article, we'll tell you about creating your first fungible token (Jetton) on TON.

To mint Jettons we will be using the [TON Minter](https://minter.ton.org/) browser service.

## 📖 What you'll learn

In this article, you'll learn how to:

- deploy a Jetton using your browser
- customize your token
- manage and use your token
- edit the token parameters


## 📌 Prepare before you start

1. First you need to have the [Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper) wallet or any other supported on the service.
2. You must have more than 0.25 Toncoin on your balance plus additional funds to cover the blockchain commission.

:::tip Starter tip
 ~0.5 TON should be enough for this tutorial.
:::
 

## 🚀 Let's get started!

Use your web browser to open the service [TON Minter](https://minter.ton.org/).

![image](/img/tutorials/jetton/jetton-main-page.png)

### Deploy a Jetton using your browser

#### Connect Wallet

Click the `Connect Wallet` button to connect your [Tonhub](https://ton.app/wallets/tonhub-wallet) wallet or another wallet from the ones below.

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

**Scan the QR-code** in a [Mobile wallet (Tonhub e.g.)](https://ton.app/wallets/tonhub-wallet)

#### Fill in the blanks with relevant information

1. Name (usually 1-3 words).
2. Symbol (usually 3-5 uppercase characters).
3. Amount (for example, 1,000,000).
4. Description of the token (optional).

#### Token logo URL (optional)

![image](/img/tutorials/jetton/jetton-token-logo.png)

If you want to have an attractive Jetton token, you need to host a beautiful logo somewhere. For example:

* https://bitcoincash-example.github.io/website/logo.png

:::info
 You can easily find out  about url placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in paragraph "Where is this metadata stored".

 * On-chain.
 * Off-chain IPFS.
 * Off-chain website.
:::

#### How to create your logo URL?

 1. Prepare a **256x256** PNG image of the token logo with a transparent background.
 2. Get a link to your logo. A good solution is [GitHub Pages](https://pages.github.com/). Let's use them.
 3. [Create a new public repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) with the name `website`.
 4. Upload your prepared image to git and enable `GitHub Pages`.
    1. [Add GitHub Pages to your repository](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
    2. [Upload your image and get a link](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
 5. If you have your own domain, then it would be good to use `.org` instead of `github.io`.
 

 ## 💸 Send Jettons
On the right side of the screen, you can **send tokens** to multi-currency wallets such as [Tonkeeper](https://tonkeeper.com/) or [Tonhub](https://ton.app/wallets/tonhub-wallet).

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
 You always also **burn** your Jettons to reduce their amount.
 
 ![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

 ### 📱 Send tokens from phone using Tonkeeper

Prerequisites:

1. You must already have tokens on your balance to send them.
2. There must be at least 0.1 Toncoin to pay transaction fees.

#### Step-by-step guide

Then, go to **your token**, set the **amount** to send, and enter the **recipient address.**

![image](/img/tutorials/jetton/jetton-send-tutorial.png)


 ## 📚 Using the token on the site

You can access the **search field** at the top of the site by entering the token's address to manage it as the owner.
 
:::info
 The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

 ![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::


 ## ✏️ Jetton (token) customization

With the [FunC](/v3/documentation/smart-contracts/func/overview) language you can change the behavior of the token in your favor.

To make any changes, begin here:

* https://github.com/ton-blockchain/minter-contract

### Step-by-step guide for developers

 1. Make sure you have all "Dependencies and Requirements" from the [Blueprint SDK](/v3/documentation/smart-contracts/getting-started/javascript) repo.
 2. Clone the [minter-contract repository](https://github.com/ton-blockchain/minter-contract) and rename the project. 
 3. To install you need to open a terminal at the root and run:

 ```bash
 npm install
 ```

 4. Edit the original smart contract files same way in the root terminal. All contract files are in `contracts/*.fc`

 5. Build a project by using: 

 ```bash
 npm blueprint build --all
 ```
 The build result will be describes the process of creating the necessary files, as well as the search for smart contracts. 
 
 :::info
 Read the console, there are a lot of tips!
 :::
    
 6. You can test your changes by using:

 ```bash
 npm blueprint test
 ```

 7. Edit the **name** and other metadata of the token in `scripts/.ts` by changing JettonParams object.

 ```js
// This is example data - Modify these params for your own jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
   
 const jettonParams = {
  name: "MyJetton",
  symbol: "JET1",
  image: "https://www.linkpicture.com/q/download_183.png", // Image url
  description: "My jetton",
};
 ```

 8. To deploy a token use the following command:

 ```bash
 npm blueprint deploy
 ```

## What's next?

If you want to go deeper, read this article by Tal Kol:  
* [How and why to shard your smart contract—studying the anatomy of TON Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)


## References

 - Project: https://github.com/ton-blockchain/minter-contract
 - By Slava ([Telegram @delovoyslava](https://t.me/delovoyslava), [delovoyhomie on GitHub](https://github.com/delovoyhomie))
 - [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons)
