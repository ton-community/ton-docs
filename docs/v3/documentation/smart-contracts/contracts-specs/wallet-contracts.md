import Feedback from '@site/src/components/Feedback';

import ConceptImage from '@site/src/components/conceptImage';
import ThemedImage from '@theme/ThemedImage';

# Wallet contracts

You may have heard about different versions of wallets on TON Blockchain. But what do these versions actually mean, and how do they differ?

In this article, we’ll explore the various versions and modifications of TON wallets.

:::info
Before we start, there are some terms and concepts that you should be familiar with to fully understand the article:

- [Message management](/v3/documentation/smart-contracts/message-management/messages-and-transactions), because this is the main functionality of the wallets.
- [FunC language](/v3/documentation/smart-contracts/func/overview), because we will heavily rely on implementations made using it.
  :::

## Common concept

To break the tension, we should first understand that wallets are not a specific entity in the TON ecosystem. They are still just smart contracts consisting of code and data, and, in that sense, are equal to any other actor (i.e., smart contract) in TON.

Like your own custom smart contract, or any other one, wallets can receive external and internal messages, send internal messages and logs, and provide `get methods`.
So the question is: what functionality do they provide and how it differs between versions?

You can consider each wallet version as a smart-contract implementation providing a standard external interface, allowing different external clients to interact with the wallets in the same way. You can find these implementations in FunC and Fift languages in the main TON monorepo:

- [ton/crypto/smartcont/](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/)

## Basic wallets

### Wallet V1

This is the simplest one. It only allows you to send four transactions at a time and doesn't check anything besides your signature and seqno.

Wallet source code:

- [ton/crypto/smartcont/wallet-code.fif](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet.fif)

This version isn’t even used in regular apps because it has some major issues:

- No easy way to retrieve the seqno and public key from the contract.
- No `valid_until` check, so you can't be sure that the transaction won't be confirmed too late.

The first issue was fixed in `V1R2` and `V1R3`. The `R` stands for **revision**. Usually, revisions are just small updates that only add get methods; you can find all of those in the changes history of `new-wallet.fif`. Hereinafter, we will consider only the latest revisions.

Nevertheless, because each subsequent version inherits the functionality of the previous one, we should still stick to it, as this will help us with later versions.

#### Persistent memory layout

- <b>seqno</b>: 32-bit long sequence number.
- <b>public-key</b>: 256-bit long public key.

#### External message body layout

1. Data:
   - <b>signature</b>: 512-bit long ed25519 signature.
   - <b>msg-seqno</b>: 32-bit long sequence number.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.

As you can see, the main functionality of the wallet is to provide a safe way to communicate with the TON blockchain from the outside world. The `seqno` mechanism protects against replay attacks, and the `Ed25519 signature` provides authorized access to wallet functionality. We will not dwell in detail on each of these mechanisms, as they are described in detail in the [external message](/v3/documentation/smart-contracts/message-management/external-messages) documentation page and are quite common among smart contracts receiving external messages. The payload data consists of up to 4 references to cells and the corresponding number of modes, which will be directly transferred to the [send_raw_message(cell msg, int mode)](/v3/documentation/smart-contracts/func/docs/stdlib#send_raw_message) method.

:::caution
Note that the wallet doesn't provide any validation for internal messages you send through it. It is the programmer's (i.e., the external client’s) responsibility to serialize the data according to the [internal message layout](http://localhost:3000/v3/documentation/smart-contracts/message-management/sending-messages#message-layout).
:::

#### Exit codes

| Exit code | Description                                    |
| --------- | ---------------------------------------------- |
| 0x21      | `seqno` check failed, reply protection accured |
| 0x22      | `Ed25519 signature` check failed               |
| 0x0       | Standard successful execution exit code.       |

:::info
Note that [TVM](/v3/documentation/tvm/tvm-overview) has [standart exit codes](/v3/documentation/tvm/tvm-exit-codes) (`0x0` - is one of them), so you can get one of them too, if you run out of [gas](https://docs.ton.org/develop/smart-contracts/fees), for example, you will get `0xD` code.
:::

#### Get methods

1. int seqno() returns current stored seqno.
2. int get_public_key returns current stored public key.

### Wallet V2

Wallet source code:

- [ton/crypto/smartcont/wallet-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-code.fc)

This version introduces the `valid_until` parameter, which is used to set a time limit for a transaction in case you don't want it to be confirmed too late. This version also does not have the get-method for the public key, which was added in `V2R2`.

All differences compared to the previous version are a consequence of adding the `valid_until` functionality. A new exit code was added: `0x23`, marking the failure of the valid_until check. Additionally, a new UNIX-time field has been added to the external message body layout, setting the time limit for the transaction. All get methods remain the same.

#### External message body layout

1. Data:
   - <b>signature</b>: 512-bit long ed25519 signature.
   - <b>msg-seqno</b>: 32-bit long sequence number.
   - <b>valid-until</b>: 32-bit long Unix-time integer.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
2. Up to 4 references to cells containing messages.

### Wallet V3

This version introduces the `subwallet_id` parameter, which allows you to create multiple wallets using the same public key (so you can have only one seed phrase and multiple wallets). As before, `V3R2` only adds the get-method for the public key.

Wallet source code:

- [ton/crypto/smartcont/wallet3-code.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc)

Essentially, `subwallet_id` is just a number added to the contract state when it’s deployed. Since the contract address in TON is a hash of its state and code, the wallet address will change with a different `subwallet_id`. This version is the most widely used right now. It covers most use cases and remains clean, simple, and mostly the same as previous versions. All get methods remain the same.

#### Persistent Memory Layout

- <b>seqno</b>: 32-bit sequence number.
- <b>subwallet</b>: 32-bit subwallet ID.
- <b>public-key</b>: 256-bit public key.

#### External Message Layout

1. Data:
   - <b>signature</b>: 512-bit ed25519 signature.
   - <b>subwallet-id</b>: 32-bit subwallet ID.
   - <b>msg-seqno</b>: 32-bit sequence number.
   - <b>valid-until</b>: 32-bit UNIX time integer.
   - <b>(0-4)mode</b>: Up to four 8-bit integers defining the sending mode for each message.
2. Up to 4 references to cells containing messages.

#### Exit Codes

| Exit Code | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| 0x23      | `valid_until` check failed; transaction confirmation attempted too late |
| 0x23      | `Ed25519 signature` check failed                                        |
| 0x21      | `seqno` check failed; reply protection triggered                        |
| 0x22      | `subwallet-id` does not match the stored one                            |
| 0x0       | Standard successful execution exit code.                                |

### Wallet V4

This version retains all the functionality of the previous versions but also introduces something very powerful: `plugins`.

Wallet source code:

- [ton-blockchain/wallet-contract](https://github.com/ton-blockchain/wallet-contract)

This feature allows developers to implement complex logic that works in tandem with a user's wallet. For example, a DApp may require a user to pay a small amount of coins every day to use certain features. In this case, the user would need to install the plugin on their wallet by signing a transaction. The plugin would then send coins to the destination address daily when requested by an external message.

#### Plugins

Plugins are essentially other smart contracts on TON that developers are free to implement as they wish. In relation to the wallet, they are simply addresses of smart contracts stored in a [dictionary](/v3/documentation/smart-contracts/func/docs/dictionaries) in the wallet's persistent memory. These plugins are allowed to request funds and remove themselves from the "allowed list" by sending internal messages to the wallet.

#### Persistent memory layout

- <b>seqno</b>: 32-bit long sequence number.
- <b>subwallet-id</b>: 32-bit long subwallet-id.
- <b>public-key</b>: 256-bit long public key.
- <b>plugins</b>: dictionary containing plugins(may be empty)

#### Receiving internal messages

All previous versions of wallets had a straightforward implementation for receiving internal messages. They simply accepted incoming funds from any sender, ignoring the internal message body if present, or in other words, they had an empty recv_internal method. However, as mentioned earlier, the fourth version of the wallet introduces two additional available operations. Let's take a look at the internal message body layout:

- <b>op-code?</b>: 32-bit long operation code. This is an optional field; any message containing less than 32 bits in the message body, an incorrect op-code, or a sender address that isn't registered as a plugin will be considered as simple transfer, similar to previous wallet versions.
- <b>query-id</b>: 64-bit long integer. This field has no effect on the smart contract's behavior; it is used to track chains of messages between contracts.

1. op-code = 0x706c7567, request funds operation code.
   - <b>toncoins</b>: VARUINT16 amount of requested toncoins.
   - <b>extra_currencies</b>: Dictionary containing the amount of requested extra currencies (may be empty).
2. op-code = 0x64737472, request removal of plugin-sender from the "allowed list".

#### External message body layout

- <b>signature</b>: 512-bit long ed25519 signature.
- <b>subwallet-id</b>: 32-bit long subwallet ID.
- <b>valid-until</b>: 32-bit long Unix-time integer.
- <b>msg-seqno</b>: 32-bit long sequence integer.
- <b>op-code</b>: 32-bit long operation code.

1. op-code = 0x0, simple send.
   - <b>(0-4)mode</b>: up to four 8-bit long integer's defining sending mode for each message.
   - <b>(0-4)messages</b>:Up to four references to cells containing messages.
2. op-code = 0x1, deploy and install plugin.
   - <b>workchain</b>: 8-bit long integer.
   - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
   - <b>state-init</b>: Cell reference containing plugin initial state.
   - <b>body</b>: Cell reference containing body.
3. op-code = 0x2/0x3, install plugin/remove plugin.
   - <b>wc_n_address</b>: 8-bit long workchain_id + 256-bit long plugin address.
   - <b>balance</b>: VARUINT16 toncoins amount of initial balance.
   - <b>query-id</b>: 64-bit long integer.

As you can see, the fourth version still provides standard functionality through the `0x0` op-code, similar to previous versions. The `0x2` and `0x3` operations allow manipulation of the plugins dictionary. Note that in the case of `0x2`, you need to deploy the plugin with that address yourself. In contrast, the `0x1` op-code also handles the deployment process with the state_init field.

:::tip
If `state_init` doesn't make much sense from its name, take a look at the following references:

- [addresses-in-ton-blockchain](/v3/documentation/smart-contracts/addresses#workchain-id-and-account-id)
- [send-a-deploy-message](/v3/documentation/smart-contracts/func/cookbook#how-to-send-a-deploy-message-with-stateinit-only-with-stateinit-and-body)
- [internal-message-layout](/v3/documentation/smart-contracts/message-management/sending-messages#message-layout)
  :::

#### Exit Codes

| Exit Code | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| 0x24      | `valid_until` check failed, transaction confirmation attempted too late |
| 0x23      | `Ed25519 signature` check failed                                        |
| 0x21      | `seqno` check failed, reply protection triggered                        |
| 0x22      | `subwallet-id` does not match the stored one                            |
| 0x27      | Plugins dictionary manipulation failed (0x1-0x3 recv_external op-codes) |
| 0x50      | Not enough funds for the funds request                                  |
| 0x0       | Standard successful execution exit code.                                |

#### Get methods

1. int seqno() returns current stored seqno.
2. int get_public_key() returns current stored public key.
3. int get_subwallet_id() returns current subwallet ID.
4. int is_plugin_installed(int wc, int addr_hash) checks if plugin with defined workchain ID and address hash is installed.
5. tuple get_plugin_list() returns list of plugins.

### Wallet V5

It is the most modern wallet version at the moment, developed by the Tonkeeper team, aimed at replacing V4 and allowing arbitrary extensions.
<br></br>
<ThemedImage
alt=""
sources={{
        light: '/img/docs/wallet-contracts/wallet-contract-V5.png?raw=true',
        dark: '/img/docs/wallet-contracts/wallet-contract-V5_dark.png?raw=true',
    }}
/>
<br></br><br></br><br></br>
The V5 wallet standard offers many benefits that improve the experience for both users and merchants. V5 supports gas-free transactions, account delegation and recovery, subscription payments using tokens and Toncoin, and low-cost multi-transfers. In addition to retaining the previous functionality (V4), the new contract allows you to send up to 255 messages at a time.

Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

TL-B scheme:

- [ton-blockchain/wallet-contract-v5/types.tlb](https://github.com/ton-blockchain/wallet-contract-v5/blob/main/types.tlb)

:::caution
In contrast to previous wallet version specifications, we will rely on [TL-B](/v3/documentation/data-formats/tlb/tl-b-language) scheme, due to the relative complexity of this wallet version's interface implementation. We will provide some description for each of those. Nevertheless, a basic understanding is still required, in combination with the wallet source code, it should be enough.
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

As you can see, the `ContractState`, compared to previous versions, hasn't undergone major changes. The main difference is the new `is_signature_allowed` 1-bit flag, which restricts or allows access through the signature and stored public key. We will describe the importance of this change in later topics.

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

Before we get to the actual payload of our messages — `InnerRequest` — let's first look at how version 5 differs from previous versions in the authentication process. The `InternalMsgBody` combinator describes two ways to access wallet actions through internal messages. The first method is one we are already familiar with from version 4: authentication as a previously registered extension, the address of which is stored in `extensions_dict`. The second method is authentication through the stored public key and signature, similar to external requests.

At first, this might seem like an unnecessary feature, but it actually enables requests to be processed through external services (smart contracts) that are not part of your wallet's extension infrastructure—a key feature of V5. Gas-free transactions rely on this functionality.

Note that simply receiving funds is still an option. Practically, any received internal message that doesn't pass the authentication process will be considered as transfer.

#### Actions

The first thing that we should notice is `InnerRequest`, which we have already seen in the authentication process. In contrast to the previous version, both external and internal messages have access to the same functionality, except for changing the signature mode (i.e., the `is_signature_allowed` flag).

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

We can consider `InnerRequest` as two lists of actions: the first, `OutList`, is an optional chain of cell references, each containing a send message request led by the message mode. The second, `ActionList,` is led by a one-bit flag, `has_other_actions`, which marks the presence of extended actions, starting from the first cell and continuing as a chain of cell references. We are already familiar with the first two extended actions, `action_add_ext` and `action_delete_ext`, followed by the internal address that we want to add or delete from the extensions dictionary. The third, `action_set_signature_auth_allowed`, restricts or allows authentication through the public key, leaving the only way to interact with the wallet through extensions. This functionality might be extremely important in the case of a lost or compromised private key.

:::info
Note that the maximum number of actions is 255; this is a consequence of the realization through the [c5](/v3/documentation/tvm/tvm-overview#result-of-tvm-execution) TVM register. Technically, you can make a request with empty `OutAction` and `ExtendedAction`, but in that case, it will be similar to just receiving funds.
:::

#### Exit Codes

| Exit Code | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| 0x84      | Authentication attempt through signature while it's disabled                      |
| 0x85      | `seqno` check failed, reply protection occurred                                   |
| 0x86      | `wallet-id` does not correspond to the stored one                                 |
| 0x87      | `Ed25519 signature` check failed                                                  |
| 0x88      | `valid-until` check failed                                                        |
| 0x89      | Enforce that `send_mode` has the +2 bit (ignore errors) set for external message. |
| 0x8A      | `external-signed` prefix doesn't correspond to the received one                   |
| 0x8B      | Add extension operation was not successful                                        |
| 0x8C      | Remove extension operation was not successful                                     |
| 0x8D      | Unsupported extended message prefix                                               |
| 0x8E      | Tried to disable auth by signature while the extension dictionary is empty        |
| 0x8F      | Attempt to set signature to an already set state                                  |
| 0x90      | Tried to remove the last extension when signature is disabled                     |
| 0x91      | Extension has the wrong workchain                                                 |
| 0x92      | Tried to change signature mode through external message                           |
| 0x93      | Invalid `c5`, `action_send_msg` verification failed                               |
| 0x0       | Standard successful execution exit code.                                          |

:::danger
Note that the `0x8E`, `0x90`, and `0x92` wallet exit codes are designed to prevent you from losing access to wallet functionality. Nevertheless, you should still remember that the wallet doesn't check whether the stored extension addresses actually exist in TON. You can also deploy a wallet with initial data consisting of an empty extensions dictionary and restricted signature mode. In that case, you will still be able to access the wallet through the public key until you add your first extension. So, be careful with these scenarios.
:::

#### Get methods

1. int is_signature_allowed() returns stored `is_signature_allowed` flag.
2. int seqno() returns current stored seqno.
3. int get_subwallet_id() returns current subwallet ID.
4. int get_public_key() returns current stored public key.
5. cell get_extensions() returns extensions dictionary.

#### Preparing for gasless transactions

As was said, before v5, the wallet smart contract allowed the processing of internal messages signed by the owner. This also allows you to make gasless transactions, e.g., payment of network fees when transferring USDt in USDt itself. The common scheme looks like this:

![image](/img/gasless.jpg)

:::tip
Consequently, there will be services (such as [Tonkeeper's Battery](https://blog.ton.org/tonkeeper-releases-huge-update#tonkeeper-battery)) that provide this functionality: they pay the transaction fees in TONs on behalf of the user, but charge a fee in tokens.
:::

#### Flow

1. When sending USDt, the user signs one message containing two outgoing USDt transfers:
   1. USDt transfer to the recipient's address.
   2. Transfer of a small amount of USDt in favor of the Service.
2. This signed message is sent off-chain by HTTPS to the Service backend. The Service backend sends it to the TON blockchain, paying Toncoins for network fees.

Beta version of the gasless backend API is available on [tonapi.io/api-v2](https://tonapi.io/api-v2). If you are developing any wallet app and have feedback about these methods please share it ton [@tonapitech](https://t.me/tonapitech) chat.

Wallet source code:

- [ton-blockchain/wallet-contract-v5](https://github.com/ton-blockchain/wallet-contract-v5)

## Special wallets

Sometimes the functionality of basic wallets isn't enough. That's why there are several types of specialized wallet: `high-load`, `lockup` and `restricted`.

Let's have a look at them.

### Highload wallets

When working with many messages in a short period, there is a need for special wallet called Highload Wallet. Read [the article](/v3/documentation/smart-contracts/contracts-specs/highload-wallet) for more information.

### Lockup wallet

If you, for some reason, need to lock coins in a wallet for some time without the possibility to withdraw them before that time passes, have a look at the lockup wallet.

It allows you to set the time until which you won't be able to withdraw anything from the wallet. You can also customize it by setting unlock periods so that you will be able to spend some coins during these set periods.

For example: you can create a wallet which will hold 1 million coins with total vesting time of 10 years. Set the cliff duration to one year, so the funds will be locked for the first year after the wallet is created. Then, you can set the unlock period to one month, so `1'000'000 TON / 120 months = ~8333 TON` will unlock every month.

Wallet source code:

- [ton-blockchain/lockup-wallet-contract](https://github.com/ton-blockchain/lockup-wallet-contract)

### Restricted wallet

This wallet's function is to act like a regular wallet, but restrict transfers to only one pre-defined destination address. You can set the destination when you create this wallet and then you'll be only able to transfer funds from it to that address. But note that you can still transfer funds to validation contracts so you can run a validator with this wallet.

Wallet source code:

- [EmelyanenkoK/nomination-contract/restricted-wallet](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)

## Conclusion

As you see, there are many different versions of wallets in TON. But in most cases, you only need `V3R2` or `V4R2`. You can also use one of the special wallets if you want to have some additional functionality like a periodic unlocking of funds.

## See also

- [Working With Wallet Smart Contracts](/v3/guidelines/smart-contracts/howto/wallet)
- [Sources of basic wallets](https://github.com/ton-blockchain/ton/tree/master/crypto/smartcont)
- [More technical description of versions](https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/WalletSources.md)
- [Wallet V4 sources and detailed description](https://github.com/ton-blockchain/wallet-contract)
- [Lockup wallet sources and detailed description](https://github.com/ton-blockchain/lockup-wallet-contract)
- [Restricted wallet sources](https://github.com/EmelyanenkoK/nomination-contract/tree/master/restricted-wallet)
- [Gasless transactions on TON](https://medium.com/@buidlingmachine/gasless-transactions-on-ton-75469259eff2)

<Feedback />

