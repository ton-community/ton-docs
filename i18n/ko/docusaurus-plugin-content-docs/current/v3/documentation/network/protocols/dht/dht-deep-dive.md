import Feedback from '@site/src/components/Feedback';

# DHT

DHT stands for Distributed Hash Table, which is a type of distributed key-value database. In this system, each member of the network can store information, such as details about themselves.

The implementation of DHT in TON is similar to the [Kademlia](https://codethechange.stanford.edu/guides/guide_kademlia.html) protocol, which is also used in IPFS.

Any network participant can operate a DHT node, generate keys, and store data. To do this, they need to create a random ID and inform other nodes about their presence.

An algorithm determines the "distance" between the node and the key, which helps identify which node should store the data. The algorithm is straightforward: it takes the node's ID and the key's ID and performs the `XOR` operation. A smaller resulting value indicates a closer proximity between the node and the key.

The goal is to store the key on nodes that are as close as possible to the key so that other network participants can, using the same algorithm, easily locate a node that can provide data associated with that key.

## 키로 값 찾기

Let's examine an example involving a search for a key: [connect to any DHT node and establish a connection via ADNL UDP](/v3/documentation/network/protocols/adnl/adnl-udp#packet-structure-and-communication).

Suppose we want to find the address and public key needed to connect to the node hosting the `foundation.ton` site.

Assuming we have already obtained this site's ADNL address by executing the "get method" of the DNS contract, the ADNL address in hexadecimal format is `516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174`.

Our objective is to determine the IP address, port number, and public key of the node associated with this address.

To achieve this, we first need to get the ID of the DHT key. We will begin by populating the DHT key schema:

```tlb
dht.key id:int256 name:bytes idx:int = dht.Key
```

The term `name` refers to the type of key. For ADNL addresses, the term `address` is used. For instance, when searching for ShardChain nodes, the term `nodes` is used. However, the key type can vary and may consist of any array of bytes, depending on the specific value you are seeking.

By applying this schema, we get:

```
8fde67f6                                                           -- TL ID dht.key
516618cf6cbe9004f6883e742c9a2e3ca53ed02e3e36f4cef62a98ee1e449174   -- our searched ADNL address
07 61646472657373                                                  -- key type, the word "address" as an TL array of bytes
00000000                                                           -- index 0 because there is only 1 key
```

Next, retrieve the key ID and the SHA256 hash from the bytes serialized above. It will be `b30af0538916421b46df4ce580bf3a29316831e0c3323a7f156df0236c5b2f75`.

Now we can begin our search. To do this, we need to execute a query that has [schema](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L197):

```tlb
dht.findValue key:int256 k:int = dht.ValueResult
```

The `key` represents the ID of our DHT key, while `k` indicates the "width" of the search. A smaller value for `k` results in a more accurate search but limits the number of potential nodes to query. In a TON, the maximum value for `k` is 10, although 6 is typically used.

Now, let's populate this structure, serialize it, and send the request using the `adnl.message.query` schema. For more details, please refer to the documentation [here](/v3/documentation/network/protocols/adnl/adnl-udp#packet-structure-and-communication).

응답으로 다음을 받을 수 있습니다:

- `dht.valueNotFound` - 값을 찾지 못한 경우
- `dht.valueFound` - 이 노드에서 값을 찾은 경우

### dht.valueNotFound

If we receive `dht.valueNotFound`, the response will include a list of nodes that are known to the node we queried and as close as possible to the key we requested. In this situation, we need to connect to these received nodes and add them to our list of known nodes.

Afterwards, we will select the closest, accessible nodes that have not yet been queried from our entire list of known nodes and send the same request to one of them. We will continue this process until we have tried all the nodes within our chosen range or until we stop receiving new nodes.

Now, let's take a closer look at the fields in the response and the schemas that are used:

```tlb
adnl.address.udp ip:int port:int = adnl.Address;
adnl.addressList addrs:(vector adnl.Address) version:int reinit_date:int priority:int expire_at:int = adnl.AddressList;

dht.node id:PublicKey addr_list:adnl.addressList version:int signature:bytes = dht.Node;
dht.nodes nodes:(vector dht.node) = dht.Nodes;

dht.valueNotFound nodes:dht.nodes = dht.ValueResult;
```

`dht.nodes -> nodes` - DHT 노드 목록(배열).

Each node has an `id`, which serves as its public key, typically represented as [pub.ed25519](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L47). This key is used to connect to the node via ADNL. Additionally, each node contains a list of addresses, `addr_list:adnl.addressList`, along with its version and signature.

We need to verify the signature of each node. To do this, we first read the value of the `signature` field and then set it to zero, effectively making it an empty byte array. Next, we serialize the TL structure `dht.node` using this empty signature and check the `signature` field that we emptied earlier.

We validate the serialized bytes using the public key from the `id` field. [[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L91).

From the list `addrs:(vector adnl.Address)`, we select an address and attempt to establish an ADNL UDP connection, using `id` (the public key) as the server key.

To determine the "distance" to this node, we retrieve the [key ID](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) from the `id` field and calculate the distance using the `XOR` operation between the node's key ID and the desired key. If the distance is small enough, we can make the same request to this node. This process continues until we find a value or run out of new nodes.

### dht.valueFound

The response will include the value itself, complete key information, and optionally a signature, depending on the value type.

응답 필드를 더 자세히 분석해 보겠습니다. 사용된 스키마는 다음과 같습니다:

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

Let's determine `key:dht.keyDescription`. This provides a complete description of the key, including the key itself and information about who can update its value and how.

- `key:dht.key` - 검색에 사용한 키 ID의 원본 키와 일치해야 합니다.
- `id:PublicKey` - 레코드 소유자의 공개 키.
- `update_rule:dht.UpdateRule` - 레코드 업데이트 규칙.
  - `dht.updateRule.signature` - 개인 키 소유자만 레코드를 업데이트할 수 있으며, 키와 값 모두의 `signature`가 유효해야 함
  - `dht.updateRule.anybody` - 누구나 레코드를 업데이트할 수 있으며, `signature`는 비어 있고 확인되지 않음
  - `dht.updateRule.overlayNodes` - 같은 오버레이의 노드들이 키를 업데이트할 수 있음, 같은 오버레이의 노드를 찾고 자신을 추가하는 데 사용됨

### dht.updateRule.signature

After reviewing the key's description, we proceed based on the `updateRule`. In the ADNL address lookup, the type is always `dht.updateRule.signature`.

We verify the key signature in the same manner as before. First, we set the signature to an empty byte array, serialize it, and perform the necessary checks. Next, we repeat this process for the entire `dht.value` object while ensuring that the key signature is restored to its original state.

[[Please see implementation example]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/dht/client.go#L331).

### dht.updateRule.overlayNodes

Used for keys that contain information about other nodes, shards of the WorkChain in the network, the value always follows the TL structure `overlay.nodes`.

The value field must be empty.

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;
```

유효성을 확인하기 위해서는 모든 `nodes`를 확인하고 각각에 대해 TL 구조를 직렬화하여 `signature`를 `id`에 대해 확인해야 합니다:

```tlb
overlay.node.toSign id:adnl.id.short overlay:int256 version:int = overlay.node.ToSign;
```

We should replace the `id` with `adnl.id.short`, which is the key identifier (hash) from the original structure's `id` field. After serialization, we will verify the signature against the data.

As a result, we obtain a valid list of nodes that can provide information about the required WorkChain shard.

### dht.updateRule.anybody

There are no signatures required; anyone can make updates.

### 값 사용하기

Once everything has been verified and the `ttl:int` value has not expired, we can begin working with the value itself, specifically `value:bytes`. For an ADNL address, this will include an `adnl.addressList` structure.

This structure will contain the IP addresses and ports of the servers corresponding to the requested ADNL address. In our case, we will most likely have one RLDP-HTTP address associated with the `foundation.ton` service.

We will use the public key, `id:PublicKey`, from the DHT key information as the server key.

After establishing the connection, we can request the site's pages using the RLDP protocol. At this stage, the task from the DHT perspective is complete.

### 블록체인 상태를 저장하는 노드 검색

DHT is also used to locate information about the nodes storing the data of WorkChains and their shards. The process for retrieving this information is similar to searching for any key; however, the key serialization and response validation differ. We will examine these aspects in this section.

To retrieve data, such as that of the MasterChain and its shards, we need to complete the TL structure:

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

Once we fill in `tonNode.shardPublicOverlayId`, we will serialize it and obtain the key ID by hashing, as we normally do.

Next, we use this key ID as the `name` to populate the `pub.overlay name:bytes = PublicKey` structure, wrapping it in a TL bytes array. After serialization, we will retrieve the key ID again from this structure.

This resulting ID will serve as the key for the command:

```bash
dht.findValue
```

In this command, the `name` field will have the value `nodes`. We will repeat the process from the previous section; everything remains the same as before, but this time the `updateRule` will be set to [dht.updateRule.overlayNodes](#dhtupdateruleoverlaynodes).

After the validation process, we will obtain the public keys (IDs) of the nodes that have information about our workchain and shard. To access the ADNL addresses of these nodes, we will hash the keys to create IDs and repeat the same procedure for each ADNL address, similar to how we did for the `foundation.ton` domain.

As a result, we will have the addresses of the nodes. If desired, we can use these addresses to discover additional nodes within the same chain using [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237).

These nodes will also provide us with all the information regarding the blocks.

## 참조

Here is the [link to the original article](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md) - _[Oleg Baranov](https://github.com/xssnick)._ <Feedback />

