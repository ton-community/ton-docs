import Feedback from '@site/src/components/Feedback';

# Оверлейные подсети

Please see the implementation:

- https://github.com/ton-blockchain/ton/tree/master/overlay

## Overview

Архитектура TON построена таким образом, что в ней одновременно и независимо может существовать множество цепочек — они могут быть как частными, так и общедоступными. Узлы имеют возможность выбирать, какие шарды и цепочки они хранят и обрабатывают.

Despite this variability, the communication protocol remains consistent due to its universal nature. Protocols such as DHT (Distributed Hash Table), RLDP (Reliable Layered Datagram Protocol), and overlays facilitate this functionality.

We are already familiar with the first two protocols; in this section, we will focus on overlays.

Оверлеи отвечают за разделение единой сети на дополнительные подсети. Оверлеи могут быть как общедоступными, к которым может подключиться любой желающий, так и частными, где для входа требуются дополнительные учетные данные, известные только определенному кругу лиц. Все чейны в TON, включая мастерчейн, общаются с помощью собственного оверлея. Чтобы присоединиться к нему, нужно найти узлы, которые уже состоят в нем, и начать обмениваться с ними данными.

Для общедоступных оверлеев вы можете найти узлы с помощью DHT.

## ADNL против оверлейных сетей

В отличие от ADNL, оверлейные сети TON обычно не поддерживают
отправка датаграмм на другие произвольные узлы. Вместо этого между определенными узлами устанавливаются некоторые “полупостоянные
соединения” (называемые “соседними” по отношению к
рассматриваемой оверлейной сети), и сообщения обычно пересылаются
по этим соединениям (т.е. от узла к одному из его соседей). Messages are usually forwarded along these links, meaning communication happens from one node to one of its neighbors.

Каждая оверлейная подсеть имеет 256-разрядный сетевой идентификатор, обычно равный SHA256 описания оверлейной сети — TL-сериализованного объекта.

Оверлейные подсети могут быть общедоступными или частными.

Оверлейные подсети работают по специальному протоколу [gossip](https://ru.wikipedia.org/wiki/Gossip_\\\(%D0%Bf%D1%80%D0%Be%D1%82%D0%Be%D0%Ba%D0%Be%D0%Bb\\\)).

## Взаимодействие с оверлейными узлами

We have already analyzed an example of finding overlay nodes in an article about Distributed Hash Tables (DHT). Мы уже разбирали пример с поиском оверлейных узлов в статье о DHT,
в разделе [Поиск узлов, хранящих состояние блокчейна](/v3/documentation/network/protocols/dht/dht-deep-dive#search-for-nodes-that-store-the-state-of-the-blockchain).

В этом разделе мы сосредоточимся на взаимодействии с ними.

When querying the DHT, we will retrieve the addresses of the overlay nodes. При запросе DHT мы получим адреса оверлейных узлов, из которых мы можем узнать адреса других узлов этого оверлея с помощью запроса [overlay.getRandomPeers](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L237).

Как только мы подключимся к достаточному количеству узлов, мы сможем получать от них всю информацию о блоках и другие события чейна, а также отправлять им наши транзакции для обработки. Additionally, we can send our transactions to these nodes for processing.

### Найдите больше соседей

Для этого отправьте запрос `overlay.getRandomPeers` на любой известный узел оверлея, сериализуйте схему TL:

Make sure to serialize the TL schema:

```tlb
overlay.node id:PublicKey overlay:int256 version:int signature:bytes = overlay.Node;
overlay.nodes nodes:(vector overlay.node) = overlay.Nodes;

overlay.getRandomPeers peers:overlay.nodes = overlay.Nodes;
```

`peers` - должен содержать известные нам пиры, поэтому мы не получаем их обратно, но поскольку мы пока не знаем ни одного, `peers.nodes` будет пустым массивом. Since we currently do not know any peers, `peers.nodes` will initially be an empty array.

В случае, если мы хотим не просто получить какую-то информацию, а участвовать в оверлее и получать трансляции, мы также должны добавить в `peers` информацию о нашем узле, с которого мы делаем запрос. Когда пиры получат информацию о нас - они начнут отправлять нам широковещательные сообщения с помощью ADNL или RLDP.

Каждый запрос внутри оверлея должен иметь префикс TL-схемы:

```tlb
overlay.query overlay:int256 = True;
```

`overlay` должен быть идентификатором оверлея - идентификатором ключа схемы `tonNode.ShardPublicOverlayId` - тем же, который мы использовали для поиска в DHT.

Нам нужно объединить 2 сериализованные схемы, просто объединив 2 сериализованных байтовых массива, `overlay.query` будет первым, `overlay.getRandomPeers` - вторым.

Мы оборачиваем полученный массив в схему `adnl.message.query` и отправляем ее через ADNL. В ответе ждем `overlay.nodes` - это будет список узлов оверлея, к которым мы можем подключиться и, при необходимости, повторить тот же запрос к новым из них, пока не получим достаточное количество подключений. If necessary, we can repeat the request to any new nodes until we acquire enough connections.

### Функциональные запросы

После того, как соединение установлено, мы можем получить доступ к оверлейным узлам с помощью [запросов](https://github.com/ton-blockchain/ton/blob/ad736c6bc3c06ad54dc6e40d62acbaf5dae41584/tl/generate/scheme/ton_api.tl#L413) `tonNode.*`.

Для запросов такого рода используется протокол RLDP. И важно не забыть префикс `overlay.query` - он должен использоваться для каждого запроса в оверлее.

В самих запросах нет ничего необычного, они очень похожи на то, что мы [делали в статье про ADNL TCP](/v3/documentation/network/protocols/adnl/adnl-tcp#getmasterchaininfo).

Например, запрос `downloadBlockFull` использует уже знакомую схему идентификатора блока:

```tlb
tonNode.downloadBlockFull block:tonNode.blockIdExt = tonNode.DataFull;
```

Передав его, мы сможем загрузить полную информацию о блоке, в ответ получим:

```tlb
tonNode.dataFull id:tonNode.blockIdExt proof:bytes block:bytes is_link:Bool = tonNode.DataFull;
  or
tonNode.dataFullEmpty = tonNode.DataFull;
```

Если присутствует, поле `block` будет содержать данные в формате TL-B.

Таким образом, мы можем получать информацию напрямую с узлов.

## Ссылки

_Вот [ссылка на оригинальную статью](https://github.com/xssnick/ton-deep-doc/blob/master/Overlay-Network.md) [Олега Баранова](https://github.com/xssnick)._

<Feedback />

