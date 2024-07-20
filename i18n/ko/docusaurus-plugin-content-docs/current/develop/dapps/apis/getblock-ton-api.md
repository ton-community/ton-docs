# GetBlock의 TON API

이 가이드는 GetBlock을 통해 개인 RPC 엔드포인트를 획득하고 사용하는 필수 단계를 다루며, 이를 통해 TON 블록체인에 접근할 수 있습니다.

:::info
[GetBlock](https://getblock.io/)은 HTTP 기반 API 엔드포인트를 제공하여 클라이언트가 TON을 포함한 다양한 블록체인 네트워크와 상호작용할 수 있도록 하는 Web3 인프라 제공업체입니다.
:::

## TON 블록체인 엔드포인트 액세스 방법

GetBlock의 엔드포인트를 사용하려면, 사용자 계정에 로그인하여 TON 엔드포인트 URL을 받아야 합니다. 자세한 단계는 아래를 참고하세요.

### 1. GetBlock 계정 생성

GetBlock [웹사이트](https://getblock.io/?utm_source=external\&utm_medium=article\&utm_campaign=ton_docs)를 방문하여 메인 페이지의 "Get Started for Free" 버튼을 찾습니다. 이메일 주소를 사용하거나 MetaMask 지갑을 연결하여 계정에 가입합니다.

![GetBlock.io\_main\_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. TON 블록체인을 선택

로그인 후, 대시보드로 이동됩니다. "My Endpoints" 섹션을 찾은 후 "Protocols" 드롭다운 메뉴에서 "TON"을 선택합니다.

원하는 네트워크와 API 타입(JSON-RPC 또는 JSON-RPC(v2))을 선택합니다.

![GetBlock\_계정\_\_대시보드](/img/docs/getblock-img/unnamed-4.png)

### 3. 엔드포인트 URL 생성

"Get" 버튼을 클릭하여 TON 블록체인 엔드포인트 URL을 생성합니다.

GetBlock API의 모든 엔드포인트는 `https://go.getblock.io/[ACCESS TOKEN]/`과 같은 일관된 구조를 따릅니다.

이 접근 토큰은 각 사용자 또는 애플리케이션에 대한 고유 식별자로 작동하며, 요청을 적절한 엔드포인트로 라우팅하는 데 필요한 정보를 포함하고 있어 민감한 세부 정보를 노출하지 않습니다. 이는 별도의 승인 헤더나 API 키가 필요 없게 합니다.

사용자는 여러 엔드포인트를 생성하고, 토큰이 유출된 경우 교체하거나, 사용하지 않는 엔드포인트를 삭제할 수 있는 유연성을 갖추고 있습니다.

![GetBlock\_계정\_끝점](/img/docs/getblock-img/unnamed-3.png)

이제 이러한 URL을 사용하여 TON 블록체인과 상호작용하고, 데이터를 조회하고, 트랜잭션을 전송하며, 인프라 설정 및 유지 관리의 번거로움 없이 분산 애플리케이션을 구축할 수 있습니다.

### 무료 요청 및 사용자 제한

모든 등록된 GetBlock 사용자는 40,000회의 무료 요청을 받을 수 있으며, 이는 초당 60회의 요청(RPS)으로 제한됩니다. 요청 잔액은 매일 갱신되며, 지원되는 블록체인의 모든 공유 엔드포인트에서 사용할 수 있습니다.

향상된 기능과 성능을 원할 경우, 유료 옵션을 탐색할 수 있으며, 이는 아래에 설명되어 있습니다.

GetBlock.io는 두 가지 유형의 요금제를 제공합니다: 공유 노드와 전용 노드. 클라이언트는 자신의 요구와 예산에 따라 요금제를 선택할 수 있습니다.

### 공유 노드

- 여러 클라이언트가 동시에 동일한 노드를 사용하는 초기 진입 기회;
- 초당 요청 수(RPS)가 200으로 증가;
- 개인 사용 또는 완전한 생산 애플리케이션에 비해 낮은 거래량과 자원 요구 사항을 가진 애플리케이션에 적합;
- 제한된 예산을 가진 개인 개발자나 소규모 팀에게 더 경제적인 옵션.

공유 노드는 상당한 초기 투자나 약정 없이 TON 블록체인 인프라에 접근할 수 있는 비용 효율적인 솔루션을 제공합니다.

개발자가 애플리케이션을 확장하고 추가 자원을 필요로 할 경우, 구독 요금제를 쉽게 업그레이드하거나 필요에 따라 전용 노드로 전환할 수 있습니다.

### 전용 노드

- 하나의 노드가 단독으로 한 클라이언트에게만 할당;
  요청 제한 없음;
- 아카이브 노드, 다양한 서버 위치 및 사용자 지정 설정에 대한 접근 허용;
- 프리미엄 수준의 서비스와 지원 보장;

이는 높은 처리량, 빠른 노드 연결 속도, 확장 시 보장된 자원을 필요로 하는 개발자 및 분산 애플리케이션(dApps)을 위한 차세대 솔루션입니다.

## GetBlock의 TON HTTP API 사용 방법

이 섹션에서는 GetBlock이 제공하는 TON HTTP API의 실용적인 사용법을 다룹니다. 생성된 엔드포인트를 효과적으로 사용하는 방법을 예시를 통해 살펴보겠습니다.

### 일반적인 API 호출의 예

먼저, curl 명령어를 사용하여 특정 주소의 잔액을 조회하는 ‘/getAddressBalance’ 메서드를 간단히 예로 들어보겠습니다.

```
curl --location --request GET 'https://go.getblock.io/<ACCESS-TOKEN>/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \

--header 'Content-Type: application/json'
```

`ACCESS-TOKEN`을 GetBlock에서 제공한 실제 액세스 토큰으로 교체하세요.

이 명령어는 해당 주소의 잔액을 나노톤(nanotons) 단위로 출력합니다.

![겟어드레스밸런스\_응답\_온\_TON\_블록체인](/img/docs/getblock-img/unnamed-2.png)

TON 블록체인을 쿼리할 수 있는 다른 방법도 있습니다:

| # | 메서드  | 엔드포인트              | 설명                                                                            |
| - | ---- | ------------------ | ----------------------------------------------------------------------------- |
| 1 | GET  | getAddressState    | 지정된 주소의 현재 상태(초기화되지 않음, 활성, 또는 동결)를 반환합니다. |
| 2 | GET  | getMasterchainInfo | 마스터체인의 상태에 대한 정보를 가져옵니다.                                      |
| 3 | GET  | getTokenData       | 지정된 TON 계정과 관련된 NFT 또는 Jetton의 세부 정보를 검색합니다.                  |
| 4 | GET  | packAddress        | TON 주소를 원시 형식에서 사람이 읽을 수 있는 형식으로 변환합니다.                       |
| 5 | POST | sendBoc            | 직렬화된 BOC 파일과 외부 메시지를 블록체인에 전송하여 실행합니다.                        |

GetBlock의 [문서](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/)를 참조하여 추가 메서드 목록과 예제 및 종합적인 API 참조를 확인하세요.

### 스마트 컨트랙트 배포

개발자는 동일한 엔드포인트 URL을 사용하여 TON 블록체인에 컨트랙트를 원활하게 배포할 수 있습니다.

라이브러리는 GetBlock HTTP API 엔드포인트를 통해 네트워크에 연결하기 위해 클라이언트를 초기화합니다.

![TON 블루프린트 IDE 이미지](/img/docs/getblock-img/unnamed-6.png)

이 튜토리얼은 GetBlock의 API를 사용하여 TON 블록체인을 효과적으로 활용하려는 개발자에게 종합적인 가이드를 제공할 것입니다.

웹사이트](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs)에서 자세한 내용을 확인하거나 라이브 채팅, [텔레그램](https://t.me/GetBlock_Support_Bot) 또는 웹사이트 양식을 통해 겟블록의 지원팀에 문의해 주세요.
