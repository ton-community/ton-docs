# Solidity vs FunC

Smart contract development involves usage of predefined languages such as Solidity for Ethereum, and FunC for TON.
Solidity is an object-oriented, high-level, strictly-typed language influenced by C++, Python, and JavaScript, and is specifically designed for writing smart contracts that execute on Ethereum blockchain platforms.

FunC is also a high-level language, used to program smart contracts on TON Blockchain, being a domain-specific, C-like, statically-typed language.

In the sections below will be analysed briefly the following aspects of these languages, i.e. data types, storage, functions, flow control structures and dictionaries (hashmaps).

## Storage layout

Solidity provides a flat storage model, which means that all state variables are stored in a single, continuous block of memory called the storage. The storage is a key-value store where each key is a 256-bit (32-byte) integer that represents the storage slot number, and each value is the 256-bit word stored at that slot. The slots are numbered sequentially starting from zero, and each slot can store a single word. Solidity allows the programmer to specify the storage layout by using the storage keyword to define state variables. The order in which the variables are defined determines their position in the storage.

Permanent storage data in TON Blockchain is stored as a cell. Cells play the role of memory in the stack-based TVM. A cell can be transformed into a slice, and then the data bits and references to other cells from the cell can be obtained by loading them from the slice. Data bits and references to other cells can be stored into a builder, and then the builder can be finalised into a new cell.

## Data types

Solidity includes the following basic data types:
- Signed/Unsigned integers
- Boolean
- Addresses – used to store Ethereum wallet or smart contract addresses, typically around 20 bytes. An address type can be suffixed with the keyword “payable”, which restricts it to store only wallet addresses and use the transfer and send crypto functions.
- Byte arrays – declared with the keyword “bytes”, is a fixed-size array used to store a predefined number of bytes up to 32, usually declared along with the keyword.
- Literals – Immutable values such as addresses, rationals and integers, strings, unicode and hexadecimals, which can be stored in a variable.
- Enums
- Arrays (fixed/dynamic)
- Structs
- Mappings


In case of FunC, the main data types are:
- Integers
- Cell – basic for TON opaque data structure, which contains up to 1,023 bits and up to 4 references to other cells
- Slice and Builder – special objects to read from and write to cells,
- Continuation – another flavour of cell that contains ready-to-execute TVM byte-code
- Tuples – is an ordered collection of up to 255 components, having arbitrary value types, possibly distinct.
- Tensors – is an ordered collection ready for mass assigning like: (int, int) a = (2, 4). A special case of tensor type is the unit type (). It represents that a function doesn’t return any value, or has no arguments.

Currently, FunC has no support for defining custom types,

## Declaring and using variables

Solidity is a statically typed language, which means that the type of each variable must be specified when it is declared.

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

FunC is a more abstract and function-oriented language, it supports dynamic typing and functional programming style.

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

FunC's type flexibility and function-orientation provide convenience and security when developing smart contracts. It offers flexible type management through automatic inference and controls data access through feature visibility.

## Functions

Solidity approaches function declarations with a blend of clarity and control. In this programming language, each function is initiated with the keyword "function," followed by the name of the function and its parameters. The body of the function is enclosed within curly braces, clearly defining the operational scope. Additionally, return values are indicated using the "returns" keyword. What sets Solidity apart is its categorization of function visibility—functions can be designated as `public`, `private`, `internal`, or `external`, dictating the conditions under which they can be accessed and called by other parts of the contract or by external entities.

Transitioning to FunC, FunC program is essentially a list of function declarations/definitions and global variable declarations. A FunC function declaration typically starts with an optional declarator, followed by the return type and the function name. Parameters are listed next, and the declaration ends with a selection of specifiers—such as `impure`, `inline/inline_ref`, and `method_id`. These specifiers adjust the function's visibility, its ability to modify contract storage, and its inlining behavior.

## Flow control structures

Most of the control structures known from curly-braces languages are available in Solidity, including: `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, with the usual semantics known from C or JavaScript.

FunC supports classic `if-else` statements, as well as `ifnot`, `repeat`, `while` and `do/until` loops.  Also since v0.4.0 `try-catch` statements are supported.

## Dictionaries

Dictionary (hashmap/mapping) data structure is very important for Solidity and FunC contract development because it allows developers to efficiently store and retrieve data in smart contracts, specifically data related to a specific key, such as a user’s balance or ownership of an asset.

Mapping is a hash table in Solidity that stores data as key-value pairs, where the key can be any of the built-in data types, excluding reference types, and the value of the data type can be any type. Mappings are most typically used in Solidity and the Ethereum blockchain to connect a unique Ethereum address to a corresponding value type. In any other programming language, a mapping is equivalent to a dictionary.

In Solidity, mappings do not have a length, nor do they have the concept of setting a key or a value. Mappings are only applicable to state variables that serve as store reference types. When mappings are initialised, they include every possible key, and are mapped to values whose byte-representations are all zeros.

An analogy of mappings in FunC are dictionaries, or TON hashmaps. In the context of TON, a hashmap is a data structure represented by a tree of cells. Hashmap maps keys to values ​​of arbitrary type so that quick lookup and modification are possible. The abstract representation of a hashmap in TVM is a Patricia tree, or a compact binary trie.