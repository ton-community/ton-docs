# TON DNS和域名

TON DNS是一项服务，用于将易于人类阅读的域名（如`test.ton`或`mysite.temp.ton`）转换为TON智能合约地址、TON网络上运行的服务（如TON网站）所使用的ADNL地址等。

## 标准

[TON DNS标准](https://github.com/ton-blockchain/TIPs/issues/81)描述了域名的格式、解析域的过程、DNS智能合约的接口以及DNS记录的格式。

## SDK

在JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) 和 [TonLib](https://ton.org/#/apis/?id=_2-ton-api)中实现了与TON DNS的交互。

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

`lite-client` 和 `tonlib-cli` 也支持DNS查询。

## 一级域名

目前，只有以`.ton`结尾的域名被认为是有效的TON DNS域名。

根DNS智能合约源代码 - https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc。

将来这可能会改变。添加新的一级域名将需要新的根智能合约和改变[网络配置#4](https://ton.org/#/smart-contracts/governance?id=config)的通用投票。

## \*.ton域名

\*.ton域名以NFT的形式实现。由于它们实现了NFT标准，因此与常规NFT服务（例如NFT市场）和可以显示NFT的钱包兼容。

\*.ton域名源代码 - https://github.com/ton-blockchain/dns-contract。

.ton域名解析器实现了NFT集合接口，而.ton域名实现了NFT项接口。

\*.ton域名的首次销售通过https://dns.ton.org上的去中心化公开拍卖进行。源代码 - https://github.com/ton-blockchain/dns。

## 子域名

域名所有者可以通过在DNS记录`sha256("dns_next_resolver")`中设置负责解析子域名的智能合约地址来创建子域名。

它可以是任何实现DNS标准的智能合约。
