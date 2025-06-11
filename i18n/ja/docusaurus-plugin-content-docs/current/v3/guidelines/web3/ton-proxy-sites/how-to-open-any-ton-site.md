import Feedback from '@site/src/components/Feedback';

# TONサイトを開く方法は?

This article explains the most common ways to access TON Sites from different devices.

Each method has its advantages and limitations. The list begins with the most straightforward options and progresses to more advanced configurations.

## Easy methods

### ton.runまたはtonpioを閲覧する

The simplest way to access a TON Site is through services like [ton.run](https://ton.run). No installation or setup is required — just open the **ton.run** or **tonp.io** and browse TON Sites.

This method is helpful for casual browsing or quick checks. However, it is not recommended for regular use due to several drawbacks:

- Your internet traffic is routed through a third-party service, e.g., ton.run.
- The service may go offline or stop functioning at any time.
- Your internet service provider may block it.

### TONウォレットとMyTonWalletエクステンション

A more reliable and private method is to use a browser extension that connects directly to the TON Proxy without relying on third-party services.
Currently:

- [MyTonWallet](https://mytonwallet.io/) supports TON Proxy in its browser extension.
- [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) will support it soon.

This method requires installing a browser extension and is suitable for regular use by most users.

## Advanced methods

### Tonutils-Proxy の使用

これは TON サイトにアクセスする最も安全な方法です。

1. 最新バージョンformat@@0(https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version) をダウンロード

2. 起動して「ゲートウェイを開始」を押してください

3. 完了！

For the most secure and independent access to TON Sites, use Tonutils-Proxy.

**To get started:**

1. Download the latest release from [GitHub](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version).
2. Launch the application and click “Start Gateway”.

## See also

- [Run C++ implementation](/v3/guidelines/web3/ton-proxy-sites/running-your-own-ton-proxy)

<Feedback />

