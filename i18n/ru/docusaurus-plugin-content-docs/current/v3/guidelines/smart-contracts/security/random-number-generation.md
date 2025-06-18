import Feedback from '@site/src/components/Feedback';

# Генерация случайных чисел

Генерация случайных чисел - распространенная задача, которая может понадобиться Вам в самых разных проектах. Возможно, Вы уже встречали функцию `random()` в документации FunC, но обратите внимание на то, что ее результат можно легко предсказать, если не использовать некоторые дополнительные приемы.

## Как кто-то может предсказать случайное число?

Компьютеры ужасны в генерировании случайной информации, поскольку все, что они делают, - это следуют инструкциям пользователей. Однако, поскольку людям часто нужны случайные числа, они придумали различные методы генерации _псевдослучайных_ чисел.

Эти алгоритмы обычно требуют от Вас указать значение _seed'a_, которое будет использовано для генерации последовательности _псевдослучайных_ чисел. Таким образом, если Вы запустите одну и ту же программу с одним и тем же _seed_ несколько раз, Вы неизменно получите один и тот же результат. В TON _seed_ для каждого блока разное.

- [Генерация случайного seed блока](/v3/guidelines/smart-contracts/security/random)

Поэтому, чтобы предсказать результат работы функции `random()` в смарт-контракте, Вам просто нужно знать текущий `seed` блока, что невозможно, если Вы не являетесь валидатором.

There are multiple approaches to generate random values, each offering different trade-offs between speed, security, and decentralization guarantees.

Below we outline three fundamental approaches:

---

## Просто используйте `randomize_lt()`.

**Mechanism**: Generates [randomness using block logical time](/v3/guidelines/smart-contracts/security/ton-hack-challenge-1/#4-lottery) (`lt`) and blockchain entropy.\
**Security model**:

- ✅ Safe against user manipulation
- ❌ Vulnerable to colluding validators (could theoretically predict/influence values)

**Speed**: Fast (single-block operation)\
**Use cases**:

- Non-critical applications, for example gaming & NFTs
- Scenarios where validator trust is assumed

---

## Approach 2: block skipping {#block-skip}

**Mechanism**: Uses [entropy from skipped blocks](https://github.com/puppycats/ton-random?tab=readme-ov-file#ton-random) in blockchain history.\
**Security model**:

- ✅ Resistant to user manipulation
- ⚠️ Not fully secure against determined validators (may influence block inclusion timing)

**Speed**: Slow (requires multiple blocks to finalize)\
**Use cases**:

- Medium-stakes applications, for example lottery systems
- Scenarios with partial trust in validator set

---

## Approach 3: commit-reveal scheme {#commit-reveal}

**Mechanism**:

1. **Commit phase**: Participants submit hashed secrets
2. **Reveal phase**: Secrets are disclosed and combined to generate final randomness

**Security model**:

- ✅ Cryptographically secure when properly implemented
- ✅ Resilient to both users and validators
- ⚠️ Requires protocol-level verification of commitments

**Speed**: Very slow (multi-phase, multi-block process)\
**Use cases**:

- High-value applications, for example decentralized auctions
- Systems requiring Byzantine fault tolerance

---

## Key considerations

| Factor                    | Просто добавьте вызов `randomize_lt()` перед генерацией случайных чисел, и Ваши случайные числа станут непредсказуемыми: | Block skipping | Commit-reveal |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| Speed                     | Fast                                                                                                                                     | Moderate       | Slow          |
| User resistance           | High                                                                                                                                     | High           | Highest       |
| Validator resistance      | Low                                                                                                                                      | Medium         | Highest       |
| Implementation complexity | Low                                                                                                                                      | Medium         | High          |

---

:::caution
No method is universally perfect – choose based on:

- Value-at-risk in your application
- Required time-to-finality
- Trust assumptions about validators

:::

Always audit implementations through formal verification where possible.

<Feedback />
