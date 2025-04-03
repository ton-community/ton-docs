# Jettons

## What is a Jetton?

A jetton is a token standard on the TON blockchain. It provides a template for creating customizable digital tokens where each unit is identical and interchangeable with others of the same type.

**Example:** Imagine you create "CoffeeCoins" for your coffee shops. Customers buy these digital tokens and use them for purchases. They can gift them to friends or trade them with other customers. The blockchain ensures each CoffeeCoin is legitimate and tracks ownership changes automatically.

Jettons are used for various purposes, including loyalty programs, gaming, stablecoins, and decentralized applications. For example, on TON, they power games like Hamster Kombat, enable USDT payments, and serve as collectables in projects like Dogs.

Jettons function similarly to ERC-20 tokens on Ethereum, like UNI (Uniswap), a decentralized autonomous organization (DAO) token, or LINK (Chainlink) for decentralized services.

**What can you do with jettons as a TON user?**

With a TON wallet like **Tonkeeper**, you can:

- **Receive and store** jettons securely.
- **Send** them to other users instantly.
- **Buy and sell** jettons on exchanges.
- **Pay** for goods and services, if accepted.
- **Vote in DAOs** if the jetton grants governance rights.
- **Earn rewards** through staking or farming.
- **Use in DeFi**, such as getting loans or providing liquidity.
- **Spend money on games and apps** as part of in-game economies.
- **Create your jettons** for any purpose.

While interacting with jettons feels as simple as sending a message or making a purchase, a system ensures every transaction is processed securely and transparently behind the scenes. Let's take a closer look at how this works.

## How Do Jettons Work?

### Issuance (_Minting Jettons_)

Jettons don't exist on their own—someone has to create them. This process (called **minting**) happens through a special type of **smart contract** called a **master contract** (or **minter contract**), which defines:

- **[Metadata](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes)** – Name, symbol, decimals, and other standard details.
- **Minting Rules** – Logic for creating new jettons and controlling supply.
- **Circulating Supply** – Tracks the total number of jettons in existence.

> A **smart contract** is a **self-executing program** that runs on the TON blockchain, ensuring that transactions follow predefined rules without manual oversight. It consists of **_code_** (_instructions that define how it works_) and **_data_** (_stored information about balances, transactions, and ownership_).  
> **Example:** Think of a smart contract like a _vending machine_. Once programmed, it operates automatically — if you insert the right amount of money (_input_), it dispenses the correct item (_output_) without needing a cashier.

Each master contract has a _unique address_ on the blockchain, similar to a bank account number. Anyone can check this address on a **blockchain explorer** like **[Tonviewer](https://tonviewer.com)** to _verify its authenticity_, _see the minted amount_, _track transactions_, and _review jetton's rules_.

**Example:** One of the most well-known jettons on TON is **[USDT](https://tonviewer.com/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs)**, a **stablecoin pegged to the US dollar**. The USDT jetton master contract manages the _issuance of new USDT tokens_, ensuring they are _minted and distributed_ according to the _rules set by Tether_. Users can _verify the contract address on Tonviewer_, _track the supply_, and _check transaction details_.

You can mint your first jetton using **_[this link](https://docs.ton.org/v3/guidelines/dapps/tutorials/mint-your-first-token)_**.

### Jettons Storage

Once jettons are minted, they are managed through a special smart contract called a **Jetton Wallet Contract**. Each user has a **separate contract** for every type of jetton they own. It acts as a _middle layer_ between the user’s main wallet (e.g., Tonkeeper) and the Jetton Master Contract to manage balances and transactions.

**What happens when you receive tokens for the first time?**

- **Minting the Jettons** – The Jetton Master Contract creates new jettons and assigns them to a recipient.
- **Sending Jettons to the User** – When jettons are sent to a user’s address, a Jetton Wallet Contract is automatically created if the user doesn’t already have one.
- **Generating the Jetton Wallet Address** – This contract's address is calculated based on the _user’s wallet address_ and the _Jetton Master Contract_.
- **Storing Jettons** – The received jettons are deposited into this Jetton Wallet Contract.

**Example: Receiving USDT for the first time**

A user wants to receive 10 USDT (Jettons). The USDT Jetton Master Contract mints 10 USDT and sends them to the user's wallet address.

1. Since the user _does not yet have_ a USDT Jetton Wallet Contract, it is _automatically created_.
2. The 10 USDT are deposited into this contract.
3. The user opens _Tonkeeper_ and sees 10 USDT in their _balance_, even though the actual storage happens inside their Jetton Wallet Contract.

### Managing Jettons: Transfers and Burning

Once jettons are stored in a user's _Jetton Wallet Contract_, they can be **transferred** to other users or **burned** through Jetton Wallet Contracts, **not directly** between main wallets.

Now, let's break down how transfers and burning work.

#### Jettons Transferring

1. **Sender initiates transfer** through their _main wallet_ (like Tonkeeper).
2. **Sender's Jetton Wallet Contract:**
   - Checks balance
   - Deducts tokens
   - Sends to recipient's jetton wallet
3. **Recipient's side:**
   - **If first time:** A new Jetton Wallet Contract is created.
   - **If not:** The existing contract updates balance.

> **Additional Note**:  
> You might wonder how the _recipient’s jetton wallet address_ is determined. When transferring jettons, the recipient’s jetton wallet address is **calculated the same way** as during _the minting process_. The sender’s jetton wallet asks the Jetton Master Contract for the recipient’s wallet address.

**Example: If Alice sends 100 USDT to Bob**

1. Alice's USDT Wallet Contract checks her balance and deducts 100 USDT.
2. If Bob never had USDT, a new USDT Wallet Contract is created for him.
3. The 100 USDT are added to Bob's USDT Wallet Contract.
4. Both see updated balances in Tonkeeper.

#### Jettons Burning

Burning means **permanently removing jettons from circulation** to reduce total supply, potentially making remaining tokens more valuable.

**Burning Process**

1. **User starts burn** through main wallet (like Tonkeeper).
2. **Jetton Wallet Contract:**
   - Checks if user has enough tokens.
   - Removes specified amount from balance.
   - Updates total supply.

**Example: If a project decides to burn 1000 tokens**

1. It burns tokens from its address by interacting with a blockchain wallet.
2. Its Jetton Wallet Contract verifies that 1000 tokens are available.
3. The 1000 tokens are permanently removed.
4. Total supply decreases by 1000.

**Note:** If the user tries to burn more tokens than they have, the transaction fails.

## Jetton Wallet Types

Different types of Jetton Wallet Contracts serve _various purposes_, offer _unique features_, and incur _different gas costs_. Let's look at `jetton_wallet`, the standard Jetton Wallet Contract, and its extensions: `jetton_wallet_v1`, `jetton_wallet_v2`, and `jetton_wallet_governed`.

| Feature                    | `jetton_wallet`                                                                                                                | `jetton_wallet_v1`                                                                                                                                                                    | `jetton_wallet_v2`                                                                                           | `jetton_wallet_governed`                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Main Purpose**           | Basic standard implementation for token transfers and interaction                                                              | Minimal functionality to reduce gas costs, suitable for simple transfers                                                                                                              | Improved version of the standard wallet with better validation and security measures                         | Designed for regulated tokens with administrative control                                                       |
| **Transaction Limits**     | Unlimited                                                                                                                      | Max 4 at once                                                                                                                                                                         | Unlimited                                                                                                    | Unlimited                                                                                                       |
| **Transaction Validation** | Full validation, ensuring correctness before execution                                                                         | No internal validation, relies on external checks                                                                                                                                     | Complete validation, including duplicate transaction checks                                                  | Full validation with additional admin oversight                                                                 |
| **Security Features**      | Full security checks to prevent invalid transactions                                                                           | Minimal security checks, relying on external validation                                                                                                                               | Enhanced security measures including duplicate transaction prevention                                        | Full administrative control to enforce rules and compliance                                                     |
| **User Example**           | _You receive jUSDC and want to send it to a friend._ This wallet ensures full validation of your transaction before execution. | _You frequently send small, low-cost transactions and want to minimize gas fees._ This version reduces internal validation, making transfers more affordable but with increased risk. | _You want extra security to prevent duplicate transactions._ This wallet ensures each transaction is unique. | _You're using a token with compliance rules, like USDT._ The admin can freeze or update the contract if needed. |
| **Gas Costs**              | Standard fees depending on transaction                                                                                         | Lower than standard                                                                                                                                                                   | Optimized (lower than v1)                                                                                    | Standard + admin fees                                                                                           |
| **Special Features**       | Standard token operations like transfers and approvals                                                                         | None                                                                                                                                                                                  | Duplicate transaction prevention and enhanced security                                                       | Admin can freeze wallets, move tokens, and upgrade the contract                                                 |
| **Best For**               | General use                                                                                                                    | Simple transfers                                                                                                                                                                      | Regular users                                                                                                | Regulated assets                                                                                                |
| **Risk Level**             | Low                                                                                                                            | High                                                                                                                                                                                  | Low                                                                                                          | Depends on admin                                                                                                |
| **Balance Queries**        | Built-in – users can check their token balance directly through the contract                                                   | External only – requires external services like blockchain explorers                                                                                                                  | Built-in – users can check their token balance directly through the contract                                 | Built-in – users can check their token balance directly through the contract                                    |
| **Contract Changes**       | No                                                                                                                             | No                                                                                                                                                                                    | No                                                                                                           | Yes (by admin)                                                                                                  |
| **User Control**           | Full – users have complete control over their tokens                                                                           | Full – users have complete control over their tokens                                                                                                                                  | Full – users have complete control over their tokens                                                         | Limited – admin can freeze, revoke, or modify token rules                                                       |
| **Example Token**          | [jUSDC](https://tonviewer.com/EQB_-Jl3VV8WivTYEzVbau9clAzbgGo1p_TXCSTuLbj3Bw49)                                                | [CATI](https://tonviewer.com/EQC744eURWUCKB1OQfRPtBGpOcfwmOh5IT1mp8HDw8uOJGZt?section=code)                                                                                           | [DOGS](https://tonviewer.com/EQDH-NwwndQalqhkJYVNhjqfrMbmC3o6yv4SzjVc_tEqGUMZ?section=code)                  | [USDT](https://tonviewer.com/EQCKNZu98KI2Kh9n-OnDimj_HCe4KY1EhMSQW-PmZgrBjGoM)                                  |

## Mintless Jettons

So far, we've covered different wallet types:

- `jetton_wallet`
- `jetton_wallet_v1`
- `jetton_wallet_v2`
- `jetton_wallet_governed`

They all require tokens to be **minted** first by a _Jetton Master Contract_ before being distributed. Mintless Jettons change this approach. Instead of **pre-minting** and distributing tokens, they allow users to claim their tokens _on demand_ using **Merkle-proof airdrops**.

> Merkle-proof airdrops allow tokens to be distributed **without pre-minting**. Instead of sending tokens to every user in advance, the contract **stores a single cryptographic hash** representing all eligible recipients. Users can then claim their tokens by proving their eligibility with a Merkle proof—this reduces blockchain load and gas fees while making airdrops more scalable.  
> **Example:** Imagine a project that wants to distribute 1,000,000 jettons to 100,000 users.  
> | Airdrop Type | Description |
> |--------------------------|-------------|
> | **Traditional Airdrop** | The project mints all 1,000,000 jettons and sends them individually to each wallet. This results in 100,000 separate transactions, leading to high gas fees and blockchain congestion. |
> | **Merkle-Proof Airdrop** | Instead of minting and distributing tokens upfront, a cryptographic hash (Merkle root) stores all eligible users and balances. Users claim their jettons by submitting a Merkle proof, and tokens are minted on demand, reducing costs and improving efficiency. |

**Key Components of Mintless Jettons**

**Jetton Master (Still Exists, But Works Differently)**

- _Stores a Merkle Root_, which represents a list of eligible addresses and their allocated amounts.
- _Verifies users' claims_ using Merkle Proofs (a cryptographic method to prove eligibility).
- _Mints tokens dynamically_ only when a user requests them instead of pre-minting.

**Jetton Wallets (Created Only When Needed)**

- Unlike standard jettons, Jetton Wallets are **not automatically** generated for every user.
- A wallet is _created only when users claim_ tokens, reducing unnecessary contract deployments and saving gas fees.

**Mintless Jettons Processing**

**1. Airdrop Setup**  
The project team selects eligible participants based on predefined criteria, such as:

- **Active users** of a specific dApp
- **Testnet participants** who contributed during early development
- **Holders of specific tokens** (e.g., TON, USDT, or governance tokens)
- **Winners** of community events, raffles, or campaigns

A script then generates a _Merkle Tree_, which efficiently structures this data.  
The _Merkle Root_ (a single cryptographic hash summarizing the list) is stored in the Jetton Master Contract.

**2. User Claims Tokens**

- Instead of receiving tokens directly, users generate a _Merkle Proof_, proving that their address is part of the airdrop list.
- They submit this proof to the Jetton Master Contract, which _verifies_ it.
- If valid, the contract _mints_ the correct amount of jettons _directly_ into the user's newly created Jetton Wallet.

**Why Is This Important?**

- **More efficient** – No need to pre-mint and send tokens to thousands of wallets.
- **Lower costs** – Saves blockchain resources and reduces gas fees.
- **Greater decentralization** – Users pull their tokens instead of receiving them from a centralized distributor.

**Example:** A notable real-world example of a mintless airdrop on The Open Network (TON) is the **Hamster Kombat** game.

In September 2024, Hamster Kombat planned to distribute **60 billion tokens** to **131 million players**.  
The project utilized _mintless jetton_ technology to manage this massive airdrop efficiently and prevent network overload.  
This approach allowed tokens to be _minted only when players claimed them_, significantly _reducing the load_ on the blockchain and ensuring a _smooth distribution process_.

This implementation showcased the _effectiveness_ of mintless jettons in handling _large-scale token distributions_ without _incurring high costs_ or _causing network congestion_.

## Jettons & Security: How to Stay Safe

As jettons become more popular, **scams and security risks** are also increasing. Fake tokens, phishing attacks, and malicious contracts can lead to lost funds.

Here’s how to protect yourself:

- **Verify Before Interacting** – always check Jettons on TONScan or official sources like GetGems.
- **Use Trusted Wallets** – avoid interacting with unknown tokens or signing transactions you don’t fully understand.
- **Keep Your Private Key Safe** – never enter your seed phrase on websites or apps unless you are 100% sure they are legitimate.
- **Separate Wallets** – use one wallet for holding assets and another for testing or claiming airdrops.
- **Be Cautious with Airdrops** – if you didn’t expect a token, it’s best to ignore it.

## See Also

- [Sharding and Anatomy of Jettons](https://blog.ton.org/how-to-shard-your-ton-smart-contract-and-why-studying-the-anatomy-of-tons-jettons)
- [Mintless Jettons](https://www.google.com/url?q=https://docs.ton.org/v3/guidelines/dapps/asset-processing/mintless-jettons&sa=D&source=docs&ust=1740432924481649&usg=AOvVaw0J6Uk8hqiUz4bbuvv-5UsB)
- [Jetton Processing](https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons)
