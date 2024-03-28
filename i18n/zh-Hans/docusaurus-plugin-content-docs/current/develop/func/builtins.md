# 内置功能
本节描述了一些比之前文章中描述的语言结构更不基础的构造。它们可以在 [stdlib.fc](/develop/func/stdlib) 中定义，但这样会减少 FunC 优化器的操作空间。

## 抛出异常
可以通过条件原语 `throw_if`、`throw_unless` 和无条件的 `throw` 来抛出异常。第一个参数是错误代码；第二个是条件（`throw` 只有一个参数）。这些原语有参数化版本 `throw_arg_if`、`throw_arg_unless` 和 `throw_arg`。第一个参数是任何类型的异常参数；第二个是错误代码；第三个是条件（`throw_arg` 只有两个参数）。

## 布尔值
- `true` 是 `-1` 的别名
- `false` 是 `0` 的别名

## 变量转储
变量可以通过 `~dump` 函数转储到调试日志。

## 字符串转储
字符串可以通过 `~strdump` 函数转储到调试日志。

## 整数操作
- `muldiv` 是一个先乘后除的操作。中间结果存储在 513 位整数中，因此如果实际结果适合于 257 位整数，它不会溢出。
- `divmod` 是一个取两个数字作为参数并给出它们除法的商和余数的操作。

## 其他原语
- `null?` 检查参数是否为 `null`。对于 TVM 类型的 `null` 值，FunC 的 `Null` 表示某些原子类型值的缺失；参见 [null 值](/develop/func/types#null-values)。
- `touch` 和 `~touch` 将变量移至栈顶
- `at` 获取指定位置上的元组组件的值