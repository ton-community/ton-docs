import Feedback from '@site/src/components/Feedback';

# アクセラレーター・アップデート

:::caution 開発中
This feature is currently available only on the Testnet! Participate at your own risk.
:::

The key feature of the TON Blockchain is the ability to distribute transaction processing over network nodes, switching from **everybody checks all transactions** to **every transaction is checked by a secure validator subset**. This ability to infinitely horizontally scale throughput over shards when one work chain splits to the required number of shard chains distinguishes TON from other L1 networks.

However, it is necessary to rotate validator subsets regularly, which process one or another shard, to prevent collusion. At the same time, to process transactions, validators obviously should know the state of the shard prior to the transaction. The simplest approach is to require all validators to know the state of all shards.

This approach works well when the number of TON users is within the range of a few million and TPS (transactions per second) is under a hundred. However, in the future, when TON Blockchain processes many thousands of transactions per second for hundreds of millions or billions of people, no single server will be able to keep the actual state of the whole network. Fortunately, TON was designed with such loads in mind and supports sharding both throughput and state updates.

# アクセラレーター

**アクセラレータ**は、ブロックチェーンのスケーラビリティを向上させるために設計された次期アップデートである。主な特徴は以下の通り： Its main features are:

- **Partial nodes**: A node will be able to monitor specific shards of the blockchain instead of the entire set of shards.

- **Liteserver infrastructure**: Liteserver operators will be able to configure each LS to monitor a set of shards, and lite-clients will select a suitable LS for each request.

- **Collator/validator separation**: Validators will only monitor MasterChain, significantly reducing their load.

Validator will use new **collator nodes** to collate new shard blocks.

The accelerator update is currently partially implemented in Testnet.

Testnet nodes can be configured to monitor a subset of shards, and lite clients can be set up to such partial liteservers.

Collator-validator separation has not yet been deployed in Testnet. However, you can test some parts of it by launching your own collator nodes.

# 部分ノード

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

## ノード構成

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

### 低レベルのコンフィギュレーション

`--add-shard` flag is a shorthand for certain validator console commands.
add-shard`フラグはバリデータのコンソールコマンドの略記法です。
ノードはコンフィグに監視するシャードのリストを保存します (ファイル`db/config.json`の`shards_to_monitor`セクションを参照)。
このリストは`validator-engine-console\`を使って変更することができます：
This list can be modified using`validator-engine-console\`:

```
add-shard <wc>:<shard>
del-shard <wc>:<shard>
```

Add-shard X`フラグは`add-shard X\\` コマンドと同じです。

## ライトクライアントの設定

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

- 最初のものは `0:2000000000000000` と `0:a000000000000000` というプレフィックスを持つシャードを監視します。
- もう一つは、接頭辞が `0:6000000000000000` と `0:e000000000000000` のシャードを監視します。

Both liteservers monitor MasterChain, so it is not necessary to include MasterChain explicitly in the configuration.

#### Note:

- To obtain the value for `"shard": 6917529027641081856`, convert the shard ID in hexadecimal (`6000000000000000`) to decimal within the range of `[-2^63, 2^63)`.

- Both `lite-client` and `tonlib` support this new global configuration format. Clients select the appropriate liteserver for each request based on its shard.

## プロキシライトサーバー

**Proxy Liteserver** is a server designed to accept standard liteserver queries and forward them to other liteservers.

Its main purpose is to create a single liteserver that functions as a liteserver (LS) for all shards while distributing incoming queries to the appropriate child liteservers behind the scenes. This setup eliminates the need for clients to maintain multiple TCP connections for different shards and enables older clients to interact with sharded liteservers through the proxy.

**Usage:**

```
proxy-liteserver -p <tcp-port> -C global-config.json --db db-dir/ --logname ls.log
```

グローバル設定内のすべての子ライトサーバをリストします。上の例のように、子ライトサーバは部分的なものであってもかまいません。 These can be partial liteservers, as shown in the example above.

クライアントでプロキシライトサーバを使用するには、`liteservers` セクションにこのプロキシを含む新しいグローバル設定を作成します。db-dir/config.json\`を参照すること： See`db-dir/config.json\`:

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

- すべてのバリデーターがすべてのシャードを監視します。

- For each shard, a **validator group** is randomly selected to generate and validate new blocks.

- Within this validator group, validators **collate** (generate) new block candidates one by one, while other validators **validate** and sign them.

Changes introduced in the accelerator update are as follows:

- Validators will monitor only the MasterChain, significantly reducing their workload (this feature is not yet enabled in Testnet).

- The process for selecting validator groups and signing blocks remains unchanged.

- MasterChain validators will continue to collate and validate blocks as before.

- The collation of a shard block requires monitoring the shard. To address this, a new type of node called **collator node** is introduced. Shard validators will send requests to collator nodes to generate block candidates.

- Validators will still validate blocks themselves. Collators will attach **collated data** (proof of shard state) to blocks, allowing for validation without the need to monitor the shard.

In the current `testnet` branch, validators must still monitor all shards. However, you can experiment with launching collator nodes and configuring your validators to collate through them.

## コレーター・ノードの起動

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

バリデータを[accelerator branch](https://github.com/ton-blockchain/ton/tree/accelerator)に更新してください。

By default, validators collate all blocks themselves. デフォルトでは、バリデータはすべてのブロックを照合します。collator ノードを使うには、**collators list** を作成して `validator-engine-console` を使ってバリデータに渡します：

- set-collators-list<filename>\\` は新しいコレーターのリストをインストールします。
- clear-collators-list\\` はバリデータをデフォルトの動作にリセットします。
- show-collators-list\\`は現在のリストを表示します。

The **collators list** is a JSON file. It contains a list of collator node ADNL ids for each shard.

### 例1：全シャードのコレーター

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

バリデータがシャードブロックを生成する必要がある場合、リクエストを送信するコレーターの1つをランダムに選択します。

`"self_collate": true` means that if all collators are offline then the validator will collate the block on its own. It is recommended to use this option for testing, since validators are still able to generate shard blocks.

### 例2：部分コレーター

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

### コレーター選定のための正式なプロトコル

The **collators list** contains a list `shards`. Each entry has the following parameters: `shard_id`, `select_mode`, `self_collate`, `collators`.

To generate a block in shard `X`, the validator does the following:

- If `X` is MasterChain then the validator generates the block itself.
- `Shard_id` が `X` と交差する最初のエントリを `shards` から取り出します。
- Validatorは、定期的にリストから照合器にpingを送り、どの照合器がオンラインであり、応答する準備ができているかを判断します。
- `collators`リストからオンラインコレーターを選択する。`select_mode` は選択方法を決定します： `select_mode` determines the selection method:
  - `random`：ランダムなオンライン照合器
  - `ordered`: リストから最初のもの（オフラインのコレーターはスキップする）
  - `round_robin`: コレーターを順番に選択する（オフラインのコレーターはスキップする）
- 選択したコレーターにリクエストを送信します。
- すべての照合器がオフラインで `self_collate` が `true` の場合、バリデータはブロックを生成します。

### 照合マネージャーの統計

`validator-engine-console`の`collation-manager-stats`コマンドはコレーターのステータスを表示します。

## コレーターのホワイトリスト

By default, the collator node accepts requests from any validator.

You can enable whitelist to allow requests only from certain validators using `validator-engine-console`:

- `collator-whitelist-enable 1` ホワイトリストを有効にします。
- `collator-whitelist-enable 0` はホワイトリストを無効にします。
- `collator-whitelist-add<validator-adnl-id-hex>` ホワイトリストにバリデータを追加します。
- `collator-whitelist-del<validator-adnl-id-hex>` ホワイトリストからバリデータを削除します。

# 完全な照合データ

By default validators proposing new block in validator set do not attach data that proves "prior to block" state. This data should be obtained by other validators from locally stored state. That way old (from master branch) and new nodes may reach consensus, but new validators should keep eye on all network state.

ネットワーク設定パラメータ8の[ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49)機能が有効になると、`collated_data`がブロックに含まれるようになり、バリデータはマスターチェーン以外の監視から解放されます。

# 次のステップ

Developers are planning to implement the following features:

- Add comprehensive and user-friendly support for validation using collators in MyTonCtrl.

- Optimize the size of `collated_data`: Although it currently functions well for most blocks, some transactions can lead to excessive data usage.

- Enable broadcasting of `collated_data`.

- Provide support in MyTonCtrl for automatic payments for collation to establish a market for collation and enhance its durability.

<Feedback />

