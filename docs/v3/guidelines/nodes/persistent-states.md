# Persistent States
Nodes store snapshots of states of the blockchain periodically. Each state is created at some masterchain block and has some TTL. The block and TTL are chosen using the following algorithm:

Only key blocks can be chosen. A block has some timestamp `ts`. There are periods of time of length `2^17` seconds (approximately up to 1.5 days). The period of a block with timestamp `ts` is `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

TTL of a state from period `x` is equal to `2^(18 + ctz(x))`, where `ctz(x)` is the number of trailing zeroes in the binary representation of `x` (i.e. the largest `y` such that `x` is divisible by `2^y`).

That means that persistent states are created every 1.5 days, half of them have TTL of `2^18` seconds (3 days), half of the remaining states have TTL of `2^19` seconds (6 days) and so on.

In 2024 there is the following long-term (at least 3 months) persistent states:

| Block seqno | Block time | TTL | Expires at |
|--:|--:|--:|--:|
| [8930706](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=8930706) | 2021-01-14 15:08:40 | 12427 days | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=27747086) | 2023-03-02 05:08:11 | 1553 days | 2027-06-02 19:50:19 |
| [32638387](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=32638387) | 2023-09-12 09:27:36 | 388 days | 2024-10-04 18:08:08 |
| [34835953](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=34835953) | 2023-12-18 11:37:48 | 194 days | 2024-06-29 15:58:04 |
| [35893070](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=35893070) | 2024-02-05 00:42:50 | 97 days | 2024-05-12 02:52:58 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=36907647) | 2024-03-24 13:47:57 | 776 days | 2026-05-10 07:09:01 |

When the node starts for the first time, it has to download a persistent state. This is implemented in [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Starting from the init block, the node downloads all newer key blocks. It selects the most recent key block with a persistent state which still exists (using the formula above), and then downloads the corresponding masterchain state and states for all shards (or only the shards that are required for this node).
