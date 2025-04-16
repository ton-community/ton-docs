import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Wallet contracts types
You may have heard about different versions of wallets on the TON Blockchain. 
But what exactly do these versions mean, and how do they differ?

In this article, we’ll break down the various versions and modifications of TON wallets.


:::info
Before we start, there are a few terms and concepts you should be familiar with to understand this article fully:
 - [Message management](/v3/documentation/smart-contracts/message-management/messages-and-transactions), because this is the main functionality of the wallets.
 - [FunC language](/v3/documentation/smart-contracts/func/overview), because we will heavily rely on implementations made using it.
:::

## Common concept

To break the tension, it’s important to understand that wallets in the TON ecosystem are not a special type of entity. They are simply smart contracts composed of code and data; in that sense, they are no different from any other actor (i.e., smart contract) on TON.

Like any custom smart contract, wallets can receive both external and internal messages, send internal messages and logs, and provide get methods. So, the key question is: what functionality do they provide, and how does it differ across versions?

You can consider each wallet version as a specific smart contract implementation providing a standard external interface. This interface allows different external clients to interact with the wallets in the same way. You can find these implementations in FunC and Fift languages in the main TON monorepo:

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## Basic wallets

### Wallet V1

This is the simplest wallet version. It allows you to send up to four transactions simultaneously and performs only basic checks—your signature and the seqno.
Wallet source code:

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

This version isn’t even used in regular apps due to several significant limitations:
 - No straightforward way to retrieve the seqno and public key from the contract. 
 - No `valid_until` check, so you can't be sure that a transaction won't be confirmed too late.


The first issue was addressed in `V1R2` and `V1R3`, where `R` stands for "revision".  Revisions typically introduce minor updates, such as adding get methods. You review all revision changes in the commit history of `new-wallet.fif`.  From this point onward, we will consider only the latest revisions.

Since each new version builds upon the previous one, it's important to understand V1 as a foundation for the following versions.

#### Persistent memory layout

- <b>seqno</b>: 32-bit long sequence number.
- <b>public-key</b>: 256-bit long public key.

#### External message body layout

1. Data:
    - <b>signature</b>: 512-bit long ed25519 signature.
    - <b>msg-seqno</b>: 32-bit long sequence number.
    - <b>(0-4)mode</b>: up to four 8-bit integers specifying the sending mode for each message.

2. Up to 4 references to cells containing messages.

As you can see, the primary purpose of the wallet is to provide a secure interface for interacting with the TON blockchain from the external world. The `seqno` mechanism protects against replay attacks, while the `Ed25519` signature ensures that only authorized users can access wallet functionality. We will not dwell on each of these mechanisms, as they are covered in the [External message](/v3/documentation/smart-contracts/message-management/external-messages) section and are pretty common among smart contracts receiving external messages. The payload data includes up to 4 references to cells, along with a corresponding set of sending modes. These are passed directly to the [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) method.


:::caution
The wallet does not validate the internal messages you send through it. The programmer's (i.e., the external client’s) responsibility is to serialize the data correctly according to the [internal message layout](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

#### Exit codes

| Exit code      | Description                                                     |
|----------------|-----------------------------------------------------------------|
| 0x21           | `seqno` check failed — replay protection triggered.             |
| 0x22           | `Ed25519 signature` verification failed.                        |
| 0x0            | Standard successful execution exit code.                        |


:::info
Note that [TVM](/v3/documentation/tvm/tvm-overview) has [standart exit codes](/v3/documentation/tvm/tvm-exit-codes) (`0x0` - is one of them), so you can get one of them, too; if you run out of gas, you will get a `0xD` code.
:::

#### Get methods

1. int seqno() returns the current stored seqno.
2. int get_public_key returns the current stored public key.


### Wallet V2

Wallet source code:

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

This version introduces the `valid_until` parameter, which sets a time limit for a transaction. It is helpful to prevent it from being confirmed too late.
Note that this version still does not include a get method for the public key. That was added later in `V2R2`.

All differences from the previous version stem from the addition of `valid_until` functionality:
- A new exit code `0x23` was introduced to indicate a failed `valid_until` check.
- A new UNIX-time field was added to the external message body layout, specifying the transaction's time limit.
- All existing get methods remain unchanged.

#### External message body layout

1. Data:

    - <b>signature</b>: 512-bit long ed25519 signature.
    - <b>msg-seqno</b>: 32-bit long sequence number.
    - <b>valid-until</b>: 32-bit long UNIX-time integer.
    - <b>(0-4)mode</b>: up to four 8-bit integers specifying the sending mode for each message.

2. Up to 4 references to cells containing messages.

### Wallet V3

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key. In practice, you can manage several wallets using a single seed phrase.
As before, `V3R2` only adds a get method for the public key.

Wallet source code:

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Essentially, `subwallet_id` is just a number added to the contract state at deployment. Since a contract address in TON is the hash of its code and state, changing the `subwallet_id` results in a different wallet address.
This version is currently the most widely used. It supports most use cases while remaining clean, simple, and consistent with earlier versions. All get methods remain unchanged.

#### Persistent memory layout

- <b>seqno</b>: 32-bit sequence number.
- <b>subwallet</b>: 32-bit subwallet ID.
- <b>public-key</b>: 256-bit public key.

#### External message layout

1. Data:
   - <b>signature</b>: 512-bit ed25519 signature.
   - <b>subwallet-id</b>: 32-bit subwallet ID.
   - <b>msg-seqno</b>: 32-bit sequence number.
   - <b>valid-until</b>: 32-bit UNIX time integer.
   - <b>(0-4)mode</b>: Up to four 8-bit integers defining the sending mode for each message.
2. Up to 4 references to cells containing messages.


#### Exit codes
| Exit code | Description                                                              |
|-----------|--------------------------------------------------------------------------|
| 0x21      | `seqno` check failed — replay protection triggered.                      |
| 0x23      | `valid_until` check failed; transaction confirmation attempted too late. |
| 0x23      | `Ed25519 signature` verification failed.                                 |
| 0x22      | `subwallet-id` does not match the stored value.                          |
| 0x0       | Standard successful execution exit code.                                 |


### Wallet V4

This version preserves all the functionality of the previous ones while introducing a powerful new feature: `plugins`.

Wallet source code:

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

Plugins enable developers to extend wallet behavior by adding custom logic that runs alongside the wallet contract. For instance, a dApp might require users to pay a small daily fee to access certain features. In that case, the user could install a plugin by signing a transaction. Once installed, the plugin can automatically send the required payment to a specified address each day, triggered by an external message.

#### Plugins

Plugins are essentially other smart contracts on TON that developers can implement as they see fit. In the wallet context, plugins are simply the addresses of smart contracts stored in a [dictionary](/v3/documentation/smart-contracts/func/docs/dictionaries) within the wallet's persistent memory. These plugins can request funds and remove themselves from the "allowed list" by sending internal messages to the wallet.



#### Persistent memory layout

- <b>seqno</b>: 32-bit sequence number.
- <b>subwallet</b>: 32-bit subwallet ID.
- <b>public-key</b>: 256-bit public key.
- <b>plugins</b>: a dictionary containing plugins; may be empty.


#### Receiving internal messages

In all previous wallet versions, receiving internal messages was straightforward. Wallets accepted incoming funds from any sender and ignored the message body, using an empty `recv_internal` method.
However, as mentioned earlier, version four of the wallet introduces two additional operations. Below is the layout of the internal message body:

- <b>op-code?</b>: 32-bit operation code. This is an optional field. Any message with fewer than 32 bits in the body, an invalid op-code, or a sender address not registered as a plugin is treated as a simple transfer—just like in earlier wallet versions.

- <b>query-id</b>: 64-bit integer. This field has no effect on the smart contract's behavior; it tracks message chains between contracts.

1. op-code = 0x706c7567: request funds operation code.
    - <b>toncoins</b>: `VARUINT16` amount of requested TON coins.
    - <b>extra_currencies</b>: dictionary containing the amount of requested extra currency. This dictionary may be empty.
2. op-code = 0x64737472: request removal of the plugin-sender from the "allowed list."

#### External message body layout

 - <b>signature</b>: 512-bit ed25519 signature.
 - <b>subwallet-id</b>: 32-bit subwallet ID.
 - <b>valid-until</b>: 32-bit UNIX-time integer.
 - <b>msg-seqno</b>: 32-bit sequence integer.
 - <b>op-code</b>: 32-bit operation code.
1. op-code = 0x0: simple send operation.
    - <b>(0-4)mode</b>: up to four 8-bit integers defining sending mode for each message.
    - <b>(0-4)messages</b>: up to four references to cells containing messages.
2. op-code = 0x1, deploy and install plugin. 
    - <b>WorkChain</b>: 8-bit long integer.
    - <b>balance</b>: `VARUINT16` amount of initial TON coin balance.
    - <b>state-init</b>: cell reference containing the plugin initial state.
    - <b>body</b>: cell reference containing body.
3. op-code = 0x2/0x3, install plugin/remove plugin operation.
    - <b>wc_n_address</b>: 8-bit `workchain_id + 256-bit` plugin address.
    - <b>balance</b>: `VARUINT16` amount of initial TON coin balance.
    - <b>query-id</b>: 64-bit integer.
    - 
As shown, version four still supports standard functionality through the `0x0` op-code, similar to earlier versions. The `0x2` and `0x3` op-codes enable manipulation of the plugins dictionary. Note that when using `0x2`, you must deploy the plugin with that address yourself. In contrast, the `0x1` op-code handles deployment utilizing the `state-init` field.

:::tip
If the term `state_init` seems unclear based on its name, you can refer to the following resources for more context:
 * [Addresses in TON Blockchain](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
 * [Send a deploy message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
 * [Internal message layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
:::

#### Exit codes
| Exit code | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| 0x24      | check failed; transaction confirmation attempted too late.                    |
| 0x23      | `Ed25519 signature` verification failed.                                      |
| 0x21      | `seqno` check failed — replay protection triggered.                           |
| 0x22      | `subwallet-id` does not match the stored value.                               |
| 0x27      | Failed to manipulate the plugins dictionary (0x1-0x3 recv_external op-codes). |
| 0x50      | Insufficient funds for the requested transfer.                                |
| 0x0       | Standard successful execution exit code.                                      |

#### Get methods
1. int seqno() returns the current stored seqno.
2. int get_public_key returns the current stored public key.
3. int get_subwallet_id() returns current subwallet ID.
4. int is_plugin_installed(int wc, int addr_hash) checks if the plugin with a defined workchain ID and address hash is installed.
5. tuple get_plugin_list() returns list of plugins.

### Wallet V5

The latest version of the wallet, developed by the Tonkeeper team, is the V5 standard. It aims to replace V4 and enables arbitrary extensions.

<br></br>
<ThemedImage
alt=""
sources={{
        light: '/img/docs/wallet-contracts/wallet-contract-V5.png?raw=true',
        dark: '/img/docs/wallet-contracts/wallet-contract-V5_dark.png?raw=true',
    }}
/>
<br></br><br></br><br></br>

 V5 brings several improvements that enhance the experience for both users and merchants. These include gas-free transactions, account delegation and recovery, subscription payments with tokens and TON coin, and low-cost multi-transfers. In addition to retaining all the features of V4, the new contract allows you to send up to 255 messages at once.

Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B scheme:

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
Unlike previous wallet version specifications, we will use the [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) scheme due to the increased complexity of this version's interface implementation. We describe each of these, but a basic understanding of the concepts and the wallet's source code should be sufficient.
:::

#### Persistent memory layout

```
contract_state$_
    is_signature_allowed:(## 1)
    seqno:#
    wallet_id:(## 32)
    public_key:(## 256)
    extensions_dict:(HashmapE 256 int1) = ContractState;
```


As you can see, the `ContractState` has not changed significantly compared to previous versions. The main update is the addition of the new `is_signature_allowed` 1-bit flag, which controls access via the signature and stored public key. We explain the significance of this change in later sections.

#### Authentification process

```
signed_request$_             // 32 (opcode from outer)
  wallet_id:    #            // 32
  valid_until:  #            // 32
  msg_seqno:    #            // 32
  inner:        InnerRequest //
  signature:    bits512      // 512
= SignedRequest;             // Total: 688 .. 976 + ^Cell

internal_signed#73696e74 signed:SignedRequest = InternalMsgBody;

internal_extension#6578746e
    query_id:(## 64)
    inner:InnerRequest = InternalMsgBody;

external_signed#7369676e signed:SignedRequest = ExternalMsgBody;
```


Before diving into the actual payload of our messages — `InnerRequest` — let's first examine how V5 differs from previous versions regarding authentication.

The `InternalMsgBody` combinator defines **two methods** for accessing wallet actions via internal messages:

1. Extension-based authentication. This method is familiar from V4. It authenticates the message from a previously registered extension, whose address is stored in the `extensions_dict`.
2. Signature-based authentication. This method authenticates the message using the stored public key and signature, similar to processing external requests.


Although the second method might initially seem redundant, it's a key feature of V5. It enables requests to be processed by external services, such as smart contracts, that are not part of the wallet's extension infrastructure. This mechanism is essential for supporting gas-free transactions.

It’s also important to note that receiving funds remains an option. Any internal message not passing the authentication process will be treated as a simple transfer.

#### Actions

The first thing to note is the `InnerRequest`, which we’ve already encountered during the authentication process. Unlike in previous versions, external and internal messages now have access to the same functionality — except for changing the signature mode, i.e., the `is_signature_allowed` flag.

```
out_list_empty$_ = OutList 0;
out_list$_ {n:#}
    prev:^(OutList n)
    action:OutAction = OutList (n + 1);

action_send_msg#0ec3c86d mode:(## 8) out_msg:^(MessageRelaxed Any) = OutAction;

// Extended actions in V5:
action_list_basic$_ {n:#} actions:^(OutList n) = ActionList n 0;
action_list_extended$_ {m:#} {n:#} action:ExtendedAction prev:^(ActionList n m) = ActionList n (m+1);

action_add_ext#02 addr:MsgAddressInt = ExtendedAction;
action_delete_ext#03 addr:MsgAddressInt = ExtendedAction;
action_set_signature_auth_allowed#04 allowed:(## 1) = ExtendedAction;

actions$_ out_actions:(Maybe OutList) has_other_actions:(## 1) {m:#} {n:#} other_actions:(ActionList n m) = InnerRequest;
```

We can think of `InnerRequest` as consisting of two lists of actions:
1. `OutList` — an optional chain of cell references, each containing a send message request, prefixed by the message mode.
2. `ActionList` — preceded by a one-bit flag, `has_other_actions`, which indicates the presence of extended actions. These actions begin in the first cell and continue as a chain of cell references.

You may already be familiar with the first two extended actions, `action_add_ext` and `action_delete_ext`, which add or remove an internal address from the extensions dictionary.

The third action, `action_set_signature_auth_allowed`, turns authentication on or off via the public key — effectively making extensions the only way to interact with the wallet. This feature can be especially critical if your private key is lost or compromised.


:::info
Note that the maximum number of actions is 255 due to the use of the [c5](/v3/documentation/tvm/tvm-overview#result-of-tvm-execution) TVM register. Technically, you can send a request with an empty `OutAction` and `ExtendedAction`, but in that case, it will behave just like a simple funds transfer.
:::

#### Exit codes

| Exit code | Description                                                                         |
|-----------|-------------------------------------------------------------------------------------|
| 0x84      | Attempted authentication via signature while signature-based access is disabled.    |
| 0x85      | `seqno` check failed - reply protection triggered.                                  |
| 0x86      | `wallet-id` does not correspond to the stored value.                                |
| 0x87      | `Ed25519 signature` verification failed.                                            |
| 0x88      | `valid-until` check failed.                                                         |
| 0x89      | `send_mode` must have the +2 bit set (ignore errors) for external messages.         |
| 0x8A      | `external-signed`  prefix does not match the expected value.                        |
| 0x8B      | Failed to add extension.                                                            |
| 0x8C      | Failed to remove extension.                                                         |
| 0x8D      | Unsupported extended message prefix.                                                |
| 0x8E      | Attempted to disable signature-based auth while the extensions dictionary is empty. |
| 0x8F      | Tried to set signature auth to its current state.                                   |
| 0x90      | Tried to remove the last extension when signature is disabled.                      |
| 0x91      | Extension address has an invalid WorkChain ID.                                      |
| 0x92      | Tried to change signature mode via an external message.                             |
| 0x93      | Invalid `c5`; `action_send_msg` verification failed.                                |
| 0x0       | Standard successful execution exit code.                                            |

:::danger
Note that exit codes `0x8E`, `0x90`, and `0x92` are designed to protect you from losing access to wallet functionality. However, remember that the wallet does not verify whether the stored extension addresses exist on the TON. You can also deploy a wallet with initial data in an empty extensions dictionary and restricted signature mode. In such cases, you can still access the wallet via the public key until you add your first extension. So, be cautious with these configurations.

:::

#### Get methods

1. int is_signature_allowed() returns stored `is_signature_allowed` flag.
2. int seqno() returns current stored seqno.
3. int get_subwallet_id() returns current subwallet ID.
4. int get_public_key() returns current stored public key.
5. cell get_extensions() returns extensions dictionary.

#### Preparing for Gasless Transactions

As mentioned earlier, the V5 wallet smart contract supports processing internal messages signed by the owner. This enables gasless transactions, such as paying network fees in USDt when transferring USDt. A common flow looks like this:

![image](/img/gasless.jpg)

:::tip
As a result, services like [Tonkeeper's battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery) offer this functionality: they cover the transaction fees in TONs on behalf of the user and charge a fee in tokens instead.
:::

#### Flow

1. When sending USDt, the user signs a single message containing two outgoing USDt transfers:
    1. A USDt transfer to the recipient's address.
    2. A small USDt fee transferred to the Service.
2. This signed message is then sent off-chain via HTTPS to the Service backend. The backend submits the transaction to the TON Blockchain, covering the network fees in TON coins.

A beta version of the gasless backend API is available at [tonapi.io/api-v2](https://tonapi.io/api-v2). If you're building a wallet app and have feedback about these methods, please share it in the [@tonapitech](https://t.me/tonapitech) chat on Telegram.


Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## Special wallets

Sometimes, the functionality of basic wallets isn’t enough. That’s why several specialized wallets exist —`high-load`, `lockup` and `restricted`.

Let’s take a closer look at each of them.

### Highload wallets

When a wallet needs to process many messages quickly, it uses a specialized **highload wallet**.
Read more in [this article](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) for more details.

### Lockup wallet

A **lockup wallet** is the right solution if you need to lock coins in a wallet for a specific period, preventing withdrawals until that time.

This wallet allows you to set a lock period during which funds cannot be withdrawn. You can also configure unlock periods, allowing you to access your funds gradually.

**Example**

- You create a wallet that holds 1 million coins with a total vesting period of 10 years.
- You set a cliff period of 1 year, meaning no coins can be withdrawn during the first year.
- After that, coins unlock monthly:
`1,000,000 TON ÷ 120 months = ~8,333 TON` released per month.


Wallet source code:

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Restricted wallet

This wallet functions like a regular wallet but restricts transfers to a single, pre-defined destination address. You set this destination when the wallet is created, and after that, all outgoing transfers are limited to that address. However, transfer to validation contracts is still allowed, so you can use this wallet to run a validator.

Wallet source code:

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## Conclusion

As you see, there are many different versions of wallets in TON. But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets for additional functionality like periodic fund unlocking.

## See also

 - [Working with wallet smart contracts](/v3/guidelines/smart-contracts/howto/wallet)
 - [Sources of basic wallets](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
 - [More technical description of versions](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
 - [Wallet V4 sources and detailed description](https://github.com/ton-blockchain/wallet-contract)
 - [Lockup wallet sources and detailed description](https://github.com/ton-blockchain/lockup-wallet-contract)
 - [Restricted wallet sources](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
 - [Gasless transactions on TON](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)
