# 网站和域名管理

## 如何打开域名进行编辑

1. 在您的电脑上打开Google Chrome浏览器。

2. 从此[链接](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)安装Google Chrome的TON扩展。

3. 打开扩展，点击“导入钱包”，并导入存储域名的钱包。

> 恢复短语
>
> 您的恢复短语是您在创建钱包时写下的24个单词。
>
> 如果您丢失了短语，可以使用任何TON钱包进行恢复。
> 在Tonkeeper中：设置 > 钱包保护 > 您的私钥。
>
> 请务必记下这24个单词，并将它们保存在安全的地方。在紧急情况下，您只能通过恢复短语来恢复对钱包的访问。
> 请严格保密您的恢复短语。任何获得您恢复短语的人都将完全控制您的资金。

4. 现在在https://dns.ton.org打开您的域名并点击“编辑”按钮。

## 如何将钱包链接到域名

您可以将钱包链接到域名，这样用户将能够通过输入域名作为接收地址来向该钱包发送币，而不是钱包地址。

1. 按上述方法打开域名进行编辑。

2. 将您的钱包地址复制到“Wallet address”字段中，然后点击“保存”。

3. 在扩展中确认发送交易。

## 如何将 TON 网站链接到域名

1. 按上述方法打开域名进行编辑。

2. 将您的TON网站的ADNL地址以HEX格式复制到“Site”字段中，然后点击“保存”。

3. 在扩展中确认发送交易。

## 如何设置子域名

1. 在网络上创建一个智能合约，用于管理您网站或服务的子域名。您可以使用现成的[manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc)或[auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc)智能合约，或任何实现TON DNS接口的其他智能合约。

2. 按上述方法打开域名进行编辑。

3. 将子域名的智能合约地址复制到“Subdomains”字段中，然后点击“保存”。

4. 在扩展中确认发送交易。
