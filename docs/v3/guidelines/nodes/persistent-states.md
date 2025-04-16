# Persistent States
Nodes store snapshots of states of the blockchain periodically. Each state is created at some masterchain block and has some TTL. The block and TTL are chosen using the following algorithm:

Only key blocks can be chosen. A block has some timestamp `ts`. There are periods of time of length `2^17` seconds (approximately up to 1.5 days). The period of a block with timestamp `ts` is `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

TTL of a state from period `x` is equal to `2^(18 + ctz(x))`, where `ctz(x)` is the number of trailing zeroes in the binary representation of `x` (i.e. the largest `y` such that `x` is divisible by `2^y`).

That means that persistent states are created every 1.5 days, half of them have TTL of `2^18` seconds (3 days), half of the remaining states have TTL of `2^19` seconds (6 days) and so on.

In 2025 there is the following long-term (at least 3 months) persistent states:

| Block seqno | Block time | TTL | Expires at |
|--:|--:|--:|--:|
| [8930706](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=8930706) | 2021-01-14 15:08:40 | 12427 days | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=27747086) | 2023-03-02 05:08:11 | 1553 days | 2027-06-02 19:50:19 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=36907647) | 2024-03-24 13:47:57 | 776 days | 2026-05-10 07:09:01 |
| [40821182](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=40821182) | 2024-10-04 18:08:08 | 388 days | 2025-10-28 02:48:40 |
| [43792209](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=43792209) | 2025-01-09 20:18:17 | 194 days | 2025-07-23 00:38:33 |

When the node starts for the first time, it has to download a persistent state. This is implemented in [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Starting from the init block, the node downloads all newer key blocks. It selects the most recent key block with a persistent state which still exists (using the formula above), and then downloads the corresponding masterchain state and states for all shards (or only the shards that are required for this node).
