import Feedback from '@site/src/components/Feedback';

# TON Сеть

Как только будут внедрены более сложные сетевые протоколы, необходимые для поддержки блокчейна TON, окажется, что их можно легко переиспользовать для целей, не связанных с непосредственными потребностями самого блокчейна, тем самым предоставя больше возможностей и гибкости для создания новых сервисов в самой TON экосистеме.

- Блокчейн **TON использует эти протоколы** для распространения новых блоков, отправки и сбора очереди на транзакцию и тому подобные операции.

  While the networking demands of single-blockchain projects, such as Bitcoin or Ethereum, can be met quite easily: one essentially needs to construct a peer-to-peer overlay network and then propagate all new blocks and transaction candidates via a [gossip](https://en.wikipedia.org/wiki/Gossip_protocol) protocol.

Сетевые требования проектов с одним блокчейном, таких как Bitcoin или Ethereum, могут быть удовлетворены довольно легко  – по сути нужно построить одноранговую оверлейную сеть, а затем распространять все новые блоки и кандидатов на транзакции через протокол [gossip](https://en.wikipedia.org/wiki/Gossip_protocol).В свою очередь проекты с несколькими блокчейнами, такие как TON, гораздо более требовательны к устройству сети. Например, нужно иметь возможность подписываться на обновления только некоторых из всего множества шардчейнов.

- Сервисы экосистемы **TON (например, TON Proxy, TON Sites, TON Storage) работают на этих протоколах.**

  Once the more sophisticated network protocols are in place to support the TON blockchain.
  They can easily be used for purposes not necessarily related to the immediate demands of the blockchain itself, thus providing more possibilities and flexibility for creating new services in TON Ecosystem.

## Проект TON использует собственные одноранговые сетевые протоколы.

- [TON Connect](/v3/guidelines/ton-connect/overview/)
- [Протокол ADNL](/v3/documentation/network/protocols/adnl/overview)
- [Оверлейные подсети](/v3/documentation/network/protocols/overlay)
- [Протокол RLDP](/v3/documentation/network/protocols/rldp)
- [Служба TON DHT](/v3/documentation/network/protocols/dht/ton-dht)

## См. также

- [TON security audits](/v3/concepts/dive-into-ton/ton-blockchain/security-measures/)

<Feedback />

