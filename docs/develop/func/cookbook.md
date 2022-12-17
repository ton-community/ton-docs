# FunC Cookbook

The core reason for creating the FunC Cookbook is to collect all the experience from FunC developers in one place so that future developers will use it!

Compared to the FunC Documentation, this article is more focused on everyday tasks every FunC developer resolve during the development of smart contracts.

:::caution draft   
This is a concept article. We're still looking for someone experienced to write it. Read more about contributing on [FunC Cookbook ton-footstep](https://github.com/ton-society/ton-footsteps/issues/10).
:::

## Basics

### How to determine a cell is empty
```func
cell c = begin_cell().store_uint(1337, 16).end_cell();

if (c.begin_parse().slice_empty?()) {
    ;; cell is empty
}
else {
    ;; cell is not empty
}
```

### How to determine a slice is empty
```func 
slice s = "Hello, world!";

if (s.slice_empty?()) {
    ;; slice is empty
}
else {
    ;; slice is not empty
}
```

### How to determine a dict is empty
```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) {
    ;; dict is empty
}
else {
    ;; dict is not empty
}
```

### How to determine a tuple is empty
```func
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

### How to write a while statement
```func
int a = 50;

while (a > 0) {
    ;; do something
    a -= 1;
}
```

### How to write a do until statement
```func 
int a = 0;

do {
    ;; do something
    a += 1;
} until (a == 10);
```

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

### How to contain a body as ref to an internal message cell
```func
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell()
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

### Iterating n-nested tuples

Sometimes we want to iterate nested tuples. The following example will iterate and print all of the items in a tuple of format `[[2,6],[1,[3,[3,5]]], 3]` starting from the head

```
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple valueAsTuple = cast_to_tuple(value);
            iterateTuple(valueAsTuple);
        }
        else {
            ~dump(value);
        }
    }
}
```

### Resolving type X

The following example checks if some value is contained in a tuple, but tuple contains values X (cell, slice, int, tuple, int). We need to check the value and cast accordingly.

```
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
```

### Modulo operations

As an example, lets say that we want to run the following calculation of all 256 numbers : `(xp + zp)*(xp-zp)`. Since most of those operations are used for cryptography, in the following example we are using the modulo operator for montogomery curves.
Note that xp+zp is a valid variable name ( without spaces between ).

```
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   int xp+zp = (xp + zp) % prime;
   int xp-zp = (xp - zp + prime) % prime;

   (_, int xp+zp*xp-zp) = muldivmod(xp+zp, xp-zp, prime);
   return xp+zp*xp-zp;
}
```

### Reversing tuples

```
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
```

### Determine if slices are equal

There are two different ways we can determine the equality. One is based on the slice hash, while the other one by using the SDEQ asm instruction.

```
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";
```

### Determine if cells are equal 

We can easily determine cell equality based on their hash.

```
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}
```

### Determine if tuples are equal

A more advanced example would be to iterate and compare each of the tuple values. Since they are X we need to check and cast to the corresponding type and if it is tuple to iterate it recursively.

```
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
```


### Generate internal address

Creates an internal address for the corresponding MsgAddressInt TLB.

```
(slice) generate_internal_address (int workchain_id, int address) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(address, 256)
    .end_cell().begin_parse();
}
```

### Generate external address

Creates an external address for the corresponding MsgAddressExt TLB.

```
slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 8) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 8)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```

### How to store and load dictionary in local storage

The logic for loading the dictionary

```
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

While the logic for storing the dictionary is like the following example:

```
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```
