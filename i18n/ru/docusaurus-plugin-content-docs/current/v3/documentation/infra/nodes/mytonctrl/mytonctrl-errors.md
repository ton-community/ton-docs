import Feedback from '@site/src/components/Feedback';

# Ошибки MyTonCtrl

## Обзор

В этой статье описываются ошибки MyTonCtrl, с которыми может столкнуться пользователь.

## Распространенные ошибки

| Ошибка                                                                                                | Возможное решение                                                                                                                            |
| :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| Unknown module name: `name`. Available modes: `modes` | Проверьте список доступных режимов                                                                                                           |
| No mode named `name` found in current modes: `current_modes`                          | Проверьте список текущих режимов                                                                                                             |
| GetWalletFromFile error: Private key not found                                        | Проверьте путь к файлу кошелька                                                                                                              |
| Cannot get own IP address                                                                             | Проверьте доступность ресурсов https://ifconfig.me/ip и https://ipinfo.io/ip |

## Ошибки Liteserver

| Ошибка                                                        | Возможное решение                                     |
| :------------------------------------------------------------ | :---------------------------------------------------- |
| Cannot enable liteserver mode while validator mode is enabled | Используйте `disable_mode validator`. |
| LiteClient error: `error_msg`                 | Проверьте параметры MyTonCtrl для запуска Liteserver  |

## Ошибки Validator

| Ошибка                                                                                                              | Возможное решение                                                                                                                                                                                               |
| :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ValidatorConsole error: Validator console is not settings                                           | Проверьте [статью о валидаторе](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings)                                                                                                   |
| Cannot enable validator mode while liteserver mode is enabled                                                       | Используйте `disable_mode liteserver`                                                                                                                                                                           |
| Validator wallet not found                                                                                          | Проверьте [статью о валидаторе](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets)                                                                                                     |
| Validator is not synchronized                                                                                       | Подождите еще или проверьте статью [ошибки синхронизации](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours)                                                  |
| Stake less than the minimum stake. Minimum stake: `minStake`                        | Используйте [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) и [проверьте параметры стейка](/v3/documentation/network/configs/blockchain-configs#param-17) |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Add funds to your account `balance`, ensuring it reaches the required `stake` amount                                                                                                                            |

## Ошибки Nominator Pool

| Ошибка                                                                                                                           | Возможное решение                                    |
| :------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| CreatePool error: Pool with the same parameters already exists                                                   | Проверьте `pools_list` на наличие существующих пулов |
| create_single_pool error: Pool with the same parameters already exists | Проверьте `pools_list` на наличие существующих пулов |

## См. также

- [Устранение неполадок узлов](/v3/guidelines/nodes/nodes-troubleshooting) <Feedback /> <Feedback />
  <Feedback />

