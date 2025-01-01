# TL-B 工具

## TL-B 分析器

TL-B 剖析器帮助实现基本 [TL-B 类型](/v3/documentation/data-formats/tlb/tl-b-types) 的序列化。
将 TL-B 类型作为对象实现，并返回序列化的二进制数据。

| 语言         | SDK                                                                                                       | 社区                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Kotlin     | [ton-kotlin](https://github.com/ton-community/ton-kotlin/tree/main/tlb) (+ 解析`.tlb`文件) | https://t.me/tonkotlin                      |
| Go         | [tonutils](https://github.com/xssnick/tonutils-go/tree/master/tlb)                                        | https://t.me/tonutils                       |
| Go         | [tongo](https://github.com/tonkeeper/tongo/tree/master/tlb) (+ 解析`.tlb`文件)             | https://t.me/tongo_lib |
| TypeScript | [tlb-parser](https://github.com/ton-community/tlb-parser)                                                 | -                                                                           |
| Python     | [ton-kotlin](https://github.com/disintar/tonpy) (+ 解析`.tlb`文件)                         | https://t.me/dtontech                       |

## TL-B Generator

[tlb-codegen](https://github.com/ton-community/tlb-codegen) 软件包允许您根据提供的 TLB 方案生成序列化和反序列化结构的 Typescript 代码。

[tonpy](https://github.com/disintar/tonpy) 软件包允许你根据提供的 TLB 方案生成序列化和反序列化结构的 Python 代码。
