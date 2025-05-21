---
description: At the end of the tutorial, you will write a beautiful bot that will be able to accept payments for your product directly in TON.
---
import Feedback from '@site/src/components/Feedback';

# Bot for selling dumplings

In this article, we'll create a simple Telegram bot for accepting payments in TON.

## 🦄 What it looks like

By the end of the tutorial, you will have a fully functional bot that can accept payments for your product directly in TON.

The bot will look like this:

![bot preview](/img/tutorials/js-bot-preview.jpg)

## 📖 What you'll learn
You'll learn how to:
 - Create a Telegram bot in NodeJS using grammY,
 - Work with the public TON Center API.

> Why use grammY?
grammY is a modern, high-level framework designed for fast and efficient development of Telegram bots using JavaScript, TypeScript, or Deno. It features excellent [documentation](https://grammy.dev) and an active community ready to help.


## ✍️ What you need to get started
Install [NodeJS](https://nodejs.org/en/download/) if you haven't yet.

You will also need the following libraries:
 - grammy,
 - ton,
 - dotenv.

You can install them with a single terminal command.
```bash npm2yarn
npm install ton dotenv grammy @grammyjs/conversations
```

## 🚀 Let's get started!
The structure of our project will look like this:
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
* `bot/start.js` & `bot/payment.js` - Handlers for the Telegram bot,
* `src/ton.js` - Business logic related to TON,
* `app.js` - Initializes and launches the bot.


Now let's start writing the code!

## Config
Let's begin with `.env`. You need to set the following parameters:

**.env**
```
BOT_TOKEN=
TONCENTER_TOKEN=
NETWORK=
OWNER_WALLET= 
```

Here you need to fill in the values in the first four lines:
 - `BOT_TOKEN` - Your Telegram bot token, obtained after [creating a bot](https://t.me/BotFather).
 - `OWNER_WALLET` - Your project's wallet address for receiving payments. You can create a new TON wallet and copy its address.
 - `API_KEY` - Your API key from TON Center, available via [@tonapibot](https://t.me/tonapibot)/[@tontestnetapibot](https://t.me/tontestnetapibot) for the Mainnet and Testnet, respectively.
 - `NETWORK` - The network on which your bot will operate: Testnet or Mainnet.

With the config file set up, we can move forward!

## TON Center API
In `src/services/ton.py`, we will define functions to verify transactions and generate payment links.

### Getting the latest wallet transactions

Our goal is to check whether a specific transaction exists in a wallet.

How to solve it:
1. Retrieve the latest transactions for our wallet. Why our wallet? In this case, we do not have to worry about what the user's wallet address is, we do not have to confirm that it is their wallet, and we do not have to store this wallet.
2. Filter incoming transactions only.
3. Iterate through transactions and verify if the comment and amount match our data.
4. Celebrate the solution to our problem.

#### Getting the latest transactions

Using the TON Center API, we can refer to their [documentation](https://toncenter.com/api/v2/) and call the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) method with just the wallet address. We also use the limit parameter to restrict the response to 100 transactions.

For example, a test request for `EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N` (this is the TON Foundation address):
```bash
curl -X 'GET' \
  'https://toncenter.com/api/v2/getTransactions?address=EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N&limit=100' \
  -H 'accept: application/json'
```
Great, now we have a list of transactions on hand in `["result"]`, now let's take a closer look at 1 transaction.


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

From this JSON file, we can extract some insights:

- The transaction is incoming, which is indicated by an empty `out_msgs` field.
- We can extract the transaction comment, sender, and amount.

Now, we're ready to create a transaction checker.

### Working with TON

Start with importing the required TON library:
```js
import { HttpApi, fromNano, toNano } from "ton";
```

Think about how to check if the user has sent the transaction we need.

It's all very simple. We can simply sort only incoming transactions to our wallet, and then go through the last 100 transactions, and if there is a transaction with the same comment and amount, then we have found the transaction we need!


Initialize the http client for convenient work with TON:
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
Here we simply generate the endpoint url based on which network is selected in the configuration. And after that we initialize the http client.

So, now we can get the last 100 transactions from the owner's wallet.
```js
const transactions = await httpClient.getTransactions(toWallet, {
    limit: 100,
  });
```

Filter, leaving only incoming transactions (if the out_msgs of the transaction is empty, we leave it).
```js
let incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );
```

Now we just have to go through all the transactions. If a matching transaction is found, we return true.
```js
  for (let i = 0; i < incomingTransactions.length; i++) {
    let tx = incomingTransactions[i];
    // Skip the transaction if there is no comment in it
    if (!tx.in_msg.msg_data.text) {
      continue;
    }

    // Convert transaction value from nano
    let txValue = fromNano(tx.in_msg.value);
    // Get transaction comment
    let txComment = tx.in_msg.message

    if (txComment === comment && txValue === value.toString()) {
      return true;
    }
  }

  return false;
```
Since values are in nanotons by default, we divide by 1 billion or use the `fromNano` method from the TON library.
And that's it for the `verifyTransactionExistance` function!

Finally, we create a function to generate a payment link by embedding the transaction parameters in a URL.
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
All we need is just to substitute the transaction parameters in the URL. Make sure to convert the transaction value to nano.


## Telegram bot

### Initialization

Open the `app.js` file and import all the handlers and modules we need.
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

Set up the dotenv module to work with environment variables:

```js
dotenv.config();
```

Now, define a function to run the bot. To prevent it from stopping due to errors, include:

```js
async function runApp() {
  console.log("Starting app...");

  // Handler of all errors, in order to prevent the bot from stopping
  process.on("uncaughtException", function (exception) {
    console.log(exception);
  });
```

Next, initialize the bot and the necessary plugins.
```js
  // Initialize the bot
  const bot = new Bot(process.env.BOT_TOKEN);

  // Set the initial data of our session
  bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
  // Install the conversation plugin
  bot.use(conversations());

  bot.use(createConversation(startPaymentProcess));
```
Here we use `BOT_TOKEN` from our configuration we created at the beginning of the tutorial.

We have initialized the bot, but it is still empty. We need to add some features to interact with the user.
```js
  // Register all handelrs
  bot.command("start", handleStart);
  bot.callbackQuery("buy", async (ctx) => {
    await ctx.conversation.enter("startPaymentProcess");
  });
  bot.callbackQuery("check_transaction", checkTransaction);
```
Reacting to the command/start, the handleStart function will be executed. If the user clicks on the button with callback_data equal to "buy", we will start our "conversation", which we registered just above. And when we click on the button with callback_data equal to `"check_transaction"`, we will execute the `checkTransaction` function.

Finally, launch the bot and output a log a success message.
```js
  // Start bot
  await bot.init();
  bot.start();
  console.info(`Bot @${bot.botInfo.username} is up and running`);
```

### Message handlers

#### /start Command

Let's begin with the `/start` command handler. This function is triggered when a user starts or restarts the bot.

```js
import { InlineKeyboard } from "grammy";

export default async function handleStart(ctx) {
  const menu = new InlineKeyboard()
    .text("Buy dumplings🥟", "buy")
    .row()
    .url("Article with a detailed explanation of the bot's work", "docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-js");

  await ctx.reply(
    `Hello stranger!
Welcome to the best Dumplings Shop in the world <tg-spoiler>and concurrently an example of accepting payments in TON</tg-spoiler>`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```
First, import the InlineKeyboard from the grammy module. Then, create an inline keyboard offering to buy dumplings and linking to this tutorial. 
The `.row()` method places the next button on a new line.
We send a welcome message (formatted with HTML) along with the keyboard. You can customize this message as needed.

#### Payment process

We begin by importing the necessary modules:

```js
import { InlineKeyboard } from "grammy";

import {
  generatePaymentLink,
  verifyTransactionExistance,
} from "../../services/ton.js";
```
After that, we will create a startPaymentProcess handler, which we have already registered in the `app.js`. This function is executed when a specific button is pressed.

To remove the spinning watch icon in Telegram, we acknowledge the callback before proceeding.

```js
  await ctx.answerCallbackQuery();
```
Next, we need to send the user a picture of dumplings, ask them to send the number of dumplings that they want to buy. Wait for the user to enter this number.
```js
  await ctx.replyWithPhoto(
    "https://telegra.ph/file/bad2fd69547432e16356f.jpg",
    {
      caption:
        "Send the number of portions of yummy dumplings you want buy\nP.S. Current price for 1 portion: 3 TON",
    }
  );

  // Wait until the user enters the number
  const count = await conversation.form.number();
```
Next, we calculate the total amount of the order and generate a random string that we will use for the transaction comment and add the postfix `"dumplings"`.
```js
  // Get the total cost: multiply the number of portions by the price of the 1 portion
  const amount = count * 3;
  // Generate random comment
  const comment = Math.random().toString(36).substring(2, 8) + "dumplings";
```

Save the resulting data to the session so that we can get this data in the next handler.
```js
  conversation.session.amount = amount;
  conversation.session.comment = comment;
```

We generate links for quick payment and create a built-in keyboard.
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
Send the message using the keyboard, in which ask the user to send a transaction to our wallet address with a randomly generated comment.

```js
  await ctx.reply(
    `
Fine, all you have to do is transfer ${amount} TON to the wallet <code>${process.env.OWNER_WALLET}</code> with the comment <code>${comment}</code>.

<i>WARNING: I am currently working on ${process.env.NETWORK}</i>

P.S. You can conveniently make a transfer by clicking on the appropriate button below and confirming the transaction in the offer`,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
```

Now all we have to do is create a handler to check for the presence of a transaction.
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

    // Reset the session data
    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("I didn't receive your transaction, wait a bit");
  }
}
```
Next, simply check for a transaction, and if it exists, notify the user and flush the data in the session.

### Start of the bot

To start the bot, use this command:

```bash npm2yarn
npm run app
```

If your bot isn't working correctly, compare your code with the code [from this repository](https://github.com/coalus/DumplingShopBot). If issues persist, feel free to contact me on Telegram. You can find my Telegram account below.

## References

 - Made for TON as a part of [ton-footsteps/58](https://github.com/ton-society/ton-footsteps/issues/58)
 - [Telegram @coalus](https://t.me/coalus), [Coalus on GitHub](https://github.com/coalus) - _Coalus_
 - [Bot sources](https://github.com/coalus/DumplingShopBot)

<Feedback />

