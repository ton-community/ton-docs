import Feedback from '@site/src/components/Feedback';

# Governance contracts

In TON, a set of special smart contracts controls consensus parameters for node operation - including TVM, catchain, fees, and chain topology - and how these parameters are stored and updated. Unlike older blockchains that hardcode these parameters, TON enables transparent on-chain governance. The current governance contracts include the **Elector**, **Config**, and **DNS** contracts, with expansion plans (e.g., extra-currency **Minter**).

## Elector

The **Elector** smart contract manages validator elections, validation rounds, and reward distribution. To become a validator and interact with the Elector, follow the [validator instructions](https://ton.org/validator).

### Data storage

The Elector stores:

- Non-withdrawn Toncoin in the `credits` hashmap.
- New validator applications in the `elect` hashmap.
- Past election data in the `past_elections` hashmap (including complaints and `frozen` stakes held for `stake_held_for` periods, defined in **ConfigParam 15**).

### Key functions

1. **Process validator applications**
2. **Conduct elections**
3. **Handle validator misbehavior reports**
4. **Distribute validation rewards**

#### Processing applications

To apply, a validator must:

1. Send a message to the Elector with their ADNL address, public key, `max_factor`, and stake (TON amount).
2. The Elector validates the parameters and either registers the application or refunds the stake.  
   _Note:_ Only masterchain addresses can apply.

### Conducting elections

The Elector is a special smart contract that triggers **Tick and Tock transactions** (forced executions at the start and end of each block). It checks whether it’s time to conduct a new election during each block.

**Process details:**

- Take applications with stake ≥ `min_stake` (**ConfigParam 17**).
- Arrange candidates by stake in descending order.
- If applicants exceed `max_validators` (**ConfigParam 16**), discard the lowest-staked candidates.
- For each subset size `i` (from 1 to remaining candidates):
  - Assume the `i`-th candidate (lowest in the subset) defines the baseline.
  - Calculate effective stake (`true_stake`) for each `j`-th candidate (`j < i`) as:

```
min(stake[i] * max_factor[j], stake[j])
```

- Track the subset with the highest **total effective stake (TES)**.
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

- `min_validators` ≤ participants ≤ `max_validators` (**ConfigParam 16**).
- Stakes must satisfy:
  - `min_stake` ≤ stake ≤ `max_stake`
  - `min_total_stake` ≤ total stake ≤ `max_total_stake`
  - Stake ratios ≤ `max_stake_factor` (**ConfigParam 17**).
- If conditions aren’t met, elections **postponed**.

### Process of reporting validator misbehavior

Each validator is periodically assigned the duty to create new blocks, with the frequency of assignments determined by their weight. After a validation round, anyone can audit the blocks to check whether the actual number of blocks produced by a validator significantly deviates from the expected number (based on their weight). A statistically significant underperformance (e.g., fewer blocks created than expected) constitutes misbehavior.

To report misbehavior, a user must:

1. Generate a **Merkle proof** demonstrating the validator's failure to produce the expected blocks.
2. Propose a fine proportional to the severity of the offense.
3. Submit the proof and fine proposal to the Elector contract, covering the associated storage costs.

The Elector registers the complaint in the `past_elections` hashmap. Current round validators then verify the complaint. If the proof is valid and the proposed fine aligns with the severity of the misbehavior, validators vote on the complaint. Approval requires agreement from over **two-thirds of the total validator weight** (not just a majority of participants).

The fine is deducted from the validator's `frozen` stake in the relevant `past_elections` record if approved. These funds stay locked for the period defined by **ConfigParam 15** (`stake_held_for`).

#### Distributing rewards

The Elector releases `frozen` stakes and rewards (gas fees + block rewards) proportionally to past validators. Funds move to `credits`, and the election record clears from `past_elections`.

### Current Elector state

Track live data (elections, stakes, complaints) via this [dapp](https://1ixi1.github.io/elector/).

## Config

The **Config** contract manages TON’s configuration parameters, validator set updates, and proposal voting.

### Validator set updates

1. The **Elector** notifies **Config** of a new validator set.
2. **Config** stores it in **ConfigParam 36** (_next validators_).
3. At the scheduled time (`utime_since`), **Config**:
   - Moves the old set to **ConfigParam 32** (_previous validators_).
   - Promotes **ConfigParam 36** to **ConfigParam 34** (_current validators_).

### Proposal/voting mechanism

1. **Submit a proposal**: Pay storage fees to propose parameter changes.
2. **Vote**: Validators (from **ConfigParam 34**) sign approval messages.
3. **Outcome**:
   - **Approved**: After `min_wins` rounds (**ConfigParam 11**) with ≥3/4 weighted votes.
   - **Rejected**: After `max_losses` rounds.
   - _Critical parameters_ (**ConfigParam 10**) require more rounds.

#### Emergency updates

- Reserved indexes (`-999`, `-1000`, `-1001`) allow urgent updates to **Config**/**Elector** code.
- A temporary emergency key (assigned to the TON Foundation in 2021) accelerated fixes but couldn't alter contracts.
- **Key retired** on Nov 22, 2023 (**block 34312810**), replaced with zeros.
- Later patched to a fixed byte sequence (`sha256("Not a valid curve point")`) to prevent exploits.

**Historical uses**:

- **Apr 2022**: Increased gas limits (**blocks 19880281/19880300**) to unblock elections.
- **Mar 2023**: Raised `special_gas_limit` to 25M (**block 27747086**) for election throughput.

## See also

- [Precompiled contracts](/v3/documentation/smart-contracts/contracts-specs/precompiled-contracts)

<Feedback />

