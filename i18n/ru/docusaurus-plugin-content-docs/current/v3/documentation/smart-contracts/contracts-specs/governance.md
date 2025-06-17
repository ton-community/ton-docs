import Feedback from '@site/src/components/Feedback';

# Контракты управления

В TON параметры консенсуса работы узла, связанные с TVM, catchain, комиссиями и топологией цепи (а также то, как эти параметры хранятся и обновляются), контролируются набором специальных смарт-контрактов – в отличие от устаревших и негибких способов хардкода этих параметров, принятых в блокчейнах предыдущих поколений. Таким образом, TON реализует всеобъемлющее и прозрачное on-chain управление. Сам набор специальных смарт-контрактов регулируется параметрами,  и в настоящее время включает в себя контракты [_Избирателя_](https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/governance#elector "Elector"), [_Конфигурации_](https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/governance#config "Config"), и _DNS_, а в будущем будет расширен за счет _extra-currency Minter_ и др.

## Elector

Смарт-контракт Elector (Избиратель) управляет тем, как раунды валидации сменяют друг друга, кто получает обязанность валидировать блокчейн и как будет распределяться вознаграждение за валидацию. Если вы хотите стать валидатором и взаимодействовать с избирателем, ознакомьтесь с [инструкциями валидатора](https://ton.org/validator).

### Data storage

The Elector stores:

- Non-withdrawn Toncoin in the `credits` hashmap.
- New validator applications in the `elect` hashmap.
- Past election data in the `past_elections` hashmap (including complaints and `frozen` stakes held for `stake_held_for` periods, defined in **ConfigParam 15**).

### Key functions

1. **Process validator applications**
2. Проведение выборов
3. **Handle validator misbehavior reports**
4. **Distribute validation rewards**

#### Обработка заявок

To apply, a validator must:

1. Чтобы создать заявку, будущий валидатор должен сформировать специальное сообщение, содержащее соответствующие параметры (адрес ADNL, публичный ключ, `max_factor` и т.д.), прикрепить его к некоторой сумме TON (называемой ставкой) и отправить Избирателю.
2. Избиратель, в свою очередь, проверяет эти параметры и либо регистрирует заявку, либо сразу же возвращает ставку обратно отправителю.\
  _Note:_ Only masterchain addresses can apply.

### Проведение выборов

Избиратель – это специальный смарт-контракт, который имеет возможность принудительно вызываться в начале и в конце каждого блока (так называемые Tick и Tock транзакции). Избиратель, действительно, вызывается на каждом блоке и проверяет, не пора ли провести новые выборы.

**Process details:**

- Take applications with stake ≥ `min_stake` (**ConfigParam 17**).
- Происходит сортировка заявок по ставке в порядке убывания.
- Избиратель принимает все заявки с суммой ставки, превышающей текущий сетевой минимум `min_stake` (ConfigParam 17).
- For each subset size `i` (from 1 to remaining candidates):
  - Assume the `i`-th candidate (lowest in the subset) defines the baseline.
  - Calculate effective stake (`true_stake`) for each `j`-th candidate (`j < i`) as:

```
Другими словами, эффективная ставка *j*-го заявителя (`j<i`) рассчитывается как `min(stake[i]*max_factor[j], stake[j])`,
```

- Вычисляется общая эффективная ставка (TES – total effective stake) участников с 1-го по _i_-й.
- Submit the winning validator set to the **Config** contract.
- Return unused stakes and excess amounts (e.g., `stake[j] - min(stake[i] * max_factor[j], stake[j])`) to `credits`.

**Example breakdown**:

- **Case 1**: 9 candidates stake 100,000 TON (`max_factor=2.7`), 1 candidate stakes 10,000.

  - _Without the 10k candidate_: TES = 900,000.
  - _With the 10k candidate_: TES = 9 \* 27,000 + 10,000 = 253,000.
  - **Result**: 10k candidate is excluded.

- **Case 2**: 1 candidate stakes 100,000 (`max_factor=2.7`), 9 stake 10,000.
  - Effective stake for the 100k candidate: `10,000 * 2.7 = 27,000`.
  - Excess: `100,000 - 27,000 = 73,000` → sent to `credits`.
  - **Result**: All 10 participate.

**Election constraints**:

- Если участников больше, чем максимальное количество валидаторов (`max_validators` ConfigParam 16), список сокращается с конца.
- Stakes must satisfy:
  - `min_stake` ≤ stake ≤ `max_stake`
  - `min_total_stake` ≤ total stake ≤ `max_total_stake`
  - Stake ratios ≤ `max_stake_factor` (**ConfigParam 17**).
- If conditions aren’t met, elections **postponed**.

### Обработка отчетов о неправильной работе валидатора

Каждый валидатор время от времени случайным образом получает задание создать новый блок (если через несколько секунд валидатор не справляется, эта обязанность переходит к следующему валидатору). Частота таких назначений определяется весом валидатора. After a validation round, anyone can audit the blocks to check whether the actual number of blocks produced by a validator significantly deviates from the expected number (based on their weight). Статистически значимое отклонение (когда количество сгенерированных блоков меньше ожидаемого) означает, что валидатор ведет себя неправильно.

To report misbehavior, a user must:

1. Generate a **Merkle proof** demonstrating the validator's failure to produce the expected blocks.
2. Propose a fine proportional to the severity of the offense.
3. Submit the proof and fine proposal to the Elector contract, covering the associated storage costs.

The Elector registers the complaint in the `past_elections` hashmap. Current round validators then verify the complaint. Затем каждый валидатор текущего раунда проверяет жалобу, и если она верна и предложенный штраф соответствует серьезности ошибки, валидаторы голосует за нее. Approval requires agreement from over **two-thirds of the total validator weight** (not just a majority of participants).

The fine is deducted from the validator's `frozen` stake in the relevant `past_elections` record if approved. These funds stay locked for the period defined by **ConfigParam 15** (`stake_held_for`).

#### Распределение вознаграждений за валидацию

The Elector releases `frozen` stakes and rewards (gas fees + block rewards) proportionally to past validators. Funds move to `credits`, and the election record clears from `past_elections`.

### Текущее состояние избирателя

Track live data (elections, stakes, complaints) via this [dapp](https://1ixi1.github.io/elector/).

## Config

The **Config** contract manages TON’s configuration parameters, validator set updates, and proposal voting.

### Регулярное обновление набора валидаторов

1. The **Elector** notifies **Config** of a new validator set.
2. **Config** stores it in **ConfigParam 36** (_next validators_).
3. At the scheduled time (`utime_since`), **Config**:
  - Moves the old set to **ConfigParam 32** (_previous validators_).
  - Promotes **ConfigParam 36** to **ConfigParam 34** (_current validators_).

### Механизм предложения/голосования

1. **Submit a proposal**: Pay storage fees to propose parameter changes.
2. **Vote**: Validators (from **ConfigParam 34**) sign approval messages.
3. **Outcome**:
  - **Approved**: After `min_wins` rounds (**ConfigParam 11**) with ≥3/4 weighted votes.
  - **Rejected**: After `max_losses` rounds.
  - _Critical parameters_ (**ConfigParam 10**) require more rounds.

#### Экстренное обновление

- Reserved indexes (`-999`, `-1000`, `-1001`) allow urgent updates to **Config**/**Elector** code.
- A temporary emergency key (assigned to the TON Foundation in 2021) accelerated fixes but couldn't alter contracts.
- **Key retired** on Nov 22, 2023 (**block 34312810**), replaced with zeros.
- Later patched to a fixed byte sequence (`sha256("Not a valid curve point")`) to prevent exploits.

**Historical uses**:

- **Apr 2022**: Increased gas limits (**blocks 19880281/19880300**) to unblock elections.
- 2 марта 2023 г. количество заявок на участие в выборах выросло настолько, что даже `20m` не хватало для проведения выборов. Однако на этот раз мастерчейн продолжал обрабатывать внешние сообщения благодаря повышенному `hard_limit`. Аварийный ключ был использован для обновления ConfigParam 20 `special_gas_limit` до `25m` и `block_gas_limit` до `27m` (в блоке `27747086`). В результате выборы были успешно проведены в следующем блоке.

## См. также

- [Предварительно скомпилированные контракты](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts)

<Feedback />

