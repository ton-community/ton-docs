# Tolk vs FunC：简而言之

与 C 和 Lisp 相比，Tolk 与 TypeScript 和 Kotlin 更为相似。
但它仍然可以让你完全控制 TVM 汇编程序，因为它内部有一个 FunC 内核。

1. 函数通过 `fun` 声明，获取方法通过 `get` 声明，变量通过 `var` 声明（不可变变量通过 `val` 声明），类型放在右边；参数类型是强制性的；返回类型可以省略（自动推断），本地类型也可以省略；`inline` 和其他指定符是 `@` 属性。

```tolk
global storedV: int;

fun parseData(cs: slice): cell {
    var flags: int = cs.loadMessageFlags();
    ...
}

@inline
fun sum(a: int, b: int) {   // auto inferred int
    val both = a + b;       // same
    return both;
}

get currentCounter(): int { ... }
```

2. 没有 `impure`，这是默认情况，编译器不会放弃用户函数调用
3. 不是 `recv_internal` 和 `recv_external`，而是 `onInternalMessage` 和 `onExternalMessage` 。
4. `2+2` 是 4，不是标识符；标识符是字母数字；使用命名 `const OP_INCREASE` 而不是 `const op::increase`
5. 支持逻辑运算符 AND `&&`、OR `||`、NOT `!`
6. 语法改进
   - `;; comment` → `// comment`
   - `{- comment -}` → `/* comment */`
   - `#include` → `import`，严格规定 "用什么导入什么"
   - `~ found` → `!found`（显然只适用于真/假）（"true "为-1，就像在 FunC 中一样）
   - `v = null()` → `v = null`
   - `null?(v)` → `v == null`，`builder_null?` 等也是如此
   - `~ null?(v)` → `c != null`
   - `throw(excNo)` → `throw excNo`
   - `catch(_, _)` → `catch`
   - `catch(_, excNo)` → `catch(excNo)`
   - `throw_unless(excNo, cond)` → `assert(cond, excNo)`
   - `throw_if(excNo, cond)` → `assert(!cond, excNo)`
   - `return ()` → `return`
   - `do ... until (cond)` → `do ... while (!cond)`
   - `elseif` → `else if`
   - `ifnot (cond)` → `if (!cond)`
7. 即使函数在下面声明，也可以被调用；不需要正向声明；编译器首先进行解析，然后进行符号解析；现在有了源代码的 AST 表示法
8. stdlib函数重命名为 ~~verbose~~ 清晰的名称，驼峰字体；现在是嵌入式的，而不是从GitHub下载的；它被分成几个文件；常用函数始终可用，更具体的可用 `import "@stdlib/tvm-dicts"`，IDE会建议您使用；这里是[一个映射](/v3/documentation/smart-contracts/tolk/tolk-vs-func/stdlib)
9. 没有使用 `~`（波浪号）方法；例如，`cs.loadInt(32)` 会修改切片并返回一个整数；`b.storeInt(x, 32)` 会修改构建器；`b = b.storeInt()` 也是可行的，因为它不仅会修改构建器，还会返回自身；链式方法的工作方式与 JavaScript 完全一致，返回的是 `self`；整体行为完全符合预期，与 JavaScript 类似；没有运行时开销，使用的指令与 Fift 完全相同；自定义方法的创建非常简单；Tolk 中完全没有波浪号 `~` 的概念。详细信息请参考：[链接](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)。

#### 周边工具

- JetBrains 插件已存在
- VS 代码扩展 [已存在](https://github.com/ton-blockchain/tolk-vscode)
- blueprint 的 WASM 封装器 [已存在](https://github.com/ton-blockchain/tolk-js)
- 甚至还有从 FunC 到 Tolk 的转换器 [已存在](https://github.com/ton-blockchain/convert-func-to-tolk)

#### 下一步行动

[Tolk vs FunC：详细](/v3/documentation/smart-contracts/tolk/tolk-vs-func/in-detail)
