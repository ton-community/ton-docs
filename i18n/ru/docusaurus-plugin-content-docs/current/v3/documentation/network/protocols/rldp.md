import Feedback from '@site/src/components/Feedback';

# RLDP

Please see the implementations:

- https://github.com/ton-blockchain/ton/tree/master/rldp
- https://github.com/ton-blockchain/ton/tree/master/rldp2
- https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

## Overview

Надежный протокол передачи больших датаграмм (RLDP - Reliable Large Datagram Protocol) — это протокол, работающий поверх ADNL UDP, который используется для передачи больших блоков данных и
включает алгоритмы прямой коррекции ошибок (FEC - Forward Error Correction) в качестве замены пакетов подтверждения на другой стороне. Это позволяет передавать данные между сетевыми компонентами более эффективно, но с большим потреблением трафика. It incorporates Forward Error Correction (FEC) algorithms, which allow it to replace acknowledgment packets typically sent from the receiver back to the sender.

This capability enables more efficient data transfer between network components, although it results in increased traffic consumption.

RLDP plays a crucial role throughout the TON infrastructure. It is used for various purposes, such as downloading blocks from other nodes, transferring data to those nodes, and accessing TON websites and TON Storage.

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

RLDP используется везде в инфраструктуре TON, например, для загрузки блоков с других узлов и передачи им данных,
для доступа к сайтам TON и хранилищу TON.

RLDP transfers are utilized for sending large amounts of data. Передачи RLDP используются для передачи больших данных, генерируется случайный `transfer_id`, а сами данные обрабатываются алгоритмом FEC.

Если `last` = true, то мы достигли конца, мы можем собрать все части вместе и получить полное тело ответа, например, html.

Когда получатель собрал фрагменты `rldp.messagePart`, необходимые для сборки полного сообщения, он объединяет их все вместе, декодирует с помощью FEC и
десериализует полученный массив байтов в одну из структур `rldp.query` или `rldp.answer` в зависимости от типа (идентификатор префикса tl).

### FEC

Допустимыми алгоритмами прямой коррекции ошибок для использования с RLDP являются RoundRobin, Online и RaptorQ.

В настоящее время для кодирования данных используется [RaptorQ](https://www.qualcomm.com/media/documents/files/raptorq-technical-overview.pdf).

#### RaptorQ

Суть RaptorQ заключается в том, что данные разделяются на так называемые символы — блоки одинакового, заранее определенного размера.

Из блоков создаются матрицы, и к ним применяются дискретные математические операции. Это позволяет нам создавать практически бесконечное количество символов
из одних и тех же данных.

Все символы перемешиваются, и можно восстанавливать потерянные пакеты, не запрашивая дополнительных данных с сервера, при этом используя меньше пакетов, чем если бы мы отправляли те же самые фрагменты в цикле. This method uses fewer packets than would be required if the same pieces of data were sent repeatedly.

Сгенерированные символы отправляются одноранговому узлу до тех пор, пока он не сообщит, что все данные получены и восстановлены (декодированы) путем применения тех же дискретных операций.

[Пример реализации RaptorQ в Golang](https://github.com/xssnick/tonutils-go/tree/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/rldp/raptorq)

## RLDP-HTTP

Для взаимодействия с сайтами TON используется HTTP, обернутый в RLDP. Хостер запускает свой сайт на любом HTTP-сервере и запускает rldp-http-proxy рядом с ним.

All incoming requests from the TON network are directed to the proxy via the RLDP protocol. The proxy then converts these requests into standard HTTP format and calls the original web server locally.

On the user's side, they launch a proxy, such as [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), to access the .ton sites. Все запросы из сети TON поступают по протоколу RLDP на прокси, а прокси пересобирает запрос в простой HTTP и локально вызывает исходный веб-сервер.

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
  - Если не 0, то отправляет клиенту запрос `http.getNextPayloadPart`
  - При получении запроса клиент отправляет `http.payloadPart` - запрашиваемый кусок тела в зависимости от `seqno` и `max_chunk_size`.
  - Сервер повторяет запросы, увеличивая `seqno`, пока не получит все куски от клиента, т. е. пока поле `last:Bool` последнего полученного куска не станет истинным.
- После обработки запроса сервер отправляет `http.response`, клиент проверяет заголовок `Content-Length`
  - Если он не 0, то отправляет серверу запрос `http.getNextPayloadPart`, и операции повторяются, как и в случае с клиентом, но наоборот.

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

Our current array is 156 bytes long, which means it will consist of only one segment. To make it 768 bytes, we need to add 612 zero bytes for padding.

Additionally, the constants chosen for the encoder depend on the data size and the symbol size. For more detailed information, you can refer to the RaptorQ documentation. However, to simplify the process and avoid complex mathematical calculations, we recommend using a pre-existing library that implements this encoding.

Please see the examples:

- Теперь, когда мы создали кодировщик, мы готовы отправлять данные, для этого заполним схему TL:
- Пользователь на своей стороне запускает прокси, например, [Tonutils Proxy](https://github.com/xssnick/TonUtils-Proxy), и использует сайты `.ton`, весь трафик оборачивается в обратном порядке, запросы идут на локальный HTTP-прокси, а он отправляет их через RLDP на удаленный сайт TON.

Symbols are encoded and transmitted in a round-robin manner. Символы кодируются и отправляются в циклическом режиме: изначально мы определяем `seqno`, который равен 0, и увеличиваем его на 1 для каждого последующего кодированного пакета. Например, если у нас есть 2 символа, то мы кодируем и отправляем первый, увеличиваем seqno на 1, затем второй и увеличиваем seqno на 1, затем снова первый и увеличиваем seqno, который в этот момент уже равен 2, еще на 1. Next, we encode and send the second symbol and again increase `seqno` by 1. After that, we return to the first symbol and increment `seqno` (which is now 2) by another 1.

This process continues until we receive a message indicating that the peer has accepted the data.

Having created the encoder, we are now ready to send data. To do this, we will fill in the TL schema:

```tlb
fec.raptorQ data_size:int symbol_size:int symbols_count:int = fec.Type;

rldp.messagePart transfer_id:int256 fec_type:fec.Type part:int total_size:long seqno:int data:bytes = rldp.MessagePart;
```

- `transfer_id` - случайное int256, одинаковое для всех messageParts в рамках одной передачи данных.
- `fec_type` - это `fec.raptorQ`.
  - `data_size` = 156
  - `symbol_size` = 768
  - `symbols_count` = 1
- `part` в нашем случае всегда 0, может использоваться для передач, которые достигли ограничения по размеру.
- `total_size` = 156. Размер наших передаваемых данных.
- `seqno` - для первого пакета будет равен 0, а для каждого последующего пакета он будет увеличиваться на 1, будет использоваться как параметр для декодирования и кодирования символа.
- `data` - наш закодированный символ, размером 768 байт.

После сериализации `rldp.messagePart`, оберните его в `adnl.message.custom` и отправьте по ADNL UDP.

Мы отправляем пакеты в цикле, все время увеличивая seqno, пока не дождемся сообщения `rldp.complete` от пира или не остановимся по таймауту. После того, как мы отправили количество пакетов, равное количеству наших символов, мы можем замедлиться и отправить дополнительный пакет, например, раз в 10 миллисекунд или меньше.

Дополнительные пакеты используются для восстановления в случае потери данных, так как UDP - быстрый, но ненадежный протокол.

[Пример реализации](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L249)

### Обработка ответа от `foundation.ton`.

During the sending process, we can expect a response from the server. Во время отправки мы уже можем ожидать ответа от сервера, в нашем случае мы ждем `rldp.answer` с `http.response` внутри.

Он придет к нам таким же образом, в виде RLDP-передачи, как и был отправлен во время запроса, но `transfer_id` будет инвертирован (каждый байт XOR 0xFF).

Наш массив размером 156 байт, значит будет всего 1 фрагмент, и нам нужно дополнить его 612 нулевыми байтами до размера 768.

First, we need to extract FEC information from the initial message received during the transfer. Сначала нам нужно получить информацию FEC из первого полученного сообщения передачи, а именно параметры `data_size`, `symbol_size` и `symbols_count` из структуры messagePart `fec.raptorQ`.

Они нам нужны для инициализации декодера RaptorQ. [Пример](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L137)

After initialization, we add the received symbols along with their `seqno` to our decoder. После инициализации мы добавляем полученные символы с их `seqno` в наш декодер, и как только мы накопим минимально необходимое число, равное `symbols_count`, мы можем попытаться декодировать полное сообщение. В случае успеха мы отправим `rldp.complete`. [Пример](https://github.com/xssnick/tonutils-go/blob/be3411cf412f23e6889bf0b648904306a15936e7/adnl/rldp/rldp.go#L168)

Результатом будет сообщение `rldp.answer` с тем же query_id, что и в отправленном нами `rldp.query`. Данные должны содержать `http.response`.

```tlb
http.response http_version:string status_code:int reason:string headers:(vector http.header) no_payload:Bool = http.Response;
```

The main fields are generally straightforward, as they function similarly to those in HTTP.

С основными полями, я думаю, все понятно, суть та же, что и в HTTP. Интересный флаг здесь - `no_payload`, если он равен true, то тела в ответе нет, (`Content-Length` = 0). Ответ от сервера можно считать полученным.

Если `no_payload` = false, то в ответе есть контент, и нам нужно его получить. Для этого нам нужно отправить запрос со схемой TL `http.getNextPayloadPart`, обернутой в `rldp.query`.

```tlb
http.getNextPayloadPart id:int256 seqno:int max_chunk_size:int = http.PayloadPart;
```

`id` должен быть таким же, как мы отправили в `http.request`, `seqno` - 0 и +1 для каждой следующей части. `max_chunk_size` - максимальный размер фрагмента, который мы готовы принять, обычно используется 128 КБ (131072 байта).

В ответ мы получим:

```tlb
http.payloadPart data:bytes trailer:(vector http.header) last:Bool = http.PayloadPart;
```

If `last` is true, then we have reached the end. We can combine all the pieces to create a complete response body, such as HTML.

## Ссылки

_Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/RLDP.md) [Олега Баранова](https://github.com/xssnick)._

<Feedback />

