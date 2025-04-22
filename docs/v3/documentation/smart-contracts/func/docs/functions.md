import Feedback from '@site/src/components/Feedback';

# Functions
A FunC program is a list of function declarations, function definitions, and global variable declarations. This section focuses on function declarations and definitions.

Every function declaration or definition follows a common pattern, after which one of three elements appears:

- A single semicolon `;` indicates that the function is declared but not yet defined. Its definition must appear later in the same file or a different file processed before the current one by the FunC compiler. For example:
  ```func
  int add(int x, int y);
  ```
  This declares a function named `add` with the type `(int, int) → int` but does not define it.

- An assembler function body definition defines the function using low-level TVM primitives for use in a FunC program. For example:
  ```func
  int add(int x, int y) asm "ADD";
  ```
  This defines the function `add` using the TVM opcode `ADD`, keeping its type as `(int, int) → int`.

- A standard function body uses a block statement, the most common way to define functions. For example:
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  This is a standard definition of the `add` function.

## Function declaration
As mentioned earlier, every function declaration or definition follows a common pattern. The general form is:
```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```
where `[ ... ]` represents an optional entry.

### Function name

A function name can be any valid [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers). Additionally, it may start with the symbols `.` or `~`, which have specific meanings explained in the [Statements](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) section.

For example, `udict_add_builder?`, `dict_set`, and `~dict_set` are all valid function names, and each is distinct. These functions are defined in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib).

#### Special function names
FunC (specifically, the Fift assembler) reserves several function names with predefined [IDs](/v3/documentation/smart-contracts/func/docs/functions#method_id):

- `main` and `recv_internal` have `id = 0`
- `recv_external` has `id = -1`
- `run_ticktock` has `id = -2`

Every program must include a function with `id = 0`, meaning it must define either `main` or `recv_internal`.The `run_ticktock` function is used in ticktock transactions of special smart contracts.

#### Receive internal

The `recv_internal` function is invoked when a smart contract receives **an inbound internal message**. When the [TVM initializes](/v3/documentation/tvm/tvm-overview#initialization-of-tvm), certain variables are automatically placed on the stack. By specifying arguments in `recv_internal`, the smart contract can access some of these values. Any values not explicitly referenced in the function parameters will remain unused at the bottom of the stack.

The following `recv_internal` function declarations are all valid. Functions with fewer parameters consume slightly less gas, as each unused argument results in an additional `DROP` instruction:

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### Receive external
The `recv_external` function handles **inbound external messages**.

### Return type

The return type can be any atomic or composite type, as described in the [Types](/v3/documentation/smart-contracts/func/docs/types) section. For example, the following function declarations are valid:
```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int → int) foo'''();
() foo''''();
```

FunC also supports **type inference**. For example:
```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```
This is a valid definition of the function `pyth`, which has the inferred type `(int, int) → (int, int, int)`. 
It computes Pythagorean triples based on the given input values.

### Function arguments

In function arguments, commas separate it. The following types of argument declarations are valid:

- Ordinary declaration: an argument is declared using **its type** followed by **its name**. Example: `int x` declares an argument named `x` of type `int` in the function declaration: `() foo(int x);`.

- Unused argument declaration: only its type needs to be specified. Example:
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  This is a valid function definition of type `(int, int) → int`. 


- Argument with inferred type declaration: If an argument's type is not explicitly declared, it is inferred by the type-checker.
  For example,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  This defines a function `inc` with the inferred type `int → int`, meaning `x` is automatically recognized as an `int`.


**Argument tensor representation**

Even though a function may appear to take multiple arguments, it takes a single [tensor-type](/v3/documentation/smart-contracts/func/docs/types#tensor-types) argument. For more details on this distinction, refer to the [Function application](/v3/documentation/smart-contracts/func/docs/statements#function-application) section. 
However, for convenience, the individual components of this tensor are conventionally referred to as "function arguments."

### Function calls

#### Non-modifying methods

:::info
A non-modifying function supports a shorthand method call syntax using `.`
:::

```func
example(a);
a.example();
```

A function with at least **one argument**, it can be called a **non-modifying method**. For example, the function `store_uint` has the type `(builder, int, int) → builder`, where:
- The second argument is the value to store.
- The third argument is the bit length.

The function `begin_cell` creates a new `builder`. The following two code snippets are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```
```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```
So the first argument of a function can be passed to it being located before the function name, if separated by `.`. The code can be further simplified:

The function's first argument is passed before the function name, separated by `.`. The syntax can be further condensed into a single statement:

```func
builder b = begin_cell().store_uint(239, 8);
```

It is also possible to chain multiple method calls:
```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### Modifying functions
:::info
A modifying function supports a short form using the `~` and `.` operators.
:::


If:
- The first argument of a function has type `A`.
- The function's return type is `(A, B)`, where `B` is any arbitrary type.

Then, the function can be called a modifying method.

Modifying functions change their first argument. They assign the first component of the returned value to the variable initially passed as the first argument.
The following calls are equivalent:

```func
a~example(); ;;Modifying method syntax
a = example(a); ;;Standard function call
```

**Example:** `load_uint`

Suppose `cs` is a cell slice, and `load_uint` has type `(slice, int) → (slice, int)`. It means:
- `load_uint` takes a cell slice and several bits to load.
- It returns the remaining slice and the loaded value.

The following calls are equivalent:

```func
(cs, int x) = load_uint(cs, 8); ;; Standard function call
```
```func
(cs, int x) = cs.load_uint(8); ;; Method call syntax
```
```func
int x = cs~load_uint(8); ;; Modifying method syntax
```

**Modifying methods with no return value**

Sometimes, a function only modifies its first argument without returning a meaningful value. To enable modifying method syntax, such functions should return a unit type () as the second component.

For example, suppose we want to define a function `inc` of type `int → int`, which increments an integer. To use it as a modifying method, we define it as follows:

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

Now, the function can be used in modifying method syntax:

```func
x~inc(); ;;Equivalent to x = inc(x);
```
This will increment `x` in place.

#### `.` and `~` in function names

Suppose we want to use `inc` as a non-modifying method. We can write:

```func
(int y, _) = inc(x);
```

However, we can also define `inc` as a modifying method:

```func
int inc(int x) {
  return x + 1;
}
(int, ()) ~inc(int x) {
  return (x + 1, ());
}
```
Now, we can call it in different ways:
```func
x~inc(); ;; Modifies x
int y = inc(x); ;; Doesn't modify x
int z = x.inc(); ;; Also doesn't modify x
```
**How FunC resolves function calls**
- If a function is called with `.` (e.g., `x.foo()`), the compiler looks for a `.foo` definition.
- If a function is called with `~` (e.g., `x~foo()`), the compiler looks for a `~foo` definition.
- If neither `.foo` nor `~foo` is defined, the compiler falls back to the regular `foo` definition.


### Specifiers

In FunC, function specifiers modify the behavior of functions. There are three types:
1. `impure`
2. `inline`/ `inline_ref`
3. `method_id`

One, multiple, or none can be used in a function declaration. However, they must appear in a specific order (e.g., `impure` must come before `inline`).


#### Impure specifier

The `impure` specifier indicates that a function has side effects, such as modifying contract storage, sending messages, or throwing exceptions.
If a function is not marked as `impure` and its result is unused, the FunC compiler may delete the function call for optimization.

For example, in the [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib) function:

```func
int random() impure asm "RANDU256";
```
Here, `RANDU256` changes the internal state of the random number generator. The `impure` keyword prevents the compiler from removing this function call.


#### Inline specifier

A function marked as `inline` is directly substituted into the code wherever it is called.
Recursive calls are not allowed for inline functions.

**Example**

```func
(int) add(int a, int b) inline {
    return a + b;
}
```
Since the `add` function is marked with the `inline` specifier, the compiler substitutes `add(a, b)` with `a + b` directly in the code, eliminating the function call overhead.


Another example of using `inline` from [ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16):

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
When a function is marked with the `inline_ref` specifier, its code is stored in a separate cell. Each time the function is called, TVM executes a `CALLREF` command. This works similarly to `inline`, but with a key difference—since the same cell can be reused multiple times without duplication, `inline_ref` is generally more efficient regarding code size. The only case where `inline` might be preferable is if the function is called just once. However, recursive calls to `inline_ref` functions remain impossible, as TVM cells do not support cyclic references.


#### method_id

In a TVM program, every function has an internal integer ID that determines how it can be called. By default, ordinary functions are assigned sequential numbers starting from `1`, while contract get-methods use `crc16` hashes of their names.
The `method_id(<some_number>)` specifier allows you to set a function’s ID to a specific value manually. If no ID is specified, the default is calculated as `(crc16(<function_name>) & 0xffff) | 0x10000`. If a function has the `method_id` specifier, it can be invoked by its name as a get-method in lite client or TON explorer.

**Example**
```func
int get_counter() method_id {
  load_data();
  return ctx_counter;
}
```

### Polymorphism with forall
Before any function declaration or definition, there can be `forall` type variables declarator. It has the following syntax:

A function definition can include a `forall` type variable declaration before its declaration or implementation. The syntax is:

```func
forall <comma_separated_type_variables_names> ->
```

Here, type variable names can be any [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers) but are typically written in capital letters.

For example,
```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```


This function takes a tuple of exactly two elements, where each component can be of any type that fits in a single stack entry. It swaps the two values. For instance:
- `pair_swap([2, 3])` returns `[3, 2]`;
- `pair_swap([1, [2, 3, 4]])` returns `[[2, 3, 4], 1]`.

In this example, `X` and `Y` are [type variables](/v3/documentation/smart-contracts/func/docs/types#polymorphism-with-type-variables). When the function is called, these variables are replaced with actual types, and the function executes accordingly. Even though the function is polymorphic, the compiled assembly code remains the same for any type substitution. This is possible due to the polymorphic nature of stack manipulation operations. However, other forms of polymorphism, such as `ad-hoc` polymorphism with type classes, are not currently supported.

It is important to note that `X` and `Y` must each have a type width of 1, meaning they should fit within a single stack entry. This means you can't use `pair_swap` on a tuple like `[(int, int), int]` because type `(int, int)` has a width of 2, taking up two stack entries instead of one.


## Assembler function body definition

In FunC, functions can be defined directly using assembler code. This is done using the `asm` keyword, followed by one or more assembler commands written as strings.
For example, the following function increments an integer and then negates it:

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```
– a function that increments an integer and then negates it. Calls to this function will be translated to 2 assembler commands `INC` and `NEGATE`. An alternative way to define the function is:

When called, this function is directly translated into the two assembler commands, `INC` and `NEGATE`.
Alternatively, the function can be written as:

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```
Here, `INC NEGATE` is treated as a single assembler command by FunC, but the Fift assembler correctly interprets it as two separate commands.

:::info
The list of assembler commands can be found here: [TVM instructions](/v3/documentation/tvm/instructions).
:::

### Rearranging stack entries
Sometimes, the order in which function arguments are passed may not match the expected order of an assembler command. Similarly, the returned values may need to be arranged differently. While this can be done manually using stack manipulation primitives, FunC automatically handles it.

:::info
When manually rearranging arguments, they are computed in the new order. To overwrite this behavior use `#pragma compute-asm-ltr`: [compute-asm-ltr](/v3/documentation/smart-contracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

For instance, the assembler command `STUXQ` takes an integer, a builder, and another integer as input. It then returns the builder and an integer flag indicating whether the operation succeeded. We can define the corresponding function as follows:

```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```
However, if we need to rearrange the order of arguments, we can specify them explicitly in the `asm` declaration:

```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```
So you can indicate the required order of arguments after the `asm` keyword.

This allows us to control the order in which arguments are passed to the assembler command.

Similarly, we can rearrange return values using the following notation:

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```



Here, the numbers indicate the order of return values, where `0` represents the deepest stack entry.

Additionally, we can combine these techniques:
```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### Multiline asms
Multiline assembler commands, including Fift code snippets, can be defined using triple-quoted strings `"""`.

```func
slice hello_world() asm """
  "Hello"
  " "
  "World"
  $+ $+ $>s
  PUSHSLICE
""";
```

<Feedback />

