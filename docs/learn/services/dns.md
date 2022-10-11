# What is TON DNS?

**Launch date:** Q2 2022

TON DNS is a service for translating human-readable domain names (such as `marketplace.ton` or `candyzoo.gaming.ton`) into TON Network addresses for accounts, smart contracts, services and network nodes.

Just like the Internet relies internally on numerical addresses ([IP addresses](https://en.wikipedia.org/wiki/IP_address)) to identify different connected computers, various entities in the TON Network, such as your TON wallet, have [raw addresses](https://tonscan.org/address/EQCB8Y_dO37YsKGYoMIxCeq0EZ-pqnz4t2qmmUSLFIrRzleC) that are not necessarily easy to read and remember. Traditional [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) can register meaningful human-readable names such as `amazon.com` to be used instead of the numerical addresses of the Internet. Similarly, TON DNS can register meaningful human-readable names (just with the `.ton` extension) to be used instead of the raw internal addresses that are hard to work with.

## Deeper dive

The grand TON Network vision tries to create a version of the Internet that is significantly more secure, more private and decentralized. A new Internet that is fairly owned by its users and follows the principles of [web3](https://en.wikipedia.org/wiki/Web3). The traditional [DNS](https://en.wikipedia.org/wiki/Domain_Name_System) service plays a critical role in the Internet because people rely on human-readable domain names such as `amazon.com` to navigate and find what they need. TON DNS is similar in principle but is more secure, more private and fully decentralized.

Internet domain names today are sold by for-profit corporations such as [GoDaddy](https://www.godaddy.com/). They are not directly held by their owners, since registrars like GoDaddy must hold your domain on your behalf. This presents privacy issues - even domains represented as private are not private from the registrar. This also presents security issues - anyone who can convince the registrar that they're you, can effectively hijack your domain.

TON DNS resolves these issues by eliminating intermediaries like GoDaddy. Instead of for-profit corporations, domains are managed by smart contracts on the TON blockchain. Domains are purchased by paying TON coins directly to these contracts. Nobody profits from the sale of names (which are community assets), since all TON proceeds are burned and removed from circulation. Rules of the sales are transparent and immutable, guaranteeing fair equal access by all. The system is fully private, as no identifying factors or real world identities are stored anywhere. The system is also fully secure, since domain ownership is represented as an NFT that users hold by themselves - which are as secure as keeping your private key secret.

TON DNS takes the vision of the private Internet a step further. The underlying networking protocol of the TON Network is called ADNL - and one of its features is allowing network entities to remain anonymous. TON DNS can label these anonymous ADNL addresses with human-readable names to make them easy to access. Consider a website like [WikiLeaks](https://wikileaks.org/) that wants to remain anonymous to resist censorship and avoid prosecution, yet requires a well known name to allow its readers to find it.

Every entity on the TON Network can be labeled with TON DNS, from a wallet address, to a validator node, a smart contract and any service like TON Sites. To enjoy TON DNS today, end users can install a browser extension on leading browsers such a Chrome or browse using supporting proxy servers that translate requests automatically. In the future, we can also expect to see TON DNS baked into web browsers directly. Consider Telegram Messenger, that could eventually support TON DNS out of the box, exposing the benefits of naming security, privacy and decentralization to mass adoption.

## Similar projects in other networks

[ENS](https://ens.domains/) (Ethereum Name Service) is a service in the Ethereum ecosystem that is similar in principle to TON DNS. Unlike TON DNS, which is a core service of TON Network, ENS is a [DAO](https://en.wikipedia.org/wiki/The_DAO_(organization)) and not part of the Ethereum protocol. ENS has its own governance token, [ENS](https://coinmarketcap.com/currencies/ethereum-name-service/), that is traded independently from ETH and is used for governance purposes. TON DNS does not have its own separate token and instead relies on TON coin for its governance and incentives layer - as all TON proceeds from domain sales are burned and removed from circulation for the benefit of all TON holders.

ENS is also limited in mass adoption potential due to inherent limitations of the Ethereum network. The high cost of gas on Ethereum makes registering billions of subdomains impractical. The cost of registering a subdomain on TON DNS is about 1 cent. TON DNS can easily accomodate a future where every human on earth can securely register and name their assets - from an email address to their personal wallet.

## More info

* [TON DNS in Docs](/learn/services/dns)
* [TON DNS Standard](https://github.com/ton-blockchain/TIPs/issues/81)
* [TON DNS in TON Whitepaper - section 4.3](https://ton-blockchain.github.io/docs/ton.pdf)
* [TON DNS Auction Client](https://dns.ton.org/)