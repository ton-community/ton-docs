# Accepting payments in a telegram bot

### ton footstep 8

by [@Revuza](https://t.me/revuza)

## Beginning

We have the ability to interact with the blockchain using third-party APIs provided by some network members. With these services, developers can skip the step of running their own node and customizing their API.

This article will describe the process of creating a telegram bot capable of verifying payments in the TON network using a third-party api provided by the TON Center.

We will create a bot using the aiogram Python library. Sqlite will be used as a test database. In addition to the article, I will show you how to set up postgres heroku. The bot will be deployed from the repository to the heroku platform.

I'm using VS code.

## Telegram bot

First, let's create the basis for the bot.

Let's create three files:

`main.py`

`api.py`

`db.py`

Content of `main.py`

```python
# Import modules from aiogram necessary for our bot
import logging
from aiogram import Bot, Dispatcher, executor, types
# MemoryStorage is needed for temporary storage of information
from aiogram.contrib.fsm_storage.memory import MemoryStorage
# FSM to break down the payment process into separate steps
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup

import json

# As well as our modules in which there will be code
# to interact with API and database
import db
import api
```

For convenience, I suggest storing data such as `BOT_TOKEN` or your wallet for receiving payments in the separate file `config.json`:

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

In the `WORK_MODE` key, we will define the bot's mode of operation - in the test or main network: `testnet` or `mainnet`, respectively.

Api tokens for `*_API_TOKEN` can be obtained in the [toncenter](https://toncenter.com/) bots:

for mainnet - [@tonapibot](https://t.me/tonapibot)

for testnet - [@tontestnetapibot](https://t.me/tontestnetapibot)

Next, to get the token for the bot to work, we read it from the file:

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
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

Next, we finish setting up the bot:

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())

class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

At the end, don't forget:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

This code block is located at the very end of the file, after all handlers.

I won't go any deeper. For details and examples, I suggest looking into the [Aiogram documentation](https://docs.aiogram.dev/en/latest/).

### All code of `main.py`.

```python
import logging
from aiogram import Bot, Dispatcher, executor, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup

import json

import db
import api

with open('config.json', 'r') as f:
    config_json = json.load(f)
    BOT_TOKEN = config_json['BOT_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
    WALLET = TESTNET_WALLET

# Configure logging
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
# storage=MemoryStorage() needed for FSM
dp = Dispatcher(bot, storage=MemoryStorage())

class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()

# /start command handler
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

@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()

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

# handle air type
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Just pure 🌫":
        await state.update_data(air_type="Just pure 🌫")
        await DataInput.WalletState.set()
    elif message.text == "Fresh asphalt 🛣":
        await state.update_data(air_type="Fresh asphalt 🛣")
        await DataInput.WalletState.set()
    elif message.text == "Spring forest 🌲":
        await state.update_data(air_type="Spring forest 🌲")
        await DataInput.WalletState.set()
    elif message.text == "Sea breeze 🌊":
        await state.update_data(air_type="Sea breeze 🌊")
        await DataInput.WalletState.set()
    else:
        await message.answer("Wrong air type")
        await DataInput.secondState.set()
        return
    await message.answer(f"Send your wallet address")

# handle wallet address

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

@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # send notification
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    result = api.find_transaction(source, value, comment)
    if result == False:
        await call.answer("Wait a bit, try again in 10 seconds. You can also check the status of the transaction through the explorer (ton.sh/)", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("Transaction is confirmed \n/start to restart")
        await state.finish()
        await DataInput.firstState.set()

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

## API

### Required Requests

In fact, what do we need to confirm that the user has transferred the required amount to us? We just need to look at the latest incoming transfers to our wallet and among them find a transaction from the right address, with the right amount (and possibly a unique comment). For all this, toncenter has a getTransactions method.

Applying it, by default, we will get the last 10 transactions. However, we can also indicate that we need more. However, the more you request, the longer the response will take. And, most likely, you do not need so much. If you want more, then each transaction has `lt` and `hash` . You can look at, for example, 30 transactions and if the right one was not found among them, then take `lt` and `hash` from the last one and add them to the request - getting the next 30 transactions and so on.

For example, there is a wallet in the test network `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`, it has only 4 transactions:

Using a query `https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&to_lt=0&archival=true` we will get the following response:

```json
{
  "ok": true,
  "result": [
    {
      "@type": "raw.transaction",
      "utime": 1658130319,
      "data": "te6cckECBQEAAR4AA7FxUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NAAABxMCR0wOHEhCqfuVgP9z981Ltb+JWyDaTHSn+Q0gYXot3RAQjGQAAAcRtuBuDYtUPjwAAAkKAECAwEBoAQAgnL4IEWB5LE/vWXLudaYwd8il06Rzrek5pd9TCOm8FDCRlEx0oZZ4VOvcucIihMYSiqChFZPUftTeQSXkXfpjbrGABEMSEkO5rKAASAA10gBZoEkggIfC1iCuX4nc2G4wq+hNHOlehBP1bZBAz4M8NEABUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NQ7msoAAYUWGAAAAOJgSOmBMWqHx4AAAAAKbKwkDE5MrK9MpB4T8ZFQBMtbAk=",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "1944556000003",
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "fee": "33",
      "storage_fee": "33",
      "other_fee": "0",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "1944556000002",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "U2VhIGJyZWV6ZSDwn4yK"
        },
        "message": "Sea breeze 🌊"
      },
      "out_msgs": []
    },
    {
      "@type": "raw.transaction",
      "utime": 1658126823,
      "data": "te6cckECBQEAASMAA7NxUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NAAABxG24G4OTlT0DAhE0aELXSEcncwE49P/9vECBbl31+UWLCvVJqgAAAa2t3liDYtUB5wAABBI2gBAgMBAaAEAIJyKqjqNU0guBAa3/ENp+bnQLlnXhkASZW2OWeFM5DakO/4IEWB5LE/vWXLudaYwd8il06Rzrek5pd9TCOm8FDCRgATDIJGyQ7msoABIADdSAFmgSSCAh8LWIK5fidzYbjCr6E0c6V6EE/VtkEDPgzw0QAFSjM6ra7zQdkpHATjToo2nahWdYDHY5s4dWNxwdaf81DuaygABhRYYAAAA4jbcDcExaoDzgAAAAApuDk0tzOQMze5Mrm6EHhPxllAGLZ+6g==",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "fee": "2331",
      "storage_fee": "2331",
      "other_fee": "0",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "1943166000002",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "U3ByaW5nIGZvcmVzdCDwn4yy"
        },
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
      "@type": "raw.transaction",
      "utime": 1658126823,
      "data": "te6cckECBQEAASMAA7NxUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NAAABxG24G4OTlT0DAhE0aELXSEcncwE49P/9vECBbl31+UWLCvVJqgAAAa2t3liDYtUB5wAABBI2gBAgMBAaAEAIJyKqjqNU0guBAa3/ENp+bnQLlnXhkASZW2OWeFM5DakO/4IEWB5LE/vWXLudaYwd8il06Rzrek5pd9TCOm8FDCRgATDIJGyQ7msoABIADdSAFmgSSCAh8LWIK5fidzYbjCr6E0c6V6EE/VtkEDPgzw0QAFSjM6ra7zQdkpHATjToo2nahWdYDHY5s4dWNxwdaf81DuaygABhRYYAAAA4jbcDcExaoDzgAAAAApuDk0tzOQMze5Mrm6EHhPxllAGLZ+6g==",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "fee": "2331",
      "storage_fee": "2331",
      "other_fee": "0",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "1943166000002",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "U3ByaW5nIGZvcmVzdCDwn4yy"
        },
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    },
    {
      "@type": "raw.transaction",
      "utime": 1657873517,
      "data": "te6cckECBQEAARUAA7FxUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NAAABra3eWINHKamCzNyhJYhx3LFjT1LoOSb8t8/BKZD64tdlEozSkwAAAa2sQlvDYtEkbQAAAgKAECAwEBoAQAgnIWNBaoz9t25kiF2dzOj2M7gKcODZM65K9V66Bee1OTpSqo6jVNILgQGt/xDafm50C5Z14ZAEmVtjlnhTOQ2pDvABEMQEkO5rKAASAAxUgBZoEkggIfC1iCuX4nc2G4wq+hNHOlehBP1bZBAz4M8NEABUozOq2u80HZKRwE406KNp2oVnWAx2ObOHVjccHWn/NQ7msoAAYUWGAAAANbW7yxBMWiSNoAAAAAKbKxt7cyQB5Hn/Q=",
      "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "fee": "1",
      "storage_fee": "1",
      "other_fee": "0",
      "in_msg": {
        "@type": "raw.message",
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "1845458000002",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "msg_data": {
          "@type": "msg.dataText",
          "text": "U2Vjb25k"
        },
        "message": "Second"
      },
      "out_msgs": []
    }
  ]
}
```

The request will look like this - `https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5&limit=2&lt=1943166000003&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D&to_lt=0&archival=true`

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
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    },
    "given_type": "friendly_bounceable",
    "test_only": true
  }
}
```

We need `b64url`.

Also, this method helps us to check the correctness of the address sent by the user.

For the most part, that's all we need.

### API requests and what to do with them

Let's go back to the IDE. open file `api.py`.

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db

# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"

# Find out which network we are working on
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

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

## Database

### Create a database

This example uses a local Sqlite database.

We have 2 tables:

transactions

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

users

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

In the `users` table we store ... users. Their telegram id, @username,
first name and wallet. The wallet is added to the database on the first
successful payment.

The `transactions` table stores verified transactions.

### Working with DB

Open `db.py`.

The user made a transaction and clicked on the button to verify it. How to make sure that the same transaction is not confirmed twice?

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
