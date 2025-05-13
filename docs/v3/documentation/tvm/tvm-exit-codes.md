---
title: Exit codes
---

import Feedback from '@site/src/components/Feedback';

Each transaction on TON Blockchain comprises [multiple phases](/v3/documentation/tvm/tvm-overview#transactions-and-phases). An _exit code_ is a 32-bit signed integer that indicates whether the [compute](#compute) or [action](#action) phase succeeded. When unsuccessful, it contains the exception code that occurred. Each exit code represents a specific exception or transaction outcome.

Exit codes 0 and 1 indicate standard (successful) execution of the [compute phase](#compute). Exit (or [result](#action)) code 0 indicates the standard (successful) execution of the [action phase](#action). Any other exit code indicates that a specific exception has occurred and that the transaction wasn't successful in one way or another, i.e., the transaction was reverted or the inbound message has bounced back.

> TON Blockchain reserves exit code values from 0 to 127, while Tact utilizes exit codes from 128 to 255. Note that exit codes used by Tact indicate contract errors, which can occur when using Tact-generated FunC code and are therefore thrown in the transaction's [compute phase](#compute) and not during the compilation.

The range from 256 to 65535 is free for developer-defined exit codes.

:::note
While exit codes are 32-bit signed integers in the TON, attempting to throw an exit code outside the 16-bit unsigned integer range (0-65535) will trigger an error with [exit code 5](#5). This intentionally prevents the artificial generation of specific exit codes like [-14](#-14).
:::

## Table of exit codes {#standard-exit-codes}

The following table lists exit codes with an origin (where it can occur) and a short description. The table doesn't list the exit codes from contracts. To see such exit codes, refer to the source code of the specific contract.

| Exit code | Origin                                 | Brief description                                                                                      |
| :-------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| 0         | [Compute][c] and [action][a] phases    | Standard successful execution exit code.                                                               |
| 1         | [Compute phase][c]                     | Alternative successful execution exit code. Reserved, but doesn't occur.                               |
| 2         | [Compute phase][c]                     | Stack underflow.                                                                                       |
| 3         | [Compute phase][c]                     | Stack overflow.                                                                                        |
| 4         | [Compute phase][c]                     | Integer overflow.                                                                                      |
| 5         | [Compute phase][c]                     | Range check error — some integer is out of its expected range.                                         |
| 6         | [Compute phase][c]                     | Invalid [TVM][tvm] opcode.                                                                             |
| 7         | [Compute phase][c]                     | Type check error.                                                                                      |
| 8         | [Compute phase][c]                     | Cell overflow.                                                                                         |
| 9         | [Compute phase][c]                     | Cell underflow.                                                                                        |
| 10        | [Compute phase][c]                     | Dictionary error.                                                                                      |
| 11        | [Compute phase][c]                     | As described in [TVM][tvm] documentation: "Unknown error, may be thrown by user programs"              |
| 12        | [Compute phase][c]                     | Fatal error thrown by [TVM][tvm] in unexpected situations                                              |
| 13        | [Compute phase][c]                     | Out of gas error.                                                                                      |
| -14       | [Compute phase][c]                     | Equivalent to code 13. A negative value prevents [imitation](#13)                                      |
| 14        | [Compute phase][c]                     | VM virtualization error (reserved but unused)                                                          |
| 32        | [Action phase][a]                      | Action list is invalid.                                                                                |
| 33        | [Action phase][a]                      | Action list is too long.                                                                               |
| 34        | [Action phase][a]                      | Action is invalid or not supported.                                                                    |
| 35        | [Action phase][a]                      | Invalid source address in outbound message.                                                            |
| 36        | [Action phase][a]                      | Invalid destination address in outbound message.                                                       |
| 37        | [Action phase][a]                      | Not enough Toncoin.                                                                                    |
| 38        | [Action phase][a]                      | Not enough extra currencies.                                                                           |
| 39        | [Action phase][a]                      | Outbound message does not fit into a cell after rewriting.                                             |
| 40        | [Action phase][a]                      | Cannot process a message — not enough funds, the message is too large, or its Merkle depth is too big. |
| 41        | [Action phase][a]                      | Library reference is null during library change action.                                                |
| 42        | [Action phase][a]                      | Library change action error.                                                                           |
| 43        | [Action phase][a]                      | Exceeded the maximum number of cells in the library or the maximum depth of the Merkle tree.           |
| 50        | [Action phase][a]                      | Account state size exceeded limits.                                                                    |
| 128       | Tact compiler ([Compute phase][c])     | Null reference exception. Configurable since Tact 1.6.                                                 |
| 129       | Tact compiler ([Compute phase][c])     | Invalid serialization prefix.                                                                          |
| 130       | Tact compiler ([Compute phase][c])     | Invalid incoming message — there's no receiver for the opcode of the received message.                 |
| 131       | Tact compiler ([Compute phase][c])     | Constraints error. Reserved, but never thrown.                                                         |
| 132       | Tact compiler ([Compute phase][c])     | Access denied — someone other than the owner sent a message to the contract.                           |
| 133       | Tact compiler ([Compute phase][c])     | Contract stopped. Reserved, but never thrown.                                                          |
| 134       | Tact compiler ([Compute phase][c])     | Invalid argument.                                                                                      |
| 135       | Tact compiler ([Compute phase][c])     | Code of a contract was not found.                                                                      |
| 136       | Tact compiler ([Compute phase][c])     | Invalid standard address.                                                                              |
| ~~137~~   | ~~Tact compiler ([Compute phase][c])~~ | ~~Masterchain support is not enabled for this contract.~~ Removed since Tact 1.6                       |
| 138       | Tact compiler ([Compute phase][c])     | Not a basechain address.                                                                               |

:::note
The exit code 65535 (`0xffff`) typically indicates the same issue as exit code `130` - an unrecognized message opcode. It is assigned manually when developing contracts rather than generated by [TVM][tvm] or the Tact compiler.
:::

## Exit codes in Blueprint projects {#blueprint}

In [Blueprint][bp] tests, exit codes from the [compute phase](#compute) are specified in the `exitCode` field of the object argument for the `toHaveTransaction()` method of the `expect()` matcher. The field for the result codes (exit codes from the [action phase](#action)) in the same `toHaveTransaction()` method is called `actionResultCode`.

Note that to do so, you'll have to do a couple of type checks before that:

```typescript
it('tests something, you name it', async () => {
  // Send a specific message to our contract and store the results
  const res = await your_contract_name.send(…);

  // Now, we have access to an array of executed transactions,
  // with the second one (index 1) being the one that we look for
  const tx = res.transactions[1]!;

  // To do something useful with it, let's ensure that its type is 'generic'
  // and that the compute phase wasn't skipped
  if (tx.description.type === "generic"
 && tx.description.computePhase.type === "vm") {
    // Finally, we're able to peek into the transaction for general details freely,
    // such as printing out the exit code of the compute phase if we so desire
 console.log(tx.description.computePhase.exitCode);
 }

  // ...
});
```

## Compute phase {#compute}

The [TVM][tvm] initialization and all computations occur during the [compute phase][c]. If this phase fails (resulting in an exit code other than 0 or 1), the transaction skips the [action phase](#action) and proceeds to generate bounce messages for transactions initiated by inbound messages.

### 0: Normal termination {#0}

This exit (or [result](#action)) code indicates a successful completion of the [compute](#compute) (or [action](#action)) phase of the transaction.

### 1: Alternative termination {#1}

This is an alternative exit code for successfully executing the [compute phase](#compute). Reserved, but never occurs.

### 2: Stack underflow {#2}

If some operation consumed more elements than there were on the stack, the error with exit code 2 is thrown: `Stack underflow`.

```tact
asm fun drop() { DROP }

contract Loot {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // Removes 100 elements from the stack, causing an underflow
 repeat (100) { drop() }
 } catch (exitCode) {
 // exitCode is 2
 }
 }
}
```

### 3: Stack overflow {#3}

When you copy too many elements into a closure continuation, the system throws an error with exit code 3: `Stack overflow`. This error rarely occurs unless you work deep in [Fift and TVM assembly][fift] trenches.

```tact
// Remember, kids, don't try to overflow the stack at home!
asm fun stackOverflow() {
 x{} SLICE        // s
 BLESS            // c
 0 SETNUMARGS     // c'
 2 PUSHINT        // c' 2
 SWAP             // 2 c'
 1 -1 SETCONTARGS // ← this blows up
}

contract ItsSoOver {
 receive("I solemnly swear that I'm up to no good") {
 try {
 stackOverflow();
 } catch (exitCode) {
 // exitCode is 3
 }
 }
}
```

### 4: Integer overflow {#4}

If the value in calculation goes beyond the range from `-2^{256} to 2^{256} - 1` inclusive, or there's an attempt to divide or modulo by zero, an error with exit code 4 is thrown: `Integer overflow`.

```tact
let x = -pow(2, 255) - pow(2, 255); // -2^{256}

try {
 -x; // integer overflow by negation
 // since the max positive value is 2^{256} - 1
} catch (exitCode) {
 // exitCode is 4
}

try {
 x / 0; // division by zero!
} catch (exitCode) {
 // exitCode is 4
}

try {
 x * x * x; // integer overflow!
} catch (exitCode) {
 // exitCode is 4
}

// There can also be an integer overflow when doing:
// addition (+),
// subtraction (-),
// division (/) by a negative number or modulo (%) by zero
```

### 5: Integer out of expected range {#5}

Range check error — some integers are out of their expected range. Any attempt to store an unexpected amount of data or specify an out-of-bounds value throws an error with exit code 5: `Integer out of expected range`.

Examples of specifying an out-of-bounds value:

```tact
try {
 // Repeat only operates on an inclusive range from 1 to 2^{31} - 1
 // and any valid integer value greater than that causes an error with exit code 5
 repeat (pow(2, 55)) {
 dump("smash. logs. I. must.");
 }
} catch (exitCode) {
 // exitCode is 5
}

try {
 // Builder.storeUint() function can only use up to 256 bits, so 512 is too much:
 let s: Slice = beginCell().storeUint(-1, 512).asSlice();
} catch (exitCode) {
 // exitCode is 5
}
```

### 6: Invalid opcode {#6}

If you specify an instruction that the current [TVM][tvm] version does not define or try to set an unsupported [code page](/v3/documentation/tvm/tvm-overview#tvm-state), the system throws an error with exit code 6: `Invalid opcode`.

```tact
// There's no such codepage, and attempt to set it fails
asm fun invalidOpcode() { 42 SETCP }

contract OpOp {
 receive("I solemnly swear that I'm up to no good") {
 try {
 invalidOpcode();
 } catch (exitCode) {
 // exitCode is 6
 }
 }
}
```

### 7: Type check error {#7}

If an argument to a primitive is of an incorrect value type or there's any other mismatch in types during the [compute phase](#compute), an error with exit code 7 is thrown: `Type check error`.

```tact
// The actual returned value type doesn't match the declared one
asm fun typeCheckError(): map<Int, Int> { 42 PUSHINT }

contract VibeCheck {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // The 0th index doesn't exist
 typeCheckError().get(0)!!;
 } catch (exitCode) {
 // exitCode is 7
 }
 }
}
```

### 8: Cell overflow {#8}

> `Cell` is a [primitive][p] and a data structure, which ordinarly consists of up to 1023 continuously laid out bits and up to 4 references (refs) to other cells.

A 'Builder' is utilized to create a 'Cell'. If you attempt to store more than 1023 bits of data or exceed 4 references to other cells, an error with exit code 8 is thrown: 'Cell overflow'.

```tact
// Too much bits
try {
 let data = beginCell()
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 250)
 .storeInt(0, 24) // 1024 bits!
 .endCell();
} catch (exitCode) {
 // exitCode is 8
}

// Too much refs
try {
 let data = beginCell()
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell())
 .storeRef(emptyCell()) // 5 refs!
 .endCell();
} catch (exitCode) {
 // exitCode is 8
}
```

### 9: Cell underflow {#9}

> `Cell` is a [primitive][p] and a data structure, which ordinarly consists of up to 1023 continuously laid out bits and up to 4 references (refs) to other cells.

To parse a `Cell`, a `Slice` is used. If you try to load more data or references than `Slice` contains, an error with exit code 9 is thrown: `Cell underflow`.

```tact
// Too few bits
try {
 emptySlice().loadInt(1); // 0 bits!
} catch (exitCode) {
 // exitCode is 9
}

// Too few refs
try {
 emptySlice().loadRef(); // 0 refs!
} catch (exitCode) {
 // exitCode is 9
}
```

### 10: Dictionary error {#10}

In Tact, the `map<K, V>` type is an abstraction over the ["hash" map dictionaries of FunC](/v3/documentation/smart-contracts/func/docs/dictionaries#hashmap) and underlying [`HashmapE` type](/v3/documentation/data-formats/tlb/tl-b-types#hashmap) of [TL-B][tlb] and [TVM][tvm].

If there is an incorrect manipulation of dictionaries, such as improper assumptions about their memory layout, an error with exit code 10 is thrown: `Dictionary error`. Note that Tact prevents you from getting this error unless you do [Fift and TVM assembly][fift] work yourself:

```tact
/// Pre-computed Int to Int dictionary with two entries — 0: 0 and 1: 1
const cellWithDictIntInt: Cell = cell("te6cckEBBAEAUAABAcABAgPQCAIDAEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMLMbT1U=");

/// Tries to preload a dictionary from a Slice as a map<Int, Cell>
asm fun toMapIntCell(x: Slice): map<Int, Cell> { PLDDICT }

contract DictPic {
 receive("I solemnly swear that I'm up to no good") {
 try {
 // The code misinterprets the Int to Int dictionary as a map<Int, Cell>
 let m: map<Int, Cell> = toMapIntCell(cellWithDictIntInt.beginParse());

 //The error happens only when we touch it
 m.get(0)!!;
 } catch (exitCode) {
 // exitCode is 10
 }
 }
}
```

### 11: "Unknown" error {#11}

Described in [TVM][tvm] docs as "Unknown error, may be thrown by user programs", although most commonly used for problems with queueing a message send or problems with [get-methods](/v3/guidelines/smart-contracts/get-methods).

```tact
try {
 // Unlike nativeSendMessage, which uses SENDRAWMSG, this one uses SENDMSG,
 // and therefore fails in the Compute phase when the message is ill-formed
 nativeSendMessageReturnForwardFee(emptyCell(), 0);
} catch (exitCode) {
 // exitCode is 11
}
```

### 12: Fatal error {#12}

Fatal error. Thrown by TVM in situations deemed impossible.

### 13: Out of gas error {#13}

If there isn't enough gas to end computations in the [compute phase](#compute), the error with exit code 13 is thrown: `Out of gas error`.

But this code isn't immediately shown as is. Instead, the bitwise NOT operation is applied, changing the value from `13` to `-14`. Only then is the code shown.

This design prevents user contracts from artificially producing the `-14` code since all functions that throw exit codes can only specify integers ranging from `0 to 65535` inclusive.

```tact
try {
 repeat (pow(2, 31) - 1) {}
} catch (exitCode) {
 // exitCode is -14
}
```

### -14: Out of gas error {#-14}

See [exit code 13](#13).

### 14: Virtualization error {#14}

Virtualization error related to [prunned branch cells](/v3/documentation/data-formats/tlb/exotic-cells#pruned-branch). Reserved, but never thrown.

## Action phase {#action}

The [action phase][a] is processed after the successful execution of the [compute phase](#compute). It attempts to perform the actions stored in the action list by [TVM][tvm] during the compute phase.

Some actions may fail during processing, in which case the system may skip them or revert the entire transaction, depending on the action modes. Developers call the code that indicates the resulting state of the [action phase][a] a _result code_. Since this code serves the same purpose as the compute phase's exit code, developers commonly refer to it as an exit code too.

### 32: Action list is invalid {#32}

If the list of actions contains [exotic cells][exotic], an action entry cell does not have references, or some action entry cell couldn't be parsed, an error with exit code 32 is thrown: `Action list is invalid`.

Aside from this exit code, there's a boolean flag `valid`, which you can find under `description.actionPhase.valid` in the transaction results when working with [Sandbox and Blueprint](#blueprint). The transaction can set this flag to `false` even when the action phase throws some other exit code.

### 33: Action list is too long {#33}

If you queue more than 255 actions for execution, the [action phase](#action) throws an error with exit code 33: `Action list is too long`.

```tact
// For example, let's attempt to queue reservations of a specific amount of nanoToncoins
// This won't fail in the compute phase but will result in exit code 33 in the action phase
repeat (256) {
 nativeReserve(ton("0.001"), ReserveAtMost);
}
```

### 34: Invalid or unsupported action {#34}

Currently, only four actions are supported: changing the contract code, sending a message, reserving a specific amount of `nanoToncoins`, and changing the library cell. If there's any issue with the specified action (invalid message, unsupported action, etc.), an error with exit code 34 is thrown: `Invalid or unsupported action`.

```tact
// For example, let's try to send an ill-formed message:
nativeSendMessage(emptyCell(), 0); // won't fail in compute phase,
 // but will result in exit code 34 in the action phase
```

### 35: Invalid source address in outbound message {#35}

If the source address in the outbound message isn't equal to [`addr_none`](/v3/documentation/data-formats/tlb/msg-tlb#addr_none00) or to the address of the contract that initiated this message, an error with exit code 35 is thrown: `Invalid source address in the outbound message`.

### 36: Invalid destination address in outbound message {#36}

Suppose the destination address in the outbound message is invalid. In that case, e.g., it doesn't conform to the relevant [TL-B][tlb] schemas, contains an unknown workchain ID, or has an invalid length for the given workchain, an error with exit code 36 is thrown: `Invalid destination address in the outbound message`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 37: Not enough Toncoin {#37}

If all funds of the inbound message with [mode 64](/v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode64) had been already consumed and there's not enough funds to pay for the failed action, or the [TL-B][tlb] layout of the provided value ([`CurrencyCollection`](/v3/documentation/data-formats/tlb/msg-tlb#currencycollection)) is invalid, or there are not enough funds to pay forward fees or not enough funds after deducting fees, an error with exit code 37 is thrown: `Not enough Toncoin`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 38: Not enough extra currencies {#38}

Besides the native currency, Toncoin, TON Blockchain supports up to 2^{32} extra currencies. They differ from making new jettons because extra currencies are natively supported — one can potentially specify an extra [`HashmapE`](/v3/documentation/data-formats/tlb/tl-b-types#hashmap) of extra currency amounts in addition to the Toncoin amount in the internal message to another contract. Unlike Jettons, extra currencies can only be stored and transferred and do not have any other functionality.

Currently, **there are no extra currencies** on TON Blockchain, but the exit code 38 is reserved for cases when there is not enough extra currency to send the specified amount: `Not enough extra currencies`.

:::note
[Extra currencies](/v3/documentation/dapps/defi/coins) in TON Docs.

[Extra currency mining](/v3/documentation/infra/minter-flow) in TON Docs.
:::

### 39: Outbound message doesn't fit into a cell {#39}

When processing the message, TON Blockchain tries to pack it according to the [relevant TL-B schemas](/v3/documentation/data-formats/tlb/msg-tlb). If it cannot, an error with exit code 39 is thrown: `Outbound message doesn't fit into a cell`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 40: Cannot process a message {#40}

If there are insufficient funds to process all the cells in a message, the message is too large, or its Merkle depth is too big, an error with exit code 40 is thrown: `Cannot process a message`.

:::note
If the [optional flag +2][flag2] is set, this error will not be thrown, and the given message will not be sent.
:::

### 41: Library reference is null {#41}

If the library reference was required during the library change action but was null, an error with exit code 41 is thrown: `Library reference is null`.

### 42: Library change action error {#42}

If an error occurs during an attempt to perform a library change action, an error with exit code 42 is thrown: `Library change action error`.

### 43: Library limits exceeded {#43}

Suppose the maximum number of cells in the library or the maximum depth of the Merkle tree is exceeded. In that case, an error with exit code 43 is thrown: `Library limits exceeded`.

### 50: Account state size exceeded limits {#50}

If the account state (contract storage, essentially) exceeds any of the limits specified in [config param 43 of TON Blockchain](/v3/documentation/network/configs/blockchain-configs#param-43) by the end of the [action phase](#action), an error with exit code `50` is thrown: `Account state size exceeded limits`.

If the configuration is absent, the default values are:

- `max_msg_bits` equals `2^{21}` — maximum message size in bits.
- `max_msg_cells` equals `2^{13}` — maximum number of cells a message can occupy.
- `max_library_cells` equals `1000` — maximum number of cells that can be used as [library reference cells][lib].
- `max_vm_data_depth` equals `2^{9}` — maximum cells depth in messages and account state.
- `ext_msg_limits.max_size` equals `65535` — maximum external message size in bits.
- `ext_msg_limits.max_depth` equals `2^{9}` — maximum external message depth.
- `max_acc_state_cells` equals `2^{16}` — maximum number of cells an account state can occupy.
- `max_acc_state_bits` equals `2^{16} * 1023` — maximum account state size in bits.
- `max_acc_public_libraries` equals `2^{8}` — maximum number of [library reference cells][lib] that an account state can use on the masterchain.
- `defer_out_queue_size_limit` equals `2^{8}` — maximum number of outbound messages to be queued (regards validators and collators).

## Tact compiler

Tact utilizes exit codes from `128` to `255`. Note that exit codes used by Tact indicate contract errors that can occur when using Tact-generated FunC code and are therefore thrown in the transaction's [compute phase](#compute) and not during the compilation.

The list of exit codes for the Tact compiler is in the [Tact docs](https://docs.tact-lang.org/book/exit-codes/#tact-compiler).

[c]: /v3/documentation/tvm/tvm-overview#compute-phase
[a]: /v3/documentation/tvm/tvm-overview#transactions-and-phases
[flag2]: /v3/documentation/smart-contracts/message-management/message-modes-cookbook#mode2
[tlb]: /v3/documentation/data-formats/tlb/tl-b-language
[lib]: /v3/documentation/data-formats/tlb/exotic-cells#library-reference
[p]: /v3/documentation/smart-contracts/func/docs/types#atomic-types
[tvm]: /v3/documentation/tvm/tvm-overview
[bp]: https://github.com/ton-org/blueprint
[fift]: /v3/documentation/fift/fift-and-tvm-assembly

<Feedback />
