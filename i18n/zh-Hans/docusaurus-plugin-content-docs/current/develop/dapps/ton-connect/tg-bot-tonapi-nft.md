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
pip install aiogram redis qrcode tonsdk pytonconnect requests
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
from tonsdk.utils import Address
from pytonconnect import TonConnect
```

### 🗄️ Redis 数据库设置

此外，为了设置和启动 Redis 数据库，我建议您了解有关其安装和启动的信息，可以在[这里](https://redis.io/docs/getting-started/installation/)找到

## 🎨 编写机器人

### 🎹 设计键盘

首先，让我们创建一个包含所有必要键盘配置的文件，我们将其命名为 `keyboards.py`

```python
# 为 Telegram 机器人创建自定义键盘按钮和回复标记。

from aiogram.types import ReplyKeyboardMarkup, KeyboardButton

# 为“检查 footstep NFT”操作创建一个 KeyboardButton。
CheckButton = KeyboardButton('Check for footstep NFT')

# 使用 CheckButton 为“检查”操作创建一个 ReplyKeyboardMarkup。
# 'resize_keyboard' 参数设置为 True，允许在 Telegram 应用中调整键盘大小。
Checkkb = ReplyKeyboardMarkup(resize_keyboard=True).add(CheckButton)

# 为“Tonkeeper”和“Tonhub”操作创建额外的按钮。
TonkeeperButton = KeyboardButton('Tonkeeper')
TonhubButton = KeyboardButton('Tonhub')

# 使用 TonkeeperButton 和 TonhubButton 为“钱包”操作创建一个 ReplyKeyboardMarkup。
# 'resize_keyboard' 参数设置为 True，以允许在 Telegram 应用中调整键盘大小。
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
# 导入 Redis 库以与 Redis 数据库交互
import redis
# 从 pytonconnect 导入 IStorage 接口
from pytonconnect.storage import IStorage

# 创建与在 localhost 的端口 6379 上运行的 Redis 数据库的连接
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# 定义一个实现了 pytonconnect 中 IStorage 接口的 Storage 类
class Storage(IStorage):
    def __init__(self, id):
        # 构造方法初始化每个存储实例的唯一标识符
        self.id = id

    # 异步方法在 Redis 中设置键值对，键名附加唯一 ID
    async def set_item(self, key: str, value: str):
        r.set(key + self.id, value)

    # 异步方法从 Redis 中检索给定键的值，键名附加唯一 ID
    # 如果键不存在，返回默认值
    async def get_item(self, key: str, default_value: str = None):
        if r.exists(key + self.id):
            return r.get(key + self.id)
        else:
            return default_value

    # 异步方法从 Redis 中删除给定键的键值对，键名附加唯一 ID
    async def remove_item(self, key: str):
        r.delete(key + self.id)
```

还将其导入我们的主要机器人文件

```python
import database
```

### 🌟 编写启动处理程序

```python
# 定义一个用于私人聊天中的 '/start' 命令的命令处理程序
@dp.message_handler(commands=['start'], chat_type=types.ChatType.PRIVATE)
async def start_command(message: types.Message):
    # 向用户发送问候消息，解释机器人的功能
    await message.answer("Hi👋, 我是一个用于检查 NFT 所有权的示例机器人", reply_markup=kb.Checkkb)
    # 进一步解释机器人如何帮助检查 NFT 集合
    await message.answer("在我的帮助下，你可以检查你是否拥有来自 TON Footsteps 集合的 NFT")
```

### 🕵️ 检查 NFT 存在的功能

```python
# 一个消息处理函数，用于检查用户是否拥有 footstep NFT 并据此作出响应。

@dp.message_handler(text='Check for footstep NFT', chat_type=types.ChatType.PRIVATE)
async def connect_wallet_tonkeeper(message: types.Message):
    # 检查数据库中是否有给定 Telegram ID 的用户的钱包地址。
    # 如果地址不可用，提示用户连接他们的钱包 (Tonkeeper 或 Tonhub)。
    if cur.execute(f"SELECT address FROM Users WHERE id_tg == {message.from_user.id}").fetchall()[0][0] is None:
        await message.answer(text="要检查 NFT 的存在，请连接你的钱包 (Tonkeeper 或 Tonhub)", reply_markup=kb.Walletkb)
    else:
        # 如果用户的钱包地址可用，继续检查 footstep NFT 的存在。
        address = cur.execute(f"SELECT address FROM Users WHERE id_tg == {message.from_user.id}").fetchall()[0][0]

        # 形成查询用户在 TON Footsteps 集合中的 NFT 的 TON API 的 URL。
        url = f'https://tonapi.io/v2/accounts/{address}/nfts?collection=EQCV8xVdWOV23xqOyC1wAv-D_H02f7gAjPzOlNN6Nv1ksVdL&limit=1000&offset=0&indirect_ownership=false'

        try:
            # 向 TON API 发送 GET 请求并解析 JSON 响应以提取 NFT 项。
            response = requests.get(url).json()['nft_items']
        except:
            # 如果 API 请求出错，通知用户。
            await message.answer(text="出了些问题...")
            return

        # 根据 TON API 的响应，告知用户 NFT 存在与否。
        if response:
            await message.answer(text="你拥有来自 TON Footsteps 集合的 NFT")
        else:
            await message.answer(text="很遗憾，你没有来自 TON Footsteps 集合的 NFT")
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
# 定义一个用于在私人聊天中连接到钱包 (Tonkeeper 或 Tonhub) 的消息处理程序
@dp.message_handler(text=['Tonkeeper', 'Tonhub'], chat_type=types.ChatType.PRIVATE)
async def connect_wallet_tonkeeper(message: types.Message):
    # 根据用户的 ID 创建存储实例
    storage = database.Storage(str(message.from_user.id))

    # 使用给定的清单 URL 和存储初始化连接
    connector = TonConnect(manifest_url='https://raw.githubusercontent.com/AndreyBurnosov/Checking_for_nft_availability/main/pytonconnect-manifest.json', storage=storage)
    # 尝试恢复现有连接（如果有）
    is_connected = await connector.restore_connection()

    # 如果已经连接，通知用户并退出函数
    if is_connected:
        await message.answer('你的钱包已连接。')
        return

    # 定义不同钱包的连接选项
    conncetion = {'Tonkeeper': 0, 'Tonhub': 2}

    # 获取可用钱包列表
    wallets_list = connector.get_wallets()

    # 为选定的钱包生成连接 URL
    generated_url_tonkeeper = await connector.connect(wallets_list[connection[message.text]])

    # 创建一个内联键盘标记，带有一个按钮，用于打开连接 URL
    urlkb = InlineKeyboardMarkup(row_width=1)
    urlButton = InlineKeyboardButton(text=f'打开 {message.text}', url=generated_url_tonkeeper)
    urlkb.add(urlButton)

    # 为连接 URL 生成二维码并将其保存为图像
    img = qrcode.make(generated_url_tonkeeper)
    path = f'image{random.randint(0, 100000)}.png'
    img.save(path)
    photo = InputFile(path)

    # 使用内联键盘标记发送 QR 码图像给用户
    msg = await bot.send_photo(chat_id=message.chat.id, photo=photo, reply_markup=urlkb)
    # 从本地文件系统中删除保存的图像
    os.remove(path)

    # 在循环中检查连接是否成功，最多 300 次迭代（300 秒）
    for i in range(300):
        await asyncio.sleep(1)
        if connector.connected:
            if connector.account.address:
                address = Address(connector.account.address).to_string(True, True, True)
            break

    # 删除之前发送的 QR 码消息
    await msg.delete()

    # 确认钱包已成功连接给用户
    await message.answer('你的钱包已成功连接。', reply_markup=kb.Checkkb)
```

#### 📄 创建 TON Connect 清单

为了正确使用 TON Connect，我们还需要创建一个名为 `pytonconnect-manifest.json` 的文件，按照此模板：

```json
{
  "url": "<app-url>", // 必填
  "name": "<app-name>", // 必填
  "iconUrl": "<app-icon-url>", // 必填
  "termsOfUseUrl": "<terms-of-use-url>", // 可选
  "privacyPolicyUrl": "<privacy-policy-url>" // 可选
}
```

对于这个机器人，使用默认图标和任何想要的名称就足够了：

```json
{
  "url": "",
  "name": "示例机器人",
  "iconUrl": "https://raw.githubusercontent.com/XaBbl4/pytonconnect/main/pytonconnect.png"
}
```

你可以在[其库中](https://github.com/XaBbl4/pytonconnect)了解更多关于 `pytonconnect` 库的信息

### 🚀 启动机器人

将以下代码添加到 `main.py` 的末尾，我们就准备好测试我们的机器人了！

```python
# Telegram 机器人应用的主入口点。

if __name__ == '__main__':
    # 使用 executor 从 Telegram Bot API 开始轮询更新。
    # `dp`（调度器）对象处理消息处理和其他事件处理。
    # `skip_updates=True` 参数告诉执行器在启动时跳过挂起的更新。
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