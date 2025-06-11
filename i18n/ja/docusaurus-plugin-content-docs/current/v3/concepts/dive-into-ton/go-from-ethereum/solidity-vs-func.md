import Feedback from '@site/src/components/Feedback';

# Solidity vs FunC

## Introduction

Smart contract development involves using predefined languages such as Solidity for Ethereum and FunC for TON.
Solidity is an object-oriented, high-level, strictly typed language influenced by C++, Python, and JavaScript. It is designed explicitly to write smart contracts on Ethereum blockchain platforms.

FunC is a high-level language used to program smart contracts on TON Blockchain. It is a domain-specific, C-like, statically typed language.

The sections below will analyze briefly the following aspects of these languages: data types, storage, functions, flow control structures, and dictionaries (hashmaps).

## Differences of Solidity and FunC

### ストレージのレイアウト

#### Solidity

Solidity uses a flat storage model, meaning it stores all state variables in a single, continuous block of memory called storage. The storage is a key-value store where each key is a 256-bit integer representing the storage slot number, and each value is the 256-bit word stored at that slot. Ethereum numbers the slots sequentially, starting from zero, and each slot can store a single word. Solidity allows the programmer to specify the storage layout using the storage keyword to define state variables. The order in which you define the variables determines their position in the storage.

#### FunC

Permanent storage data in TON Blockchain is stored as a cell. Cells play the role of memory in the stack-based TVM. To read data from a cell, you need to transform a cell into a slice and then obtain the data bits and references to other cells by loading them from the slice. To write data, you must store data bits and references to other cells in a builder and cast the builder into a new cell.

### データタイプ

#### Solidity

Solidityには以下の基本的なデータ型が含まれています。

- **Signed** and **Unsigned** integers
- **Boolean**
- **Addresses**, typically around 20 bytes, are used to store Ethereum wallet or smart contract addresses. If the address type contains the suffix keyword `payable,` it restricts it from storing only wallet addresses and using the transfer and send crypto functions.
- **Byte arrays** — declared with the keyword **bytes**, is a fixed-size array used to store a predefined number of bytes up to 32, usually declared along with the keyword.
- **Literals** — Immutable values such as addresses, rationals and integers, strings, Unicode, and hexadecimal can be stored in a variable.
- **Enums**
- **Arrays** fixed or dynamic)
- **Structs**
- **Mappings**

#### FunC

In the case of FunC, the main data types are:

- **Integers**
- **Cell** — basic for TON opaque data structure, which contains up to 1,023 bits and up to 4 references to other cells
- **Slice** and **Builder** — special flavors of the cell to read from and write to cells,
- **Continuation** — another flavour of cell that contains ready-to-execute TVM byte-code
- **Tuples** — is an ordered collection of up to 255 components, having arbitrary value types, possibly distinct.
- **Tensors** — is an ordered collection ready for mass assigning like: `(int, int) a = (2, 4)`. A special case of tensor type is the unit type `()`. It represents that a function doesn’t return any value or has no arguments.

Currently, FunC does not support defining custom types. Read more about types in the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### 変数の宣言と使用

#### Solidity

Solidity is a statically typed language, meaning each variable's type must be specified when declared.

```js
uint test = 1; // Declaring an unsigned variable of integer type
bool isActive = true; // Logical variable
string name = "Alice"; // String variable
```

#### FunC

FunC is a more abstract and function-oriented language. It supports dynamic typing and functional programming styles.

```func
(int x, int y) = (1, 2); // A tuple containing two integer variables
var z = x + y; // Dynamic variable declaration 
```

Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### ループ

#### Solidity

Solidityは`for`、`while`、`do { ... } while`ループをサポートしています。

10回やりたいことがあれば、次のようにできます。

```js
uint x = 1;

for (uint i; i < 10; i++) {
    x *= 2;
}

// x = 1024
```

#### FunC

FunC, in turn, supports `repeat`, `while`, and `do { ... } until` loops. The `for` loop is not supported. If you want to execute the same code as in the example above on Func, you can use `repeat`

```func
int x = 1;
repeat(10) {
  x *= 2;
}
;; x = 1024
```

Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### 関数

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

Read more on [Functions](/v3/documentation/smart-contracts/func/docs/functions/) page.

### フロー制御構造

#### Solidity

中括弧言語で知られている制御構造のほとんどは、 `if` を含む、 Solidity で利用できます。 `else`, `while`, `do`, `for`, `break`, `continue`, `return`, 通常のセマンティクスはCやJavaScriptで知られています。

#### FunC

FunC supports classic `if-else` statements, `ifnot`, `repeat`, `while`, and `do/until` loops.  Also, since v0.4.0, `try-catch` statements are supported.

Read more on the [Statements](/v3/documentation/smart-contracts/func/docs/statements/) page.

### Dictionaries

Dictionary or hashmap data structure is essential for Solidity and FunC contract development because it allows developers to efficiently store and retrieve data in smart contracts, specifically data related to a specific key, such as a user’s balance or ownership of an asset.

#### Solidity

Mapping is a hash table in Solidity that stores data as key-value pairs, where the key can be any of the built-in data types, excluding reference types, and the data type's value can be any type. In Solidity and on the Ethereum blockchain, mappings typically connect a unique Ethereum address to a corresponding value type. In any other programming language, a mapping is equivalent to a dictionary.

In Solidity, mappings don't have a length or the concept of setting a key or a value. Mappings are only applicable to state variables that serve as store reference types. When you initialize mappings, they include every possible key and map to values whose byte representations are all zeros.

#### FunC

An analogy of mappings in FunC is dictionaries or TON hashmaps. In the context of TON, a hashmap is a data structure represented by a tree of cells. Hashmap maps keys to values ​​of arbitrary type so that quick lookup and modification are possible. The abstract representation of a hashmap in TVM is a Patricia tree or a compact binary trie.

Working with potentially large cell trees can create several problems. Each update operation builds an appreciable number of cells (each cell built costs 500 gas), meaning these operations can run out of resources if used carelessly. To avoid exceeding the gas limit, limit the number of dictionary updates in a single transaction.

Also, a binary tree for `N` key-value pairs contains `N-1` forks, which means a total of at least `2N-1` cells. The storage of a smart contract is limited to `65536` unique cells, so the maximum number of entries in the dictionary is `32768`, or slightly more if there are repeating cells.

Read more about [Dictionaries in TON](/v3/documentation/smart-contracts/func/docs/dictionaries/).

### Smart contract communication

SolidityとFunCはスマートコントラクトとの相互作用に異なるアプローチを提供し、主な違いは、契約間の呼び出しと相互作用のメカニズムにあります。 The main difference lies in the mechanisms of invocation and interaction between contracts.

#### Solidity

Solidity uses object-orienteered contracts that interact with each other through method calls. This design is similar to method calls in traditional object-oriented programming languages.

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

FunC, used in the TON blockchain ecosystem, operates on messages to invoke and interact between smart contracts. Instead of calling methods directly, contracts send messages to each other, which can contain data and code for execution.

スマートコントラクト送信者が番号付きのメッセージを送信する場合の例を考えてみましょう。 スマートコントラクト受信機はその番号を受け取ってその上で何らかの操作をしなければなりません

最初に、スマートコントラクトの受信者はメッセージを受信する方法を記述しなければなりません。

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

1. `recv_internal()` function is executed when a contract is accessed directly within the blockchain. For example, when a contract accesses our contract.
2. The function accepts the amount of the contract balance, the amount of the incoming message, the cell with the original message, and the `in_msg_body` slice, which stores only the body of the received message.
3. Our message body will store two integer numbers. The first number is a 32-bit unsigned integer `op` defining the smart contract's operation. You can draw some analogy with Solidity and think of `op` as a function signature.
4. We use `load_uint ()` to read `op` as a number from the resulting slice.
5. Next, we execute business logic for a given operation. Note that we omitted this functionality in this example.

Next, the sender's smart contract is to send the message correctly. 次に、送信者のスマートコントラクトは、メッセージを正しく送信することです。これは、引数としてシリアル化されたメッセージを期待する `send_raw_message` で行われます。

```func
int num = 10;
cell msg_body_cell = begin_cell().store_uint(1,32).store_uint(num,32).end_cell();

var msg = begin_cell()
            .store_uint(0x18, 6)
            .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; in the example, we hardcode the recipient's address
            .store_coins(0)
            .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
            .store_ref(msg_body_cell)
        .end_cell();

send_raw_message(msg, mode);
```

**Sending message flow:**

1. Initially, we need to build our message. The complete structure of the send can be found [here](/v3/documentation/smart-contracts/message-management/sending-messages/).
2. The body of the message represents a cell. メッセージの本文はセルを表します。 `msg_body_cell`では、`begin_cell()` - 将来のセル用に`Builder`を作成します。 first `store_uint` - 最初の uint を `Builder` に格納します（1 - これは私たちの `op`です）。 2番目の`store_uint` - 2番目のuintを`Builder`に格納します（num - これは受信契約で操作する私たちの数です） `end_cell()` - セルを作成します。
3. メッセージ内の `recv_internal` に含まれる本体をアタッチするには、メッセージ自体の集められたセルを `store_ref` で参照します。
4. メッセージを送信しています。

この例では、スマートコントラクトが互いに通信する方法を示しました。

Read more on the [Internal messages](/v3/documentation/smart-contracts/overview/) page.

## See also

- [TON documentation](/v3/documentation/ton-documentation/)
- [FunC overview](/v3/documentation/smart-contracts/func/overview/)

<Feedback />
