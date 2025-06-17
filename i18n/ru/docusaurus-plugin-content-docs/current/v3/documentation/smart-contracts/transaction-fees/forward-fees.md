import Feedback from '@site/src/components/Feedback';

# Forward fees

This page explains how smart contracts handle message forwarding fees and value transfers between contracts.

## Overview

When a smart contract sends a query to another smart contract, it must pay for:

- Sending the internal message (message forwarding fees)
- Processing the message (gas fees)
- Sending back the answer, if required (message forwarding fees)

## Standard message handling

:::note
In most cases, the sender:

1. Attaches a small amount of Toncoin (typically one Toncoin) to the internal message
2. Sets the "bounce" flag (sends a bounceable internal message)

В большинстве случаев отправитель прикрепляет небольшое количество Toncoin (например, один Toncoin) к внутреннему сообщению (достаточное для оплаты обработки этого сообщения) и устанавливает его флаг "возврата" (т. е. отправляет внутреннее сообщение, допускающее возврат); получатель возвращает неиспользованную часть полученного значения с ответом (вычитая из него плату за пересылку сообщений). Обычно это достигается путем вызова `SENDRAWMSG` с `mode = 64` (см. Приложение A документации TON VM).
:::

## Message bouncing

### Automatic bouncing

Если получатель не может проанализировать полученное сообщение и завершает работу с ненулевым кодом завершения (например, из-за исключения десериализации необработанной ячейки), сообщение будет автоматически "возвращено" обратно отправителю, при этом флаг "отклонено" будет снят, а флаг "возвращено" установлен. The bounced message:

- Has its "bounce" flag cleared
- Has its "bounced" flag set
- Тело возвращенного сообщения будет содержать 32-битное значение `0xffffffffff`, за которым последует 256-битное значение исходного сообщения.

### Handling bounced messages

Always check the "bounced" flag of incoming internal messages before parsing the `op` field. This prevents processing a bounced message as a new query.

If the "bounced" flag is set:

- You can identify the failed query by deserializing `op` and `query_id`
- Take appropriate action based on the failure
- Alternatively, terminate with zero exit code to ignore bounced messages

:::note
The "bounced" flag cannot be forged because it's rewritten during sending. Обратите внимание, что флаг "отклонено" переписывается во время отправки, поэтому его невозможно подделать, и можно с уверенностью предположить, что если сообщение пришло с флагом "отклонено", то это результат отклонения какого-либо сообщения, отправленного получателем.
:::

## Error handling

If the receiver successfully parses the incoming query but:

- The requested method `op` is not supported
- Another error condition is met

Затем следует отправить ответ с `op`, равным `0xffffffff` или другим подходящим значением, используя `SENDRAWMSG` с `mode = 64`, как указано выше.

## Value transfer with confirmation

Some operations require both value transfer and confirmation. Например, смарт-контракт валидатора выборов получает запрос на участие в выборах вместе со ставкой в ​​качестве прикрепленного значения.

- An election participation request
- The stake as the attached value

### Implementation

1. The sender attaches exactly one Toncoin to the intended value
2. If an error occurs (e.g., stake not accepted):
   - Return the full received amount (minus processing fees)
   - Include an error message using `SENDRAWMSG` with `mode = 64`
3. On success:
   - Create a confirmation message
   - Return exactly one Toncoin (minus message transferring fees)
   - Use `SENDRAWMSG` with `mode = 1`

<Feedback />

