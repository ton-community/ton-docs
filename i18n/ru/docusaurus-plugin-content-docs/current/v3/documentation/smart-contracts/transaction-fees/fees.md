# Комиссии за транзакции

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

Каждый пользователь TON должен иметь в виду, что *комиссия зависит от многих факторов*.

## Газ

Все [вычислительные расходы](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#computation-fees) выражаются в единицах газа и фиксируются в определённом объёме газа.

Цена единицы газа определяется [конфигурацией сети](https://tonviewer.com/config#20) и может быть изменена только по консенсусу валидаторов. Обратите внимание, что, в отличие от других систем, пользователь не может задать собственную цену на газ, и рынка комиссий не существует.

Текущие настройки в basechain: 1 единица газа стоит 400 нанотон.

```cpp
1 gas = 26214400 / 2^16 nanotons = 0,000 000 4 TON
```

Текущие настройки в masterchain: 1 единица газа стоит 10 000 нанотон.

```cpp
1 gas = 655360000 / 2^16 nanotons = 0,000 01 TON
```

### Средняя стоимость транзакции

> **TLDR:** Сегодня базовая транзакция стоит около **~0.0025 TON**

Даже если цена TON увеличится в 100 раз, транзакции останутся ультрадешёвыми — около $0.01. узнайте, почему им это выгодно - [читайте, почему они заинтересованы в этом](#gas-changing-voting-process).

:::info
Текущее количество газа указано в [параметре 20](https://tonviewer.com/config#20) и [параметре 21](https://tonviewer.com/config#21) конфигурации сети для masterchain и basechain соответственно.
:::

### Процесс голосования за изменение газа

Комиссия за газ, как и многие другие параметры TON, настраивается и может быть изменена с помощью специального голосования в основной сети.

Для изменения любого параметра требуется 66% голосов валидаторов.

#### Может ли газ стоить дороже?

> *Значит ли это, что однажды цена на газ может вырасти в 1000 раз или больше?*

Технически да, но фактически нет.

Валидаторы получают небольшую плату за обработку транзакций, и повышение комиссий приведёт к снижению количества транзакций, что сделает процесс валидации менее выгодным.

### Как рассчитываются комиссии?

Комиссии в TON сложно рассчитать заранее, так как их размер зависит от времени выполнения транзакции, статуса аккаунта, содержимого и размера сообщения, настроек сети блокчейна и множества других переменных, которые нельзя определить до отправки транзакции.

Поэтому даже NFT-маркеты обычно берут дополнительное количество TON (*~1 TON*) и возвращают (*`1 - transaction_fee`*) позже.

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

Ознакомьтесь с обзором [обзором низкоуровневых комиссий](/v3/documentation/smart-contracts/transaction-fees/fees-low-level), чтобы узнать больше о формулах для расчета комиссий и [рассвете комиссий](/v3/guidelines/smart-contracts/fee-calculation), чтобы понять, как рассчитывать комиссии в контрактах FunC с использованием новых опкодов TVM.
:::

Давайте подробнее разберёмся, как комиссии работают в сети TON.

## Базовая формула расчёта комиссий

Комиссии в TON рассчитываются по следующей формуле:

```cpp
transaction_fee = storage_fees
                + in_fwd_fees // also named import_fee
                + computation_fees
                + action_fees
                + out_fwd_fees
```

```jsx live
// Welcome to LIVE editor!
// feel free to change any variables
// Check https://retracer.ton.org/?tx=b5e14a9c4a4e982fda42d6079c3f84fa48e76497a8f3fca872f9a3737f1f6262

function FeeCalculator() {
  // https://tonviewer.com/config#25
  const lump_price = 400000;
  const bit_price = 26214400;
  const cell_price = 2621440000;
  const ihr_price_factor = 98304;
  const first_frac = 21845;
  const nano = 10 ** -9;
  const bit16 = 2 ** 16;

  const ihr_disabled = 0; // First of all define is ihr gonna be counted

  let fwd_fee =
    lump_price + Math.ceil((bit_price * 0 + cell_price * 0) / bit16);

  if (ihr_disabled) {
    var ihr_fee = 0;
  } else {
    var ihr_fee = Math.ceil((fwd_fee * ihr_price_factor) / bit16);
  }

  let total_fwd_fees = fwd_fee + ihr_fee;
  let gas_fees = 0.0011976; // Gas fees out of scope here
  let storage_fees = 0.000000003; // And storage fees as well
  let total_action_fees = +((fwd_fee * first_frac) / bit16).toFixed(9);
  let import_fee =
    lump_price + Math.ceil((bit_price * 528 + cell_price * 1) / bit16);
  let total_fee =
    gas_fees + storage_fees + total_action_fees * nano + import_fee * nano;

  return (
    <div>
      <p> Total fee: {+total_fee.toFixed(9)} TON</p>
      <p> Action fee: {+(total_action_fees * nano).toFixed(9)} TON </p>
      <p> Fwd fee: {+(total_fwd_fees * nano).toFixed(9)} TON </p>
      <p> Import fee: {+(import_fee * nano).toFixed(9)} TON </p>
      <p> IHR fee: {+(ihr_fee * nano).toFixed(9)} TON </p>
    </div>
  );
}
```

## Элементы комиссии за транзакцию

- `storage_fees` - это сумма, которую вы платите за хранение смарт-контракта в блокчейне. Фактически, вы платите за каждую секунду хранения смарт-контракта в блокчейне.
  - *Пример*: ваш кошелёк TON - это тоже смарт-контракт, и он платит комиссию за хранение каждый раз, когда вы получаете или отправляете транзакцию. Подробнее о [расчёте комиссии за хранение](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
- `in_fwd_fees` - это плата за импорт сообщений только из внешних источников, например, `external` сообщений. Каждый раз, когда вы совершаете транзакцию, её необходимо доставить валидаторам для обработки. Для обычных сообщений от контракта к контракту эта плата не взимается. Чтобы узнать больше о входящих сообщениях, прочтите [документацию TON Blockchain](https://docs.ton.org/tblkch.pdf).
  - *Пример*: каждая транзакция, которую вы совершаете через приложение-кошелёк (например, Tonkeeper), должна сначала распределиться между узлами валидации.
- `computation_fees` - это плата за выполнение кода в виртуальной машине. Чем больше код, тем выше плата.
  - *Пример*: каждый раз, когда вы отправляете транзакцию через кошелёк (который является смарт-контрактом), вы выполняете код вашего кошелька и платите за это.
- `action_fees` - это плата за отправку исходящих сообщений смарт-контрактом, обновление кода смарт-контракта, библиотек и т. д.
- `out_fwd_fees` - это плата за отправку сообщений за пределы блокчейна TON для взаимодействия с внешними сервисами (например, логами) и другими блокчейнами.

## FAQ

Вот самые часто задаваемые вопросы пользователями TON:

### Комиссия за отправку TON?

Средняя комиссия за отправку любого количества TON составляет 0.0055 TON.

### Комиссия за отправку Jettons?

Средняя комиссия за отправку любого количества пользовательских Jettons составляет 0.037 TON.

### Стоимость минта NFT?

Средняя комиссия за минт одного NFT составляет 0.08 TON.

### Стоимость хранения данных в TON?

Хранение 1 МБ данных в течение года в TON обойдётся в 6.01 TON. Учтите, что обычно вам не нужно хранить большие объёмы данных on-chain. Если вам необходимо децентрализованное хранение, воспользуйтесь [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon).

### Можно ли отправить транзакцию без газа?

В TON возможны транзакции без использования газа с помощью [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) - ретранслятора, который оплачивает комиссию за транзакцию.

### Как рассчитать?

В блокчейне TON есть статья о [расчете комиссий](/v3/guidelines/smart-contracts/fee-calculation).

## Ссылки

- Основано на [статье @thedailyton](https://telegra.ph/Commissions-on-TON-07-22), изначально написанной [menschee](https://github.com/menschee)\*

## См. также

- ["Обзор низкоуровневых комиссий"](/v3/documentation/smart-contracts/transaction-fees/fees-low-level) - ознакомьтесь с формулами для расчёта комиссий.
- [Функция смарт-контракта для расчета forward fees в FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)
