# Workflows

## Overview

### First-time connection via http bridge
1. App initiates SSE connection with bridge;
2. App passes connection info to the wallet via universal link or deeplink or QR code;
3. Wallet connects to the bridge with given parameters, and save connection info locally;
4. Wallet sends account information to the app using bridge;
5. App receives message and save connection info locally;

### Reconnection with http bridge
1. App reads connection info from localstorage
2. App connects to the bridge
3. User opens the wallet, the wallet connects to the bridge using stored connection info

### First-time connection via js bridge
1. App checks existing of the `window.[walletJsBridgeKey].tonconnect`
2. App calls `window.[walletJsBridgeKey].tonconnect.connect()` and waits for a response
3. Wallet sends account information to the app;

###  Making ordinary requests and responses
1. App and wallet are in a connected state
2. App generates request and sends it to the bridge
3. Bridge forwards message to the wallet
4. Wallet generates response and sends it to the bridge
5. Bridge forwards message to the app

## Specification

Read detailed specification [here](https://github.com/ton-blockchain/ton-connect/blob/main/workflows.md#details).

## See Also

* [Ton Connect Overview](/dapps/ton-connect/)
* [Integration manual](/develop/dapps/ton-connect/integration)
* [Telegram bot integration manual](/develop/dapps/ton-connect/tg-bot-integration)