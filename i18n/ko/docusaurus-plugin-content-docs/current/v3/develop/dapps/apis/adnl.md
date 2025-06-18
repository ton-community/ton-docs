# TON ADNL API

:::tip

블록체인에 연결하는 방법에는 여러 가지가 있습니다:

1. RPC 데이터 제공자나 다른 API: 대부분의 경우, 안정성과 보안을 **신뢰**해야 합니다.
2. **ADNL 연결**: [라이트서버](/participate/run-nodes/liteserver)에 연결합니다. 이들은 접근할 수 없을 수도 있지만, 특정 수준의 검증(라이브러리에 구현됨)을 통해 거짓 정보를 제공할 수는 없습니다.
3. Tonlib 바이너리: 라이트서버에 연결하는 점은 동일하지만, 동적 로딩 라이브러리를 포함하고 있어 추가적인 장점과 단점이 존재합니다.
4. 오프체인 전용: 이러한 SDK는 셀을 생성하고 직렬화하여 API로 전송할 수 있습니다.

:::

클라이언트는 바이너리 프로토콜을 사용하여 라이트서버(노드)에 직접 연결합니다.

클라이언트는 키블록, 계정의 현재 상태, 그리고 **머클 증명**을 다운로드하여 수신한 데이터의 유효성을 보장합니다.

읽기 작업(예: get-method 호출)은 다운로드 및 검증된 상태로 로컬 TVM을 실행하여 수행됩니다. 블록체인의 전체 상태를 다운로드할 필요는 없으며, 작업에 필요한 것만 다운로드합니다.

공개 라이트서버에 글로벌 구성([메인넷](https://ton.org/global-config.json) 또는 [테스트넷](https://ton.org/testnet-global.config.json))에서 연결하거나, 자체 [라이트서버](/participate/nodes/node-types)를 운영하고 [ADNL SDK](/develop/dapps/apis/sdk#adnl-based-sdks)로 이를 처리할 수 있습니다.

머클 증명](/개발/데이터-포맷/증명)에 대한 자세한 내용은 [TON 백서](https://ton.org/ton.pdf) 2.3.10, 2.3.11에서 확인할 수 있습니다.

글로벌 구성의 공개 라이트서버는 TON을 빠르게 시작하는 데 도움을 줍니다. TON 프로그래밍을 배우거나, 100% 가동 시간을 필요로 하지 않는 애플리케이션 및 스크립트에 사용할 수 있습니다.

프로덕션 인프라를 구축하려면 잘 준비된 인프라를 사용하는 것이 좋습니다:

- [자체 라이트서버 설정](https://docs.ton.org/participate/run-nodes/full-node#enable-liteserver-mode),
- 라이트서버 프리미엄 제공업체 [@liteserver_bot](https://t.me/liteserver_bot) 사용

## 장단점

- ✅ 신뢰성. 머클 증명 해시를 사용하여 들어오는 바이너리 데이터를 검증하는 API를 사용합니다.

- ✅ 보안성. 머클 증명을 검증하기 때문에 신뢰할 수 없는 라이트서버도 사용할 수 있습니다.

- ✅ 빠른 속도. HTTP 미들웨어를 사용하지 않고 TON 블록체인 노드에 직접 연결합니다.

- ❌ 복잡성. 문제를 해결하는 데 더 많은 시간이 필요합니다.

- ❌ 백엔드 우선. 웹 프론트엔드와 호환되지 않거나 HTTP-ADNL 프록시가 필요합니다 (비 HTTP 프로토콜용으로 구축됨).

## API 참조

서버에 대한 요청과 응답은 특정 프로그래밍 언어에 대한 타입 인터페이스를 생성할 수 있도록 하는 [TL](/develop/data-formats/tl) 스키마에 의해 설명됩니다.

[TonLib TL 스키마](https://github.com/ton-blockchain/ton/blob/master/tl/generate/scheme/tonlib_api.tl)
