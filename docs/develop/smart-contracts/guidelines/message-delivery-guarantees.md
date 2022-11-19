# Message delivery order guarantees

TON is an asynchronous blockchain with complex structure which is very different from other blockchains. In this regard, new developers have questions about low-level things in TON. In this article we will have a look at one of these related to message delivery.

## What is a message?

If we look at Ethereum or almost any other synchronous blockchain, each transaction can contain several smart contract calls in it. For example, DEXs are performing multiple exchanges in one transaction if there are no liquidity for the selected trading pair.

In asynchronous system you can't get response from the destination smart contract in the same transaction. Contract call may take a few blocks to be processed, depending on the length of the route between source and destination.

That is why in TON, smart contracts are communicating through messages. That way, smart contracts can only interact with each other by calling their functions with special messages, and getting response from them in other messages later.

If transaction in Ethereum is just a set of function calls in different contracts, transaction in TON is some inbound message that triggered it and some set of outbound messages which are sent to other contracts.

## What is a Logical time?

In such a chaotic system with asyncronous and parallel smart contract calls, it can be hard to define the order of actions to process. That's why each message in TON has it's _Logical time_ (later just _lt_). It is used to understand which event happened before and what do validator need to process first. Basically, messages with lower _lt_ are processed first. Some account may receive a lot of messages from different sources, and they all will be processed in order of their _lt_.

Each shardchain block starts with some _lt_ which is greater than the latest masterchain block. When you send several messages in the same transaction, their _lt_'s is increasing in order of their creation.

## Message delivery

Fortunately, TON is working such way that any internal message will surely be received on the destination account. Message cannot be lost anywhere between the source and destination. Situation with external messages is almost the same, but there is possibility to lose the message because of some internet issues on the way to a lite server.

### Delivery order

It looks like _lt_ solves the issue about message delivery order, because we know that transaction with lower _lt_ will be processed first. But doesn't work for all scenarios.

Suppose that there are two contracts - _A_ and _B_. Then _A_ receives an external message which triggers it to send two internal messages to _B_, let's call these messages _1_ and _2_. In that simple case we can be 100% sure that _1_ will be processed by _B_ before _2_ because it has lower _lt_.

_image_

It is just a simple case when we have only two contracts. What if our system works with more of them?

### Several smart contracts

Suppose that we have three contracts - _A_, _B_ and _C_. In some transaction, _A_ sends two internal messages _1_ and _2_: one to _B_ and another one to _C_. Even though they were created in some exact order (_1_, then _2_), we can't be sure that _1_ will be processed before _2_. That happens because routes from _A_ to _B_ and from _A_ to _C_ can differ in length and validator sets. If these contracts are in different shardchains, one of the messages may require several blocks to reach the destination contract.

_image_

The same thing happens in a reverse situation, when two contracts _B_ and _C_ send a message to one contract _A_. Even if message _B->A_ was sent before _C->A_, we can't know which of them will be deliveried first. _B->A_ route may require more shardchain hops, or some validator may just go offline for a few seconds.

_image_

### Chains of messages

Even more interesting things can happend when we have chains of messages. Let's have a look at a few examples.

Suppose that we have contracts A, B and C. In some transcation, A sends two internal messages 1 and 2: one to B and one to C. And after receiving 1, contract B also sends a message 3 to C. It seems like the message 2 should be delivieried before 3, because it's path is shorter. But the thing is that on a way from A to C something unexpected can happen, maybe shardchain will be overloaded. So we can't be sure which message, 2 or 3 will be deliveried first.

_image_

Next example is similar to what was described in [Several smart contracts](#several-smart-contracts). Let's say that we have contracts A, B, C and D. In some transaction, A sends an internal message 1 to B and an internal message 2 to C. Both B and C will send a message (3 and 4) to D after receiving a message from A. In this case, we also can't be sure which message, 3 or 4 will be deliveried first.

_image_

And the most absurd example is shown on the image below. Even in this case we can't say which message will be deliveried to B first. Yes, the chances of message 2 being faster than 6 are obviously higher, but still not 100%.

_image_

## Conclusion

TON is very fast and scalable blockchain, but the price for it is that developer should be more careful and accurate when developing smart contracts. Messages are processed in order of their _lt_, but you can't always be sure that _lt_ is in the needed order.
