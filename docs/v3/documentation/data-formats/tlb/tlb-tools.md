# TL-B Tools

## TL-B Parsers

TL-B parsers help carry out the serialization of basic [TL-B types](/v3/documentation/data-formats/tlb/tl-b-types). Each of which
implements TL-B types as an object, and returns serialized binary data.

| Language   | SDK                                                                                                      | Social                 |
|------------|----------------------------------------------------------------------------------------------------------|------------------------|
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ parsing `.tlb` files) | https://t.me/tonkotlin |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                       | https://t.me/tonutils  |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ parsing `.tlb` files)                     | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                | -                      |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (+ parsing `.tlb` files)                                 | https://t.me/dtontech |

## TL-B Generator

[tlb-codegen](https://github.com/ton-community/tlb-codegen) package allows you to generate Typescript code for serializing and deserializing structures according to the TLB scheme provided.

[tonpy](https://github.com/disintar/tonpy) package allows you to generate Python code for serializing and deserializing structures according to the TLB scheme provided.
