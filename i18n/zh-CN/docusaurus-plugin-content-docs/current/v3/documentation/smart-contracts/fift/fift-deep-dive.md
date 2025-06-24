import Feedback from '@site/src/components/Feedback';

# Fift deep dive

Fift 是一种高级的基于栈的语言，用于本地操作cell和其他 TVM 原语，主要用于将 TVM 汇编代码转换为合约代码的cell包。 Its primary purpose is to compile TVM assembly code into contract code as a bag-of-cells (BoC).

:::caution
**Advanced topic notice**
This section covers low-level interactions with TON's implementation details. Before proceeding, ensure you have:

- Solid experience with stack-based programming paradigms
- Understanding of virtual machine architectures
- Familiarity with low-level data structures
  :::

## 简单算术

你可以使用 Fift 解释器作为计算器，以[逆波兰表示法(reverse Polish notation)](https://en.wikipedia.org/wiki/Reverse_Polish_notation)编写表达式。

```
6 17 17 * * 289 + .
2023 ok
```

This example calculates:

1. `17 * 17 = 289`
2. `6 * 289 = 1734`
3. `1734 + 289 = 2023`

## 标准输出

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

- `emit` 从栈顶取出数字，并将指定代码的 Unicode 字符打印到 stdout。
  `."..."` 打印常量字符串。
- `."..."` outputs a constant string

## 定义函数（Fift words）

To define a word, follow these steps:

1. **Enclose the word's effects** in curly braces `{}`.
2. **Add a colon `:`** after the closing brace.
3. **Specify the word's name** after the colon.

First line defines a word `increment` that increases `x` by `1`.

**Examples:**

```
{ minmax drop } : min
{ minmax nip } : max
```

> Fift.fif

In TON, multiple **defining words** exist, not just `:`. They differ in behavior:

- **Active words** – Operate inside curly braces `{}`.
- **Prefix words** – Do not require a trailing space .

```
{ bl word 1 2 ' (create) } "::" 1 (create)
{ bl word 0 2 ' (create) } :: :
{ bl word 2 2 ' (create) } :: :_
{ bl word 3 2 ' (create) } :: ::_
{ bl word 0 (create) } : create
```

> Fift.fif

## 条件执行

Execute code blocks conditionally using `cond`:

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## 循环

Use loop primitives for repetitive operations:

```
// ( l c -- l')  deletes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

Loop word `times` takes two arguments - let's call them `cont` and `n` - and executes `cont` `n` times.
循环word `times` 接受两个参数 - 我们称它们为 `cont` 和 `n` - 并执行 `cont` `n` 次。
这里 `list-delete-first` 继承 `safe-cdr` （从Lisp样式列表中删除head命令），将其放在 `c` 下面，然后 `c` 次从堆栈上的列表中删除head。
还有 `while` 和 `until` 循环word。

## Comments

Comments in Fift are defined in `Fift.fif` and come in two forms:

1. **Single-line comments**: Start with `//` and continue to the end of the line
2. **Multiline comments**: Start with `/*` and end with `*/`

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```

> Fift.fif

#### How comments work

Fift programs are sequences of words that transform the stack or define new words. 不过，还有几个_定义word_的方法，不仅仅是 `:`。它们的不同之处在于，用其中一些定义的word是**active**（在大括号内工作），而有些是**prefix**（不需要在它们之后有空格字符）：

Breaking down the `//` definition:

1. `0`：零被推到栈上
2. `word`：此命令读取字符，直到达到栈顶的字符，并将读取的数据作为字符串推送。零是特殊情况：这里 `word` 跳过前导空格，然后读取直到当前输入行的末尾。
3. `drop` - Removes the comment text from the stack
4. `0`：再次将零推到栈上 - 结果的数量，因为word是用 `::` 定义的。
5. `'nop` 推送执行令牌在调用时什么也不做。这几乎等同于 `{ nop }`。

## 使用 Fift 定义 TVM 汇编代码

```fift
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```

> Asm.fif (行顺序颠倒)

### How @Defop works

`@Defop` checks available space for the opcode using `@havebitrefs`. If space is insufficient, it writes to another builder via `@|` (implicit jump).

**Important:** Always use `x{A988} @addop` instead of `x{A988} s,` to avoid compilation failures when space is limited.

### Including cells in contracts

您可以使用 Fift 将大型cell包纳入到合约中：

```fift
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

This defines an opcode that:

1. Writes `x{88}` (`PUSHREF`) when included in the program
2. Adds a reference to the specified bag-of-cells
3. Pushes the cell to TVM stack when executing `LDBLOB`

## 特殊功能

### Ed25519 密码学

Fift provides built-in support for Ed25519 cryptographic operations:

- newkeypair - 生成私钥-公钥对
- priv>pub   - 从私钥生成公钥
- ed25519_sign[_uint] - 给定数据和私钥生成签名
- ed25519_chksign     - 检查 Ed25519 签名

### 与 TVM 的交互

- runvmcode 及类似的 - 使用从堆栈中取得的代码 slice 调用 TVM

### File operations

- **Save BoC to file**:
  ```fift
  将 BOC 写入文件：
  `boc>B ".../contract.boc" B>file`
  ```

## 继续学习

- [Fift 简介](https://docs.ton.org/fiftbase.pdf) by Nikolai Durov

<Feedback />

