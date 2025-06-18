import Feedback from '@site/src/components/Feedback';

# Адреса смарт-контрактов

В блокчейне TON каждый актор, включая кошельки и смарт-контракты, представлен адресом. Эти адреса имеют решающее значение при получении и отправке сообщений и транзакций. Существует два основных формата адресов смарт-контрактов: **исходный** и **пользовательский**.

## Компоненты адреса

Каждый адрес в TON состоит из двух основных компонентов:

- **Workchain ID**: подписанное 32-битное целое число, которое обозначает то, к какому воркчейну относится контракт (например, `-1` для Мастерчейна и `0` для Бейсчейна).
- **Account ID**: Уникальный идентификатор контракта, обычно длиной 256 бит для Мастерчейна и Бейсчейна.

## Состояния адресов

Каждый адрес в TON может находиться в одном из следующих состояний:

- **Nonexist**: Адрес не имеет данных (начальное состояние для всех адресов)
- **Uninit**: Адрес имеет баланс, но нет кода смарт-контракта
- **Active**: Адрес активен, а также имеет и код смарт-контракта и баланс
- **Frozen**: Адрес заблокирован из-за того, что расходы на хранение превышают его баланс

## Пользовательский формат адреса

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## **Пользовательский адрес** решает эти проблемы, используя:

A **user-friendly address** designed for blockchain users with features:

1. **Flags**: Indicates if the address is bounceable for contracts or non-bounceable for wallets.
2. **Контрольную сумму**: 2-байтовый механизм проверки ошибок (CRC16), который помогает обнаруживать неточности перед отправкой.
3. **Кодирование**: оно преобразует необработанный адрес в читаемую компактную форму с использованием base64 или base64url.

К примеру, тот же исходный вид адреса можно преобразовать в удобный для чтения пользовательский адрес, например:\
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

Пользовательские адреса делают транзакции более безопасными, предотвращая ошибки и позволяя возвращать средства в случае неудачных транзакций.

### User-friendly address flags

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

|      Исходный и пользовательский форматы адреса      |        Binary form        | Bounceable | Testnet-only |
| :--------------------------------------------------: | :-----------------------: | :--------: | :----------: |
| E... | 000100.01 |     yes    |      no      |
| U... | 010100.01 |     no     |      no      |
|                           #                          | 100100.01 |     yes    |      yes     |
| 0... | 110100.01 |     no     |      yes     |

:::tip
The Testnet-only flag doesn't have representation in the blockchain at all. The non-bounceable flag makes a difference only when used as the destination address for a transfer: in this case, it [disallows bounce](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for a message sent; the address in blockchain, again, does not contain this flag.
:::

```
default bounceable: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
urlSafe: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
non-bounceable: UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
Testnet: kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
non-bounceable, Testnet: 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

## Необработанный адрес

**Исходный адрес** содержит только основные элементы:

- **Workchain ID** (например, `-1` для Мастерчейна)
- **Account ID**: 256-битный уникальный идентификатор

Пример:\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Однако у адресов в исходном формате есть две основные проблемы:

1. У них нет встроенной проверки на ошибки. Это означает, что в случае возникновения ошибки при копировании могут быть потеряны средства.
2. Они не поддерживают дополнительные функции, такие как флаги возврата/невозврата.

## Преобразование между форматами адресов

Для преобразования между исходным и пользовательским адресами вы можете использовать API TON или инструменты разработчика, такие как [ton.org/address](https://ton.org/address).

Более подробную информацию о том, как обрабатывать эти адреса, включая примеры кодирования и сведения о безопасности транзакций, вы можете найти в полном руководстве в [Документации по адресам](/v3/documentation/smart-contracts/addresses).

## См. также

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
- [Документация по адресам смарт-контрактов](/v3/documentation/smart-contracts/addresses)

<Feedback />

