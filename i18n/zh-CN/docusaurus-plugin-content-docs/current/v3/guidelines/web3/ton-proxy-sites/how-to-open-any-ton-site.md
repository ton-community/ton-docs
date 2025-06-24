import Feedback from '@site/src/components/Feedback';

# 如何打开任何 TON 网站？

在这篇文章中，我们将看看从不同设备访问TON网站的最常用方法。

Each method has its advantages and limitations. The list begins with the most straightforward options and progresses to more advanced configurations.

## 😄 简单方法

### 通过ton.run浏览

打开TON网站最简单的方法是通过[ton.run](https://ton.run)。您无需在设备上安装或设置任何东西 - 只需打开**ton.run**，您就可以探索TON网站。 No installation or setup is required — just open the **ton.run** or **tonp.io** and browse TON Sites.

This method is helpful for casual browsing or quick checks. However, it is not recommended for regular use due to several drawbacks:

- Your internet traffic is routed through a third-party service, e.g., ton.run.
- The service may go offline or stop functioning at any time.
- 它可能被您的互联网提供商封锁

### TON Wallet 和 MyTonWallet 扩展

A more reliable and private method is to use a browser extension that connects directly to the TON Proxy without relying on third-party services.
Currently:

- [通过TON代理连接](/participate/web3/setting-proxy/)
- 目前，TON代理已经在[MyTonWallet](https://mytonwallet.io/)扩展中可用，并且很快也将在[TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)扩展中可用。

这种方法也相当简单，但您需要在浏览器中安装一个扩展才能使其工作。它适合大多数用户。

## 🤓 高级方法

### 使用Tonutils-Proxy

This is the most secure way of accessing TON Sites.

1. Download the latest version [from here](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version)

2. 启动它并按“启动网关”

3. 完成！

For the most secure and independent access to TON Sites, use Tonutils-Proxy.

**To get started:**

1. Download the latest release from [GitHub](https://github.com/xssnick/Tonutils-Proxy#download-precompiled-version).
2. Launch the application and click “Start Gateway”.

## See also

- [运行 C++ 实现](/v3/guidelines/web3/ton-proxy-sites/running-your-your-ton-proxy)

<Feedback />

