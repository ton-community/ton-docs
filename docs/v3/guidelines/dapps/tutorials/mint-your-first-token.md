import Feedback from '@site/src/components/Feedback';

# Mint your first jetton

Welcome, dev! It's great to have you here. 👋

You'll learn how to create your first token on TON using TON Minter.
To mint a token, we will use the [TON Minter](https://minter.ton.org/).

## 📖 What you'll learn

By the end of this tutorial, you'll be able to:

- deploy a token using TON Minter
- customize your token
- manage and use the token
- edit token parameters


## 📌 Prepare before you start
Before you start, make sure you have the following:

1. A [Tonhub](https://ton.app/wallets/tonhub-wallet) / [Tonkeeper](https://ton.app/wallets/tonkeeper) wallet or any other TON-compatible wallet.
At least 0.25 Toncoin in your wallet (plus extra for blockchain fees)

:::tip Starter tip
 ~0.5 TON should be enough for this tutorial.
:::
 

## 🚀 Let's get started!

Use your web browser to open the service [TON Minter](https://minter.ton.org/) / [TON Minter testnet](https://minter.ton.org/?testnet=true).

![image](/img/tutorials/jetton/jetton-main-page.png)

### Deploy a jetton using your browser

#### Connect wallet

Open [TON Minter](https://minter.ton.org/) or [TON Minter testnet](https://minter.ton.org/?testnet=true) in your web browser. Click "Connect Wallet" and link your Tonhub or another supported wallet.

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

**Scan the QR-code** in a [Mobile wallet (Tonhub e.g.)](https://ton.app/wallets/tonhub-wallet)

#### Fill in the blanks with relevant information

1. Name (usually 1-3 words).
2. Symbol (usually 3-5 uppercase characters).
3. Amount (for example, 1,000,000).
4. Description of the token (optional).

#### Token logo URL (optional)

![image](/img/tutorials/jetton/jetton-token-logo.png)

If you want your token to stand out, you’ll need to host an attractive logo online.

* https://bitcoincash-example.github.io/website/logo.png

:::info
 You can easily find out about the URL placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in the 'Where is this metadata stored' paragraph.

 * On-chain.
 * Off-chain IPFS.
 * Off-chain website.
:::

#### How to create your logo URL?

 1. Prepare a **256x256** PNG image of the token logo with a transparent background.
 2. Host it online using, for example, [GitHub Pages](https://pages.github.com/).
 3. [Create a new public repository](https://docs.github.com/en/get-started/quickstart/create-a-repo) with the name `website`.
 4. Upload your prepared image to git and enable `GitHub Pages`.
    1. [Add GitHub Pages to your repository](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
    2. [Upload your image and get a link](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
 5. If possible, purchase a custom domain for your project. Use any domain seller like [Google Domains](https://domains.google/) or [GoDaddy](https://www.godaddy.com/). Then, connect your custom domain to the repository in the previous step, you can follow the instructions [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
 6. If you have a custom domain, your image URL should be `https://bitcoincash.org/logo.png` instead of the `github.io` one. This prevents dependency on GitHub and gives you full control over hosting.


 ## 💸 Send jettons
On the right side of the screen, you can **send tokens** to multi-currency wallets such as [Tonkeeper](https://tonkeeper.com/) or [Tonhub](https://ton.app/wallets/tonhub-wallet).

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
 You also can **burn** your tokens to reduce their amount.
 
 ![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

 ### 📱 Send tokens from your phone using Tonkeeper

Prerequisites:

1. You must have Jettons in your wallet.
2. You need at least 0.1 Toncoin to cover transaction fees.

#### Step-by-step guide

Then, go to **your token**, set the **amount** to send, and enter the **recipient address.**

![image](/img/tutorials/jetton/jetton-send-tutorial.png)


 ## 📚 Using the token on the site

You can manage your token by entering its address in the **search bar** at the top of the TON Minter site.
 
:::info
 The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

 ![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::


 ## ✏️ Jetton (token) customization

With the [FunC](/v3/documentation/smart-contracts/func/overview) language, you can change a token's behavior in your favor.

To make any changes, start here:

* https://github.com/ton-blockchain/minter-contract

### Step-by-step guide for developers

 1. Ensure you have all dependencies from the [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) repository.
 2. Clone the [minter-contract repository](https://github.com/ton-blockchain/minter-contract) and rename the project. 
 3. To install, open a terminal at the root and run:

 ```bash npm2yarn
 npm install
 ```

 4. Edit the smart contract files. All contract files are in `contracts/*.fc`

 5. Build a project by using: 

 ```bash npm2yarn
 npm run build
 ```
 The result will describe the process of creating the necessary files and the search for smart contracts. 
 
 :::info
 Read the console, there are a lot of tips!
 :::
    
 6. You can test your changes using:

 ```bash npm2yarn
 npm run test
 ```

 7. Edit the **name** and other metadata of the token in `build/jetton-minter.deploy.ts` by changing the JettonParams object.

 ```js
// This is example data - Modify these parameters for your jetton!
// - Data is stored on-chain (except for the image data itself)
// - Owner should usually be the deploying wallet's address.
   
 const jettonParams = {
  owner: Address.parse("EQD4gS-Nj2Gjr2FYtg-s3fXUvjzKbzHGZ5_1Xe_V0-GCp0p2"),
  name: "MyJetton",
  symbol: "JET1",
  image: "https://www.linkpicture.com/q/download_183.png", // Image URL
  description: "My jetton",
};
 ```

 8. To deploy a token, use the following command:

 ```bash npm2yarn
 npm run deploy
 ```
 The result of running your project:

    ```js
    > @ton-defi.org/jetton-deployer-contracts@0.0.2 deploy
    > ts-node ./build/_deploy.ts

    =================================================================
    Deploy script running, let's find some contracts to deploy..

    * We are working with 'mainnet'

    * Config file '.env' found and will be used for deployment!
     - Wallet address used to deploy from is: YOUR-ADDRESS
     - Wallet balance is YOUR-BALANCE TON, which will be used for gas

    * Found root contract 'build/jetton-minter.deploy.ts - let's deploy it':
     - Based on your init code+data, your new contract address is: YOUR-ADDRESS
     - Let's deploy the contract on-chain.
     - Deploy transaction sent successfully
     - Block explorer link: https://tonwhales.com/explorer/address/YOUR-ADDRESS
     - Waiting up to 20 seconds to check if the contract was actually deployed.
     - SUCCESS! Contract deployed successfully to address: YOUR-ADDRESS
     - New contract balance is now YOUR-BALANCE TON, make sure it has enough to pay rent
     - Running a post deployment test:
    {
      name: 'MyJetton',
      description: 'My jetton',
      image: 'https://www.linkpicture.com/q/download_183.png',
      symbol: 'JET1'
    }
    ```


## What's next?

If you want to dive deeper, read this article by Tal Kol:  
* [How and why to shard your smart contract—studying the anatomy of TON Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

If you want to learn more about other token-minting solutions, read this article:
* [History of mass minting on TON](https://blog.ton.org/history-of-mass-minting-on-ton)


## References

 - Project: https://github.com/ton-blockchain/minter-contract
 - [Jetton processing](/v3/guidelines/dapps/asset-processing/jettons)

<Feedback />

