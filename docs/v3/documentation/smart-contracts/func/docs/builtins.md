import Feedback from '@site/src/components/Feedback';

# Built-ins

This section covers extra language constructs that are not part of the core but are still important for functionality. 
Although they could be implemented in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib/),
keeping them as built-in features allows the FunC optimizer to work more efficiently.

## Throwing exceptions

FunC provides several built-in primitives for throwing exceptions:
- **Conditional exceptions:** `throw_if` and `throw_unless`
- **Unconditional exception:** `throw`

In `throw_if` and `throw_unless`, the first argument (the error code) defines the exception type,
while the second argument (the condition) determines whether the exception is thrown.
Meanwhile, the `throw` function takes only one argument—the error code—since it always triggers an exception.

FunC also includes parameterized versions of these primitives:
- **Conditional exceptions with parameters:** `throw_arg_if` and `throw_arg_unless`
- **Unconditional exception with a parameter:** `throw_arg`

In these versions, the first argument is an exception parameter of any type, the second defines the error code, and the third argument—used when needed—is a condition that determines whether the exception is thrown.

## Booleans
- `true` is an alias for `-1`. 
- `false` is an alias for `0`.

## Dumping a variable
Use the `~dump` function to output a variable to the debug log.

## Dumping a string
Use the `~strdump` function to output a string to the debug log.

## Integer operations
- `muldiv` performs a multiply-then-divide operation. 
It uses a 513-bit intermediate result to prevent overflow if the final result fits within 257 bits.
- `divmod` takes two numbers as input and returns the quotient and remainder of their division.


## Other primitives
- `null?` checks if the given argument is `null`. In FunC, the value `null` belongs to the TVM type `Null`, which represents the absence of a value for certain atomic types. See [null values](/v3/documentation/smart-contracts/func/docs/types#null-values) for details.
- `touch` and `~touch` push a variable to the top of the stack.
- `at` returns the value of a tuple element at the specified position.
<Feedback />

