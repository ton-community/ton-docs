import Feedback from '@site/src/components/Feedback';

# TL-B tools

## TL-B parsers

TL-B parsers serialize basic [TL-B types](/v3/documentation/data-formats/tlb/tl-b-types). Each parser implements TL-B types as objects and returns the corresponding serialized binary data.

| Language   | SDK                                        | Social                 |
|------------|--------------------------------------------|------------------------|
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (includes support for parsing `.tlb` files) | https://t.me/tonkotlin |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb) | https://t.me/tonutils  |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (includes support for parsing `.tlb` files) | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser) | -                      |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (includes support for parsing `.tlb` files) | https://t.me/dtontech  |

## TL-B generator
The [tlb-codegen](https://github.com/ton-community/tlb-codegen) package generates TypeScript code for serializing and deserializing structures based on a provided TL-B scheme.

The [tonpy](https://github.com/disintar/tonpy) package also supports code generation in Python for serializing and deserializing structures according to a given TL-B scheme.
<Feedback />

