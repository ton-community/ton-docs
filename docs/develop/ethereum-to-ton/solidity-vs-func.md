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

Currently, FunC has no support for defining custom types.

### See Also

- [Statements](/develop/func/statements)

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

### See Also

- [Statements](/develop/func/statements)

## Loops

Solidity supports `for`, `while`, and `do { ... } while` loops.

If you want to do something 10 times, you can do it this way:

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

FunC in turn supports `repeat`, `while`, and `do { ... } until` loops. The for loop is not supported. If you want to execute the same code as in the example above on Func, you can use `repeat`

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

### See Also

- [Statements](/develop/func/statements)

## Functions

Solidity approaches function declarations with a blend of clarity and control. In this programming language, each function is initiated with the keyword "function," followed by the name of the function and its parameters. The body of the function is enclosed within curly braces, clearly defining the operational scope. Additionally, return values are indicated using the "returns" keyword. What sets Solidity apart is its categorization of function visibility—functions can be designated as `public`, `private`, `internal`, or `external`, dictating the conditions under which they can be accessed and called by other parts of the contract or by external entities. Below is an example in which we set the global variable `num` in the Solidity language: 

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

Transitioning to FunC, FunC program is essentially a list of function declarations/definitions and global variable declarations. A FunC function declaration typically starts with an optional declarator, followed by the return type and the function name. Parameters are listed next, and the declaration ends with a selection of specifiers—such as `impure`, `inline/inline_ref`, and `method_id`. These specifiers adjust the function's visibility, its ability to modify contract storage, and its inlining behavior. Below is an example in which we stores storage variable as a cell into persistent storage in the Func language: 

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

### See Also 

- [Functions](/develop/func/functions)

## Flow control structures

Most of the control structures known from curly-braces languages are available in Solidity, including: `if`, `else`, `while`, `do`, `for`, `break`, `continue`, `return`, with the usual semantics known from C or JavaScript.

FunC supports classic `if-else` statements, as well as `ifnot`, `repeat`, `while` and `do/until` loops.  Also since v0.4.0 `try-catch` statements are supported.

### See Also

- [Statements](/develop/func/statements)

## Dictionaries

Dictionary (hashmap/mapping) data structure is very important for Solidity and FunC contract development because it allows developers to efficiently store and retrieve data in smart contracts, specifically data related to a specific key, such as a user’s balance or ownership of an asset.

Mapping is a hash table in Solidity that stores data as key-value pairs, where the key can be any of the built-in data types, excluding reference types, and the value of the data type can be any type. Mappings are most typically used in Solidity and the Ethereum blockchain to connect a unique Ethereum address to a corresponding value type. In any other programming language, a mapping is equivalent to a dictionary.

In Solidity, mappings do not have a length, nor do they have the concept of setting a key or a value. Mappings are only applicable to state variables that serve as store reference types. When mappings are initialised, they include every possible key, and are mapped to values whose byte-representations are all zeros.

An analogy of mappings in FunC are dictionaries, or TON hashmaps. In the context of TON, a hashmap is a data structure represented by a tree of cells. Hashmap maps keys to values ​​of arbitrary type so that quick lookup and modification are possible. The abstract representation of a hashmap in TVM is a Patricia tree, or a compact binary trie. Working with potentially large cell trees can create several problems. Each update operation builds an appreciable number of cells (each cell built costs 500 gas), which means that these operations can run out of resource if used carelessly. To avoid exceeding the gas limit, limit the number of dictionary updates in a single transaction. Also, a binary tree for `N` key-value pairs contains `N-1` forks, which means a total of at least `2N-1` cells. The storage of a smart contract is limited to `65536` unique cells, so the maximum number of entries in the dictionary is `32768`, or slightly more if there are repeating cells.

### See Also 

- [Dictionaries in TON](/develop/func/dictionaries)

## Smart-contract communication

Solidity and FunC provide different approaches to interacting with smart contracts. The main difference lies in the mechanisms of invocation and interaction between contracts.

Solidity uses an object-oriented approach where contracts interact with each other through method calls. This is similar to method calls in traditional object-oriented programming languages.

```js
// External contract interface
interface IReceiver {
    function receiveData(uint x) external;
}

contract Sender {
    function sendData(address receiverAddress, uint x) public {
        IReceiver receiver = IReceiver(receiverAddress);
        receiver.receiveData(x);  // Direct call of the contract function
    }
}
```

FunC, used in the TON blockchain ecosystem, operates on messages to invoke and interact between smart-contracts. Instead of calling methods directly, contracts send messages to each other, which can contain data and code for execution. 

Consider an example where a smart contract sender must send a message with a number, and a smart contract receiver must receive that number and perform some manipulation on it. 

Initially, the smart contract recipient must describe how it will receive messages.

```func
() recv_internal(int my_balance, int msg_value, cell in_msg, slice in_msg_body) impure {
    int op = in_msg_body~load_uint(32);
    
    if (op == 1) {
        int num = in_msg_body~load_uint(32);
        ;; do some manipulations
        return ();
    }

    if (op == 2) {
        ;;...
    }
}
```

Let's discuss in more detail what receiving a message looks like in our destination contract:
1. `recv_internal()` - this function is executed when a contract is accessed directly within the blockchain. For example, when a contract accesses our contract.
2. The function accepts amount of the contract balance, the amount of the incoming message, the cell with the original message and the `in_msg_body` slice, which stores only the body of the received message. 
3. Our message body will store two integer numbers. The first number is a 32-bit unsigned integer `op`, identifying the `operation` to be performed, or the `method` of the smart contract to be invoked. You can draw some analogy with Solidity and think of `op` as a function signature. The second number is the number we need to perform some manipulations with.
4. To read from the resulting slice `op` and `our number`, we use `load_uint()`.
5. Next, we manipulate the number (we omitted this functionality in this example).

Next, the sender's smart contract is to send the message correctly. This is accomplished with`send_raw_message`, which expects a serialized message as an argument.

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; in the example, we just hardcode the recipient's address
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```
Let's discuss in more detail what it looks like for our smart contract to send a message to our recipient:
1. Initially, we need to build our message. The full structure of the send can be found [here](develop/smart-contracts/messages). We won't go into detail on how to assemble it here, you can read about that at the link.
2. The body of the message represents a cell. In `msg_body_cell` we do: `begin_cell()` - creates `Builder` for the future cell, first `store_uint` - stores the first uint into `Builder` (1 - this is our `op`), second `store_uint` - stores the second uint into `Builder` (num - this is our number that we will manipulate in the receiving contract), `end_cell()` - creates the cell.
3. To attach the body that will come in `recv_internal` in the message,  we reference the collected cell in the message itself with `store_ref`.
4. Sending a message.

This example presented how smart contracts can communicate with each other. 

### See Also 

- [Internal Messages](/develop/smart-contracts/guidelines/internal-messages)
- [Sending Messages](/develop/smart-contracts/messages)
- [Non-bouncable messages](develop/smart-contracts/guidelines/non-bouncable-messages)
