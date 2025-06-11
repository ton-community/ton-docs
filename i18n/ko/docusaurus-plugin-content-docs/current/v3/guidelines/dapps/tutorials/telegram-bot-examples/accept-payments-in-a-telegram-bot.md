---
description: 이 글에서는 Telegram 봇에서 결제를 수락하는 과정을 안내합니다.
---

import Feedback from '@site/src/components/Feedback';

# TON 결제를 지원하는 상점 봇 만들기

:::caution
The integration method described in this guide is one of the available approaches. With ongoing developments, Telegram Mini Apps provide additional capabilities that better suit modern security and functionality requirements.
:::

이 글에서는 텔레그램 봇에서 결제를 처리하는 방법을 알려드리겠습니다.

## 📖 What you'll learn

이 글에서 다음 내용을 배우게 됩니다:

- Create a Telegram bot using Python and Aiogram,
- Work with the public TON Center API,
- Work with an SQlite database,
- How to accept payments in a Telegram bot by applying the knowledge from previous steps.

## 📚 시작하기 전에

Make sure you have installed the latest version of Python and the following packages:

- aiogram,
- requests.
- sqlite3.

## 🚀 시작하기!

We'll follow this order:

1. Work with an SQlite database.
2. Work with the public TON API (TON Center).
3. Create a Telegram bot using Python and Aiogram.
4. Profit!

프로젝트 디렉토리에 다음 네 개의 파일을 만듭니다:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## 설정

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

## 데이터베이스 생성

### 데이터베이스

이 예제에서는 로컬 Sqlite 데이터베이스를 사용합니다.

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

데이터베이스가 없으면 자동으로 생성됩니다.

We need two tables:

#### 거래:

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

#### 사용자:

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

이 테이블들을 생성하기 위해 다음 함수를 실행해야 합니다:

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

이 코드는 테이블이 없는 경우에만 생성합니다.

### Work with database

Let's analyze the process:
A user makes a transaction. How do we verify it? How do we ensure that the same transaction isn't confirmed twice?

Each transaction includes a `body_hash`, which allows us to easily check whether the transaction is already in the database.

We only add transactions that have been verified. The `check_transaction` function determines whether a given transaction is already in the database.

`add_v_transaction`은 거래를 transactions 테이블에 추가합니다.

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

Using a query returns a response containing two transactions.
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

또한 `detectAddress` 메소드도 필요할 것입니다.

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

`aiogram`에서는 `Bot`, `Dispatcher`, `types`, `executor`가 필요합니다.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage`는 임시 정보 저장에 필요합니다.

`FSMContext`, `State`, `StatesGroup`은 상태 기계 작업에 필요합니다.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json`은 json 파일 작업에 필요하고, `logging`은 에러 로깅에 필요합니다. `logging` is needed to log errors.

```python
import json
import logging
```

`api`와 `db`는 나중에 채울 우리의 파일들입니다.

```python
import db
import api
```

### 설정 세팅

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

#### 작동 모드

The `WORK_MODE` key defines whether the bot operates in the test or main network; `testnet` or `mainnet` respectively.

#### API 토큰

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

### 로깅과 봇 설정

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### 상태

States allow us to devide the bot workflow into stages, each designated for a specific task.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

For details and examples, refer to the [Aiogram documentation](https://docs.aiogram.dev/en/latest/).

### 메시지 핸들러

이 부분에서 봇 상호작용 로직을 작성할 것입니다.

두 가지 유형의 핸들러를 사용할 것입니다:

- `message_handler` is used to handle messages from users,
- `callback_query_handler`는 인라인 키보드의 콜백을 처리하는 데 사용됩니다.

사용자의 메시지를 처리하려면 함수 위에 `@dp.message_handler` 데코레이터를 붙여 `message_handler`를 사용합니다. 이 경우 사용자가 봇에 메시지를 보낼 때 함수가 호출됩니다.

데코레이터에서 함수가 호출될 조건을 지정할 수 있습니다. 예를 들어, 사용자가 `/start` 텍스트로 메시지를 보낼 때만 함수가 호출되도록 하려면 다음과 같이 작성합니다:

```
@dp.message_handler(commands=['start'])
```

핸들러는 비동기 함수에 할당되어야 합니다. 이 경우 `async def` 구문을 사용합니다. `async def` 구문은 비동기적으로 호출될 함수를 정의하는 데 사용됩니다.

#### /start

`/start` 명령 핸들러부터 시작해봅시다.

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

사용자가 `/start` 명령을 보내면, 봇은 `db.check_user` 함수를 사용하여 사용자가 데이터베이스에 있는지 확인합니다. 없다면 추가합니다. 이 함수는 bool 값을 반환하므로 사용자에게 다르게 응답할 수 있습니다. 그 후 봇은 상태를 `firstState`로 설정합니다.

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

사용자가 `/buy` 명령을 보내면, 봇은 공기 종류와 함께 답장 키보드를 보냅니다. 사용자가 공기 종류를 선택하면 봇은 상태를 `secondState`로 설정합니다.

이 핸들러는 `secondState`가 설정되어 있을 때만 작동하며 사용자로부터 공기 종류가 포함된 메시지를 기다립니다.  이 경우 사용자가 선택한 공기 종류를 저장해야 하므로, 함수에 FSMContext를 인자로 전달합니다.

FSMContext는 봇의 메모리에 데이터를 저장하는 데 사용됩니다. 어떤 데이터든 저장할 수 있지만 이 메모리는 영구적이지 않아서 봇이 재시작되면 데이터가 손실됩니다. 하지만 임시 데이터를 저장하기에는 좋습니다.

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

Consider the next handler. It may seem complex, but it isn’t. First, we verify whether the message contains a wallet address of the correct length using `len(message.text) == 48`. Then, we call the `api.detect_address` function to validate the address. This function also returns the standardized _correct_ address, which is stored in the database.

그 다음 `await state.get_data()`를 사용하여 FSMContext에서 공기 종류를 가져와 `user_data` 변수에 저장합니다.

이제 결제 프로세스에 필요한 모든 데이터가 있습니다. 결제 링크를 생성하여 사용자에게 보내기만 하면 됩니다. 인라인 키보드를 사용해보겠습니다.

The bot provides three payment buttons:

- TON wallet,
- Tonhub,
- Tonkeeper.

These buttons are advantageous of special buttons because they guide users to install a wallet if they don't have one

원하는 대로 사용하실 수 있습니다.

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

콜백 핸들러는 메시지 핸들러와 매우 비슷하지만 `message` 대신 `types.CallbackQuery`를 인자로 받습니다. 함수 데코레이터도 다릅니다.

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

마지막으로 잊지 마세요:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

이 부분은 봇을 시작하는 데 필요합니다.
`skip_updates=True`에서 오래된 메시지를 처리하지 않겠다고 지정합니다. 하지만 모든 메시지를 처리하고 싶다면 `False`로 설정할 수 있습니다.

:::info

`main.py`의 전체 코드는 [여기서](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py) 찾을 수 있습니다.

:::

## Bot in action

Congratulations! The bot is ready. You can test it!

봇 실행 단계:

1. `config.json` 파일을 채웁니다.
2. `main.py`를 실행합니다.

All files must be in the same folder. To start the bot, you need to run the `main.py` file. You can do it in your IDE or in the terminal like this:

```
python main.py
```

If errors occur, check them in the terminal. Maybe you have missed something in the code.

작동하는 봇의 예시 [@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## 참고자료

- [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)의 일부로 TON을 위해 만들어짐
- [Telegram @Revuza](https://t.me/revuza), [LevZed on GitHub](https://github.com/LevZed) - _Lev_

<Feedback />

