# Tolk vs FunC: standard library

FunC has a rich [standard library](/v3/documentation/smart-contracts/func/docs/stdlib),
known as *"stdlib.fc"* file. It's quite low-level and contains lots of `asm` functions
named very closely to TVM commands.

Tolk also has a standard library based on a FunC one. Three main differences:
1. It's split in multiple files: `common.tolk`, `tvm-dicts.tolk`, and others. Functions from `common.tolk` are available always. Functions from other files are available after import:
```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```
2. You don't need to download it from GitHub, it's a part of Tolk distribution. 
3. Almost all FunC functions were renamed to ~~verbose~~ clear names. So that when you write contracts or read example, you better understand what's going on.


## A list of renamed functions

If "Required import" column is empty, a function is available without any imports.

Note, that some of the functions were deleted, because they either can be expressed syntactically,
or they were very uncommon in practice.

| FunC name                | Tolk name                               | Required import |
|--------------------------|-----------------------------------------|-----------------|
| empty_tuple              | createEmptyTuple                        |                 |
| tpush                    | tuplePush                               |                 |
| first                    | tupleFirst                              |                 |
| at                       | tupleAt                                 |                 |
| touch                    | stackMoveToTop                          | tvm-lowlevel    |
| impure_touch             | *(deleted)*                             |                 |
| single                   | *(deleted)*                             |                 | 
| unsingle                 | *(deleted)*                             |                 | 
| pair                     | *(deleted)*                             |                 | 
| unpair                   | *(deleted)*                             |                 | 
| triple                   | *(deleted)*                             |                 | 
| untriple                 | *(deleted)*                             |                 | 
| tuple4                   | *(deleted)*                             |                 | 
| untuple4                 | *(deleted)*                             |                 | 
| second                   | *(deleted)*                             |                 | 
| third                    | *(deleted)*                             |                 | 
| fourth                   | *(deleted)*                             |                 | 
| pair_first               | *(deleted)*                             |                 | 
| pair_second              | *(deleted)*                             |                 | 
| triple_first             | *(deleted)*                             |                 | 
| triple_second            | *(deleted)*                             |                 | 
| triple_third             | *(deleted)*                             |                 | 
| minmax                   | minMax                                  |                 |
| my_address               | getMyAddress                            |                 |
| get_balance              | getMyOriginalBalanceWithExtraCurrencies |                 |
| cur_lt                   | getLogicalTime                          |                 |
| block_lt                 | getCurrentBlockLogicalTime              |                 |
| cell_hash                | cellHash                                |                 |
| slice_hash               | sliceHash                               |                 |
| string_hash              | stringHash                              |                 |
| check_signature          | isSignatureValid                        |                 |
| check_data_signature     | isSliceSignatureValid                   |                 |
| compute_data_size        | calculateCellSizeStrict                 |                 |
| slice_compute_data_size  | calculateSliceSizeStrict                |                 |
| compute_data_size?       | calculateCellSize                       |                 |
| slice_compute_data_size? | calculateSliceSize                      |                 |
| ~dump                    | debugPrint                              |                 |
| ~strdump                 | debugPrintString                        |                 |
| dump_stack               | debugDumpStack                          |                 |
| get_data                 | getContractData                         |                 |
| set_data                 | setContractData                         |                 |
| get_c3                   | getTvmRegisterC3                        | tvm-lowlevel    |
| set_c3                   | setTvmRegisterC3                        | tvm-lowlevel    |
| bless                    | transformSliceToContinuation            | tvm-lowlevel    |
| accept_message           | acceptExternalMessage                   |                 |
| set_gas_limit            | setGasLimit                             |                 |
| buy_gas                  | *(deleted)*                             |                 |
| commit                   | commitContractDataAndActions            |                 |
| divmod                   | divMod                                  |                 |
| moddiv                   | modDiv                                  |                 |
| muldiv                   | mulDivFloor                             |                 |
| muldivr                  | mulDivRound                             |                 |
| muldivc                  | mulDivCeil                              |                 |
| muldivmod                | mulDivMod                               |                 |
| begin_parse              | beginParse                              |                 |
| end_parse                | assertEndOfSlice                        |                 |
| load_ref                 | loadRef                                 |                 |
| preload_ref              | preloadRef                              |                 |
| load_int                 | loadInt                                 |                 |
| load_uint                | loadUint                                |                 |
| preload_int              | preloadInt                              |                 |
| preload_uint             | preloadUint                             |                 |
| load_bits                | loadBits                                |                 |
| preload_bits             | preloadBits                             |                 |
| load_grams               | loadCoins                               |                 |
| load_coins               | loadCoins                               |                 |
| skip_bits                | skipBits                                |                 |
| first_bits               | getFirstBits                            |                 |
| skip_last_bits           | removeLastBits                          |                 |
| slice_last               | getLastBits                             |                 |
| load_dict                | loadDict                                |                 |
| preload_dict             | preloadDict                             |                 |
| skip_dict                | skipDict                                |                 |
| load_maybe_ref           | loadMaybeRef                            |                 |
| preload_maybe_ref        | preloadMaybeRef                         |                 |
| cell_depth               | getCellDepth                            |                 |
| slice_refs               | getRemainingRefsCount                   |                 |
| slice_bits               | getRemainingBitsCount                   |                 |
| slice_bits_refs          | getRemainingBitsAndRefsCount            |                 |
| slice_empty?             | isEndOfSlice                            |                 |
| slice_data_empty?        | isEndOfSliceBits                        |                 |
| slice_refs_empty?        | isEndOfSliceRefs                        |                 |
| slice_depth              | getSliceDepth                           |                 |
| equal_slice_bits         | isSliceBitsEqual                        |                 |
| builder_refs             | getBuilderRefsCount                     |                 |
| builder_bits             | getBuilderBitsCount                     |                 |
| builder_depth            | getBuilderDepth                         |                 |
| begin_cell               | beginCell                               |                 |
| end_cell                 | endCell                                 |                 |
| store_ref                | storeRef                                |                 |
| store_uint               | storeUint                               |                 |
| store_int                | storeInt                                |                 |
| store_slice              | storeSlice                              |                 |
| store_grams              | storeCoins                              |                 |
| store_coins              | storeCoins                              |                 |
| store_dict               | storeDict                               |                 |
| store_maybe_ref          | storeMaybeRef                           |                 |
| store_builder            | storeBuilder                            |                 |
| load_msg_addr            | loadAddress                             |                 |
| parse_addr               | parseAddress                            |                 |
| parse_std_addr           | parseStandardAddress                    |                 |
| parse_var_addr           | *(deleted)*                             |                 |
| config_param             | getBlockchainConfigParam                |                 |
| raw_reserve              | reserveToncoinsOnBalance                |                 |
| raw_reserve_extra        | reserveExtraCurrenciesOnBalance         |                 |
| send_raw_message         | sendRawMessage                          |                 |
| set_code                 | setContractCodePostponed                |                 |
| rand                     | randomRange                             |                 |
| get_seed                 | randomGetSeed                           |                 |
| set_seed                 | randomSetSeed                           |                 |
| randomize                | randomizeBy                             |                 |
| randomize_lt             | randomizeByLogicalTime                  |                 |
| dump                     | debugPrint                              |                 |
| strdump                  | debugPrintString                        |                 |
| dump_stk                 | debugDumpStack                          |                 |
| empty_list               | createEmptyList                         | lisp-lists      |
| cons                     | listPrepend                             | lisp-lists      |
| uncons                   | listSplit                               | lisp-lists      |
| list_next                | listNext                                | lisp-lists      |
| car                      | listGetHead                             | lisp-lists      |
| cdr                      | listGetTail                             | lisp-lists      |
| new_dict                 | createEmptyDict                         | tvm-dicts       |
| dict_empty?              | dictIsEmpty                             | tvm-dicts       |
| idict_set_ref            | iDictSetRef                             | tvm-dicts       |
| udict_set_ref            | uDictSetRef                             | tvm-dicts       |
| idict_get_ref            | iDictGetRefOrNull                       | tvm-dicts       |
| idict_get_ref?           | iDictGetRef                             | tvm-dicts       |
| udict_get_ref?           | uDictGetRef                             | tvm-dicts       |
| idict_set_get_ref        | iDictSetAndGetRefOrNull                 | tvm-dicts       |
| udict_set_get_ref        | iDictSetAndGetRefOrNull                 | tvm-dicts       |
| idict_delete?            | iDictDelete                             | tvm-dicts       |
| udict_delete?            | uDictDelete                             | tvm-dicts       |
| idict_get?               | iDictGet                                | tvm-dicts       |
| udict_get?               | uDictGet                                | tvm-dicts       |
| idict_delete_get?        | iDictDeleteAndGet                       | tvm-dicts       |
| udict_delete_get?        | uDictDeleteAndGet                       | tvm-dicts       |
| udict_set                | uDictSet                                | tvm-dicts       |
| idict_set                | iDictSet                                | tvm-dicts       |
| dict_set                 | sDictSet                                | tvm-dicts       |
| udict_add?               | uDictSetIfNotExists                     | tvm-dicts       |
| udict_replace?           | uDictSetIfExists                        | tvm-dicts       |
| idict_add?               | iDictSetIfNotExists                     | tvm-dicts       |
| idict_replace?           | iDictSetIfExists                        | tvm-dicts       |
| udict_set_builder        | uDictSetBuilder                         | tvm-dicts       |
| idict_set_builder        | iDictSetBuilder                         | tvm-dicts       |
| dict_set_builder         | sDictSetBuilder                         | tvm-dicts       |
| udict_add_builder?       | uDictSetBuilderIfNotExists              | tvm-dicts       |
| udict_replace_builder?   | uDictSetBuilderIfExists                 | tvm-dicts       |
| idict_add_builder?       | iDictSetBuilderIfNotExists              | tvm-dicts       |
| idict_replace_builder?   | iDictSetBuilderIfExists                 | tvm-dicts       |
| udict_delete_get_min     | uDictDeleteFirstAndGet                  | tvm-dicts       |
| idict_delete_get_min     | iDictDeleteFirstAndGet                  | tvm-dicts       |
| dict_delete_get_min      | sDictDeleteFirstAndGet                  | tvm-dicts       |
| udict_delete_get_max     | uDictDeleteLastAndGet                   | tvm-dicts       |
| idict_delete_get_max     | iDictDeleteLastAndGet                   | tvm-dicts       |
| dict_delete_get_max      | sDictDeleteLastAndGet                   | tvm-dicts       |
| udict_get_min?           | uDictGetFirst                           | tvm-dicts       |
| udict_get_max?           | uDictGetLast                            | tvm-dicts       |
| udict_get_min_ref?       | uDictGetFirstAsRef                      | tvm-dicts       |
| udict_get_max_ref?       | uDictGetLastAsRef                       | tvm-dicts       |
| idict_get_min?           | iDictGetFirst                           | tvm-dicts       |
| idict_get_max?           | iDictGetLast                            | tvm-dicts       |
| idict_get_min_ref?       | iDictGetFirstAsRef                      | tvm-dicts       |
| idict_get_max_ref?       | iDictGetLastAsRef                       | tvm-dicts       |
| udict_get_next?          | uDictGetNext                            | tvm-dicts       |
| udict_get_nexteq?        | uDictGetNextOrEqual                     | tvm-dicts       |
| udict_get_prev?          | uDictGetPrev                            | tvm-dicts       |
| udict_get_preveq?        | uDictGetPrevOrEqual                     | tvm-dicts       |
| idict_get_next?          | iDictGetNext                            | tvm-dicts       |
| idict_get_nexteq?        | iDictGetNextOrEqual                     | tvm-dicts       |
| idict_get_prev?          | iDictGetPrev                            | tvm-dicts       |
| idict_get_preveq?        | iDictGetPrevOrEqual                     | tvm-dicts       |
| udict::delete_get_min    | uDictDeleteFirstAndGet                  | tvm-dicts       |
| idict::delete_get_min    | iDictDeleteFirstAndGet                  | tvm-dicts       |
| dict::delete_get_min     | sDictDeleteFirstAndGet                  | tvm-dicts       |
| udict::delete_get_max    | uDictDeleteLastAndGet                   | tvm-dicts       |
| idict::delete_get_max    | iDictDeleteLastAndGet                   | tvm-dicts       |
| dict::delete_get_max     | sDictDeleteLastAndGet                   | tvm-dicts       |
| pfxdict_get?             | prefixDictGet                           | tvm-dicts       |
| pfxdict_set?             | prefixDictSet                           | tvm-dicts       |
| pfxdict_delete?          | prefixDictDelete                        | tvm-dicts       |


## A list of added functions

Tolk standard library has some functions that were missing in FunC, but are quite common for everyday tasks.

Since Tolk is actively developed, and its standard library changes, better consider `tolk-stdlib/` folder
in sources [here](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib).
Besides functions, there some constants were added: `SEND_MODE_*`, `RESERVE_MODE_*`, etc.

When FunC becomes deprecated, the documentation about Tolk stdlib will be completely rewritten, anyway.

And remember, that all the functions above are actually wrappers over TVM assembler. If something is missing,
you can easily wrap any TVM instruction yourself.


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

Most FunC functions, that were used with `~` tilda in practice, now mutate the object, see examples above.

For example, if you used `dict~udict_set(…)`, just use `dict.uDictSet(…)`, and everything is fine. 
But if you used `dict.udict_set(…)` to obtain a copy, you'll need to express it some other way.

[Read about mutability](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability).


## How does embedded stdlib work under the hood

As told above, all standard functions are available out of the box. 
Yeah, for you need `import` for non-common functions (it's intentionally), but still, no external downloads.

It works the following way.

The first thing Tolk compiler does on start is locating stdlib folder by searching in predefined paths relative to an executable binary. 
For example, if you launch Tolk compiler from a package installed (e.g. `/usr/bin/tolk`), locate stdlib in `/usr/share/ton/smartcont`. 
If you have non-standard installation, you may pass `TOLK_STDLIB` env variable. It's standard practice for compilers.

A WASM wrapper [tolk-js](https://github.com/ton-blockchain/tolk-js) also contains stdlib. 
So, when you take tolk-js or blueprint, all stdlib functions are still available out of the box.

IDE plugins (both JetBrains and VS Code) also auto-locate stdlib to provide auto-completion. 
If you use blueprint, it automatically installs tolk-js, and therefore, folder `node_modules/@ton/tolk-js/` exists in your project file structure.
Inside, there are `common.tolk`, `tvm-dicts.tolk`, and others. 
