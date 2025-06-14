import Feedback from '@site/src/components/Feedback';

# Accelerator update

:::caution 개발 중
This feature is currently available only on the Testnet! Participate at your own risk.
:::

The key feature of the TON Blockchain is the ability to distribute transaction processing over network nodes, switching from **everybody checks all transactions** to **every transaction is checked by a secure validator subset**. This ability to infinitely horizontally scale throughput over shards when one work chain splits to the required number of shard chains distinguishes TON from other L1 networks.

However, it is necessary to rotate validator subsets regularly, which process one or another shard, to prevent collusion. At the same time, to process transactions, validators obviously should know the state of the shard prior to the transaction. The simplest approach is to require all validators to know the state of all shards.

This approach works well when the number of TON users is within the range of a few million and TPS (transactions per second) is under a hundred. However, in the future, when TON Blockchain processes many thousands of transactions per second for hundreds of millions or billions of people, no single server will be able to keep the actual state of the whole network. Fortunately, TON was designed with such loads in mind and supports sharding both throughput and state updates.

# Accelerator

**Accelerator** is an upcoming update designed to improve blockchain scalability. Its main features are:

- **Partial nodes**: A node will be able to monitor specific shards of the blockchain instead of the entire set of shards.

- **Liteserver infrastructure**: Liteserver operators will be able to configure each LS to monitor a set of shards, and lite-clients will select a suitable LS for each request.

- **Collator/validator separation**: Validators will only monitor MasterChain, significantly reducing their load.

Validator will use new **collator nodes** to collate new shard blocks.

The accelerator update is currently partially implemented in Testnet.

Testnet nodes can be configured to monitor a subset of shards, and lite clients can be set up to such partial liteservers.

Collator-validator separation has not yet been deployed in Testnet. However, you can test some parts of it by launching your own collator nodes.

# Partial nodes

Previously, each TON node was required to download all shards of the TON blockchain, which limited scalability.

To address this issue, the main feature of the update allows nodes to monitor only a subset of shards.

A node **monitors** a shard by maintaining its **shard state** and downloading all new blocks within that shard. Notably, each node always monitors the MasterChain.

The BaseChain includes a parameter called `monitor_min_split` in `ConfigParam 12`, which is set to `2` in the Testnet. This parameter divides the BaseChain into `2^monitor_min_split = 4` groups of shards:

- Shards with the prefix `0:2000000000000000`
- Shards with the prefix `0:6000000000000000`
- Shards with the prefix `0:a000000000000000`
- Shards with the prefix `0:e000000000000000`

Nodes can only monitor an entire group of shards at once. For instance, a node can choose to monitor all shards with the prefix `0:2000000000000000` but cannot selectively monitor just `0:1000000000000000` without also including `0:3000000000000000`.

It is guaranteed that shards from different groups will not merge. This guarantees that a monitored shard will not unexpectedly merge with a non-monitored shard.

## Node configuration

To update your node to the latest commit of the `testnet` branch, follow these instructions:

- By default, a node monitors all shards. You can disable this behavior by adding the `-M` flag to the `validator-engine`.

- When you use the `-M` flag, the node will only monitor the MasterChain. If you want to monitor specific BaseChain shards, use the `--add-shard <wc:shard>` flag. For example:

  ```
  validator-engine ... -M --add-shard 0:2000000000000000 --add-shard 0:e000000000000000
  ```

- These flags will configure the node to monitor all shards with the prefixes `0:2000000000000000` and `0:e000000000000000`. You can either add these flags to an existing node or launch a new node with them included.

#### Notes:

1. **DO NOT** add these flags to a node that is participating in validation. Currently, validators are required to monitor all shards; this will be improved in future updates so that they only monitor the MasterChain.

2. If you use the `-M` flag, the node will begin downloading any missing shards, which may take some time. This is also true if you add new shards later using the `--add-shard` flag.

3. The command `--add-shard 0:0800000000000000` will add the entire shard group associated with the prefix `0:2000000000000000` due to the `monitor_min_split` configuration.

### Low-level configuration

`--add-shard` flag is a shorthand for certain validator console commands.
A node stores a list of shards to monitor in the config (see file `db/config.json`, section `shards_to_monitor`).
This list can be modified using `validator-engine-console`:

```
add-shard <wc>:<shard>
del-shard <wc>:<shard>
```

The `--add-shard X` flag is equivalent to the `add-shard X` command.

## Lite client configuration

If you have multiple liteservers, each configured to monitor certain shards, you can list them in the `liteservers_v2` section of the global config.

See the example:

```json
{
  "liteservers_v2": [
    {
      "ip": 123456789, "port": 10001,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 2305843009213693952 },
            { "workchain": 0, "shard": -6917529027641081856 }
          ]
        }
      ]
    },
    {
      "ip": 987654321, "port": 10002,
      "id": { "@type": "pub.ed25519", "key": "..." },
      "slices": [
        {
          "@type": "liteserver.descV2.sliceSimple",
          "shards": [
            { "workchain": 0, "shard": 6917529027641081856 },
            { "workchain": 0, "shard": -2305843009213693952 }
          ]
        }
      ]
    }
  ],
  "validator": "...",
  "dht": "..."
}
```

This config includes two liteservers:

- The first one monitors shards with prefixes `0:2000000000000000` and `0:a000000000000000`.
- The second one monitors shards with prefixes `0:6000000000000000` and `0:e000000000000000`.

Both liteservers monitor MasterChain, so it is not necessary to include MasterChain explicitly in the configuration.

#### Note:

- To obtain the value for `"shard": 6917529027641081856`, convert the shard ID in hexadecimal (`6000000000000000`) to decimal within the range of `[-2^63, 2^63)`.

- Both `lite-client` and `tonlib` support this new global configuration format. Clients select the appropriate liteserver for each request based on its shard.

## Proxy liteserver

**Proxy Liteserver** is a server designed to accept standard liteserver queries and forward them to other liteservers.

Its main purpose is to create a single liteserver that functions as a liteserver (LS) for all shards while distributing incoming queries to the appropriate child liteservers behind the scenes. This setup eliminates the need for clients to maintain multiple TCP connections for different shards and enables older clients to interact with sharded liteservers through the proxy.

**Usage:**

```
proxy-liteserver -p <tcp-port> -C global-config.json --db db-dir/ --logname ls.log
```

List all child liteservers in the global config. These can be partial liteservers, as shown in the example above.

To use the proxy liteserver in clients, create a new global config with this proxy in `liteservers` section. See `db-dir/config.json`:

```json
{
   "@type" : "proxyLiteserver.config",
   "port" : 10005,
   "id" : {
      "@type" : "pub.ed25519",
      "key" : "..."
   }
}
```

This file contains the port and public key for the proxy liteserver. You can copy these details to the new global configuration.

The key is generated upon the first launch and remains unchanged after any restarts.

If you need to use an existing private key, place the private key file in `db-dir/keyring/<key-hash-hex>` and launch `proxy-liteserver` with the `--adnl-id <key-hash-hex>` flag.

# Collator/validator separation

Currently, Testnet and Mainnet validators function as follows:

- All validators monitor all shards.

- For each shard, a **validator group** is randomly selected to generate and validate new blocks.

- Within this validator group, validators **collate** (generate) new block candidates one by one, while other validators **validate** and sign them.

Changes introduced in the accelerator update are as follows:

- Validators will monitor only the MasterChain, significantly reducing their workload (this feature is not yet enabled in Testnet).

- The process for selecting validator groups and signing blocks remains unchanged.

- MasterChain validators will continue to collate and validate blocks as before.

- The collation of a shard block requires monitoring the shard. To address this, a new type of node called **collator node** is introduced. Shard validators will send requests to collator nodes to generate block candidates.

- Validators will still validate blocks themselves. Collators will attach **collated data** (proof of shard state) to blocks, allowing for validation without the need to monitor the shard.

In the current `testnet` branch, validators must still monitor all shards. However, you can experiment with launching collator nodes and configuring your validators to collate through them.

## Launching a collator node

Firstly, update your node to the [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

To configure a collator node, use the following commands in the `validator-engine-console`:

```
new-key
add-adnl <key-id-hex> 0
add-collator <key-id-hex> <wc>:<shard>
```

The `new-key` and `add-adnl` commands create a new ADNL address, while `add-collator` starts a collator node for the specified shard using this ADNL address.

A collator for shard `X` can create blocks for all shards that are either ancestors or descendants of `X`. However, collator nodes cannot create blocks for the MasterChain; they are limited to the BaseChain.

In a simple scenario, you can use a node that monitors all shards and launch a collator for all of them by running: `add-collator <key-id-hex> 0:8000000000000000`.

Alternatively, you can launch a partial node that monitors and collates only a subset of shards. For example, to launch a node with flags `-M --add-shard 0:2000000000000000`, you would start the collator with the command `add-collator <key-id-hex> 0:2000000000000000`. This collator will generate blocks in the designated group of shards.

#### Notes:

- A collator node generates blocks automatically, even without requests from validators.

- A collator node configured to generate blocks for a specific shard does not need to monitor other shards. However, it does require access to outbound message queues from neighboring shard states for collation. This is accomplished by downloading these message queues from other nodes that monitor the relevant shards.

## Configuring a validator

Update your validator to [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

By default, validators collate all blocks themselves. To use collator nodes, create a **collators list** and provide it to the validator using `validator-engine-console`:

- `set-collators-list <filename>` installs a new list of collators.
- `clear-collators-list` resets the validator to the default behavior.
- `show-collators-list` displays the current list.

The **collators list** is a JSON file. It contains a list of collator node ADNL ids for each shard.

### Example 1: collators for all shards

```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": -9223372036854775808 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" },
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    }
  ]
}
```

This list contains two collators that can generate blocks in all shards in BaseChain (`shard_id` is `0:8000000000000000`).

When the validator needs to generate a shard block, it randomly selects one of the collators to send the request.

`"self_collate": true` means that if all collators are offline then the validator will collate the block on its own. It is recommended to use this option for testing, since validators are still able to generate shard blocks.

### Example 2: partial collators

```json
{
  "shards": [
    {
      "shard_id": { "workchain": 0, "shard": 4611686018427387904 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "jKT47N1RExRD81OzeHcH1F194oxHyHv76Im71dOuQJ0=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -6917529027641081856 },
      "self_collate": true,
      "select_mode": "random",
      "collators": [
        { "adnl_id": "H39D7XTXOER9U1r/CEunpVbdmd7aNrcX0jOd8j7pItA=" }
      ]
    },
    {
      "shard_id": { "workchain": 0, "shard": -2305843009213693952 },
      "self_collate": true,
      "select_mode": "random",
      "collators": []
    }
  ]
}
```

This list has one collator for prefix `0:4000000000000000`, one collator for prefix `0:a000000000000000` and no collators for `0:e000000000000000`. `self_collate` is `true`, so the validator will collate on its own if no collators for the shard are online.

### Formal protocol for selecting the collator

The **collators list** contains a list `shards`. Each entry has the following parameters: `shard_id`, `select_mode`, `self_collate`, `collators`.

To generate a block in shard `X`, the validator does the following:

- If `X` is MasterChain then the validator generates the block itself.
- Take the first entry from `shards` where `shard_id` intersects with `X`.
- Validator periodically pings collators from the list to determine which ones are online and ready to respond.
- Choose an online collator from the `collators` list. `select_mode` determines the selection method:
  - `random`: random online collator.
  - `ordered`: the first from the list (skipping offline collators).
  - `round_robin`: select collators sequentially (skipping offline collators).
- Send a request to the selected collator.
- If all collators are offline and `self_collate` is `true` then the validator generates the block itself.

### Collation manager stats

Command `collation-manager-stats` in `validator-engine-console` displays the status of collators: which collators are currently used and which are online.

## Collator whitelist

By default, the collator node accepts requests from any validator.

You can enable whitelist to allow requests only from certain validators using `validator-engine-console`:

- `collator-whitelist-enable 1` enables the whitelist.
- `collator-whitelist-enable 0` disables the whitelist.
- `collator-whitelist-add <validator-adnl-id-hex>` adds a validator to the whitelist.
- `collator-whitelist-del <validator-adnl-id-hex>` removes a validator from the whitelist.

# 전체 콜레이트된 데이터

기본적으로 검증자 세트에서 새 블록을 제안하는 검증자는 "블록 이전" 상태를 증명하는 데이터를 첨부하지 않습니다. 이 데이터는 다른 검증자가 로컬에 저장된 상태에서 얻어야 합니다. 이러한 방식으로 구(마스터 브랜치의) 노드와 새 노드가 합의에 도달할 수 있지만, 새 검증자는 모든 네트워크 상태를 감시해야 합니다.

Once [ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49) capabilities in network configuration parameter 8 will be enabled `collated_data` will be included into blocks and validators will be able to get rid of monitoring anything except masterchain: incoming data will be enough to fully check correctness of the block.

# 다음 단계

Developers are planning to implement the following features:

- Add comprehensive and user-friendly support for validation using collators in MyTonCtrl.

- Optimize the size of `collated_data`: Although it currently functions well for most blocks, some transactions can lead to excessive data usage.

- Enable broadcasting of `collated_data`.

- Provide support in MyTonCtrl for automatic payments for collation to establish a market for collation and enhance its durability.

<Feedback />

