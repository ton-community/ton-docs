import Feedback from '@site/src/components/Feedback';

# Tolk vs FunC: standard library

FunC has a rich [standard library](/v3/documentation/smart-contracts/func/docs/stdlib),
known as *"stdlib.fc"* file. It's quite low-level and contains many `asm` functions
closely related to [TVM instructions](/v3/documentation/tvm/instructions/).

Tolk also has a standard library based on a FunC one. Three main differences:
1. It's split into multiple files: `common.tolk`, `tvm-dicts.tolk`, and others. Functions from `common.tolk` are always available. Functions from other files are available after import:
```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```
2. You don't need to download it from GitHub; it's a part of Tolk distribution. 
3. Tolk has functions and methods (called via dot), lots of global FunC functions became methods of builder/slice/etc. (and can't be called as functions)


## Functions vs methods

In FunC, there are no methods, actually. All functions are global-scoped.  
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
1) functions can NOT be called via dot, only methods can
2) methods can have short names, they don't conflict

```tolk
// FunC
someCell.cell_hash();     // or cell_hash(someCell)
someSlice.slice_hash();

// Tolk
someCell.hash();          // the only possible
someSlice.hash();
```


## A list of renamed functions

If the **Required import** column is empty, a function is available without imports.

Note that some functions were deleted because they either can be expressed syntactically,
or they were very uncommon in practice.

The table is "sorted" in a way how functions are declared in stdlib.fc:

| FunC name                         | Tolk name                          | Required import |
|-----------------------------------|------------------------------------|-----------------|
| empty_tuple                       | createEmptyTuple                   |                 |
| t~tpush                           | t.push(v)                          |                 |
| first(t) or dot t.first()         | t.first()                          |                 |
| at(t,i) or dot t.at(i)            | t.get(i) or just t.0 etc.          |                 |
| touch(v) or dot                   | v.stackMoveToTop()                 | tvm-lowlevel    |
| impure_touch                      | *(deleted)*                        |                 |
| single                            | *(deleted)*                        |                 | 
| unsingle                          | *(deleted)*                        |                 | 
| pair                              | *(deleted)*                        |                 | 
| unpair                            | *(deleted)*                        |                 | 
| triple                            | *(deleted)*                        |                 | 
| untriple                          | *(deleted)*                        |                 | 
| tuple4                            | *(deleted)*                        |                 | 
| untuple4                          | *(deleted)*                        |                 | 
| second                            | *(deleted)*                        |                 | 
| third                             | *(deleted)*                        |                 | 
| fourth                            | *(deleted)*                        |                 | 
| pair_first                        | *(deleted)*                        |                 | 
| pair_second                       | *(deleted)*                        |                 | 
| triple_first                      | *(deleted)*                        |                 | 
| triple_second                     | *(deleted)*                        |                 | 
| triple_third                      | *(deleted)*                        |                 | 
| minmax                            | minMax                             |                 |
| now                               | blockchain.now                     |                 |
| my_address                        | contract.getAddress                |                 |
| get_balance + pair_first          | contract.getOriginalBalance        |                 |
| cur_lt                            | blockchain.logicalTime             |                 |
| block_lt                          | blockchain.currentBlockLogicalTime |                 |
| cell_hash(c) or dot               | c.hash()                           |                 |
| slice_hash(s) or dot              | s.hash()                           |                 |
| string_hash(s) or dot             | s.bitsHash()                       |                 |
| check_signature                   | isSignatureValid                   |                 |
| check_data_signature              | isSliceSignatureValid              |                 |
| compute_data_size(c) or dot       | c.calculateSizeStrict()            |                 |
| slice_compute_data_size(s) or dot | s.calculateSizeStrict()            |                 |
| c.compute_data_size?() or dot     | c.calculateSize()                  |                 |
| slice_compute_data_size?() or dot | s.calculateSize()                  |                 |
| ~dump                             | debug.print                        |                 |
| ~strdump                          | debug.printString                  |                 |
| dump_stack                        | debug.dumpStack                    |                 |
| get_data                          | contract.getData                   |                 |
| set_data                          | contract.setData                   |                 |
| get_c3                            | getTvmRegisterC3                   | tvm-lowlevel    |
| set_c3                            | setTvmRegisterC3                   | tvm-lowlevel    |
| bless                             | transformSliceToContinuation       | tvm-lowlevel    |
| accept_message                    | acceptExternalMessage              |                 |
| set_gas_limit                     | setGasLimit                        |                 |
| buy_gas                           | *(deleted)*                        |                 |
| commit                            | commitContractDataAndActions       |                 |
| divmod                            | divMod                             |                 |
| moddiv                            | modDiv                             |                 |
| muldiv                            | mulDivFloor                        |                 |
| muldivr                           | mulDivRound                        |                 |
| muldivc                           | mulDivCeil                         |                 |
| muldivmod                         | mulDivMod                          |                 |
| begin_parse                       | beginParse                         |                 |
| end_parse(s) or dot               | s.assertEnd()                      |                 |
| load_ref                          | loadRef                            |                 |
| preload_ref                       | preloadRef                         |                 |
| load_int                          | loadInt                            |                 |
| load_uint                         | loadUint                           |                 |
| preload_int                       | preloadInt                         |                 |
| preload_uint                      | preloadUint                        |                 |
| load_bits                         | loadBits                           |                 |
| preload_bits                      | preloadBits                        |                 |
| load_grams                        | loadCoins                          |                 |
| load_coins                        | loadCoins                          |                 |
| skip_bits                         | s.skipBits                         |                 |
| first_bits                        | getFirstBits                       |                 |
| skip_last_bits                    | removeLastBits                     |                 |
| slice_last                        | getLastBits                        |                 |
| load_dict                         | loadDict                           |                 |
| preload_dict                      | preloadDict                        |                 |
| skip_dict                         | skipDict                           |                 |
| load_maybe_ref                    | loadMaybeRef                       |                 |
| preload_maybe_ref                 | preloadMaybeRef                    |                 |
| cell_depth(c) or dot              | c.depth()                          |                 |
| slice_refs(s) or dot              | s.remainingRefsCount()             |                 |
| slice_bits(s) or dot              | s.remainingBitsCount()             |                 |
| slice_bits_refs(s) or dot         | s.remainingBitsAndRefsCount()      |                 |
| slice_empty?(s) or dot            | s.isEnd()                          |                 |
| slice_data_empty?(s) or dot       | s.isEndOfBits()                    |                 |
| slice_refs_empty?(s) or dot       | s.isEndOfRefs()                    |                 |
| slice_depth(s) or dot             | s.depth()                          |                 |
| equal_slice_bits(a,b) or dot      | a.bitsEqual(b)                     |                 |
| builder_refs(b) or dot            | b.refsCount()                      |                 |
| builder_bits(b) or dot            | b.bitsCount()                      |                 |
| builder_depth(b) or dot           | b.depth()                          |                 |
| begin_cell                        | beginCell                          |                 |
| end_cell                          | endCell                            |                 |
| store_ref                         | storeRef                           |                 |
| store_uint                        | storeUint                          |                 |
| store_int                         | storeInt                           |                 |
| store_slice                       | storeSlice                         |                 |
| store_grams                       | storeCoins                         |                 |
| store_coins                       | storeCoins                         |                 |
| store_dict                        | storeDict                          |                 |
| store_maybe_ref                   | storeMaybeRef                      |                 |
| store_builder                     | storeBuilder                       |                 |
| load_msg_addr                     | loadAddress                        |                 |
| parse_addr                        | *(deleted)*                        |                 |
| parse_std_addr                    | parseStandardAddress               |                 |
| parse_var_addr                    | *(deleted)*                        |                 |
| config_param                      | blockchain.configParam             |                 |
| raw_reserve                       | reserveToncoinsOnBalance           |                 |
| raw_reserve_extra                 | reserveExtraCurrenciesOnBalance    |                 |
| send_raw_message                  | sendRawMessage                     |                 |
| set_code                          | contract.setCodePostponed          |                 |
| random                            | random.uint256                     |                 |
| rand                              | random.range                       |                 |
| get_seed                          | random.getSeed                     |                 |
| set_seed                          | random.setSeed                     |                 |
| randomize                         | random.initializeBy                |                 |
| randomize_lt                      | random.initialize                  |                 |
| dump                              | debug.print                        |                 |
| strdump                           | debug.printString                  |                 |
| dump_stk                          | debug.dumpStack                    |                 |
| empty_list                        | createEmptyList                    | lisp-lists      |
| cons                              | listPrepend                        | lisp-lists      |
| uncons                            | listSplit                          | lisp-lists      |
| list_next                         | listNext                           | lisp-lists      |
| car                               | listGetHead                        | lisp-lists      |
| cdr                               | listGetTail                        | lisp-lists      |
| new_dict                          | createEmptyDict                    | tvm-dicts       |
| dict_empty?(d) or dot             | d.dictIsEmpty                      | tvm-dicts       |
| idict_set_ref                     | iDictSetRef                        | tvm-dicts       |
| udict_set_ref                     | uDictSetRef                        | tvm-dicts       |
| idict_get_ref                     | iDictGetRefOrNull                  | tvm-dicts       |
| idict_get_ref?                    | iDictGetRef                        | tvm-dicts       |
| udict_get_ref?                    | uDictGetRef                        | tvm-dicts       |
| idict_set_get_ref                 | iDictSetAndGetRefOrNull            | tvm-dicts       |
| udict_set_get_ref                 | iDictSetAndGetRefOrNull            | tvm-dicts       |
| idict_delete?                     | iDictDelete                        | tvm-dicts       |
| udict_delete?                     | uDictDelete                        | tvm-dicts       |
| idict_get?                        | iDictGet                           | tvm-dicts       |
| udict_get?                        | uDictGet                           | tvm-dicts       |
| idict_delete_get?                 | iDictDeleteAndGet                  | tvm-dicts       |
| udict_delete_get?                 | uDictDeleteAndGet                  | tvm-dicts       |
| udict_set                         | uDictSet                           | tvm-dicts       |
| idict_set                         | iDictSet                           | tvm-dicts       |
| dict_set                          | sDictSet                           | tvm-dicts       |
| udict_add?                        | uDictSetIfNotExists                | tvm-dicts       |
| udict_replace?                    | uDictSetIfExists                   | tvm-dicts       |
| idict_add?                        | iDictSetIfNotExists                | tvm-dicts       |
| idict_replace?                    | iDictSetIfExists                   | tvm-dicts       |
| udict_set_builder                 | uDictSetBuilder                    | tvm-dicts       |
| idict_set_builder                 | iDictSetBuilder                    | tvm-dicts       |
| dict_set_builder                  | sDictSetBuilder                    | tvm-dicts       |
| udict_add_builder?                | uDictSetBuilderIfNotExists         | tvm-dicts       |
| udict_replace_builder?            | uDictSetBuilderIfExists            | tvm-dicts       |
| idict_add_builder?                | iDictSetBuilderIfNotExists         | tvm-dicts       |
| idict_replace_builder?            | iDictSetBuilderIfExists            | tvm-dicts       |
| udict_delete_get_min              | uDictDeleteFirstAndGet             | tvm-dicts       |
| idict_delete_get_min              | iDictDeleteFirstAndGet             | tvm-dicts       |
| dict_delete_get_min               | sDictDeleteFirstAndGet             | tvm-dicts       |
| udict_delete_get_max              | uDictDeleteLastAndGet              | tvm-dicts       |
| idict_delete_get_max              | iDictDeleteLastAndGet              | tvm-dicts       |
| dict_delete_get_max               | sDictDeleteLastAndGet              | tvm-dicts       |
| udict_get_min?                    | uDictGetFirst                      | tvm-dicts       |
| udict_get_max?                    | uDictGetLast                       | tvm-dicts       |
| udict_get_min_ref?                | uDictGetFirstAsRef                 | tvm-dicts       |
| udict_get_max_ref?                | uDictGetLastAsRef                  | tvm-dicts       |
| idict_get_min?                    | iDictGetFirst                      | tvm-dicts       |
| idict_get_max?                    | iDictGetLast                       | tvm-dicts       |
| idict_get_min_ref?                | iDictGetFirstAsRef                 | tvm-dicts       |
| idict_get_max_ref?                | iDictGetLastAsRef                  | tvm-dicts       |
| udict_get_next?                   | uDictGetNext                       | tvm-dicts       |
| udict_get_nexteq?                 | uDictGetNextOrEqual                | tvm-dicts       |
| udict_get_prev?                   | uDictGetPrev                       | tvm-dicts       |
| udict_get_preveq?                 | uDictGetPrevOrEqual                | tvm-dicts       |
| idict_get_next?                   | iDictGetNext                       | tvm-dicts       |
| idict_get_nexteq?                 | iDictGetNextOrEqual                | tvm-dicts       |
| idict_get_prev?                   | iDictGetPrev                       | tvm-dicts       |
| idict_get_preveq?                 | iDictGetPrevOrEqual                | tvm-dicts       |
| udict::delete_get_min             | uDictDeleteFirstAndGet             | tvm-dicts       |
| idict::delete_get_min             | iDictDeleteFirstAndGet             | tvm-dicts       |
| dict::delete_get_min              | sDictDeleteFirstAndGet             | tvm-dicts       |
| udict::delete_get_max             | uDictDeleteLastAndGet              | tvm-dicts       |
| idict::delete_get_max             | iDictDeleteLastAndGet              | tvm-dicts       |
| dict::delete_get_max              | sDictDeleteLastAndGet              | tvm-dicts       |
| pfxdict_get?                      | prefixDictGet                      | tvm-dicts       |
| pfxdict_set?                      | prefixDictSet                      | tvm-dicts       |
| pfxdict_delete?                   | prefixDictDelete                   | tvm-dicts       |


## A list of added functions

Tolk standard library has some functions missing in FunC but is pretty typical for everyday tasks.

Since Tolk is actively developed, and its standard library changes, it better considers the `tolk-stdlib/` folder
in sources [here](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib).
Besides functions, there some constants were added: `SEND_MODE_*`, `RESERVE_MODE_*`, etc.

When FunC becomes deprecated, the documentation about Tolk stdlib will be rewritten entirely, anyway.

Remember that all the functions above are wrappers over the TVM assembler. If something is missing,
you can quickly wrap any TVM instruction yourself.


## Some functions became mutating, not returning a copy

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

Most FunC functions used with `~` tilda in practice now mutate the object; see examples above.

For example, if you used `dict~udict_set(…)`, just use `dict.uDictSet(…)`, and everything is fine. 
But if you used `dict.udict_set(…)` to obtain a copy, you'll need to express it another way.

[Read about mutability](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability).


## How does embedded stdlib work under the hood?

As told above, all standard functions are available out of the box. 
You need `import` for non-common functions (it's intentional), but still, no external downloads.

It works the following way.

The first thing the Tolk compiler does at the start is locate the stdlib folder by searching predefined paths relative to an executable binary. 
For example, if you launch the Tolk compiler from a package installed (e.g. `/usr/bin/tolk`), locate stdlib in `/usr/share/ton/smartcont`. 
You may pass the `TOLK_STDLIB` env variable if you have a non-standard installation. It's standard practice for compilers.

A WASM wrapper [tolk-js](https://github.com/ton-blockchain/tolk-js) also contains stdlib. 
So, when you take tolk-js or blueprint, all stdlib functions are still available out of the box.

JetBrains and VS Code IDE plugins also auto-locate stdlib to provide auto-completion. 
If you use blueprint, it automatically installs tolk-js; therefore, folder `node_modules/@ton/tolk-js/` exists in your project file structure.
Inside are `common.tolk`, `tvm-dicts.tolk`, and others. 

<Feedback />

