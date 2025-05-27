import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

This section describes the specifics of smart contract addresses on the TON Blockchain. It also explains how actors are synonymous with smart contracts on TON.

## Everything is a smart contract

On TON, smart contracts are built using the [Actor model](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#single-actor). In fact, actors on TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and a smart contract).

Typically, actors process incoming messages, change their internal states, and generate outbound messages as a result. That's why every actor (i.e., smart contract) on TON Blockchain must have an address, so it can receive messages from other actors.

:::info EVM EXPERIENCE
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. Feel free to learn more about the differences by reading our article ["Six unique aspects of TON Blockchain that will surprise Solidity developers"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) - _Tal Kol_.
:::

## Address of smart contract

Smart contract addresses on TON typically consist of two main components:

* **(workchain_id)**: Denotes the workchain ID (a signed 32-bit integer)

* **(account_id)** Denotes the address of the account (64-512 bits, depending on the workchain)

In the raw address overview section of this documentation, we'll discuss how  **(workchain_id, account_id)** pairs are presented.

### WorkChain ID and Account ID

#### Workchain ID

[As we've seen before](/v3/concepts/dive-into-ton/ton-blockchain/blockchain-of-blockchains#workchain-blockchain-with-your-own-rules), it is possible to create as many as `2^32` workchains operating on TON Blockchain. We also noted how 32-bit prefix smart contract addresses identify and are linked to smart contract addresses within different workchains. This allows smart contracts to send and receive messages to and from different workchains on TON Blockchain.

Nowadays, only the Masterchain (workchain_id=-1) and occasionally the basic workchain (workchain_id=0) are running in TON Blockchain.

Both of them have 256-bit addresses, therefore, we assume that the workchain_id is either 0 or -1, and the address within the workchain is precisely 256 bits.


#### Account ID

All account IDs on TON use 256-bit addresses on the Masterchain and Basechain (also referred to as the basic workchain).

In fact, an Account ID (**account_id**) is defined as the result of applying a hash function (specifically SHA-256) to a smart contract object. Every smart contract operating on the TON Blockchain stores two main components:

1. _Compiled code_. The logic of the smart contract, compiled into bytecode.
2. _Initial state_. The contract's values at the moment it is deployed on-chain.

To derive the contract's address, you calculate the hash of the **(Initial code, Initial state)** pair. We won’t explore how the [TVM](/v3/documentation/tvm/tvm-overview) works at this time, but it is important to understand that account IDs on TON follow this formula:

**account_id = hash(initial code, initial state)**

Later in this documentation, we will dive deeper into the technical specifications of the TVM and TL-B scheme. Now that we are familiar with how the **account_id** is generated and how it interacts with smart contract addresses on TON, let’s discuss Raw and User-Friendly addresses.




## Addresses state

Each address can be in one of possible states:

- `nonexist` - there were no accepted transactions on this address, so it doesn't have any data (or the contract was deleted). We can say that initially all 2<sup>256</sup> address are in this state.
- `uninit` - address has some data, which contains balance and meta info. At this state address doesn't have any smart contract code/persistent data yet. An address enters this state, for example, when it was in a nonexist state, and another address sent tokens to it.
- `active` - address has smart contract code, persistent data and balance. At this state it can perform some logic during the transaction and change its persistent data. An address enters this state when it was `uninit` and there was an incoming message with state_init param (note, that to be able to deploy this address, hash of `state_init` and `code` must be equal to address).
- `frozen` - address cannot perform any operations, this state contains only two hashes of the previous state (code and state cells respectively). When an address's storage charge exceeds its balance, it goes into this state. To unfreeze it, you can send an internal message with `state_init` and `code` which store the hashes described earlier and some Toncoin. It can be difficult to recover it, so you should not allow this situation. There is a project to unfreeze the address, which you can find [here](https://unfreezer.ton.org/).

## Raw and user-friendly addresses

After providing a brief overview of how smart contract addresses on TON leverage workchains and account IDs (for the Masterchain and Basechain specifically), it is important to understand that these addresses are expressed in two main formats:

* **Raw addresses**: Original full representation of smart contract addresses.
* **User-friendly addresses**: User-friendly addresses are an enhanced format of raw address that employ better security and ease of use.

Below, we’ll explain more about the differences between these two address types and dive deeper into why user-friendly addresses are used on TON.

### Raw address

Raw smart contract addresses consist of a workchain ID and account ID *(workchain_id, account_id)* and are displayed in the following format:

* [decimal workchain_id\]:[64 hexadecimal digits with account_id\]


Provided below, is an example of a raw smart contract address using a  workchain ID and account ID together (expressed as **workchain_id** and **account_id**):

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Notice the `-1` at the start of the address string, which denotes a _workchain_id_ that belongs to the Masterchain.

:::note
Uppercase letters (such as 'A', 'B', 'C', 'D' etc.) may be used in address strings instead of their lowercase counterparts (such as 'a', 'b', 'c', 'd' etc.).
:::

#### Issues with raw addresses

Using the Raw Address form presents two main issues:

1. When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. When using the raw address format, it's impossible to add special flags like those used when sending transactions that employ user-friendly addresses.
   To help you better understand this concept, we’ll explain which flags can be used below.

### User-friendly address

User-friendly addresses were developed to secure and simplify the experience for TON users who share addresses on the internet (for example, on public messaging platforms or via their email service providers), as well as in the real world.

#### User-friendly address structure

User-friendly addresses are made up of 36 bytes in total and are obtained by generating the following components in order:

1. _[flags - 1 byte]_ — Flags that are pinned to addresses change the way smart contracts react to the received message.
   Flags types that employ the user-friendly address format include:

   - isBounceable. Denotes a bounceable or non-bounceable address type. (_0x11_ for "bounceable", _0x51_ for "non-bounceable")
   - isTestnetOnly. Denotes an address type used for testnet purposes only. Addresses beginning with _0x80_ should not be accepted by software running on the production network
   - isUrlSafe. Denotes a deprecated flag that is defined as URL-safe for an address. All addresses are then considered URL-safe.
2. _\[workchain_id - 1 byte]_ — The workchain ID (_workchain_id_) is defined by a signed 8-bit integer _workchain_id_.  
(_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[account_id - 32 byte]_ — The account ID is made up of a ([big-endian](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/)) 256-bit address in the workchain.
4. _\[address verification - 2 bytes]_ —  In user-friendly addresses, address verification is composed of a CRC16-CCITT signature from the previous 34 bytes. ([Example](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
   In fact, the idea pertaining to verification for user-friendly addresses is quite similar to the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm), which is used on all credit cards to prevent users from entering non-existing card numbers by mistake.

The addition of these 4 main components means that: `1 + 1 + 32 + 2 = 36` bytes in total (per user-friendly address).

To generate a user-friendly address, the developer must encode all 36 bytes using either:
- _base64_ (i.e., with digits, upper and lowercase Latin letters, '/' and '+')
- _base64url_ (with '_' and '-' instead of '/' and '+')

After this process is complete, the generation of a user-friendly address with a length of 48 non-spaced characters is finalized.

:::info DNS ADDRESS FLAGS
On TON, DNS addresses such as mywallet.ton are sometimes used instead of raw and user-friendly addresses. DNS addresses are made up of user-friendly addresses and include all the required flags that allow developers to access all the flags from the DNS record within the TON domain.
:::

#### User-friendly address encoding examples

For example, the "test giver" smart contract (a special smart contract residing in the testnet masterchain that sends 2 test tokens to anyone who requests them) makes use of the following raw address:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

The above "test giver" raw address must be converted into the user-friendly address form. This is obtained using either the base64 or base64url forms (that we introduced previously) as follows:

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
Notice that both forms (_base64_ and _base64url_) are valid and must be accepted!
:::

#### Bounceable vs non-bounceable addresses

The core idea behind the bounceable address flag is sender's funds security.

For example, if the destination smart contract does not exist, or if an issue happens during the transaction, the message will be "bounced" back to the sender and constitute the remainder of the original value of the transaction (minus all transfer and gas fees).
In relation to bounceable addresses specifically:

1. The **bounceable=false** flag generally means the receiver is a wallet.
2. The **bounceable=true** flag typically denotes a custom smart contract with its own application logic (for example, a DEX). In this example, non-bounceable messages should not be sent because of security reasons.

Feel free to read more on this topic in our documentation to gain a better understanding of [non-bounceable messages](/v3/documentation/smart-contracts/message-management/non-bounceable-messages).

#### Armored base64 representations

Additional binary data related to TON Blockchain employs similar "armored" base64 user-friendly address representations. These differentiate from one another depending on the first 4 characters of their byte tag. For example, 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence using the below process in order:

- A single byte tag using the _0x3E_ format denotes a public key
- A single byte tag using the _0xE6_ format denotes a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes


The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes such as:  `0xE3, 0x9E, ..., 0x7D`) presents itself through the "armored" representation as follows:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`


### Converting user-friendly addresses and raw addresses

The simplest way to convert user-friendly and raw addresses is to use one of several TON APIs and other tools, including:

* [ton.org/address](https://ton.org/address)
* [dton.io API method](https://dton.io/api/address/0:867ac2b47d1955de6c8e23f57994fad507ea3bcfe2a7d76ff38f29ec46729627)
* [toncenter API methods in mainnet](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter API methods in testnet](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

Additionally, there are two ways to convert user-friendly and raw addresses for wallets using JavaScript:

* [Convert address from/to user-friendly or raw form using ton.js](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
* [Convert address from/to user-friendly or raw form using tonweb](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

It's also possible to make use of similar mechanisms using [SDKs](/v3/guidelines/dapps/apis-sdks/sdk).

### Address examples

Learn more examples on TON Addresses in the [TON Cookbook](/v3/guidelines/dapps/cookbook#working-with-contracts-addresses).

## Possible problems

When interacting with the TON blockchain, it's crucial to understand the implications of transferring TON coins to `uninit` wallet addresses. This section outlines the various scenarios and their outcomes to provide clarity on how such transactions are handled.

### What happens when you transfer Toncoin to an uninit address?

#### Transaction with `state_init` included

If you include the `state_init` (which consists of the wallet or smart contract's code and data) with your transaction. The smart contract is deployed first using the provided `state_init`. After deployment, the incoming message is processed, similar to sending to an already initialized account.

#### Transaction without `state_init` and `bounce` flag set

The message cannot be delivered to the `uninit` smart contract, and it will be bounced back to the sender. After deducting the consumed gas fees, the remaining amount is returned to the sender's address.

#### Transaction without `state_init` and `bounce` flag unset

The message cannot be delivered, but it will not bounce back to the sender. Instead, the sent amount will be credited to the receiving address, increasing its balance even though the wallet is not yet initialized. They will be stored there until the address holder deploys a smart wallet contract and then they can access the balance.

#### How to do it right

The best way to deploy a wallet is to send some TON to its address (which is not yet initialized) with the `bounce` flag cleared. After this step, the owner can deploy and initialize the wallet using funds at the current uninitialized address. This step usually occurs on the first wallet operation.

### The TON blockchain implements protection against erroneous transactions

In the TON blockchain, standard wallets and apps automatically manage the complexities of transactions to uninitialized addresses by using bounceable and non-bounceable address, which are described [here](#bounceable-vs-non-bounceable-addresses). It is common practice for wallets, when sending coins to non-initialized addresses, to send coins to both bounceable and non-bounceable addresses without return.

If you need to quickly get an address in bounceable/non-bounceable form, this can be done [here](https://ton.org/address/).

### Responsibility for custom products

If you are developing a custom product on the TON blockchain, it is essential to implement similar checks and logic:

Ensure your application verifies whether the recipient address is initialized before sending funds.
Based on the address state, use bounceable addresses for user smart contracts with custom application logic to ensure funds are returned. Use non-bounceable addresses for wallets.


<Feedback />

