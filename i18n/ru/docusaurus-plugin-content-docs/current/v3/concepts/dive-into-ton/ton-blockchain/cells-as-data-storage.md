import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Ячейки как хранилище данных

Все в TON хранится в ячейках. Ячейка — это структура данных, содержащая:

- до **1023 бит** данных (не байтов!)
- до **4 ссылок** на другие ячейки
- cell stores bits and references separately
- Циклические ссылки запрещены. Это означает, что для любой ячейки ни одна из ее дочерних ячеек не может иметь эту исходную ячейку в качестве ссылки.

Таким образом, все ячейки формируют направленный ациклический граф (DAG), наглядная иллюстрация предоставлена ниже: Here's a good picture to illustrate:

<br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/cells-as-data-storage/dag.png?raw=true',
dark: '/img/docs/cells-as-data-storage/Cells-as-data-storage_1_dark.png?raw=true',
}}
/> <br></br>

## Типы ячеек

В настоящее время существует 5 типов ячеек: _обычные_ и 4 _экзотических_.
Экзотические типы следующие:

- Pruned branch cell
- Library reference cell
- Merkle proof cell
- Merkle update cell

:::tip
Подробнее об экзотических ячейках см: [**TVM Whitepaper, раздел 3**](https://ton.org/tvm.pdf).
:::

## Cell flavors

Ячейка — это непрозрачный объект, оптимизированный для компактного хранения.

It deduplicates data: it only stores the content of several equivalent sub-cells referenced in different branches once. However, one cannot modify or read a cell directly because of its opacity. Таким образом, появляются 2 дополнительных разновидности ячеек:

- **Builder** is a flavor for constructing cells
- **Slice** for a flavor for reading cells

Также в TVM используется еще одна особая разновидность ячеек:

- _Continuation_ – для ячеек, содержащих opcode (инструкции) для виртуальной машины TON, см. [обзор TVM](/v3/documentation/tvm/tvm-overview).

## Сериализация данных в ячейки

Любой объект в TON (сообщение, очередь сообщений, блок, состояние всего блокчейна, код контракта и данные) сериализуется в ячейку.

Процесс сериализации описывается схемой TL-B. Это формальное описание того, как этот объект может быть сериализован в _Builder_ или как проанализировать объект заданного типа из _Slice_.
TL-B для ячеек — это то же самое, что TL или ProtoBuf для байтовых потоков.

Если вы хотите узнать больше подробностей о (де)сериализации ячеек, вы можете прочитать статью [Cell & Bag of Cells](/v3/documentation/data-formats/tlb/cell-boc).

## См. также

- [Blockchain of blockchains](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains)
- [Язык TL-B](/v3/documentation/data-formats/tlb/tl-b-language)

<Feedback />

