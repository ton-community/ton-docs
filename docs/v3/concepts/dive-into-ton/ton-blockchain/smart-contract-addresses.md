# Smart Contract Addresses

[//]: # (TODO, this is gpt)

On the TON Blockchain, every actor, including wallets and smart contracts, is represented by an address. These addresses are critical for receiving and sending messages and transactions. There are two main formats for smart contract addresses: **raw addresses** and **user-friendly addresses**.

## Address Components

Each address on TON consists of two main components:
- **Workchain ID**: A signed 32-bit integer that denotes which workchain the contract belongs to (e.g., `-1` for the Masterchain and `0` for the Basechain).
- **Account ID**: A unique identifier for the contract, generally 256 bits in length for the Masterchain and Basechain.

## Raw vs. User-Friendly Addresses

### Raw Address
A **raw address** contains only the basic elements:
- **Workchain ID** (e.g., `-1` for Masterchain)
- **Account ID**: A 256-bit unique identifier

Example:  
`-1:fcb91a3a3816d0f7b8c2c76108b8a9bc5a6b7a55bd79f8ab101c52db29232260`

However, raw addresses have two main issues:
1. They lack built-in error checking, meaning a mistake in copying can lead to loss of funds.
2. They do not support additional features like bounceable/non-bounceable flags.

### User-Friendly Address

A **user-friendly address** solves these problems by incorporating:
1. **Flags**: Indicates if the address is bounceable (for contracts) or non-bounceable (for wallets).
2. **Checksum**: A 2-byte error-checking mechanism (CRC16) that helps detect errors before sending.
3. **Encoding**: Transforms the raw address into a readable, compact form using base64 or base64url.

For example, the same raw address can be converted into a user-friendly address like:  
`kf/8uRo6OBbQ97jCx2EIuKm8Wmt6Vb15+KsQHFLbKSMiYIny` (base64)

User-friendly addresses make transactions safer by preventing errors and allowing the return of funds in case of failed transactions.

## Address States

Each address on TON can be in one of the following states:
- **Nonexist**: The address has no data (initial state for all addresses).
- **Uninit**: The address has a balance but no smart contract code.
- **Active**: The address is live with smart contract code and balance.
- **Frozen**: The address is locked due to storage costs exceeding its balance.

## Converting Between Address Formats

To convert between raw and user-friendly addresses, you can use TON APIs or developer tools like [ton.org/address](https://ton.org/address). These utilities allow seamless conversion and ensure proper formatting before sending transactions.

For more details on how to handle these addresses, including encoding examples and transaction security, you can refer to the full guide in [Addresses Documentation](/learn/overviews/addresses).

## See Also

* [Smart Contracts Addresses Documentation](/learn/overviews/addresses)
