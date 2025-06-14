import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

В этой статье мы рассмотрим и обсудим элементы, которые необходимо учитывать тем, кто хочет разрабатывать приложения TON.

## Checklist

### 1. Коллизии имен

Переменные и функции Func могут содержать практически любой допустимый символ. Т.е. `var++`, `~bits`, `foo-bar+baz`, включая запятые, являются допустимыми именами переменных и функций.

При написании и проверке кода Func следует использовать Linter.

- [Плагины IDE](/v3/documentation/smart-contracts/getting-started/ide-plugins/)

### 2. Проверьте значения выбросов

Каждый раз, когда выполнение TVM завершается нормально, оно останавливается с кодами выхода `0` или `1`. Хотя это происходит автоматически, выполнение TVM может быть прервано неожиданным образом, если коды выхода `0` и `1` будут выброшены непосредственно командой `throw(0)` или `throw(1)`.

- [Как обрабатывать ошибки](/v3/documentation/smart-contracts/func/docs/builtins#throwing-exceptions)
- [Коды выхода из TVM](/v3/documentation/tvm/tvm-exit-codes)

### 3. Func - строго типизированный язык, в структурах данных которого хранится именно то, что они должны хранить

Очень важно следить за тем, что делает код и что он может вернуть. Помните, что компилятор учитывает только сам код и только в его начальное состояние. После выполнения определенных операций сохраненные значения некоторых переменных могут измениться.

Чтение неожиданных значений переменных и вызов методов для типво данных, которые не должны иметь таких методов (или их возвращаемые значения сохраняются неправильно), являются ошибками и не пропускаются как "предупреждения" или "уведомления", а приводят к недостижимому коду. Помните, что сохранение неожиданного значения может быть допустимым, однако его чтение может вызвать проблемы, например, код ошибки 5 (целое число вне ожидаемого диапазона) может быть выброшен для целочисленной переменной.

### 4. Сообщения имеют режимы

Необходимо проверять режим сообщения, в частности, его взаимодействие с предыдущими отправленными сообщениями и платой за хранение. Возможной проблемой может быть неучет платы за хранение, в этом случае у контракта может закончиться TON, что приведет к неожиданным сбоям при отправке исходящих сообщений. Вы можете просмотреть режимы сообщений [здесь](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- [Seqno-based кошельки](/v3/guidelines/dapps/asset-processing/payments-processing/#seqno-based-wallets)
- [High-load кошельки](/v3/guidelines/dapps/asset-processing/payments-processing/#high-load-wallets)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

Это означает, что код контракта может быть изменен. Его можно изменить либо постоянно, используя директиву TVM [`SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code), либо во время выполнения, устанавливая в реестре TVM кода новое значение ячейки до окончания выполнения.

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

На вычислительной фазе выполняется код смарт-контрактов, и только после этого производятся действия (отправка сообщений, модификация кода, изменение библиотек и другие). Поэтому, в отличие от блокчейнов на базе Ethereum, Вы не увидите код завершеия вычислительной фазы, если ожидаете, что отправленное сообщение завершится неудачно, так как это происходит не в вычислительной фазе, а позже, в фазе выполнения действий.

- [Транзакции и фазы](/v3/documentation/tvm/tvm-overview#transactions-and-phases)

### 8. TON contracts are autonomous

Контракты в блокчейне могут находиться в отдельных шардах, обрабатываемых другим набором валидаторов, а это значит, что разработчик не может получить данные из других контрактов по запросу. Таким образом, любая коммуникация осуществляется асинхронно, путем отправки сообщений.

- [Отправка сообщений из смарт-контракта](/v3/documentation/smart-contracts/message-management/sending-messages)
- [Отправка сообщений из DApp](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

Прежде чем приступить к программированию смарт-контракта TON, следует продумать дорожную карту кодов выхода для потока кода (и задокументировать ее).

### 10. Func functions that have method_id identifiers have method IDs

Они могут быть заданы либо явно `"method_id(5)"`, либо неявно компилятором func. В этом случае их можно найти среди объявлений методов в файле ассемблера .fift. Два из них предопределены: один для приема сообщений внутри блокчейна `(0)`, обычно называемый `recv_internal`, и другой для приема сообщений извне `(-1)`, `recv_external`.

### 11. TON crypto address may not have any coins or code

Адреса смарт-контрактов в блокчейне TON детерминированы и могут быть предварительно вычислены. TON-аккаунты, связанные с адресами, могут даже не содержать кода, что означает, что они не инициализированы (если не были развернуты) или заморожены, не имея больше ни хранилища, ни монет TON, если было отправлено сообщение со специальными флагами.

### 12. TON addresses may have three representations

Адреса TON могут иметь три представления.
Полное представление может быть либо "сырым" (`workchain:address`), либо "user-friendly". С последним чаще всего сталкиваются пользователи. Оно содержит байт метки, указывающий на то, является ли адрес `bounceable ` или `not bounceable`, и байт идентификатора воркчейна. Эту информацию следует учитывать.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

В отличие от Solidity, где видимость методов настраивается вами, в случае с Func видимость ограничивается более сложным способом - либо с помощью отображения ошибок, либо через условия `if`.

### 14. Keep an eye on gas before sending bounced messages

В случае, если смарт-контракт отправляет отскочившие сообщения со значением, указанным пользователем, убедитесь, что соответствующая плата за газ вычтена из возвращенной суммы, чтобы избежать потери средств.

### 15. Monitor the callbacks and their failures

Блокчейн TON является асинхронным. Это означает, что сообщения необязательно должны приходить последовательно. Например, когда приходит уведомление о неудачном выполнении действия, оно должно быть обработано корректно.

### 16. Check if the bounced flag was sent receiving internal messages

Вы можете получать отскакивающие сообщения (уведомления об ошибках), которые следует обработать.

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## Ссылки

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />

