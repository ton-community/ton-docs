# TL

TL（类型语言）是一种用于描述数据结构的语言。

为了结构化有用的数据，在通信时使用 [TL 架构](https://github.com/ton-blockchain/ton/tree/master/tl/generate/scheme)。

TL 操作 32 位块。因此，TL 中的数据大小必须是 4 字节的倍数。
如果对象的大小不是 4 的倍数，我们需要添加所需数量的零字节，直到达到倍数。

数字始终以小端序编码。

有关 TL 的更多详情可以在 [Telegram 文档](https://core.telegram.org/mtproto/TL)中找到。

## 编码字节数组

要编码一个字节数组，我们首先需要确定其大小。
如果它少于 254 字节，则使用 1 字节作为大小的编码。如果更多，
则将 0xFE 写为第一个字节，作为大数组的指示符，其后跟随 3 字节的大小。

例如，我们编码数组 `[0xAA, 0xBB]`，其大小为 2。我们使用 1 字节
大小然后写入数据本身，我们得到 `[0x02, 0xAA, 0xBB]`，完成，但我们看到
最终大小为 3，不是 4 字节的倍数，那么我们需要添加 1 字节的填充使其达到 4。结果：`[0x02, 0xAA, 0xBB, 0x00]`。

如果我们需要编码一个大小等于例如 396 的数组，
我们这样做：396 >= 254，所以我们使用 3 字节进行大小编码和 1 字节超尺寸指示符，
我们得到：`[0xFE, 0x8C, 0x01, 0x00, 数组字节]`，396+4 = 400，是 4 的倍数，无需对齐。

## 非明显的序列化规则

通常，在架构本身之前会写入一个 4 字节前缀 - 其 ID。架构 ID 是从架构文本的 CRC32，其中 IEEE 表，同时从文本中先前删除了诸如 `;` 和括号 `()` 的符号。带有 ID 前缀的架构序列化称为 **boxed**，这使解析器能够确定在它之前出现的是哪个架构（如果有多个选项）。

如何确定是否序列化为 boxed？如果我们的架构是另一个架构的一部分，那么我们需要看字段类型是如何指定的，如果它是明确指定的，那么我们序列化时不带前缀，如果不是明确的（有很多这样的类型），那么我们需要序列化为 boxed。例子：

```tlb
pub.unenc data:bytes = PublicKey;
pub.ed25519 key:int256 = PublicKey;
pub.aes key:int256 = PublicKey;
pub.overlay name:bytes = PublicKey;
```

我们有这样的类型，如果在架构中指定了 `PublicKey`，例如 `adnl.node id:PublicKey addr_list:adnl.addressList = adnl.Node`，那么它没有明确指定，我们需要使用 ID 前缀（boxed）序列化。而如果它被指定为这样：`adnl.node id:pub.ed25519 addr_list:adnl.addressList = adnl.Node`，那么它就是明确的，不需要前缀。

## 参考资料

*这里是 [Oleg Baranov](https://github.com/xssnick) 的[原文链接](https://github.com/xssnick/ton-deep-doc/blob/master/TL.md)。*
