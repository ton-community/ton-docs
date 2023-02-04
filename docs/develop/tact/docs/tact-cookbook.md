# Tact Cookbook

Purpose of creating the Tact Cookbook is to provide a centralized repository of valuable information and experience from experienced Tact developers for future developers.

This article is more focused on every day tasks Tact developer resolve during the development of smart contracts.

:::caution draft
This is a concept article. We're still looking for someone experienced to write it. Read more about contributing on [Tact Cookbook ton-footstep](https://github.com/ton-society/ton-footsteps/issues/143).
:::

## Basics
### How to write exception statements

To declare exceptions in Tact suggested to use special function `reqiure(condition, error message)`

```java
//  throw "Empty counter" message when condition is equal True
require(self.counters3.get(msg.key) == null, "Empty counter");

require(checkSignature(op_hash, msg.signature, self.key), "Invalid signature");

require(ok1 && ok2 && ok3, "Invalid signature");

require(ctx.value >= ton("1"), "Invalid value");
```

:::caution
Highly recommended to avoid native Func functions like `nativeThrow()`.
:::


### How to create msg body with comment