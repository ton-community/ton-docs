# ADNL UDP - Межузловое взаимодействие

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

ADNL через UDP используется узлами и компонентами TON для связи друг с другом. Это низкоуровневый протокол, поверх которого работают другие, более высокоуровневые протоколы TON, такие как DHT и RLDP.
В этой статье мы узнаем, как ADNL через UDP работает для базовой связи между узлами.

В отличие от ADNL через TCP, в реализации UDP обмен данными происходит в другой форме, и используется дополнительный уровень в виде каналов, но другие принципы схожи:
ключи шифрования также генерируются на основе нашего закрытого ключа и открытого ключа партнера, который заранее известен из конфигурации или получен от других узлов сети.

В UDP-версии ADNL соединение устанавливается одновременно с получением исходных данных от однорангового узла, если инициатор отправил сообщение "создать канал", ключ канала будет вычислен и создание канала будет подтверждено.
Когда канал будет установлен, дальнейшая связь будет продолжаться внутри него.

## Структура пакетов и обмен данными

### Первые пакеты

Давайте проанализируем инициализацию соединения с узлом DHT и получение подписанного списка его адресов, чтобы понять, как работает протокол.

Найдите нужный вам узел в [global config](https://ton-blockchain.github.io/global.config.json), в разделе `dht.nodes`. Например:

```json
{
  "@type": "dht.node",
  "id": {
    "@type": "pub.ed25519",
    "key": "fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk="
  },
  "addr_list": {
    "@type": "adnl.addressList",
    "addrs": [
      {
        "@type": "adnl.address.udp",
        "ip": 1091897261,
        "port": 15813
      }
    ],
    "version": 0,
    "reinit_date": 0,
    "priority": 0,
    "expire_at": 0
  },
  "version": -1,
  "signature": "cmaMrV/9wuaHOOyXYjoxBnckJktJqrQZ2i+YaY3ehIyiL3LkW81OQ91vm8zzsx1kwwadGZNzgq4hI4PCB/U5Dw=="
}
```

1. Возьмем его ключ ED25519, `fZnkoIAxrTd4xeBgVpZFRm5SvVvSx7eN3Vbe8c83YMk`, и декодируем его из base64
2. Возьмем его IP-адрес `1091897261` и переведем его в понятный формат с помощью [сервиса](https://www.browserling.com/tools/dec-to-ip) или с помощью преобразования в little endian байтов, получим `65.21.7.173`
3. Объединим с портом, получим `65.21.7.173:15813` и установим UDP-соединение.

Мы хотим открыть канал для связи с узлом и получить некоторую информацию, а как основная задача - получить от него список подписанных адресов. Для этого мы сгенерируем 2 сообщения, первое - [создать канал](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L129):

```tlb
adnl.message.createChannel key:int256 date:int = adnl.Message
```

Здесь у нас есть 2 параметра - ключ и дата. В качестве даты мы укажем текущую временную метку unix. А для ключа - нам нужно сгенерировать новую пару закрытый+открытый ключ ED25519 специально для канала, они будут использоваться для инициализации [открытого ключа шифрования](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh). Мы будем использовать наш сгенерированный открытый ключ в параметре `key` сообщения, а закрытый пока просто сохраним.

Сериализуем заполненную структуру TL и получаем:

```
bbc373e6                                                         -- TL ID adnl.message.createChannel 
d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7 -- key
555c8763                                                         -- date
```

Далее перейдем к нашему основному запросу - [получить список адресов](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L198).
Чтобы выполнить его, нам сначала нужно сериализовать его структуру TL:

```tlb
dht.getSignedAddressList = dht.Node
```

У него нет параметров, поэтому мы просто сериализуем его. Это будет просто его идентификатор - `ed4879a9`.

Далее, поскольку это запрос более высокого уровня протокола DHT, нам нужно сначала обернуть его в структуру TL `adnl.message.query`:

```tlb
adnl.message.query query_id:int256 query:bytes = adnl.Message
```

В качестве `query_id` мы генерируем случайные 32 байта, в качестве `query` мы используем наш основной запрос, [обернутый в массив байтов](/v3/documentation/data-formats/tl#encoding-bytes-array).
Мы получим:

```
7af98bb4                                                         -- TL ID adnl.message.query
d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875 -- query_id
04 ed4879a9 000000                                               -- query
```

### Построение пакета

Вся коммуникация осуществляется с помощью пакетов, содержимое которых представляет собой [структуру TL](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L81):

```tlb
adnl.packetContents 
  rand1:bytes                                     -- random 7 or 15 bytes
  flags:#                                         -- bit flags, used to determine the presence of fields further
  from:flags.0?PublicKey                          -- sender's public key
  from_short:flags.1?adnl.id.short                -- sender's ID
  message:flags.2?adnl.Message                    -- message (used if there is only one message)
  messages:flags.3?(vector adnl.Message)          -- messages (if there are > 1)
  address:flags.4?adnl.addressList                -- list of our addresses
  priority_address:flags.5?adnl.addressList       -- priority list of our addresses
  seqno:flags.6?long                              -- packet sequence number
  confirm_seqno:flags.7?long                      -- sequence number of the last packet received
  recv_addr_list_version:flags.8?int              -- address version 
  recv_priority_addr_list_version:flags.9?int     -- priority address version
  reinit_date:flags.10?int                        -- connection reinitialization date (counter reset)
  dst_reinit_date:flags.10?int                    -- connection reinitialization date from the last received packet
  signature:flags.11?bytes                        -- signature
  rand2:bytes                                     -- random 7 or 15 bytes
        = adnl.PacketContents
        
```

После того, как мы сериализовали все сообщения, которые хотим отправить, мы можем начать создание пакета.
Пакеты, которые должны быть отправлены в канал, отличаются по содержимому от пакетов, которые отправляются до инициализации канала.
Сначала проанализируем основной пакет, который используется для инициализации.

Во время начального обмена данными, за пределами канала, сериализованная структура содержимого пакета префиксируется открытым ключом одноранговой стороны - 32 байта.
Наш открытый ключ - 32 байта, хэш sha256 сериализованного TL структуры содержимого пакета - 32 байта.
Содержимое пакета зашифровано с помощью [общего ключа](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh), полученного из нашего закрытого ключа и открытого ключа сервера.

Сериализуем структуру содержимого нашего пакета и разберем ее побайтно:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d9050000                                                               -- flags (0x05d9) -> 0b0000010111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 messages   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID [adnl.message.query](/)
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

После сериализации - нам нужно подписать полученный массив байтов ключом ED25519 нашего частного клиента (не канала), который мы сгенерировали и сохранили ранее.
После того, как мы сгенерировали подпись (размером 64 байта), нам нужно добавить ее в пакет, снова сериализовать, но теперь добавить 11-й бит к флагу, который означает наличие подписи:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 4e0e7dd6d0c5646c204573bc47e567                                      -- rand1, 15 (0f) random bytes
d90d0000                                                               -- flags (0x0dd9) -> 0b0000110111011001
                                                                       -- from (present because flag's zero bit = 1)
c6b41348                                                                  -- TL ID pub.ed25519
   afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6       -- key:int256
                                                                       -- messages (present because flag's third bit = 1)
02000000                                                                  -- vector adnl.Message, size = 2 message   
   bbc373e6                                                                  -- TL ID adnl.message.createChannel
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7          -- key
   555c8763                                                                  -- date (date of creation)
   
   7af98bb4                                                                  -- TL ID adnl.message.query
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875          -- query_id
   04 ed4879a9 000000                                                        -- query (bytes size 4, padding 3)
                                                                       -- address (present because flag's fourth bit = 1), without TL ID since it is specified explicitly
00000000                                                                  -- addrs (empty vector, because we are in client mode and do not have an address on wiretap)
555c8763                                                                  -- version (usually initialization date)
555c8763                                                                  -- reinit_date (usually initialization date)
00000000                                                                  -- priority
00000000                                                                  -- expire_at

0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0000000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
555c8763                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
555c8763                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
00000000                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 b453fbcbd8e884586b464290fe07475ee0da9df0b8d191e41e44f8f42a63a710    -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   341eefe8ffdc56de73db50a25989816dda17a4ac6c2f72f49804a97ff41df502    --
   000000                                                              --
0f 2b6a8c0509f85da9f3c7e11c86ba22                                      -- rand2, 15 (0f) random bytes
```

Теперь у нас есть собранный, подписанный и сериализованный пакет, представляющий собой массив байтов.
Для последующей проверки его целостности получателем нам нужно вычислить хэш sha256 пакета. Например, пусть это будет `408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2`.

Теперь давайте зашифруем содержимое нашего пакета с помощью шифра AES-CTR, используя [общий ключ](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh), полученный из нашего закрытого ключа и открытого ключа одноранговой сети (не ключа канала).

Мы почти готовы к отправке, осталось только [вычислить ID](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) ключа одноранговой сети ED25519 и объединить все вместе:

```
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb  -- server Key ID
afc46336dd352049b366c7fd3fc1b143a518f0d02d9faef896cb0155488915d6  -- our public key
408a2a4ed623b25a2e2ba8bbe92d01a3b5dbd22c97525092ac3203ce4044dcd2  -- sha256 content hash (before encryption)
...                                                               -- encrypted content of the packet
```

Теперь мы можем отправить наш собранный пакет одноранговой сети по UDP и ждать ответа.

В ответ мы получим пакет с похожей структурой, но с другими сообщениями. Он будет состоять из:

```
68426d4906bafbd5fe25baf9e0608cf24fffa7eca0aece70765d64f61f82f005  -- ID of our key
2d11e4a08031ad3778c5e060569645466e52bd1bd2c7b78ddd56def1cf3760c9  -- server public key, for shared key
f32fa6286d8ae61c0588b5a03873a220a3163cad2293a5dace5f03f06681e88a  -- sha256 content hash (before encryption)
...                                                               -- the encrypted content of the packet
```

Десериализация пакета с сервера выглядит следующим образом:

1. Проверяем идентификатор ключа из пакета, чтобы понять, что пакет для нас.
2. Используя открытый ключ сервера из пакета и наш закрытый ключ, вычисляем общий ключ и расшифровываем содержимое пакета
3. Сравниваем отправленный нам хеш sha256 с полученным хешем из расшифрованных данных, они должны совпадать
4. Начинаем десериализацию содержимого пакета с помощью схемы TL `adnl.packetContents`

Содержимое пакета будет выглядеть так:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f 985558683d58c9847b4013ec93ea28                                      -- rand1, 15 (0f) random bytes
ca0d0000                                                               -- flags (0x0dca) -> 0b0000110111001010
daa76538d99c79ea097a67086ec05acca12d1fefdbc9c96a76ab5a12e66c7ebb       -- from_short (because flag's first bit = 1)
02000000                                                               -- messages (present because flag's third bit = 1)
   691ddd60                                                               -- TL ID adnl.message.confirmChannel 
   db19d5f297b2b0d76ef79be91ad3ae01d8d9f80fab8981d8ed0c9d67b92be4e3       -- key (server channel public key)
   d59d8e3991be20b54dde8b78b3af18b379a62fa30e64af361c75452f6af019d7       -- peer_key (our public channel key)
   94848863                                                               -- date
   
   1684ac0f                                                               -- TL ID adnl.message.answer 
   d7be82afbc80516ebca39784b8e2209886a69601251571444514b7f17fcd8875       -- query_id
   90 48325384c6b413487d99e4a08031ad3778c5e060569645466e52bd5bd2c7b       -- answer (the answer to our request, we will analyze its content in an article about DHT)
      78ddd56def1cf3760c901000000e7a60d67ad071541c53d0000ee354563ee       --
      35456300000000000000009484886340d46cc50450661a205ad47bacd318c       --
      65c8fd8e8f797a87884c1bad09a11c36669babb88f75eb83781c6957bc976       --
      6a234f65b9f6e7cc9b53500fbe2c44f3b3790f000000                        --
      000000                                                              --
0100000000000000                                                       -- seqno (present because flag's sixth bit = 1)
0100000000000000                                                       -- confirm_seqno (present because flag's seventh bit = 1)
94848863                                                               -- recv_addr_list_version (present because flag's eighth bit = 1, usually initialization date)
ee354563                                                               -- reinit_date (present because flag's tenth bit = 1, usually initialization date)
94848863                                                               -- dst_reinit_date (present because flag's tenth bit = 1)
40 5c26a2a05e584e9d20d11fb17538692137d1f7c0a1a3c97e609ee853ea9360ab6   -- signature (present because flag's eleventh bit = 1), (bytes size 64, padding 3)
   d84263630fe02dfd41efb5cd965ce6496ac57f0e51281ab0fdce06e809c7901     --
   000000                                                              --
0f c3354d35749ffd088411599101deb2                                      -- rand2, 15 (0f) random bytes
```

Сервер ответил нам двумя сообщениями: `adnl.message.confirmChannel` и `adnl.message.answer`.
С `adnl.message.answer` все просто, это ответ на наш запрос `dht.getSignedAddressList`, мы разберем его в статье про DHT.

Давайте сосредоточимся на `adnl.message.confirmChannel`, что означает, что пир подтвердил создание канала и отправил нам свой открытый ключ канала. Теперь, имея наш закрытый ключ канала и открытый ключ канала пира, мы можем вычислить [общий ключ](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-a-shared-key-using-ecdh).

Теперь, когда мы вычислили общий ключ канала, нам нужно сделать из него 2 ключа — один для шифрования исходящих сообщений, другой для расшифровки входящих сообщений.
Сделать из него 2 ключа довольно просто, второй ключ равен общему ключу, записанному в обратном порядке. Пример:

```
Shared key : AABB2233

First key: AABB2233
Second key: 3322BBAA
```

Осталось определить, какой ключ для чего использовать, мы можем сделать это, сравнив идентификатор нашего открытого ключа канала с идентификатором открытого ключа канала сервера, преобразовав их в числовой вид — uint256. Этот подход используется для того, чтобы и сервер, и клиент определяли, какой ключ для чего использовать. Если сервер использует первый ключ для шифрования, то при таком подходе клиент всегда будет использовать его для расшифровки.

Условия использования:

```
The server id is smaller than our id:
Encryption: First Key
Decryption: Second Key

The server id is larger than our id:
Encryption: Second Key
Decryption: First Key

If the ids are equal (nearly impossible):
Encryption: First Key
Decryption: First Key
```

[[Пример реализации]](https://github.com/xssnick/tonutils-go/blob/46dbf5f820af066ab10c5639a508b4295e5aa0fb/adnl/adnl.go#L502)

### Обмен данными в канале

Весь последующий обмен пакетами будет происходить внутри канала, а ключи канала будут использоваться для шифрования.
Давайте отправим тот же запрос `dht.getSignedAddressList` внутри только что созданного канала, чтобы увидеть разницу.

Давайте создадим пакет для канала, используя ту же структуру `adnl.packetContents`:

```
89cd42d1                                                               -- TL ID adnl.packetContents
0f c1fbe8c4ab8f8e733de83abac17915                                      -- rand1, 15 (0f) random bytes
c4000000                                                               -- flags (0x00c4) -> 0b0000000011000100
                                                                       -- message (because second bit = 1)
7af98bb4                                                                  -- TL ID adnl.message.query
fe3c0f39a89917b7f393533d1d06b605b673ffae8bbfab210150fe9d29083c35          -- query_id
04 ed4879a9 000000                                                        -- query (our dht.getSignedAddressList packed in bytes with padding 3)
0200000000000000                                                       -- seqno (because flag's sixth bit = 1), 2 because it is our second message
0100000000000000                                                       -- confirm_seqno (flag's seventh bit = 1), 1 because it is the last seqno received from the server
07 e4092842a8ae18                                                      -- rand2, 7 (07) random bytes
```

Пакеты в канале довольно просты и по сути состоят из последовательностей (seqno) и самих сообщений.

После сериализации, как и в прошлый раз, мы вычисляем хэш sha256 пакета. Затем мы шифруем пакет, используя ключ, предназначенный для исходящих пакетов канала.
[Вычисляем](/v3/documentation/network/protocols/adnl/adnl-tcp#getting-key-id) `pub.aes` идентификатор ключа шифрования наших исходящих сообщений, и создаем наш пакет:

```
bcd1cf47b9e657200ba21d94b822052cf553a548f51f539423c8139a83162180 -- ID of encryption key of our outgoing messages 
6185385aeee5faae7992eb350f26ba253e8c7c5fa1e3e1879d9a0666b9bd6080 -- sha256 content hash (before encryption)
...                                                              -- the encrypted content of the packet
```

Мы отправляем пакет по UDP и ждем ответа. В ответ мы получим пакет того же типа, что и отправили (те же поля), но с ответом на наш запрос `dht.getSignedAddressList`.

## Другие типы сообщений

Для базовой коммуникации используются сообщения типа `adnl.message.query` и `adnl.message.answer`, которые мы обсуждали выше, но для некоторых ситуаций используются и другие типы сообщений, которые мы обсудим в этом разделе.

### adnl.message.part

Этот тип сообщения является частью одного из других возможных типов сообщений, например `adnl.message.answer`. Этот метод передачи данных используется, когда сообщение слишком велико для передачи в одной UDP-датаграмме.

```tlb
adnl.message.part 
hash:int256            -- sha256 hash of the original message
total_size:int         -- original message size
offset:int             -- offset according to the beginning of the original message
data:bytes             -- piece of data of the original message
   = adnl.Message;
```

Таким образом, чтобы собрать исходное сообщение, нам нужно получить несколько частей и, в соответствии со смещениями, объединить их в один массив байтов.
А затем обработать его как сообщение (в соответствии с префиксом ID в этом массиве байтов).

### adnl.message.custom

```tlb
adnl.message.custom data:bytes = adnl.Message;
```

Такие сообщения используются, когда логика на более высоком уровне не соответствует формату запрос-ответ, сообщения такого типа позволяют полностью перенести обработку на более высокий уровень, так как сообщение несет в себе только массив байт, без query_id и других полей.
Сообщения такого типа используются, например, в RLDP, так как на множество запросов может быть только один ответ, эта логика контролируется самим RLDP.

### Заключение

Дальнейший обмен данными осуществляется на основе логики, описанной в этой статье, но содержимое пакетов зависит от протоколов более высокого уровня, таких как DHT и RLDP.

## Ссылки

*Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/ADNL-UDP-Internal.md) [Олега Баранова](https://github.com/xssnick).*
