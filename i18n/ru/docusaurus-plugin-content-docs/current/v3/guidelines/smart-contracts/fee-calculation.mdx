# Расчёт комиссии

Когда ваш контракт начинает обрабатывать входящее сообщение, важно проверить, достаточно ли прикрепленных к нему токенов TON для покрытия [всех типов комиссий](/v3/documentation/smart-contracts/transaction-fees/fees#elements-of-transaction-fee). Для этого необходимо рассчитать или спрогнозировать комиссию за текущую транзакцию.

В этой статье мы разберём, как рассчитывать комиссии в контрактах FunC с использованием новых опкодов (кодов операций) TVM.

:::info Подробнее об опкодах
Полный список опкодов TVM, включая упомянутые ниже, вы можете найти на странице [инструкций по TVM](/v3/documentation/tvm/instructions).
:::

## Комиссия за хранение

### Обзор

`storage fees` - это плата за размещение смарт-контракта в блокчейне. Она взимается за каждую секунду его хранения.

Для получения значений комиссии, используйте опкод `GETSTORAGEFEE` со следующими параметрами:

| Параметр                   | Описание                                                                            |
| :------------------------- | :---------------------------------------------------------------------------------- |
| cells                      | Количество ячеек контракта                                                          |
| bits                       | Количество битов контракта                                                          |
| is_mc | Флаг, принимает значение True, если источник или получатель находятся в мастерчейне |

:::info При расчете комиссии за хранение и пересылку учитываются только уникальные хеш-ячейки - то есть 3 одинаковые хеш-ячейки считаются за одну.

В частности, происходит дедупликация данных: если в разных ветвях есть несколько одинаковых подъячеек, их содержимое сохраняется только один раз.

[Подробнее о дедупликации](/v3/documentation/data-formats/tlb/library-cells).
:::

### Последовательность расчёта

У каждого контракта есть свой баланс. Можно рассчитать, сколько TON (токенов) потребуется, чтобы контракт оставался активным в течение указанного времени `seconds`, с помощью следующей функции:

```func
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
```

Затем это значение можно вписать в код контракта и рассчитать актуальную комиссию за хранение следующим образом:

```func
;; functions from func stdlib (not presented on mainnet)
() raw_reserve(int amount, int mode) impure asm "RAWRESERVE";
int get_storage_fee(int workchain, int seconds, int bits, int cells) asm(cells bits seconds workchain) "GETSTORAGEFEE";
int my_storage_due() asm "DUEPAYMENT";

;; constants from stdlib
;;; Creates an output action which would reserve exactly x nanograms (if y = 0).
const int RESERVE_REGULAR = 0;
;;; Creates an output action which would reserve at most x nanograms (if y = 2).
;;; Bit +2 in y means that the external action does not fail if the specified amount cannot be reserved; instead, all remaining balance is reserved.
const int RESERVE_AT_MOST = 2;
;;; in the case of action fail - bounce transaction. No effect if RESERVE_AT_MOST (+2) is used. TVM UPGRADE 2023-07. v3/documentation/tvm/changelog/tvm-upgrade-2023-07#sending-messages
const int RESERVE_BOUNCE_ON_ACTION_FAIL = 16;

() calculate_and_reserve_at_most_storage_fee(int balance, int msg_value, int workchain, int seconds, int bits, int cells) inline {
    int on_balance_before_msg = my_ton_balance - msg_value;
    int min_storage_fee = get_storage_fee(workchain, seconds, bits, cells); ;; can be hardcoded IF CODE OF THE CONTRACT WILL NOT BE UPDATED
    raw_reserve(max(on_balance_before_msg, min_storage_fee + my_storage_due()), RESERVE_AT_MOST);
}
```

Если значение `storage_fee` задано в виде константы, **не забудьте его обновить** при изменении контракта. Поскольку не все контракты поддерживают обновление, это не обязательное требование.

## Комиссия за вычисления

### Обзор

В большинстве случаев для получения значений комиссии необходимо использовать опкод `GETGASFEE` со следующими параметрами:

| Параметр   | Описание                                                                            |
| :--------- | :---------------------------------------------------------------------------------- |
| `gas_used` | Количество газа, полученное в ходе тестов, задается в виде константы                |
| `is_mc`    | Флаг, принимает значение True, если источник или получатель находится в мастерчейне |

### Последовательность расчёта

```func
int get_compute_fee(int workchain, int gas_used) asm(gas_used workchain) "GETGASFEE";
```

Каким образом можно получить значение `gas_used`? Через тесты!

Реализуемый для вашего смарт-контракта тест должен:

1. Совершить перевод
2. Проверить, прошла ли операция успешно, и получить информацию о переводе
3. Проверить фактическое количество газа, использованное этим переводом для вычисления

Последовательность расчета контракта может зависеть от входных данных. Вам следует запускать контракт так, чтобы он потреблял максимальное количество газа. Убедитесь, что вы используете наиболее ресурсоёмкий метод вычислений.

```ts
// Just Init code
const deployerJettonWallet = await userWallet(deployer.address);
let initialJettonBalance = await deployerJettonWallet.getJettonBalance();
const notDeployerJettonWallet = await userWallet(notDeployer.address);
let initialJettonBalance2 = await notDeployerJettonWallet.getJettonBalance();
let sentAmount = toNano('0.5');
let forwardAmount = toNano('0.05');
let forwardPayload = beginCell().storeUint(0x1234567890abcdefn, 128).endCell();
// Make sure payload is different, so cell load is charged for each individual payload.
let customPayload = beginCell().storeUint(0xfedcba0987654321n, 128).endCell();

// Let's use this case for fees calculation
// Put the forward payload into custom payload, to make sure maximum possible gas is used during computation
const sendResult = await deployerJettonWallet.sendTransfer(deployer.getSender(), toNano('0.17'), // tons
    sentAmount, notDeployer.address,
    deployer.address, customPayload, forwardAmount, forwardPayload);
expect(sendResult.transactions).toHaveTransaction({ //excesses
    from: notDeployerJettonWallet.address,
    to: deployer.address,
});
/*
transfer_notification#7362d09c query_id:uint64 amount:(VarUInteger 16)
                              sender:MsgAddress forward_payload:(Either Cell ^Cell)
                              = InternalMsgBody;
*/
expect(sendResult.transactions).toHaveTransaction({ // notification
    from: notDeployerJettonWallet.address,
    to: notDeployer.address,
    value: forwardAmount,
    body: beginCell().storeUint(Op.transfer_notification, 32).storeUint(0, 64) // default queryId
        .storeCoins(sentAmount)
        .storeAddress(deployer.address)
        .storeUint(1, 1)
        .storeRef(forwardPayload)
        .endCell()
});
const transferTx = findTransactionRequired(sendResult.transactions, {
    on: deployerJettonWallet.address,
    from: deployer.address,
    op: Op.transfer,
    success: true
});

let computedGeneric: (transaction: Transaction) => TransactionComputeVm;
computedGeneric = (transaction) => {
  if(transaction.description.type !== "generic")
    throw("Expected generic transactionaction");
  if(transaction.description.computePhase.type !== "vm")
    throw("Compute phase expected")
  return transaction.description.computePhase;
}

let printTxGasStats: (name: string, trans: Transaction) => bigint;
printTxGasStats = (name, transaction) => {
    const txComputed = computedGeneric(transaction);
    console.log(`${name} used ${txComputed.gasUsed} gas`);
    console.log(`${name} gas cost: ${txComputed.gasFees}`);
    return txComputed.gasFees;
}

send_gas_fee = printTxGasStats("Jetton transfer", transferTx);
```

## Комиссия за пересылку

### Обзор

Комиссия за пересылку взимается за исходящие сообщения.

Как правило, существует три варианта обработки комиссии за пересылку:

1. Структура сообщения детерминирована и вы можете спрогнозировать размер комиссии.
2. Структура сообщения во многом зависит от структуры входящего сообщения.
3. Вы вообще не можете спрогнозировать структуру исходящего сообщения.

### Последовательность расчёта

Если структура сообщения детерминирована, используйте опкод `GETFORWARDFEE` со следующими параметрами:

| Параметр                   | Описание                                                                                  |
| :------------------------- | :---------------------------------------------------------------------------------------- |
| cells                      | Количество ячеек                                                                          |
| bits                       | Количество битов                                                                          |
| is_mc | Флаг, принимает значение True, если источник или пункт назначения находится в мастерчейне |

:::info Для расчета комиссии за хранение и пересылку учитываются только уникальные хеш-ячейки, то есть 3 идентичные хеш-ячейки считаются как одна.

В частности, происходит дедупликация данных: если в разных ветвях встречаются одинаковые подъячейки, их содержимое сохраняется только один раз.

[Подробнее о дедупликации](/v3/documentation/data-formats/tlb/library-cells).
:::

Однако иногда исходящее сообщение сильно зависит от структуры входящего, и в таком случае спрогнозировать комиссию невозможно. Попробуйте использовать опкод `GETORIGINALFWDFEE` со следующими параметрами:

| Параметр                     | Описание                                                                                  |
| :--------------------------- | :---------------------------------------------------------------------------------------- |
| fwd_fee | Извлечено из входящего сообщения                                                          |
| is_mc   | Флаг, принимает значение True, если источник или пункт назначения находится в мастерчейне |

:::caution Будьте осторожны с опкодом `SENDMSG`.

Он расходует **непредсказуемое количество** газа.

Не используйте его без необходимости.
:::

Если опкод `GETORIGINALFWDFEE` не подходит, то можно использовать опкод `SENDMSG` со следующими параметрами:

| Параметр | Описание         |
| :------- | :--------------- |
| cells    | Количество ячеек |
| mode     | Режим сообщений  |

Режимы влияют на расчет комиссии следующим образом:

- `+1024`  не выполняет действие, а только оценивает комиссию. В других режимах сообщение отправляется на этапе выполнения действия
- `+128` подставляет значение всего баланса контракта до начала фазы вычислений (результат может быть неточным, так как расходы на газ, которые нельзя оценить заранее, не учитываются)
- `+64` подставляет весь баланс входящего сообщения в качестве исходящего значения (результат может быть неточным, так как не учитываются расходы на газ, которые нельзя оценить заранее)
- Другие режимы можно найти [на странице режимов сообщений](/v3/documentation/smart-contracts/message-management/sending-messages#message-modes)

Он создает действие вывода и возвращает комиссию за создание сообщения. Однако расходует непредсказуемое количество газа, которое нельзя вычислить формулами. Как же его рассчитать? Используйте опкод `GASCONSUMED`:

```func
int send_message(cell msg, int mode) impure asm "SENDMSG";
int gas_consumed() asm "GASCONSUMED";
;; ... some code ...

() calculate_forward_fee(cell msg, int mode) inline {
  int gas_before = gas_consumed();
  int forward_fee = send_message(msg, mode);
  int gas_usage = gas_consumed() - gas_before;
  
  ;; forward fee -- fee value
  ;; gas_usage -- amount of gas, used to send msg
}
```

## См. также

- [Контракт Stablecoin с расчетом комиссии](https://github.com/ton-blockchain/stablecoin-contract)
