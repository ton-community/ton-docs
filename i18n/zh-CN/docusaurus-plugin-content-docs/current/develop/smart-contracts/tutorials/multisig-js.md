---
description: 在本指南结束时，您将部署多重签名钱包并使用ton库发送一些交易
---

# 使用 TypeScript 与多重签名钱包交互

## 引言
如果您不知道TON中的多重签名钱包是什么，可以在[此处](/develop/smart-contracts/tutorials/multisig)查看。

按照以下步骤操作，您将学习如何：
 * 创建并部署多重签名钱包
 * 使用该钱包创建、签名并发送交易

我们将创建一个TypeScript项目，并使用[ton](https://www.npmjs.com/package/ton)库，因此您需要首先安装它。我们还将使用[ton-access](https://www.orbs.com/ton-access/)：

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

本指南的完整代码可在此处查看：
 * https://github.com/Gusarich/multisig-ts-example

## 创建并部署多重签名钱包
首先创建一个源文件，例如`main.ts`。在您喜欢的代码编辑器中打开它，然后按照本指南操作！

首先我们需要导入所有重要的东西
```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

创建`TonClient`实例：
```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```
然后我们需要一些密钥对来操作：
```js
let keyPairs: KeyPair[] = [];

let mnemonics[] = [
    ['orbit', 'feature', ...], //这应该是24个单词的种子短语
    ['sing', 'pattern',  ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow',  ...],
    ['guard', 'nurse',   ...]
];

for (let i = 0; i < mnemonics.length; i++) keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
```
创建`MultisigWallet`对象有两种方式：
 * 从地址导入现有钱包
  ```js
  let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
  let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
  ```

 * 创建一个新的
  ```js
  let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
  ```

部署它也有两种方式
 * 通过内部消息
  ```js
  let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
  //钱包应该处于活动状态并且有一些余额
  await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
  ```
 * 通过外部消息
  ```js
  await mw.deployExternal();
  ```

## 创建、签名并发送订单
我们需要一个`MultisigOrderBuilder`对象来创建新订单。
```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```
然后我们可以向它添加一些消息。
```js
let msg: MessageRelaxed = {
    body: beginCell().storeUint(0, 32).storeBuffer(Buffer.from('Hello, world!')).endCell(),
    info: {
        bounce: true,
        bounced: false,
        createdAt: 0,
        createdLt: 0n,
        dest: Address.parse('EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXH

x'),
        forwardFee: 0n,
        ihrDisabled: true,
        ihrFee: 0n,
        type: "internal",
        value: { coins: toNano('0.01') }
    }
};

order1.addMessage(msg, 3);
```
添加消息后，通过调用`build()`方法将`MultisigOrderBuilder`转换为`MultisigOrder`。
```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```
现在让我们创建另一个订单，向其中添加消息，使用另一组密钥对其进行签名，并合并这些订单的签名。
```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); //现在order1b也有order2b的所有签名
```
最后，发送已签名的订单：
```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

现在构建项目
```bash
yarn tsc
```

运行编译后的文件
```bash
node main.js
```

如果没有抛出任何错误，您就做对了！现在使用任何浏览器或钱包检查您的交易是否成功。

## 其他方法和属性
您可以轻松地从`MultisigOrderBuilder`对象中清除消息：
```js
order2.clearMessages();
```
您还可以从`MultisigOrder`对象中清除签名：
```js
order2b.clearSignatures();
```

当然，您还可以从`MultisigWallet`、`MultisigOrderBuilder`和`MultisigOrder`对象中获取公共属性

 * MultisigWallet：
    - `owners` - 签名的`Dictionary<number, Buffer>` *ownerId => signature*
    - `workchain` - 钱包部署的工作链
    - `walletId` - 钱包ID
    - `k` - 确认交易所需的签名数量
    - `address` - 钱包地址
    - `provider` - `ContractProvider`实例

 * MultisigOrderBuilder
    - `messages` - 要添加到订单的`MessageWithMode`数组
    - `querryId` - 订单有效的全局时间

 * MultisigOrder
    - `payload` - 带有订单有效载荷的`Cell`
    - `signatures` - 签名的`Dictionary<number, Buffer>` *ownerId => signature*

## 参考资料
 * [低层级多重签名指南](/develop/smart-contracts/tutorials/multisig)
 * [ton.js文档](https://ton-community.github.io/ton/)
 * [多重签名合约源代码](https://github.com/ton-blockchain/multisig-contract)
