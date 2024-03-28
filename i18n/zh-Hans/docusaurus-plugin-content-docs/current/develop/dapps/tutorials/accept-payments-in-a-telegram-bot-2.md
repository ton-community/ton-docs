---
description: 在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。
---

# 带有自己余额的机器人


在本文中，我们将创建一个简单的Telegram机器人，用于接收TON支付。

## 🦄 外观

机器人将如下所示：

![image](/img/tutorials/bot1.png)

### 源代码

源代码可在GitHub上获得：
* https://github.com/Gusarich/ton-bot-example

## 📖 你将学到什么
你将学会：
 - 使用Aiogram在Python3中创建一个Telegram机器人
 - 使用SQLITE数据库
 - 使用公共TON API

## ✍️ 开始之前你需要
如果还没有安装[Python](https://www.python.org/)，请先安装。

还需要以下PyPi库：
 - aiogram
 - requests

你可以在终端中用一条命令安装它们。
```bash
pip install aiogram==2.21 requests
```

## 🚀 开始吧！
为我们的机器人创建一个目录，其中包含四个文件：
 - `bot.py`—运行Telegram机器人的程序
 - `config.py`—配置文件
 - `db.py`—与sqlite3数据库交互的模块
 - `ton.py`—处理TON支付的模块

目录应该看起来像这样：
```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

现在，让我们开始编写代码吧！

## 配置
我们先从`config.py`开始，因为它是最小的一个。我们只需要在其中设置一些参数。

**config.py**
```python
BOT_TOKEN = 'YOUR BOT TOKEN'
DEPOSIT_ADDRESS = 'YOUR DEPOSIT ADDRESS'
API_KEY = 'YOUR API KEY'
RUN_IN_MAINNET = True  # 切换True/False以改变主网到测试网

if RUN_IN_MAINNET:
    API_BASE_URL = 'https://toncenter.com'
else:
    API_BASE_URL = 'https://testnet.toncenter.com'
```

这里你需要在前三行填入值：
 - `BOT_TOKEN`是你的Telegram机器人令牌，可以在[创建机器人](https://t.me/BotFather)后获得。
 - `DEPOSIT_ADDRESS`是你的项目钱包地址，将接受所有支付。你可以简单地创建一个新的TON钱包并复制其地址。
 - `API_KEY`是你从TON Center获得的API密钥，可以在[这个机器人](https://t.me/tonapibot)中获得。

你还可以选择你的机器人是运行在测试网上还是主网上（第4行）。

配置文件就是这些了，我们可以继续向前了！

## 数据库
现在让我们编辑`db.py`文件，该文件将处理我们机器人的数据库。

导入sqlite3库。
```python
import sqlite3
```

初始化数据库连接和游标（你可以选择任何文件名，而不仅限于`db.sqlite`）。
```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

为了存储关于用户的信息（在我们的案例中是他们的余额），创建一个名为"Users"的表，包含用户ID和余额行。
```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

现在我们需要声明一些函数来处理数据库。

`add_user`函数将用于将新用户插入数据库。
```python
def add_user(uid):
    # 新用户的余额始终为0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

`check_user`函数将用于检查用户是否存在于数据库中。
```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

`add_balance`函数将用于增加用户的余额。
```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

`get_balance`函数将用于检索用户的余额。
```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

`db.py`文件的内容就这些了！

现在，我们可以在机器人的其他组件中使用这四个函数来处理数据库。

## TON Center API
在`ton.py`文件中，我们将声明一个函数，该函数将处理所有新的存款，增加用户余额，并通知用户。

### getTransactions 方法

我们将使用TON Center API。他们的文档在这里：
https://toncenter.com/api/v2/

我们需要[getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)方法来获取某个账户最新交易的信息。

让我们看看这个方法作为输入参数需要什么以及它返回了什么。

只有一个必填的输入字段`address`，但我们还需要`limit`字段来指定我们想要返回多少个交易。

现在让我们尝试在[TON Center 网站](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get)上运行这个方法，使用任何一个已存在的钱包地址，以了解我们应该从输出中得到什么。

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

好的，所以当一切正常时，`ok`字段被设置为`true`，并且我们有一个数组`result`，列出了`limit`最近的交易。现在让我们看看单个交易：

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

我们可以看到可以帮助我们识别确切交易的信息存储在`transaction_id`字段中。我们需要从中获取`lt`字段，以了解哪个交易先发生，哪个后发生。

关于coin转移的信息在`in_msg`字段中。我们需要从中获取`value`和`message`。

现在我们准备好创建支付处理程序了。

### 从代码中发送 API 请求

让我们从导入所需的库和之前的两个文件`config.py`和`db.py`开始。
```python
import requests
import asyncio

# Aiogram
from aiogram import Bot
from aiogram.types import ParseMode

# 我们还需要在这里用到config和database
import config
import db
```

让我们考虑如何可以实现支付处理。

我们可以每隔几秒调用API，并检查我们的钱包地址是否有任何新交易。

为此，我们需要知道最后处理的交易是什么。最简单的方法是只将该交易的信息保存在某个文件中，并在我们处理新交易时更新它。

我们需要将哪些交易信息存储在文件中？实际上，我们只需要存储`lt`值——逻辑时间。有了这个值，我们就能知道需要处理哪些交易。

所以我们需要定义一个新的异步函数；让我们称之为`start`。为什么这个函数需要是异步的？因为Telegram机器人的Aiogram库也是异步的，稍后使用异步函数会更容易。

这是我们的`start`函数应该看起来的样子：
```python
async def start():
    try:
        # 尝试从文件中加载last_lt
        with open('last_lt.txt', 'r') as f:
            last_lt = int(f.read())
    except FileNotFoundError:
        # 如果找不到文件，则将last_lt设置为0
        last_lt = 0

    # 我们在这里需要Bot实例来向用户发送存款通知
    bot = Bot(token=config.BOT_TOKEN)

    while True:
        # 在这里，我们将每隔几秒调用API并获取新交易。
        ...
```        

现在让我们编写while循环的主体。我们需要每隔几秒在这里调用TON Center API。
```python
while True:
    # 每次检查之间延迟2秒
    await asyncio.sleep(2)

    # 调用TON Center API，返回我们钱包的最后100笔交易
    resp = requests.get(f'{config.API_BASE_URL}/api/v2/getTransactions?'
                        f'address={config.DEPOSIT_ADDRESS}&limit=100&'
                        f'archival=true&api_key={config.API_KEY}').json()

    # 如果调用不成功，再试一次
    if not resp['ok']:
        continue
    
    ...
```

在使用`requests.get`调用后，我们有一个变量`resp`包含了API的响应。`resp`是一个对象，`resp['result']`是一个列表，包含了我们地址的最后100笔交易。

现在我们只需遍历这些交易，找到新的交易即可。

```python
while True:
    ...

    # 遍历交易
    for tx in resp['result']:
        # LT是逻辑时间，Hash是我们交易的哈希值
        lt, hash = int(tx['transaction_id']['lt']), tx['transaction_id']['hash']

        # 如果这笔交易的逻辑时间小于我们的last_lt,
        # 我们已经处理过了，所以跳过它

        if lt <= last_lt:
            continue
        
        # 此时，`tx`是一笔我们尚未处理的新交易
        ...
```

我们如何处理一笔新的交易呢？我们需要：
 - 理解哪个用户发送了它
 - 增加该用户的余额
 - 通知用户他们的存款

下面是将完成所有这些操作的代码：

```python
while True:
    ...

    for tx in resp['result']:
        ...
        # 此时，`tx`是一笔我们尚未处理的新交易

        value = int(tx['in_msg']['value'])
        if value > 0:
            uid = tx['in_msg']['message']

            if not uid.isdigit():
                continue

            uid = int(uid)

            if not db.check_user(uid):
                continue

            db.add_balance(uid, value)

            await bot.send_message(uid, '存款已确认！\n'
                                    f'*+{value / 1e9:.2f} TON*',
                                    parse_mode=ParseMode.MARKDOWN)
```

让我们看看它做了什么。

所有有关coin转移的信息都在`tx['in_msg']`中。我们只需要其中的'value'和'message'字段。

首先，我们检查值是否大于零，如果是，才继续。

然后我们期望转移有一个评论（`tx['in_msg']['message']`），以有我们机器人的用户ID，所以我们验证它是否是一个有效的数字，以及该UID是否存在于我们的数据库中。

经过这些简单的检查，我们有了一个变量`value`，它是存款金额，和一个变量`uid`，它是进行此次存款的用户ID。所以我们可以直接给他们的账户增加资金，并发送通知消息。

同时注意值默认是以nanotons为单位的，所以我们需要将其除以10亿。我们在通知消息中这样做：
`{value / 1e9:.2f}`
这里我们将值除以`1e9`（10亿），并保留小数点后两位数字，以便以用户友好的格式显示给用户。

太棒了！程序现在可以处理新交易并通知用户存款情况。但我们不应忘记之前我们使用过的`lt`，我们必须更新最后的`lt`，因为处理了一个更新的交易。

这很简单：
```python
while True:
    ...
    for tx in resp['result']:
        ...
        # 我们处理了这个tx

        # lt变量此处包含最后处理的交易的LT
        last_lt = lt
        with open('last_lt.txt', 'w') as f:
            f.write(str(last_lt))
```

`ton.py`文件的内容就这些了！
我们的机器人现在已完成3/4；我们只需要在机器人自身创建一个包含几个按钮的用户界面。

## Telegram 机器人

### 初始化

打开`bot.py`文件并导入我们所需的所有模块。
```python
# 日志模块
import logging

# Aiogram导入
from aiogram import Bot, Dispatcher, types
from aiogram.dispatcher.filters import Text
from aiogram.types import ParseMode, ReplyKeyboardMarkup, KeyboardButton, \
                          InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

# 本地模块以处理数据库和TON网络
import config
import ton
import db
```

让我们设置日志记录，以便我们以后可以看到发生的事情以便调试。
```python
logging.basicConfig(level=logging.INFO)
```

现在我们需要使用Aiogram初始化机器人对象及其调度器。
```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

这里我们使用了教程开始时我们创建的配置中的`BOT_TOKEN`。

我们初始化了机器人，但它仍然是空的。我们必须添加一些与用户交互的功能。

### 消息处理器

#### /start 命令

我们首先处理`/start`和`/help`命令。当用户第一次启动机器人、重新启动它或使用`/help`命令时，将调用此函数。

```python
@dp.message_handler(commands=['start', 'help'])
async def welcome_handler(message: types.Message):
    uid = message.from_user.id  # 不是必须的，只是为了使代码更短

    # 如果用户在数据库中不存在，插入它
    if not db.check_user(uid):
        db.add_user(uid)

    # 带有两个主按钮的键盘：存款和余额
    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.row(KeyboardButton('Deposit'))
    keyboard.row(KeyboardButton('Balance'))

    # 发送欢迎文本并包含键盘
    await message.answer('Hi!\nI am example bot '
                         'made for [this article](/develop/dapps/payment-processing/accept-payments-in-a-telegram-bot-2).\n'
                         'My goal is to show how simple it is to receive '
                         'payments in Toncoin with Python.\n\n'
                         'Use keyboard to test my functionality.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

欢迎消息可以是你想要的任何内容。键盘按钮可以是任何文本，但在这个示例中，它们被标记为我们的机器人最清晰的方式：`Deposit`和`Balance`。

#### 余额(Balance)按钮

现在用户可以启动机器人并看到带有两个按钮的键盘。但在调用其中一个后，用户不会收到任何响应，因为我们还没有为它们创建任何功能。

所以让我们添加一个请求余额的功能。

```python
@dp.message_handler(commands='balance')
@dp.message_handler(Text(equals='balance', ignore_case=True))
async def balance_handler(message: types.Message):
    uid = message.from_user.id

    # 从数据库获取用户余额
    # 别忘了1 TON = 1e9 (十亿) Nanoton
    user_balance = db.get_balance(uid) / 1e9

    # 格式化余额并发送给用户
    await message.answer(f'Your balance: *{user_balance:.2f} TON*',
                         parse_mode=ParseMode.MARKDOWN)
```

这非常简单。我们只需从数据库获取余额并向用户发送消息。

#### 存款(Deposit)按钮

那第二个`Deposit`按钮呢？这是它的函数：

```python
@dp.message_handler(commands='deposit')
@dp.message_handler(Text(equals='deposit', ignore_case=True))
async def deposit_handler(message: types.Message):
    uid = message.from_user.id

    # 带有deposit URL的键盘
    keyboard = InlineKeyboardMarkup()
    button = InlineKeyboardButton('Deposit',
                                  url=f'ton://transfer/{config.DEPOSIT_ADDRESS}&text={uid}')
    keyboard.add(button)

    # 向用户发送如何向机器人存款的说明文本
    await message.answer('It is very easy to top up your balance here.\n'
                         'Simply send any amount of TON to this address:\n\n'
                         f'`{config.DEPOSIT_ADDRESS}`\n\n'
                         f'And include the following comment: `{uid}`\n\n'
                         'You can also deposit by clicking the button below.',
                         reply_markup=keyboard,
                         parse_mode=ParseMode.MARKDOWN)
```

这里我们要做的也很容易理解。

还记得在`ton.py`文件中，我们是如何通过评论确定哪个用户进行了存款吗？现在在机器人中，我们需要请求用户发送包含他们UID的交易。

### 启动机器人

现在在`bot.py`中我们要做的最后一件事是启动机器人本身，同时也运行`ton.py`中的`start`函数。

```python
if __name__ == '__main__':
    # 为我们的机器人创建Aiogram执行器
    ex = executor.Executor(dp)

    # 使用我们的执行器启动存款等待器
    ex.loop.create_task(ton.start())

    # 启动机器人
    ex.start_polling()
```

此时，我们已经编写了我们机器人所需的所有代码。如果你按照教程正确完成，当你使用`python my-bot/bot.py`命令在终端运行时，它应该会工作。

如果你的机器人不能正确工作，请与[这个库](https://github.com/Gusarich/ton-bot-example)的代码进行对比。

## 参考资料

 - 作为[ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)的一部分
 - 由Gusarich提供（[Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich)）