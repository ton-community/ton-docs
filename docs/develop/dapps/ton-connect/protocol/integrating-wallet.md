# Guide to Integrating Wallet with TON Connect

## How It Works
**TON Connect** is a protocol that enables secure communication between wallets and decentralized applications (dApps) on the TON blockchain. The integration involves setting up a bridge for encrypted communication, generating wallet state initialization, signing messages, and validating parameters.

### Key Components
- **Bridge:** A server facilitating encrypted communication between the wallet and the dApp. There are different types of bridges including ready-made bridges, TONAPI bridges, custom bridges, and JS bridges.
- **Wallet State Init:** A base64-encoded BOC containing the standard StateInit structure for all contracts in TON.
- **Session Protocol:** Manages the session between the wallet and the dApp for secure transactions.

## How to Use

### Step 1: Review Specifications
Begin by familiarizing yourself with the core specifications and documentation:
- [TON Connect Specification](https://github.com/ton-blockchain/ton-connect)
- [Protocol Workflow](https://github.com/ton-blockchain/ton-connect/blob/main/workflows.md)
- [Bridge API](https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md)
- [Session Protocol](https://github.com/ton-blockchain/ton-connect/blob/main/session.md)
- [Wallet Guidelines](https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md)

### Step 2: Set Up Your Bridge
**IMPORTANT:** Your wallet should **ALWAYS** use only its own bridge and no other. You can choose to set up your bridge in one of four ways:

1. **Ready-Made Bridges:**
    Use the [Tonconsole wallet bridge](https://github.com/ton-connect/bridge2) for a stable, ready-made solution. Contact @subden for access.

2. **Connecting via TONAPI:**
Utilize TONAPI's robust tools for integrating and managing your bridge. This is a seamless option for integration.

3. **Custom Bridges:**
    Manually set up your own bridge using the [bridge specification](https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md). Refer to the [example implementation](https://github.com/ton-connect/bridge) for guidance.

4. **JS Bridge:**
    For integrating a native wallet that supports opening dApps within the wallet, use the JS Bridge. Follow the documentation for [JS Bridge Implementation](https://github.com/ton-blockchain/ton-connect/blob/main/bridge.md#js-bridge).

### Step 3: Integrate the Protocol Package
Use the [@tonconnect/protocol package](https://github.com/ton-connect/sdk/tree/main/packages/protocol) directly in your wallet to facilitate communication between the wallet and the dApp.

Also, pay close attention to the creation of encrypted communication channels between the wallet and the dApp. You can find detailed information in the [Session Protocol documentation](https://github.com/ton-blockchain/ton-connect/blob/main/session.md). For a practical implementation reference, check out the [@tonconnect/protocol package](https://github.com/ton-connect/sdk/blob/main/packages/protocol/src/crypto/session-crypto.ts). 

### Step 4: Implement Wallet State Init
Generate the StateInit for your wallet using parameters like wallet ID and public key. An example implementation can be found in the guide.

### Step 5: Validate Parameters
In addition to the guidelines, here is further information for validating request fields. Please review the [guidelines](https://github.com/ton-blockchain/ton-connect/blob/main/wallet-guidelines.md) before examining the information below.

##### Validating the `valid until` Parameter:
- **Outdated `valid until`:** If an outdated `valid until` value is passed, the wallet should notify the user that the transaction is outdated and send an event to the bridge with code 1 (Bad request). The wallet should ignore any return strategy for returning the user to the application.
- **Excessively Long `valid until`:** If `valid until` is greater than `now() + 5 minutes`, the wallet should set a new `valid until` using the formula `now() + 5 minutes`, then proceed with the standard flow.
- **Valid `valid until`:** If `valid until` is less than `now() + 5 minutes`, the wallet should reuse the received `valid until` and proceed with the standard flow.

##### Validating the `network` Parameter:
- **Invalid Network:** If an invalid network is passed, the wallet should notify the user that the received network is incorrect and send an event to the bridge with code 1 (Bad request). The wallet should ignore any return strategy for returning the user to the application.
- **Valid Network:** If a valid network is passed, proceed with the standard flow.

##### Validating the `from` Parameter:
- **Invalid `from`:** If an invalid `from` address is passed, the wallet should notify the user that the received address is incorrect (i.e., not the address the user is authenticated with in the dApp, or not the address from which the transaction will be sent). The wallet should send an event to the bridge with code 1 (Bad request) and ignore any return strategy for returning the user to the application.
- **Valid `from`:** If a valid `from` address is passed (i.e., the address the user is authenticated with in the dApp and the address from which the transaction will be sent), proceed with the standard flow.

##### Responding to the `ret` (return strategy) Parameter:
- **`ret` is `none`:** The wallet should notify the user that the action was successfully completed (e.g., signing transactions or connecting).
- **`ret` Contains a URI Scheme:** In case of success, the wallet should notify the user that the action was completed, display a button to return to the dApp ("Return to the application"), or after 3 seconds automatically redirect the user and close the notification. Possible values include `googlechrome://`, `firefox://`, `opera-http://`, and `tg://resolve` (the list may expand in the future).
- **`ret` Contains a URL Link:** In case of success, the wallet should notify the user that the action was completed, display a button to return to the dApp ("Return to the application"), or after 3 seconds automatically open the link in the user's browser and close the notification.
- **`ret` Contains an Unknown Value:** The wallet should follow the strategy as if `ret` was `none`.

### Step 6: Demo Integration
To test and demonstrate the integration, use the [demo dapp with wallet](https://github.com/ton-connect/demo-dapp-with-wallet). This repository provides a starting point for setting up a demo environment. Also try some real world examples:

- **[TON Stakers](https://app.tonstakers.com):** Test wallet connection, stake, and unstake TON.
- **[STON.fi](https://app.ston.fi):** Test wallet connection, swap TON for USDT, and manage liquidity.
- **[GetGems](https://getgems.io):** Test wallet connection, mint, list, and purchase NFTs.

### Emulating Transactions
Use the `/v2/wallet/emulate` method from [tonapi.io](https://tonapi.io/api-v2) to emulate transaction chains. This helps in testing and verifying the transaction flow without using real assets.

### Step 7: Get an Audit
To add your wallet to the wallets-list repository, please submit a pull request and ensure that all the necessary metadata is filled out. Additionally, applications can integrate wallets directly through the SDK.

## Useful Links
- [TON Connect Specification](https://github.com/ton-blockchain/ton-connect/)
- [Protocol Package](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [Encrypted Communication Channels](https://github.com/ton-blockchain/ton-connect/blob/main/session.md)
- [Bridge Specification](https://github.com/ton-blockchain/ton-connect/blob)
-  [Ton Proof](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#address-proof-signature-ton_proof)
- [Wallet Smart Contracts Tutorial](https://docs.ton.org/develop/smart-contracts/tutorials/wallet)

