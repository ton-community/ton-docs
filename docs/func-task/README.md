# Sample Task

This task is simple, and the five real ones in the contest will be similar in terms of the format.

It’s a contract for a simple TON wallet.

We’ve intentionally made one mistake and made the code less optimal. Try to edit the provided [source code](wallet-code.fc) to fix the mistake.

![Wallet Code](wallet-code.png)

## Info

<details><summary>TON smart contracts</summary>
<p>

A TON smart contract may receive an incoming message and: 
* Change contract data
* Send one or multiple outcoming messages.

Code and data of the smart contracts are arbitrary enough. You can submit any program to the blockchain, and it will be executed.

Messages contain a specific part — e.g., the smart contract address of a sender, the smart contract address of a recipient, and the amount of Toncoin — and arbitrary data.

Smart contracts for TON are written in FunC and are executed on TON Virtual Machine (TVM).

</p>
</details>

<details><summary>Network commission fees and gas</summary>
<p>

Every executed operation of a smart contract consumes gas.

The less optimized smart contract, the more redundant operations in the code there are, the more is spent on gas.

Gas is multiplied by the gas price nominated in Toncoin — it is the amount of Toncoin that the contract executor has to pay to execute the code and submit a transaction.

The TON blockchain has the lowest transaction fees among all blockchains, but the code must still be optimized for the network to run smoothly. 
</p>
</details>

<details><summary>The smart contract of a simple TON Wallet</summary>
<p>

The smart contract of a wallet keeps in a sequence number, “seqno” and a public key of the owner “public_key.” 

An external incoming message contains a signature “signature,” a sequence number “msg_segno” and a suggested outgoing message.

When receiving the external message, the smart contract checks that the message’s data is signed by the owner.

It also checks that the “seqno” of the smart contract equals the “seqno” of the message.

If the checks are not passed, the contract throws error else sends the required outgoing message and increases its “seqno” by 1.

### How it works:

Let's assume I own a wallet that has a balance of 10 Toncoin (TON). I want to send 5 TON to my friend’s wallet.

I write a message with a request to send 5 TON to my friend’s address.

I write an external message that includes the current “seqno” of my address and my message, and I sign it.

I send it to one of the TON blockchain endpoints through HTTP. The external message reaches my wallet’s smart contract and gets executed, and the wallet sends an outgoing message with 5 TON attached to it.

The “seqno” is required to make sure the external message gets executed only once. On the second attempt, the message execution will fail because the “seqno” will be different.
</p>
</details>

In the [TON Docs](https://ton.org/docs) section, you can find all the required additional information: FunC documentation, a description of the TVM and how it works, examples of standard smart contracts, how to set up a compiler and compile a smart contract.


<details><summary>Solution</summary>
<p>

When saving data, the “public_key” and “seqno” variables should be switched.

Correct solution:

`set_data(begin_cell().store_uint(stored_seqno + 1, 32).store_uint(public_key, 256).end_cell())`

We added an extra check: `throw_if(34, check_signature(slice_hash(data), signature, public_key))` 

The owner’s signature is used to sign the incoming message. The body of a valid incoming message won’t match the contract data, an error will not be emitted, and you are free to delete this line.
</p>
</details>