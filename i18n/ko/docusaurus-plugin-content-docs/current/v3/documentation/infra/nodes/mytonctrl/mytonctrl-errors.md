import Feedback from '@site/src/components/Feedback';

# MyTonCtrl 오류

## 개요

This document explains the errors that users may encounter with **MyTonCtrl**.

## 일반 오류

| 오류                                                                                                    | 가능한 해결책                                                                                                                                       |
| :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| Unknown module name: `name`. Available modes: `modes` | 사용 가능한 모드 목록 확인                                                                                                                               |
| No mode named `name` found in current modes: `current_modes`                          | 현재 모드 목록 확인                                                                                                                                   |
| GetWalletFromFile error: Private key not found                                        | 지갑 이름 경로 확인                                                                                                                                   |
| Cannot get own IP address                                                                             | Verify access to the resources at [ipconfig.me](https://ifconfig.me/ip) and [ipinfo.io](https://ipinfo.io/ip) |

## 라이트서버 오류

| 오류                                                            | 가능한 해결책                                           |
| :------------------------------------------------------------ | :------------------------------------------------ |
| Cannot enable liteserver mode while validator mode is enabled | `disable_mode validator` 사용                       |
| LiteClient error: `error_msg`                 | Check MyTonCtrl parameters for running liteserver |

## 검증자 오류

| 오류                                                                                                                  | 가능한 해결책                                                                                                                                                                                  |
| :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ValidatorConsole error: Validator console is not settings                                           | [검증자 문서](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings) 확인                                                                                                |
| Cannot enable validator mode while liteserver mode is enabled                                                       | `disable_mode liteserver` 사용                                                                                                                                                             |
| Validator wallet not found                                                                                          | [검증자 문서](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets) 확인                                                                                                  |
| Validator is not synchronized                                                                                       | 동기화 대기 또는 [동기화 문제해결](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) 확인                                                             |
| Stake less than the minimum stake. Minimum stake: `minStake`                        | [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) 사용 및 [스테이크 매개변수](/v3/documentation/network/configs/blockchain-configs#param-17) 확인 |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Add funds to your account `balance`, ensuring it reaches the required `stake` amount                                                                                                     |

## Nominator pool errors

| 오류                                                                                                                               | 가능한 해결책                     |
| :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| CreatePool error: Pool with the same parameters already exists                                                   | 기존 풀 확인을 위해 `pools_list` 확인 |
| create_single_pool error: Pool with the same parameters already exists | 기존 풀 확인을 위해 `pools_list` 확인 |

## See also

- [노드 문제해결](/v3/guidelines/nodes/nodes-troubleshooting) <Feedback />
  <Feedback />

