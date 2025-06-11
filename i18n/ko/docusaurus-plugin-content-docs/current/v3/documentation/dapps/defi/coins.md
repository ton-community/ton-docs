import Feedback from '@site/src/components/Feedback';

# 네이티브 토큰: 톤코인

TON 블록체인의 네이티브 암호화폐는 **톤코인**입니다.

거래 수수료, 가스 비용(스마트 컨트랙트 메시지 처리 수수료), 영구 저장소 비용은 톤코인으로 지불됩니다.

톤코인은 블록체인 검증자가 되기 위한 예치금으로 사용됩니다.

톤코인 결제 과정은 [해당 섹션](/v3/guidelines/dapps/asset-processing/payments-processing)에서 설명합니다.

톤코인 구매 또는 교환 장소는 [웹사이트](https://ton.org/coin)에서 확인할 수 있습니다.

## 추가 통화

TON 블록체인은 최대 2^32개의 내장 추가 통화를 지원합니다.

추가 통화 잔액은 각 블록체인 계정에 저장되고 다른 계정으로 네이티브하게 전송될 수 있습니다(한 스마트 컨트랙트에서 다른 스마트 컨트랙트로 보내는 내부 메시지에서 톤코인 금액과 함께 추가 통화 금액의 해시맵을 지정할 수 있음).

TLB: `extra_currencies$_ dict:(HashmapE 32 (VarUInteger 32)) = ExtraCurrencyCollection;` - 통화 ID와 금액의 해시맵.

하지만 추가 통화는 저장 및 전송(톤코인처럼)만 가능하며 자체적인 임의 코드나 기능은 없습니다.

많은 수의 추가 통화가 생성되면 저장 공간이 필요하므로 계정이 "팽창"할 수 있습니다.

따라서 추가 통화는 잘 알려진 탈중앙화 통화(예: Wrapped Bitcoin 또는 Ether)에 가장 적합하며, 이러한 추가 통화 생성은 상당히 비용이 많이 들어야 합니다.

다른 작업에는 [제톤](/v3/documentation/dapps/defi/tokens#jettons-fungible-tokens)이 적합합니다.

현재 TON 블록체인에는 추가 통화가 생성되지 않았습니다. TON 블록체인은 계정과 메시지에서 추가 통화를 완벽히 지원하지만, 생성을 위한 민터 시스템 컨트랙트는 아직 만들어지지 않았습니다.

<Feedback />

