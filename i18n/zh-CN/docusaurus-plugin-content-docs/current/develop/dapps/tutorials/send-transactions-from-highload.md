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
pip install tonsdk
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
from tonsdk.contract.wallet import Wallets, WalletVersionEnum
from tonsdk.utils import bytes_to_b64str

wallet_workchain = 0
wallet_version = WalletVersionEnum.hv2

wallet_mnemonics = ["..."]  # PLACE TEST MNEMONIC FOR HIGHLOAD WALLET HERE

_mnemonics, _pub_k, _priv_k, wallet = Wallets.from_mnemonics(
    wallet_mnemonics, wallet_version, wallet_workchain
)
raw_address = wallet.address.to_string()

print(raw_address)
```

### 3.部署合同 📜

创建和部署合同。

```python
init_query = wallet.create_init_external_message()
init_boc = bytes_to_b64str(init_query["message"].to_boc(False))
boc_res = send_boc_request(raw_address, init_boc)

result = []
while not result:
    print("Check transaction")
    result = api_v3_request(
        "transactionsByMessage", direction="in", msg_hash=boc_res["hash"]
    )
    if not result:
        time.sleep(5)
print("Deployment successful!")
```

### 4.创建和发送交易 💸

准备并向多个收件人发送交易。

```python
num_receips = 4
to_address = "..."  # PLACE TEST RECEIVER ADDRESS HERE

recieps = [
    {
        "address": to_address,
        "amount": 1000 + i,
        "send_mode": 3,
        "payload": f"test msg {i}",
    }
    for i in range(num_receips)
]

msg_to_me = {
    "address": wallet.address.to_string(True, is_bounceable=False),
    "amount": 999,
    "send_mode": 3,
    "payload": f"test msg to me",
}
recieps.append(msg_to_me)
recieps.append(msg_to_me)

highload_send_query = wallet.create_transfer_message(recieps, query_id=0)
highload_send_boc = bytes_to_b64str(highload_send_query["message"].to_boc(False))
boc_res = send_boc_request(raw_address, highload_send_boc)
print("Transaction sent successfully!")
```

### 5.等待交易确认 ⏳

等待交易确认。

```python
def wait_msg_transaction(msg_hash, api_key=None, sleep_time=2, verbose=False):
    result = []
    while not result:
        if verbose:
            print(f"Wait transaction for message '{msg_hash}'")
        result = api_v3_request(
            "transactionsByMessage", api_key=api_key, direction="in", msg_hash=msg_hash
        )
        if not result:
            time.sleep(sleep_time)
    if verbose:
        print(f"Found {len(result)} transactions:")
        for tx in result:
            print(f"\t{tx['hash']}")
    return result

result = wait_msg_transaction(boc_res["hash"], verbose=True)
print("Transaction confirmed!")
```

### 6.处理发出的信息 📤

处理外发信息。

```python
msg_list = result[0]["out_msgs"]
msg_hashes = [msg["hash"] for msg in msg_list]
print(f"Num out messages: {len(msg_list)}")

receive_transactions = []
for msg_hash in msg_hashes:
    tx = wait_msg_transaction(msg_hash, api_key=api_key, verbose=True)
    receive_transactions.extend(tx)
print(f"Transactions count: {len(receive_transactions)}")
```

---

本指南涵盖从 Highload Wallet v3 发送交易的基本步骤。请确保用实际的 API 密钥、助记符和地址替换占位符，以便成功执行脚本。祝您编码愉快！🚀
