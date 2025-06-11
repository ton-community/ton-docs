import Feedback from '@site/src/components/Feedback';

# 외부 메시지

외부 메시지는 TON 블록체인에 존재하는 스마트 컨트랙트가 특정 작업을 수행하도록 하기 위해 `외부에서 전송되는` 메시지입니다.

예를 들어, 지갑 스마트 컨트랙트는 지갑 소유자가 서명한 주문(예: 지갑 스마트 컨트랙트에서 보낼 내부 메시지)이 포함된 외부 메시지를 수신하기를 기대합니다. 이러한 외부 메시지가 지갑 스마트 컨트랙트에 수신되면 먼저 서명을 확인하고, 메시지를 수락한 다음(TVM 프리미티브 `ACCEPT` 실행), 필요한 작업을 수행합니다.

## Replay protection

:::caution
Stay vigilant and check replay protection in contracts for external-in messages.
:::

Notice that all external messages must be protected against replay attacks. The validators normally remove an external message from the pool of suggested external messages (received from the network); however, in some situations another validator could process the same external message twice (thus creating a second transaction for the same external message, leading to the duplication of the original action). Even worse, a `malicious actor could extract` the external message from the block containing the processing transaction and re-send it later. This could force a wallet smart contract to repeat a payment.

The simplest way to protect smart contracts from replay attacks related to external messages is to store a 32-bit counter `cur-seqno` in the persistent data of the smart contract, and to expect a `req-seqno` value in (the signed part of) any inbound external messages. Then an external message is accepted only if both the signature is valid and `req-seqno` equals `cur-seqno`. After successful processing, the `cur-seqno` value in the persistent data is increased by one, so the same external message will never be accepted again.

And one could also include an `expire-at` field in the external message, and accept an external message only if the current Unix time is less than the value of this field. This approach can be used in conjunction with `seqno`; alternatively, the receiving smart contract could store the set of (the hashes of) all recent (not expired) accepted external messages in its persistent data, and reject a new external message if it is a duplicate of one of the stored messages. Some garbage collection of expired messages in this set should also be performed to avoid bloating the persistent data.

:::note
In general, an external message begins with a 256-bit signature (if needed), a 32-bit `req-seqno` (if needed), a 32-bit `expire-at` (if needed), and possibly a 32-bit `op` and other required parameters depending on `op`. The layout of external messages does not need to be as standardized as that of internal messages because external messages are not used for interaction between different smart contracts (written by different developers and managed by different owners).\\
:::

<Feedback />

