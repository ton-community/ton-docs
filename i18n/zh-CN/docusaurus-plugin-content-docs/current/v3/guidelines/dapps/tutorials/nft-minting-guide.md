import Feedback from '@site/src/components/Feedback';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

# 逐步创建 NFT 集合的教程

## 👋 Introduction

Non-fungible tokens (NFTs) have become one of the hottest topics in the world of digital art and collectibles. NFTs are unique digital assets that use blockchain technology to verify ownership and authenticity. They have opened new possibilities for creators and collectors to monetize and trade digital art, music, videos, and other forms of digital content. In recent years, the NFT market has exploded, with some high-profile sales reaching millions of dollars. In this article, we will build an NFT collection on TON step by step.

**这是你在本教程结束时将创建的鸭子集合的精美图片：**

![](/img/tutorials/nft/collection.png)

## 🦄 你将会学到什么

1. 你将在TON上铸造NFT集合
2. 你将理解TON上的NFT是如何工作的
3. 你将把NFT出售
4. 你将把元数据上传到[pinata.cloud](https://pinata.cloud)

## 💡 必要条件

You must already have a testnet wallet with at least 2 TON. 你必须已经有一个测试网钱包，里面至少有2 TON。可以从[@testgiver_ton_bot](https://t.me/testgiver_ton_bot)获取测试网币。

:::info 如何打开我的Tonkeeper钱包的测试网版本？\

1. Open Wallets list.
2. Create a new Testnet wallet: Add wallet → Add Testnet Account.
  :::

我们将使用Pinata作为我们的IPFS存储系统，因此你还需要在[pinata.cloud](https://pinata.cloud)上创建一个帐户并获取api_key & api_secreat。官方Pinata [文档教程](https://docs.pinata.cloud/pinata-api/authentication)可以帮助完成这一点。只要你拿到这些api令牌，我就在这里等你！！！ The official Pinata [documentation](https://docs.pinata.cloud/account-management/api-keys) can help with that. Once you have these API tokens, I’ll be waiting for you here!

## 💎 什么是 TON 上的 NFT?

Before starting the main part of our tutorial, we need to understand how NFTs work on TON. 在开始我们教程的主要部分之前，我们需要了解一下通常意义上TON中NFT是如何工作的。出乎意料的是，我们将从解释ETH中NFT的工作原理开始，为了理解TON中NFT实现的特殊性，与行业中常见的区块链相比。

### ETH 上的 NFT 实现

The implementation of the NFT in ETH is extremely simple. There is 1 main contract for the collection, which stores a simple hashmap containing the NFT data for that collection. All requests related to this collection (such as transferring an NFT, putting it up for sale, etc.) are sent directly to the single contract.

![](/img/tutorials/nft/eth-collection.png)

### 在 TON 中如此实现可能出现的问题

在TON的上下文中，此类实现的问题由[TON的NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)完美描述：

- Unpredictable gas consumption. In TON, gas consumption for dictionary operations depends on exact set of keys. TON is an asynchronous blockchain, meaning you cannot predict how many messages from other users will reach a smart contract before yours. This uncertainty makes it difficult to determine gas costs, especially in smart contract chains like wallet → NFT smart contract → auction → NFT smart contract. If gas costs cannot be predicted, issues may arise where ownership of the NFT smart contract changes, but there are not enough Toncoins for the auction operation. Using smart contracts without dictionaries allows for deterministic gas consumption.

- Scalability issues (becomes a bottleneck). TON scales through sharding, which partitions the network into shardchains under load. A single, large smart contract for a popular NFT contradicts this concept because many transactions would refer to one contract, creating a bottleneck. Although TON supports sharded smart contracts (see the whitepaper), they are not yet implemented.

_简而言之，ETH的解决方案不可扩展且不适用于像TON这样的异步区块链。_

### TON 上的 NFT 实现

On TON, there is one master contract—the collection’s smart contract—which stores its metadata, the owner's address, and, most importantly, the logic for minting new NFTs. To create ("mint") a new NFT, you simply send a message to the collection contract. This contract then deploys a new NFT item contract using the data you provide.

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

2. Open this folder

```bash
cd MintyTON
```

3. Initialize the project

```bash
yarn init -y
```

4. Install TypeScript

```bash
yarn add typescript @types/node -D
```

5. Initialize the TypeScript project

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

7. 向package.json添加脚本以构建并启动我们的应用程序

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

You can get a TON Center API key from [@tonapibot](https://t.me/tonapibot) and choose mainnet or testnet. Store the 24-word seed phrase of the collection owner’s wallet in the MNEMONIC variable.

Great! 太好了！现在我们准备好开始为我们的项目编写代码了。

### 编写辅助函数

首先，让我们在 `src/utils.ts` 中创建函数 `openWallet`，它将通过助记符打开我们的钱包，并返回钱包的公钥/密钥。 This function will open our wallet using a mnemonic and return its  publicKey/secretKey.

We get a pair of keys based on 24 words (a seed phrase):

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

最后打开我们的钱包：

```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

Nice! After that, we'll create the main entry point for our project—`src/app.ts`.
很好，之后我们将创建项目的主入口点 - `src/app.ts`。
这里将使用刚刚创建的函数 `openWallet` 并调用我们的主函数 `init`。
现在就到此为止。
Thats enough for now.

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
Simply put, seqno is a counter that tracks outgoing transactions from a wallet. It helps prevent Replay Attacks. 简单来说，seqno就是由钱包发送的外部交易的计数器。
Seqno用于预防重放攻击。当交易发送到钱包智能合约时，它将交易的seqno字段与其存储中的字段进行比较。如果它们匹配，交易被接受并且存储的seqno增加一。如果它们不匹配，交易被丢弃。这就是为什么我们需要在每次发送外部交易后稍等一会儿。 If they match, the transaction is accepted, and the stored seqno increments by one. If they don't match, the transaction is discarded. This is why we need to wait a bit after every outgoing transaction.
:::

## 🖼 准备元数据

元数据 - 只是一些简单的信息，将描述我们的NFT或集合。例如它的名称、它的描述等。

First, we need to store NFT images in /data/images/ and name them `0.png`, `1.png`, ... for photos, and `logo.png` for avatars of our collection. You can either [download pack](/img/tutorials/nft/ducks.zip) of ducks images or use your own images. Store metadata files in `/data/metadata/`.

### NFT 规范

TON 上的大多数产品都支持此类元数据规范，以存储有关 NFT 收集的信息：

| 名称                                | 解释                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| name                              | 集合名称                                                                                                                   |
| description                       | 集合描述                                                                                                                   |
| image                             | Link to the avatar image. Supported formats: https, ipfs, TON Storage. |
| cover_image  | 将显示为集合封面图片的图片链接。                                                                                                       |
| social_links | 项目社交媒体配置文件的链接列表。使用不超过10个链接。                                                                                            |

![image](/img/tutorials/nft/collection-metadata.png)

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```

请注意，我们没有写"image"参数，稍后你会知道原因，请稍等！

在创建了集合的元数据文件之后，我们需要创建我们NFT的元数据。

Each NFT item follows these metadata specifications:

| 名称                                | 解释                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| name                              | NFT name. Recommended length: 15-30 characters                                |
| description                       | NFT description. NFT描述。推荐长度：不超过500个字符                                                         |
| image                             | NFT图片链接。                                                                                                      |
| attributes                        | NFT属性。属性列表，其中指定了trait_type (属性名称)和value (属性的简短描述)。 |
| lottie                            | Lottie动画的json文件链接。如果指定，在NFT页面将播放来自此链接的Lottie动画。                                                               |
| content_url  | 额外内容的链接。                                                                                                      |
| content_type | 通过content_url链接添加的内容的类型。例如，视频/mp4文件。                                                     |

![image](/img/tutorials/nft/item-metadata.png)

```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

之后，你可以根据需要创建尽可能多的NFT项目及其元数据文件。

### 上传元数据

现在让我们编写一些代码，将我们的元数据文件上传到IPFS。创建 `metadata.ts` 文件并添加所需的导入： Create a `metadata.ts` file in `src` directory and add all needed imports:

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

之后，我们需要创建一个函数，这个函数将把我们文件夹中的所有文件实际上传到IPFS：

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

Great! Back to the question at hand: why did we leave the "image" field in the metadata files empty? Imagine a situation where you want to create 1000 NFTs in your collection and, accordingly, you have to manually go through each item and manually insert a link to your image. This is really inconvenient and wrong, so let's write a function that will do this automatically!

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

之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。 之后，如果不是文件夹中的最后一个文件，我们将图像字段的值分配为 `ipfs://{IpfsHash}/{index}.jpg`，否则为 `ipfs://{imagesIpfsHash}/logo.jpg` 并实际用新数据重写我们的文件。

Full code of metadata.ts:

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
Add the imports of our functions:

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

### Encode offchain content

How will our metadata files stored in the smart contract be referenced? This question can be fully answered by the [Token Data Standart](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
In some cases, it is not enough to simply provide the desired flag and the link as ASCII characters. That is why let's consider splitting our link into several parts using the snake format.

First, create the function in `./src/utils.ts`. The function that will convert our buffer into chunks:

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

And create a function that will bind all the chunks into 1 snake-cell:

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

当我们的元数据已经准备好并且已经上传到IPFS时，我们可以开始部署我们的集合了！

我们将在 `/contracts/NftCollection.ts` 文件中创建一个文件，该文件将存储与我们的集合相关的所有逻辑。我们将从导入开始： As always, we start with imports:

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

| 名称                   | 解释                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------- |
| ownerAddress         | The address set as the collection owner. Only the owner can mint new NFTs |
| royaltyPercent       | 每次销售金额的百分比，将转到指定地址                                                                        |
| royaltyAddress       | 将从这个NFT集合的销售中接收版税的钱包地址                                                                    |
| nextItemIndex        | 下一个NFT项目应该有的索引                                                                            |
| collectionContentUrl | 集合元数据的URL                                                                                 |
| commonContentUrl     | NFT项目元数据的基础URL                                                                            |

First, let's write a private method that returns a cell containing our collection's code.

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

在这段代码中，我们只是从集合智能合约的base64表示中读取cell。

剩下的只有我们集合初始化数据的cell了。 Essentially, we must store collectionData correctly. 好了，现在只剩下含有我们的集合的初始数据的 cell 了。
基本上，我们只需要以正确的方式存储 collectionData 中的数据。首先，我们需要创建一个空 cell ，并在其中存储集合所有者地址和下一个要生成的项目的索引。让我们编写下一个私有方法： Let’s define the next private method:

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

之后，我们创建一个空 cell 来存储我们的集合内容，然后将 ref 保存到包含集合编码内容的 cell 中。然后将 ref 保存到主数据 cell 中的 contentCell。 We then store a reference to the encoded content cell within our main data cell.

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

智能合约中存储的版税参数包括 royaltyFactor、royaltyBase 和 royaltyAddress。版税百分比可以用公式 `(royaltyFactor / royaltyBase) * 100%` 计算。因此，如果我们知道 royaltyPercent，那么获取 royaltyFactor 就不成问题了。 The royalty percentage is calculated using the formula: <InlineMath math="\left( \frac{\text{royaltyFactor}}{\text{royaltyBase}} \right) \times 100\%" />
. If we know royaltyPercent, calculating royaltyFactor is straightforward.

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

Now, let's write a getter that returns the `StateInit` of our collection.

```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

We also need a getter that calculates the collection’s address. In TON, a smart contract’s address is simply the hash of its `StateInit`.

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

Deploying a new smart contract in our case means sending a message from our wallet to the collection address, which we can calculate if we have `StateInit`, along with its `StateInit`.
当所有者铸造新的NFT时，集合接受所有者的消息并向创建的NFT智能合约发送新消息（这需要支付费用），所以让我们编写一个方法，该方法将根据铸造的nfts数量来补充集合的余额： Let’s write a method to replenish the collection’s balance based on the number of NFTs to be minted:

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

完美，现在让我们在`app.ts`中添加几行，部署新的收藏：

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

Finally, we add a few lines to the end of the `init()` function to deploy the new collection:

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

Once our collection is ready, we can start minting our NFTs! 当我们的集合准备就绪时，我们就可以开始铸造我们的 NFT 了！我们将在 `src/contracts/NftItem.ts` 中存储代码

意外地，但现在我们需要回到`NftCollection.ts`。并在文件顶部的`collectionData`附近添加此类型。

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

然后在 NftCollection 类中创建方法，该方法将构建部署 NFT 项目的主体。首先存储位，向集合智能合约表明我们要创建新的 NFT。然后，只需存储此 NFT 项目的 queryId 和索引。 并在NftCollection类中创建一个方法，该方法将构建部署我们NFT项目的主体。首先存储一个位，该位将指示给集合智能合约我们想要创建新的NFT。之后只存储此NFT项目的queryId和索引。 Then, we store the queryId and the index of the NFT item.

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

随后创建一个空cell并在其中存储这个NFT的所有者地址：

```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

之后，我们只是创建NFT项目的代码cell，这些项目将在我们的收藏中被创建，并在dataCell中存储对这个cell的引用。

```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

在我们的主体cell中存储对带有项目内容的cell的引用：

```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```

Now, we return to `NftItem.ts`. The only step left is to send a message to our collection contract with the body of our NFT.

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

最后，我们将编写简短方法，该方法将通过其索引获取NFT的地址。

从创建客户端变量开始，它将帮助我们调用集合的get方法。

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

Parse the returned address.

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

Next, top up the collection’s balance.

```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```

最后，通过元数据检查每个文件，创建 `NftItem` 实例并调用部署方法。之后，我们需要等待一段时间，直到 seqno 增加： After that, wait until the seqno increases.

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

Create a new file: `/contracts/NftMarketplace.ts`. Create a basic class that accepts the marketplace owner’s address and generates a cell with the smart contract code and initial data (we will use [basic version of NFT-Marketplace smart contract](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-marketplace.fc)).

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

Implement a method to calculate the smart contract address based on `StateInit`.

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

Write a method to deploy the marketplace.

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

The deployment process is similar to other smart contracts (such as NftItem or a new collection). However, we initially fund the marketplace with 0.5 TON instead of 0.05 TON. Why? When deploying a new sales contract, the marketplace processes the request and sends a message to the new contract. Since this process involves additional transaction fees, we need extra TON.

Finally, add a few lines of code to `app.ts` to deploy the marketplace.

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

然后

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### 部署销售合约

为了将nft出售，我们需要两个智能合约。 How does it work?Transfer the NFT to the sale contract by changing its owner in the item data. In this tutorial, we will use [nft-fixprice-sale-v2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v2.fc) smart contract.

Create a new file: `/contracts/NftSale.ts`. 首先让我们声明新类型，该类型将描述我们销售智能合约的数据：

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

We will begin with creating a cell with fee details:

- The address receiving the marketplace fee.
- The TON amount sent as a marketplace fee.
- The address receiving the royalty from the sale.
- The royalty amount.

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

Following that we can create an empty cell and just store information from saleData in the correct order. Right after that, store the reference to the cell with the fees information:

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

像往常一样添加方法，获取stateInit，初始化代码cell和我们智能合约的地址。

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

First, create a cell storing the StateInit of the new sale contract

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

Create a cell with the message body.

- Set op-code = 1 to indicate a new sale contract deployment.
- Store the coins sent to the new sale contract.
- Store two references: StateInit of the new contract; the body sent to the new contract.
- Send the message to deploy the contract.

```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

Finally, let's send our message:

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

Once the sale contract is deployed, the only step left is to transfer ownership of the NFT item to the sale contract’s address.

### 转移物品

转让物品意味着什么？只需从所有者的钱包向智能合约发送一条信息，告知物品的新所有者是谁即可。

转到`NftItem.ts`，并在NftItem类中创建一个新的静态方法，用于创建此类消息的主体：

Create an empty cell and populate it with data.

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

Include the following details:

- Op-code, query-id, and the new owner's address.
- The address where a confirmation response will be sent.
- The remaining incoming message coins.
- The amount of TON sent to the new owner.
- Whether the recipient will receive a text payload.

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

并创建一个转移NFT的函数。

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

Nice, we are almost done! 很好，现在我们已经接近尾声了。回到 `app.ts`，找到我们要出售的 nft 的地址：

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

创建变量，用于存储我们的销售信息。

添加到 `app.ts` 的开头：

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

其次，为我们的收藏充值：

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

请注意，我们将 `nftOwnerAddress` 设置为 null，因为这样设置后，我们的销售合约在部署时就会直接接收我们的代币。 This ensures that the sale contract accepts coins upon deployment.

Deploy our sale:

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

今天，您已经学到了很多关于 TON 的新知识，甚至还在 testnet 中创建了自己漂亮的 NFT 套件！如果您仍有任何疑问或发现错误，请随时发消息给作者 - [@coalus](https://t.me/coalus) If you have any questions or spot an error, feel free to contact the author: [@coalus](https://t.me/coalus)

## 参考资料

- [GetGems NFT-contracts](https://github.com/getgems-io/nft-contracts)
- [NFT标准](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## 关于作者

- Coalus：[Telegram](https://t.me/coalus) 或 [GitHub](https://github.com/coalus)

## 另请参见

- [NFT 用例](/v3/documentation/dapps/defi/nft)

<Feedback />

