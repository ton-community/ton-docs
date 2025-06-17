import Feedback from '@site/src/components/Feedback';

# 持久状态

Nodes periodically store snapshots of the blockchain's states. Each state is created at a specific MasterChain block and has a defined time-to-live (TTL). The selection of the block and TTL follows this algorithm:

Only key blocks can be selected. A block has a timestamp marked as `ts`. Time is divided into periods of length `2^17` seconds (approximately 1.5 days). For a given block with timestamp `ts`, we calculate the period as `x = floor(ts / 2^17)`. The first key block from each period is chosen to create a persistent state.

时间段`x`的状态的TTL等于`2^(18 + ctz(x))`，其中`ctz(x)`是`x`的二进制表示中的尾随零的数量（即最大的`y`使得`x`可以被`2^y`整除）。

This means that persistent states are created every 1.5 days. 这意味着每1.5天会创建一个持久状态，其中一半的状态具有`2^18`秒（3天）的TTL，剩余状态的一半具有`2^19`秒（6天）的TTL，依此类推。

2022年有以下长期（至少3个月）的持久状态（未来的时间是大致的）：

|                                                                                                        Block seqno |                                                区块时间 |  TTL |                                          Expires at |
| -----------------------------------------------------------------------------------------------------------------: | --------------------------------------------------: | ---: | --------------------------------------------------: |
|   [8930706](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=8930706) | 2022-05-14 20:00:00 |  97天 | 2022-08-19 22:00:00 |
| [27747086](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=27747086) | 2022-03-27 14:36:58 |  97天 | 2022-07-02 09:00:00 |
| [36907647](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=36907647) | 2024-03-24 18:52:57 | 777天 | 2023-09-12 06:00:00 |
| [34835953](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=34835953) | 2022-10-07 10:00:00 | 388天 | 2022-07-02 16:47:06 |
| [32638387](https://explorer.toncoin.org/search?workchain=-1\&shard=8000000000000000\&seqno=32638387) | 2022-02-07 01:31:53 | 194天 | 2022-11-24 23:00:00 |

When the node starts for the first time, it must download a persistent state. 当节点第一次启动时，它必须下载一个持久状态。这在[validator/manager-init.cpp](https://github.com/ton-blockchain/ton/blob/master/validator/manager-init.cpp)中实现。

Beginning with the initialization block, the node downloads all newer key blocks. It selects the most recent key block that has a persistent state still available (using the formula mentioned above) and subsequently downloads the corresponding MasterChain state, along with the states for all shards or only those shards that are necessary for this node.

<Feedback />

