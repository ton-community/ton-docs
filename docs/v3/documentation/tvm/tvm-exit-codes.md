---
title: Exit codes
---

Each transaction on the TON Blockchain comprises [multiple phases](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases). An _exit code_ is a 32-bit signed integer that indicates whether the [compute](#compute) or [action](#action) phase succeeded. When unsuccessful, it contains the exception code that occurred. Each exit code represents a specific exception or transaction outcome.

Exit codes 0 and 1 indicate normal (successful) execution of the [compute phase](#compute). Exit (or [result](#action)) code 0 indicates normal (successful) execution of the [action phase](#action). Any other exit code indicates that a certain exception has occurred and that the transaction wasn't successful in one way or another, i.e. transaction was reverted or the inbound message has bounced back.

> TON Blockchain reserves exit code values from 0 to 127, while Tact utilizes exit codes from 128 to 255. Note, that exit codes used by Tact indicate contract errors which can occur when using Tact-generated FunC code, and are therefore thrown in the transaction's [compute phase](#compute) and not during the compilation.

The range from 256 to 65535 is free for developer-defined exit codes.

:::note
While exit codes are 32-bit signed integers on TON Blockchain, attempting to [throw](https://docs.tact-lang.org/ref/core-debug) an exit code outside the 16-bit unsigned integer range (0-65535) will trigger an error with [exit code 5](https://docs.tact-lang.org/book/exit-codes/#5). This is intentional to prevent artificial generation of certain exit codes like [-14](https://docs.tact-lang.org/book/exit-codes/#-14).
:::

## Table of exit codes {#standard-exit-codes}

The following table lists exit codes with an origin (where it can occur) and a short description for each. The table doesn't list the exit code of the [`require()`](https://docs.tact-lang.org/ref/core-debug#require), as it generates it depending on the concrete `error` message [string][p]. To see such exit codes, refer to the [Exit codes section of the compilation report](https://docs.tact-lang.org/book/compile#exit-codes).

| Exit code                                                  | Origin                                 | Brief description                                                                                     |
| :--------------------------------------------------------- | :------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [0](https://docs.tact-lang.org/book/exit-codes/#0)         | [Compute][c] and [action][a] phases    | Standard successful execution exit code.                                                              |
| [1](https://docs.tact-lang.org/book/exit-codes/#1)         | [Compute phase][c]                     | Alternative successful execution exit code. Reserved, but doesn't occur.                              |
| [2](https://docs.tact-lang.org/book/exit-codes/#2)         | [Compute phase][c]                     | Stack underflow.                                                                                      |
| [3](https://docs.tact-lang.org/book/exit-codes/#3)         | [Compute phase][c]                     | Stack overflow.                                                                                       |
| [4](https://docs.tact-lang.org/book/exit-codes/#4)         | [Compute phase][c]                     | Integer overflow.                                                                                     |
| [5](https://docs.tact-lang.org/book/exit-codes/#5)         | [Compute phase][c]                     | Range check error — some integer is out of its expected range.                                        |
| [6](https://docs.tact-lang.org/book/exit-codes/#6)         | [Compute phase][c]                     | Invalid [TVM][tvm] opcode.                                                                            |
| [7](https://docs.tact-lang.org/book/exit-codes/#7)         | [Compute phase][c]                     | Type check error.                                                                                     |
| [8](https://docs.tact-lang.org/book/exit-codes/#8)         | [Compute phase][c]                     | Cell overflow.                                                                                        |
| [9](https://docs.tact-lang.org/book/exit-codes/#9)         | [Compute phase][c]                     | Cell underflow.                                                                                       |
| [10](https://docs.tact-lang.org/book/exit-codes/#10)       | [Compute phase][c]                     | Dictionary error.                                                                                     |
| [11](https://docs.tact-lang.org/book/exit-codes/#11)       | [Compute phase][c]                     | As described in [TVM][tvm] documentation: "Unknown error, may be thrown by user programs"             |
| [12](https://docs.tact-lang.org/book/exit-codes/#12)       | [Compute phase][c]                     | Fatal error thrown by [TVM][tvm] in unexpected situations                                             |
| [13](https://docs.tact-lang.org/book/exit-codes/#13)       | [Compute phase][c]                     | Out of gas error.                                                                                     |
| [-14](https://docs.tact-lang.org/book/exit-codes/#-14)     | [Compute phase][c]                     | Equivalent to code 13. A negative value prevents [imitation](#13)                                     |
| [14](https://docs.tact-lang.org/book/exit-codes/#14)       | [Compute phase][c]                     | VM virtualization error (reserved but unused)                                                         |
| [32](https://docs.tact-lang.org/book/exit-codes/#32)       | [Action phase][a]                      | Action list is invalid.                                                                               |
| [33](https://docs.tact-lang.org/book/exit-codes/#33)       | [Action phase][a]                      | Action list is too long.                                                                              |
| [34](https://docs.tact-lang.org/book/exit-codes/#34)       | [Action phase][a]                      | Action is invalid or not supported.                                                                   |
| [35](https://docs.tact-lang.org/book/exit-codes/#35)       | [Action phase][a]                      | Invalid source address in outbound message.                                                           |
| [36](https://docs.tact-lang.org/book/exit-codes/#36)       | [Action phase][a]                      | Invalid destination address in outbound message.                                                      |
| [37](https://docs.tact-lang.org/book/exit-codes/#37)       | [Action phase][a]                      | Not enough Toncoin.                                                                                   |
| [38](https://docs.tact-lang.org/book/exit-codes/#38)       | [Action phase][a]                      | Not enough extra currencies.                                                                          |
| [39](https://docs.tact-lang.org/book/exit-codes/#39)       | [Action phase][a]                      | Outbound message does not fit into a cell after rewriting.                                            |
| [40](https://docs.tact-lang.org/book/exit-codes/#40)       | [Action phase][a]                      | Cannot process a message — not enough funds, the message is too large or its Merkle depth is too big. |
| [41](https://docs.tact-lang.org/book/exit-codes/#41)       | [Action phase][a]                      | Library reference is null during library change action.                                               |
| [42](https://docs.tact-lang.org/book/exit-codes/#42)       | [Action phase][a]                      | Library change action error.                                                                          |
| [43](https://docs.tact-lang.org/book/exit-codes/#43)       | [Action phase][a]                      | Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree.              |
| [50](https://docs.tact-lang.org/book/exit-codes/#50)       | [Action phase][a]                      | Account state size exceeded limits.                                                                   |
| [128](https://docs.tact-lang.org/book/exit-codes/#128)     | Tact compiler ([Compute phase][c])     | Null reference exception. Configurable since Tact 1.6 (not released yet).                             |
| [129](https://docs.tact-lang.org/book/exit-codes/#129)     | Tact compiler ([Compute phase][c])     | Invalid serialization prefix.                                                                         |
| [130](https://docs.tact-lang.org/book/exit-codes/#130)     | Tact compiler ([Compute phase][c])     | Invalid incoming message — there's no receiver for the opcode of the received message.                |
| [131](https://docs.tact-lang.org/book/exit-codes/#131)     | Tact compiler ([Compute phase][c])     | Constraints error. Reserved, but never thrown.                                                        |
| [132](https://docs.tact-lang.org/book/exit-codes/#132)     | Tact compiler ([Compute phase][c])     | Access denied — someone other than the owner sent a message to the contract.                          |
| [133](https://docs.tact-lang.org/book/exit-codes/#133)     | Tact compiler ([Compute phase][c])     | Contract stopped. Reserved, but never thrown.                                                         |
| [134](https://docs.tact-lang.org/book/exit-codes/#134)     | Tact compiler ([Compute phase][c])     | Invalid argument.                                                                                     |
| [135](https://docs.tact-lang.org/book/exit-codes/#135)     | Tact compiler ([Compute phase][c])     | Code of a contract was not found.                                                                     |
| ~~[136](https://docs.tact-lang.org/book/exit-codes/#136)~~ | ~~Tact compiler ([Compute phase][c])~~ | ~~Invalid address.~~ Removed since Tact 1.6 (not released yet)                                        |
| ~~[137](https://docs.tact-lang.org/book/exit-codes/#137)~~ | ~~Tact compiler ([Compute phase][c])~~ | ~~Masterchain support is not enabled for this contract.~~ Removed since Tact 1.6 (not released yet)   |

:::note
The exit code 65535 (`0xffff`) typically indicates the same issue as [exit code 130](https://docs.tact-lang.org/book/exit-codes/#130) - an unrecognized message opcode. When developing contracts, code 65535 is assigned manually rather than being generated by [TVM][tvm] or the Tact compiler.
:::

[c]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#compute-phase
[a]: https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases

## Exit codes in Blueprint projects {#blueprint}

In [Blueprint][bp] tests, exit codes from the [compute phase](#compute) are specified in the `exitCode` field of the object argument for `toHaveTransaction()` method of `expect()` matcher. The field for the result codes (exit codes from the [action phase](#action)) in the same `toHaveTransaction()` method is called `actionResultCode`.

:::note
Read more about expecting specific exit codes: [Transactions with intentional errors](https://docs.tact-lang.org/book/debug#tests-errors).
:::

Additionally, one can take a look at the result of [sending a message to a contract](https://docs.tact-lang.org/book/debug#tests-send) and discover the phases of each transaction and their values, including exit (or result) codes for [compute phase](#compute) (or [action phase](#action)).

Note, that in order to do so, you'll have to do a couple of type checks before that:

```typescript
it('tests something, you name it', async () => {
  // Send a specific message to our contract and store the results
  const res = await your_contract_name.send(…);

  // Now, we have an access to array of executed transactions,
  // with the second one (index 1) being the one that we look for
  const tx = res.transactions[1]!;

  // To do something useful with it, let's ensure that its type is 'generic'
  // and that the compute phase in it wasn't skipped
  if (tx.description.type === "generic"
      && tx.description.computePhase.type === "vm") {
    // Finally, we're able to freely peek into the transaction for general details,
    // such as printing out the exit code of the compute phase if we so desire
    console.log(tx.description.computePhase.exitCode);
  }

  // ...
});
```

## Compute phase {#compute}

The [TVM][tvm] initialization and all computations occur during the [compute phase][c]. If this phase fails (resulting in an exit code other than 0 or 1), the transaction skips the [action phase](#action) and proceeds to generate bounce messages for transactions initiated by inbound messages.

## Action phase {#action}

The [action phase][a] is processed after the successful execution of the [compute phase](#compute). It attempts to perform the actions stored into the action list by [TVM][tvm] during the compute phase.

Some actions may fail during processing, in which case those actions may be skipped or the whole transaction may revert depending on the mode of actions. The code indicating the resulting state of the [action phase][a] is called a _result code_. Since it's also a 32-bit signed integer that essentially serves the same purpose as _exit code_ of [compute phase](#compute), it's common to call the result code an exit code too.

[p]: https://docs.tact-lang.org/book/types#primitive-types
[tvm]: https://docs.ton.org/learn/tvm-instructions/tvm-overview
[bp]: https://github.com/ton-org/blueprint
