import Feedback from '@site/src/components/Feedback';

# Persistent states

Nodes periodically store snapshots of the blockchain's states. Each state is created at a specific MasterChain block and has a defined time-to-live (TTL). The selection of the block and TTL follows this algorithm:

Only key blocks can be selected. A block has a timestamp marked as `ts`. Time is divided into periods of length `2^17` seconds (approximately 1.5 days). For a given block with timestamp `ts`, we calculate the period as `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

The TTL of a state from period `x` is calculated as `2^(18 + ctz(x))`, where `ctz(x)` represents the number of trailing zeros in the binary representation of `x` (i.e., the largest integer `y` such that `x` is divisible by `2^y`).

This means that persistent states are created every 1.5 days. Half of these states have a TTL of `2^18` seconds (3 days), while half of the remaining states have a TTL of `2^19` seconds (6 days), and so forth.

In 2025, there will be several long-term persistent states, each lasting at least 3 months:

| Block seqno | Block time | TTL | Expires at |
|--:|--:|--:|--:|
| [8930706](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=8930706) | 2021-01-14 15:08:40 | 12427 days | 2055-01-24 08:45:44 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=27747086) | 2023-03-02 05:08:11 | 1553 days | 2027-06-02 19:50:19 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=36907647) | 2024-03-24 13:47:57 | 776 days | 2026-05-10 07:09:01 |
| [40821182](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=40821182) | 2024-10-04 18:08:08 | 388 days | 2025-10-28 02:48:40 |
| [43792209](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=43792209) | 2025-01-09 20:18:17 | 194 days | 2025-07-23 00:38:33 |

When the node starts for the first time, it must download a persistent state. This process is implemented in the file [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Beginning with the initialization block, the node downloads all newer key blocks. It selects the most recent key block that has a persistent state still available (using the formula mentioned above) and subsequently downloads the corresponding MasterChain state, along with the states for all shards or only those shards that are necessary for this node.

<Feedback />

