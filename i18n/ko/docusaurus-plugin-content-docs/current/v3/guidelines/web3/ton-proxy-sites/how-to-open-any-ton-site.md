import Feedback from '@site/src/components/Feedback';

# TON 사이트 접속 방법

This article explains the most common ways to access TON Sites from different devices.

Each method has its advantages and limitations. The list begins with the most straightforward options and progresses to more advanced configurations.

## Easy methods

### ton.run 또는 tonp.io를 통한 접속

The simplest way to access a TON Site is through services like [ton.run](https://ton.run). No installation or setup is required — just open the **ton.run** or **tonp.io** and browse TON Sites.

This method is helpful for casual browsing or quick checks. However, it is not recommended for regular use due to several drawbacks:

- Your internet traffic is routed through a third-party service, e.g., ton.run.
- The service may go offline or stop functioning at any time.
- Your internet service provider may block it.

### TON Wallet과 MyTonWallet 확장 프로그램

A more reliable and private method is to use a browser extension that connects directly to the TON Proxy without relying on third-party services.
Currently:

- [MyTonWallet](https://mytonwallet.io/) supports TON Proxy in its browser extension.
- [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) will support it soon.

This method requires installing a browser extension and is suitable for regular use by most users.

## Advanced methods

### Tonutils-Proxy 사용하기

이것이 TON 사이트에 접속하는 가장 안전한 방법입니다.

1. [여기서](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version) 최신 버전을 다운로드하세요

2. 실행한 후 "Start Gateway"를 누르세요

3. 완료!

For the most secure and independent access to TON Sites, use Tonutils-Proxy.

**To get started:**

1. Download the latest release from [GitHub](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version).
2. Launch the application and click “Start Gateway”.

## See also

- [Run C++ implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)

<Feedback />

