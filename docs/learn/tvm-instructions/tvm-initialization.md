# TVM Initialization

:::info
To maximize your comprehension of this page, familiarizing yourself with the [TL-B language](/develop/data-formats/cell-boc) is highly recommended.
:::

TVM is invoked during the computing phase of ordinary and/or other transactions.

## Initial state

A new instance of TVM is initialized prior to the execution of a smart contract as follows:

- The original **cc** (current continuation) is initialized using the cell slice created from the `code` section of the smart contract. In case of a frozen or uninitialized state of the account, the code must be supplied in the `init` field of the incoming message.

- The **cp** (current TVM codepage) is set to the default value, which is 0. If the smart contract wants to use another TVM codepage _x_, then it must switch to it by using `SETCODEPAGE` _x_ as the first instruction of its code.

- The **gas** values (_gas limits_) are initialized in accordance to Credit phase results.

- The **libraries** (_library context_) computation is [described below](#library-context).

- The **stack** initialization process depends on the event which caused the transaction, and its contents are [described below](#stack).

- Control register **c0** (return continuation) is initialized by extraordinary continuation `ec_quit` with parameter 0. When executed, this continuation leads to a termination of TVM with exit code 0.

- Control register **c1** (alternative return continuation) is initialized by extraordinary continuation `ec_quit` with parameter 1. When invoked, it leads to a termination of TVM with exit code 1. Notice, that both exit codes 0 and 1 are considered a successful termination of TVM.

- Control register **c2** (exception handler) is initialized by extraordinary continuation `ec_quit_exc`. When invoked, it takes the top integer from the stack (equal to the exception number) and terminates TVM with exit code equal to that integer. This way, by default all exceptions terminate the smart contract execution with exit code equal to the exception number.

- Control register **c3** (code dictionary) is initialized by the cell with the smart contract code like **cc** (current continuation) described above.

- Control register **c4** (root of persistent data) is initialized by the persistent data of the smart contract, stored in its `data` section. In case of a frozen or uninitialized state of the account, the data must be supplied in the `init` field of the incoming message. Notice, that the persistent data of the smart contract does not need to be loaded in its entirely for this to occur. The root is loaded instead, and TVM may load other cells by their references from the root only when they are accessed, thus providing a form of virtual memory.

- Control register **c5** (root of actions) is initialized by an empty cell. The "output action" primitives of TVM, such as `SENDMSG`, accumulate _output actions_ (e.g., outbound messages) in this register, to be performed upon successful termination of the smart contract. The TL-B scheme for its serialization is [described below](#control-register-c5)

- Control register **c7** (root of temporary data) is initialized as a tuple and its structure is [described below](#control-register-c7)

## Library context

The _library context_ (library environment) of a smart contract is a hashmap mapping 256-bit cell (representation) hashes into the corresponding cells themselves. When an external cell reference is accessed during the execution of the smart contract, the cell referred to is looked up in the library environment and the external cell reference is transparently replaced by the cell found.

The library environment for an invocation of a smart contract is computed as follows:
1. The global library environment for the current workchain is taken from the current state of the masterchain.
2. Then, it is augmented by the local library environment of the smart contract, stored in the `library` field of the smart contract's state. Only 256-bit keys equal to the hashes of the corresponding value cells are taken into account. If a key is present in both the global and local library environments, the local environment takes precedence in the merge.
3. Finally, it is augmented by the `library` field of the `init` field of the incoming message (if any). Notice, that if the account is frozen or uninitialized, the `library` field of the message would be used over the local library environment from the previous step. The message library has lower precedence than both the local and the global library environments.

Most common way of creating shared libraries for TVM is to publish a reference to the root cell of the library in the masterchain.

## Stack

Initialization of the TVM stack comes after the formation of the initial state of the TVM, and it depends on the event which caused the transaction:
- internal message
- external message
- tick-tock
- split prepare
- merge install

The last item pushed to the stack is always the _function selector_, which is an _Integer_ that identifies the event that caused the transaction.

### Internal message

In case of internal message, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the smart contract (after crediting the value of the inbound message) is passed as an _Integer_ amount of nanotons.
- The balance _b_<sub>m</sub> of inbound message _m_ is passed as an _Integer_ amount of nanotons.
- The inbound message _m_ is passed as a cell, which contains a serialized value of type _Message X_, where _X_ is the type of the message body.
- The body _m_<sub>b</sub> of the inbound message, equal to the value of field body _m_ and passed as a cell slice.
- The function selector _s_, normally equal to 0.

After that, the code of the smart contract, equal to its initial value of **c3**, is executed. It selects the correct function according to _s_, which is expected to process the remaining arguments to the function and terminate afterwards.

### External message

An inbound external message is processed similarly to the [internal message described above](#internal-message), with the following modifications:
- The function selector _s_ is set to -1.
- The balance _b_<sub>m</sub> of inbound message is always 0.
- The initial current gas limit _g_<sub>l</sub> is always 0. However, the initial gas credit _g_<sub>c</sub> > 0.

The smart contract must terminate with _g_<sub>c</sub> = 0 or _g_<sub>r</sub> ≥ _g_<sub>c</sub>; otherwise, the transaction and the block containing it are invalid. Validators or collators suggesting a block candidate must never include transactions processing inbound external messages that are invalid.

### Tick and tock

In case of tick and tock transactions, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account is passed as an _Integer_ amount of nanotons.
- The 256-bit address of the current account inside the masterchain as an unsigned _Integer_.
- An integer equal to 0 for tick transactions and to -1 for tock transactions.
- The function selector _s_, equal to -2.

### Split prepare

In case of split prepare transaction, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account is passed as an _Integer_ amount of nanotons.
- A _Slice_ containing _SplitMergeInfo_.
- The 256-bit address of the current account.
- The 256-bit address of the sibling account.
- An integer 0 ≤ _d_ ≤ 63, equal to the position of the only bit in which addresses of the current and sibling account differ.
- The function selector _s_, equal to -3.

### Merge install

In case of merge install transaction, the stack is initialized by pushing the arguments to the `main()` function of the smart contract as follows:
- The balance _b_ of the current account (already combined with the nanoton balance of the sibling account) is passed as an _Integer_ amount of nanotons.
- The balance _b'_ of the sibling account, taken from the inbound message _m_ is passed as an _Integer_ amount of nanotons.
- The message _m_ from the sibling account, automatically generated by a merge prepare transaction. Its `init` field contains the final state of the sibling account. The message is passed as a cell, which contains a serialized value of type _Message X_, where _X_ is the type of the message body.
- The state of the sibling account, represented by a _StateInit_.
- A _Slice_ containing _SplitMergeInfo_.
- The 256-bit address of the current account.
- The 256-bit address of the sibling account.
- An integer 0 ≤ _d_ ≤ 63, equal to the position of the only bit in which addresses of the current and sibling account differ.
- The function selector _s_, equal to -4.

## Control register c5

The _output actions_ of a smart contract are accumulated in cell stored in control register **c5**: the cell itself contains the last action in the list and a reference to the previous one, thus forming a linked list.

The list can also be serialized as a value of type _OutList n_, where _n_ is the length of the list:

```tlb
out_list_empty$_ = OutList 0;

out_list$_ {n:#}
  prev:^(OutList n)
  action:OutAction
  = OutList (n + 1);

out_list_node$_
  prev:^Cell
  action:OutAction = OutListNode;
```

The list of possible actions thereby consists of:
- `action_send_msg` — for sending an outbound message
- `action_set_code` — for setting an opcode
- `action_reserve_currency` — for storing a currency collection
- `action_change_library` — for changing the library

As described in the corresponding TL-B scheme:

```tlb
action_send_msg#0ec3c86d
  mode:(## 8) 
  out_msg:^(MessageRelaxed Any) = OutAction;
  
action_set_code#ad4de08e
  new_code:^Cell = OutAction;
  
action_reserve_currency#36e6b809
  mode:(## 8)
  currency:CurrencyCollection = OutAction;

libref_hash$0
  lib_hash:bits256 = LibRef;
libref_ref$1
  library:^Cell = LibRef;
action_change_library#26fa1dd4
  mode:(## 7) { mode <= 2 }
  libref:LibRef = OutAction;
```

## Control register c7

Control register **c7** contains the root of temporary data as a Tuple, formed by a _SmartContractInfo_ type, containing some basic blockchain context data, such as time, global config, etc. It is described by the following TL-B scheme:

```tlb
smc_info#076ef1ea
  actions:uint16 msgs_sent:uint16
  unixtime:uint32 block_lt:uint64 trans_lt:uint64 
  rand_seed:bits256 balance_remaining:CurrencyCollection
  myself:MsgAddressInt global_config:(Maybe Cell) = SmartContractInfo;
```

First component of this tuple is an _Integer_ value, which is always equal to 0x076ef1ea, after which 9 named fields follow:

| Field | Type | Description |
| ----- | ---- | ----------- |
| `actions` | uint16 | Originally initialized by 0, but incremented by one whenever an output action is installed by a non-RAW output action primitive |
| `msgs_sent` | uint16 | Number of messages sent |
| `unixtime` | uint32 | Unix timestamp in seconds |
| `block_lt` | uint64 | Represents _logical time_ of the previous block of this account. [More about logical time](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time) |
| `trans_lt` | uint64 | Represents _logical time_ of the previous transaction of this account |
| `rand_seed` | bits256 | Initialized deterministically starting from `rand_seed` of the block, the account address, the hash of the incoming message being processed (if any), and the transaction logical time `trans_lt` |
| `balance_remaining` | [CurrencyCollection](/develop/data-formats/msg-tlb#currencycollection) | Remaining balance of the smart contract |
| `myself` | [MsgAddressInt](/develop/data-formats/msg-tlb#msgaddressint-tl-b) | Address of this smart contract |
| `global_config` | (Maybe Cell) | Contains information about the global config |

Notice, that in the upcoming upgrade to the TVM, the **c7** tuple was extended from 10 to 14 elements. Read more about it [here](/learn/tvm-instructions/tvm-upgrade-2023-07).

## See also

- Original description of [TVM Initialization](https://docs.ton.org/tblkch.pdf#page=89&zoom=100) from the whitepaper
