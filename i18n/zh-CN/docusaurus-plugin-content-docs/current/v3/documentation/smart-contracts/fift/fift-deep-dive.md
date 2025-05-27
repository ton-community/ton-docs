# Fift 深入解析

Fift 是一种高级的基于栈的语言，用于本地操作cell和其他 TVM 原语，主要用于将 TVM 汇编代码转换为合约代码的cell包。

:::caution
本节描述了与 TON 特有功能在**非常**低层级的交互。
需要对栈语言基础有深入理解。
:::

## 简单算术

你可以使用 Fift 解释器作为计算器，以[逆波兰表示法(reverse Polish notation)](https://en.wikipedia.org/wiki/Reverse_Polish_notation)编写表达式。

```
6 17 17 * * 289 + .
2023 ok
```

## 标准输出

```
27 emit ."[30;1mgrey text" 27 emit ."[37m"
grey text ok
```

`emit` 从栈顶取出数字，并将指定代码的 Unicode 字符打印到 stdout。
`."..."` 打印常量字符串。

## 定义函数（Fift words）

定义word的主要方式是将其效果括在大括号中，然后写 `:` 和word名称。

```
{ minmax drop } : min
{ minmax nip } : max
```

> Fift.fif

不过，还有几个*定义word*的方法，不仅仅是 `:`。它们的不同之处在于，用其中一些定义的word是**active**（在大括号内工作），而有些是**prefix**（不需要在它们之后有空格字符）：

```
{ bl word 1 2 ' (create) } "::" 1 (create)
{ bl word 0 2 ' (create) } :: :
{ bl word 2 2 ' (create) } :: :_
{ bl word 3 2 ' (create) } :: ::_
{ bl word 0 (create) } : create
```

> Fift.fif

## 条件执行

代码块（由大括号分隔）可以有条件或无条件地执行。

```
{ { ."true " } { ."false " } cond } : ?.   4 5 = ?.  4 5 < ?.
false true  ok
{ ."hello " } execute ."world"
hello world ok
```

## 循环

```
// ( l c -- l')  deletes first c elements from list l
{ ' safe-cdr swap times } : list-delete-first
```

> GetOpt.fif

循环word `times` 接受两个参数 - 我们称它们为 `cont` 和 `n` - 并执行 `cont` `n` 次。
这里 `list-delete-first` 继承 `safe-cdr` （从Lisp样式列表中删除head命令），将其放在 `c` 下面，然后 `c` 次从堆栈上的列表中删除head。

还有 `while` 和 `until` 循环word。

## 注释

```
{ 0 word drop 0 'nop } :: //
{ char " word 1 { swap { abort } if drop } } ::_ abort"
{ { bl word dup "" $= abort"comment extends after end of file" "*/" $= } until 0 'nop } :: /*
```

> Fift.fif

注释在 `Fift.fif` 中定义。单行注释以 `//` 开始，一直到行尾；多行注释以 `/*` 开始，以 `*/` 结束。

让我们理解它们为什么有效。
Fift 程序本质上是一系列word的序列，每个单词都以某种方式转换栈或定义新单词。`Fift.fif` 的第一行代码（上面所示）是新word `//` 的声明。注释必须在定义新word时也能工作，所以它们必须在嵌套环境中工作。这就是为什么它们被定义为**active**单词，通过 `::` 实现。正在创建的单词的动作列在大括号中：

1. `0`：零被推到栈上
2. `word`：此命令读取字符，直到达到栈顶的字符，并将读取的数据作为字符串推送。零是特殊情况：这里 `word` 跳过前导空格，然后读取直到当前输入行的末尾。
3. `drop`：栈顶元素（注释数据）被丢弃。
4. `0`：再次将零推到栈上 - 结果的数量，因为word是用 `::` 定义的。
5. `'nop` 推送执行令牌在调用时什么也不做。这几乎等同于 `{ nop }`。

## 使用 Fift 定义 TVM 汇编代码

```
x{00} @Defop NOP
{ 1 ' @addop does create } : @Defop
{ tuck sbitrefs @ensurebitrefs swap s, } : @addop
{ @havebitrefs ' @| ifnot } : @ensurebitrefs
{ 2 pick brembitrefs 1- 2x<= } : @havebitrefs
{ rot >= -rot <= and } : 2x<=
...
```

> Asm.fif (行顺序颠倒)

`@Defop` 负责检查是否有足够的空间放置操作码（`@havebitrefs`），如果没有，它将继续写入另一个构建器（`@|`；也称为隐式跳转）。这就是为什么你通常不想写 `x{A988} s,` 作为操作码：可能没有足够的空间放置此操作码，因此编译会失败；你应该写 `x{A988} @addop`。

您可以使用 Fift 将大型cell包纳入到合约中：

```
<b 8 4 u, 8 4 u, "fift/blob.boc" file>B B>boc ref, b> <s @Defop LDBLOB
```

此命令定义了一个操作码，当被包含在程序中时，它写入 `x{88}`（`PUSHREF`）和对提供的cell包的引用。因此，当运行 `LDBLOB` 指令时，它将cell推送到 TVM 栈上。

## 特殊功能

- Ed25519 密码学
  - newkeypair - 生成私钥-公钥对
  - priv>pub   - 从私钥生成公钥
  - ed25519_sign[_uint] - 给定数据和私钥生成签名
  - ed25519_chksign     - 检查 Ed25519 签名
- 与 TVM 的交互
  - runvmcode 及类似的 - 使用从堆栈中取得的代码 slice 调用 TVM
- 将 BOC 写入文件：
  `boc>B ".../contract.boc" B>file`

## 继续学习

- [Fift 简介](https://docs.ton.org/fiftbase.pdf) by Nikolai Durov
