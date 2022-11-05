# Built-ins
This section describes some language constructions which are less fundamental than the ones described in previous articles. They could be defined in [stdlib.fc](/develop/func/stdlib) but it would leave less room for the FunC optimizer.

## Throwing exceptions
Exceptions can be thrown by conditional primitives `throw_if`, and `throw_unless`, and by unconditional `throw`. The first argument is the error code; the second is the condition (`throw` has only one argument).

Currently, FunC doesn't support catching exceptions unless an exception handler is set with low-level TVM primitives. The primary purpose of the described primitives is to reverse transactions that don't satisfy some mandatory conditions (like `require` and `revert` in Solidity programming language).

## Booleans
- `true` is alias for `-1`
- `false` is alias for `0`

## Dump variable
A variable can be dumped to the debug log by the `~dump` function.

## Integer operations
- `muldiv` is a multiple-then-divide operation. The intermediate result is stored in 513-bit integer, so it won't overflow if the actual result fits into a 257-bit integer.

## Other primitives
- `null?` checks whether the argument is `null`. By the value `null` of a TVM type, `Null` FunC represents absence of a value of some atomic type; see [null values](/develop/func/types#null-values).
- `touch` and `~touch` move a variable to the top of the stack
- `at` gets the value of a tuple component on the specified position
