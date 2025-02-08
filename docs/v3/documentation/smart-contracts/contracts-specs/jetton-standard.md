# Jetton Standard (TEP-74)

## Introduction

**Jetton** is a fungible token standard on **The Open Network (TON)** blockchain, designed to facilitate custom token creation, transfer, and management. This specification defines the technical requirements for Jetton smart contracts, ensuring seamless interoperability between wallets, dApps, and services.

- **TEP:** [74](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md)
- **Status:** Active
- **Motivation:** A unified standard simplifies integration and ensures that wallets and applications interact with various tokenized assets consistently.

### Jetton Standard Defines:

- The way of **Jetton transfers**.
- The way of **retrieving common information** (name, circulating supply, etc.) about a Jetton asset.

---

### Useful Links

1. [Reference jetton implementation](https://github.com/ton-blockchain/token-contract/)
2. [Jetton deployer](https://minter.ton.org/)
3. [Jetton Standard Example](https://tact-by-example.org/07-jetton-standard)

---

## Jetton Architecture

Jettons are implemented using a **contract-based model** to ensure decentralized ownership and efficient token management.

### Jetton Master Contract

The **Jetton Master Contract** is the central contract that:

- **Mints** new jettons.
- **Tracks** the total circulating supply.
- **Provides general information** about the Jetton (e.g., name, symbol, decimals).

### Jetton Wallet Contracts

Each user who owns jettons has a dedicated **Jetton Wallet contract**, which:

- **Stores the balance** of jettons owned by the user.
- **Is deployed individually** for each new Jetton holder.
- **Enables decentralized token storage**, ensuring ownership information is not concentrated in a single contract.

### Relationship Between Jetton Master and Jetton Wallets

- The **Jetton Master Contract does not store individual user balances**. Instead, it tracks the **total supply and metadata**.
- Each **Jetton Wallet contract** is linked to a **specific Jetton Master** and represents the ownership of jettons by a single user.
- **Transfers between users** are performed by interacting with their respective **Jetton Wallet contracts**.

---

### Example

If a Jetton with a **total supply of 200** is distributed among **3 users**, the following contracts will be deployed:

1. **1 Jetton Master Contract** (manages supply and metadata).
2. **3 Jetton Wallet Contracts** (one per token holder).

## Jetton Wallet Contract

A **Jetton Wallet** is a smart contract that **holds and manages an individual user's jettons**.  
Jetton balances are stored in **separate wallet contracts** for each owner, unlike centralized token balances.

### Internal Message Handlers

**Internal message handlers** in the Jetton Wallet smart contract:

- **Process incoming messages** and execute key operations like transferring or burning Jettons.
- **Ensure transactions follow the required rules**, maintaining consistency and preventing unauthorized actions.

#### 1. `transfer`

The `transfer` internal message allows a jetton holder to send jettons from their wallet to another address while ensuring that all required conditions are met.

It follows a structured TL-B schema and includes key parameters:

```
transfer#0f8a7ea5 query_id:uint64 amount:(VarUInteger 16) destination:MsgAddress
                 response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                 forward_ton_amount:(VarUInteger 16) forward_payload:(Either Cell ^Cell)
                 = InternalMsgBody;
```

**Jetton Transfer Parameters:**

| Parameter              | Type         | Description                                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------- |
| `query_id `            | `uint64`     | Arbitrary request number for tracking transactions.                             |
| `amount `              | `coins`      | Number of jettons being transferred.                                            |
| `destination `         | `address`    | Address of the recipient’s jetton-wallet.                                       |
| `response_destination` | `address`    | Address where the transaction confirmation and remaining Toncoins will be sent. |
| `custom_payload   `    | `maybe cell` | Optional custom data for sender or receiver.                                    |
| `forward_ton_amount `  | `coins`      | Amount of TON (nanotons) to send along with the transfer.                       |
| `forward_payload`      | `maybe cell` | Optional data sent to the recipient’s jetton-wallet.                            |

**Conditions for Transaction Rejection**

The transaction **must be rejected** if any of the following conditions are met:

- The message is **not from the owner**.
- There are **not enough jettons** in the sender's wallet.
- There is **not enough TON to cover the transaction fees**, deployment of the receiver's wallet (if necessary), and the `forward_ton_amount`.
- After processing the request, the receiver's jetton-wallet **must** send at least to the `response_destination` address:
  `in_msg_value - forward_ton_amount - 2 * max_tx_gas_price - 2 * fwd_fee`,

where:

- `in_msg_value` – Total TON received with the transfer request.
- `forward_ton_amount` – TON sent to the recipient.
- `max_tx_gas_price` – Estimated max gas cost (from [`ConfigParam 21`](https://github.com/ton-blockchain/ton/blob/78e72d3ef8f31706f30debaf97b0d9a2dfa35475/crypto/block/block.tlb#L660) on basechain).
- `fwd_fee` – Fee for forwarding the transfer request.

The transfer must be **immediately aborted** if the sender cannot guarantee this balance.

**Execution Steps**

If the transfer is **valid**, the following steps occur:

1. **Deduct jettons from the sender's wallet** by `amount` and send a message to the recipient's wallet to increase its balance (deploying it if necessary).

**`internal_transfer`**

`internal_transfer` is an internal message that contracts send each other to record state changes in the TON blockchain.

The catch is that the sender never knows whether the recipient contract is deployed. To handle this, the sender always includes deployment data `(state_init)` in the message. If the contract already exists, TON will ignore this part and process the transfer.

2. **Handle forwarding TON coins:**

- If `forward_ton_amount` > 0, send a message to the `destination` address with `forward_amount nanotons`.
- The forwarded message must follow this TL-B schema:

```
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
```

**Transfer Notification Parameters**

This table describes the parameters included in a transfer notification message.

| Parameter         | Description                            |
| ----------------- | -------------------------------------- |
| `query_id`        | Same as the original transfer request. |
| `amount`          | The transferred jetton amount.         |
| `sender`          | Address of the sender's jetton-wallet. |
| `forward_payload` | The original forward_payload field.    |

If `forward_ton_amount` == 0, this notification message is not sent.

3. Receiver's wallet should **send all excesses of incoming message coins** to `response_destination` after deducting the required fees. The message follows this TL-B schema:

`excesses#d53276db query_id:uint64 = InternalMsgBody;`,
where `query_id` is the same as the original transfer request.

This ensures that every transfer is executed securely, with proper validation and fee management.

---

#### `forward_payload` format

The `forward_payload` in a transfer message sends additional information along with the jetton transfer. It can contain a **text comment**, a **binary comment**, or a **binary message** for smart contract interaction.

**Text Comment (User-readable)**

- If you want to include a simple comment, the `forward_payload` must start with `0x00000000` (a 32-bit unsigned integer set to zero).
- The comment text follows this prefix and should be a valid UTF-8 string.
- If the first byte of the comment is not `0xff`, it is treated as text and can be displayed to the user (e.g., _"for coffee"_ in a wallet app).

**Binary Comment (Machine-readable, not user-friendly)**

- If the comment starts with `0xff`, the rest of the data is a **binary comment**.
- This is not meant to be displayed as text but can be shown as a **hex dump** if needed.
- **Use case**: Storing purchase identifiers for payments in a store, where the data is processed automatically.

**Binary Message (Smart Contract Interaction)**

- If the `forward_payload` contains a binary message for interacting with a **smart contract** (e.g., sending a swap order to a DEX), there is **no prefix**.
- The receiving contract will parse and process the binary data according to its logic.
- This format follows the same internal message payload rules as sending Toncoins from a regular wallet ([Smart Contract Guidelines: Internal Messages, 3](https://ton.org/docs/#/howto/smart-contract-guidelines?id=internal-messages)).

---

#### Example: Jetton Transfer

Below is a Tact implementation of messages, including `transfer`, `internal_transfer`, `transfer_notification`, and `excesses`.

```
message(0xf8a7ea5) Transfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x178d4519) InternalTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x7362d09c) TransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining;
}

message(0xd53276db) Excesses {
    queryId: Int as uint64;
}

```

Below is an implementation of JettonDefaultWallet, which handles `transfer`, `internal_transfer`, `transfer_notification`, and `excesses` messages, manages Jetton balances, validates transfers, and ensures proper gas and storage handling.

```
contract JettonDefaultWallet {

    const minTonsForStorage: Int = ton("0.01");     // Min amount of TON required to keep the contract stored on the blockchain
    const gasConsumption: Int = ton("0.01");        // Estimated gas consumption for executing operations


    balance: Int;           // Jetton balance of the wallet
    owner: Address;         // Owner of the wallet
    master: Address;        // Address of the master contract (Jetton Master)


    init(master: Address, owner: Address) {
        self.balance = 0;           // Initial jetton balance is 0
        self.owner = owner;         // Set the wallet owner
        self.master = master;       // Set the master contract address
    }

    // Handler for incoming `Transfer` message (0xf8a7ea5)
    receive(msg: Transfer) {

        let ctx: Context = context();
        require(ctx.sender == self.owner, "Invalid sender");  // Verify that the sender is the wallet owner

        self.balance = self.balance - msg.amount;             // Deduct jettons from the balance and ensure it doesn't go negative
        require(self.balance >= 0, "Invalid balance");

        let fwdFee: Int = ctx.readForwardFee() + ctx.readForwardFee();      // Calculate the forwarding fee for the message

        let final: Int =  2 * self.gasConsumption + self.minTonsForStorage + fwdFee;       // Calculate the minimum amount of TON that must remain after the transaction
        require(ctx.value > min(final, ton("0.01")), "Invalid value");

        let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);    // Create a `StateInit` for the recipient's wallet to deploy it if necessary


        let walletAddress: Address = contractAddress(init);

        // Send an `InternalTransfer` message to the recipient's wallet
        send(SendParameters{
            to: walletAddress,              // Recipient's address
            value: 0,                       // Send 0 TON (fees should be covered by the incoming message)
            mode: SendRemainingValue,       // Send the remaining amount of TON
            bounce: false,                  // Disable bounce mechanism on failure
            body: InternalTransfer{         // Construct the `InternalTransfer` message body
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: init.code,        // Contract code of the recipient (if not deployed)
            data: init.data         // Initialization data for the recipient contract
        });
    }



    // Handler for receiving `InternalTransfer` message (0x178d4519)
    receive(msg: InternalTransfer) {

        let ctx: Context = context();
        if (ctx.sender != self.master) {       // Verify that the sender is either the Jetton Master or another valid Jetton wallet
            let init: StateInit = initOf JettonDefaultWallet(msg.from, self.master);
            require(contractAddress(init) == ctx.sender, "Invalid sender!");       // Ensure that the sender is a valid Jetton wallet belonging to `msg.from`
        }


        self.balance = self.balance + msg.amount;       // Update the wallet balance with the received jettons
        require(self.balance >= 0, "Invalid balance");  // Ensure the balance remains valid

        // Calculate the remaining TON after fees and forwarded TON
        let msgValue: Int = self.msgValue(ctx.value);   // Retrieve the effective message value
        let fwdFee: Int = ctx.readForwardFee();         // Read the estimated forwarding fee
        msgValue = msgValue - msg.forward_ton_amount - fwdFee;  // Deduct forwarding and fees

        // Notify the new owner of the received jettons ('TransferNotification' message (0x7362d09c))
        if (msg.forward_ton_amount > 0) {
            send(SendParameters{
                to: self.owner,  // Notify the owner of the jetton transfer
                value: msg.forward_ton_amount, // Send the specified TON amount
                mode: SendPayGasSeparately + SendIgnoreErrors, // Ensure gas is handled separately
                bounce: false,  // Prevent bouncing if the destination rejects the message
                body: TransferNotification {  // Construct a notification message
                    queryId: msg.queryId,
                    amount: msg.amount, /
                    from: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // Send excess TON (cashback) back to the original sender (`Excesses` message (0xd53276db))
        if (msg.response_destination != null) {
            send(SendParameters {
                to: msg.response_destination,  // Address to send the excess TON back to
                value: msgValue,               // Send the remaining TON after all deductions
                bounce: false,                 // Prevent bouncing if the recipient rejects it
                body: Excesses {               // Construct an excesses message
                    queryId: msg.queryId
                }.toCell(),
                mode: SendIgnoreErrors          // Ensure the message is sent even if errors occur
            });
        }
    }
}


```

#### 2. `burn`

The burn operation in the Jetton Wallet smart contract allows users to destroy (burn) a specified amount of jettons.

**Purpose and Use Cases**

Burning jettons can serve multiple purposes, such as:

- Reducing the total supply of jettons in circulation.
- Implementing a deflationary token mechanism.
  Once the burn operation is successfully executed, the Jetton Master receives a notification about the event.

**Inbound Message Format (`burn` request format)**

The inbound burn message follows this TL-B schema:

```
burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
              response_destination:MsgAddress custom_payload:(Maybe ^Cell)
              = InternalMsgBody;
```

This table describes the fields involved in a burn operation message.

| Parameter              | Type         | Description                                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------- |
| `query_id`             | `uint64`     | Arbitrary request number (used to match responses).                             |
| `amount`               | `coins`      | The amount of jettons to be burned.                                             |
| `response_destination` | `address`    | The address to which a confirmation message and any excess TONs should be sent. |
| `custom_payload`       | `maybe cell` | An optional field containing additional data related to the burn operation.     |

**Conditions for Rejection**

The burn request must be rejected in the following cases:

- The message sender is **not the owner** of the Jetton Wallet.
- The sender's wallet **does not have enough jettons** to burn the requested amount.
- The wallet **does not have enough TONs** to send at least:
  `in_msg_value - max_tx_gas_price` to the `response_destination` address after processing the request. If this condition is not met, the wallet must **halt execution** and throw an error.

**Execution Steps**

If none of the rejection conditions apply, the request is processed as follows:

**1. Jetton Balance Update**

- The jetton wallet decreases the jetton balance of the owner by amount.
- It then **sends a notification** to the Jetton Master about the burn event.

**2. Handling Excess TONs**

- The Jetton Master **forwards any excess TONs** from the incoming message to `response_destination`.
- This is done using the following TL-B message schema:
  `excesses#d53276db query_id:uint64 = InternalMsgBody;` ,
  where `query_id` in the response must **match the original request's `query_id`.**

---

#### Example: Jetton Burn

Below is an implementation of messages, including `burn` and `burn_notification`.

```
message(0x595f07bc) Burn {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response_destination: Address;
}

message(0x7bdd97de) BurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    response_destination: Address?;
}

```

Below is the `burn` implementation, which enables the wallet owner to burn jettons and notify the master contract while ensuring balance validity and covering gas fees.

```
receive(msg: Burn) {
    let ctx: Context = context();
    require(ctx.sender == self.owner, "Invalid sender");  // Ensure only the wallet owner can burn tokens

    self.balance = self.balance - msg.amount; // Deduct the burned amount from the balance
    require(self.balance >= 0, "Invalid balance"); // Ensure the balance does not go negative

    let fwdFee: Int = ctx.readForwardFee(); // Retrieve the estimated forwarding fee
    require(ctx.value > fwdFee + 2 * self.gasConsumption + self.minTonsForStorage, "Invalid value - Burn");  // Ensure the sender provides enough TON for gas and storage fees

    // Notify the master contract about the token burn
    send(SendParameters{
        to: self.master,   // Send the burn notification to the master contract
        value: 0,          // No TON is transferred with this message
        mode: SendRemainingValue, // Send the remaining gas balance
        bounce: true,      // Enable bounce in case the master contract rejects the message
        body: BurnNotification{  // Construct the burn notification message
            queryId: msg.queryId,
            amount: msg.amount,
            owner: self.owner,
            response_destination: self.owner
        }.toCell()
    });
}




```

#### Get-methods

Get-methods in a Jetton Wallet smart contract allow users and external contracts to retrieve data about the wallet without sending a transaction. These methods do not modify the contract's state.

**`get_wallet_data()`** provides key details about the jetton-wallet and returns four values:

| Parameter            | Type      | Description                                                                                  |
| -------------------- | --------- | -------------------------------------------------------------------------------------------- |
| `balance`            | `coins`   | The amount of jettons stored in this wallet.                                                 |
| `owner`              | `address` | The address of the wallet's owner. Only this address can initiate jetton transfers or burns. |
| `jetton`             | `address` | The address of the corresponding jetton master contract.                                     |
| `jetton_wallet_code` | `code`    | The code of the jetton-wallet.                                                               |

#### Example: `get_wallet_data()`

```
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf JettonDefaultWallet(self.master, self.owner)).code
        };
    }

```

### Jetton Master Contract

The **Jetton Master contract** is the core smart contract that manages a specific jetton (fungible token) within the TON blockchain. Each jetton type has a unique master contract that ensures proper token issuance, distribution, and compliance with TON’s standards.

The contract must maintain the following data:

- `total_supply` – The total amount of issued jettons.
- `mintable` – A flag indicating whether new jettons can be minted (-1 for true, 0 for false).
- `admin_address` – The administrator’s wallet address that controls the jetton supply.
- `jetton_content` – Metadata following [Token Data Standard #64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
- `jetton_wallet_code` – The code used for deploying jetton wallets for users.

#### Get-Methods

Jetton Master contracts provide methods that allow external smart contracts or wallets to retrieve key data.

#### get_jetton_data()

- Returns jetton parameters:

`(int total_supply, int mintable, slice admin_address, cell jetton_content, cell jetton_wallet_code)`

- This method helps contracts and wallets verify jetton details before executing transactions.

#### get_wallet_address(slice owner_address)

- Returns the unique **jetton wallet address** for a given **owner**:

`slice jetton_wallet_address`

- This method lets users and dApps determine the correct jetton wallet before sending jettons.

#### Example: `get_jetton_data()` & `get_wallet_address(slice owner_address)`

```
get fun get_jetton_data(): JettonData {
        let code: Cell = self.getJettonWalletInit(myAddress()).code;
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: code
        };
    }

get fun get_wallet_address(owner: Address): Address {
    let winit: StateInit = self.getJettonWalletInit(owner);
    return contractAddress(winit);
}

```

#### Deployment Considerations

**1. Jetton Wallet Code**

- Each user requires a dedicated Jetton Wallet. The `jetton_wallet_code` defines the behaviour of these wallets and must be stored within the Master contract.
- The Master contract should use `get_wallet_address()` to derive deterministic wallet addresses for users.

**2. Minting & Supply Control**

- If `mintable` = -1, the admin address can issue new jettons.
- If `mintable` = 0, jettons cannot be minted beyond the initial supply.

**3. Security & Compliance**

- Ensure that only the `admin_address` can mint jettons.
- Prevent unauthorized modifications to jetton metadata and wallet code.

### TL-B Schema

In your smart contracts, you can use the [TL-B Schema](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md#tl-b-schema) to define and process Jetton-related messages, including transfers, burns, and notifications.

The schema defines key message types used in the Jetton standard:

- **`transfer`** — message for sending jettons.
- **`transfer_notification`** — notification of received jettons.
- **`excesses`** — message for returning excess TON.
- **`burn`** — message for burning jettons.
- **`internal_transfer`** — optional message for internal transfers.
- **`burn_notification`** — notification of burned jettons.

Each message type has a unique **CRC32 opcode**, which is used for identifying and handling these messages in smart contracts:

| Message Type            | CRC32 Opcode |
| ----------------------- | ------------ |
| `transfer`              | `0xf8a7ea5`  |
| `transfer_notification` | `0x7362d09c` |
| `excesses`              | `0xd53276db` |
| `burn`                  | `0x595f07bc` |
| `internal_transfer`     | `0x178d4519` |
| `burn_notification`     | `0x7bdd97de` |

## Drawbacks

There is no way to get actual wallet balance onchain, because when the message with balance will arrive, wallet balance may be not actual.

## Rationale and alternatives

Distributed architecture "One wallet - one contract" well described in the [NFT standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#rationale-and-alternatives) in paragraph "Rationale".

## Prior art

1. [EIP-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
2. [Sharded Smart Contracts for Smart Contract Developers](https://www.youtube.com/watch?v=svOadLWwYaM)

## Unresolved questions

1. There is no standard methods to perform "safe transfer", which will revert ownership transfer in case of contract execution failure.
