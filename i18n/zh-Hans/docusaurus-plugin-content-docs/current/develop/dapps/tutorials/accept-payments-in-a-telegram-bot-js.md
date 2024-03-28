---
description: 在本教程结束时，你将编写一个美观的机器人，能够直接用TON接受你的产品的支付。
---

# 出售饺子的机器人

在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。

## 🦄 外观

在教程结束时，你将编写一个美观的机器人，能够直接用TON接受你的产品的支付。

机器人将如下所示：

![bot preview](/img/tutorials/js-bot-preview.jpg)

## 📖 你将学到什么
你将学会如何：
 - 使用grammY在NodeJS中创建一个Telegram机器人
 - 使用公共TON Center API

> 我们为什么使用grammY？
因为grammY是一个现代化、年轻的、高级框架，适用于在JS/TS/Deno上快速舒适地开发telegram机器人，此外，grammY拥有优秀的[文档](https://grammy.dev)和一个能够始终帮助你的活跃社群。


## ✍️ 开始之前你需要
如果还没有安装[NodeJS](https://nodejs.org/en/download/)，请先安装。

你还需要以下库：
 - grammy
 - ton
 - dotenv

你可以在终端中用一条命令安装它们。
```bash npm2yarn
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 开始吧！
我们项目的结构将如下所示：
```
src
    ├── bot
        ├── start.js
        ├── payment.js
    ├── services 
        ├── ton.js
    ├── app.js
.env
```
* `bot/start.js` & `bot/payment.js` - 用于telegram机器人的处理程序文件
* `src/ton.js` - 与TON相关的业务逻辑文件
* `app.js` - 用于初始化并启动机器人的文件


现在让我们开始编写代码吧！

## 配置
我们从`.env`开始。我们只需要在其中设置一些参数。

**.env**
```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

这里你需要填写前四行的值：
 - `BOT_TOKEN`是你的Telegram机器人令牌，可以在[创建机器人](https://t.me/BotFather)后获得。
 - `OWNER_WALLET`是你的项目钱包地址，将接受所有支付。你可以简单地创建一个新的TON钱包并复制其地址。
 - `API_KEY`是你从 TON Center 获得的API密钥，分别针对主网和测试网，可以通过[@tonapibot](https://t.me/tonapibot)/[@tontestnetapibot](https://t.me/tontestnetapibot)获得。
 - `NETWORK`是关于你的机器人将运行在哪个网络上 - 测试网或主网

配置文件就这些了，我们可以继续前进！

## TON Center API
在`src/services/ton.js`文件中，我们将声明一些函数，用于验证交易的存在并生成快速跳转到钱包应用进行支付的链接。

### 获取最新的钱包交易

我们的任务是从特定钱包中检查我们需要的交易是否存在。

我们将这样解决它：
1. 我们将接收到发往我们钱包的最后一批交易。为什么是我们的？在这种情况下，我们不必担心用户的钱包地址是什么，我们不必确认它是他的钱包，我们也不必将这个钱包存储在任何地方。
2. 排序并只保留入账交易
3. 我们将检查所有交易，每次都会校验注释和金额是否与我们拥有的数据相等
4. 庆祝我们的问题解决🎉

#### 获取最新交易

如果我们使用TON Center API，那么我们可以参考他们的[文档](https://toncenter.com/api/v2/)，找到一个理想解决我们问题的方法 - [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)

我们只需要一个参数就能获取交易 - 接受支付的钱包地址，但我们也会使用limit参数来限制交易发放到100条。

让我们尝试调用`EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N`地址的测试请求（顺带一提，这是TON基金会的地址）
```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```
很好，现在我们手头有了一份交易列表在["result"]中，现在让我们仔细看看1笔交易


```json
{
      "@type": "raw.transaction",
      "utime": 1667148685,
      "data": "*data here*",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32450206000003",
        "hash": "rBHOq/T3SoqWta8IXL8THxYqTi2tOkBB8+9NK0uKWok="
      },
      "fee": "106508",
      "storage_fee": "6508",
      "other_fee": "100000",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG",
        "destination": "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
        "value": "1000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32450206000002",
        "body_hash": "Fl+2CzHNgilBE4RKhfysLU8VL8ZxYWciCRDva2E19QQ=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "aGVsbG8g8J+Riw=="
        },
        "message": "hello 👋"
      },
      "out_msgs": []
    }
```

从这个json文件中，我们可以了解一些对我们有用的信息：

- 这是一笔入账交易，因为"out_msgs"字段为空
- 我们还可以获取交易的评论、发送者和交易金额

现在我们准备好创建一个交易检查器了

### 使用 TON

让我们先导入所需的TON库
```js
import { HttpApi, fromNano, toNano } from "ton";
```

让我们考虑如何检查用户是否发送了我们需要的交易。

一切都异常简单。我们只需排序我们钱包的入账交易，然后遍历最后100笔交易，如果找到一笔符合相同注释和金额的交易，那么我们就找到了我们需要的交易！

首先，让我们初始化http客户端，以方便使用TON
```js
export async function verifyTransactionExistance(toWallet, amount, comment) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";
  const httpClient = new HttpApi(
    endpoint,
    {},
    { apiKey: process.env.TONCENTER_TOKEN }
  );
```
这里我们根据配置中选择的网络简单地生成endpoint url。然后我们初始化http客户端。

所以，现在我们可以从所有者的钱包中获取最后100笔交易
```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

并过滤，仅保留入账交易（如果交易的out_msgs为空，我们保留它）
```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

现在我们只需遍历所有交易，只要comment和交易值匹配，我们就返回true。
```js
  for (let i = 0; i < incomingTransactions.length; i++) {
    let tx = incomingTransactions[i];
    // 如果交易中没有comment，则跳过
    if (!tx.in_msg.msg_data.text) {
      continue;
    }

    // 将交易值从nano转换
    let txValue = fromNano(tx.in_msg.value);
    // 获取交易comment
    let txComment = tx.in_msg.message

    if (txComment === comment && txValue === value.toString()) {
      return true;
    }
  }

  return false;
```
注意，值默认是以nanotons为单位，所以我们需要将其除以10亿，或者我们可以直接使用TON库中的`fromNano`方法。`verifyTransactionExistance`函数就是这些了！

现在我们可以创建生成快速跳转到钱包应用进行支付的链接的函数了。
```js
export function generatePaymentLink(toWallet, amount, comment, app) {
  if (app === "tonhub") {
    return `https://tonhub.com/transfer/${toWallet}?amount=${toNano(
      amount
    )}&text=${comment}`;
  }
  return `https://app.tonkeeper.com/transfer/${toWallet}?amount=${toNano(
    amount
  )}&text=${comment}`;
}
```
我们所需的只是将交易参数代入URL中。不要忘记将交易值转换为nano。

## Telegram 机器人

### 初始化

打开`app.js`文件并导入我们需要的所有处理程序和模块。
```js
import dotenv from "dotenv";
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";

import {
  startPaymentProcess,
  checkTransaction,
} from "./bot/handlers/payment.js";
import handleStart from "./bot/handlers/start.js";
```

让我们设置dotenv模块，以便舒适地使用我们在.env文件中设置的环境变量。
```js
dotenv.config();
```

之后我们创建一个将运行我们项目的函数。为了防止出现任何错误时我们的机器人停止，我们添加了这段代码。
```js
async function runApp() {
  console.log("Starting app...");

  // 处理所有错误的处理程序，为了防止机器人停止
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

现在初始化机器人和必要的插件。
```js
  // 初始化机器人
  const bot = new Bot(process.env.BOT_TOKEN);

  // 设置我们会话的初始数据
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // 安装会话插件
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```
这里我们使用了教程开始时我们创建的配置中的`BOT_TOKEN`。

我们初始化了机器人，但它还是空的。我们必须添加一些用于与用户互动的功能。
```js
  // 注册所有的处理程序
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```
对于命令/start，将执行handleStart函数。如果用户点击callback_data等于"buy"的按钮，我们将启动我们刚刚注册的"对话"。当我们点击callback_data等于"check_transaction"的按钮时，将执行checkTransaction函数。

我们所剩的就是启动我们的机器人并输出有关成功启动的日志。
```js
  // 启动机器人
  await bot.init();
  bot.start();
  console.info(`机器人@${bot.botInfo.username}正在运行`);
```

### 消息处理

#### /start 命令

我们从处理`/start`命令开始。当用户首次启动机器人或重新启动它时，将调用此函数。

```js
import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx) {
  const menu = new InlineKeyboard()
    .text("Buy dumplings🥟", "buy")
    .row()
    .url("Article with a detailed explanation of the bot's work", "/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-js/");

  await ctx.reply(
    `Hello stranger!
Welcome to the best Dumplings Shop in the world <tg-spoiler>and concurrently an example of accepting payments in TON</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```
这里我们首先从grammy模块导入InlineKeyboard。之后，在处理程序中我们创建了内联键盘，提供购买饺子的选项和文章链接（这里有点递归😁）。.row()代表将下一个按钮转移到新行。
之后，我们带着创建的键盘发送欢迎消息，文本中（重要的是，我在我的消息中使用HTML标记来装饰它）
欢迎消息可以是任何你想要的内容。

#### 支付过程

像往常一样，我们将从必要的导入开始我们的文件。

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```

之后，我们将创建一个startPaymentProcess处理程序，我们已经在app.js中注册了它以在按下某个按钮时执行。

在Telegram中，当你点击内联按钮时，会出现一个旋转的手表，为了移除它，我们响应回调。
```js
  await ctx.answerCallbackQuery();
```

之后，我们需要向用户发送一张饺子图片，询问他想要购买的饺子数量。并等待他输入这个数字。
```js
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/bad2fd69547432e16356f.jpg",
    {
      caption:
        "Send the number of portions of yummy dumplings you want buy\nP.S. Current price for 1 portion: 3 TON",
    }
  );

  // 等待用户输入数字
  const count = await conversation.form.number();
```
现在我们计算订单的总金额并生成一个随机字符串，我们将用该字符串来评论交易，并添加饺子后缀。
```js
  // 获取总成本：将份数数量乘以1份的价格
  const amount = count * 3;
  // 生成随机评论
  const comment = Math.random().toString(36).substring(2, 8) + "饺子";
```

我们将结果数据保存到会话中，以便我们可以在下一个处理程序中获取这些数据。
```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

我们生成快速支付的链接并创建一个内联键盘。
```js
const tonhubPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonhub"
  );
  const tonkeeperPaymentLink = generatePaymentLink(
    process.env.OWNER_WALLET,
    amount,
    comment,
    "tonkeeper"
  );

  const menu = new InlineKeyboard()
    .url("Click to pay in TonHub", tonhubPaymentLink)
    .row()
    .url("Click to pay in Tonkeeper", tonkeeperPaymentLink)
    .row()
    .text(`I sent ${amount} TON`, "check_transaction");
```
我们发送带有键盘的消息，在其中我们请求用户将交易发送到我们的钱包地址并附上随机生成的评论。
```js
  await ctx.reply(
    `
Fine, all you have to do is transfer ${amount} TON to the wallet <code>${process.env.OWNER_WALLET}</code> with the comment <code>${comment}</code>.

<i>WARNING: I am currently working on ${process.env.NETWORK}</i>

P.S. You can conveniently make a transfer by clicking on the appropriate button below and confirm the transaction in the offer`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

现在我们所需要做的就是创建一个检查交易是否存在的处理程序。
```js
export async function checkTransaction(ctx) {
  await ctx.answerCallbackQuery({
    text: "Wait a bit, I need to check the availability of your transaction",
  });

  if (
    await verifyTransactionExistance(
      process.env.OWNER_WALLET,
      ctx.session.amount,
      ctx.session.comment
    )
  ) {
    const menu = new InlineKeyboard().text("Buy more dumplings🥟", "buy");

    await ctx.reply("Thank you so much. Enjoy your meal!", {
      reply_markup: menu,
    });

    // 重置会话数据
    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("I didn't receive your transaction, wait a bit");
  }
}
```
这里我们所做的就是检查交易是否存在，如果存在，我们就告诉用户这个消息并重置会话中的数据。


### 启动机器人

要启动，请使用这个命令：

```bash npm2yarn
npm run app
```

如果你的机器人不能正确工作，与[此库](https://github.com/coalus/DumplingShopBot)的代码进行对比。如果无法解决，请随时写信给我。我的Telegram账号见下方。

## 参考资料

 - 作为[ton-footsteps/58](https://github.com/ton-society/ton-footsteps/issues/58)的一部分
 - 作者 Coalus（[Telegram @coalus](https://t.me/coalus), [Coalus on GitHub](https://github.com/coalus)）
 - [机器人源码](https://github.com/coalus/DumplingShopBot)
