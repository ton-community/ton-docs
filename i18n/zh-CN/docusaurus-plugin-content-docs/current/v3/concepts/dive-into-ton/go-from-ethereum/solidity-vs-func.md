# Solidity 与 FunC

智能合约开发涉及使用预定义语言，如以太坊的 Solidity 和 TON 的 FunC。
Solidity 是一种面向对象、高级、严格类型的语言，受到 C++、Python 和 JavaScript 的影响，专门用于编写在以太坊区块链平台上执行的智能合约。

FunC 也是一种高级语言，用于在 TON 区块链上对智能合约进行编程，是一种特定领域的、类似 C 语言的静态类型语言。

下文将简要分析这些语言的以下方面，即数据类型、存储、函数、流程控制结构和字典（哈希图）。

## 存储布局

Solidity 提供一种扁平存储模型，这意味着所有状态变量都存储在称为存储空间的单个连续内存块中。存储空间是一个键值存储空间，其中每个键是一个 256 位（32 字节）整数，代表存储槽编号，每个值是存储在该槽中的 256 位字。插槽从 0 开始按顺序编号，每个插槽可存储一个字。Solidity 允许程序员使用存储关键字来定义状态变量，从而指定存储布局。定义变量的顺序决定了它们在存储空间中的位置。

TON 区块链中的永久存储数据以 cell 的形式存储。Cell 在基于堆栈的 TVM 中扮演着存储器的角色。一个 cell 可以转化为一个 slice，然后通过从 slice 中加载 cell 中的数据位和对其他 cell 的引用来获取这些数据位和引用。其他 cell 的数据位和引用可以存储到构建器中，然后将构建器最终转化为新的 cell。

## 数据类型

Solidity 包含以下基本数据类型：

- Signed/Unsigned integers
- Boolean
- Addresses - 用于存储以太坊钱包或智能合约地址，通常约 20 字节。地址类型可以后缀关键字 "payable"，这就限制了它只能存储钱包地址，并使用传输和发送加密功能。
- Byte arrays --用关键字 "字节 "声明，是一个固定大小的数组，用于存储预定义的字节数，最多 32 个，通常与关键字一起声明。
- Literals - 不可更改的值，如地址、有理数和整数、字符串、统一码和十六进制数，可存储在变量中。
- Enums
- Arrays (fixed/dynamic)
- Structs
- Mappings

就 FunC 而言，主要数据类型有

- Integers
- cell  - TON 不透明数据结构的基本结构，包含多达 1 023 个比特和多达 4 个对其他 cell 的引用
- Slice 和 Builder - 用于读取和写入 cell 的特殊对象、
- Continuation --另一种包含可随时执行的 TVM 字节代码的 cell 类型
- Tuples - 是由最多 255 个元件组成的有序集合，具有任意值类型，可能是不同的。
- Tensors - 是一个有序集合，可用于大量赋值，如(int, int) a = (2, 4)。张量类型的一个特例是单位类型 () 。它表示函数不返回任何值，或者没有参数。

目前，FunC 不支持定义自定义类型。

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## 声明和使用变量

Solidity 是一种静态类型语言，这意味着每个变量的类型必须在声明时指定。

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

FunC 是一种更抽象、更面向函数的语言，它支持动态类型和函数式编程风格。

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

### 参阅

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## 循环

Solidity 支持 `for`、`while` 和 `do { ... } while` 循环。

如果你想把一件事做 10 次，可以这样做：

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

而 FunC 支持`repeat`、`while`和`do { ... } until`循环。不支持 for 循环。如果想在 Func 上执行与上述示例相同的代码，可以使用 `repeat` 和 `while` 循环。

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## Functions

Solidity 在处理函数声明时，兼顾了清晰性和控制性。在这种编程语言中，每个函数都以关键字 "function "开始，然后是函数名称及其参数。函数的主体用大括号括起来，明确定义了操作范围。此外，返回值用关键字 "returns "表示。Solidity的与众不同之处在于它对函数可见性的分类--函数可以被指定为 `public`, `private`, `internal`, 或 `external`，这就决定了在什么条件下它们可以被合同的其他部分或外部实体访问和调用。下面是一个在 Solidity 语言中设置全局变量 "num "的例子：

```js
function set(uint256 _num) public returns (bool) {
    num = _num;
    return true;
}
```

过渡到 FunC，FunC 程序本质上是函数声明/定义和全局变量声明的列表。FunC 函数声明通常以一个可选声明符开始，然后是返回类型和函数名称。接下来列出参数，最后以一系列指定符结束声明，如 "impure"、"inline/inline_ref "和 "method_id"。这些指定符可以调整函数的可见性、修改合约存储的能力以及内联行为。下面是一个例子，我们在 Func 语言中将存储变量作为 cell 存储到持久化存储中：

```func
() save_data(int num) impure inline {
  set_data(begin_cell()
            .store_uint(num, 32)
           .end_cell()
          );
}
```

### 另请参见

- [函数](/v3/documentation/smart-contracts/func/docs/functions)

## 流程控制结构

Solidity中提供了大多数大括号语言中的控制结构，包括if"、"else"、"while"、"do"、"for"、"break"、"continue"、"return"，以及 C 或 JavaScript 中的常用语义。

FunC 支持经典的 `if-else` 语句，以及 `ifnot`、`repeat`、`while` 和 `do/until` 循环。  此外，自 v0.4.0 起，FunC 还支持`try-catch`语句。

### 另请参见

- [声明](/v3/documentation/smart-contracts/func/docs/statements)

## Dictionaries

字典 (哈希表/映射)(hashmap/mapping) 数据结构对 Solidity 和 FunC 合约开发非常重要，因为它允许开发人员在智能合约中有效地存储和检索数据，特别是与特定密钥相关的数据，如用户余额或资产所有权。

Mapping 是 Solidity 中的一个哈希表，以键值对的形式存储数据，其中键可以是任何内置数据类型（不包括引用类型），而数据类型的值可以是任何类型。Mapping 通常用于 Solidity 和以太坊区块链，将唯一的以太坊地址与相应的值类型连接起来。在其他编程语言中，mapping 相当于字典。

在 Solidity 中，映射没有长度，也没有设置键或值的概念。映射只适用于作为存储引用类型的状态变量。当映射被初始化时，它们包括所有可能的键，并映射到字节表示全部为零的值。

与 FunC 中的映射类似的是字典或 TON 哈希表。在 TON 中，哈希表是一种由 cell 树表示的数据结构。哈希表将键映射到任意类型的值，以便快速查找和修改。在 TVM 中，哈希表的抽象表示形式是 Patricia 树或紧凑型二叉树。处理潜在的大型 cell 树会产生一些问题。每次更新操作都会构建相当数量的 cell （每构建一个 cell 耗费 500 个 gas ），这意味着如果不小心使用，这些操作可能会耗尽资源。为避免超出 gas 限制，应限制单个事务中字典更新的次数。此外，一棵包含 `N` 个键值对的二叉树包含 `N-1` 个分叉，这意味着总共至少需要 `2N-1` 个 cell 。智能合约的存储空间仅限于 `65536` 个唯一 cell ，因此字典中的最大条目数为 `32768`，如果存在重复 cell ，则条目数会稍多一些。

### 参阅

- [TON 中的字典](/v3/documentation/smart-contracts/func/docs/dictionaries)

## 智能合约通信

Solidity 和 FunC 提供了与智能合约交互的不同方法。主要区别在于合约之间的调用和交互机制。

Solidity 采用面向对象的方法，合约之间通过方法调用进行交互。这与传统面向对象编程语言中的方法调用类似。

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

在 TON 区块链生态系统中使用的 FunC 通过消息来调用智能合约并在智能合约之间进行交互。合约之间不直接调用方法，而是相互发送消息，消息中可包含数据和代码以供执行。

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

让我们详细讨论一下目的地合同中接收信息的情况：

1. `recv_internal()` - 在区块链内直接访问合约时执行该函数。例如，当一个合约访问我们的合约时。
2. 该函数接受合约余额、接收到的报文金额、包含原始报文的 cell 以及只存储接收到的报文正文的`in_msg_body`片段。
3. 我们的信息体将存储两个整数。第一个数字是一个 32 位无符号整数 `op`，用于标识要执行的 `操作`，或者要调用的智能合约的 `方法`。可以类比 Solidity，将 `op` 视为函数签名。第二个数字是我们需要执行一些操作的数字。
4. 要读取结果片 `op` 和 `我们的数字`，我们使用 `load_uint()`。
5. 接下来，我们对数字进行操作（本例中省略了这一功能）。

接下来，发送者的智能合约要正确发送信息。这可以通过 `send_raw_message` 来完成，它需要一个序列化的消息作为参数。

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

让我们详细讨论一下智能合约向收件人发送信息的过程：

1. 首先，我们需要创建信息。发送的完整结构可以在 [这里](/v3/documentation/smart-contracts/message-management/sending-messages) 找到。我们不会在这里详细介绍如何组装，你可以在链接中阅读。
2. 邮件正文代表一个 cell 。在 `msg_body_cell` 中，我们要做的是：`begin_cell()` - 为未来的 cell 创建 `Builder`, 第一个 `store_uint` - 将第一个 uint 保存到 `Builder` 中（1 - 这是我们的 `op`）, 第二个 `store_uint` - 将第二个 uint 保存到 `Builder` 中（num - 这是我们要在接收合约中操作的数字）, `end_cell()` - 创建 cell 。
3. 要在信息中附加 `recv_internal` 中的正文，我们需要在信息中使用 `store_ref` 引用所收集的 cell 。
4. 发送信息

这个例子介绍了智能合约如何相互通信。

### 另请参见

- [内部信息](/v3/documentation/smart-contracts/message-management/internal-messages)
- [发送信息](/v3/documentation/smart-contracts/message-management/sending-messages)
- [不可弹回信息](/v3/documentation/smart-contracts/message-management/non-bounceable-messages)
