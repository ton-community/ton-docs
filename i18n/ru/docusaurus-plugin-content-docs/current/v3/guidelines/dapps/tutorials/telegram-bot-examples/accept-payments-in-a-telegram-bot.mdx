---
description: В этой статье мы расскажем о том, как принимать платежи в боте Telegram.
---

# Бот-витрина магазина с оплатой в TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

В этой статье мы расскажем о том, как принимать платежи в боте Telegram.

## 📖 Чему вы научитесь

В этой статье вы узнаете, как:

- создать Telegram-бота с помощью Python + Aiogram
- работать с публичным API TON (TON Center)
- работать с базой данных SQlite

И наконец: как принимать платежи в Telegram-боте, используя знания из предыдущих шагов.

## 📚 Прежде чем мы начнем

Убедитесь, что у вас установлена последняя версия Python и установлены следующие пакеты:

- aiogram
- requests
- sqlite3

## 🚀 Давайте начнем!

Мы будем действовать по нижеприведенному порядку:

1. Работа с базой данных SQlite
2. Работа с публичным API TON (TON Center)
3. Создание Telegram-бота с помощью Python + Aiogram
4. Получаем прибыль!

Давайте создадим следующие четыре файла в директории нашего проекта:

```
telegram-bot
├── config.json
├── main.py
├── api.py
└── db.py
```

## Конфигурация

В `config.json` мы сохраним токен нашего бота и наш публичный ключ TON API.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

В `config.json` мы решаем, какую сеть мы будем использовать: `testnet` или `mainnet`.

## База данных

### Создаем базу данных

В этом примере используется локальная база данных Sqlite.

Создайте `db.py`.

Чтобы начать работу с базой данных, нам нужно импортировать модуль sqlite3
и несколько модулей для работы со временем.

```python
import sqlite3
import datetime
import pytz
```

- `Sqlite3`-модуль для работы с базой данных sqlite
- `datetime` - модуль для работы со временем
- `pytz`- модуль для работы с часовыми поясами

Далее нам нужно создать соединение с базой данных и курсор для работы с ней:

```python
locCon = sqlite3.connect('local.db', check_same_thread=False)
cur = locCon.cursor()
```

Если база данных не существует, она будет создана автоматически.

Теперь мы можем создать таблицы. У нас их две.

#### Транзакции:

```sql
CREATE TABLE transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                         NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
);
```

- `source` - адрес кошелька плательщика
- `hash`- хэш транзакции
- `value`- значение транзакции
- `comment`- комментарий к транзакции

#### Пользователи:

```sql
CREATE TABLE users (
    id         INTEGER       UNIQUE
                             NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
);
```

- `id` - ID пользователя Telegram
- `username` - имя пользователя Telegram
- `first_name` - имя пользователя Telegram
- `wallet`- адрес кошелька пользователя

В таблице `users` мы храним пользователей :) их Telegram ID, @логин,
имя и кошелек. Кошелек добавляется в базу данных при первом
успешном платеже.

В таблице `transactions` хранятся проверенные транзакции.
Чтобы проверить транзакцию, нам нужны хеш, источник, значение и комментарий.

Чтобы создать эти таблицы, нам нужно выполнить следующую функцию:

```python
cur.execute('''CREATE TABLE IF NOT EXISTS transactions (
    source  VARCHAR (48) NOT NULL,
    hash    VARCHAR (50) UNIQUE
                        NOT NULL,
    value   INTEGER      NOT NULL,
    comment VARCHAR (50)
)''')
locCon.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS users (
    id         INTEGER       UNIQUE
                            NOT NULL,
    username   VARCHAR (33),
    first_name VARCHAR (300),
    wallet     VARCHAR (50)  DEFAULT none
)''')
locCon.commit()
```

Этот код создаст таблицы, если они еще не созданы.

### Работа с базой данных

Давайте проанализируем ситуацию.
Пользователь совершил транзакцию. Как ее подтвердить? Как сделать так, чтобы одна и та же транзакция не была подтверждена дважды?

В транзакциях есть body_hash, с помощью которого мы можем легко понять, есть ли транзакция в базе данных или нет.

Мы добавляем транзакции в базу данных, в которых мы уверены. Функция `check_transaction` проверяет, есть ли найденная транзакция в базе данных или нет.

`add_v_transaction` добавляет транзакцию в таблицу транзакций.

```python
def add_v_transaction(source, hash, value, comment):
    cur.execute("INSERT INTO transactions (source, hash, value, comment) VALUES (?, ?, ?, ?)",
                (source, hash, value, comment))
    locCon.commit()
```

```python
def check_transaction(hash):
    cur.execute(f"SELECT hash FROM transactions WHERE hash = '{hash}'")
    result = cur.fetchone()
    if result:
        return True
    return False
```

`check_user` проверяет, есть ли пользователь в базе данных, и добавляет его, если нет.

```python
def check_user(user_id, username, first_name):
    cur.execute(f"SELECT id FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()

    if not result:
        cur.execute("INSERT INTO users (id, username, first_name) VALUES (?, ?, ?)",
                    (user_id, username, first_name))
        locCon.commit()
        return False
    return True
```

Пользователь может сохранить кошелек в таблице. Он добавляется при первой успешной покупке. Функция `v_wallet` проверяет, есть ли у пользователя связанный с ним кошелек. Если есть, то возвращает его. Если нет, то добавляет.

```python
def v_wallet(user_id, wallet):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    if result[0] == "none":
        cur.execute(
            f"UPDATE users SET wallet = '{wallet}' WHERE id = '{user_id}'")
        locCon.commit()
        return True
    else:
        return result[0]
```

`get_user_wallet` просто возвращает кошелек пользователя.

```python
def get_user_wallet(user_id):
    cur.execute(f"SELECT wallet FROM users WHERE id = '{user_id}'")
    result = cur.fetchone()
    return result[0]
```

`get_user_payments` возвращает список платежей пользователя.
Эта функция проверяет, есть ли у пользователя кошелек. Если есть, то она возвращает список платежей.

```python
def get_user_payments(user_id):
    wallet = get_user_wallet(user_id)

    if wallet == "none":
        return "You have no wallet"
    else:
        cur.execute(f"SELECT * FROM transactions WHERE source = '{wallet}'")
        result = cur.fetchall()
        tdict = {}
        tlist = []
        try:
            for transaction in result:
                tdict = {
                    "value": transaction[2],
                    "comment": transaction[3],
                }
                tlist.append(tdict)
            return tlist

        except:
            return False
```

## API

*У нас есть возможность взаимодействовать с блокчейном, используя сторонние API, предоставляемые некоторыми участниками сети. С помощью этих сервисов разработчики могут пропустить этап запуска собственного узла и настройки API.*

### Необходимые запросы

Фактически, что нам нужно, чтобы подтвердить, что пользователь перевел нам требуемую сумму?

Нам просто нужно просмотреть последние входящие переводы на наш кошелек и найти среди них транзакцию с нужного адреса с нужной суммой (и, возможно, уникальным комментарием).
Для всего этого в TON Center есть метод `getTransactions`.

### getTransactions

По умолчанию, если мы применим эту функцию, мы получим 10 последних транзакций. Однако мы также можем указать, что нам нужно больше, но это несколько увеличит время ответа. И, скорее всего, вам не нужно так много.

Если вам нужно больше, то у каждой транзакции есть `lt` и `hash`. Вы можете просмотреть, например, 30 транзакций, и если среди них не найдется нужной, то взять `lt` и `hash` из последней и добавить их в запрос.

Таким образом, вы получаете следующие 30 транзакций и так далее.

Например, в тестовой сети есть кошелек `EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5`, в нем есть несколько транзакций:

Используя запрос, мы получим ответ, содержащий две транзакции (часть информации, которая сейчас не нужна, была скрыта, полный ответ вы можете увидеть по ссылке выше).

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1944556000003",
        // highlight-next-line
        "hash": "swpaG6pTBXwYI2024NAisIFp59Fw3k1DRQ5fa5SuKAE="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "kBfGYBTkBaooeZ+NTVR0EiVGSybxQdb/ifXCRX5O7e0=",
        "message": "Sea breeze 🌊"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        // highlight-next-line
        "lt": "1943166000003",
        // highlight-next-line
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    }
  ]
}
```

Мы получили две последние транзакции с этого адреса. Добавив в запрос `lt` и `hash`, мы снова получим две транзакции. Однако вторая станет следующей в ряду. То есть, мы получим вторую и третью транзакции для этого адреса.

```json
{
  "ok": true,
  "result": [
    {
      "transaction_id": {
        "lt": "1943166000003",
        "hash": "hxIQqn7lYD/c/fNS7W/iVsg2kx0p/kNIGF6Ld0QEIxk="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "7iirXn1RtliLnBUGC5umIQ6KTw1qmPk+wwJ5ibh9Pf0=",
        "message": "Spring forest 🌲"
      },
      "out_msgs": []
    },
    {
      "transaction_id": {
        "lt": "1845458000003",
        "hash": "k5U9AwIRNGhC10hHJ3MBOPT//bxAgW5d9flFiwr1Sao="
      },
      "in_msg": {
        "source": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
        "destination": "EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5",
        "value": "1000000000",
        "body_hash": "XpTXquHXP64qN6ihHe7Tokkpy88tiL+5DeqIrvrNCyo=",
        "message": "Second"
      },
      "out_msgs": []
    }
  ]
}
```

Запрос будет выглядеть [вот так](https://testnet.toncenter.com/api/v2/getTransactions?address=EQAVKMzqtrvNB2SkcBONOijadqFZ1gMdjmzh1Y3HB1p_zai5\&limit=2\&lt=1943166000003\&hash=hxIQqn7lYD%2Fc%2FfNS7W%2FiVsg2kx0p%2FkNIGF6Ld0QEIxk%3D\&to_lt=0\&archival=true)

Нам также понадобится метод `detectAddress`.

Вот пример адреса кошелька Tonkeeper в тестовой сети: `kQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aCTb`. Если мы поищем транзакцию в проводнике, то вместо указанного выше адреса будет: `EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R`.

Этот метод возвращает нам "правильный" адрес.

```json
{
  "ok": true,
  "result": {
    "raw_form": "0:b3409241010f85ac415cbf13b9b0dc6157d09a39d2bd0827eadb20819f067868",
    "bounceable": {
      "b64": "EQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R",
      // highlight-next-line
      "b64url": "EQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aJ9R"
    },
    "non_bounceable": {
      "b64": "UQCzQJJBAQ+FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU",
      "b64url": "UQCzQJJBAQ-FrEFcvxO5sNxhV9CaOdK9CCfq2yCBnwZ4aMKU"
    }
  }
}
```

Нам нужен `b64url`.

Этот метод позволяет нам подтвердить адрес пользователя.

По большей части, это все, что нам нужно.

### Запросы API и что с ними делать

Давайте вернемся в IDE. Создайте файл `api.py`.

Импортируйте необходимые библиотеки.

```python
import requests
import json
# We import our db module, as it will be convenient to add from here
# transactions to the database
import db
```

- `requests` - для выполнения запросов API
- `json` для работы с json
- `db` - для работы с нашей базой данных sqlite

Давайте создадим две переменные для хранения начала запросов.

```python
# This is the beginning of our requests
MAINNET_API_BASE = "https://toncenter.com/api/v2/"
TESTNET_API_BASE = "https://testnet.toncenter.com/api/v2/"
```

Получите все API-токены и кошельки из файла config.json.

```python
# Find out which network we are working on
with open('config.json', 'r') as f:
    config_json = json.load(f)
    MAINNET_API_TOKEN = config_json['MAINNET_API_TOKEN']
    TESTNET_API_TOKEN = config_json['TESTNET_API_TOKEN']
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']
```

В зависимости от сети, мы берем необходимые данные.

```python
if WORK_MODE == "mainnet":
    API_BASE = MAINNET_API_BASE
    API_TOKEN = MAINNET_API_TOKEN
    WALLET = MAINNET_WALLET
else:
    API_BASE = TESTNET_API_BASE
    API_TOKEN = TESTNET_API_TOKEN
    WALLET = TESTNET_WALLET
```

Наша первая функция запроса `detectAddress`.

```python
def detect_address(address):
    url = f"{API_BASE}detectAddress?address={address}&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    try:
        return response['result']['bounceable']['b64url']
    except:
        return False
```

На входе мы имеем предполагаемый адрес, а на выходе - либо "correct" адрес, необходимый нам для дальнейшей работы, либо False.

Вы можете заметить, что в конце запроса появился API-ключ. Он нужен для того, чтобы снять ограничение на количество запросов к API. Без него мы ограничены одним запросом в секунду.

Вот следующая функция для `getTransactions`:

```python
def get_address_transactions():
    url = f"{API_BASE}getTransactions?address={WALLET}&limit=30&archival=true&api_key={API_TOKEN}"
    r = requests.get(url)
    response = json.loads(r.text)
    return response['result']
```

Эта функция возвращает последние 30 транзакций в наш `WALLET`.

Здесь вы можете увидеть `archival=true`. Это необходимо для того, чтобы мы принимали транзакции только от узла с полной историей блокчейна.

На выходе мы получим список транзакций -[{0},{1},...,{29}]. Другими словами, список словарей.

И, наконец, последняя функция:

```python
def find_transaction(user_wallet, value, comment):
		# Get the last 30 transactions
    transactions = get_address_transactions()
    for transaction in transactions:
				# Select the incoming "message" - transaction
        msg = transaction['in_msg']
        if msg['source'] == user_wallet and msg['value'] == value and msg['message'] == comment:
						# If all the data match, we check that this transaction
						# we have not verified before
            t = db.check_transaction(msg['body_hash'])
            if t == False:
								# If not, we write in the table to the verified
								# and return True
                db.add_v_transaction(
                    msg['source'], msg['body_hash'], msg['value'], msg['message'])
                print("find transaction")
                print(
                    f"transaction from: {msg['source']} \nValue: {msg['value']} \nComment: {msg['message']}")
                return True
						# If this transaction is already verified, we check the rest, we can find the right one
            else:
                pass
		# If the last 30 transactions do not contain the required one, return False
		# Here you can add code to see the next 29 transactions
		# However, within the scope of the Example, this would be redundant.
    return False
```

На вход подаются "correct" адрес кошелька, сумма и комментарий. Если предполагаемая входящая транзакция найдена, результатом будет True; в противном случае - False.

## Telegram-бот

Во-первых, давайте создадим основу для бота.

### Импорт

В этой части мы импортируем необходимые библиотеки.

Из `aiogram` нам нужны `Bot`, `Dispatcher`, `types` и `executor`.

```python
from aiogram import Bot, Dispatcher, executor, types
```

`MemoryStorage` необходима для временного хранения информации.

`FSMContext`, `State` и `StatesGroup` необходимы для работы с машиной состояний.

```python
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
```

`json` необходим для работы с json-файлами. `logging` необходим для регистрации ошибок.

```python
import json
import logging
```

`api` и `db` - это наши собственные файлы, которые мы заполним позже.

```python
import db
import api
```

### Настройка конфигурации

Для удобства рекомендуется хранить такие данные, как `BOT_TOKEN` и ваши кошельки для получения платежей, в отдельном файле под названием `config.json`.

```json
{
  "BOT_TOKEN": "Your bot token",
  "MAINNET_API_TOKEN": "Your mainnet api token",
  "TESTNET_API_TOKEN": "Your testnet api token",
  "MAINNET_WALLET": "Your mainnet wallet",
  "TESTNET_WALLET": "Your testnet wallet",
  "WORK_MODE": "testnet"
}
```

#### Токен бота

`BOT_TOKEN` - это токен вашего Telegram-бота от [@BotFather](https://t.me/BotFather)

#### Режим работы

В ключе `WORK_MODE` мы определим режим работы бота - тестовая или основная сеть; `testnet` или `mainnet` соответственно.

#### API-токены

API-токены для `*_API_TOKEN` можно получить в ботах [TON Center](https://toncenter.com/):

- для mainnet - [@tonapibot](https://t.me/tonapibot)
- для testnet - [@tontestnetapibot](https://t.me/tontestnetapibot)

#### Подключите конфигурацию к боту

Далее мы закончим настройку бота.

Получите токен для работы бота из `config.json` :

```python
with open('config.json', 'r') as f:
    config_json = json.load(f)
    # highlight-next-line
    BOT_TOKEN = config_json['BOT_TOKEN']
		# put wallets here to receive payments
    MAINNET_WALLET = config_json['MAINNET_WALLET']
    TESTNET_WALLET = config_json['TESTNET_WALLET']
    WORK_MODE = config_json['WORK_MODE']

if WORK_MODE == "mainnet":
    WALLET = MAINNET_WALLET
else:
		# By default, the bot will run on the testnet
    WALLET = TESTNET_WALLET
```

### Ведение журнала и настройка бота

```python
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN, parse_mode=types.ParseMode.HTML)
dp = Dispatcher(bot, storage=MemoryStorage())
```

### Состояния

Нам нужны состояния, чтобы разделить рабочий процесс бота на этапы. Мы можем специализировать каждый этап для выполнения определенной задачи.

```python
class DataInput (StatesGroup):
    firstState = State()
    secondState = State()
    WalletState = State()
    PayState = State()
```

Подробности и примеры смотрите в [документации по Aiogram](https://docs.aiogram.dev/en/latest/).

### Хендлеры сообщений

В этой части мы напишем логику взаимодействия с ботом.

Мы будем использовать два типа хендлеров:

- `message_handler` используется для обработки сообщений от пользователя.
- `callback_query_handler` используется для обработки callback от инлайн-клавиатур.

Если мы хотим обработать сообщение от пользователя, мы будем использовать `message_handler`, поместив декоратор `@dp.message_handler` над функцией. В этом случае функция будет вызываться, когда пользователь отправляет сообщение боту.

В декораторе мы можем указать условия, при которых будет вызываться функция. Например, если мы хотим, чтобы функция вызывалась только тогда, когда пользователь отправляет сообщение с текстом `/start`, то мы напишем следующее:

```
@dp.message_handler(commands=['start'])
```

Хендлеры должны быть назначены на асинхронную функцию. В этом случае мы используем синтаксис `async def`. Синтаксис `async def` используется для определения функции, которая будет вызываться асинхронно.

#### /start

Давайте начнем с хендлера команды `/start`.

```python
@dp.message_handler(commands=['start'], state='*')
async def cmd_start(message: types.Message):
    await message.answer(f"WORKMODE: {WORK_MODE}")
    # check if user is in database. if not, add him
    isOld = db.check_user(
        message.from_user.id, message.from_user.username, message.from_user.first_name)
    # if user already in database, we can address him differently
    if isOld == False:
        await message.answer(f"You are new here, {message.from_user.first_name}!")
        await message.answer(f"to buy air send /buy")
    else:
        await message.answer(f"Welcome once again, {message.from_user.first_name}!")
        await message.answer(f"to buy more air send /buy")
    await DataInput.firstState.set()
```

В декораторе этого хендлера мы видим `state='*'`. Это означает, что данный хендлер будет вызван независимо от состояния бота. Если мы хотим, чтобы хендлер вызывался только тогда, когда бот находится в определенном состоянии, мы напишем `state=DataInput.firstState`. В этом случае хендлер будет вызван только тогда, когда бот будет находиться в состоянии `firstState`.

После того, как пользователь отправит команду `/start`, бот проверит, есть ли пользователь в базе данных, используя функцию `db.check_user`. Если нет, он добавит его. Эта функция также вернет значение bool, и мы можем использовать его для другого обращения к пользователю. После этого бот установит состояние `firstState`.

#### /cancel

Далее следует хендлер команды /cancel. Он необходим для возвращения в состояние `firstState`.

```python
@dp.message_handler(commands=['cancel'], state="*")
async def cmd_cancel(message: types.Message):
    await message.answer("Canceled")
    await message.answer("/start to restart")
    await DataInput.firstState.set()
```

#### /buy

И, конечно же, хендлер команды `/buy`. В этом примере мы будем продавать разные виды воздуха. Для выбора типа воздуха мы будем использовать reply клавиатуру.

```python
# /buy command handler
@dp.message_handler(commands=['buy'], state=DataInput.firstState)
async def cmd_buy(message: types.Message):
    # reply keyboard with air types
    keyboard = types.ReplyKeyboardMarkup(
        resize_keyboard=True, one_time_keyboard=True)
    keyboard.add(types.KeyboardButton('Just pure 🌫'))
    keyboard.add(types.KeyboardButton('Spring forest 🌲'))
    keyboard.add(types.KeyboardButton('Sea breeze 🌊'))
    keyboard.add(types.KeyboardButton('Fresh asphalt 🛣'))
    await message.answer(f"Choose your air: (or /cancel)", reply_markup=keyboard)
    await DataInput.secondState.set()
```

Таким образом, когда пользователь отправляет команду `/buy`, бот отправляет ему клавиатуру с вариантами типов воздуха. После того как пользователь выберет тип воздуха, бот установит состояние `secondState`.

Этот хендлер будет работать только тогда, когда установлено значение `secondState`, и будет ожидать сообщения от пользователя с типом воздуха.  В данном случае нам нужно сохранить тип воздуха, который выбрал пользователь, поэтому мы передаем FSMContext в качестве аргумента функции.

FSMContext используется для хранения данных в памяти бота. Мы можем хранить в ней любые данные, но эта память не является постоянной, поэтому если бот будет перезапущен, данные будут потеряны. Но в ней хорошо хранить временные данные.

```python
# handle air type
@dp.message_handler(state=DataInput.secondState)
async def air_type(message: types.Message, state: FSMContext):
    if message.text == "Just pure 🌫":
        await state.update_data(air_type="Just pure 🌫")
    elif message.text == "Fresh asphalt 🛣":
        await state.update_data(air_type="Fresh asphalt 🛣")
    elif message.text == "Spring forest 🌲":
        await state.update_data(air_type="Spring forest 🌲")
    elif message.text == "Sea breeze 🌊":
        await state.update_data(air_type="Sea breeze 🌊")
    else:
        await message.answer("Wrong air type")
        await DataInput.secondState.set()
        return
    await DataInput.WalletState.set()
    await message.answer(f"Send your wallet address")
```

Используйте...

```python
await state.update_data(air_type="Just pure 🌫")
```

...чтобы сохранить тип воздуха в FSMContext. После этого мы устанавливаем состояние в `WalletState` и просим пользователя отправить адрес своего кошелька.

Этот хендлер будет работать только тогда, когда `WalletState` установлен и будет ожидать сообщения от пользователя с адресом кошелька.

Следующий хендлер кажется очень сложным, но это не так. Сначала мы проверяем, является ли сообщение действительным адресом кошелька, используя `len(message.text) == 48`, поскольку адрес кошелька состоит из 48 символов. После этого мы используем функцию `api.detect_address`, чтобы проверить, является ли адрес действительным. Как вы помните из части, посвященной API, эта функция также возвращает "Correct" адрес, который будет сохранен в базе данных.

После этого мы получаем тип воздуха из FSMContext с помощью `await state.get_data()` и сохраняем его в переменной `user_data`.

Теперь у нас есть все данные, необходимые для процесса оплаты. Осталось только сгенерировать ссылку на оплату и отправить ее пользователю. Давайте воспользуемся инлайн-клавиатурой.

В этом примере для оплаты будут созданы три кнопки:

- для официального Кошелька TON
- для Tonhub
- для Tonkeeper

Преимущество специальных кнопок для кошельков заключается в том, что если у пользователя еще нет кошелька, то сайт предложит ему установить его.

Вы можете использовать все, что захотите.

Нам нужна кнопка, которую пользователь нажмет после транзакции, чтобы мы могли проверить, успешно ли прошла оплата.

```python
@dp.message_handler(state=DataInput.WalletState)
async def user_wallet(message: types.Message, state: FSMContext):
    if len(message.text) == 48:
        res = api.detect_address(message.text)
        if res == False:
            await message.answer("Wrong wallet address")
            await DataInput.WalletState.set()
            return
        else:
            user_data = await state.get_data()
            air_type = user_data['air_type']
            # inline button "check transaction"
            keyboard2 = types.InlineKeyboardMarkup(row_width=1)
            keyboard2.add(types.InlineKeyboardButton(
                text="Check transaction", callback_data="check"))
            keyboard1 = types.InlineKeyboardMarkup(row_width=1)
            keyboard1.add(types.InlineKeyboardButton(
                text="Ton Wallet", url=f"ton://transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonkeeper", url=f"https://app.tonkeeper.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            keyboard1.add(types.InlineKeyboardButton(
                text="Tonhub", url=f"https://tonhub.com/transfer/{WALLET}?amount=1000000000&text={air_type}"))
            await message.answer(f"You choose {air_type}")
            await message.answer(f"Send <code>1</code> toncoin to address \n<code>{WALLET}</code> \nwith comment \n<code>{air_type}</code> \nfrom your wallet ({message.text})", reply_markup=keyboard1)
            await message.answer(f"Click the button after payment", reply_markup=keyboard2)
            await DataInput.PayState.set()
            await state.update_data(wallet=res)
            await state.update_data(value_nano="1000000000")
    else:
        await message.answer("Wrong wallet address")
        await DataInput.WalletState.set()
```

#### /me

Последний хендлер сообщений, который нам нужен, предназначен для команды `/me`. Он показывает платежи пользователя.

```python
# /me command handler
@dp.message_handler(commands=['me'], state="*")
async def cmd_me(message: types.Message):
    await message.answer(f"Your transactions")
    # db.get_user_payments returns list of transactions for user
    transactions = db.get_user_payments(message.from_user.id)
    if transactions == False:
        await message.answer(f"You have no transactions")
    else:
        for transaction in transactions:
            # we need to remember that blockchain stores value in nanotons. 1 toncoin = 1000000000 in blockchain
            await message.answer(f"{int(transaction['value'])/1000000000} - {transaction['comment']}")
```

### Хендлеры Callback

Мы можем установить callback-данные в кнопках, которые будут отправляться боту при нажатии пользователем на кнопку. В кнопке, которую пользователь нажмет после транзакции, мы установим callback data на "check". В результате нам нужно обработать этот callback.

Callback-хендлеры очень похожи на хендлеры сообщений, но вместо `message` в качестве аргумента у них используется `types.CallbackQuery`. Декоратор функции также отличается.

```python
@dp.callback_query_handler(lambda call: call.data == "check", state=DataInput.PayState)
async def check_transaction(call: types.CallbackQuery, state: FSMContext):
    # send notification
    user_data = await state.get_data()
    source = user_data['wallet']
    value = user_data['value_nano']
    comment = user_data['air_type']
    result = api.find_transaction(source, value, comment)
    if result == False:
        await call.answer("Wait a bit, try again in 10 seconds. You can also check the status of the transaction through the explorer (tonscan.org/)", show_alert=True)
    else:
        db.v_wallet(call.from_user.id, source)
        await call.message.edit_text("Transaction is confirmed \n/start to restart")
        await state.finish()
        await DataInput.firstState.set()
```

В этом хендлере мы получаем данные пользователя из FSMContext и используем функцию `api.find_transaction`, чтобы проверить была ли транзакция успешной. Если да, то мы сохраняем адрес кошелька в базе данных и отправляем пользователю уведомление. После этого пользователь может найти свои транзакции с помощью команды `/me`.

### Последняя часть main.py

В конце не забудьте:

```python
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
```

Эта часть необходима для запуска бота.
В `skip_updates=True` мы указываем, что не хотим обрабатывать старые сообщения. Но если вы хотите обрабатывать все сообщения, вы можете установить значение `False`.

:::info

Весь код `main.py` можно найти [здесь](https://github.com/LevZed/ton-payments-in-telegram-bot/blob/main/bot/main.py).

:::

## Бот запущен

Мы наконец-то сделали это! Теперь у вас должен быть работающий бот. Вы можете протестировать его!

Шаги для запуска бота:

1. Заполните файл `config.json`.
2. Запустите `main.py`.

Все файлы должны находиться в одной папке. Чтобы запустить бота, вам нужно запустить файл `main.py`. Вы можете сделать это в IDE или в терминале следующим образом:

```
python main.py
```

Если у вас возникли ошибки, вы можете проверить их в терминале. Возможно, вы что-то упустили в коде.

Пример работающего бота [@AirDealerBot](https://t.me/AirDealerBot)

![bot](/img/tutorials/apiatb-bot.png)

## Ссылки

- Сделано для TON как часть [ton-footsteps/8](https://github.com/ton-society/ton-footsteps/issues/8)
- By Lev ([Telegram @Revuza](https://t.me/revuza), [LevZed на GitHub](https://github.com/LevZed))
