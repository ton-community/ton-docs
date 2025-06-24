import Feedback from '@site/src/components/Feedback';

# 字面量和标识符

## 数字字面量

FunC 支持十进制和十六进制整数字面量（允许前导零）。

例如，`0`、`123`、`-17`、`00987`、`0xef`、`0xEF`、`0x0`、`-0xfFAb`、`0x0001`、`-0`、`-0x0` 都是有效的数字字面量。

## 字符串字面量

FunC 中的字符串使用双引号 `"` 包裹，如 `"this is a string"`。不支持特殊符号如 `\n` 和多行字符串。
可选地，字符串字面量后可以指定类型，如 `"string"u`。
You can optionally specify a type after the string literal, such as `"string"u`.<br />
Special characters like `\n` are not supported, but you can create multi-line <br />  strings simply by writing the text across multiple lines, like this:

```
;; somewhere inside of a function body

var a = """
   hash me baby one more time
"""h;
var b = a + 42;

b; ;; 623173419
```

支持以下字符串类型：

- 无类型 —— 用于 asm 函数定义和通过 ASCII 字符串定义 slice 常量
- `s` —— 通过其内容（十六进制编码并可选地位填充）定义原始 slice 常量
- `a` —— 从指定地址创建包含 `MsgAddressInt` 结构的 slice 常量
- `u` —— 创建对应于提供的 ASCII 字符串的十六进制值的 int 常量
- `h` —— 创建字符串的 SHA256 哈希的前 32 位的 int 常量
- `H` —— 创建字符串的 SHA256 哈希的所有 256 位的 int 常量
- `c` —— 创建字符串的 crc32 值的 int 常量

**Examples**
The following string literals produce these corresponding constants:

- `"string"` 变成 `x{737472696e67}` slice 常量
- `"abcdef"s` 变成 `x{abcdef}` slice 常量
- `"Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a` 变成 `x{9FE6666666666666666666666666666666666666666666666666666666666666667_}` slice 常量（`addr_std$10 anycast:none$0 workchain_id:int8=0xFF address:bits256=0x33...33`）
- `"NstK"u` 变成 `0x4e73744b` int 常量
- `"transfer(slice, int)"h` 变成 `0x7a62e8a8` int 常量
- `"transfer(slice, int)"H` 变成 `0x7a62e8a8ebac41bd6de16c65e7be363bc2d2cbc6a0873778dead4795c13db979` int 常量
- `"transfer(slice, int)"c` 变成 `2235694568` int 常量

## 标识符

FunC allows a broad range of identifiers for functions and variable names.
Any **single-line string** that meets the following conditions qualifies as a valid identifier:

- It **does not** contain special symbols: `;`, `,`, `(`, `)`, `[`, `]`, spaces including tabs, `~`, and `.`.
- It **does not** start as a comment or a string literal (i.e., with `"` at the beginning).
- It is **not** a number literal.
- It is **not** an underscore `_`.
- It is **not** a reserved keyword. Exception: if it starts with a backtick `` ` ``, it must also end with a backtick and cannot contain any additional backticks inside.
- It is **not** a name of a [builtin](https://github.com/ton-blockchain/ton/blob/5c392e0f2d946877bb79a09ed35068f7b0bd333a/crypto/func/builtins.cpp#L1133).

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

**Naming conventions:**

- **Apostrophe `'` at the end:** used when a variable is a modified version of its original value.

  - 变量名末尾的 `'` 通常用于表示某个旧值的修改版本。例如，几乎所有用于 hashmap 操作的内置修改原语（除了以 `~` 为前缀的原语）都会接收一个 hashmap 并返回新版本的 hashmap 及必要时的其他数据。将这些值命名为相同名称后加 `'` 很方便。
    The updated version is typically named with the same identifier, adding a `'` suffix.

- **Question mark (?) at the end:** typically used for boolean variables or functions that return a success flag.
  - Example: `udict_get?` from [stdlib.fc](/v3/documentation/smart-contracts/func/docs/stdlib), which checks if a value exists.

**Invalid identifiers:**

- `take(first)Entry`
- `"not_a_string`
- `msg.sender`
- `send_message,then_terminate`
- `_` - just an underscore, which is not valid on its own

**Less common but valid identifiers:**

- `123validname`
- `2+2=2*2`
- `-alsovalidname`
- `0xefefefhahaha`
- `{hehehe}`
- ``pa{--}in"`aaa`"``

**More invalid identifiers:**

- ``pa;;in"`aaa`"``（因为禁止使用 `;`）
- `{-aaa-}` - contains `{}` incorrectly
- `aa(bb` - contains an opening parenthesis without closing it
- `123`（它是一个数字）

**Special identifiers in backticks:**

FunC allows identifiers enclosed in backticks `` ` ``. 这些也是无效的标识符：

- Newline characters `\n`
- Backticks `` ` `` themselves except the opening and closing ones.

**Examples of valid backtick-quoted identifiers:**

- `I'm a variable too`
- `any symbols ; ~ () are allowed here...`

## 常量

FunC 允许定义编译时的常量，这些常量在编译期间被替换和预计算。

**Syntax:**

```func
常量的定义格式为 `const optional-type identifier = value-or-expression;`
```

- `optional-type` 可用于强制指定常量的特定类型，也用于更好的可读性。
- `value-or-expression` 可以是字面量或由字面量和常量组成的可预计算表达式。

**Example usage:**

```func
`const int int240 = ((int1 + int2) * 10) << 3;` 定义等于计算结果的 `int240` 常量
```

由于数字常量在编译期间被替换，所有在编译期间进行的优化和预计算都能成功执行（与旧方法通过内联 asm `PUSHINT` 定义常量不同）。

<Feedback />
