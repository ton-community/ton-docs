import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

이 섹션에서는 TON 블록체인의 스마트 컨트랙트 주소에 대해 자세히 설명합니다. 또한 TON에서 액터가 스마트 컨트랙트와 어떻게 동의어인지 설명합니다.

## Everything is a smart contract

TON에서 스마트 컨트랙트는 [액터 모델]을 사용하여 구축됩니다(/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor). 사실 TON의 액터는 기술적으로 스마트 컨트랙트로 표현됩니다. 즉, 지갑도 단순한 액터이자 스마트 컨트랙트라고 할 수 있습니다.

일반적으로 액터는 수신 메시지를 처리하고, 내부 상태를 변경하며, 그 결과로 아웃바운드 메시지를 생성합니다. 그렇기 때문에 TON 블록체인의 모든 액터(즉, 스마트 컨트랙트)는 다른 액터로부터 메시지를 수신할 수 있도록 주소를 가져야 합니다.

:::info EVM 경험
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. Feel free to learn more about the differences by reading our article ["Six unique aspects of TON Blockchain that will surprise Solidity developers"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) - _Tal Kol_.
:::

## Address of smart contract

TON의 스마트 컨트랙트 주소는 일반적으로 두 가지 주요 구성 요소로 이루어져 있습니다:

- **(workchain_id)**: 워크체인 ID(부호화된 32비트 정수)를 나타냅니다.

- **(account_id)** 계정의 주소를 나타냅니다(워크체인에 따라 64-512비트).

이 문서의 원시 주소 개요 섹션에서는 **(workchain_id, account_id)** 쌍이 어떻게 표시되는지에 대해 설명합니다.

### WorkChain ID and Account ID

#### 워크체인 ID

[앞서 살펴본 바와 같이(/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules), TON 블록체인에서 작동하는 `2^32`개의 워크체인을 생성하는 것이 가능합니다. 또한 32비트 접두사 스마트 컨트랙트 주소가 서로 다른 워크체인 내의 스마트 컨트랙트 주소를 식별하고 연결하는 방식에 주목했습니다. 이를 통해 스마트 컨트랙트는 TON 블록체인의 다른 워크체인과 메시지를 주고받을 수 있습니다.

현재 톤 블록체인에서는 마스터체인(workchain_id=-1)과 때때로 기본 워크체인(workchain_id=0)만 실행되고 있습니다.

둘 다 256비트 주소를 가지고 있으므로 workchain_id는 0 또는 -1이고 워크체인 내 주소는 정확히 256비트라고 가정합니다.

#### 계정 ID

All account IDs on TON use 256-bit addresses on the Masterchain and Basechain (also referred to as the basic workchain).

In fact, an Account ID (**account_id**) is defined as the result of applying a hash function (specifically SHA-256) to a smart contract object. Every smart contract operating on the TON Blockchain stores two main components:

1. _Compiled code_. The logic of the smart contract, compiled into bytecode.
2. _Initial state_. The contract's values at the moment it is deployed on-chain.

To derive the contract's address, you calculate the hash of the **(Initial code, Initial state)** pair. We won’t explore how the [TVM](/v3/documentation/tvm/tvm-overview) works at this time, but it is important to understand that account IDs on TON follow this formula:

**account_id = hash(initial code, initial state)**

Later in this documentation, we will dive deeper into the technical specifications of the TVM and TL-B scheme. Now that we are familiar with how the **account_id** is generated and how it interacts with smart contract addresses on TON, let’s discuss Raw and User-Friendly addresses.

## 주소 상태

각 주소는 가능한 상태 중 하나에 속할 수 있습니다:

- '존재하지 않음' - 이 주소에 수락된 트랜잭션이 없으므로 데이터가 없거나 계약이 삭제된 상태입니다. 처음에는<sup>2256개의</sup> 주소가 모두 이 상태라고 말할 수 있습니다.
- 'uninit\\` - 주소에 잔액과 메타 정보가 포함된 일부 데이터가 있습니다. 이 상태의 주소에는 아직 스마트 컨트랙트 코드/영구 데이터가 없습니다. 예를 들어 주소가 존재하지 않는 상태에 있다가 다른 주소가 토큰을 전송했을 때 주소가 이 상태가 됩니다.
- '활성' - 주소에 스마트 컨트랙트 코드, 영구 데이터, 잔액이 있습니다. 이 상태에서는 트랜잭션 중에 일부 로직을 수행하고 퍼시스턴트 데이터를 변경할 수 있습니다. 주소가 `uninit` 상태이고 state_init 매개변수가 포함된 수신 메시지가 있을 때 이 상태가 됩니다(이 주소를 배포하려면 `state_init`과 `code`의 해시가 주소와 같아야 함을 유의하세요).
- '고정' - 주소가 어떤 작업도 수행할 수 없으며, 이 상태에는 이전 상태의 해시 두 개(각각 코드와 상태 셀)만 포함됩니다. 주소의 저장 요금이 잔액을 초과하면 이 상태가 됩니다. 동결을 해제하려면 앞서 설명한 해시를 저장하는 `state_init`과 `code`, 그리고 약간의 톤코인을 포함한 내부 메시지를 보내면 됩니다. 복구가 어려울 수 있으므로 이 상황을 허용하지 않아야 합니다. 주소 고정을 해제하는 프로젝트가 있으며, [여기](https://unfreezer.ton.org/)에서 확인할 수 있습니다.

## Raw and user-friendly addresses

TON의 스마트 컨트랙트 주소가 워크체인과 계정 ID(특히 마스터체인과 베이스체인)를 활용하는 방법에 대해 간략하게 살펴본 후, 이러한 주소가 두 가지 주요 형식으로 표현된다는 점을 이해하는 것이 중요합니다:

- **원시 주소**: 스마트 컨트랙트 주소의 원본 전체 표현.
- **사용자 친화적 주소**: 사용자 친화적 주소는 보안과 사용 편의성을 개선한 향상된 형식의 원시 주소입니다.

아래에서 이 두 주소 유형의 차이점에 대해 자세히 설명하고 TON에서 사용자 친화적인 주소가 사용되는 이유에 대해 자세히 알아보겠습니다.

### 원시 주소

원시 스마트 컨트랙트 주소는 워크체인 ID와 계정 ID \*(워크체인_id, 계정_id)\*로 구성되며 다음 형식으로 표시됩니다:

- [십진수 workchain_id\]:[16진수 64자리, 계정_id 포함\]

아래는 워크체인 ID와 계정 ID를 함께 사용하는 원시 스마트 컨트랙트 주소의 예시입니다(**workchain_id** 및 **account_id**로 표현):

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

주소 문자열의 시작 부분에 있는 '-1'은 마스터체인에 속한 _workchain_id_를 나타냅니다.

:::note
Uppercase letters (such as 'A', 'B', 'C', 'D' etc.) 주소 문자열에는 소문자 대신 대문자('A', 'B', 'C', 'D' 등)를 사용할 수 있습니다(예: 'a', 'b', 'c', 'd' 등).
:::

#### Issues with raw addresses

원시 주소 양식을 사용하면 두 가지 주요 문제가 발생합니다:

1. 원시 주소 형식을 사용하면 트랜잭션을 전송하기 전에 오류를 제거하기 위해 주소를 확인할 수 없습니다.
   즉, 트랜잭션을 전송하기 전에 실수로 주소 문자열에 문자를 추가하거나 제거하면 트랜잭션이 잘못된 목적지로 전송되어 자금 손실이 발생할 수 있습니다.
2. 원시 주소 형식을 사용할 때는 사용자 친화적인 주소를 사용하는 트랜잭션을 보낼 때 사용하는 것과 같은 특수 플래그를 추가할 수 없습니다.
   이 개념을 더 잘 이해할 수 있도록 아래에서 어떤 플래그를 사용할 수 있는지 설명해드리겠습니다.

### User-friendly address

사용자 친화적인 주소는 인터넷(예: 공용 메시징 플랫폼 또는 이메일 서비스 제공업체를 통해)은 물론 실제 세계에서 주소를 공유하는 TON 사용자의 경험을 보호하고 간소화하기 위해 개발되었습니다.

#### User-friendly address structure

사용자 친화적인 주소는 총 36바이트로 구성되며, 다음 구성 요소를 순서대로 생성하여 얻습니다:

1. _[플래그 - 1바이트]_ - 주소에 고정된 플래그는 스마트 컨트랙트가 수신된 메시지에 반응하는 방식을 변경합니다.
   사용자 친화적인 주소 형식을 사용하는 플래그 유형은 다음과 같습니다:

   - isBounceable. 바운스 가능 또는 바운스 불가능 주소 유형을 나타냅니다. (_0x11_은 "바운스 가능", _0x51_은 "바운스 불가능").
   - isTestnetOnly. 테스트넷 용도로만 사용되는 주소 유형을 나타냅니다. 0x80_으로 시작하는 주소는 프로덕션 네트워크에서 실행되는 소프트웨어에서 허용되지 않아야 합니다.
   - isUrlSafe. 주소에 대해 URL 안전으로 정의된 더 이상 사용되지 않는 플래그를 나타냅니다. 그러면 모든 주소가 URL 안전 주소로 간주됩니다.
2. _\[workchain_id - 1바이트]_ - 워크체인 ID(_workchain_id_)는 부호화된 8비트 정수 _workchain_id_로 정의됩니다.\
   (베이스체인의 경우 _0x00_, 마스터체인의 경우 _0xff_).\
   (_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[account_id - 32바이트]_ - 계정 ID는 워크체인에서 ([빅엔디안](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/)) 256비트 주소로 구성됩니다.
4. _\[주소 검증 - 2바이트]_ - 사용자 친화적 주소에서 주소 검증은 이전 34바이트의 CRC16-CCITT 서명으로 구성됩니다. ([예시](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   사실 사용자 친화적 주소의 인증과 관련된 아이디어는 사용자가 실수로 존재하지 않는 카드 번호를 입력하는 것을 방지하기 위해 모든 신용카드에 사용되는 [루른 알고리즘](https://en.wikipedia.org/wiki/Luhn_algorithm)과 매우 유사합니다.

이 4가지 주요 구성 요소를 더하면 다음과 같습니다: 총 `1 + 1 + 32 + 2 = 36` 바이트(사용자 친화적 주소당)가 됩니다.

사용자 친화적인 주소를 생성하려면 개발자는 둘 중 하나를 사용하여 36바이트를 모두 인코딩해야 합니다:

- _base64_ (즉, 숫자, 라틴 대문자 및 소문자, '/' 및 '+' 포함)
- _base64url_('/'와 '+' 대신 '_'와 '-' 사용)

이 과정이 완료되면 공백이 없는 48자 길이의 사용자 친화적인 주소 생성이 완료됩니다.

:::info DNS 주소 플래그
TON에서는 사용자 친화적인 원시 주소 대신 mywallet.ton과 같은 DNS 주소가 사용되기도 합니다. DNS 주소는 사용자 친화적인 주소로 구성되며 개발자가 TON 도메인 내의 DNS 레코드에서 모든 플래그에 액세스할 수 있는 모든 필수 플래그를 포함합니다.
:::

#### User-friendly address encoding examples

예를 들어, "테스트 제공자" 스마트 컨트랙트(테스트 토큰을 요청하는 모든 사람에게 2개의 테스트 토큰을 보내는 테스트넷 마스터체인에 있는 특수 스마트 컨트랙트)는 다음과 같은 원시 주소를 사용합니다:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

위의 "테스트 제공자" 원시 주소를 사용자 친화적인 주소 형식으로 변환해야 합니다. 이는 다음과 같이 base64 또는 base64url 형식(앞서 소개한)을 사용하여 얻을 수 있습니다:

- `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
- `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
두 양식(_base64_ 및 _base64url_)이 모두 유효하며 반드시 수락해야 합니다!
:::

#### Bounceable vs non-bounceable addresses

반송 가능한 주소 플래그의 핵심 아이디어는 발신자의 자금 보안입니다.

예를 들어, 대상 스마트 컨트랙트가 존재하지 않거나 거래 중에 문제가 발생하면 메시지는 발신자에게 '반송'되어 원래 거래 금액(모든 전송 및 가스 수수료를 뺀 나머지 금액)으로 구성됩니다.
반송 가능한 주소와 관련하여 구체적으로 설명합니다:

1. 바운스 가능=거짓\*\* 플래그는 일반적으로 수신자가 지갑임을 의미합니다.
2. 바운스 가능=참\*\* 플래그는 일반적으로 자체 애플리케이션 로직이 있는 사용자 지정 스마트 컨트랙트(예: DEX)를 나타냅니다. 이 예시에서는 보안상의 이유로 바운스 불가능한 메시지를 전송해서는 안 됩니다.

반송할 수 없는 메시지]에 대한 자세한 내용은 [반송할 수 없는 메시지](/v3/documentation/smart-contacts/message-management/non-bounceable-messages) 설명서를 참조하세요.

#### Armored base64 representations

TON 블록체인과 관련된 추가 바이너리 데이터는 유사한 "기갑된" 사용자 친화적인 Base64 주소 표현을 사용합니다. 이는 바이트 태그의 처음 4자에 따라 서로 구별됩니다. 예를 들어, 256비트 Ed25519 공개 키는 먼저 아래 프로세스를 사용하여 36바이트 시퀀스를 순서대로 생성하여 표현합니다:

- 0x3E_ 형식을 사용하는 단일 바이트 태그는 공개 키를 나타냅니다.
- 0xE6_ 형식을 사용하는 단일 바이트 태그는 Ed25519 공개키를 나타냅니다.
- Ed25519 공개 키의 표준 바이너리 표현을 포함하는 32바이트
- 이전 34바이트의 CRC16-CCITT의 빅 엔디안 표현을 포함하는 2바이트

결과 36바이트 시퀀스는 표준 방식에 따라 48자 base64 또는 base64url 문자열로 변환됩니다. 예를 들어, Ed25519 공개 키 `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D`(일반적으로 32바이트의 시퀀스로 표시됨)는 다음과 같이 표시됩니다:  0xE3, 0x9E, ..., 0x7D\\`)는 다음과 같이 "아머드" 표현을 통해 나타납니다:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`

### Converting user-friendly addresses and raw addresses

사용자 친화적인 원시 주소를 변환하는 가장 간단한 방법은 다음과 같은 여러 TON API 및 기타 도구 중 하나를 사용하는 것입니다:

- [ton.org/address](https://ton.org/address)
- [dton.io API method](https://dton.io/api/address/0:867ac2b47d1955de6c8e23f57994fad507ea3bcfe2a7d76ff38f29ec46729627)
- [메인넷의 톤센터 API 메소드](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
- [테스트넷의 톤센터 API 메소드](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

또한 JavaScript를 사용하여 지갑의 사용자 친화적인 주소와 원시 주소를 변환하는 두 가지 방법이 있습니다:

- [ton.js를 사용하여 사용자 친화적 또는 원시 양식으로 주소 변환](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
- [톤웹을 사용하여 사용자 친화적 또는 원시 형태로 주소 변환](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

SDK]를 사용하여 유사한 메커니즘을 사용할 수도 있습니다(/v3/guidelines/dapps/apis-sdks/sdk).

### Address examples

TON 주소에 대한 자세한 예제는 [TON 쿡북]에서 확인하세요(/v3/guidelines/dapps/cookbook#working-with-contacts-addresses).

## 발생 가능한 문제

TON 블록체인과 상호작용할 때, TON 코인을 '유니트' 지갑 주소로 전송하는 것의 의미를 이해하는 것이 중요합니다. 이 섹션에서는 이러한 트랜잭션이 어떻게 처리되는지 명확하게 설명하기 위해 다양한 시나리오와 그 결과를 간략하게 설명합니다.

### 톤코인을 초기화되지 않은 주소로 전송하면 어떻게 되나요?

#### state_init\\`이 포함된 트랜잭션

지갑 또는 스마트 컨트랙트의 코드와 데이터로 구성된 `state_init`을 트랜잭션에 포함하면 트랜잭션이 배포됩니다. 스마트 컨트랙트는 제공된 `state_init`을 사용해 먼저 배포됩니다. 배포 후에는 이미 초기화된 계정으로 보내는 것과 유사하게 수신 메시지가 처리됩니다.

#### state_init`및`bounce\\` 플래그가 설정되지 않은 트랜잭션

메시지는 `uninit` 스마트 컨트랙트로 전달할 수 없으며 발신자에게 반송됩니다. 소비된 가스 요금을 공제하고 남은 금액은 발신자의 주소로 반환됩니다.

#### state_init`및`bounce\\` 플래그가 설정되지 않은 트랜잭션

메시지는 전달되지 않지만 발신자에게 반송되지는 않습니다. 대신, 지갑이 아직 초기화되지 않았더라도 전송된 금액이 수신 주소에 입금되어 잔액이 증가합니다. 주소 소유자가 스마트 지갑 컨트랙트를 배포하고 잔액에 액세스할 수 있을 때까지 해당 주소에 저장됩니다.

#### 올바른 방법

지갑을 배포하는 가장 좋은 방법은 아직 초기화되지 않은 주소로 '반송' 플래그를 지운 상태로 TON을 전송하는 것입니다. 이 단계가 끝나면 소유자는 현재 초기화되지 않은 주소의 자금을 사용해 지갑을 배포하고 초기화할 수 있습니다. 이 단계는 보통 첫 번째 지갑 작업에서 발생합니다.

### TON 블록체인은 잘못된 거래에 대한 보호 기능을 구현합니다.

TON 블록체인에서 표준 지갑과 앱은 [여기](#바운스 가능 대 비바운스 가능 주소)에 설명된 바운스 가능 주소와 비바운스 가능 주소를 사용해 초기화되지 않은 주소로의 복잡한 트랜잭션을 자동으로 관리합니다. 지갑에서는 초기화되지 않은 주소로 코인을 보낼 때 반환 없이 반송 가능 주소와 반송 불가 주소로 코인을 보내는 것이 일반적인 관행입니다.

반송 가능/반송 불가능한 형태의 주소를 빠르게 얻어야 하는 경우 [여기](https://ton.org/address/)를 참조하세요.

### 맞춤형 제품에 대한 책임

TON 블록체인에서 커스텀 제품을 개발하는 경우, 이와 유사한 점검과 로직을 구현하는 것이 필수적입니다:

자금을 보내기 전에 애플리케이션에서 수취인 주소가 초기화되었는지 확인합니다.
주소 상태에 따라 사용자 지정 애플리케이션 로직이 있는 사용자 스마트 컨트랙트에 반송 가능한 주소를 사용하여 자금이 반환되도록 합니다. 지갑에는 반송 불가능한 주소를 사용하세요.

<Feedback />

