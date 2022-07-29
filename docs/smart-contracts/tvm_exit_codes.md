TVM may exit with arbitrary 16-bit unsigned integer `exit_code`. `exit_code` higher than 1 are considered as _error codes_, thus exit with such code may cause transaction revert/bounce.

# Standard exit codes
* `0` - standard successful execution exit code
* `1` - alternative successful execution exit code
* `2` - stack underflow. Last op-code consume more elements than there are on stacks. <sup>1</sup>
* `3` - stack overflow. More values have been stored on a stack than
allowed by this version of TVM
* `4` - integer overflow. Integer does not fit into −2<sup>256</sup> ≤ x < 2<sup>256</sup> or a division by zero has occurred
* `5` - integer out of expected range.
* `6` - Invalid opcode. Instruction in unknown to current TVM version
* `7` - Type check error. An argument to a primitive is of incorrect value type. <sup>1</sup>
* `8` - Cell overflow. Writing to builder is not possible since after operation there would be more than 1023 bits or 4 references.
* `9` - Cell underflow. Read from slice primitive tried to read more bits or references than there are.
* `10` - Dictionary error. Error during manipulation with dictionary (hashmaps).
* `13` - Out of gas error. Thrown by TVM when the remaining gas becomes negative.
* `32` - Action list is invalid. Set during action phase if c5 register after execution contains unparsable object.
* `32` (the same as prev) - Method id not found. Returned by tonlib during attempt to execute non-existed get method.
* `34` - Action is invalid or not supported. Set during action phase if current action can not be applied.
* `37` - Not enough TONs. Message sends too much TON (or there is no enough TONs after deducting fees).
* `38` - Not enough extra-currencies.

<sup>1</sup> If you encounter such exception in _func_ contract it most probably means a type error in `asm` declarations.


