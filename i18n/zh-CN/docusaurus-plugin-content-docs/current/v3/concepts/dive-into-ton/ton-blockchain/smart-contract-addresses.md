import Feedback from '@site/src/components/Feedback';

# 智能合约地址

On the TON Blockchain, every actor, including wallets and smart contracts, is represented by an address. These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## 地址组成

TON 上的每个地址都由两个主要部分组成：

- **工作链 ID(Workchain ID)**：带符号的 32 位整数，表示合约属于哪个工作链（例如，"-1 "表示主链，"0 "表示基础链）。
- **账户 ID(Account ID)**：合约的唯一标识符，主链和底层链的长度一般为 256 位。

## 地址状态

TON 上的每个地址都可以处于以下状态之一：

- **Nonexist**：地址没有数据（所有地址的初始状态）。
- **Uninit**：地址有余额，但没有智能合约代码。
- **Active**：该地址已启用智能合约代码和余额。
- **Frozen**：由于存储费用超过余额，地址被锁定。

## 在 TON 区块链上，每个行为者（包括钱包和智能合约）都有一个地址。这些地址对于接收和发送信息和交易至关重要。智能合约地址有两种主要格式：**原始地址**和**用户友好地址**。

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## 用户友好的地址

一个**方便用户的地址**通过以下方式解决了这些问题：

1. **Flags**：表示地址是可跳转的（针对合约）还是不可跳转的（针对钱包）。
2. \*\* Checksum\*\*：2 字节错误校验机制 (CRC16)，有助于在发送前检测错误。
3. \*\* Encoding\*\*：使用 base64 或 base64url 将原始地址转换为可读的简洁形式。

例如，同样的原始地址可以转换成用户友好的地址，如\
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

用户友好型地址可防止出错，并允许在交易失败的情况下退回资金，从而使交易更加安全。

### 原始地址与用户友好地址

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

|                         原始地址                         |        Binary form        | Bounceable | Testnet-only |
| :--------------------------------------------------: | :-----------------------: | :--------: | :----------: |
| E... | 000100.01 |     yes    |      no      |
| U... | 010100.01 |     no     |      no      |
|                           #                          | 100100.01 |     yes    |      yes     |
| 0... | 110100.01 |     no     |      yes     |

:::tip
The Testnet-only flag doesn't have representation in the blockchain at all. The non-bounceable flag makes a difference only when used as the destination address for a transfer: in this case, it [disallows bounce](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for a message sent; the address in blockchain, again, does not contain this flag.
:::

```
default bounceable: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
urlSafe: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
non-bounceable: UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
Testnet: kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
non-bounceable, Testnet: 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

## TODO，这是 gpt

**原始地址**只包含基本要素：

- **工作链 ID**（例如，"-1 "表示主链）
- **账户 ID**：256 位唯一标识符

示例：\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`.

然而，原始地址有两个主要问题：

1. 它们缺乏内置的错误检查功能，这意味着复制错误可能导致资金损失。
2. 它们不支持可反弹/不可反弹选项等附加功能。

## 地址格式之间的转换

要在原始地址和用户友好型地址之间进行转换，可以使用 TON API 或 [ton.org/address](https://ton.org/address) 等开发工具。这些工具可实现无缝转换，并确保在发送交易前格式正确。

有关如何处理这些地址的更多细节，包括编码示例和事务安全性，请参阅 [Addresses Documentation](/v3/documentation/smart-contracts/addresses) 中的完整指南。

## 参阅

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton)
- [智能合约地址文档](/v3/documentation/smart-contracts/addresses)

<Feedback />

