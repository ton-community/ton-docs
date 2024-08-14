# Guide to Integrating Wallet with TON Connect

## How It Works
**TON Connect** is a protocol that enables secure communication between wallets and decentralized applications (dApps) on the TON blockchain. The integration involves setting up a bridge for encrypted communication, generating wallet state initialization, signing messages, and validating parameters.

### Key Components
- **Bridge:** A server facilitating encrypted communication between the wallet and the dApp. There are different types of bridges including ready-made bridges, TONAPI bridges, custom bridges, and JS bridges.
- **Wallet State Init:** A base64-encoded BOC containing the standard StateInit structure for all contracts in TON.
- **Session Protocol:** Manages the session between the wallet and the dApp for secure transactions.

## How to Use

### Step 1: Review Specifications

:::caution **IMPORTANT**

The main answers to your questions are emphasized within the specification. Be sure to refer to these highlighted sections for critical information.

:::

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

The wallet state init is a base64-encoded BOC containing the standard `StateInit` structure for all contracts in TON.

To create the `StateInit` for the wallet, you will need various parameters depending on the wallet version, but the data set always includes the wallet ID and the public key.

- **Wallet ID**: Set the wallet ID to `698983191`. This value is the sum of the "magic number" `698983191` (which is the first 4 bytes of the reversed hash of the zero state) and the workchain number (0 for users).
- **Public Key**: Generate the public key from the seed.
- **Wallet Version**: Determine which version of the wallet is being used. TON has several wallet versions, but most often  `v5r1`, `v4r2` or `v3r2` is used.

Regardless of the version, the `StateInit` is formed in the same way:

```ts
import { beginCell, storeStateInit } from '@ton/core';

const stateInitCell = beginCell().store(storeStateInit(walletContract.init)).endCell();
const stateInitBocBase64 = stateInitCell.toBoc().toString('base64');
```

Here, walletContract.init is a JS structure in the format { code: codeCell, data: dataCell }. If you are using @ton/core, you can generate such structures automatically:

```ts
import { WalletContractV5R1, WalletContractV4, WalletContractV3R2 } from '@ton/core';

const walletContractV4 = WalletContractV4.create({ workchain: 0, publicKey: publicKey });
const walletContractV3R2 = WalletContractV3R2.create({ workchain: 0, publicKey: publicKey });
const walletContractV5R1 = WalletContractV5R1.create({ publicKey: publicKey });
```
#### Creating a Signature for TON Proof
To create a signature for the TON proof, you need to compute the required payload according to the [TON Connect Address Proof Signature Documentation](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#address-proof-signature-ton_proof), or use the [TON Proof Service Example](https://github.com/ton-connect/demo-dapp-with-react-ui/blob/master/src/server/services/ton-proof-service.ts#L29-L116), and then sign it using the secret key.

#### Creating a Signature for a Message
For creating a signature for a message, you can either use the ready-made method of the wallet contract [v4 Wallet Contract Signature Method](https://github.com/ton-org/ton/blob/master/src/wallets/WalletContractV4.ts#L93-L112), or use it as a reference for your own implementation.

#### Resources

Here are the links to the wallet contracts implementations:

- [v5r1 Wallet Contract](https://github.com/ton-org/ton/blob/master/src/wallets/v5r1/WalletContractV5R1.ts)
- [v4 Wallet Contract](https://github.com/ton-org/ton/blob/master/src/wallets/WalletContractV4.ts)
- [v3r2 Wallet Contract](https://github.com/ton-org/ton/blob/master/src/wallets/WalletContractV3R2.ts)

We also have a guide on wallet smart contracts that can be useful for many other questions: [TON Wallet Smart Contracts Guide](https://docs.ton.org/develop/smart-contracts/tutorials/wallet).

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
To test and demonstrate the integration, you can use the following resources:
- [Demo Dapp](https://github.com/ton-connect/demo-dapp-with-wallet) with Wallet: This repository provides a starting point for setting up a demo environment to test wallet integration.
- [TON Proof Demo App](https://github.com/liketurbo/demo-dapp-with-backend/tree/js-demo): This app allows you to verify TON proof functionality in a practical setting.

For real-world testing and examples, try the following platforms:

- **[TON Stakers](https://app.tonstakers.com):** Test wallet connection, stake, and unstake TON.
- **[STON.fi](https://app.ston.fi):** Test wallet connection, swap TON for USDT, and manage liquidity.
- **[GetGems](https://getgems.io):** Test wallet connection, mint, list, and purchase NFTs.

### Emulating Transactions
#### Handling Messages from TON Connect

When using TON Connect, you will receive multiple messages, each containing a `body` and `init`. Simply displaying these messages as they are might be acceptable for basic functionality, but it is not sufficient for ensuring security.

#### Initial Implementation

For the first version, displaying the messages as they are may be sufficient. However, in future updates, it would be beneficial to parse these messages or emulate a transaction chain to provide the user with more detailed and useful information.

#### Recommended Approaches

You can enhance your implementation by using the following methods:

- **TON API**: Utilize the `/v2/wallet/emulate` method from [TON API v2](https://tonapi.io/api-v2).

:::warning

When emulating transactions, it's essential to keep the following points in mind:

1. **Do Not Use the Real Wallet’s Secret Key**: Always avoid using the actual wallet's secret key during emulation. Instead, sign the transaction with a fake key, such as an empty buffer, to ensure security.

2. **Ensure the Real Wallet Balance is Used for Emulation**: For accurate emulation, the real wallet balance must be provided. If the balance is empty, the emulation process will fail and return an error. During testing, you may uncomment the line to specify a larger balance than what actually exists, but remember to revert to the real balance in production.

:::

<details>
<summary>Example</summary>

```ts

import { Address, beginCell, external, internal, SendMode, storeMessage, toNano, TonClient4, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from '@ton/crypto';
import fetch from 'node-fetch';

// place your mnemonic here
const mnemonic = [
    'hill', 'silly', 'large', 'favorite', 'bottom', 'embody',
    'entry', 'blame', 'timber', 'garden', 'humor', 'copper',
    'advance', 'cargo', 'unveil', 'clock', 'narrow', 'conduct',
    'begin', 'price', 'receive', 'nose', 'public', 'fury'
];

async function main() {
    // get ton client
    const client = new TonClient4({
        endpoint: 'https://mainnet-v4.tonhubapi.com'
    });

    // create key pair from mnemonic and open wallet
    const keyPair = await mnemonicToWalletKey(mnemonic);
    const wallet = client.open(WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey
    }));

    // log wallet address
    const friendlyAddress = wallet.address.toString({ urlSafe: true, bounceable: false });
    console.log(friendlyAddress);

    // get seqno
    const seqno = await wallet.getSeqno();
    // place recipient address here
    const recipient = Address.parse('EQCKWpx7cNMpvmcN5ObM5lLUZHZRFKqYA4xmw9jOry0ZsF9M');

    /** DANGER ZONE */
    // ⚠️ FOR EMULATION PURPOSES USE EMPTY BUFFER
    // ⚠️ DON'T USE THE REAL SECRET KEY FOR EMULATION!!!!
    const fakeSecretKey = Buffer.alloc(64);
    /** DANGER ZONE */

    // build transfer body for external message
    const body = wallet.createTransfer({
        seqno: seqno,
        secretKey: fakeSecretKey,
        sendMode: SendMode.IGNORE_ERRORS + SendMode.PAY_GAS_SEPARATELY,
        messages: [internal({
            to: recipient,
            value: toNano('0.01')
        })]
    });
    // build external message
    const extMsg = beginCell()
      .store(storeMessage(external({
          to: wallet.address,
          body: body,
          init: seqno === 0 ? wallet.init : null
      })))
      .endCell();
    // base64 encode external message
    const extMsgBocBase64 = extMsg.toBoc().toString('base64');

    // get wallet balance for emulation, must be not empty
    let walletBalance = Number(await wallet.getBalance());
    // you can uncomment this line for testing purposes, BUT DON'T FORGET TO COMMENT IT BACK FOR REAL USAGE
    // walletBalance = 1_000_000_000;
    const result = await fetch(`https://tonapi.io/v2/wallet/emulate`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            boc: extMsgBocBase64,
            params: [
                {
                    address: wallet.address.toRawString(),
                    balance: walletBalance
                }
            ]
        })
    }).then(p => p.json());
    // log emulation result
    console.log(result);
}

main().catch();

```
</details>

- **Tongo Library**: Explore the [Tongo library on GitHub](https://github.com/tonkeeper/tongo).
- **Custom Parser**: Consider implementing your own parser, similar to the one in [tlb-abi](https://github.com/TrueCarry/tlb-abi) (please note that this version is not stable).
- **Transaction Emulation**: Look at the emulation example in [this GitHub repository](https://github.com/thekiba/multisig/tree/main/apps/ui) (primarily for research purposes).

### Step 7: Get an Audit
To add your wallet to the wallets-list repository, please submit a pull request and ensure that all the necessary metadata is filled out. Additionally, applications can integrate wallets directly through the SDK.

## Useful Links
- [TON Connect Specification](https://github.com/ton-blockchain/ton-connect/)
- [Protocol Package](https://github.com/ton-connect/sdk/tree/main/packages/protocol)
- [Encrypted Communication Channels](https://github.com/ton-blockchain/ton-connect/blob/main/session.md)
- [Bridge Specification](https://github.com/ton-blockchain/ton-connect/blob)
- [Ton Proof](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#address-proof-signature-ton_proof)
- [Wallet Smart Contracts Tutorial](https://docs.ton.org/develop/smart-contracts/tutorials/wallet)

