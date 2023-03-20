# Smart Contract Addresses

This section will detail the specifics of smart contract addresses on TON Blockchain. It will also explain how actors are synonymous with smart contracts on TON.

## Everything is a Smart Contract

On TON, smart contracts are built using the [Actor model](/learn/overviews/ton-blockchain#single-actor). In fact, actors in TON are technically represented as smart contracts. This means that even your wallet is a simple actor (and smart contract).

Typically, actors process incoming messages, change their internal state, and generate outbound messages as a result. That's why every actor (i.e., smart contract) on TON Blockchain must have an address so it is able to receive messages from other actors.

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

Nowadays, only the Masterchain (workchain_id=-1) and occasionally the basic workchain (workchain_id=0) are running in the TON Blockchain.

Both of them have 256-bit addresses, so we henceforth assume that workchain_id is either 0 or -1 and that the address inside the workchain is exactly 256-bit.

#### Account ID

All account IDs on TON make use of 256-bit addresses on the MasterChain and BaseChain (or basic workchain).

In fact, Account ID’s **(account_id)** defined as hash functions for smart contract objects (particular, the SHA256). Every smart contract operating on the TON blockchain stores two main components. These include:

1. _Compiled code_. Logic of smart contract compiled in byte code.
2. _Initial state_. Contract’s values in its initial moment deploying on-chain.


Finally, to correctly receive the address account it is necessary to calculate the hash corresponding to the pair **(Initial code, Initial state)** object. At this time, we won't take a deep dive into how the [TVM](/learn/tvm-instructions/tvm-overview)works, but it's important to understand that account ID’s on TON are determined using this formula:
:
**account_id = hash(initial code, initial state)**

In time, throughout this documentation, we'll dive deeper into the technical specifications and overview of the TVM and TL-B scheme. Now that we are familiar with the formation of **account_id** and their interaction with smart contract addresses on TON, let’s explain Raw and User-Friendly addresses.

## Raw and User-Friendly Addresses

After providing a brief overview of how smart contract addresses on TON leverage workchains and account ID’s (for the MasterChain and BaseChain specifically), it's important to understand that these addresses are expressed in two main formats:

* **Raw addresses**: Original full representation of smart contract addresses.
* **User-friendly addresses**: User-friendly addresses are an enhanced format of raw address that employ better security and ease of use.

Below, we’ll explain more about the differences between these two address types and dive deeper into why user-friendly addresses are used on TON.

### Raw address

Raw smart contract addresses consist of a workchain ID and account ID *(workchain_id, account_id)* and are displayed in the following format:

* [decimal workchain_id\]:[64 hexadecimal digits with account_id\]


Provided below, is an example of a raw smart contract address using a  workchain ID and account ID together (expressed as **workchain_id** and **account_id**):

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Notice the `-1` at the start of the address string, this denotes a _workchain_id_ that belongs to the MasterChain.

:::note
Uppercase letters (such as 'A', ‘B’, ‘C’, ‘D’ etc.) may be used in address strings instead of their lower-case counterparts (such as 'a', ‘b’, ’c’ 'd' etc.).
:::

#### Issues With Raw Addresses

Using the Raw Address form presents two main issues:

1. When using the raw address format, it's not possible to verify addresses to eliminate errors prior to sending a transaction.
   This means that if you accidentally add or remove characters in the address string prior to sending the transaction, your transaction will be sent to the wrong destination, resulting in loss of funds.
2. It's not possible to add any special flags as you can in user-friendly version.  
_We will cover which flags you can use below._

### User-friendly address

User-friendly address was created to secure and simplify experience for the end users of TON who will share address on the web, inside the Telegram and in real life.

#### How to obtain user-friendly address?

"User-friendly" address is obtained by generating:

1. _[1 byte for flag]_ — Flag changes the way smart-contract reacts to the message.  
Flags of the user-friendly address:
   - isBounceable. (_0x11_ for "bounceable", _0x51_ for "non-bounceable")
   - isTestnetOnly. Add _0x80_ if the address should not be accepted by software running in the production network.
   - isUrlSafe. Deprecated flag, as all addresses are url safe now.
2. _\[1 byte for workchain_id]_ — A signed 8-bit integer with the _workchain_id_.  
(_0x00_ for the BaseChain, _0xff_ for the MasterChain)
3. _\[32 bytes account_id]_ — 256 bits address inside the workchain. ([big-endian](https://www.freecodecamp.org/news/what-is-endianness-big-endian-vs-little-endian/))
4. _\[2 bytes for verification]_ — CRC16-CCITT signature of the previous 34 bytes. ([example](https://github.com/andreypfau/ton-kotlin/blob/ce9595ec9e2ad0eb311351c8a270ef1bd2f4363e/ton-kotlin-crypto/common/src/crc32.kt))
In fact, the idea of verification is pretty similar to the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) used in every bank card in the world to prevent you from writing non-existing card number by mistake.

Finally, you will have `1 + 1 + 32 + 2 = 36` bytes totally!

To get "user-friendly" address, you need to encode the obtained 36 bytes using either:
- _base64_ (i.e., with digits, upper and lowercase Latin letters, '/' and '+')
- _base64url_ (with '_' and '-' instead of '/' and '+')

After that you receive a "user-friendly" address with a length of 48 non-space characters.

:::info FLAG in DNS address
In TON it's possible to use DNS address like `mywallet.ton` instead of raw and user-friendly form. In fact, DNS address covers the user-friendly address with all the flags inside. So you can get all the flags from the DNS record of the TON domain.
:::

#### Example of user-friendly address

For example, the "test giver" (a special smart contract residing in the masterchain of the Testnet that gives up to 20 test coins to anybody who asks) has raw address:

`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

Let's convert "test giver" raw address to the user-friendly form:

* `kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)
* `kf_8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15-KsQHFLbKSMiYIny` (base64url)

:::info
Notice that both forms (_base64_ and _base64url_) are valid and must be accepted!
:::

#### Bounceable vs non-bounceable addresses

The core idea behind the "bounceable" flag is security for sender.

For example, if the destination smart contract does not exist, or if it throws an unhandled exception while processing this message, the message will be "bounced" back carrying the remainder of the original value (minus all message transfer and gas fees).

In fact, **bounceable=false** means that receiver is a wallet and **bounceable=true** is a custom smart contract with own logic (for example, DEX) and you shouldn't send him any non-bounceable messages because of the security reasons.

Read more in [Non-bounceable messages](/develop/smart-contracts/guidelines/non-bouncable-messages) article.

#### Did you know?

Incidentally, other binary data related to the TON Blockchain has similar "armored" base64 representations, differing by their first bytes. For example, the ubiquitous 256-bit Ed25519 public keys are represented by first creating a 36-byte sequence as follows:
- one tag byte _0x3E_, meaning that this is a public key
- one tag byte _0xE6_, meaning that this is a Ed25519 public key
- 32 bytes containing the standard binary representation of the Ed25519 public key
- 2 bytes containing the big-endian representation of CRC16-CCITT of the previous 34 bytes

The resulting 36-byte sequence is converted into a 48-character base64 or base64url string in the standard fashion. For example, the Ed25519 public key `E39ECDA0A7B0C60A7107EC43967829DBE8BC356A49B9DFC6186B3EAC74B5477D` (usually represented by a sequence of 32 bytes `0xE3, 0x9E, ..., 0x7D`) has the following "armored" representation:

`Pubjns2gp7DGCnEH7EOWeCnb6Lw1akm538YYaz6sdLVHfRB2`


### Convert User-friendly/raw address

The most simple way to convert address by hand is a bunch of official tools and APIs:

* [ton.org/address](https://ton.org/address)
* [toncenter API methods in mainnet](https://toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)
* [toncenter API methods in testnet](https://testnet.toncenter.com/api/v2/#/accounts/pack_address_packAddress_get)

Also, there are 2 ways to work with wallets using JavaScript:

* [Convert address from/to user-friendly or raw form using ton.js](https://github.com/ton-community/ton/blob/master/src/address/Address.spec.ts)
* [Convert address from/to user-friendly or raw form using tonweb](https://github.com/toncenter/tonweb/tree/master/src/utils#address-class)

It's possible to find the same methods in [SDK](/develop/dapps/#most-popular-sdk) for other languages too.

