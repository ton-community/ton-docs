# Developing a Telegram Bot App to Check Ownership of NFT.

## 👋 Introduction.

This article aims to provide guidance on verifying token ownership as the popularity of NFTs continues to soar, with a growing number of individuals searching for effective methods to accomplish this.

## 🤖 Creating a bot.

1.  Visit [BotFather](https://t.me/BotFather) on Telegram.

2.  Follow the instructions to create a new bot.

3.  Once created, BotFather will provide you with a unique token. This token is crucial as it allows your bot to communicate with the Telegram API.

## 🐍 TON Connect 2.0.

First, you'll need to install TON Connect 2.0 library. Open your terminal and run the following command:

```bash
pip install pytonconnect
```

Additionally, for more convenient operation, we'll install the following libraries:

```bash
pip install tonsdk
pip install qrcode
```

We need TON Connect 2.0 in order to find out the user's wallet address.

App needs to have its manifest to pass meta information to the wallet. Manifest is a JSON file named as tonconnect-manifest.json following format:

```json
{
  "url": "<app-url>", // required
  "name": "<app-name>", // required
  "iconUrl": "<app-icon-url>", // required
  "termsOfUseUrl": "<terms-of-use-url>", // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

Code for getting the user's address using the aiogram library using Tonkeeper:

```python
from aiogram import Bot, types
from pytonconnect import TonConnect
import qrcode
import random
import os

# Create a bot instance using your Telegram Bot token
bot = Bot(token="YOUR_TELEGRAM_BOT_TOKEN")

async def get_user_wallet_address():
    # Create an instance of TonConnect with your manifest URL
    connector = TonConnect(manifest_url='YOUR_MANIFEST_URL')

    # Restore the connection with TON Connect 2.0
    is_connected = await connector.restore_connection()

    # Get a list of available wallets
    wallets_list = connector.get_wallets()

    # Connect to Tonkeeper and generate a connection URL
    generated_url_tonkeeper = await connector.connect(wallets_list[0])

    # Create a QR code for the connection URL
    img = qrcode.make(generated_url_tonkeeper)
    path = f'image{random.randint(0, 100000)}.png'
    img.save(path)
    photo = types.InputFile(path)

    # Send the QR code to the user and provide a button to open Tonkeeper
    urlkb = types.InlineKeyboardMarkup(row_width=1)
    urlButton = types.InlineKeyboardButton(text='Open Tonkeeper', url=generated_url_tonkeeper)
    urlkb.add(urlButton)
    msg = await bot.send_photo(chat_id=message.chat.id, photo=photo, reply_markup=urlkb)

    # Remove the generated QR code image
    os.remove(path)

    flag = True
    while flag:
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                flag = False
                address = connector.account.address.to_string(True, True, True)
        break

    # Disconnecting the connection
    await connector.disconnect()

    return address

# Call the get_user_wallet_address function to retrieve the user's address
user_wallet_address = await get_user_wallet_address()
```

You can learn more about this library [here](https://github.com/XaBbl4/pytonconnect)

## 💎 Tonapi.io.

To work with the TON API and check whether a user has a specific NFT collection, we need to install the requests library:

```bash
pip install requests
```

In order to check whether the NFT user has the necessary collection, we need to make such an api request:

```bash
https://tonapi.io/v2/accounts/<ADDRESS>/nfts?collection=<NFT_COLLECTION>&limit=1000&offset=0&indirect_ownership=false
```

Where:

- `ADDRESS` - This is the wallet address of the user we want to check for the necessary NFT.
- `NFT_COLLECTION` - This is the address of the required NFT collection.

The API request will return all the user's NFTs from the specified collection.

In the code, it will look like this:

```python
import requests

address = "USER_WALLET_ADDRESS"
nft_collection = "NFT_COLLECTION_ADDRESS"

url = f'https://tonapi.io/v2/accounts/{address}/nfts?collection={nft_collection}&limit=1000&offset=0&indirect_ownership=false'

try:
    response = requests.get(url).json()
except Exception as e:
    # Handle the exception if the request could not be executed
    print(f"Error: {e}")
```

Make sure to replace "USER_WALLET_ADDRESS" with the actual user's wallet address and "NET_COLLECTION_ADDRESS" with the desired NFT collection's address.

## [Here is an example of a simple bot](https://github.com/AndreyBurnosov/Checking_for_nft_availability).

## 📌 References

- [TON API](https://tonapi.io/)
- [Python library for TON Connect2.0](https://github.com/XaBbl4/pytonconnect)
- The tutorial was developed by [Andrew Burnosov](https://github.com/AndreyBurnosov) (TG: [@AndrewBurnosov](https://t.me/AndreyBurnosov))
