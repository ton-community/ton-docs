import Feedback from '@site/src/components/Feedback';

# Validator node

Network validators confirm all user transactions. If all validators agree that a transaction is valid, it gets added to the blockchain. Invalid transactions are rejected. See more information [here](https://ton.org/validators).

## Минимальные требования к оборудованию

- 16-ядерный процессор
- 128 ГБ оперативной памяти
- 1TB NVMe SSD or provisioned 64+k IOPS storage
- Подключение к сети со скоростью 1 Гбит/с
- общедоступный IP-адрес (_фиксированный IP-адрес_)
- 100 ТБ/месяц трафика при пиковой нагрузке

> Как правило, для обеспечения надежной работы с пиковыми нагрузками вам потребуется подключение со скоростью не менее 1 Гбит/с (средняя нагрузка, как ожидается, составит около 100 Мбит/с).

> Мы обращаем особое внимание валидаторов на требования к IOPS диска, это критически важно для бесперебойной работы сети.

## Переадресация портов

Для всех типов узлов требуется статический внешний IP-адрес, один UDP-порт, который должен быть перенаправлен для входящих подключений и все исходящие подключения должны быть открыты - узел использует случайные порты для новых исходящих подключений. Это необходимо, чтобы узел был виден извне через NAT.

Это можно сделать через вашего провайдера услуг связи или [аренду сервера](/v3/guidelines/nodes/running-nodes/full-node#recommended-providers).

:::info
Используйте команду `netstat -tulpn`, чтобы определить, какой UDP-порт открыт.
:::

## Обязательное условие

### Изучите политику штрафов

If a validator processes less than 90% of the expected blocks during a validation round, they will be fined by 101 TON.

Узнайте подробнее о [политике штрафов](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).

### Запустите полный узел

Запустите [полный узел](/v3/guidelines/nodes/running-nodes/full-node) перед выполнением этого руководства.

Проверьте, что режим валидатора включен с помощью команды `status_modes`. Если это не так, выполните команду [mytonctrl enable_mode](/v3/documentation/infra/nodes/mytonctrl/mytonctrl-overview#enable_mode).

## Архитектура

![image](/img/nominator-pool/hot-wallet.png)

## Просмотрите список кошельков

Список доступных кошельков можно посмотреть в консоли **MyTonCtrl** с помощью команды `wl`:

```sh
wl
```

Во время установки **mytonctrl** создается кошелек **validator_wallet_001**:

![список кошельков](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-wl_ru.png)

## Активация кошельков

1. Отправьте необходимое количество монет в кошелек и активируйте его. The minimum stake is approximately **300K TON**, and the maximum is about **1M** TON. Для понимания нужного количества монет проверьте текущий стейк на [tonscan.com](https://tonscan.com/validation). Узнайте больше о том, [как рассчитываются максимальный и минимальный стейки] (/v3/documentation/infra/nodes/validation/staking-incentives#values-of-stakes-max-effective-stake).

2. Используйте команду `vas` для отображения истории переводов:

```sh
vas [wallet name]
```

3. Use the `aw` command to activate the wallet. Активируйте кошелек с помощью команды `aw` (имя кошелька необязательно, если аргументы не указаны, то будут активированы все доступные)

```sh
aw [wallet name]
```

![установка стейка](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-set_ru.png)

## Your validator is ready to use

**mytoncore** автоматически участвует в выборах. Он делит баланс кошелька на две части и использует их как стейк для участия в выборах. Вы также можете вручную установить размер стейка:

```sh
set stake 50000
```

`set stake 50000` - это устанавливает размер стейка в 50 тысяч монет. Если ставка принята и наш узел становится валидатором, ставку можно вывести только во вторых выборах (в соответствии с правилами избирательного комитета).

![История аккаунта](/img/docs/nodes-validator/manual-ubuntu_mytonctrl-vas-aw_ru.png)

## Adhere to rules

:::caution Slashing policy for underperforming validators
Если валидатор обработал менее 90% ожидаемого количества блоков во время раунда валидации, этот валидатор будет оштрафован на 101 TON. Узнайте больше о [политике штрафов](/v3/documentation/infra/nodes/validation/staking-incentives#decentralized-system-of-penalties).
:::

Как валидаторы TON, убедитесь, что вы следуете этим ключевым шагам для обеспечения стабильности сети и избежания штрафов в будущем.

### Ключевые действия:

1. Следуйте уведомлениям [@tonstatus](https://t.me/tonstatus), и готовьтесь к немедленным обновлениям при необходимости.

2. Убедитесь, что ваше оборудование соответствует или превышает [минимальные системные требования] (/v3/guidelines/nodes/running-nodes/validator-node#minimal-hardware-requirements).

3. Мы настоятельно просим вас использовать [mytonctrl](https://github.com/ton-blockchain/mytonctrl).

    - Обновляйте `mytonctrl` в соответствии с уведомлениями и включите телеметрию: `set sendTelemetry true`

4. Настройте панели мониторинга использования оперативной памяти, дисков, сети и процессора. Для технической помощи свяжитесь с @mytonctrl_help_bot.

5. Отслеживайте эффективность вашего валидатора с помощью панелей мониторинга.

    - Проверьте эффективность `mytonctrl` с помощью команды `check_ef`.

    - [Создайте панель мониторинга с помощью API](/v3/guidelines/nodes/running-nodes/validator-node#validation-and-effectiveness-apis).

:::info
`mytonctrl` позволяет проверить эффективность валидаторов с помощью команды `check_ef`, которая выводит данные о вашей эффективности валидатора за последний и текущий период. This command provides efficiency data for both the last round and the current round. Эта команда получает данные, вызывая утилиту `checkloadall`. Убедитесь, что ваша эффективность превышает 90% (за весь период полного цикла).
:::

:::info
В случае низкой эффективности - принимайте меры для решения проблемы. Если это необходимо, свяжитесь с технической поддержкой [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot).
:::

## API-интерфейсы валидации и эффективности

:::info
Пожалуйста, настройте информационные панели для мониторинга ваших валидаторов с помощью этих API.
:::

### Отслеживание валидаторов, подвергшихся штрафам

Вы можете отслеживать валидаторов, подвергшихся штрафам, в каждом раунде с помощью [@tonstatus_notifications](https://t.me/tonstatus_notifications).

#### API для валидации

https://elections.toncenter.com/docs - используйте этот API для получения информации о текущих и прошлых раундах (циклах) валидации - время раундов, какие валидаторы участвовали в них, их ставки и т.д. Также доступна информация о текущих и прошедших выборах (для раунда валидации).

#### API для эффективности

https://toncenter.com/api/qos/index.html#/ - используйте этот API для получения информации об эффективности валидаторов с течением времени.

Этот API анализирует информацию, полученную из catchain, и строит оценку эффективности валидатора. Этот API не использует утилиту checkloadall, но является ее альтернативой.

В отличие от `checkloadall`, который работает только в циклах валидации, в этом API вы можете установить любой временной интервал для анализа эффективности валидатора.

##### Рабочий процесс:

1. Передайте ADNL адрес вашего валидатора и временной интервал (`from_ts`, `to_ts`) в API. Для точного результата полезно выбирать достаточно большой интервал, например, с 18 часов назад до текущего момента.

2. Извлеките результат. Если в вашем поле процент эффективности меньше 80%, ваш валидатор работает неправильно.

3. Важно, чтобы ваш валидатор участвовал в валидации и имел один и тот же ADNL адрес на весь указанный период времени. Например, если валидатор участвует в валидации каждый второй раунд - тогда вам нужно указывать только те интервалы, когда он участвовал в валидации. Failing to do so may result in an inaccurate underestimate. This requirement applies not only to MasterChain validators (with an index < 100) but also to other validators (with an index > 100).

## Поддержка

Свяжитесь с технической поддержкой [@mytonctrl_help_bot](https://t.me/mytonctrl_help_bot). Этот бот предназначен только для валидаторов и не будет помогать с вопросами для обычных узлов.

Если у вас обычный узел, обратитесь в группу: [@mytonctrl_help](https://t.me/mytonctrl_help).

## См. также

- [Запуск полного узла](/v3/guidelines/nodes/running-nodes/full-node)
- [Устранение неполадок](/v3/guidelines/nodes/nodes-troubleshooting)
- [Мотивация для стейкинга](/v3/documentation/infra/nodes/validation/staking-incentives)
    <Feedback />

