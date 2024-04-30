# Smart Contract Addresses

This section will describe the specifics of smart contract addresses on TON Blockchain. It will also explain how actors are synonymous with smart contracts on TON.

## Everything is a Smart Contract

On TON, smart contracts are built using the [Actor model](/learn/overviews/ton-blockchain#single-actor). In fact, actors in TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and a smart contract).

Typically, actors process incoming messages, change their internal state, and generate outbound messages as a result. That's why every actor (i.e., smart contract) on TON Blockchain must have an address, so it is able to receive messages from other actors.

:::info EVM EXPERIENCE
On the Ethereum Virtual Machine (EVM), addresses are completely separate from smart contracts. Feel free to learn more about the differences by reading our article ["Six unique aspects of TON Blockchain that will surprise Solidity developers"](https://blog.ton.org/six-unique-aspects-of-ton-blockchain-that-will-surprise-solidity-developers) by Tal Kol.
:::

## Address of Smart Contract

Smart contract addresses operating on TON typically consist of two main components:

* **(workchain_id)**: denotes the workchain ID (a signed 32-bit integer)

* **(account_id)** denotes the address of the account (64-512 bits, depending on the workchain)

In the raw address overview section of this documentation, we'll discuss how  **(workchain_id, account_id)** pairs present themselves.

### Workchain ID and Account ID

#### Workchain ID

[As we've seen before](/learn/overviews/ton-blockchain#workchain-blockchain-with-your-own-rules), it is possible to create as many as `2^32` workchains operating on TON Blockchain. We also noted how 32-bit prefix smart contract addresses identify and are linked to smart contract addresses within different workchains. This allows smart contracts to send and receive messages to and from different workchains on TON Blockchain.

Nowadays, only the Masterchain (workchain_id=-1) and occasionally the basic workchain (workchain_id=0) are running in TON Blockchain.

Both of them have 256-bit addresses, therefore, we assume that the workchain_id is either 0 or -1, and the address within the workchain is precisely 256 bits.

#### Account ID

All account IDs on TON make use of 256-bit addresses on the Masterchain and Basechain (or basic workchain).

In fact, Account ID’s **(account_id)** defined as hash functions for smart contract objects (particular, the SHA-256). Every smart contract operating on TON Blockchain stores two main components. These include:

1. _Compiled code_. Logic of the smart contract compiled in the form of bytecode.
2. _Initial state_. The contract's values at the moment of its deployment on-chain.


Finally, to accurately derive the contract's address, it is necessary to calculate the hash corresponding to the pair **(Initial code, Initial state)** object. At this time, we won't take a deep dive into how the [TVM](/learn/tvm-instructions/tvm-overview) works, but it's important to understand that account IDs on TON are determined using this formula:
:
**account_id = hash(initial code, initial state)**

In time, throughout this documentation, we'll dive deeper into the technical specifications and overview of the TVM and TL-B scheme. Now that we are familiar with the generation of the **account_id** and their interaction with smart contract addresses on TON, let’s explain Raw and User-Friendly addresses.

## Raw and User-Friendly Addresses

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
Uppercase letters (such as 'A', ‘B’, ‘C’, ‘D’ etc.) may be used in address strings instead of their lower-case counterparts (such as 'a', ‘b’, ’c’ 'd' etc.).
:::

#### Issues With Raw Addresses

Using the Raw Address form presents two main issues:

1. When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. When using the raw address format, it's impossible to add special flags like those used when sending transactions that employ user-friendly addresses.
   To help you better understand this concept, we’ll explain which flags can be used below.

### User-Friendly Address

User-friendly addresses were developed to secure and simplify the experience for TON users who share addresses on the internet (for example, on public messaging platforms or via their email service providers), as well as in the real world.

#### User-Friendly Address Structure

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
On TON, DNS addresses such as mywallet.ton are sometimes used instead of raw and user-friendly addresses. In fact, DNS addresses are made up of user-friendly addresses and include all the required flags that allow developers to access all the flags from the DNS record within the TON domain.
:::

#### User-Friendly Address Encoding Examples

For example, the "test giver" smart contract (a special smart contract residing in the testnet masterchain that sends 2 test tokens to anyone who requests them) makes use of the following raw address:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

The above "test giver" raw address must be converted into the user-friendly address form. This is obtained using either the base64 or base64url forms (that we introduced previously) as follows:

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
Notice that both forms (_base64_ and _base64url_) are valid and must be accepted!
:::

#### Bounceable vs Non-Bounceable Addresses

The core idea behind the bounceable address flag is sender's funds security.

For example, if the destination smart contract does not exist, or if some issue happens during the transaction, the message will be "bounced" back to the sender and constitute the remainder of the original value of the transaction (minus all transfer and gas fees). This ensures the sender doesn't lose their funds that were sent by accident to an address that cannot accept the transaction.

In relation to bounceable addresses specifically:

1. The **bounceable=false** flag generally means the receiver is a wallet.
2. The **bounceable=true** flag typically denotes a custom smart contract with its own application logic (for example, a DEX). In this example, non-bounceable messages should not be sent because of security reasons.

Feel free to read more on this topic in our documentation to gain a better understanding of [non-bounceable messages](/develop/smart-contracts/guidelines/non-bouncable-messages).

#### Armored base64 Representations

Additional binary data related to TON Blockchain employs similar "armored" base64 user-friendly address representations. These differentiate from one another depending on the first 4 characters of their byte tag. For example, 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence using the below process in order:

- A single byte tag using the _0x3E_ format denotes a public key
- A single byte tag using the _0xE6_ format denotes a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes


The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes such as:  `0xE3, 0x9E, ..., 0x7D`) presents itself through the "armored" representation as follows:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`


### Converting User-Friendly Addresses and Raw Addresses

The simplest way to convert user-friendly and raw addresses is to use one of several TON APIs and other tools, including:

* [ton.org/address](https://ton.org/address)
* [toncenter API methods in mainnet](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter API methods in testnet](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

Additionally, there are two ways to convert user-friendly and raw addresses for wallets using JavaScript:

* [Convert address from/to user-friendly or raw form using ton.js](https://github.com/ton-org/ton-core/blob/main/src/address/Address.spec.ts)
* [Convert address from/to user-friendly or raw form using tonweb](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

It's also possible to make use of similar mechanisms using [SDKs](/develop/dapps/apis/sdk).

### Address Examples

Learn more examples on TON Addresses in the [TON Cookbook](/develop/dapps/cookbook#working-with-contracts-addresses).

