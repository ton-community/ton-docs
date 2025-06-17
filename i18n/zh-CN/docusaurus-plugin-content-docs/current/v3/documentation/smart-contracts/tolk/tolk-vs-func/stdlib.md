import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC：标准库

FunC 有一个丰富的 [标准库](/v3/documentation/smart-contracts/func/docs/stdlib)，
，称为 _"stdlib.fc "_ 文件。它相当低级，包含大量与 TVM 命令命名非常接近的 `asm` 函数
。 It's quite low-level and contains many `asm` functions
closely related to [TVM instructions](/v3/documentation/tvm/instructions/).

Tolk 也有一个基于 FunC 的标准库。三个主要区别 Three main differences:

1. 它分为多个文件：`common.tlk`、`tvm-dicts.tlk` 和其他文件。来自 `common.tolk` 的函数始终可用。其他文件中的函数在导入后可用： Functions from `common.tolk` are always available. Functions from other files are available after import:

```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```

2. 您无需从 GitHub 下载，它是 Tolk 发行版的一部分。
3. 几乎所有 FunC 函数都被重命名为 ~~verbose~~ 清晰的名称。这样，当您编写合约或阅读示例时，就能更好地理解发生了什么。

## Functions vs methods

In FunC, there are no methods, actually. All functions are global-scoped.\
You just call any function via dot:

```func
;; FunC
cell config_param(int x) asm "CONFIGOPTPARAM";

config_param(16);   ;; ok
16.config_param();  ;; also ok...
```

So, when you call `b.end_cell()`, you actually call a global function `end_cell`.
Since all functions are global-scoped, there are no "short methods."

```func
someTuple.tuple_size();
;; why not someTuple.size()? because it's a global function:
;; int tuple_size(tuple t)
```

**Tolk separates functions and methods** like it's done in most languages:

1. functions can NOT be called via dot, only methods can
2. methods can have short names, they don't conflict

```tolk
// FunC
someCell.cell_hash();     // or cell_hash(someCell)
someSlice.slice_hash();

// Tolk
someCell.hash();          // the only possible
someSlice.hash();
```

## 重命名函数列表

如果 "Required import（需要导入）"列为空，则表示函数无需导入即可使用。

请注意，有些函数被删除，因为它们要么可以用语法表达，
，要么在实践中非常不常见。

The table is "sorted" in a way how functions are declared in stdlib.fc:

| FunC name                                                                                       | Tolk name                                                                                    | Required import |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- |
| empty_tuple                                                                | createEmptyTuple                                                                             |                 |
| tpush                                                                                           | tupleAt                                                                                      |                 |
| first(t) or dot t.first()                 | tupleFirst                                                                                   |                 |
| at(t,i) or dot t.at(i)                    | t.get(i) or just t.0 etc. |                 |
| touch                                                                                           | stackMoveToTop                                                                               | tvm-lowlevel    |
| impure_touch                                                               | _(deleted)_                                                               |                 |
| single                                                                                          | _(deleted)_                                                               |                 |
| unsingle                                                                                        | _(deleted)_                                                               |                 |
| pair                                                                                            | _(deleted)_                                                               |                 |
| unpair                                                                                          | _(deleted)_                                                               |                 |
| triple                                                                                          | _(deleted)_                                                               |                 |
| untriple                                                                                        | _(deleted)_                                                               |                 |
| tuple4                                                                                          | _(deleted)_                                                               |                 |
| untuple4                                                                                        | _(deleted)_                                                               |                 |
| second                                                                                          | _(deleted)_                                                               |                 |
| third                                                                                           | _(deleted)_                                                               |                 |
| fourth                                                                                          | _(deleted)_                                                               |                 |
| pair_first                                                                 | _(deleted)_                                                               |                 |
| pair_second                                                                | _(deleted)_                                                               |                 |
| triple_first                                                               | _(deleted)_                                                               |                 |
| triple_second                                                              | _(deleted)_                                                               |                 |
| triple_third                                                               | _(deleted)_                                                               |                 |
| minmax                                                                                          | minMax                                                                                       |                 |
| now                                                                                             | blockchain.now                                                               |                 |
| my_address                                                                 | parseAddress                                                                                 |                 |
| get_balance                                                                | contract.getOriginalBalance                                                  |                 |
| cur_lt                                                                     | getLogicalTime                                                                               |                 |
| block_lt                                                                   | getCurrentBlockLogicalTime                                                                   |                 |
| cell_hash                                                                  | cellHash                                                                                     |                 |
| slice_hash                                                                 | sliceHash                                                                                    |                 |
| string_hash                                                                | stringHash                                                                                   |                 |
| check_signature                                                            | isSignatureValid                                                                             |                 |
| check_data_signature                                  | isSliceSignatureValid                                                                        |                 |
| compute_data_size                                     | calculateCellSizeStrict                                                                      |                 |
| slice_compute_data_size          | calculateSliceSizeStrict                                                                     |                 |
| compute_data_size?                                    | calculateCellSize                                                                            |                 |
| slice_compute_data_size?         | calculateSliceSize                                                                           |                 |
| ~dump                                                                           | debugPrint                                                                                   |                 |
| ~strdump                                                                        | debugPrintString                                                                             |                 |
| dump_stack                                                                 | debugDumpStack                                                                               |                 |
| get_data                                                                   | getContractData                                                                              |                 |
| set_data                                                                   | setContractData                                                                              |                 |
| get_c3                                                                     | getTvmRegisterC3                                                                             | tvm-lowlevel    |
| set_c3                                                                     | setTvmRegisterC3                                                                             | tvm-lowlevel    |
| bless                                                                                           | transformSliceToContinuation                                                                 | tvm-lowlevel    |
| accept_message                                                             | acceptExternalMessage                                                                        |                 |
| set_gas_limit                                         | setGasLimit                                                                                  |                 |
| buy_gas                                                                    | _(deleted)_                                                               |                 |
| commit                                                                                          | commitContractDataAndActions                                                                 |                 |
| divmod                                                                                          | divMod                                                                                       |                 |
| moddiv                                                                                          | modDiv                                                                                       |                 |
| muldiv                                                                                          | mulDivFloor                                                                                  |                 |
| muldivr                                                                                         | mulDivRound                                                                                  |                 |
| muldivc                                                                                         | mulDivCeil                                                                                   |                 |
| muldivmod                                                                                       | mulDivMod                                                                                    |                 |
| begin_parse                                                                | beginParse                                                                                   |                 |
| end_parse                                                                  | assertEndOfSlice                                                                             |                 |
| load_ref                                                                   | loadRef                                                                                      |                 |
| preload_ref                                                                | preloadRef                                                                                   |                 |
| load_int                                                                   | loadInt                                                                                      |                 |
| load_uint                                                                  | loadUint                                                                                     |                 |
| preload_int                                                                | preloadInt                                                                                   |                 |
| preload_uint                                                               | preloadUint                                                                                  |                 |
| load_bits                                                                  | loadBits                                                                                     |                 |
| preload_bits                                                               | preloadBits                                                                                  |                 |
| load_grams                                                                 | loadCoins                                                                                    |                 |
| load_coins                                                                 | loadCoins                                                                                    |                 |
| skip_bits                                                                  | skipBits                                                                                     |                 |
| first_bits                                                                 | getFirstBits                                                                                 |                 |
| skip_last_bits                                        | removeLastBits                                                                               |                 |
| slice_last                                                                 | getLastBits                                                                                  |                 |
| load_dict                                                                  | loadDict                                                                                     |                 |
| preload_dict                                                               | preloadDict                                                                                  |                 |
| skip_dict                                                                  | skipDict                                                                                     |                 |
| load_maybe_ref                                        | loadMaybeRef                                                                                 |                 |
| preload_maybe_ref                                     | preloadMaybeRef                                                                              |                 |
| getCellDepth                                                                                    | cell_depth                                                              |                 |
| slice_refs                                                                 | getRemainingRefsCount                                                                        |                 |
| slice_bits                                                                 | getRemainingBitsCount                                                                        |                 |
| slice_bits_refs                                       | getRemainingBitsAndRefsCount                                                                 |                 |
| slice_empty?                                                               | isEndOfSlice                                                                                 |                 |
| slice_data_empty?                                     | isEndOfSliceBits                                                                             |                 |
| slice_refs_empty?                                     | isEndOfSliceRefs                                                                             |                 |
| getSliceDepth                                                                                   | slice_depth                                                             |                 |
| equal_slice_bits                                      | a.bitsEqual(b)                                            |                 |
| builder_refs                                                               | getBuilderRefsCount                                                                          |                 |
| builder_bits                                                               | getBuilderBitsCount                                                                          |                 |
| getBuilderDepth                                                                                 | builder_depth                                                           |                 |
| begin_cell                                                                 | beginCell                                                                                    |                 |
| end_cell                                                                   | endCell                                                                                      |                 |
| store_ref                                                                  | storeRef                                                                                     |                 |
| store_uint                                                                 | storeUint                                                                                    |                 |
| store_int                                                                  | storeInt                                                                                     |                 |
| store_slice                                                                | storeSlice                                                                                   |                 |
| store_grams                                                                | storeCoins                                                                                   |                 |
| store_coins                                                                | storeCoins                                                                                   |                 |
| store_dict                                                                 | storeDict                                                                                    |                 |
| store_maybe_ref                                       | storeMaybeRef                                                                                |                 |
| store_builder                                                              | storeBuilder                                                                                 |                 |
| load_msg_addr                                         | loadAddress                                                                                  |                 |
| parse_addr                                                                 | _(deleted)_                                                               |                 |
| parse_std_addr                                        | parseStandardAddress                                                                         |                 |
| parse_var_addr                                        | _(deleted)_                                                               |                 |
| config_param                                                               | getBlockchainConfigParam                                                                     |                 |
| raw_reserve                                                                | reserveToncoinsOnBalance                                                                     |                 |
| raw_reserve_extra                                     | reserveExtraCurrenciesOnBalance                                                              |                 |
| send_raw_message                                      | sendRawMessage                                                                               |                 |
| set_code                                                                   | setContractCodePostponed                                                                     |                 |
| at                                                                                              | isSliceBitsEqual                                                                             |                 |
| rand                                                                                            | randomRange                                                                                  |                 |
| get_seed                                                                   | randomGetSeed                                                                                |                 |
| set_seed                                                                   | randomSetSeed                                                                                |                 |
| randomize                                                                                       | randomizeByLogicalTime                                                                       |                 |
| randomize_lt                                                               | randomizeBy                                                                                  |                 |
| dump                                                                                            | debugPrint                                                                                   |                 |
| strdump                                                                                         | debugPrintString                                                                             |                 |
| dump_stk                                                                   | debugDumpStack                                                                               |                 |
| empty_list                                                                 | createEmptyList                                                                              | lisp-lists      |
| cons                                                                                            | listPrepend                                                                                  | lisp-lists      |
| uncons                                                                                          | listSplit                                                                                    | lisp-lists      |
| list_next                                                                  | listNext                                                                                     | lisp-lists      |
| car                                                                                             | listGetHead                                                                                  | lisp-lists      |
| cdr                                                                                             | listGetTail                                                                                  | lisp-lists      |
| new_dict                                                                   | createEmptyDict                                                                              | tvm-dicts       |
| dict_empty?                                                                | dictIsEmpty                                                                                  | tvm-dicts       |
| idict_set_ref                                         | iDictSetRef                                                                                  | tvm-dicts       |
| udict_set_ref                                         | uDictSetRef                                                                                  | tvm-dicts       |
| idict_get_ref                                         | iDictGetRefOrNull                                                                            | tvm-dicts       |
| idict_get_ref?                                        | iDictGetRef                                                                                  | tvm-dicts       |
| udict_get_ref?                                        | uDictGetRef                                                                                  | tvm-dicts       |
| idict_set_get_ref                | iDictSetAndGetRefOrNull                                                                      | tvm-dicts       |
| udict_set_get_ref                | iDictSetAndGetRefOrNull                                                                      | tvm-dicts       |
| idict_delete?                                                              | iDictDelete                                                                                  | tvm-dicts       |
| udict_delete?                                                              | uDictDelete                                                                                  | tvm-dicts       |
| idict_get?                                                                 | iDictGet                                                                                     | tvm-dicts       |
| udict_get?                                                                 | uDictGet                                                                                     | tvm-dicts       |
| idict_delete_get?                                     | iDictDeleteAndGet                                                                            | tvm-dicts       |
| udict_delete_get?                                     | uDictDeleteAndGet                                                                            | tvm-dicts       |
| udict_set                                                                  | uDictSet                                                                                     | tvm-dicts       |
| idict_set                                                                  | iDictSet                                                                                     | tvm-dicts       |
| dict_set                                                                   | sDictSet                                                                                     | tvm-dicts       |
| udict_add?                                                                 | uDictSetIfNotExists                                                                          | tvm-dicts       |
| udict_replace?                                                             | uDictSetIfExists                                                                             | tvm-dicts       |
| idict_add?                                                                 | iDictSetIfNotExists                                                                          | tvm-dicts       |
| idict_replace?                                                             | iDictSetIfExists                                                                             | tvm-dicts       |
| udict_set_builder                                     | uDictSetBuilder                                                                              | tvm-dicts       |
| idict_set_builder                                     | iDictSetBuilder                                                                              | tvm-dicts       |
| dict_set_builder                                      | sDictSetBuilder                                                                              | tvm-dicts       |
| udict_add_builder?                                    | uDictSetBuilderIfNotExists                                                                   | tvm-dicts       |
| udict_replace_builder?                                | uDictSetBuilderIfExists                                                                      | tvm-dicts       |
| idict_add_builder?                                    | iDictSetBuilderIfNotExists                                                                   | tvm-dicts       |
| idict_replace_builder?                                | iDictSetBuilderIfExists                                                                      | tvm-dicts       |
| udict_delete_get_min             | uDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| idict_delete_get_min             | iDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| dict_delete_get_min              | sDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| udict_delete_get_max             | uDictDeleteLastAndGet                                                                        | tvm-dicts       |
| idict_delete_get_max             | iDictDeleteLastAndGet                                                                        | tvm-dicts       |
| dict_delete_get_max              | sDictDeleteLastAndGet                                                                        | tvm-dicts       |
| udict_get_min?                                        | uDictGetFirst                                                                                | tvm-dicts       |
| udict_get_max?                                        | uDictGetLast                                                                                 | tvm-dicts       |
| udict_get_min_ref?               | uDictGetFirstAsRef                                                                           | tvm-dicts       |
| udict_get_max_ref?               | uDictGetLastAsRef                                                                            | tvm-dicts       |
| idict_get_min?                                        | iDictGetFirst                                                                                | tvm-dicts       |
| idict_get_max?                                        | iDictGetLast                                                                                 | tvm-dicts       |
| idict_get_min_ref?               | iDictGetFirstAsRef                                                                           | tvm-dicts       |
| idict_get_max_ref?               | iDictGetLastAsRef                                                                            | tvm-dicts       |
| udict_get_next?                                       | uDictGetNext                                                                                 | tvm-dicts       |
| udict_get_nexteq?                                     | uDictGetNextOrEqual                                                                          | tvm-dicts       |
| udict_get_prev?                                       | uDictGetPrev                                                                                 | tvm-dicts       |
| udict_get_preveq?                                     | uDictGetPrevOrEqual                                                                          | tvm-dicts       |
| idict_get_next?                                       | iDictGetNext                                                                                 | tvm-dicts       |
| idict_get_nexteq?                                     | iDictGetNextOrEqual                                                                          | tvm-dicts       |
| idict_get_prev?                                       | iDictGetPrev                                                                                 | tvm-dicts       |
| idict_get_preveq?                                     | iDictGetPrevOrEqual                                                                          | tvm-dicts       |
| udict::delete_get_min | uDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| idict::delete_get_min | iDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| dict::delete_get_min  | sDictDeleteFirstAndGet                                                                       | tvm-dicts       |
| udict::delete_get_max | uDictDeleteLastAndGet                                                                        | tvm-dicts       |
| idict::delete_get_max | iDictDeleteLastAndGet                                                                        | tvm-dicts       |
| dict::delete_get_max  | sDictDeleteLastAndGet                                                                        | tvm-dicts       |
| pfxdict_get?                                                               | prefixDictGet                                                                                | tvm-dicts       |
| pfxdict_set?                                                               | prefixDictSet                                                                                | tvm-dicts       |
| pfxdict_delete?                                                            | prefixDictDelete                                                                             | tvm-dicts       |

## 新增功能列表

Tolk 标准库中有一些 FunC 中没有的函数，但在日常工作中却很常用。

由于 Tolk 正在积极开发，其标准库也在不断变化，因此最好考虑使用源代码 [此处](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib) 中的 `tolk-stdlib/` 文件夹
。
除了函数，这里还添加了一些常量：`SEND_MODE_*`、`RESERVE_MODE_*` 等。
Besides functions, there some constants were added: `SEND_MODE_*`, `RESERVE_MODE_*`, etc.

一旦 FunC 被弃用，有关 Tolk stdlib 的文档将全部重写。

请记住，上述所有函数实际上都是 TVM 汇编程序的封装器。如果缺少什么，
，你可以很容易地自己封装任何 TVM 指令。 If something is missing,
you can quickly wrap any TVM instruction yourself.

## 某些函数变得易变，不返回副本

<table className="cmp-func-tolk-table">
  <thead>
  <tr>
    <th>FunC</th>
    <th>Tolk</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>{'int flags = cs~load_uint(32);'}</code></td>
    <td><code>{'var flags = cs.loadUint(32);'}</code></td>
  </tr>
  <tr>
    <td><code>{'dict~udict_set(...);'}</code></td>
    <td><code>{'dict.uDictSet(...);'}</code></td>
  </tr>
  <tr>
    <td>...</td>
    <td>...</td>
  </tr>
  </tbody>
</table>

大多数在实践中使用 `~`（波浪号）的 FunC 函数，现在会直接修改对象，详见上述示例。

例如，如果您使用了 `dict~udict_set(…)`，只需使用 `dict.uDictSet(…)`，一切都会好起来。
但如果使用 `dict.udict_set(…)` 来获取副本，则需要用其他方式来表达。
But if you used `dict.udict_set(…)` to obtain a copy, you'll need to express it another way.

[了解可变性](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability)。

## 嵌入式 stdlib 在引擎盖下如何工作

As told above, all standard functions are available out of the box.
如上所述，所有标准功能都是开箱即用的。
是的，对于非通用函数，你需要 "导入"（这是有意为之），但仍然不需要外部下载。

It works the following way.

Tolk 编译器启动后做的第一件事就是通过搜索相对于可执行二进制文件的预定义路径来定位 stdlib 文件夹。
例如，如果从安装的软件包启动 Tolk 编译器 (如 `/usr/bin/tolk`)，则将 stdlib 定位在 `/usr/share/ton/smartcont`。
如果是非标准安装，可以通过 `TOLK_STDLIB` 环境变量。这是编译器的标准做法。
For example, if you launch the Tolk compiler from a package installed (e.g. `/usr/bin/tolk`), locate stdlib in `/usr/share/ton/smartcont`.
You may pass the `TOLK_STDLIB` env variable if you have a non-standard installation. It's standard practice for compilers.

WASM wrapper [tolk-js](https://github.com/ton-blockchain/tolk-js) 也包含 stdlib。
因此，当你使用 tolk-js 或 blueprint 时，所有 stdlib 函数仍然是开箱即用的。
So, when you take tolk-js or blueprint, all stdlib functions are still available out of the box.

JetBrains and VS Code IDE plugins also auto-locate stdlib to provide auto-completion.
集成开发环境插件（JetBrains 和 VS Code）也会自动定位 stdlib 以提供自动完成功能。
如果使用 blueprint，它会自动安装 tolk-js，因此项目文件结构中会出现 `node_modules/@ton/tolk-js/` 文件夹。
里面有 `common.tolk`, `tvm-dicts.tolk` 等文件。
Inside are `common.tolk`, `tvm-dicts.tolk`, and others.

<Feedback />

