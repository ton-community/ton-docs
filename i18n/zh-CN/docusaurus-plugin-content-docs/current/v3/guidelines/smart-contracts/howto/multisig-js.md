---
description: 在本指南结束时，您将部署多重签名钱包并使用ton库发送一些交易
---

import Feedback from '@site/src/components/Feedback';

# 使用 TypeScript 与多重签名钱包交互

:::warning
This page is heavily outdated and will be updated soon.\
Refer to the [multisig-contract-v2](https://github.com/ton-blockchain/multisig-contract-v2), the most up-to-date multisignature contract on TON.\
Use npm and avoid updating this guide.
:::

## Introduction

如果您不知道TON中的多重签名钱包是什么，可以在[此处](/develop/smart-contracts/tutorials/multisig)查看。

按照以下步骤操作，您将学习如何：

- 创建并部署多重签名钱包
- 使用该钱包创建、签名并发送交易

我们将创建一个TypeScript项目，并使用[ton](https://www.npmjs.com/package/ton)库，因此您需要首先安装它。我们还将使用[ton-access](https://www.orbs.com/ton-access/)： We’ll also use [ton-access](https://www.orbs.com/ton-access/):

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

https://github.com/Gusarich/multisig-ts-example

---

## 创建并部署多重签名钱包

首先创建一个源文件，例如`main.ts`。在您喜欢的代码编辑器中打开它，然后按照本指南操作！ Open it in your favorite code editor and follow along!

### 1. Import required modules

First, import the necessary modules:

```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

### 2. Create a TonClient instance

创建`TonClient`实例：

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

### 3. Generate key pairs

然后我们需要一些密钥对来操作：

```js
let keyPairs: KeyPair[] = [];

let mnemonics[] = [
    ['orbit', 'feature', ...], //this should be the seed phrase of 24 words
    ['sing', 'pattern',  ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow',  ...],
    ['guard', 'nurse',   ...]
];

for (let i = 0; i < mnemonics.length; i++) keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
```

### 4. Create a MultisigWallet object

创建`MultisigWallet`对象有两种方式：

- 从地址导入现有钱包

  ```js
  let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
  let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
  ```

- **Create a new wallet**:
  ```js
  let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
  ```

### 5. Deploy the multisig wallet

部署它也有两种方式

- **Via internal message**:

  ```js
  let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
  //wallet should be active and have some balance
  await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
  ```

- **Via external message**:
  ```js
  await mw.deployExternal();
  ```

---

## 创建、签名并发送订单

### 1. Create an order

我们需要一个`MultisigOrderBuilder`对象来创建新订单。

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

### 2. Add messages to the order

Add messages to the order:

```js
let msg: MessageRelaxed = {
    body: beginCell().storeUint(0, 32).storeBuffer(Buffer.from('Hello, world!')).endCell(),
    info: {
        bounce: true,
        bounced: false,
        createdAt: 0,
        createdLt: 0n,
        dest: Address.parse('EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx'),
        forwardFee: 0n,
        ihrDisabled: true,
        ihrFee: 0n,
        type: "internal",
        value: { coins: toNano('0.01') }
    }
};

order1.addMessage(msg, 3);
```

### 3. Build and sign the order

添加消息后，通过调用`build()`方法将`MultisigOrderBuilder`转换为`MultisigOrder`。

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

### 4. Create and sign another order

现在让我们创建另一个订单，向其中添加消息，使用另一组密钥对其进行签名，并合并这些订单的签名。

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); //Now order1b have also have all signatures from order2b
```

### 5. Send the signed order

最后，发送已签名的订单：

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

### 6. Build and run the project

Compile the project:

```bash
yarn tsc
```

运行编译后的文件

```bash
node main.js
```

If no errors occur, you’ve done everything correctly! Verify the transaction using an explorer or wallet.

---

## 其他方法和属性

### Clear messages

您可以轻松地从`MultisigOrderBuilder`对象中清除消息：

```js
order2.clearMessages();
```

### Clear signatures

您还可以从`MultisigOrder`对象中清除签名：

```js
order2b.clearSignatures();
```

### Access public properties

当然，您还可以从`MultisigWallet`、`MultisigOrderBuilder`和`MultisigOrder`对象中获取公共属性

- MultisigWallet：

  - `owners` - 签名的`Dictionary<number, Buffer>` _ownerId => signature_
  - `workchain` - 钱包部署的工作链
  - `walletId` - 钱包ID
  - `k` - 确认交易所需的签名数量
  - `address` - 钱包地址
  - `provider` - `ContractProvider`实例

- MultisigOrderBuilder

  - `messages` - 要添加到订单的`MessageWithMode`数组
  - `queryId` - 订单有效的全局时间

- MultisigOrder
  - `payload` - 带有订单有效载荷的`Cell`
  - `signatures` - 签名的`Dictionary<number, Buffer>` _ownerId => signature_

---

## 参考资料

- [低层级多重签名指南](/develop/smart-contracts/tutorials/multisig)
- [ton.js文档](https://ton-community.github.io/ton/)
- [多重签名合约源代码](https://github.com/ton-blockchain/multisig-contract)

<Feedback />

