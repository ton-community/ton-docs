import Feedback from '@site/src/components/Feedback';

# 随机数生成

Generating random numbers is a common task in many projects. 生成随机数是许多不同项目中常见的任务。你可能已经在FunC文档中看到过`random()`函数，但请注意，除非你采用一些额外的技巧，否则其结果很容易被预测。

## 如何预测随机数？

计算机在生成随机信息方面非常糟糕，因为它们只是遵循用户的指令。然而，由于人们经常需要随机数，他们设计了各种方法来生成_伪随机_数。 To address this, developers have created methods for generating pseudo-random numbers.

These algorithms typically require a _seed_ value to produce a sequence of _pseudo-random_ numbers. 这些算法通常要求你提供一个_seed_值，该值将被用来生成一系列_伪随机_数。因此，如果你多次运行相同的程序并使用相同的_seed_，你将始终得到相同的结果。在TON中，每个区块的_seed_是不同的。 In TON, the _seed_ varies for each block.

- [区块随机seed的生成](/develop/smart-contracts/security/random)

因此，要预测智能合约中`random()`函数的结果，你只需要知道当前区块的`seed`，如果你不是验证者，这是不可能的。

There are multiple approaches to generate random values, each offering different trade-offs between speed, security, and decentralization guarantees.

Below we outline three fundamental approaches:

---

## 只需在生成随机数之前调用`randomize_lt()`，你的随机数就会变得不可预测：

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

| Factor                    | 只需使用`randomize_lt()` | Block skipping | Commit-reveal |
| ------------------------- | -------------------- | -------------- | ------------- |
| Speed                     | Fast                 | Moderate       | Slow          |
| User resistance           | High                 | High           | Highest       |
| Validator resistance      | Low                  | Medium         | Highest       |
| Implementation complexity | Low                  | Medium         | High          |

---

:::caution
No method is universally perfect – choose based on:

- Value-at-risk in your application
- Required time-to-finality
- Trust assumptions about validators

:::

Always audit implementations through formal verification where possible.

<Feedback />
