import Feedback from '@site/src/components/Feedback';

# TON DNS & domains

TON DNS is a service that translates human-readable domain names like `test.ton` or `mysite.temp.ton` into TON smart contract addresses, ADNL addresses used by services on the TON Network such as TON Sites, and more. 

## Standard

The [TON DNS standard](https://github.com/ton-blockchain/TIPs/issues/81) outlines the domain name format, the domain resolution process, the interface for DNS smart contracts, and the structure of DNS records.

## SDK

Support for working with TON DNS is available through the JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) and [TonLib](https://ton.org/#/apis/?id=_2-ton-api).

```js
const address: Address = await tonweb.dns.getWalletAddress('test.ton');

// or 

const address: Address = await tonweb.dns.resolve('test.ton', TonWeb.dns.DNS_CATEGORY_WALLET);
```

Also, `lite-client` and `tonlib-cli` are supported by DNS queries.

## First-level domain

Only domains ending in `.ton` are currently recognized as valid TON DNS domains.

You can view the root DNS smart contract source code [here](https://github.com/ton-blockchain/dns-contract/blob/main/func/root-dns.fc).

This may change in the future. Adding a new top-level domain would require deploying a new root DNS smart contract and a community vote to update the [network config #4](https://ton.org/#/smart-contracts/governance?id=config).


## *.ton domains

`.ton` domains are implemented as NFTs. Because they follow the standard NFT format, they're compatible with most NFT marketplaces and wallets that support NFTs.

The source code for `.ton` domains is available [here](https://github.com/ton-blockchain/dns-contract).

The `.ton` domain resolver acts as an NFT collection, while each individual `.ton` domain functions as an NFT item.

Primary sales of `.ton` domains occur through a decentralized open auction at [dns.ton.org](https://dns.ton.org). The auction's source code can be found [here](https://github.com/ton-blockchain/dns).



## Subdomains
Domain owners can create subdomains by setting the smart contract address responsible for subdomain resolution in the DNS record using the key `sha256("dns_next_resolver")`.

This address can point to any smart contract implementing the TON DNS standard.
<Feedback />

