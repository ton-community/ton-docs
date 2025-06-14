import Feedback from '@site/src/components/Feedback';

# Things to focus on while working with TON Blockchain

이 글에서는 TON 애플리케이션을 개발하려는 사람들이 고려해야 할 요소에 대해 검토하고 논의합니다.

## 체크리스트

### 1. 이름 충돌

함수 변수와 함수에는 거의 모든 정상적인 문자를 포함할 수 있습니다. I.e. 즉, 쉼표를 포함한 `var++`, `~bits`, `foo-bar+baz`는 유효한 변수 및 함수 이름입니다.

Func 코드를 작성하고 검사할 때는 Linter를 사용해야 합니다.

- [IDE 플러그인](/v3/documentation/smart-contacts/getting-started/ide-plugins/)

### 2. 던지기 값 확인

TVM 실행이 정상적으로 중지될 때마다 종료 코드 `0` 또는 `1`로 중지됩니다. 자동으로 수행되지만 `throw(0)` 또는 `throw(1)` 명령으로 종료 코드 `0`과 `1`을 직접 던지면 예기치 않은 방식으로 TVM 실행이 직접 중단될 수 있습니다.

- [오류 처리 방법](/v3/documentation/smart-contacts/func/docs/builtins#throwing-exceptions)
- [TVM 종료 코드](/v3/documentation/tvm/tvm-exit-codes)

### 3. 함수는 데이터 구조가 저장해야 할 내용을 정확히 저장하는 엄격한 타입의 언어입니다.

코드가 무엇을 하고 무엇을 반환할 수 있는지 추적하는 것이 중요합니다. 컴파일러는 코드의 초기 상태에만 신경을 쓴다는 점을 명심하세요. 특정 연산 후에는 일부 변수의 저장된 값이 변경될 수 있습니다.

예상치 못한 변수 값을 읽거나 해당 메서드가 없어야 하는 데이터 유형에서 메서드를 호출하는 경우(또는 반환 값이 제대로 저장되지 않은 경우)는 오류이며 '경고' 또는 '알림'으로 건너뛰지 않지만 연결할 수 없는 코드로 이어집니다. 예기치 않은 값을 저장하는 것은 괜찮을 수 있지만, 이를 읽는 것은 문제를 일으킬 수 있습니다(예: 정수 변수에 대해 오류 코드 5(예상 범위를 벗어난 정수)가 발생할 수 있음).

### 4. 메시지에는 모드가 있습니다.

메시지 모드, 특히 이전에 보낸 메시지 및 요금과의 상호 작용을 확인하는 것이 중요합니다. 저장 수수료를 고려하지 않은 경우, 계약의 TON이 부족하여 발신 메시지를 보낼 때 예기치 않은 실패가 발생할 수 있습니다. 메시지 모드는 [여기]에서 확인할 수 있습니다(/v3/documentation/smart-contracts/message-management/sending-messages#message-modes).

### 5. Replay protection {#replay-protection}

There are two custom solutions for wallets (smart contracts that store user funds): `seqno-based` (using a counter to prevent processing the same message twice) and `high-load` (storing processed identifiers and their expiration times).

- [Seqno 기반 지갑](/v3/guidelines/dapps/자산 처리/결제 처리/#seqno-based-wallets)
- [고부하 지갑](/v3/guidelines/dapps/자산 처리/결제 처리/#고부하-지갑)

For `seqno`, refer to [this section](/v3/documentation/smart-contracts/message-management/sending-messages#mode3) for details on possible replay scenarios.

### 6. TON fully implements the actor model

이는 컨트랙트의 코드를 변경할 수 있음을 의미합니다. `SETCODE`](/v3/documentation/smart-contracts/func/docs/stdlib#set_code) TVM 지시어를 사용하여 영구적으로 변경하거나 런타임에 실행이 끝날 때까지 TVM 코드 레지스트리를 새 셀 값으로 설정하여 변경할 수 있습니다.

### 7. TON Blockchain has several transaction phases: computational phase, actions phase, and a bounce phase among them

계산 단계에서는 스마트 콘트랙트의 코드를 실행한 다음 작업(메시지 전송, 코드 수정, 라이브러리 변경 등)이 수행됩니다. 따라서 이더리움 기반 블록체인과 달리, 전송된 메시지가 실패할 것으로 예상되는 경우 계산 단계가 아니라 나중에 실행 단계에서 수행되므로 계산 단계 종료 코드가 표시되지 않습니다.

- [트랜잭션 및 단계](/v3/documentation/tvm/tvm-overview#트랜잭션 및 단계)

### 8. TON contracts are autonomous

블록체인의 컨트랙트는 다른 검증자 집합에 의해 처리되는 별도의 샤드에 존재할 수 있으므로 개발자는 필요에 따라 다른 컨트랙트에서 데이터를 가져올 수 없습니다. 따라서 모든 통신은 비동기식이며 메시지를 전송하는 방식으로 이루어집니다.

- [스마트 컨트랙트에서 메시지 보내기](/v3/documentation/smart-contract/message-management/sending-messages)
- [디앱에서 메시지 보내기](/v3/guidelines/ton-connect/guidelines/sending-messages)

### 9. Unlike other blockchains, TON does not contain revert messages, only exit codes

TON 스마트 컨트랙트 프로그래밍을 시작하기 전에 코드 흐름에 대한 종료 코드 로드맵을 생각해보고 문서화해두는 것이 도움이 됩니다.

### 10. Func functions that have method_id identifiers have method IDs

명시적으로 `"method_id(5)"`를 설정하거나 함수 컴파일러에 의해 암시적으로 설정할 수 있습니다. 이 경우 .fift 어셈블리 파일의 메소드 선언에서 찾을 수 있습니다. 이 중 두 개는 미리 정의되어 있는데, 하나는 블록체인 `(0)` 내부에서 메시지를 수신하기 위한 것으로 일반적으로 `recv_internal`, 다른 하나는 외부 `(-1)`에서 메시지를 수신하기 위한 것으로 `recv_external`입니다.

### 11. TON crypto address may not have any coins or code

TON 블록체인의 스마트 컨트랙트 주소는 결정론적이며 미리 계산될 수 있습니다. 주소와 연결된 톤 계정은 코드가 없어 초기화되지 않거나(배포되지 않은 경우), 특수 플래그가 포함된 메시지가 전송된 경우 더 이상 저장소나 톤 코인이 없는 상태에서 동결될 수도 있습니다.

### 12. TON addresses may have three representations

TON 주소는 세 가지 표현이 있을 수 있습니다.
전체 표현은 "원시"(`workchain:address`)이거나 "사용자 친화적"일 수 있습니다. 마지막 표현은 사용자가 가장 자주 접하는 표현입니다. 여기에는 주소가 '바운스 가능' 또는 '바운스 불가능'인지를 나타내는 태그 바이트와 워크체인 ID 바이트가 포함됩니다. 이 정보에 주목해야 합니다.

- [Raw and user-friendly addresses](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses)

### 13. Keep track of the flaws in code execution

메서드 가시성을 설정할 수 있는 솔리디티와 달리 함수형의 경우 오류를 표시하거나 `if` 문을 통해 가시성이 더 복잡한 방식으로 제한됩니다.

### 14. Keep an eye on gas before sending bounced messages

스마트 컨트랙트가 사용자가 제공한 값으로 반송된 메시지를 보내는 경우, 해당 가스 요금이 반환된 금액에서 차감되어 빠져나가지 않도록 해야 합니다.

### 15. Monitor the callbacks and their failures

TON 블록체인은 비동기식입니다. 즉, 메시지가 연속적으로 도착할 필요가 없습니다. 예를 들어 작업의 실패 알림이 도착하면 제대로 처리해야 합니다.

### 16. Check if the bounced flag was sent receiving internal messages

반송된 메시지(오류 알림)를 받을 수 있으며, 이를 처리해야 합니다.

- [Handling of standard response messages](/v3/documentation/smart-contracts/message-management/internal-messages#handling-of-standard-response-messages)

## 참조

- [Original article](https://0xguard.com/things_to_focus_on_while_working_with_ton_blockchain) - _0xguard_

<Feedback />

