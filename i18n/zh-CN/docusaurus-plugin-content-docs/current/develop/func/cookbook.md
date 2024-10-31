# FunC 开发手册

创建 FunC 开发手册的核心原因是将所有 FunC 开发者的经验汇集在一个地方，以便未来的开发者们使用！

与 FunC 文档相比，本文更侧重于 FunC 开发者在智能合约开发过程中每天都要解决的任务。

## 基础知识
### 如何编写 if 语句

假设我们想检查某个事件是否相关。为此，我们使用标志变量。记住在 FunC 中 `true` 是 `-1` 而 `false` 是 `0`。

```func
int flag = 0; ;; false

if (flag) { 
    ;; 做一些事情
}
else {
    ;; 拒绝交易
}
```

> 💡 注意
> 
> 我们不需要使用 `==` 操作符，因为 `0` 的值是 `false`，所以任何其他值都将是 `true`。

> 💡 有用的链接
>  
> [文档中的“If statement”](/develop/func/statements#if-statements)

### 如何编写 repeat 循环

以指数运算为例

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {

    number *= multiplier;
}
```

> 💡 有用的链接
> 
> [文档中的“Repeat loop”](/develop/func/statements#repeat-loop)

### 如何编写 while 循环

当我们不知道要执行特定操作多少次时，while 循环很有用。例如，取一个 `cell`，我们知道它可以存储最多四个对其他 cell 的引用。

```func
cell inner_cell = begin_cell() ;; 创建一个新的空构建器
        .store_uint(123, 16) ;; 存储值为 123 且长度为 16 位的 uint
        .end_cell(); ;; 将构建器转换为 cell

cell message = begin_cell()
        .store_ref(inner_cell) ;; 将 cell 作为引用存储
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; 将 cell 转换为 slice
while (msg.slice_refs_empty?() != -1) { ;; 我们应该记住 -1 是 true
    cell inner_cell = msg~load_ref(); ;; 从 slice msg 中加载 cell
    ;; 做一些事情
}
```

> 💡 有用的链接
> 
> [文档中的“While loop”](/develop/func/statements#while-loop)
>
> [文档中的“Cell”](/learn/overviews/cells)
>
> [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
>
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
> 
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
> 
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何编写 do until 循环

当我们需要循环至少运行一次时，我们使用 `do until`。

```func 
int flag = 0;

do {
    ;; 即使 flag 是 false (0) 也做一些事情
} until (flag == -1); ;; -1 是 true
```

> 💡 有用的链接
> 
> [文档中的“Until loop”](/develop/func/statements#until-loop)

### 如何确定 slice 是否为空

在处理 `slice` 之前，需要检查它是否有数据以便正确处理。我们可以使用 `slice_empty?()` 来做到这一点，但我们必须考虑到，如果有至少一个 `bit` 的数据或一个 `ref`，它将返回 `-1`（`true`）。

```func
;; 创建空 slice
slice empty_slice = "";
;; `slice_empty?()` 返回 `true`，因为 slice 没有任何 `bits` 和 `refs`
empty_slice.slice_empty?();

;; 创建仅包含 bits 的 slice
slice slice_with_bits_only = "Hello, world!";
;; `slice_empty?()` 返回 `false`，因为 slice 有 `bits`
slice_with_bits_only.slice_empty?();

;; 创建仅包含 refs 的 slice
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` 返回 `false`，因为 slice 有 `refs`
slice_with_refs_only.slice_empty?();

;; 创建包含 bits 和 refs 的 slice
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` 返回 `false`，因为 slice 有 `bits` 和 `refs`
slice_with_bits_and_refs.slice_empty?();
```
> 💡 有用的链接
>
> [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
> 
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
> 
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
> 
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
> 
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)


### 如何确定 slice 是否为空（不含任何 bits，但可能包含 refs）

如果我们只需要检查 `bits`，不关心 `slice` 中是否有任何 `refs`，那么我们应该使用 `slice_data_empty?()`。

```func 
;; 创建空 slice
slice empty_slice = "";
;; `slice_data_empty?()` 返回 `true`，因为 slice 没有任何 `bits`
empty_slice.slice_data_empty?();

;; 创建仅包含 bits 的 slice
slice slice_with_bits_only = "Hello, world!";
;; `slice_data_empty?()` 返回 `false`，因为 slice 有 `bits`
slice_with_bits_only.slice_data_empty?();

;; 创建仅包含 refs 的 slice
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` 返回 `true`，因为 slice 没有 `bits`
slice_with_refs_only.slice_data_empty?();

;; 创建包含 bits 和 refs 的 slice
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` 返回 `false`，因为 slice 有 `bits`
slice_with_bits_and_refs.slice_data_empty?();
```

> 💡 有用的链接
>
> [文档中的“slice_data_empty?()”](/develop/func/stdlib#slice_data_empty)
> 
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
> 
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
> 
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
> 
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 slice 是否为空（没有任何 refs，但可能有 bits）

如果我们只对 `refs` 感兴趣，我们应该使用 `slice_refs_empty?()` 来检查它们的存在。

```func 
;; 创建空 slice
slice empty_slice = "";
;; `slice_refs_empty?()` 返回 `true`，因为 slice 没有任何 `refs`
empty_slice.slice_refs_empty?();

;; 创建只包含 bits 的 slice
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` 返回 `true`，因为 slice 没有任何 `refs`
slice_with_bits_only.slice_refs_empty?();

;; 创建只包含 refs 的 slice
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` 返回 `false`，因为 slice 有 `refs`
slice_with_refs_only.slice_refs_empty?();

;; 创建包含 bits 和 refs 的 slice
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` 返回 `false`，因为 slice 有 `refs`
slice_with_bits_and_refs.slice_refs_empty?();
```

> 💡 有用的链接
> 
> [文档中的“slice_refs_empty?()”](/develop/func/stdlib#slice_refs_empty)
> 
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
> 
> [文档中的“store_ref()”](/develop/func/stdlib#store_ref)
> 
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
> 
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 cell 是否为空

要检查 `cell` 中是否有任何数据，我们应首先将其转换为 `slice`。如果我们只对 `bits` 感兴趣，应使用 `slice_data_empty?()`；如果只对 `refs` 感兴趣，则使用 `slice_refs_empty?()`。如果我们想检查是否有任何数据，无论是 `bit` 还是 `ref`，我们需要使用 `slice_empty?()`。

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; 将 `cell` 类型更改为 slice，使用 `begin_parse()`
slice cs = cell_with_bits_and_refs.begin_parse();

;; 确定 slice 是否为空
if (cs.slice_empty?()) {
    ;; cell 为空
}
else {
    ;; cell 不为空
}
```

> 💡 有用的链接
>
> [文档中的“slice_empty?()”](/develop/func/stdlib#slice_empty)
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
>
> [文档中的“store_uint()”](/develop/func/stdlib#store_uint)
>
> [文档中的“end_cell()”](/develop/func/stdlib#end_cell)
>
> [文档中的“begin_parse()”](/develop/func/stdlib#begin_parse)

### 如何确定 dict 是否为空

有一个 `dict_empty?()` 方法可以检查 dict 中是否有数据。这个方法相当于 `cell_null?()`，因为通常一个空的 cell 就是一个空字典。

```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) { ;; 确定 dict 是否为空
    ;; dict 为空
}
else {
    ;; dict 不为空
}
```

> 💡 有用的链接
>
> [文档中的“dict_empty?()”](/develop/func/stdlib#dict_empty)
>
> [文档中的“new_dict()”](/develop/func/stdlib/#new_dict) 创建空字典
>
> [文档中的“dict_set()”](/develop/

func/stdlib/#dict_set) 为 dict d 添加一些元素，所以它不为空

### 如何确定 tuple 是否为空

在处理 `tuples` 时，始终知道内部是否有值以供提取是很重要的。如果我们尝试从空的 `tuple` 中提取值，将会得到一个错误：“not a tuple of valid size”，exit code 7。

```func
;; 声明 tlen 函数，因为它在 stdlib 中没有提供
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple 为空
    }
    else {
        ;; tuple 不为空
    }
}
```

> 💡 注意
> 
> 我们声明了 tlen 汇编函数。你可以在[这里](/develop/func/functions#assembler-function-body-definition)阅读更多，并查看[所有汇编指令列表](/learn/tvm-instructions/instructions)。

> 💡 有用的链接
>
> [文档中的“empty_tuple?()”](/develop/func/stdlib#empty_tuple)
>
> [文档中的“tpush()”](/develop/func/stdlib/#tpush)
>
> [文档中的“Exit codes”](/learn/tvm-instructions/tvm-exit-codes)

### 如何确定 Lisp 类型的列表是否为空

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; Lisp 类型的列表为空
} else {
    ;; Lisp 类型的列表不为空
}
```

我们使用 [cons](/develop/func/stdlib/#cons) 函数将数字 100 添加到我们的 Lisp 类型列表中，所以它不为空。

### 如何确定合约的状态是否为空

假设我们有一个 `counter`，用于存储交易次数。在智能合约状态的第一次交易中，这个变量不可用，因为状态为空，因此需要处理这种情况。如果状态为空，我们创建一个变量 `counter` 并保存它。

```func
;; `get_data()` 将从合约状态返回数据 cell
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; 合约数据为空，所以我们创建 counter 并保存
    int counter = 1;
    ;; 创建 cell，添加 counter 并保存在合约状态中
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; 合约数据不为空，所以我们获取我们的 counter，增加它并保存
    ;; 我们应该指定 counter 的正确的位长度
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

> 💡 注意
> 
> 我们可以通过确定 [cell 是否为空](/develop/func/cookbook#how-to-determine-if-cell-is-empty) 来确定合约的状态是否为空。

> 💡 有用的链接
>
> [文档中的“get_data()”](/develop/func/stdlib#get_data)
>
> [文档中的“begin_parse()”](/develop/func/stdlib/#begin_parse)
>
> [文档中的“slice_empty?()”](/develop/func/stdlib/#slice_empty)
>
> [文档中的“set_data?()”](/develop/func/stdlib#set_data)

### 如何构建内部消息 cell

如果我们希望合约发送一个内部消息，我们应该首先正确地创建它为一个 cell，指定技术标志位、接收地址和其余数据。

```func
;; 我们使用字面量 `a` 从包含地址的字符串中获取有效地址的 slice
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; 我们使用 `op` 来识别操作
int op = 0;
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息 header 部（参见发送消息页面）
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; 模式 3 - 分别支付费用并忽略错误
```

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 你可以在[文档](/develop/smart-contracts/messages)中找到更多信息。也可以通过这个链接跳转到[布局](/develop/smart-contracts/messages#message-layout)。

> 💡 有用的链接
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“store_uint()”](/develop/func/stdlib#store_uint)
>
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
>
> [文档中的“store_coins()”](/develop/func/stdlib#store_coins)
>
> [文档中的“end_cell()”](/develop/func/stdlib/#end_cell)
>
> [文档中的“send_raw_message()”](/develop/func/stdlib/#send_raw_message)

### 如何在内部消息 cell 中包含 body 作为 ref

在跟着标志位和其他技术数据的消息体中，我们可以发送 `int`、`slice` 和 `cell`。在后者的情况下，在 `store_ref()` 之前必须将位设置为 `1`，以表明 `cell` 将继续传输。

如果我们确信有足够的空间，我们也可以在与 header 相同的 `cell` 中发送消息体。在这种情况下，我们需要将位设置为 `0`。

```func
;; 我们使用字面量 `a` 从包含地址的字符串中获取有效地址的 slice 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; 创建包含消息的 cell
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; 默认消息 header 部（参见发送消息页面）
    .store_uint(1, 1) ;; 设置位为 1，表明 cell 将继续传输
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - 分别支付费用并忽略错误 
```

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 在这个例子中，我们使用node 3 接收进来的 tons 并发送确切的指定金额（amount），同时从合约余额中支付佣金并忽略错误。mode 64 用于返回所有接收到的 tons，扣除佣金，mode 128 将发送整个余额。

> 💡 注意
>
> 我们正在[构建消息](/develop/func/cookbook#how-to-build-an-internal-message-cell)，但单独添加消息体。

> 💡 有用的链接
>
> [文档中的“begin_cell()”](/develop/func/stdlib#begin_cell)
> 
> [文档中的“store_uint()”](/develop/func/stdlib#store_uint)
>
> [文档中的“store_slice()”](/develop/func/stdlib#store_slice)
>
> [文档中的“store_coins()”](/develop/func/stdlib#store_coins)
>
> [文档中的“end_cell()”](/develop/func/stdlib/#end_cell)
>
> [文档中的“send_raw_message()”](/develop/func/stdlib/#send_raw_message)

### 如何在内部消息 cell 中包含 body 作为 slice

发送消息时，消息体可以作为 `cell` 或 `slice` 发送。在这个例子中，我们将消息体放在 `slice` 内部发送。

```func 
;; 我们使用字面量 `a` 从包含地址的字符串中获取有效地址的 slice 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息 header 部（参见发送消息页面）
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;;

 mode 3 - 分别支付费用并忽略错误 
```

> 💡 注意
>
> 在这个例子中，我们使用字面量 `a` 获取地址。你可以在[文档](/develop/func/literals_identifiers#string-literals)中找到更多关于字符串字面量的信息。

> 💡 注意
>
> 在这个例子中，我们使用 mode 3 接收进来的 tons 并发送确切的指定金额（amount），同时从合约余额中支付佣金并忽略错误。mode 64 用于返回所有接收到的 tons，扣除佣金，mode 128 将发送整个余额。

> 💡 注意
>
> 我们正在[构建消息](/develop/func/cookbook#how-to-build-an-internal-message-cell)，但将消息作为 slice 添加。

### 如何迭代 tuples（双向）

如果我们想在 FunC 中处理数组或栈，那么 tuple 是必需的。首先我们需要能够迭代值来处理它们。

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; 使用 x 做一些事情
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; 使用 x 做一些事情
        i = i - 1;
    }
}
```

> 💡 注意
>
> 我们声明了 `tlen` 汇编函数。你可以在[这里](/develop/func/functions#assembler-function-body-definition)阅读更多，并查看[所有汇编指令列表](/learn/tvm-instructions/instructions)。
>
> 我们还声明了 `to_tuple` 函数。它只是改变任何输入的数据类型为 tuple，因此在使用时要小心。

### 如何使用 `asm` 关键字编写自己的函数

当使用任何功能时，实际上我们使用的是为我们预先准备好的 `stdlib.fc` 中的方法。但事实上，我们有更多的机会可以使用，我们需要学会自己编写它们。

例如，我们有 `tpush` 方法，它可以向 `tuple` 中添加元素，但没有 `tpop`。在这种情况下，我们应该这样做：
```func
;; ~ 表示它是修改方法
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```

如果我们想知道 `tuple` 的长度以进行迭代，我们应该使用 `TLEN` 汇编指令编写一个新函数：
```func
int tuple_length (tuple t) asm "TLEN";
```

stdlib.fc 中我们已知的一些函数示例：
```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

> 💡 有用的链接：
>
> [文档中的“modifying method”](/develop/func/statements#modifying-methods)
>
> [文档中的“stdlib”](/develop/func/stdlib)
>
> [文档中的“TVM instructions”](/learn/tvm-instructions/instructions)

### 迭代嵌套的 n 个 tuples

有时我们想迭代嵌套的 tuples。以下示例将从头开始迭代并打印格式为 `[[2,6],[1,[3,[3,5]]], 3]` 的 tuple 中的所有项目

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x)

 asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; 定义全局变量
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
    max_value = 0; ;; 重置 max_value;
    iterate_tuple(t); ;; 迭代 tuple 并找到最大值
    ~dump(max_value); ;; 6
}
```

> 💡 有用的链接
>
> [文档中的“Global variables”](/develop/func/global_variables)
>
> [文档中的“~dump”](/develop/func/builtins#dump-variable)
>
> [文档中的“TVM instructions”](/learn/tvm-instructions/instructions) 

### 基本的 tuple 操作

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; 创建一个空的 tuple
    tuple names = empty_tuple(); 
    
    ;; 添加新项目
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; 弹出最后一项
    slice last_name = names~tpop();

    ;; 获取第一项
    slice first_name = names.first();

    ;; 按索引获取项
    slice best_name = names.at(2);

    ;; 获取列表长度
    int number_names = names.tlen();
}
```

### 解析类型 X

下面的示例检查 tuple 中是否包含某个值，但 tuple 包含值 X（cell, slice, int, tuple, int）。我们需要检查值并相应地转换。

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
    ;; value 是类型 X，由于我们不知道确切的值是什么 - 我们需要检查值然后转换它
    
    if (is_null(value)) {
        ;; 对 null 做一些事情
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; 对 int 做一些事情
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; 对 slice 做一些事情
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; 对 cell 做一些事情
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; 对 tuple 做一些事情
    }
}

() main () {
    ;; 创建一个空的 tuple
    tuple stack = empty_tuple();
    ;; 假设我们有一个 tuple 并且不知道它们的确切类型
    stack~tpush("Some text");
    stack~tpush(4);
    ;; 我们使用 var 因为我们不知道值的类型
    var value = stack~tpop();
    resolve_type(value);
}
```

> 💡 有用的链接
>
> [文档中的“TVM 指令”](/learn/tvm-instructions/instructions) 


### 如何获取当前时间

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; 做一些事情 
}
```

### 如何生成随机数

:::caution 草稿
请注意，这种生成随机数的方法不安全。

待办事项：添加关于生成随机数的文章链接
:::

```func
randomize_lt(); ;; 只需做一次

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### 模运算

例如，假设我们想对所有 256 个数字运行以下计算：`(xp + zp)*(xp-zp)`。由于这些操作大多用于密码学，在下面的示例中，我们使用模运算符进行蒙哥马利曲线(montogomery curves)。注意 xp+zp 是一个有效的变量名（没有空格）。

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 是蒙哥马利曲线的素数，意味着所有操作都应该对其素数进行
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod 自身处理以下两行
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

> 💡 有用的链接
>
> [文档中的“muldivmod”](/learn/tvm-instructions/instructions#52-division)


### 如何抛出错误

```func
int number = 198;

throw_if(35, number > 50); ;; 只有当数字大于 50 时才会触发错误

throw_unless(39, number == 198); ;; 只有当数字不等于 198 时才会触发错误

throw(36); ;; 无论如何都会触发错误
```

[标准 TVM 异常代码](/learn/tvm-instructions/tvm-exit-codes.md)

### 反转 tuples

因为 tuple 以堆栈的方式存储数据，有时我们必须反转 tuple 以从另一端读取数据。

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

> 💡 有用的链接
>
> [文档中的“tpush()”](/develop/func/stdlib/#tpush)


### 如何从列表中移除特定索引的项

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

### 判断切片是否相等

我们有两种不同的方法可以判断切片是否相等。一种是基于切片哈希，另一种则是使用 SDEQ 汇编指令。

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
    ;; 我们使用字面量 `a` 来从包含地址的字符串中获取切片的有效地址
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = false
}
```

#### 💡 有用的链接

 * ["slice_hash()" in docs](/develop/func/stdlib/#slice_hash)
 * ["SDEQ" in docs](/learn/tvm-instructions/instructions#62-other-comparison)

### 判断cell是否相等

我们可以根据它们的哈希轻松确定cell的相等性。

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

> 💡 有用的链接
>
> ["cell_hash()" in docs](/develop/func/stdlib/#cell_hash)

### 判断元组是否相等

一个更高级的示例是迭代并比较每个元组的值。由于它们是 X，我们需要检查并转换为相应的类型，并且如果它是元组，则递归地迭代它。

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
    int equal? = -1; ;; 初始值为 true
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; 如果元组长度不同，它们就不能相等
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
            ;; 递归地判断嵌套元组
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

> 💡 有用的链接
>
> ["cell_hash()" in docs](/develop/func/stdlib/#cell_hash)
>
> ["TVM instructions" in docs](/learn/tvm-instructions/instructions)

### 生成内部地址

当我们的合约需要部署新合约但不知道其地址时，我们需要生成一个内部地址。假设我们已经有了 `state_init` - 新合约的代码和数据。

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

> 💡 注意
> 
> 在这个示例中，我们使用 `workchain()` 来获取工作链 ID。你可以在[文档](/learn/overviews/addresses#workchain-id)中找到更多关于工作链 ID 的信息。

> 💡 有用的链接
>
> ["cell_hash()" in docs](/develop/func/stdlib/#cell_hash)

### 生成外部地址

我们使用 [block.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L101C1-L101C12) 中的 TL-B 方案来理解我们如何以这种格式创建一个地址。

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

由于我们需要确定地址占用的位数，因此还需要[声明一个使用 `UBITSIZE` 操作码的 asm 函数](#how-to-write-own-functions-using-asm-keyword)，该函数将返回存储数字所需的最小位数。

> 💡 有用的链接
>
> ["TVM Instructions" in docs](/learn/tvm-instructions/instructions#53-shifts-logical-operations)

### 如何在本地存储中存储和加载字典

加载字典的逻辑

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

而存储字典的逻辑如下所示：

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

> 💡 有用的链接
>
> ["get_data()" in docs](/develop/func/stdlib/#get_data)
>
> ["new_dict()" in docs](/develop/func/stdlib/#new_dict)
>
> ["slice_empty?()" in docs](/develop/func/stdlib/#slice_empty)
>
> ["load_dict()" in docs](/develop/func/stdlib/#load_dict)
>
> ["~" in docs](/develop/func/statements#unary-operators)


### 如何发送简单消息

我们通常发送附带评论的方式实际上是一种简单消息。要指定消息正文为 `comment`，我们应在消息文本前设置 `32 bits` 为 0。

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; 标志位
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; 目的地址
    .store_coins(100) ;; 发送的nanoTons数量
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息header（参见发送消息页面）
    .store_uint(0, 32) ;; 零操作码 - 表示带评论的简单转账消息
    .store_slice("Hello from FunC!") ;; 评论
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - 分开支付费用，忽略错误
```

> 💡 有用的链接
>
> [文档中的“消息布局”](/develop/smart-contracts/messages)

### 如何发送带有入账的消息

以下合约示例对我们有用，如果我们需要在用户和主合约之间执行一些操作，那我们就需要一个代理合约。

```func
() recv_internal (slice in_msg_body) {
    {-
        这是一个代理合约的简单示例。
        它将期望 in_msg_body 包含消息 mode、body 和要发送到的目的地址。
    -}

    int mode = in_msg_body~load_uint(8); ;; 第一个字节将包含消息 mode
    slice addr = in_msg_body~load_msg_addr(); ;; 然后我们解析目的地址
    slice body = in_msg_body; ;; in_msg_body 中剩余的所有内容将是我们新消息的 body

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; 仅作示例
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息 header （参见发送消息页面）
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

> 💡 有用的链接
> 
> [文档中的“消息布局”](/develop/smart-contracts/messages)
>
> [文档中的“load_msg_addr()”](/develop/func/stdlib/#load_msg_addr)

### 如何发送携带全部余额的消息

如果我们需要发送智能合约的全部余额，那么在这种情况下，我们需要使用发送 `mode 128`。这样的例子可能是一个接受付款并转发给主合约的代理合约。

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; 标志位
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; 目的地址
    .store_coins(0) ;; 我们现在不关心这个值
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息 header （参见发送消息页面）
    .store_uint(0, 32) ;; 零操作码 - 表示带评论的简单转账消息
    .store_slice("Hello from FunC!") ;; 评论
.end_cell();
send_raw_message(msg, 128); ;; 模式=128 用于携带当前智能合约剩余全部余额的消息
```

> 💡 有用的链接
>
> [文档中的“消息布局”](/develop/smart-contracts/messages)
> 
> [文档中的“消息模式”](/develop/func/stdlib/#send_raw_message)

### 如何发送带有长文本评论的消息

我们知道，单个 `cell` (< 1023 bits) 中只能容纳 127 个字符。如果我们需要更多 - 我们需要组织蛇形cell。

```func
{-
    如果我们想发送带有非常长的评论的消息，我们应该将评论分成几个片段。
    每个片段应包含 <1023 位数据（127个字符）。
    每个片段应该有一个引用指向下一个，形成蛇形结构。
-}

cell body = begin_cell()
    .store_uint(0, 32) ;; 零操作码 - 带评论的简单消息
    .store_slice("long long long message...")
    .store_ref(begin_cell()
        .store_slice(" you can store string of almost any length here.")
        .store_ref(begin_cell()
            .store_slice(" just don't forget about the 127 chars limit for each slice")
        .end_cell())
    .end_cell())
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; 标志位
    ;; 我们使用字面量 `a` 从包含地址的字符串中获取片段内的有效地址
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; 目的地址
    .store_coins(100) ;; 发送的nanoTons数量
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; 默认消息 header （参见发送消息页面）
    .store_uint(1, 1) ;; 我们希望将 body 存储为引用
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - 分开支付费用，忽略错误
```

> 💡 有用的链接
>
> [文档中的“内部消息”](/develop/smart-contracts/guidelines/internal-messages)

### 如何仅从片段中获取数据位（不包括引用）

如果我们对 `slice` 内的 `refs` 不感兴趣，那么我们可以获取单独的数据并使用它。

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; 一些引用
    .store_ref(begin_cell().end_cell()) ;; 一些引用
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

> 💡 有用的链接
> 
> [文档中的“Slice原语”](/develop/func/stdlib/#slice-primitives)
>
> [文档中的“preload_bits()”](/develop/func/stdlib/#preload_bits)
>
> [文档中的“slice_bits()”](/develop/func/stdlib/#slice_bits)

### 如何定义自己的修改方法

修改方法允许在同一个变量内修改数据。这可以与其他编程语言中的引用进行比较。

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; 从片段中加载 8 位（一个字符）
    x -= 48; ;; 字符 '0' 的代码为 48，所以我们减去它以得到数字
    return (s, (x)); ;; 返回我们修改的片段和加载的数字
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; 这里 s 等于 ""，c1 = 2，c2 = 5，c3 = 8
}
```

> 💡 有用的链接
> 
> [文档中的“修改方法”](/develop/func/statements#modifying-methods)

### 如何计算 n 的幂

```func
;; 未优化版本
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i < n - 1) {
        a *= value;
        i += 1;
    }
    return a

;
}

;; 优化版本
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
    number = (number * 10) + (char - 48); ;; 我们使用 ASCII 表
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

字典在处理大量数据时非常有用。我们可以使用内置方法 `dict_get_min?` 和 `dict_get_max?` 分别获取最小和最大键值。此外，我们可以使用 `dict_get_next?` 遍历字典。

```func
cell d = new_dict();
d~udict_set(256, 1, "value 1");
d~udict_set(256, 5, "value 2");
d~udict_set(256, 12, "value 3");

;; 从小到大遍历键
(int key, slice val, int flag) = d.udict_get_min?(256);
while (flag) {
    ;; 使用 key->val 对，做某些事情
    
    (key, val, flag) = d.udict_get_next?(256, key);
}
```

> 💡 有用的链接
>
> [文档中的“字典原语”](/develop/func/stdlib/#dictionaries-primitives)
>
> [文档中的“dict_get_max?()”](/develop/func/stdlib/#dict_get_max)
>
> [文档中的“dict_get_min?()”](/develop/func/stdlib/#dict_get_min)
>
> [文档中的“dict_get_next?()”](/develop/func/stdlib/#dict_get_next)
>
> [文档中的“dict_set()”](/develop/func/stdlib/#dict_set)

### 如何从字典中删除值

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> 表示在字典中未找到该键
```

### 如何递归遍历cell树

我们知道，一个 `cell` 可以存储多达 `1023 bits` 的数据和最多 `4 refs`。要绕过这个限制，我们可以使用cell树，但为此我们需要能够迭代它，以便正确处理数据。

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; 仅作为示例的一些cell
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

    ;; 创建一个没有数据的元组，充当栈的角色
    tuple stack = null();
    ;; 将主cell放入栈中以便在循环中处理
    stack~push_back(c);
    ;; 在栈不为空时执行
    while (~ stack.is_null()) {
        ;; 从栈中获取cell，并将其转换为 slice 以便处理
        slice s = stack~pop_back().begin_parse();

        ;; 对 s 数据做一些操作

        ;; 如果当前 slice 有任何 refs，将它们添加到栈中
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

> 💡 有用的链接
> 
>

 [文档中的“Lisp类型列表”](/develop/func/stdlib/#lisp-style-lists)
>
> [文档中的“null()”](/develop/func/stdlib/#null)
>
> [文档中的“slice_refs()”](/develop/func/stdlib/#slice_refs)

### 如何遍历 Lisp 类型列表

数据类型 tuple 最多可以容纳 255 个值。如果这还不够，我们应该使用 Lisp 类型的列表。我们可以将一个 tuple 放入另一个 tuple 中，从而绕过限制。

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; 一些示例列表
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; 遍历元素
    ;; 注意这种迭代是倒序的
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; 对 x 做一些操作
    }
}
```

> 💡 有用的链接
> 
> [文档中的“Lisp风格列表”](/develop/func/stdlib/#lisp-style-lists)
>
> [文档中的“null()”](/develop/func/stdlib/#null)

### 如何发送部署消息（仅使用 stateInit 或使用 stateInit 和 body）

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mode 64 - 在新消息中携带剩余值
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

  ;; mode 64 - 在新消息中携带剩余值
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
