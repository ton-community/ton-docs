# Functions
FunC program is essentially a list of function declarations/definitions and global variable declarations. This section covers the first topic.

Any function declaration or definition starts with a common pattern and one of the three things goes next:
- single `;`, which means that the function is declared but not defined yet. It may be defined later in the same file or in some other file which is passed before the current one to the FunC compiler. For example,
  ```func
  int add(int x, int y);
  ```
  is a simple declaration of a function named `add` of type `(int, int) -> int`.
- assembler function body definition. It is the way to define functions by low-level TVM primitives for later use in FunC program. For example,
  ```func
  int add(int x, int y) asm "ADD";
  ```
  is an assembler definition of the same function `add` of type `(int, int) -> int` which will translate to the TVM opcode `ADD`.

- ordinary block statement function body definition. It is the usual way to define functions. For example,
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  is an ordinary definition of the `add` function.

## Function declaration
As said before, any function declaration or definition starts with a common pattern. The following is the pattern:
```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```
where `[ ... ]` corresponds to an optional entry.

### Function name
Function name can be any [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers) and also it can start with `.` or `~` symbols. The meaning of those symbols is [explained](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) in the statements section.

For example, `udict_add_builder?`, `dict_set` and `~dict_set` are valid and different function names. (They are defined in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib).)

#### Special function names
FunC (actually Fift assembler) has several reserved function names with predefined [ids](/v3/documentation/smart-contracts/func/docs/functions#method_id).
- `main` and `recv_internal` have id = 0
- `recv_external` has id = -1
- `run_ticktock` has id = -2

Every program must have a function with id 0, that is, `main` or `recv_internal` function.
`run_ticktock` is called in ticktock transactions of special smart contracts.

#### Receive internal

`recv_internal` is called when a smart contract receives an inbound internal message.
There are some variables at the stack when [TVM initiates](/v3/documentation/tvm/tvm-overview#initialization-of-tvm), by setting arguments in `recv_internal` we give smart-contract code awareness about some of them. Those arguments about which code will not know, will just lie at the bottom of the stack never touched. 

So each of the following `recv_internal` declarations is correct, but those with less variables will spend slightly less gas (each unused argument adds additional `DROP` instructions)

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```




#### Receive external

`recv_external` is for inbound external messages.

### Return type
Return type can be any atomic or composite type as described in the [types](/v3/documentation/smart-contracts/func/docs/types) section. For example,
```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```
are valid function declarations.

Type inference is also allowed. For example,
```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```
is a valid definition of function `pyth` of type `(int, int) -> (int, int, int)`, which computes Pythagorean triples.

### Function arguments
Function arguments are separated by commas. The valid declarations of an argument are following:
- Ordinary declaration: type + name. For example, `int x` is a declaration of argument of type `int` and name `x` in the function declaration `() foo(int x);`
- Unused argument declaration: only type. For example,
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  is a valid function definition of type `(int, int) -> int`
- Argument with an inferred type declaration: only name.
  For example,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  is a valid function definition of type `int -> int`. The `int` type of `x` is inferred by the type-checker.

Note that although a function may look like a function of several arguments, it's actually a function of one [tensor-type](/v3/documentation/smart-contracts/func/docs/types#tensor-types) argument. To see the difference, please refer to [function application](/v3/documentation/smart-contracts/func/docs/statements#function-application). Nevertheless, the components of the argument tensor are conventionally called function arguments.

### Function calls

#### Non-modifying methods

:::info
Non-modifying function supports short function call form with `.`
:::

```func
example(a);
a.example();
```

If a function has at least one argument, it can be called as a non-modifying method. For example, `store_uint` has type `(builder, int, int) -> builder` (the second argument is the value to store, and the third is the bit length). `begin_cell` is a function that creates a new builder. The following codes are equivalent:
```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```
So the first argument of a function can be passed to it being located before the function name, if separated by `.`. The code can be further simplified:
```func
builder b = begin_cell().store_uint(239, 8);
```
Multiple calls of methods are also possible:
```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```


#### Modifying functions
:::info
Modifying function supports short form with `~` and `.` operators.
:::

If the first argument of a function has type `A` and the return value of the function has the shape of `(A, B)` where `B` is some arbitrary type, then the function can be called as a modifying method.

Modifying function calls may take some arguments and return some values, but they modify their first argument, that is, assign the first component of the returned value to the variable from the first argument. 
```func
a~example();
a = example(a);
```


For example, suppose `cs` is a cell slice and `load_uint` has type `(slice, int) -> (slice, int)`: it takes a cell slice and number of bits to load and returns the remainder of the slice and the loaded value. The following codes are equivalent:
```func
(cs, int x) = load_uint(cs, 8);
```
```func
(cs, int x) = cs.load_uint(8);
```
```func
int x = cs~load_uint(8);
```
In some cases, we want to use a function as a modifying method that doesn't return any value and only modifies the first argument. It can be done using unit types as follows: Suppose we want to define function `inc` of type `int -> int`, which increments an integer, and use it as a modifying method. Then we should define `inc` as a function of type `int -> (int, ())`:
```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```
When defined like that, it can be used as a modifying method. The following will increment `x`.
```func
x~inc();
```

#### `.` and `~` in function names
Suppose we want to use `inc` as a non-modifying method too. We can write something like this:
```func
(int y, _) = inc(x);
```
However, it is possible to override the definition of `inc` by using a modifying method.
```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
And then call it like that:
```func
x~inc();
int y = inc(x);
int z = x.inc();
```
The first call will modify x; the second and third won't.

In summary, when a function with the name `foo` is called as a non-modifying or modifying method (i.e., with `.foo` or `~foo` syntax), the FunC compiler uses the definition of `.foo` or `~foo` correspondingly if such a definition is presented, and if not, it uses the definition of `foo`.



### Specifiers
There are three types of specifiers: `impure`, `inline`/`inline_ref`, and `method_id`. One, several, or none of them can be put in a function declaration, but currently, they must be presented in the right order. For example, it is not allowed to put `impure` after `inline`.
#### Impure specifier
`impure` specifier means that the function can have some side effects which can't be ignored. For example, we should put `impure` specifier if the function can modify contract storage, send messages, or throw an exception when some data is invalid and the function is intended to validate this data.

If `impure` is not specified and the result of the function call is not used, then the FunC compiler may and will delete this function call.

For example, in the [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib) function
```func
int random() impure asm "RANDU256";
```
is defined. `impure` is used because `RANDU256` changes the internal state of the random number generator.

#### Inline specifier
If a function has `inline` specifier, its code is actually substituted in every place where the function is called. It goes without saying that recursive calls to inlined functions are not possible.

For example,

```func
(int) add(int a, int b) inline {
    return a + b;
}
```

as the `add` function is marked with the `inline` specifier. The compiler will try to replace calls to `add` with the actual code `a + b`, avoiding the function call overhead.

Here is another example of how you can use inline, taken from [ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16):

```func
() save_data(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) impure inline {
  set_data(begin_cell()
            .store_coins(total_supply)
            .store_slice(admin_address)
            .store_ref(content)
            .store_ref(jetton_wallet_code)
           .end_cell()
          );
}
```



#### Inline_ref specifier
The code of a function with the `inline_ref` specifier is put into a separate cell, and every time when the function is called, a `CALLREF` command is executed by TVM. So it's similar to `inline`, but because a cell can be reused in several places without duplicating it, it is almost always more efficient in terms of code size to use `inline_ref` specifier instead of `inline` unless the function is called exactly once. Recursive calls of `inline_ref`'ed functions are still impossible because there are no cyclic references in the TVM cells.
#### method_id
Every function in a TVM program has an internal integer ID by which it can be called. Ordinary functions are usually numbered by subsequent integers starting from 1, but get-methods of the contract are numbered by crc16 hashes of their names. `method_id(<some_number>)` specifier allows to set the id of a function to specified value, and `method_id` uses the default value `(crc16(<function_name>) & 0xffff) | 0x10000`. If a function has `method_id` specifier, then it can be called in lite-client or ton-explorer as a get-method by its name.

For example:
```func
int get_counter() method_id {
  load_data();
  return ctx_counter;
}
```

### Polymorphism with forall
Before any function declaration or definition, there can be `forall` type variables declarator. It has the following syntax:
```func
forall <comma_separated_type_variables_names> ->
```
where type variable name can be any [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers). Usually, they are named with capital letters.

For example,
```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```
is a function that takes a tuple of length exactly 2, but with values of any (single stack entry) types in components, and swaps them with each other.

`pair_swap([2, 3])` will produce `[3, 2]` and `pair_swap([1, [2, 3, 4]])` will produce `[[2, 3, 4], 1]`.

In this example, `X` and `Y` are [type variables](/v3/documentation/smart-contracts/func/docs/types#polymorphism-with-type-variables). When the function is called, type variables are substituted with actual types, and the code of the function is executed. Note that although the function is polymorphic, the actual assembler code for it is the same for every type substitution. It is achieved essentially by the polymorphism of stack manipulation primitives. Currently, other forms of polymorphism (like ad-hoc polymorphism with type classes) are not supported.

Also, it is worth noticing that the type width of `X` and `Y` is supposed to be equal to 1; that is, the values of `X` or `Y` must occupy a single stack entry. So you actually can't call the function `pair_swap` on a tuple of type `[(int, int), int]`, because type `(int, int)` has width 2, i.e., it occupies 2 stack entries.



## Assembler function body definition
As mentioned above, a function can be defined by the assembler code. The syntax is an `asm` keyword followed by one or several assembler commands, represented as strings.
For example, one can define:
```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```
– a function that increments an integer and then negates it. Calls to this function will be translated to 2 assembler commands `INC` and `NEGATE`. An alternative way to define the function is:
```func
int inc_then_negate'(int x) asm "INC NEGATE";
```
`INC NEGATE` will be considered by FunC as one assembler command, but it is OK, because Fift assembler knows that it is 2 separate commands.

:::info
The list of assembler commands can be found here: [TVM instructions](/v3/documentation/tvm/instructions).
:::

### Rearranging stack entries
In some cases, we want to pass arguments to the assembler function in a different order than the assembler command requires, or/and take the result in a different stack entry order than the command returns. We could manually rearrange the stack by adding corresponding stack primitives, but FunC can do it automatically.

:::info
Note, that in case of manual rearranging, arguments will be computed in the rearranged order. To overwrite this behavior use `#pragma compute-asm-ltr`: [compute-asm-ltr](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

For example, suppose that the assembler command STUXQ takes an integer, builder, and integer; then it returns the builder, along with the integer flag, indicating the success or failure of the operation.
We may define the function:
```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```
However, suppose we want to rearrange arguments. Then we can define:
```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```
So you can indicate the required order of arguments after the `asm` keyword.

Also, we can rearrange return values like this:
```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```
The numbers correspond to the indexes of returned values (0 is the deepest stack entry among returned values).

Combining these techniques is also possible.
```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Multiline asms
Multiline assembler commands or even Fift-code snippets can be defined via multiline strings which start and end with `"""`.

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```
