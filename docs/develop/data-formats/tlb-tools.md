# TL-B Tools

## TL-B Parsers

TL-B parsers help carry out the serialization of basic [TL-B types](/develop/data-formats/tl-b-types). Each of which
implements TL-B types as an object, and returns serialized binary data.

| Language   | SDK                                                                                                      | Social                 |
|------------|----------------------------------------------------------------------------------------------------------|------------------------|
| Kotlin     | [ton-kotlin](https://github.com/andreypfau/ton-kotlin/tree/main/ton-kotlin-tlb) (+ parsing `.tlb` files) | https://t.me/tonkotlin |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                       | https://t.me/tonutils  |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ parsing `.tlb` files)                     | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                | -                      |

## TL-B Generator

[tlb-codegen](https://github.com/ton-community/tlb-codegen) package allows you to generate Typescript code for serializing and deserializing structures according to the TLB scheme provided.