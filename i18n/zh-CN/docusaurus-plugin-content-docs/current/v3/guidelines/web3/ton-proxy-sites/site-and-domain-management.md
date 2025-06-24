import Feedback from '@site/src/components/Feedback';

# 网站和域名管理

## 如何打开域名进行编辑

1. 在您的电脑上打开Google Chrome浏览器。
2. 从此[链接](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)安装Google Chrome的TON扩展。
3. 打开扩展，点击“导入钱包”，并导入存储域名的钱包。

> 恢复短语
>
> 您的恢复短语是您在创建钱包时写下的24个单词。
>
> You can restore this phrase using any TON wallet if you lose it.
> In Tonkeeper: go to Settings → Wallet protection → Your private key.
>
> Store your 24 words securely. In case of an emergency, you will be able to restore access to the wallet using only your recovery phrase.
> Please do not share them. Anyone with access to your phrase can access your funds.

4. 现在在https://dns.ton.org打开您的域名并点击“编辑”按钮。

## 如何将钱包链接到域名

您可以将钱包链接到域名，这样用户将能够通过输入域名作为接收地址来向该钱包发送币，而不是钱包地址。

1. 按上述方法打开域名进行编辑。 See steps above.
2. 将您的钱包地址复制到“Wallet address”字段中，然后点击“保存”。
3. 在扩展中确认发送交易。

## 如何将 TON 网站链接到域名

1. 按上述方法打开域名进行编辑。 See steps above.
2. 将您的TON网站的ADNL地址以HEX格式复制到“Site”字段中，然后点击“保存”。
3. 在扩展中确认发送交易。

## 如何设置子域名

1. Create a smart contract on the network to manage the subdomains of your website or service.
2. You can use one of the following ready-made smart contracts:
   - 如果您丢失了短语，可以使用任何TON钱包进行恢复。
      在Tonkeeper中：设置 > 钱包保护 > 您的私钥。
   - 在网络上创建一个智能合约，用于管理您网站或服务的子域名。您可以使用现成的[manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc)或[auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc)智能合约，或任何实现TON DNS接口的其他智能合约。
3. 按上述方法打开域名进行编辑。 See steps above.
4. 将子域名的智能合约地址复制到“Subdomains”字段中，然后点击“保存”。
5. 在扩展中确认发送交易。

<Feedback />

