# 预编译合约

*预编译智能合约*是在节点中使用 C++ 实现的合约。
当验证器在这种智能合约上运行交易时，它可以执行这种实现，而不是 TVM。
这样可以提高性能，减少计算费用。

## 配置

预编译合约列表存储在主链配置中：

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

`list:(HashmapE 256 PrecompiledSmc)` 是一个映射 `(code_hash -> precomplied_smc)`。
如果在这个映射中找到了合约的代码哈希值，那么该合约就被视为*预编译*。

## 合约执行

*预编译智能合约*（即代码哈希值在 `ConfigParam 45` 中找到的任何合约）上的任何交易都会以如下方式执行：

1. 从主链配置中获取 `gas_usage` 。
2. 如果余额不足以支付 `gas_usage` gas ，则计算阶段失败，跳过原因为 `cskip_no_gas`。
3. 代码有两种执行方式：
4. 如果禁用了预编译执行或当前版本的节点中没有 C++ 实现，则 TVM 将照常运行。TVM 的 gas 限制设置为事务 gas 限制（1M  gas ）。
5. 如果预编译实现已启用且可用，则执行 C++ 实现。
6. 覆盖 [计算相位值](https://github.com/ton-blockchain/ton/blob/dd5540d69e25f08a1c63760d3afb033208d9c99b/crypto/block/block.tlb#L308)：将 `gas_used` 设为 `gas_usage`；将 `vm_steps`、`vm_init_state_hash`、`vm_final_state_hash` 设为零。
7. 计算费用基于  `gas_usage`，而非 TVM 的实际用气量。

在 TVM 中执行预编译合约时，`c7` 的第 17 个元素被设置为  `gas_usage`，可通过 "GETPRECOMPILEDGAS "指令检索。对于非预编译合约，该值为 `null`。

预编译合约的执行默认为禁用。使用 `--enable-precompiled-smc`标记运行 `validator-engine` 可启用它。

请注意，执行预编译合约的两种方式都会产生相同的事务。
因此，有 C++ 实现和没有 C++ 实现的验证器都可以安全地在网络中并存。
这样就可以向 `ConfigParam 45` 添加新条目，而无需所有验证器立即更新节点软件。

## 现有实施方案

Hic sunt dracones.

## 另请参见

- [治理合约](/v3/documentation/smart-contracts/contracts-specs/governance)
