# Get Methods

:::note
Before proceeding, it is recommended that readers have a basic understanding of the [FunC programming language](/v3/documentation/smart-contracts/func/overview) on TON Blockchain. This will help you grasp the information provided here more effectively.
:::

## Introduction

Get methods are special functions in smart contracts that are made for querying specific data from them. Their execution doesn't cost any fees and happens outside of the blockchain.

These functions are very common for most smart contracts. For example, the default [Wallet contract](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) has several get methods, such as `seqno()`, `get_subwallet_id()` and `get_public_key()`. They are used by wallets, SDKs and APIs to fetch data about wallets.

## Design patterns for get methods

### Basic get methods design patterns

1. **Single data point retrieval**: A basic design pattern is to create methods that return individual data points from the contract's state. These methods have no parameters and return a single value.

    Example:

    ```func
    int get_balance() method_id {
        return get_data().begin_parse().preload_uint(64);
    }
    ```

2. **Aggregate data retrieval**: Another common pattern is to create methods that return multiple data points from the contract's state in a single call. This is often used when certain data points are commonly used together. These are commonly used in [Jetton](#jettons) and [NFT](#nfts) contracts.

    Example:

    ```func
    (int, slice, slice, cell) get_wallet_data() method_id {
        return load_data();
    }
    ```

### Advanced get methods design patterns

1. **Computed data retrieval**: In some cases, the data that needs to be retrieved isn't stored directly in the contract's state, but instead is calculated based on the state and the input arguments.

    Example:

    ```func
    slice get_wallet_address(slice owner_address) method_id {
        (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
        return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
    }
    ```

2. **Conditional data retrieval**: Sometimes, the data that needs to be retrieved depends on certain conditions, such as current time.

    Example:

    ```func
    (int) get_ready_to_be_used() method_id {
        int ready? = now() >= 1686459600;
        return ready?;
    }
    ```

## Most common get methods

### Standard wallets

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

Returns the sequence number of the transaction within a specific wallet. This method is primarily used for [replay protection](/v3/guidelines/smart-contracts/howto/wallet#replay-protection---seqno).

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

-   [What is Subwallet ID?](/v3/guidelines/smart-contracts/howto/wallet#subwallet-ids)

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

Retrieves the public key associated with the wallet.

### Jettons

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

This method returns the complete set of data associated with a jetton wallet:

-   (int) balance
-   (slice) owner_address
-   (slice) jetton_master_address
-   (cell) jetton_wallet_code

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

Returns data of a jetton master, including its total supply, the address of its admin, the content of the jetton, and its wallet code.

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

Given the address of the owner, this method calculates and returns the address for the owner's jetton wallet contract.

### NFTs

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

Returns the data associated with a non-fungible token, including whether it has been initialized, its index in a collection, the address of its collection, the owner's address, and its individual content.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

Returns the data of a NFT collection, including the index of the next item to mint, the content of the collection and the owner's address.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

Given an index, this method calculates and returns the address of the corresponding NFT item contract of this collection.

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

Fetches the royalty parameters for an NFT. These parameters include the royalty percentage, which is paid to the original creator whenever the NFT is sold.

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

Given an index and [individual NFT content](#get_nft_data), this method fetches and returns the combined common and individual content of the NFT.

## How to work with get methods

### Calling get methods on popular explorers

#### Tonviewer

You can call get methods on the bottom of the page in the "Methods" tab.

-   https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=Methods

#### Ton.cx

You can call get methods on the "Get methods" tab.

-   https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### Calling get methods from code

We will use Javascript libraries and tools for the examples below:

-   [ton](https://github.com/ton-core/ton) library
-   [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) SDK

Let's say there is some contract with the following get method:

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

This method returns a single number loaded from the contract data.

The code snippet below can be used to call this get method on some contract deployed at the known address:

```ts
import { Address, TonClient } from 'ton';

async function main() {
    // Create Client
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    // Call get method
    const result = await client.runMethod(
        Address.parse('EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k'),
        'get_total'
    );
    const total = result.stack.readNumber();
    console.log('Total:', total);
}

main();
```

This code will result `Total: 123` output. The number can be different, this is just an example.

### Testing get methods

For testing smart contracts created we can use the [Sandbox](https://github.com/ton-community/sandbox) which is installed by default in new Blueprint projects.

At first, you need to add a special method in contract wrapper that will execute the get method and return the typed result. Let's say your contract is called _Counter_ and you have already implemented the method that updates the stored number. Open `wrappers/Counter.ts` and add the following method:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

It executed the get method and fetches the resulting stack. The stack in case with get methods is basically what it did return. In this snippet, we read a single number from it. In more complex cases with several values returned at once, you can just call the `readSomething` type of methods several times to parse the whole execution result from stack.

Finally, we can use this method in our tests. Navigate to the `tests/Counter.spec.ts` and add a new test:

```ts
it('should return correct number from get method', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

Check it by running `npx blueprint test` in your terminal and if you did everything correct, this test should be marked as passed!

## Invoking get methods from other contracts

Contrary to what might seem intuitive, invoking get methods from other contracts is not possible on-chain, primarily due to the nature of blockchain technology and the need for consensus.

Firstly, acquiring data from another shardchain may require time. Such latency could easily disrupt contract execution flow, as blockchain operations are expected to execute in a deterministic and timely manner.

Secondly, achieving consensus among validators would be problematic. In order for validators to verify the correctness of a transaction, they would also need to invoke the same get method. However, if the state of the target contract changes between these multiple invocations, validators could end up with differing versions of the transaction result.

Lastly, smart contracts in TON are designed to be pure functions: for the same input, they will always produce the same output. This principle allows for straightforward consensus during message processing. Introducing runtime acquisition of arbitrary, dynamically changing data would break this deterministic property.

### Implications for developers

These limitations imply that one contract cannot directly access the state of another contract via its get methods. The inability to incorporate real-time, external data in the deterministic flow of a contract might appear restrictive. However, it is these very constraints that ensure the integrity and reliability of blockchain technology.

### Solutions and Workarounds

In the TON Blockchain, smart contracts communicate via messages, instead of directly invoking methods from another contract. A message requesting execution of a specific method can be sent to a targeted contract. These requests typically start with special [operation codes](/v3/documentation/smart-contracts/message-management/internal-messages).

A contract designed to accept these requests will execute the desired method and send the results back in a separate message. While this might seem complex, it actually streamlines communication between contracts, and enhances the blockchain network's scalability and performance.

This message-passing mechanism is integral to the TON Blockchain's operation, paving the way for scalable network growth without the need for extensive synchronization between shards.

For effective inter-contract communication, it's essential that your contracts are designed to correctly accept and respond to requests. This includes specifying methods that can be invoked on-chain to return responses.

Let's consider a simple example:

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

In this example, the contract receives and processes internal messages by interpreting operation codes, executing specific methods, and returning responses appropriately:

-   Op-code `1` denotes a request to update the number in the contract's data.
-   Op-code `2` signifies a request to query the number from the contract's data.
-   Op-code `3` is used in the response message, which the calling smart contract must handle in order to receive the result.

For the simplicity, we used just simple little numbers 1, 2 and 3 for the operation codes. But for real projects, consider setting them according to the standard:

-   [CRC32 Hashes for op-codes](/v3/documentation/data-formats/tlb/crc32)

## Common pitfalls and how to avoid them

1. **Misuse of get methods**: As mentioned earlier, get methods are designed to return data from the contract's state and are not meant to change the state of the contract. Attempting to alter the contract's state within a get method won't actually do it.

2. **Ignoring return types**: Every get method should have a clearly defined return type that matches the data being retrieved. If a method is expected to return a specific type of data, ensure that all paths within the method return this type. Avoid using inconsistent return types, as this can lead to errors and difficulties when interacting with the contract.

3. **Assuming cross-contract calls**: A common misconception is that get methods can be called from other contracts on-chain. However, as we've discussed, this is not possible due to the nature of blockchain technology and the need for consensus. Always remember that get methods are intended to be used off-chain, and on-chain interactions between contracts are done through internal messages.

## Conclusion

Get methods are an essential tool for querying data from smart contracts in the TON Blockchain. Although they have their limitations, understanding these restrictions and knowing how to work around them is key to effectively using get methods in your smart contracts.
