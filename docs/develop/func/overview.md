# Overview


FunC is a domain-specific statically typed language.

FunC programs are compiled into Fift assembler code, which generates corresponding bytecode for the TON Virtual Machine.

Further this bytecode (actually a [tree of cells](/learn/overviews/Cells), like any other data in TON Blockchain) can be used for creating a smart contract in the blockchain or can be run on a local instance of TVM.

You can find more information about FunC in [DOCUMENTATION](/develop/func/types) section.

## Example

Here is a simple data loaded written on FunC:

```cpp
(slice, int) load_data() inline {
  var ds = get_data().begin_parse();
  return (
    ds~load_msg_addr(), ;; owner_address
    ds~load_uint(64)    ;; counter
  );
}

() save_data(slice owner_address, int counter) impure inline {
  set_data(begin_cell()
    .store_slice(owner_address)
    .store_uint(counter, 64)
    .end_cell());
}
```

## Tutorials

If you want to learn how to use FunC you can read the [SMART CONTRACTS](/develop/smart-contracts/) section.

## Tools

Find IDE plugins, SDK for FunC in the [Tools & SDK](/develop/tools) section.