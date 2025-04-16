# Highload wallet

When handling a large volume of messages within a short period, a special wallet is required — the Highload Wallet. Highload Wallet v2 was the primary wallet on TON for an extended period, but using it came with risks. If not managed carefully, it could result in [locking all your funds](https://t.me/tonstatus/88).

With the introduction of [Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3), these issues have been addressed at the contract architecture level, leading to reduced gas consumption. This section covers the key features of Highload Wallet v3 and highlight important considerations to remember.

## Highload wallet v3

The Highload Wallet V3 is designed for users who need to send transactions at very high rates, such as crypto exchanges.

- [Source code](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

#### External message structure

Each external message (transfer request) sent to Highload v3 includes the following:
- A 512-bit signature in the top-level cell, with the other parameters located in that cell's reference.
- A subwallet ID (32 bits).
- A reference to the serialized internal message being sent.
- The send mode for the message (8 bits).
- A composite query ID consisting of 13 bits for shift and 10 bits for bit number. 
Note that the 10 bits for the bit number can range up to 1022, not 1023. The last usable query ID (8388605) is reserved for emergencies and should generally not be used.
- The message's creation timestamp or message timestamp.
- A timeout value.


#### Timeout and replay protection

The timeout is stored as a parameter in Highload v3 and is checked against the timeout in all requests. All requests will share the same timeout value. The message must not be older than the timeout when it arrives at the Highload wallet. In code, this means that `created_at > now() - timeout`.

Query IDs are stored for replay protection for at least the timeout period and may be stored up to two times the timeout. However, they are not guaranteed to be stored longer than the timeout period. The subwallet ID is also checked against the one stored in the wallet. The signature and inner reference's hash are validated against the wallet's public key.


#### Message handling
Highload v3 can only send one message per external message. However, it can send this message to itself using a special operation code, allowing the invocation of any action cell on that internal message. This feature enables sending up to 254 messages per external message, potentially more if another message is sent to the Highload wallet within these 254.

Highload v3 stores the query ID for replay protection once all checks pass. However, the message may not be sent due to certain conditions, including:

- State initialization: if the message contains state initialization, it may require using the special opcode to set the action cell after an internal message is sent from the Highload wallet to itself. 
- Insufficient balance. 
- Invalid message structure: only internal messages can be sent directly from an external message.


#### Duplicate message prevention
Highload v3 will never execute multiple external messages with the same `query_id` and `created_at`. Once the system forgets a given `query_id`, the `created_at` condition prevents the message from being executed again—the `query_id` and `created_at` form a transfer request's primary key in Highload v3.


#### Query ID iteration
When iterating or incrementing the query ID, it is more cost-effective in terms of TON fees to iterate the bit number first, followed by the shift, similar to incrementing a regular number. Once you reach the last query ID, keeping the emergency query ID in mind, you can reset the query ID to 0. However, if the Highload timeout period has not passed, the replay protection dictionary will be full, and you will need to wait for the timeout to expire before continuing.


## Highload wallet v2

:::danger
This is a legacy contract, and it is recommended that Highload Wallet v3 be used instead.
:::

The Highload Wallet v2 is designed for users who need to send hundreds of transactions quickly, such as crypto exchanges. It allows you to send up to **254** transactions in a single smart contract call. Additionally, it uses a different approach to prevent replay attacks instead of seqno, enabling you to call the wallet multiple times in a single second and send thousands of transactions instantly.


:::caution Limitations
When working with Highload Wallet v2, storage size and gas limitations should be considered.
:::

1. **Storage size limit.** The contract’s storage size must remain below 65,535 cells. If the size of `old_queries` exceeds this limit, an exception is thrown during the `ActionPhase`, causing the transaction to fail. Failed transactions may be replayed.


2. **Gas limit.** The current gas limit is 1,000,000 GAS units. This means there is a limit to how many old queries can be cleared in a single transaction. The contract will become stuck if the number of expired queries exceeds the limit.

To prevent issues, do not set an excessively high expiration date. The number of queries during the expiration period should not exceed 1,000.

Additionally, the number of expired queries cleaned in one transaction should be kept below 100.

## How to use

- You can also refer to the [Highload wallet tutorials](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) article for more details.
- Wallet source code: [Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)