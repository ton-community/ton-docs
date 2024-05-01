# 随机数生成

生成随机数是许多不同项目中常见的任务。你可能已经在FunC文档中看到过`random()`函数，但请注意，除非你采用一些额外的技巧，否则其结果很容易被预测。

## 如何预测随机数？

计算机在生成随机信息方面非常糟糕，因为它们只是遵循用户的指令。然而，由于人们经常需要随机数，他们设计了各种方法来生成_伪随机_数。

这些算法通常要求你提供一个_seed_值，该值将被用来生成一系列_伪随机_数。因此，如果你多次运行相同的程序并使用相同的_seed_，你将始终得到相同的结果。在TON中，每个区块的_seed_是不同的。

-   [区块随机seed的生成](/develop/smart-contracts/security/random)

因此，要预测智能合约中`random()`函数的结果，你只需要知道当前区块的`seed`，如果你不是验证者，这是不可能的。

## 只需使用`randomize_lt()`

为了使随机数生成不可预测，你可以将当前的[逻辑时间](/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)添加到seed中，这样不同的交易将具有不同的seed和结果。

只需在生成随机数之前调用`randomize_lt()`，你的随机数就会变得不可预测：

```func
randomize_lt();
int x = random(); ;; 用户无法预测这个数字
```

然而，你应该注意验证者或协作者仍然可能影响随机数的结果，因为他们决定了当前区块的seed。

## 有没有办法防止验证者操纵？

为了防止（或至少复杂化）验证者替换seed，你可以使用更复杂的方案。例如，你可以在生成随机数之前跳过一个区块。如果我们跳过一个区块，seed将以不太可预测的方式改变。

跳过区块并不是一个复杂的任务。你可以通过简单地将消息发送到主链，然后再发送回你合约的工作链来完成。让我们来看一个简单的例子！

:::caution
不要在真实项目中使用此示例合约，请自己编写。
:::

### 任何工作链中的主合约

让我们以一个简单的彩票合约为例。用户将向它发送1 TON，有50%的机会会得到2 TON回报。

```func
;; 设置回声合约地址
const echo_address = "Ef8Nb7157K5bVxNKAvIWreRcF0RcUlzcCA7lwmewWVNtqM3s"a;

() recv_internal (int msg_value, cell in_msg_full, slice in_msg_body) impure {
    var cs = in_msg_full.begin_parse();
    var flags = cs~load_uint(4);
    if (flags & 1) { ;; 忽略弹回的消息
        return ();
    }
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32);
    if ((op == 0) & equal_slice_bits(in_msg_body, "bet")) { ;; 用户下注
        throw_unless(501, msg_value == 1000000000); ;; 1 TON

        send_raw_message(
            begin_cell()
                .store_uint(0x18, 6)
                .store_slice(echo_address)
                .store_coins(0)
                .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息头部（见发送消息页面）


                .store_uint(1, 32) ;; 让1成为我们合约中的回声操作码
                .store_slice(sender) ;; 转发用户地址
            .end_cell(),
            64 ;; 发送剩余的消息值
        );
    }
    elseif (op == 1) { ;; 回声
        throw_unless(502, equal_slice_bits(sender, echo_address)); ;; 只接受我们回声合约的回声

        slice user = in_msg_body~load_msg_addr();

        {-
            此时我们已经跳过了1+个区块
            因此让我们生成随机数
        -}
        randomize_lt();
        int x = rand(2); ;; 生成一个随机数（0或1）
        if (x == 1) { ;; 用户赢了
            send_raw_message(
                begin_cell()
                    .store_uint(0x18, 6)
                    .store_slice(user)
                    .store_coins(2000000000) ;; 2 TON
                    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; 默认消息头部（见发送消息页面）
                .end_cell(),
                3 ;; 忽略错误并单独支付费用
            );
        }
    }
}
```

在你需要的任何工作链（可能是基本链）部署这个合约，就完成了！

## 这种方法100%安全吗？

虽然它确实有所帮助，但如果入侵者同时控制了几个验证者，仍然有可能被操纵。在这种情况下，他们可能会以某种概率[影响](/develop/smart-contracts/security/random#conclusion)依赖的_seed_。即使这种可能性极小，仍然值得考虑。

随着最新的TVM升级，向`c7`寄存器中引入新值可以进一步提高随机数生成的安全性。具体来说，升级在`c7`寄存器中添加了关于最近16个主链区块的信息。

由于主链区块信息的不断变化性质，它可以作为随机数生成的额外熵源。通过将这些数据纳入你的随机算法中，你可以创建出更难以被潜在对手预测的数字。

有关此TVM升级的更多详细信息，请参考[TVM升级](/learn/tvm-instructions/tvm-upgrade-2023-07)。
