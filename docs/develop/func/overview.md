# Overview


FunC is a domain-specific statically typed language.

FunC programs are compiled into Fift assembler code, which generates corresponding bytecode for the TON Virtual Machine.

Further this bytecode (actually a [tree of cells](/learn/overviews/Cells), like any other data in TON Blockchain) can be used for creating a smart contract in the blockchain or can be run on a local instance of TVM.

You can find more information about FunC in [DOCUMENTATION](/develop/func/types) section.

## Tutorials

* If you want to learn how to use FunC you can read the [SMART CONTRACTS](/develop/smart-contracts/) section.
* Quick one-page FunC cheatsheet on [learnxinyminutes.com](https://learnxinyminutes.com/docs/func/)


## Example

Here is a simple method to send money written on FunC:

```cpp
() send_money(slice address, int amount) impure inline {
    var msg = begin_cell()
        .store_uint(0x10, 6) ;; nobounce
        .store_slice(address)
        .store_grams(amount)
        .end_cell();

    send_raw_message(msg, 64);
}
```

## Tools

Find IDE plugins, SDK for FunC in the [Tools & SDK](/develop/tools) section.