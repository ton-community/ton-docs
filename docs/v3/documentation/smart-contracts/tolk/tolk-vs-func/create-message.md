import Feedback from '@site/src/components/Feedback';

# Universal createMessage

In FunC, you had to compose message cells manually and regularly face code like
```func
cell m = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(sender_address)
    .store_coins(50000000)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(0x178d4519, 32)
    .store_uint(query_id, 64)
    ...
    .end_cell();
send_raw_message(m, 0);
```

In Tolk, you use a high-level function — and it's even more gas-effective:
```tolk
val reply = createMessage({
    bounce: true,
    value: ton("0.05"),
    dest: senderAddress,
    body: RequestedInfo { ... }
});
reply.send(SEND_MODE_REGULAR);
```


## Key features of createMessage

1. Supports extra currencies
2. Supports `stateInit` (code+data) with automatic address computation
3. Supports different workchains
4. Supports sharding (formerly splitDepth)
5. Integrated with auto-serialization of `body`
6. Automatically detects "body ref or not"
7. More efficient than handwritten code
         

## The concept is based on union types

There is a huge variety of interacting between contracts. When you explore FunC implementations, you notice that
* sometimes, you "send to an address (slice)"
* ... but sometimes, you "build the address (builder) manually"
* sometimes, you compose `StateInit` from code+data
* ... but sometimes, you already have `StateInit` as a ready cell
* sometimes, you send a message to basechain
* ... but sometimes, you have the `MY_WORKCHAIN` constant and use it everywhere
* sometimes, you just attach tons ("msg value")
* ... but sometimes, you also need extra currencies
* etc.

**How can we describe such a vast variety of options? The solution is: union types!**

Let's start exploring this idea by looking at how extra currencies are supported.


## Extra currencies: union

When you don't need them, you just attach "msg value" as tons:
```tolk
value: someTonAmount
```

When you need them, you attach tons AND extra currencies dict:
```tolk
value: (someTonAmount, extraDict)
```

How does it work? Because the field `value` is a union:
```tolk
// how it is declared in stdlib
type ExtraCurrenciesDict = dict;

struct CreateMessageOptions<TBody> {
    ...
    /// message value: attached tons (or tons + extra currencies)
    value: coins | (coins, ExtraCurrenciesDict)
```

That's it! You just attach tons OR tons with extra, and the compiler takes care of composing this into a cell.


## Destination: union

The same idea of union types spreads onto "destination" of a message.
```tolk
dest: someAddress,
dest: (workchain, hash)
```

It's either an address, OR a OR (workchain + hash), OR ...:
```tolk
struct CreateMessageOptions<TBody> {
    ...
    /// destination is either a provided address, or is auto-calculated by stateInit
    dest: address |             // either just send a message to some address
          builder |             // ... or a manually constructed builder with a valid address
          (int8, uint256) |     // ... or to workchain + hash (also known as accountID)
          AutoDeployAddress;    // ... or "send to stateInit" aka deploy (address auto-calculated)
```

**That's indeed a TypeScript way** — but works at compile-time!


## StateInit and workchains

Let's start from an example. From a jetton minter, you are deploying a jetton wallet.
You know wallet's code and initial data:
```tolk
val walletInitialState: ContractState = {
    code: ...,   // probably, kept in minter's storage
    data: ...,   // zero balance, etc. (initial wallet's storage)
};
```

Now, from a minter, you want to send a message to a wallet. But since you are not sure whether the wallet already exists onchain, you attach its code+data: 
if a wallet doesn't exist, it's immediately initialized with that code. 
So, where should you send a message to? What is "destination"? The answer is: **destination is wallet's StateInit**. 
You just "send a message to a walletInitialState," because in TON, the address of a contract, by definition, is a hash of its initial state:
```tolk
// address auto-calculated, code+data auto-attached
dest: {
    stateInit: walletInitialState
}
```

In more complex tasks, you can configure additional fields:
```tolk
dest: {
    workchain: ...,     // by default, 0 (basechain)
    stateInit: ...,     // either code+data OR a ready cell
    toShard:   ...,     // by default, null (no sharding) 
}
```

That's the essence of `AutoDeployAddress`. Here is how it's declared in stdlib:
```tolk
// declared in stdlib
struct AutoDeployAddress {
    workchain: int8 = BASECHAIN;
    stateInit: ContractState | cell;
    toShard: AddressShardingOptions? = null;
}
```


## Sharding: deploying "close to" another contract

The interface of `createMessage` also supports initializing contracts in concrete shards. 
Say, you are writing sharded jettons, and want every jetton wallet to be in the same shard as the owner's wallet.

In other words, your intention is:
* a jetton wallet must be **close to** the owner's wallet
* this *closeness* is determined by a shard depth (syn. "fixed prefix length," syn. "split depth")

Let's illustrate it with numbers for "shard depth" = 8:

|  title               | addr hash (256 bits)       | comment                              |
|----------------------|----------------------------|--------------------------------------|
| closeTo (owner addr) | `01010101...xxx`           | owner's wallet                       |
| shardPrefix          | `01010101`                 | first 8 bits of closeTo              |
| stateInitHash        | `yyyyyyyy...yyy`           | calculated by code+data              |
| result (JW addr)     | `01010101...yyy`           | jetton wallet in same shard as owner |

That's how you do it:
```tolk
dest: {
    stateInit: walletInitialState,
    toShard: {
        closeTo: ownerAddress,
        fixedPrefixLength: 8
    }
}
```

Technically, "shard depth" must be a part of `StateInit` (besides code+data) — for correct initialization inside the blockchain.
The compiler automatically embeds it.

But semantically, "shard depth" alone makes no sense. That's why **shard depth + closeTo** is a single entity:
```tolk
// how it is declared in stdlib
struct AutoDeployAddress {
    ...
    toShard: AddressShardingOptions? = null;
}

struct AddressShardingOptions {
    fixedPrefixLength: uint5;    // shard depth, formerly splitDepth
    closeTo: address;
}
```


## Body ref or not: compile-time calculation

In TON Blockchain, according to specification, a message is a cell (flags, dest address, stateInit, etc.), 
and its *body* can be either inlined into the same cell or can be placed into its own cell (and be a ref).

In FunC, you had to manually calculate whether it's safe to embed body (you did it *on paper* or dynamically).  
In Tolk, you just pass `body`, and the compiler does all calculations for you:
```tolk
createMessage({
    ...
    body: RequestedInfo { ... }    // no `toCell`! just pass an object
});
```

The rules are the following:
1) if `body` is small, it's embedded directly into a message cell
2) if `body` is large or unpredictable, it's wrapped into a ref

Why not make a ref always? Because creating cells is expensive. Avoiding cells for small bodies is crucial for gas consumption.

The most interesting is that **"is body small or not?" is calculated AT COMPILE TIME, no runtime checks inserted**. 
How? Thanks to generics! Here is how `createMessage` is declared:
```tolk
fun createMessage<TBody>(options: CreateMessageOptions<TBody>): OutMessage;

struct CreateMessageOptions<TBody> {
    ...
    body: TBody;
}
```

Hence, when you pass `body: RequestedInfo {...}`, then `TBody = RequestedInfo`, and the compiler estimates its size:
* it's "small" if its maximum size is less than 500 bits and 2 refs — then "no ref"
* it's "large" if >= 500 bits or >= 2 refs — then "ref"
* it's "unpredictable" if contains `builder` or `slice` inside — then "ref"

**Even if body is large/unpredictable, you can force it to be inlined** by wrapping into a special type:
```tolk
// potentialy 620 bits (if all coins are billions of billions)
// by default, compiler will make a ref
struct ProbablyLarge { 
    a: (coins, coins, coins, coins, coins) 
}  

val contents: ProbablyLarge = { ... };  // but you are sure: coins are small
createMessage({                         // so, you take the risks
    body: UnsafeBodyNoRef {             // and force "no ref"
        bodyForceNoRef: contents,
    }

// here TBody = UnsafeBodyNoRef<ProbablyLarge>
```

If `body` is already a cell, it will be left as a ref, without any surprise:
```tolk
createMessage({
    body: someCell,       // ok, just a cell, keep it as a ref

// here TBody = cell 
```

That's why, don't pass `body: someObj.toCell()`, pass just `body: someObj`, let the compiler take care of everything.


## Body is not restricted to structures

In practice, you'll use `createMessage` to send a message (sic!) to another contract — in the exact format as the receiver expects. 
You'll declare a struct with 32-bit opcode and some data in it.
```tolk
struct (0xd53276db) Excesses {
    queryId: uint64;
}

val excessesMsg = createMessage({
   ...
   body: Excesses {
       queryId: input.queryId,
   }
});
excessesMsg.send(SEND_MODE_IGNORE_ERRORS);
```

This works perfectly, as expected. But an interesting fact: this will also work:
```tolk
// just an example, that even this would work
val excessesMsg = createMessage({
   ...
   body: (0xd53276db as int32, input.queryId)
});
excessesMsg.send(SEND_MODE_IGNORE_ERRORS);
```

Even this is okay, it will be inferred as `createMessage<(int32, uint64)>(...)` and encoded correctly.

The example above just illustrates the power of the type system, no more.


## Body can be empty

If you don't need any `body` at all, just leave it out:
```tolk
createMessage({
    bounce: true,
    dest: somewhere,
    value: remainingBalance
});
```

A curious reader might ask: what's the type of `body` here? How is it expressed in the type system? The answer: it's `never`.

Actually, `CreateMessageOptions` is declared like this:
```tolk
// declared in stdlib
struct CreateMessageOptions<TBody = never> {
    ...
    body: TBody;
}
```

Hence, when we miss `body` in `createMessage`, it leads to the default `TBody = never`. 
And by convention, fields having `never` type are not required in a literal. 
It's not that obvious, but it is definitely beautiful.


## Don't confuse StateInit and "code+data", they are different

It's incorrect to say that "StateInit is code+data," because in TON, a full "StateInit" cell contents is richer (consider block.tlb):
- it also contains fixed_prefix_length (formerly split_depth),
- it also contains ticktock info
- it also contains a library cell
- code and data are actually optional

For instance, when sending a message to another shard, fixed_prefix_length is automatically set by the compiler (from `toShard.fixedPrefixLength`).

That's why a structure "code+data" is named `ContractState`, NOT `StateInit`:
```tolk
// in stdlib
struct ContractState {
    code: cell;
    data: cell;
}
```

And that's why a field `stateInit: ContractState | cell` is named "stateInit," 
emphasizing that `StateInit` can be initialized automatically from `ContractState` (or can be a well-formed "rich" cell).


## Why not "send", but "createMessage"?

You might ask: why do we follow the pattern *"val msg = createMessage(...); msg.send(mode)"* instead of just *"send(... + mode)"*?

Typically, yes: you immediately send a message right after composing it. But there exist advanced usages:
* not just send, but send and estimate fees,
* or estimate fees without sending,
* or get a message hash,
* or save a message cell to storage for later sending,
* or even push it to an action phase.

So, composing a message cell and THEN doing some action with it is a more flexible pattern.

Moreover, following this pattern requires you to give **a name** to a variable. 
Advice is not to name it "m" or "msg," but to give a descriptive name like "excessesMsg" or "transferMsg":
```tolk
val excessesMsg = createMessage({
    ...
});
excessesMsg.send(mode);
// also possible
excessesMsg.sendAndEstimateFee(mode);
```

This strategy makes it **easier to read** code later. You see — okay, this is about excesses, this is about burn notification, etc. 
As opposed to a potential `send(...)` function, where you'd need to find out, what body is actually sent, to make such conclusions.


## Why not provide a separate "deploy" function?

You might also ask: why do we join `stateInit` as "destination" with other use-cases? 
Why not make a `deploy()` function that accepts code+data, and drop stateInit from a "regular" createMessage?

The answer lies in terminology. Yes, "attaching stateInit" is often called "deployment," but it's inaccurate. 
**TON Blockchain doesn't have a dedicated deployment mechanism.** 
You just send a message to some *void* — and if this *void* doesn't exist, but you've attached a way to initialize it (code+data) — 
it's initialized immediately, and accepts your message.

If you wish to emphasize the deployment, give it *a name*:
```tolk
val deployMsg = createMessage({
    ...
});
deployMsg.send(mode);
```
 

## Universal createExternalLogMessage

The philosophy is similar to `createMessage`. But "external outs" don't have "bounce," you don't attach tons, etc. So, options for creating are different.

**Currently, external messages are used only for emitting logs (for viewing them in indexers).** 
But theoretically, they can be extended to "send messages to the offchain."

Example:
```tolk
val emitMsg = createExternalLogMessage({
    dest: createAddressNone(),
    body: DepositEvent { ... }
});
emitMsg.send(SEND_MODE_REGULAR);
```

**Available options for external-out messages** are only "dest" and "body," actually:
```tolk
struct CreateExternalLogMessageOptions<TBody = never> {
    /// destination is either an external address or a pattern to calculate it
    dest: address |         // either some valid external/none address (not internal!)
          builder |         // ... or a manually constructed builder with a valid external address
          ExtOutLogBucket;  // ... or encode topic/eventID in destination
    
    /// body is any serializable object (or just miss this field for empty body)
    body: TBody;
}
```

So, as for `createMessage` — just pass `someObject`, do NOT call `toCell()`, let the compiler decide whether it fits into the same cell or not. 
`UnsafeBodyNoRef` is also applicable.

**Emitting external logs, example 1**:
```tolk
struct DepositData {
    amount: coins;
    ...
}

val emitMsg = createExternalLogMessage({
    dest: ExtOutLogBucket { topic: 123 },   // 123 for indexers
    body: DepositData { ... }
});
emitMsg.send(SEND_MODE_REGULAR);
```

**Emitting external logs, example 2**:
```tolk
struct (0x12345678) DepositEvent {
    amount: coins;
    ...
}

createExternalLogMessage({
    dest: createAddressNone(),
    body: DepositEvent { ... }   // 0x12345678 for indexers
});    
```

`ExtOutLogBucket` is a variant of a custom external address for emitting logs "to the outer world." 
It includes some "topic" (arbitrary number), that determines the format of the message body. 
In the example above, you emit "deposit event" (reserving topic "deposit" = 123) — 
and external indexers will index your emitted logs by destination address without parsing body.



<Feedback />
