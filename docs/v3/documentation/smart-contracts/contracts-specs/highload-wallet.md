# Highload Wallet

When working with many messages in a short period, there is a need for special wallet called Highload Wallet. Highload Wallet V2 was the main wallet on TON for a long time, but you had to be very careful with it. Otherwise, you could [lock all funds](https://t.me/tonstatus/88). 

[With the advent of Highload Wallet V3](https://github.com/ton-blockchain/Highload-wallet-contract-v3), this problem has been solved at the contract architecture level and consumes less gas. This chapter will cover the basics of Highload Wallet V3 and important nuances to remember.

## Highload Wallet v3

This wallet is made for who need to send transactions at very high rates. For example, crypto exchanges.

- [Source code](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

Any given external message (transfer request) to a Highload v3 contains:
- a signature (512 bits) in the top level cell - the other parameters are in the ref of that cell
- subwallet ID (32 bits)
- message to send as a ref (the serialized internal message that will be sent)
- send mode for the message (8 bits)
- composite query ID - 13 bits of "shift" and 10 bits of "bit number", however the 10 bits of bit number can only go up to 1022, not 1023, and also the last such usable query ID (8388605) is reserved for emergencies and should not be normally used
- created at, or message timestamp
- timeout

Timeout is stored in Highload as a parameter and is checked against the timeout in all requests - so the timeout for all requests is equal. The message should be not older than timeout at the time of arrival to the Highload wallet, or in code it is required that `created_at > now() - timeout`. Query IDs are stored for the purposes of replay protection for at least timeout and possibly up to 2 * timeout, however one should not expect them to be stored for longer than timeout. Subwallet ID is checked against the one stored in the wallet. Inner ref's hash is checked along with the signature against the public key of the wallet.

Highload v3 can only send 1 message from any given external message, however it can send that message to itself with a special op code, allowing one to set any action cell on that internal message invocation, effectively making it possible to send up to 254 messages per 1 external message (possibly more if another message is sent to Highload wallet again among these 254).

Highload v3 will always store the query ID (replay protection) once all the checks pass, however a message may not be sent due to some conditions, including but not limited to:
- **containing state init** (such messages, if required, may be sent using the special op code to set the action cell after an internal message from Highload wallet to itself)
- not enough balance
- invalid message structure (that includes external out messages - only internal messages may be sent straight from the external message)

Highload v3 will never execute multiple externals containing the same `query_id` **and** `created_at` - by the time it forgets any given `query_id`, the `created_at` condition will prevent such a message from executing. This effectively makes `query_id` **and** `created_at` together the "primary key" of a transfer request for Highload v3.

When iterating (incrementing) query ID, it is cheaper (in terms of TON spent on fees) to iterate through bit number first, and then the shift, like when incrementing a regular number. After you've reached the last query ID (remember about the emergency query ID - see above), you can reset query ID to 0, but if Highload's timeout period has not passed yet, then the replay protection dictionary will be full and you will have to wait for the timeout period to pass.


## Highload wallet v2

:::danger
Legacy contract, it is suggest to use Highload wallet v3.
:::

This wallet is made for those who need to send hundreds of transactions in a short period of time. For example, crypto exchanges.

It allows you to send up to `254` transactions in one smart contract call. It also uses a slightly different approach to solve replay attacks instead of seqno, so you can call this wallet several times at once to send even thousands of transactions in a second.

:::caution Limitations
Note, when dealing with Highload wallet the following limits need to be checked and taken into account.
:::

1. **Storage size limit.** Currently, size of contract storage should be less than 65535 cells. If size of
old_queries will grow above this limit, exception in ActionPhase will be thrown and transaction will fail.
Failed transaction may be replayed.
2. **Gas limit.** Currently, gas limit is 1'000'000 GAS units, that means that there is a limit of how much
old queries may be cleaned in one tx. If number of expired queries will be higher, contract will stuck.

That means that it is not recommended to set too high expiration date:
number of queries during expiration time span should not exceed 1000.

Also, number of expired queries cleaned in one transaction should be below 100.

## How To

You can also read [Highload Wallet Tutorials](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) article.

Wallet source code:
 * [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)
