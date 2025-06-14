import Feedback from '@site/src/components/Feedback';

# Content subscriptions

TON 블록체인의 거래가 빠르고 네트워크 수수료가 낮기 때문에 스마트 컨트랙트를 통해 온체인에서 정기 결제를 처리할 수 있습니다.

예를 들어 사용자는 디지털 콘텐츠(또는 기타)를 구독하고 월 1 TON의 요금을 지불할 수 있습니다.

:::tip
이 내용은 v4 버전 지갑에 해당합니다. 이전 지갑에는 이 기능이 없으며, 향후 버전에서도 변경될 수 있습니다.
:::

:::warning
Subscription contract requires authorization exactly once, on installation; then it can withdraw TON as it pleases. Do your own research before attaching unknown subscriptions.

반면, 사용자는 자신의 지식 없이는 구독을 설치할 수 없습니다.
:::

## 예시 흐름

- 사용자는 v4 지갑을 사용합니다. 이는 플러그인이라고 하는 추가 스마트 컨트랙트를 통해 기능을 확장할 수 있습니다.

   기능을 확인한 후, 사용자는 지갑에 대해 신뢰할 수 있는 스마트 컨트랙트(플러그인)의 주소를 승인할 수 있습니다. 이후 신뢰할 수 있는 스마트 컨트랙트는 지갑에서 톤코인을 인출할 수 있습니다. 이는 다른 블록체인의 "무한 승인"과 유사합니다.

- 각 사용자와 서비스 사이에는 지갑 플러그인으로 중간 구독 스마트 컨트랙트가 사용됩니다.

   이 스마트 컨트랙트는 지정된 기간 내에 한 번만 사용자의 지갑에서 지정된 톤코인 금액이 인출되도록 보장합니다.

- 서비스의 백엔드는 구독 스마트 컨트랙트에 외부 메시지를 보내 정기적으로 결제를 시작합니다.

- 사용자나 서비스 모두 더 이상 구독이 필요하지 않다고 판단하여 종료할 수 있습니다.

## 스마트 컨트랙트 예시

- [지갑 v4 스마트 컨트랙트 소스 코드](https://github.com/ton-blockchain/wallet-contract/blob/main/func/wallet-v4-code.fc)
- [구독 스마트 컨트랙트 소스 코드](https://github.com/ton-blockchain/wallet-contract/blob/main/func/simple-subscription-plugin.fc)

## 구현

A good example of implementation is decentralized subscriptions for Toncoin to private channels in Telegram by the [@donate](https://t.me/donate) bot and the [Tonkeeper wallet](https://tonkeeper.com). <Feedback />

