import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

TON 블록체인에서 지갑과 스마트 컨트랙트를 포함한 모든 액터는 주소로 표현됩니다. 이러한 주소들은 메시지와 트랜잭션을 주고받는 데 매우 중요합니다. 스마트 컨트랙트 주소에는 \*\*원시 주소(raw address)\*\*와 \*\*사용자 친화적 주소(user-friendly address)\*\*의 두 가지 주요 형식이 있습니다.

## Address components

TON의 각 주소는 두 가지 주요 구성 요소로 이루어집니다:

- **워크체인 ID**: 컨트랙트가 속한 워크체인을 나타내는 부호 있는 32비트 정수(예: 마스터체인의 경우 `-1`, 베이스체인의 경우 `0`)
- **계정 ID**: 컨트랙트를 위한 고유 식별자로, 마스터체인과 베이스체인의 경우 일반적으로 256비트 길이입니다.

## Address states

TON의 각 주소는 다음 상태 중 하나일 수 있습니다:

- **존재하지 않음**: 주소에 데이터가 없음(모든 주소의 초기 상태)
- **초기화되지 않음**: 주소에 잔액은 있지만 스마트 컨트랙트 코드는 없음
- **활성**: 스마트 컨트랙트 코드와 잔액이 있는 활성 상태의 주소
- **동결**: 저장 비용이 잔액을 초과하여 잠긴 주소

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
3. **인코딩**: base64나 base64url을 사용하여 원시 주소를 읽기 쉽고 간단한 형태로 변환합니다.

Example: `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF` (base64)

사용자 친화적 주소는 오류를 방지하고 실패한 트랜잭션의 경우 자금 반환을 허용함으로써 트랜잭션을 더 안전하게 만듭니다.

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

**원시 주소**는 기본 요소만을 포함합니다:

- **워크체인 ID**(예: 마스터체인의 경우 `-1`)
- **계정 ID**: 256비트 고유 식별자

예시:\
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

하지만 원시 주소에는 두 가지 주요 문제가 있습니다:

1. 내장된 오류 검사가 없어, 복사 시 실수가 자금 손실로 이어질 수 있습니다.
2. They don't support additional features like bounceable/non-bounceable flags.

## Converting between address formats

Convert raw, user-friendly addresses using [ton.org/address](https://ton.org/address/).

For more details, refer to the refhandling guide in the [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/) section.

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/)
- [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/)

<Feedback />

