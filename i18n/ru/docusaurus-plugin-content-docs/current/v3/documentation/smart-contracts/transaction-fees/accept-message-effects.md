import Feedback from '@site/src/components/Feedback';

# Принятие сообщений и их эффекты

The `accept_message` and `set_gas_limit` TVM primitives play a crucial role in managing gas limits and transaction processing in TON smart contracts. `accept_message` и `set_gas_limit` могут вызывать неочевидные эффекты, когда вы строго следуете указаниям в [справочнике stdlib](/v3/documentation/smart-contracts/func/docs/stdlib#accept_message). This page explores these effects in detail, particularly focusing on how they impact external and internal message processing.

## Внешние сообщения

Внешние сообщения обрабатываются следующим образом:

- `gas_limit` устанавливается на `gas_credit` (ConfigParam 20 и ConfigParam 21), что равно 10 тыс. газа.
- Во время расходования этих кредитов контракт должен вызвать `accept_message` для `set_gas_limit`, указав, что он готов платить сборы за обработку сообщения.
- Если `gas_credit` достигнут или вычисления завершены, а `accept_message` не вызван, сообщение будет полностью отброшено (как будто его никогда и не было).
- Otherwise, a new gas limit is set to either:
  - `contract_balance/gas_price` (with `accept_message`)
  - A custom value (with `set_gas_limit`).
- В противном случае будет установлен новый лимит газа, равный `contract_balance/gas_price` (в случае `accept_message`) или пользовательскому числу (в случае `set_gas_limit`); после завершения транзакции из баланса контракта будут вычтены полные сборы за вычисления (таким образом, `gas_credit` действительно является **кредитом**, а не бесплатным газом).

If an error occurs after `accept_message` (in either Compute or Action phase):

- The transaction is recorded on the blockchain
- Fees are deducted from the contract balance
- Storage remains unchanged
- Actions are not applied

**Critical security consideration**

В результате, если контракт принимает внешнее сообщение, а затем выдает исключение из-за ошибки в данных сообщения или отправки неправильно сериализованного сообщения, он оплатит обработку, но не будет иметь возможности предотвратить повторное воспроизведение сообщения. **Одно и то же сообщение будет приниматься контрактом снова и снова, пока не израсходует весь баланс.**

- Pays for processing
- Cannot prevent message replay
- Will continue accepting the same message until its balance is depleted

## Внутреннее сообщение

When a contract receives an internal message from another contract:

- Default gas limit: `message_value`/`gas_price` (message covers its own processing)
- Используя `accept_message`/`set_gas_limit`, контракт может изменить лимит газа во время выполнения.

Обратите внимание, что ручные настройки лимитов газа не влияют на поведение отклонения; сообщения будут возвращены, если они отправлены в режиме отклонения и содержат достаточно денег для оплаты их обработки и создания сообщений о отклонении.

:::info пример
**Case 1:**
If you send a bounceable message with 0.1 TON in the basechain that is accepted by a contract with a 1 TON balance, and the computation costs 0.005 TON, with a message fee of 0.001 TON, then the bounce message will contain `0.1 - 0.005 - 0.001` = `0.094` TON.

Если в том же примере стоимость вычисления составляет 0,5 (вместо 0,005), возврата не будет (баланс сообщения будет `0,1 - 0,5 - 0,001 = -0,401`, то есть возврата не будет), а баланс контракта будет `1 + 0,1 - 0,5` = `0,6` TON.
:::

<Feedback />

