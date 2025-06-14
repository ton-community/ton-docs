import Feedback from '@site/src/components/Feedback';

# MyTonCtrlエラー

## 概要

This document explains the errors that users may encounter with **MyTonCtrl**.

## よくあるエラー

| エラー                                                                                                                          | 可能な解決策                                                                                                                                        |
| :--------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| 不明なモジュール名: `name`.利用可能なモード: `modes` Available modes: `modes` | 利用可能なモードリストをチェック                                                                                                                              |
| 現在のモードに `name` という名前のモードが見つかりません。                                                                                            | 現在のモードリストをチェック                                                                                                                                |
| GetWalletFromFile エラー：秘密鍵が見つかりません                                                                                            | ウォレット名のパスをチェック                                                                                                                                |
| 自分のIPアドレスを取得できない                                                                                                             | Verify access to the resources at [ipconfig.me](https://ifconfig.me/ip) and [ipinfo.io](https://ipinfo.io/ip) |

## ライトサーバーのエラー

| エラー                                         | 可能な解決策                                            |
| :------------------------------------------ | :------------------------------------------------ |
| バリデータモードが有効になっている間は、ライトサーバーモードを有効にできない      | バリデータ `disable_mode` を使用                          |
| LiteClient エラー: `error_msg` | Check MyTonCtrl parameters for running liteserver |

## Validator errors

| エラー                                                                                                | 可能な解決策                                                                                                                                                                                              |
| :------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ValidatorConsole エラー：バリデータコンソールが設定されていない                                                           | [バリデータの記事](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings)をチェック                                                                                                       |
| Liteserverモードが有効になっているときにValidatorモードを有効にすることはできません。                                               | `disable_mode liteserver`を使用                                                                                                                                                                        |
| バリデータ・ウォレットが見つからない                                                                                 | [バリデータの記事](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets)をチェック                                                                                                         |
| バリデータが同期されていない                                                                                     | 同期をもう少し待つか、[同期のトラブルシューティング](/v3/guidelines/nodes/nodes-troubleshooting#3時間以内にノードの同期が進まない場合)をチェック                                                                                                    |
| Stake less than the minimum stake. 最低賭け金より少なく賭ける。最低賭け金: `minStake` | [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) と [check stake parameters](/v3/documentation/network/configs/blockchain-configs#param-17) を使用 |
| Don't have enough coins. 賭け金： `stake`、口座残高： `balance`                              | Add funds to your account `balance`, ensuring it reaches the required `stake` amount                                                                                                                |

## Nominator pool errors

| エラー                                                                                      | 可能な解決策                        |
| :--------------------------------------------------------------------------------------- | :---------------------------- |
| CreatePool エラー：同じパラメータを持つプールがすでに存在します                                                    | 既存のプールがないか `pools_list` をチェック |
| create_single_pool エラー：同じパラメーターを持つプールはすでに存在します | 既存のプールがないか `pools_list` をチェック |

## See also

- [ノードのトラブルシューティング](/v3/guidelines/nodes/nodes-troubleshooting) <Feedback />
  <Feedback />

