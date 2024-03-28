# 区块随机 seed 的生成

:::caution
此信息在撰写时是最新的。它可能会在任何网络升级时发生变化。
:::

偶尔，在TON上会创建一个彩票合约。通常它使用不安全的方法来处理随机性，因此生成的值可以被用户预测，彩票可能被耗尽。

但是，利用随机数生成中的弱点通常涉及使用代理合约，如果随机值正确，代理合约会转发消息。存在有关钱包合约的提案，这些合约将能够执行链上任意代码（当然由用户指定和签名），但大多数流行的钱包版本不支持这样做。那么，如果彩票检查赌徒是否通过钱包合约参与，它是否安全？

或者，这个问题可以这样表述。外部消息能否被包含在随机值正好符合发送者需求的区块中？

当然，发送者无法以任何方式影响随机性。但是生成区块并包含提议的外部消息的验证者可以。

## 验证者如何影响seed

即使在白皮书中，关于这一点的信息也不多，所以大多数开发者都感到困惑。这是关于区块随机的唯一提及，在 [TON白皮书](https://docs.ton.org/ton.pdf) 中：

> 为每个分片(w, s)选择验证者任务组的算法是确定性伪随机的。**它使用验证者嵌入到每个主链区块中的伪随机数（通过使用阈值签名达成共识）来创建随机seed**，然后为每个验证者计算例如Hash(code(w). code(s).validator_id.rand_seed)。

然而，唯一被保证真实且最新的是代码。所以让我们看看 [collator.cpp](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/validator/impl/collator.cpp#L1590)：

```cpp
  {
    // 生成随机seed
    prng::rand_gen().strong_rand_bytes(rand_seed->data(), 32);
    LOG(DEBUG) << "block random seed set to " << rand_seed->to_hex();
  }
```

这是生成区块随机seed的代码。它位于协作者代码中，因为它由生成区块的一方需要（并且对轻量级验证者不是必需的）。

所以，我们可以看到，seed是由单个验证者或协作者与区块一起生成的。下一个问题是：

## 在知道seed后是否可以决定包含外部消息？

是的，可以。证据如下：如果外部消息被导入，它的执行必须成功。执行可以依赖于随机值，所以保证seed事先已知。

因此，如果发送者可以与验证者合作，那么确实**存在**一种方法来攻击"不安全"（让我们称之为单区块，因为它不使用发送消息后的任何区块信息）随机。即使使用了`randomize_lt()`。验证者可以生成适合发送者的seed，或者将提议的外部消息包含在将满足所有条件的区块中。这样做的验证者仍然被认为是公平的。这就是去中心化的本质。

为了让这篇文章完全覆盖随机性，这里还有一个问题。

## 区块seed如何影响合约中的随机数？

验证者生成的seed并不直接用于所有合约。相反，它是[与账户地址一起哈希](https://github.com/ton-blockchain/ton/blob/f59c363ab942a5ddcacd670c97c6fbd023007799/crypto/block/transaction.cpp#L876)的。

```cpp
bool Transaction::prepare_rand_seed(td::BitArray<256>& rand_seed, const ComputePhaseConfig& cfg) const {
  // 我们可能使用 SHA256(block_rand_seed . addr . trans_lt)
  // 但实际上，我们使用 SHA256(block_rand_seed . addr)
  // 如果智能合约想进一步随机化，它可以使用 RANDOMIZE 指令
  td::BitArray<256 + 256> data;
  data.bits().copy_from(cfg.block_rand_seed.cbits(), 256);
  (data.bits() + 256).copy_from(account.addr_rewrite.cbits(), 256);
  rand_seed.clear();
  data.compute_sha256(rand_seed);
  return true;
}
```

然后，伪随机数是使用 [TVM指令](/learn/tvm-instructions/instructions#112-pseudo-random-number-generator-primitives) 页面上描述的过程生成的：

> **x{F810} RANDU256**  
> 生成一个新的伪随机无符号256位整数x。算法如下：如果r是随机seed的旧值，被视为一个32字节的数组（通过构造无符号256位整数的大端表示），那么计算它的sha512(r)；这个哈希的前32字节被存储为随机seed的新值r'，剩余的32字节作为下一个随机值x返回。

我们可以通过查看 [准备c7合约](https://github.com/ton-blockchain/ton/blob/master/crypto/block/transaction.cpp#L903) 的代码（c7是存储临时数据的元组，存储合约地址、起始余额、随机seed等）和 [随机值本身的生成](https://github.com/ton-blockchain/ton/blob/master/crypto/vm/tonops.cpp#L217-L268) 来确认这一点。

## 结论

TON中没有随机是完全安全的，就不可预测性而言。这意味着**这里不可能存在完美的彩票**，也不可能相信任何彩票是公平的。

PRNG的典型用途可能包括`randomize_lt()`，但是可以通过选择正确的区块向它发送消息来欺骗这样的合约。提出的解决方案是向其他工作链发送消息，接收回答，从而跳过区块等...但这只是推迟了威胁。事实上，任何验证者（即TON区块链的1/250）都可以在正确的时间选择发送请求给彩票合约，以便来自其他工作链的回复在他生成的区块中到达，然后他可以选择他希望的任何区块seed。一旦协作者出现在主网，危险将会增加，因为他们永远不会因为标准投诉而被罚款，因为他们不会向Elector合约注入任何资金。

<!-- TODO: 找到一个使用随机而没有任何添加的示例合约，展示如何知道区块随机seed找到RANDU256的结果（意味着dton.io上的链接来显示生成的值） -->

<!-- TODO: 下一篇文章。"让我们继续编写利用这一点的工具。它将附加到验证者上，并将提议的外部消息放在满足某些条件的区块中 - 前提是支付了一些费用。" -->
