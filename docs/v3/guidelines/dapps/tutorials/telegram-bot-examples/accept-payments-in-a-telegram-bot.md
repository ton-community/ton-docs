---
description: In this article, we'll guide you through the process of accepting payments in a Telegram bot.
---

import Feedback from '@site/src/components/Feedback';

# Storefront bot with payments in TON

In this article, we'll guide you through the process of accepting payments in a Telegram bot.

## 📖 What you'll learn

In this article, you'll learn how to:

- Create a Telegram bot using Python and Aiogram,
- Work with the public TON Center API,
- Work with an SQlite database,
- How to accept payments in a Telegram bot by applying the knowledge from previous steps.

## 📚 Before we begin

Make sure you have installed the latest version of Python and the following packages:

- aiogram,
- requests.
- sqlite3.

## 🚀 Let's get started!

We'll follow this order:

1. Work with an SQlite database.
2. Work with the public TON API (TON Center).
3. Create a Telegram bot using Python and Aiogram.
4. Profit!

Let's create the following four files in our project directory:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## Config

In `config.json`, we store our bot token and public TON API key.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

In `config.json`, define whether you'll use use `Testnet` or `Mainnet`.

## Database

### Create a database

This example uses a local Sqlite database.

Create a file called `db.py`.

To work with the database, import sqlite3 module and some modules for handling time.

```python
import sqlite3
import datetime
import pytz
```

- `sqlite3`—module for working with sqlite database,
- `datetime`—module for working with time.
- `pytz`—module for working with timezones.

Next, establish a connection to the database and a cursor:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

If the database does not exist, it will be created automatically.

We need two tables:

#### Transactions:

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source`—payer's wallet address,
- `hash`—transaction hash,
- `value`—transaction value,
- `comment`—transaction comment.

#### Users:

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id`—Telegram user ID,
- `username`—Telegram username,
- `first_name`—Telegram user's first name,
- `wallet`—user wallet address.

The `users` table stores Telegram users along with their Telegram ID, @username,
first name, and wallet. The wallet is added to the database upon the first
successful payment.

The `transactions` table stores verified transactions.
To verify a transaction, we need a unique transaction hash, source, value, and comment.

To create these tables, we need to run the following function:

```python
cur.execute('''CREATE TABLE IF NOT EXISTS transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                        NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
)''')
locCon.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS users (
    id         INTEGER       UNIQUE
                            NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
)''')
locCon.commit()
```

This code will create the tables if they are not already created.

### Work with database

Let's analyze the process:
A user makes a transaction. How do we verify it? How do we ensure that the same transaction isn't confirmed twice?

Each transaction includes a `body_hash`, which allows us to easily check whether the transaction is already in the database.

We only add transactions that have been verified. The `check_transaction` function determines whether a given transaction is already in the database.

`add_v_transaction` adds transaction to the transactions table.

```python
def add_v_transaction(source, hash, value, comment):
    cur.execute("INSERT INTO transactions (source, hash, value, comment) VALUES (?, ?, ?, ?)",
                (source, hash, value, comment))
    locCon.commit()
```

```python
def check_transaction(hash):
    cur.execute(f"SELECT hash FROM transactions WHERE hash = '{hash}'")
    result = cur.fetchone()
    if result:
        return True
    return False
```

`check_user` verifies if the user exists in the database and adds them if not.

```python
def check_user(user_id, username, first_name):
    cur.execute(f"SELECT id FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()

    if not result:
        cur.execute("INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)",
                    (user_id, username, first_name))
        locCon.commit()
        return False
    return True
```

The user can store a wallet in the table. It is added with the first successful purchase. The `v_wallet` function checks if the user has an associated wallet. If not, it adds the wallet upon the user's first successful purchase.

```python
def v_wallet(user_id, wallet):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    if result[0] == "none":
        cur.execute(
            f"UPDATE users SET wallet = '{wallet}' WHERE id = '{user_id}'")
        locCon.commit()
        return True
    else:
        return result[0]
```

`get_user_wallet` simply retrieves the user's wallet.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` returns the user's payment history.
This function checks if the user has a wallet. If they do, it provides the list of their payments.

```python
def get_user_payments(user_id):
    wallet = get_user_wallet(user_id)

    if wallet == "none":
        return "You have no wallet"
    else:
        cur.execute(f"SELECT * FROM transactions WHERE source = '{wallet}'")
        result = cur.fetchall()
        tdict = {}
        tlist = []
        try:
            for transaction in result:
                tdict = {
                    "value": transaction[2],
                    "comment": transaction[3],
                }
                tlist.append(tdict)
            return tlist

        except:
            return False
```

## API

_We can interact with the blockchain using third-party APIs provided by network members. These services allow developers to bypass the need their own node and customize their API._

### Required requests

What do we need to confirm that a user has transferred the required amount?

We simply need to check the latest incoming transfers to our wallet and find a transaction from the right address with the right amount (and possibly a unique comment).
For this, TON Center provides the `getTransactions` method.

### getTransactions

By default, this method retrieves the last 10 transactions. However, we can request more, though this slightly increases the response time. In most cases, requestin additional transactions is unnecessary.

If more transactions are required, each transaction includes `lt` and `hash`. We can fetch, for example, the last 30 transactions. If the required transaction is not found, we can take `lt` and `hash` of the last transaction in the list and include them in a new request.

This allows us to retrieve the next 30 transactions, and so on.

For example, consider the wallet in the test network `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`.

Using a [query](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&to_lt=0&archival=true) returns a response containing two transactions.
Note that some details have been omitted for clarity.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1944556000003",
        // highlight-next-line
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "message": "Sea breeze 🌊"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1943166000003",
        // highlight-next-line
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    }
  ]
}
```

By adding `lt` and `hash` to the query, we can retrieve the next two two transactions in sequence. That is, instead of getting the first and second transactions, we will receive the second and third.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "message": "Second"
      },
      "out_msgs": []
    }
  ]
}
```

The request will look like as follows [this.](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&lt=1943166000003&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D&to_lt=0&archival=true)

We will also need a method `detectAddress`.

Here is an example of a Tonkeeper wallet address on Testnet: `kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`. If we look for the transaction in the explorer, the address appears as: `EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`.

This method provides us with the correctly formatted address.

```json
{
  "ok": true,
  "result": {
    "raw_form": "0:b3409241010f85ac415cbf13b9b0dc6157d09a39d2bd0827eadb20819f067868",
    "bounceable": {
      "b64": "EQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
      // highlight-next-line
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    }
  }
}
```

Additionally, we need `b64url`, which allows us to validate the user's address.

Basically, that's all we need.

### API requests and what to do with them

Now, let's move to the IDE andreate the `api.py` file.

Import the necessary libraries.

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests`—to make requests to the API,
- `json`—to work with JSON,
- `db`—to work with our sqlite database.

Let's create two variables to store the base URLs for our requests.

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

We get all API tokens and wallets from the config.json file.

```python
# Find out which network we are working on
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']
```

Depending on the network, we take the necessary data.

```python
if WORK_MODE == "mainnet":
    API_BASE = MAINNET_API_BASE
    API_TOKEN = MAINNET_API_TOKEN
    WALLET = MAINNET_WALLET
else:
    API_BASE = TESTNET_API_BASE
    API_TOKEN = TESTNET_API_TOKEN
    WALLET = TESTNET_WALLET
```

Our first request function `detectAddress`.

```python
def detect_address(address):
    url = f"{API_BASE}detectAddress?address={address}&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    try:
        return response['result']['bounceable']['b64url']
    except:
        return False
```

At the input, we have the estimated address, and at the output, we have either the "correct" address necessary for us to do further work or False.

You may notice that an API key has appeared at the end of the request. It is needed to remove the limit on the number of requests to the API. Without it, we are limited to one request per second.

Here is next function for `getTransactions`:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

This function returns the last 30 transactions for our `WALLET`.

The `archival=true` parameter ensures that transactions are retrieved from a node with a complete blockchain history.

At the output, we get a list of transactions, such as `[{0},{1},...,{29}]` which are represented as a list of dictionaries.
And finally the last function:

```python
def find_transaction(user_wallet, value, comment):
		# Get the last 30 transactions
    transactions = get_address_transactions()
    for transaction in transactions:
				# Select the incoming "message" - transaction
        msg = transaction['in_msg']
        if msg['source'] == user_wallet and msg['value'] == value and msg['message'] == comment:
						# If all the data match, we check that this transaction
						# we have not verified before
            t = db.check_transaction(msg['body_hash'])
            if t == False:
								# If not, we write in the table to the verified
								# and return True
                db.add_v_transaction(
                    msg['source'], msg['body_hash'], msg['value'], msg['message'])
                print("find transaction")
                print(
                    f"transaction from: {msg['source']} \nValue: {msg['value']} \nComment: {msg['message']}")
                return True
						# If this transaction is already verified, we check the rest, we can find the right one
            else:
                pass
		# If the last 30 transactions do not contain the required one, return False
		# Here you can add code to see the next 29 transactions
		# However, within the scope of the Example, this would be redundant.
    return False
```

At the input, we get the correct wallet address, amount and comment. If the expected incoming transaction is found, the output is True; otherwise, it is False.

## Telegram bot

First, let's establish the bot's foundation.

### Imports

In this part, we will import the required libraries.

From `aiogram` we need `Bot`, `Dispatcher`, `types` and `executor`.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` is needed for the temporary storage of information.

`FSMContext`, `State`, and `StatesGroup` are needed for working with the state machine.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json` is needed to work with json files. `logging` is needed to log errors.

```python
import json
import logging
```

`api` and `db` are our own files which we will fill in later.

```python
import db
import api
```

### Config setup

It is recommended to store data such as `BOT_TOKEN` and wallet addresses for receiving payments in a separate file called `config.json` for convenience.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

#### Bot token

`BOT_TOKEN` is the Telegram bot token obtained from [@BotFather](https://t.me/BotFather)

#### Working mode

The `WORK_MODE` key defines whether the bot operates in the test or main network; `testnet` or `mainnet` respectively.

#### API tokens

API tokens for `*_API_TOKEN` can be obtained from the [TON Center](https://toncenter.com/) bots:

- Mainnet — [@tonapibot](https://t.me/tonapibot)
- Testnet — [@tontestnetapibot](https://t.me/tontestnetapibot)

#### Connecting the config to our bot

Next, we complete the bot setup by retrieving the bot token from `config.json` :

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
    # highlight-next-line
    BOT_TOKEN = config_json['BOT_TOKEN']
		# put wallets here to receive payments
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
		# By default, the bot will run on the testnet
    WALLET = TESTNET_WALLET
```

### Logging and bot setup

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### States

States allow us to devide the bot workflow into stages, each designated for a specific task.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

For details and examples, refer to the [Aiogram documentation](https://docs.aiogram.dev/en/latest/).

### Message handlers

This is the part where we will write the bot interaction logic.

We'll be using two types of handlers:

- `message_handler` is used to handle messages from users,
- `callback_query_handler` is used to handle callbacks from inline keyboards.

If we want to handle a message from the user, we will use `message_handler` by placing `@dp.message_handler` decorator above the function. In this case, the function will be called when the user sends a message to the bot.

In the decorator, we can specify the conditions under which the function will be called. For example, if we want the function to be called only when the user sends a message with the text `/start`, then we will write the following:

```
@dp.message_handler(commands=['start'])
```

Handlers need to be assigned to an async function. In this case, we will use  `async def` syntax. The `async def` syntax is used to define the function that will be called asynchronously.

#### /start

Let's start with `/start` command handler.

```python
@dp.message_handler(commands=['start'], state='*')
async def cmd_start(message: types.Message):
    await message.answer(f"WORKMODE: {WORK_MODE}")
    # check if user is in database. if not, add him
    isOld = db.check_user(
        message.from_user.id, message.from_user.username, message.from_user.first_name)
    # if user already in database, we can address him differently
    if isOld == False:
        await message.answer(f"You are new here, {message.from_user.first_name}!")
        await message.answer(f"to buy air send /buy")
    else:
        await message.answer(f"Welcome once again, {message.from_user.first_name}!")
        await message.answer(f"to buy more air send /buy")
    await DataInput.firstState.set()
```

In the decorator of a handler, you may see `state='*'`, meaning the handler will be triggered regardless of the bot's state. If we want the handler to activate only in a specific state, we specify it, such as `state=DataInput.firstState`, ensuring the handler runs only when the bot is in `firstState`.

After the user sends `/start` command, the bot will check if the user is in database using `db.check_user` function. If not, it will add him. This function will also return the bool value and we can use it to address the user differently. After that, the bot will set the state to `firstState`.

#### /cancel

The /cancel command returns the bot to `firstState`.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

#### /buy

And, of course, there is a `/buy` command handler. In this example, we sell different types of air and use the reply keyboard to choose the type.

```python
# /buy command handler
@dp.message_handler(commands=['buy'], state=DataInput.firstState)
async def cmd_buy(message: types.Message):
    # reply keyboard with air types
    keyboard = types.ReplyKeyboardMarkup(
        resize_keyboard=True, one_time_keyboard=True)
    keyboard.add(types.KeyboardButton('Just pure 🌫'))
    keyboard.add(types.KeyboardButton('Spring forest 🌲'))
    keyboard.add(types.KeyboardButton('Sea breeze 🌊'))
    keyboard.add(types.KeyboardButton('Fresh asphalt 🛣'))
    await message.answer(f"Choose your air: (or /cancel)", reply_markup=keyboard)
    await DataInput.secondState.set()
```

So, when a user sends `/buy` command, the bot sends him a reply keyboard with air types. After the user chooses the type of air, the bot will set the state to `secondState`.

This handler will work only when `secondState` is set and will be waiting for a message from the user with the air type.  In this case, we need to store the air type that the user choses, so we pass FSMContext as an argument to the function.

FSMContext is used to store data in the bot's memory. We can store any data in it but this memory is not persistent, so if the bot is restarted, the data will be lost. But it's good to store temporary data in it.

```python
# handle air type
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Just pure 🌫":
        await state.update_data(air_type="Just pure 🌫")
    elif message.text == "Fresh asphalt 🛣":
        await state.update_data(air_type="Fresh asphalt 🛣")
    elif message.text == "Spring forest 🌲":
        await state.update_data(air_type="Spring forest 🌲")
    elif message.text == "Sea breeze 🌊":
        await state.update_data(air_type="Sea breeze 🌊")
    else:
        await message.answer("Wrong air type")
        await DataInput.secondState.set()
        return
    await DataInput.WalletState.set()
    await message.answer(f"Send your wallet address")
```

Use...

```python
await state.update_data(air_type="Just pure 🌫")
```

...to store the air type in FSMContext. After that, we set the state to `WalletState` and ask the user to send their wallet address.

This handler activates only in WalletState, expecting a valid wallet address.

Consider the next handler. It may seem complex, but it isn’t. First, we verify whether the message contains a wallet address of the correct length using `len(message.text) == 48`. Then, we call the `api.detect_address` function to validate the address. This function also returns the standardized *correct* address, which is stored in the database.

After that, we get the air type from FSMContext using `await state.get_data()` and store it in  `user_data` variable.

Now we have all the data required for the payment process. We just need to generate a payment link and send it to the user. Let's use the inline keyboard.

The bot provides three payment buttons:

- TON wallet,
- Tonhub,
- Tonkeeper.

These buttons are advantageous of special buttons because they guide users to install a wallet if they don't have one

You are free to use whatever you want.

And we need a button that the user will press after tmaking a transaction, allowing the bot to verify the payment.

```python
@dp.message_handler(state=DataInput.WalletState)
async def user_wallet(message: types.Message, state: FSMContext):
    if len(message.text) == 48:
        res = api.detect_address(message.text)
        if res == False:
            await message.answer("Wrong wallet address")
            await DataInput.WalletState.set()
            return
        else:
            user_data = await state.get_data()
            air_type = user_data['air_type']
            # inline button "check transaction"
            keyboard2 = types.InlineKeyboardMarkup(row_width=1)
            keyboard2.add(types.InlineKeyboardButton(
                text="Check transaction", callback_data="check"))
            keyboard1 = types.InlineKeyboardMarkup(row_width=1)
            keyboard1.add(types.InlineKeyboardButton(
                text="Ton Wallet", url=f"ton://transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonkeeper", url=f"https://app.tonkeeper.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonhub", url=f"https://tonhub.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            await message.answer(f"You choose {air_type}")
            await message.answer(f"Send <code>1</code> toncoin to address \n<code>{WALLET}</code> \nwith comment \n<code>{air_type}</code> \nfrom your wallet ({message.text})", reply_markup=keyboard1)
            await message.answer(f"Click the button after payment", reply_markup=keyboard2)
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Wrong wallet address")
        await DataInput.WalletState.set()
```

#### /me

One last message handler is `/me`. It shows the user's payments.

```python
# /me command handler
@dp.message_handler(commands=['me'], state="*")
async def cmd_me(message: types.Message):
    await message.answer(f"Your transactions")
    # db.get_user_payments returns list of transactions for user
    transactions = db.get_user_payments(message.from_user.id)
    if transactions == False:
        await message.answer(f"You have no transactions")
    else:
        for transaction in transactions:
            # we need to remember that blockchain stores value in nanotons. 1 toncoin = 1000000000 in blockchain
            await message.answer(f"{int(transaction['value'])/1000000000} - {transaction['comment']}")
```

### Callback handlers

Callback data is embedded in buttons, allowing the bot to recognize user actions.

For example, the “Payment Confirmed” button sends the callback "check", which the bot must process.

Callback handlers are very similar to message handlers but they have `types.CallbackQuery` as an argument instead of `message`. Function decorator is also different.

```python
@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # send notification
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    result = api.find_transaction(source, value, comment)
    if result == False:
        await call.answer("Wait a bit, try again in 10 seconds. You can also check the status of the transaction through the explorer (tonscan.org/)", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("Transaction is confirmed \n/start to restart")
        await state.finish()
        await DataInput.firstState.set()
```

In this handler we get user data from FSMContext and use `api.find_transaction` to check if the transaction was successful. If so, the wallet address is stored in the database, and the bot notifies the user. After that, the user can check their transaction anytime using `/me`.

### Finalizing main.py

At the end, don't forget:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

This part is needed to start the bot.
In `skip_updates=True` we specify that we do not want to process old messages. But if you want to process all messages, you can set it to `False`.

:::info

All code of `main.py` can be found [here](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py).

:::

## Bot in action

Congratulations! The bot is ready. You can test it!

Steps to run the bot:

1. Fill in the `config.json` file.
2. Run `main.py`.

All files must be in the same folder. To start the bot, you need to run the `main.py` file. You can do it in your IDE or in the terminal like this:

```
python main.py
```

If errors occur, check them in the terminal. Maybe you have missed something in the code.

Example of a working bot [@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## References

- Made for TON as part of [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- [Telegram @Revuza](https://t.me/revuza), [LevZed on GitHub](https://github.com/LevZed) - _Lev_

<Feedback />

