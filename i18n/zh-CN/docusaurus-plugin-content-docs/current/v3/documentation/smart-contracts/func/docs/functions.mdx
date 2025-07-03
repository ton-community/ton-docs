# 函数

FunC 程序本质上是一系列函数声明/定义和全局变量声明。本节涵盖了第一个主题。

任何函数声明或定义都以一个共同的模式开始，接下来有三种情况之一：

- 单个 `;`，表示函数已声明但尚未定义。它可能会在同一文件中的后面或在传递给 FunC 编译器的其他文件中定义。例如，
  ```func
  int add(int x, int y);
  ```
  是一个名为 `add` 类型为 `(int, int) -> int` 的函数的简单声明。

- 汇编函数体定义。这是通过低层级 TVM 原语定义函数以便在 FunC 程序中后续使用的方法。例如，
  ```func
  int add(int x, int y) asm "ADD";
  ```
  是同一个 `add` 函数的汇编定义，类型为 `(int, int) -> int`，将转换为 TVM 操作码 `ADD`。

- 常规块语句函数体定义。这是定义函数的常用方式。例如，
  ```func
  int add(int x, int y) {
    return x + y;
  }
  ```
  是 `add` 函数的常规定义。

## 函数声明

如前所述，任何函数声明或定义都以一个共同的模式开始。以下是该模式：

```func
[<forall declarator>] <return_type> <function_name>(<comma_separated_function_args>) <specifiers>
```

其中 `[ ... ]` 对应于可选条目。

### 函数名

函数名可以是任何[标识符](/develop/func/literals_identifiers#identifiers)，也可以以 `.` 或 `~` 符号开头。这些符号的含义在[声明](/develop/func/statements#methods-calls)部分解释。

例如，`udict_add_builder?`、`dict_set` 和 `~dict_set` 都是有效且不同的函数名。（它们在 [stdlib.fc](/develop/func/stdlib) 中定义。）

#### 特殊函数名

FunC（实际上是 Fift 汇编器）有几个预定义的保留函数名，具有预定义的[id](/develop/func/functions#method_id)。

- `main` 和 `recv_internal` 的 id 为 0
- `recv_external` 的 id 为 -1
- `run_ticktock` 的 id 为 -2

每个程序必须有一个 id 为 0 的函数，即 `main` 或 `recv_internal` 函数。
`run_ticktock` 在特殊智能合约的 ticktock 交易中被调用。

#### 接收内部消息

`recv_internal` 在智能合约接收到内部入站消息时被调用。
当 [TVM 初始化](/learn/tvm-instructions/tvm-overview#initialization-of-tvm) 时，栈上有一些变量，通过在 `recv_internal` 中设置参数，我们使智能合约代码能够了解其中的一些变量。那些代码不知道的变量将永远躺在栈底，从未被触及。

因此，以下每个 `recv_internal` 声明都是正确的，但具有较少变量的声明将稍微节省一些gas（每个未使用的参数都会增加额外的 `DROP` 指令）

```func

() recv_internal(int balance, int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(int msg_value, cell in_msg_cell, slice in_msg) {}
() recv_internal(cell in_msg_cell, slice in_msg) {}
() recv_internal(slice in_msg) {}
```

#### 接收外部消息

`recv_external` 用于入站外部消息。

### 返回类型

返回类型可以是[类型](/develop/func/types.md)部分中描述的任何原子或复合类型。例如，

```func
int foo();
(int, int) foo'();
[int, int] foo''();
(int -> int) foo'''();
() foo''''();
```

都是有效的函数声明。

也允许类型推断。例如，

```func
_ pyth(int m, int n) {
  return (m * m - n * n, 2 * m * n, m * m + n * n);
}
```

是 `pyth` 函数的有效定义，类型为 `(int, int) -> (int, int, int)`，用于计算勾股数。

### 函数参数

函数参数由逗号分隔。以下是参数的有效声明方式：

- 普通声明：类型 + 名称。例如，`int x` 是函数声明 `() foo(int x);` 中类型为 `int`、名称为 `x` 的参数声明。
- 未使用的参数声明：只有类型。例如，
  ```func
  int first(int x, int) {
    return x;
  }
  ```
  是类型为 `(int, int) -> int` 的有效函数定义。
- 推断类型的参数声明：只有名称。例如，
  ```func
  int inc(x) {
    return x + 1;
  }
  ```
  是类型为 `int -> int` 的有效函数定义。`x` 的 `int` 类型由类型检查器推断。

请注意，尽管函数可能看起来像是多个参数的函数，实际上它是一个单一[张量类型](/develop/func/types#tensor-types)参数的函数。要了解差异，请参阅[函数应用](/develop/func/statements#function-application)。然而，参数张量的组成部分通常被称为函数参数。

### 函数调用

#### 非修改方法

:::info
非修改函数支持使用 `.` 的简短函数调用形式
:::

```func
example(a);
a.example();
```

如果函数至少有一个参数，它可以作为非修改方法被调用。例如，`store_uint` 的类型为 `(builder, int, int) -> builder`（第二个参数是要存储的值，第三个是位长度）。`begin_cell` 是创建新构建器的函数。以下代码等效：

```func
builder b = begin_cell();
b = store_uint(b, 239, 8);
```

```func
builder b = begin_cell();
b = b.store_uint(239, 8);
```

因此，函数的第一个参数可以在函数名前传递给它，如果用 `.` 分隔。代码可以进一步简化：

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

如果函数的第一个参数的类型为 `A`，并且函数的返回值形状为 `(A, B)`，其中 `B` 是某种任意类型，则该函数可以作为修改方法被调用。

修改函数调用可以接受一些参数并返回一些值，但它们会修改第一个参数，即将返回值的第一个组件分配给第一个参数中的变量。

```func
a~example();
a = example(a);
```

例如，假设 `cs` 是一个cell slice ，`load_uint` 的类型为 `(slice, int) -> (slice, int)`：它接受一个cell slice 和要加载的位数，然后返回 slice 的剩余部分和加载的值。以下代码等效：

```func
(cs, int x) = load_uint(cs, 8);
```

```func
(cs, int x) = cs.load_uint(8);
```

```func
int x = cs~load_uint(8);
```

在某些情况下，我们希望将不返回任何值并且只修改第一个参数的函数用作修改方法。可以使用cell类型如下操作：假设我们想定义类型为 `int -> int` 的函数 `inc`，它用于递增一个整数，并将其用作修改方法。然后我们应该将 `inc` 定义为类型为 `int -> (int, ())` 的函数：

```func
(int, ()) inc(int x) {
  return (x + 1, ());
}
```

这样定义后，它可以用作修改方法。以下将递增 `x`。

```func
x~inc();
```

#### `.` 和 `~` 在函数名中

假设我们还想将 `inc` 用作非修改方法。我们可以写类似的东西：

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

然后像这样调用它：

```func
x~inc();
int y = inc(x);
int z = x.inc();
```

第一个调用将修改 x；第二个和第三个不会。

总结一下，当以非修改或修改方法（即使用 `.foo` 或 `~foo` 语法）调用名为 `foo` 的函数时，如果存在 `.foo` 或 `~foo` 的定义，FunC 编译器将分别使用 `.foo` 或 `~foo` 的定义，如果没有，则使用 `foo` 的定义。

### 修饰符

有三种类型的修饰符：`impure`，`inline`/`inline_ref` 和 `method_id`。可以在函数声明中放置一种、几种或不放置任何修饰符，但目前它们必须以正确的顺序呈现。例如，不允许在 `inline` 之后放置 `impure`。

#### 非纯修饰符(Impure specifier)

`impure` 修饰符意味着函数可能有一些不可忽略的副作用。例如，如果函数可以修改合约存储、发送消息或在某些数据无效时抛出异常，并且函数旨在验证这些数据，那么我们应该放置 `impure` 修饰符。

如果未指定 `impure`，并且未使用函数调用的结果，则 FunC 编译器可能会并将删除此函数调用。

例如，在 [stdlib.fc](/develop/func/stdlib) 函数中

```func
int random() impure asm "RANDU256";
```

被定义。使用 `impure` 是因为 `RANDU256` 改变了随机数生成器的内部状态。

#### 内联修饰符(Inline specifier)

如果函数具有 `inline` 修饰符，则其代码实际上在调用该函数的每个地方都被替换。不言而喻，递归调用内联函数是不可能的。

例如，您可以在此示例中像这样使用 `inline`：[ICO-Minter.fc](https://github.com/ton-blockchain/token-contract/blob/f2253cb0f0e1ae0974d7dc0cef3a62cb6e19f806/ft/jetton-minter-ICO.fc#L16)

```func
(int) add(int a, int b) inline {
    return a + b;
}
```

因为 `add` 函数使用了 `inline` 指定符。编译器会尝试用实际代码 `a + b` 替换对 `add` 的调用，从而避免函数调用开销。

带有 `inline_ref` 修饰符的函数代码放在单独的cell中，每次调用该函数时，TVM 都会执行 `CALLREF` 命令。因此，它与 `inline` 类似，但因为cell可以在没有重复的情况下在多个地方重复使用，所以几乎总是更有效率地使用 `inline_ref` 修饰符而不是 `inline`，除非该函数确实只被调用一次。`inline_ref` 函数的递归调用仍然不可能，因为 TVM cell中没有循环引用。

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

例如，

#### method_id

是多重签名合约的 get 方法。

例如，

```func
(int, int) get_n_k() method_id {
  (_, int n, int k, _, _, _, _) = unpack_state();
  return (n, k);
}
```

是多重签名合约的 get 方法。

### 使用 forall 的多态性

例如，

```func
forall <comma_separated_type_variables_names> ->
```

是一个接受长度恰好为 2 的元组的函数，但组件中的值可以是任何（单个堆栈条目）类型，并将它们互换。

`pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。

```func
forall X, Y -> [Y, X] pair_swap([X, Y] pair) {
  [X p1, Y p2] = pair;
  return [p2, p1];
}
```

另外，值得注意的是，`X` 和 `Y` 的类型宽度假定为 1；也就是说，`X` 或 `Y` 的值必须占据单个堆栈条目。因此，您实际上不能在类型为 `[(int, int), int]` 的元组上调用函数 `pair_swap`，因为类型 `(int, int)` 的宽度为 2，即它占据 2 个堆栈条目。

`pair_swap([2, 3])` 将产生 `[3, 2]`，而 `pair_swap([1, [2, 3, 4]])` 将产生 `[[2, 3, 4], 1]`。

如上所述，可以通过汇编代码定义函数。语法是 `asm` 关键字，后跟一个或多个表示为字符串的汇编命令。
例如，可以定义：

另外，值得注意的是，`X` 和 `Y` 的类型宽度假定为 1；也就是说，`X` 或 `Y` 的值必须占据单个堆栈条目。因此，您实际上不能在类型为 `[(int, int), int]` 的元组上调用函数 `pair_swap`，因为类型 `(int, int)` 的宽度为 2，即它占据 2 个堆栈条目。

## 汇编函数体定义

如上所述，可以通过汇编代码定义函数。语法是 `asm` 关键字，后跟一个或多个表示为字符串的汇编命令。
例如，可以定义：

```func
int inc_then_negate(int x) asm "INC" "NEGATE";
```

– 一个递增整数然后取反的函数。对这个函数的调用将被转换为两个汇编命令 `INC` 和 `NEGATE`。定义该函数的另一种方式是：

```func
int inc_then_negate'(int x) asm "INC NEGATE";
```

在某些情况下，我们希望以与汇编函数所需的顺序不同的顺序传递参数，或/和以不同于命令返回的堆栈条目顺序获取结果。我们可以通过添加相应的堆栈原语来手动重新排列堆栈，但 FunC 可以自动完成此操作。

:::info
请注意，在手动重新排列的情况下，参数将按重新排列的顺序计算。要覆盖此行为，请使用 `#pragma compute-asm-ltr`：[compute-asm-ltr](compiler_directives#pragma-compute-asm-ltr)
:::

### 重新排列堆栈条目

在某些情况下，我们希望以与汇编函数所需的顺序不同的顺序传递参数，或/和以不同于命令返回的堆栈条目顺序获取结果。我们可以通过添加相应的堆栈原语来手动重新排列堆栈，但 FunC 可以自动完成此操作。

:::info
注意，在手动重新排列的情况下，参数将按重新排列的顺序计算。要覆盖这种行为，请使用 `#pragma compute-asm-ltr`：[compute-asm-ltr](/v3/documentation/smartcontracts/func/docs/compiler_directives#pragma-compute-asm-ltr)
:::

例如，假设汇编命令 STUXQ 接受一个整数、构建器和整数；然后返回构建器以及表示操作成功或失败的整数标志。
我们可以定义函数：

```func
(builder, int) store_uint_quite(int x, builder b, int len) asm "STUXQ";
```

我们还可以像这样重新排列返回值：

```func
(builder, int) store_uint_quite(builder b, int x, int len) asm(x b len) "STUXQ";
```

数字对应于返回值的索引（0 是返回值中最深的堆栈条目）。

这些技术的组合也是可能的。

```func
(int, builder) store_uint_quite(int x, builder b, int len) asm( -> 1 0) "STUXQ";
```

数字对应于返回值的索引（0 是返回值中最深的堆栈条目）。

多行汇编命令甚至 Fift 代码片段可以通过以 `"""` 开始和结束的多行字符串定义。

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
