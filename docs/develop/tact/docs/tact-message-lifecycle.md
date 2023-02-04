# Message Lifecycle

There are several stages of a message processing by a contract, there are more of them, but we would focus on most important ones:

## Receive Phase

This phase combines multiple low-level phases.

It starts by adding a **message value to the contract balance**. Value of incoming message is a maximum price that a contract can pay for a gas to process this message. Contract is able to overwrite this limit, but it is not recommended and suitable only for advanced developers since it could lead to a contract being drained. 1 million of gas is a maximum amount that contract can spend in a single contract that equals to 1 TON (currently). If message value is zero than execution is aborted.

Then some (usually small amount) of nanotons is substracted from contract balance for storage. This means that you can't perfectly predict balance changes and have to adjust your code to this instability.

Then it deploys a contract if it is not deployed yet and message contains init package. If init package isn't present, it would be ignored.

## Compute Phase

This phase executes code of a smart contract and produces a list of actions or an exception. Currently only two types of actions are supported: **send message** and **reserve**.

Sending a message could use a fixed value or a some dynamic value like **remaining value of a message** - the remainings of value of incoming message. Sending a message could be with a flag `SendIgnoreErrors` that would ignore errors during message sending and would continue to the next action. This flag useful if you have multiple actions. When sending a message with a some value, it first substracts this value from the incoming value and only then from contract balance (before processing).

## Action Phase

Actions are executed in sequence, but bear in mind:
**EXCEPTION DURING PROCESSING ACTIONS WOULDN'T REVERT THE TRANSACTION**

For example, if you substracted 1 ton from from customer's balance and then would send invalid message, that could lead to a situation when customer's balance is substracted, but he wouldn't receive it.
