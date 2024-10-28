# Site & Domain Management

## How to open a domain for editing

1. Open the Google Chrome browser on your computer.

2. Install the Google Chrome TON extension from this [link](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd).

3. Open the extension, click "Import wallet" and import the wallet where the domain is stored.

> Recovery Phrases
>
> Your recovery phrase consists of the 24 words you wrote down when you created your wallet.
>
> If you lose your recovery phrase, you can restore it using any TON Wallet.
> In Tonkeeper: go to Settings > Wallet protection > Your private key.
>
>
> Make sure to write down these 24 words and store them in a safe place. In case of an emergency, you will be able to restore access to the wallet using only your recovery phrase.
> Keep your recovery phrases strictly confidential. Anyone who gains access to your recovery phrases will have full access to your funds.

4. Now open your domain on https://dns.ton.org and click the "Edit" button.

## How to link a wallet to a domain

You can link a wallet to a domain, allowing users to send coins to that wallet by entering the domain as the recipient address instead of the wallet address.

1. Open the domain for editing as described above.

2. Copy your wallet address into the "Wallet address" field and click "Save".

3. Confirm sending the transaction in the extension.

## How to link a TON Site to a domain

1. Open the domain for editing as described above.

2. Copy the ADNL Address of your TON Site in HEX format into the "Site" field and click "Save".

3. Confirm sending the transaction in the extension.

## How to set up subdomains


1. Create a smart contract on the network to manage the subdomains of your website or service. You can use ready-made [manual-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-manual-code.fc) or [auto-dns](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/dns-auto-code.fc) smart contracts, or any other smart contract that implements the TON DNS interface.

2. Open the domain for editing as described above.

3. Copy the smart contract address of the subdomains in the "Subdomains" field and click "Save".

4. Confirm sending the transaction in the extension.


