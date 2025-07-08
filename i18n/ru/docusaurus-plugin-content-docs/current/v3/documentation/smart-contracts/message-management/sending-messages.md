import Feedback from '@site/src/components/Feedback';

# Отправка сообщений

Составление, анализ и отправка сообщений лежат на пересечении [схем TL-B](/v3/documentation/data-formats/tlb/tl-b-language), [фаз транзакций и TVM](/v3/documentation/tvm/tvm-overview).

Действительно, FunC предоставляет функцию [send_raw_message](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message), которая ожидает сериализованное сообщение в качестве аргумента.

Поскольку TON — это комплексная система с широким функционалом, сообщения, которым необходимо поддерживать весь этот функционал, могут показаться довольно сложными. Однако большая часть этого функционала не используется в обычных сценариях, и сериализацию сообщений в большинстве случаев можно упростить до:

```func
  cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_slice(message_body)
  .end_cell();
```

Поэтому разработчику не стоит беспокоиться; если что-то в этом документе покажется непонятным при первом прочтении, это нормально. Просто поймите общую идею.

Иногда в документации может встречаться слово **`gram`**, в основном в примерах кода; это просто устаревшее название **toncoin**.

Давайте разберемся!

## Типы сообщений

Существует три типа сообщений:

- внешние — сообщения, отправляемые извне блокчейна в смарт-контракт внутри блокчейна. Такие сообщения должны быть явно приняты смарт-контрактами во время так называемого `credit_gas`. Если сообщение не принято, узел не должен принимать его в блок или передавать его другим узлам.
- внутренние — сообщения, отправляемые из одной сущности блокчейна в другую. Такие сообщения, в отличие от внешних, могут нести некоторое количество TON и окупать себя. Таким образом, смарт-контракты, получающие такие сообщения, могут не принять их. В этом случае газ будет вычтен из стоимости сообщения.
- логи — сообщения, отправляемые из сущности блокчейна во внешний мир. Как правило, не существует механизма отправки таких сообщений из блокчейна. Фактически, хотя все узлы в сети имеют консенсус относительно того, было ли создано сообщение или нет, нет никаких правил относительно того, как их обрабатывать. Логи могут быть напрямую отправлены в `/dev/null`, записаны на диск, сохранены в индексированной базе данных или даже отправлены не блокчейн-средствами (электронная почта/telegram/смс), все это остается на усмотрение данного узла.

## Макет сообщения

Начнем с внутреннего макета сообщения.

Схема TL-B, описывающая сообщения, которые могут быть отправлены смарт-контрактами, выглядит следующим образом:

```tlb
message$_ {X:Type} info:CommonMsgInfoRelaxed 
  init:(Maybe (Either StateInit ^StateInit))
  body:(Either X ^X) = MessageRelaxed X;
```

Let's put it into words: The serialization of any message consists of three fields:

- `info`, a header that describes the source, destination, and other metadata.
- `init`, a field that is only required for initializing messages.
- `body`, the message payload.

`Maybe` и `Either` и другие типы выражений означают следующее:

- когда у нас есть поле `info:CommonMsgInfoRelaxed`, это означает, что сериализация `CommonMsgInfoRelaxed` внедряется непосредственно в ячейку сериализации.
- когда у нас есть поле `body:(Either X ^X)`, это означает, что когда мы (де)сериализуем некоторый тип `X`, мы сначала ставим один бит `either`, который равен `0`, если `X` сериализуется в ту же ячейку, или `1`, если он сериализуется в отдельную ячейку.
- When we have the field `init:(Maybe (Either StateInit ^StateInit))`, we first put `0` or `1` depending on whether this field is empty. когда у нас есть поле `init:(Maybe (Either StateInit ^StateInit))`, это означает, что мы сначала ставим `0` или `1` в зависимости от того, пусто это поле или нет; и если он не пустой, мы сериализуем `Either StateInit ^StateInit` (опять же, ставим один бит `either`, который равен `0`, если `StateInit` сериализуется в ту же ячейку, или `1`, если он сериализуется в отдельную ячейку).

Let's focus on one particular `CommonMsgInforRelaxed` type, the internal message definition declared with the `int_msg_info$0` constructor.

```tlb
int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool
  src:MsgAddress dest:MsgAddressInt 
  value:CurrencyCollection ihr_fee:Grams fwd_fee:Grams
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;

ext_out_msg_info$11 src:MsgAddress dest:MsgAddressExt
  created_lt:uint64 created_at:uint32 = CommonMsgInfoRelaxed;
```

`mode` = 0, `flag` = 1

Then, there are three 1-bit flags:

- Whether Instant Hypercube Routing is disabled (currently always true)
- Отправить обычное сообщение, если при обработке действия произошла ошибка, не откатывать транзакцию и игнорировать ее
- Whether the message itself is the result of a bounce.

Затем сериализуются адреса источника и назначения, за которыми следует значение сообщения и четыре целых числа, связанных с платой за пересылку сообщения и временем.

Если сообщение отправляется из смарт-контракта, некоторые из этих полей будут перезаписаны на правильные значения. В частности, валидатор перезапишет `bounced`, `src`, `ihr_fee`, `fwd_fee`, `created_lt` и `created_at`. Это означает две вещи: во-первых, другой смарт-контракт во время обработки сообщения может доверять этим полям (отправитель не может подделать исходный адрес, флаг `bounced` и т. д.); и во-вторых, во время сериализации мы можем поместить в эти поля любые допустимые значения (в любом случае эти значения будут перезаписаны).

Прямая сериализация сообщения будет выглядеть следующим образом:

```func
  var msg = begin_cell()
    .store_uint(0, 1) ;; tag
    .store_uint(1, 1) ;; ihr_disabled
    .store_uint(1, 1) ;; allow bounces
    .store_uint(0, 1) ;; not bounced itself
    .store_slice(source)
    .store_slice(destination)
    ;; serialize CurrencyCollection (see below)
    .store_coins(amount)
    .store_dict(extra_currencies)
    .store_coins(0) ;; ihr_fee
    .store_coins(fwd_value) ;; fwd_fee 
    .store_uint(cur_lt(), 64) ;; lt of transaction
    .store_uint(now(), 32) ;; unixtime of transaction
    .store_uint(0,  1) ;; no init-field flag (Maybe)
    .store_uint(0,  1) ;; inplace message body flag (Either)
    .store_slice(msg_body)
  .end_cell();
```

Однако вместо пошаговой сериализации всех полей разработчики обычно используют сокращения. Итак, давайте рассмотрим, как можно отправлять сообщения из смарт-контракта на примере из [elector-code](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/elector-code.fc#L153).

```func
() send_message_back(addr, ans_tag, query_id, body, grams, mode) impure inline_ref {
  ;; int_msg_info$0 ihr_disabled:Bool bounce:Bool bounced:Bool src:MsgAddress -> 011000
  var msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(grams)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1)
    .store_uint(ans_tag, 32)
    .store_uint(query_id, 64);
  if (body >= 0) {
    msg~store_uint(body, 32);
  }
  send_raw_message(msg.end_cell(), mode);
}
```

Сначала он помещает значение `0x18` в 6 бит, что помещается в `0b011000`. Что это?

- Первый бит - `0` — префикс 1 бит, который указывает, что это `int_msg_info`.

- Затем идут 3 бита `1`, `1` и `0`, что означает, что мгновенная маршрутизация гиперкуба отключена, сообщения могут быть отклонены, и это сообщение не является результатом самого отклонения.

- Затем должен быть адрес отправителя, однако, поскольку он в любом случае будет перезаписан с тем же эффектом, любой допустимый адрес может быть сохранен там. Самая короткая сериализация допустимого адреса — это `addr_none`, и она сериализуется как двухбитная строка `00`.

Таким образом, `.store_uint(0x18, 6)` — это оптимизированный способ сериализации тега и первых 4 полей.

Следующая строка сериализует адрес назначения.

Затем мы должны сериализовать значения. Обычно значение сообщения — это объект `CurrencyCollection` со следующей схемой:

```tlb
nanograms$_ amount:(VarUInteger 16) = Grams;

extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) 
                 = ExtraCurrencyCollection;

currencies$_ grams:Grams other:ExtraCurrencyCollection 
           = CurrencyCollection;
```

Эта схема означает, что в дополнение к значению TON сообщение может содержать словарь дополнительных _дополнительных валют_. Однако в настоящее время мы можем пренебречь этим и просто предположить, что значение сообщения сериализуется как "количество nanotons как переменное целое число" и "`0` - пустой бит словаря".

Действительно, в коде выборщика выше мы сериализуем количество монет через `.store_coins(toncoins)`, но затем просто помещаем строку нулей длиной, равной `1 + 4 + 4 + 64 + 32 + 1 + 1`. Что это такое?

- Первый бит обозначает пустой словарь дополнительных валют.
- Затем у нас есть два 4-битных поля. Они кодируют 0 как `VarUInteger 16`. Фактически, поскольку `ihr_fee` и `fwd_fee` будут перезаписаны, мы также можем поставить там нули.
- Затем мы помещаем ноль в поля `created_lt` и `created_at`. Эти поля также будут перезаписаны; Однако, в отличие от комиссий, эти поля имеют фиксированную длину и, таким образом, кодируются как строки, длиной 64 и 32 бита.
  > _We had already serialized the message header and passed to init/body at that moment_
- Следующий нулевой бит означает, что поля `init` нет.
- Последний нулевой бит означает, что msg_body будет сериализован на месте.
- После этого кодируется тело сообщения (с произвольной компоновкой).

Таким образом, вместо индивидуальной сериализации 14 параметров мы выполняем 4 примитива сериализации.

## Полная схема

Полная схема компоновки сообщения и компоновка всех составляющих полей (а также схема ВСЕХ объектов в TON) представлены в [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb).

## Размер сообщения

:::info размер ячейки
Обратите внимание, что любая [ячейка](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage) может содержать до `1023` бит. Если вам нужно сохранить больше данных, вы должны разбить их на части и сохранить в ссылочных ячейках.
:::

Если, например, размер тела вашего сообщения составляет 900 бит, вы не можете сохранить его в той же ячейке, что и заголовок сообщения. Действительно, в дополнение к полям заголовка сообщения общий размер ячейки будет превышать 1023 бит, и во время сериализации возникнет исключение `переполнение ячейки`.

В этом случае вместо `0`, что означает "установить флаг в теле сообщения (либо)", должно быть `1`, а тело сообщения должно храниться в ссылочной ячейке.

С этими вещами следует обращаться осторожно, поскольку некоторые поля имеют переменные размеры.

For instance, `MsgAddress` may be represented by four constructors:

- `addr_none`
- `addr_std`
- `addr_extern`
- `addr_var`

Например, `MsgAddress` может быть представлен четырьмя конструкторами: `addr_none`, `addr_std`, `addr_extern`, `addr_var` с длиной от 2 бит (для `addr_none`) до 586 бит (для `addr_var` в самой большой форме).

То же самое относится к количеству nanoton, которое сериализуется как `VarUInteger 16`.
Это означает, что 4 бита указывают на длину байта целого числа, а затем указывают предыдущие байты для самого целого числа.

That way:

- Таким образом, 0 nanoton будут сериализованы как `0b0000` (4 бита, которые кодируют строку байтов нулевой длины, а затем ноль байтов), а 100.000.000 ТОНН (или 10000000000000000000000 nanoton) будут сериализованы как `0b10000000000101100011010001010111100010111000101000000000000000` (`0b1000` обозначает 8 байтов, а затем сами 8 байтов).
- `100000000000000000` nanotons (100,000,000 TON) serializes as:
  `0b10000000000101100011010001010111100001011101100010100000000000000000`
  (where `0b1000` specifies 8 bytes length followed by the 8-byte value)

:::info размер сообщения
Note that the message has general size limits and cell count limits, too,
e.g., the maximum message size must not exceed `max_msg_bits`, and the number of cells per message must not exceed `max_msg_cells`.

Дополнительные параметры конфигурации и их значения можно найти [здесь](/v3/documentation/network/configs/blockchain-configs#param-43)
:::

## Режимы сообщений

:::info
For the latest information, refer to the [message modes cookbook](/v3/documentation/smart-contracts/message-management/message-modes-cookbook).
:::

Как вы могли заметить, мы отправляем сообщения с `send_raw_message`, который, помимо потребления самого сообщения, также принимает режим. Этот режим используется для определения режима отправки сообщений, включая необходимость отдельной оплаты топлива и способ обработки ошибок. Когда виртуальная машина TON (TVM) анализирует и обрабатывает сообщения, она выполняет дифференцированную обработку в зависимости от значения режима. Легко спутать то, что значение параметра режима имеет две переменные, а именно режим и флаг. Режим и флаг имеют разные функции:

- режим: определяет базовое поведение при отправке сообщения, например, следует ли переносить баланс, следует ли ждать результатов обработки сообщения и т. д. Различные значения режима представляют разные характеристики отправки, и разные значения можно комбинировать для удовлетворения конкретных требований отправки.
- флаг: как дополнение к режиму, он используется для настройки определенного поведения сообщения, например, отдельной оплаты комиссий за перевод или игнорирования ошибок обработки. Флаг добавляется к режиму для создания окончательного режима отправки сообщения.

При использовании функции `send_raw_message` важно выбрать соответствующую комбинацию режима и флага для ваших нужд. Чтобы выяснить, какой режим лучше всего подходит для ваших нужд, взгляните на следующую таблицу:

| Режим | Описание                                                                                                               |
| :---- | :--------------------------------------------------------------------------------------------------------------------- |
| `0`   | Обычное сообщение                                                                                                      |
| `64`  | Перенести все оставшееся значение входящего сообщения в дополнение к значению, изначально указанному в новом сообщении |
| `128` | Перенести весь оставшийся баланс текущего смарт-контракта вместо значения, изначально указанного в сообщении           |

| Флаг  | Описание                                                                                                                                           |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `+1`  | Платите комиссию за перевод отдельно от стоимости сообщения                                                                                        |
| `+2`  | Игнорируйте некоторые ошибки, возникающие при обработке этого сообщения на этапе действия (см. примечание ниже) |
| `+16` | В случае сбоя действия - транзакция аннулируется. Если используется `+2`, это не влияет ни на что.                 |
| `+32` | Текущий аккаунт должен быть уничтожен, если его итоговый баланс равен нулю (часто используется с режимом 128)                   |

:::info флаг +16
If a contract receives a bounceable message, it processes the `storage` phase **before** the `credit` phase. В противном случае он обработает фазу `credit` **перед** фазой `storage`.

Проверьте [исходный код с проверкой флага `bounce-enable`](https://github.com/ton-blockchain/ton/blob/master/validator/impl/collator.cpp#L2810)
:::

:::warning

1. **Флаг +16** - не использовать во внешних сообщениях (например, на кошельках), так как нет отправителя, который мог бы получить отклоненное сообщение.

2. **Флаг +2** - важно во внешних сообщениях (например, на кошельках).

:::

## Recommended approach: mode=3 {#mode3}

```func
send_raw_message(msg, SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS); ;; stdlib.fc L833
```

`mode` = 0, `flag` = 2

- Перенести всю оставшуюся стоимость входящего сообщения в дополнение к изначально указанной стоимости в новом сообщении и оплатить комиссию за перевод отдельно
- `+2` : Suppresses specific errors during message processing

This combination is the standard method for sending messages in TON.

---

### флаг +2

If the `IGNORE_ERRORS` flag is omitted and a message fails to process (e.g., due to insufficient balance), the transaction reverts. For wallet contracts, this prevents updates to critical data like the `seqno`.

```func
`send_raw_message(msg, 64)`
```

As a result, unprocessed external messages can be replayed until they expire or drain the contract's balance.

---

### Error handling with +2 flag

The `IGNORE ERRORS` flag (`+2`) suppresses these specific errors during the Action Phase:

#### Suppressed errors

1. **Insufficient funds**

  - Message transfer value exhaustion
  - Недостаточно средств для обработки сообщения.
  - Inadequate attached value for forwarding fees
  - Недостаточно дополнительной валюты для отправки с сообщением.
  - Недостаточно средств для оплаты исходящего внешнего сообщения.

2. **[Oversized message](#message-size)**

3. **Excessive Merkle depth**

  Message exceeds allowed Merkle tree complexity.

#### Non-suppressed errors

1. Malformed message structure
2. `mode` = 128, `flag` = 32 + 16
3. Исходящее сообщение имеет недопустимые библиотеки в StateInit.
4. Внешнее сообщение не является обычным или включает флаг +16 или +32 или оба

---

### Security considerations

#### Current mitigations

- Most wallet apps auto-include `IGNORE_ERRORS` in transactions
- Wallet UIs often display transaction simulation results
- V5 wallets enforce `IGNORE_ERRORS` usage
- Validators limit message replays per block

#### Potential risks

- **Race conditions** causing stale backend balance checks
- **Legacy wallets** (V3/V4) without enforced checks
- **Incomplete validations** by wallet applications

---

### Example: jetton transfer pitfall

Consider this simplified Jetton wallet code:

```func
() send_jettons(slice in_msg_body, slice sender_address, int msg_value, int fwd_fee) impure inline_ref {
int jetton_amount = in_msg_body~load_coins();
balance -= jetton_amount;
send_raw_message(msg, SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL);
save_data(status, balance, owner_address, jetton_master_address); }
```

If a transfer using `mode=3` fails due to a suppressed error:

1. Transfer action is not executed
2. Contract state updates persist (no rollback)
3. **Result:** permanent loss of `jetton_amount` from the balance

**Best practice**

Always pair `IGNORE_ERRORS` with robust client-side validations and real-time balance checks to prevent unintended state changes.

<Feedback />

