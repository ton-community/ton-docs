# Get-методы

:::note
Прежде чем продолжить, рекомендуется ознакомиться с основами [языка программирования FunC](/v3/documentation/smart-contracts/func/overview) на блокчейне TON. Это поможет лучше понять представленную ниже информацию.
:::

## Введение

Get-методы — это специальные функции, предназначенные для получения конкретных данных из состояния смарт-контракта. Их выполнение происходит вне блокчейна и не требует комиссии.

Эти функции встречаются во многих смарт-контрактах. Например, стандартный [смарт-контракт кошелька](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts) содержит несколько get-методов: `seqno()`, `get_subwallet_id()` и `get_public_key()`. Они позволяют получать данные о кошельке из самого контракта, SDK и API.

## Шаблоны проектирования для get-методов

### Базовые шаблоны

1. **Получение отдельных данных.** Данный шаблон представляет собой набор методов, которые позволяют получить в качестве результата вызова отдельные параметры из состояния контракта. Данные методы не содержат аргументов и возвращают только одно значение.

    Например:

    ```func
    int get_balance() method_id {
        return get_data().begin_parse().preload_uint(64);
    }
    ```

2. **Получение агрегированных данных.** Ещё один распространённый шаблон - набор методов, позволяющих извлечь сразу массив данных из состояния контракта в рамках одиночного вызова. Это может быть удобно для случаев, когда для какой-то операции необходимо несколько параметров. Такие методы применяются, например, в контрактах [Jetton](#jettons) и [NFT](#nfts).

    Например:

    ```func
    (int, slice, slice, cell) get_wallet_data() method_id {
        return load_data();
    }
    ```

### Продвинутые шаблоны

1. **Получение вычисляемых данных.** В некоторых случаях искомые данные не хранятся в текущем состоянии контракта, однако могут быть вычислены, если в метод будут переданы дополнительные аргументы для расчета.

    Например:

    ```func
    slice get_wallet_address(slice owner_address) method_id {
        (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
        return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
    }
    ```

2. **Получение данных с учетом условий.** Иногда значения, которые нужно получить, зависят от каких-либо параметров, к примеру, от текущего времени.

    Например:

    ```func
    (int) get_ready_to_be_used() method_id {
        int ready? = now() >= 1686459600;
        return ready?;
    }
    ```

## Наиболее распространенные get-методы

### Стандартные кошельки

#### seqno()

```func
int seqno() method_id {
    return get_data().begin_parse().preload_uint(32);
}
```

Возвращает порядковый номер транзакции в определённом кошельке. Этот метод в основном используется для [защиты от повторных отправок](/v3/guidelines/smart-contracts/howto/wallet#replay-protection---seqno).

#### get_subwallet_id()

```func
int get_subwallet_id() method_id {
    return get_data().begin_parse().skip_bits(32).preload_uint(32);
}
```

- [Что такое Subwallet ID?](/v3/guidelines/smart-contracts/howto/wallet#subwallet-ids)

#### get_public_key()

```func
int get_public_key() method_id {
    var cs = get_data().begin_parse().skip_bits(64);
    return cs.preload_uint(256);
}
```

Получает публичный ключ, связанный с кошельком.

### Жетоны

#### get_wallet_data()

```func
(int, slice, slice, cell) get_wallet_data() method_id {
    return load_data();
}
```

Этот метод возвращает полный набор данных, связанных с кошельком Jetton:

- (int) balance
- (slice) owner_address
- (slice) jetton_master_address
- (cell) jetton_wallet_code

#### get_jetton_data()

```func
(int, int, slice, cell, cell) get_jetton_data() method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return (total_supply, -1, admin_address, content, jetton_wallet_code);
}
```

Возвращает данные мастер-контракта Jetton, включая общий объём, адрес администратора, содержимое жетона и код кошелька.

#### get_wallet_address(slice owner_address)

```func
slice get_wallet_address(slice owner_address) method_id {
    (int total_supply, slice admin_address, cell content, cell jetton_wallet_code) = load_data();
    return calculate_user_jetton_wallet_address(owner_address, my_address(), jetton_wallet_code);
}
```

На основе адреса владельца этот метод вычисляет и возвращает адрес его кошелька Jetton.

### NFT

#### get_nft_data()

```func
(int, int, slice, slice, cell) get_nft_data() method_id {
    (int init?, int index, slice collection_address, slice owner_address, cell content) = load_data();
    return (init?, index, collection_address, owner_address, content);
}
```

Возвращает данные, связанные с невзаимозаменяемым токеном, включая информацию о том, был ли он инициализирован, индекс в коллекции, адрес коллекции, адрес владельца и индивидуальное содержимое.

#### get_collection_data()

```func
(int, cell, slice) get_collection_data() method_id {
    var (owner_address, next_item_index, content, _, _) = load_data();
    slice cs = content.begin_parse();
    return (next_item_index, cs~load_ref(), owner_address);
}
```

Возвращает данные о коллекции NFT, включая индекс следующего элемента для минта, содержимое коллекции и адрес владельца.

#### get_nft_address_by_index(int index)

```func
slice get_nft_address_by_index(int index) method_id {
    var (_, _, _, nft_item_code, _) = load_data();
    cell state_init = calculate_nft_item_state_init(index, nft_item_code);
    return calculate_nft_item_address(workchain(), state_init);
}
```

С учетом индекса, этот метод вычисляет и возвращает адрес соответствующего контракта NFT-элемента этой коллекции.

#### royalty_params()

```func
(int, int, slice) royalty_params() method_id {
    var (_, _, _, _, royalty) = load_data();
    slice rs = royalty.begin_parse();
    return (rs~load_uint(16), rs~load_uint(16), rs~load_msg_addr());
}
```

Получает параметры роялти для NFT. Эти параметры включают процент роялти, который выплачивается первоначальному создателю при продаже NFT.

#### get_nft_content(int index, cell individual_nft_content)

```func
cell get_nft_content(int index, cell individual_nft_content) method_id {
    var (_, _, content, _, _) = load_data();
    slice cs = content.begin_parse();
    cs~load_ref();
    slice common_content = cs~load_ref().begin_parse();
    return (begin_cell()
            .store_uint(1, 8) ;; offchain tag
            .store_slice(common_content)
            .store_ref(individual_nft_content)
            .end_cell());
}
```

С учетом индекса и [индивидуального содержимого NFT](#get_nft_data), этот метод получает и возвращает объединённое общее и индивидуальное содержимое NFT.

## Как работать с get-методами

### Поиск get-методов на популярных обозревателях

#### Tonviewer

Вы можете вызвать get-методы в нижней части страницы во вкладке "Methods"

- https://tonviewer.com/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI?section=method

#### Ton.cx

Вы можете вызвать get-методы во вкладке "Get methods"

- https://ton.cx/address/EQAWrNGl875lXA6Fff7nIOwTIYuwiJMq0SmtJ5Txhgnz4tXI

### Вызов get-методов из кода

В примерах ниже мы будем использовать библиотеки и инструменты JavaScript:

- Библиотека [TON](https://github.com/ton-org/ton)
- [Blueprint](/v3/documentation/smart-contracts/getting-started/javascript) SDK

Представим, что у нас есть контракт со следующим get-методом:

```func
(int) get_total() method_id {
    return get_data().begin_parse().preload_uint(32); ;; load and return the 32-bit number from the data
}
```

Этот метод возвращает значение в виде числа из данных контракта.

Приведенный ниже фрагмент кода позволяет вызвать этот get-метод в контракте, развёрнутом по известному адресу:

```ts
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';

async function main() {
    // Create Client
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    // Call get method
    const result = await client.runMethod(
        Address.parse('EQD4eA1SdQOivBbTczzElFmfiKu4SXNL4S29TReQwzzr_70k'),
        'get_total'
    );
    const total = result.stack.readNumber();
    console.log('Total:', total);
}

main();
```

Этот код выдаст результат `Total: 123`. Число может быть другим, это просто пример.

### Тестирование get-методов

Для тестирования созданных смарт-контрактов можно использовать [Sandbox](https://github.com/ton-community/sandbox), который по умолчанию устанавливается в новые проекты Blueprint.

Сначала добавьте специальный метод в оболочку контракта, который будет выполнять get-метод и возвращать введенный результат. Допустим, ваш контракт называется *Counter*, и в нем уже реализован метод обновления значения в виде числа. Откройте `wrappers/Counter.ts` и добавьте следующий метод:

```ts
async getTotal(provider: ContractProvider) {
    const result = (await provider.get('get_total', [])).stack;
    return result.readNumber();
}
```

Этот метод выполняет get-запрос и получает результирующий стек. В контексте get-методов стек - это результат вызова метода. В данном примере кода результат представлен в виде одного числа. В более сложных случаях, когда возвращается сразу несколько значений, для обработки всего результата, можно, к примеру, несколько раз вызвать метод `readSomething`.

Теперь можно использовать этот метод в наших тестах. Перейдите в `tests/Counter.spec.ts` и добавьте новый тест:

```ts
it('should return correct number from get method', async () => {
    const caller = await blockchain.treasury('caller');
    await counter.sendNumber(caller.getSender(), toNano('0.01'), 123);
    expect(await counter.getTotal()).toEqual(123);
});
```

Проверьте, запустив `npx blueprint test` в терминале. Если все сделано правильно, тест пройдёт успешно!

## Вызов get-методов из других контрактов

Несмотря на кажущуюся очевидность, вызвать get-методы из других контрактов on-chain невозможно. Это связано с особенностями блокчейн-технологии и необходимостью консенсуса.

Во-первых, получение данных из другого шардчейна может занять время. Такая задержка способна нарушить процесс выполнения контракта, так как операции в блокчейне должны выполняться детерминированно и без задержек.

Во-вторых, достичь консенсуса среди валидаторов будет сложно. Чтобы проверить корректность транзакции, валидаторы должны вызывать один и тот же get-метод. Однако если состояние целевого контракта изменится между вызовами, результат транзакции может отличаться у разных валидаторов.

И, наконец - смарт-контракты в TON работают как чистые функции: при одинаковых входных данных они всегда возвращают одинаковый результат. Это упрощает достижение консенсуса при обработке сообщений. Если же включить в процесс выполнения метода произвольные, динамически меняющиеся данные, это нарушит детерминированность.

### Влияние на разработку

Эти ограничения означают, что один контракт не может напрямую получать данные о состоянии другого контракта через его get-методы. Отсутствие возможности использовать внешние данные в реальном времени в детерминированном потоке контракта может показаться неудобным, но именно эти ограничения обеспечивают надежность и целостность блокчейна.

### Решения и обходные пути

В блокчейне TON смарт-контракты взаимодейстсвуют с помощью сообщений, а не вызывают напрямую методы другого контракта. Целевому контракту можно отправить сообщение с запросом на выполнение определённого метода. Такие запросы обычно включают специальные [коды операций](/v3/documentation/smart-contracts/message-management/internal-messages).

Контракт, который принимает такие запросы, выполняет нужный метод и отправляет результат обратно в отдельном сообщении. Это может показаться сложным, но на практике упрощает взаимодействие между контрактами и повышает масштабируемость и производительность сети.

Этот механизм передачи сообщений - ключевой элемент работы блокчейна TON, позволяющий сети масштабироваться без сложной синхронизации между шардами.

Для эффективного взаимодействия между контрактами важно, чтобы они были разработаны так, чтобы корректно принимать и обрабатывать запросы. Включая указание методов, которые могут быть вызваны on-chain для возврата ответа.

Давайте рассмотрим простой пример:

```func
#include "imports/stdlib.fc";

int get_total() method_id {
    return get_data().begin_parse().preload_uint(32);
}

() recv_internal(int my_balance, int msg_value, cell in_msg_full, slice in_msg_body) impure {
    if (in_msg_body.slice_bits() < 32) {
        return ();
    }

    slice cs = in_msg_full.begin_parse();
    cs~skip_bits(4);
    slice sender = cs~load_msg_addr();

    int op = in_msg_body~load_uint(32); ;; load the operation code

    if (op == 1) { ;; increase and update the number
        int number = in_msg_body~load_uint(32);
        int total = get_total();
        total += number;
        set_data(begin_cell().store_uint(total, 32).end_cell());
    }
    elseif (op == 2) { ;; query the number
        int total = get_total();
        send_raw_message(begin_cell()
            .store_uint(0x18, 6)
            .store_slice(sender)
            .store_coins(0)
            .store_uint(0, 107) ;; default message headers (see sending messages page)
            .store_uint(3, 32) ;; response operation code
            .store_uint(total, 32) ;; the requested number
        .end_cell(), 64);
    }
}
```

В этом примере контракт получает и обрабатывает внутренние сообщения, распознает коды операций (опкоды), выполняет нужные методы и отправляет соответствующие ответы:

- Oпкод `1` обозначает запрос на обновление числа в данных контракта
- Опкод `2` обозначает запрос на получение числа из данных контракта
- Опкод `3` используется в ответном сообщении, которое вызывающий смарт-контракт должен обработать, чтобы получить результат

Для простоты мы использовали в качестве кодов операций (опкодов) простые числа 1, 2 и 3. Но для реальных проектов лучше использовать стандартные значения:

- [CRC32-хеши для опкодов](/v3/documentation/data-formats/tlb/crc32)

## Распространённые ошибки и как их избежать

1. **Неправильное использование get-методов.** Как уже упоминалось ранее, get-методы предназначены для получения данных из состояния контракта и не могут его изменять. Попытка изменить состояние контракта внутри get-метода не даст результата.

2. **Игнорирование возвращаемых типов.** Каждый get-метод должен иметь чётко определённый тип возвращаемых данных. Если метод должен возвращать данные определённого типа, убедитесь, что во всех сценариях выполнения возвращается именно этот тип. Избегайте использования несогласованных типов возвращаемых значений - это может привести к ошибкам и усложнить взаимодействие с контрактом.

3. **Ошибочное предположение о кросс-контрактных вызовах.** Распространённое заблуждение заключается в том, что get-методы можно вызывать из других контрактов on-chain. Однако, как уже говорилось, это невозможно из-за особенностей блокчейна и необходимости консенсуса. Всегда помните, что get-методы предназначены для использования off-chain, а взаимодействие между контрактами on-chain осуществляется через внутренние сообщения.

## Заключение

Get-методы - это важный инструмент для запроса данных из смарт-контрактов в блокчейне TON. Хотя у них есть свои ограничения, понимание этих ограничений и умение их обходить - ключ к эффективному использованию get-методов в ваших смарт-контрактах.
