import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

در این مقاله، ما عناصر مهم برای توسعه‌دهندگانی که می‌خواهند برنامه‌های TON ایجاد کنند را بازبینی و بررسی خواهیم کرد.

## لیست بررسی

### 1. Name collisions

Func variables and functions may contain almost any legit character. I.e. `var++`, `~bits`, `foo-bar+baz` including commas are valid variables and functions names.

هنگام نوشتن و بازرسی کد Func باید از Linter استفاده شود.

- [پلاگین‌های IDE](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. Check the throw values

Each time the TVM execution stops normally, it stops with exit codes `0` or `1`. Although it is done automatically, TVM execution can be interrupted directly in an unexpected way if exit codes `0` and `1` are thrown directly by either `throw(0)` or `throw(1)` command.

- [نحوهٔ handle کردن خطاها](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [کدهای خروج TVM](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func is a strictly typed language with data structures holding exactly what they are supposed to store

It is crucial to keep track of what the code does and what it may return. Keep in mind that the compiler cares only about the code and only in its initial state. After certain operations stored values of some variables can change.

Reading unexpected variables values and calling methods on data types that are not supposed to have such methods (or their return values are not stored properly) are errors and are not skipped as "warnings" or "notices" but lead to unreachable code. Keep in mind that storing an unexpected value may be okay, however, reading it may cause problems e.g. error code 5 (integer out of expected range) may be thrown for an integer variable.

### 4. Messages have modes

It is essential to check the message mode, in particular its interaction with previous messages sent and fees. A possible failure is not accounting for storage fees, in which case contract may run out of TON leading to unexpected failures when sending outgoing messages. You can view the message modes [here](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- [کیف‌پول‌های مبتنی بر Seqno](/v3/guidelines/dapps/asset-processing/payments-processing/#seqno-based-wallets)
- [کیف‌پول‌های پر بار](/v3/guidelines/dapps/asset-processing/payments-processing/#high-load-wallets)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

It means the code of the contract can be changed. It can either be changed permanently, using [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code) TVM directive, or in runtime, setting the TVM code registry to a new cell value until the end of execution.

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

The computational phase executes the code of smart contracts and only then the actions are performed (sending messages, code modification, changing libraries, and others). So, unlike on Ethereum-based blockchains, you won't see the computational phase exit code if you expected the sent message to fail, as it was performed not in the computational phase, but later, during the action phase.

- [تراکنش‌ها و فازها](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 8. TON contracts are autonomous

Contracts in the blockchain can reside in separate shards, processed by other set of validators, meaning that developer cannot pull data from other contracts on demand. Thus, any communication is asynchronous and done by sending messages.

- [ارسال پیام‌ها از smart-contract](/v3/documentation/smart-contracts/message-management/sending-messages)
- [ارسال پیام‌ها از DApp](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

قبل از شروع برنامه‌نویسی قرارداد هوشمند TON خود، بهتر است به دقت نقشه خروج کدهای جریان کد را بررسی کرده (و مستندات آن را تهیه کنید).

### 10. Func functions that have method_id identifiers have method IDs

They can be either set explicitly `"method_id(5)"`, or implicitly by a func compiler. In this case, they can be found among methods declarations in the .fift assembly file. Two of them are predefined: one for receiving messages inside of blockchain `(0)`, commonly named `recv_internal`, and one for receiving messages from outside `(-1)`, `recv_external`.

### 11. TON crypto address may not have any coins or code

Smart contracts addresses in TON blockchain are deterministic and can be precomputed. Ton Accounts, associated with addresses may even contain no code which means they are uninitialized (if not deployed) or frozen while having no more storage or TON coins if the message with special flags was sent.

### 12. TON addresses may have three representations

TON addresses may have three representations.
A full representation can either be "raw" (`workchain:address`) or "user-friendly". The last one is the one users encounter most often. It contains a tag byte, indicating whether the address is `bounceable` or `not bounceable`, and a workchain id byte. This information should be noted.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

بر خلاف Solidity که شما مسئول تعیین نمایش روش‌ها هستید، در صورت Func، نمایش‌ها به صورت پیچیده‌تری محدود می‌شوند یا از طریق نمایش خطاها یا با جملات اگر محدوده می‌شود.

### 14. Keep an eye on gas before sending bounced messages

در صورتی که قرارداد هوشمند پیام‌های بازگشتی را با مقداری که توسط کاربر فراهم شده است ارسال کند، اطمینان حاصل کنید که هزینه‌های مربوط به گاز از مقدار بازگشتی کسر شوند تا خالی نشوند.

### 15. Monitor the callbacks and their failures

TON blockchain is asynchronous. That means the messages do not have to arrive successively. e.g. when a fail notification of an action arrives, it should be handled properly.

### 16. Check if the bounced flag was sent receiving internal messages

ممکن است پیام‌های بازگشتی (اطلاعیه‌های خطا) که باید پردازش شوند، دریافت کنید.

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## منابع

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />

