import Feedback from '@site/src/components/Feedback';

# Инструменты TL-B

## Парсеры TL-B

Парсеры TL-B помогают выполнять сериализацию базовых [типов TL-B](/v3/documentation/data-formats/tlb/tl-b-types). Каждый из них реализует типы TL-B как объект и возвращает сериализованные двоичные данные.

| Язык       | SDK                                                                                                                  | Social                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ парсинг файлов `.tlb`) | https://t.me/tonkotlin                      |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                                   | https://t.me/tonutils                       |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ парсинг файлов `.tlb`)             | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                            | -                                                                           |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (+ парсинг файлов `.tlb`)                         | https://t.me/dtontech                       |

## Генератор TL-B

Пакет [tlb-codegen](https://github.com/ton-community/tlb-codegen) позволяет генерировать Typescript код для сериализации и десериализации структур в соответствии с предоставленной схемой TLB.

Пакет [tonpy](https://github.com/disintar/tonpy) позволяет генерировать код на Python для сериализации и десериализации структур в соответствии с предоставленной схемой TLB. <Feedback />

