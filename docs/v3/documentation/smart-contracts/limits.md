# TON blockchain limits

This document contains the current limits and metrics used in the TON blockchain.

:::info
You can check all the blockchain parameters live in the explorer:[Tonviewer](https://tonviewer.com/config) or [Tonscan](https://tonscan.org/config).

Parameters defined in the code can be found in the [source code repository](https://github.com/ton-blockchain/ton).
:::

## Message and transaction limits

<!-- &nbsp; represents a non-breaking space in HTML -->

| Name                       | Description                                              | Value    | Type   | Defined&nbsp;in |
| -------------------------- | -------------------------------------------------------- | -------- | ------ | --------------- |
| `max_size`                 | Maximum external message size in bytes                   | 65535    | uint32 | mc-config.h     |
| `max_depth`                | Maximum external message depth                           | 512      | uint16 | mc-config.h     |
| `max_msg_bits`             | Maximum message size in bits                             | 2097152  | uint32 | mc-config.h     |
| `max_msg_cells`            | Maximum number of cells a message can occupy             | 8192     | uint32 | mc-config.h     |
| `max_vm_data_depth`        | Maximum cell depth in messages and c4 & c5 registers     | 512      | uint16 | mc-config.h     |
| `max_actions`              | Maximum amount of actions                                | 256      | uint32 | transaction.h   |
| `max_library_cells`        | Maximum number of library cells in library               | 1000     | uint32 | mc-config.h     |
| `max_acc_state_cells`      | Maximum number of cells that an account state can occupy | 65536    | uint32 | mc-config.h     |
| `max_acc_state_bits`       | Maximum account state size in bits                       | 67043328 | uint32 | cells x size    |
| `max_acc_public_libraries` | Maximum amount of public libraries for account           | 256      | uint32 | mc-config.h     |

## Gas and fee parameters

| Name                | Description                                                         | Value    | Type       | Defined&nbsp;in |
| ------------------- | ------------------------------------------------------------------- | -------- | ---------- | --------------- |
| `free_stack_depth`  | Stack depth without gas consumption                                 | 32       | enum_value | vm.h            |
| `runvm_gas_price`   | VM start gas consumption                                            | 40       | enum_value | vm.h            |
| `flat_gas_limit`    | Gas below `flat_gas_limit` is provided at price of `flat_gas_price` | 100      | uint64     | config21        |
| `flat_gas_price`    | Costs of launching the TON Virtual Machine                          | 40000    | uint64     | config21        |
| `gas_price`         | Price of gas in the network in nanotons per 65536 gas units         | 26214400 | uint64     | config21        |
| `special_gas_limit` | Limit on gas for special (system) contract transactions             | 1000000  | uint64     | config21        |
| `gas_limit`         | Maximum amount of gas per transaction                               | 1000000  | uint64     | config21        |
| `gas_credit`        | Gas credit for checking external messages                           | 10000    | uint64     | config21        |
| `block_gas_limit`   | Maximum gas per block                                               | 10000000 | uint64     | config21        |

## Storage fees and limits

| Name               | Description                                  | Value      | Type   | Defined&nbsp;in |
| ------------------ | -------------------------------------------- | ---------- | ------ | --------------- |
| `freeze_due_limit` | Storage fees (nanoTON) for contract freezing | 100000000  | uint64 | config21        |
| `delete_due_limit` | Storage fees (nanoTON) for contract deletion | 1000000000 | uint64 | config21        |
| `bit_price_ps`     | Storage price for one bit for 65536 seconds  | 1          | uint64 | config18        |
| `cell_price_ps`    | Storage price for one cell for 65536 seconds | 500        | uint64 | config18        |

## Block size limits

| Name                  | Description                                  | Value    | Type   | Defined&nbsp;in |
| --------------------- | -------------------------------------------- | -------- | ------ | --------------- |
| `bytes_underload`     | Block size limit for underload state         | 131072   | uint32 | config23        |
| `bytes_soft_limit`    | Block size soft limit                        | 524288   | uint32 | config23        |
| `bytes_hard_limit`    | Absolute maximum block size in bytes         | 1048576  | uint32 | config23        |
| `gas_underload`       | Block gas limit for underload state          | 2000000  | uint32 | config23        |
| `gas_soft_limit`      | Block gas soft limit                         | 10000000 | uint32 | config23        |
| `gas_hard_limit`      | Absolute maximum block gas                   | 20000000 | uint32 | config23        |
| `lt_delta_underload`  | Logical time delta limit for underload state | 1000     | uint32 | config23        |
| `lt_delta_soft_limit` | Logical time delta soft limit                | 5000     | uint32 | config23        |
| `lt_delta_hard_limit` | Absolute maximum logical time delta          | 10000    | uint32 | config23        |

## Message forwarding costs

| Name         | Description                                          | Value      | Type   | Defined&nbsp;in |
| ------------ | ---------------------------------------------------- | ---------- | ------ | --------------- |
| `lump_price` | Base price for message forwarding                    | 400000     | uint64 | config25        |
| `bit_price`  | Cost per 65536 bit of message forwarding             | 26214400   | uint64 | config25        |
| `cell_price` | Cost per 65536 cells of message forwarding           | 2621440000 | uint64 | config25        |
| `ihr_factor` | Factor for immediate hypercube routing cost          | 98304      | uint32 | config25        |
| `first_frac` | Fraction for first transition in message route       | 21845      | uint32 | config25        |
| `next_frac`  | Fraction for subsequent transitions in message route | 21845      | uint32 | config25        |

## MasterChain specific parameters

| Name                     | Description                                     | Value       | Type   | Defined&nbsp;in |
| ------------------------ | ----------------------------------------------- | ----------- | ------ | --------------- |
| `mc_bit_price_ps`        | Storage price for one bit for 65536 seconds     | 1000        | uint64 | config18        |
| `mc_cell_price_ps`       | Storage price for one cell for 65536 seconds    | 500000      | uint64 | config18        |
| `mc_flat_gas_limit`      | Gas below `flat_gas_limit` on MasterChain       | 100         | uint64 | config20        |
| `mc_flat_gas_price`      | VM launch cost on MasterChain                   | 1000000     | uint64 | config20        |
| `mc_gas_price`           | Gas price on MasterChain                        | 655360000   | uint64 | config20        |
| `mc_special_gas_limit`   | Special contract gas limit on MasterChain       | 70000000    | uint64 | config20        |
| `mc_gas_limit`           | Maximum gas per transaction on MasterChain      | 1000000     | uint64 | config20        |
| `mc_gas_credit`          | Gas credit for checking external messages       | 10000       | uint64 | config20        |
| `mc_block_gas_limit`     | Maximum gas per MasterChain block               | 2500000     | uint64 | config20        |
| `mc_freeze_due_limit`    | Storage fees for contract freezing              | 100000000   | uint64 | config20        |
| `mc_delete_due_limit`    | Storage fees for contract deletion              | 1000000000  | uint64 | config20        |
| `mc_bytes_underload`     | Block size limit for underload state            | 131072      | uint32 | config22        |
| `mc_bytes_soft_limit`    | Block size soft limit                           | 524288      | uint32 | config22        |
| `mc_bytes_hard_limit`    | Absolute maximum block size in bytes            | 1048576     | uint32 | config22        |
| `mc_gas_underload`       | Block gas limit for underload state             | 200000      | uint32 | config22        |
| `mc_gas_soft_limit`      | Block gas soft limit                            | 1000000     | uint32 | config22        |
| `mc_gas_hard_limit`      | Absolute maximum block gas                      | 2500000     | uint32 | config22        |
| `mc_lump_price`          | Base price for message forwarding               | 10000000    | uint64 | config24        |
| `mc_bit_price`           | Cost per 65536 bit of message forwarding        | 655360000   | uint64 | config24        |
| `mc_cell_price`          | Cost per 65536 cells of message forwarding      | 65536000000 | uint64 | config24        |
| `mc_ihr_factor`          | Factor for immediate hypercube routing cost     | 98304       | uint32 | config24        |
| `mc_first_frac`          | Fraction for first transition in message route  | 21845       | uint32 | config24        |
| `mc_next_frac`           | Fraction for subsequent transitions in route    | 21845       | uint32 | config24        |
| `mc_lt_delta_underload`  | Logical time delta limit for underload state    | 1000        | uint32 | config22        |
| `mc_lt_delta_soft_limit` | Logical time delta soft limit                   | 5000        | uint32 | config22        |
| `mc_lt_delta_hard_limit` | Absolute maximum logical time delta             | 10000       | uint32 | config22        |
| `mc_catchain_lifetime`   | MasterChain catchain groups lifetime in seconds | 250         | uint32 | config28        |

## Validator parameters

| Name                        | Description                                         | Value      | Type   | Defined&nbsp;in |
| --------------------------- | --------------------------------------------------- | ---------- | ------ | --------------- |
| `shard_catchain_lifetime`   | ShardChain catchain groups lifetime in seconds      | 250        | uint32 | config28        |
| `shard_validators_lifetime` | ShardChain validators group lifetime in seconds     | 1000       | uint32 | config28        |
| `shard_validators_num`      | Number of validators in ShardChain validation group | 23         | uint32 | config28        |
| `masterchain_block_fee`     | Reward for block creation                           | 1700000000 | Grams  | config14        |
| `basechain_block_fee`       | BaseChain block fee                                 | 1000000000 | Grams  | config14        |

## Time parameters

| Name          | Description                                  | Value | Type     | Defined&nbsp;in |
| ------------- | -------------------------------------------- | ----- | -------- | --------------- |
| `utime_since` | Initial Unix timestamp for price application | 0     | UnixTime | config18        |
