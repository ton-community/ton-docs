# Telegram 机器人检查 NFT 所有权

## 👋 介绍

本文旨在提供关于验证令牌所有权的指导，随着 NFT 的流行程度持续飙升，越来越多的人寻找有效的方法来实现这一点。

## 📝 获取机器人的令牌

1. 在 Telegram 上访问 [BotFather](https://t.me/BotFather)。

2. 按照指示创建一个新的机器人。

3. 创建后，BotFather 将为您提供一个独特的令牌。这个令牌至关重要，因为它允许您的机器人与 Telegram API 通信。

## 🧠 机器人功能描述

### 功能

我们的 Telegram 机器人将执行一个引人入胜的示例任务，验证用户是否拥有来自 TON Footsteps 集合的 NFT 项目。关键部分将包括：

- aiogram 库：用于与 Telegram 客户端交互。
- TON Connect：连接用户的钱包。
- Redis 数据库：处理与 TON Connect 相关的数据。

### 🗂️ 项目结构

- 主文件：包含机器人的主要逻辑。
- 辅助文件：
  - 键盘：Telegram 机器人键盘对象。
  - 数据库准备：促进 TON Connect。

### 🛠️ 安装库

执行以下命令通过 `pip` 安装所有必要的库：

```bash
pip install aiogram redis qrcode pytoniq pytonconnect requests
```

然后将它们导入主文件：

```python
import asyncio
import requests
import qrcode
import os
import random

from aiogram import Bot, Dispatcher, executor, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.types.input_file import InputFile
from pytoniq import Address
from pytonconnect import TonConnect
```

### 🗄️ Redis 数据库设置

此外，为了设置和启动 Redis 数据库，我建议您了解有关其安装和启动的信息，可以在[这里](https://redis.io/docs/getting-started/installation/)找到

## 🎨 编写机器人

### 🎹 设计键盘

首先，让我们创建一个包含所有必要键盘配置的文件，我们将其命名为 `keyboards.py`

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

然后将此文件的导入添加到 `main.py` 中。

```python
import keyboards as kb
```

### 🧩 数据库准备

现在，我们需要准备我们的数据库以与 `pytonconnect` 接口。
为此，我们将创建一个名为 `database.py` 的新文件

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

还将其导入我们的主要机器人文件

```python
import database
```

### 🌟 编写启动处理程序

```python
# Define a command handler for the '/start' command for private chats
@dp.message_handler(commands=['start'], chat_type=types.ChatType.PRIVATE)
async def start_command(message: types.Message):
    # Send a greeting message to the user, explaining the bot's functionality
    await message.answer("Hi👋, I am an example of a bot for checking the ownership of the NFT", reply_markup=kb.Checkkb)
    # Further explain how the bot can help with NFT collection checking
    await message.answer("With my help, you can check if you have an NFT from the TON Footsteps collection")
```

### 🕵️ 检查 NFT 存在的功能

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

为了检查用户是否拥有必要的 NFT 集合，我们将使用 [TONAPI](https://tonapi.io/)。请求将如下所示：

```bash
https://tonapi.io/v2/accounts/<ADDRESS>/nfts?collection=<NFT_COLLECTION>&limit=1000&offset=0&indirect_ownership=false
```

其中：

- `ADDRESS` - 这是我们想要检查所需 NFT 的用户的钱包地址。
- `NFT_COLLECTION` - 这是所需 NFT 集合的地址。

API 请求将返回用户从指定集合中的所有 NFT。

### 🏡 通过 TON Connect 获取用户地址的功能

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
                address = Address(connector.account.address).to_str(True, True, True)
            break

    # Delete the previously sent QR code message
    await msg.delete()

    # Confirm to the user that the wallet has been successfully connected
    await message.answer('Your wallet has been successfully connected.', reply_markup=kb.Checkkb)
```

#### 📄 创建 TON Connect 清单

为了正确使用 TON Connect，我们还需要创建一个名为 `pytonconnect-manifest.json` 的文件，按照此模板：

```json
{
  "url": "<app-url>", // required
  "name": "<app-name>", // required
  "iconUrl": "<app-icon-url>", // required
  "termsOfUseUrl": "<terms-of-use-url>", // optional
  "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

对于这个机器人，使用默认图标和任何想要的名称就足够了：

```json
{
  "url": "",
  "name": "Example bot",
  "iconUrl": "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect.png"
}
```

你可以在[其库中](https://github.com/XaBbl4/pytonconnect)了解更多关于 `pytonconnect` 库的信息

### 🚀 启动机器人

将以下代码添加到 `main.py` 的末尾，我们就准备好测试我们的机器人了！

```python
# The main entry point of the Telegram bot application.

if __name__ == '__main__':
    # Start polling for updates from the Telegram Bot API using the executor.
    # The `dp` (Dispatcher) object handles message handling and other event processing.
    # The `skip_updates=True` parameter tells the executor to skip pending updates when starting.
    executor.start_polling(dp, skip_updates=True)
```

现在只需在终端中运行这个命令：

```bash
python3 main.py
```

之后，在 Telegram 中打开与您的机器人的对话尝试使用它。如果您正确地遵循了这个指南，机器人应该能够按预期工作！

## [🎁 最终代码和资源](https://github.com/AndreyBurnosov/Checking_for_nft_availability)

## 📌 参考

- [TON API](https://tonapi.io/)
- [TON Connect2.0 的 Python 库](https://github.com/XaBbl4/pytonconnect)
- 本教程由 [Andrew Burnosov](https://github.com/AndreyBurnosov) 开发 (TG: [@AndreyBurnosov](https://t.me/AndreyBurnosov))
