import Button from '@site/src/components/button'

# TON Connect for Telegram Bots - Python

In this tutorial, we’ll create a sample telegram bot that supports TON Connect 2.0 authentication using Python TON Connect SDK [pytonconnect](https://github.com/XaBbl4/pytonconnect).
We will analyze connecting a wallet, sending a transaction, getting data about the connected wallet, and disconnecting a wallet.

````mdx-code-block 
<Button href="https://t.me/test_tonconnect_bot" colorType={'primary'} sizeType={'sm'}>
````
Open Demo Bot
````mdx-code-block 
</Button>
````
````mdx-code-block 
<Button href="https://github.com/yungwine/ton-connect-bot" colorType={'secondary'} sizeType={'sm'}>
````
Check out GitHub
````mdx-code-block 
</Button>
````

## Preparing

### Install libraries

To make bot we are going to use `aiogram` 3.0 Python library.
To start integrating TON Connect into your Telegram bot, you need to install the `pytonconnect` package.
And to use TON primitives and parse user address we need `pytoniq-core`.
You can use pip for this purpose:

```bash
pip install aiogram pytoniq-core python-dotenv
pip install pytonconnect
```

### Set up config
Specify in `.env` file [bot token](https://t.me/BotFather) and link to the TON Connect [manifest file](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). After load them in `config.py`:

```dotenv
# .env

TOKEN='1111111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  # your bot token here
MANIFEST_URL='https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json'
```

```python
# config.py

from os import environ as env

from dotenv import load_dotenv
load_dotenv()

TOKEN = env['TOKEN']
MANIFEST_URL = env['MANIFEST_URL']
```

## Create simple bot

Create `main.py` file which will contain the main bot code:

```python
# main.py

import sys
import logging
import asyncio

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)
    

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    await message.answer(text='Hi!')

async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```

## Wallet connection

### TON Connect Storage

Let's create simple storage for TON Connect

```python
# tc_storage.py

from pytonconnect.storage import IStorage, DefaultStorage


storage = {}


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        storage[self._get_key(key)] = value

    async def get_item(self, key: str, default_value: str = None):
        return storage.get(self._get_key(key), default_value)

    async def remove_item(self, key: str):
        storage.pop(self._get_key(key))

```

### Connection handler

Firstly, we need function which returns different instances for each user:

```python
# connector.py

from pytonconnect import TonConnect

import config
from tc_storage import TcStorage


def get_connector(chat_id: int):
    return TonConnect(config.MANIFEST_URL, storage=TcStorage(chat_id))

```
Secondary, let's add connection handler in `command_start_handler()`:

```python
# main.py

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())
    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())

```

Now, for a user who has not yet connected a wallet, the bot sends a message with buttons for all available wallets.
So we need to write function to handle `connect:{wallet["name"]}` callbacks:

```python
# main.py

async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])
```

Bot gives user 3 minutes to connect a wallet, after which it reports a timeout error. 

## Implement Transaction requesting

Let's take one of examples from the [Message builders](/develop/dapps/ton-connect/message-builders) article:

```python
# messages.py

from base64 import urlsafe_b64encode

from pytoniq_core import begin_cell


def get_comment_message(destination_address: str, amount: int, comment: str) -> dict:

    data = {
        'address': destination_address,
        'amount': str(amount),
        'payload': urlsafe_b64encode(
            begin_cell()
            .store_uint(0, 32)  # op code for comment message
            .store_string(comment)  # store comment
            .end_cell()  # end cell
            .to_boc()  # convert it to boc
        )
        .decode()  # encode it to urlsafe base64
    }

    return data

```

And add `send_transaction()` function in the `main.py` file:

```python
# main.py

@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return
    
    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    await connector.send_transaction(
        transaction=transaction
    )
```

But we also should handle possible errors, so we wrap the `send_transaction` method into `try - except` statement:

```python
@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    ...
    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')
```

## Add disconnect handler

This function implementation is simple enough:

```python
async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')
```

Currently, the project has the following structure:

```bash
.
.env
├── config.py
├── connector.py
├── main.py
├── messages.py
└── tc_storage.py
```
And the `main.py` looks like this:

<details>
<summary>Show main.py</summary>

```python
# main.py

import sys
import logging
import asyncio
import time

import pytonconnect.exceptions
from pytoniq_core import Address
from pytonconnect import TonConnect

import config
from messages import get_comment_message
from connector import get_connector

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery
from aiogram.utils.keyboard import InlineKeyboardBuilder


logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)


@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()

    mk_b = InlineKeyboardBuilder()
    if connected:
        mk_b.button(text='Send Transaction', callback_data='send_tr')
        mk_b.button(text='Disconnect', callback_data='disconnect')
        await message.answer(text='You are already connected!', reply_markup=mk_b.as_markup())

    else:
        wallets_list = TonConnect.get_wallets()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


@dp.message(Command('transaction'))
async def send_transaction(message: Message):
    connector = get_connector(message.chat.id)
    connected = await connector.restore_connection()
    if not connected:
        await message.answer('Connect wallet first!')
        return

    transaction = {
        'valid_until': int(time.time() + 3600),
        'messages': [
            get_comment_message(
                destination_address='0:0000000000000000000000000000000000000000000000000000000000000000',
                amount=int(0.01 * 10 ** 9),
                comment='hello world!'
            )
        ]
    }

    await message.answer(text='Approve transaction in your wallet app!')
    try:
        await asyncio.wait_for(connector.send_transaction(
            transaction=transaction
        ), 300)
    except asyncio.TimeoutError:
        await message.answer(text='Timeout error!')
    except pytonconnect.exceptions.UserRejectsError:
        await message.answer(text='You rejected the transaction!')
    except Exception as e:
        await message.answer(text=f'Unknown error: {e}')


async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception(f'Unknown wallet: {wallet_name}')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>', reply_markup=mk_b.as_markup())
                logger.info(f'Connected with address: {wallet_address}')
            return

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
    elif data == "send_tr":
        await send_transaction(message)
    elif data == 'disconnect':
        await disconnect_wallet(message)
    else:
        data = data.split(':')
        if data[0] == 'connect':
            await connect_wallet(message, data[1])


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())

```
</details>

## Improving


### Add permanent storage - Redis

Currently, our TON Connect Storage uses dict which causes to lost sessions after bot restart. 
Let's add permanent database storage with Redis:

After you launched Redis database install python library to interact with it:

```bash
pip install redis
```

And update `TcStorage` class in `tc_storage.py`:

```python
import redis.asyncio as redis

client = redis.Redis(host='localhost', port=6379)


class TcStorage(IStorage):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id

    def _get_key(self, key: str):
        return str(self.chat_id) + key

    async def set_item(self, key: str, value: str):
        await client.set(name=self._get_key(key), value=value)

    async def get_item(self, key: str, default_value: str = None):
        value = await client.get(name=self._get_key(key))
        return value.decode() if value else default_value

    async def remove_item(self, key: str):
        await client.delete(self._get_key(key))
```

### Add QR Code

Install python `qrcode` package to generate them:

```bash
pip install qrcode
```

Change `connect_wallet()` function so it generates qrcode and sends it as a photo to the user:

```python
from io import BytesIO
import qrcode
from aiogram.types import BufferedInputFile


async def connect_wallet(message: Message, wallet_name: str):
    ...
    
    img = qrcode.make(generated_url)
    stream = BytesIO()
    img.save(stream)
    file = BufferedInputFile(file=stream.getvalue(), filename='qrcode')

    await message.answer_photo(photo=file, caption='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())
    
    ...
```

## Summary

What is next?
- You can add better errors handling in the bot.
- You can add start text and something like `/connect_wallet` command.

## See Also
- [Full bot code](https://github.com/yungwine/ton-connect-bot)
- [Preparing messages](/develop/dapps/ton-connect/message-builders)
