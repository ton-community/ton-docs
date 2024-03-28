# Get 方法

:::note
在继续之前，建议读者对[FunC编程语言](/develop/func/overview)和TON区块链上的[智能合约开发](/develop/smart-contracts)有基本的了解。这将有助于您更有效地理解这里提供的信息。
:::

## 介绍

Get方法是智能合约中用于查询特定数据的特殊函数。它们的执行不需要任何费用，并且在区块链之外进行。

这些函数对于大多数智能合约来说都非常常见。例如，默认的[钱包合约](/participate/wallets/contracts)有几个get方法，如`seqno()`、`get_subwallet_id()`和`get_public_key()`。它们被钱包、SDK和API用来获取有关钱包的数据。

## Get 方法的设计模式

### 基本 get 方法设计模式

1. **单一数据点检索**：一种基本设计模式是创建返回合约状态中单个数据点的方法。这些方法没有参数，并返回单个值。

   示例：

   ```func
    int get_balance() method_id {
        return get_data().begin_parse().preload_uint(64);
    }
    ```

2. **聚合数据检索**：另一种常见的模式是创建一次返回合约状态中多个数据点的方法。这通常在某些数据点一起使用时采用。这些在[Jetton](#jettons)和[NFT](#nfts)合约中非常常见。

   示例：

    ```func
    (int, slice, slice, cell) get_wallet_data() method_id {
        return load_data();
    }
    ```

### 高级 get 方法设计模式

1. **计算数据检索**：在某些情况下，需要检索的数据并不直接存储在合约的状态中，而是根据状态和输入参数计算得出的。

   示例：

    ```func
    slice get_wallet_address(slice owner_address) method_id {
        (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
        return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
    }
    ```

2. **条件数据检索**：有时需要检索的数据取决于某些条件，如当前时间。

   示例：

    ```func
    (int) get_ready_to_be_used() method_id {
        int ready? = now() >= 1686459600;
        return ready?;
    }
    ```

## 最常见的 get 方法

### 标准钱包

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

返回特定钱包中交易的序列号。这个方法主要用于[重放保护](/develop/smart-contracts/tutorials/wallet#replay-protection---seqno)。

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

-   [什么是Subwallet ID？](/develop/smart-contracts/tutorials/wallet#what-is-subwallet-id)

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

检索与钱包关联的公钥。

### Jettons

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

这个方法返回与Jetton钱包相关的完整数据集：

-   (int) 余额
-   (slice) 持有者地址
-   (slice) Jetton主合约地址
-   (cell) Jetton钱包代码

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

返回Jetton主合约的数据，包括其总供应量、管理员地址、Jetton内容和钱包代码。

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

根据所有者的地址，此方法计算并返回所有者的Jetton钱包合约地址。

### NFTs

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

返回与非同质化代币相关的数据，包括是否已初始化、在集合中的索引、集合地址、所有者地址和个体内容。

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

返回NFT集合的数据，包括下一个要铸造的项目索引、集合内容和所有者地址。

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

给定索引，此方法计算并返回该集合的相应NFT项目合约地址。

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

获取NFT的版税参数。这些参数包括原始创作者在NFT被出售时应支付的版税百分比。

#### get_nft_content(int index, cell individual_nft_content)

```func
cell get_nft_content(int index, cell individual_nft_content) method_id {
    var (_, _, content, _, _) = load_data();
    slice cs = content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; 离线标签
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}
```

给定索引和[个体NFT内容](#get_nft_data)，此方法获取并返回NFT的常见内容和个体内容。

## 如何使用 get 方法

### 在流行的浏览器上调用 get 方法

#### Tonviewer

您可以在页面底部的"Methods"标签中调用get方法。

-   https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=Methods

#### Ton.cx

您可以在"Get methods"标签中调用get方法。

-   https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### 从代码中调用 get 方法

我们将使用以下Javascript库和工具来提供以下示例：

-   [ton](https://github.com/ton-core/ton)库
-   [Blueprint](/develop/smart-contracts/sdk/javascript) SDK

假设有一个合约，其中有以下get方法：

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

这个方法从合约数据中返回一个单一的数字。

下面的代码片段可以用来在已知地址的某个合约上调用这个get方法：

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

这段代码将输出`Total: 123`。数字可能会有所不同，这只是一个例子。

### 测试 get 方法

对于我们创建的智能合约的测试，我们可以使用[沙盒](https://github.com/ton-community/sandbox)，它默认安装在新的Blueprint项目中。

首先，您需要在合约包装器中添加一个特殊方法，以执行get方法并返回类型化的结果。假设您的合约叫做_Counter_，您已经实现了更新存储数字的方法。那打开`wrappers/Counter.ts`并添加以下方法：

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

它执行get方法并获取结果堆栈。堆栈在get方法的情况下基本上就是它所返回的东西。在这个片段中，我们从中读取一个单一的数字。在更复杂的情况下，一次返回多个值时，您可以多次调用`readSomething`类型的方法来从堆栈中解析整个执行结果。

最后，我们可以在测试中使用这个方法。导航到`tests/Counter.spec.ts`并添加一个新的测试：

```ts
it('应该从get方法返回正确的数字', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

通过在终端运行`npx blueprint test`来检查，如果您做得正确，这个测试应该被标记为通过！

## 从其他合约调用 get 方法

与直觉相反，从其他合约调用get方法在链上是不可能的，主要是由于区块链技术的性质和需要达成共识。

首先，从另一个分片链获取数据可能需要时间。这种延迟可能很容易中断合约执行流程，因为区块链操作需要以确定和及时的方式执行。

其次，达成验证者之间的共识将是有问题的。为了验证交易的正确性，验证者也需要调用相同的get方法。然而，如果目标合约的状态在这些多次调用之间发生变化，验证者可能会得到不同的交易结果版本。

最后，TON中的智能合约被设计为纯函数：对于相同的输入，它们总是产生相同的输出。这一原则使得消息处理过程中的共识变得简单直接。引入运行时获取任意动态变化数据的能力将打破这种确定性属性。

### 对开发者的影响

这些限制意味着一个合约不能通过其get方法直接访问另一个合约的状态。无法在确定性的合约流程中纳入实时外部数据可能看起来有限制。然而，正是这些约束确保了区块链技术的完整性和可靠性。

### 解决方案和变通方法

在TON区块链中，智能合约通过消息进行通信，而不是直接从另一个合约调用方法。向目标合约发送请求执行特定方法的消息。这些请求通常以特殊的[操作码](/develop/smart-contracts/guidelines/internal-messages)开头。

被设计为接受这些请求的合约将执行所需的方法，并在单独的消息中发送结果。虽然这可能看起来很复杂，但它实际上简化了合约之间的通信，并提高了区块链网络的可扩展性和性能。

这种消息传递机制是TON区块链运作的一个整体部分，为可扩展网络增长铺平了道路，而无需在分片之间进行广泛的同步。

为了有效的合约间通信，至关重要的是您的合约被设计为正确接受和响应请求。这包括指定可以在链上调用以返回响应的方法。

让我们考虑一个简单的例子：

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

在这个示例中，合约接收并处理内部消息，通过解读操作码、执行特定方法和适当地返回响应：

-   操作码`1`表示更新合约数据中的数字的请求。
-   操作码`2`表示从合约数据中查询数字的请求。
-   操作码`3`用于响应消息，发起调用的智能合约必须处理以接收结果。

为了简单起见，我们只是使用了简单的小数字1、2和3作为操作码。但对于真实项目，请根据标准设置它们：

-   [用于操作码的CRC32哈希](/develop/data-formats/crc32)

## 常见陷阱及如何避免

1. **误用 get 方法**：如前所述，get方法被设计用于从合约的状态返回数据，不是用来更改合约的状态。尝试在get方法中更改合约的状态实际上不会这样做。

2. **忽略返回类型**：每个get方法都应该有一个明确定义的返回类型，与检索的数据相匹配。如果一个方法预期返回特定类型的数据，请确保该方法的所有路径都返回此类型。避免使用不一致的返回类型，因为这可能导致与合约交互时出现错误和困难。

3. **假设跨合约调用**：一个常见的误解是可以从链上的其他合约调用get方法。然而，如我们所讨论的，这是不可能的，因为区块链技术的性质和需要达成共识的需求。始终记住，get方法旨在链下使用，合约间的链上交互是通过内部消息完成的。

## 结论

Get方法是TON区块链中查询智能合约数据的重要工具。尽管它们有其局限性，但了解这些限制并知道如何克服它们是有效使用智能合约中的get方法的关键。
