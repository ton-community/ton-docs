# 编译指令
这些是以 `#` 开始的关键字，指示编译器执行某些动作、检查或更改参数。

这些指令只能在最外层使用（不在任何函数定义内部）。

## #include
`#include` 指令允许包含另一个 FunC 源代码文件，该文件将代替 include 处进行解析。

语法为 `#include "filename.fc";`。文件会自动检查是否重复包含，且默认情况下，尝试多次包含同一文件将被忽略，并在详细级别不低于 2 时发出警告。

如果在解析包含的文件期间发生错误，此外，将打印包含的堆栈，其中包含链中每个包含的文件的位置。

## #pragma
`#pragma` 指令用于向编译器提供超出语言本身所传达的附加信息。

### #pragma version
版本编译指令用于在编译文件时强制使用特定版本的 FunC 编译器。

版本以 semver 格式指定，即 _a.b.c_，其中 _a_ 是主版本号，_b_ 是次版本号，_c_ 是修订号。

开发者可用的比较运算符有几种：
* _a.b.c_ 或 _=a.b.c_ — 要求编译器版本正好为 _a.b.c_
* _>a.b.c_ — 要求编译器版本高于 _a.b.c_
  * _>=a.b.c_ — 要求编译器版本高于或等于 _a.b.c_
* _<a.b.c_ — 要求编译器版本低于 _a.b.c_
  * _<=a.b.c_ — 要求编译器版本低于或等于 _a.b.c_
* _^a.b.c_ — 要求主编译器版本等于 'a' 部分且次版本不低于 'b' 部分
  * _^a.b_ — 要求主编译器版本等于 _a_ 部分且次版本不低于 _b_ 部分
  * _^a_ — 要求主编译器版本不低于 _a_ 部分

对于其他比较运算符（_=_, _>_, _>=_, _<_, _<=_）简略格式假定省略部分为零，即：
* _>a.b_ 等同于 _>a.b.0_（因此不匹配 _a.b.0_ 版本）
* _<=a_ 等同于 _<=a.0.0_（因此不匹配 _a.0.1_ 版本）
* _^a.b.0_ **不** 等同于 _^a.b_

例如，_^a.1.2_ 匹配 _a.1.3_ 但不匹配 _a.2.3_ 或 _a.1.0_，然而，_^a.1_ 匹配它们所有。

可以多次使用此指令；编译器版本必须满足所有提供的条件。

### #pragma not-version
此编译指令的语法与版本编译指令相同，但如果条件满足则会失败。

例如，它可以用于将已知有问题的特定版本列入黑名单。

### #pragma allow-post-modification
_funC v0.4.1_

默认情况下，禁止在同一表达式中先使用变量后修改它。换句话说，表达式 `(x, y) = (ds, ds~load_uint(8))` 无法编译，而 `(x, y) = (ds~load_uint(8), ds)` 是有效的。

可以通过 `#pragma allow-post-modification` 覆盖此规则，允许在批量赋值和函数调用中在使用后修改变量；如常规，子表达式将从左到右计算：`(x, y) = (ds, ds~load_bits(8))` 将导致 `x` 包含初始 `ds`；`f(ds, ds~load_bits(8))` `f` 的第一个参数将包含初始 `ds`，第二个参数 - `ds` 的 8 位。

`#pragma allow-post-modification` 仅适用于编译指令之后的代码。

### #pragma compute-asm-ltr
_funC v0.4.1_

Asm 声明可以覆盖参数的顺序，例如在以下表达式中

```func
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref())
```

解析顺序将是：`load_ref()`、`load_uint(256)`、`load_dict()` 和 `load_uint(8)`，由于以下 asm 声明（注意 `asm(value index dict key_len)`）：

```func
cell idict_set_ref(cell dict, int key_len, int index, cell value) asm(value index dict key_len) "DICTISETREF";
```

可以通过 `#pragma compute-asm-ltr` 更改为严格的从左到右的计算顺序

因此，在
```func
#pragma compute-asm-ltr
...
idict_set_ref(ds~load_dict(), ds~load_uint(8), ds~load_uint(256), ds~load_ref());
```
中解析顺序将是 `load_dict()`、`load_uint(8)`、`load_uint(256)`、`load_ref()`，所有 asm 排列将在计算之后发生。

`#pragma compute-asm-ltr` 仅适用于编译指令之后的代码。
