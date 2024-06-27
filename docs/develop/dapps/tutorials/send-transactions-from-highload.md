# Highload Wallet v3 Transaction Guide

## Purpose and Goals 🎯

The purpose of this guide is to provide a comprehensive set of instructions for sending transactions using Highload Wallet v3. The goal is to help developers and users understand how to deploy contracts, send messages, and track transactions using the provided Python scripts. This guide assumes you have the necessary API keys and mnemonics set up.

## Prerequisites 🛠️

Before you start, make sure you have the following:
- Python environment with `tonsdk` installed.
- API key for accessing the TON Center API.
- Mnemonics for your Highload Wallet.
- Recipient address for test transactions.

## Installation 📦

Install the required package using pip:
```sh
pip install tonsdk
```

## Code Snippets and Instructions 📄

### 1. Setup API Endpoints and Utility Functions 🌐

Define the endpoints and utility functions for making API requests.
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

### 2. Setup Wallet and Generate Address 🔑

Set up your wallet using mnemonics and generate the raw address.
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

### 3. Deploy Contract 📜

Create and deploy the contract.
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

### 4. Create and Send Transactions 💸

Prepare and send transactions to multiple recipients.
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

### 5. Wait for Transaction Confirmation ⏳

Wait for the transaction to be confirmed.
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

### 6. Process Outgoing Messages 📤

Handle and process the outgoing messages.
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

This guide covers the essential steps for sending transactions from a Highload Wallet v3. Make sure to replace placeholders with your actual API keys, mnemonics, and addresses to execute the scripts successfully. Happy coding! 🚀
