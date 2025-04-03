# Jettons Standard

**Jettons** are fungible tokens on the TON blockchain implemented as smart contracts. They follow the [TEP-74 standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md), which defines their structure and behavior, ensuring interoperability and consistency across different implementations.

A jetton consists of two main components:

**1. Jetton Master Contract** – a master smart contract used to mint new jettons, account for circulating supply and provide standard information about the token.

**2. Jetton Wallet Contract** – a smart contract that stores information about the number of jettons each user owns in a decentralized manner. Each user has a jetton wallet, facilitating transfers and interactions with the master contract.

This specification describes implementing jettons according to the TEP-74 standard, detailing the structure of smart contracts, storage layouts, supported operations, and getter methods.

## Jetton Master Contract

Source code: [ft/jetton-minter.fc](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-minter.fc)

### Storage

The Master Contract's key parameters in its storage include:

- `total_supply` - the total number of issued jettons.
- `admin_address` - the administrator's address, which has permission to modify specific contract parameters.
- `content` – a reference to a cell containing Jetton [metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md). This can be stored on-chain or as an off-chain URI.
- `jetton_wallet_code` - a reference to a cell storing the Jetton Wallet bytecode, which is required for generating new wallets.

### Operations

#### Mint Operation (`op::mint()`)

Mints new Jettons and assigns them to the specified recipient.

**Execution Steps:**

**1. Verify Admin Rights**

- The sender must be the `admin_address`. If not, the transaction is rejected.

**2. Extract Parameters**

- `to_address` – recipient’s address.
- `amount` – amount sent in the transaction.
- `master_msg` – reference containing additional minting data.
- Parse `master_msg`:
  - Skip `op_code` (32 bits) and `query_id` (64 bits).
  - Extract `jetton_amount` – the actual number of Jettons to mint.

**3. Minting Process**

- Check if the recipient’s Jetton Wallet exists. If not, deploy a new wallet.
- Mint the specified Jetton amount and send it to the recipient.

**4. Update Master Contract State**

- Increase `total_supply` by the minted amount.
- Store updated data (`admin_address`, `content`, `jetton_wallet_code`).

> Notes: The master contract allows only the admin to mint new Jettons.

#### Burn Notification Operation (`op::burn_notification()`)

This operation is triggered when a Jetton Wallet burns tokens. It updates the total supply in the Master Contract and optionally sends a response to a specified address.

**Execution Steps:**

**1. Extract Parameters**

- `jetton_amount` , `from_address` and `response_address`

**2. Verify Sender**

- Ensure that the sender is the Jetton Wallet associated with `from_address`.
- Compute the expected Jetton Wallet address using `calculate_user_jetton_wallet_address()` and compare it with `sender_address`.
- If the sender is invalid, the transaction is rejected.

**3. Update the Master Contract State**

- Reduce `total_supply` by `jetton_amount`.
- Store the updated contract state.

**4. Handle Excess Funds (if `response_address` is set)**

- If `response_address` is not empty, send an `excesses` message (`op::excesses()`) to return remaining funds.
- The response message includes:
  - `op_code = op::excesses()` (32-bit),
  - `query_id` (64-bit),
  - `0 TON` attached.

#### Change Admin (`op::change_admin()`)

This operation updates the admin of the Master Contract. Only the current admin can execute this operation.

**Execution Steps:**

**1. Verify Admin Rights**

- Ensure that `sender_address` matches `admin_address`.
- If the sender is not the current admin, reject the transaction.

**2. Extract Parameters**

- `new_admin_address` – The address of the new admin.

**3. Update the Master Contract State**

- Replace `admin_address` with `new_admin_address`.
- Store the updated contract state.

#### Change Content (`op::change_content()`)

This operation updates the `content` field in the Master Contract. Only the admin can execute this operation.

**Execution Steps:**

**1. Verify Admin Rights**

- Ensure that the sender is `admin_address`. If the sender is not the admin, the transaction is rejected.

**2. Extract Parameters**

- `new_content` – A reference (`cell`) containing updated content data.

**3. Update the Master Contract State**

- Store the new `content`.
- Other fields (`total_supply`, `admin_address`, `jetton_wallet_code`) remain unchanged.

### Get Methods

#### `get_jetton_data()`

**Returns:**

- `total_supply` — the total number of issued jettons.
- `mintable` — a flag indicating whether new jettons can be minted (`-1` means minting is allowed, `0` means it is not).
- `admin_address` — the address of the smart contract that controls the jetton.
- `jetton_content` — token data according to [Token Data Standard #64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md).
- `jetton_wallet_code` — the code of the Jetton Wallet contract for this jetton.

#### `get_wallet_address(slice owner_address)`

**Returns:**

- `jetton_wallet_address` — the Jetton Wallet address for the given owner.

## Jetton Wallet Contract

The Jetton Wallet Contract interacts with the Jetton Master Contract for transfers and balance updates but functions independently, ensuring scalability and security. It allows users to manage their jettons by providing `transfer` and `burn` operations.

Source code: [ft/jetton-wallet.fc](https://github.com/ton-blockchain/token-contract/blob/main/ft/jetton-wallet.fc)

### Persistent Storage Layout

| Parameter               | Type         | Size (bits) | Description                                          |
| ----------------------- | ------------ | ----------- | ---------------------------------------------------- |
| `balance`               | `uint256`    | 256         | Amount of jettons stored in this wallet.             |
| `owner_address`         | `MsgAddress` | 267         | Address of the wallet owner.                         |
| `jetton_master_address` | `MsgAddress` | 267         | Address of the corresponding Jetton Master contract. |
| `jetton_wallet_code`    | `cell`       | Variable    | Code of the standard Jetton Wallet contract.         |

The size of `jetton_wallet_code` may vary depending on the compiled contract code.

### Operations

#### Transfer - `0x0f8a7ea5`

**Payload Structure:**

| Parameter              | Type         | Description                                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------- |
| `query_id `            | `uint64`     | Arbitrary request number for tracking transactions.                             |
| `amount `              | `coins`      | Number of jettons being transferred.                                            |
| `destination `         | `address`    | Address of the recipient’s jetton-wallet.                                       |
| `response_destination` | `address`    | Address where the transaction confirmation and remaining Toncoins will be sent. |
| `custom_payload   `    | `maybe cell` | Optional custom data for sender or receiver.                                    |
| `forward_ton_amount `  | `coins`      | Amount of TON (nanotons) to send along with the transfer.                       |
| `forward_payload`      | `maybe cell` | Optional data sent to the recipient’s jetton-wallet.                            |

**Behavior:**

**Validations & Rejection Conditions**

- The message must be sent by the **owner** of the Jetton Wallet; otherwise, the transaction is rejected.
- The sender must have **enough jettons** in their balance; otherwise, the transaction is rejected.
- The sender must have **enough TON** to:
  - Cover storage fees and operation costs according to the jetton contract guidelines.
  - Deploy the recipient’s Jetton Wallet (if it does not exist).
  - Send `forward_ton_amount`.
- After processing the request, the receiver’s Jetton Wallet must send at least:

  ```
  in_msg_value - forward_ton_amount - 2 * max_tx_gas_price - 2 * fwd_fee
  ```

  to the `response_destination` address. If this condition is not met, the transaction is immediately rejected.

- **Gas fee validation:**
  - `max_tx_gas_price` is the price in Toncoins of the maximum transaction gas limit for the FT habitat workchain.
  - For the basechain, it can be obtained from **ConfigParam 21 (gas_limit)**.
- **Forward fee validation:**
  - `fwd_fee` is the forward fee for the transfer request and is extracted from the transfer request message.

**Processing**

1. **Decrease** the sender's jetton balance by `amount`.
2. **Send** an `internal_transfer` (`0x178d4519`) message to the receiver’s Jetton Wallet to **increase** its balance by `amount`.
   - `internal_transfer` is an internal message that contracts send each other to record state changes in the TON blockchain.
   - The sender never knows whether the recipient contract is deployed, so deployment data (`state_init`) is always included in the message.
   - If the receiver’s wallet **does not exist**, deploy it first, then execute `internal_transfer`. Otherwise, TON ignores this part and processes the transfer.
3. If `forward_amount > 0`:

   - Ensure the receiver’s Jetton Wallet **forwards** `forward_amount` nanotons to `destination`.
   - The message follows the `transfer_notification` layout (`op_code = 0x7362d09c`):

   | Parameter         | Description                          |
   | ----------------- | ------------------------------------ |
   | `query_id`        | Matches the request’s `query_id`.    |
   | `amount`          | Amount of transferred jettons.       |
   | `sender`          | Address of the sender’s wallet.      |
   | `forward_payload` | Matches request’s `forward_payload`. |

4. If `forward_amount == 0`, no notification message is sent.
5. Any **excess TON** (after operation costs) must be sent to `response_destination` using the `excesses` (`op_code = d53276db`) layout:

   | Parameter  | Description                       |
   | ---------- | --------------------------------- |
   | `query_id` | Matches the request’s `query_id`. |

**Forward Payload Format**

- If `forward_payload` contains a **text comment**, it must start with `0x00000000` (32-bit `uint` zero).

  - The rest is the comment text (UTF-8), which can be displayed to the user.
  - Example: This allows sending a message with a transfer, like `"for coffee"`, which will be visible in the wallet's transaction history.

- If `forward_payload` contains **binary data**, it must start with `0xff`.

  - Used for structured data like purchase IDs.
  - Not displayed as text, only as a hex dump.

- If `forward_payload` is a **smart contract message** (e.g., for DEX), it has **no prefix**.

#### Burn - `0x595f07bc`

**Payload Structure:**

| Parameter              | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `query_id`             | Arbitrary request number for tracking transactions.            |
| `amount`               | Number of jettons to burn.                                     |
| `response_destination` | Address where the confirmation and remaining TON will be sent. |
| `custom_payload`       | Optional custom data for sender or receiver.                   |

**Behavior:**

**Validations & Rejection Conditions**

- The message must be sent by the **owner** of the Jetton Wallet; otherwise, the transaction is rejected.
- The sender must have **enough jettons** in their balance; otherwise, the transaction is rejected.
- The sender must have **enough TON** to cover fees and send at least:

  ```
  in_msg_value - max_tx_gas_price
  ```

  to the `response_destination` address. If this condition is not met, the transaction is immediately rejected.

**Processing**

1. **Decrease** the sender's jetton balance by `amount`.
2. **Send** a `burn_notification` (`0x7bdd97de`) to the Jetton Master.
3. **Jetton Master** must send any **excess TON** (after operation costs) to `response_destination` using the `excesses` layout (`op_code = 0xd53276db`).

### Get Methods

#### `get_wallet_data()`

Returns the following data:

- `int balance` – Amount of jettons stored in this wallet.
- `slice owner` – Address of the wallet owner.
- `slice jetton` – Address of the corresponding Jetton Master contract.
- `cell jetton_wallet_code` – Code of the standard Jetton Wallet contract.

## See Also

- [Messages and Transactions](https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions)
- [Sending messages](https://docs.ton.org/v3/documentation/smart-contracts/message-management/sending-messages)
