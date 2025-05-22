import Feedback from '@site/src/components/Feedback';

# TVM upgrade Feb 2025


:::tip
This upgrade is available on the Mainnet.
:::

## c7 Tuple Extension

The `c7` tuple parameter number **13** (previous blocks info tuple) now has a third element, containing IDs of the last 16 masterchain blocks with seqno divisible by 100.

Example: if the last masterchain block seqno is `19071`, the list contains block IDs with seqnos `19000, 18900, ..., 17500`.


## New TVM Instructions - Cryptographic and Continuation Operations

| Fift syntax                        | Stack                         | Description                                                                                                                                                                                                           |
| :--------------------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SECP256K1_XONLY_PUBKEY_TWEAK_ADD` | *`key tweak - 0 or f x y -1`* | Performs `secp256k1_xonly_pubkey_tweak_add`. Inputs are two 256-bit unsigned integers (`key`, `tweak`). Returns a 65-byte public key as `uint8 f`, `uint256 x`, `uint256 y` (similar to `ECRECOVER`). Gas cost: 1276. |
| `mask SETCONTCTRMANY`              | *`cont - cont'`*              | For each bit set in `mask` (range 0..255), applies `c[i] PUSHCTR SWAP c[i] SETCONTCNR` to the continuation. Efficiently updates multiple continuations.                                                               |
| `SETCONTCTRMANYX`                  | *`cont mask - cont'`*         | Same as `SETCONTCTRMANY`, but reads `mask` from the stack.                                                                                                                                                            |
| `PREVMCBLOCKS_100`                 | *`- list`*                    | Returns the new third element in `c7[13]`: a list of 16 recent masterchain block IDs (where seqno is divisible by 100).                                                                                               |

## Execution and Gas Logic Improvements

* When the `RAWRESERVE` action uses flag 4, the original balance is calculated as `balance - msg_balance_remaining`.
* The gas cost for continuation jumps deeper than 8 levels is increased by one additional gas unit per extra level.
* Jumps to continuations with non-null control data now execute without error.
* The `RESERVE` action in mode +2 supports reserving extra currencies in addition to TON.
* Executing contract code from a library cell does not consume additional gas.
* Accounts with previously locked highload-v2 wallets are assigned higher gas limits to enable unlocking and improved operation.

## Error Handling Improvements

If these instructions encounter multiple error conditions, the TVM prioritizes `stk_und` (stack underflow) over other errors.

| Fift syntax           | Stack                                | Description                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GETGASFEE`           | *`gas_used is_mc - price`*           | Calculates the computation cost in nanotons for a transaction that consumes `gas_used` gas.                                                                                                                                                                                                                           |
| `GETSTORAGEFEE`       | *`cells bits seconds is_mc - price`* | Calculates the storage fees in nanotons for the contract based on current storage prices. `cells` and `bits` represent the size of the [`AccountState`](https://github.com/ton-blockchain/ton/blob/8a9ff339927b22b72819c5125428b70c406da631/crypto/block/block.tlb#L247) with deduplication, including the root cell. |
| `GETFORWARDFEE`       | *`cells bits is_mc - price`*         | Calculates forward fees in nanotons for an outgoing message. `is_mc` is true if the source or the destination is in the MasterChain and false if both are in the basechain.                                                                                                                                           |
| `GETORIGINALFWDFEE`   | *`fwd_fee is_mc - orig_fwd_fee`*     | Calculates `fwd_fee * 2^16 / first_frac`. Used to derive the original forwarding fee.                                                                                                                                                                                                                                 |
| `GETGASFEESIMPLE`     | *`gas_used is_mc - price`*           | Computes simplified gas cost using `(gas_used * price) / 2^16`.                                                                                                                                                                                                                                                       |
| `GETFORWARDFEESIMPLE` | *`cells bits is_mc - price`*         | Computes simplified forwarding fee using `(bits * bit_price + cells * cell_price) / 2^16`.                                                                                                                                                                                                                            |
| `HASHEXT`             | *`cell i - hash`*                    | Computes an extended hash of a cell at the given index.                                                                                                                                                                                                                                                               |
| `PFXDICTSET`          | *`x k D n – D0 −1 or D 0`*           | Sets a value in a prefix code dictionary. Fails if prefix constraints are violated.                                                                                                                                                                                                                                   |
| `PFXDICTREPLACE`      | *`x k D n – D0 −1 or D 0`*           | Replaces a value in a prefix code dictionary if constraints are satisfied.                                                                                                                                                                                                                                            |
| `PFXDICTADD`          | *`x k D n – D0 −1 or D 0`*           | Adds an entry to a prefix code dictionary. Fails if entry already exists.                                                                                                                                                                                                                                             |
| `PFXDICTDEL`          | *`k D n – D0 −1 or D 0`*             | Deletes an entry from a prefix code dictionary.                                                                                                                                                                                                                                                                     
## Emulator and Validator Improvements

Validator nodes now perform more reliable IP discovery by retrying DHT queries, making it easier to locate updated peers during upgrades or restarts. The validator console also displays dashed names and shard formats in a more readable format, helping operators better monitor network activity.

In the emulator, handling of library cells and extra currency operations has been improved to provide more accurate behavior during local testing. Support for extra currencies has been refined across both `rungetmethod` and reserve modes, ensuring compatibility for contracts that rely on multi-currency interactions.

## TL-B Schema Fixes

* Corrected CRC computations ensuring accurate validation of TL-B schema data.
* Fixed incorrect tags in Merkle proofs, improving proof reliability.
* Improved handling of `advance_ext` for better spec alignment.
* Fixed `NatWidth` print function to properly display natural width representations.

<Feedback />
