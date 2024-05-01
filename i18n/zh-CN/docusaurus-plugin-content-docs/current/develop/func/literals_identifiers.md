# 字面量和标识符
## 数字字面量
FunC 支持十进制和十六进制整数字面量（允许前导零）。

例如，`0`、`123`、`-17`、`00987`、`0xef`、`0xEF`、`0x0`、`-0xfFAb`、`0x0001`、`-0`、`-0x0` 都是有效的数字字面量。

## 字符串字面量
FunC 中的字符串使用双引号 `"` 包裹，如 `"this is a string"`。不支持特殊符号如 `\n` 和多行字符串。
可选地，字符串字面量后可以指定类型，如 `"string"u`。

支持以下字符串类型：
* 无类型 —— 用于 asm 函数定义和通过 ASCII 字符串定义 slice 常量
* `s` —— 通过其内容（十六进制编码并可选地位填充）定义原始 slice 常量
* `a` —— 从指定地址创建包含 `MsgAddressInt` 结构的 slice 常量
* `u` —— 创建对应于提供的 ASCII 字符串的十六进制值的 int 常量
* `h` —— 创建字符串的 SHA256 哈希的前 32 位的 int 常量
* `H` —— 创建字符串的 SHA256 哈希的所有 256 位的 int 常量
* `c` —— 创建字符串的 crc32 值的 int 常量

例如，以下值会生成对应的常量：
* `"string"` 变成 `x{737472696e67}` slice 常量
* `"abcdef"s` 变成 `x{abcdef}` slice 常量
* `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` 变成 `x{9FE6666666666666666666666666666666666666666666666666666666666666667_}` slice 常量（`addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`）
* `"NstK"u` 变成 `0x4e73744b` int 常量
* `"transfer(slice, int)"h` 变成 `0x7a62e8a8` int 常量
* `"transfer(slice, int)"H` 变成 `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` int 常量
* `"transfer(slice, int)"c` 变成 `2235694568` int 常量

## 标识符
FunC 允许使用非常广泛的标识符类别（函数和变量名）。具体来说，任何不包含特殊符号 `;`、`,`、`(`、`)`、` `（空格或制表符）、`~` 和 `.`，不以注释或字符串字面量（以 `"` 开头）开始，不是数字字面量，不是下划线 `_`，也不是关键字的单行字符串都是有效的标识符（唯一的例外是，如果它以 `` ` `` 开头，则必须以相同的 `` ` `` 结尾，并且不能包含除这两个外的任何其他 `` ` ``）。

此外，函数定义中的函数名可以以 `.` 或 `~` 开头。

例如，以下是有效的标识符：
- `query`、`query'`、`query''`
- `elem0`、`elem1`、`elem2`
- `CHECK`
- `_internal_value`
- `message_found?`
- `get_pubkeys&signatures`
- `dict::udict_set_builder`
- `_+_`（标准加法运算符，类型为 `(int, int) -> int`，虽然已被定义）
- `fatal!`

变量名末尾的 `'` 通常用于表示某个旧值的修改版本。例如，几乎所有用于 hashmap 操作的内置修改原语（除了以 `~` 为前缀的原语）都会接收一个 hashmap 并返回新版本的 hashmap 及必要时的其他数据。将这些值命名为相同名称后加 `'` 很方便。

后缀 `?` 通常用于布尔变量（TVM 没有内置的 bool 类型；bools 由整数表示：0 为 false，-1 为 true）或返回某些标志位的函数，通常表示操作的成功（如 [stdlib.fc](/develop/func/stdlib) 中的 `udict_get?`）。

以下是无效的标识符：
- `take(first)Entry`
- `"not_a_string`
- `msg.sender`
- `send_message,then_terminate`
- `_`

一些不太常见的有效标识符示例：
- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- ``pa{--}in"`aaa`"``

这些也是无效的标识符：
- ``pa;;in"`aaa`"``（因为禁止使用 `;`）
- `{-aaa-}`
- `aa(bb`
- `123`（它是一个数字）

此外，FunC 有一种特殊类型的标识符，用反引号 `` ` `` 引用。
在引号内，任何符号都是允许的，除了 `\n` 和引号本身。

例如，`` `I'm a variable too` `` 是一个有效的标识符，`` `any symbols ; ~ () are allowed here...` `` 也是。

## 常量
FunC 允许定义编译时的常量，这些常量在编译期间被替换和预计算。

常量的定义格式为 `const optional-type identifier = value-or-expression;`

`optional-type` 可用于强制指定常量的特定类型，也用于更好的可读性。

目前，支持 `int` 和 `slice` 类型。

`value-or-expression` 可以是字面量或由字面量和常量组成的可预计算表达式。

例如，可以这样定义常量：
* `const int101 = 101;` 定义等同于数字字面量 `101` 的 `int101` 常量
* `const str1 = "const1", str2 = "aabbcc"s;` 定义两个等于其对应字符串的常量
* `const int int240 = ((int1 + int2) * 10) << 3;` 定义等于计算结果的 `int240` 常量
* `const slice str2r = str2;` 定义等于 `str2` 常量值的 `str2r` 常量

由于数字常量在编译期间被替换，所有在编译期间进行的优化和预计算都能成功执行（与旧方法通过内联 asm `PUSHINT` 定义常量不同）。
