# Random number generation

Generating random numbers is a common task in many projects. While you may have seen the `random()` function in FunC documentation, note that its result can be easily predicted unless you use additional techniques.

## How can someone predict a random number?

Computers struggle to generate truly random information because they strictly follow user instructions. To address this, developers have created methods for generating pseudo-random numbers.

These algorithms typically require a _seed_ value to produce a sequence of _pseudo-random_ numbers. You will always get the same result if you run the same program with the same _seed_ multiple times. In TON, the _seed_ varies for each block.

- [Generation of block random seed](/v3/guidelines/smart-contracts/security/random)

To predict the result of the `random()` function in a smart contract, one would need to know the current `seed` of the block, which is impossible unless you are a validator.

# Approaches and security considerations

There are multiple methods for generating random values, each with distinct trade-offs between speed, security, and decentralization guarantees.

Below we outline three fundamental approaches:

---

## Approach 1: randomize_lt

**Mechanism**: Generates randomness using block logical time (`lt`) and blockchain entropy.  
**Security Model**:

- ✅ Safe against user manipulation
- ❌ Vulnerable to colluding validators (could theoretically predict/influence values)

**Speed**: Fast (single-block operation)  
**Use Cases**:

- Non-critical applications, for example gaming & NFTs
- Scenarios where validator trust is assumed

---

## Approach 2: Block skipping

**Mechanism**: Uses entropy from skipped blocks in blockchain history.  
**Security Model**:

- ✅ Resistant to user manipulation
- ⚠️ Not fully secure against determined validators (may influence block inclusion timing)

**Speed**: Slow (requires multiple blocks to finalize)  
**Use Cases**:

- Medium-stakes applications, for example lottery systems
- Scenarios with partial trust in validator set

---

## Approach 3: Commit-reveal scheme

**Mechanism**:

1. **Commit Phase**: Participants submit hashed secrets
2. **Reveal Phase**: Secrets are disclosed and combined to generate final randomness

**Security Model**:

- ✅ Cryptographically secure when properly implemented
- ✅ Resilient to both users and validators
- ⚠️ Requires protocol-level verification of commitments

**Speed**: Very slow (multi-phase, multi-block process)  
**Use Cases**:

- High-value applications, for example decentralized auctions
- Systems requiring Byzantine fault tolerance

---

### **Key Considerations**

| Factor                    | `randomize_lt` | Block skipping | Commit-reveal |
| ------------------------- | -------------- | -------------- | ------------- |
| Speed                     | Fast           | Moderate       | Slow          |
| User Resistance           | High           | High           | Highest       |
| Validator Resistance      | Low            | Medium         | Highest       |
| Implementation Complexity | Low            | Medium         | High          |

---

:::caution
No method is universally perfect – choose based on:

- Value-at-risk in your application
- Required time-to-finality
- Trust assumptions about validators

:::

Always audit implementations through formal verification where possible.

For working examples, refer to [randomization contracts example](https://github.com/puppycats/ton-random).
