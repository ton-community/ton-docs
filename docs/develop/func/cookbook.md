# FunC Cookbook

The core reason for creating the FunC Cookbook is to collect all the experience from FunC developers in one place so that future developers will use it!

Compared to the FunC Documentation, this article is more focused on everyday tasks every FunC developer resolve during the development of smart contracts.

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it. Read more about contributing on [FunC Cookbook ton-footstep](https://github.com/ton-society/ton-footsteps/issues/10).
:::

## Basics
### How to write an if statement

TODO: please provide some description like in a `Modulo operations` section

```func
int a = 1;

if (a == 1) {
    ;; do something
}
else {
    ;; do something else
}
```

> 💡 Noted
> 
> TODO: We should show the developer an example with `if (variable) {...}` and remind that `true` is `-1` and `false` is `0`.

> 💡 Useful links
>  
> ["If statement" in docs](/docs/develop/func/statements#if-statements)

### How to write a repeat loop

TODO: please provide some description like in a `Modulo operations` section

```func
int count = 50;

repeat(count) {
    ;; do something
}
```

> 💡 Useful links
> 
> ["Repeat loop" in docs](/docs/develop/func/statements#repeat-loop)

### How to write a while loop

TODO: please provide some description like in a `Modulo operations` section

```func
int i = 0;

while (i < 50) {
    ;; do something
    i += 1;
}
```

> 💡 Noted
> 
> TODO: We should remind that `true` is `-1` and `false` is `0`.

> 💡 Useful links
> 
> ["While loop" in docs](/docs/develop/func/statements#while-loop)

### How to write a do until loop

TODO: please provide some description like in a `Modulo operations` section

```func 
int i = 0;

do {
    ;; do something
    i += 1;
} until (i == 10);
```

> 💡 Noted
> 
> TODO: We should remind that `true` is `-1` and `false` is `0`.

> 💡 Useful links
> 
> ["Until loop" in docs](/docs/develop/func/statements#until-loop)

### How to determine if slice is empty

TODO: please provide some description like in a `Modulo operations` section

> 💡 TODO: We should notice that `slice_empty?()` will check `bits` and `refs`. 

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_empty?()` returns `true`, because slice dosen't have any `bits` and `refs`
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
> 💡 Useful links
>
> ["slice_empty?()" in docs](/docs/develop/func/stdlib#slice_empty)
> 
> ["store_slice()" in docs](/docs/develop/func/stdlib#store_slice)
> 
> ["store_ref()" in docs](/docs/develop/func/stdlib#store_ref)
> 
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
> 
> ["end_cell()" in docs](/docs/develop/func/stdlib#end_cell)
> 
> ["begin_parse()" in docs](/docs/develop/func/stdlib#begin_parse)


### How to determine if slice is empty (dosen't have any bits, but may have refs)

TODO: please provide some description like in a `Modulo operations` section

```func 
;; creating empty slice
slice empty_slice = "";
;; `slice_data_empty?()` returns `true`, because slice dosen't have any `bits`
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
;; `slice_data_empty?()` returns `true`, because slice dosen't have any `bits`
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

> 💡 Noted
>
> TODO: We should notice that `slice_data_empty?()` will check `bits` but not will check `refs`. 

> 💡 Useful links
>
> ["slice_data_empty?()" in docs](/docs/develop/func/stdlib#slice_data_empty)
> 
> ["store_slice()" in docs](/docs/develop/func/stdlib#store_slice)
> 
> ["store_ref()" in docs](/docs/develop/func/stdlib#store_ref)
> 
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
> 
> ["end_cell()" in docs](/docs/develop/func/stdlib#end_cell)
> 
> ["begin_parse()" in docs](/docs/develop/func/stdlib#begin_parse)


### How to determine if slice is empty (dosen't have any refs, but may have bits)

TODO: please provide some description like in a `Modulo operations` section

```func 
;; creating empty slice
slice empty_slice = "";
;; `slice_refs_empty?()` returns `true`, because slice dosen't have any `refs`
empty_slice.slice_refs_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` returns `true`, because slice dosen't have any `refs`
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

> 💡 Noted
>
> TODO: We should notice that `slice_refs_empty?()` will check `refs` but not will check `bits`

> 💡 Useful links
> 
> ["slice_refs_empty?()" in docs](/docs/develop/func/stdlib#slice_refs_empty)
> 
> ["store_slice()" in docs](/docs/develop/func/stdlib#store_slice)
> 
> ["store_ref()" in docs](/docs/develop/func/stdlib#store_ref)
> 
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
> 
> ["end_cell()" in docs](/docs/develop/func/stdlib#end_cell)
> 
> ["begin_parse()" in docs](/docs/develop/func/stdlib#begin_parse)

### How to determine if cell is empty

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Noted
> 
> TODO: We should notice that `slice_empty?()` will check `bits` and `refs`, and should notice that dev can use `slice_data_empty?()` or `slice_refs_empty?()` with reason: if you want check only bits is exists you have to use `slice_data_empty?()`, and if you want check only bits is exists you have to use `slice_refs_empty?()`.

> 💡 Useful links
>
> ["slice_empty?()" in docs](/docs/develop/func/stdlib#slice_empty)
>
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
>
> ["store_uint()" in docs](/docs/develop/func/stdlib#store_uint)
>
> ["end_cell()" in docs](/docs/develop/func/stdlib#end_cell)
>
> ["begin_parse()" in docs](/docs/develop/func/stdlib#begin_parse)

### How to determine if dict is empty

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Noted
>
> TODO: We should notice that if dict is empty that dict cell is null.

> 💡 Useful links
>
> ["dict_empty?()" in docs](/docs/develop/func/stdlib#dict_empty)
>
> ["new_dict()" in docs](/docs/develop/func/stdlib/#new_dict) creating an empty dict
>
> ["dict_set()" in docs](/docs/develop/func/stdlib/#dict_set) adding some elements in dict d with function, so it is not empty

### How to determine if tuple is empty

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Noted
> 
> We are declaring tlen assembly function. You can read more [here](/docs/develop/func/functions#assembler-function-body-definition) and see [list of all assembler commands](/docs/learn/tvm-instructions/instructions).

> 💡 Useful links
>
> ["empty_tuple?()" in docs](/docs/develop/func/stdlib#empty_tuple)
>
> ["tpush()" in docs](/docs/develop/func/stdlib/#tpush)

### How to determine if lisp-style list is empty

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; list-style list is empty
} else {
    ;; list-style list is not empty
}
```

We are adding number 100 to our list-style list with [cons](/docs/develop/func/stdlib/#cons) function, so it's not empty.

### How to determine a state of the contract is empty

TODO: please provide some description like in a `Modulo operations` section

```func
;; `get_data()` will return the data cell from contract state
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; contract data is empty
}
else {
    ;; contract data is not empty
}
```

> 💡 Noted
> 
> We can determine that state of contract is empty by determining that [cell is empty](/docs/develop/func/cookbook#how-to-determine-if-cell-is-empty).

> 💡 Useful links
>
> ["get_data()" in docs](/docs/develop/func/stdlib#get_data)
>
> ["begin_parse()" in docs](/docs/develop/func/stdlib/#begin_parse)
>
> ["slice_empty?()" in docs](/docs/develop/func/stdlib/#slice_empty)

### How to build an internal message cell

TODO: please provide some description like in a `Modulo operations` section

```func
;; TODO: what is `a` literal?
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

> 💡 Noted
>
> TODO: what is literal `a` and were devs can find more information about literal `a`?

> 💡 Noted
>
> You can find more in [docs](/docs/develop/smart-contracts/messages). You can jump in [layout](/docs/develop/smart-contracts/messages#message-layout) with this link.

> 💡 Useful links
>
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
> 
> ["store_uint()" in docs](/docs/develop/func/stdlib#store_uint)
>
> ["store_slice()" in docs](/docs/develop/func/stdlib#store_slice)
>
> ["store_coins()" in docs](/docs/develop/func/stdlib#store_coins)
>
> ["end_cell()" in docs](/docs/develop/func/stdlib/#end_cell)
>
> ["send_raw_message()" in docs](/docs/develop/func/stdlib/#send_raw_message)

### How to contain a body as ref to an internal message cell

TODO: please provide some description like in a `Modulo operations` section

```func
;; TODO: what is `a` literal?
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

> 💡 Noted
>
> TODO: what is literal `a` and were devs can find more information about literal `a`?

> 💡 Noted
>
> TODO: what is mode `3` and which preffer mode to use in most cases? When we should use mode 64 and 128?

> 💡 Noted
>
> We are [building a message](/docs/develop/func/cookbook#how-to-build-an-internal-message-cell) but adding message body separetly.

> 💡 Useful links
>
> ["begin_cell()" in docs](/docs/develop/func/stdlib#begin_cell)
> 
> ["store_uint()" in docs](/docs/develop/func/stdlib#store_uint)
>
> ["store_slice()" in docs](/docs/develop/func/stdlib#store_slice)
>
> ["store_coins()" in docs](/docs/develop/func/stdlib#store_coins)
>
> ["end_cell()" in docs](/docs/develop/func/stdlib/#end_cell)
>
> ["send_raw_message()" in docs](/docs/develop/func/stdlib/#send_raw_message)

### How to contain a body as slice to an internal message cell

TODO: please provide some description like in a `Modulo operations` section

```func 
;; TODO: what is `a` literal?
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

> 💡 Noted
>
> TODO: what is literal `a` and were devs can find more information about literal `a`?

> 💡 Noted
>
> TODO: what is mode `3` and which preffer mode to use in most cases? When we should use mode 64 and 128?

> 💡 Noted
>
> We are [building a message](/docs/develop/func/cookbook#how-to-build-an-internal-message-cell) but adding message as a slice.

### How to iterate tuples (in both directions)

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Noted
>
> We are declaring `tlen` assembly function. You can read more [here](/docs/develop/func/functions#assembler-function-body-definition) and see [list of all assembler commands](/docs/learn/tvm-instructions/instructions).
>
> Also we declaring `to_tuple` function. It just changes data type of any input to tuple, so be careful while using it.

### How to write own functions using `asm` keyword

> TODO: Before we can move on, we need to show examples of how to make custom functions using asm. Please, add few examples bellow: 👇

### Iterating n-nested tuples

Sometimes we want to iterate nested tuples. The following example will iterate and print all of the items in a tuple of format `[[2,6],[1,[3,[3,5]]], 3]` starting from the head

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            ~dump(value);
            ;; do something with the value
        }
    }
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 


### Basic operations with tuples

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

### Resolving type X

The following example checks if some value is contained in a tuple, but tuple contains values X (cell, slice, int, tuple, int). We need to check the value and cast accordingly.

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

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 


### How to get current time

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; do some stuff 
}
```

### How to generate random number

:::caution draft
Please note that this method of generating random numbers isn't safe.

TODO: add link to an article about generating random numbers
:::

```func
randomize_lt(); ;; do this once

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### Modulo operations

As an example, lets say that we want to run the following calculation of all 256 numbers : `(xp + zp)*(xp-zp)`. Since most of those operations are used for cryptography, in the following example we are using the modulo operator for montogomery curves.
Note that xp+zp is a valid variable name ( without spaces between ).

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   int xp+zp = (xp + zp) % prime;
   int xp-zp = (xp - zp + prime) % prime;

   (_, int xp+zp*xp-zp) = muldivmod(xp+zp, xp-zp, prime);
   return xp+zp*xp-zp;
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 


### How to throw errors

```func
int number = 198;

throw_if(35, number > 50); ;; the error will be triggered only if the number is greater than 50

throw_unless(39, number == 198); ;; the error will be triggered only if the number is NOT EQUAL to 198

throw(36); ;; the error will be triggered anyway
```

[Standard tvm exception codes](/docs/learn/tvm-instructions/tvm-exit-codes.md)

### Reversing tuples

TODO: please provide some description like in a `Modulo operations` section

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 


### How to remove an item with a certain index from the list

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

### Determine if slices are equal

There are two different ways we can determine the equality. One is based on the slice hash, while the other one by using the SDEQ asm instruction.

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### Determine if cells are equal 

We can easily determine cell equality based on their hash.

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### Determine if tuples are equal

A more advanced example would be to iterate and compare each of the tuple values. Since they are X we need to check and cast to the corresponding type and if it is tuple to iterate it recursively.

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

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### Generate internal address

TODO: please provide some description like in a `Modulo operations` section

Creates an internal address for the corresponding MsgAddressInt TLB.

```func
(slice) generate_internal_address (int workchain_id, int address) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(address, 256)
    .end_cell().begin_parse();
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### Generate external address

Creates an external address for the corresponding MsgAddressExt TLB.

```func
slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 8) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 8)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}

;; TODO: please provide an example how to use it
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### How to store and load dictionary in local storage

The logic for loading the dictionary

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

While the logic for storing the dictionary is like the following example:

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

> 💡 Useful links
>
> TODO: please add useful links for all functions like in above sections 

### How to send a simple message

TODO: please provide some description like in a `Modulo operations` section

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 107 zero-bits
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Useful links
>
> ["Message layout" in docs](/docs/develop/smart-contracts/messages)
>
> TODO: please add useful links for all functions like in above sections 

### How to send a message with an incoming account

TODO: please provide some description like in a `Modulo operations` section

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
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

> 💡 Useful links
> 
> ["Message layout" in docs](/docs/develop/smart-contracts/messages)
>
> TODO: please add useful links for all functions like in above sections 

### How to send a message with the entire balance

TODO: please provide some description like in a `Modulo operations` section

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(0) ;; we don't care about this value right now
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 107 zero-bits
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract
```

> 💡 Useful links
>
> ["Message layout" in docs](/docs/develop/smart-contracts/messages)
> 
> ["Message modes" in docs](/docs/develop/func/stdlib/#send_raw_message)
>
> TODO: please add useful links for all functions like in above sections 

### How to specify a message body via a reference

TODO: please provide some description like in a `Modulo operations` section

```func
cell body = begin_cell()
    .store_uint(0, 32) ;; zero opcode - simple message with comment
    .store_slice("hello!")
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; 106 zero-bits, necessary for internal messages
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Useful links
> 
> ["Message layout" in docs](/docs/develop/smart-contracts/messages)
>
> TODO: please add useful links for all functions like in above sections 

### How to send a message with a long text comment

TODO: please provide some description like in a `Modulo operations` section

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
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; 106 zero-bits, necessary for internal messages
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Useful links
>
> ["Internal messages" in docs](/docs/develop/smart-contracts/guidelines/internal-messages)
>
> TODO: please add useful links for all functions like in above sections

### How to get only data bits from a slice (without refs)

TODO: please provide some description like in a `Modulo operations` section

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; some references
    .store_ref(begin_cell().end_cell()) ;; some references
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

> 💡 Useful links
> 
> ["Slice primitives" in docs](/docs/develop/func/stdlib/#slice-primitives)
>
> TODO: please add useful links for all functions like in above sections 

### How to define your own modifying method

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Useful links
> 
> ["Modifying methods" in docs](/docs/develop/func/statements#modifying-methods)
>
> TODO: please add useful links for all functions like in above sections 

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
    p = p * p;
    if ((e % 2) == 1) {
        p = p * n;
    }
    return p;
}

() main () {
    int num = binpow(2, 3);
    ~dump(num); ;; 8
}
```

### How to convert string to int

```func
slice string_number = "26052021";
int number = 0;

while (~ string_number.slice_empty?()) {
    int char = string_number~load_uint(8);
    number = (number * 10) + (char - 48);
}

~dump(number);
```

### How to convert int to string

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

### How to iterate dictionaries

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Useful links
>
> ["Dictonaries primitives" in docs](/docs/develop/func/stdlib/#dictionaries-primitives)
>
> TODO: please add useful links for all functions like in above sections 

### How to delete value from dictionaries

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> means that key was not found in a dictionary
```

### How to iterate cell tree recursively

TODO: please provide some description like in a `Modulo operations` section

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

    tuple stack = null();
    stack~push_back(c);
    while (~ stack.is_null()) {
        slice s = stack~pop_back().begin_parse();

        ;; do something with s data

        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

> 💡 Useful links
> 
> ["Lisp-style lists" in docs](/docs/develop/func/stdlib/#lisp-style-lists)
>
> TODO: please add useful links for all functions like in above sections

### How to iterate through lisp-style list

TODO: please provide some description like in a `Modulo operations` section

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

> 💡 Useful links
> 
> ["Lisp-style lists" in docs](/docs/develop/func/stdlib/#lisp-style-lists)
>
> TODO: please add useful links for all functions like in above sections 