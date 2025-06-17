import Feedback from '@site/src/components/Feedback';

# FunC 开发手册

The FunC cookbook was created to consolidate all the knowledge and best practices from experienced FunC developers in one place. The goal is to make it easier for future developers to build smart contracts efficiently.

与 FunC 文档相比，本文更侧重于 FunC 开发者在智能合约开发过程中每天都要解决的任务。

## 基础知识

### 如何编写 if 语句

Let's say we want to check if any event is relevant. To do this, we use the flag variable. 假设我们想检查某个事件是否相关。为此，我们使用标志变量。记住在 FunC 中 `true` 是 `-1` 而 `false` 是 `0`。

To check whether an event is relevant, use a flag variable. In FunC, `true` is represented by `-1`, and `false` is `0`.

```func
int flag = 0; ;; false

if (flag) { 
    ;; do something
}
else {
    ;; reject the transaction
}
```

我们不需要使用 `==` 操作符，因为 `0` 的值是 `false`，所以任何其他值都将是 `true`。

[文档中的“If statement”](/develop/func/statements#if-statements)

### 如何编写 repeat 循环

A repeat loop helps execute an action a fixed number of times. The example below demonstrates exponentiation:

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {

    number *= multiplier;
}
```

[文档中的“Repeat loop”](/develop/func/statements#repeat-loop)

### 如何编写 while 循环

A while loop is useful when the number of iterations is unknown. The following example processes a `cell` which can store up to four references to other cells:

```func
cell inner_cell = begin_cell() ;; create a new empty builder
        .store_uint(123, 16) ;; store uint with value 123 and length 16 bits
        .end_cell(); ;; convert builder to a cell

cell message = begin_cell()
        .store_ref(inner_cell) ;; store cell as reference
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; convert cell to slice
while (msg.slice_refs_empty?() != -1) { ;; we should remind that -1 is true
    cell inner_cell = msg~load_ref(); ;; load cell from slice msg
    ;; do something
}
```

**References:**

- [文档中的“While loop”](/develop/func/statements#while-loop)
- [文档中的“Cell”](/learn/overviews/cells)
- [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
- [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
- [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
- [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
- [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何编写 do until 循环

当我们需要循环至少运行一次时，我们使用 `do until`。

```func
int flag = 0;

do {
    ;; do something even flag is false (0) 
} until (flag == -1); ;; -1 is true
```

[文档中的“Until loop”](/develop/func/statements#until-loop)

### 如何确定 slice 是否为空

Before working with a `slice`, checking whether it contains any data is essential to ensure proper processing. The `slice_empty?()` method can be used for this purpose. However, it returns `0` (`false`) if the slice contains at least one `bit` of data or one `ref`.

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
empty_slice.slice_data_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_data_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
slice_with_refs_only.slice_data_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_and_refs.slice_data_empty?();
```

**References:**

- [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
- [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
- [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
- 我们正在声明 tlen 汇编函数。你可以在 [此处](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) 和 [list of all assembler commands](/v3/documentation/tvm/instructions) 阅读更多内容。
- [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
- [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 slice 是否为空（没有任何 refs，但可能有 bits）

如果我们只对 `refs` 感兴趣，我们应该使用 `slice_refs_empty?()` 来检查它们的存在。

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
empty_slice.slice_refs_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
slice_with_bits_only.slice_refs_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_refs_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_bits_and_refs.slice_refs_empty?();
```

**References:**

- [文档中的“slice_data_empty?()”](/develop/func/stdlib#slice_data_empty)
- [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
- [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
- [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
- [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
- [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 slice 是否为空（不含任何 bits，但可能包含 refs）

要检查 `cell` 中是否有任何数据，我们应首先将其转换为 `slice`。如果我们只对 `bits` 感兴趣，应使用 `slice_data_empty?()`；如果只对 `refs` 感兴趣，则使用 `slice_refs_empty?()`。如果我们想检查是否有任何数据，无论是 `bit` 还是 `ref`，我们需要使用 `slice_empty?()`。

If only `refs` are of interest, their presence can be checked using the `slice_refs_empty?()`.

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_empty?()` returns `true`, because slice doesn't have any `bits` and `refs`
empty_slice.slice_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `bits` and `refs`
slice_with_bits_and_refs.slice_empty?();
```

**References:**

- [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
- [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
- [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
- 我们正在声明 `tlen` 汇编函数。您可以 [在此](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) 阅读更多内容，也可以查看 [所有汇编命令列表](/v3/documentation/tvm/instructions)。
- [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
- [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 cell 是否为空

To check whether a `cell` contains any data, it must first be converted into a `slice`.

- 如果我们只需要检查 `bits`，不关心 `slice` 中是否有任何 `refs`，那么我们应该使用 `slice_data_empty?()`。
- [文档中的“slice_refs()”](/develop/func/stdlib/#slice_refs)
- 在处理 `slice` 之前，需要检查它是否有数据以便正确处理。我们可以使用 `slice_empty?()` 来做到这一点，但我们必须考虑到，如果有至少一个 `bit` 的数据或一个 `ref`，它将返回 `-1`（`true`）。

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; Change `cell` type to slice with `begin_parse()`
slice cs = cell_with_bits_and_refs.begin_parse();

;; determine if slice is empty
if (cs.slice_empty?()) {
    ;; cell is empty
}
else {
    ;; cell is not empty
}
```

**References:**

- [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
- [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
- [文档中的 "store_uint() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
- [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
- [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 dict 是否为空

The `dict_empty?()` checks whether a dictionary contains any data. This method is functionally equivalent to `cell_null?()`, as a `null` cell typically represents an empty dictionary.

```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) { ;; Determine if dict is empty
    ;; dict is empty
}
else {
    ;; dict is not empty
}
```

**References:**

- [文档中的“dict_empty?()”](/develop/func/stdlib#dict_empty)
- [文档中的“new_dict()”](/develop/func/stdlib/#new_dict) 创建空字典
- 有一个 `dict_empty?()` 方法可以检查 dict 中是否有数据。这个方法相当于 `cell_null?()`，因为通常一个空的 cell 就是一个空字典。

### 如何确定 tuple 是否为空

When working with `tuples`, checking for existing values before extracting them is crucial. 在处理 `tuple` 时，重要的是始终知道里面是否有任何值可供提取。如果我们试图从一个空的 "元组 "中提取值，就会出现错误：不是有效大小的元组"，并显示 "退出代码 7"。

```func
;; Declare tlen function because it's not presented in stdlib
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple is empty
    }
    else {
        ;; tuple is not empty
    }
}
```

**Note:**
We are defining the `tlen` assembly function. You can find more details [here](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) and a see a [list of assembler commands](/v3/documentation/tvm/instructions).

**References:**

- [文档中的“null()”](/develop/func/stdlib/#null)
- 文档中的["tpush()"](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)
- [文档中的 "退出代码"](/v3/documentation/tvm/tvm-exit-codes)

### 如何判断 lisp 风格列表是否为空

We can use the [cons](/v3/documentation/smart-contracts/func/docs/stdlib/#cons) function to add an element to determine if a lisp-style list is empty. For example, adding 100 to the list ensures it is not empty.

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; list-style list is empty
} else {
    ;; list-style list is not empty
}
```

### 如何确定合约状态为空

Consider a smart contract with a `counter` that tracks the number of transactions. This variable does not exist in the contract state during the first transaction because it is empty.
It is important to handle this scenario by checking if the state is empty and initializing the `counter` accordingly.

```func
;; `get_data()` will return the data cell from contract state
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; contract data is empty, so we create counter and save it
    int counter = 1;
    ;; create cell, add counter and save in contract state
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; contract data is not empty, so we get our counter, increase it and save
    ;; we should specify correct length of our counter in bits
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

我们可以通过判断 [cell is empty](/v3/documentation/smart-contracts/func/cookbook#how-to-determine-if-cell-is-empty) 来确定合约状态为空。

**References:**

- [文档中的 "dict_set() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set)
- 文档中的["begin_parse()"](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
- 文档中的 ["slice_empty?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
- 文档中的 ["set_data?()"](/v3/documentation/smart-contracts/func/docs/stdlib#set_data)

### 如何建立内部信息 cell

When a smart contract needs to send an internal message, it must first construct the message as a `cell`. This includes specifying technical flags, the recipient's address, and additional data.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; we use `op` for identifying operations
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

**Note:**

- In this example, we use the literal `a` to obtain an address. More details on string literals can be found in the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals).
- You can find more details in the [documentation](/v3/documentation/smart-contracts/message-management/sending-messages). A direct link to the [layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) is also available.

**References:**

- [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
- [文档中的“store_uint()”](/develop/func/stdlib#store_uint)
- [文档中的 "store_slice() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [文档中的 "store_coins()"](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
- [文档中的 "end_cell()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
- [文档中的 "send_raw_message() "](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何将正文作为内部报文 cell 的 ref 来包含

The message body can contain `int`, `slices`, or `cells` following flags and other technical data. 在标志和其他技术数据之后的报文正文中，我们可以发送 `int`, `slice` 和 `cell`。对于后者，有必要在 `store_ref()` 之前将位设置为 `1`，以表示 `cell` 将继续。

Alternatively, if there is sufficient space, the message body can be stored in the same `cell` as the header. In this case, the bit should be set to `0`.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; Creating a cell with message
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; set bit to 1 to indicate that the cell will go on
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

**Note:**

- In this example, we use the literal `a` to obtain an address. More details on string literals can be found in the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals).
- The example uses [`mode 3`](/v3/documentation/smart-contracts/message-management/sending-messages#mode3), which ensures the contract deducts the specified amount while covering the transaction fee from the contract balance and ignoring errors.
  - `mode 64` returns all received tokens, subtracting the commission.
  - `mode 128` transfers the entire balance.
- 我们正在[构建消息](/develop/func/cookbook#how-to-build-an-internal-message-cell)，但单独添加消息体。

**References:**

- [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
- [文档中的 "store_uint() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
- [文档中的 "store_slice() "](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
- [文档中的 "store_coins()"](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
- [文档中的 "end_cell()"](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
- [文档中的 "send_raw_message() "](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何将正文作为片段包含在内部报文 cell 中

A message body can be sent as either a `cell` or a `slice`. In this example, the body is sent inside a `slice`.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

**Note:**

- The literal `a` is used to obtain an address. See the [documentation](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals) for details on string literals.
- The example uses `mode 3`, `mode 64`, and `mode 128`, as described above.
- 你可以在[文档](/develop/smart-contracts/messages)中找到更多信息。也可以通过这个链接跳转到[布局](/develop/smart-contracts/messages#message-layout)。

### 如何迭代 tuples（双向）

When working with arrays or stacks in FunC, tuples are essential. The first step is learning how to iterate through tuple values for processing.

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; do something with x
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; do something with x
        i = i - 1;
    }
}
```

**Note:**

- The `tlen` assembly function is declared [here](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition). You can read more about it and explore a [list of all assembler commands](/v3/documentation/tvm/instructions).
- The `to_tuple` function is also declared. This function converts any input into a tuple, so use it carefully.

### 如何使用 `asm` 关键字编写自己的函数

在使用任何功能时，我们实际上使用的是 `stdlib.fc` 内为我们预先准备好的方法。但事实上，我们还有更多的机会，我们需要学会自己编写。 However, we have many more capabilities, and learning to write custom functions unlocks new possibilities.

For example, while `tpush`, which adds an element to a `tuple`, exists, there is no built-in `tpop` function. In such cases, we must implement it ourselves.

```func
;; ~ means it is modifying method
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```

We must determine its length if we want to iterate over a `tuple`. 如果我们想知道用于迭代的 "元组 "的长度，则应使用 `TLEN` asm 指令编写一个新函数：

```func
int tuple_length (tuple t) asm "TLEN";
```

一些我们已经从 stdlib.fc 中了解到的函数示例：

```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

**References:**

- [文档中的 "修改方法"](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)
- [文档中的 "stdlib"](/v3/documentation/smart-contracts/func/docs/stdlib)
- [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 迭代嵌套的 n 个 tuples

Sometimes, we need to iterate through nested tuples. 有时我们想迭代嵌套的 tuples。以下示例将从头开始迭代并打印格式为 `[[2,6],[1,[3,[3,5]]], 3]` 的 tuple 中的所有项目

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; define global variable
global int max_value;

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            if(value > max_value) {
                max_value = value;
            }
        }
    }
}

() main () {
    tuple t = to_tuple([[2,6], [1, [3, [3, 5]]], 3]);
    int len = t.tuple_length();
    max_value = 0; ;; reset max_value;
    iterate_tuple(t); ;; iterate tuple and find max value
    ~dump(max_value); ;; 6
}
```

**References:**

- [文档中的 "全局变量"](/v3/documentation/smart-contracts/func/docs/global_variables)
- [文档中的"~dump"](/v3/documentation/smart-contracts/func/docs/builtins#dump-variable)
- [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 基本的 tuple 操作

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; creating an empty tuple
    tuple names = empty_tuple(); 
    
    ;; push new items
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; pop last item
    slice last_name = names~tpop();

    ;; get first item
    slice first_name = names.first();

    ;; get an item by index
    slice best_name = names.at(2);

    ;; getting the length of the list 
    int number_names = names.tlen();
}
```

### 解决 X 类问题

If a tuple contains various data types X (cell, slice, int, tuple, etc.), we may need to check the value and cast it accordingly before processing.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

forall X -> () resolve_type (X value) impure {
    ;; value here is of type X, since we dont know what is the exact value - we would need to check what is the value and then cast it
    
    if (is_null(value)) {
        ;; do something with the null
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; do something with the int
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; do something with the slice
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; do something with the cell
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; do something with the tuple
    }
}

() main () {
    ;; creating an empty tuple
    tuple stack = empty_tuple();
    ;; let's say we have tuple and do not know the exact types of them
    stack~tpush("Some text");
    stack~tpush(4);
    ;; we use var because we do not know type of value
    var value = stack~tpop();
    resolve_type(value);
}
```

[文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 如何获取当前时间

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; do some stuff 
}
```

### 如何生成随机数

:::caution 草案

This method is not cryptographically secure.
更多信息请查阅 [随机数生成](/v3/guidelines/smart-contracts/security/random-number-generation)。
:::

```func
randomize_lt(); ;; do this once

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### 模数运算

As an example, let’s say we need to perform the following calculation for all 256 numbers:

`(xp + zp) * (xp - zp)`.

Since these operations are commonly used in cryptography, we utilize the modulo operator for montgomery curves.

**Note:**
Variable names like `xp+zp` are valid as long as there are no spaces between the operators.

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod handles the next two lines itself
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

[文档中的 "muldivmod"](/v3/documentation/tvm/instructions#A98C)

### 如何抛出错误

```func
int number = 198;

throw_if(35, number > 50); ;; the error will be triggered only if the number is greater than 50

throw_unless(39, number == 198); ;; the error will be triggered only if the number is NOT EQUAL to 198

throw(36); ;; the error will be triggered anyway
```

[标准 tvm 异常代码](/v3/documentation/tvm/tvm-exit-codes)

### 反转 tuples

如果我们想在 FunC 中处理数组或堆栈，那么 tuple 就是必要的。首先，我们需要能够遍历值来处理它们。

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    tuple reversed_t = reverse_tuple(t);
    ~dump(reversed_t); ;; [10 9 8 7 6 5 4 3 2 1]
}
```

文档中的["tpush()"](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)

### 如何从列表中删除具有特定索引的项目

```func
int tlen (tuple t) asm "TLEN";

(tuple, ()) remove_item (tuple old_tuple, int place) {
    tuple new_tuple = empty_tuple();

    int i = 0;
    while (i < old_tuple.tlen()) {
        int el = old_tuple.at(i);
        if (i != place) {
            new_tuple~tpush(el);
        }
        i += 1;  
    }
    return (new_tuple, ());
}

() main () {
    tuple numbers = empty_tuple();

    numbers~tpush(19);
    numbers~tpush(999);
    numbers~tpush(54);

    ~dump(numbers); ;; [19 999 54]

    numbers~remove_item(1); 

    ~dump(numbers); ;; [19 54]
}
```

### 确定 slice 是否相等

There are two main ways to check if two slices are equal:

- Comparing their hashes.
- Using the SDEQ asm instruction.

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

() main () {
    slice a = "Some text";
    slice b = "Some text";
    ~dump(are_slices_equal_1?(a, b)); ;; -1 = true

    a = "Text";
    ;; We use literal `a` to get valid address inside slice from string containing address
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = false
}
```

**References:**

- 文档中的["slice_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
- [文档中的 "SDEQ"](/v3/documentation/tvm/instructions#C705)

### 确定 cell 是否相等

我们可以根据哈希值轻松确定 cell 是否相等。

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

() main () {
    cell a = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    cell b = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    ~dump(are_cells_equal?(a, b)); ;; -1 = true
}
```

docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### 确定 tuples 是否相等

A more advanced approach involves iterating through tuples and comparing each value recursively. Since tuples can contain different data types, we must check and cast values dynamically.

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
int are_slices_equal? (slice a, slice b) asm "SDEQ";

int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

(int) are_tuples_equal? (tuple t1, tuple t2) {
    int equal? = -1; ;; initial value to true
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; if tuples are differ in length they cannot be equal
        return 0;
    }

    int i = t1.tuple_length();
    
    while (i > 0 & equal?) {
        var v1 = t1~tpop();
        var v2 = t2~tpop();
        
        if (is_null(t1) & is_null(t2)) {
            ;; nulls are always equal
        }
        elseif (is_int(v1) & is_int(v2)) {
            if (cast_to_int(v1) != cast_to_int(v2)) {
                equal? = 0;
            }
        }
        elseif (is_slice(v1) & is_slice(v2)) {
            if (~ are_slices_equal?(cast_to_slice(v1), cast_to_slice(v2))) {
                equal? = 0;
            }
        }
        elseif (is_cell(v1) & is_cell(v2)) {
            if (~ are_cells_equal?(cast_to_cell(v1), cast_to_cell(v2))) {
                equal? = 0;
            }
        }
        elseif (is_tuple(v1) & is_tuple(v2)) {
            ;; recursively determine nested tuples
            if (~ are_tuples_equal?(cast_to_tuple(v1), cast_to_tuple(v2))) {
                equal? = 0;
            }
        }
        else {
            equal? = 0;
        }

        i -= 1;
    }

    return equal?;
}

() main () {
    tuple t1 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);
    tuple t2 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);

    ~dump(are_tuples_equal?(t1, t2)); ;; -1 
}
```

**References:**

- docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)
- [文档中的 "TVM 说明"](/v3/documentation/tvm/instructions)

### 生成内部地址

When deploying a new contract, we need to generate its internal address because it is initially unknown. 当我们的合约需要部署一个新合约，但不知道他的地址时，我们需要生成一个内部地址。假设我们已经有了 `state_init` - 新合约的代码和数据。

为相应的 MsgAddressInt TLB 创建内部地址。

```func
(slice) generate_internal_address (int workchain_id, cell state_init) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(cell_hash(state_init), 256)
    .end_cell().begin_parse();
}

() main () {
    slice deploy_address = generate_internal_address(workchain(), state_init);
    ;; then we can deploy new contract
}
```

**Note:** In this example, we use `workchain()` to retrieve the WorkChain ID. 在本例中，我们使用 `workchain()` 获取工作链的 ID。有关工作链 ID 的更多信息，请参阅 [docs](/v3/documentation/smart-contracts/addresses#workchain-id) 。

docs 中的["cell_hash()"](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### 生成外部地址

We use the TL-B scheme from [block.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L101C1-L101C12) to determine the address format to generate an external address.

```func
(int) ubitsize (int a) asm "UBITSIZE";

slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 9)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```

由于我们需要确定地址占用的位数，因此还需要[声明一个使用 `UBITSIZE` 操作码的 asm 函数](#how-to-write-own-functions-using-asm-keyword)，该函数将返回存储数字所需的最小位数。 This function will return the minimum number of bits required to store a given number.

[文档中的 "TVM 说明"](/v3/documentation/tvm/instructions#B603)

### 如何在本地存储中存储和加载字典

而存储字典的逻辑如下所示：

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

Storing the dictionary follows a similar approach, ensuring data persistence.

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

**References:**

- [文档中的 "get_data()"](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
- 文档中的["new_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict)
- 文档中的 ["slice_empty?()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
- 文档中的["load_dict()"](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
- [文档中的 "~"](/v3/documentation/smart-contracts/func/docs/statements#unary-operators)

### 如何发送简单信息

To send a simple message with a comment, prepend the message body with `32 bits` set to `0`, indicating that it is a `comment`.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

[文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)

### 如何用接收帐户发送信息

A proxy contract can facilitate secure message exchange if interaction between a user and the main contract is needed.

```func
() recv_internal (slice in_msg_body) {
    {-
        This is a simple example of a proxy-contract.
        It will expect in_msg_body to contain message mode, body and destination address to be sent to.
    -}

    int mode = in_msg_body~load_uint(8); ;; first byte will contain msg mode
    slice addr = in_msg_body~load_msg_addr(); ;; then we parse the destination address
    slice body = in_msg_body; ;; everything that is left in in_msg_body will be our new message's body

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; just for example
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

**References:**

- [文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)
- [文档中的"load_msg_addr() "](/v3/documentation/smart-contracts/func/docs/stdlib/#load_msg_addr)

### 如何发送包含全部余额的信息

如果我们需要发送智能合约的全部余额，那么在这种情况下，我们需要使用发送 "mode 128"。这种情况的一个例子是代理合约，它接受付款并转发给主合约。 This is particularly useful for proxy contracts that receive payments and forward them to the main contract.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(0) ;; we don't care about this value right now
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract
```

**References:**

- [文档中的 "消息布局"](/v3/documentation/smart-contracts/message-management/sending-messages)
- [文档中的 "消息模式"](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### 如何发送带有长文本注释的信息

我们知道，一个 " cell "（< 1023 位）只能容纳 127 个字符。如果我们需要更多，就需要组织 snake cells 。
A sequence of linked cells ("snake cells") must be used if more space is required.

```func
{-
    If we want to send a message with really long comment, we should split the comment to several slices.
    Each slice should have <1023 bits of data (127 chars).
    Each slice should have a reference to the next one, forming a snake-like structure.
-}

cell body = begin_cell()
    .store_uint(0, 32) ;; zero opcode - simple message with comment
    .store_slice("long long long message...")
    .store_ref(begin_cell()
        .store_slice(" you can store string of almost any length here.")
        .store_ref(begin_cell()
            .store_slice(" just don't forget about the 127 chars limit for each slice")
        .end_cell())
    .end_cell())
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    ;; We use literal `a` to get valid address inside slice from string containing address 
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

[文档中的 "内部信息"](/v3/documentation/smart-contracts/message-management/internal-messages)

### 如何从片段中只获取数据位（无参考文献）

If `refs` within a `slice` are unnecessary, only the raw data bits can be extracted for further processing.

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; some references
    .store_ref(begin_cell().end_cell()) ;; some references
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

**References:**

- [文档中的 " slice 原语"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice-primitives)
- 文档中的["preload_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#preload_bits)
- 文档中的["slice_bits()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_bits)

### 如何定义自己的修改方法

修改方法允许在同一变量内修改数据。这可以与其他编程语言中的引用相比较。

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; load 8 bits (one char) from slice
    x -= 48; ;; char '0' has code of 48, so we substract it to get the digit as a number
    return (s, (x)); ;; return our modified slice and loaded digit
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; here s is equal to "", and c1 = 2, c2 = 5, c3 = 8
}
```

[文档中的 "修改方法"](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)

### How to raise number to the power of n

```func
;; Unoptimized variant
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i < n - 1) {
        a *= value;
        i += 1;
    }
    return a;
}

;; Optimized variant
(int) binpow (int n, int e) {
    if (e == 0) {
        return 1;
    }
    if (e == 1) {
        return n;
    }
    int p = binpow(n, e / 2);
    p *= p;
    if ((e % 2) == 1) {
        p *= n;
    }
    return p;
}

() main () {
    int num = binpow(2, 3);
    ~dump(num); ;; 8
}
```

### 如何将字符串转换为 int

```func
slice string_number = "26052021";
int number = 0;

while (~ string_number.slice_empty?()) {
    int char = string_number~load_uint(8);
    number = (number * 10) + (char - 48); ;; we use ASCII table
}

~dump(number);
```

### 如何将 int 转换为 string

```func
int n = 261119911;
builder string = begin_cell();
tuple chars = null();
do {
    int r = n~divmod(10);
    chars = cons(r + 48, chars);
} until (n == 0);
do {
    int char = chars~list_next();
    string~store_uint(char, 8);
} until (null?(chars));

slice result = string.end_cell().begin_parse();
~dump(result);
```

### 如何遍历字典

Dictionaries are useful for managing large datasets. 字典在处理大量数据时非常有用。我们可以使用内置方法 `dict_get_min?` 和 `dict_get_max?` 分别获取键值的最小值和最大值。此外，我们还可以使用 `dict_get_next?` 遍历字典。

```func
cell d = new_dict();
d~udict_set(256, 1, "value 1");
d~udict_set(256, 5, "value 2");
d~udict_set(256, 12, "value 3");

;; iterate keys from small to big
(int key, slice val, int flag) = d.udict_get_min?(256);
while (flag) {
    ;; do something with pair key->val
    
    (key, val, flag) = d.udict_get_next?(256, key);
}
```

**References:**

- [文档中的 "字典原语"](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives)
- [文档中的 "dict_get_max?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_max)
- [文档中的 "dict_get_min?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_min)
- [文档中的"dict_get_next?() "](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)
- [文档中的“dict_set()”](/develop/

### How to delete value from dictionaries

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> means that key was not found in a dictionary
```

### 如何递归遍历 cell 树

Each `cell` can store up to `1023 bits` of data and `4 refs`. A tree of cells can be used to handle more complex data structures, requiring recursive iteration.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; just some cell for example
    cell c = begin_cell()
        .store_uint(1, 16)
        .store_ref(begin_cell()
            .store_uint(2, 16)
        .end_cell())
        .store_ref(begin_cell()
            .store_uint(3, 16)
            .store_ref(begin_cell()
                .store_uint(4, 16)
            .end_cell())
            .store_ref(begin_cell()
                .store_uint(5, 16)
            .end_cell())
        .end_cell())
    .end_cell();

    ;; creating tuple with no data, which plays the role of stack
    tuple stack = null();
    ;; bring the main cell into the stack to process it in the loop
    stack~push_back(c);
    ;; do it until stack is not null
    while (~ stack.is_null()) {
        ;; get the cell from the stack and convert it to a slice to be able to process it
        slice s = stack~pop_back().begin_parse();

        ;; do something with s data

        ;; if the current slice has any refs, add them to stack
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

**References:**

- 我们使用 [cons](/v3/documentation/smart-contracts/func/docs/stdlib/#cons)函数将数字 100 添加到列表样式的列表中，因此它不是空的。
- [文档中的“null()”](/develop/func/stdlib/#null)
- [文档中的 "slice_refs()"](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)

### 如何遍历 Lisp 类型列表

A tuple can hold up to 255 values. If more space is needed, a lisp-style list can be used by nesting tuples within tuples, effectively bypassing the limit.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; some example list
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; iterating through elements
    ;; note that this iteration is in reversed order
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; do something with x
    }
}
```

**References:**

- [文档中的“Lisp风格列表”](/develop/func/stdlib/#lisp-style-lists)
- [文档中的 "null() "](/v3/documentation/smart-contracts/func/docs/stdlib/#null)

### 如何发送部署消息（仅使用 stateInit 或使用 stateInit 和 body）

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}

() deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(1, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .store_ref(body)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}
```

### 如何构建 stateInit cell

```func
() build_stateinit(cell init_code, cell init_data) {
  var state_init = begin_cell()
    .store_uint(0, 1) ;; split_depth:(Maybe (## 5))
    .store_uint(0, 1) ;; special:(Maybe TickTock)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)
    .store_ref(init_code)
    .store_ref(init_data)
    .end_cell();
}
```

### 如何计算合约地址（使用 stateInit）

```func
() calc_address(cell state_init) {
  var future_address = begin_cell() 
    .store_uint(2, 2) ;; addr_std$10
    .store_uint(0, 1) ;; anycast:(Maybe Anycast)
    .store_uint(0, 8) ;; workchain_id:int8
    .store_uint(cell_hash(state_init), 256) ;; address:bits256
    .end_cell();
}
```

### 如何更新智能合约逻辑

下面是一个简单的 `СounterV1` 智能合约，它具有递增计数器和更新智能合约逻辑的功能。

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

After interacting with the contract, you may realize that the functionality for decrementing the counter is missing. To fix this, copy the code from `CounterV1` and add a new `decrease` function next to the existing `increase` function. Your updated code will look like this:

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::decrease) {
        int decrease_by = in_msg_body~load_uint(32);
        ctx_counter -= increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

一旦智能合约 "CounterV2 "准备就绪，你必须将其编译到链外的 "cell "中，并向 "CounterV1 "智能合约发送升级消息。

```javascript
await contractV1.sendUpgrade(provider.sender(), {
    code: await compile('ContractV2'),
    value: toNano('0.05'),
});
```

**References:**

- [是否可以将代码重新部署到现有地址，还是必须将其作为新合约部署？](/v3/documentation/faq#is-it-possible-to-re-deploy-code-to-an-existing-address-or-does-it-have-to-be-deployed-as-a-new-contract)
- [文档中的 "set_code()"](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)

<Feedback />

