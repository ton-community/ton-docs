import Feedback from '@site/src/components/Feedback';

# Обновление акселератора

:::caution в разработке
This feature is currently available only on the Testnet! Participate at your own risk.
:::

The key feature of the TON Blockchain is the ability to distribute transaction processing over network nodes, switching from **everybody checks all transactions** to **every transaction is checked by a secure validator subset**. This ability to infinitely horizontally scale throughput over shards when one work chain splits to the required number of shard chains distinguishes TON from other L1 networks.

However, it is necessary to rotate validator subsets regularly, which process one or another shard, to prevent collusion. At the same time, to process transactions, validators obviously should know the state of the shard prior to the transaction. The simplest approach is to require all validators to know the state of all shards.

This approach works well when the number of TON users is within the range of a few million and TPS (transactions per second) is under a hundred. However, in the future, when TON Blockchain processes many thousands of transactions per second for hundreds of millions or billions of people, no single server will be able to keep the actual state of the whole network. Fortunately, TON was designed with such loads in mind and supports sharding both throughput and state updates.

# Акселератор

**Акселератор** — это предстоящее обновление, разработанное для улучшения масштабируемости блокчейна. Его основные функции:

- **Partial nodes**: A node will be able to monitor specific shards of the blockchain instead of the entire set of shards.

- **Liteserver infrastructure**: Liteserver operators will be able to configure each LS to monitor a set of shards, and lite-clients will select a suitable LS for each request.

- **Collator/validator separation**: Validators will only monitor MasterChain, significantly reducing their load.

Validator will use new **collator nodes** to collate new shard blocks.

The accelerator update is currently partially implemented in Testnet.

Testnet nodes can be configured to monitor a subset of shards, and lite clients can be set up to such partial liteservers.

Collator-validator separation has not yet been deployed in Testnet. However, you can test some parts of it by launching your own collator nodes.

# Частичные узлы

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

## Конфигурация узла

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

### Низкоуровневая конфигурация

Флаг `--add-shard` является сокращением для некоторых команд консоли валидатора.
Узел хранит список шардов для мониторинга в конфигурации (см. файл `db/config.json`, раздел `shards_to_monitor`).
Этот список можно изменить с помощью `validator-engine-console`:

```
add-shard <wc>:<shard>
del-shard <wc>:<shard>
```

Флаг `--add-shard X` эквивалентен команде `add-shard X`.

## Конфигурация Lite client

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

- Первый отслеживает шарды с префиксами `0:20000000000000000` и ​​`0:a00000000000000000`.
- Второй отслеживает шарды с префиксами `0:60000000000000000` и ​​`0:e00000000000000000`.

Both liteservers monitor MasterChain, so it is not necessary to include MasterChain explicitly in the configuration.

#### Note:

- To obtain the value for `"shard": 6917529027641081856`, convert the shard ID in hexadecimal (`6000000000000000`) to decimal within the range of `[-2^63, 2^63)`.

- Both `lite-client` and `tonlib` support this new global configuration format. Clients select the appropriate liteserver for each request based on its shard.

## Прокси liteserver

**Proxy Liteserver** is a server designed to accept standard liteserver queries and forward them to other liteservers.

Its main purpose is to create a single liteserver that functions as a liteserver (LS) for all shards while distributing incoming queries to the appropriate child liteservers behind the scenes. This setup eliminates the need for clients to maintain multiple TCP connections for different shards and enables older clients to interact with sharded liteservers through the proxy.

**Usage:**

```
proxy-liteserver -p <tcp-port> -C global-config.json --db db-dir/ --logname ls.log
```

Перечислите все дочерние liteserver в глобальной конфигурации. Это могут быть частичные liteserver, как показано в примере выше.

Чтобы использовать прокси liteserver в клиентах, создайте новую глобальную конфигурацию с этим прокси в разделе `liteservers`. См. `db-dir/config.json`:

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

- Все валидаторы отслеживают все шарды.

- For each shard, a **validator group** is randomly selected to generate and validate new blocks.

- Within this validator group, validators **collate** (generate) new block candidates one by one, while other validators **validate** and sign them.

Changes introduced in the accelerator update are as follows:

- Validators will monitor only the MasterChain, significantly reducing their workload (this feature is not yet enabled in Testnet).

- The process for selecting validator groups and signing blocks remains unchanged.

- MasterChain validators will continue to collate and validate blocks as before.

- The collation of a shard block requires monitoring the shard. To address this, a new type of node called **collator node** is introduced. Shard validators will send requests to collator nodes to generate block candidates.

- Validators will still validate blocks themselves. Collators will attach **collated data** (proof of shard state) to blocks, allowing for validation without the need to monitor the shard.

In the current `testnet` branch, validators must still monitor all shards. However, you can experiment with launching collator nodes and configuring your validators to collate through them.

## Запуск коллатор узла

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

Обновите валидатор до [ветки accelerator](https://github.com/ton-blockchain/ton/tree/accelerator).

По умолчанию валидаторы сами сортируют все блоки. Чтобы использовать коллатор узлы, создайте **список коллатор узлов** и предоставьте его валидатору с помощью `validator-engine-console`:

- `set-collators-list <имя_файла>` устанавливает новый список сортировщиков.
- `clear-collators-list` восстанавливает работу валидатора до состояния по умолчанию.
- `show-collators-list` отображает текущий список.

The **collators list** is a JSON file. It contains a list of collator node ADNL ids for each shard.

### Пример 1: коллаторы для всех шардов

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

Когда валидатору необходимо сгенерировать блок шарда, он случайным образом выбирает один из коллаторов для отправки запроса.

`"self_collate": true` means that if all collators are offline then the validator will collate the block on its own. It is recommended to use this option for testing, since validators are still able to generate shard blocks.

### ### Пример 2: частичные коллатор узлы

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

### Формальный протокол для выбора коллатора

The **collators list** contains a list `shards`. Each entry has the following parameters: `shard_id`, `select_mode`, `self_collate`, `collators`.

To generate a block in shard `X`, the validator does the following:

- If `X` is MasterChain then the validator generates the block itself.
- Возьмите первую запись из `shards`, где `shard_id` пересекается с `X`.
- Валидатор периодически пингует коллаторы из списка, чтобы определить, какие из них находятся в сети и готовы ответить.
- Выберите онлайн коллатора из списка `collators`. `select_mode` определяет метод выбора:
  - `random`: случайный коллатор онлайн.
  - `ordered`: первый из списка (пропуская автономные коллаторы).
  - `round_robin`: последовательно выбирайте коллаторы (пропуская автономные коллаторы).
- Отправьте запрос выбранному коллатору.
- Если все коллаторы находятся в сети, а `self_collate` равен `true`, то валидатор сам генерирует блок.

### Статистика коллатор менеджера

Команда `collation-manager-stats` в `validator-engine-console` отображает состояние коллаторов: какие коллаторы в данный момент используются, а какие находятся в сети.

## Белый список коллаторов

By default, the collator node accepts requests from any validator.

You can enable whitelist to allow requests only from certain validators using `validator-engine-console`:

- `collator-whitelist-enable 1` включает белый список.
- `collator-whitelist-enable 0` отключает белый список.
- `collator-whitelist-add <validator-adnl-id-hex>` добавляет валидатор в белый список.
- `collator-whitelist-del <validator-adnl-id-hex>` удаляет валидатор из белого списка.

# Полные сопоставленные данные

По умолчанию валидаторы, предлагающие новый блок в наборе валидаторов, не прикрепляют данные, которые подтверждают состояние "до блокировки". Эти данные должны быть получены другими валидаторами из локально сохраненного состояния. Таким образом, старые (из главной ветви) и новые узлы могут достичь консенсуса, но новые валидаторы должны следить за всем состоянием сети.

После того, как [ton::capFullCollatedData](https://github.com/ton-blockchain/ton/blob/160b539eaad7bc97b7e238168756cca676a5f3be/validator/impl/collator-impl.h#L49) возможности в параметре конфигурации сети 8 будут включены, `collated_data` будет включен в блоки, и валидаторы смогут избавиться от мониторинга чего-либо, кроме мастерчейна: входящих данных будет достаточно для полной проверки корректности блока.

# Следующие шаги

Developers are planning to implement the following features:

- Add comprehensive and user-friendly support for validation using collators in MyTonCtrl.

- Optimize the size of `collated_data`: Although it currently functions well for most blocks, some transactions can lead to excessive data usage.

- Enable broadcasting of `collated_data`.

- Provide support in MyTonCtrl for automatic payments for collation to establish a market for collation and enhance its durability.

<Feedback />

