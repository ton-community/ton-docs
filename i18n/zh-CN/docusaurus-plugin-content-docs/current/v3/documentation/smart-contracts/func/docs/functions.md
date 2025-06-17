import Feedback from '@site/src/components/Feedback';

# 函数

FunC 程序本质上是一系列函数声明/定义和全局变量声明。本节涵盖了第一个主题。 This section focuses on function declarations and definitions.

任何函数声明或定义都以一个共同的模式开始，接下来有三种情况之一：

- A single semicolon `;` indicates that the function is declared but not yet defined. Its definition must appear later in the same file or a different file processed before the current one by the FunC compiler. For example:
  ```func
  int add(int x, int y);
  ```
  是一个名为 `add` 类型为 `(int, int) -> int` 的函数的简单声明。

- 汇编函数体定义。这是通过低层级 TVM 原语定义函数以便在 FunC 程序中后续使用的方法。例如， For example:
  ```func
  int add(int x, int y) asm "ADD";
  ```
  是同一个 `add` 函数的汇编定义，类型为 `(int, int) -> int`，将转换为 TVM 操作码 `ADD`。

- 常规块语句函数体定义。这是定义函数的常用方式。例如， For example:
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  是 `add` 函数的常规定义。

## 函数声明

如前所述，任何函数声明或定义都以一个共同的模式开始。以下是该模式： The general form is:

```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```

其中 `[ ... ]` 对应于可选条目。

### 函数名

A function name can be any valid [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers). Additionally, it may start with the symbols `.` or `~`, which have specific meanings explained in the [Statements](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) section.

For example, `udict_add_builder?`, `dict_set`, and `~dict_set` are all valid function names, and each is distinct. These functions are defined in [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib).

#### 特殊函数名

FunC（实际上是 Fift 汇编器）有几个预定义的保留函数名，具有预定义的[id](/develop/func/functions#method_id)。

- `main` 和 `recv_internal` 的 id 为 0
- `recv_external` 的 id 为 -1
- `run_ticktock` 的 id 为 -2

每个程序必须有一个 id 为 0 的函数，即 `main` 或 `recv_internal` 函数。
`run_ticktock` 在特殊智能合约的 ticktock 交易中被调用。

#### 接收内部消息

The `recv_internal` function is invoked when a smart contract receives **an inbound internal message**. When the [TVM initializes](/v3/documentation/tvm/tvm-overview#initialization-of-tvm), certain variables are automatically placed on the stack. By specifying arguments in `recv_internal`, the smart contract can access some of these values. Any values not explicitly referenced in the function parameters will remain unused at the bottom of the stack.

The following `recv_internal` function declarations are all valid. 因此，以下每个 `recv_internal` 声明都是正确的，但具有较少变量的声明将稍微节省一些gas（每个未使用的参数都会增加额外的 `DROP` 指令）

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### 接收外部消息

`recv_external` 用于入站外部消息。

### 返回类型

返回类型可以是[类型](/develop/func/types.md)部分中描述的任何原子或复合类型。例如， For example, the following function declarations are valid:

```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```

FunC also supports **type inference**. For example:

```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```

是 `pyth` 函数的有效定义，类型为 `(int, int) -> (int, int, int)`，用于计算勾股数。
It computes Pythagorean triples based on the given input values.

### 函数参数

In function arguments, commas separate it. The following types of argument declarations are valid:

- Ordinary declaration: an argument is declared using **its type** followed by **its name**. 普通声明：类型 + 名称。例如，`int x` 是函数声明 `() foo(int x);` 中类型为 `int`、名称为 `x` 的参数声明。

- 未使用的参数声明：只有类型。例如， Example:
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  是类型为 `(int, int) -> int` 的有效函数定义。

- Argument with inferred type declaration: If an argument's type is not explicitly declared, it is inferred by the type-checker.
  For example,
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  是类型为 `int -> int` 的有效函数定义。`x` 的 `int` 类型由类型检查器推断。

**Argument tensor representation**

Even though a function may appear to take multiple arguments, it takes a single [tensor-type](/v3/documentation/smart-contracts/func/docs/types#tensor-types) argument. For more details on this distinction, refer to the [Function application](/v3/documentation/smart-contracts/func/docs/statements#function-application) section.
However, for convenience, the individual components of this tensor are conventionally referred to as "function arguments."

### 函数调用

#### 非修改方法

:::info
非修改函数支持使用 `.` 的简短函数调用形式
:::

```func
example(a);
a.example();
```

A function with at least **one argument**, it can be called a **non-modifying method**. For example, the function `store_uint` has the type `(builder, int, int) → builder`, where:

- The second argument is the value to store.
- The third argument is the bit length.

如果函数至少有一个参数，它可以作为非修改方法被调用。例如，`store_uint` 的类型为 `(builder, int, int) -> builder`（第二个参数是要存储的值，第三个是位长度）。`begin_cell` 是创建新构建器的函数。以下代码等效： The following two code snippets are equivalent:

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

因此，函数的第一个参数可以在函数名前传递给它，如果用 `.` 分隔。代码可以进一步简化： The code can be further simplified:

The function's first argument is passed before the function name, separated by `.`. The syntax can be further condensed into a single statement:

```func
builder b = begin_cell().store_uint(239, 8);
```

也可以进行多次方法调用：

```func
builder b = begin_cell().store_uint(239, 8)
                        .store_int(-1, 16)
                        .store_uint(0xff, 10);
```

#### 修改函数

:::info
修改函数支持使用 `~` 和 `.` 运算符的简短形式。
:::

If:

- The first argument of a function has type `A`.
- 如果函数的第一个参数的类型为 `A`，并且函数的返回值形状为 `(A, B)`，其中 `B` 是某种任意类型，则该函数可以作为修改方法被调用。

Then, the function can be called a modifying method.

Modifying functions change their first argument. 修改函数调用可以接受一些参数并返回一些值，但它们会修改第一个参数，即将返回值的第一个组件分配给第一个参数中的变量。
The following calls are equivalent:

```func
a~example();
a = example(a);
```

**Example:** `load_uint`

例如，假设 `cs` 是一个cell slice ，`load_uint` 的类型为 `(slice, int) -> (slice, int)`：它接受一个cell slice 和要加载的位数，然后返回 slice 的剩余部分和加载的值。以下代码等效： It means:

- `load_uint` takes a cell slice and several bits to load.
- It returns the remaining slice and the loaded value.

The following calls are equivalent:

```func
(cs, int x) = load_uint(cs, 8);
```

```func
(cs, int x) = cs.load_uint(8);
```

```func
int x = cs~load_uint(8);
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
x~inc();
```

This will increment `x` in place.

#### `.` 和 `~` 在函数名中

假设我们还想将 `inc` 用作非修改方法。我们可以写类似的东西： We can write:

```func
(int y, _) = inc(x);
```

但可以重写 `inc` 作为修改方法的定义。

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
x~inc();
int y = inc(x);
int z = x.inc();
```

**How FunC resolves function calls**

- 单个 `;`，表示函数已声明但尚未定义。它可能会在同一文件中的后面或在传递给 FunC 编译器的其他文件中定义。例如，
- 例如，`udict_add_builder?`、`dict_set` 和 `~dict_set` 都是有效且不同的函数名。（它们在 [stdlib.fc](/develop/func/stdlib) 中定义。）
- 总结一下，当以非修改或修改方法（即使用 `.foo` 或 `~foo` 语法）调用名为 `foo` 的函数时，如果存在 `.foo` 或 `~foo` 的定义，FunC 编译器将分别使用 `.foo` 或 `~foo` 的定义，如果没有，则使用 `foo` 的定义。

### Specifiers

In FunC, function specifiers modify the behavior of functions. There are three types:

1. `impure`
2. `inline`/ `inline_ref`
3. `method_id`

One, multiple, or none can be used in a function declaration. However, they must appear in a specific order (e.g., `impure` must come before `inline`).

#### 非纯修饰符(Impure specifier)

The `impure` specifier indicates that a function has side effects, such as modifying contract storage, sending messages, or throwing exceptions.
如果未指定 `impure`，并且未使用函数调用的结果，则 FunC 编译器可能会并将删除此函数调用。

例如，在 [stdlib.fc](/develop/func/stdlib) 函数中

```func
int random() impure asm "RANDU256";
```

Here, `RANDU256` changes the internal state of the random number generator. The `impure` keyword prevents the compiler from removing this function call.

#### 内联修饰符(Inline specifier)

如果函数具有 `inline` 修饰符，则其代码实际上在调用该函数的每个地方都被替换。不言而喻，递归调用内联函数是不可能的。
Recursive calls are not allowed for inline functions.

**Example**

```func
(int) add(int a, int b) inline {
    return a + b;
}
```

因为 `add` 函数使用了 `inline` 指定符。编译器会尝试用实际代码 `a + b` 替换对 `add` 的调用，从而避免函数调用开销。

例如，您可以在此示例中像这样使用 `inline`：[ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16)

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

#### Inline_ref 修饰符(Inline_ref specifier)

When a function is marked with the `inline_ref` specifier, its code is stored in a separate cell. Each time the function is called, TVM executes a `CALLREF` command. This works similarly to `inline`, but with a key difference—since the same cell can be reused multiple times without duplication, `inline_ref` is generally more efficient regarding code size. The only case where `inline` might be preferable is if the function is called just once. However, recursive calls to `inline_ref` functions remain impossible, as TVM cells do not support cyclic references.

#### method_id

In a TVM program, every function has an internal integer ID that determines how it can be called.
By default, ordinary functions are assigned sequential numbers starting from `1`, while contract get-methods use `crc16` hashes of their names.
The `method_id(<some_number>)` specifier allows you to set a function's ID to a specific value manually.
If no ID is specified, the default is calculated as `(crc16(<function_name>) & 0xffff) | 0x10000`.
If a function has the `method_id` specifier, it can be invoked by its name as a get-method in lite client or TON explorer.

:::warning Important limitations and recommendations
**19-bit limitation**: Method IDs are limited to 19 bits by the TVM assembler, meaning the valid range is **0 to 524,287** (2^19 - 1).

**Reserved ranges**:

- **0-999**: Reserved for system functions (approximate range)
- `recv_internal` 在智能合约接收到内部入站消息时被调用。
  当 [TVM 初始化](/learn/tvm-instructions/tvm-overview#initialization-of-tvm) 时，栈上有一些变量，通过在 `recv_internal` 中设置参数，我们使智能合约代码能够了解其中的一些变量。那些代码不知道的变量将永远躺在栈底，从未被触及。
- **65536+**: Default range for user functions when using automatic generation `(crc16() & 0xffff) | 0x10000`

**Best practice**: It's recommended to **avoid setting method IDs manually** and rely on automatic generation instead. Manual assignment can lead to conflicts and unexpected behavior.
:::

<details><summary><b>Technical details about method_id parsing</b></summary>

While the FunC compiler can initially accept larger hex values during parsing, the actual limitation comes from the TVM assembler which restricts method IDs to 19 bits (`@procdictkeylen = 19` in Asm.fif).

The parsing of the hexadecimal string for `method_id` is handled by functions in `crypto/common/bigint.hpp` (specifically `AnyIntView::parse_hex_any` called via `td::string_to_int256` and `BigInt<257>::parse_hex`).

`AnyIntView::parse_hex_any` first performs a basic check on the length of the hex string:

```cpp
if ((j - i - (p > 0)) * 4 > (max_size() - 1) * word_shift + word_bits - 2) {
  return 0; // Invalid if too long
}
```

For `BigInt<257>` (which is `td::BigIntG<257, td::BigIntInfo>`):

- `Tr` is `BigIntInfo`.
- `word_bits` (bits in a word) is 64.
- `word_shift` (effective bits used per word in normalization) is 52. (Source: `crypto/common/bigint.hpp`)
- `max_size()` (maximum words for `BigInt<257>`) is `(257 + 52 - 1) / 52 + 1 = 6` words.

Let's plug these values into the length check formula:
`(max_size() - 1) * word_shift + word_bits - 2`
`(6 - 1) * 52 + 64 - 2 = 5 * 52 + 62 = 260 + 62 = 322` bits.

A 65-character hex string represents \( 65 times 4 = 260 \) bits.
The calculated bit limit for the quick check is 322 bits. Since `260` is not greater than `322`, such a number (65 hex digits) can _pass_ this initial length check. This check is designed to quickly reject inputs that are grossly too large. The `-2` offers a slight margin.

After this initial parsing into internal `digits_`, `parse_hex_any` calls `normalize_bool_any()`. This function converts the internal representation into a canonical signed form.
If `normalize_bool_any()` returns `false`, it indicates an overflow during this canonicalization. This can happen even if the number passed the initial length check, for example, if a carry propagates such that it requires more than `max_size()` words to represent in the specific signed format, or if the most significant word itself overflows. In such a case, `parse_hex_any` invalidates the `BigInt` and returns `0`, leading to `td::string_to_int256` returning a `null RefInt256` and FunC reporting an "invalid integer constant".

</details>

**Example**

```func
int get_counter() method_id {
  load_data();
  return ctx_counter;
}
```

### 使用 forall 的多态性

Before any function declaration or definition, there can be `forall` type variables declarator. It has the following syntax:

A function definition can include a `forall` type variable declaration before its declaration or implementation. The syntax is:

```func
forall <comma_separated_type_variables_names> ->
```

Here, type variable names can be any [identifier](/v3/documentation/smart-contracts/func/docs/literals_identifiers#identifiers) but are typically written in capital letters.

例如，

```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```

This function takes a tuple of exactly two elements, where each component can be of any type that fits in a single stack entry. It swaps the two values. For instance:

- `pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。
- `pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。

In this example, `X` and `Y` are [type variables](/v3/documentation/smart-contracts/func/docs/types#polymorphism-with-type-variables). When the function is called, these variables are replaced with actual types, and the function executes accordingly. Even though the function is polymorphic, the compiled assembly code remains the same for any type substitution. This is possible due to the polymorphic nature of stack manipulation operations. However, other forms of polymorphism, such as `ad-hoc` polymorphism with type classes, are not currently supported.

It is important to note that `X` and `Y` must each have a type width of 1, meaning they should fit within a single stack entry. 另外，值得注意的是，`X` 和 `Y` 的类型宽度假定为 1；也就是说，`X` 或 `Y` 的值必须占据单个堆栈条目。因此，您实际上不能在类型为 `[(int, int), int]` 的元组上调用函数 `pair_swap`，因为类型 `(int, int)` 的宽度为 2，即它占据 2 个堆栈条目。

## 汇编函数体定义

In FunC, functions can be defined directly using assembler code. This is done using the `asm` keyword, followed by one or more assembler commands written as strings.
For example, the following function increments an integer and then negates it:

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```

– a function that increments an integer and then negates it. – 一个递增整数然后取反的函数。对这个函数的调用将被转换为两个汇编命令 `INC` 和 `NEGATE`。定义该函数的另一种方式是： An alternative way to define the function is:

When called, this function is directly translated into the two assembler commands, `INC` and `NEGATE`.
Alternatively, the function can be written as:

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```

Here, `INC NEGATE` is treated as a single assembler command by FunC, but the Fift assembler correctly interprets it as two separate commands.

:::info
The list of assembler commands can be found here: [TVM instructions](/v3/documentation/tvm/instructions).
:::

### 重新排列堆栈条目

Sometimes, the order in which function arguments are passed may not match the expected order of an assembler command. Similarly, the returned values may need to be arranged differently. While this can be done manually using stack manipulation primitives, FunC automatically handles it.

:::info
When manually rearranging arguments, they are computed in the new order. 注意，在手动重新排列的情况下，参数将按重新排列的顺序计算。要覆盖这种行为，请使用 `#pragma compute-asm-ltr`：[compute-asm-ltr](/v3/documentation/smartcontracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
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

我们还可以像这样重新排列返回值：

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```

数字对应于返回值的索引（0 是返回值中最深的堆栈条目）。

Additionally, we can combine these techniques:

```func
(int, builder) store_uint_quite(builder b, int x, int len) asm(x b len -> 1 0) "STUXQ";
```

### 多行 asms

多行汇编命令甚至 Fift 代码片段可以通过以 `"""` 开始和结束的多行字符串定义。

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

