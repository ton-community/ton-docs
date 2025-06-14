import Feedback from '@site/src/components/Feedback';

# Transaction fees

모든 TON 사용자는 _수수료가 여러 요인에 따라 달라진다는 점을 명심해야 합니다.

## 가스

모든 [계산 비용](/v3/documentation/스마트-계약/거래 수수료/수수료-저수준#계산 수수료)은 가스 단위로 지정되며 특정 가스 금액으로 고정되어 있습니다.

가스 단위의 가격은 [체인 구성](https://tonviewer.com/config#20)에 의해 결정되며 검증인의 합의에 의해서만 변경될 수 있습니다. 다른 시스템과 달리 사용자가 직접 가스 가격을 설정할 수 없으며, 수수료 시장도 존재하지 않습니다.

현재 베이스체인의 설정은 다음과 같습니다: 가스 1단위는 400나노톤입니다.

```cpp
1 gas = 26214400 / 2^16 nanotons = 0.000 000 4 TON
```

마스터체인의 현재 설정은 다음과 같습니다: 가스 1단위는 10000나노톤입니다.

```cpp
1 gas = 655360000 / 2^16 nanotons = 0.000 01 TON
```

### 평균 거래 비용

> **TLDR:** Today, basic transaction costs around **~0.0025 TON**

Even if TON price increases 100 times, transactions will remain ultra-cheap; about $0.01. Moreover, validators may lower this value if they see commissions have become expensive [read why they're interested](#gas-changing-voting-process).

:::info
현재 가스 양은 마스터체인과 베이스체인의 네트워크 구성 [파라미터 20](https://tonviewer.com/config#20)과 [파라미터 21](https://tonviewer.com/config#21)에 각각 기록되어 있습니다.
:::

### 가스 변경 투표 프로세스

가스 요금은 TON의 다른 많은 매개변수와 마찬가지로 설정할 수 있으며, 메인넷에서 특별 투표를 통해 변경할 수 있습니다.

Changing any parameter requires approval from 66% of the validators' votes.

#### 가스비가 더 많이 들 수 있나요?

> _Does it mean that one day gas prices could rise by 1,000 times or even more?_

엄밀히 말하면 맞지만 실제로는 그렇지 않습니다.

검증자는 거래 처리에 대해 소액의 수수료를 받는데, 수수료를 더 많이 부과하면 거래 수가 감소하여 검증 프로세스의 수익성이 떨어질 수 있습니다.

### 수수료는 어떻게 계산되나요?

TON의 수수료는 트랜잭션 실행 시간, 계정 상태, 메시지 내용 및 크기, 블록체인 네트워크 설정, 트랜잭션이 전송될 때까지 계산할 수 없는 기타 여러 변수에 따라 달라지기 때문에 미리 계산하기 어렵습니다.

That is why NFT marketplaces typically require an extra amount of TON (~1 TON) and refund the remaining amount (1 - transaction_fee) after the transaction.

:::info
Each contract should check incoming messages for the amount of TON attached to ensure it is enough to cover the fees.

수수료 계산 공식에 대한 자세한 내용은 [낮은 수준의 수수료 개요](/v3/documentation/스마트-계약/거래 수수료/수수료-낮은 수준)를, 새로운 TVM 옵코드를 사용하여 FunC 계약에서 수수료를 계산하는 방법을 알아보려면 [수수료 계산](/v3/guidelines/스마트-계약/수수료 계산)을 확인하세요.
:::

하지만 TON에서 수수료가 어떻게 작동하는지에 대해 자세히 알아보세요.

## Basic fees formula

TON에 대한 수수료는 이 공식에 따라 계산됩니다:

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

## Elements of transaction fee

- `storage_fees` is the amount you pay for storing a smart contract in the blockchain. In fact, you pay for every second the smart contract is stored on the blockchain.
  - _Example_: your TON wallet is also a smart contract, and it pays a storage fee every time you receive or send a transaction. Read more about [how storage fees are calculated](/v3/documentation/smart-contracts/transaction-fees/fees-low-level#storage-fee).
- `in_fwd_fees` is a charge for importing messages only from outside the blockchain, e.g. `external` messages. Every time you make a transaction, it must be delivered to the validators who will process it. For ordinary messages from contract to contract this fee is not applicable. Read [the TON Blockchain paper](https://docs.ton.org/tblkch.pdf) to learn more about inbound messages.
  - _Example_: each transaction you make with your wallet app (like Tonkeeper) requires first to be distributed among validation nodes.
- `computation_fees` is the amount you pay for executing code in the virtual machine. The larger the code, the more fees must be paid.
  - _Example_: each time you send a transaction with your wallet (which is a smart contract), you execute the code of your wallet contract and pay for it.
- `action_fees` is a charge for sending outgoing messages made by a smart contract, updating the smart contract code, updating the libraries, etc.
- `out_fwd_fees` stands for a charge for sending messages outside the TON Blockchain to interact with off-chain services (e.g., logs) and external blockchains.

## FAQ

Here are the most frequently asked questions by visitors of TON:

### Fees for sending TON?

The average fee for sending any amount of TON is 0.0055 TON.

### Fees for sending Jettons?

The average fee for sending any amount of a custom Jettons is 0.037 TON.

### Cost of minting NFTs?

The average fee for minting one NFT is 0.08 TON.

### Cost of saving data in TON?

Saving 1 MB of data for one year on TON will cost 6.01 TON. Note that you usually don't need to store large amounts of data on-chain. Consider using [TON Storage](/v3/guidelines/web3/ton-storage/storage-daemon) if you need decentralized storage.

### Is it possible to send a gasless transaction?

In TON, gasless transactions are possible using [wallet v5](/v3/documentation/smart-contracts/contracts-specs/wallet-contracts#preparing-for-gasless-transactions) a relayer that pays the gas fee for transaction.

### How to calculate fees?

There is an article about [fee calculation](/v3/guidelines/smart-contracts/fee-calculation) in TON Blockchain.

## References

- Based on the [@thedailyton article](https://telegra.ph/Commissions-on-TON-07-22) - _[menschee](https://github.com/menschee)_

## See also

- [Low-level fees overview](/v3/documentation/smart-contracts/transaction-fees/fees-low-level)—read about the formulas for calculating commissions.
- [Smart contract function to calculate forward fees in FunC](https://github.com/ton-blockchain/token-contract/blob/main/misc/forward-fee-calc.fc)

<Feedback />

