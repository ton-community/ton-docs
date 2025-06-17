import Feedback from '@site/src/components/Feedback';

# TL

TL (Type Language - Язык типов) — язык описания структур данных.

Для структурирования полезных данных при обмене используются [схемы TL](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme).

TL работает с 32-битными блоками. Соответственно, размер данных в TL должен быть кратен 4 байтам. Если размер объекта не кратен 4, нам нужно добавить необходимое количество нулевых байт к кратному значению.

Числа всегда кодируются в порядке убывания.

Более подробную информацию о TL можно найти в [документации Telegram](https://core.telegram.org/mtproto/TL)

## Кодирование массива байт

Чтобы закодировать массив байт, нам сначала нужно определить его размер. Если он меньше 254 байт, то используется кодировка с размером в 1 байт. Если больше,
то 0xFE записывается как первый байт, как показатель большого массива, и после него следуют 3 байта размера.

Например, мы кодируем массив `[0xAA, 0xBB]`, его размер равен 2. Мы используем размер 1 байт, а затем записываем сами данные, получаем `[0x02, 0xAA, 0xBB]`, готово, но видим, что конечный размер равен 3, а не кратен 4 байтам, тогда нам нужно добавить 1 байт заполнения, чтобы он стал 4. Результат: `[0x02, 0xAA, 0xBB, 0x00]`.

В случае, если нам нужно закодировать массив, размер которого будет равен, например, 396,
делаем так: 396 >= 254, поэтому используем 3 байта для кодирования размера и 1 байт индикатора превышения размера,
получаем: `[0xFE, 0x8C, 0x01, 0x00, байты массива]`, 396+4 = 400, что кратно 4, выравнивать не нужно. The encoding would be: `[0xFE, 0x8C, 0x01, 0x00, array bytes]`. The total size becomes `396+4 = 400` bytes, a multiple of 4, so no additional alignment is needed.

## Неочевидные правила сериализации

Часто перед самой схемой пишется 4-байтовый префикс — ее идентификатор. Идентификатор схемы — это CRC32 с таблицей IEEE из текста схемы, при этом символы типа `;` и скобки `()` предварительно удаляются из текста. Сериализация схемы с префиксом идентификатора называется **упакованный**, это позволяет парсеру определить, какая схема идет перед ней, если есть несколько вариантов.

Если наша схема является частью другой схемы, то нужно посмотреть, как указывается тип поля. Если он явно указан, то мы сериализуем без префикса. The schema is serialized without a prefix if the type is explicitly defined. Если неявно (таких типов много), то нам нужно сериализовать как упакованный. Пример:

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

Consider the following scenario: if `PublicKey` is specified within the schema like this:

```
У нас есть такие типы, если в схеме указан `PublicKey`, например `adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node`, то он явно не указан и нам нужно сериализовать с префиксом ID (упакованный). А если бы это было указано так: `adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node`, то это было бы явно, и префикс был бы не нужен.
```

Since the type is not explicitly defined, it needs to be serialized with an ID prefix (boxed). However, if the schema is specified as follows:

```
adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node;
```

The type is explicitly specified, so the prefix is not needed.

## Ссылки

_Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md) [Олега Баранова](https://github.com/xssnick)._ <Feedback />

