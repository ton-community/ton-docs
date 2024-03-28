# FunC 的历史

# 初始版本
初始版本由 Telegram 完成，并在 2020 年 5 月后停止了积极开发。我们将 2020 年 5 月的版本称为“初始版本”。

# 版本 0.1.0
发布于 [2022 年 5 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.05)。

在这个版本中增加了：
- [常量](/develop/func/literals_identifiers#constants)
- [扩展字符串字面量](/develop/func/literals_identifiers#string-literals)
- [Semver 编译指令](/develop/func/compiler_directives#pragma-version)
- [包含](/develop/func/compiler_directives#pragma-version)

修复：
- 修复了在 Asm.fif 中偶尔出现的错误。

# 版本 0.2.0
发布于 [2022 年 8 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.08)。

在这个版本中增加了：
- 不平衡的 if/else 分支（当某些分支返回而有些则不返回）

修复：
- [FunC 错误处理 while(false) 循环 #377](https://github.com/ton-blockchain/ton/issues/377)
- [FunC 错误生成 ifelse 分支的代码 #374](https://github.com/ton-blockchain/ton/issues/374)
- [FunC 在内联函数中错误返回条件 #370](https://github.com/ton-blockchain/ton/issues/370)
- [Asm.fif: 大型函数体的分割错误地干扰了内联 #375](https://github.com/ton-blockchain/ton/issues/375)

# 版本 0.3.0
发布于 [2022 年 10 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2022.10)。

在这个版本中增加了：
- [多行 asms](/develop/func/functions#multiline-asms)
- 允许对常量和 asms 的重复定义
- 允许对常量进行位操作

# 版本 0.4.0
发布于 [2023 年 1 月更新](https://github.com/ton-blockchain/ton/releases/tag/v2023.01)。

在这个版本中增加了：
- [try/catch 语句](/develop/func/statements#try-catch-statements)
- [throw_arg 函数](/develop/func/builtins#throwing-exceptions)
- 允许就地修改和批量赋值全局变量：`a~inc()` 和 `(a, b) = (3, 5)`，其中 `a` 是全局变量

修复：
- 禁止在同一表达式中使用局部变量后对其进行模糊修改：`var x = (ds, ds~load_uint(32), ds~load_unit(64));` 是禁止的，而 `var x = (ds~load_uint(32), ds~load_unit(64), ds);` 是允许的
- 允许空的内联函数
- 修复罕见的 `while` 优化错误