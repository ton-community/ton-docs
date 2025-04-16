# POW Givers

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

:::warning устаревшее
Эта информация может быть устаревшей и больше не актуальной. Вы можете пропустить ее.
:::

Цель этого текста - описать, как взаимодействовать со смарт-контрактами Proof-of-Work Giver для получения Toncoin. Мы предполагаем знакомство с TON Blockchain Lite Client, как объясняется в разделе `Начать работу`, и с процедурой, необходимой для компиляции Lite Client и другого программного обеспечения. Для получения большего количества Toncoin, необходимого для запуска валидатора, мы также предполагаем знакомство со страницами `Full Node` и `Валидатор`. Вам также понадобится выделенный сервер, достаточно мощный для запуска Full Node, чтобы получить большую сумму Toncoin. Получение небольших сумм Тонкоинов не требует выделенного сервера и может быть выполнено за несколько минут на домашнем компьютере.

> Обратите внимание, что на данный момент для любой добычи требуются большие ресурсы из-за большого количества майнеров.

## 1. Смарт-контракты Proof-of-Work Giver

Чтобы предотвратить сбор всех Toncoin небольшим количеством злоумышленников, в мастерчейн сети был внедрен специальный вид смарт-контракта "Proof-of-Work Giver". Адреса этих смарт-контрактов следующие:

Небольшие giver-ы (доставляют от 10 до 100 Toncoin каждые несколько минут):

- kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN
- kf8SYc83pm5JkGt0p3TQRkuiM58O9Cr3waUtR9OoFq716lN-
- kf-FV4QTxLl-7Ct3E6MqOtMt-RGXMxi27g4I645lw6MTWraV
- kf_NSzfDJI1A3rOM0GQm7xsoUXHTgmdhN5-OrGD8uwL2JMvQ
- kf8gf1PQy4u2kURl-Gz4LbS29eaN4sVdrVQkPO-JL80VhOe6
- kf8kO6K6Qh6YM4ddjRYYlvVAK7IgyW8Zet-4ZvNrVsmQ4EOF
- kf-P_TOdwcCh0AXHhBpICDMxStxHenWdLCDLNH5QcNpwMHJ8
- kf91o4NNTryJ-Cw3sDGt9OTiafmETdVFUMvylQdFPoOxIsLm
- kf9iWhwk9GwAXjtwKG-vN7rmXT3hLIT23RBY6KhVaynRrIK7
- kf8JfFUEJhhpRW80_jqD7zzQteH6EBHOzxiOhygRhBdt4z2N

Крупные giver-ы (доставляют 10,000 Toncoin минимум раз в день):

- kf8guqdIbY6kpMykR8WFeVGbZcP2iuBagXfnQuq0rGrxgE04
- kf9CxReRyaGj0vpSH0gRZkOAitm_yDHvgiMGtmvG-ZTirrMC
- kf-WXA4CX4lqyVlN4qItlQSWPFIy00NvO2BAydgC4CTeIUme
- kf8yF4oXfIj7BZgkqXM6VsmDEgCqWVSKECO1pC0LXWl399Vx
- kf9nNY69S3_heBBSUtpHRhIzjjqY0ChugeqbWcQGtGj-gQxO
- kf_wUXx-l1Ehw0kfQRgFtWKO07B6WhSqcUQZNyh4Jmj8R4zL
- kf_6keW5RniwNQYeq3DNWGcohKOwI85p-V2MsPk4v23tyO3I
- kf_NSPpF4ZQ7mrPylwk-8XQQ1qFD5evLnx5_oZVNywzOjSfh
- kf-uNWj4JmTJefr7IfjBSYQhFbd3JqtQ6cxuNIsJqDQ8SiEA
- kf8mO4l6ZB_eaMn1OqjLRrrkiBcSt7kYTvJC_dzJLdpEDKxn

> Обратите внимание, что в данный момент все крупные giver-ы исчерпаны.

Первые десять смарт-контрактов позволяют пользователю, желающему получить небольшое количество Toncoin, получить его, не затрачивая много вычислительной мощности (обычно достаточно нескольких минут работы на домашнем компьютере). Остальные смарт-контракты предназначены для получения более крупных сумм Toncoin, необходимых для работы валидатора в сети; как правило, для получения необходимой суммы достаточно дня работы на выделенном сервере, достаточно мощном для работы валидатора.

> Обратите внимание, что, из-за большого количества майнеров, в настоящее время требуются много ресурсов для добычи мелких giver-ов.

Вы должны случайным образом выбрать один из таких смарт-контрактов "proof-of-work giver" (из одного из этих двух списков, в зависимости от Вашей цели) и получить Toncoin из этого смарт-контракта с помощью процедуры, похожей на майнинг. По сути, Вам необходимо отправить внешнее сообщение, содержащее доказательство работы и адрес Вашего кошелька, выбранному смарт-контракту "proof-of-work giver", после чего Вам будет отправлена необходимая сумма.

## 2. Процесс добычи

Чтобы создать внешнее сообщение, содержащее "proof-of-work", Вам необходимо запустить специальную утилиту для майнинга, скомпилированную из исходников TON, расположенных в репозитории GitHub. Утилита находится в файле `./crypto/pow-miner` относительно каталога сборки и может быть скомпилирована путем ввода команды `make pow-miner` в каталоге сборки.

Однако, прежде чем запускать `pow-miner`, Вам необходимо узнать фактические значения параметров `seed` и `complexity` выбранного смарт-контракта "proof-of-work giver". Это можно сделать, вызвав get-метод `get_pow_params` этого смарт-контракта. Например, если Вы используете смарт-контракт giver, `kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN`, Вы можете просто ввести:

```
> runmethod kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN get_pow_params
```

в консоли Lite Client и получить результат, подобный этому:

```...
    arguments:  [ 101616 ] 
    result:  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ] 
    remote result (not to be trusted):  [ 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 256 ]
```

Два первых больших числа в строке "result:" - это `seed` и `complexity` этого смарт-контракта. В этом примере семя - `229760179690128740373110445116482216837`, а сложность - `53919893334301279589334030174039261347274288845081144962207220498432`.

Затем вызовите утилиту `pow-miner` следующим образом:

```
$ crypto/pow-miner -vv -w<num-threads> -t<timeout-in-sec> <your-wallet-address> <seed> <complexity> <iterations> <pow-giver-address> <boc-filename>
```

Здесь:

- `<num-threads>` - это количество ядер процессора, которые Вы хотите использовать для майнинга.
- `<timeout-in-sec>` - это максимальное количество секунд, которое майнер будет работать, прежде чем признать неудачу.
- `<your-wallet-address>` - это адрес Вашего кошелька (возможно, еще не инициализированного). Он находится либо на мастерчейне, либо на воркчейне (обратите внимание, что для управления валидатором Вам нужен кошелек на мастерчейне).
- `<seed>` и `<complexity>` - это самые последние значения, полученные при выполнении метода get-method `get-pow-params`.
- `<pow-giver-address>` - это адрес выбранного смарт-контракта proof-of-work giver.
- `<boc-filename>` - это имя выходного файла, в котором в случае успеха будет сохранено внешнее сообщение с доказательством работы.

Например, если адрес Вашего кошелька - `kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7`, Вы можете выполнить следующее:

```
$ crypto/pow-miner -vv -w7 -t100 kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7 229760179690128740373110445116482216837 53919893334301279589334030174039261347274288845081144962207220498432 100000000000 kf-kkdY_B7p-77TLn2hUhM6QidWrrsl8FYWCIvBMpZKprBtN mined.boc
```

Программа будет работать некоторое время (в данном случае не более 100 секунд) и либо завершится успешно (с нулевым кодом выхода) и сохранит требуемое доказательство работы в файл `mined.boc`, либо завершится с ненулевым кодом выхода, если доказательство работы не было найдено.

В случае неудачи Вы увидите нечто подобное:

```
   [ expected required hashes for success: 2147483648 ]
   [ hashes computed: 1192230912 ]
```

и программа завершится с ненулевым кодом выхода. Затем Вам нужно снова получить значения `seed` и `complexity` (поскольку они могли измениться за это время в результате обработки запросов от более успешных майнеров) и снова запустить `pow-miner` с новыми параметрами, повторяя процесс снова и снова до достижения успеха.

В случае успеха Вы увидите что-то вроде:

```
   [ expected required hashes for success: 2147483648 ]
   4D696E65005EFE49705690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4ACDA33755876665780BAE9BE8A4D6385A1F533B3BC4F5664D6C743C1C5C74BB3342F3A7314364B3D0DA698E6C80C1EA4
   Saving 176 bytes of serialized external message into file `mined.boc`
   [ hashes computed: 1122036095 ]
```

Затем Вы можете использовать Lite Client, чтобы отправить внешнее сообщение из файла `mined.boc` смарт-контракту proof-of-work giver (и Вы должны сделать это как можно скорее):

```
> sendfile mined.boc
... external message status is 1
```

Вы можете подождать несколько секунд и проверить состояние своего кошелька:

:::info
Пожалуйста, обратите внимание здесь и далее, что код, комментарии и/или документация могут содержать параметры, методы и определения, такие как "gtam", "nanogram" и т.д. Это наследие оригинального кода TON, разработанного в Telegram. Криптовалюта Gram никогда не выпускалась. Валютой TON является Toncoin, а валютой тестовой сети TON - Test Toncoin.
:::

```
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:1)
      bits:(var_uint len:1 value:111)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722498
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720869000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:100000000000))
      other:(extra_currencies
        dict:hme_empty))
    state:account_uninit))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F12025BC2F7F2341000001C169E9DCD0945D21DBA0004_}
last transaction lt = 7720869000001 hash = 83C15CDED025970FEF7521206E82D2396B462AADB962C7E1F4283D88A0FAB7D4
account balance is 100000000000ng
```

Если до Вас никто не прислал действительное доказательство работы с такими `seed` и `complexity`, proof-of-work giver примет Ваше доказательство работы, и это будет отражено в балансе Вашего кошелька (после отправки внешнего сообщения может пройти 10 или 20 секунд, прежде чем это произойдет; обязательно сделайте несколько попыток и каждый раз набирайте `last`, прежде чем проверять баланс Вашего кошелька, чтобы обновить состояние Lite Client). В случае успеха Вы увидите, что баланс был увеличен (и даже то, что Ваш кошелек был создан в неинициализированном состоянии, если он не существовал ранее). В случае неудачи Вам придется получить новые значения `seed` и `complexity` и повторить процесс добычи с самого начала.

Если Вам повезло, и баланс Вашего кошелька увеличился, возможно, Вы захотите инициализировать кошелек, если он не был инициализирован ранее (более подробную информацию о создании кошелька Вы найдете в разделе `Пошаговая инструкция`):

```
> sendfile new-wallet-query.boc
... external message status is 1
> last
> getaccount kQBWkNKqzCAwA9vjMwRmg7aY75Rf8lByPA9zKXoqGkHi8SM7
...
account state is (account
  addr:(addr_std
    anycast:nothing workchain_id:0 address:x5690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1)
  storage_stat:(storage_info
    used:(storage_used
      cells:(var_uint len:1 value:3)
      bits:(var_uint len:2 value:1147)
      public_cells:(var_uint len:0 value:0)) last_paid:1593722691
    due_payment:nothing)
  storage:(account_storage last_trans_lt:7720945000002
    balance:(currencies
      grams:(nanograms
        amount:(var_uint len:5 value:99995640998))
      other:(extra_currencies
        dict:hme_empty))
    state:(account_active
      (
        split_depth:nothing
        special:nothing
        code:(just
          value:(raw@^Cell 
            x{}
             x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
            ))
        data:(just
          value:(raw@^Cell 
            x{}
             x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
            ))
        library:hme_empty))))
x{C005690D2AACC203003DBE333046683B698EF945FF250723C0F73297A2A1A41E2F1206811EC2F7F23A1800001C16B0BC790945D20D1929934_}
 x{FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54}
 x{00000001CE6A50A6E9467C32671667F8C00C5086FC8D62E5645652BED7A80DF634487715}
last transaction lt = 7720945000001 hash = 73353151859661AB0202EA5D92FF409747F201D10F1E52BD0CBB93E1201676BF
account balance is 99995640998ng
```

Теперь Вы счастливый обладатель 100 Toncoin. Поздравляем!

## 3. Автоматизация процесса добычи в случае неудачи

Если Вам долгое время не удается получить Toncoin, это может произойти потому, что слишком много других пользователей одновременно занимаются добычей на одном и том же смарт-контракте proof-of-work giver. Возможно, Вам следует выбрать другой смарт-контракт proof-of-work giver из списка, приведенного выше. В качестве альтернативы Вы можете написать простой скрипт, который будет автоматически запускать `pow-miner` с правильными параметрами снова и снова до достижения успеха (определяется проверкой кода завершения работы `pow-miner`) и вызывать Lite Client с параметром `-c 'sendfile mined.boc'` для отправки внешнего сообщения сразу после его обнаружения.
