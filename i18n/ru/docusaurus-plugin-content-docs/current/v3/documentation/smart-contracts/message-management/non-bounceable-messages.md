import Feedback from '@site/src/components/Feedback';

# Невозвращаемые сообщения

export const Highlight = ({children, color}) => (
<span
style={{
backgroundColor: color,
borderRadius: '2px',
color: '#fff',
padding: '0.2rem',
}}>
{children} </span>
);

Почти все внутренние сообщения, отправляемые между смарт-контрактами, должны быть возвратными, т. е. иметь установленный бит "возврата". This ensures:

1. If the destination contract doesn't exist or fails to process the message:

   - The message bounces back
   - Returns remaining value (minus fees)
   - Contains:
      - `0xffffffff` (32-bit)
      - Original message body (256-bit)
      - "bounce" flag cleared
      - "bounced" flag set

2. Contracts must:
   - Check the "bounced" flag on all incoming messages
   - Either:
      - Accept silently (terminate with exit code 0)
      - Identify and handle the failed request
   - Never execute the bounced message's original query

:::info
Запрос, содержащийся в теле возвращенного сообщения <Highlight color="#186E8A">никогда не должен выполняться</Highlight>.
:::

Non-bounceable messages are essential for account initialization. Например, новые аккаунты не могут быть созданы без отправки им хотя бы одного невозвращаемого внутреннего сообщения. Если это сообщение не содержит `StateInit` с кодом и данными нового смарт-контракта, не имеет смысла указывать непустое тело во внутреннем сообщении, которое не может быть возвращено.

For all other cases:

- The message body should typically be empty
- Only use when bounce handling isn't needed
- Avoid them for regular contract interactions

## Best practice

Рекомендуется - `не разрешать` конечному пользователю (например, кошельку) отправлять не подлежащие оплате сообщения, содержащие большие суммы (например, более пяти Toncoin), или предупреждать их, если они это делают. To prevent loss of big funds, break process in two steps:

1. "Лучшей идеей" будет сначала отправить небольшую сумму, затем инициализировать новый смарт-контракт, а затем отправить большую сумму.
2. Next, send a more considerable amount.

<Feedback />

