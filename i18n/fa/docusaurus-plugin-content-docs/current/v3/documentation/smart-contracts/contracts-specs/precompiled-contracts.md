import Feedback from '@site/src/components/Feedback';

# Precompiled contracts

A _precompiled smart contract_ is a contract with a C++ implementation in the node. When a validator processes a transaction for such a contract, it can execute this native implementation instead of TVM. This improves performance and reduces computation fees.

## Config

The list of precompiled contracts is stored in the masterchain configuration:

```
precompiled_smc#b0 gas_usage:uint64 = PrecompiledSmc;
precompiled_contracts_config#c0 list:(HashmapE 256 PrecompiledSmc) = PrecompiledContractsConfig;
_ PrecompiledContractsConfig = ConfigParam 45;
```

The `list:(HashmapE 256 PrecompiledSmc)` represents a mapping of `(code_hash -> precompiled_smc)`. A contract is considered _precompiled_ if its code hash exists in this map.

## Contract execution

Transactions for precompiled smart contracts (those with code hashes in `ConfigParam 45`) follow this execution flow:

1. Retrieve the `gas_usage` value from the masterchain config
2. If the contract balance cannot cover the `gas_usage` cost, the compute phase fails with `cskip_no_gas`
3. Execution proceeds via one of two paths:
   - **TVM execution**: Used if precompiled execution is disabled or the C++ implementation is unavailable in the node version. TVM runs with a 1M gas limit.
   - **Native execution**: Used when precompiled implementation is both enabled and available, executing the C++ code directly
4. Compute phase values are overridden:
   - `gas_used` set to `gas_usage`
   - `vm_steps`, `vm_init_state_hash`, and `vm_final_state_hash` set to zero
5. Computation fees are calculated based on `gas_usage` rather than actual TVM gas consumption

For precompiled contracts executed in TVM, the 17th element of `c7` contains the `gas_usage` value (accessible via `GETPRECOMPILEDGAS`). Non-precompiled contracts return `null` for this value.

**Note**: Enable precompiled contract execution by running `validator-engine` with the `--enable-precompiled-smc` flag. Both execution methods produce identical transactions, allowing validators with and without C++ implementations to coexist in the network. This enables gradual adoption when adding new entries to `ConfigParam 45`.

## Available implementations

Hic sunt dracones.

## See also

- [Governance contracts](/v3/documentation/smart-contracts/contracts-specs/governance)

<Feedback />

