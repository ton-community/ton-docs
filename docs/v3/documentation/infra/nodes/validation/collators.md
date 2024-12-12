# Accelerator update

:::caution in development
This feature is testnet only right now! Participate on your own risk.
:::

The key feature of TON blockchain is the ability to distribute transaction processing over network nodes, and switching from "everybody checks all transactions" to "every transaction is checked by secure validator subset". This ability to infinitely horizontally scale throughput over shards when one workchain splits to required number of *shardchains* distinguishes TON from other L1 networks.

However it is necessary to regularly rotate validator subsets which process one or another shard to prevent collusion. At the same time to process transactions validators obviously should know state of the shard prior transaction. The simplest approach is to require all validators to know state of all shards.

This approach works well while number of TON users is within range of a few millions and TPS (transactions per second) is under hundred. However, in the future, when TON will process many thousands transactions per second for hundred millions or billions of people, no single server would be able to keep actual state of whole network. Fortunately, TON was designed with such loads in mind and supports sharding both throughput and state update.

# Accelerator
**Accelerator** is an upcoming update designed to improve blockchain scalability. Its main features are:
* **Partial nodes**: a node will be able to monitor specific shards of the blockchain instead of the entire set of shards.
* **Liteserver infrastructure**: liteserver operators will be able to configure each LS to monitor a set of shards, 
and liteclients will select a suitable LS for each request.
* **Collator-validator separation**: validators will only monitor masterchain, significantly reducing their load.
Validator will use new **collator nodes** to collate new shard blocks.

The accelerator update is currently partially implemented in testnet.
Testnet nodes can be configured to monitor a subset of shards, and liteclients can be set up to such partial liteservers.

Collator-validator separation is not yet deployed in testnet. However, it is possible to test some parts of it by launching your own collator nodes.

# Partial nodes
Previously, each TON node had to download all shards of the blockchain, which limited scalability.
That's why the primary feature of the update is enabling nodes to monitor only a subset of shards.

A node **monitors** a shard if it keeps its **shard state** and downloads all new blocks in the shard.

Each node always monitors masterchain.

Basechain has a parameter `monitor_min_split` in `ConfigParam 12`, which is set to `2` in testnet.
It divides basechain is divided into `2^monitor_min_split=4` groups of shards:
* Shards with prefix `0:2000000000000000`
* Shards with prefix `0:6000000000000000`
* Shards with prefix `0:a000000000000000`
* Shards with prefix `0:e000000000000000`

Nodes can only monitor a group of shards as a whole. For example, a node can monitor all shards with prefix `0:2000000000000000`
but cannot monitor only `0:1000000000000000` without including `0:3000000000000000`.

It is guaranteed that shards from different groups will not merge.
This ensures that a monitored shard will not unexpectedly merge with a non-monitored shard.

## Node configuration
Update your node to the latest commit of the `testnet` branch.

By default, a node monitors all shards. Disable this behavior by adding `-M` flag to `validator-engine`.
A node with `-M` flag monitors only masterchain. To monitor basechain shards, use the `--add-shard <wc:shard>` flag. For example:
```
validator-engine ... -M --add-shard 0:2000000000000000 --add-shard 0:e000000000000000
```
These flags configure the node to monitor all shards with prefixes `0:2000000000000000` and `0:e000000000000000`.
You can add these flags to an existing node or launch a new node with these flags.

**Note 1**: DO NOT add these flags to a node participating in validation. For now validators are still required to monitor all shards (in next updates it will be improved so validators monitor masterchain only).

**Note 2**: If the `-M` flag then the node will begin downloading missing shards, which may take time.
The same is true if new shards are added later with `--add-shard`.

**Note 3**: `--add-shard 0:0800000000000000` adds the entire shard group with prefix `0:2000000000000000` because of `monitor_min_split`.

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
If you have multiple liteservers, each configured to monitor certain shards, you can list them to `liteservers_v2` section of the global config.
For example:
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
This config includes two liteservers.
1. The first one monitors shards with prefixes `0:2000000000000000` and `0:a000000000000000`.
2. The second one monitors shards with prefixes `0:6000000000000000` and `0:e000000000000000`.

Both liteservers monitor masterchain, it is not required to explicitly include masterchain in the config.

**Note:** To obtain the value for `"shard": 6917529027641081856`, convert shard id in hex (`6000000000000000`) to decimal in range `[-2^63,2^63)`.

`lite-client` and `tonlib` support this new global config format. Clients select a suitable liteserver for each request depending on its shard.

## Proxy liteserver
**Proxy liteserver** is a server that accepts standard liteserver queries and forwards them to other liteservers.

Its primary purpose is to create a single liteserver that acts as a LS with all shards,
while distributing incoming queries under the hood to the appropriate child liteservers.
This eliminates the need for clients to maintain multiple TCP connections for different shards and
allows old clients to use sharded liteservers through proxy.

Usage:
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
This file contains the port and the public key of the proxy liteserver, you can copy them to the new global config.

The key is generated at the first launch and remains unchanged after restarts.
If you need to use an existing private key, place the private key file to `db-dir/keyring/<key-hash-hex>`
and launch `proxy-liteserver` with the `--adnl-id <key-hash-hex>` flag.

# Collator-validator separation
## Overview
Currently, testnet and mainnet validators work as follows:
1. All validators monitor all shards.
2. For each shard, a **validator group** is selected randomly to generate and validate new blocks.
3. Within the validator group, validators **collate** (generate) new blocks candidates one-by-one, other validators **validate** and sign them.

Changes in the accelerator update:
1. Validators monitor only masterchain, significantly reducing their load. (not yet enabled in testnet)
2. The process of selecting validator groups and signing blocks remains unchanged.
3. Masterchain validators collate and validate blocks as before.
4. Collation of a shard block requires monitoring the shard. Therefore, a new type of node called **collator node** is introduced.
Shard validators send requests to collator nodes to generate block candidates.
5. Validators still validate blocks themselves. Collators attach **collated data** (proof of shard state) to blocks,
enabling validating without monitoring the shard.

In the current testnet branch validators still need to monitor all shards.
However, you can try launching collator nodes and configuring your validators to collate through them.

## Launching a collator node
Update your node to [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

To configure a collator node, use the following `validator-engine-console` commands:
```
new-key
add-adnl <key-id-hex> 0
add-collator <key-id-hex> <wc>:<shard>
```
`new-key` and `add-adnl` create a new adnl address. `add-collator` starts a collator node for the given shard on this adnl address.
Collator for shard `X` can create blocks for all shards that are ancestors or descendants of `X`.
Collator nodes cannot create blocks for masterchain, only for basechain.

In the simple case you can take a node that monitors all shards and launch a collator for all shards: `add-collator <key-id-hex> 0:8000000000000000`.

Also, you can launch a partial node that monitors and collates only a subset of shards.
Example: launch a node with flags `-M --add-shard 0:2000000000000000`, launch collator with command `add-collator <key-id-hex> 0:2000000000000000`.
This collator will generate blocks in the first group of shards.

**Note 1**: A collator node generates blocks automatically, even without requests from validators.

**Note 2**: A collator node configured to generate blocks in a specific shard is not required to monitor other shards,
even though outbound message queues from neighboring shard states are necessary for collation.
This is achieved by downloading these message queues from other nodes that monitor the corresponding shards.

## Configuring a validator
Update your validator to [accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator).

By default, validators collate all blocks themselves. To use collator nodes, create a **collators list** and provide it to the validator using `validator-engine-console`:
* `set-collators-list <filename>` installs a new list of collators.
* `clear-collators-list` resets the validator to the default behavior.
* `show-collators-list` displays the current list.

The **collators list** is a json file. It contains a list of collator node adnl ids for each shard.

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
This list contains two collators that can generate blocks in all shards in basechain (`shard_id` is `0:8000000000000000`).

When the validator needs to generate a shard block, it randomly selects one of the collators to send the request.

`"self_collate": true` means that if all collators are offline then the validator will collate the block on its own.
It is recommended to use this option for testing, since validators are still able to generate shard blocks.

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
This list has one collator for prefix `0:4000000000000000`, one collator for prefix `0:a000000000000000` and no collators for `0:e000000000000000`.
`self_collate` is `true`, so the validator will collate on its own if no collators for the shard are online.

### Formal protocol for selecting the collator
The **collators list** contains a list `shards`. Each entry has the following parameters: `shard_id`, `select_mode`, `self_collate`, `collators`.
To generate a block in shard `X`, the validator does the following:
* If `X` is masterchain then the validator generates the block itself.
* Take the first entry from `shards` where `shard_id` intersects with `X`.
* Validator periodically pings collators from the list to determine which ones are online and ready to respond.
* Choose an online collator from the `collators` list. `select_mode` determines the selection method:
  * `random`: random online collator.
  * `ordered`: the first from the list (skipping offline collators).
  * `round_robin`: select collators sequentially (skipping offline collators).
* Send a request to the selected collator.
* If all collators are offline and `self_collate` is `true` then the validator generates the block itself.

### Collation manager stats
Command `collation-manager-stats` in `validator-engine-console` displays the status of collators: which collators are currently used and which are online.

## Collator whitelist
By default, the collator node accepts requests from any validator.
You can enable whitelist to allow requests only from certain validators using `validator-engine-console`:
* `collator-whitelist-enable 1` enables the whitelist.
* `collator-whitelist-enable 0` disables the whitelist.
* `collator-whitelist-add <validator-adnl-id-hex>` adds a validator to the whitelist.
* `collator-whitelist-del <validator-adnl-id-hex>` removes a validator from the whitelist.



# Full collated data
By default validators proposing new block in validator set do not attach data that proves "prior to block" state. This data should be obtained by other validators from locally stored state. That way old (from master branch) and new nodes may reach consensus, but new validators should keep eye on all network state.

Once [ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49) capabilities in network configuration parameter 8 will be enabled `collated_data` will be included into blocks and validators will be able to get rid of monitoring anything except masterchain: incoming data will be enough to fully check correctness of the block.

# Next steps

- Full and easy-to-use support for validation with collators in MyTONCtrl
- Optimization of the `collated_data` size: currently it is ok for most of the blocks but some transactions may cause excessive data usage
- Enabling `collated_data` broadcasting
- Support from MyTONCtrl automatic payment for collation to create market for collation and thus improve durability
