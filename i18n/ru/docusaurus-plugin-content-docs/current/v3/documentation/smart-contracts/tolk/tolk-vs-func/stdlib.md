# Tolk и FunC: стандартная библиотека

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

FunC обладает богатой [стандартной библиотекой] (/v3/documentation/smart-contracts/func/docs/stdlib),
известной как файл *"stdlib.fc "*. Она довольно низкоуровневая и содержит множество `asm`функций, названия которых очень похожи на команды TVM.

Tolk также имеет стандартную библиотеку, основанную на библиотеке FunC. Три основных отличия:

1. Она разделена на несколько файлов: `common.tolk`, `tvm-dicts.tolk` и другие. Функции из `common.tolk` доступны всегда. Функции из других файлов доступны после импорта:

```tolk
import "@stdlib/tvm-dicts"

beginCell()          // available always
createEmptyDict()    // available due to import
```

2. Вам не нужно загружать ее с GitHub, она является частью дистрибутива Tolk.
3. Почти все функции FunC были переименованы в ~~подробные~~ понятные названия. Это позволяет лучше понимать, что происходит, при написании контрактов или чтении примеров.

## Список переименованных функций

Если столбец "Требуемый импорт" пуст - функция доступна без импорта.

Обратите внимание, что некоторые функции были удалены, так как их можно выразить синтаксически или они были крайне редко используемы на практике.

| Название в FunC                                                                                 | Название в Tolk                         | Необходимый импорт |
| ----------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------ |
| empty_tuple                                                                | createEmptyTuple                        |                    |
| tpush                                                                                           | tuplePush                               |                    |
| first                                                                                           | tupleFirst                              |                    |
| at                                                                                              | tupleAt                                 |                    |
| touch                                                                                           | stackMoveToTop                          | tvm-lowlevel       |
| impure_touch                                                               | *(удалено)*          |                    |
| single                                                                                          | *(удалено)*          |                    |
| unsingle                                                                                        | *(удалено)*          |                    |
| pair                                                                                            | *(удалено)*          |                    |
| unpair                                                                                          | *(удалено)*          |                    |
| triple                                                                                          | *(удалено)*          |                    |
| untriple                                                                                        | *(удалено)*          |                    |
| tuple4                                                                                          | *(удалено)*          |                    |
| untuple4                                                                                        | *(удалено)*          |                    |
| second                                                                                          | *(удалено)*          |                    |
| third                                                                                           | *(удалено)*          |                    |
| fourth                                                                                          | *(удалено)*          |                    |
| pair_first                                                                 | *(удалено)*          |                    |
| pair_second                                                                | *(удалено)*          |                    |
| triple_first                                                               | *(удалено)*          |                    |
| triple_second                                                              | *(удалено)*          |                    |
| triple_third                                                               | *(удалено)*          |                    |
| minmax                                                                                          | minMax                                  |                    |
| my_address                                                                 | getMyAddress                            |                    |
| get_balance                                                                | getMyOriginalBalanceWithExtraCurrencies |                    |
| cur_lt                                                                     | getLogicalTime                          |                    |
| block_lt                                                                   | getCurrentBlockLogicalTime              |                    |
| cell_hash                                                                  | cellHash                                |                    |
| slice_hash                                                                 | sliceHash                               |                    |
| string_hash                                                                | stringHash                              |                    |
| check_signature                                                            | isSignatureValid                        |                    |
| check_data_signature                                  | isSliceSignatureValid                   |                    |
| compute_data_size                                     | calculateCellSizeStrict                 |                    |
| slice_compute_data_size          | calculateSliceSizeStrict                |                    |
| compute_data_size?                                    | calculateCellSize                       |                    |
| slice_compute_data_size?         | calculateSliceSize                      |                    |
| ~dump                                                                           | debugPrint                              |                    |
| ~strdump                                                                        | debugPrintString                        |                    |
| dump_stack                                                                 | debugDumpStack                          |                    |
| get_data                                                                   | getContractData                         |                    |
| set_data                                                                   | setContractData                         |                    |
| get_c3                                                                     | getTvmRegisterC3                        | tvm-lowlevel       |
| set_c3                                                                     | setTvmRegisterC3                        | tvm-lowlevel       |
| bless                                                                                           | transformSliceToContinuation            | tvm-lowlevel       |
| accept_message                                                             | acceptExternalMessage                   |                    |
| set_gas_limit                                         | setGasLimit                             |                    |
| buy_gas                                                                    | *(удалено)*          |                    |
| commit                                                                                          | commitContractDataAndActions            |                    |
| divmod                                                                                          | divMod                                  |                    |
| moddiv                                                                                          | modDiv                                  |                    |
| muldiv                                                                                          | mulDivFloor                             |                    |
| muldivr                                                                                         | mulDivRound                             |                    |
| muldivc                                                                                         | mulDivCeil                              |                    |
| muldivmod                                                                                       | mulDivMod                               |                    |
| begin_parse                                                                | beginParse                              |                    |
| end_parse                                                                  | assertEndOfSlice                        |                    |
| load_ref                                                                   | loadRef                                 |                    |
| preload_ref                                                                | preloadRef                              |                    |
| load_int                                                                   | loadInt                                 |                    |
| load_uint                                                                  | loadUint                                |                    |
| preload_int                                                                | preloadInt                              |                    |
| preload_uint                                                               | preloadUint                             |                    |
| load_bits                                                                  | loadBits                                |                    |
| preload_bits                                                               | preloadBits                             |                    |
| load_grams                                                                 | loadCoins                               |                    |
| load_coins                                                                 | loadCoins                               |                    |
| skip_bits                                                                  | skipBits                                |                    |
| first_bits                                                                 | getFirstBits                            |                    |
| skip_last_bits                                        | removeLastBits                          |                    |
| slice_last                                                                 | getLastBits                             |                    |
| load_dict                                                                  | loadDict                                |                    |
| preload_dict                                                               | preloadDict                             |                    |
| skip_dict                                                                  | skipDict                                |                    |
| load_maybe_ref                                        | loadMaybeRef                            |                    |
| preload_maybe_ref                                     | preloadMaybeRef                         |                    |
| cell_depth                                                                 | getCellDepth                            |                    |
| slice_refs                                                                 | getRemainingRefsCount                   |                    |
| slice_bits                                                                 | getRemainingBitsCount                   |                    |
| slice_bits_refs                                       | getRemainingBitsAndRefsCount            |                    |
| slice_empty?                                                               | isEndOfSlice                            |                    |
| slice_data_empty?                                     | isEndOfSliceBits                        |                    |
| slice_refs_empty?                                     | isEndOfSliceRefs                        |                    |
| slice_depth                                                                | getSliceDepth                           |                    |
| equal_slice_bits                                      | isSliceBitsEqual                        |                    |
| builder_refs                                                               | getBuilderRefsCount                     |                    |
| builder_bits                                                               | getBuilderBitsCount                     |                    |
| builder_depth                                                              | getBuilderDepth                         |                    |
| begin_cell                                                                 | beginCell                               |                    |
| end_cell                                                                   | endCell                                 |                    |
| store_ref                                                                  | storeRef                                |                    |
| store_uint                                                                 | storeUint                               |                    |
| store_int                                                                  | storeInt                                |                    |
| store_slice                                                                | storeSlice                              |                    |
| store_grams                                                                | storeCoins                              |                    |
| store_coins                                                                | storeCoins                              |                    |
| store_dict                                                                 | storeDict                               |                    |
| store_maybe_ref                                       | storeMaybeRef                           |                    |
| store_builder                                                              | storeBuilder                            |                    |
| load_msg_addr                                         | loadAddress                             |                    |
| parse_addr                                                                 | parseAddress                            |                    |
| parse_std_addr                                        | parseStandardAddress                    |                    |
| parse_var_addr                                        | *(удалено)*          |                    |
| config_param                                                               | getBlockchainConfigParam                |                    |
| raw_reserve                                                                | reserveToncoinsOnBalance                |                    |
| raw_reserve_extra                                     | reserveExtraCurrenciesOnBalance         |                    |
| send_raw_message                                      | sendRawMessage                          |                    |
| set_code                                                                   | setContractCodePostponed                |                    |
| rand                                                                                            | randomRange                             |                    |
| get_seed                                                                   | randomGetSeed                           |                    |
| set_seed                                                                   | randomSetSeed                           |                    |
| randomize                                                                                       | randomizeBy                             |                    |
| randomize_lt                                                               | randomizeByLogicalTime                  |                    |
| dump                                                                                            | debugPrint                              |                    |
| strdump                                                                                         | debugPrintString                        |                    |
| dump_stk                                                                   | debugDumpStack                          |                    |
| empty_list                                                                 | createEmptyList                         | lisp-lists         |
| cons                                                                                            | listPrepend                             | lisp-lists         |
| uncons                                                                                          | listSplit                               | lisp-lists         |
| list_next                                                                  | listNext                                | lisp-lists         |
| car                                                                                             | listGetHead                             | lisp-lists         |
| cdr                                                                                             | listGetTail                             | lisp-lists         |
| new_dict                                                                   | createEmptyDict                         | tvm-dicts          |
| dict_empty?                                                                | dictIsEmpty                             | tvm-dicts          |
| idict_set_ref                                         | iDictSetRef                             | tvm-dicts          |
| udict_set_ref                                         | uDictSetRef                             | tvm-dicts          |
| idict_get_ref                                         | iDictGetRefOrNull                       | tvm-dicts          |
| idict_get_ref?                                        | iDictGetRef                             | tvm-dicts          |
| udict_get_ref?                                        | uDictGetRef                             | tvm-dicts          |
| idict_set_get_ref                | iDictSetAndGetRefOrNull                 | tvm-dicts          |
| udict_set_get_ref                | iDictSetAndGetRefOrNull                 | tvm-dicts          |
| idict_delete?                                                              | iDictDelete                             | tvm-dicts          |
| udict_delete?                                                              | uDictDelete                             | tvm-dicts          |
| idict_get?                                                                 | iDictGet                                | tvm-dicts          |
| udict_get?                                                                 | uDictGet                                | tvm-dicts          |
| idict_delete_get?                                     | iDictDeleteAndGet                       | tvm-dicts          |
| udict_delete_get?                                     | uDictDeleteAndGet                       | tvm-dicts          |
| udict_set                                                                  | uDictSet                                | tvm-dicts          |
| idict_set                                                                  | iDictSet                                | tvm-dicts          |
| dict_set                                                                   | sDictSet                                | tvm-dicts          |
| udict_add?                                                                 | uDictSetIfNotExists                     | tvm-dicts          |
| udict_replace?                                                             | uDictSetIfExists                        | tvm-dicts          |
| idict_add?                                                                 | iDictSetIfNotExists                     | tvm-dicts          |
| idict_replace?                                                             | iDictSetIfExists                        | tvm-dicts          |
| udict_set_builder                                     | uDictSetBuilder                         | tvm-dicts          |
| idict_set_builder                                     | iDictSetBuilder                         | tvm-dicts          |
| dict_set_builder                                      | sDictSetBuilder                         | tvm-dicts          |
| udict_add_builder?                                    | uDictSetBuilderIfNotExists              | tvm-dicts          |
| udict_replace_builder?                                | uDictSetBuilderIfExists                 | tvm-dicts          |
| idict_add_builder?                                    | iDictSetBuilderIfNotExists              | tvm-dicts          |
| idict_replace_builder?                                | iDictSetBuilderIfExists                 | tvm-dicts          |
| udict_delete_get_min             | uDictDeleteFirstAndGet                  | tvm-dicts          |
| idict_delete_get_min             | iDictDeleteFirstAndGet                  | tvm-dicts          |
| dict_delete_get_min              | sDictDeleteFirstAndGet                  | tvm-dicts          |
| udict_delete_get_max             | uDictDeleteLastAndGet                   | tvm-dicts          |
| idict_delete_get_max             | iDictDeleteLastAndGet                   | tvm-dicts          |
| dict_delete_get_max              | sDictDeleteLastAndGet                   | tvm-dicts          |
| udict_get_min?                                        | uDictGetFirst                           | tvm-dicts          |
| udict_get_max?                                        | uDictGetLast                            | tvm-dicts          |
| udict_get_min_ref?               | uDictGetFirstAsRef                      | tvm-dicts          |
| udict_get_max_ref?               | uDictGetLastAsRef                       | tvm-dicts          |
| idict_get_min?                                        | iDictGetFirst                           | tvm-dicts          |
| idict_get_max?                                        | iDictGetLast                            | tvm-dicts          |
| idict_get_min_ref?               | iDictGetFirstAsRef                      | tvm-dicts          |
| idict_get_max_ref?               | iDictGetLastAsRef                       | tvm-dicts          |
| udict_get_next?                                       | uDictGetNext                            | tvm-dicts          |
| udict_get_nexteq?                                     | uDictGetNextOrEqual                     | tvm-dicts          |
| udict_get_prev?                                       | uDictGetPrev                            | tvm-dicts          |
| udict_get_preveq?                                     | uDictGetPrevOrEqual                     | tvm-dicts          |
| idict_get_next?                                       | iDictGetNext                            | tvm-dicts          |
| idict_get_nexteq?                                     | iDictGetNextOrEqual                     | tvm-dicts          |
| idict_get_prev?                                       | iDictGetPrev                            | tvm-dicts          |
| idict_get_preveq?                                     | iDictGetPrevOrEqual                     | tvm-dicts          |
| udict::delete_get_min | uDictDeleteFirstAndGet                  | tvm-dicts          |
| idict::delete_get_min | iDictDeleteFirstAndGet                  | tvm-dicts          |
| dict::delete_get_min  | sDictDeleteFirstAndGet                  | tvm-dicts          |
| udict::delete_get_max | uDictDeleteLastAndGet                   | tvm-dicts          |
| idict::delete_get_max | iDictDeleteLastAndGet                   | tvm-dicts          |
| dict::delete_get_max  | sDictDeleteLastAndGet                   | tvm-dicts          |
| pfxdict_get?                                                               | prefixDictGet                           | tvm-dicts          |
| pfxdict_set?                                                               | prefixDictSet                           | tvm-dicts          |
| pfxdict_delete?                                                            | prefixDictDelete                        | tvm-dicts          |

## Список добавленных функций

В стандартной библиотеке Tolk есть некоторые функции, которые отсутствовали в FunC, но довольно часто используются для решения повседневных задач.

Поскольку Tolk активно развивается, а его стандартная библиотека изменяется, лучше ориентироваться на папку `tolk-stdlib/`
в исходниках [здесь](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont/tolk-stdlib).
Кроме функций, были добавлены некоторые константы, такие как: `SEND_MODE_*`, `RESERVE_MODE_*` и другие.

Когда FunC станет устаревшим, документация о стандартной библиотеке Tolk будет полностью переписана.

И помните, что все вышеупомянутые функции на самом деле являются обёртками над ассемблером TVM. Если чего-то не хватает, вы можете легко обернуть любую инструкцию TVM самостоятельно.

## Некоторые функции стали мутирующими, не возвращая копию

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

Большинство функций FunC, которые на практике использовались с тильдой `~`, теперь мутируют объект. См. примеры выше.

Например, если вы использовали `dict~udict_set(…)`, просто используйте `dict.uDictSet(…)`, и все будет в порядке.
Но если вы использовали `dict.udict_set(…)`, чтобы получить копию, вам нужно будет выразить это другим способом.

[Подробнее о мутабельности](/v3/documentation/smart-contracts/tolk/tolk-vs-func/mutability).

## Как работает встроенная stdlib под капотом

Как упоминалось ранее, все стандартные функции доступны "из коробки".
Да, для нестандартных функций потребуется `import` (это сделано намеренно), но при этом внешние загрузки не нужны.

Это работает следующим образом.

Первое, что делает компилятор Tolk при запуске - ищет папку stdlib, выполняя поиск по предопределённым путям относительно исполняемого бинарного файла
Например, если вы запускаете компилятор Tolk из установленного пакета (например, `/usr/bin/tolk`), он найдёт stdlib в `/usr/share/ton/smartcont`.
Если у вас нестандартная установка, вы можете указать переменную окружения `TOLK_STDLIB`. Это стандартная практика для компиляторов.

Обертка WASM [tolk-js](https://github.com/ton-blockchain/tolk-js) также содержит stdlib.
Таким образом, при использовании tolk-js или blueprint все функции stdlib доступны "из коробки".

Плагины IDE (как JetBrains и VS Code) также автоматически находят stdlib для автозавершения кода.
Если вы используете blueprint, он автоматически устанавливает tolk-js, и, соответственно, в структуре файлов вашего проекта появляется папка `node_modules/@ton/tolk-js/`.
Внутри находятся файлы `common.tolk`, `tvm-dicts.tolk` и другие.
