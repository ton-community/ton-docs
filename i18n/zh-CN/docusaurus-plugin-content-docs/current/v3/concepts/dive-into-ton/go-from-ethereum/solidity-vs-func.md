import Feedback from '@site/src/components/Feedback';

# Solidity 与 FunC

## Introduction

智能合约开发涉及使用预定义语言，如以太坊的 Solidity 和 TON 的 FunC。
Solidity 是一种面向对象、高级、严格类型的语言，受到 C++、Python 和 JavaScript 的影响，专门用于编写在以太坊区块链平台上执行的智能合约。
Solidity is an object-oriented, high-level, strictly typed language influenced by C++, Python, and JavaScript. It is designed explicitly to write smart contracts on Ethereum blockchain platforms.

FunC 也是一种高级语言，用于在 TON 区块链上对智能合约进行编程，是一种特定领域的、类似 C 语言的静态类型语言。 It is a domain-specific, C-like, statically typed language.

下文将简要分析这些语言的以下方面，即数据类型、存储、函数、流程控制结构和字典（哈希图）。

## Solidity 和 FunC 提供了与智能合约交互的不同方法。主要区别在于合约之间的调用和交互机制。

### 存储布局

#### Solidity

Solidity uses a flat storage model, meaning it stores all state variables in a single, continuous block of memory called storage. The storage is a key-value store where each key is a 256-bit integer representing the storage slot number, and each value is the 256-bit word stored at that slot. Ethereum numbers the slots sequentially, starting from zero, and each slot can store a single word. Solidity allows the programmer to specify the storage layout using the storage keyword to define state variables. The order in which you define the variables determines their position in the storage.

#### FunC

Permanent storage data in TON Blockchain is stored as a cell. Cells play the role of memory in the stack-based TVM. To read data from a cell, you need to transform a cell into a slice and then obtain the data bits and references to other cells by loading them from the slice. To write data, you must store data bits and references to other cells in a builder and cast the builder into a new cell.

### 数据类型

#### Solidity

Solidity 包含以下基本数据类型：

- Signed/Unsigned integers
- Boolean
- **Addresses**, typically around 20 bytes, are used to store Ethereum wallet or smart contract addresses. Addresses - 用于存储以太坊钱包或智能合约地址，通常约 20 字节。地址类型可以后缀关键字 "payable"，这就限制了它只能存储钱包地址，并使用传输和发送加密功能。
- Byte arrays --用关键字 "字节 "声明，是一个固定大小的数组，用于存储预定义的字节数，最多 32 个，通常与关键字一起声明。
- Literals - 不可更改的值，如地址、有理数和整数、字符串、统一码和十六进制数，可存储在变量中。
- **Enums**
- Arrays (fixed/dynamic)
- Structs
- Mappings

#### FunC

就 FunC 而言，主要数据类型有

- Integers
- cell  - TON 不透明数据结构的基本结构，包含多达 1 023 个比特和多达 4 个对其他 cell 的引用
- Slice 和 Builder - 用于读取和写入 cell 的特殊对象、
- Continuation --另一种包含可随时执行的 TVM 字节代码的 cell 类型
- Tuples - 是由最多 255 个元件组成的有序集合，具有任意值类型，可能是不同的。
- **Tensors** — is an ordered collection ready for mass assigning like: `(int, int) a = (2, 4)`. A special case of tensor type is the unit type `()`. It represents that a function doesn’t return any value or has no arguments.

目前，FunC 不支持定义自定义类型。 Read more about types in the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### 声明和使用变量

#### Solidity

Solidity 是一种静态类型语言，这意味着每个变量的类型必须在声明时指定。

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

#### FunC

FunC 是一种更抽象、更面向函数的语言，它支持动态类型和函数式编程风格。 It supports dynamic typing and functional programming styles.

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

[声明](/v3/documentation/smart-contracts/func/docs/statements)

### 循环

#### Solidity

Solidity 支持 `for`、`while` 和 `do { ... } while` 循环。

如果你想把一件事做 10 次，可以这样做：

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

#### FunC

而 FunC 支持`repeat`、`while`和`do { ... } until` loops. The `for` loop is not supported. } until`循环。不支持 for 循环。如果想在 Func 上执行与上述示例相同的代码，可以使用 `repeat`和`while\` 循环。

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

[声明](/v3/documentation/smart-contracts/func/docs/statements)

### Functions

#### Solidity

Solidity approaches function declarations with a blend of clarity and control. In this programming language, each function is initiated with the keyword `function`, followed by the function's name and its parameters. The function's body is enclosed within curly braces, clearly defining the operational scope. Additionally, return values are indicated using the `returns` keyword.

What sets Solidity apart is its categorization of function visibility—you can designate functions as `public`, `private`, `internal`, or `external`. These definitions dictate the conditions under which developers can access and call other parts of the contract or external entities. Below is an example in which we set the global variable `num` in the Solidity language:

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

#### FunC

Transitioning to FunC, the FunC program is essentially a list of function declarations/definitions and global variable declarations. A FunC function declaration typically starts with an optional declarator, followed by the return type and the function name.

Parameters are listed next, and the declaration ends with a selection of specifiers—such as `impure`, `inline/inline_ref`, and `method_id`. These specifiers adjust the function's visibility, ability to modify contract storage, and inlining behavior. Below is an example in which we store a storage variable as a cell in persistent storage in the Func language:

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

[函数](/v3/documentation/smart-contracts/func/docs/functions)

### 流程控制结构

#### Solidity

Solidity中提供了大多数大括号语言中的控制结构，包括if"、"else"、"while"、"do"、"for"、"break"、"continue"、"return"，以及 C 或 JavaScript 中的常用语义。

#### FunC

FunC 支持经典的 `if-else` 语句，以及 `ifnot`、`repeat`、`while` 和 `do/until` 循环。  此外，自 v0.4.0 起，FunC 还支持`try-catch`语句。  Also, since v0.4.0, `try-catch` statements are supported.

[声明](/v3/documentation/smart-contracts/func/docs/statements)

### Dictionaries

字典 (哈希表/映射)(hashmap/mapping) 数据结构对 Solidity 和 FunC 合约开发非常重要，因为它允许开发人员在智能合约中有效地存储和检索数据，特别是与特定密钥相关的数据，如用户余额或资产所有权。

#### Solidity

Mapping 是 Solidity 中的一个哈希表，以键值对的形式存储数据，其中键可以是任何内置数据类型（不包括引用类型），而数据类型的值可以是任何类型。Mapping 通常用于 Solidity 和以太坊区块链，将唯一的以太坊地址与相应的值类型连接起来。在其他编程语言中，mapping 相当于字典。 In Solidity and on the Ethereum blockchain, mappings typically connect a unique Ethereum address to a corresponding value type. In any other programming language, a mapping is equivalent to a dictionary.

在 Solidity 中，映射没有长度，也没有设置键或值的概念。映射只适用于作为存储引用类型的状态变量。当映射被初始化时，它们包括所有可能的键，并映射到字节表示全部为零的值。 Mappings are only applicable to state variables that serve as store reference types. When you initialize mappings, they include every possible key and map to values whose byte representations are all zeros.

#### FunC

An analogy of mappings in FunC is dictionaries or TON hashmaps. In the context of TON, a hashmap is a data structure represented by a tree of cells. Hashmap maps keys to values ​​of arbitrary type so that quick lookup and modification are possible. The abstract representation of a hashmap in TVM is a Patricia tree or a compact binary trie.

Working with potentially large cell trees can create several problems. Each update operation builds an appreciable number of cells (each cell built costs 500 gas), meaning these operations can run out of resources if used carelessly. To avoid exceeding the gas limit, limit the number of dictionary updates in a single transaction.

Also, a binary tree for `N` key-value pairs contains `N-1` forks, which means a total of at least `2N-1` cells. The storage of a smart contract is limited to `65536` unique cells, so the maximum number of entries in the dictionary is `32768`, or slightly more if there are repeating cells.

[TON 中的字典](/v3/documentation/smart-contracts/func/docs/dictionaries)

### 智能合约通信

Solidity and FunC provide different approaches to interacting with smart contracts. The main difference lies in the mechanisms of invocation and interaction between contracts.

#### Solidity

Solidity 采用面向对象的方法，合约之间通过方法调用进行交互。这与传统面向对象编程语言中的方法调用类似。 This design is similar to method calls in traditional object-oriented programming languages.

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

#### FunC

在 TON 区块链生态系统中使用的 FunC 通过消息来调用智能合约并在智能合约之间进行交互。合约之间不直接调用方法，而是相互发送消息，消息中可包含数据和代码以供执行。 Instead of calling methods directly, contracts send messages to each other, which can contain data and code for execution.

请看这样一个例子：智能合约发送方必须发送包含一个数字的信息，而智能合约接收方必须接收该数字并对其执行一些操作。

首先，智能合约接收方必须说明它将如何接收信息。

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

**Receiving message flow:**

1. `recv_internal()` - 在区块链内直接访问合约时执行该函数。例如，当一个合约访问我们的合约时。 For example, when a contract accesses our contract.
2. 该函数接受合约余额、接收到的报文金额、包含原始报文的 cell 以及只存储接收到的报文正文的`in_msg_body`片段。
3. Our message body will store two integer numbers. The first number is a 32-bit unsigned integer `op` defining the smart contract's operation. You can draw some analogy with Solidity and think of `op` as a function signature.
4. 要读取结果片 `op` 和 `我们的数字`，我们使用 `load_uint()`。
5. Next, we execute business logic for a given operation. Note that we omitted this functionality in this example.

Next, the sender's smart contract is to send the message correctly. 接下来，发送者的智能合约要正确发送信息。这可以通过 `send_raw_message` 来完成，它需要一个序列化的消息作为参数。

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

**Sending message flow:**

1. Initially, we need to build our message. [不可弹回信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)
2. The body of the message represents a cell. 邮件正文代表一个 cell 。在 `msg_body_cell` 中，我们要做的是：`begin_cell()` - 为未来的 cell 创建 `Builder`, 第一个 `store_uint` - 将第一个 uint 保存到 `Builder` 中（1 - 这是我们的 `op`）, 第二个 `store_uint` - 将第二个 uint 保存到 `Builder` 中（num - 这是我们要在接收合约中操作的数字）, `end_cell()` - 创建 cell 。
3. 要在信息中附加 `recv_internal` 中的正文，我们需要在信息中使用 `store_ref` 引用所收集的 cell 。
4. 发送信息

这个例子介绍了智能合约如何相互通信。

[内部信息](/v3/documentation/smart-contracts/message-management/internal-messages)

## 另请参见

- [发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [声明](/v3/documentation/smart-contracts/func/docs/statements)

<Feedback />
