# IDE 支持

### 强调
[intellij-ton](https://github.com/andreypfau/intellij-ton) 插件支持 Fift 和 FunC 编程语言以及类型化语言二进制（TL-B）格式。

此外，正确的 TL-B 语法规范在 [TlbParser.bnf](https://github.com/andreypfau/intellij-ton/blob/main/src/main/grammars/TlbParser.bnf) 文件中有描述。

### TL-B 解析器

TL-B 解析器有助于执行基本 [TL-B 类型](/develop/data-formats/tl-b-types) 的序列化。每种类型都以对象的形式实现 TL-B 类型，并返回序列化的二进制数据。

| 语言        | SDK                                                                                                         | 社交网址               |
|-------------|-------------------------------------------------------------------------------------------------------------|------------------------|
| Kotlin      | [ton-kotlin](https://github.com/andreypfau/ton-kotlin/tree/main/ton-kotlin-tlb)（+ 解析 `.tlb` 文件）        | https://t.me/tonkotlin |
| Go          | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                          | https://t.me/tonutils  |
| Go          | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb)（+ 解析 `.tlb` 文件）                           | https://t.me/tongo_lib |
| TypeScript  | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                   | -                      |
