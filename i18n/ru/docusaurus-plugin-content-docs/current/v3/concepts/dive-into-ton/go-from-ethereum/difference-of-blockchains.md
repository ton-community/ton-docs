import Feedback from '@site/src/components/Feedback';

# Различия блокчейнов

## Introduction

В этом разделе мы рассмотрим основные различия между блокчейном Ethereum и блокчейном TON. Анализ будет включать обзор сетевых архитектур, описывать их уникальные особенности и оценивать преимущества и недостатки каждого из них.

Начиная с обзора экосистем Ethereum и TON, стоит отметить, что обе платформы предлагают схожую структуру участников и услуг. Структура включает в себя: пользователей, которые совершают транзакции и имеют в наличии активы, валидаторов, которые поддерживают работу и безопасность сети, а также разработчиков приложений, использующих блокчейн как основу для своих продуктов и услуг. Оба экосистемы включают в себя кастодиальные, и некастодиальные сервисы, предоставляющие пользователям различные уровни контроля над их активами.

Более того, стоит отметить, что обе платформы поддерживают создание децентрализованных приложений (DApps), предоставляя разработчикам мощные инструменты и стандарты для разработки.

However, despite the similarities in overall structure and features offered, the key technological aspects and network design approaches of Ethereum and TON differ significantly. These differences lay the foundation for a thorough understanding of each platform's unique advantages and limitations, which is particularly important for developers seeking to maximize the capabilities of each network. In the following subsections, we will explore these differences in more detail, focusing on the network architecture, models, transaction mechanisms, and transaction settlement system to provide developers with the necessary insights.

## Однако, несмотря на сходства в общей структуре и предлагаемых функциях, ключевые технологические аспекты и подходы к проектированию сети Ethereum и TON существенно различаются.Эти различия формируют основу для более глубокого понимания уникальных преимуществ, а также и ограничений каждой платформы, что в свою очередь особенно важно для разработчиков, стремящихся максимизировать возможности каждой сети.В следующих подразделах мы подробно изучим эти различия, сосредоточившись на архитектуре сети, моделях, механизмах транзакций и системе расчетов транзакций, что предоставит разработчикам необходимую основу для начала разработки.

### Account

В первом подразделе мы сравнили Ethereum и TON, описав их ключевые архитектурные различия и основные вызовы, с которыми сталкивается Ethereum.Особого внимания заслуживают различия блокчейнов в рамках подходов к организации взаимодействий и использованию моделей. Of particular note are the different approaches to organizing interactions in these blockchains and using models. Эти различия возникают из-за уникальности архитектуры каждой из платформ. Разработчикам привыкшим к Ethereum важно понять эти различия, чтобы эффективно перейти на разработку в TON. Это понимание позволит адаптировать архитектуру и оптимизировать взаимодействие смарт-контрактов в новом окружении.

#### Ethereum

Ethereum использует эту модель для отслеживания балансов. An account stores information about different coin balances, like a regular bank account. Существуют два типа счетов:

- Externally-owned accounts (EOAs) – внешние управляемые счета, управляются пользователем с помощью публичных и приватных ключей. Публичный ключ позволяет другим отправлять платежи на этот счет.
- Contract Accounts — это счета, управляемые кодом смарт-контракта, а не приватными ключами. Поскольку у них нет приватного ключа, счета-контракты самостоятельно не могут инициировать транзакции.

Когда пользователь Ethereum создает кошелек, внешний счет добавляется в глобальное состояние на всех узлах децентрализованной сети при проведении первой транзакции или получении средств. Развертывание умного контракта создает счет-контракт, способный хранить и распределять средства программно в зависимости от определенных условий. Все типы счетов имеют балансы, личное хранилище и могут инициировать транзакции, вызывая функции в других счетах. Подобная структура позволяет Ethereum по сути быть программируемой валютой.

В Ethereum реализована синхронная обработка транзакций, где каждая транзакция обрабатывается по очереди, в строгом порядке. Synchronous processing ensures that the state of the blockchain always remains consistent and predictable for all participants in the network. Это обеспечивает то, что состояние блокчейна всегда остается консистентным и предсказуемым для всех участников сети.Все транзакции атомарны – либо они полностью успешно завершаются, либо не выполняются вовсе, без какого-либо частичного или неполного выполнения. Более того, когда вызывается смарт-контракт, который затем вызывает другой смарт-контракт, вызов происходит мгновенно в рамках одной транзакции.Однако здесь также есть недостатки: транзакция в таком подходе может вырасти до максимальной допустимой величины. But here again, there are disadvantages — a transaction can grow as much as it can. Основной минус синхронности — это перегрузка из-за того, что вычисления не могут выполняться параллельно. Число контрактов и пользователей будет расти, и невозможность параллелизации вычислений станет основным ограничивающим фактором для роста сети.

#### TON

The actor model is an approach to parallel and distributed computing where the main element is an actor - an independent executable block of code. Initially developed for cluster computing, this model is widely used in micro-server architectures to meet the needs of modern distributed systems due to its ability to scale, parallelism, and fault tolerance. Actors receive and process messages, depending on the logic of the message, respond by accepting local changes or performing actions in response, and can create other actors or send messages onward. Более того они могут создавать других акторов или направлять сообщения далее.Они являются потокобезопасными и рекурсивно вызываемыми, что позволяет избежать блокировок и упрощает параллельную обработку задач. Эта модель идеальна для построения масштабируемых и надежных серверных решений, предоставляя эффективный контроль одновременного доступа и поддерживая как синхронные, так и асинхронные сообщения.

In TON, smart contracts represent everything and are called actors within the actor model context. A smart contract is an object with address, code, data, and balance properties. Он способен хранить данные, а также действовать в соответствии с инструкциями, полученными от других смарт-контрактов. После того как контракт получает сообщение и обрабатывает его, выполняя код в TVM, могут возникать различные сценарии:

- Контракт изменяет свои свойства `code, data, balance`
- Контракт опционально генерирует исходящие сообщения
- Контракт переходит в режим ожидания до тех пор, пока не произойдет следующее событие

Результат скриптов всегда является созданием транзакции. Сами же транзакции асинхронны, что означает, что система может продолжать обрабатывать другие транзакции, не дожидаясь завершения прошедших транзакций.Это обеспечивает большую гибкость при обработке сложных операций. This approach provides more flexibility when processing complex transactions. Иногда для одной транзакции требуется выполнение нескольких вызовов смарт-контрактов в определенной последовательности. Because these calls are asynchronous, developers can more easily design and implement complex transaction flows that may involve multiple concurrent operations.

Поскольку эти вызовы асинхронны, разработчикам проще проектировать и реализовывать сложные потоки транзакций, которые могут включать несколько параллельных операций.Разработчик, переходящий с Ethereum, должен учесть, что смарт-контракты в блокчейне TON могут обмениваться данными только в асинхронном режиме. Это означает, что при запросе данных из другого контракта вы не можете надеяться на получение немедленного ответа.Вместо этого get-методы должны вызываться клиентами снаружи сети. Это подобно тому как в Ethereum кошельках используются узлы RPC, такие как Infura, для запроса состояния смарт-контрактов.Это важное ограничение по нескольким причинам. This is an important limitation for several reasons. Например, flash loans — это вид транзакций, которые должны быть выполнены в рамках одного блока, рассчитывая на возможность проведения заема и возврата в рамках одной транзакции.

Это требование соответствует синхронной природе EVM Ethereum, но в TON асинхронность всех транзакций делает выполнение flash loan невозможным.Также Оракулы, которые предоставляют смарт-контрактам внешние данные, имеют в TON более сложный процесс проектирования. Oracles, which provide smart contracts with external data, also involve a more intricate design process in TON. Что такое Оракулы и как их использовать в TON можно найти [здесь](/v3/documentation/dapps/oracles/about_blockchain_oracles).

### Отличия кошельков

#### Ethereum

Ранее мы уже обсуждали, что в Ethereum кошелек пользователя генерируется на основе его адреса, который находится в отношении 1 к 1 с его открытым ключом.В свою очередь в TON все кошельки являются смарт-контрактами, которые должны быть развернуты самим пользователем.

In Ethereum, developers use multi-signature wallets like gnosis. They are just introducing so-called **account abstraction** with the ERC-4337 standard. This standard extends the functionality of wallets, such as sending transactions without a native token, recovering accounts after loss, etc.

Такой подход значительно повышает гибкость в проектировании кошелька, и разработчики могут добавлять новые версии кошелька в будущем.В Ethereum на данный момент разработчики активно используют мультиподписные кошельки, смарт-контракты, типа gnosis и только начинают внедрять так называемые \\\`account-abstractions' типа ERC-4337, где кошельки наполнены таким функционалом, как отправка транзакций без собственного токена, восстановление счета после его потери и т.д.Однако важно отметить, что счета кошельков TON гораздо дороже в использовании с точки зрения комиссий за газ в сравнении с EOA в Ethereum.

#### TON

In TON, all wallets are smart contracts that the user must deploy. Поскольку смарт-контракты могут быть настроены по-разному и иметь различные функции, существует несколько версий кошельков, о которых вы можете прочитать [здесь](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts).В связи с тем, что кошельки являются смарт-контрактами, у пользователя может быть несколько кошельков с разными адресами и начальными параметрами.

Because wallets are smart contracts, users can have multiple wallets with different addresses and initial parameters. Чтобы отправить транзакцию, пользователь должен подписать сообщение своим закрытым ключом и отправить его в свой контракт кошелька, который, в свою очередь, пересылает его в смарт-контракт конкретного приложения DApp. This approach dramatically increases flexibility in wallet design, and developers can add new versions of the wallet in the future.

### Сообщения и транзакции

#### Ethereum

Recall that in Ethereum transactions are cryptographically signed instructions from accounts. An account will initiate a transaction to update the state of the Ethereum network. The most straightforward transaction is transferring ETH from one account to another.

Transaction flow

1. A transaction hash is cryptographically generated: `0x97d99bc7729211111a21b12c933c949d4f31684f1d6954ff477d0477538ff017`
2. The transaction is then broadcast to the network and added to a transaction pool consisting of all other pending network transactions.
3. A validator must pick your transaction and include it in a block to verify and consider it successful.
4. As time passes, the block containing your transaction will be upgraded to `justified` and then `finalized.` These upgrades ensure that your transaction was successful and will never be altered. Once a block is finalized, it could only ever be changed by a network-level attack that would cost many billions of dollars.

#### TON

In TON, the entity that transfers data between two contracts is called a message. For example, a message contains arbitrary data about a token transfer sent to a specified address. When the message arrives at the contract, the contract processes this according to the code. Когда сообщение достигает контракта, оно обрабатывается кодом контракта, состояние контракта обновляется, и он опционально отправляет новое сообщение. [Transaction](/v3/documentation/smart-contracts/message-management/messages-and-transactions/) is an entire flow from receiving messages to executing actions on the account.

For example, consider the interaction of accounts where we have messages from contract **A** to contract **B**. In this case, we have one message and two transactions.

Однако изначально, чтобы изменить состояние блокчейна, нам потребуется внешний сигнал. To invoke a smart contract, you need to send an external message to the validators, and they will apply it to the smart contract.

As we already discussed, a wallet is a smart contract, so this external message usually first goes to the wallet's smart contract, which records them as the first transaction, and that first transaction usually contains an embedded message for the actual destination contract.

When the wallet smart contract receives the message, it processes it and delivers it to the destination contract. In our example, contract **A** could be a wallet; when it receives the external message, it will have the first transaction.

We can represent the sequence of transactions as a chain. Таким образом, вы можете видеть, что каждый смарт-контракт имеет свои собственные транзакции, что в свою очередь означает, что каждый контракт имеет свой собственный микро-блокчейн – вы можете узнать больше об этом [здесь](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains). Именно поэтому сеть может обрабатывать транзакции в полной независимости друг от друга.

:::info
[Документ "Сравнение блокчейнов"](https://ton.org/comparison_of_blockchains.pdf)
:::

### Gas

#### Ethereum

In Ethereum, users pay fees in their native currency, ether (ETH). Usually, one quotes gas prices in gwei, which is a denomination of ETH. Each gwei is equal to one billionth of an ETH.

For example, 0.000000001 ether is equal to 1 gwei.

Стоимость газа делится на `базовую плату`, установленную протоколом, и `приоритетную плату`, которую пользователь добавляет, чтобы ускорить обработку транзакций валидаторами.

The `total fee` is equal:

```
total fee = units of gas used * (base fee + priority fee).
```

`Общая стоимость` будет равна = `использованным единицам газа` \* (`базовая плата` + `приоритетная плата`).Кроме того, хранение данных на Ethereum по сути бесплатное, что означает, что после того, как данные были сохранены в блокчейне, больше не возникает затрат на их содержание.

#### TON

The contract nominates all computation costs in gas units and fixes them in a specific gas amount. The blockchain config defines the gas, and one pays for it in Toncoins.

The chain configuration determines the price of gas units and may be changed only by consensus of validators. Note that, unlike in other systems, the user cannot set their gas price, and there is no fee market.
In TON, the calculation of transaction fees is complex. It includes several types of fees:

- fees for storing smart contracts in the blockchain
- fees for importing messages into the blockchain
- fees for executing code on a virtual machine
- fees for processing actions after code execution
- fees for sending messages outside the TON blockchain

The price of gas and some other parameters can be changed by voting on the main network. В отличие от Ethereum, в TON пользователи не могут самостоятельно устанавливать цену газа. Also, the developer needs to return the remaining gas funds to the owner manually, otherwise they will remain locked. Также разработчику необходимо вручную вернуть оставшиеся средства газа владельцу, иначе они останутся заблокированы.Использование хранилища смарт-контрактов также влияет на стоимость: если смарт-контракт кошелька не использовался долго, следующая транзакция будет стоить дороже.

:::info
Read more about [gas](/v3/documentation/smart-contracts/transaction-fees/fees).
:::

### Архитектура блокчейна

#### Ethereum

Ethereum inherits and extends the foundational principles of Bitcoin. This approach gives developers the flexibility to create complex DApps. Особенностью Ethereum является его способность предоставлять каждому счету индивидуальное хранилище данных, что позволяет через транзакции не только выполнять переводы токенов, но и изменять состояние блокчейна, взаимодействуя со смарт-контрактами.Эта способность синхронно взаимодействовать между счетами, как мы знаем, имеет большое значение для разработки приложений, однако в свою очередь также вызывает вопрос о масштабируемости. As we know, this ability to synchronously interact between accounts offers great promise for application development, but also raises the issue of scalability. Каждая транзакция на сети Ethereum требует от узлов обновлять и поддерживать полное состояние блокчейна, что приводит к значительной задержке и увеличивает стоимость газа при росте сети.

#### TON

В ответ на эти вызовы, TON предлагает альтернативный подход, направленный на улучшение масштабируемости и производительности. Будучи разработанным с целью предоставить разработчикам максимальную гибкость при создании различных приложений, TON использует концепцию шардов и мастерчейна для оптимизации процесса создания блоков.В каждом TON шардчейне и мастерчейне создается новый блок примерно каждые 5 секунд, обеспечивая более быстрое выполнение транзакций. Each TON ShardChain and MasterChain generates a new block on average every 3 seconds, ensuring fast transaction execution. В отличие от Ethereum, где обновления состояния синхронны, TON реализует асинхронное взаимодействие между смарт-контрактами, позволяя каждую транзакцию обрабатывать независимо и параллельно, что значительно ускоряет обработку транзакций в сети.Разделы и статьи для ознакомления: Sections and articles to familiarize yourself with:

- [Шарды](/v3/documentation/smart-contracts/shards/shards-intro)
- [Таблица сравнения блокчейнов (гораздо менее информативная, чем документ, но более наглядная)](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-comparison)

В заключение, сравнивая архитектуру и технологические основы TON и Ethereum, становится ясно, что TON предлагает значительные преимущества. Используя инновационный подход к обработке асинхронных транзакций и уникальную архитектуру шардов и мастерчейна, TON демонстрирует потенциал для поддержки миллионов транзакций в секунду без наличия компромиссов по безопасности или централизации. Это обеспечивает платформе выдающуюся гибкость и эффективность, что делает ее идеальным выбором для широкого спектра приложений.

## See also

- Модель счетов (Ethereum) и Акторная модель (TON)

<Feedback />

