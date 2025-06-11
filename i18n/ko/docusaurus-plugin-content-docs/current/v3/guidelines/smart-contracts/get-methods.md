import Feedback from '@site/src/components/Feedback';

# Get methods

:::note
To fully benefit from this content, readers must understand the [FunC programming language](/v3/documentation/smart-contracts/func/overview/) on the TON Blockchain. This knowledge is crucial for grasping the information presented here.
:::

## 소개

Get methods are special functions in smart contracts that allow you to query specific data. Their execution doesn't cost any fees and happens outside of the blockchain.

These functions are widespread in most smart contracts. For example, the default [Wallet contract](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts/) has several get methods, such as `seqno()`, `get_subwallet_id()` and `get_public_key()`. Wallets, SDKs, and APIs use them to fetch data about wallets.

## get 메서드에 대한 디자인 패턴

### 기본 get 메서드 디자인 패턴

1. **Single data point retrieval**: A fundamental design pattern is to create methods that return individual data points from the contract's state. These methods have no parameters and return a single value.

예시:

```func
int get_balance() method_id {
return get_data().begin_parse().preload_uint(64);
}
```

2. **Aggregate data retrieval**: Another common method is to create methods that gather multiple pieces of data from a contract's state in one call. This is useful when specific data points are often used together. You can see this approach frequently in [Jetton](#jettons) and [NFT](#nfts) contracts.

예시:

```func
(int, slice, slice, cell) get_wallet_data() method_id {
return load_data();
}
```

### 고급 가져오기 메서드 디자인 패턴

1. **Computed data retrieval**: In some cases, the data that needs to be retrieved isn't stored directly in the contract's state but calculated based on the state and the input arguments.

예시:

```func
slice get_wallet_address(slice owner_address) method_id {
(int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

2. **Conditional data retrieval**: Sometimes, the data that needs to be retrieved depends on certain conditions, such as the current time.

예시:

```func
(int) get_ready_to_be_used() method_id {
int ready? = now() >= 1686459600;
return ready?;
}
```

## 가장 일반적인 가져오기 방법

### 표준 지갑

#### seqno()

```func
int seqno() method_id {
 return get_data().begin_parse().preload_uint(32);
}
```

Returns the transaction's sequence number within a specific wallet. This method is primarily used for [replay protection](/v3/guidelines/smart-contracts/howto/wallet#replay-protection---seqno/).

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
 return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

- [What is subwallet ID?](/v3/guidelines/smart-contracts/howto/wallet#subwallet-ids/)

#### get_public_key()

```func
int get_public_key() method_id {
 var cs = get_data().begin_parse().skip_bits(64);
 return cs.preload_uint(256);
}
```

This method retrieves the public key associated with the wallet.

### Jettons

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
 return load_data();
}
```

이 메서드는 제튼 지갑과 관련된 전체 데이터 집합을 반환합니다:

- (int) balance
- (슬라이스) 소유자_주소
- (slice) jetton_master_address
- (셀) 제튼_월렛_코드

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
 (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
 return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

총 공급량, 관리자 주소, 제트톤의 내용, 지갑 코드 등 제트톤 마스터의 데이터를 반환합니다.

#### get_wallet_address(슬라이스 소유자 주소)

```func
slice get_wallet_address(slice owner_address) method_id {
 (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
 return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

Given the owner's address, this method calculates and returns the address for the owner's jetton wallet contract.

### NFT

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
 (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
 return (init?, index, collection_address, owner_address, content);
}
```

Returns the data associated with a non-fungible token, including whether it has been initialized, its index in a collection, the address of its collection, the owner's address, and its content.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
 var (owner_address, next_item_index, content, _, _) = load_data();
 slice cs = content.begin_parse();
 return (next_item_index, cs~load_ref(), owner_address);
}
```

Returns the data of an NFT collection, including the index of the next item available for minting, the content of the collection, and the owner's address.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
 var (_, _, _, nft_item_code, _) = load_data();
 cell state_init = calculate_nft_item_state_init(index, nft_item_code);
 return calculate_nft_item_address(workchain(), state_init);
}
```

Given an index, this method calculates and returns the corresponding NFT item contract address within this collection.

#### 로열티_파라미터()

```func
(int, int, slice) royalty_params() method_id {
 var (_, _, _, _, royalty) = load_data();
 slice rs = royalty.begin_parse();
 return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

This method fetches the royalty parameters for an NFT. These parameters include the royalty percentage paid to the original creator whenever the NFT is sold.

#### get_nft_content(int index, cell individual_nft_content)

```func
cell get_nft_content(int index, cell individual_nft_content) method_id {
 var (_, _, content, _, _) = load_data();
 slice cs = content.begin_parse();
 cs~load_ref();
 slice common_content = cs~load_ref().begin_parse();
 return (begin_cell()
 .store_uint(1, 8) ;; offchain tag
 .store_slice(common_content)
 .store_ref(individual_nft_content)
 .end_cell());
}
```

Given an index and [individual NFT content](#get_nft_data), this method fetches and returns the NFT's combined common and individual content.

## get 메서드로 작업하는 방법

### 인기 탐색기에서 get 메서드 호출하기

#### 톤뷰어

You can call get methods at the bottom of the page in the **Methods** tab.

- https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method

#### Ton.cx

'메서드 가져오기' 탭에서 메서드를 호출할 수 있습니다.

- https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### 코드에서 get 메서드 호출하기

아래 예제에서는 자바스크립트 라이브러리와 도구를 사용하겠습니다:

- [ton](https://github.com/ton-org/ton/) library
- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript/)

다음과 같은 get 메서드를 사용하는 계약이 있다고 가정해 보겠습니다:

```func
(int) get_total() method_id {
 return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

이 메서드는 컨트랙트 데이터에서 로드된 단일 숫자를 반환합니다.

You can use the code snippet below to call this get method on a contract deployed at a known address:

```ts
import { TonClient } from "@ton/ton";
import { Address } from "@ton/core";

async function main() {
  // Create Client
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });

  // Call get method
  const result = await client.runMethod(
    Address.parse("EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k"),
    "get_total"
  );
  const total = result.stack.readNumber();
  console.log("Total:", total);
}

main();
```

This code will produce an output in the format `Total: 123`. The number may vary, as this is just an example.

### get 메서드 테스트

We can use the [Sandbox](https://github.com/ton-community/sandbox/) to test smart contracts, which is installed by default in new Blueprint projects.

First, you must add a special method in the contract wrapper to execute the get method and return the typed result. Let's say your contract is called _Counter_, and you have already implemented the method to update the stored number. Open `wrappers/Counter.ts` and add the following method:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

It executes the get method and retrieves the resulting stack. In this snippet, we read a single number from the stack. In more complex cases where multiple values are returned at once, you can simply call the `readSomething` type of method multiple times to parse the entire execution result from the stack.

마지막으로 이 메서드를 테스트에 사용할 수 있습니다. 'tests/Counter.spec.ts'로 이동하여 새 테스트를 추가합니다:

```ts
it("should return correct number from get method", async () => {
  const caller = await blockchain.treasury("caller");
  await counter.sendNumber(caller.getSender(), toNano("0.01"), 123);
  expect(await counter.getTotal()).toEqual(123);
});
```

You can check it by running `npx blueprint test` in your terminal. If you did everything correctly, this test should be marked as passed!

## 다른 컨트랙트에서 get 메서드 호출하기

Contrary to what might seem intuitive, invoking get methods from other contracts is impossible on-chain. This limitation stems primarily from the nature of blockchain technology and the need for consensus.

First, acquiring data from another ShardChain may introduce significant latency. Such delays could disrupt the contract execution flow, as blockchain operations are designed to execute in a deterministic and timely manner.

Second, achieving consensus among validators would be problematic. Validators would also need to invoke the same get method to verify a transaction's correctness. However, if the state of the target contract changes between these multiple invocations, validators could end up with differing versions of the transaction result.

Lastly, smart contracts in TON are designed to be pure functions: they will always produce the same output for the same input. This principle allows for straightforward consensus during message processing. Introducing runtime acquisition of arbitrary, dynamically changing data would break this deterministic property.

### 개발자를 위한 시사점

These limitations mean that one contract cannot directly access the state of another contract via its get methods. While the inability to incorporate real-time, external data into a contract's deterministic flow might seem restrictive, it is precisely these constraints that ensure the integrity and reliability of blockchain technology.

### Solutions and workarounds

In the TON Blockchain, smart contracts communicate through messages rather than directly invoking methods from one another. One can send a message to another contract requesting the execution of a specific method. These requests usually begin with special [operation codes](/v3/documentation/smart-contracts/message-management/internal-messages/).

A contract designed to handle such requests will execute the specified method and return the results in a separate message. While this approach may seem complex, it effectively streamlines communication between contracts, enhancing the scalability and performance of the blockchain network.

This message-passing mechanism is integral to the TON Blockchain's operation, paving the way for scalable network growth without requiring extensive synchronization between shards.

For effective inter-contract communication, it is crucial to design your contracts so that they can properly accept and respond to requests. This involves implementing methods that can be invoked on-chain to return responses.

간단한 예를 들어 보겠습니다:

```func
#include "imports/stdlib.fc";

int get_total() method_id {
 return get_data().begin_parse().preload_uint(32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
 if (in_msg_body.slice_bits() < 32) {
 return ();
 }

 slice cs = in_msg_full.begin_parse();
 cs~skip_bits(4);
 slice sender = cs~load_msg_addr();

 int op = in_msg_body~load_uint(32); ;; load the operation code

 if (op == 1) { ;; increase and update the number
 int number = in_msg_body~load_uint(32);
 int total = get_total();
 total += number;
 set_data(begin_cell().store_uint(total, 32).end_cell());
 }
 elseif (op == 2) { ;; query the number
 int total = get_total();
 send_raw_message(begin_cell()
 .store_uint(0x18, 6)
 .store_slice(sender)
 .store_coins(0)
 .store_uint(0, 107) ;; default message headers (see sending messages page)
 .store_uint(3, 32) ;; response operation code
 .store_uint(total, 32) ;; the requested number
 .end_cell(), 64);
 }
}
```

이 예시에서 컨트랙트는 연산 코드를 해석하고, 특정 메서드를 실행하고, 적절하게 응답을 반환하여 내부 메시지를 수신하고 처리합니다:

- 연산 코드 `1`은 컨트랙트 데이터의 번호를 업데이트하라는 요청을 나타냅니다.
- 연산 코드 `2`는 컨트랙트 데이터에서 번호를 쿼리하라는 요청을 의미합니다.
- Op-code `3` is used in the response message, which the calling smart contract must handle to receive the result.

For simplicity, we used just simple little numbers 1, 2, and 3 for the operation codes. But for real projects, consider setting them according to the standard:

- [CRC32 Hashes for op-codes](/v3/documentation/data-formats/tlb/crc32/)

## 일반적인 함정과 이를 피하는 방법

1. **Misuse of get methods**: As mentioned earlier, get methods are designed to return data from the contract's state and are not meant to change the contract's state. Attempting to alter the contract's state within a get method will not do it.

2. **Ignoring return types**: Every get method must have a clearly defined return type that matches the retrieved data. If a method is expected to return a specific type of data, ensure that all execution paths within the method return this type. Inconsistent return types should be avoided, as they can lead to errors and complications when interacting with the contract.

3. **Assuming cross-contract calls**: A common misconception is that get methods can be called directly from other contracts on-chain. However, as previously discussed, this is not possible due to the inherent nature of blockchain technology and the requirement for consensus. Always remember that get methods are designed for off-chain use, while on-chain interactions between contracts are facilitated through internal messages.

## 결론

Get methods are vital for querying data from smart contracts on the TON Blockchain. While they have certain limitations, understanding these constraints and learning how to work around them is crucial for effectively utilizing get methods in your smart contracts.

## See also

- [Writing tests examples](/v3/guidelines/smart-contracts/testing/writing-test-examples/)

<Feedback />

