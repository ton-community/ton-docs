# Vesting owner guide

This guide explains how to create a vesting wallet and its components. It clarifies key concepts and provides step-by-step instructions for execution.

## What is vesting?

In blockchain and cryptocurrencies, __vesting__ refers to a process in which tokens or coins are released to their holders over a predetermined period rather than all at once. Here are the key aspects broken down:

### The purpose:

- The primary goal of vesting is to encourage long-term commitment to a project.
  
- It helps prevent sudden and massive sell-offs (commonly known as *dumps*) that could destabilize the market and negatively impact the project's value.
  
- It aligns the interests of team members, investors, and advisors with the project's long-term success.

### How it works:

- A __vesting schedule__ is established, detailing when and how the tokens will be released.
  
- This schedule can vary, with tokens being released monthly, quarterly, annually, or based on achieving specific milestones.
  
- There are often __cliff__ periods during which no tokens are released for an initial duration, followed by subsequent releases.

:::info Technical details and parameters
For all technical details about the contract, see [vesting contract](v3/documentation/smart-contracts/contracts-specs/vesting-contract)
:::

## Step-by-step instructions

You can follow these steps to create and manage a vesting wallet as the vesting sender (owner). This guide will walk you through setting up your wallet, securing your funds, and executing transactions on Testnet.

### 1: Create an owner's wallet

- Set up a regular TON wallet using [MyTonWallet](https://mytonwallet.io/) or [Tonkeeper](https://tonkeeper.com/) wallet.       
- Safely store your seed phrase, as it controls all your tokens.
- Get some Testnet coins from [@testgiver_ton_bot](https://t.me/testgiver_ton_bot)

### 2: Activate the owner's address
 
- Send **0.1 TON** to any address to activate the address.
    
### 3: Create a vesting wallet

-   Visit [vesting.ton.org](https://vesting.ton.org/?testnet=true#) and connect your wallet.

![](/img/tutorials/vesting/connect-owner-wallet-1.png)
![](/img/tutorials/vesting/connect-owner-wallet-2.png)
![](/img/tutorials/vesting/connect-owner-wallet-3.png)
![](/img/tutorials/vesting/connect-owner-wallet-4.png)
    
- Search for your wallet address.

![](/img/tutorials/vesting/search-owner-address.png)
 
- Add a whitelisting address; this will be the address on the contract that will accept/send funds.
 ![](/img/tutorials/vesting/add-whitelist-address.png)
  ![](/img/tutorials/vesting/add-whitelist-address-2.png)
 
- Click __Create new vesting for this use__.
![](/img/tutorials/vesting/create-new-vesting.png)
    
- Enter your vesting details:
    
    - Total vesting amount  (total locked Toncoins)
    - Total vesting duration (total vesting period duration)
    - Cliff duration (initial lock period before first release)
    - Unlock period (time interval between releases)

(All parameters can be set to your preferred values.)      
![](/img/tutorials/vesting/create-new-vesting-2.png)   

### 4: Confirm vesting details

- Ensure the displayed Owner’s Wallet address is correct.
    
- Review vesting parameters carefully.
    
- Confirm the transaction through your wallet.
![](/img/tutorials/vesting/confirm-creation.png) 

### 5: Verify vesting wallet

- Check your transaction details on the [TON Viewer](https://testnet.tonviewer.com) or [TON Scan](https://testnet.tonscan.org).
    
- Confirm that the vesting wallet address is accurate.
    
![](/img/tutorials/vesting/created-wallet.png) 

- Your vesting wallet is now set to receive Toncoins.

### 6: Test and validate

- [Send a test transfer](/v3/guidelines/dapps/tutorials/vesting-examples/vesting-recipient-guide) to the vesting wallet.
    
- Confirm ownership by attempting to return a test transfer to the sender.
![](/img/tutorials/vesting/sending-from-vesting.png) 
![](/img/tutorials/vesting/sending-from-vesting-2.png)
![](/img/tutorials/vesting/sending-from-vesting.png)   

## Good to Know

- Only the owner’s wallet controls the vesting wallet.
- Ensure all transactions are conducted using bounceable address formats to avoid errors.
- For address format checks, use [@tonaddress_bot](https://t.me/tonaddress_bot).
