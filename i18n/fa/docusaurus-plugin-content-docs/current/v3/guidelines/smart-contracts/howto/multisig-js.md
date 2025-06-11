---
description: در پایان این راهنما، کیف پول چندامضایی مستقر کرده و با استفاده از کتابخانه ton، چند تراکنش ارسال خواهید کرد
---

import Feedback from '@site/src/components/Feedback';

# با استفاده از TypeScript با کیف پول‌های multisig تعامل داشته باشید

:::warning
This page is heavily outdated and will be updated soon.\
Refer to the [multisig-contract-v2](https://github.com/ton-blockchain/multisig-contract-v2), the most up-to-date multisignature contract on TON.\
Use npm and avoid updating this guide.
:::

## معرفی

If you’re unfamiliar with multisig wallets on TON, you can learn more [here](/v3/guidelines/smart-contracts/howto/multisig).

By following these steps, you’ll learn how to:

- Create and deploy a multisig wallet.
- Create, sign, and send transactions using the wallet.

We’ll create a TypeScript project and use the [ton](https://www.npmjs.com/package/ton) library, so you’ll need to install it first. We’ll also use [ton-access](https://www.orbs.com/ton-access/):

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

The full code for this guide is available here:\
[https://github.com/Gusarich/multisig-ts-example](https://github.com/Gusarich/multisig-ts-example)

---

## Create and deploy a multisig wallet

Let’s create a source file, such as `main.ts`. Open it in your favorite code editor and follow along!

### 1. Import required modules

First, import the necessary modules:

```js
import {
  Address,
  beginCell,
  MessageRelaxed,
  toNano,
  TonClient,
  WalletContractV4,
  MultisigWallet,
  MultisigOrder,
  MultisigOrderBuilder,
} from "ton";
import { KeyPair, mnemonicToPrivateKey } from "ton-crypto";
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

### 2. Create a TonClient instance

Initialize the `TonClient`:

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

### 3. Generate key pairs

Create key pairs for the multisig wallet:

```js
let keyPairs: KeyPair[] = [];

let mnemonics = [
    ['orbit', 'feature', ...], // Replace with a 24-word seed phrase
    ['sing', 'pattern',  ...],
    ['piece', 'deputy', ...],
    ['toss', 'shadow',  ...],
    ['guard', 'nurse',   ...]
];

for (let i = 0; i < mnemonics.length; i++) {
    keyPairs[i] = await mnemonicToPrivateKey(mnemonics[i]);
}
```

### 4. Create a MultisigWallet object

You can create a `MultisigWallet` object in two ways:

- **Import an existing wallet by address**:

  ```js
  let addr: Address = Address.parse(
    "EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE"
  );
  let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
  ```

- **Create a new wallet**:
  ```js
  let mw: MultisigWallet = new MultisigWallet(
    [keyPairs[0].publicKey, keyPairs[1].publicKey],
    0,
    0,
    1,
    { client }
  );
  ```

### 5. Deploy the multisig wallet

You can deploy the wallet in two ways:

- **Via internal message**:

  ```js
  let wallet: WalletContractV4 = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPairs[4].publicKey,
  });
  // Ensure the wallet is active and has a balance
  await mw.deployInternal(
    wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey),
    toNano("0.05")
  );
  ```

- **Via external message**:
  ```js
  await mw.deployExternal();
  ```

---

## Create, sign, and send an order

### 1. Create an order

Use `MultisigOrderBuilder` to create a new order:

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

### 2. Add messages to the order

Add messages to the order:

```js
let msg: MessageRelaxed = {
  body: beginCell()
    .storeUint(0, 32)
    .storeBuffer(Buffer.from("Hello, world!"))
    .endCell(),
  info: {
    bounce: true,
    bounced: false,
    createdAt: 0,
    createdLt: 0n,
    dest: Address.parse("EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"),
    forwardFee: 0n,
    ihrDisabled: true,
    ihrFee: 0n,
    type: "internal",
    value: { coins: toNano("0.01") },
  },
};

order1.addMessage(msg, 3);
```

### 3. Build and sign the order

Convert the `MultisigOrderBuilder` to `MultisigOrder` and sign it:

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

### 4. Create and sign another order

Create another order, add a message, and sign it with a different key:

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); // Merge signatures from order2b into order1b
```

### 5. Send the signed order

Send the signed order:

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

### 6. Build and run the project

Compile the project:

```bash
yarn tsc
```

Run the compiled file:

```bash
node main.js
```

If no errors occur, you’ve done everything correctly! Verify the transaction using an explorer or wallet.

---

## روش‌ها و ویژگی‌های دیگر

### Clear messages

Clear messages from a `MultisigOrderBuilder`:

```js
order2.clearMessages();
```

### Clear signatures

Clear signatures from a `MultisigOrder`:

```js
order2b.clearSignatures();
```

### Access public properties

You can access public properties from `MultisigWallet`, `MultisigOrderBuilder`, and `MultisigOrder` objects:

- **MultisigWallet**:

  - `owners`: `Dictionary<number, Buffer>` of signatures (`ownerId => signature`).
  - `workchain`: Workchain where the wallet is deployed.
  - `walletId`: Wallet ID.
  - `k`: Number of signatures required to confirm a transaction.
  - `address`: Wallet address.
  - `provider`: `ContractProvider` instance.

- **MultisigOrderBuilder**:

  - `messages`: Array of `MessageWithMode` to be added to the order.
  - `queryId`: Global time until which the order is valid.

- **MultisigOrder**:
  - `payload`: `Cell` with order payload.
  - `signatures`: `Dictionary<number, Buffer>` of signatures (`ownerId => signature`).

---

## منابع

- [راهنمای سطح پایین multisig](/v3/guidelines/smart-contracts/howto/multisig)
- [مستندات ton.js](https://ton-community.github.io/ton/)
- [منابع قرارداد چندامضایی](https://github.com/ton-blockchain/multisig-contract)

<Feedback />

