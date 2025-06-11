import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

TON Blockchainでは、ウォレットやスマートコントラクトを含むすべてのアクターがアドレスで表されます。 これらのアドレスは、メッセージとトランザクションの受信と送信に不可欠です。 スマートコントラクトアドレスには、**生アドレス** と **使いやすいアドレス** の 2 つの形式があります。 These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## Address components

TON の各アドレスは、2 つの主要なコンポーネントで構成されています:

- **Workchain ID**: 契約が属するワークチェーンを示す符号付き32ビット整数（例: マスターチェーンの `-1` および Basechainの `0` ）。
- **アカウント ID** : コントラクトの固有の識別子、通常はMasterchainとBasechainの長さ256ビットです。

## Address states

TON の各アドレスは以下のいずれかの状態にすることができます:

- **Nonexist**: アドレスにデータがありません（すべてのアドレスの初期状態）。
- **ユニット**: アドレスには残高がありますが、スマートコントラクトコードはありません。
- **アクティブ**: アドレスはスマートコントラクトコードと残高があります。
- **凍結**: ストレージコストが残高を超えているため、アドレスがロックされています。

## Address formats

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## User-friendly address

A **user-friendly address** designed for blockchain users with features:

1. **Flags**: Indicates if the address is bounceable for contracts or non-bounceable for wallets.
2. **Checksum**: A 2-byte error-checking mechanism CRC16 that helps detect errors before sending.
3. **エンコーディング**: base64 または base64url を使用して、生のアドレスを読みやすくコンパクトなフォームに変換します。

Example: `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF` (base64)

ユーザーフレンドリーなアドレスは、エラーを防止し、トランザクションが失敗した場合に資金の返金を許可することにより、トランザクションをより安全にします。

### User-friendly address flags

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

|                   Address beginning                  |        Binary form        | Bounceable | Testnet-only |
| :--------------------------------------------------: | :-----------------------: | :--------: | :----------: |
| E... | 000100.01 |     yes    |      no      |
| U... | 010100.01 |     no     |      no      |
| k... | 100100.01 |     yes    |      yes     |
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

## Raw address

**ローアドレス** には基本的な要素のみが含まれています。

- **Workchain ID** (e.g. `-1` for Masterchain)
- **アカウント ID**: 256 ビットの一意の識別子

例:\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

ただし、ローアドレスには主に2つの問題があります。

1. 彼らは組み込みのエラーチェックを欠いています、つまりコピーの間違いは資金の損失につながる可能性があります。
2. They don't support additional features like bounceable/non-bounceable flags.

## Converting between address formats

Convert raw, user-friendly addresses using [ton.org/address](https://ton.org/address/).

For more details, refer to the refhandling guide in the [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/) section.

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/)
- [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/)

<Feedback />

