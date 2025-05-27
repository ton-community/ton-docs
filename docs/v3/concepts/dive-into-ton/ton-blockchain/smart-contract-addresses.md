import Feedback from '@site/src/components/Feedback';

# Smart contract addresses

On the TON Blockchain, every actor, including wallets and smart contracts, is represented by an address. These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## Address components

Each address on TON consists of two main components:
- **Workchain ID**: A signed 32-bit integer that denotes which workchain the contract belongs to (e.g., `-1` for the Masterchain and `0` for the Basechain).
- **Account ID**: A unique identifier for the contract, generally 256 bits in length for the Masterchain and Basechain.

## Address states

Each address on TON can be in one of the following states:
- **Nonexist**: The address has no data (initial state for all addresses).
- **Uninit**: The address has a balance but no smart contract code.
- **Active**: The address is live with smart contract code and balance.
- **Frozen**: The address is locked due to storage costs exceeding its balance.

## Address formats

A TON address uniquely identifies a contract in the blockchain, indicating its workchain and original state hash. [Two standard formats](/v3/documentation/smart-contracts/addresses#raw-and-user-friendly-addresses) are used: **raw** (workchain and HEX-encoded hash separated by the ":" character) and **user-friendly** (base64-encoded with certain flags).

```
User-friendly: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
Raw: 0:ca6e321c7cce9ecedf0a8ca2492ec8592494aa5fb5ce0387dff96ef6af982a3e
```

## User-friendly address

A **user-friendly address** designed for blockchain users with features:
1. **Flags**: Indicates if the address is bounceable for contracts or non-bounceable for wallets.
2. **Checksum**: A 2-byte error-checking mechanism CRC16 that helps detect errors before sending.
3. **Encoding**: Transforms the raw address into a readable, compact form using base64 or base64url.

Example: `EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF` (base64)

User-friendly addresses make transactions safer by preventing errors and allowing the return of funds in case of failed transactions.

### User-friendly address flags

Two flags are defined: **bounceable**/**non-bounceable** and **testnet**/**any-net**. The first letter of the address reflects address type because it stands for the first 6 bits in address encoding, and flags are located in these 6 bits according to [TEP-2](https://github.com/ton-blockchain/TEPs/blob/master/text/0002-address.md#smart-contract-addresses):

| Address beginning | Binary form | Bounceable | Testnet-only |
|:-----------------:|:-----------:|:----------:|:------------:|
|        E...       |  000100.01  |    yes     |   no         |
|        U...       |  010100.01  |     no     |   no         |
|        k...       |  100100.01  |    yes     |   yes        |
|        0...       |  110100.01  |     no     |   yes        |

:::tip
The Testnet-only flag doesn't have representation in the blockchain at all. The non-bounceable flag makes a difference only when used as the destination address for a transfer: in this case, it [disallows bounce](/v3/documentation/smart-contracts/message-management/non-bounceable-messages) for a message sent; the address in blockchain, again, does not contain this flag.
:::

```
default bounceable: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF
urlSafe: EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff+W72r5gqPrHF
non-bounceable: UQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPuwA
Testnet: kQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPgpP
non-bounceable, Testnet: 0QDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPleK
```

## Raw address
A **raw address** contains only the basic elements:
- **Workchain ID** (e.g., `-1` for Masterchain)
- **Account ID**: A 256-bit unique identifier

Example:  
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

However, raw addresses have two main issues:
1. They lack built-in error checking, meaning a mistake in copying can lead to loss of funds.
2. They don't support additional features like bounceable/non-bounceable flags.

## Converting between address formats

Convert raw, user-friendly addresses using [ton.org/address](https://ton.org/address/).

For more details, refer to the refhandling guide in the [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/) section.

## See also

- [Explorers in TON](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton/)
- [Smart contracts addresses documentation](/v3/documentation/smart-contracts/addresses/)

<Feedback />

