import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Wallet contracts

You may have heard about different versions of wallets on TON Blockchain. But what do these versions actually mean, and how do they differ?

이 글에서는 TON 지갑의 여러 버전과 수정 사항을 자세히 살펴보겠습니다.

:::info
Before we start, there are some terms and concepts that you should be familiar with to fully understand the article:

- [메시지 관리](/v3/documentation/smart-contracts/message-management/messages-and-transactions) - 월렛의 주요 기능이기 때문입니다.
- [FunC language](/v3/documentation/smart-contracts/func/overview), because we will heavily rely on implementations made using it.
  :::

## 기본 개념

먼저 이해해야 할 것은 월렛이 TON 생태계에서 특별한 존재가 아니라는 점입니다. 월렛은 코드와 데이터로 구성된 스마트 컨트랙트일 뿐이며, TON의 다른 액터(즉, 스마트 컨트랙트)와 동등합니다.

Like your own custom smart contract, or any other one, wallets can receive external and internal messages, send internal messages and logs, and provide `get methods`.
So the question is: what functionality do they provide and how it differs between versions?

각 월렛 버전은 표준 외부 인터페이스를 제공하는 스마트 컨트랙트 구현으로 볼 수 있으며, 이를 통해 다양한 외부 클라이언트가 월렛과 동일한 방식으로 상호작용할 수 있습니다. TON 메인 모노레포에서 FunC와 Fift 언어로 구현된 내용을 찾을 수 있습니다:

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## 기본 월렛

### Wallet contracts hashes

Here, you can find the current hashes of the wallet contract code versions.\
For detailed specifications of each wallet contract, please refer to the page.
For detailed specifications of each wallet contract, please refer further down the page or check the [ContractSources.md](https://github.com/toncenter/tonweb/blob/update_contracts/src/contract/ContractSources.md).

<details><summary> Show wallet contracts hashes table </summary>

| Contract version         | Hash                                           |
| ------------------------ | ---------------------------------------------- |
| [walletv1r1](#wallet-v1) | `oM/CxIruFqJx8s/AtzgtgXVs7LEBfQd/qqs7tgL2how=` |
| [walletv1r2](#wallet-v1) | `1JAvzJ+tdGmPqONTIgpo2g3PcuMryy657gQhfBfTBiw=` |
| [walletv1r3](#wallet-v1) | `WHzHie/xyE9G7DeX5F/ICaFP9a4k8eDHpqmcydyQYf8=` |
| [walletv2r1](#wallet-v2) | `XJpeaMEI4YchoHxC+ZVr+zmtd+xtYktgxXbsiO7mUyk=` |
| [walletv2r2](#wallet-v2) | `/pUw0yQ4Uwg+8u8LTCkIwKv2+hwx6iQ6rKpb+MfXU/E=` |
| [walletv3r1](#wallet-v3) | `thBBpYp5gLlG6PueGY48kE0keZ/6NldOpCUcQaVm9YE=` |
| [walletv3r2](#wallet-v3) | `hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk=` |
| [walletv4r1](#wallet-v4) | `ZN1UgFUixb6KnbWc6gEFzPDQh4bKeb64y3nogKjXMi0=` |
| [walletv4r2](#wallet-v4) | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| [walletv5r1](#wallet-v5) | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |

</details>

**Note:** These hashes can also be found in the explorers.

### Wallet V1 {#wallet-v1}

가장 단순한 버전입니다. 한 번에 4개의 트랜잭션만 보낼 수 있으며 서명과 seqno 외에는 아무것도 확인하지 않습니다.

월렛 소스 코드:

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

이 버전은 중요한 문제가 있어 일반 앱에서는 사용되지 않습니다:

- 컨트랙트에서 seqno와 공개키를 검색할 쉬운 방법이 없습니다.
- `valid_until` 확인이 없어서 트랜잭션이 너무 늦게 확인되는 것을 방지할 수 없습니다.

The first issue was fixed in `V1R2` and `V1R3`. The `R` stands for **revision**. Usually, revisions are just small updates that only add get methods; you can find all of those in the changes history of `new-wallet.fif`. Hereinafter, we will consider only the latest revisions.

어떤 이유로든 일정 시간 동안 코인을 잠그고 그 시간이 지나기 전에는 인출할 수 없게 하려면 lockup 월렛을 살펴보세요.

#### Official code hashes

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| walletv1r1       | `oM/CxIruFqJx8s/AtzgtgXVs7LEBfQd/qqs7tgL2how=` |
| walletv1r2       | `1JAvzJ+tdGmPqONTIgpo2g3PcuMryy657gQhfBfTBiw=` |
| walletv1r3       | `WHzHie/xyE9G7DeX5F/ICaFP9a4k8eDHpqmcydyQYf8=` |

#### 영구 메모리 레이아웃

- <b>seqno</b>: 32비트 시퀀스 넘버
- <b>public-key</b>: 256비트 공개키

#### 외부 메시지 본문 레이아웃

1. 데이터:
  - <b>signature</b>: 512비트 ed25519 서명
  - <b>msg-seqno</b>: 32비트 시퀀스 넘버
  - <b>(0-4)mode</b>: 각 메시지의 전송 모드를 정의하는 최대 4개의 8비트 정수
2. 메시지가 포함된 셀에 대한 최대 4개의 참조

보시다시피, 월렛의 주요 기능은 외부 세계에서 TON 블록체인과 안전하게 통신할 수 있는 방법을 제공하는 것입니다. `seqno` 메커니즘은 재생 공격을 방지하고, `Ed25519 서명`은 월렛 기능에 대한 인증된 접근을 제공합니다. 이러한 메커니즘 각각에 대해 자세히 설명하지는 않겠습니다. 이는 [외부 메시지](/v3/documentation/smart-contracts/message-management/external-messages) 문서 페이지에 자세히 설명되어 있으며 외부 메시지를 받는 스마트 컨트랙트에서 매우 일반적입니다. 페이로드 데이터는 최대 4개의 셀 참조와 해당하는 수의 모드로 구성되며, 이는 직접 [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) 메소드로 전송됩니다.

:::caution
월렛이 내부 메시지에 대한 유효성 검사를 제공하지 않는다는 점에 유의하세요. [내부 메시지 레이아웃](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)에 따라 데이터를 직렬화하는 것은 프로그래머(즉, 외부 클라이언트)의 책임입니다.
:::

#### 종료 코드

| 종료 코드 | 설명                      |
| ----- | ----------------------- |
| 0x21  | `seqno` 확인 실패, 응답 보호 발생 |
| 0x22  | `Ed25519 서명` 확인 실패      |
| 0x0   | 표준 성공 실행 종료 코드          |

:::info
[TVM](/v3/documentation/tvm/tvm-overview)에는 [표준 종료 코드](/v3/documentation/tvm/tvm-exit-codes)가 있습니다(`0x0`이 그 중 하나). 예를 들어 [가스](https://docs.ton.org/develop/smart-contracts/fees)가 부족한 경우 `0xD` 코드를 받게 됩니다.
:::

#### Get 메소드

1. int seqno() - 현재 저장된 seqno를 반환합니다.
2. int get_public_key - 현재 저장된 공개키를 반환합니다.

### Wallet V2 {#wallet-v2}

월렛 소스 코드:

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

이 버전은 트랜잭션이 너무 늦게 확인되는 것을 방지하기 위한 시간 제한을 설정하는 데 사용되는 `valid_until` 파라미터를 도입합니다. 이 버전에는 `V2R2`에서 추가된 공개키에 대한 get-메소드가 없습니다.

이전 버전과의 모든 차이점은 `valid_until` 기능을 추가한 결과입니다. valid_until 확인 실패를 표시하는 새로운 종료 코드 `0x23`이 추가되었습니다. 또한 트랜잭션의 시간 제한을 설정하는 새로운 UNIX-time 필드가 외부 메시지 본문 레이아웃에 추가되었습니다. 모든 get 메소드는 동일하게 유지됩니다.

#### Official code hashes

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| walletv2r1       | `XJpeaMEI4YchoHxC+ZVr+zmtd+xtYktgxXbsiO7mUyk=` |
| walletv2r2       | `/pUw0yQ4Uwg+8u8LTCkIwKv2+hwx6iQ6rKpb+MfXU/E=` |

#### 외부 메시지 본문 레이아웃

1. 데이터:
  - <b>signature</b>: 512비트 ed25519 서명
  - <b>msg-seqno</b>: 32비트 시퀀스 넘버
  - <b>valid-until</b>: 32비트 Unix-time 정수
  - <b>(0-4)mode</b>: 각 메시지의 전송 모드를 정의하는 최대 4개의 8비트 정수
2. 메시지가 포함된 셀에 대한 최대 4개의 참조

### Wallet V3 {#wallet-v3}

이 버전은 동일한 공개키를 사용하여 여러 월렛을 생성할 수 있게 하는 `subwallet_id` 파라미터를 도입합니다(따라서 하나의 시드 구문으로 여러 월렛을 가질 수 있음). 이전과 마찬가지로 `V3R2`는 공개키에 대한 get-메소드만 추가합니다.

월렛 소스 코드:

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

본질적으로 `subwallet_id`는 컨트랙트가 배포될 때 컨트랙트 상태에 추가되는 숫자일 뿐입니다. TON에서 컨트랙트 주소는 상태와 코드의 해시이므로, 다른 `subwallet_id`를 사용하면 월렛 주소가 변경됩니다. 이 버전은 현재 가장 널리 사용되고 있습니다. 대부분의 사용 사례를 다루며 깔끔하고 단순하며 이전 버전과 거의 동일하게 유지됩니다. 모든 get 메소드는 동일하게 유지됩니다.

#### Official code hashes

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| walletv3r1       | `thBBpYp5gLlG6PueGY48kE0keZ/6NldOpCUcQaVm9YE=` |
| walletv3r2       | `hNr6RJ+Ypph3ibojI1gHK8D3bcRSQAKl0JGLmnXS1Zk=` |

#### 영구 메모리 레이아웃

- <b>seqno</b>: 32비트 시퀀스 넘버
- <b>subwallet</b>: 32비트 서브월렛 ID
- <b>public-key</b>: 256비트 공개키

#### 외부 메시지 레이아웃

1. 데이터:
  - <b>signature</b>: 512비트 ed25519 서명
  - <b>subwallet-id</b>: 32비트 서브월렛 ID
  - <b>msg-seqno</b>: 32비트 시퀀스 넘버
  - <b>valid-until</b>: 32비트 UNIX 시간 정수
  - <b>(0-4)mode</b>: 각 메시지의 전송 모드를 정의하는 최대 4개의 8비트 정수
2. 메시지가 포함된 셀에 대한 최대 4개의 참조

#### 종료 코드

| 종료 코드 | 설명                                      |
| ----- | --------------------------------------- |
| 0x23  | `valid_until` 확인 실패; 트랜잭션 확인이 너무 늦게 시도됨 |
| 0x23  | `Ed25519 서명` 확인 실패                      |
| 0x21  | `seqno` 확인 실패; 응답 보호가 트리거됨              |
| 0x22  | `subwallet-id`가 저장된 것과 일치하지 않음          |
| 0x0   | 표준 성공 실행 종료 코드                          |

### Wallet V4 {#wallet-v4}

이 버전은 이전 버전의 모든 기능을 유지하면서도 매우 강력한 `플러그인` 기능을 도입합니다.

월렛 소스 코드:

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

이 기능을 통해 개발자는 사용자의 월렛과 함께 작동하는 복잡한 로직을 구현할 수 있습니다. 예를 들어, DApp이 특정 기능을 사용하기 위해 매일 소량의 코인을 지불해야 할 수 있습니다. 이 경우 사용자는 트랜잭션에 서명하여 월렛에 플러그인을 설치해야 합니다. 그러면 플러그인은 외부 메시지로 요청받을 때 목적지 주소로 매일 코인을 보냅니다.

#### Official code hashes

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| walletv4r1       | `ZN1UgFUixb6KnbWc6gEFzPDQh4bKeb64y3nogKjXMi0=` |
| walletv4r2       | `/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=` |
| walletv5r1       | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |

#### 플러그인

플러그인은 본질적으로 개발자가 자유롭게 구현할 수 있는 TON의 다른 스마트 컨트랙트입니다. 월렛과 관련해서는 단순히 월렛의 영구 메모리에 있는 [딕셔너리](/v3/documentation/smart-contracts/func/docs/dictionaries)에 저장된 스마트 컨트랙트의 주소일 뿐입니다. 이러한 플러그인은 내부 메시지를 지갑에 보내어 자금을 요청하거나 "허용 목록"에서 자신을 제거할 수 있습니다.

#### 영구 메모리 레이아웃

- <b>seqno</b>: 32비트 시퀀스 넘버
- <b>subwallet-id</b>: 32비트 서브월렛 ID
- <b>public-key</b>: 256비트 공개키
- <b>plugins</b>: 플러그인이 포함된 딕셔너리(비어있을 수 있음)

#### 내부 메시지 수신

이전 버전의 월렛은 내부 메시지 수신에 대해 간단한 구현을 가지고 있었습니다. 단순히 모든 발신자로부터 들어오는 자금을 받아들이고, 내부 메시지 본문이 있다면 무시했습니다. 즉, 빈 recv_internal 메소드를 가지고 있었습니다. 하지만 앞서 언급했듯이, 월렛의 네 번째 버전은 두 가지 추가 작업이 가능합니다. 내부 메시지 본문 레이아웃을 살펴보겠습니다:

- <b>op-code?</b>: 32비트 작업 코드. 이는 선택적 필드입니다. 메시지 본문에 32비트 미만이 포함되어 있거나, 잘못된 op-코드가 있거나, 발신자 주소가 플러그인으로 등록되지 않은 경우 이전 월렛 버전과 같이 단순 전송으로 간주됩니다.
- <b>query-id</b>: 64비트 정수. 이 필드는 스마트 컨트랙트의 동작에 영향을 미치지 않습니다. 컨트랙트 간의 메시지 체인을 추적하는 데 사용됩니다.

1. op-code = 0x706c7567, 자금 요청 작업 코드
  - <b>toncoins</b>: 요청된 toncoins의 VARUINT16 금액
  - <b>extra_currencies</b>: 요청된 추가 통화의 금액이 포함된 딕셔너리(비어있을 수 있음)
2. op-code = 0x64737472, 플러그인-발신자를 "허용 목록"에서 제거 요청

#### 외부 메시지 본문 레이아웃

- <b>signature</b>: 512비트 ed25519 서명
- <b>subwallet-id</b>: 32비트 서브월렛 ID
- <b>valid-until</b>: 32비트 Unix-time 정수
- <b>msg-seqno</b>: 32비트 시퀀스 정수
- <b>op-code</b>: 32비트 작업 코드

1. op-code = 0x0, 단순 전송
  - <b>(0-4)mode</b>: 각 메시지의 전송 모드를 정의하는 최대 4개의 8비트 정수
  - <b>(0-4)messages</b>: 최대 4개의 메시지가 포함된 셀에 대한 참조
2. op-code = 0x1, 플러그인 배포 및 설치
  - <b>workchain</b>: 8비트 정수
  - <b>balance</b>: 초기 잔액의 VARUINT16 toncoins 금액
  - <b>state-init</b>: 플러그인 초기 상태가 포함된 셀 참조
  - <b>body</b>: 본문이 포함된 셀 참조
3. op-code = 0x2/0x3, 플러그인 설치/제거
  - <b>wc_n_address</b>: 8비트 workchain_id + 256비트 플러그인 주소
  - <b>balance</b>: 초기 잔액의 VARUINT16 toncoins 금액
  - <b>query-id</b>: 64비트 정수

보시다시피, 네 번째 버전은 여전히 이전 버전과 유사하게 `0x0` op-코드를 통해 표준 기능을 제공합니다. `0x2`와 `0x3` 작업은 플러그인 딕셔너리를 조작할 수 있게 합니다. `0x2`의 경우 해당 주소로 플러그인을 직접 배포해야 한다는 점에 유의하세요. 반면에 `0x1` op-코드는 state_init 필드를 사용하여 배포 프로세스도 처리합니다.

:::tip
If `state_init` doesn't make much sense from its name, take a look at the following references:

- [addresses-in-ton-blockchain](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
- [send-a-deploy-message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
- [internal-message-layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
  :::

#### 종료 코드

| 종료 코드 | 설명                                                                                    |
| ----- | ------------------------------------------------------------------------------------- |
| 0x24  | `valid_until` 확인 실패, 트랜잭션 확인이 너무 늦게 시도됨                                               |
| 0x23  | `Ed25519 서명` 확인 실패                                                                    |
| 0x21  | `seqno` 확인 실패, 응답 보호가 트리거됨                                                            |
| 0x22  | `subwallet-id`가 저장된 것과 일치하지 않음                                                        |
| 0x27  | 플러그인 딕셔너리 조작 실패 (0x1-0x3 recv_external op-코드) |
| 0x50  | 자금 요청에 대한 자금 부족                                                                       |
| 0x0   | 표준 성공 실행 종료 코드                                                                        |

#### Get 메소드

1. int seqno() - 현재 저장된 seqno를 반환
2. int get_public_key() - 현재 저장된 공개키를 반환
3. int get_subwallet_id() - 현재 서브월렛 ID를 반환
4. int is_plugin_installed(int wc, int addr_hash) - 정의된 워크체인 ID와 주소 해시를 가진 플러그인이 설치되어 있는지 확인
5. tuple get_plugin_list() - 플러그인 목록을 반환

### 월렛 V5

It is the most modern wallet version at the moment, developed by the Tonkeeper team, aimed at replacing V4 and allowing arbitrary extensions. <br></br>
<ThemedImage
alt=""
sources={{
light: '/img/docs/wallet-contracts/wallet-contract-V5.png?raw=true',
dark: '/img/docs/wallet-contracts/wallet-contract-V5_dark.png?raw=true',
}}
/> <br></br><br></br><br></br>
The V5 wallet standard offers many benefits that improve the experience for both users and merchants. V5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers. In addition to retaining the previous functionality (V4), the new contract allows you to send up to 255 messages at a time.

월렛 소스 코드:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B 스키마:

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
이전 월렛 버전 명세와 달리, 이 월렛 버전의 인터페이스 구현의 상대적 복잡성으로 인해 [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) 스키마를 사용할 것입니다. 각각에 대한 설명을 제공하겠습니다. 그럼에도 불구하고 기본적인 이해가 여전히 필요하며, 월렛 소스 코드와 함께 사용하면 충분할 것입니다.
:::

#### Official code hash

| Contract version | Hash                                           |
| ---------------- | ---------------------------------------------- |
| walletv5r1       | `IINLe3KxEhR+Gy+0V7hOdNGjDwT3N9T2KmaOlVLSty8=` |

#### 영구 메모리 레이아웃

```
contract_state$_
    is_signature_allowed:(## 1)
    seqno:#
    wallet_id:(## 32)
    public_key:(## 256)
    extensions_dict:(HashmapE 256 int1) = ContractState;
```

보시다시피 `ContractState`는 이전 버전에 비해 큰 변화가 없습니다. 주요 차이점은 서명과 저장된 공개키를 통한 접근을 제한하거나 허용하는 새로운 `is_signature_allowed` 1비트 플래그입니다. 이 변경의 중요성은 이후 주제에서 설명하겠습니다.

#### 인증 프로세스

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Total: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e
    query_id:(## 64)
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```

실제 메시지 페이로드인 `InnerRequest`를 살펴보기 전에, 먼저 버전 5가 인증 프로세스에서 이전 버전과 어떻게 다른지 살펴보겠습니다. `InternalMsgBody` 컴비네이터는 내부 메시지를 통해 월렛 작업에 접근하는 두 가지 방법을 설명합니다. 첫 번째 방법은 버전 4에서 이미 익숙한 것입니다: `extensions_dict`에 저장된 주소를 가진 이전에 등록된 확장으로서의 인증입니다. 두 번째 방법은 외부 요청과 유사하게 저장된 공개키와 서명을 통한 인증입니다.

처음에는 이것이 불필요한 기능처럼 보일 수 있지만, 실제로는 V5의 핵심 기능인 월렛의 확장 인프라의 일부가 아닌 외부 서비스(스마트 컨트랙트)를 통해 요청을 처리할 수 있게 합니다. 가스 없는 트랜잭션은 이 기능에 의존합니다.

단순히 자금을 받는 것은 여전히 옵션입니다. 실제로 인증 프로세스를 통과하지 않는 수신된 내부 메시지는 전송으로 간주됩니다.

#### 작업

우리가 가장 먼저 주목해야 할 것은 이미 인증 프로세스에서 본 `InnerRequest`입니다. 이전 버전과 달리, 서명 모드 변경(즉, `is_signature_allowed` 플래그)을 제외하고는 외부 및 내부 메시지 모두 동일한 기능에 접근할 수 있습니다.

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#}
    prev:^(OutList n)
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// Extended actions in V5:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

`InnerRequest`를 두 개의 작업 목록으로 볼 수 있습니다: 첫 번째 `OutList`는 메시지 모드가 선행되는 메시지 전송 요청을 포함하는 셀 참조의 선택적 체인입니다. 두 번째 `ActionList`는 확장된 작업의 존재를 표시하는 1비트 플래그 `has_other_actions`가 선행되며, 첫 번째 셀에서 시작하여 셀 참조의 체인으로 이어집니다. 우리는 이미 처음 두 개의 확장된 작업 `action_add_ext`와 `action_delete_ext`를 알고 있습니다. 이는 확장 딕셔너리에 추가하거나 삭제하려는 내부 주소가 뒤따릅니다. 세 번째 `action_set_signature_auth_allowed`는 공개키를 통한 인증을 제한하거나 확장을 통해서만 월렛과 상호작용할 수 있는 유일한 방법을 남기도록 하여 공개키를 통한 인증을 제한합니다. 이 기능은 개인 키가 분실되거나 손상된 경우 매우 중요할 수 있습니다.

:::info
작업의 최대 수는 255개입니다. 이는 [c5](/v3/documentation/tvm/tvm-overview#result-of-tvm-execution) TVM 레지스터를 통한 실현의 결과입니다. 기술적으로 빈 `OutAction`과 `ExtendedAction`으로 요청을 할 수 있지만, 그 경우 단순히 자금을 받는 것과 유사할 것입니다.
:::

#### 종료 코드

| 종료 코드 | 설명                                                                |
| ----- | ----------------------------------------------------------------- |
| 0x84  | 서명이 비활성화되어 있는 동안 서명을 통한 인증 시도                                     |
| 0x85  | `seqno` 확인 실패, 응답 보호 발생                                           |
| 0x86  | `wallet-id`가 저장된 것과 일치하지 않음                                       |
| 0x87  | `Ed25519 서명` 확인 실패                                                |
| 0x88  | `valid-until` 확인 실패                                               |
| 0x89  | 외부 메시지에 대해 `send_mode`가 +2 비트(오류 무시)를 설정하도록 강제 |
| 0x8A  | `external-signed` 접두사가 수신된 것과 일치하지 않음                             |
| 0x8B  | 확장 추가 작업이 성공하지 못함                                                 |
| 0x8C  | 확장 제거 작업이 성공하지 못함                                                 |
| 0x8D  | 지원되지 않는 확장 메시지 접두사                                                |
| 0x8E  | 확장 딕셔너리가 비어 있는 동안 서명으로 인증을 비활성화하려고 시도                             |
| 0x8F  | 이미 설정된 상태로 서명을 설정하려고 시도                                           |
| 0x90  | 서명이 비활성화되어 있을 때 마지막 확장을 제거하려고 시도                                  |
| 0x91  | 확장이 잘못된 워크체인을 가짐                                                  |
| 0x92  | 외부 메시지를 통해 서명 모드를 변경하려고 시도                                        |
| 0x93  | 잘못된 `c5`, `action_send_msg` 검증 실패                                 |
| 0x0   | 표준 성공 실행 종료 코드                                                    |

:::danger
`0x8E`, `0x90`, `0x92` 월렛 종료 코드는 월렛 기능에 대한 접근 권한을 잃는 것을 방지하도록 설계되었습니다. 그럼에도 불구하고 월렛이 저장된 확장 주소가 실제로 TON에 존재하는지 확인하지 않는다는 점을 기억해야 합니다. 빈 확장 딕셔너리와 제한된 서명 모드로 구성된 초기 데이터로 월렛을 배포할 수도 있습니다. 이 경우 첫 번째 확장을 추가할 때까지 공개키를 통해 월렛에 접근할 수 있습니다. 따라서 이러한 시나리오에서는 주의해야 합니다.
:::

#### Get 메소드

1. int is_signature_allowed() - 저장된 `is_signature_allowed` 플래그를 반환
2. int seqno() - 현재 저장된 seqno를 반환
3. int get_subwallet_id() - 현재 서브월렛 ID를 반환
4. int get_public_key() - 현재 저장된 공개키를 반환
5. cell get_extensions() - 확장 딕셔너리를 반환

#### Preparing for gasless transactions

As was said, before v5, the wallet smart contract allowed the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself. The common scheme looks like this:

![image](/img/gasless.jpg)

:::tip
결과적으로 [Tonkeeper의 Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)와 같은 서비스가 이 기능을 제공할 것입니다: 사용자를 대신하여 TON으로 트랜잭션 수수료를 지불하지만 토큰으로 수수료를 청구합니다.
:::

#### 플로우

1. USDt를 보낼 때 사용자는 두 개의 발신 USDt 전송이 포함된 하나의 메시지에 서명합니다:
  1. 수신자 주소로의 USDt 전송
  2. 서비스를 위한 소량의 USDt 전송
2. 이 서명된 메시지는 HTTPS를 통해 오프체인으로 서비스 백엔드로 전송됩니다. 서비스 백엔드는 이를 TON 블록체인으로 전송하며, 네트워크 수수료를 Toncoins로 지불합니다.

가스 없는 백엔드 API의 베타 버전은 [tonapi.io/api-v2](https://tonapi.io/api-v2)에서 사용할 수 있습니다. 월렛 앱을 개발 중이고 이러한 메소드에 대한 피드백이 있다면 [@tonapitech](https://t.me/tonapitech) 채팅에서 공유해주세요.

월렛 소스 코드:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## 특수 월렛

때로는 기본 월렛의 기능만으로는 충분하지 않습니다. 그래서 `high-load`, `lockup`, `restricted` 등 여러 유형의 특수 월렛이 있습니다.

이들을 살펴보겠습니다.

### Highload wallets

짧은 시간 동안 많은 메시지를 처리해야 할 때는 Highload Wallet이라는 특수한 월렛이 필요합니다. 자세한 내용은 [이 글](/v3/documentation/smart-contracts/contracts-specs/highload-wallet)을 참조하세요.

### Lockup wallet

If you, for some reason, need to lock coins in a wallet for some time without the possibility to withdraw them before that time passes, have a look at the lockup wallet.

이를 통해 월렛에서 코인을 인출할 수 없는 시간을 설정할 수 있습니다. 잠금 해제 기간을 설정하여 해당 기간 동안 일부 코인을 사용할 수 있도록 사용자 정의할 수도 있습니다.

예: 총 베스팅 기간이 10년인 100만 코인을 보유하는 월렛을 만들 수 있습니다. 클리프 기간을 1년으로 설정하면 월렛이 생성된 후 첫 해 동안은 자금이 잠깁니다. 그런 다음 잠금 해제 기간을 1개월로 설정하면 매월 `1'000'000 TON / 120개월 = ~8333 TON`이 잠금 해제됩니다.

월렛 소스 코드:

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Restricted wallet

이 월렛의 기능은 일반 월렛처럼 작동하지만 미리 정의된 하나의 목적지 주소로만 전송을 제한하는 것입니다. 이 월렛을 만들 때 목적지를 설정할 수 있으며, 그 후에는 해당 주소로만 자금을 전송할 수 있습니다. 하지만 검증 컨트랙트로 자금을 전송할 수 있으므로 이 월렛으로 검증자를 실행할 수 있습니다.

월렛 소스 코드:

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## 결론

보시다시피 TON에는 많은 다른 버전의 월렛이 있습니다. 하지만 대부분의 경우 `V3R2` 또는 `V4R2`만 있으면 됩니다. 주기적인 자금 잠금 해제와 같은 추가 기능이 필요한 경우 특수 월렛 중 하나를 사용할 수도 있습니다.

## See also

- [월렛 스마트 컨트랙트 작업하기](/v3/guidelines/smart-contracts/howto/wallet)
- [기본 월렛 소스](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [버전에 대한 더 자세한 기술적 설명](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
- [월렛 V4 소스와 자세한 설명](https://github.com/ton-blockchain/wallet-contract)
- [Lockup 월렛 소스와 자세한 설명](https://github.com/ton-blockchain/lockup-wallet-contract)
- [Restricted 월렛 소스](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
- [TON의 가스 없는 트랜잭션](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)

<Feedback />

