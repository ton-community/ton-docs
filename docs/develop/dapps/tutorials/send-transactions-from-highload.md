# Highload Wallet v3 Transaction Guide

## Purpose and Goals 🎯

The purpose of this guide is to provide a comprehensive set of instructions for sending transactions using Highload Wallet v3. The goal is to help developers and users understand how to deploy contracts, send messages, and track transactions using the provided Python scripts. This guide assumes you have the necessary API keys and mnemonics set up.

## Prerequisites 🛠️

Before you start, make sure you have the following:
- Python environment with `pytoniq` installed.
- API key for accessing the TON Center API.
- Mnemonics for your Highload Wallet.
- Recipient address for test transactions.

## Installation 📦

Install the required package using pip:
```sh
pip install pytoniq
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

### 3. Deploy Contract 📜

Create and deploy the contract. You **must send some TONs to the address** before calling this function. You can get address by running previous or current function.
```python
async def init_contract(wallet_v3r2: WalletV4):
    # send some tons (0.1) to the address before calling init_external function
    address: str = wallet_v3r2.address.to_str(True, True, True)
    print(address)

    print(wallet_v3r2.state.code.get_depth())
    response = await wallet_v3r2.send_init_external()
```

### 4. Create and Send Transactions 💸

Prepare and send transactions to multiple recipients.
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

### 5. Wait for Transaction Confirmation ⏳

Wait for the transaction to be confirmed.
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

This guide covers the essential steps for sending transactions from a Highload Wallet v3. Make sure to replace placeholders with your actual API keys, mnemonics, and addresses to execute the scripts successfully. Happy coding! 🚀
