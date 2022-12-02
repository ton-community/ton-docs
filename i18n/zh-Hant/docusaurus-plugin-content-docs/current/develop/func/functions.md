# Functions
FunC program is essentially a list of function declarations/definitions and global variable declarations. This section covers the first topic.

Any function declaration or definition starts with a common pattern and one of the three things goes next:
- single `;`, which means that the function is declared but not defined yet. It may be defined later in the same file or in some other file which is passed before the current one to the FunC compiler. For example,
  ```cpp
  int add(int x, int y);
  ```
  is a simple declaration of a function named `add` of type `(int, int) -> int`.
- assembler function body definition. It is the way to define functions by low-level TVM primitives for later use in FunC program. For example,
  ```cpp
  int add(int x, int y) asm "ADD";
  ```
  is an assembler definition of the same function `add` of type `(int, int) -> int` which will translate to the TVM opcode `ADD`.

- ordinary block statement function body definition. It is the usual way to define functions. For example,
  ```cpp
  int add(int x, int y) {
    return x + y;
  }
  ```
  is an ordinary definition of the `add` function.

## Function declaration
As said before, any function declaration or definition starts with a common pattern. The following is the pattern:
```cpp
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```
where `[ ... ]` corresponds to an optional entry.

### Function name
Function name can be any [identifier](/develop/func/literals_identifiers#identifiers) and also it can start with `.` or `~` symbols. The meaning of those symbols is [explained](/develop/func/statements#methods-calls) in the statements section.

For example, `udict_add_builder?`, `dict_set` and `~dict_set` are valid and different function names. (They are defined in [stdlib.fc](/develop/func/stdlib).)

#### Special function names
FunC (actually Fift assembler) has several reserved function names with predefined [ids](/develop/func/functions#method_id).
- `main` and `recv_internal` have id = 0
- `recv_external` has id = -1
- `run_ticktock` has id = -2

Every program must have a function with id 0, that is, `main` or `recv_internal` function.

`recv_internal` is called when a smart contract receives an inbound internal message; `recv_external` is for inbound external messages; `run_ticktock` is called in ticktock transactions of special smart contracts.


### Return type
Return type can be any atomic or composite type as described in the [types](/develop/func/types.md) section. For example,
```cpp
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```
are valid function declarations.

Type inference is also allowed. For example,
```cpp
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```
is a valid definition of function `pyth` of type `(int, int) -> (int, int, int)`, which computes Pythagorean triples.

### Function arguments
Function arguments are separated by commas. The valid declarations of an argument are following:
- Ordinary declaration: type + name. For example, `int x` is a declaration of argument of type `int` and name `x` in the function declaration `() foo(int x);`
- Unused argument declaration: only type. For example,
  ```cpp
  int first(int x, int) {
    return x;
  }
  ```
  is a valid function definition of type `(int, int) -> int`
- Argument with an inferred type declaration: only name.
  For example,
  ```cpp
  int inc(x) {
    return x + 1;
  }
  ```
  is a valid function definition of type `int -> int`. The `int` type of `x` is inferred by the type-checker.

Note that although a function may look like a function of several arguments, it's actually a function of one [tensor-type](/develop/func/types#tensor-types) argument. To see the difference, please refer to [function application](/develop/func/statements#function-application). Nevertheless, the components of the argument tensor are conventionally called function arguments.

### Specifiers
There are three types of specifiers: `impure`, `inline`/`inline_ref`, and `method_id`. One, several, or none of them can be put in a function declaration but currently they must be presented in the right order. For example, it is not allowed to put `impure` after `inline`.
#### Impure specifier
`impure` specifier means that the function can have some side effects which can't be ignored. For example, we should put `impure` specifier if the function can modify contract storage, send messages, or throw an exception when some data is invalid and the function is intended to validate this data.

If `impure` is not specified and the result of the function call is not used, then the FunC compiler may and will delete this function call.

For example, in the [stdlib.fc](/develop/func/stdlib) function
```cpp
int random() impure asm "RANDU256";
```
is defined. `impure` is used because `RANDU256` changes the internal state of the random number generator.

#### Inline specifier
If a function has `inline` specifier, its code is actually substituted in every place where the function is called. It goes without saying that recursive calls to inlined functions are not possible.
#### Inline_ref specifier
The code of a function with the `inline_ref` specifier is put into a separate cell, and every time when the function is called, a `CALLREF` command is executed by TVM. So it's similar to `inline`, but because a cell can be reused in several places without duplicating it, it is almost always more efficient in terms of code size to use `inline_ref` specifier instead of `inline` unless the function is called exactly once. Recursive calls of `inline_ref`'ed functions are still impossible because there are no cyclic references in the TVM cells.
#### method_id
Every function in TVM program has an internal integer id by which it can be called. Ordinary functions are usually numbered by subsequent integers starting from 1, but get-methods of the contract are numbered by crc16 hashes of their names. `method_id(<some_number>)` specifier allows to set the id of a function to specified value, and `method_id` uses the default value `(crc16(<function_name>) & 0xffff) | 0x10000`. If a function has `method_id` specifier, then it can be called in lite-client or ton-explorer as a get-method by its name.

For example,
```cpp
(int, int) get_n_k() method_id {
  (_, int n, int k, _, _, _, _) = unpack_state();
  return (n, k);
}
```
is a get-method of multisig contract.

### Polymorphism with forall
Before any function declaration or definition, there can be `forall` type variables declarator. It has the following syntax:
```cpp
forall <comma_separated_type_variables_names> ->
```
where type variable name can be any [identifier](/develop/func/literals_identifiers#identifiers). Usually, they are named with capital letters.

For example,
```cpp
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```
is a function that takes a tuple of length exactly 2, but with values of any (single stack entry) types in components, and swaps them with each other.

`pair_swap([2, 3])` will produce `[3, 2]` and `pair_swap([1, [2, 3, 4]])` will produce `[[2, 3, 4], 1]`.

In this example `X` and `Y` are [type variables](/develop/func/types#polymorphism-with-type-variables). When the function is called, type variables are substituted with actual types, and the code of the function is executed. Note that although the function is polymorphic, the actual assembler code for it is the same for every type substitution. It is achieved essentially by the polymorphism of stack manipulation primitives. Currently, other forms of polymorphism (like ad-hoc polymorphism with type classes) are not supported.

Also, it is worth noticing that the type width of `X` and `Y` is supposed to be equal to 1; that is, the values of `X` or `Y` must occupy a single stack entry. So you actually can't call the function `pair_swap` on a tuple of type `[(int, int), int]`, because type `(int, int)` has width 2, i.e., it occupies 2 stack entries.

## Assembler function body definition
As mentioned above, a function can be defined by the assembler code. The syntax is an `asm` keyword followed by one or several assembler commands, represented as strings.
For example, one can define:
```cpp
int inc_then_negate(int x) asm "INC" "NEGATE";
```
– a function that increments an integer and then negates it. Calls to this function will be translated to 2 assembler commands `INC` and `NEGATE`. Alternative way to define the function is:
```cpp
int inc_then_negate'(int x) asm "INC NEGATE";
```
`INC NEGATE` will be considered by FunC as one assembler command, but it is OK, because Fift assembler knows that it is 2 separate commands.

:::info
The list of assembler commands can be found here: [TVM instructions](/learn/tvm-instructions/instructions).
:::

### Rearranging stack entries
In some cases, we want to pass arguments to the assembler function in a different order than the assembler command requires, or/and take the result in a different stack entry order than the command returns. We could manually rearrange the stack by adding corresponding stack primitives, but FunC can do it automatically.

For example, suppose that the assembler command STUXQ takes an integer, builder, and integer; then it returns the builder, along with the integer flag, indicating the success or failure of the operation.
We may define the function:
```cpp
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```
However, suppose we want to rearrange arguments. Then we can define:
```cpp
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```
So you can indicate the required order of arguments after the `asm` keyword.

Also, we can rearrange return values like this:
```cpp
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```
The numbers correspond to the indexes of returned values (0 is the deepest stack entry among returned values).

Combining this techniques is also possible.
```cpp
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Multiline asms
Multiline assembler command or even Fift-code snippets can be defined via multiline strings which starts and ends with `"""`.

```cpp
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```
