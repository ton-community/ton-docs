import Feedback from '@site/src/components/Feedback';

# Site & domain management

## 如何打开域名进行编辑

1. Open Google Chrome on your computer.
2. Install the [TON Chrome extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).
3. Open the extension, click "Import wallet", and import the wallet that holds the domain.

> **Recovery phrases**
>
> Your recovery phrase consists of 24 words written down when the wallet was created.
>
> You can restore this phrase using any TON wallet if you lose it.
> In Tonkeeper: go to Settings → Wallet protection → Your private key.
>
> Store your 24 words securely. In case of an emergency, you will be able to restore access to the wallet using only your recovery phrase.
> Please do not share them. Anyone with access to your phrase can access your funds.

4. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit".

## 如何将钱包链接到域名

You can link a wallet address to a domain, allowing users to send coins directly to that domain name instead of a wallet address.

1. Open your domain for editing. See steps above.
2. Paste your wallet address into the "Wallet address" field and click "Save".
3. Confirm the transaction in the extension.

## 如何将 TON 网站链接到域名

1. Open your domain for editing. See steps above.
2. Copy the ADNL address of your TON Site in HEX format, paste it into the "Site" field, and click "Save".
3. Confirm the transaction in the extension.

## 如何设置子域名

1. Create a smart contract on the network to manage the subdomains of your website or service.
2. You can use one of the following ready-made smart contracts:
   - [manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc)
   - [auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc)
3. Open your domain for editing. See steps above.
4. Paste the smart contract address of the subdomain manager into the "Subdomains" field and click "Save".
5. Confirm the transaction in the extension.

<Feedback />

