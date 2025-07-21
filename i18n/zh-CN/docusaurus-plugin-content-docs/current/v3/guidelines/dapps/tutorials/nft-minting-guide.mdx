# 逐步创建 NFT 集合的教程

## 👋 引言

非同质化代币（NFT）已成为数字艺术和收藏品世界中最热门的话题之一。NFT是使用区块链技术验证所有权和真实性的独特数字资产。它们为创作者和收藏家提供了将数字艺术、音乐、视频和其他形式的数字内容货币化和交易的新可能性。近年来，NFT市场爆炸性增长，一些高调的销售额达到了数百万美元。在本文中，我们将逐步在TON上构建我们的NFT集合。

**这是你在本教程结束时将创建的鸭子集合的精美图片：**

![](/img/tutorials/nft/collection.png)

## 🦄 你将会学到什么

1. 你将在TON上铸造NFT集合
2. 你将理解TON上的NFT是如何工作的
3. 你将把NFT出售
4. 你将把元数据上传到[pinata.cloud](https://pinata.cloud)

## 💡 必要条件

你必须已经有一个测试网钱包，里面至少有2 TON。可以从[@testgiver_ton_bot](https://t.me/testgiver_ton_bot)获取测试网币。

:::info 如何打开我的Tonkeeper钱包的测试网版本？\
要在tonkeeper中打开测试网网络，请转到设置并点击位于底部的tonkeeper logo 5次，之后选择测试网而不是主网。
:::

我们将使用Pinata作为我们的IPFS存储系统，因此你还需要在[pinata.cloud](https://pinata.cloud)上创建一个帐户并获取api_key & api_secreat。官方Pinata [文档教程](https://docs.pinata.cloud/pinata-api/authentication)可以帮助完成这一点。只要你拿到这些api令牌，我就在这里等你！！！

## 💎 什么是 TON 上的 NFT?

在开始我们教程的主要部分之前，我们需要了解一下通常意义上TON中NFT是如何工作的。出乎意料的是，我们将从解释ETH中NFT的工作原理开始，为了理解TON中NFT实现的特殊性，与行业中常见的区块链相比。

### ETH 上的 NFT 实现

ETH中NFT的实现极其简单 - 存在1个主要的集合合约，它存储一个简单的哈希映射，该哈希映射反过来存储此集合中NFT的数据。所有与此集合相关的请求（如果任何用户想要转移NFT、将其出售等）都特别发送到此1个集合合约。

![](/img/tutorials/nft/eth-collection.png)

### 在 TON 中如此实现可能出现的问题

在TON的上下文中，此类实现的问题由[TON的NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)完美描述：

- 不可预测的燃料消耗。在TON中，字典操作的燃料消耗取决于确切的键集。此外，TON是一个异步区块链。这意味着，如果你向一个智能合约发送一个消息，那么你不知道有多少来自其他用户的消息会在你的消息之前到达智能合约。因此，你不知道当你的消息到达智能合约时字典的大小会是多少。这对于简单的钱包 -> NFT智能合约交互是可以的，但对于智能合约链，例如钱包 -> NFT智能合约 -> 拍卖 -> NFT智能合约，则不可接受。如果我们不能预测燃料消耗，那么可能会出现这样的情况：NFT智能合约上的所有者已经更改，但拍卖操作没有足够的Toncoin。不使用字典的智能合约可以提供确定性的燃料消耗。

- 不可扩展（成为瓶颈）。TON的扩展性基于分片的概念，即在负载下自动将网络划分为分片链。流行NFT的单个大智能合约与这一概念相矛盾。在这种情况下，许多交易将引用一个单一的智能合约。TON架构为分片的智能合约提供了设施（参见白皮书），但目前尚未实现。

*简而言之，ETH的解决方案不可扩展且不适用于像TON这样的异步区块链。*

### TON 上的 NFT 实现

在TON中，我们有1个主合约-我们集合的智能合约，它存储它的元数据和它所有者的地址，以及最重要的 - 如果我们想要创建（"铸造"）新的NFT项目 - 我们只需要向这个集合合约发送消息。而这个集合合约将为我们部署新NFT项目的合约，并提供我们提供的数据。

![](/img/tutorials/nft/ton-collection.png)

:::info
如果你想更深入地了解这个话题，可以查看[TON上的NFT处理](/develop/dapps/asset-processing/nfts)文章或阅读[NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)
:::

## ⚙ 设置开发环境

让我们从创建一个空项目开始：

1. 创建新文件夹
   `mkdir MintyTON`

```bash
mkdir MintyTON
```

2. 将以下配置复制到tsconfig.json中

```bash
cd MintyTON
```

3. 向package.json添加脚本以构建并启动我们的应用程序

```bash
yarn init -y
```

4. 安装所需的库

```bash
yarn add typescript @types/node -D
```

5. 创建`.env`文件并根据此模板添加你自己的数据

```bash
tsc --init
```

6. 将以下配置复制到tsconfig.json中

```json
{
    "compilerOptions": {
      "module": "commonjs",
      "target": "es6",
      "lib": ["ES2022"],
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist",
      "baseUrl": "src",
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "strict": true,
      "esModuleInterop": true,
      "strictPropertyInitialization": false
    },
    "include": ["src/**/*"]
}
```

7. 在 `package.json` 中添加脚本以构建和启动我们的应用程序

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. 安装所需的库

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. 创建`.env`文件并根据此模板添加你自己的数据

```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```

最后打开我们的钱包：

太好了！现在我们准备好开始为我们的项目编写代码了。

### 编写辅助函数

首先，让我们在 `src/utils.ts` 中创建函数 `openWallet`，它将通过助记符打开我们的钱包，并返回钱包的公钥/密钥。

最后，让我们创建`delay.ts`文件，在这个文件中，我们将创建一个函数来等待`seqno`增加。

```ts
import { KeyPair, mnemonicToPrivateKey } from "@ton/crypto";
import { beginCell, Cell, OpenedContract} from "@ton/core";
import { TonClient, WalletContractV4 } from "@ton/ton";

export type OpenedWallet = {
  contract: OpenedContract<WalletContractV4>;
  keyPair: KeyPair;
};

export async function openWallet(mnemonic: string[], testnet: boolean) {
  const keyPair = await mnemonicToPrivateKey(mnemonic);
```

创建一个类实例以与toncenter交互：

```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

元数据 - 只是一些简单的信息，将描述我们的NFT或集合。例如它的名称、它的描述等。

```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

很好，之后我们将创建项目的主入口点 - `src/app.ts`。
这里将使用刚刚创建的函数 `openWallet` 并调用我们的主函数 `init`。
现在就到此为止。

```ts
import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { readdir } from "fs/promises";

dotenv.config();

async function init() {
  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);  
}

void init();
```

最后，让我们在 `src` 目录中创建 `delay.ts` 文件，在该文件中，我们将创建一个函数来等待 `seqno` 的增加。

```ts
import { OpenedWallet } from "./utils";

export async function waitSeqno(seqno: number, wallet: OpenedWallet) {
  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(2000);
    const seqnoAfter = await wallet.contract.getSeqno();
    if (seqnoAfter == seqno + 1) break;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

:::info 什么是seqno?
简单来说，seqno就是由钱包发送的外部交易的计数器。
Seqno用于预防重放攻击。当交易发送到钱包智能合约时，它将交易的seqno字段与其存储中的字段进行比较。如果它们匹配，交易被接受并且存储的seqno增加一。如果它们不匹配，交易被丢弃。这就是为什么我们需要在每次发送外部交易后稍等一会儿。
:::

## 🖼 准备元数据

请注意，我们没有写"image"参数，稍后你会知道原因，请稍等！

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

### NFT 规范

TON 上的大多数产品都支持此类元数据规范，以存储有关 NFT 收集的信息：

| 名称                                | 解释                                          |
| --------------------------------- | ------------------------------------------- |
| name                              | 集合名称                                        |
| description                       | 集合描述                                        |
| image                             | 将显示为头像的图片链接。支持的链接格式：https、ipfs、TON Storage。 |
| cover_image  | 将显示为集合封面图片的图片链接。                            |
| social_links | 项目社交媒体配置文件的链接列表。使用不超过10个链接。                 |

![image](/img/tutorials/nft/collection-metadata.png)

之后，你可以根据需要创建尽可能多的NFT项目及其元数据文件。

```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```

现在让我们编写一些代码，将我们的元数据文件上传到IPFS。创建 `metadata.ts` 文件并添加所需的导入：

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

之后，我们需要创建一个函数，这个函数将把我们文件夹中的所有文件实际上传到IPFS：

| 名称                                | 解释                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| name                              | NFT名称。推荐长度：不超过15-30个字符                                                                                        |
| description                       | NFT描述。推荐长度：不超过500个字符                                                                                          |
| image                             | NFT图片链接。                                                                                                      |
| attributes                        | NFT属性。属性列表，其中指定了trait_type (属性名称)和value (属性的简短描述)。 |
| lottie                            | Lottie动画的json文件链接。如果指定，在NFT页面将播放来自此链接的Lottie动画。                                                               |
| content_url  | 额外内容的链接。                                                                                                      |
| content_type | 通过content_url链接添加的内容的类型。例如，视频/mp4文件。                                                     |

太棒了！让我们回到之前的问题：为什么我们在元数据文件中留下了“image”字段为空？想象一下你想在你的集合中创建1000个NFT，并且你必须手动遍历每个项目并手动插入图片链接。
这真的很不方便，所以让我们编写一个函数来自动完成这个操作！

```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

这里我们首先读取指定文件夹中的所有文件：

### 上传元数据

遍历每个文件并获取其内容

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。

```ts
export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}
```

太棒了！让我们回到之前的问题：为什么我们在元数据文件中留下了“image”字段为空？想象一下你想在你的集合中创建1000个NFT，并且你必须手动遍历每个项目并手动插入图片链接。
这真的很不方便，所以让我们编写一个函数来自动完成这个操作！

```ts
export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  await Promise.all(files.map(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  }));
}
```

这里我们首先读取指定文件夹中的所有文件：

```ts
const files = readdirSync(metadataFolderPath);
```

遍历每个文件并获取其内容

```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。

我们如何将链接到智能合约中存储的元数据文件？这个问题可以通过[Token Data 标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)得到完全回答。在某些情况下，仅仅提供所需的标志并以ASCII字符提供链接是不够的，这就是为什么我们考虑使用蛇形格式将我们的链接分成几个部分的选项。

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function uploadFolderToIPFS(folderPath: string): Promise<string> {
  const pinata = new pinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_API_SECRET,
  });

  const response = await pinata.pinFromFS(folderPath);
  return response.IpfsHash;
}

export async function updateMetadataFiles(metadataFolderPath: string, imagesIpfsHash: string): Promise<void> {
  const files = readdirSync(metadataFolderPath);

  files.forEach(async (filename, index) => {
    const filePath = path.join(metadataFolderPath, filename)
    const file = await readFile(filePath);
    
    const metadata = JSON.parse(file.toString());
    metadata.image =
      index != files.length - 1
        ? `ipfs://${imagesIpfsHash}/${index}.jpg`
        : `ipfs://${imagesIpfsHash}/logo.jpg`;
    
    await writeFile(filePath, JSON.stringify(metadata));
  });
}
```

太好了，让我们在我们的 app.ts 文件中调用这些方法。
添加我们函数的导入：

```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

保存元数据/图片文件夹路径变量并调用我们的函数上传元数据。

```ts
async function init() {
  const metadataFolderPath = "./data/metadata/";
  const imagesFolderPath = "./data/images/";

  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), true);

  console.log("Started uploading images to IPFS...");
  const imagesIpfsHash = await uploadFolderToIPFS(imagesFolderPath);
  console.log(
    `Successfully uploaded the pictures to ipfs: https://gateway.pinata.cloud/ipfs/${imagesIpfsHash}`
  );

  console.log("Started uploading metadata files to IPFS...");
  await updateMetadataFiles(metadataFolderPath, imagesIpfsHash);
  const metadataIpfsHash = await uploadFolderToIPFS(metadataFolderPath);
  console.log(
    `Successfully uploaded the metadata to ipfs: https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
  );
}
```

之后你可以运行 `yarn start` 并查看部署的元数据链接！

### 🚢 部署 NFT 集合

当我们的元数据已经准备好并且已经上传到IPFS时，我们可以开始部署我们的集合了！

我们将在 `/contracts/NftCollection.ts` 文件中创建一个文件，该文件将存储与我们的集合相关的所有逻辑。我们将从导入开始：

```ts
function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.subarray(0, chunkSize));
    buff = buff.subarray(chunkSize);
  }
  return chunks;
}
```

并声明一个类型，它将描述我们集合所需的初始化数据：

```ts
function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127);

  if (chunks.length === 0) {
    return beginCell().endCell();
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell();
  }

  let curCell = beginCell();

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];

    curCell.storeBuffer(chunk);

    if (i - 1 >= 0) {
      const nextCell = beginCell();
      nextCell.storeRef(curCell);
      curCell = nextCell;
    }
  }

  return curCell.endCell();
}
```

最后，我们需要创建一个函数，使用这些函数将离线内容编码为cell：

```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 部署 NFT 集合

在这段代码中，我们只是从集合智能合约的base64表示中读取cell。

剩下的只有我们集合初始化数据的cell了。

```ts
import {
  Address,
  Cell,
  internal,
  beginCell,
  contractAddress,
  StateInit,
  SendMode,
} from "@ton/core";
import { encodeOffChainContent, OpenedWallet } from "../utils";
```

并声明一个类型，它将描述我们集合所需的初始化数据：

```ts
export type collectionData = {
  ownerAddress: Address;
  royaltyPercent: number;
  royaltyAddress: Address;
  nextItemIndex: number;
  collectionContentUrl: string;
  commonContentUrl: string;
}
```

| 名称                   | 解释                             |
| -------------------- | ------------------------------ |
| ownerAddress         | 将被设置为我们集合的所有者的地址。只有所有者能够铸造新NFT |
| royaltyPercent       | 每次销售金额的百分比，将转到指定地址             |
| royaltyAddress       | 将从这个NFT集合的销售中接收版税的钱包地址         |
| nextItemIndex        | 下一个NFT项目应该有的索引                 |
| collectionContentUrl | 集合元数据的URL                      |
| commonContentUrl     | NFT项目元数据的基础URL                 |

之后，我们只是创建NFT项目的代码cell，这些项目将在我们的收藏中被创建，并在dataCell中存储对这个cell的引用。

```ts
export class NftCollection {
  private collectionData: collectionData;

  constructor(collectionData: collectionData) {
    this.collectionData = collectionData;
  }

  private createCodeCell(): Cell {
    const NftCollectionCodeBoc =
      "te6cckECFAEAAh8AART/APSkE/S88sgLAQIBYgkCAgEgBAMAJbyC32omh9IGmf6mpqGC3oahgsQCASAIBQIBIAcGAC209H2omh9IGmf6mpqGAovgngCOAD4AsAAvtdr9qJofSBpn+pqahg2IOhph+mH/SAYQAEO4tdMe1E0PpA0z/U1NQwECRfBNDUMdQw0HHIywcBzxbMyYAgLNDwoCASAMCwA9Ra8ARwIfAFd4AYyMsFWM8WUAT6AhPLaxLMzMlx+wCAIBIA4NABs+QB0yMsCEsoHy//J0IAAtAHIyz/4KM8WyXAgyMsBE/QA9ADLAMmAE59EGOASK3wAOhpgYC42Eit8H0gGADpj+mf9qJofSBpn+pqahhBCDSenKgpQF1HFBuvgoDoQQhUZYBWuEAIZGWCqALnixJ9AQpltQnlj+WfgOeLZMAgfYBwGyi544L5cMiS4ADxgRLgAXGBEuAB8YEYGYHgAkExIREAA8jhXU1DAQNEEwyFAFzxYTyz/MzMzJ7VTgXwSED/LwACwyNAH6QDBBRMhQBc8WE8s/zMzMye1UAKY1cAPUMI43gED0lm+lII4pBqQggQD6vpPywY/egQGTIaBTJbvy9AL6ANQwIlRLMPAGI7qTAqQC3gSSbCHis+YwMlBEQxPIUAXPFhPLP8zMzMntVABgNQLTP1MTu/LhklMTugH6ANQwKBA0WfAGjhIBpENDyFAFzxYTyz/MzMzJ7VSSXwXiN0CayQ==";
    return Cell.fromBase64(NftCollectionCodeBoc);
  }
}
```

版税参数通过royaltyFactor、royaltyBase、royaltyAddress在智能合约中存储。版税百分比可以用公式`(royaltyFactor / royaltyBase) * 100%`计算。因此，如果我们知道royaltyPercent，获取royaltyFactor就不是问题。

好了，现在只剩下含有我们的集合的初始数据的 cell 了。
基本上，我们只需要以正确的方式存储 collectionData 中的数据。首先，我们需要创建一个空 cell ，并在其中存储集合所有者地址和下一个要生成的项目的索引。让我们编写下一个私有方法：

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

之后，我们创建一个空 cell 来存储我们的集合内容，然后将 ref 保存到包含集合编码内容的 cell 中。然后将 ref 保存到主数据 cell 中的 contentCell。

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

之后，我们只需创建 NFT 项目代码的 cell （将在我们的集合中创建），并将该 cell 的引用存储在 dataCell 中。

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

智能合约中存储的版税参数包括 royaltyFactor、royaltyBase 和 royaltyAddress。版税百分比可以用公式 `(royaltyFactor / royaltyBase) * 100%` 计算。因此，如果我们知道 royaltyPercent，那么获取 royaltyFactor 就不成问题了。

```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

计算完成后，我们需要在单独的 cell 中存储版税数据，并在 dataCell 中提供该 cell 的引用。

```ts
const royaltyCell = beginCell();
royaltyCell.storeUint(royaltyFactor, 16);
royaltyCell.storeUint(royaltyBase, 16);
royaltyCell.storeAddress(data.royaltyAddress);
dataCell.storeRef(royaltyCell);

return dataCell.endCell();
}
```

当所有者铸造新的NFT时，集合接受所有者的消息并向创建的NFT智能合约发送新消息（这需要支付费用），所以让我们编写一个方法，该方法将根据铸造的nfts数量来补充集合的余额：

```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

完美，现在让我们在`app.ts`中添加几行，部署新的收藏：

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

现在只剩下编写将智能合约部署到区块链上的方法了！

```ts
public async deploy(wallet: OpenedWallet) {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });
    return seqno;
  }
```

意外地，但现在我们需要回到`NftCollection.ts`。并在文件顶部的`collectionData`附近添加此类型。

当所有者铸币一个新的 NFT 时，集合会接受所有者的信息，并向创建的 NFT 智能合约发送一个新信息（这需要支付一定的费用），所以我们来写一个方法，根据铸币的 NFT 数量来补充集合的余额：

```ts
public async topUpBalance(
    wallet: OpenedWallet,
    nftAmount: number
  ): Promise<number> {
    const feeAmount = 0.026 // approximate value of fees for 1 transaction in our case 
    const seqno = await wallet.contract.getSeqno();
    const amount = nftAmount * feeAmount;

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: amount.toString(),
          to: this.address.toString({ bounceable: false }),
          body: new Cell(),
        }),
      ],
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    });

    return seqno;
  }
```

并在NftCollection类中创建一个方法，该方法将构建部署我们NFT项目的主体。首先存储一个位，该位将指示给集合智能合约我们想要创建新的NFT。之后只存储此NFT项目的queryId和索引。

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

随后创建一个空cell并在其中存储这个NFT的所有者地址：

```ts
console.log("Start deploy of nft collection...");
const collectionData = {
  ownerAddress: wallet.contract.address,
  royaltyPercent: 0.05, // 0.05 = 5%
  royaltyAddress: wallet.contract.address,
  nextItemIndex: 0,
  collectionContentUrl: `ipfs://${metadataIpfsHash}/collection.json`,
  commonContentUrl: `ipfs://${metadataIpfsHash}/`,
};
const collection = new NftCollection(collectionData);
let seqno = await collection.deploy(wallet);
console.log(`Collection deployed: ${collection.address}`);
await waitSeqno(seqno, wallet);
```

## 🚢 部署 NFT 项目

当我们的集合准备就绪时，我们就可以开始铸造我们的 NFT 了！我们将在 `src/contracts/NftItem.ts` 中存储代码

在我们的主体cell中存储对带有项目内容的cell的引用：

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```

| 名称               | 说明                                                          |
| ---------------- | ----------------------------------------------------------- |
| itemOwnerAddress | 将被设置为物品所有者的地址                                               |
| itemIndex        | NFT 项目索引                                                    |
| amount           | 将发送到 NFT 的 TON 位数量，并进行部署                                    |
| commonContentUrl | 项目 URL 的完整链接可显示为集合的 "commonContentUrl" + 此 commonContentUrl |

然后在 NftCollection 类中创建方法，该方法将构建部署 NFT 项目的主体。首先存储位，向集合智能合约表明我们要创建新的 NFT。然后，只需存储此 NFT 项目的 queryId 和索引。

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

从创建客户端变量开始，它将帮助我们调用集合的get方法。

```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

然后我们将调用集合的get方法，该方法将返回此集合中具有该索引的NFT的地址

```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

... 并解析这个地址！

```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```

现在，让我们在`app.ts`中添加一些代码，以自动化每个NFT的铸造过程。首先读取包含我们元数据的文件夹中的所有文件：

```ts
import { internal, SendMode, Address, beginCell, Cell, toNano } from "@ton/core";
import { OpenedWallet } from "utils";
import { NftCollection, mintParams } from "./NftCollection";
import { TonClient } from "@ton/ton";

export class NftItem {
  private collection: NftCollection;

  constructor(collection: NftCollection) {
    this.collection = collection;
  }

  public async deploy(
    wallet: OpenedWallet,
    params: mintParams
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: this.collection.address,
          body: this.collection.createMintBody(params),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
}
```

其次，为我们的收藏充值：

最后，我们将编写简短方法，该方法将通过其索引获取NFT的地址。

```ts
static async getAddressByIndex(
  collectionAddress: Address,
  itemIndex: number
): Promise<Address> {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

然后，我们将调用集合的 get-method，该方法将返回该集合中 NFT 的地址，其索引为

```ts
  const response = await client.runMethod(
    collectionAddress,
    "get_nft_address_by_index",
    [{ type: "int", value: BigInt(itemIndex) }]
  );
```

为了将nft出售，我们需要两个智能合约。

```ts
    return response.stack.readAddress();
}
```

现在，让我们在 `app.ts` 中添加一些代码，以自动执行每个 NFT 的造币过程：

```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

首先读取文件夹中带有元数据的所有文件：

```ts
const files = await readdir(metadataFolderPath);
files.pop();
let index = 0;
```

其次，为我们的收藏充值：

```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```

最后，通过元数据检查每个文件，创建 `NftItem` 实例并调用部署方法。之后，我们需要等待一段时间，直到 seqno 增加：

```ts
for (const file of files) {
    console.log(`Start deploy of ${index + 1} NFT`);
    const mintParams = {
      queryId: 0,
      itemOwnerAddress: wallet.contract.address,
      itemIndex: index,
      amount: toNano("0.05"),
      commonContentUrl: file,
    };

    const nftItem = new NftItem(collection);
    seqno = await nftItem.deploy(wallet, mintParams);
    console.log(`Successfully deployed ${index + 1} NFT`);
    await waitSeqno(seqno, wallet);
    index++;
  }
```

## 🏷 出售 NFT

为了出售 nft，我们需要两个智能合约。

- 市场，只负责创建新销售的逻辑
- 销售合约，负责购买/取消销售的逻辑关系

### 部署市场

首先让我们声明新类型，该类型将描述我们销售智能合约的数据：

```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
} from "@ton/core";
import { OpenedWallet } from "../utils";

export class NftMarketplace {
  public ownerAddress: Address;

  constructor(ownerAddress: Address) {
    this.ownerAddress = ownerAddress;
  }


  public get stateInit(): StateInit {
    const code = this.createCodeCell();
    const data = this.createDataCell();

    return { code, data };
  }

  private createDataCell(): Cell {
    const dataCell = beginCell();

    dataCell.storeAddress(this.ownerAddress);

    return dataCell.endCell();
  }

  private createCodeCell(): Cell {
    const NftMarketplaceCodeBoc = "te6cckEBBAEAbQABFP8A9KQT9LzyyAsBAgEgAgMAqtIyIccAkVvg0NMDAXGwkVvg+kDtRND6QDASxwXy4ZEB0x8BwAGOK/oAMAHU1DAh+QBwyMoHy//J0Hd0gBjIywXLAljPFlAE+gITy2vMzMlx+wCRW+IABPIwjvfM5w==";
    return Cell.fromBase64(NftMarketplaceCodeBoc)
  }
}
```

现在让我们创建类，并创建一个基本方法，用于为我们的智能合约创建初始化数据cell。

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

之后，我们需要创建一个方法，用于部署我们的市场：

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const seqno = await wallet.contract.getSeqno();
    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.5",
          to: this.address,
          init: this.stateInit,
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

正如您所看到的，这段代码与部署其他智能合约（nft-item 智能合约、部署新的集合）并无不同。唯一不同的是，你可以看到我们最初补充市场的数量不是 0.05  TON ，而是 0.5  TON 。这是什么原因呢？  当部署新的智能销售合约时，市场会接受请求、处理请求并向新合约发送信息（是的，这种情况与 NFT 集合的情况类似）。这就是为什么我们需要一点额外的语气来支付费用。

像往常一样添加方法，获取stateInit，初始化代码cell和我们智能合约的地址。

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

只剩下创建我们将发送到我们市场的消息以部署销售合约，并实际发送此消息

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### 部署销售合约

创建一个带有消息主体的cell。首先我们需要设置操作码为1（以指示市场，我们想要部署新的销售智能合约）。之后我们需要存储将发送到我们新销售智能合约的币值。最后我们需要存储对新智能合约的stateInit和将发送到这个新智能合约的主体的2个引用。

在 `/contracts/NftSale.ts` 中创建新文件。首先，让我们声明新类型，它将描述我们的销售智能合约的数据：

```ts
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  internal,
  SendMode,
  StateInit,
  storeStateInit,
  toNano,
} from "@ton/core";
import { OpenedWallet } from "utils";

export type GetGemsSaleData = {
  isComplete: boolean;
  createdAt: number;
  marketplaceAddress: Address;
  nftAddress: Address;
  nftOwnerAddress: Address | null;
  fullPrice: bigint;
  marketplaceFeeAddress: Address;
  marketplaceFee: bigint;
  royaltyAddress: Address;
  royaltyAmount: bigint;
};
```

现在，让我们创建类和基本方法，为智能合约创建初始数据 cell 。

```ts
export class NftSale {
  private data: GetGemsSaleData;

  constructor(data: GetGemsSaleData) {
    this.data = data;
  }
}
```

现在让我们创建类，并创建一个基本方法，用于为我们的智能合约创建初始化数据cell。

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

转到`NftItem.ts`，并在NftItem类中创建一个新的静态方法，用于创建此类消息的主体：

```ts
  const dataCell = beginCell();

  dataCell.storeUint(saleData.isComplete ? 1 : 0, 1);
  dataCell.storeUint(saleData.createdAt, 32);
  dataCell.storeAddress(saleData.marketplaceAddress);
  dataCell.storeAddress(saleData.nftAddress);
  dataCell.storeAddress(saleData.nftOwnerAddress);
  dataCell.storeCoins(saleData.fullPrice);
  dataCell.storeRef(feesCell.endCell());

  return dataCell.endCell();
}
```

一如既往，添加方法来获取智能合约的 stateInit、init 代码 cell 和地址。

```ts
public get address(): Address {
  return contractAddress(0, this.stateInit);
}

public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}

private createCodeCell(): Cell {
  const NftFixPriceSaleV2CodeBoc =
    "te6cckECDAEAAikAART/APSkE/S88sgLAQIBIAMCAATyMAIBSAUEAFGgOFnaiaGmAaY/9IH0gfSB9AGoYaH0gfQB9IH0AGEEIIySsKAVgAKrAQICzQgGAfdmCEDuaygBSYKBSML7y4cIk0PpA+gD6QPoAMFOSoSGhUIehFqBSkHCAEMjLBVADzxYB+gLLaslx+wAlwgAl10nCArCOF1BFcIAQyMsFUAPPFgH6AstqyXH7ABAjkjQ04lpwgBDIywVQA88WAfoCy2rJcfsAcCCCEF/MPRSBwCCIYAYyMsFKs8WIfoCy2rLHxPLPyPPFlADzxbKACH6AsoAyYMG+wBxVVAGyMsAFcsfUAPPFgHPFgHPFgH6AszJ7VQC99AOhpgYC42EkvgnB9IBh2omhpgGmP/SB9IH0gfQBqGBNgAPloyhFrpOEBWccgGRwcKaDjgskvhHAoomOC+XD6AmmPwQgCicbIiV15cPrpn5j9IBggKwNkZYAK5Y+oAeeLAOeLAOeLAP0BZmT2qnAbE+OAcYED6Y/pn5gQwLCQFKwAGSXwvgIcACnzEQSRA4R2AQJRAkECPwBeA6wAPjAl8JhA/y8AoAyoIQO5rKABi+8uHJU0bHBVFSxwUVsfLhynAgghBfzD0UIYAQyMsFKM8WIfoCy2rLHxnLPyfPFifPFhjKACf6AhfKAMmAQPsAcQZQREUVBsjLABXLH1ADzxYBzxYBzxYB+gLMye1UABY3EDhHZRRDMHDwBTThaBI=";

  return Cell.fromBase64(NftFixPriceSaleV2CodeBoc);
}
```

剩下的就是我们要向市场发送一条信息，以部署销售合约，并实际发送以下信息

并创建一个转移NFT的函数。

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

很好，现在我们已经非常接近结束了。回到`app.ts`，让我们获取我们想要出售的nft的地址：

```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

创建一个将存储我们销售信息的变量：

```ts
  const seqno = await wallet.contract.getSeqno();
  await wallet.contract.sendTransfer({
    seqno,
    secretKey: wallet.keyPair.secretKey,
    messages: [
      internal({
        value: "0.05",
        to: this.data.marketplaceAddress,
        body: payload.endCell(),
      }),
    ],
    sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
  });
  return seqno;
}
```

请注意，我们将nftOwnerAddress设置为null，因为如果这样做，我们的销售合约将只接受我们部署时的币值。

### 转移物品

转让物品意味着什么？只需从所有者的钱包向智能合约发送一条信息，告知物品的新所有者是谁即可。

... 并进行转移！

转到`NftItem.ts`，并在NftItem类中创建一个新的静态方法，用于创建此类消息的主体：

```ts
static createTransferBody(params: {
    newOwner: Address;
    responseTo?: Address;
    forwardAmount?: bigint;
  }): Cell {
    const msgBody = beginCell();
    msgBody.storeUint(0x5fcc3d14, 32); // op-code 
    msgBody.storeUint(0, 64); // query-id
    msgBody.storeAddress(params.newOwner);
```

除了操作码、查询 ID 和新所有者的地址外，我们还必须存储确认转账成功的回复地址和其他传入信息的币值。新所有者将收到的 TON 数量以及他是否会收到文本有效载荷。

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

并创建一个转移函数来转移 NFT。

```ts
static async transfer(
    wallet: OpenedWallet,
    nftAddress: Address,
    newOwner: Address
  ): Promise<number> {
    const seqno = await wallet.contract.getSeqno();

    await wallet.contract.sendTransfer({
      seqno,
      secretKey: wallet.keyPair.secretKey,
      messages: [
        internal({
          value: "0.05",
          to: nftAddress,
          body: this.createTransferBody({
            newOwner,
            responseTo: wallet.contract.address,
            forwardAmount: toNano("0.02"),
          }),
        }),
      ],
      sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
    });
    return seqno;
  }
```

很好，现在我们已经接近尾声了。回到 `app.ts`，找到我们要出售的 nft 的地址：

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

创建变量，用于存储我们的销售信息。

添加到 `app.ts` 的开头：

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

然后

```ts
const saleData: GetGemsSaleData = {
  isComplete: false,
  createdAt: Math.ceil(Date.now() / 1000),
  marketplaceAddress: marketplace.address,
  nftAddress: nftToSaleAddress,
  nftOwnerAddress: null,
  fullPrice: toNano("10"),
  marketplaceFeeAddress: wallet.contract.address,
  marketplaceFee: toNano("1"),
  royaltyAddress: wallet.contract.address,
  royaltyAmount: toNano("0.5"),
};
```

请注意，我们将 `nftOwnerAddress` 设置为 null，因为这样设置后，我们的销售合约在部署时就会直接接收我们的代币。

请注意，我们将nftOwnerAddress设置为null，因为如果这样做，我们的销售合约将只接受我们部署时的币值。

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... 并将其转移！

```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

现在，我们可以启动我们的项目，享受这个过程！

```
yarn start
```

请访问 https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE}
，看看这只完美的鸭子！

## 结语

今天，您已经学到了很多关于 TON 的新知识，甚至还在 testnet 中创建了自己漂亮的 NFT 套件！如果您仍有任何疑问或发现错误，请随时发消息给作者 - [@coalus](https://t.me/coalus)

## 参考资料

- [GetGems NFT-contracts](https://github.com/getgems-io/nft-contracts)
- [NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## 关于作者

- Coalus：[Telegram](https://t.me/coalus) 或 [GitHub](https://github.com/coalus)

## 另请参见

- [NFT 用例](/v3/documentation/dapps/defi/nft)
