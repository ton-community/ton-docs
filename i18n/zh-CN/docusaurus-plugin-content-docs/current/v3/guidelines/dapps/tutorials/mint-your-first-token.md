import Feedback from '@site/src/components/Feedback';

# 铸造你的第一个 Jetton

欢迎，开发者！很高兴你能来到这里。👋 It's great to have you here. 👋

在这篇文章中，我们将告诉你如何在TON上创建你的第一个可替代代币（Jetton）。
为了铸造Jettons，我们将使用[TON Minter](https://minter.ton.org/)浏览器服务。

## 📖 你将学到什么

By the end of this tutorial, you'll be able to:

- deploy a token using TON Minter
- 自定义你的代币
- 管理和使用你的代币
- 编辑代币参数

## 📌 在开始之前准备

Before you start, make sure you have the following:

1. 点击`Connect Wallet`按钮连接你的[Tonhub](https://ton.app/wallets/tonhub-wallet)钱包或[Chrome扩展](https://ton.app/wallets/chrome-plugin)或以下的其他钱包。
  你的余额上必须有超过0.25 Toncoin + 覆盖区块链手续费的资金。

:::tip 新手提示
~0.5 TON 对这个教程来说绝对足够了。
:::

## 🚀 开始吧！

使用你的网络浏览器打开服务[TON Minter](https://minter.ton.org/)。

![image](/img/tutorials/jetton/jetton-main-page.png)

### 使用浏览器部署 Jetton

#### 连接钱包

Open [TON Minter](https://minter.ton.org/) or [TON Minter testnet](https://minter.ton.org/?testnet=true) in your web browser. Click "Connect Wallet" and link your Tonhub or another supported wallet.

#### ![image](/img/tutorials/jetton/jetton-connect-wallet.png)

在[移动钱包(Tonhub等)](https://ton.app/wallets/tonhub-wallet)**扫描二维码**或通过[Chrome扩展](https://ton.app/wallets/chrome-plugin)**登录**到钱包。

#### 填写相关信息

1. 名称（通常1-3个词）。
2. 符号（通常3-5个大写字符）。
3. 数量（例如，1,000,000）。
4. Description of the token (optional).

#### 代币标志URL（可选）

![image](/img/tutorials/jetton/jetton-token-logo.png)

If you want your token to stand out, you’ll need to host an attractive logo online.

- https://bitcoincash-example.github.io/website/logo.png

:::info
You can easily find out  about url placement of the logo in the [repository](https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices) in paragraph "Where is this metadata stored".

- 链上。
- 链下IPFS。
- 链下网站。
  :::

#### 如何创建你的标志URL？

1. 准备一个256x256像素的代币标志PNG图片，带有透明背景。
2. Host it online using, for example, [GitHub Pages](https://pages.github.com/).
3. [创建一个名为`website`的新公共代码库](https://docs.github.com/en/get-started/quickstart/create-a-repo)。
4. 上传你准备好的图片到git并启用`GitHub页面`。
  1. [为你的库添加GitHub页面](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
  2. [上传你的图片并获取链接](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。
5. If possible, purchase a custom domain for your project. Use any domain seller like [Google Domains](https://domains.google/) or [GoDaddy](https://www.godaddy.com/). Then, connect your custom domain to the repository in the previous step, you can follow the instructions [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
6. If you have a custom domain, your image URL should be `https://bitcoincash.org/logo.png` instead of the `github.io` one. This prevents dependency on GitHub and gives you full control over hosting.

## 💸 发送Jettons

在屏幕的右侧，你可以**发送代币**到多货币钱包，如[Tonkeeper](https://tonkeeper.com/)或[Tonhub](https://ton.app/wallets/tonhub-wallet)。

![image](/img/tutorials/jetton/jetton-send-tokens.png)

:::info
You always also **burn** your Jettons to reduce their amount.

![image](/img/tutorials/jetton/jetton-burn-tokens.png)
:::

### 📱 使用 Tonkeeper 从手机发送代币

必要条件：

1. You must have Jettons in your wallet.
2. 必须有至少0.1 Toncoin来支付交易费。

#### 分步指南

然后回到**你的代币**，设置要发送的**数量**，并输入**接收者地址**。

![image](/img/tutorials/jetton/jetton-send-tutorial.png)

## 📚 在网站上使用代币

You can manage your token by entering its address in the **search bar** at the top of the TON Minter site.

:::info
The address can be found on the right side if you are already in the owner panel, or you can find the token address when receiving an airdrop.

![image](/img/tutorials/jetton/jetton-wallet-address.png)
:::

## ✏️ Jetton（代币）定制

With the [FunC](/v3/documentation/smart-contracts/func/overview) language, you can change a token's behavior in your favor.

要进行任何更改，请从这里开始：

- https://github.com/ton-blockchain/minter-contract

### 开发者的分步指南

1. 确保你有[tonstarter-contracts](https://github.com/ton-defi-org/tonstarter-contracts)库中的所有"依赖和要求"。
2. 克隆[minter-contract库](https://github.com/ton-blockchain/minter-contract)并重命名该项目。
3. 要安装，你需要在根目录下打开一个终端并运行：

 ```bash npm2yarn
 npm install
 ```

4. Edit the smart contract files. 以同样的方式编辑原始智能合约文件，所有合约文件都在`contracts/*.fc`

5. 使用下面的命令构建项目：

 ```bash npm2yarn
 npm run build
 ```

构建结果将描述创建所需文件的过程，以及查找智能合约的过程。

阅读控制台，那里有很多提示！
:::

6. 你可以使用以下命令测试你的更改：

 ```bash npm2yarn
 npm run test
 ```

7. 通过更改`build/jetton-minter.deploy.ts`中的JettonParams对象，编辑**名称**和其它代币元数据。

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

8. 使用以下命令部署一个代币：

 ```bash npm2yarn
 npm run deploy
 ```

运行你的项目的结果：

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
     - Let's deploy the contract on-chain..
     - Deploy transaction sent successfully
     - Block explorer link: https://tonwhales.com/explorer/address/YOUR-ADDRESS
     - Waiting up to 20 seconds to check if the contract was actually deployed..
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

## 接下来

如果你想更深入地了解，请阅读Tal Kol的这篇文章：

- [如何以及为什么要分片你的智能合约——研究TON Jettons的解剖学](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)

If you want to learn more about other token-minting solutions, read this article:

- [History of mass minting on TON](https://blog.ton.org/history-of-mass-minting-on-ton)

## 参考资料

- 项目：https://github.com/ton-blockchain/minter-contract
- [ jetton 处理](/v3/guidelines/dapps/asset-processing/jettons)

<Feedback />

