# Telegram Bot to check ownership of NFT

## 👋 Introduction

This article aims to provide guidance on verifying token ownership as the popularity of NFTs continues to soar, with a growing number of individuals searching for effective methods to accomplish this.

## 📝 Obtaining a token for the bot

1.  Visit [BotFather](https://t.me/BotFather) on Telegram.

2.  Follow the instructions to create a new bot.

3.  Once created, BotFather will provide you with a unique token. This token is crucial as it allows your bot to communicate with the Telegram API.

## 🧠 Description of the bot's functionality

### Functionality

Our Telegram bot will perform the fascinating example task of verifying if a user owns an NFT item from the TON Footsteps collection. The key components will be:

- aiogram library: For interfacing with the Telegram client.
- TON Connect: To connect with the user's wallet.
- Redis database: To handle data relevant to TON Connect.

### 🗂️ Project structure

- Main file: Containing the primary logic of the bot.
- Helper files:
  - Keyboards: Telegram bot keyboard objects.
  - Database Preparation: Facilitating TON Connect.

### 🛠️ Install the libraries

Execute the following command to install all the necessary libraries through `pip`:

```bash
pip install aiogram redis qrcode tonsdk pytonconnect requests
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

### 🗄️ Redis database setup

Additionally, for setting up and launching the Redis database, I recommend acquainting yourself with the information regarding its installation and initiation, which can be found [here](https://redis.io/docs/getting-started/installation/)

## 🎨 Writing the bot

### 🎹 Designing the keyboards

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

And let's add the import of this file to the `main.py`.

```python
import keyboards as kb
```

### 🧩 Database preparation

Now, we need to prepare our database to interface with `pytonconnect`.
To do this, we will create a new file named `database.py`

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
import database
```

### 🌟 Writing the startup handler

```python
# Define a command handler for the '/start' command for private chats
@dp.message_handler(commands=['start'], chat_type=types.ChatType.PRIVATE)
async def start_command(message: types.Message):
    # Send a greeting message to the user, explaining the bot's functionality
    await message.answer("Hi👋, I am an example of a bot for checking the ownership of the NFT", reply_markup=kb.Checkkb)
    # Further explain how the bot can help with NFT collection checking
    await message.answer("With my help, you can check if you have an NFT from the TON Footsteps collection")
```

### 🕵️ Function for checking the presence of NFT

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

In order to check whether the NFT user has the necessary collection, we will use the [TONAPI](https://tonapi.io/). The request will look like this:

```bash
https://tonapi.io/v2/accounts/<ADDRESS>/nfts?collection=<NFT_COLLECTION>&limit=1000&offset=0&indirect_ownership=false
```

Where:

- `ADDRESS` - This is the wallet address of the user we want to check for the required NFT.
- `NFT_COLLECTION` - This is the address of the required NFT collection.

The API request will return all the user's NFTs from the specified collection.

### 🏡 Function for getting the user's address via TON Connect

```python
# Define a message handler for connection to wallets (Tonkeeper or Tonhub) in private chats
@dp.message_handler(text=['Tonkeeper', 'Tonhub'], chat_type=types.ChatType.PRIVATE)
async def connect_wallet_tonkeeper(message: types.Message):
    # Create a storage instance based on the user's ID
    storage = database.Storage(str(message.from_user.id))

    # Initialize a connection using the given manifest URL and storage
    connector = TonConnect(manifest_url='https://raw.githubusercontent.com/AndreyBurnosov/Checking_for_nft_availability/main/pytonconnect-manifest.json', storage=storage)
    # Attempt to restore the existing connection, if any
    is_connected = await connector.restore_connection()

    # If already connected, inform the user and exit the function
    if is_connected:
        await message.answer('Your wallet is already connected.')
        return

    # Define the connection options for different wallet
    connection = {'Tonkeeper': 0, 'Tonhub': 2}

    # Retrieve the available wallets
    wallets_list = connector.get_wallets()

    # Generate a connection URL for the selected wallet
    generated_url_tonkeeper = await connector.connect(wallets_list[connection[message.text]])

    # Create an inline keyboard markup with a button to open the connection URL
    urlkb = InlineKeyboardMarkup(row_width=1)
    urlButton = InlineKeyboardButton(text=f'Open {message.text}', url=generated_url_tonkeeper)
    urlkb.add(urlButton)

    # Generate a QR code for the connection URL and save it as an image
    img = qrcode.make(generated_url_tonkeeper)
    path = f'image{random.randint(0, 100000)}.png'
    img.save(path)
    photo = InputFile(path)

    # Send the QR code image to the user with the inline keyboard markup
    msg = await bot.send_photo(chat_id=message.chat.id, photo=photo, reply_markup=urlkb)
    # Remove the saved image from the local file system
    os.remove(path)

    # Check for a successful connection in a loop, with a maximum of 300 iterations (300 seconds)
    for i in range(300):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                address = Address(connector.account.address).to_string(True, True, True)
            break

    # Delete the previously sent QR code message
    await msg.delete()

    # Confirm to the user that the wallet has been successfully connected
    await message.answer('Your wallet has been successfully connected.', reply_markup=kb.Checkkb)
```

#### 📄 Creating the manifest for TON Connect

In order to properly use the TON Connect we also need to create a file named `pytonconnect-manifest.json`, following this template:

```json
{
  "url": "<app-url>", // required
  "name": "<app-name>", // required
  "iconUrl": "<app-icon-url>", // required
  "termsOfUseUrl": "<terms-of-use-url>", // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

For this bot, it'll be enough to simply use some default icon and any desired name:

```json
{
  "url": "",
  "name": "Example bot",
  "iconUrl": "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect.png"
}
```

You can learn more about the `pytonconnect` library [in its repository](https://github.com/XaBbl4/pytonconnect)

### 🚀 Launching the bot

Add the folliwing code to the end of `main.py` and we'll be ready to test our bot!

```python
# The main entry point of the Telegram bot application.

if __name__ == '__main__':
    # Start polling for updates from the Telegram Bot API using the executor.
    # The `dp` (Dispatcher) object handles message handling and other event processing.
    # The `skip_updates=True` parameter tells the executor to skip pending updates when starting.
    executor.start_polling(dp, skip_updates=True)
```

Now simply run this command in your terminal:

```bash
python3 main.py
```

After that, open the dialogue with your bot in Telegram and try to use it. If you followed this guide correctly, the bot should work as expected!

## [🎁 Final code and resources](https://github.com/AndreyBurnosov/Checking_for_nft_availability)

## 📌 References

- [TON API](https://tonapi.io/)
- [Python library for TON Connect2.0](https://github.com/XaBbl4/pytonconnect)
- The tutorial was developed by [Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov))
