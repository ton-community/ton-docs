import Feedback from '@site/src/components/Feedback';

# Highload wallet contracts

When working with many messages in a short period, there is a need for special wallet called Highload wallet. Highload wallet v2 was the main wallet on TON for a long time, but you had to be very careful with it. Otherwise, you could [lock all funds](https://t.me/tonstatus/88).

[하이로드 월렛 V3의 출시](https://github.com/ton-blockchain/Highload-wallet-contract-v3)로 이 문제는 컨트랙트 아키텍처 수준에서 해결되었으며 가스도 덜 소비합니다. 이 장에서는 하이로드 월렛 V3의 기본 사항과 기억해야 할 중요한 뉘앙스를 다룰 것입니다.

## Highload wallet v3

이 월렛은 매우 높은 속도로 트랜잭션을 보내야 하는 사람들을 위해 만들어졌습니다. 예를 들어, 암호화폐 거래소입니다.

- [소스 코드](https://github.com/ton-blockchain/Highload-wallet-contract-v3)

하이로드 v3에 대한 모든 외부 메시지(전송 요청)는 다음을 포함합니다:

- 최상위 셀의 서명(512비트) - 다른 매개변수들은 해당 셀의 ref에 있음
- 서브월렛 ID(32비트)
- ref로 보낼 메시지(전송될 직렬화된 내부 메시지)
- 메시지의 전송 모드(8비트)
- 복합 쿼리 ID - "shift"의 13비트와 "bit number"의 10비트, 그러나 bit number의 10비트는 1023이 아닌 1022까지만 가능하며, 마지막 사용 가능한 쿼리 ID(8388605)는 비상용으로 예약되어 있어 일반적으로 사용해서는 안 됨
- 생성 시점 또는 메시지 타임스탬프
- 타임아웃

타임아웃은 하이로드에 매개변수로 저장되며 모든 요청의 타임아웃과 대조 확인됩니다 - 따라서 모든 요청의 타임아웃은 동일합니다. 메시지는 하이로드 월렛에 도착할 때 타임아웃보다 오래되지 않아야 하며, 코드에서는 `created_at > now() - timeout`이 요구됩니다. 쿼리 ID는 재생 보호를 위해 최소 타임아웃에서 최대 2 \* 타임아웃까지 저장되지만, 타임아웃보다 오래 저장될 것으로 기대해서는 안 됩니다. 서브월렛 ID는 월렛에 저장된 것과 대조 확인됩니다. 내부 ref의 해시는 월렛의 공개 키와 함께 서명과 대조 확인됩니다.

하이로드 v3는 주어진 외부 메시지에서 1개의 메시지만 보낼 수 있지만, 특별한 op 코드로 자신에게 그 메시지를 보낼 수 있어 내부 메시지 호출에 대한 작업 셀을 설정할 수 있으므로, 실제로 1개의 외부 메시지당 최대 254개의 메시지를 보낼 수 있습니다(이 254개 중에서 다시 하이로드 월렛에 메시지가 전송되면 더 많이 보낼 수 있음).

하이로드 v3는 모든 검사가 통과되면 항상 쿼리 ID(재생 보호)를 저장하지만, 다음을 포함한 일부 조건으로 인해 메시지가 전송되지 않을 수 있습니다:

- **state init 포함** (필요한 경우 이러한 메시지는 하이로드 월렛이 자신에게 보내는 내부 메시지 후 작업 셀을 설정하는 특별한 op 코드를 사용하여 전송될 수 있음)
- not enough balance
- 잘못된 메시지 구조(외부 출력 메시지 포함 - 외부 메시지에서 직접 전송될 수 있는 것은 내부 메시지뿐임)

하이로드 v3는 동일한 `query_id`와 `created_at`을 포함하는 여러 외부 메시지를 절대 실행하지 않습니다 - 주어진 `query_id`를 잊을 때쯤이면 `created_at` 조건이 그러한 메시지의 실행을 막을 것입니다. 이는 효과적으로 `query_id`와 `created_at`을 함께 하이로드 v3의 전송 요청의 "기본 키"로 만듭니다.

쿼리 ID를 반복(증가)할 때는, 일반 숫자를 증가시킬 때처럼 먼저 비트 번호를 반복한 다음 shift를 하는 것이 (수수료로 지출되는 TON 측면에서) 더 저렴합니다. 마지막 쿼리 ID에 도달한 후(비상 쿼리 ID에 대해 기억하세요 - 위 참조)에는 쿼리 ID를 0으로 재설정할 수 있지만, 하이로드의 타임아웃 기간이 아직 지나지 않았다면 재생 보호 사전이 가득 차서 타임아웃 기간이 지날 때까지 기다려야 합니다.

## 하이로드 월렛 v2

:::danger
Legacy contract, it is suggest to use Highload wallet v3.
:::

이 월렛은 짧은 시간 동안 수백 개의 트랜잭션을 보내야 하는 사람들을 위해 만들어졌습니다. 예를 들어, 암호화폐 거래소입니다.

하나의 스마트 컨트랙트 호출에서 최대 `254`개의 트랜잭션을 보낼 수 있습니다. 또한 seqno 대신 재생 공격을 해결하기 위해 약간 다른 접근 방식을 사용하므로, 이 월렛을 한 번에 여러 번 호출하여 초당 수천 개의 트랜잭션을 보낼 수도 있습니다.

:::caution 제한사항
하이로드 월렛을 다룰 때는 다음 제한사항을 확인하고 고려해야 합니다.
:::

1. **저장소 크기 제한.** 현재 컨트랙트 저장소의 크기는 65535 셀 미만이어야 합니다. old_queries의 크기가 이 제한을 초과하면 ActionPhase에서 예외가 발생하고 트랜잭션이 실패합니다.
  실패한 트랜잭션은 재생될 수 있습니다.
2. **가스 제한.** 현재 가스 제한은 1,000,000 GAS 단위이므로, 한 트랜잭션에서 정리할 수 있는 old queries의 수에 제한이 있습니다. 만료된 쿼리의 수가 이보다 높으면 컨트랙트가 중단됩니다.

That means that it is not recommended to set too high expiration date:
the number of queries during expiration time span should not exceed 1000.

Also, the number of expired queries cleaned in one transaction should be below 100.

## How to

[하이로드 월렛 튜토리얼](/v3/guidelines/smart-contracts/howto/wallet#-high-load-wallet-v3) 문서도 읽어보실 수 있습니다.

월렛 소스 코드:

- [ton/crypto/smartcont/Highload-wallet-v2-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-highload-wallet-v2.fif)

<Feedback />

