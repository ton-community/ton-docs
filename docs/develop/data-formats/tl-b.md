# TL-B
In this section, complex and non-obvious TL-B structures are analyzed. To get started, I recommend reading [this documentation](/docs/learn/overviews/tl-b-language) first.

## Unary
Unary is commonly used for dynamic sizing in structures such as [hml_short](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb#L29).

Unary has 2 options:
```
unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);
```

With `unary_zero` everything is simple: if the first bit is 0, then the number you are looking for is 0.

`unary_succ` is more interesting, it is loaded recursively and has the value `~(n + 1)`. This means that it calls itself until we hit `unary_zero`. In other words, the desired value will be equal to the number of units in a row.

Let's analyze parsing `1110`.

The call chain will be as follows:
```unary_succ$1 -> unary_succ$1 -> unary_succ$1 -> unary_zero$0```

Once we get to `unary_zero`, the value is returned to the top, just like in a recursive function call.
Now, to understand the result, let's go along the return value path, that is, from the end:
```0 -> ~(0 + 1) -> ~(1 + 1) -> ~(2 + 1) -> 3```

## Either
```
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
```
It is used when one of two types is possible, while the choice of type depends on the prefix bit, if 0 - the left type is serialized, if 1 - the right one.
It is used, for example, when serializing messages, when body can be either part of the main cell or a link.

## Maybe
```
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
```
Used for optional values, if the first bit is 0 - the value itself is not serialized (skipped), if 1 - serialized.

## Both
```
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;
```
Normal pair - both types are serialized, one after the other, without conditions.

## Hashmap

As an example of working with complex TL-B structures, let's take a look at `Hashmap`, which is a structure for storing `dict` from FunC smart contract code.

The following TL-B structures are used to serialize a Hashmap with a fixed key length:
```
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;

hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) 
           right:^(Hashmap n X) = HashmapNode (n + 1) X;

hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

unary_zero$0 = Unary ~0;
unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

hme_empty$0 {n:#} {X:Type} = HashmapE n X;
hme_root$1 {n:#} {X:Type} root:^(Hashmap n X) = HashmapE n X;
```
Where the root structure is `HashmapE`. It can have one of the states: `hme_empty` or `hme_root`.

### Hashmap parsing example

For example, consider the following Cell, given in binary form.
```
1[1] -> {
  2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
}
```

This Cell is a `HashmapE` with a key size of 8 bits and its values are `uint16` numbers. i.e. `HashmapE 8 uint16`. It has 3 keys:
```
1 = 777
17 = 111
128 = 777
```

To parse it, we need to know in advance which structure to use, `hme_empty` or `hme_root`. We can determine this by prefix, empty is 1 bit 0 (`hme_empty$0`), root is 1 bit 1 (`hme_root$1`). We read the first bit, it is equal to one (`1[1]`), which means we have `hme_root`.

Let's fill the structure variables with known values, we get:
`hme_root$1 {n:#} {X:Type} root:^(Hashmap 8 uint16) = HashmapE 8 uint16;`

1 bit prefix is already read, what's inside `{}` are conditions and not read. (`{n:#}` means that n is any uint32 number, `{X:Type}` means that X is any type. The next thing we need to read is `root:^(Hashmap 8 uint16)`, `^` stands for a link, load it.
```
2[00] -> {
    7[1001000] -> {
      25[1010000010000001100001001],
      25[1010000010000000001101111]
    },
    28[1011100000000000001100001001]
  }
```

#### Start parsing branches
According to our schema, this is the `Hashmap 8 uint16` structure. Let's fill it with known values, we get:
```
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 8) 
          {8 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```

As we can see, conditional variables `{l:#}` and `{m:#}` have appeared, the values of which are unknown to us. Also, after reading the `label`, `n` is involved in the equation `{n = (~m) + l}`, in this case we can calculate `l` and `m`, the sign ` tells us about this ~`.

To determine the value of `l` we need to load `label:(HmLabel ~l uint16)`. `HmLabel` has 3 structure options:
```
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;
```
The option is determined by the prefix. In our root, at the moment, the cell has 2 zero bits (`2[00]`). We have only 1 option, which has a prefix starting with 0. It turns out we have `hml_short$0`.

Fill `hml_short` with known values:
```
hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= 8} s:(n * Bit) = HmLabel ~n 8
```
We don't know `n`, but since it has a `~` character, we can calculate it. To do this, load `len:(Unary ~n)`, [[More about Unary]](#unary).
In our case, we had `2[00]`, after defining the type `HmLabel` we have 1 bit out of two left, we load it and see that this is 0, which means our option is `unary_zero$0`. It turns out n from `HmLabel` is zero.

Complete `hml_short` with the calculated value n:
```
hml_short$0 {m:#} {n:#} len:0 {n <= 8} s:(0 * Bit) = HmLabel 0 8
```
It turns out we have an empty `HmLabel`, s = 0, so there is nothing to download.

We go back even higher and supplement our structure with the calculated value of `l`:
```
hm_edge#_ {n:#} {X:Type} {l:0} {m:#} label:(HmLabel 0 8) 
          {8 = (~m) + 0} node:(HashmapNode m uint16) = Hashmap 8 uint16;
```
Now when we have calculated `l`, we can also calculate `m` using the equation `n = (~m) + 0`, i.e. `m = n - 0`, m = n = 8.

We have determined all unknowns and can now load `node:(HashmapNode 8 uint16)`. HashmapNode we have options:
```
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) 
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
```
In this case, we determine the option not by the prefix, but by the parameter, if n = 0, then we have `hmn_leaf`, otherwise `hmn_fork`. In our case, n = 8, we have `hmn_fork`. We take it and fill in the known values:
```
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap n uint16) 
           right:^(Hashmap n uint16) = HashmapNode (n + 1) uint16;
```
Everything is not so obvious here, we have `HashmapNode (n + 1) uint16`. This means that the resulting n must be equal to our parameter, i.e. 8. To calculate the local n, we need to calculate it: `n = (n_local + 1)` -> `n_local = (n - 1)` -> `n_local = (8 - 1)` -> `n_local = 7`.
```
hmn_fork#_ {n:#} {X:uint16} left:^(Hashmap 7 uint16) 
           right:^(Hashmap 7 uint16) = HashmapNode (7 + 1) uint16;
```
Now it's simple, load the left and right branches, and for each branch [repeat the process](#начинаем-парсинг-веток).

#### Analyze the loading of values
Continuing the previous example, let's look at loading the right branch, i.e. `28[1011100000000000001100001001]`

We see `hm_edge` again, fill it with known values:
```
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l 7) 
          {7 = (~m) + l} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```

Load `HmLabel`, this time we have `hml_long` because the prefix is `10`.
```
hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;
```
Let's fill it in:
```
hml_long$10 {m:#} n:(#<= 7) s:(n * Bit) = HmLabel ~n 7;
```
We see the new construction - `n:(#<= 7)`, it denotes a number of such a size can fit 7, in fact it is log2 from the number + 1. But for simplicity, you can count the number of bits that you need to write the number 7. 7 in binary form is `111`, so we need 3 bits, `n = 3`.
```
hml_long$10 {m:#} n:(## 3) s:(n * Bit) = HmLabel ~n 7;
```
We load `n`, and get `111`, that is 7 (coincidence). Next, load `s`, 7 bits - `0000000`. `s` is part of the key.

We return to the top and fill in the resulting `l`:
```
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel 7 7) 
          {7 = (~m) + 7} node:(HashmapNode m uint16) = Hashmap 7 uint16;
```
Calculate `m`, `m = 7 - 7`, `m = 0`.

Since `m = 0`, we got to the value, and the structure is applicable as a HashmapNode:
```
hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;
```
Everything is simple here: we substitute our uint16 type and load the value. The remaining 16 bits of `0000001100001001` in decimal form is 777, our value.

Now let's restore the key. We collect together all the parts of the keys that go above us (we return to the top along the same path), and add 1 bit for each branch. If we went along the right branch, then we add 1, if along the left - 0. If there was a non-empty HmLabel above us, then we add its bits to the key.

In our case, we take 7 bits from HmLabel `0000000` and add 1 in front of them, due to the fact that we got to the value on the right branch. We get 8 bits `10000000`, our key is the number `128`.

## Other types of Hashmap
There are also other types of dictionaries, they all have the same essence and, having figured out how to load the main Hashmap, you can load other types according to the same principle.

### HashmapAugE
```
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#} 
  label:(HmLabel ~l n) {n = (~m) + l} 
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;
  
ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;

ahme_empty$0 {n:#} {X:Type} {Y:Type} extra:Y 
          = HashmapAugE n X Y;
          
ahme_root$1 {n:#} {X:Type} {Y:Type} root:^(HashmapAug n X Y) 
  extra:Y = HashmapAugE n X Y;
```
The difference from a regular Hashmap is the presence of an `extra:Y` field in each node (not just in leafs with values).

### PfxHashmap
```
phm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
           {n = (~m) + l} node:(PfxHashmapNode m X) 
           = PfxHashmap n X;

phmn_leaf$0 {n:#} {X:Type} value:X = PfxHashmapNode n X;
phmn_fork$1 {n:#} {X:Type} left:^(PfxHashmap n X) 
            right:^(PfxHashmap n X) = PfxHashmapNode (n + 1) X;

phme_empty$0 {n:#} {X:Type} = PfxHashmapE n X;
phme_root$1 {n:#} {X:Type} root:^(PfxHashmap n X) 
            = PfxHashmapE n X;
```
The difference from the usual Hashmap is the ability to store keys of different lengths, due to the tag of the `phmn_leaf$0`, `phmn_fork$1` nodes.

### VarHashmap
```
vhm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
           {n = (~m) + l} node:(VarHashmapNode m X) 
           = VarHashmap n X;
vhmn_leaf$00 {n:#} {X:Type} value:X = VarHashmapNode n X;
vhmn_fork$01 {n:#} {X:Type} left:^(VarHashmap n X) 
             right:^(VarHashmap n X) value:(Maybe X) 
             = VarHashmapNode (n + 1) X;
vhmn_cont$1 {n:#} {X:Type} branch:Bit child:^(VarHashmap n X) 
            value:X = VarHashmapNode (n + 1) X;

// nothing$0 {X:Type} = Maybe X;
// just$1 {X:Type} value:X = Maybe X;

vhme_empty$0 {n:#} {X:Type} = VarHashmapE n X;
vhme_root$1 {n:#} {X:Type} root:^(VarHashmap n X) 
            = VarHashmapE n X;
```
The difference from the usual Hashmap is the ability to store keys of different lengths, due to the tag of the `vhmn_leaf$00`, `vhmn_fork$01` nodes. At the same time, `VarHashmap` is able to form a common value prefix (child map), at the expense of `vhmn_cont$1`.

### BinTree
```
bta_leaf$0 {X:Type} {Y:Type} extra:Y leaf:X = BinTreeAug X Y;
bta_fork$1 {X:Type} {Y:Type} left:^(BinTreeAug X Y) 
           right:^(BinTreeAug X Y) extra:Y = BinTreeAug X Y;
```
A simple binary tree: the principle of key generation, like Hashmap, but without labels, only counting branch prefixes.


## Addresses
The addresses in TON are formed from the sha256 hash of the TL-B structure of StateInit. The address can be calculated even before the contract is deployed to the network.

### Serialization
The standard address like `EQBL2_3lMiyywU17g-or8N7v9hDmPCpttzBPE2isF2GTzpK4` is the base64 uri encoded bytes.
Its length is 36 bytes, the last 2 of which are the crc16 checksum with the XMODEM table. The first byte is the flags, the second is the workchain.
32 bytes in the middle are the data of the address itself, often represented in schemas as int256.

[Decoding example](https://github.com/xssnick/tonutils-go/blob/3d9ee052689376061bf7e4a22037ff131183afad/address/addr.go#L156)

## References

_Here a [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/TL-B.md) by [Oleg Baranov](https://github.com/xssnick)._