import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Single Nominator Pool

The [Single Nominator](https://github.com/ton-blockchain/single-nominator) is a secure firewall smart contract for TON validators with sufficient self-stake. This simplified alternative to the [Nominator Pool](/v3/documentation/smart-contracts/contracts-specs/nominator-pool) supports only one nominator, significantly reducing attack surface while maintaining full functionality.

## Key Benefits

- **Enhanced security** through reduced complexity (single nominator model)
- **Cold wallet protection** of staking funds
- **Emergency recovery** mechanisms
- **Certik-audited** implementation ([Audit Report](https://github.com/ton-blockchain/single-nominator/blob/main/certik-audit.pdf))

## Official Code Hashes

Always verify at [verifier.ton.org](https://verifier.ton.org):

**v1.0**  
`pCrmnqx2/+DkUtPU8T04ehTkbAGlqtul/B2JPmxx9bo=`

**v1.1** (with withdrawal comments)  
`zA05WJ6ywM/g/eKEVmV6O909lTlVrj+Y8lZkqzyQT70=`

## Architecture

![Single Nominator Architecture](/img/nominator-pool/single-nominator-architecture.png)

### Dual-Role Design

| Role          | Wallet Type | Capabilities                                     |
| ------------- | ----------- | ------------------------------------------------ |
| **Owner**     | Cold wallet | Funds custody, withdrawals, validator management |
| **Validator** | Hot wallet  | Block signing, election participation            |

### Workflow Cycle

1. Owner deposits stake from cold wallet → SingleNominator contract
2. Validator node (via MyTonCtrl) initiates election participation
3. Contract stakes funds with Elector
4. Post-election, validator recovers stake
5. Owner can withdraw funds anytime

## Security Features

### Mitigated Attack Vectors

1. **Validator compromise**

   - Hot wallet cannot withdraw funds
   - Owner can change validator address

2. **Gas drainage attacks**

   - Gas fees paid from validator wallet (separate from stake)

3. **Emergency recovery**

   - Direct raw message sending capability
   - Contract code upgrades possible

4. **Message validation**
   - Strict Elector message format checking

## Comparison of Validation Solutions

### 1. Simple Hot Wallet

![Hot Wallet](/img/nominator-pool/hot-wallet.png)  
❌ **Insecure**: Private key exposure risks fund theft

### 2. Restricted Wallet

![Restricted Wallet](/img/nominator-pool/restricted-wallet.png)  
⚠️ **Unmaintained**: Vulnerable to gas drainage attacks

### 3. Nominator Pool (40 Nominators)

![Nominator Pool](/img/nominator-pool/nominator-pool.png)  
✅ **Secure but complex**: Large attack surface

### 4. Single Nominator (Recommended)

![Single Nominator](/img/nominator-pool/single-nominator-architecture.png)  
✅ **Optimal security**: Simplified single-nominator model

## Owner Operations

### 1. Withdraw Funds

**Message Format**:  
`opcode=0x1000` + `query_id` + `withdraw_amount`

**Methods**:

- **Hot wallet** (not recommended):
  ```bash
  ts-node scripts/ts/withdraw-deeplink.ts <contract_addr> <amount>
  ```
- **Cold wallet** (recommended):
  ```bash
  fift -s scripts/fif/withdraw.fif <amount>
  # Then sign and send wallet-query.boc
  ```

### 2. Change Validator Address

**Message Format**:  
`opcode=0x2000` + `query_id` + `new_validator_addr`

**Methods**:

- Hot wallet:
  ```bash
  ts-node scripts/ts/change-validator-deeplink.ts <contract_addr> <new_addr>
  ```
- Cold wallet:
  ```bash
  fift -s scripts/fif/change-validator.fif <new_addr>
  # Then sign and send wallet-query.boc
  ```

### 3. Emergency Raw Message (opcode=0x7702)

For Elector interface changes or special recovery scenarios

### 4. Contract Upgrade (opcode=0x9903)

⚠️ Extreme emergencies only - replaces contract code

## See Also

- [Single Nominator GitHub](https://github.com/ton-blockchain/single-nominator)
- [Usage Guide](/v3/guidelines/smart-contracts/howto/single-nominator-pool)
- [Legacy Orbs Implementation](https://github.com/orbs-network/single-nominator)
