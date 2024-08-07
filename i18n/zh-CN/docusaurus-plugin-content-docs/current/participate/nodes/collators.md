# 验证者/收集者分离

:::caution 开发中
此功能目前仅在测试网中！参与风险自负。
:::

TON区块链的关键特性是能够将交易处理分散到网络节点上，并从“每个人都检查所有交易”转变为“每笔交易由安全的验证者子集检查”。这种能力在一个工作链分裂为所需数量的*分片链*时，无限横向扩展吞吐量，使TON与其他L1网络区别开来。

然而，为了防止串谋，有必要定期轮换处理一个或另一个分片的验证者子集。同时，为了处理交易，验证者显然应该知道交易之前的分片状态。最简单的方法是要求所有验证者了解所有分片的状态。

当TON用户数量在几百万范围内且每秒交易数（TPS）在一百以下时，这种方法运行良好。然而，在未来，当TON处理每秒成千上万笔交易并服务于数亿甚至数十亿人时，没有单一服务器能够保持整个网络的实时状态。幸运的是，TON在设计时就考虑到了这种负载，并支持吞吐量和状态更新的分片。

这是通过分离两个角色实现的：

- *收集者（Collator）* - 观察网络的一部分，了解实际状态并*收集*（生成）下一个区块的行为者
- *验证者（Validator）* - 从*收集者*获得新区块，检查其有效性，并签署以实际保证正确性，否则将冒失去抵押的风险。

同时，TON的架构允许*验证者*在不实际存储区块链状态的情况下有效验证新区块，通过检查特别制作的证明。

这样，当TON的吞吐量太大而无法由单一机器处理时，网络将由部分收集者子网络组成，每个收集者只处理其能够处理的链的一部分，以及由多个安全集组成的验证者子网络，用于提交新交易。

目前，TON测试网正在测试这种*验证者*/*收集者*分离，其中一些验证者像往常一样工作，而一些验证者不为自己收集区块，而是从收集者那里接收。

# 加入“轻验证者”

新的节点软件可在[区块生成](https://github.com/SpyCheese/ton/tree/block-generation)分支中获得。

## 收集者

要创建新的收集者，您需要设置TON节点；您可以使用`-M`标志强制节点不关注它不处理的分片链。

在`validator-engine-console`中为收集者创建新密钥，将adnl类别`0`设置为此密钥，并通过命令添加收集实体：

```bash
addcollator <adnl-id> <chain-id> <shard-id>
```

例如：

```bash
newkey
addadnl <adnl-id> 0
addcollator <adnl-id> 0 -9223372036854775808
```

配置为分片 wc:shard_pfx 的收集者可以收集分片 wc:shard_pfx 及其前者和后者的区块；它还会监控所有这些分片，因为这对于收集是必需的。

收集者可以通过命令停止：

```bash
delcollator <adnl-id> 0 -9223372036854775808
```

:::info
目前网络中有一个收集者，配置\*\*-41\*\*用于宣布其adnl地址。
:::

## 验证者

要运行验证者，您需要设置TON节点，使用`--lite-validator`标志强制验证者从收集者请求新区块而不是生成它们，并设置质押过程。轻模式下的验证者从`-41`配置中获取收集者节点。

最简单的方式如下：

- 为测试网设置MyTonCtrl
- 停止验证者 `sudo systemctl stop validator`
- 更新服务文件 `sudo nano /etc/systemd/system/validator.service`：添加`--lite-validator`标志
- 重载systemctl `sudo systemctl daemon-reload`
- 启动验证者 `sudo systemctl start validator`

## 轻节点

就像收集者一样，Liteservers可以配置为只监控区块链的一部分。可以通过使用`-M`选项运行节点并在`validator-engine-console`中添加分片来实现：

```bash
addshard 0 -9223372036854775808
```

默认情况下，主链总是被监控的。分片可以使用`delshard 0 -9223372036854775808`移除。

### 轻客户端

全局配置至少应包含两个部分之一：`liteservers`和`liteservers_v2`。第一个部分包含有关所有分片状态的“全”Liteservers。第二个部分包含有关区块链某些部分的数据的“部分”liteservers。

“部分”Liteservers如下描述：

```json
"liteservers_v2": [
  {
    "ip": ...,
    "port": ...,
    "id": {
      "@type": "pub.ed25519",
      "key": "..."
    },  
    "shards": [
      {   
        "workchain": 0, 
        "shard": -9223372036854775808
      }   
    ]   
  }
  ...
]
```

Lite Client和Tonlib支持此配置，并可以为每个查询选择合适的Liteserver。请注意，每个Liteserver默认监控主链，`liteservers_v2`中的每个服务器都隐含配置为接受有关主链的查询。配置中的分片`wc:shard_pfx`表示服务器接受有关分片`wc:shard_pfx`、其前者和后者（就像收集者的配置一样）的查询。

## 完全收集的数据

默认情况下，提议新区块的验证者在验证者集合中不会附加证明“区块之前”状态的数据。这些数据应由其他验证者从本地存储的状态中获取。通过这种方式，旧节点（来自主分支）和新节点可以达成共识，但新的验证者应该关注所有网络状态。

当验证者将附有汇总数据的区块共享时，升级到新协议可以通过以下方式完成：

- 将所有验证者升级到新节点版本
- 将 [full_collated_data](https://github.com/spycheese/ton/blob/block-generation/crypto/block/block.tlb#L737) 设置为 true

# 下一步

将*验证者*和*收集者*角色分离的实际能力是实现无限吞吐量的主要里程碑，但要创建真正去中心化和抗审查的网络，有必要

- 确保*收集者*的独立性和冗余性
- 确保验证者和收集者之间的稳定和安全的互动方式
- 为收集者确立适当的财务模型，激励其持续收集新区块

目前，这些任务超出了范围。
