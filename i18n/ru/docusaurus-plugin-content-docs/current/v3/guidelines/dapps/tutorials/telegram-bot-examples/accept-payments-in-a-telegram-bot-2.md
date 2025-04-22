---
description: В этой статье мы создадим простого Telegram-бота для приема платежей в TON.
---

# Бот с внутренним балансом

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы создадим простого Telegram-бота для приема платежей в TON.

## 🦄 Как это выглядит

Бот будет выглядеть следующим образом:

![image](/img/tutorials/bot1.png)

### Исходный код

Исходники доступны на GitHub:

- https://github.com/Gusarich/ton-bot-example

## 📖 Чему Вы научитесь

Вы узнаете, как:

- Создать Telegram бота в Python3 с помощью Aiogram
- Работать с базами данных SQLITE
- Работать с открытым API TON

## ✍️ Что нужно для начала работы

Установите [Python](https://www.python.org/), если вы этого еще не сделали.

Также вам понадобятся эти библиотеки PyPi:

- aiogram
- requests

Вы можете установить их одной командой в терминале.

```bash
pip install aiogram==2.21 requests
```

## 🚀 Давайте начнем!

Создайте директорию для нашего бота с четырьмя файлами в ней:

- `bot.py`- программа для запуска Telegram бота
- `config.py` - файл конфигурации
- `db.py`- модуль для взаимодействия с базой данных sqlite3
- `ton.py` - модуль для работы с платежами в TON

Директория должна выглядеть следующим образом:

```
my_bot
├── bot.py
├── config.py
├── db.py
└── ton.py
```

Теперь давайте начнем писать код!

## Конфигурация

Давайте начнем с `config.py`, потому что он самый маленький. Нам просто нужно задать в нем несколько параметров.

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

Здесь вам нужно заполнить значения в первых трех строках:

- `BOT_TOKEN` - это ваш токен Telegram бота, который вы можете получить после [создания бота] (https://t.me/BotFather).
- `DEPOSIT_ADDRESS` - это адрес кошелька вашего проекта, который будет принимать все платежи. Вы можете просто создать новый кошелек TON и скопировать его адрес.
- `API_KEY` - это ваш API-ключ от TON Center, который вы можете получить в [этом боте](https://t.me/tonapibot).

Вы также можете выбрать, будет ли ваш бот работать в тестовой или в основной сети (4-я линия).

Это все, что касается файла конфигурации, поэтому мы можем двигаться дальше!

## База данных

Теперь давайте отредактируем файл `db.py`, который будет работать с базой данных нашего бота.

Импортируйте библиотеку sqlite3.

```python
import sqlite3
```

Инициализируйте подключение к базе данных и курсор (вы можете указать любое имя файла вместо `db.sqlite`).

```python
con = sqlite3.connect('db.sqlite')
cur = con.cursor()
```

Чтобы хранить информацию о пользователях (в нашем случае их балансы), создайте таблицу "Users" со строками User ID и Balance.

```python
cur.execute('''CREATE TABLE IF NOT EXISTS Users (
                uid INTEGER,
                balance INTEGER
            )''')
con.commit()
```

Теперь нам нужно декларировать несколько функций для работы с базой данных.

Функция `add_user` будет использоваться для вставки новых пользователей в базу данных.

```python
def add_user(uid):
    # new user always has balance = 0
    cur.execute(f'INSERT INTO Users VALUES ({uid}, 0)')
    con.commit()
```

Функция `check_user` будет использоваться для проверки того, существует ли пользователь в базе данных или нет.

```python
def check_user(uid):
    cur.execute(f'SELECT * FROM Users WHERE uid = {uid}')
    user = cur.fetchone()
    if user:
        return True
    return False
```

Функция `add_balance` будет использоваться для увеличения баланса пользователя.

```python
def add_balance(uid, amount):
    cur.execute(f'UPDATE Users SET balance = balance + {amount} WHERE uid = {uid}')
    con.commit()
```

Функция `get_balance` будет использоваться для получения баланса пользователя.

```python
def get_balance(uid):
    cur.execute(f'SELECT balance FROM Users WHERE uid = {uid}')
    balance = cur.fetchone()[0]
    return balance
```

Вот и все для файла `db.py`!

Теперь мы можем использовать эти четыре функции в других компонентах бота для работы с базой данных.

## TON Center API

В файле `ton.py` мы декларируем функцию, которая будет обрабатывать все новые депозиты, увеличивать баланс пользователей и уведомлять их.

### Метод getTransactions

Мы будем использовать TON Center API. Их документация доступна здесь:
https://toncenter.com/api/v2/.

Нам нужен метод [getTransactions](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get), чтобы получить информацию о последних транзакциях по данному счету.

Давайте посмотрим, что этот метод принимает в качестве входных параметров и что он возвращает.

Здесь есть только одно обязательное поле ввода `address`, но нам также нужно поле `limit`, чтобы указать, сколько транзакций мы хотим получить в ответ.

Теперь давайте попробуем запустить этот метод на сайте [TON Center](https://toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get) с любым существующим адресом кошелька, чтобы понять, что мы должны получить на выходе.

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

Итак, когда все в порядке, в поле `ok` устанавливается значение `true` и мы получаем массив `result` со списком последних транзакций `limit`. Теперь давайте рассмотрим одну единственную транзакцию:

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

Мы видим, что информация, которая может помочь нам точно идентифицировать транзакцию, хранится в поле `transaction_id`. Нам нужно поле `lt` из него, чтобы понять, какая транзакция произошла раньше, а какая позже.

Информация о передаче монеты находится в поле `in_msg`. Нам понадобятся `value` и `message` из него.

Теперь мы готовы создать обработчик платежей.

### Отправка API-запросов из кода

Давайте начнем с импорта необходимых библиотек и двух наших предыдущих файлов: `config.py` и `db.py`.

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

Давайте подумаем, как может быть реализована обработка платежей.

Мы можем вызывать API каждые несколько секунд и проверять, есть ли новые транзакции по адресу нашего кошелька.

Для этого нам нужно знать, какой была последняя обработанная транзакция. Самым простым подходом было бы просто сохранить информацию об этой транзакции в каком-нибудь файле и обновлять ее каждый раз, когда мы обрабатываем новую транзакцию.

Какую информацию о транзакции мы будем хранить в файле? На самом деле, нам нужно хранить только значение `lt` - logical time (логическое время).
С помощью этого значения мы сможем понять, какие транзакции нам нужно обработать.

Поэтому нам нужно определить новую асинхронную функцию; назовем ее `start`. Почему эта функция должна быть асинхронной? Потому что библиотека Aiogram для ботов Telegram также является асинхронной, и в дальнейшем с асинхронными функциями будет проще работать.

Вот как должна выглядеть наша функция `start`:

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

Теперь давайте напишем тело цикла while. Нам нужно вызывать TON Center API каждые несколько секунд.

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

После вызова `requests.get` у нас есть переменная `resp`, которая содержит ответ от API. `resp` - это объект, а `resp['result']` - список с последними 100 транзакциями для нашего адреса.

Теперь давайте просто пройдемся итерацией по этим транзакциям и найдем новые.

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

Как нам обработать новую транзакцию? Нам необходимо:

- понять, какой пользователь отправил его
- увеличить баланс этого пользователя
- уведомить пользователя о его депозите

Вот код, который все это сделает:

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

Давайте посмотрим на него и разберемся, что он делает.

Вся информация о передаче монеты находится в `tx['in_msg']`. Нам нужны только поля 'value' и 'message'.

Прежде всего, мы проверяем, больше ли значение нуля, и продолжаем только в том случае, если это так.

Затем мы ожидаем, что при передаче комментарий ( `tx['in_msg']['message']`) будет иметь идентификатор пользователя от нашего бота, поэтому мы проверяем, является ли он действительным номером и существует ли этот UID в нашей базе данных.

После этих простых проверок у нас есть переменная `value` с суммой депозита и переменная `uid` с идентификатором пользователя, который сделал этот депозит. Таким образом, мы можем просто добавить средства на его счет и отправить уведомление.

Также обратите внимание, что по умолчанию значение указано в нанотонах, поэтому нам нужно разделить его на 1 миллиард. Мы делаем это в соответствии с уведомлением:
`{value / 1e9:.2f}`
Здесь мы делим значение на `1e9` (1 миллиард) и оставляем только две цифры после запятой, чтобы показать его пользователю в удобном формате.

Отлично! Теперь программа может обрабатывать новые транзакции и уведомлять пользователей о депозитах. Но мы не должны забывать о сохранении `lt`, которое мы использовали ранее. Мы должны обновить последнее `lt`, потому что была обработана более новая транзакция.

Все просто:

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

И это все для файла `ton.py`!
Теперь наш бот готов на 3/4. Нам осталось только создать пользовательский интерфейс с несколькими кнопками в самом боте.

## Telegram бот

### Инициализация

Откройте файл `bot.py` и импортируйте все необходимые модули.

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

Давайте настроим ведение журнала в нашей программе, чтобы мы могли видеть, что происходит позже, для отладки.

```python
logging.basicConfig(level=logging.INFO)
```

Теперь нам нужно инициализировать bot object и dispatcher с помощью Aiogram.

```python
bot = Bot(token=config.BOT_TOKEN)
dp = Dispatcher(bot)
```

Здесь мы используем `BOT_TOKEN` из нашего файла конфигурации, который мы сделали в начале урока.

Мы инициализировали бота, но он все еще пуст. Мы должны добавить несколько функций для взаимодействия с пользователем.

### Обработчики сообщений

#### Команда /start

Начнем с обработчика команд `/start` и `/help`. Эта функция будет вызываться, когда пользователь запускает бота в первый раз, перезапускает его или использует команду `/help`.

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

Приветственное сообщение может быть любым, каким вы захотите. Кнопки клавиатуры могут быть любыми, но в данном примере они обозначены наиболее понятным для нашего бота образом: `Deposit` и `Balance`.

#### Кнопка баланса

Теперь пользователь может запустить бота и увидеть клавиатуру с двумя кнопками. Но после вызова одной из них пользователь не получит никакого ответа, потому что мы не создали для нее никакой функции.

Поэтому давайте добавим функцию запроса баланса.

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

Все довольно просто. Мы просто получаем баланс из базы данных и отправляем сообщение пользователю.

#### Кнопка Deposit

А как насчет второй кнопки `Deposit`? Вот функция для нее:

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

То, что мы делаем здесь, также легко понять.

Помните, как в файле `ton.py` мы определяли, какой пользователь сделал депозит, по комментарию с его UID? Теперь здесь, в боте, нам нужно попросить пользователя отправить транзакцию с комментарием, содержащим его UID.

### Запуск бота

Единственное, что нам теперь нужно сделать в `bot.py`, это запустить самого бота, а также выполнить функцию `start` из `ton.py`.

```python
if __name__ == '__main__':
    # Create Aiogram executor for our bot
    ex = executor.Executor(dp)

    # Launch the deposit waiter with our executor
    ex.loop.create_task(ton.start())

    # Launch the bot
    ex.start_polling()
```

На данный момент мы написали весь необходимый код для нашего бота. Если вы все сделали правильно, он должен работать, когда вы запустите его с помощью команды `python my-bot/bot.py` в терминале.

Если ваш бот работает некорректно, сравните свой код с кодом [из этого репозитория](https://github.com/Gusarich/ton-bot-example).

## Ссылки

- Сделано для TON как часть [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- By Gusarich ([Telegram @Gusarich](https://t.me/Gusarich), [Gusarich on GitHub](https://github.com/Gusarich))
