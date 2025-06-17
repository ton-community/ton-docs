import Feedback from '@site/src/components/Feedback';

# DHT

DHT代表分布式哈希表，本质上是一个分布式的键值数据库，其中网络的每个成员都可以存储某些内容，例如，关于自己的信息。 In this system, each member of the network can store information, such as details about themselves.

The implementation of DHT in TON is similar to the [Kademlia](https://codethechange.stanford.edu/guides/guide_kademlia.html) protocol, which is also used in IPFS.

Any network participant can operate a DHT node, generate keys, and store data. To do this, they need to create a random ID and inform other nodes about their presence.

An algorithm determines the "distance" between the node and the key, which helps identify which node should store the data. The algorithm is straightforward: it takes the node's ID and the key's ID and performs the `XOR` operation. A smaller resulting value indicates a closer proximity between the node and the key.

The goal is to store the key on nodes that are as close as possible to the key so that other network participants can, using the same algorithm, easily locate a node that can provide data associated with that key.

## 通过密钥查找值

让我们看一个查找密钥的示例，[连接到任何DHT节点并通过ADNL UDP建立连接](/develop/network/adnl-udp#packet-structure-and-communication)。

例如，我们想找到托管foundation.ton站点的节点的地址和公钥。假设我们已经通过执行DNS合约的Get方法获得了该站点的ADNL地址。ADNL地址的十六进制表示为`516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174`。现在我们的目标是找到拥有此地址的节点的ip、端口和公钥。

Assuming we have already obtained this site's ADNL address by executing the "get method" of the DNS contract, the ADNL address in hexadecimal format is `516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174`.

Our objective is to determine the IP address, port number, and public key of the node associated with this address.

为此，我们需要获取DHT密钥的ID，首先我们将填充DHT密钥模式： We will begin by populating the DHT key schema:

```tlb
dht.key id:int256 name:bytes idx:int = dht.Key
```

The term `name` refers to the type of key. For ADNL addresses, the term `address` is used. For instance, when searching for ShardChain nodes, the term `nodes` is used. However, the key type can vary and may consist of any array of bytes, depending on the specific value you are seeking.

填写此模式，我们得到：

```
8fde67f6                                                           -- TL ID dht.key
516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174   -- our searched ADNL address
07 61646472657373                                                  -- key type, the word "address" as an TL array of bytes
00000000                                                           -- index 0 because there is only 1 key
```

接下来 - 从上面序列化的字节获取DHT密钥ID的sha256哈希。它将是`b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75` It will be `b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75`.

Now we can begin our search. 现在我们可以开始搜索。为此，我们需要执行一个具有[模式](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L197)的查询：

```tlb
dht.findValue key:int256 k:int = dht.ValueResult
```

`key`是我们DHT密钥的id，`k`是搜索的“宽度”，它越小，搜索越精确，但可查询的潜在节点越少。TON节点的最大k为10，通常使用6。 A smaller value for `k` results in a more accurate search but limits the number of potential nodes to query. In a TON, the maximum value for `k` is 10, although 6 is typically used.

我们填充这个结构，序列化并发送请求，使用`adnl.message.query`模式。[您可以在另一篇文章中阅读更多关于此的内容](/develop/network/adnl-udp#packet-structure-and-communication)。 For more details, please refer to the documentation [here](/v3/documentation/network/protocols/adnl/adnl-udp#packet-structure-and-communication).

作为回应，我们可以得到：

- `dht.valueNotFound` - 如果未找到值。
- `dht.valueFound` - 如果此节点上找到了值。

### dht.valueNotFound

如果我们得到`dht.valueNotFound`，响应将包含我们请求的节点所知并且尽可能接近我们请求的密钥的节点列表。在这种情况下，我们需要连接并将收到的节点添加到我们已知的列表中。
之后，从我们已知的所有节点列表中选择最接近、可访问且尚未请求的节点，并对其进行相同的请求。如此反复，直到我们尝试了我们选择的范围内的所有节点或直到我们不再收到新节点为止。 In this situation, we need to connect to these received nodes and add them to our list of known nodes.

Afterwards, we will select the closest, accessible nodes that have not yet been queried from our entire list of known nodes and send the same request to one of them. We will continue this process until we have tried all the nodes within our chosen range or until we stop receiving new nodes.

让我们更详细地分析响应字段，使用的模式：

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.node id:PublicKey addr_list:adnl.addressList version:int signature:bytes = dht.Node;
dht.nodes nodes:(vector dht.node) = dht.Nodes;

dht.valueNotFound nodes:dht.nodes = dht.ValueResult;
```

`dht.nodes -> nodes` - DHT节点列表（数组）。

每个节点都有一个`id`，即其公钥，通常是[pub.ed25519](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L47)，用作通过ADNL连接到节点的服务器密钥。此外，每个节点都有一个地址列表`addr_list:adnl.addressList`，版本和签名。 This key is used to connect to the node via ADNL. Additionally, each node contains a list of addresses, `addr_list:adnl.addressList`, along with its version and signature.

We need to verify the signature of each node. To do this, we first read the value of the `signature` field and then set it to zero, effectively making it an empty byte array. 我们需要检查每个节点的签名，为此我们读取`signature`的值并将该字段置零（我们使其成为空字节数组）。之后 - 我们序列化TL结构`dht.node`并检查空签名。之后 - 我们使用`id`字段中的公钥检查清空之前的`signature`字段。[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91)

We validate the serialized bytes using the public key from the `id` field. [[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91).

从列表`addrs:(vector adnl.Address)`中，我们取地址并尝试建立ADNL UDP连接，作为服务器密钥我们使用`id`，即公钥。

为了找出与该节点的“距离” - 我们需要从`id`字段的密钥中取出[key id](/develop/network/adnl-tcp#getting-key-id)并通过节点密钥id和所需密钥的XOR操作检查距离。如果距离足够小，我们可以对此节点发出相同的请求。依此类推，直到我们找到值或没有更多新节点。 If the distance is small enough, we can make the same request to this node. This process continues until we find a value or run out of new nodes.

### dht.valueFound

响应将包含值本身，完整的密钥信息，以及可选的签名（取决于值类型）。

让我们更详细地分析响应字段，使用的模式：

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.key id:int256 name:bytes idx:int = dht.Key;

dht.updateRule.signature = dht.UpdateRule;
dht.updateRule.anybody = dht.UpdateRule;
dht.updateRule.overlayNodes = dht.UpdateRule;

dht.keyDescription key:dht.key id:PublicKey update_rule:dht.UpdateRule signature:bytes = dht.KeyDescription;

dht.value key:dht.keyDescription value:bytes ttl:int signature:bytes = dht.Value; 

dht.valueFound value:dht.Value = dht.ValueResult;
```

Let's determine `key:dht.keyDescription`. 首先，让我们分析`key:dht.keyDescription`，它是密钥的完整描述，密钥本身以及谁以及如何可以更新值的信息。

- `key:dht.key` - 密钥必须与我们用于搜索的密钥ID的密钥相匹配。
- `id:PublicKey` - 记录所有者
- `update_rule:dht.UpdateRule` - 记录更新规则。
  - `dht.updateRule.signature` - 只有私钥所有者才能更新记录，密钥和值的`signature`都必须有效
  - `dht.updateRule.anybody` - 任何人都可以更新记录，`signature`为空且不被检查
  - `dht.updateRule.overlayNodes` - 同一overlay的节点可以更新密钥，用于找到同一overlay的节点并添加自己

### dht.updateRule.signature

After reviewing the key's description, we proceed based on the `updateRule`. In the ADNL address lookup, the type is always `dht.updateRule.signature`.

We verify the key signature in the same manner as before. First, we set the signature to an empty byte array, serialize it, and perform the necessary checks. Next, we repeat this process for the entire `dht.value` object while ensuring that the key signature is restored to its original state.

[[实现示例]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L331)

### dht.updateRule.overlayNodes

用于包含有关网络中工作链和其分片的其他节点信息的键，值始终具有`overlay.nodes`的TL结构。
该值字段必须为空。

The value field must be empty.

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;
```

要检查有效性，我们必须检查所有 `nodes`，并通过序列化 TL 结构，针对每个节点的 `id` 检查 `signature`：

```tlb
overlay.node.toSign id:adnl.id.short overlay:int256 version:int = overlay.node.ToSign;
```

我们可以看到，id 应替换为 adnl.id.short，即原始结构中 `id` 字段的键 id（哈希值）。序列化后，我们使用数据检查签名。 After serialization, we will verify the signature against the data.

因此，我们得到了能够给我们提供所需工作链分片信息的节点的有效列表。

### dht.updateRule.anybody

没有签名，任何人都可以更新。

### 使用值

Once everything has been verified and the `ttl:int` value has not expired, we can begin working with the value itself, specifically `value:bytes`. For an ADNL address, this will include an `adnl.addressList` structure.

This structure will contain the IP addresses and ports of the servers corresponding to the requested ADNL address. In our case, we will most likely have one RLDP-HTTP address associated with the `foundation.ton` service.

We will use the public key, `id:PublicKey`, from the DHT key information as the server key.

建立连接后，我们就可以使用 RLDP 协议请求访问网站页面。此时 DHT 方面的任务已经完成。 At this stage, the task from the DHT perspective is complete.

### 搜索存储区块链状态的节点

DHT is also used to locate information about the nodes storing the data of WorkChains and their shards. The process for retrieving this information is similar to searching for any key; however, the key serialization and response validation differ. We will examine these aspects in this section.

为了获取例如主链及其分片的数据，我们需要填充TL结构：

```
tonNode.shardPublicOverlayId workchain:int shard:long zero_state_file_hash:int256 = tonNode.ShardPublicOverlayId;
```

In the context of a MasterChain, the `workchain` value will be set to `-1`. The corresponding shard will be represented as `-922337203685477580 (0xFFFFFFFFFFFFFFFF)`. Additionally, the `zero_state_file_hash` refers to the hash of the chain’s zero state (file_hash). Like other data, this can be obtained from the global network configuration in the `validator` field.

```json
"zero_state": {
  "workchain": -1,
  "shard": -9223372036854775808, 
  "seqno": 0,
  "root_hash": "F6OpKZKqvqeFp6CQmFomXNMfMj2EnaUSOXN+Mh+wVWk=",
  "file_hash": "XplPz01CXAps5qeSWUtxcyBfdAo5zVb1N979KLSKD24="
}
```

在我们填充了`tonNode.shardPublicOverlayId`后，我们序列化它并通过哈希获取密钥ID（像往常一样）。

我们需要使用结果密钥ID作为`name`来填充`pub.overlay name:bytes = PublicKey`结构，将其包裹在TL字节数组中。接下来，我们序列化它，并从中获取现在的密钥ID。 After serialization, we will retrieve the key ID again from this structure.

This resulting ID will serve as the key for the command:

```bash
dht.findValue
```

In this command, the `name` field will have the value `nodes`. 生成的 id 将是 `dht.findValue` 的密钥，而 `name` 字段的值将是 `nodes` 字样。我们重复上一节的过程，一切与上次相同，但 `updateRule` 将是 [dht.updateRule.overlayNodes](#dhtupdateruleoverlaynodes)。

经过验证 - 我们将获得公钥（`id`）的节点，这些节点拥有我们工作链和分片的信息。为了获取节点的ADNL地址，我们需要对每个密钥（使用哈希方法）制作ID并重复上述过程，就像`foundation.ton`域的ADNL地址一样。 To access the ADNL addresses of these nodes, we will hash the keys to create IDs and repeat the same procedure for each ADNL address, similar to how we did for the `foundation.ton` domain.

As a result, we will have the addresses of the nodes. 结果是，我们将得到节点的地址，如果需要，我们可以使用[overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237)方法找到此链的其他节点的地址。我们还可以从这些节点接收有关区块的所有信息。

These nodes will also provide us with all the information regarding the blocks.

## 参考资料

_这里是[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md)，作者是[Oleg Baranov](https://github.com/xssnick)。_

