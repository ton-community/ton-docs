import Feedback from '@site/src/components/Feedback';

# MyTonCtrl errors

## Overview

This document explains the errors that users may encounter with **MyTonCtrl**.

## Common errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| Unknown module name: `name`. Available modes: `modes` | Check available modes list |
| No mode named `name` found in current modes: `current_modes` | Check current modes list |
| GetWalletFromFile error: Private key not found | Check wallet name path |
| Cannot get own IP address | Verify access to the resources at [ipconfig.me](https://ifconfig.me/ip) and [ipinfo.io](https://ipinfo.io/ip) |

## Liteserver errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| Cannot enable liteserver mode while validator mode is enabled | Use `disable_mode validator` |
| LiteClient error: `error_msg` | Check MyTonCtrl parameters for running liteserver |

## Validator errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------|
| ValidatorConsole error: Validator console is not settings | Check [validator article](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings) |
| Cannot enable validator mode while liteserver mode is enabled | Use `disable_mode liteserver` |
| Validator wallet not found | Check [validator article](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets) |
| Validator is not synchronized | Wait more for sync or check [sync troubleshouting](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) |
| Stake less than the minimum stake. Minimum stake: `minStake` | Use [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) and [check stake parameters](/v3/documentation/network/configs/blockchain-configs#param-17) |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Add funds to your account `balance`, ensuring it reaches the required `stake` amount |

## Nominator pool errors

| Error | Possible solution |
|:---------------------------------------------------------------------------|:----------------------------------------------------------------------|
| CreatePool error: Pool with the same parameters already exists | Check `pools_list` for existing pools |
| create_single_pool error: Pool with the same parameters already exists | Check `pools_list` for existing pools |

## See also

* [Nodes Troubleshooting](/v3/guidelines/nodes/nodes-troubleshooting)
<Feedback />

