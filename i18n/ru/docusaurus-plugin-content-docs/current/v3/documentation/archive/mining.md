# Руководство по добыче TON

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
Эта информация может быть устаревшей и больше не актуальной. Вы можете пропустить ее.
:::

## <a id="introduction"></a>Введение

Этот документ представляет собой введение в процесс добычи Toncoin с помощью PoW-раздатчиков. Пожалуйста, посетите [ton.org/mining](https://ton.org/mining) для получения актуальной информации о состоянии майнинга TON.

## <a id="quick-start"></a>Быстрый старт

Чтобы сразу же начать добычу:

1. Купите [компьютер, подходящий для майнинга](#hardware).
2. Установите дистрибутив [Ubuntu](https://ubuntu.com) 20.04 для настольных компьютеров или серверов.
3. Установите [mytonctrl](https://github.com/igroman787/mytonctrl#installation-ubuntu) в режиме `lite`.
4. Проверьте свое оборудование и [ожидаемый доход от добычи] (/v3/documentation/archive/mining#income-estimates), выполнив команду `emi` в `mytonctrl`.
5. Если у Вас его еще нет, создайте `адрес кошелька`, используя один из [кошельков](https://www.ton.org/wallets).
6. Определите свой `адрес кошелька` в качестве цели для майнинга, выполнив команду `set minerAddr "..."` в `mytonctrl`.
7. Выберите контракт-даритель из списка, доступного на [ton.org/mining](https://ton.org/mining), и настройте свой майнер на его добычу, выполнив команду `set powAddr "..."` в `mytonctrl`.
8. Начните добычу, выполнив команду `mon` в `mytonctrl`
9. Проверьте загрузку процессора на Вашем компьютере; процесс под названием `pow-miner` должен использовать большую часть Вашего процессора.
10. Дождитесь удачи; результат шага 4 должен был примерно сказать Вам, каковы Ваши шансы добыть блок.

## <a id="basics"></a>Основы

Toncoin распространяется через `PoW Givers`, которые представляют собой смарт-контракты с определенным количеством Toncoin, закрепленным за ними. В настоящее время в сети TON существует 10 активных PoW Givers. Каждый giver распределяет монеты блоками по 100 TON. Чтобы заработать один из этих блоков, Ваш компьютер должен решить сложную математическую задачу быстрее, чем другие майнеры. Если другой майнер решит задачу раньше Вас, работа Вашей машины будет отброшена, и начнется новый раунд.

Прибыль от майнинга не является постепенной; она поступает партиями по 100 TON за каждый успешно решенную задачу giver-а. Это означает, что если Ваша машина имеет 10% шанс вычислить блок в течение 24 часов (см. шаг 4 раздела [Быстрый старт](/v3/documentation/archive/mining#quick-start)), то Вам, вероятно, придется подождать ~10 дней, прежде чем Вы получите вознаграждение в размере 100 TON.

Процесс добычи в значительной степени автоматизирован с помощью `mytonctrl`. Подробную информацию о процессе майнинга можно найти в документе [PoW givers](https://www.ton.org/#/howto/pow-givers).

## <a id="advanced"></a>Продвинутый

Если Вы серьезно настроены к майнингу и хотите управлять несколькими машинами или майнинг-фермой, Вам необходимо узнать о TON и о том, как работает майнинг. За подробной информацией обратитесь к разделу [HOWTO](https://ton.org/#/howto/). Здесь приведены некоторые общие советы:

- **ЗАПУСТИТЕ** свой собственный узел / lite-сервер на отдельной машине; это позволит Вашей майнинговой ферме не зависеть от внешних lite-серверов, которые могут выйти из строя или не обрабатывать Ваши запросы своевременно.
- **НЕ БОМБАРДИРУЙТЕ** публичные lite-серверы запросами `get_pow_params`, если у Вас есть пользовательские скрипты, которые часто опрашивают статус дарителей, Вы **должны** использовать свой собственный lite-сервер. Клиенты, нарушающие это правило, рискуют получить черный список IP-адресов на публичных lite-серверах.
- **ПОСТАРАЙТЕСЬ ПОНЯТЬ**, как работает [процесс майнинга](https://www.ton.org/#/howto/pow-givers); большинство крупных майнеров используют собственные скрипты, которые дают много преимуществ по сравнению с `mytonctrl` в средах с несколькими майнинговыми машинами.

## <a id="hardware"></a>Оборудование для майнинга

Общий хэшрейт сети при добыче TON очень высок; майнерам нужны высокопроизводительные машины, если они хотят добиться успеха. Майнинг на обычных домашних компьютерах и ноутбуках бесполезен, и мы не советуем предпринимать такие попытки.

#### CPU

Современный процессор с поддержкой [Intel SHA Extension](https://en.wikipedia.org/wiki/Intel_SHA_extensions) является **обязательным**. Большинство майнеров используют машины AMD EPYC или Threadripper с не менее чем 32 ядрами и 64 потоками.

#### GPU

Да! Вы можете добывать TON с помощью GPU. Существует версия майнера PoW, способная использовать GPU как Nvidia, так и AMD; Вы можете найти код и инструкции по его использованию в репозитории [POW Miner GPU](https://github.com/tontechio/pow-miner-gpu/blob/main/crypto/util/pow-miner-howto.md).

Пока что для использования этой функции нужно быть технически подкованным, но мы работаем над более удобным решением.

#### Память

Почти весь процесс майнинга происходит в кэше L2 процессора. Это означает, что скорость и объем памяти не играют никакой роли в производительности майнинга. Двойная система AMD EPYC с одним модулем DIMM на одном канале памяти будет майнить так же быстро, как и система с 16 модулями DIMM, занимающими все каналы.

Обратите внимание, что это относится **только** к простому процессу майнинга. Если на Вашей машине также запущен полный узел или другие процессы, то все изменится! Но это выходит за рамки данного руководства.

#### Хранение

Майнер, работающий в режиме lite, использует минимальное пространство для хранения данных и не хранит их.

#### Сеть

Простому майнеру необходима возможность открывать исходящие соединения с Интернетом.

#### FPGA / ASIC

Смотрите [могу ли я использовать FPGA / ASIC?](/v3/documentation/archive/mining#can-i-use-my-btceth-rig-to-mine-ton)

### <a id="hardware-cloud"></a>Облачные машины

Многие люди занимаются майнингом, используя облачные машины AWS или Google. Как указано в спецификациях выше, что действительно важно, так это процессор. Поэтому мы советуем использовать инстансы AWS [c5a.24xlarge](https://aws.amazon.com/ec2/instance-types/c5/) или Google [n2d-highcpu-224](https://cloud.google.com/compute/vm-instance-pricing).

### <a id="hardware-estimates"></a>Оценка доходов

Формула для расчета дохода довольно проста: `($total_bleed / $total_hashrate) * $your_hashrate`. Это даст Вам **текущую** оценку. Вы можете узнать переменные на [ton.org/mining](https://ton.org/mining) или воспользоваться калькулятором предполагаемого дохода от добычи (команда `emi`) в `mytonctrl`. Вот пример расчета, выполненного 7 августа 2021 года на процессоре i5-11400F:

```
Mining income estimations
-----------------------------------------------------------------
Total network 24h earnings:         171635.79 TON
Average network 24h hashrate:       805276100000 HPS
Your machine hashrate:              68465900 HPS
Est. 24h chance to mine a block:    15%
Est. monthly income:                437.7 TON
```

**Важно**: Пожалуйста, обратите внимание, что предоставленная информация основана на *сетевом хэшрейте на момент выполнения*. Ваш реальный доход со временем будет зависеть от многих факторов, таких как изменение хэшрейта сети, выбор дарителя и доля везения.

## <a id="faq"></a>ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ

### <a id="faq-general"></a>Общие сведения

#### <a id="faq-general-posorpow"></a>Является ли сеть TON PoS или PoW?

Блокчейн TON работает на основе консенсуса Proof-of-Stake (PoS). Для создания новых блоков не требуется майнинг.

#### <a id="faq-general-pow"></a>Так как же получилось, что TON - это Proof-of-Work?

Причина в том, что первоначальная эмиссия в 5 миллиардов Тонкоинов была передана специальным смарт-контрактам Proof-of-Work Giver.
Для получения Тонкоинов из этого смарт-контракта используется майнинг.

#### <a id="faq-general-supply"></a>Сколько монет осталось для добычи?

Самая актуальная информация доступна на сайте [ton.org/mining](https://ton.org/mining), см. графики `bleed`. Контракты PoW Giver имеют свой предел и иссякнут, как только пользователи добывают все доступные Toncoin.

#### <a id="faq-general-mined"></a>Сколько монет уже добыто?

По состоянию на август 2021 года было добыто около 4,9 млрд Toncoin.

#### <a id="faq-general-whomined"></a>Кто добыл эти монеты?

Монеты были добыты на более чем 70 000 кошельков. Владельцы этих кошельков остаются неизвестными.

#### <a id="faq-general-elite"></a>Трудно ли начать майнинг?

Вовсе нет. Все, что Вам нужно, это [соответствующее оборудование](#hardware) и следовать шагам, описанным в разделе [быстрый старт](#quick-start).

#### <a id="faq-general-pissed"></a>Есть ли другой способ майнинга?

Да, существует стороннее приложение - [TON Miner Bot](https://t.me/TonMinerBot).

#### <a id="faq-general-stats"></a>Где я могу посмотреть статистику добычи?

[ton.org/mining](https://ton.org/mining)

#### <a id="faq-general-howmany"></a>Сколько человек занимается добычей?

Мы не можем этого сказать. Все, что нам известно, - это общий хэшрейт всех майнеров в сети. Однако на [ton.org/mining](https://ton.org/mining) есть графики, которые пытаются оценить количество машин определенного типа, необходимое для получения приблизительного общего хэшрейта.

#### <a id="faq-general-noincome"></a>Нужен ли мне Toncoin, чтобы начать добычу?

Нет, это не так. Любой может начать добычу, не владея ни одним Toncoin.

#### <a id="faq-mining-noincome"></a>Почему баланс моего кошелька не увеличивается даже после нескольких часов добычи?

TON добываются блоками по 100 штук, Вы либо угадываете блок и получаете 100 TON, либо не получаете ничего. Пожалуйста, ознакомьтесь с [basics](#basics).

#### <a id="faq-mining-noblocks"></a>Я занимаюсь добычей уже несколько дней и не вижу никаких результатов, почему?

Проверяли ли Вы свои текущие [Оценки дохода] (/v3/documentation/archive/mining#income-estimates)? Если поле `Est. 24h chance to mine a block` меньше 100%, то Вам нужно набраться терпения. Также обратите внимание, что 50% шанс добыть блок в течение 24 часов не означает, что Вы автоматически добываете его в течение 2 дней; 50% применяется к каждому дню отдельно.

#### <a id="faq-mining-pools"></a>Существуют ли пулы для майнинга?

Нет, на данный момент нет никаких реализаций майнинговых пулов, каждый майнит сам за себя.

#### <a id="faq-mining-giver"></a>Какого giver-а мне следует выбрать?

Не имеет значения, какого giver-а Вы выберете. Сложность имеет тенденцию колебаться на каждом giver-е, так что текущий самый простой giver на [ton.org/mining](https://ton.org/mining) может стать самым сложным в течение часа. То же самое относится и к противоположному направлению.

### <a id="faq-hw"></a>Оборудование

#### <a id="faq-hw-machine"></a>Всегда ли выигрывает более быстрая машина?

Нет, все майнеры идут разными путями, чтобы найти решение. Более быстрая машина повышает вероятность успеха, но это не гарантирует победу!

#### <a id="faq-hw-machine"></a>Какой доход будет приносить моя машина?

Пожалуйста, посмотрите [Оценки доходов](/v3/documentation/archive/mining#income-estimates).

#### <a id="faq-hw-asic"></a>Могу ли я использовать свою установку BTC/ETH для добычи TON?

Нет, TON использует единственный метод хеширования SHA256, который отличается от BTC, ETH и других. ASICS или FPGA, созданные для добычи других криптовалют, не помогут.

#### <a id="faq-hw-svsm"></a>Что лучше - одна быстрая машина или несколько медленных?

Это спорный вопрос. Смотрите: программное обеспечение майнера запускает потоки для каждого ядра системы, и каждое ядро получает свой набор ключей для обработки, поэтому если у Вас есть одна машина, способная выполнять 64 потока, и 4 машины, способные выполнять 16 потоков каждая, то они будут одинаково успешны при условии, что скорость каждого потока одинакова.

Однако в реальном мире процессоры с меньшим количеством ядер обычно имеют более высокую тактовую частоту, поэтому Вы, вероятно, добьетесь большего успеха при работе с несколькими машинами.

#### <a id="faq-hw-mc"></a>Если я запущу много машин, будут ли они объединены?

Нет, не будут. Каждая машина майнит сама по себе, но процесс поиска решения носит случайный характер: ни одна машина, даже ни один поток (см. выше), не пойдет по одному и тому же пути. Таким образом, их хэшрейты складываются в Вашу пользу без прямого сотрудничества.

#### <a id="faq-hw-CPU"></a>Можно ли добывать, используя процессоры ARM?

В зависимости от процессора, инстансы AWS Graviton2 действительно являются очень способными майнерами и способны выдержать соотношение цена/производительность наравне с инстансами на базе AMD EPYC.

### <a id="faq-software"></a>Программное обеспечение

#### <a id="faq-software-os"></a>Могу ли я добывать, используя Windows/xBSD/другую ОС?

Разумеется, [исходный код TON](https://github.com/ton-blockchain/ton) уже собирался под Windows, xBSD и другие ОС. Однако удобной автоматизированной установки, как под Linux с `mytonctrl`, не существует. Вам придется устанавливать программу вручную и создавать собственные скрипты. Для FreeBSD существует исходник [port](https://github.com/sonofmom/freebsd_ton_port), который позволяет быстро установить программу.

#### <a id="faq-software-node1"></a>Станет ли моя добыча быстрее, если я запущу mytonctrl в режиме full node?

Сам по себе процесс вычислений не станет быстрее, но Вы получите некоторую стабильность и, самое главное, гибкость, если будете управлять собственным сервером full node/lite.

#### <a id="faq-software-node2"></a>Что мне нужно / как я могу управлять full node?

Это выходит за рамки данного руководства, пожалуйста, обратитесь к [Full node howto](https://ton.org/#/howto/full-node) и/или [mytonctrl instructions](https://github.com/igroman787/mytonctrl).

#### <a id="faq-software-build"></a>Можете ли Вы помочь мне создать программное обеспечение на моей ОС?

Это выходит за рамки данного руководства, пожалуйста, обратитесь к [Full node howto](https://ton.org/#/howto/full-node), а также к [Mytonctrl installation scripts](https://github.com/igroman787/mytonctrl/blob/master/scripts/toninstaller.sh#L44) за информацией о зависимостях и процессе.
