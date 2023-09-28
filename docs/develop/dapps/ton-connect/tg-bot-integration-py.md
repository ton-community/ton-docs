# TON Connect for Telegram Bots

In this tutorial, we’ll create a sample telegram bot that supports TON Connect 2.0 authentication using Python TON Connect SDK [pytonconnect](https://github.com/XaBbl4/pytonconnect).
We will analyze connecting a wallet, sending a transaction, getting data about the connected wallet, and disconnecting a wallet.

## Implementation

### 1) Installation

To make bot we are going to use `aiogram` 3.0 Python library. To start integrating TON Connect into your Telegram bot, you need to install the `pytonconnect` package.
You can use pip for this purpose:

```bash
pip install aiogram
pip install pytonconnect
```

### 2) Set up config file
Specify here your [bot token](https://t.me/BotFather), and link to the TON Connect [manifest file](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest). 
```python
# config.py

TOKEN = '1111111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  # your bot token here
MANIFEST_URL = 'https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect-manifest.json'
```

### 3) Let's create a simple bot!

```python
import sys
import logging
import asyncio

from aiogram.utils.keyboard import InlineKeyboardBuilder

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery

from pytonconnect import TonConnect

logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)

connectors = {}


def get_connector(chat_id: int):
    if chat_id not in connectors:
        connectors[chat_id] = TonConnect(config.MANIFEST_URL)
    return connectors[chat_id]
    

@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()
    if connected:
        await message.answer(text='You are already connected!')
    else:
        wallets_list = TonConnect.get_wallets()
        mk_b = InlineKeyboardBuilder()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


async def main() -> None:
    await bot.delete_webhook(drop_pending_updates=True)  # skip_updates = True
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
```

In the example above we check if user was connected or not. 
And suggest to choose a wallet if user is not connected by providing buttons for all wallets supported by TON Connect.

### 4) Handler for connection

```python
from pytoniq_core import Address 

async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception('Unknown wallet')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>')
                logger.info(f'Connected with address: {wallet_address}')
            return

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
        return 
    data = data.split(':')
    if data[0] == 'connect':
        await connect_wallet(message, data[1])
```

Now after user chose wallet, the bot generates link for user to connect and waits 3 minutes until user is connected. 

### 5) Ask for transaction

Let's take one of the examples from the [Message builders](https://docs.ton.org/develop/dapps/ton-connect/message-builders) article.

```python
@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()
    if connected:
        await message.answer(text='You are already connected!')

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

<details>
<summary>Currently main.py looks like that</summary>

```python
import sys
import logging
import asyncio
import time
from base64 import urlsafe_b64encode

from aiogram.utils.keyboard import InlineKeyboardBuilder
from pytoniq_core import Address, begin_cell

import config

from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, CallbackQuery

from pytonconnect import TonConnect

logger = logging.getLogger(__file__)

dp = Dispatcher()
bot = Bot(config.TOKEN, parse_mode=ParseMode.HTML)

connectors = {}


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


def get_connector(chat_id: int):
    if chat_id in connectors:
        return connectors[chat_id]
    return TonConnect(config.MANIFEST_URL)


@dp.message(CommandStart())
async def command_start_handler(message: Message):
    chat_id = message.chat.id
    connector = get_connector(chat_id)
    connected = await connector.restore_connection()
    if connected:
        await message.answer(text='You are already connected!')

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
    else:
        wallets_list = TonConnect.get_wallets()
        mk_b = InlineKeyboardBuilder()
        for wallet in wallets_list:
            mk_b.button(text=wallet['name'], callback_data=f'connect:{wallet["name"]}')
        mk_b.adjust(1, )
        await message.answer(text='Choose wallet to connect', reply_markup=mk_b.as_markup())


async def connect_wallet(message: Message, wallet_name: str):
    connector = get_connector(message.chat.id)

    wallets_list = connector.get_wallets()
    wallet = None

    for w in wallets_list:
        if w['name'] == wallet_name:
            wallet = w

    if wallet is None:
        raise Exception('Unknown wallet')

    generated_url = await connector.connect(wallet)

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Connect', url=generated_url)

    await message.answer(text='Connect wallet within 3 minutes', reply_markup=mk_b.as_markup())

    for i in range(1, 180):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                wallet_address = connector.account.address
                wallet_address = Address(wallet_address).to_str(is_bounceable=False)
                await message.answer(f'You are connected with address <code>{wallet_address}</code>')
                logger.info(f'Connected with address: {wallet_address}')
            return

    mk_b = InlineKeyboardBuilder()
    mk_b.button(text='Start', callback_data='start')

    await message.answer(f'Timeout error!', reply_markup=mk_b.as_markup())


@dp.callback_query(lambda call: True)
async def main_callback_handler(call: CallbackQuery):
    await call.answer()
    message = call.message
    data = call.data
    if data == "start":
        await command_start_handler(message)
        return
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

