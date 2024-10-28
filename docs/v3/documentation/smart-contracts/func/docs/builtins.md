# Built-ins
This section describes some language constructions which are less fundamental than the ones described in previous articles. They could be defined in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib) but it would leave less room for the FunC optimizer.

## Throwing exceptions
Exceptions can be thrown by conditional primitives `throw_if`, and `throw_unless`, and by unconditional `throw`. The first argument is the error code; the second is the condition (`throw` has only one argument). These primitives have parametrized versions `throw_arg_if`, `throw_arg_unless`, and `throw_arg`. The first argument is the exception parameter of any type; the second is the error code; the third is the condition (`throw_arg` has only two arguments).

## Booleans
- `true` is alias for `-1`
- `false` is alias for `0`

## Dump variable
A variable can be dumped to the debug log by the `~dump` function.

## Dump string
A string can be dumped to the debug log by the `~strdump` function.

## Integer operations
- `muldiv` is a multiple-then-divide operation. The intermediate result is stored in 513-bit integer, so it won't overflow if the actual result fits into a 257-bit integer.
- `divmod` is a operation that takes two numbers as parameters and gives the quotient and remainder of their division.

## Other primitives
- `null?` checks whether the argument is `null`. By the value `null` of a TVM type, `Null` FunC represents absence of a value of some atomic type; see [null values](/v3/documentation/smart-contracts/func/docs/types#null-values).
- `touch` and `~touch` move a variable to the top of the stack
- `at` gets the value of a tuple component on the specified position
