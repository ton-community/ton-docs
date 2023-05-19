# Transaction layout

The raw TL-B scheme of a transaction looks as follows:

```tlb
transaction$0111 account_addr:bits256 lt:uint64
    prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
    outmsg_cnt:uint15
    orig_status:AccountStatus end_status:AccountStatus
    ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
    total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
    description:^TransactionDescr = Transaction;
```

Let's take a closer look at each field.

## account_addr:bits256

This is the hash part of the address on which the transaction was executed. The workchain part isn't stored here, as it is not needed because the transaction itself is already in a block with a specified workchain.

Read more about addresses:

-   [Address of Smart Contract](https://docs.ton.org/learn/overviews/addresses#address-of-smart-contract)

## lt:uint64

`lt` represents _Logical time_. You can read more about it here:

-   [What is a logical time](https://docs.ton.org/develop/smart-contracts/guidelines/message-delivery-guarantees#what-is-a-logical-time)

## prev_trans_hash:bits256

This is the hash of the previous transaction on this account.

## prev_trans_lt:uint64

The `lt` of the previous transaction on this account.

## now:uint32

The `now` value that was set when executing this transaction. It's a Unix timestamp in seconds.

## outmsg_cnt:uint15

This is the number of outgoing messages created while executing this transaction.

## orig_status:AccountStatus

The status of this account before the transaction was executed. It can be one of these:

```tlb
acc_state_uninit$00 = AccountStatus;
acc_state_frozen$01 = AccountStatus;
acc_state_active$10 = AccountStatus;
acc_state_nonexist$11 = AccountStatus;
```

## end_status:AccountStatus

The status of this account after executing the transaction.

## in_msg:(Maybe ^(Message Any))

This is the incoming message that triggered the execution of the transaction. In cases of special transactions such as _Storage_, _Tick_, _Tock_, _Split_, _Merge_, there may not be any message at all.

## out_msgs:(HashmapE 15 ^(Message Any))

This is the dictionary that contains the list of outgoing messages that were created while executing this transaction. The amount of these messages is stored in the `outmsg_cnt:uint15` field which was described above.

## total_fees:CurrencyCollection

The total amount of fees that were collected while executing this transaction. It consists of a _Toncoin_ value and possibly some [Extra-currencies](https://docs.ton.org/develop/dapps/defi/coins#extra-currencies).

## state_update:^(HASH_UPDATE Account)

The `HASH_UPDATE` structure has the following scheme:

```tlb
update_hashes#72 {X:Type} old_hash:bits256 new_hash:bits256
  = HASH_UPDATE X;
```

### old_hash:bits256

This is the hash of the account state before executing the transaction.

### new_hash:bits256

This is the hash of the account state after executing the transaction.

## description:^TransactionDescr

The last field is a detailed description of the transaction execution process. It has seven possible variations, depending on the transaction type.

### Ordinary

```tlb
trans_ord$0000 credit_first:Bool
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool bounce:(Maybe TrBouncePhase)
    destroyed:Bool
    = TransactionDescr;
```

#### credit_first:Bool

A flag that correlates with `bounce` flag of an incoming message. If it was received with `bounce = false`, then `credit_first = true`, and for `bounce = true` we get `credit_first = false`.

#### storage_ph:(Maybe TrStoragePhase) credit_ph:(Maybe TrCreditPhase) compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)

These fields contain information about phases of a transaction execution. Read more:

-   [Transactions and phases](https://docs.ton.org/learn/tvm-instructions/tvm-overview#transactions-and-phases)

#### aborted:Bool

Flag that indicates whether the transaction execution was aborted during _compute_ and _action_ phases.

#### bounce:(Maybe TrBouncePhase)

If the transaction execution failed, the bounce phase begins. A bounced message is sent to the receiver. Read more about bouncing:

-   [Non-bounceable messages](https://docs.ton.org/develop/smart-contracts/guidelines/non-bouncable-messages)

#### destroyed:Bool

Flag that indicates whether the account was destroyed during the execution of the transaction. It usually can happen when the contract sends an outgoing message with `mode = 160` that destroys itself.

### Storage

```tlb
trans_storage$0001 storage_ph:TrStoragePhase
    = TransactionDescr;
```

### Tick-tock

```tlb
trans_tick_tock$001 is_tock:Bool storage_ph:TrStoragePhase
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool = TransactionDescr;
```

### Split prepare

```tlb
trans_split_prepare$0100 split_info:SplitMergeInfo
    storage_ph:(Maybe TrStoragePhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```

### Split install

```tlb
trans_split_install$0101 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    installed:Bool = TransactionDescr;
```

### Merge prepare

```tlb
trans_merge_prepare$0110 split_info:SplitMergeInfo
    storage_ph:TrStoragePhase aborted:Bool
    = TransactionDescr;
```

### Merge install

```tlb
trans_merge_install$0111 split_info:SplitMergeInfo
    prepare_transaction:^Transaction
    storage_ph:(Maybe TrStoragePhase)
    credit_ph:(Maybe TrCreditPhase)
    compute_ph:TrComputePhase action:(Maybe ^TrActionPhase)
    aborted:Bool destroyed:Bool
    = TransactionDescr;
```
