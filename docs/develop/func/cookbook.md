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
int tuple_length(tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop(tuple t) asm "TPOP";
forall X -> tuple cast_to_tuple(X x) asm "NOP";
forall X -> int cast_to_int(X x) asm "NOP";


() iterateTuple(tuple myTuple)
{
    repeat(myTuple.tuple_length())
    {
        var value = myTuple~tpop();
        if (is_tuple(value))
        {
            tuple valueAsTuple = cast_to_tuple(value);
            iterateTuple(valueAsTuple);
        }

        int valueAsInt = cast_to_int(value);
        ~dump(valueAsInt);
    }
}
```

### Resolving type X

The following example checks if some value is contained in a tuple, but tuple contains values X (cell, slice, int, tuple, int). We need to check the value and cast accordingly.

```
int tuple_length(tuple t) asm "TLEN";
forall X -> int is_null(X x) asm "ISNULL";
forall X -> int is_int(X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell(X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice(X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple(X x) asm "ISTUPLE";
forall X -> (tuple, X) ~tpop(tuple t) asm "TPOP";
forall X -> int cast_to_int(X x) asm "NOP";
forall X -> cell cast_to_cell(X x) asm "NOP";
forall X -> slice cast_to_slice(X x) asm "NOP";
forall X -> tuple cast_to_tuple(X x) asm "NOP";


(int) resolve_type_x(tuple myTuple)
{
    ;; value here is returned as X, since we dont know what is the exact value - we would need to check what is the value and then cast it
    var value = myTuple~tpop();
    if(is_null(value))
    {
        ;; logic for null
    }
    else if(is_int(value))
    {
        int valueAsInt = cast_to_int(value);
        ;; so something with the int
    }
    else if (is_slice(value))
    {
        slice valueAsSlice = cast_to_slice(value);
        ;; do something with the slice
    }
    else if (is_cell(value))
    {
        cell valueAsCell = cast_to_cell(value);
        ;; do something with the cell
    }
    else if (is_tuple(value))
    {
        tuple valueAsTuple = cast_to_tuple(value);
        ;;do something with the tuple
    }
}
```

### Modulo operations

As an example, lets say that we want to run the following calculation of all 256 numbers : `((xp + zp)*(xp-zp))-((xp + zp)/(xp-zp))`. Since most of those operations are used for cryptography, in the following example we are using the modulo operator for montogomery curves.
Note that xp+zp is a valid variable name ( without spaces between ).

```
(int) modulo_operations(int xp, int zp)
{  
  ;;2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   int xp+zp = (xp + zp) % prime;
   int xp-zp = (xp - zp) % prime;
   int xp+zp/xp-zp = (xp / z) % prime;

   (_, int xp+zp*xp-zp) = muldivmod( xp+zp, xp-zp, prime );
   return (xp+zp*xp-zp - xp+zp/xp-zp) % prime;
}
```

### Reversing tuples

```
forall X -> (tuple, X) ~tpop(tuple t) asm "TPOP";
int tuple_length(tuple t) asm "TLEN";
forall X -> int cast_to_int(X x) asm "NOP";

(tuple) reverse_tuple(tuple original_tuple)
{
    tuple reverted_order_tuple = unsafe_tuple([]);
    repeat(original_tuple.tuple_length())
    {
        var initial = original_tuple~tpop();
        int result_as_int = cast_to_int(initial);
        reverted_order_tuple~tpush(result_as_int);
    }

    return reverted_order_tuple;
}
```

### Determine if slices are equal

There are two different ways we can determine the equality. One is based on the slice hash, while the other one by using the SDEQ asm instruction.

```
int equal_slices(slice a, slice b) asm "SDEQ";
(int) areSlicesEqual(slice firstSlice, slice secondSlice)
{
    return equal_slices(first_slice, second_slice);
}

(int) areSlicesEqual(slice firstSlice, slice secondSlice)
{
    return sliceHash(first_slice) == sliceHash(secondSlice);
}
```

### Determine if cells are equal 

We can easily determine cell equality based on their hash.

```
(int) areCellsEqual(cell firstCell, cell secondCell)
{
    return cellHash(firstCell) == cellHash(secondCell);
}
```

### Determine if tuples are equal

A more advanced example would be to iterate and compare each of the tuple values. Since they are X we need to check and cast to the corresponding type and if it is tuple to iterate it recursively.

```
int tuple_length(tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop(tuple t) asm "TPOP";
forall X -> int cast_to_int(X x) asm "NOP";
forall X -> cell cast_to_cell(X x) asm "NOP";
forall X -> slice cast_to_slice(X x) asm "NOP";
forall X -> tuple cast_to_tuple(X x) asm "NOP";
forall X -> int is_null(X x) asm "ISNULL";
forall X -> int is_int(X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell(X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice(X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple(X x) asm "ISTUPLE";

(int) areTuplesEqual(tuple firstTuple, tuple secondTuple)
{
    int areEqual = -1;; initial value to true
    if( firstTuple.tuple_length() != secondTuple.tuple_length())
    {
        return 0;
    }

    int counter = firstTuple.tuple_length();
    while(counter > 0 & areEqual)
    {
        var firstValue = firstTuple~tpop();
        var secondValue = secondTuple~tpop();
        if(is_null(firstTuple) & is_null(secondTuple))
        {
        }
        else if(is_int(firstValue) & is_int(secondValue))
        {
            int firstValueInt = cast_to_int(firstValue);
            int secondValueInt = cast_to_int(secondValue);

            if(firstValueInt != secondValueInt)
            {
                areEqual = 0;
            }
        }
        else if (is_slice(firstValue) & is_slice(secondValue))
        {
            slice firstValueSlice = cast_to_slice(firstValue);
            slice secondValueSlice = cast_to_slice(secondValue);
            if(sliceHash(firstValueSlice) != sliceHash(secondValueSlice))
            {
                areEqual = 0;
            }
        }
        else if (is_cell(firstValue) & is_cell(secondValue))
        {
            cell firstValueCell = cast_to_cell(firstValue);
            cell secondValueCell = cast_to_cell(secondValue);
            if(cellHash(firstValueCell) != cellHash(secondValueCell))
            {
                areEqual = 0;
            }
        }
        else if (is_tuple(firstValue) & is_tuple(secondValue))
        {
            tuple firstValueTuple = cast_to_tuple(firstValue);
            tuple secondValueTuple = cast_to_tuple(secondValue);

            ;; recursively determine nested tuples
            areEqual = areTuplesEqual(firstValueTuple, secondValueTuple);
        }
        else
        {
            areEqual = 0;
        }

        counter -= 1;
    }

    return areEqual;
}
```


### Generate internal address

Creates an internal address for the corresponding MsgAddressInt TLB.

```
slice test_internal_address() impure method_id {
    ;;   addr_std$10 anycast:(Maybe Anycast)
    ;;   workchain_id:int8 address:bits256  = MsgAddressInt;
    var address = random();

    slice address_cell = begin_cell()
            .store_uint(2, 2) ;; addr_std$10
            .store_uint(0, 1) ;; anycast nothing
            .store_int(-1, 8) ;; workchain_id: -1
            .store_uint(address, 256)
            .end_cell()
            .begin_parse();

    return address_cell;
}
```

### Generate external address

Creates an external address for the corresponding MsgAddressExt TLB.

```
slice test_external_address(int address_length) impure method_id {
    ;;addr_extern$01 len:(## 9) external_address:(bits len)
    ;; = MsgAddressExt;
    var address = random();

    slice address_cell = begin_cell()
            .store_uint(1, 2) ;; addr_extern$01
            .store_uint(address_length, 9)
            .store_uint(address, address_length)
            .end_cell()
            .begin_parse();

    return address_cell;
}
```

### How to store and load dictionary in local storage

The logic for loading the dictionary

```
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage))
{
    dictionary_cell = local_storage~load_dict();
}
```

While the logic for storing the dictionary is like the following example:

```
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```