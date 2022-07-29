# TVM Instructions

## Contents
1. [**Introduction**](#_1-introduction)
   1. [**Gas prices**](#_11-gas-prices)
   2. [**CSV table**](#_12-csv-table)
2. [**Stack manipulation primitives**](#_2-stack-manipulation-primitives)
   1. [**Basic stack manipulation primitives**](#_21-basic-stack-manipulation-primitives)
   2. [**Complex stack manipulation primitives**](#_22-complex-stack-manipulation-primitives)
3. [**Tuple, List, and Null primitives**](#_3-tuple-list-and-null-primitives)
4. [**Constant, or literal primitives**](#_4-constant-or-literal-primitives)
   1. [**Integer and boolean constants**](#_41-integer-and-boolean-constants)
   2. [**Constant slices, continuations, cells, and references**](#_42-constant-slices-continuations-cells-and-references)
5. [**Arithmetic primitives**](#_5-arithmetic-primitives)
   1. [**Addition, subtraction, multiplication**](#_51-addition-subtraction-multiplication)
   2. [**Division**](#_52-division)
   3. [**Shifts, logical operations**](#_53-shifts-logical-operations)
   4. [**Quiet arithmetic primitives**](#_54-quiet-arithmetic-primitives)
6. [**Comparison primitives**](#_6-comparison-primitives)
   1. [**Integer comparison**](#_61-integer-comparison)
   2. [**Other comparison**](#_62-other-comparison)
7. [**Cell primitives**](#_7-cell-primitives)
   1. [**Cell serialization primitives**](#_71-cell-serialization-primitives)
   2. [**Cell deserialization primitives**](#_72-cell-deserialization-primitives)
8. [**Continuation and control flow primitives**](#_8-continuation-and-control-flow-primitives)
   1. [**Unconditional control flow primitives**](#_81-unconditional-control-flow-primitives)
   2. [**Conditional control flow primitives**](#_82-conditional-control-flow-primitives)
   3. [**Control flow primitives: loops**](#_83-control-flow-primitives-loops)
   4. [**Manipulating the stack of continuations**](#_84-manipulating-the-stack-of-continuations)
   5. [**Creating simple continuations and closures**](#_85-creating-simple-continuations-and-closures)
   6. [**Operations with continuation savelists and control registers**](#_86-operations-with-continuation-savelists-and-control-registers)
   7. [**Dictionary subroutine calls and jumps**](#_87-dictionary-subroutine-calls-and-jumps)
9. [**Exception generating and handling primitives**](#_9-exception-generating-and-handling-primitives)
10. [**Dictionary manipulation primitives**](#_10-dictionary-manipulation-primitives)
    1. [**Dictionary creation**](#_101-dictionary-creation)
    2. [**Dictionary serialization and deserialization**](#_102-dictionary-serialization-and-deserialization)
    3. [**Get dictionary operations**](#_103-get-dictionary-operations)
    4. [**Set/Replace/Add dictionary operations**](#_104-setreplaceadd-dictionary-operations)
    5. [**Builder-accepting variants of Set dictionary operations**](#_105-builder-accepting-variants-of-set-dictionary-operations)
    6. [**Delete dictionary operations**](#_106-delete-dictionary-operations)
    7. [**"Maybe reference" dictionary operations**](#_107-maybe-reference-dictionary-operations)
    8. [**Prefix code dictionary operations**](#_108-prefix-code-dictionary-operations)
    9. [**Variants of GetNext and GetPrev operations**](#_109-variants-of-getnext-and-getprev-operations)
    10. [**GetMin, GetMax, RemoveMin, RemoveMax operations**](#_1010-getmin-getmax-removemin-removemax-operations)
    11. [**Special Get dictionary and prefix code dictionary operations, and constant dictionaries**](#_1011-special-get-dictionary-and-prefix-code-dictionary-operations-and-constant-dictionaries)
    12. [**SubDict dictionary operations**](#_1012-subdict-dictionary-operations)
11. [**Application-specific primitives**](#_11-application-specific-primitives)
    1. [**Gas-related primitives**](#_111-gas-related-primitives)
    2. [**Pseudo-random number generator primitives**](#_112-pseudo-random-number-generator-primitives)
    3. [**Configuration primitives**](#_113-configuration-primitives)
    4. [**Global variable primitives**](#_114-global-variable-primitives)
    5. [**Hashing and cryptography primitives**](#_115-hashing-and-cryptography-primitives)
    6. [**Miscellaneous primitives**](#_116-miscellaneous-primitives)
    7. [**Currency manipulation primitives**](#_117-currency-manipulation-primitives)
    8. [**Message and address manipulation primitives**](#_118-message-and-address-manipulation-primitives)
    9. [**Outbound message and output action primitives**](#_119-outbound-message-and-output-action-primitives)
12. [**Debug primitives**](#_12-debug-primitives)
13. [**Codepage primitives**](#_13-codepage-primitives)

## 1 Introduction
This document provides a list of TVM instrucions, their opcodes and mnemonics.

[Here](https://ton-blockchain.github.io/docs/tvm.pdf) is a description of TVM.

Fift is a stack-based programming language designed to manage TON smart contracts. The Fift assembler is a Fift library that converts mnemonics of TVM instructions to their binary representation.

A description of Fift, including the introduction to the Fift assembler, can be found [here](https://github.com/Piterden/TON-docs/blob/master/Fift.%20A%20Brief%20Introduction.md).

This document specifies the corresponding mnemonic for each instruction. Note the following:

1. Fift is a stack-based language, therefore all arguments of an instruction are written before it (e.g. `5 PUSHINT`, `s0 s4 XCHG`).
2. Stack registers are denoted by `s0, s1, ..., s15`. Other stack registers (up to 255) are denoted by `i s()` (e.g. `100 s()`).
3. Control registers are denoted by `c0, c1, ..., c15`.

### 1.1 Gas prices
The gas price of each instruction is specified in this document. The basic gas price of an instruction is `10 + b`, where `b` is the instruction length in bits. Some operations have additional fees:
1. _Parsing cells_: Transforming a cell into a slice costs **100 gas units** if the cell is loading for the first time and **25** for subsequent loads during the same transaction. For such instructions, two gas prices are specified (e.g. `CTOS`: `118/43`).
2. _Cell creation_: **500 gas units**.
3. _Throwing exceptions_: **50 gas units**. In this document the exception fee is only specified for an instruction if its primary purpose is to throw (e.g. `THROWIF`, `FITS`). If the instruction only throws in some cases, two gas prices are specified (e.g. `FITS`: `26/76`).
4. _Tuple creation_: **1 gas unit** for every tuple element.
5. _Implicit jumps_: **10 gas units** for an implicit jump, **5 gas units** for an implicit back jump. This fee is not a part of any instruction.
6. _Moving stack elements between continuations_: **1 gas unit** per element, however first 32 elements moving is free.

### 1.2 CSV table
Machine-readable list of TVM instructions is available [here](/smart-contracts/tvm-instructions/instructions.csv).

## 2 Stack manipulation primitives
Here `0 <= i,j,k <= 15` if not stated otherwise.

### 2.1 Basic stack manipulation primitives
{{Table: stack_basic}}
### 2.2 Complex stack manipulation primitives
{{Table: stack_complex}}

## 3 Tuple, List, and Null primitives
{{Table: tuple}}

## 4 Constant, or literal primitives
### 4.1 Integer and boolean constants
{{Table: const_int}}
### 4.2 Constant slices, continuations, cells, and references
{{Table: const_data}}

## 5 Arithmetic primitives
### 5.1 Addition, subtraction, multiplication
{{Table: arithm_basic}}
### 5.2 Division
{{Table: arithm_div}}
### 5.3 Shifts, logical operations
{{Table: arithm_logical}}
### 5.4 Quiet arithmetic primitives
Quiet operations return `NaN` instead of throwing exceptions if one of their arguments is a `NaN`, or in case of integer overflow.
Quiet operations has a prefix `Q` as shown below. Another way to make an operation quiet is to add `QUIET` before it (i.e. one can write `QUIET ADD` instead of `QADD`).
Quiet versions of integer comparison primitives are also available (`QUIET SGN`, `QUIET LESS` etc).

{{Table: arithm_quiet}}

## 6 Comparison primitives
### 6.1 Integer comparison
{{Table: compare_int}}
### 6.2 Other comparison
Most of these "other comparison" primitives actually compare the data portions of _Slices_ as bitstrings (ignoring references if not stated otherwise).

{{Table: compare_other}}

## 7 Cell primitives
### 7.1 Cell serialization primitives
{{Table: cell_build}}
### 7.2 Cell deserialization primitives
{{Table: cell_parse}}

## 8 Continuation and control flow primitives
### 8.1 Unconditional control flow primitives
{{Table: cont_basic}}
### 8.2 Conditional control flow primitives
{{Table: cont_conditional}}
### 8.3 Control flow primitives: loops
{{Table: cont_loops}}
### 8.4 Manipulating the stack of continuations
Here `s"` is the [fee for moving stack elements between continuations](#11-gas-prices). It is equal to the size of the resulting stack minus 32 (or 0 if the stack is smaller than 32).

{{Table: cont_stack}}
### 8.5 Creating simple continuations and closures
{{Table: cont_create}}
### 8.6 Operations with continuation savelists and control registers
{{Table: cont_registers}}
### 8.7 Dictionary subroutine calls and jumps
{{Table: cont_dict}}

## 9 Exception generating and handling primitives
{{Table: exceptions}}

## 10 Dictionary manipulation primitives
Gas consumption of most of the dictionary operations is not fixed, it depends on the contents of the given dictionary.
### 10.1 Dictionary creation
{{Table: dict_create}}
### 10.2 Dictionary serialization and deserialization
{{Table: dict_serial}}
### 10.3 Get dictionary operations
{{Table: dict_get}}
### 10.4 Set/Replace/Add dictionary operations
{{Table: dict_set}}
### 10.5 Builder-accepting variants of Set dictionary operations
The following primitives accept the new value as a _Builder_ `b` instead of a _Slice_ `x`.

{{Table: dict_set_builder}}
### 10.6 Delete dictionary operations
{{Table: dict_delete}}
### 10.7 "Maybe reference" dictionary operations
The following operations assume that a dictionary is used to store values `c?` of type _Maybe Cell_.  The representation is as follows: if `c?` is a _Cell_ , it is stored as a value with no data bits and exactly one reference to this _Cell_.  If `c?` is _Null_, then the corresponding key must be absent from the dictionary.

{{Table: dict_mayberef}}
### 10.8 Prefix code dictionary operations
These are some basic operations for constructing prefix code dictionaries.
These primitives are completely similar to their non-prefix code counterparts (`DICTSET` etc), with the obvious difference that even a _Set_ may fail in a prefix code dictionary, so a success flag must be returned by `PFXDICTSET` as well.

{{Table: dict_prefix}}
### 10.9 Variants of GetNext and GetPrev operations
{{Table: dict_next}}
### 10.10 GetMin, GetMax, RemoveMin, RemoveMax operations
{{Table: dict_min}}
### 10.11 Special Get dictionary and prefix code dictionary operations, and constant dictionaries
{{Table: dict_special}}
### 10.12 SubDict dictionary operations
{{Table: dict_sub}}

## 11 Application-specific primitives
### 11.1 Gas-related primitives
{{Table: app_gas}}
### 11.2 Pseudo-random number generator primitives
{{Table: app_rnd}}
### 11.3 Configuration primitives
{{Table: app_config}}
### 11.4 Global variable primitives
{{Table: app_global}}
### 11.5 Hashing and cryptography primitives
{{Table: app_crypto}}
### 11.6 Miscellaneous primitives
{{Table: app_misc}}
### 11.7 Currency manipulation primitives
{{Table: app_currency}}
### 11.8 Message and address manipulation primitives
{{Table: app_addr}}
### 11.9 Outbound message and output action primitives
{{Table: app_actions}}

## 12 Debug primitives
Opcodes beginning with `FE` are reserved for the debug primitives. These primitives have known fixed operation length, and behave as (multibyte) `NOP` operations.

However, when invoked in a TVM instance with debug mode enabled, these primitives can produce specific output into the text debug log of the TVM instance, never affecting the TVM state.

`DEBUG` and `DEBUGSTR` are the two debug primitives, they cover all opcodes that start with `FE`.
Other primitives listed here have opcodes from the same set. When debug is enabled, they have their specified effects. When debug is disabled, they behave as `NOP`.

{{Table: debug}}

## 13 Codepage primitives
{{Table: codepage}}
