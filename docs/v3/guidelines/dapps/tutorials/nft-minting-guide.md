import Feedback from '@site/src/components/Feedback';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

# Step by step NFT collection minting 

## 👋 Introduction
Non-fungible tokens (NFTs) have become one of the hottest topics in the world of digital art and collectibles. NFTs are unique digital assets that use blockchain technology to verify ownership and authenticity. They have opened new possibilities for creators and collectors to monetize and trade digital art, music, videos, and other forms of digital content. In recent years, the NFT market has exploded, with some high-profile sales reaching millions of dollars. In this article, we will build an NFT collection on TON step by step.

**This is the beautiful collection of ducks you will create by the end of this tutorial:**

![](/img/tutorials/nft/collection.png)


## 🦄 What you will learn
1. You will mint an NFT collection on TON.
2. You will understand how NFTs on TON work.
3. You will put an NFT on sale.
4. You will upload metadata to [pinata.cloud](https://pinata.cloud).

## 💡 Prerequisites
You must already have a testnet wallet with at least 2 TON. You can get testnet coins from [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

:::info How to open the testnet version of my Tonkeeper wallet?  
1. Open settings and click the Tonkeeper logo at the bottom  5 times. 
2. Activate Dev mode.  
3. Return to the main menu and create a new Testnet wallet: Add wallet → Add Testnet Account.
:::

We will use Pinata as our IPFS storage system, so you also need to create an account on [pinata.cloud](https://pinata.cloud) and get api_key and api_secret. The official Pinata [documentation](https://docs.pinata.cloud/account-management/api-keys) can help with that. Once you have these API tokens, I’ll be waiting for you here!

## 💎 What is an NFT on TON?

Before starting the main part of our tutorial, we need to understand how NFTs work on TON. Unexpectedly, we will first explain of how NFTs work on Ethereum (ETH), to highlight the uniqueness of NFT implementation on TON compared to other blockchains.

### NFT implementation on ETH 

The implementation of the NFT in ETH is extremely simple. There is 1 main contract for the collection, which stores a simple hashmap containing the NFT data for that collection. All requests related to this collection (such as transferring an NFT, putting it up for sale, etc.) are sent directly to the single contract.

![](/img/tutorials/nft/eth-collection.png)

### Problems with such implementation on TON

The [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) in TON describes the issues of using this model:

* Unpredictable gas consumption. In TON, gas consumption for dictionary operations depends on exact set of keys. TON is an asynchronous blockchain, meaning you cannot predict how many messages from other users will reach a smart contract before yours. This uncertainty makes it difficult to determine gas costs, especially in smart contract chains like wallet → NFT smart contract → auction → NFT smart contract. If gas costs cannot be predicted, issues may arise where ownership of the NFT smart contract changes, but there are not enough Toncoins for the auction operation. Using smart contracts without dictionaries allows for deterministic gas consumption.

* Scalability issues (becomes a bottleneck). TON scales through sharding, which partitions the network into shardchains under load. A single, large smart contract for a popular NFT contradicts this concept because many transactions would refer to one contract, creating a bottleneck. Although TON supports sharded smart contracts (see the whitepaper), they are not yet implemented.


**TL;DR**
The ETH solution is not scalable and is unsuitable for an asynchronous blockchain like TON.

### TON NFT implementation

On TON, there is one master contract—the collection’s smart contract—which stores its metadata, the owner's address, and, most importantly, the logic for minting new NFTs. To create ("mint") a new NFT, you simply send a message to the collection contract. This contract then deploys a new NFT item contract using the data you provide.

![](/img/tutorials/nft/ton-collection.png)

:::info
You can check out the article on [NFT processing on TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) or read the [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) for a deeper understanding.
:::

## ⚙ Setup development environment
Let's start by creating an empty project:

1. Create a new folder

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

6. Copy this configuration into tsconfig.json

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

7. Add a script to build & start the app in `package.json`

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. Install required libraries

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. Create a `.env` file and add your own data based on this template
```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```
You can get a TON Center API key from [@tonapibot](https://t.me/tonapibot) and choose mainnet or testnet. Store the 24-word seed phrase of the collection owner’s wallet in the MNEMONIC variable.

Great! Now we are ready to start writing code for our project.

### Write helper functions

First, let's create the `openWallet` function in `src/utils.ts`. This function will open our wallet using a mnemonic and return its  publicKey/secretKey. 

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

Create a class instance to interact with toncenter:
```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```  

Finally, open our wallet:
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
Here, we will use the newly created `openWallet` function and call our main function, `init`.
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

Next, let's create a `delay.ts` file in the `src` directory, which will contain a function that waits until `seqno` increases. 
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

:::info What is it - seqno?
Simply put, seqno is a counter that tracks outgoing transactions from a wallet. It helps prevent Replay Attacks. hen a transaction is sent to a wallet smart contract, it compares the seqno field in the transaction with the one stored in the wallet. If they match, the transaction is accepted, and the stored seqno increments by one. If they don't match, the transaction is discarded. This is why we need to wait a bit after every outgoing transaction.
:::


## 🖼 Prepare metadata

Metadata is simple information that describes an NFT or an NFT collection (e.g., name, description, etc.).

First, we need to store NFT images in /data/images/ and name them `0.png`, `1.png`, ... for photos, and `logo.png` for avatars of our collection. You can either [download pack](/img/tutorials/nft/ducks.zip) of ducks images or use your own images. Store metadata files in `/data/metadata/`. 

### NFT specifications

Most projects on TON follow these metadata specifications for NFT collections:


Name | Explanation 
---|---
name | Collection name
description |	Collection description
image | Link to the avatar image. Supported formats: https, ipfs, TON Storage.
cover_image	| Link to the collection cover image.
social_links | List of up to 10 links to the project's social media profiles.

![image](/img/tutorials/nft/collection-metadata.png)

Based on this, let's create our own metadata file, `collection.json`, to describe the NFT collection!
```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```
Note: We’re not adding the "image" parameter just yet—you’ll see why later!

Once done, you can create as many NFT metadata files as you like.

Each NFT item follows these metadata specifications:

Name | Explanation 
---|---
name | NFT name. Recommended length: 15-30 characters
description | NFT description. Recommended length: Up to 500 characters
image | Link to the NFT image. 
attributes | List of NFT attributes, where a trait_type (attribute name) and value (a short description) are specified.
lottie | Link to a JSON file with Lottie animation (if specified, the animation will play on the NFT’s page).
content_url	| Link to additional content.
content_type | Type of content from the content_url link (e.g., video/mp4).

![image](/img/tutorials/nft/item-metadata.png)


```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

After that, you can create as many files of an NFT item with their metadata as you want.

### Upload metadata

Now let's write some code, that will upload our metadata files to IPFS. Create a `metadata.ts` file in `src` directory and add all needed imports:
```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

After that, we need to create a function that will actually upload all files from our folder to IPFS:
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
Here we first read all of the files in the specified folder:
```ts
const files = readdirSync(metadataFolderPath);
```

Iterate over each file and get its content
```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

After that, we assign the value `ipfs://{IpfsHash}/{index}.jpg` to the image field. If this file is mnot the last one in the folder, assign `ipfs://{imagesIpfsHash}/logo.jpg` and rewrite the file with new data.

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

Great, let's call these methods in our app.ts file.
Add the imports of our functions:
```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

Save the variables with the path to the metadata/images folder and call our functions to load the metadata.
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

After that you can run `yarn start` and see the link to your deployed metadata!

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

Finally, we need to create a function that will encode the offchain content into cells using this functions:
```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 Deploy NFT collection
Once our metadata is ready and uploaded to IPFS, we can proceed with deploying our collection!

We will create a file to store all logic related to our collection in `/contracts/NftCollection.ts`. As always, we start with imports:
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

Next, we declare a type that describes the initial data required for our collection:
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

Name | Explanation 
---|---
ownerAddress |	The address set as the collection owner. Only the owner can mint new NFTs
royaltyPercent | 	The percentage of each sale that goes to the specified address
royaltyAddress | The wallet address that receives royalties from sales of this NFT collection
nextItemIndex | The index assigned to the next NFT item
collectionContentUrl | The URL of the collection metadata
commonContentUrl | he base URL for NFT item metadata

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
In this method, we simply read the cell from the base64 representation of the collection smart contract.

Now, we need to create the cell containing our collection’s initial data. Essentially, we must store collectionData correctly. First, we create an empty cell and store the collection owner's address and the index of the next item to be minted. Let’s define the next private method:

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

Next, we create an empty cell to store the collection’s content. We then store a reference to the encoded content cell within our main data cell.

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

After that, we create a cell containing the NFT item code and store a reference to this cell in dataCell.

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

The smart contract stores royalty parameters using royaltyFactor, royaltyBase, and royaltyAddress. The royalty percentage is calculated using the formula: <InlineMath math="\left( \frac{\text{royaltyFactor}}{\text{royaltyBase}} \right) \times 100\%" />
. If we know royaltyPercent, calculating royaltyFactor is straightforward.




```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

After performing these calculations, we store the royalty data in a separate cell and reference it in dataCell.

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


The final step is writing a method to deploy the smart contract to the blockchain!
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
When the owner mints a new NFT, the collection accepts the owner's message and sends a new message to the created NFT smart contract, which requires a fee. Let’s write a method to replenish the collection’s balance based on the number of NFTs to be minted:
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

Now, let’s add a few include statements to `app.ts`:

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


## 🚢 Deploy NFT items
Once our collection is ready, we can start minting our NFTs! We will store the code in `src/contracts/NftItem.ts`

Unexpectedly, we need to return to `NftCollection.ts `and add the following type near `collectionData` at the top of the file.

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```
Name | Explanation 
---|---
itemOwnerAddress |	The address set as the item's owner
itemIndex | The index of the NFT item
amount | The amount of TON sent to the NFT upon deployment
commonContentUrl | The full link to the item URL, which is "commonContentUrl" of the collection + this commonContentUrl


Next, we create a method in the NftCollection class to construct the body for deploying an NFT item. First, we store a bit to indicate to the collection smart contract that we want to create a new NFT. Then, we store the queryId and the index of the NFT item.

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

After that, we create an empty cell and store the owner's address:
```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

We store a reference in this cell (containing the NFT item content) to the item's metadata.
```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

We store a reference to the cell with the item content in our body cell.
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

At the end, we write a short method to retrieve an NFT’s address by its index:

Create a client variable to call the collection’s get-method.

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

Call the get-method to return the NFT address based on its index.
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

Now, let's add some code to `app.ts` to automate the NFT minting process:


```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

First, read all files in the metadata folder.

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
Finally, iterate through each metadata file, create an `NftItem` instance, and call the deploy method. After that, wait until the seqno increases.

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

## 🏷 Put the NFT on sale

To list an NFT for sale, we need two smart contracts:

- **Marketplace** - Handles the logic for creating new sales.
- **Sale contract** - Manages the logic for buying and canceling sales.

### Deploy the marketplace
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

Then:

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### Deploying the sale contract

Now, we can deploy the NFT sale smart contract. How does it work?Transfer the NFT to the sale contract by changing its owner in the item data. In this tutorial, we will use [nft-fixprice-sale-v2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v2.fc) smart contract.

Create a new file: `/contracts/NftSale.ts`. Declare a type that describes the sale contract data. 
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

Create a class and a method to generate the initial data cell for the smart contract.

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

And as always, add methods to get stateInit, the initial code cell, and the smart contract address.

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

To deploy the sale contract, we must form a message and send it to the marketplace:

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

### Transferring the item
Transferring an item means sending a message from the owner’s wallet to the smart contract with the new owner's information.

Go to `NftItem.ts` and create a new static method in NftItem class to construct the transfer message body:

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

Create a transfer function to execute the NFT transfer.

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

Nice, we are almost done! Go back to `app.ts`  and retrieve the address of the NFT we want to sell:

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

Create a variable to store sale information.

At beggining of the `app.ts`, add:

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

And then:

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

Note, that you set `nftOwnerAddress` to null. This ensures that the sale contract accepts coins upon deployment.

Deploy our sale:

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... and transfer it!
```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

Finally, we can launch our project and enjoy the process!

```
yarn start
```

Go to https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE} and look to this perfect ducks!

## Conclusion 

Today, you learned a lot about TON and successfully created your own NFT collection on the testnet! If you have any questions or spot an error, feel free to contact the author: [@coalus](https://t.me/coalus)

## References

- [GetGems NFT-contracts](https://github.com/getgems-io/nft-contracts)
- [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## About the author 
- _Coalus_ on [Telegram](https://t.me/coalus) or [GitHub](https://github.com/coalus)

## See also
 - [NFT use cases](/v3/documentation/dapps/defi/nft)

<Feedback />

