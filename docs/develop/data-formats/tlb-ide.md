# IDE Support


### Highlight
The [intellij-ton](https://github.com/andreypfau/intellij-ton) plugin supports the Fift and FunC programming languages as well as the typed language binary (TL-B) format.

Additionally, the correct TL-B syntax specifications are described in the [TlbParser.bnf](https://github.com/andreypfau/intellij-ton/blob/main/src/main/grammars/TlbParser.bnf) file.

### TL-B Parsers

TL-B parsers help carry out the serialization of basic [TL-B types](/docs/develop/data-formats-tl-b-types). Each of which implements TL-B types as an object, and returns serialized binary data.

| Language   | SDK                                                                                                         | Social                 |
|------------|-------------------------------------------------------------------------------------------------------------|------------------------|
| Kotlin     | [ton-kotlin](https://github.com/andreypfau/ton-kotlin/tree/main/ton-kotlin-tlb) (+ parsing `.tlb` files)    | https://t.me/tonkotlin |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                          | https://t.me/tonutils  |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ parsing `.tlb` files)                        | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                   | -                      |
