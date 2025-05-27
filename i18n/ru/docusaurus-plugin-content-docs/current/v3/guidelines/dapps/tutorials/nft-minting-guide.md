# Пошаговое создание коллекции NFT

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## 👋 Введение

Невзаимозаменяемые токены (NFT) стали одной из самых обсуждаемых тем в мире цифрового искусства и коллекционирования. NFT - это уникальные цифровые активы, использующие технологию блокчейн для подтверждения права собственности и подлинности. Они открыли перед создателями и коллекционерами новые возможности для монетизации и торговли цифровым искусством, музыкой, видео и другими цифровым контентом. За последние годы рынок NFT стремительно вырос, а некоторые сделки достигли миллионов долларов. В этой статье мы пошагово создадим коллекцию NFT на TON.

**Вот такая прекрасная коллекция уток будет создана вами к концу этого урока:**

![](/img/tutorials/nft/collection.png)

## 🦄 Чему Вы научитесь

1. Вы создадите коллекцию NFT на TON.
2. Вы поймете, как работают NFT на TON.
3. Вы выставите NFT на продажу.
4. Вы загрузите метаданные на [pinata.cloud](https://pinata.cloud).

## 💡 Необходимые компоненты

У вас уже должен быть testnet кошелек, в котором находится не менее 2 TON. Вы можете получить testnet коины от [@testgiver_ton_bot](https://t.me/testgiver_ton_bot).

:::info Как открыть testnet-версию моего кошелька Tonkeeper?

1. Откройте настройки и нажмите 5 раз на логотип Tonkeeper внизу экрана.
2. Активируйте Dev mode.
3. Вернитесь в главное меню и создайте новый testnet-кошелек - Добавить кошелек/Добавить аккаунт Testnet.
 :::

Мы будем использовать Pinata как систему хранения IPFS, поэтому вам также нужно создать аккаунт на [pinata.cloud](https://pinata.cloud) и получить api_key & api_secreat. Официальная обучающая [документация](https://docs.pinata.cloud/account-management/api-keys) Pinata может помочь в этом. Как только вы получите эти API-токены, возвращайтесь сюда!

## 💎 Что такое NFT на TON?

Прежде чем перейти к основной части нашего руководства, необходимо понять, как NFT работают на TON в общих чертах. Неожиданно, но мы начнем с объяснения того, как NFT работают на Ethereum (ETH), чтобы понять чем реализация NFT на TON уникальна по сравнению с другими блокчейнами в этой отрасли.

### Реализация NFT на ETH

Реализация NFT на ETH крайне проста - существует 1 основной контракт коллекции, который хранит простую хэш-таблицу, содержащую данные NFT из этой коллекции. Все запросы, связанные с этой коллекцией (если какой-либо пользователь хочет передать NFT, выставить его на продажу и т.д.), отправляются именно в этот единый контракт коллекции.

![](/img/tutorials/nft/eth-collection.png)

### Проблемы такой реализации в TON

Проблемы такой реализации в контексте TON подробно описаны в [стандарте NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md) в TON:

- Непредсказуемоееее потребление газа. В TON расход газа на операции со словарем зависит от точного набора ключей. Кроме того, TON - это асинхронный блокчейн. Это означает, что если Вы отправляете сообщение смарт-контракту, то вы не знаете, сколько сообщений от других пользователей дойдет до смарт-контракта раньше вашего сообщения. Таким образом, вы не знаете, каким будет размер словаря в тот момент, когда ваше сообщение достигнет смарт-контракта. Это нормально для простого взаимодействия кошелек -> смарт-контракт NFT, но неприемлемо для цепочек смарт-контрактов, например, кошелек -> смарт-контракт NFT -> аукцион -> смарт-контракт NFT. Если мы не можем предсказать расход газа, то может возникнуть ситуация, когда владелец сменился в смарт-контракте NFT, но для операции аукциона не хватило Тонкоинов. Использование смарт-контрактов без словарей дает детерминированный расход газа.

- Не масштабируется (становится узким местом). Масштабирование в TON основано на концепции шардинга, то есть автоматическом разделении сети на шардинги при высокой нагрузке. Один большой смарт-контракт популярного NFT противоречит этой концепции. В этом случае многие транзакции будут ссылаться на один смарт-контракт. Архитектура TON предусматривает использование шардинговых смарт-контрактов (см. whitepaper), но на данный момент они не реализованы.

*TL;DR Решение ETH не масштабируемо и не подходит для асинхронных блокчейнов, таких, как TON.*

### Реализация TON NFT

В TON у нас есть мастер-контракт — смарт-контракт нашей коллекции, который хранит метаданные и адрес владельца коллекции. Главное, что если мы хотим создать (минтить) новый NFT-элемент, нам нужно просто отправить сообщение этому контракту коллекции. Этот контракт коллекции затем развернет новый контракт NFT-элемента, используя данные, которые мы предоставим.

![](/img/tutorials/nft/ton-collection.png)

:::info
Вы можете ознакомиться со статьей [Обработка NFT в TON](/v3/guidelines/dapps/asset-processing/nft-processing/nfts) или прочитать [стандарт NFT](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md), если хотите более подробно изучить эту тему
:::

## ⚙ Настройка среды разработки

Давайте начнем с создания пустого проекта:

1. Создайте новую папку

```bash
mkdir MintyTON
```

2. Откройте эту папку

```bash
cd MintyTON
```

3. Инициализируем наш проект

```bash
yarn init -y
```

4. Установите typescript

```bash
yarn add typescript @types/node -D
```

5. Запуск проекта TypeScript

```bash
tsc --init
```

6. Скопируйте эту конфигурацию в файл tsconfig.json

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

7. Добавьте скрипт для сборки и запуска нашего приложения в `package.json`.

```json
"scripts": {
    "start": "tsc --skipLibCheck && node dist/app.js"
  },
```

8. Установите необходимые библиотеки

```bash
yarn add @pinata/sdk dotenv @ton/ton @ton/crypto @ton/core buffer
```

9. Создайте файл `.env` и добавьте свои собственные данные на основе этого шаблона

```
PINATA_API_KEY=your_api_key
PINATA_API_SECRET=your_secret_api_key
MNEMONIC=word1 word2 word3 word4
TONCENTER_API_KEY=aslfjaskdfjasasfas
```

Вы можете получить API-ключ для toncenter у [@tonapibot](https://t.me/tonapibot) и выбрать mainnet или testnet. В переменной `MNEMONIC` храните 24 слова сид-фразы кошелька владельца коллекции.

Отлично! Теперь мы готовы начать писать код для нашего проекта.

### Напишите вспомогательные функции

Сначала давайте создадим функцию `openWallet` в файле `src/utils.ts`, которая будет открывать наш кошелек по мнемонической фразе и возвращать его publicKey и secretKey.

Мы получаем пару ключей на основе 24 слов (seed-фразы):

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

Создайте экземпляр класса для взаимодействия с toncenter:

```ts
  const toncenterBaseEndpoint: string = testnet
    ? "https://testnet.toncenter.com"
    : "https://toncenter.com";

  const client = new TonClient({
    endpoint: `${toncenterBaseEndpoint}/api/v2/jsonRPC`,
    apiKey: process.env.TONCENTER_API_KEY,
  });
```

И, наконец, откройте наш кошелек:

```ts
  const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

  const contract = client.open(wallet);
  return { contract, keyPair };
}
```

Отлично, после этого создадим основную точку входа для нашего проекта — `src/app.ts`. Здесь мы будем использовать только что созданную функцию `openWallet` и вызывать нашу основную функцию `init`. Пока этого будет достаточно.

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

В завершение давайте создадим файл `delay.ts` в директории `src`, в котором мы создадим функцию, которая будет ждать, пока `seqno` увеличится.

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

:::info Что это такое - seqno?
Проще говоря, seqno — это просто счётчик исходящих транзакций, отправленных кошельком.
Seqno используется для предотвращения повторных атак (Replay Attacks). Когда транзакция отправляется в смарт-контракт кошелька, он сравнивает поле seqno транзакции с тем, что хранится в его памяти. Если значения совпадают, транзакция принимается, и хранимое значение seqno увеличивается на единицу. Если значения не совпадают, транзакция отклоняется. Поэтому после каждой исходящей транзакции нам нужно будет немного подождать.
:::

## 🖼 Подготовьте метаданные

Метаданные — это просто информация, которая описывает наш NFT или коллекцию. Например, это может быть имя, описание и другие атрибуты.

Во-первых, нам нужно хранить изображения наших NFT в папке `/data/images` с именами `0.png`, `1.png` и так далее для фото предметов, а также `logo.png` для аватара нашей коллекции. Вы можете легко [скачать пакет](/img/tutorials/nft/ducks.zip) с изображениями уток или добавить свои изображения в эту папку. Также мы будем хранить все наши файлы метаданных в папке `/data/metadata/`.

### Технические характеристики NFT

Большинство продуктов на TON поддерживают такие спецификации метаданных для хранения информации о коллекции NFT:

| Наименование                      | Пояснение                                                                                                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                              | Наименование коллекции                                                                                                                                                 |
| description                       | Описание коллекции                                                                                                                                                     |
| image                             | Ссылка на изображение, которое будет отображаться как аватар. Поддерживаемые форматы ссылок: https, ipfs, TON Storage. |
| cover_image  | Ссылка на изображение, которое будет отображаться в качестве изображения обложки коллекции.                                                            |
| social_links | Список ссылок на профили проекта в социальных сетях. Используйте не более 10 ссылок.                                                   |

![image](/img/tutorials/nft/collection-metadata.png)

Основываясь на этой информации, давайте создадим собственный файл метаданных `collection.json`, который будет описывать метаданные нашей коллекции!

```json
{
  "name": "Ducks on TON",
  "description": "This collection is created for showing an example of minting NFT collection on TON. You can support creator by buying one of this NFT.",
  "social_links": ["https://t.me/DucksOnTON"]
}
```

Обратите внимание, что мы не написали параметр "image", Вы узнаете почему чуть позже, просто подождите!

После создания метаданных коллекции, нам нужно создать метаданные для наших NFT

Спецификации метаданных NFT предмета:

| Наименование                      | Пояснение                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name                              | Название NFT. Рекомендуемая длина: Не более 15-30 символов                                                                                                                   |
| description                       | Описание NFT. Рекомендуемая длина: До 500 символов                                                                                                                           |
| image                             | Ссылка на изображение NFT.                                                                                                                                                                   |
| attributes                        | Атрибуты NFT. Список атрибутов, в котором указан тип_черты (имя атрибута) и значение (краткое описание атрибута). |
| lottie                            | Ссылка на JSON-файл с анимацией Lottie. Если указана, анимация Lottie с этой ссылки будет воспроизводиться на странице с NFT.                                                |
| content_url  | Ссылка на дополнительный контент.                                                                                                                                                            |
| content_type | Тип контента, добавленного через ссылку content_url. Например, файл video/mp4.                                                                          |

![image](/img/tutorials/nft/item-metadata.png)

```json
{
  "name": "Duck #00",
  "description": "What about a round of golf?",
  "attributes": [{ "trait_type": "Awesomeness", "value": "Super cool" }]
}
```

После этого вы можете создать любое количество файлов NFT-элементов с их метаданными.

### Загрузите метаданные

Теперь давайте напишем код, который загрузит наши метаданные на IPFS. Создайте файл `metadata.ts` в каталоге `src` и добавьте все необходимые импорты:

```ts
import pinataSDK from "@pinata/sdk";
import { readdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";
```

После этого нам нужно создать функцию, которая на самом деле загрузит все файлы из нашей папки в IPFS:

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

Отлично! Давайте вернемся к главному вопросу: почему мы оставили поле "изображение" в файлах метаданных пустым? Представьте себе ситуацию, когда Вы хотите создать 1000 NFT в своей коллекции и, соответственно, должны вручную пройтись по каждому элементу и вручную вставить ссылку на свою картинку.
Это очень неудобно и неправильно, поэтому давайте напишем функцию, которая будет делать это автоматически!

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

Здесь мы сначала считываем все файлы в указанной папке:

```ts
const files = readdirSync(metadataFolderPath);
```

Выполните итерацию над каждым файлом и получите его содержимое

```ts
const filePath = path.join(metadataFolderPath, filename)
const file = await readFile(filePath);

const metadata = JSON.parse(file.toString());
```

После этого мы присваиваем значению поля image ссылку вида `ipfs://{IpfsHash}/{index}.jpg`, если это не последний файл в папке. В противном случае присваиваем ссылку `ipfs://{imagesIpfsHash}/logo.jpg` и перезаписываем файл с новыми данными.

Полный код файла metadata.ts:

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

Отлично, давайте вызовем эти методы в нашем файле app.ts.
Добавьте импорты наших функций:

```ts
import { updateMetadataFiles, uploadFolderToIPFS } from "./src/metadata";
```

Сохраните переменные с путями к папкам с метаданными или изображениями, а затем вызовите наши функции для загрузки метаданных.

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

После этого Вы можете запустить `yarn start` и увидеть ссылку на Ваши развернутые метаданные!

### Кодирование контента вне цепочки

Как будет храниться ссылка на наши метаданные в смарт-контракте? Этот вопрос можно полностью ответить с помощью [Стандарта токен-данных](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
В некоторых случаях будет недостаточно просто указать нужный флаг и предоставить ссылку в виде ASCII-символов, поэтому давайте рассмотрим вариант, при котором потребуется разделить нашу ссылку на несколько частей, используя формат с подчеркиваниями (snake format).

Сначала создайте функцию в файле `./src/utils.ts`, которая будет разбивать наш буфер на части:

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

И создайте функцию, которая свяжет все части в одну змеиную ячейку:

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

Наконец, нам нужно создать функцию, которая будет кодировать содержимое ячейки с помощью этой функции:

```ts
export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content);
  const offChainPrefix = Buffer.from([0x01]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}
```

## 🚢 Разверните коллекцию NFT

Когда наши метаданные будут готовы и уже загружены в IPFS, мы можем приступить к развертыванию нашей коллекции!

Мы создадим файл, который будет содержать всю логику, связанную с нашей коллекцией, в файле `/contracts/NftCollection.ts`. Как всегда, начнем с импорта:

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

И объявим тип, который будет описывать данные инициализации, необходимые для нашей коллекции:

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

| Наименование         | Пояснение                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| ownerAddress         | Адрес, который будет установлен в качестве владельца нашей коллекции. Только владелец будет иметь возможность создавать новые NFT |
| royaltyPercent       | Процент от каждой суммы продажи, который будет поступать на указанный адрес                                                                       |
| royaltyAddress       | Адрес кошелька, который будет получать роялти с продаж этой коллекции NFT                                                                         |
| nextItemIndex        | Индекс, который должен быть присвоен следующему элементу NFT                                                                                      |
| collectionContentUrl | URL-адрес к метаданным коллекции                                                                                                                  |
| commonContentUrl     | Базовый URL для метаданных элементов NFT                                                                                                          |

Сначала давайте напишем приватный метод, который будет возвращать ячейку с кодом нашей коллекции.

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

В этом коде мы просто читаем ячейку из base64-представления смарт-контракта коллекции.

Хорошо, осталась только ячейка с данными инициализации нашей коллекции. По сути, нам нужно просто правильно сохранить данные из `collectionData`. Сначала нам нужно создать пустую ячейку и сохранить в ней адрес владельца коллекции и индекс следующего элемента, который будет создан. Давайте напишем следующий приватный метод:

```ts
private createDataCell(): Cell {
  const data = this.collectionData;
  const dataCell = beginCell();

  dataCell.storeAddress(data.ownerAddress);
  dataCell.storeUint(data.nextItemIndex, 64);
```

Затем, после этого, мы создаем пустую ячейку, которая будет хранить контент нашей коллекции, и после этого сохраняем ссылку на ячейку с закодированным контентом нашей коллекции. И сразу после этого сохраняем ссылку на `contentCell` в основной ячейке данных нашей коллекции.

```ts
const contentCell = beginCell();

const collectionContent = encodeOffChainContent(data.collectionContentUrl);

const commonContent = beginCell();
commonContent.storeBuffer(Buffer.from(data.commonContentUrl));

contentCell.storeRef(collectionContent);
contentCell.storeRef(commonContent.asCell());
dataCell.storeRef(contentCell);
```

После этого мы просто создаем ячейку с кодом NFT-элементов, которые будут созданы в нашей коллекции, и сохраняем ссылку на эту ячейку в `dataCell`

```ts
const NftItemCodeCell = Cell.fromBase64(
  "te6cckECDQEAAdAAART/APSkE/S88sgLAQIBYgMCAAmhH5/gBQICzgcEAgEgBgUAHQDyMs/WM8WAc8WzMntVIAA7O1E0NM/+kAg10nCAJp/AfpA1DAQJBAj4DBwWW1tgAgEgCQgAET6RDBwuvLhTYALXDIhxwCSXwPg0NMDAXGwkl8D4PpA+kAx+gAxcdch+gAx+gAw8AIEs44UMGwiNFIyxwXy4ZUB+kDUMBAj8APgBtMf0z+CEF/MPRRSMLqOhzIQN14yQBPgMDQ0NTWCEC/LJqISuuMCXwSED/LwgCwoAcnCCEIt3FzUFyMv/UATPFhAkgEBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7AAH2UTXHBfLhkfpAIfAB+kDSADH6AIIK+vCAG6EhlFMVoKHeItcLAcMAIJIGoZE24iDC//LhkiGOPoIQBRONkchQCc8WUAvPFnEkSRRURqBwgBDIywVQB88WUAX6AhXLahLLH8s/Im6zlFjPFwGRMuIByQH7ABBHlBAqN1viDACCAo41JvABghDVMnbbEDdEAG1xcIAQyMsFUAfPFlAF+gIVy2oSyx/LPyJus5RYzxcBkTLiAckB+wCTMDI04lUC8ANqhGIu"
);
dataCell.storeRef(NftItemCodeCell);
```

Параметры роялти хранятся в смарт-контракте через `royaltyFactor`, `royaltyBase` и `royaltyAddress`. Процент роялти можно вычислить по формуле `(royaltyFactor / royaltyBase) * 100%`. Таким образом, если мы знаем процент роялти (`royaltyPercent`), то не составит труда вычислить `royaltyFactor`.

```ts
const royaltyBase = 1000;
const royaltyFactor = Math.floor(data.royaltyPercent * royaltyBase);
```

После вычислений, нам нужно сохранить данные о роялти в отдельной ячейке и предоставить ссылку на эту ячейку в `dataCell`.

```ts
const royaltyCell = beginCell();
royaltyCell.storeUint(royaltyFactor, 16);
royaltyCell.storeUint(royaltyBase, 16);
royaltyCell.storeAddress(data.royaltyAddress);
dataCell.storeRef(royaltyCell);

return dataCell.endCell();
}
```

Теперь давайте напишем геттер, который будет возвращать `StateInit` нашей коллекции. Этот метод создаст ячейки для всех данных коллекции (включая данные роялти, владельца и другие параметры), а затем соберет и вернет ссылку на начальные данные (`StateInit`):

```ts
public get stateInit(): StateInit {
  const code = this.createCodeCell();
  const data = this.createDataCell();

  return { code, data };
}
```

И геттер, который будет вычислять адрес нашей коллекции (адрес смарт-контракта в TON — это просто хэш его `StateInit`)

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

Осталось только написать метод, который развернет смарт-контракт в блокчейне!

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

Развертывание нового смарт-контракта в нашем случае — это просто отправка сообщения с нашего кошелька на адрес коллекции (который мы можем вычислить, если у нас есть `StateInit`), с его `StateInit`!

Когда владелец минтит новый NFT, коллекция принимает сообщение от владельца и отправляет новое сообщение в созданный смарт-контракт NFT (что требует оплаты комиссии), поэтому давайте напишем метод, который будет пополнять баланс коллекции в зависимости от количества NFT для минта:

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

Отлично, давайте теперь добавим несколько include в наш `app.ts`:

```ts
import { waitSeqno } from "./delay";
import { NftCollection } from "./contracts/NftCollection";
```

И добавьте несколько строк в конец функции `init()`, чтобы развернуть новую коллекцию:

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

## 🚢 Развертывание элементов NFT

Когда наша коллекция будет готова, мы сможем начать минтить наши NFT! Мы будем хранить код в `src/contracts/NftItem.ts`

Неожиданно, но теперь нам нужно вернуться в `NftCollection.ts` и добавить этот тип рядом с `collectionData` в верхней части файла.

```ts
export type mintParams = {
  queryId: number | null,
  itemOwnerAddress: Address,
  itemIndex: number,
  amount: bigint,
  commonContentUrl: string
}
```

| Наименование     | Пояснение                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| itemOwnerAddress | Адрес, который будет установлен в качестве владельца предмета                                                    |
| itemIndex        | Индекс предмета NFT                                                                                              |
| amount           | Количество TON, которое будет отправлено в NFT с развертыванием                                                  |
| commonContentUrl | Полная ссылка на URL элемента может быть сформирована как "commonContentUrl" коллекции + этот `commonContentUrl` |

И создайте метод в классе NftCollection, который будет строить тело для развертывания нашего NFT-элемента. Сначала сохраните бит, который будет указывать смарт-контракту коллекции, что мы хотим создать новый NFT. После этого просто сохраните `queryId` и индекс этого NFT-элемента.

```ts
public createMintBody(params: mintParams): Cell {
    const body = beginCell();
    body.storeUint(1, 32);
    body.storeUint(params.queryId || 0, 64);
    body.storeUint(params.itemIndex, 64);
    body.storeCoins(params.amount);
```

Позже создайте пустую ячейку и сохраните в ней адрес владельца этого NFT:

```ts
    const nftItemContent = beginCell();
    nftItemContent.storeAddress(params.itemOwnerAddress);
```

И сохраните в этой ячейке (с содержимым NFT Item) ссылку на метаданные этого элемента:

```ts
    const uriContent = beginCell();
    uriContent.storeBuffer(Buffer.from(params.commonContentUrl));
    nftItemContent.storeRef(uriContent.endCell());
```

Сохраните ссылку на ячейку с содержимым элемента в ячейке нашего тела:

```ts
    body.storeRef(nftItemContent.endCell());
    return body.endCell();
}
```

Отлично! Теперь мы можем вернуться к `NftItem.ts`. Все, что нам нужно сделать, это отправить сообщение в наш смарт-контракт коллекции с телом нашего NFT.

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

В конце мы напишем короткий метод, который будет получать адрес NFT по его индексу.

Начнем с создания переменной `client`, которая поможет нам вызвать метод `get` смарт-контракта коллекции.

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

Затем мы вызовем метод `get` смарт-контракта коллекции, который вернет адрес NFT в этой коллекции с заданным индексом

```ts
  const response = await client.runMethod(
    collectionAddress,
    "get_nft_address_by_index",
    [{ type: "int", value: BigInt(itemIndex) }]
  );
```

... и разобрать этот адрес!

```ts
    return response.stack.readAddress();
}
```

Теперь давайте добавим немного кода в `app.ts`, чтобы автоматизировать процесс минтинга каждого NFT:

```ts
  import { NftItem } from "./contracts/NftItem";
  import { toNano } from '@ton/core';
```

Сначала прочитайте все файлы в папке с нашими метаданными:

```ts
const files = await readdir(metadataFolderPath);
files.pop();
let index = 0;
```

Во-вторых, необходимо пополнить баланс нашей коллекции:

```ts
seqno = await collection.topUpBalance(wallet, files.length);
await waitSeqno(seqno, wallet);
console.log(`Balance top-upped`);
```

В конечном итоге нужно пройти по каждому файлу с метаданными, создать экземпляр `NftItem` и вызвать метод развертывания (deploy). После этого необходимо немного подождать, чтобы значение seqno увеличилось:

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

## 🏷 Поставьте NFT на продажу

Чтобы выставить NFT на продажу, нам нужно два смарт-контракта.

- Маркетплейс, который отвечает только за логику создания новых продаж
- Контракт продажи, который отвечает за логику покупки/отмены продажи

### Разверните торговую площадку

Создайте новый файл в директории `/contracts/NftMarketplace.ts`. Как обычно, создайте базовый класс, который будет принимать адрес владельца маркетплейса и создавать ячейку с кодом (мы будем использовать [базовую версию контракта NFT-маркетплейса](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-marketplace.fc)) этого смарт-контракта и начальные данные.

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

Давайте создадим метод, который будет вычислять адрес нашего смарт-контракта на основе StateInit:

```ts
public get address(): Address {
    return contractAddress(0, this.stateInit);
  }
```

После этого нам нужно создать метод, который будет разворачивать нашу торговую площадку:

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

Как видите, этот код не отличается от развертывания других смарт-контрактов (смарт-контракта nft-item, развертывания новой коллекции). Единственное отличие — вы можете заметить, что мы изначально пополняем наш маркетплейс не на 0,05 TON, а на 0,5. Почему так? Когда развертывается новый смарт-контракт продажи, маркетплейс принимает запрос, обрабатывает его и отправляет сообщение новому контракту (да, ситуация аналогична ситуации с NFT-коллекцией). Именно поэтому нам нужно немного больше TON для оплаты комиссий.

В конце давайте добавим несколько строк кода в наш файл `app.ts`, чтобы развернуть нашу торговую площадку:

```ts
import { NftMarketplace } from "./contracts/NftMarketplace";
```

А затем

```ts
console.log("Start deploy of new marketplace  ");
const marketplace = new NftMarketplace(wallet.contract.address);
seqno = await marketplace.deploy(wallet);
await waitSeqno(seqno, wallet);
console.log("Successfully deployed new marketplace");
```

### Разверните контракт на продажу

Отлично! Сейчас мы уже можем развернуть смарт-контракт для продажи наших NFT. Как это будет работать? Нам нужно развернуть новый контракт, а затем "перевести" наш NFT в контракт продажи (другими словами, нам нужно просто изменить владельца нашего NFT на контракт продажи в данных предмета). В этом уроке мы будем использовать смарт-контракт продажи [nft-fixprice-sale-v2](https://github.com/getgems-io/nft-contracts/blob/main/packages/contracts/sources/nft-fixprice-sale-v2.fc).

Создайте новый файл в `/contracts/NftSale.ts`. Прежде всего, давайте объявим новый тип, который будет описывать данные нашего смарт-контракта продажи:

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

А теперь давайте создадим класс и основной метод, который будет создавать ячейку начальных данных для нашего смарт-контракта.

```ts
export class NftSale {
  private data: GetGemsSaleData;

  constructor(data: GetGemsSaleData) {
    this.data = data;
  }
}
```

Мы начнем с создания ячейки с информацией о сборах. Нам нужно будет сохранить адрес, который будет получать сборы за маркетплейс, сумму TON, которую нужно отправить торговой площадке в качестве сбора, а также адрес, который будет получать роялти от продажи, и размер роялти.

```ts
private createDataCell(): Cell {
  const saleData = this.data;

  const feesCell = beginCell();

  feesCell.storeAddress(saleData.marketplaceFeeAddress);
  feesCell.storeCoins(saleData.marketplaceFee);
  feesCell.storeAddress(saleData.royaltyAddress);
  feesCell.storeCoins(saleData.royaltyAmount);
```

После этого мы можем создать пустую ячейку и просто сохранить в нее информацию из `saleData` в правильном порядке, а сразу после этого сохранить ссылку на ячейку с информацией о сборах:

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

Как обычно, добавим методы для получения `stateInit`, ячейки с кодом и адреса нашего смарт-контракта.

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

Осталось только сформировать сообщение, которое мы отправим нашей торговой площадке для развертывания контракта на продажу, и фактически отправить это сообщение

Прежде всего, мы создадим ячейку, которая будет хранить StateInit нашего нового контракта на продажу

```ts
public async deploy(wallet: OpenedWallet): Promise<number> {
    const stateInit = beginCell()
      .store(storeStateInit(this.stateInit))
      .endCell();
```

Создайте ячейку с телом для нашего сообщения. Во-первых, нужно установить оп-код в 1 (чтобы указать торговой площадке, что мы хотим развернуть новый смарт-контракт для продажи). Затем нужно сохранить количество монет, которые будут отправлены в наш новый смарт-контракт продажи. И в конце нужно сохранить две ссылки: на `StateInit` нового смарт-контракта и тело, которое будет отправлено в этот новый смарт-контракт.

```ts
  const payload = beginCell();
  payload.storeUint(1, 32);
  payload.storeCoins(toNano("0.05"));
  payload.storeRef(stateInit);
  payload.storeRef(new Cell());
```

И в конце давайте отправим наше послание:

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

Отлично! Когда смарт-контракт продажи будет развернут, все, что останется, — это изменить владельца нашего NFT на адрес этого контракта продажи.

### Передача предмета

Что значит передать предмет? Просто отправить сообщение из кошелька владельца в смарт-контракт с информацией о том, кто является новым владельцем предмета.

Перейдите в файл `NftItem.ts` и создайте новый статический метод в классе `NftItem`, который будет создавать тело для такого сообщения:

Просто создайте пустую ячейку и заполните ее данными.

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

В дополнение к оп-коду, query-id и адресу нового владельца, мы также должны хранить адрес, на который нужно отправить ответ с подтверждением успешного перевода, а также оставшуюся часть входящих монет в сообщении. Необходимо указать, сколько TON перейдет новому владельцу и будет ли он получать текстовую полезную нагрузку.

```ts
  msgBody.storeAddress(params.responseTo || null);
  msgBody.storeBit(false); // no custom payload
  msgBody.storeCoins(params.forwardAmount || 0);
  msgBody.storeBit(0); // no forward_payload 

  return msgBody.endCell();
}
```

И создайте функцию перевода для передачи NFT.

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

Отлично, теперь мы уже очень близки к завершению. Вернемся к `app.ts` и давайте получим адрес нашего Nft, который мы хотим выставить на продажу:

```ts
const nftToSaleAddress = await NftItem.getAddressByIndex(collection.address, 0);
```

Создайте переменную, которая будет хранить информацию о нашей продаже.

Добавьте в начало `app.ts`:

```ts
import { GetGemsSaleData, NftSale } from "./contracts/NftSale";
```

А потом:

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

Обратите внимание, что мы установили `nftOwnerAddress` в null, потому что если бы мы это сделали, наш контракт на продажу просто принял бы наши монеты при развертывании.

Разверните нашу продажу:

```ts
const nftSaleContract = new NftSale(saleData);
seqno = await nftSaleContract.deploy(wallet);
await waitSeqno(seqno, wallet);
```

... и перенесите его!

```ts
await NftItem.transfer(wallet, nftToSaleAddress, nftSaleContract.address);
```

Теперь мы можем запустить наш проект и наслаждаться процессом!

```
yarn start
```

Зайдите на https://testnet.getgems.io/collection/{YOUR_COLLECTION_ADDRESS_HERE} и посмотрите на эту идеальную утку!

## Заключение

Сегодня ты узнал много нового о TON и даже создал свою собственную красивую NFT коллекцию в тестовой сети! Если у тебя остались вопросы или ты заметил ошибку — не стесняйся написать автору — [@coalus](https://t.me/coalus)

## Ссылки

- [GetGems NFT-контракты](https://github.com/getgems-io/nft-contracts)
- [NFT Standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md)

## Об авторе

- Coalus в [Telegram](https://t.me/coalus) или [GitHub](https://github.com/coalus)

## См. также

- [Примеры использования NFT](/v3/documentation/dapps/defi/nft)
