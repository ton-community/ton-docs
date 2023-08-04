# Developing a Telegram Bot App to Check Ownership of NFT

## 👋 Introduction

This article aims to provide guidance on verifying token ownership as the popularity of NFTs continues to soar, with a growing number of individuals searching for effective methods to accomplish this.

## 📝 Obtaining a Token for the Bot

1.  Visit [BotFather](https://t.me/BotFather) on Telegram.

2.  Follow the instructions to create a new bot.

3.  Once created, BotFather will provide you with a unique token. This token is crucial as it allows your bot to communicate with the Telegram API.

## 🧠 Description of the Bot's Functionality

### Functionality

Our Telegram bot will perform the fascinating task of verifying if a user owns a network item from the TON Footsteps collection. The key components will be:

- aiogram library: For interfacing with the Telegram client.
- TON Connect 2.0: To connect with the user's wallet.
- Redis database: To handle relevant data.

### 🗂️ Project Structure

- Main File: Containing the primary logic.
- Supporting Files:
  - Keyboards: Keyboard Storage.
  - Database Preparation: Facilitating TON Connect.
  - Data for TON Connect: Data handling.

### 🛠️ Install the Libraries

Execute the following commands to get the necessary libraries:

```bash
pip install aiogram
pip install redis
pip install qrcode
pip install tonsdk
pip install pytonconnect
pip install requests
```

And then, import them to the main file:

```python
import asyncio
import requests
import qrcode
import os
import random

from aiogram import Bot, Dispatcher, executor, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.types.input_file import InputFile
from tonsdk.utils import Address
from pytonconnect import TonConnect
```

### 🗄️ Redis Database Setup

Additionally, for setting up and launching the Redis database, I recommend acquainting yourself with the information regarding its installation and initiation, which can be found [here](https://redis.io/docs/getting-started/installation/)

## 🎨 Writing the Bot

### 🎹 Designing the Keyboards

To begin with, let's create a file containing all the necessary keyboard configurations, and we'll name it `keyboards.py`

```python
# Creating custom keyboard buttons and reply markup for the Telegram bot.

from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

# Creating a KeyboardButton for the "Check for footstep NFT" action.
CheckButton = KeyboardButton('Check for footstep NFT')

# Creating a ReplyKeyboardMarkup for the "Check" action using the CheckButton.
# The 'resize_keyboard' parameter is set to True, allowing the keyboard to be resized in the Telegram app.
Checkkb = ReplyKeyboardMarkup(resize_keyboard=True).add(CheckButton)

# Creating additional buttons for the "Tonkeeper" and "Tonhub" actions.
TonkeeperButton = KeyboardButton('Tonkeeper')
TonhubButton = KeyboardButton('Tonhub')

# Creating a ReplyKeyboardMarkup for the "Wallet" action using the TonkeeperButton and TonhubButton.
# The 'resize_keyboard' parameter is set to True to allow the keyboard to be resized in the Telegram app.
Walletkb = ReplyKeyboardMarkup(resize_keyboard=True).add(TonkeeperButton).add(TonhubButton)
```

Since we will be using more than one keyboard in this project, we import this file with a convenient name.

```python
import keyboards as kb
```

### 🧩 Database Preparation

Now, we need to prepare our database to interface with pytonconnect.
To do this, we will create a new file named `support.py`

```python
# Importing the Redis library to interact with the Redis database
import redis
# Importing the IStorage interface from pytonconnect
from pytonconnect.storage import IStorage

# Creating a connection to the Redis database running on localhost at port 6379
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Defining a class Storage that implements the IStorage interface from pytonconnect
class Storage(IStorage):
    def __init__(self, id):
        # Constructor method initializing the unique identifier for each storage instance
        self.id = id

    # Asynchronous method to set a key-value pair in Redis, with the key being appended with the unique ID
    async def set_item(self, key: str, value: str):
        r.set(key + self.id, value)

    # Asynchronous method to retrieve the value for a given key from Redis, with the key being appended with the unique ID
    # If the key does not exist, returns the default value
    async def get_item(self, key: str, default_value: str = None):
        if r.exists(key + self.id):
            return r.get(key + self.id)
        else:
            return default_value

    # Asynchronous method to remove the key-value pair for a given key from Redis, with the key being appended with the unique ID
    async def remove_item(self, key: str):
        r.delete(key + self.id)
```

And also import it into our main file with the bot

```python
import support
```

### 🌟 Writing the Startup Handler

```python
# This message handler is triggered when a user sends the '/start' command in a private chat with the bot.

@dp.message_handler(commands=['start'], chat_type=types.ChatType.PRIVATE)
async def start_command(message: types.Message):
    # Sends a welcome message to the user, introducing the bot's purpose and functionality.
    await message.answer("Hi👋, I am an example of a bot for checking the ownership of the NFT", reply_markup=kb.Checkkb)
    await message.answer("With my help, you can check if you have an NFT from the TON Footsteps collection")

    # Checks if the user's Telegram ID is already present in the 'Users' database table.
    # If not, it adds the user's ID and username to the 'Users' table as a new entry.
    if not cur.execute(f"SELECT id_tg FROM Users WHERE id_tg == {message.from_user.id}").fetchall():
        cur.execute(f"INSERT INTO Users (id_tg, username) VALUES ({message.from_user.id}, '{message.from_user.username}')")
        con.commit()
```

### 🕵️ Function for Checking the Presence of NFT

```python
# A message handler function to check if the user has a footstep NFT and respond accordingly.

@dp.message_handler(text='Check for footstep NFT', chat_type=types.ChatType.PRIVATE)
async def connect_wallet_tonkeeper(message: types.Message):
    # Checking if the user's wallet address is present in the database for the given Telegram ID.
    # If the address is not available, prompt the user to connect their wallet (Tonkeeper or Tonhub).
    if cur.execute(f"SELECT address FROM Users WHERE id_tg == {message.from_user.id}").fetchall()[0][0] is None:
        await message.answer(text="To check for the presence of NFT, connect your wallet (Tonkeeper or Tonhub)", reply_markup=kb.Walletkb)
    else:
        # If the user's wallet address is available, proceed to check for the presence of the footstep NFT.
        address = cur.execute(f"SELECT address FROM Users WHERE id_tg == {message.from_user.id}").fetchall()[0][0]

        # Forming the URL to query the TON API for the user's NFTs from the TON Footsteps collection.
        url = f'https://tonapi.io/v2/accounts/{address}/nfts?collection=EQCV8xVdWOV23xqOyC1wAv-D_H02f7gAjPzOlNN6Nv1ksVdL&limit=1000&offset=0&indirect_ownership=false'

        try:
            # Sending a GET request to the TON API and parsing the JSON response to extract NFT items.
            response = requests.get(url).json()['nft_items']
        except:
            # If there's an error with the API request, notify the user.
            await message.answer(text="Something went wrong...")
            return

        # Based on the response from the TON API, informing the user about the NFT presence or absence.
        if response:
            await message.answer(text="You have an NFT from the TON Footsteps collection")
        else:
            await message.answer(text="Unfortunately, you don't have NFT from the TON Footsteps collection")
```

In order to check whether the NFT user has the necessary collection, we need to make such an api request:

```bash
https://tonapi.io/v2/accounts/<ADDRESS>/nfts?collection=<NFT_COLLECTION>&limit=1000&offset=0&indirect_ownership=false
```

Where:

- `ADDRESS` - This is the wallet address of the user we want to check for the necessary NFT.
- `NFT_COLLECTION` - This is the address of the required NFT collection.

The API request will return all the user's NFTs from the specified collection.

### 🏡 Function for Getting the User's Address via TON Connect 2.0

```python
# A message handler function to check if the user has a footstep NFT and respond accordingly.

@dp.message_handler(text='Check for footstep NFT', chat_type=types.ChatType.PRIVATE)
# A message handler function to connect the user's Tonkeeper wallet to the bot.

@dp.message_handler(text='Tonkeeper', chat_type=types.ChatType.PRIVATE)
async def connect_wallet_tonkeeper(message: types.Message):
    # Creating a TonConnect instance and restoring the connection to Tonkeeper using the provided manifest URL.
    connector = TonConnect(manifest_url='https://raw.githubusercontent.com/AndreyBurnosov/Checking_for_nft_availability/main/pytonconnect-manifest.json')
    is_connected = await connector.restore_connection()

    # Getting a list of available wallets from the TonConnect instance.
    wallets_list = connector.get_wallets()

    # Connecting the user's Tonkeeper wallet and generating a connection URL.
    generated_url_tonkeeper = await connector.connect(wallets_list[0])

    # Creating an inline keyboard markup with a URL button to open Tonkeeper and a QR code for the connection URL.
    urlkb = InlineKeyboardMarkup(row_width=1)
    urlButton = InlineKeyboardButton(text='Open Tonkeeper', url=generated_url_tonkeeper)
    urlkb.add(urlButton)
    img = qrcode.make(generated_url_tonkeeper)
    path = f'image{random.randint(0, 100000)}.png'
    img.save(path)
    photo = InputFile(path)

    # Sending the QR code as a photo along with the URL button to open Tonkeeper.
    msg = await bot.send_photo(chat_id=message.chat.id, photo=photo, reply_markup=urlkb)
    os.remove(path)

    # Continuously checking if the connection to Tonkeeper is successful and obtaining the user's wallet address.
    flag = True
    while flag:
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                flag = False
                address = Address(connector.account.address).to_string(True, True, True)
            break

    # Disconnecting the TonConnect instance after obtaining the user's wallet address.
    await connector.disconnect()

    # Deleting the photo message that contained the QR code to keep the chat clean.
    await msg.delete()

    # Informing the user that their wallet has been successfully connected and providing a new keyboard.
    await message.answer('Your wallet has been successfully connected.', reply_markup=kb.Checkkb)

    # Updating the user's address in the database with the obtained wallet address.
    cur.execute(f"UPDATE Users SET address = '{address}' WHERE id_tg = {message.from_user.id}")
    con.commit()
```

#### 📄 Creating a File for TonConnect

We also need to create a file named `pytonconnect-manifest.json`, following this template.

```json
{
  "url": "<app-url>", // required
  "name": "<app-name>", // required
  "iconUrl": "<app-icon-url>", // required
  "termsOfUseUrl": "<terms-of-use-url>", // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

For this bot, this option is suitable.

```json
{
  "url": "",
  "name": "Example bot",
  "iconUrl": "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect.png"
}
```

You can learn more about pytonconnect library [here](https://github.com/XaBbl4/pytonconnect)

### 🚀 Launching the Bot

```python
# The main entry point of the Telegram bot application.

if __name__ == '__main__':
    # Start polling for updates from the Telegram Bot API using the executor.
    # The `dp` (Dispatcher) object handles message handling and other event processing.
    # The `skip_updates=True` parameter tells the executor to skip pending updates when starting.
    executor.start_polling(dp, skip_updates=True)
```

## [🎁 Final Code and Resources](https://github.com/AndreyBurnosov/Checking_for_nft_availability)

## 📌 References

- [TON API](https://tonapi.io/)
- [Python library for TON Connect2.0](https://github.com/XaBbl4/pytonconnect)
- The tutorial was developed by [Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov))
