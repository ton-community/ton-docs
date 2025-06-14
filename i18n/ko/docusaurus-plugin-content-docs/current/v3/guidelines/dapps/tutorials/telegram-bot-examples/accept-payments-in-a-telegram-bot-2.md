---
description: 이 글에서는 TON 결제를 수락할 수 있는 간단한 Telegram 봇을 만드는 방법을 소개합니다.
---

import Feedback from '@site/src/components/Feedback';

# 자체 잔액을 가진 봇

:::caution
The integration method described in this guide is one of the available approaches. With ongoing developments, Telegram Mini Apps provide additional capabilities that better suit modern security and functionality requirements.
:::

이 글에서는 TON으로 결제를 받는 간단한 텔레그램 봇을 만들어보겠습니다.

## 🦄 어떻게 보이나요

봇은 다음과 같이 보일 것입니다:

![image](/img/tutorials/bot1.png)

### 소스 코드

The sources are available on GitHub:

- https://github.com/Gusarich/ton-bot-example

## 📖 What you'll learn

다음 내용을 배우게 됩니다:

- Create a Telegram bot in Python3 using Aiogram,
- Work with SQLITE databases,
- Work with public TON API.

## ✍️ 시작하기 전 준비사항

Install [Python](https://www.python.org/) if you haven't already.

Install the required PyPi libraries:

- aiogram,
- requests.

터미널에서 다음 명령어로 한 번에 설치할 수 있습니다.

```bash
pip install aiogram==2.21 requests
```

## 🚀 시작하기!

봇을 위한 디렉토리를 만들고 다음 네 개의 파일을 생성합니다:

- `bot.py`— Program to run the Telegram bot,
- `config.py`— Configuration file,
- `db.py`— Module for interacting with the SQLite database,
- `ton.py`— Module for handling payments in TON.

디렉토리는 다음과 같이 보여야 합니다:

```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

Now, let’s start coding!

## 설정

We'll begin with `config.py` since it's the smallest file. We just need to set a few parameters in it.

**config.py**

```python
BOT_TOKEN = 'YOUR BOT TOKEN'
DEPOSIT_ADDRESS = 'YOUR DEPOSIT ADDRESS'
API_KEY = 'YOUR API KEY'
RUN_IN_MAINNET = True  # Switch True/False to change mainnet to testnet

if RUN_IN_MAINNET:
    API_BASE_URL = 'https://toncenter.com'
else:
    API_BASE_URL = 'https://testnet.toncenter.com'
```

처음 세 줄의 값을 채워넣어야 합니다:

- `BOT_TOKEN`- Your Telegram bot token [creating a bot](https://t.me/BotFather).
- `DEPOSIT_ADDRESS` - Your project's wallet address for receiving payments. You can create a new TON Wallet and copy its address.
- `API_KEY` - Your API key from TON Center which you can get in [this bot](https://t.me/tonapibot).

You can also choose whether your bot will run on the Testnet or the Mainnet (4th line).

Once these values are set, we can move forward!

## 데이터베이스

Now let's edit the `db.py` file to store user balances.

sqlite3 라이브러리를 임포트합니다.

```python
import sqlite3
```

데이터베이스 연결과 커서를 초기화합니다(`db.sqlite` 대신 원하는 파일명을 선택할 수 있습니다).

```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

Create a table called **Users** with `uid` and `balance` columns to store information about users and their balances.

```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

Define helper functions to interact with the database:

`add_user` 함수는 새로운 사용자를 데이터베이스에 추가하는 데 사용됩니다.

```python
def add_user(uid):
    # new user always has balance = 0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

`check_user` 함수는 사용자가 데이터베이스에 있는지 확인하는 데 사용됩니다.

```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

`add_balance` 함수는 사용자의 잔액을 증가시키는 데 사용됩니다.

```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

`get_balance` 함수는 사용자의 잔액을 조회하는 데 사용됩니다.

```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

이게 `db.py` 파일의 전부입니다!

Once this file is set up, we can use these functions in other parts of the bot.

## TON Center API

`ton.py` 파일에서는 모든 새로운 입금을 처리하고, 사용자 잔액을 증가시키고, 사용자에게 알림을 보내는 함수를 선언할 것입니다.

### getTransactions 메소드

We'll use the TON Center API. Their documentation is available here:
https://toncenter.com/api/v2/

We need the [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) method to retrieve information about the latest transactions of a given account.
Let's review the input parameters this method requires and what it returns.

The only mandatory input field is `address`, but we also need the `limit` field to specify how many transactions we want to retrieve.

Let's test this method on the [TON Center website](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) website using any existing wallet address to see what the output looks like.

```json
{
  "ok": true,
  "result": [
    {
      ...
    },
    {
      ...
    }
  ]
}
```

모든 것이 정상이면 `ok` 필드가 `true`로 설정되고, `limit` 개수만큼의 최근 거래 목록이 있는 `result` 배열이 있습니다. 이제 단일 거래를 살펴봅시다:

```json
{
    "@type": "raw.transaction",
    "utime": 1666648337,
    "data": "...",
    "transaction_id": {
        "@type": "internal.transactionId",
        "lt": "32294193000003",
        "hash": "ez3LKZq4KCNNLRU/G4YbUweM74D9xg/tWK0NyfuNcxA="
    },
    "fee": "105608",
    "storage_fee": "5608",
    "other_fee": "100000",
    "in_msg": {
        "@type": "raw.message",
        "source": "EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL",
        "destination": "EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN",
        "value": "100000000",
        "fwd_fee": "666672",
        "ihr_fee": "0",
        "created_lt": "32294193000002",
        "body_hash": "tDJM2A4YFee5edKRfQWLML5XIJtb5FLq0jFvDXpv0xI=",
        "msg_data": {
            "@type": "msg.dataText",
            "text": "SGVsbG8sIHdvcmxkIQ=="
        },
        "message": "Hello, world!"
    },
    "out_msgs": []
}
```

We can see that the key details for identifying a specific transaction are stored in the `transaction_id` field. We need the `lt` field from this to determine the chronological order of transactions.

Now, we're ready to create a payment handler.

### 코드에서 API 요청 보내기

Let's start by importing the required libraries along with the `config.py` and `db.py` files.

```python
import requests
import asyncio

# Aiogram
from aiogram import Bot
from aiogram.types import ParseMode

# We also need config and database here
import config
import db
```

Let's explore how payment processing can be implemented.

We can call the API every few seconds to check if new transactions have been received in our wallet.

To do this, we need to track the last processed transaction. The simplest approach is to save this transaction’s details in a file and update it every time a new transaction is processed.

What information should we store? We only need the `lt` (logical time) value, which will allow us to determine which transactions need to be processed.

Next, we define an asynchronous function called `start`. Why async? Because the Aiogram library for Telegram bots is asynchronous, making it easier to work with async functions.

우리의 `start` 함수는 다음과 같이 보일 것입니다:

```python
async def start():
    try:
        # Try to load last_lt from file
        with open('last_lt.txt', 'r') as f:
            last_lt = int(f.read())
    except FileNotFoundError:
        # If file not found, set last_lt to 0
        last_lt = 0

    # We need the Bot instance here to send deposit notifications to users
    bot = Bot(token=config.BOT_TOKEN)

    while True:
        # Here we will call API every few seconds and fetch new transactions.
        ...
```

Within the `while` loop, we need to call the TON Center API every few seconds.

```python
while True:
    # 2 Seconds delay between checks
    await asyncio.sleep(2)

    # API call to TON Center that returns last 100 transactions of our wallet
    resp = requests.get(f'{config.API_BASE_URL}/api/v2/getTransactions?'
                        f'address={config.DEPOSIT_ADDRESS}&limit=100&'
                        f'archival=true&api_key={config.API_KEY}').json()

    # If call was not successful, try again
    if not resp['ok']:
        continue
    
    ...
```

After making a `requests.get` call, the response is stored in the `resp` variable. The resp object contains a result list with the 100 most recent transactions for our address.

Now, we iterate through these transactions and identify the new ones.

```python
while True:
    ...

    # Iterating over transactions
    for tx in resp['result']:
        # LT is Logical Time and Hash is hash of our transaction
        lt, hash = int(tx['transaction_id']['lt']), tx['transaction_id']['hash']

        # If this transaction's logical time is lower than our last_lt,
        # we already processed it, so skip it

        if lt <= last_lt:
            continue
        
        # at this moment, `tx` is some new transaction that we haven't processed yet
        ...
```

How to process a new transaction? We need to:

- Identify which user sent the transaction,
- Update that user's balance,
- Notify the user about their deposit.

Below is the code that handles this:

```python
while True:
    ...

    for tx in resp['result']:
        ...
        # at this moment, `tx` is some new transaction that we haven't processed yet

        value = int(tx['in_msg']['value'])
        if value > 0:
            uid = tx['in_msg']['message']

            if not uid.isdigit():
                continue

            uid = int(uid)

            if not db.check_user(uid):
                continue

            db.add_balance(uid, value)

            await bot.send_message(uid, 'Deposit confirmed!\n'
                                    f'*+{value / 1e9:.2f} TON*',
                                    parse_mode=ParseMode.MARKDOWN)
```

Let's analyze what it does:

All the information about the coin transfer is in `tx['in_msg']`. We just need the `value` and `message` fields.

First, we check if value is greater than zero—if not, we ignore the transaction.

Next, we verify that the ( `tx['in_msg']['message']` ) field contains a valid user ID from our bot and that the UID exists in our database.

After these checks, we extract the deposit amount `value` and the user ID `uid`. Then, we add the funds to the user’s account and send them a notification.
Also note that value is in nanotons by default, so we need to divide it by 1 billion. We do that in line with notification:
`{value / 1e9:.2f}`
Here we divide the value by `1e9` (1 billion) and leave only two digits after the decimal point to show it to the user in a friendly format.

Once a transaction is processed, we must update the stored `lt` value to reflect the most recent transaction.

간단합니다:

```python
while True:
    ...
    for tx in resp['result']:
        ...
        # we have processed this tx

        # lt variable here contains LT of the last processed transaction
        last_lt = lt
        with open('last_lt.txt', 'w') as f:
            f.write(str(last_lt))
```

이것으로 `ton.py` 파일이 완성되었습니다!
봇의 3/4이 완성되었고, 이제 봇 자체에 몇 개의 버튼이 있는 사용자 인터페이스만 만들면 됩니다.

## Telegram bot

### 초기화

Open the `bot.py` file and import all necessary modules.

```python
# Logging module
import logging

# Aiogram imports
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types import ParseMode, ReplyKeyboardMarkup, KeyboardButton, \
                          InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

# Local modules to work with the Database and TON Network
import config
import ton
import db
```

나중에 디버깅을 위해 무슨 일이 일어나는지 볼 수 있도록 프로그램에 로깅을 설정합시다.

```python
logging.basicConfig(level=logging.INFO)
```

Next, we initialize the bot and dispatcher using Aiogram:

```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

Here we use the `BOT_TOKEN` from our config file.

At this point, our bot is initialized but still lacks functionality. We now need to define interaction handlers.

### 메시지 핸들러

#### /start 명령

Let's begin with the `/start` and `/help` commands handlers. This function will be triggered when the user launches the bot for the first time, restarts it, or uses the  `/help` command.

```python
@dp.message_handler(commands=['start', 'help'])
async def welcome_handler(message: types.Message):
    uid = message.from_user.id  # Not neccessary, just to make code shorter

    # If user doesn't exist in database, insert it
    if not db.check_user(uid):
        db.add_user(uid)

    # Keyboard with two main buttons: Deposit and Balance
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.row(KeyboardButton('Deposit'))
    keyboard.row(KeyboardButton('Balance'))

    # Send welcome text and include the keyboard
    await message.answer('Hi!\nI am example bot '
                         'made for [this article](docs.ton.org/v3/guidelines/dapps/tutorials/telegram-bot-examples/accept-payments-in-a-telegram-bot-2).\n'
                         'My goal is to show how simple it is to receive '
                         'payments in Toncoin with Python.\n\n'
                         'Use keyboard to test my functionality.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

The welcome message can be customized to anything you prefer. The keyboard buttons can also be labeled as needed, but in this example, we use the most straightforward labels for our bot: `Deposit` and `Balance`.

#### 잔액 버튼

Once the user starts the bot, they will see a keyboard with two buttons. However, pressing these buttons won't yield any response yet, as we haven't created functions for them.

Let's add a function to check the user's balance.

```python
@dp.message_handler(commands='balance')
@dp.message_handler(Text(equals='balance', ignore_case=True))
async def balance_handler(message: types.Message):
    uid = message.from_user.id

    # Get user balance from database
    # Also don't forget that 1 TON = 1e9 (billion) Nanoton
    user_balance = db.get_balance(uid) / 1e9

    # Format balance and send to user
    await message.answer(f'Your balance: *{user_balance:.2f} TON*',
                         parse_mode=ParseMode.MARKDOWN)
```

The implementation is simple: we retrieve the balance from the database and send a message displaying it to the user.

#### 입금 버튼

Let's implement the **Deposit** button. Here’s how it works:

```python
@dp.message_handler(commands='deposit')
@dp.message_handler(Text(equals='deposit', ignore_case=True))
async def deposit_handler(message: types.Message):
    uid = message.from_user.id

    # Keyboard with deposit URL
    keyboard = InlineKeyboardMarkup()
    button = InlineKeyboardButton('Deposit',
                                  url=f'ton://transfer/{config.DEPOSIT_ADDRESS}&text={uid}')
    keyboard.add(button)

    # Send text that explains how to make a deposit into bot to user
    await message.answer('It is very easy to top up your balance here.\n'
                         'Simply send any amount of TON to this address:\n\n'
                         f'`{config.DEPOSIT_ADDRESS}`\n\n'
                         f'And include the following comment: `{uid}`\n\n'
                         'You can also deposit by clicking the button below.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

This step is crucial because, in `ton.py` we identify which user made a deposit by extracting their UID from the transaction comment. Now, within the bot, we must guide the user to include their UID in the transaction comment.

### 봇 시작

The final step in `bot.py` is to launch the bot and also start the `start` function from `ton.py`.

```python
if __name__ == '__main__':
    # Create Aiogram executor for our bot
    ex = executor.Executor(dp)

    # Launch the deposit waiter with our executor
    ex.loop.create_task(ton.start())

    # Launch the bot
    ex.start_polling()
```

At this point, we have written all the necessary code for our bot. If everything is set up correctly, the bot should work when you run the following command in the terminal: `python my-bot/bot.py`.

If the bot does not function as expected, compare your code with the code [from this repository](https://github.com/Gusarich/ton-bot-example) to ensure there are no discrepancies.

## 참고자료

- [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)의 일부로 TON을 위해 만들어짐
- [Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich) - _Gusarich_

<Feedback />

