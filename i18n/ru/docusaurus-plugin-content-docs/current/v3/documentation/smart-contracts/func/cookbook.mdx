# Кулинарная книга FunC

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Основная цель создания кулинарной книги FunC - собрать весь опыт разработчиков FunC в одном месте, чтобы будущие разработчики могли им воспользоваться!

По сравнению с [документацией FunC](/v3/documentation/smart-contracts/func/docs/types), эта статья больше сосредоточена на повседневных задачах каждого разработчика FunC, которые необходимо решать при разработке смарт-контрактов.

## Основы

### Как написать оператор if

Допустим, мы хотим проверить, имеет ли значение какое-либо событие. Для этого мы используем переменную флага. Помните, что в FunC `true` — это `-1`, а `false` — это `0`.

```func
int flag = 0; ;; false

if (flag) { 
    ;; do something
}
else {
    ;; reject the transaction
}
```

> 💡 Примечание
>
> Нам не нужен оператор `==`, потому что значение `0` — это `false`, поэтому любое другое значение будет `true`.

> 💡 Полезные ссылки
>
> ["Оператор If" в документации](/v3/documentation/smart-contracts/func/docs/statements#if-statements)

### Как написать цикл repeat

Как пример, возьмем возведение в степень

```func
int number = 2;
int multiplier = number;
int degree = 5;

repeat(degree - 1) {

    number *= multiplier;
}
```

> 💡 Полезные ссылки
>
> ["Цикл repeat" в документации](/v3/documentation/smart-contracts/func/docs/statements#repeat-loop)

### Как написать цикл while

While полезен, когда мы не знаем, как часто выполнять определенное действие. Например, возьмем `cell`, которая, как известно, хранит до четырех ссылок на другие ячейки.

```func
cell inner_cell = begin_cell() ;; create a new empty builder
        .store_uint(123, 16) ;; store uint with value 123 and length 16 bits
        .end_cell(); ;; convert builder to a cell

cell message = begin_cell()
        .store_ref(inner_cell) ;; store cell as reference
        .store_ref(inner_cell)
        .end_cell();

slice msg = message.begin_parse(); ;; convert cell to slice
while (msg.slice_refs_empty?() != -1) { ;; we should remind that -1 is true
    cell inner_cell = msg~load_ref(); ;; load cell from slice msg
    ;; do something
}
```

> 💡 Полезные ссылки
>
> ["Цикл while" в документации](/v3/documentation/smart-contracts/func/docs/statements#while-loop)
>
> ["Cell" в документации](/v3/concepts/dive-into-ton/ton-blockchain/cells-as-data-storage)
>
> ["slice_refs_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#slice_refs_empty)
>
> ["store_ref()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
>
> ["begin_parse()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### Как написать цикл do until

Когда нам нужно, чтобы цикл выполнился хотя бы один раз, мы используем `do until`.

```func
int flag = 0;

do {
    ;; do something even flag is false (0) 
} until (flag == -1); ;; -1 is true
```

> 💡 Полезные ссылки
>
> ["Until loop" в документации](/v3/documentation/smart-contracts/func/docs/statements#until-loop)

### Как определить, пуст ли срез

Перед тем, как работать с `slice`, необходимо проверить, есть ли у него какие-либо данные, чтобы правильно их обработать. Для этого можно использовать `slice_empty?()`, но нужно учитывать, что он вернет `0` (`false`), если есть хотя бы один `bit` данных или одна `ref`.

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_empty?()` returns `true`, because slice doesn't have any `bits` and `refs`
empty_slice.slice_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_empty?()` returns `false`, because slice have any `bits` and `refs`
slice_with_bits_and_refs.slice_empty?();
```

> 💡 Полезные ссылки
>
> ["slice_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#slice_empty)
>
> ["store_slice()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> ["store_ref()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
>
> ["begin_parse()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### Как определить, является ли срез пустым (не имеет битов, но может иметь ссылки)

Если нам нужно проверить только `bits` и неважно, есть ли какие-либо `refs` в `slice`, то нам следует использовать `slice_data_empty?()`.

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
empty_slice.slice_data_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_only.slice_data_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `true`, because slice doesn't have any `bits`
slice_with_refs_only.slice_data_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_data_empty?()` returns `false`, because slice have any `bits`
slice_with_bits_and_refs.slice_data_empty?();
```

> 💡 Полезные ссылки
>
> ["slice_data_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#slice_data_empty)
>
> ["store_slice()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> ["store_ref()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
>
> ["begin_parse()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### Как определить, является ли срез пустым (не имеет ссылок, но может иметь биты)

В случае, если нас интересуют только `refs`, мы должны проверить их наличие с помощью `slice_refs_empty?()`.

```func
;; creating empty slice
slice empty_slice = "";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
empty_slice.slice_refs_empty?();

;; creating slice which contains bits only
slice slice_with_bits_only = "Hello, world!";
;; `slice_refs_empty?()` returns `true`, because slice doesn't have any `refs`
slice_with_bits_only.slice_refs_empty?();

;; creating slice which contains refs only
slice slice_with_refs_only = begin_cell()
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_refs_only.slice_refs_empty?();

;; creating slice which contains bits and refs
slice slice_with_bits_and_refs = begin_cell()
    .store_slice("Hello, world!")
    .store_ref(null())
    .end_cell()
    .begin_parse();
;; `slice_refs_empty?()` returns `false`, because slice have any `refs`
slice_with_bits_and_refs.slice_refs_empty?();
```

> 💡 Полезные ссылки
>
> ["slice_refs_empty?()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#slice_refs_empty)
>
> ["store_slice()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> ["store_ref()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#store_ref)
>
> ["begin_cell()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["end_cell()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
>
> ["begin_parse()" в документациии](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### Как определить, пуста ли ячейка

Чтобы проверить, есть ли какие-либо данные в `cell`, мы должны сначала преобразовать ее в `slice`. Если нас интересуют только `bits`, мы должны использовать `slice_data_empty?()`, если только `refs` - `slice_refs_empty?()`. В случае, если мы хотим проверить наличие каких-либо данных, независимо от того, являются ли они `bit` или `ref`, мы должны использовать `slice_empty?()`.

```func
cell cell_with_bits_and_refs = begin_cell()
    .store_uint(1337, 16)
    .store_ref(null())
    .end_cell();

;; Change `cell` type to slice with `begin_parse()`
slice cs = cell_with_bits_and_refs.begin_parse();

;; determine if slice is empty
if (cs.slice_empty?()) {
    ;; cell is empty
}
else {
    ;; cell is not empty
}
```

> 💡 Полезные ссылки
>
> ["slice_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#slice_empty)
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["store_uint()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#end_cell)
>
> ["begin_parse()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_parse)

### Как определить, пуст ли словарь

Существует метод `dict_empty?()` для проверки наличия данных в словаре. Этот метод эквивалентен `cell_null?()`, поскольку обычно `null`-ячейка является пустым словарем.

```func
cell d = new_dict();
d~udict_set(256, 0, "hello");
d~udict_set(256, 1, "world");

if (d.dict_empty?()) { ;; Determine if dict is empty
    ;; dict is empty
}
else {
    ;; dict is not empty
}
```

> 💡 Полезные ссылки
>
> ["dict_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#dict_empty)
>
> ["new_dict()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict) создание пустого словаря
>
> ["dict_set()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set) добавление некоторых элементов в словарь d с помощью функции, чтобы он не был пустым

### Как определить, пуст ли кортеж

При работе с `tuples` всегда важно знать, есть ли внутри какие-либо значения для извлечения. Если мы попытаемся извлечь значение из пустого `tuple`, то получим ошибку: "кортеж недопустимого размера" с `exit code 7`.

```func
;; Declare tlen function because it's not presented in stdlib
(int) tlen (tuple t) asm "TLEN";

() main () {
    tuple t = empty_tuple();
    t~tpush(13);
    t~tpush(37);

    if (t.tlen() == 0) {
        ;; tuple is empty
    }
    else {
        ;; tuple is not empty
    }
}
```

> 💡 Примечание
>
> Мы объявляем функцию сборки tlen. Вы можете прочитать больше [здесь](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) и посмотреть [список всех команд ассемблера](/v3/documentation/tvm/instructions).

> 💡 Полезные ссылки
>
> ["empty_tuple?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#empty_tuple)
>
> ["tpush()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)
>
> ["Коды выхода" в документации](/v3/documentation/tvm/tvm-exit-codes)

### Как определить, пуст ли lisp-подобный список

```func
tuple numbers = null();
numbers = cons(100, numbers);

if (numbers.null?()) {
    ;; list-style list is empty
} else {
    ;; list-style list is not empty
}
```

Мы добавляем число 100 в наш lisp-подобный список с помощью функции [cons](/v3/documentation/smart-contracts/func/docs/stdlib/#cons), поэтому он не пуст.

### Как определить, что состояние контракта пустое

Допустим, у нас есть `counter`, который хранит количество транзакций. Эта переменная недоступна во время первой транзакции в состоянии смарт-контракта, поскольку состояние пустое, поэтому необходимо обработать такой случай. Если состояние пустое, мы создаем переменную `counter` и сохраняем ее.

```func
;; `get_data()` will return the data cell from contract state
cell contract_data = get_data();
slice cs = contract_data.begin_parse();

if (cs.slice_empty?()) {
    ;; contract data is empty, so we create counter and save it
    int counter = 1;
    ;; create cell, add counter and save in contract state
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
else {
    ;; contract data is not empty, so we get our counter, increase it and save
    ;; we should specify correct length of our counter in bits
    int counter = cs~load_uint(32) + 1;
    set_data(begin_cell().store_uint(counter, 32).end_cell());
}
```

> 💡 Примечание
>
> Мы можем определить, что состояние контракта пустое, определив, что [ячейка пуста](/v3/documentation/smart-contracts/func/cookbook#how-to-determine-if-cell-is-empty).

> 💡 Полезные ссылки
>
> ["get_data()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#get_data)
>
> ["begin_parse()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#begin_parse)
>
> ["slice_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
>
> ["set_data?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#set_data)

### Как построить ячейку внутреннего сообщения

Если мы хотим, чтобы контракт отправлял внутреннее сообщение, мы должны сначала правильно создать его как ячейку, указав технические флаги, адрес получателя и остальные данные.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
;; we use `op` for identifying operations
int op = 0;

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Примечание
>
> В этом примере мы используем литерал `a` для получения адреса. Подробнее о строковых литералах можно узнать в [документации](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 Примечание
>
> Подробнее можно узнать в [документации](/v3/documentation/smart-contracts/message-management/sending-messages). Также можно перейти к [макету](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout) по этой ссылке.

> 💡 Полезные ссылки
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["store_uint()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
>
> ["store_slice()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> ["store_coins()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
>
> ["send_raw_message()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### Как включить тело в качестве ссылки на внутреннюю ячейку сообщения

В теле сообщения, которое следует за флагами и другими техническими данными, мы можем отправить `int`, `slice` и `cell`. В последнем случае необходимо установить бит равным `1` перед `store_ref()`, чтобы указать, что `cell` будет продолжена.

Мы также можем отправить тело сообщения внутри той же `cell`, что и заголовок, если уверены, что у нас достаточно места. В этом случае нам нужно установить бит равным `0`.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
cell message_body = begin_cell() ;; Creating a cell with message
    .store_uint(op, 32)
    .store_slice("❤")
.end_cell();
    
cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; set bit to 1 to indicate that the cell will go on
    .store_ref(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Примечание
>
> В этом примере мы используем литерал `a` для получения адреса. Подробнее о строковых литералах можно узнать в [документации](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 Примечание
>
> В этом примере мы использовали режим 3, чтобы взять входящие ton и отправить ровно столько, сколько указано (сумма), при этом выплачивая комиссию с баланса контракта и игнорируя ошибки. Режим 64 необходим для возврата всех полученных ton, вычитая комиссию, а режим 128 отправит весь баланс.

> 💡 Примечание
>
> Мы [создаем сообщение](/v3/documentation/smart-contracts/func/cookbook#how-to-build-an-internal-message-cell), но добавляем тело сообщения отдельно.

> 💡 Полезные ссылки
>
> ["begin_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#begin_cell)
>
> ["store_uint()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_uint)
>
> ["store_slice()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_slice)
>
> ["store_coins()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#store_coins)
>
> ["end_cell()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#end_cell)
>
> ["send_raw_message()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### Как включить тело в качестве среза во внутреннюю ячейку сообщения

При отправке сообщений тело сообщения может быть отправлено либо как `cell`, либо как `slice`. В этом примере мы отправляем тело сообщения внутри `slice`.

```func
;; We use literal `a` to get valid address inside slice from string containing address 
slice addr = "EQArzP5prfRJtDM5WrMNWyr9yUTAi0c9o6PfR4hkWy9UQXHx"a;
int amount = 1000000000;
int op = 0;
slice message_body = "❤"; 

cell msg = begin_cell()
    .store_uint(0x18, 6)
    .store_slice(addr)
    .store_coins(amount)
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(op, 32)
    .store_slice(message_body)
.end_cell();

send_raw_message(msg, 3); ;; mode 3 - pay fees separately and ignore errors 
```

> 💡 Примечание
>
> В этом примере мы используем литерал `a` для получения адреса. Подробнее о строковых литералах можно узнать в [документации](/v3/documentation/smart-contracts/func/docs/literals_identifiers#string-literals)

> 💡 Примечание
>
> В этом примере мы использовали режим 3, чтобы взять входящие ton и отправить ровно столько, сколько указано (сумма), при этом выплачивая комиссию из баланса контракта и игнорируя ошибки. Режим 64 необходим для возврата всех полученных ton, вычитая комиссию, а режим 128 отправит весь баланс.

> 💡 Примечание
>
> Мы [строим сообщение](/v3/documentation/smart-contracts/func/cookbook#how-to-build-an-internal-message-cell), но добавляем сообщение как срез.

### Как перебирать кортежи (в обоих направлениях)

Если мы хотим работать с массивом или стеком в FunC, то там понадобится кортеж. И в первую очередь нам нужно уметь перебирать значения, чтобы работать с ними.

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    int len = t.tlen();
    
    int i = 0;
    while (i < len) {
        int x = t.at(i);
        ;; do something with x
        i = i + 1;
    }

    i = len - 1;
    while (i >= 0) {
        int x = t.at(i);
        ;; do something with x
        i = i - 1;
    }
}
```

> 💡 Примечание
>
> Мы объявляем функцию ассемблера `tlen`. Вы можете прочитать больше [здесь](/v3/documentation/smart-contracts/func/docs/functions#assembler-function-body-definition) и посмотреть [список всех команд ассемблера](/v3/documentation/tvm/instructions).
>
> Также мы объявляем функцию `to_tuple`. Она просто изменяет тип данных любого ввода на кортеж, поэтому будьте осторожны при ее использовании.

### Как писать собственные функции с использованием ключевого слова `asm`

При использовании любых функций мы фактически используем заранее подготовленные для нас методы внутри `stdlib.fc`. Но на самом деле, нам доступно гораздо больше возможностей, и нам нужно научиться писать их самим.

Например, у нас есть метод `tpush`, который добавляет элемент в `tuple`, но без `tpop`. В этом случае мы должны сделать это:

```func
;; ~ means it is modifying method
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP"; 
```

Если мы хотим узнать длину `tuple` для итерации, мы должны написать новую функцию с инструкцией `TLEN` asm:

```func
int tuple_length (tuple t) asm "TLEN";
```

Некоторые примеры функций, уже известных нам из stdlib.fc:

```func
slice begin_parse(cell c) asm "CTOS";
builder begin_cell() asm "NEWC";
cell end_cell(builder b) asm "ENDC";
```

> 💡 Полезные ссылки:
>
> ["Метод изменения" в документации](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)
>
> ["stdlib" в документации](/v3/documentation/smart-contracts/func/docs/stdlib)
>
> ["Инструкции TVM" в документации](/v3/documentation/tvm/instructions)

### Итерация n-вложенных кортежей

Иногда мы хотим итерировать вложенные кортежи. Следующий пример выполнит итерацию и выведет все элементы в кортеже в формате `[[2,6],[1,[3,[3,5]]], 3]`, начиная с заголовка

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> (tuple) to_tuple (X x) asm "NOP";

;; define global variable
global int max_value;

() iterate_tuple (tuple t) impure {
    repeat (t.tuple_length()) {
        var value = t~tpop();
        if (is_tuple(value)) {
            tuple tuple_value = cast_to_tuple(value);
            iterate_tuple(tuple_value);
        }
        else {
            if(value > max_value) {
                max_value = value;
            }
        }
    }
}

() main () {
    tuple t = to_tuple([[2,6], [1, [3, [3, 5]]], 3]);
    int len = t.tuple_length();
    max_value = 0; ;; reset max_value;
    iterate_tuple(t); ;; iterate tuple and find max value
    ~dump(max_value); ;; 6
}
```

> 💡 Полезные ссылки
>
> ["Глобальные переменные" в документации](/v3/documentation/smart-contracts/func/docs/global_variables)
>
> ["~dump" в документации](/v3/documentation/smart-contracts/func/docs/builtins#dump-variable)
>
> ["Инструкции TVM" в документации](/v3/documentation/tvm/instructions)

### Основные операции с кортежами

```func
(int) tlen (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

() main () {
    ;; creating an empty tuple
    tuple names = empty_tuple(); 
    
    ;; push new items
    names~tpush("Naito Narihira");
    names~tpush("Shiraki Shinichi");
    names~tpush("Akamatsu Hachemon");
    names~tpush("Takaki Yuichi");
    
    ;; pop last item
    slice last_name = names~tpop();

    ;; get first item
    slice first_name = names.first();

    ;; get an item by index
    slice best_name = names.at(2);

    ;; getting the length of the list 
    int number_names = names.tlen();
}
```

### Определение типа X

В следующем примере проверяется, содержится ли в кортеже какое-либо значение, но кортеж содержит значения X (cell, slice, int, tuple, int). Нам нужно проверить значение и привести его в соответствие.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";

forall X -> () resolve_type (X value) impure {
    ;; value here is of type X, since we dont know what is the exact value - we would need to check what is the value and then cast it
    
    if (is_null(value)) {
        ;; do something with the null
    }
    elseif (is_int(value)) {
        int valueAsInt = cast_to_int(value);
        ;; do something with the int
    }
    elseif (is_slice(value)) {
        slice valueAsSlice = cast_to_slice(value);
        ;; do something with the slice
    }
    elseif (is_cell(value)) {
        cell valueAsCell = cast_to_cell(value);
        ;; do something with the cell
    }
    elseif (is_tuple(value)) {
        tuple valueAsTuple = cast_to_tuple(value);
        ;; do something with the tuple
    }
}

() main () {
    ;; creating an empty tuple
    tuple stack = empty_tuple();
    ;; let's say we have tuple and do not know the exact types of them
    stack~tpush("Some text");
    stack~tpush(4);
    ;; we use var because we do not know type of value
    var value = stack~tpop();
    resolve_type(value);
}
```

> 💡 Полезные ссылки
>
> ["Инструкции TVM" в документации](/v3/documentation/tvm/instructions)

### Как получить текущее время

```func
int current_time = now();
  
if (current_time > 1672080143) {
    ;; do some stuff 
}
```

### Как сгенерировать случайное число

:::caution черновик

Ознакомьтесь с [генерацией случайных чисел](/v3/guidelines/smart-contracts/security/random-number-generation) для получения дополнительной информации.
:::

```func
randomize_lt(); ;; do this once

int a = rand(10);
int b = rand(1000000);
int c = random();
```

### Операции по модулю

В качестве примера предположим, что мы хотим выполнить следующее вычисление всех 256 чисел: `(xp + zp)*(xp-zp)`. Поскольку большинство этих операций используются в криптографии, в следующем примере мы используем оператор по модулю для кривых Монтгомери.
Обратите внимание, что xp+zp — это допустимое имя переменной (без пробелов между ними).

```func
(int) modulo_operations (int xp, int zp) {  
   ;; 2^255 - 19 is a prime number for montgomery curves, meaning all operations should be done against its prime
   int prime = 57896044618658097711785492504343953926634992332820282019728792003956564819949; 

   ;; muldivmod handles the next two lines itself
   ;; int xp+zp = (xp + zp) % prime;
   ;; int xp-zp = (xp - zp + prime) % prime;
   (_, int xp+zp*xp-zp) = muldivmod(xp + zp, xp - zp, prime);
   return xp+zp*xp-zp;
}
```

> 💡 Полезные ссылки
>
> ["muldivmod" в документации](/v3/documentation/tvm/instructions#A98C)

### Как вызывать ошибки

```func
int number = 198;

throw_if(35, number > 50); ;; the error will be triggered only if the number is greater than 50

throw_unless(39, number == 198); ;; the error will be triggered only if the number is NOT EQUAL to 198

throw(36); ;; the error will be triggered anyway
```

[Стандартные коды исключений tvm](/v3/documentation/tvm/tvm-exit-codes)

### Переворачивание кортежей

Поскольку кортеж хранит данные в виде стека, иногда нам приходится переворачивать его, чтобы прочитать данные с другого конца.

```func
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple) to_tuple (X x) asm "NOP";

(tuple) reverse_tuple (tuple t1) {
    tuple t2 = empty_tuple();
    repeat (t1.tuple_length()) {
        var value = t1~tpop();
        t2~tpush(value);
    }
    return t2;
}

() main () {
    tuple t = to_tuple([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    tuple reversed_t = reverse_tuple(t);
    ~dump(reversed_t); ;; [10 9 8 7 6 5 4 3 2 1]
}
```

> 💡 Полезные ссылки
>
> ["tpush()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#tpush)

### Как удалить элемент с определенным индексом из списка

```func
int tlen (tuple t) asm "TLEN";

(tuple, ()) remove_item (tuple old_tuple, int place) {
    tuple new_tuple = empty_tuple();

    int i = 0;
    while (i < old_tuple.tlen()) {
        int el = old_tuple.at(i);
        if (i != place) {
            new_tuple~tpush(el);
        }
        i += 1;  
    }
    return (new_tuple, ());
}

() main () {
    tuple numbers = empty_tuple();

    numbers~tpush(19);
    numbers~tpush(999);
    numbers~tpush(54);

    ~dump(numbers); ;; [19 999 54]

    numbers~remove_item(1); 

    ~dump(numbers); ;; [19 54]
}
```

### Определить, равны ли срезы

Есть два разных способа определить равенство. Один основан на хэше среза, а другой — на использовании инструкции SDEQ asm.

```func
int are_slices_equal_1? (slice a, slice b) {
    return a.slice_hash() == b.slice_hash();
}

int are_slices_equal_2? (slice a, slice b) asm "SDEQ";

() main () {
    slice a = "Some text";
    slice b = "Some text";
    ~dump(are_slices_equal_1?(a, b)); ;; -1 = true

    a = "Text";
    ;; We use literal `a` to get valid address inside slice from string containing address
    b = "EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF"a;
    ~dump(are_slices_equal_2?(a, b)); ;; 0 = false
}
```

#### 💡 Полезные ссылки

- ["slice_hash()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_hash)
- ["SDEQ" в документации](/v3/documentation/tvm/instructions#C705)

### Определяем, равны ли ячейки

Мы можем легко определить равенство ячеек на основе их хеша.

```func
int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

() main () {
    cell a = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    cell b = begin_cell()
            .store_uint(123, 16)
            .end_cell();

    ~dump(are_cells_equal?(a, b)); ;; -1 = true
}
```

> 💡 Полезные ссылки
>
> ["cell_hash()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### Определить, равны ли кортежи

Более продвинутым примером может быть повторение и сравнение каждого из значений кортежа. Поскольку они равны X, нам нужно проверить и привести к соответствующему типу, и, если это кортеж, выполнить его рекурсивную итерацию.

```func
int tuple_length (tuple t) asm "TLEN";
forall X -> (tuple, X) ~tpop (tuple t) asm "TPOP";
forall X -> int cast_to_int (X x) asm "NOP";
forall X -> cell cast_to_cell (X x) asm "NOP";
forall X -> slice cast_to_slice (X x) asm "NOP";
forall X -> tuple cast_to_tuple (X x) asm "NOP";
forall X -> int is_null (X x) asm "ISNULL";
forall X -> int is_int (X x) asm "<{ TRY:<{ 0 PUSHINT ADD DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_cell (X x) asm "<{ TRY:<{ CTOS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_slice (X x) asm "<{ TRY:<{ SBITS DROP -1 PUSHINT }>CATCH<{ 2DROP 0 PUSHINT }> }>CONT 1 1 CALLXARGS";
forall X -> int is_tuple (X x) asm "ISTUPLE";
int are_slices_equal? (slice a, slice b) asm "SDEQ";

int are_cells_equal? (cell a, cell b) {
    return a.cell_hash() == b.cell_hash();
}

(int) are_tuples_equal? (tuple t1, tuple t2) {
    int equal? = -1; ;; initial value to true
    
    if (t1.tuple_length() != t2.tuple_length()) {
        ;; if tuples are differ in length they cannot be equal
        return 0;
    }

    int i = t1.tuple_length();
    
    while (i > 0 & equal?) {
        var v1 = t1~tpop();
        var v2 = t2~tpop();
        
        if (is_null(t1) & is_null(t2)) {
            ;; nulls are always equal
        }
        elseif (is_int(v1) & is_int(v2)) {
            if (cast_to_int(v1) != cast_to_int(v2)) {
                equal? = 0;
            }
        }
        elseif (is_slice(v1) & is_slice(v2)) {
            if (~ are_slices_equal?(cast_to_slice(v1), cast_to_slice(v2))) {
                equal? = 0;
            }
        }
        elseif (is_cell(v1) & is_cell(v2)) {
            if (~ are_cells_equal?(cast_to_cell(v1), cast_to_cell(v2))) {
                equal? = 0;
            }
        }
        elseif (is_tuple(v1) & is_tuple(v2)) {
            ;; recursively determine nested tuples
            if (~ are_tuples_equal?(cast_to_tuple(v1), cast_to_tuple(v2))) {
                equal? = 0;
            }
        }
        else {
            equal? = 0;
        }

        i -= 1;
    }

    return equal?;
}

() main () {
    tuple t1 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);
    tuple t2 = cast_to_tuple([[2, 6], [1, [3, [3, 5]]], 3]);

    ~dump(are_tuples_equal?(t1, t2)); ;; -1 
}
```

> 💡 Полезные ссылки
>
> ["cell_hash()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)
>
> ["Инструкции TVM" в документации](/v3/documentation/tvm/instructions)

### Генерация внутреннего адреса

Нам нужно сгенерировать внутренний адрес, когда наш контракт должен развернуть новый контракт, но мы не знаем его адрес. Предположим, у нас уже есть `state_init` — код и данные нового контракта.

Создает внутренний адрес для соответствующего MsgAddressInt TLB.

```func
(slice) generate_internal_address (int workchain_id, cell state_init) {
    ;; addr_std$10 anycast:(Maybe Anycast) workchain_id:int8 address:bits256  = MsgAddressInt;

    return begin_cell()
        .store_uint(2, 2) ;; addr_std$10
        .store_uint(0, 1) ;; anycast nothing
        .store_int(workchain_id, 8) ;; workchain_id: -1
        .store_uint(cell_hash(state_init), 256)
    .end_cell().begin_parse();
}

() main () {
    slice deploy_address = generate_internal_address(workchain(), state_init);
    ;; then we can deploy new contract
}
```

> 💡 Примечание
>
> В этом примере мы используем `workchain()` для получения идентификатора воркчейна. Подробнее о идентификаторе воркчейна можно узнать в [документации](/v3/documentation/smart-contracts/addresses#workchain-id).

> 💡 Полезные ссылки
>
> ["cell_hash()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#cell_hash)

### Генерация внешнего адреса

Мы используем схему TL-B из [block.tlb](https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/block/block.tlb#L101C1-L101C12), чтобы понять, как нам нужно создать адрес в этом формате.

```func
(int) ubitsize (int a) asm "UBITSIZE";

slice generate_external_address (int address) {
    ;; addr_extern$01 len:(## 9) external_address:(bits len) = MsgAddressExt;
    
    int address_length = ubitsize(address);
    
    return begin_cell()
        .store_uint(1, 2) ;; addr_extern$01
        .store_uint(address_length, 9)
        .store_uint(address, address_length)
    .end_cell().begin_parse();
}
```

Поскольку нам нужно определить количество бит, занимаемых адресом, необходимо также [объявить функцию asm](#how-to-write-own-functions-using-asm-keyword) с кодом операции `UBITSIZE`, которая вернет минимальное количество бит, необходимое для хранения числа.

> 💡 Полезные ссылки
>
> ["Инструкции TVM" в документации](/v3/documentation/tvm/instructions#B603)

### Как хранить и загружать словарь в локальном хранилище

Логика загрузки словаря

```func
slice local_storage = get_data().begin_parse();
cell dictionary_cell = new_dict();
if (~ slice_empty?(local_storage)) {
    dictionary_cell = local_storage~load_dict();
}
```

В то время как логика хранения словаря похожа на следующий пример:

```func
set_data(begin_cell().store_dict(dictionary_cell).end_cell());
```

> 💡 Полезные ссылки
>
> ["get_data()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#get_data)
>
> ["new_dict()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#new_dict)
>
> ["slice_empty?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_empty)
>
> ["load_dict()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#load_dict)
>
> ["~" в документации](/v3/documentation/smart-contracts/func/docs/statements#unary-operators)

### Как отправить простое сообщение

Обычно мы отправляем tons с комментарием в виде простого сообщения. Чтобы указать, что тело сообщения является `comment`, мы должны установить `32 bits` перед текстом сообщения в 0.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Полезные ссылки
>
> ["Макет сообщения" в документации](/v3/documentation/smart-contracts/message-management/sending-messages)

### Как отправить сообщение с помощью входящего аккаунта

Пример контракта ниже пригодится нам, если нам нужно выполнить какие-либо действия между пользователем и основным контрактом, то есть нам нужен прокси-контракт.

```func
() recv_internal (slice in_msg_body) {
    {-
        This is a simple example of a proxy-contract.
        It will expect in_msg_body to contain message mode, body and destination address to be sent to.
    -}

    int mode = in_msg_body~load_uint(8); ;; first byte will contain msg mode
    slice addr = in_msg_body~load_msg_addr(); ;; then we parse the destination address
    slice body = in_msg_body; ;; everything that is left in in_msg_body will be our new message's body

    cell msg = begin_cell()
        .store_uint(0x18, 6)
        .store_slice(addr)
        .store_coins(100) ;; just for example
        .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
        .store_slice(body)
    .end_cell();
    send_raw_message(msg, mode);
}
```

> 💡 Полезные ссылки
>
> ["Макет сообщения" в документации](/v3/documentation/smart-contracts/message-management/sending-messages)
>
> ["load_msg_addr()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#load_msg_addr)

### Как отправить сообщение со всем балансом

Если нам нужно отправить весь баланс смарт-контракта, то в этом случае нам нужно использовать отправить `mode 128`. Примером такого случая может служить прокси-контракт, который принимает платежи и пересылает их основному контракту.

```func
cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(0) ;; we don't care about this value right now
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1 + 1) ;; default message headers (see sending messages page)
    .store_uint(0, 32) ;; zero opcode - means simple transfer message with comment
    .store_slice("Hello from FunC!") ;; comment
.end_cell();
send_raw_message(msg, 128); ;; mode = 128 is used for messages that are to carry all the remaining balance of the current smart contract
```

> 💡 Полезные ссылки
>
> ["Макет сообщения" в документации](/v3/documentation/smart-contracts/message-management/sending-messages)
>
> ["Режимы сообщения" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#send_raw_message)

### Как отправить сообщение с длинным текстовым комментарием

Как мы знаем, в одну `cell` помещается только 127 символов (< 1023 бит). Если нам нужно больше - нужно организовать ячейки змейкой.

```func
{-
    If we want to send a message with really long comment, we should split the comment to several slices.
    Each slice should have <1023 bits of data (127 chars).
    Each slice should have a reference to the next one, forming a snake-like structure.
-}

cell body = begin_cell()
    .store_uint(0, 32) ;; zero opcode - simple message with comment
    .store_slice("long long long message...")
    .store_ref(begin_cell()
        .store_slice(" you can store string of almost any length here.")
        .store_ref(begin_cell()
            .store_slice(" just don't forget about the 127 chars limit for each slice")
        .end_cell())
    .end_cell())
.end_cell();

cell msg = begin_cell()
    .store_uint(0x18, 6) ;; flags
    ;; We use literal `a` to get valid address inside slice from string containing address 
    .store_slice("EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL"a) ;; destination address
    .store_coins(100) ;; amount of nanoTons to send
    .store_uint(0, 1 + 4 + 4 + 64 + 32 + 1) ;; default message headers (see sending messages page)
    .store_uint(1, 1) ;; we want to store body as a ref
    .store_ref(body)
.end_cell();
send_raw_message(msg, 3); ;; mode 3 - pay fees separately, ignore errors
```

> 💡 Полезные ссылки
>
> ["Внутренние сообщения" в документации](/v3/documentation/smart-contracts/message-management/internal-messages)

### Как получить только биты данных из среза (без ссылок)

Если нас не интересуют `refs` внутри `slice`, то мы можем получить отдельные данные и работать с ними.

```func
slice s = begin_cell()
    .store_slice("Some data bits...")
    .store_ref(begin_cell().end_cell()) ;; some references
    .store_ref(begin_cell().end_cell()) ;; some references
.end_cell().begin_parse();

slice s_only_data = s.preload_bits(s.slice_bits());
```

> 💡 Полезные ссылки
>
> ["Примитивы срезов" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice-primitives)
>
> ["preload_bits()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#preload_bits)
>
> ["slice_bits()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_bits)

### Как определить собственный метод изменения

Методы изменения позволяют изменять данные в пределах одной переменной. Это можно сравнить со ссылками в других языках программирования.

```func
(slice, (int)) load_digit (slice s) {
    int x = s~load_uint(8); ;; load 8 bits (one char) from slice
    x -= 48; ;; char '0' has code of 48, so we substract it to get the digit as a number
    return (s, (x)); ;; return our modified slice and loaded digit
}

() main () {
    slice s = "258";
    int c1 = s~load_digit();
    int c2 = s~load_digit();
    int c3 = s~load_digit();
    ;; here s is equal to "", and c1 = 2, c2 = 5, c3 = 8
}
```

> 💡 Полезные ссылки
>
> ["Методы изменения" в документации](/v3/documentation/smart-contracts/func/docs/statements#modifying-methods)

### Как возвести число в степень n

```func
;; Unoptimized variant
int pow (int a, int n) {
    int i = 0;
    int value = a;
    while (i < n - 1) {
        a *= value;
        i += 1;
    }
    return a;
}

;; Optimized variant
(int) binpow (int n, int e) {
    if (e == 0) {
        return 1;
    }
    if (e == 1) {
        return n;
    }
    int p = binpow(n, e / 2);
    p *= p;
    if ((e % 2) == 1) {
        p *= n;
    }
    return p;
}

() main () {
    int num = binpow(2, 3);
    ~dump(num); ;; 8
}
```

### Как преобразовать строку в целое число

```func
slice string_number = "26052021";
int number = 0;

while (~ string_number.slice_empty?()) {
    int char = string_number~load_uint(8);
    number = (number * 10) + (char - 48); ;; we use ASCII table
}

~dump(number);
```

### Как преобразовать целое число в строку

```func
int n = 261119911;
builder string = begin_cell();
tuple chars = null();
do {
    int r = n~divmod(10);
    chars = cons(r + 48, chars);
} until (n == 0);
do {
    int char = chars~list_next();
    string~store_uint(char, 8);
} until (null?(chars));

slice result = string.end_cell().begin_parse();
~dump(result);
```

### Как перебирать словари

Словари очень полезны при работе с большим количеством данных. Мы можем получить минимальные и максимальные значения ключей, используя встроенные методы `dict_get_min?` и `dict_get_max?` соответственно. Кроме того, мы можем использовать `dict_get_next?` для перебирания словаря.

```func
cell d = new_dict();
d~udict_set(256, 1, "value 1");
d~udict_set(256, 5, "value 2");
d~udict_set(256, 12, "value 3");

;; iterate keys from small to big
(int key, slice val, int flag) = d.udict_get_min?(256);
while (flag) {
    ;; do something with pair key->val
    
    (key, val, flag) = d.udict_get_next?(256, key);
}
```

> 💡 Полезные ссылки
>
> ["Примитивы словарей" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dictionaries-primitives)
>
> ["dict_get_max?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_max)
>
> ["dict_get_min?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_min)
>
> ["dict_get_next?()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_get_next)
>
> ["dict_set()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#dict_set)

### Как удалить значение из словарей

```func
cell names = new_dict();
names~udict_set(256, 27, "Alice");
names~udict_set(256, 25, "Bob");

names~udict_delete?(256, 27);

(slice val, int key) = names.udict_get?(256, 27);
~dump(val); ;; null() -> means that key was not found in a dictionary
```

### Как рекурсивно перебрать дерево ячеек

Как мы знаем, одна `cell` может хранить до `1023 bits` данных и до `4 refs`. Чтобы обойти это ограничение, мы можем использовать дерево ячеек, но для этого нам нужно иметь возможность перебирать его для правильной обработки данных.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; just some cell for example
    cell c = begin_cell()
        .store_uint(1, 16)
        .store_ref(begin_cell()
            .store_uint(2, 16)
        .end_cell())
        .store_ref(begin_cell()
            .store_uint(3, 16)
            .store_ref(begin_cell()
                .store_uint(4, 16)
            .end_cell())
            .store_ref(begin_cell()
                .store_uint(5, 16)
            .end_cell())
        .end_cell())
    .end_cell();

    ;; creating tuple with no data, which plays the role of stack
    tuple stack = null();
    ;; bring the main cell into the stack to process it in the loop
    stack~push_back(c);
    ;; do it until stack is not null
    while (~ stack.is_null()) {
        ;; get the cell from the stack and convert it to a slice to be able to process it
        slice s = stack~pop_back().begin_parse();

        ;; do something with s data

        ;; if the current slice has any refs, add them to stack
        repeat (s.slice_refs()) {
            stack~push_back(s~load_ref());
        }
    }
}
```

> 💡 Полезные ссылки
>
> ["Списки в стиле Lisp" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#lisp-style-lists)
>
> ["null()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#null)
>
> ["slice_refs()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#slice_refs)

### Как перебирать списки в стиле lisp

Тип данных кортежа может содержать до 255 значений. Если этого недостаточно, то следует использовать список в стиле lisp. Мы можем поместить кортеж внутрь кортежа, обойдя таким образом ограничение.

```func
forall X -> int is_null (X x) asm "ISNULL";
forall X -> (tuple, ()) push_back (tuple tail, X head) asm "CONS";
forall X -> (tuple, (X)) pop_back (tuple t) asm "UNCONS";

() main () {
    ;; some example list
    tuple l = null();
    l~push_back(1);
    l~push_back(2);
    l~push_back(3);

    ;; iterating through elements
    ;; note that this iteration is in reversed order
    while (~ l.is_null()) {
        var x = l~pop_back();

        ;; do something with x
    }
}
```

> 💡 Полезные ссылки
>
> ["Списки в стиле Lisp" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#lisp-style-lists)
>
> ["null()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib/#null)

### Как отправить сообщение о развертывании (только с stateInit, с stateInit и body)

```func
() deploy_with_stateinit(cell message_header, cell state_init) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(0, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}

() deploy_with_stateinit_body(cell message_header, cell state_init, cell body) impure {
  var msg = begin_cell()
    .store_slice(begin_parse(msg_header))
    .store_uint(2 + 1, 2) ;; init:(Maybe (Either StateInit ^StateInit))
    .store_uint(1, 1) ;; body:(Either X ^X)
    .store_ref(state_init)
    .store_ref(body)
    .end_cell();

  ;; mode 64 - carry the remaining value in the new message
  send_raw_message(msg, 64); 
}
```

### Как создать ячейку stateInit

```func
() build_stateinit(cell init_code, cell init_data) {
  var state_init = begin_cell()
    .store_uint(0, 1) ;; split_depth:(Maybe (## 5))
    .store_uint(0, 1) ;; special:(Maybe TickTock)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(1, 1) ;; (Maybe ^Cell)
    .store_uint(0, 1) ;; (HashmapE 256 SimpleLib)
    .store_ref(init_code)
    .store_ref(init_data)
    .end_cell();
}
```

### Как рассчитать адрес контракта (используя stateInit)

```func
() calc_address(cell state_init) {
  var future_address = begin_cell() 
    .store_uint(2, 2) ;; addr_std$10
    .store_uint(0, 1) ;; anycast:(Maybe Anycast)
    .store_uint(0, 8) ;; workchain_id:int8
    .store_uint(cell_hash(state_init), 256) ;; address:bits256
    .end_cell();
}
```

### Как обновить логику смарт-контракта

Ниже представлен простой смарт-контракт `СounterV1`, который имеет функциональность для увеличения счетчика и обновления логики смарт-контракта.

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

После работы со смарт-контрактом вы понимаете, что вам не хватает функции сокращения счетчика. Вам необходимо скопировать код смарт-контракта `CounterV1` и рядом с функцией `increase` добавить новую функцию `decrease`. Теперь ваш код выглядит так:

```func
() recv_internal (slice in_msg_body) {
    int op = in_msg_body~load_uint(32);
    
    if (op == op::increase) {
        int increase_by = in_msg_body~load_uint(32);
        ctx_counter += increase_by;
        save_data();
        return ();
    }

    if (op == op::decrease) {
        int decrease_by = in_msg_body~load_uint(32);
        ctx_counter -= increase_by;
        save_data();
        return ();
    }

    if (op == op::upgrade) {
        cell code = in_msg_body~load_ref();
        set_code(code);
        return ();
    }
}
```

Как только смарт-контракт `CounterV2` будет готов, вам необходимо скомпилировать его вне цепочки в `cell` и отправить сообщение об обновлении смарт-контракту `CounterV1`.

```javascript
await contractV1.sendUpgrade(provider.sender(), {
    code: await compile('ContractV2'),
    value: toNano('0.05'),
});
```

> 💡 Полезные ссылки
>
> [Возможно ли повторно развернуть код на существующий адрес или его нужно развернуть как новый контракт?](/v3/documentation/faq#is-it-possible-to-re-deploy-code-to-an-existing-address-or-does-it-have-to-be-deployed-as-a-new-contract)
>
> ["set_code()" в документации](/v3/documentation/smart-contracts/func/docs/stdlib#set_code)





