# Mint your first Jetton

Welcome, dev! It's great to have you here. 👋

In this article, we'll tell you about creating your first fungible token (jetton) to TON.

Mint will take place using the [jetton.live](https://www.jetton.live) browser service.

## 📖 What you'll learn

In this article, you'll learn how to:

- deploy a Jetton using your browser.
- customize your token.
- manage and use your token.
- editing token parameters.


## 📌 Prepare before you start:

1. Need to have a wallet [TonHub](https://ton.app/wallets/tonhub-wallet) or [Chrome Extension](https://ton.app/wallets/chrome-plugin).
2. Have on your balance more than 0.25 TONCOIN + blockchain commission. 

Advice to point 2: Have more than 0.5 TONCOIN is definitely enough.

## 🚀 Let's get started!

Use your web browser to open the service [jetton.live](https://www.jetton.live).

<img src="/img/tutorials/Jetton/jetton-main-page.png" alt="drawing"/>

# Deploy a Jetton using your browser.

Click the `Connect Wallet` button to connect your wallet [TonHub](https://ton.app/wallets/tonhub-wallet) or [Chrome Extension](https://ton.app/wallets/chrome-plugin).

<img src="/img/tutorials/Jetton/jetton-connect-wallet.png" alt="drawing"/>

**Scan the QR-code** if the [TonHub](https://ton.app/wallets/tonhub-wallet) or **sign in** the wallet if it's a browser [Chrome Extension](https://ton.app/wallets/chrome-plugin).

**Fill in the information in the fields:**
1. Name (usually 1-3 words).
2. Symbol (usually 3-5 uppercase characters).
3. Amount (for example: 1,000,000).
4. Description of the token (optional).
5. Token logo URL (optional).

> **Token logo URL**   
 - For example: https://bitcoincash-example.github.io/website/logo.png
 1. Link of 256x256 pixel PNG image of the token logo with transparent background. 
    (A good solution is `GitHub Pages`)
 2. Create a new public repository with the name `website`. [INSTRUCTIONS](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch)
 3. Upload your prepared image to git and enable `GitHub Pages`. [instruction](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) and [instruction](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).
 - If you have your own domain then it would be good to use `.org` instead `github.io`.

 6. Deploy your token (jetton) and complete the transaction on the wallet.




 ## 💸 Send and receive tokens (jettons).
 On the right side of the screen, you see a connected wallet that can **receive tokens.**

 <img src="/img/tutorials/Jetton/jetton-receive-tokens.png" alt="drawing"/>

 Just below you can **send tokens** to multi-currency wallets like a [Tonkeeper](https://tonkeeper.com/) or [TonHub](https://ton.app/wallets/tonhub-wallet) and another.

 <img src="/img/tutorials/Jetton/jetton-send-tokens.png" alt="drawing"/>

 >  You can also `burn` them to reduce their number.

 # 📱Send tokens from phone using an example [Tonkeeper](https://tonkeeper.com/).

 You must **have a token** on your balance to send it + funds in **TONECOIN** to pay the commission.

Then select the **your token**, the your **amount** to send, and the **recipient's address.**

<img src="/img/tutorials/Jetton/jetton-send-tutorial.png" alt="drawing"/>

 ## ✏️ Token (jetton) customization.

 **Editing the token code.**

 With [FunC](https://ton.org/docs/#/func) language you can change the behavior of the token in your favor.

 >Developer message:    
 >This project is based on the [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) repo, consult it if you need more help.
 >
 >https://github.com/ton-blockchain/minter-contract

 **Guide:**
 1. Check you have all "Dependencies and Requirements" as described in [tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts) repo.
 2. Clone [git](https://github.com/ton-blockchain/minter-contract) and remane project. 
 3. Open a terminal at the root and type `npm install` and run.
 4. Edit the original smart contract files here `contracts/*.fc`.
 5. Create a project with `npm run build`. 
 6. You can start the project with `npm run test`.
 7. Edit the name and other meta data of the token with `jettonParams` in `build/jetton-minter.deploy.ts`.
 8. To deploy a token with `npm run deploy`.

 
## References

 - Project: https://github.com/ton-blockchain/minter-contract
 - By delovoyhomie ([Telegram @delovoyslava](https://t.me/delovoyslava), [delovoyhomie on GitHub](https://github.com/delovoyhomie))
