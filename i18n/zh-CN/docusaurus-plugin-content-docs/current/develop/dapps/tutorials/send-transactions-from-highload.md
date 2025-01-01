# 高负载钱包 v3 交易指南

## 宗旨和目标 🎯

本指南旨在提供一套使用 Highload Wallet v3 发送交易的综合说明。目的是帮助开发人员和用户了解如何使用所提供的 Python 脚本部署合约、发送消息和跟踪交易。本指南假定您已设置了必要的 API 密钥和助记符。

## 先决条件 🛠️

在开始之前，请确保您具备以下条件：

- 安装了 `tonsdk` 的 Python 环境。
- 访问 TON 中心 API 的 API 密钥。
- 高负载钱包的记忆法。
- 测试交易的收件人地址。

## 安装 📦

使用 pip 安装所需的软件包：

```sh
pip install pytoniq
```

## 代码片段和说明 📄

### 1.设置 API 端点和实用功能 🌐

定义提出 API 请求的端点和实用功能。

```python
import requests

api_key = "..."  # PLACE API KEY HERE

api_v2_endpoint = "https://toncenter.com/api/v2/jsonRPC"

def api_v2_request(method, api_key=None, **params):
    headers = {"X-Api-Key": api_key} if api_key else None
    payload = {"id": 1, "jsonrpc": 2.0, "method": method, "params": params}
    resp = requests.post(api_v2_endpoint, headers=headers, json=payload)
    if resp.status_code == 200:
        return resp.json()["result"]
    raise RuntimeError(resp.json()["error"])

send_boc_endpoint = "https://toncenter.com/api/v2/sendBocReturnHash"

def send_boc_request(address, boc, api_key=None):
    headers = {"X-Api-Key": api_key} if api_key else None
    payload = {"boc": boc}
    params = {"address": address}
    resp = requests.post(
        send_boc_endpoint, params=params, headers=headers, json=payload
    )
    if resp.status_code == 200:
        return resp.json()["result"]
    raise RuntimeError(resp.json()["error"])

api_v3_endpoint = "https://toncenter.com/api/v3"

def api_v3_request(method, api_key=None, **params):
    headers = {"X-Api-Key": api_key} if api_key else None
    resp = requests.get(f"{api_v3_endpoint}/{method}", headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    raise RuntimeError(resp.json()["error"])
```

### 2.设置钱包并生成地址 🔑

使用助记符设置钱包并生成原始地址。

```python
from pytoniq import liteclient, WalletV4, LiteClientLike, LiteClient
import asyncio


async def main():
    client = LiteClient.from_mainnet_config(  # choose mainnet, testnet or custom config dict
        ls_i=0,  # index of liteserver from config
        trust_level=2,  # trust level to liteserver
        timeout=15  # timeout not includes key blocks synchronization as it works in pytonlib
    )

    await client.connect()

    wallet: WalletV4 = await WalletV4.from_mnemonic(client, [
        'casual', 'doctor', 'across',
        'later', 'pledge', 'burden',
        'desert', 'remain', 'under',
        'moment', 'meat', 'define',
        'relief', 'tennis', 'sphere',
        'tattoo', 'long', 'manual',
        'fiction', 'push', 'couch',
        'wink', 'behind', 'crumble'
    ])

    address: str = wallet.address.to_str(True, True, True)
    print(address)


asyncio.run(main())

```

### 3.部署合同 📜

创建和部署合同。

```python
async def init_contract(wallet_v3r2: WalletV4):
    # send some tons (0.1) to the address before calling init_external function
    address: str = wallet_v3r2.address.to_str(True, True, True)
    print(address)

    print(wallet_v3r2.state.code.get_depth())
    response = await wallet_v3r2.send_init_external()
```

### 4.创建和发送交易 💸

准备并向多个收件人发送交易。

```python
async def send_tons(wallet_v3r2: WalletV4, target: typing.Union[str, pytoniq.Address], amount: int):
    cell = pytoniq.begin_cell().store_int(20, 8).end_cell()
    response = await wallet_v3r2.transfer(target), amount)
    print(response)


async def send_tons_multi_target(wallet: HighloadWallet, targets: typing.Union[typing.List[str], typing.List[pytoniq.Address]], amounts: typing.List[int]):
    cell = pytoniq.begin_cell().end_cell()
    response = await wallet.transfer(targets, amounts, [cell])
    print(response)
```

### 5.等待交易确认 ⏳

等待交易确认。

```python
# scan blockchain for transaction
async def wait_for_transaction(client: LiteClient, number: int = 20):
    # logic depends on you transaction creating process
    while True:
        # You can scan for message hashes if you save them instead of using these "additional" numbers
        responses = await client.get_transactions('', 10)
        for response in responses:
            transaction: pytoniq_core.Transaction = response
            # We saved 20 into the body before sending
            if transaction.in_msg.body.begin_parse().load_int(8) == number:
                break
        else:
            await asyncio.sleep(1)
            continue
        
        break
    return
```

---

处理外发信息。
