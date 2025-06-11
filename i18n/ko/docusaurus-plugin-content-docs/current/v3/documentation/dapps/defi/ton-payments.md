import Feedback from '@site/src/components/Feedback';

# TON 결제

TON 결제는 소액 결제 채널 플랫폼입니다.

모든 거래를 블록체인에 커밋하지 않고도 즉시 결제가 가능하며, 관련 거래 수수료(예: 소비된 가스)를 지불하거나 해당 거래가 포함된 블록이 확인될 때까지 5초를 기다릴 필요가 없습니다.

즉시 결제의 전체 비용이 매우 적기 때문에 게임, API, 오프체인 앱의 소액 결제에 사용될 수 있습니다. [예시 보기](/v3/documentation/dapps/defi/ton-payments#examples).

- [TON의 결제](https://blog.ton.org/ton-payments)

## 결제 채널

### 스마트 컨트랙트

- [ton-blockchain/payment-channels](https://github.com/ton-blockchain/payment-channels)

### SDK

결제 채널을 사용하기 위해 깊은 암호화 지식이 필요하지 않습니다.

준비된 SDK를 사용할 수 있습니다:

- [toncenter/tonweb](https://github.com/toncenter/tonweb) JavaScript SDK
- [toncenter/payment-channels-example](https://github.com/toncenter/payment-channels-example) - tonweb으로 결제 채널 사용하는 방법

### Examples

[Hack-a-TON #1](https://ton.org/hack-a-ton-1) 수상작에서 결제 채널 사용 예시를 확인하세요:

- [grejwood/Hack-a-TON](https://github.com/Grejwood/Hack-a-TON) - OnlyTONs 결제 프로젝트 ([웹사이트](https://main.d3puvu1kvbh8ti.amplifyapp.com/), [영상](https://www.youtube.com/watch?v=38JpX1vRNTk))
- [nns2009/Hack-a-TON-1_Tonario](https://github.com/nns2009/Hack-a-TON-1_Tonario) - OnlyGrams 결제 프로젝트 ([웹사이트](https://onlygrams.io/), [영상](https://www.youtube.com/watch?v=gm5-FPWn1XM))
- [sevenzing/hack-a-ton](https://github.com/sevenzing/hack-a-ton) - TON에서 요청당 결제 API 사용 ([영상](https://www.youtube.com/watch?v=7lAnbyJdpOA&feature=youtu.be))
- [illright/diamonds](https://github.com/illright/diamonds) - 분당 결제 학습 플랫폼 ([웹사이트](https://diamonds-ton.vercel.app/), [영상](https://www.youtube.com/watch?v=g9wmdOjAv1s))

## See also

- [Payments processing](/v3/guidelines/dapps/asset-processing/payments-processing)
- [TON Connect](/v3/guidelines/ton-connect/overview)

<Feedback />

