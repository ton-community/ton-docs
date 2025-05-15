import Feedback from '@site/src/components/Feedback';

# Random number generation

Generating random numbers is a common task in many projects. While you may have seen the `random()` function in FunC documentation, note that its result can be easily predicted unless you use additional techniques.

## How can someone predict a random number?

Computers struggle to generate truly random information because they strictly follow user instructions. To address this, developers have created methods for generating pseudo-random numbers.

These algorithms typically require a _seed_ value to produce a sequence of _pseudo-random_ numbers. You will always get the same result if you run the same program with the same _seed_ multiple times. In TON, the _seed_ varies for each block.

- [Generation of block random seed](/v3/guidelines/smart-contracts/security/random)

To predict the result of the `random()` function in a smart contract, one would need to know the current `seed` of the block, which is impossible unless you are a validator.

There are multiple approaches to generate random values, each offering different trade-offs between speed, security, and decentralization guarantees.

Below we outline three fundamental approaches:

---

## Approach 1: randomize_lt {#randomize_lt}

**Mechanism**: Generates [randomness using block logical time](https://docs.ton.org/v3/guidelines/smart-contracts/security/ton-hack-challenge-1/#4-lottery) (`lt`) and blockchain entropy.  
**Security model**:

- ✅ Safe against user manipulation
- ❌ Vulnerable to colluding validators (could theoretically predict/influence values)

**Speed**: Fast (single-block operation)  
**Use cases**:

- Non-critical applications, for example gaming & NFTs
- Scenarios where validator trust is assumed

---

## Approach 2: block skipping {#block-skip}

**Mechanism**: Uses [entropy from skipped blocks](https://github.com/puppycats/ton-random?tab=readme-ov-file#ton-random) in blockchain history.  
**Security model**:

- ✅ Resistant to user manipulation
- ⚠️ Not fully secure against determined validators (may influence block inclusion timing)

**Speed**: Slow (requires multiple blocks to finalize)  
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

**Speed**: Very slow (multi-phase, multi-block process)  
**Use cases**:

- High-value applications, for example decentralized auctions
- Systems requiring Byzantine fault tolerance

---

## Key considerations

| Factor                    | `randomize_lt` | Block skipping | Commit-reveal |
| ------------------------- | -------------- | -------------- | ------------- |
| Speed                     | Fast           | Moderate       | Slow          |
| User resistance           | High           | High           | Highest       |
| Validator resistance      | Low            | Medium         | Highest       |
| Implementation complexity | Low            | Medium         | High          |

---

:::caution
No method is universally perfect – choose based on:

- Value-at-risk in your application
- Required time-to-finality
- Trust assumptions about validators

:::


Always audit implementations through formal verification where possible.

<Feedback />
