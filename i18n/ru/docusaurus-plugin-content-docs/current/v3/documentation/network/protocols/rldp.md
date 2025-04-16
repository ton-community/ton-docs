# RLDP

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Реализация:

- https://github.com/ton-blockchain/ton/tree/master/rldp
- https://github.com/ton-blockchain/ton/tree/master/rldp2
- https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

## Общие сведения

Надежный протокол передачи больших датаграмм (RLDP - Reliable Large Datagram Protocol) — это протокол, работающий поверх ADNL UDP, который используется для передачи больших блоков данных и
включает алгоритмы прямой коррекции ошибок (FEC - Forward Error Correction) в качестве замены пакетов подтверждения на другой стороне.
Это позволяет передавать данные между сетевыми компонентами более эффективно, но с большим потреблением трафика.

RLDP используется везде в инфраструктуре TON, например, для загрузки блоков с других узлов и передачи им данных,
для доступа к сайтам TON и хранилищу TON.

## Протокол

RLDP использует следующие структуры TL для обмена данными:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.roundRobin data_size:int symbol_size:int symbols_count:int = fec.Type;
fec.online data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
rldp.confirm transfer_id:int256 part:int seqno:int = rldp.MessagePart;
rldp.complete transfer_id:int256 part:int = rldp.MessagePart;

rldp.message id:int256 data:bytes = rldp.Message;
rldp.query query_id:int256 max_answer_size:long timeout:int data:bytes = rldp.Message;
rldp.answer query_id:int256 data:bytes = rldp.Message;
```

Сериализованная структура оборачивается в схему TL `adnl.message.custom` и отправляется по ADNL UDP.
Передачи RLDP используются для передачи больших данных, генерируется случайный `transfer_id`, а сами данные обрабатываются алгоритмом FEC.
Результирующие фрагменты оборачиваются в структуру `rldp.messagePart` и отправляются одноранговому узлу до тех пор, пока одноранговый узел не отправит нам `rldp.complete` или пока не истечет время ожидания.

Когда получатель собрал фрагменты `rldp.messagePart`, необходимые для сборки полного сообщения, он объединяет их все вместе, декодирует с помощью FEC и
десериализует полученный массив байтов в одну из структур `rldp.query` или `rldp.answer` в зависимости от типа (идентификатор префикса tl).

### FEC

Допустимыми алгоритмами прямой коррекции ошибок для использования с RLDP являются RoundRobin, Online и RaptorQ.
В настоящее время для кодирования данных используется [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf).

#### RaptorQ

Суть RaptorQ заключается в том, что данные разделяются на так называемые символы — блоки одинакового, заранее определенного размера.

Из блоков создаются матрицы, и к ним применяются дискретные математические операции. Это позволяет нам создавать практически бесконечное количество символов
из одних и тех же данных. Все символы перемешиваются, и можно восстанавливать потерянные пакеты, не запрашивая дополнительных данных с сервера, при этом используя меньше пакетов, чем если бы мы отправляли те же самые фрагменты в цикле.

Сгенерированные символы отправляются одноранговому узлу до тех пор, пока он не сообщит, что все данные получены и восстановлены (декодированы) путем применения тех же дискретных операций.

[Пример реализации RaptorQ в Golang](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

## RLDP-HTTP

Для взаимодействия с сайтами TON используется HTTP, обернутый в RLDP. Хостер запускает свой сайт на любом HTTP-сервере и запускает rldp-http-proxy рядом с ним.
Все запросы из сети TON поступают по протоколу RLDP на прокси, а прокси пересобирает запрос в простой HTTP и локально вызывает исходный веб-сервер.

Пользователь на своей стороне запускает прокси, например, [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), и использует сайты `.ton`, весь трафик оборачивается в обратном порядке, запросы идут на локальный HTTP-прокси, а он отправляет их через RLDP на удаленный сайт TON.

HTTP внутри RLDP реализован с использованием структур TL:

```tlb
http.header name:string value:string = http.Header;
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;

http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

Это не чистый HTTP в текстовом виде, все обернуто в двоичный TL и развернуто обратно для отправки на веб-сервер или браузер самим прокси.

Схема работы следующая:

- Клиент отправляет `http.request`.
- Сервер проверяет заголовок `Content-Length` при получении запроса
- - Если не 0, то отправляет клиенту запрос `http.getNextPayloadPart`
- - При получении запроса клиент отправляет `http.payloadPart` - запрашиваемый кусок тела в зависимости от `seqno` и `max_chunk_size`.
- - Сервер повторяет запросы, увеличивая `seqno`, пока не получит все куски от клиента, т. е. пока поле `last:Bool` последнего полученного куска не станет истинным.
- После обработки запроса сервер отправляет `http.response`, клиент проверяет заголовок `Content-Length`
- - Если он не 0, то отправляет серверу запрос `http.getNextPayloadPart`, и операции повторяются, как и в случае с клиентом, но наоборот.

## Запрос TON сайта

Чтобы понять, как работает RLDP, давайте рассмотрим пример получения данных с сайта TON `foundation.ton`.
Допустим, мы уже получили его адрес ADNL, вызвав метод Get контракта NFT-DNS, [определили адрес и порт службы RLDP с помощью DHT](https://github.com/xssnick/ton-deep-doc/blob/master/DHT.md) и [подключились к ней по ADNL UDP](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md).

### Отправьте запрос GET на `foundation.ton`

Для этого заполните структуру:

```tlb
http.request id:int256 method:string url:string http_version:string headers:(vector http.header) = http.Response;
```

Сериализуйте "http.request", заполнив соответствующие поля:

```
e191b161                                                           -- TL ID http.request      
116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245de471194   -- id           = {random}
03 474554                                                          -- method       = string `GET`
16 687474703a2f2f666f756e646174696f6e2e746f6e2f 00                 -- url          = string `http://foundation.ton/`
08 485454502f312e31 000000                                         -- http_version = string `HTTP/1.1`
01000000                                                           -- headers (1)
   04 486f7374 000000                                              -- name         = Host
   0e 666f756e646174696f6e2e746f6e 00                              -- value        = foundation.ton
```

Теперь обернем наш сериализованный `http.request` в `rldp.query` и также сериализуем его:

```
694d798a                                                              -- TL ID rldp.query
184c01cb1a1e4dc9322e5cabe8aa2d2a0a4dd82011edaf59eb66f3d4d15b1c5c      -- query_id        = {random}
0004040000000000                                                      -- max_answer_size = 257 KB, can be any sufficient size that we accept as headers
258f9063                                                              -- timeout (unix)  = 1670418213
34 e191b161116505dac8a9a3cdb464f9b5dd9af78594f23f1c295099a9b50c8245   -- data (http.request)
   de4711940347455416687474703a2f2f666f756e646174696f6e2e746f6e2f00
   08485454502f312e310000000100000004486f73740000000e666f756e646174
   696f6e2e746f6e00 000000
```

### Кодирование и отправка пакетов

Теперь нам нужно применить алгоритм FEC RaptorQ к этим данным.

Создадим кодировщик, для этого нам нужно превратить полученный массив байтов в символы фиксированного размера. В TON размер символа составляет 768 байт.
Для этого разобьем массив на части по 768 байт. В последней части, если она получится меньше 768, ее нужно будет дополнить нулевыми байтами до нужного размера.

Наш массив размером 156 байт, значит будет всего 1 фрагмент, и нам нужно дополнить его 612 нулевыми байтами до размера 768.

Также для кодировщика подбираются константы в зависимости от размера данных и символа, подробнее об этом можно узнать в документации самого RaptorQ, но чтобы не лезть в математические дебри, рекомендую использовать готовую библиотеку, реализующую такое кодирование.
[Пример создания кодировщика](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq/encoder.go#L15) и [Пример кодировки символа](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/raptorq/solver.go#L26).

Символы кодируются и отправляются в циклическом режиме: изначально мы определяем `seqno`, который равен 0, и увеличиваем его на 1 для каждого последующего кодированного пакета. Например, если у нас есть 2 символа, то мы кодируем и отправляем первый, увеличиваем seqno на 1, затем второй и увеличиваем seqno на 1, затем снова первый и увеличиваем seqno, который в этот момент уже равен 2, еще на 1.
И так до тех пор, пока не получим сообщение о том, что пир принял данные.

Теперь, когда мы создали кодировщик, мы готовы отправлять данные, для этого заполним схему TL:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

- `transfer_id` - случайное int256, одинаковое для всех messageParts в рамках одной передачи данных.
- `fec_type` - это `fec.raptorQ`.
- - `data_size` = 156
- - `symbol_size` = 768
- - `symbols_count` = 1
- `part` в нашем случае всегда 0, может использоваться для передач, которые достигли ограничения по размеру.
- `total_size` = 156. Размер наших передаваемых данных.
- `seqno` - для первого пакета будет равен 0, а для каждого последующего пакета он будет увеличиваться на 1, будет использоваться как параметр для декодирования и кодирования символа.
- `data` - наш закодированный символ, размером 768 байт.

После сериализации `rldp.messagePart`, оберните его в `adnl.message.custom` и отправьте по ADNL UDP.

Мы отправляем пакеты в цикле, все время увеличивая seqno, пока не дождемся сообщения `rldp.complete` от пира или не остановимся по таймауту. После того, как мы отправили количество пакетов, равное количеству наших символов, мы можем замедлиться и отправить дополнительный пакет, например, раз в 10 миллисекунд или меньше.
Дополнительные пакеты используются для восстановления в случае потери данных, так как UDP - быстрый, но ненадежный протокол.

[Пример реализации](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249)

### Обработка ответа от `foundation.ton`.

Во время отправки мы уже можем ожидать ответа от сервера, в нашем случае мы ждем `rldp.answer` с `http.response` внутри.
Он придет к нам таким же образом, в виде RLDP-передачи, как и был отправлен во время запроса, но `transfer_id` будет инвертирован (каждый байт XOR 0xFF).
Мы получим сообщения `adnl.message.custom`, содержащие `rldp.messagePart`.

Сначала нам нужно получить информацию FEC из первого полученного сообщения передачи, а именно параметры `data_size`, `symbol_size` и `symbols_count` из структуры messagePart `fec.raptorQ`.
Они нам нужны для инициализации декодера RaptorQ. [Пример](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

После инициализации мы добавляем полученные символы с их `seqno` в наш декодер, и как только мы накопим минимально необходимое число, равное `symbols_count`, мы можем попытаться декодировать полное сообщение. В случае успеха мы отправим `rldp.complete`. [Пример](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168)

Результатом будет сообщение `rldp.answer` с тем же query_id, что и в отправленном нами `rldp.query`. Данные должны содержать `http.response`.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

С основными полями, я думаю, все понятно, суть та же, что и в HTTP.
Интересный флаг здесь - `no_payload`, если он равен true, то тела в ответе нет, (`Content-Length` = 0).
Ответ от сервера можно считать полученным.

Если `no_payload` = false, то в ответе есть контент, и нам нужно его получить.
Для этого нам нужно отправить запрос со схемой TL `http.getNextPayloadPart`, обернутой в `rldp.query`.

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id` должен быть таким же, как мы отправили в `http.request`, `seqno` - 0 и +1 для каждой следующей части. `max_chunk_size` - максимальный размер фрагмента, который мы готовы принять, обычно используется 128 КБ (131072 байта).

В ответ мы получим:

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

Если `last` = true, то мы достигли конца, мы можем собрать все части вместе и получить полное тело ответа, например, html.

## Ссылки

*Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md) [Олега Баранова](https://github.com/xssnick).*
