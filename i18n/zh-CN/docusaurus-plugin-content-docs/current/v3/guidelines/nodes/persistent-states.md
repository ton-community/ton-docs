import Feedback from '@site/src/components/Feedback';

# Persistent states

Nodes periodically store snapshots of the blockchain's states. Each state is created at a specific MasterChain block and has a defined time-to-live (TTL). The selection of the block and TTL follows this algorithm:

Only key blocks can be selected. A block has a timestamp marked as `ts`. Time is divided into periods of length `2^17` seconds (approximately 1.5 days). For a given block with timestamp `ts`, we calculate the period as `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

The TTL of a state from period `x` is calculated as `2^(18 + ctz(x))`, where `ctz(x)` represents the number of trailing zeros in the binary representation of `x` (i.e., the largest integer `y` such that `x` is divisible by `2^y`).

This means that persistent states are created every 1.5 days. Half of these states have a TTL of `2^18` seconds (3 days), while half of the remaining states have a TTL of `2^19` seconds (6 days), and so forth.

In 2025, there will be several long-term persistent states, each lasting at least 3 months:

|                                                                                                        Block seqno |                                                区块时间 |  TTL |                                          Expires at |
| -----------------------------------------------------------------------------------------------------------------: | --------------------------------------------------: | ---: | --------------------------------------------------: |
|   [8930706](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=8930706) | 2022-02-07 01:31:53 | 777天 | 2024-03-24 18:52:57 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=27747086) | 2022-03-27 14:36:58 |  97天 | 2022-07-02 16:47:06 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=36907647) | 2022-10-07 11:00:00 |  97天 | 2023-01-12 12:00:00 |
|     [40821182](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=40821182) | 2022-11-24 23:00:00 | 194天 | 2025-10-28 02:48:40 |
|     [43792209](https://explorer.toncoin.org/search?workchain=-1&shard=8000000000000000&seqno=43792209) | 2025-01-09 20:18:17 |  97天 | 2025-07-23 00:38:33 |

When the node starts for the first time, it must download a persistent state. This process is implemented in the file [validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp).

Beginning with the initialization block, the node downloads all newer key blocks. It selects the most recent key block that has a persistent state still available (using the formula mentioned above) and subsequently downloads the corresponding MasterChain state, along with the states for all shards or only those shards that are necessary for this node.

<Feedback />

