import Feedback from '@site/src/components/Feedback';

'@site/src/components/button'에서 버튼 가져오기

# TON Connect for Telegram Bots - Python

:::warning 사용 중단
이 가이드는 TON Connect와 텔레그램 봇을 통합하는 구식 방법에 대해 설명합니다. 보다 안전하고 현대적인 접근 방식을 원하신다면, [텔레그램 미니 앱](/v3/guidelines/dapps/tma/overview)을 사용해 보시기 바랍니다.
:::

이 튜토리얼에서는 파이썬 톤 커넥트 SDK(https://github.com/XaBbl4/pytonconnect)를 사용해 톤 커넥트 2.0 인증을 지원하는 샘플 텔레그램 봇을 만들어 보겠습니다.
지갑 연결, 트랜잭션 전송, 연결된 지갑에 대한 데이터 가져오기, 지갑 연결 해제에 대해 분석해 보겠습니다.

<버튼 href="https://t.me/test_tonconnect_bot" colorType={'primary'} sizeType={'sm'}>

데모 봇 열기

</Button>

<버튼 href="https://github.com/yungwine/ton-connect-bot" colorType={'secondary'} sizeType={'sm'}>

GitHub 확인

</Button>

## 준비

### 라이브러리 설치

봇을 만들기 위해, `aiogram` 3.0 파이썬 라이브러리를 사용하겠습니다.
TON Connect를 텔레그램 봇에 통합하려면, `pytonconnect` 패키지를 설치해야 합니다.
그리고 TON 프리미티브를 사용하고 사용자 주소를 파싱하려면 `pytoniq-core`가 필요합니다.
이를 위해 pip를 사용할 수 있습니다:

```bash
pip install aiogram pytoniq-core python-dotenv
pip install pytonconnect
```

### 구성 설정

.env` 파일에 [봇 토큰](https://t.me/BotFather)을 지정하고 TON Connect [매니페스트 파일](https://github.com/ton-connect/sdk/tree/main/packages/sdk#add-the-tonconnect-manifest)에 링크합니다. config.py`에 로드한 후:

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

## 간단한 봇 만들기

메인 봇 코드가 포함될 `main.py` 파일을 만듭니다:

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

## 지갑 연결

### TON Connect 스토리지

TON Connect를 위한 간단한 스토리지 만들기

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

### 연결 핸들러

먼저, 사용자마다 다른 인스턴스를 반환하는 함수가 필요합니다:

```python
# connector.py

from pytonconnect import TonConnect

import config
from tc_storage import TcStorage


def get_connector(chat_id: int):
    return TonConnect(config.MANIFEST_URL, storage=TcStorage(chat_id))

```

둘째, `command_start_handler()`에 연결 핸들러를 추가해 보겠습니다:

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

이제 아직 지갑을 연결하지 않은 사용자의 경우 봇은 사용 가능한 모든 지갑에 대한 버튼이 포함된 메시지를 보냅니다.
따라서 `connect:{wallet["name"]}` 콜백을 처리하는 함수를 작성해야 합니다:

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

봇은 사용자에게 3분 동안 지갑을 연결할 수 있는 시간을 주고 그 후 시간 초과 오류를 보고합니다.

## 트랜잭션 요청 구현

메시지 작성기](/v3/guidelines/ton-connect/guidelines/preparing-messages) 문서에 있는 예제 중 하나를 살펴봅시다:

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

그리고 `main.py` 파일에 `send_transaction()` 함수를 추가합니다:

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

하지만 발생할 수 있는 오류도 처리해야 하므로 `send_transaction` 메서드를 `try - except` 문으로 감쌉니다:

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

## 연결 끊기 핸들러 추가

이 기능 구현은 매우 간단합니다:

```python
async def disconnect_wallet(message: Message):
    connector = get_connector(message.chat.id)
    await connector.restore_connection()
    await connector.disconnect()
    await message.answer('You have been successfully disconnected!')
```

현재 프로젝트의 구조는 다음과 같습니다:

```bash
.
.env
├── config.py
├── connector.py
├── main.py
├── messages.py
└── tc_storage.py
```

그리고 `main.py`는 다음과 같습니다:

<details><summary>main.py 표시</summary>

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

## 개선

### 영구 저장소 추가 - Redis

현재 TON Connect Storage는 딕셔너리를 사용하므로 봇 재시작 후 세션이 손실될 수 있습니다.
Redis로 영구 데이터베이스 스토리지를 추가해 보겠습니다:

Redis 데이터베이스를 실행한 후 파이썬 라이브러리를 설치하여 상호 작용합니다:

```bash
pip install redis
```

그리고 `tc_storage.py`에서 `TcStorage` 클래스를 업데이트합니다:

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

### QR코드 추가

파이썬 `qrcode` 패키지를 설치하여 생성합니다:

```bash
pip install qrcode
```

QR코드를 생성하여 사용자에게 사진으로 전송하도록 `connect_wallet()` 함수를 변경합니다:

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

## 요약

다음 단계는 무엇인가요?

- 봇에 더 나은 오류 처리 기능을 추가할 수 있습니다.
- 시작 텍스트와 `/connect_wallet` 명령어 같은 것을 추가할 수 있습니다.

## See Also

- [전체 봇 코드](https://github.com/yungwine/ton-connect-bot)
- [메시지 준비하기](/v3/guidelines/ton-connect/guidelines/preparing-messages)

<Feedback />

