# Precompiled Contracts
*Precompiled smart contract* is a contract with a C++ implementation in node.
When a validator runs a transaction on such smart contract, it can execute this implementation instead of TVM.
This improves performance and allows to reduce computation fees.

## Config
The list of precompiled contracts is stored in the masterchain config:
```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

`list:(HashmapE 256 PrecompiledSmc)` is a map `(code_hash -> precomplied_smc)`.
If the code hash of a contract is found in this map then the contract is considered *precompiled*.

## Contract execution
Any transaction on a *precompiled smart contract* (i.e. any contract with code hash found in `ConfigParam 45`) is executed in as follows:
1. Get `gas_usage` from the masterchain config.
2. If the balance is not enough to pay for `gas_usage` gas then the compute phase fails with skip reason `cskip_no_gas`.
3. Code can be executed in two ways:
  1. If the precompiled execution is disabled or the C++ implementation is not available in the current version of the node then TVM runs as usual. Gas limit for TVM is set to the transaction gas limit (1M gas).
  2. If the precompiled implementation is enabled and available then the C++ implementation is executed.
4. Override [compute phase values](https://github.com/ton-blockchain/ton/blob/dd5540d69e25f08a1c63760d3afb033208d9c99b/crypto/block/block.tlb#L308): set `gas_used` to `gas_usage`; set `vm_steps`, `vm_init_state_hash`, `vm_final_state_hash` to zero.
5. Computation fees are based on `gas_usage`, not the actual TVM gas usage.

When precompiled contract is executed in TVM, the 17th element of `c7` is set to `gas_usage` and can be retrieved by `GETPRECOMPILEDGAS` instruction. For non-precompiled contracts this value is `null`.

The execution of precompiled contracts is disabled by default. Run `validator-engine` with `--enable-precompiled-smc` flag to enable it.

Note that both ways to execute a precompiled contract yield the same transaction.
Therefore, validators with and without C++ implementation can safely co-exist in the network.
This allows adding new entries to `ConfigParam 45` without requiring all validators to update node software immediately.

## Available implementations
Hic sunt dracones.

## See Also
- [Governance Contracts](/v3/documentation/smart-contracts/contracts-specs/governance)
