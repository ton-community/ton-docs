# TVM Overview



All TON smart contracts are executed on their own TON Virtual Machine (TVM). TVM is built on the _stack principle_, which makes it efficient and easy to implement.

This document provides bird's-eye overview of how TVM execute transactions.

:::tip

* There is also the detailed specification — [**whitepaper**](https://ton.org/tvm.pdf)
* Could be useful — [**TVM C++ implementation**](https://github.com/ton-blockchain/ton/tree/master/crypto/vm)

:::

## Transactions and phases
When some event happens on the account in one of TON chains it causes a **transaction**.  Most common event is "arrival of some message", but generally speaking there could be `tick-tock`, `merge`, `split` and other events.

Each transaction consists of up to 5 phases.
1. **Storage phase** - in that phase storage fees accrued by contract due to occupation of some space in chain state are calculated. Read more in [Storage Fees](/develop/smart-contracts/fees#storage-fee).
2. **Credit phase** - in that phase balance of contract with respect to (possible) incoming message value and collected storage fee are calculated
3. **Compute phase** - in that phase TVM is executed (see below), result of TVM execution is aggregation of `exit_code`, `actions` (serialized list of actions), `gas_details`, `new_storage` and some others.
4. **Action phase** - if compute phase was successful, in that phase `actions` from compute phase are processed. In particular actions may include sending of messages, update of smart contract code, update of libraries etc. Note that some actions may fail during processing (for instance we try to send message with more TONs than contract has), in that case the whole transaction may revert or this action may be scipped (it depends on the mode of the actions, in other words contract may send message in regime `send-or-revert` or in regime `try-send-if-no-ignore`).
5. **Bounce phase** - if compute phase failed (it returned `exit_code >= 2`), in that phase _bounce message_ is formed for transactions initiated by incoming message.

## Compute phase
In that phase execution of TVM happens.

### TVM state
In any moment TVM state is fully determined by 6 state properties:
* Stack (see below)
* Control registers - (see below) speaking in simple terms up to 16 variables which may be directly set and read during execution
* Current continuation - object which describe a sequence of instructions which is currently executed
* Current codepage - speaking in simple terms version of TVM which is currently running
* Gas limits - the set of 4 integer values the current gas limit g<sub>l</sub>, the maximal gas limit g<sub>m</sub>, the remaining gas g<sub>r</sub>, and the gas credit g<sub>c</sub>
* Library context - the hashmap of libraries which can be called by TVM 

### TVM is stack machine
TVM is last-input-first-output stack machine. There are 7 types of variables which may be stored in stack:
* Integer - Signed 257-bit integers
* Tuple - ordered collection of up to 255 elements having arbitrary value types, possibly distinct.
* Null

And four distinct flavours of cells:
* Cell - basic (possible nested) opaque structure used by TON blockchain for storing all data
* Slice - special object which allows to read from cell
* Builder - special object which allows to create new cells
* Continuation - special object which allows to use cell as source of TVM instructions

### Control registers
* `c0` — Contains the next continuation or return continuation (similar to the subroutine return address in conventional designs). This value must be a Continuation.
* `c1` — Contains the alternative (return) continuation; this value must be a Continuation. 
* `c2` — Contains the exception handler. This value is a Continuation, invoked whenever an exception is triggered.
* `c3` — Supporting register, contains the current dictionary, essentially a hashmap containing the code of all functions used in the program. This value must be a Continuation. 
* `c4` — Contains the root of persistent data, or simply the `data` section of the contract. This value is a Cell.
* `c5` — Contains the output actions. This value is a Cell.
* `c7` — Contains the root of temporary data. It is a Tuple.

### Initialization of TVM
So when transaction execution gets to Computation phase, TVM initialises and then executes commands (op-codes) from _Current continuation_ until there is no more commands to execute (and no continuation for return jumps).

Detailed description of initialization can be found in [Ton-blockchain 4.4](https://ton.org/tblkch.pdf).
For ordinary transactions caused by message the initial state is as follows:
* stack: 5 elements are put to the stack
    * The balance of the smart contract (after crediting the value of the inbound message) is passed as an Integer amount of nanoTONs.
    * The balance of inbound message `m` is passed as an Integer amount of nanoTONs.
    * The inbound message is passed as a cell, which contains a serialized value of type Message X, where X is the type of the message body.
    * The body of the inbound message, equal to the value of field body of `m`, is passed as a cell slice
    * The function selector `s`, an Integer: `0` for tx caused by internal messages, `-1` for external, etc. Generally speaking it is the integer which tells what event caused transaction
 * Current continuation : continuation converted from the `code` section of smart contract
 * Registers initialise as follows: c0, c1, c2 and c3 are empty. c4 contain the cell from `data` section of smart contract. c5 contains empty list (it is serialized as cell which contain last action in list plus reference to prev one) of output actions. c7 is initialized as tuple with some basic blockchain context data such as time, global config, block_data, etc. See [Ton-blockchain 4.4.10](https://ton.org/tblkch.pdf)
 * Current codepage is set to default value (cp=0)
 * Gas limits are initialized in accordance to Credit phase results
 * Library context is initialized as result of merging this smart contract library collection, masterchain global library collection and incoming (if any) message library collection

## TVM instructions

The list of TVM instructions can be found here: [TVM instructions](/learn/tvm-instructions/instructions).

### Result of TVM execution
Besides of exit_code and consumed gas data, TVM indirectly outputs the following data:
* c4 register - the cell which will be stored as new `data` of the smart-contract (if execution will not be reverted on this or later phases)
* c5 register - (list of output actions) the cell with last action in the list and reference to the cell with prev action (recursively)

All other register values will be neglected.

Note, that since there is limitation on max cell-depth `<1024`, and particularly limitation on c4 and c5 depth `<=512`. Besides there is limitation on number of output actions in one tx `<=255`. If contract need to send more than that it may send message with request `continue_sending` to himself and send all necessary messages in a few subsequent transactions.
