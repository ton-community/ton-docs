# FunC Cookbook

The core reason for creating the FunC Cookbook is to collect all the experience from FunC developers in one place so that future developers will use it!

Compared to the FunC Documentation, this article is more focused on everyday tasks every FunC developer resolve during the development of smart contracts.

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it. Read more about contributing on [FunC Cookbook ton-footstep](https://github.com/ton-society/ton-footsteps/issues/10).
:::

## Basics
### How to write an if statement
```func
int a = 1;

if (a == 1) {
    ;; do something
}
else {
    ;; do something else
}
```
["If statement" in docs](https://ton.org/docs/develop/func/statements#if-statements)

### How to write a while loop
```func
int a = 50;

while (a > 0) {
    ;; do something
    a -= 1;
}
```
["While loop" in docs](https://ton.org/docs/develop/func/statements#while-loop)

### How to write a do until loop
```func 
int a = 0;

do {
    ;; do something
    a += 1;
} until (a == 10);
```
["Until loop" in docs](https://ton.org/docs/develop/func/statements#until-loop)

### How to determine if slice is empty
```func 
slice s = "Hello, world!";

if (s.slice_empty?()) { ;; Determine if slice is empty
    ;; slice is empty
}
else {
    ;; slice is not empty
}
```
[slice_empty?() in docs](https://ton.org/docs/develop/func/stdlib#slice_empty)

### How to determine if cell is empty
```func
cell c = begin_cell().store_uint(1337, 16).end_cell();

if (c.begin_parse().slice_empty?()) { ;; Change 'c' type to slice with begin_parse(), determine if slice is empty
    ;; cell is empty
}
else {
    ;; cell is not empty
}
```
[slice_empty?() in docs](https://ton.org/docs/develop/func/stdlib#slice_empty)
[begin_parse() in docs](https://ton.org/docs/develop/func/stdlib#begin_parse)

### How to determine if dict is empty
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
[dict_empty?() in docs](https://ton.org/docs/develop/func/stdlib#dict_empty)
We are adding some elements in dict d with [dict_set()](https://ton.org/docs/develop/func/stdlib/#dict_set) function, so it is not empty

### How to determine if tuple is empty
```func
(int) tlen (tuple t) asm "TLEN";
;; Declare tlen function because it's not presented in stdlib

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
We are declaring tlen assembly function. You can read more [here](https://ton.org/docs/develop/func/functions#assembler-function-body-definition) and see [list of all assembler commands](https://ton.org/docs/learn/tvm-instructions/instructions)


### How to determine a state of the contract is empty
```func
cell c = get_data();

if (c.begin_parse().slice_empty?()) {
    ;; contract data is empty
}
else {
    ;; contract data is not empty
}
```
We can determine that state of contract is empty by determining that [cell is empty](https://ton.org/docs/develop/func/cookbook#how-to-determine-if-cell-is-empty)

### How to build an internal message cell
```func
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```
You can find more in [docs](https://ton.org/docs/develop/smart-contracts/messages). You can jump in [layout](Million dollar: business) with this link

### How to contain a body as ref to an internal message cell
```func
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
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1)
    .store_uint(1, 1)
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```
We are [building a message](https://ton.org/docs/develop/func/cookbook#how-to-build-an-internal-message-cell) but adding message body separetly

### How to contain a body as slice to an internal message cell
```func 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```
We are [building a message](https://ton.org/docs/develop/func/cookbook#how-to-build-an-internal-message-cell) but adding message as a slice

### How to iterate tuples (in both directions)
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
We are declaring tlen assembly function. You can read more [here](https://ton.org/docs/develop/func/functions#assembler-function-body-definition) and see [list of all assembler commands](https://ton.org/docs/learn/tvm-instructions/instructions)
Also we declaring to_tuple function. It just changes data type of any input to tuple, so be careful while using it