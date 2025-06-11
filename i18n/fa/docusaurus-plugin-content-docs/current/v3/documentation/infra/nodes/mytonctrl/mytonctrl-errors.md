import Feedback from '@site/src/components/Feedback';

# خطاهای MyTonCtrl

## مرور کلی

This document explains the errors that users may encounter with **MyTonCtrl**.

## خطاهای رایج

| خطا                                                                                                   | راه‌حل ممکن                                                                                                                                   |
| :---------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| Unknown module name: `name`. Available modes: `modes` | بررسی لیست حالت‌های موجود                                                                                                                     |
| هیچ حالتی با نام `name` در حالت‌های جاری یافت نشد: `current_modes`                    | بررسی لیست حالت‌های جاری                                                                                                                      |
| خطای GetWalletFromFile: کلید خصوصی پیدا نشد                                           | بررسی مسیر نام کیف پول                                                                                                                        |
| نمیتوان آدرس IP خود را دریافت کرد                                                                     | Verify access to the resources at [ipconfig.me](https://ifconfig.me/ip) and [ipinfo.io](https://ipinfo.io/ip) |

## خطاهای Liteserver

| خطا                                                                    | راه‌حل ممکن                                       |
| :--------------------------------------------------------------------- | :------------------------------------------------ |
| نمیتوان حالت liteserver را فعال کرد در حالی که حالت validator فعال است | استفاده از `disable_mode validator`               |
| خطای LiteClient: `error_msg`                           | Check MyTonCtrl parameters for running liteserver |

## خطاهای Validator

| خطا                                                                                                                 | راه‌حل ممکن                                                                                                                                                                                                  |
| :------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| خطای ValidatorConsole: کنسول Validator تنظیم نشده‌است                                               | بررسی [مقاله Validator](/v3/guidelines/nodes/nodes-troubleshooting#validator-console-is-not-settings)                                                                                                        |
| نمیتوان حالت validator را فعال کرد در حالی که حالت liteserver فعال است                                              | استفاده از `disable_mode liteserver`                                                                                                                                                                         |
| کیف پول Validator پیدا نشد                                                                                          | بررسی [مقاله Validator](/v3/guidelines/nodes/running-nodes/validator-node#view-the-list-of-wallets)                                                                                                          |
| Validator با شبکه همگام نشده‌است                                                                                    | منتظر بمانید تا همگام‌سازی کامل شود یا [عیب‌یابی همگام‌سازی](/v3/guidelines/nodes/nodes-troubleshooting#about-no-progress-in-node-synchronization-within-3-hours) را بررسی کنید                              |
| Stake less than the minimum stake. Minimum stake: `minStake`                        | استفاده از [`set stake {amount}`](/v3/guidelines/nodes/running-nodes/validator-node#your-validator-is-now-ready) و [بررسی پارامترهای staking](/v3/documentation/network/configs/blockchain-configs#param-17) |
| Don't have enough coins. stake: `stake`, account balance: `balance` | Add funds to your account `balance`, ensuring it reaches the required `stake` amount                                                                                                                         |

## Nominator pool errors

| خطا                                                                                                                           | راه‌حل ممکن                            |
| :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| خطای CreatePool: استخر با پارامترهای مشابه از قبل وجود دارد                                                   | بررسی `pools_list` برای استخرهای موجود |
| خطای create_single_pool: استخر با پارامترهای مشابه از قبل وجود دارد | بررسی `pools_list` برای استخرهای موجود |

## See also

- [رفع اشکالات گره‌ها](/v3/guidelines/nodes/nodes-troubleshooting) <Feedback />
  <Feedback />

