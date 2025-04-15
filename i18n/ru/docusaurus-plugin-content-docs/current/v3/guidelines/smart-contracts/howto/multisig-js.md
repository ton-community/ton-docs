---
description: В рамках этого руководства вы научитесь разворачивать кошелек с мультиподписью, а также отправите несколько транзакций с помощью библиотеки ton
---

# Взаимодействие с кошельками с мультиподписью при помощи TypeScript

:::warning
Эта страница сильно устарела и скоро будет обновлена.
См. [multisig-contract-v2](https://github.com/ton-blockchain/multisig-contract-v2), самый новый контракт с мультиподписью на TON.
Используйте npm и не обновляйте.
:::

## Введение

Если вы не знаете, что такое мультиподписной кошелек в ​​TON, вы можете ознакомиться с этим [здесь](/v3/guidelines/smart-contracts/howto/multisig)

Выполнив эти действия, вы узнаете, как:

- Создать и развернуть кошелек с мультиподписью
- Создать, подписать и отправить транзакции с помощью этого кошелька

Мы создадим проект TypeScript и будем использовать библиотеку [ton](https://www.npmjs.com/package/ton), поэтому вам нужно сначала установить ее. Мы также будем использовать [ton-access](https://www.orbs.com/ton-access/):

```bash
yarn add typescript @types/node ton ton-crypto ton-core buffer @orbs-network/ton-access
yarn tsc --init -t es2022
```

Полный код этого руководства доступен по ссылке:

- https://github.com/Gusarich/multisig-ts-example

## Создание и развертывание кошелька с мультиподписью

Давайте создадим исходный файл, например `main.ts`. Откройте его в вашем любимом редакторе кода и следуйте этому руководству!

Сначала нам необходимо импортировать все основные компоненты

```js
import { Address, beginCell, MessageRelaxed, toNano, TonClient, WalletContractV4, MultisigWallet, MultisigOrder, MultisigOrderBuilder } from "ton";
import { KeyPair, mnemonicToPrivateKey } from 'ton-crypto';
import { getHttpEndpoint } from "@orbs-network/ton-access";
```

Создайте экземпляр `TonClient`:

```js
const endpoint = await getHttpEndpoint();
const client = new TonClient({ endpoint });
```

Далее нам понадобятся пары ключей для работы:

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

Существует два способа создать объект `MultisigWallet`:

- Импортировать существующий из адреса

```js
let addr: Address = Address.parse('EQADBXugwmn4YvWsQizHdWGgfCTN_s3qFP0Ae0pzkU-jwzoE');
let mw: MultisigWallet = await MultisigWallet.fromAddress(addr, { client });
```

- Создать новый

```js
let mw: MultisigWallet = new MultisigWallet([keyPairs[0].publicKey, keyPairs[1].publicKey], 0, 0, 1, { client });
```

Есть также два способа его развертывания

- Через внутреннее сообщение

```js
let wallet: WalletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: keyPairs[4].publicKey });
//wallet should be active and have some balance
await mw.deployInternal(wallet.sender(client.provider(wallet.address, null), keyPairs[4].secretKey), toNano('0.05'));
```

- Через внешнее сообщение

```js
await mw.deployExternal();
```

## Создание, подпись и отправка заявки

Для создания новой заявки нам нужен объект `MultisigOrderBuilder`.

```js
let order1: MultisigOrderBuilder = new MultisigOrderBuilder(0);
```

Далее мы можем добавить в нее несколько сообщений.

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

После того как вы закончите с добавлением сообщений, преобразуйте `MultisigOrderBuilder` в `MultisigOrder`, используя метод `build()`.

```js
let order1b: MultisigOrder = order1.build();
order1b.sign(0, keyPairs[0].secretKey);
```

Теперь давайте создадим еще одну заявку, добавим в нее сообщение, подпишем ее другим набором ключей и объединим подписи этих заявок.

```js
let order2: MultisigOrderBuilder = new MultisigOrderBuilder(0);
order2.addMessage(msg, 3);
let order2b = order2.build();
order2b.sign(1, keyPairs[1].secretKey);

order1b.unionSignatures(order2b); //Now order1b have also have all signatures from order2b
```

И, в завершение, отправим подписанную заявку:

```js
await mw.sendOrder(order1b, keyPairs[0].secretKey);
```

Далее нам необходимо собрать проект

```bash
yarn tsc
```

И запустить скомпилированный файл

```bash
node main.js
```

Если компиляция не выдает никаких ошибок, вы все сделали правильно! Теперь осталось проверить, прошла ли ваша транзакция успешно в любом кошельке или проводнике.

## Другие методы и свойства

Вы можете легко очистить сообщения из объектов `MultisigOrderBuilder`:

```js
order2.clearMessages();
```

Вы также можете очистить подписи из объектов `MultisigOrder`:

```js
order2b.clearSignatures();
```

И, конечно, вы можете получить внешние свойства из объектов `MultisigWallet`, `MultisigOrderBuilder` и `MultisigOrder`

- MultisigWallet:
 - `owners` - `словарь <number, Buffer>` подписей *ownerId => signature*
 - `workchain` - воркчейн, где развернут кошелек
 - `walletId` - идентификатор кошелька
 - `k` - количество подписей, необходимых для подтверждения транзакции
 - `address` - адрес кошелька
 - `provider` - экземпляр `ContractProvider`.

- MultisigOrderBuilder
 - `messages` - массив `MessageWithMode`, который будет добавлен к заявке
 - `queryId` - глобальное время, до наступления которого заявка является действительной

- MultisigOrder
 - `payload` - `Cell` с полезной нагрузкой заявки
 - `signatures` - `Dictionary <number, Buffer>` подписей *ownerId => signature*

## Ссылки

- [Низкоуровневое руководство по мультиподписи](/v3/guidelines/smart-contracts/howto/multisig)
- [Документация ton.js](https://ton-community.github.io/ton/)
- [Исходный код контракта мультиподписи](https://github.com/ton-blockchain/multisig-contract)
