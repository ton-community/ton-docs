import Feedback from '@site/src/components/Feedback';

# TVM upgrade Apr 2024

## Introduction of new instructions for low fees calculation

:::tip
This upgrade is active on the Mainnet since Mar 16, 2024. See the details [here](https://t.me/tonstatus/101). A preview of the update for blueprints is available in the following packages: `@ton/sandbox@0.16.0-tvmbeta.3`, `@ton-community/func-js@0.6.3-tvmbeta.3`, and `@ton-community/func-js-bin@0.4.5-tvmbeta.3`.
:::

This update is enabled with Config8 `version >= 6`.

## `c7`

The `c7` tuple has been extended from 14 to 16 elements as follows:
* **14**: a tuple containing various config parameters as cell slices. If a parameter is absent from the config, its value is null.
  * **0**: `StoragePrices` from `ConfigParam 18`. Not the entire dictionary but the specific `StoragePrices` entry corresponding to the current time.
  * **1**: `ConfigParam 19` - global ID.
  * **2**: `ConfigParam 20` - MasterChain gas prices.
  * **3**: `ConfigParam 21` - gas prices.
  * **4**: `ConfigParam 24` - MasterChain forward fees.
  * **5**: `ConfigParam 25` - forward fees.
  * **6**: `ConfigParam 43` - size limits.
* **15**: "[Due payment](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L237)" - current debt for the storage fee in nanotons. `asm` opcode: `DUEPAYMENT`.
* **16**: "Precompiled gas usage" - gas usage for the current contract if precompiled as defined in ConfigParam 45; null otherwise. 
`asm` opcode: `GETPRECOMPILEDGAS`.



The extension of `c7` with unpacked config parameters aims to improve efficiency. Now, this data is retrieved from the global configuration by the transaction executor, making it readily available in the executor's memory. Previously, the smart contract had to fetch each parameter one by one from the configuration dictionary. This method was costly and gas-inefficient, as the cost depended on the number of parameters.

**Due payment field**

The due payment field is crucial for accurately managing storage fees. Here's how it works:
- When a message is sent in the default (bounceable) mode to a smart contract, storage fees are either:
  - **Deducted**, or 
  - **Added** to the `due_payment` field, which stores the storage fee-related debt.
- These adjustments happen **before** the message value is added to the contract's balance.
- If the contract processes the message and sends back excess gas with `mode=64`, the following occurs:
  - If the contract's balance reaches 0, storage fees will accumulate in the `due_payment` field on subsequent transactions instead of being deducted from incoming messages. 
  - This results in the debt silently accumulating until the account is frozen.

The `DUEPAYMENT` opcode allows developers to explicitly account for or withhold storage fees, preventing potential issues.


## New opcodes

### Opcodes for new `c7` values
Each opcode consumes **26 gas**, except for `SENDMSG`, due to cell operations.

|Fift syntax | Stack | Description                                                                                                                             |
|:-|:--------------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| `UNPACKEDCONFIGTUPLE` | _`- c`_             | Retrieves the tuple of config slices from `c7`.                                                                                         |
| `DUEPAYMENT` | _`- i`_             | Retrieves the value of due payment from `c7`.                                                                                           |
| `GLOBALID` | _`- i`_             | Retrieves `ConfigParam 19` from `c7` instead of the configuration dictionary.                                                             |
| `SENDMSG` | _`msg mode - i`_    | Retrieves `ConfigParam 24/25` (message prices) and `ConfigParam 43` (`max_msg_cells`) from `c7` rather than from the config dictionary. |

### Opcodes to process config parameters
 

Introducing the configuration tuple in the TON transaction executor makes parsing fee parameters more cost-effective. However, smart contracts may require updates to interpret new configuration parameter constructors as they are introduced. 

To address this, special opcodes for fee calculation are introduced. These opcodes:
- Retrieve parameters from `c7`. 
- Calculate fees in the same way as the executor.

As new parameter constructors are introduced, these opcodes are updated accordingly. This ensures that smart contracts can rely on these instructions for fee calculation without needing to interpret each new constructor.

Each opcode consumes 26 gas.


| Fift syntax           | Stack                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|:----------------------|:-------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GETGASFEE`           | _`gas_used is_mc - price`_           | Calculates the computation cost in nanotons for a transaction that consumes `gas_used` gas.                                                                                                                                                                                                                                                                                                                                                                |
| `GETSTORAGEFEE`       | _`cells bits seconds is_mc - price`_ | Calculates the storage fees in nanotons for the contract based on current storage prices.`cells` and `bits` represent the size of the [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) with deduplication, including the root cell.                                                                                                                                       |
| `GETFORWARDFEE`       | _`cells bits is_mc - price`_         | Calculates forward fees in nanotons for an outgoing message. `is_mc` is true if the source or the destination is in the MasterChain and false if both are in the basechain. **Note:** `cells` and `bits` in the message should be counted with deduplication and the _root-not-counted_ rules.                                                                                                                                                             |
| `GETPRECOMPILEDGAS`   | _`- null`_                           | Reserved; currently returns null. It returns the cost of contract execution in gas units if the contract is _precompiled_.                                                                                                                                                                                                                                                                                                                                 |
| `GETORIGINALFWDFEE`   | _`fwd_fee is_mc - orig_fwd_fee`_     | Calculates `fwd_fee * 2^16 / first_frac`. It can be used to get the original `fwd_fee` of the message as a replacement for hardcoded values like [this](https://github.com/ton-blockchain/token-contract/blob/21e7844fa6dbed34e0f4c70eb5f0824409640a30/ft/jetton-wallet.fc#L224C17-L224C46) from the `fwd_fee` parsed from an incoming message. `is_mc` is true if the source or destination is in the MasterChain and false if both are in the basechain. |
| `GETGASFEESIMPLE`     | _`gas_used is_mc - price`_           | Calculates the additional computation cost in nanotons for a transaction that consumes additional `gas_used` gas. This is the same as `GETGASFEE`, but without the flat price calculated as `(gas_used * price) / 2^16.`                                                                                                                                                                                                                                   |
| `GETFORWARDFEESIMPLE` | _`cells bits is_mc - price`_         | Calculates the additional forward cost in nanotons for a message containing additional `cells` and `bits`. This is the same as `GETFORWARDFEE`, but without the lump price calculated as `(bits * bit_price + cells * cell_price) / 2^16)`.                                                                                                                                                                                                                |

**Note:** `gas_used`, `cells`, `bits`, and `time_delta` are integers in the range `0..2^63-1`.

### Cell-level operations
These operations work with Merkle proofs, where cells can have a non-zero level and multiple hashes. Each operation consumes 26 gas.

| Fift syntax | Stack | Description                         |
|:-|:-|:------------------------------------|
| `CLEVEL` | _`cell - level`_ | Returns the level of the cell.      |
| `CLEVELMASK` | _`cell - level_mask`_ | Returns the level mask of the cell. |
| `i CHASHI` | _`cell - hash`_ | Returns the `i`-th hash of the cell.      |
| `i CDEPTHI` | _`cell - depth`_ | Returns the `i`-th depth of the cell.     |
| `CHASHIX` | _`cell i - depth`_ | Returns the `i`-th hash of the cell.     |
| `CDEPTHIX` | _`cell i - depth`_ | Returns the `i`-th depth of the cell.    |

The value of `i` is in the range `0..3`.

<Feedback />

