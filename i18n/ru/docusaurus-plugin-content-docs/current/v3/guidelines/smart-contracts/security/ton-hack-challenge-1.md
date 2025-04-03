# Подведение итогов TON Hack Challenge

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

TON Hack Challenge был проведен 23 октября.
В TON mainnet было развернуто несколько смарт-контрактов с искусственно созданными уязвимостями. Каждый контракт имел баланс 3000 или 5000 TON, что позволяло участникам взломать его и немедленно получить вознаграждение.

Исходный код и правила контеста были размещены на GitHub [здесь] (https://github.com/ton-blockchain/hack-challenge-1).

## Контракты

### 1. Паевой инвестиционный фонд

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте функции на наличие модификатора [`impure`](/v3/documentation/smart-contracts/func/docs/functions#impure-specifier).
:::

Первая задача была очень простой. Злоумышленник мог обнаружить, что функция `authorize` не является `impure `. Отсутствие этого модификатора позволяет компилятору пропускать вызовы этой функции, если она ничего не возвращает или возвращаемое значение не используется.

```func
() authorize (sender) inline {
  throw_unless(187, equal_slice_bits(sender, addr1) | equal_slice_bits(sender, addr2));
}
```

### 2. Банк

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте наличие [изменяющих/не изменяющих](/v3/documentation/smart-contracts/func/docs/statements#methods-calls) методов.
:::

`udict_delete_get?` вызывался с `.` вместо `~`, поэтому реальный словарь остался нетронутым.

```func
(_, slice old_balance_slice, int found?) = accounts.udict_delete_get?(256, sender);
```

### 3. DAO

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Используйте знаковые целые числа, если вам это действительно необходимо.
:::

Вес голоса хранился в сообщении как целое число. Злоумышленник мог отправить отрицательное значение при передаче веса голоса и получить бесконечное количество голосов.

```func
(cell,()) transfer_voting_power (cell votes, slice from, slice to, int amount) impure {
  int from_votes = get_voting_power(votes, from);
  int to_votes = get_voting_power(votes, to);

  from_votes -= amount;
  to_votes += amount;

  ;; No need to check that result from_votes is positive: set_voting_power will throw for negative votes
  ;; throw_unless(998, from_votes > 0);

  votes~set_voting_power(from, from_votes);
  votes~set_voting_power(to, to_votes);
  return (votes,());
}
```

### 4. Лотерея

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда рандомизируйте начальное значение перед выполнением [`rand()`](/v3/documentation/smart-contracts/func/docs/stdlib#rand)
:::

Начальное значение было получено из логического времени транзакции, и хакер может выиграть, применяя перебор логического времени в текущем блоке (потому что lt последовательно в пределах одного блока).

```func
int seed = cur_lt();
int seed_size = min(in_msg_body.slice_bits(), 128);

if(in_msg_body.slice_bits() > 0) {
    seed += in_msg_body~load_uint(seed_size);
}
set_seed(seed);
var balance = get_balance().pair_first();
if(balance > 5000 * 1000000000) {
    ;; forbid too large jackpot
    raw_reserve( balance - 5000 * 1000000000, 0);
}
if(rand(10000) == 7777) { ...send reward... }
```

### 5. Кошелек

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Помните, что все хранится в блокчейне.
:::

Кошелек был защищен паролем, его хеш был сохранен в данных контракта. Однако блокчейн помнит все - пароль был в истории транзакций.

### 6. Сейф

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Всегда проверяйте [отскочившие](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) сообщения.
Не забывайте об ошибках, вызванных [стандартными](/v3/documentation/smart-contracts/func/docs/stdlib/) функциями.
Сделайте свои условия максимально строгими.
:::

В сейфе есть следующий код в обработчике сообщений базы данных:

```func
int mode = null();
if (op == op_not_winner) {
    mode = 64; ;; Refund remaining check-TONs
               ;; addr_hash corresponds to check requester
} else {
     mode = 128; ;; Award the prize
                 ;; addr_hash corresponds to the withdrawal address from the winning entry
}
```

В сейфе нет обработчика отскоков или прокси-сообщений в базу данных, если пользователь отправляет "check". В базе данных можно установить `msg_addr_none` как адрес награды, поскольку `load_msg_address` позволяет это сделать. Мы запрашиваем проверку из сейфа, база данных пытается разобрать `msg_addr_none`, используя [`parse_std_addr`](/v3/documentation/smart-contracts/func/docs/stdlib#parse_std_addr), но это не удается. Сообщение отскакивает в сейф из базы данных, а операция не является `op_not_winner`.

### 7. Улучшенный банк

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Никогда не уничтожайте аккаунт ради забавы.
Используйте [`raw_reserve`](/v3/documentation/smart-contracts/func/docs/stdlib#raw_reserve) вместо того, чтобы отправлять деньги самому себе.
Подумайте о возможных условиях гонки.
Будьте осторожны с расходом газа при работе с hashmap.
:::

В контракте были условия гонки: вы могли внести деньги, а затем попытаться вывести их дважды с помощью параллельных сообщений. Нет гарантии, что сообщение с зарезервированными средствами будет обработано, поэтому банк может закрыться после второго вывода. После этого контракт мог быть развернут заново, и любой мог бы вывести невостребованные средства.

### 8. Dehasher

:::note ПРАВИЛО БЕЗОПАСНОСТИ
Избегайте выполнения стороннего кода в Вашем контракте.
:::

```func
slice try_execute(int image, (int -> slice) dehasher) asm "<{ TRY:<{ EXECUTE DEPTH 2 THROWIFNOT }>CATCH<{ 2DROP NULL }> }>CONT"   "2 1 CALLXARGS";

slice safe_execute(int image, (int -> slice) dehasher) inline {
  cell c4 = get_data();

  slice preimage = try_execute(image, dehasher);

  ;; restore c4 if dehasher spoiled it
  set_data(c4);
  ;; clean actions if dehasher spoiled them
  set_c5(begin_cell().end_cell());

  return preimage;
}
```

Не существует способа безопасно выполнить сторонний код в контракте, поскольку исключение [`out of gas`](/v3/documentation/tvm/tvm-exit-codes#standard-exit-codes) не может быть обработано `CATCH`. Злоумышленник просто может использовать [`COMMIT`](/v3/documentation/tvm/instructions#F80F) для любого состояния контракта и поднять `out of gas`.

## Заключение

Надеемся, эта статья прояснила некоторые неочевидные правила для разработчиков FunC.

## Ссылки

Автор оригинальной статьи: Dan Volkov

- [dvlkv на GitHub](https://github.com/dvlkv)
- [Оригинальная статья](https://dev.to/dvlkv/drawing-conclusions-from-ton-hack-challenge-1aep)
