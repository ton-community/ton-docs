# Accepting payments in a telegram bot

## 👋 Welcome, dev!

It's great to have you here. In this article, we'll guide you through the process of accepting payments in a Telegram bot.

## 📖 What you'll learn

In this article, you'll learn how to:

- create a Telegram bot using Python + Aigram
- work with public TON api
- work with SQlite database

...and finnaly: how to accept payments in a Telegram bot using knowledge from previous steps.

## 📚 Before we begin

Make sure that you have installed latest version of Python, and have installed the following packages:

- aiogram
- requests
- sqlite3

## 🚀 Let's get started!

We'll folowing the order above:

1. Create a Telegram bot using Python + Aigram
2. Work with public TON api
3. Work with SQlite database
4. Profit!

Let's create four files:

- `main.py`

- `api.py`

- `db.py`

- `config.json`

## Config

In `config.json` we'll store our bot token and our public TON api key:

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

Also, in `config.json` we decide which network we'll use: `testnet` or `mainnet`.

## Database

### Create a database

This example uses a local Sqlite database.

Create `db.py`.

To start working with the database, we need to import the sqlite3 module,
and some modules for working with time:

```python
import sqlite3
import datetime
import pytz
```

- `sqlite3` - module for working with sqlite database
- `datetime` - module for working with time
- `pytz` - module for working with timezones

Next, we need to create a connection to the database and a cursor for working with it:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

If the database does not exist, it will be created automatically.

Now we can create a tables.

We have 2 tables:

**Transactions:**

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source` - payer's wallet address
- `hash` - transaction hash
- `value` - transaction value
- `comment` - transaction comment

**Users:**

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id` - telegram user id
- `username` - telegram username
- `first_name` - telegram user first name
- `wallet` - user wallet address

In the `users` table we store users :). Their telegram id, @username,
first name and wallet. The wallet is added to the database on the first
successful payment.

The `transactions` table stores verified transactions.
To verify a transaction, we need hash, source, value and comment.

To create these tables, we need to run the following code:

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

This code, needs to be run only once, when the database is created.

### Work with database

Let's analyze the situation:
The user made a transaction. How to verify it? How to make sure that the same transaction is not confirmed twice?

There is a body_hash in transactions, with the help of which we can easily understand whether there is a transaction in the database or not.

We add transactions to the database in which we are “sure”. And the `check_transaction` function checks whether the found transaction is in the database or not.

`add_v_transaction` - add transaction to transactions table.

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

`check_user` checks if the user is in the database and if not, adds it

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

The user can store a wallet in the table. It is added with the first successful purchase. The `v_wallet` function checks if the user has an associated wallet. If there is, then returns it. If not, then add.

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

`get_user_wallet` simply returns the user's wallet.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` returns the user's payments list.
This function cheks if the user has a wallet. If has, then returns payments list.

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

_We have the ability to interact with the blockchain using third-party APIs provided by some network members. With these services, developers can skip the step of running their own node and customizing their API._

### Required Requests

In fact, what do we need to confirm that the user has transferred the required amount to us?

We just need to look at the latest incoming transfers to our wallet and among them find a transaction from the right address, with the right amount (and possibly a unique comment).
For all this, toncenter has a `getTransactions` method.

### getTransactions

Applying it, by default, we will get the last 10 transactions. However, we can also indicate that we need more, but this will slightly increase the time of a response. And, most likely, you do not need so much.

If you want more, then each transaction has `lt` and `hash` . You can look at, for example, 30 transactions and if the right one was not found among them, then take `lt` and `hash` from the last one and add them to the request.

So you get the next 30 transactions and so on.

For example, there is a wallet in the test network `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`, it has some transactions:

Using a [query](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&to_lt=0&archival=true) we will get the response, that contains 2 transactions (some of the information that is not needed now has been hidden, you can see the full answer at the link above):

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

We have received the last two transactions of this address. When adding `lt` and `hash`: to the query, we will again receive two transactions, however, the second one will become the next one in a row. That is - we will get the second and third transactions of this address:

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

The request will look like this - [link](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&lt=1943166000003&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D&to_lt=0&archival=true)

We will also need a method `detectAddress`.

Not sure about mainnet, but on testnet, my tonkeeper wallet address is:
`kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`, and when I look at the transaction in the explorer, instead of my address there
`EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`.
This method returns us the “right” address:

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

We need `b64url`.

Also, this method helps us to check the correctness of the address sent by the user.

For the most part, that's all we need.

### API requests and what to do with them

Let's go back to the IDE. Create file `api.py`.

Import the necessary libraries:

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests` - to make requests to the API
- `json` - to work with json
- `db` - to work with our sqlite database

Let's create two variables for storing start of the requests:

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

Get all api tokens and wallets from the config.json file:

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

Depending on the network, we take the necessary data:

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

Our first request function `detectAddress`:

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

At the input, we have the estimated address, and at the output, either the “correct” address necessary for us for further work, or False.

You may notice that an API key has appeared at the end of the request. It is needed to remove the limit on the number of requests to the API. Without it, we are limited to one request per second.

Next function for `getTransactions`:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

This function returns the last 30 transactions for our `WALLET`.

Here you can see `archival=true`, it is needed so that we take transactions only from a node with a complete history of the blockchain.

At the output, we get a list of transactions - [{0},{1},{…},{29}]. List of dictionaries in short.

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

At the input is the “correct” wallet address, amount and comment. The output is True if the desired incoming transaction is found and False if not.

## Telegram bot

First, let's create the basis for the bot.

### Imports

In this part, we will import the necessary libraries.

From `aiogram` we need `Bot`, `Dispatcher`, `types` and `executor`.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` is needed for temporary storage of information.

`FSMContext`, `State` and `StatesGroup` are needed for working with the state machine.

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

`api` and `db` are our own files, which we will fill later.

```python
import db
import api
```

### Config

For convenience, I suggest storing data such as `BOT_TOKEN` and your wallets for receiving payments in the separate file `config.json`:

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

`BOT_TOKEN` - your Telegram bot token from [@BotFather](https://t.me/BotFather)

In the `WORK_MODE` key, we will define the bot's mode of operation - in the test or main network: `testnet` or `mainnet`, respectively.

Api tokens for `*_API_TOKEN` can be obtained in the [toncenter](https://toncenter.com/) bots:

- for mainnet - [@tonapibot](https://t.me/tonapibot)

- for testnet - [@tontestnetapibot](https://t.me/tontestnetapibot)

Next, we finish setting up the bot:

Get the token for the bot to work, from the `config.json` :

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

We need "States" to split the bot workflow into stages. We can specialize each stage for a specific task.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

I won't go any deeper. For details and examples, I suggest looking into the [Aiogram documentation](https://docs.aiogram.dev/en/latest/).

### Message handlers:

So, we have finally come to the part where we will write the bot interaction logic.

We'll be using two types of handlers:

- `message_handler` is used to handle messages from the user.
- `callback_query_handler` is used to handle callbacks from inline keyboards.

So if we want to handle a message from the user, we will use `message_handler` by placing the `@dp.message_handler` decorator above the function. In this case, the function will be called when the user sends a message to the bot.

In the decorator, we can specify the conditions under which the function will be called. For example, if we want the function to be called only when the user sends a message with the text `/start`, then we will write:

```
@dp.message_handler(commands=['start'])
```

Handlers need to be assigned to a async function. In this case, we will use the `async def` syntax. The `async def` syntax is used to define a function that will be called asynchronously.

So, let's start with the `/start` command handler:

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

in decorator of this handler we see `state='*'`. This means that this handler will be called regardless of the state of the bot. If we want the handler to be called only when the bot is in a specific state, we will write `state=DataInput.firstState`. In this case, the handler will be called only when the bot is in the `firstState` state.

After user sends `/start` command, the bot will check if the user is in the database, using `db.check_user` function. If not, it will add him. Also, this function will return bool value and we can use it to address the user differently. After that the bot will set the state to `firstState`.

Next is the /cancel command handler. It needed to return to the `firstState` state.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

And, of course, the `/buy` command handler. In this example we will sell air of different types. So, we will use reply keyboard to choose the type of air.

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

So when user sends `/buy` command, the bot will send him a reply keyboard with air types. After user chooses the type of air, the bot will set the state to `secondState`.

This habdler will work only when `secondState` is set, and will be waiting for a message from the user, with air type. In this case, we need to store air type, that user chose, so we pass FSMContext as an argument to the function.

FSMContext is used to store data in the bot's memory. We can store any data in it, but this memory is not persistent, so if the bot is restarted, the data will be lost. But it's good to store temporary data in it.

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

We use...

```python
await state.update_data(air_type="Just pure 🌫")
```

...to store air type in FSMContext. After that we set the state to `WalletState` and ask the user to send his wallet address.

This handler will work only when `WalletState` is set, and will be waiting for a message from the user, with wallet address.

So, next handler seems to be very complicated, but it's not. Firstly we check if the message is a valid wallet address using `len(message.text) == 48` because wallet address is 48 characters long. After that we use `api.detect_address` function to check if the address is valid. As you remember from API part, this fucntion also returns "Correct" address, that will be stored in the database.

After that, we get air type from FSMContext using `await state.get_data()` and store it in `user_data` variable.

So, we have all the data required for the payment process. We just need to generate a payment link and send it to the user. So, let's use inline keyboard.

I will create 3 buttons for payment:

- for official Ton Wallet
- for TonHub
- for TonKeeper

You may use any you want.

And we need button, that user will press after transaction, so we can chek if the payment was successful.

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
            await message.answer(f"Send <code>1</code> toncoin to address \n<code>{WALLET}</code> \nwith comment \n<code>{air_type}</code> \nfrom your wallet ({message.text}) \nton://transfer/{WALLET}?amount=1000000000&text={air_type}", reply_markup=keyboard1)
            await message.answer(f"Click the button after payment", reply_markup=keyboard2)
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Wrong wallet address")
        await DataInput.WalletState.set()
```

One last message handler, that we need is for `/me` command. It will show user his payments.

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

### Callback handlers:

In buttons we can set callback data, that will be sent to the bot when user presses the button. We set callback data to "check" in the button, that user will press after transaction. So, we need to handle this callback.

Callback handlers are very similar to message handlers, but they have `types.CallbackQuery` as an argument instead of `message`. Function decorator is also different.

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

In this handler we get user data from FSMContext, and use `api.find_transaction` function to check if the transaction was successful. If it was, we store wallet address in the database, and send notification to the user. After that, user can find his transactions using `/me` command.

### Last part of `main.py`

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

We finally did it! You should now have a working bot. You can test it!

All files must be in the same folder. To start the bot, you need to run `main.py` file. You can do it in your IDE, or in terminal like this:

```
python main.py
```

If you have any errors, you can check them in the terminal. Maybe you missed something in the code.

## References

Made for TON as part of [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)

By Lev:

- tg: [@Revuza](https://t.me/revuza)
- github: https://github.com/LevZed
