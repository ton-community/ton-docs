# Vesting recipient guide

As a vesting recipient, you receive funds from a vesting wallet based on the set schedule. Think of it as a way to receive Toncoins over a longer period instead of all at once.

This guide walks you through the process of verifying transactions and withdrawing funds.

## Step-by-step instructions

### Create a recipient wallet

- Set up a regular TON wallet using [MyTonWallet](https://mytonwallet.io/) or [Tonkeeper](https://tonkeeper.com/) wallet.
- Safely store your seed phrase, as it controls all your tokens.
- Get some Testnet coins from [@testgiver_ton_bot](https://t.me/testgiver_ton_bot)

### Activate the recipient's wallet

- Send **0.1 TON** to any address to activate the address.

### Request the vesting address

- Use MyTonWallet, Tonkeeper, or any TON Connect-supported wallet.
- Request the vesting wallet address from the contract owner.
- Request the contract owner to add you to the vesting contract's whitelist.  

### Verify your address

- Visit the vesting wallet on  [TON Viewer](https://testnet.tonviewer.com) or [TON Scan](https://testnet.tonscan.org).
- Confirm your address appears in the whitelist.

### Test transaction

- Send a small test transaction to the vesting wallet.
- Confirm the transaction through your wallet.

![](/img/tutorials/vesting/recepient-sending.png)
![](/img/tutorials/vesting/recepient-sending-confirm.png) 

### Withdraw funds

- Ensure there are liquid funds available for withdrawal.
- Request withdrawal transfer from the owner. Make sure to provide the address to the owner in a bouncable format to avoid transaction errors (**Exit 101**).
- Use [@tonaddress_bot](https://t.me/tonaddress_bot) for address format checks. (A bouncable address looks like the following (for testnet): `kQAm3gq6p4cl7xvo8NC6CxqBqqjt-BBcOMqC8lYJ7D78LKJP`)
- Confirm the transaction through your wallet.
- Only whitelisted addresses can receive funds from the vesting wallet.
    - The token distribution from the vesting contract is strictly controlled, requiring specific criteria for whitelisting addresses or the sender's address to prevent unauthorized access and token loss.
- Always double-check the vesting wallet details on official explorers like [TON Viewer](https://testnet.tonviewer.com) or  [TON Scan](https://testnet.tonscan.org).
