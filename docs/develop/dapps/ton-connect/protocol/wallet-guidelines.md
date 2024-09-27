# Wallet Guidelines

## Networks

### There aren't many networks.

   At the moment, there are only two networks - Mainnet and Testnet.
   In the foreseeable future, the emergence of new Mainnet TON-like networks is not expected. Note that the current Mainnet has a built-in mechanism for alternative networks - workchains.


### Hide the Testnet from ordinary users.

Testnet is used exclusively by developers. Ordinary users should not see the Testnet.
This means that switching to Testnet should not be readily available and users SHOULD NOT be prompted to switch wallet to Testnet even if DAppis in Testnet.
Users switch to Testnet, don't understand this action, can't switch back to Mainnet.

For these reasons, dapps do not need to switch networks in runtime, on the contrary, it is more preferable to have different instances of DAppon different domains dapp.com, Testnet.dapp.com.
For the same reason there is no `NetworkChanged` or `ChainChanged` event in the Ton Connect protocol.


###  Do not send anything if the DAppis in Testnet and the wallet is in Mainnet.

   It is necessary to prevent loss of funds when DApptries to send a transaction in Testnet, and the wallet sends it in Mainnet.

   Dapps should explicitly indicate `network` field in `SendTransaction` request.

   If the `network` parameter is set, but the wallet has a different network set, the wallet should show an alert and DO NOT ALLOW TO SEND this transaction.

   The wallet SHOULD NOT offer to switch to another network in this case.

## Multi accounts

Multiple network accounts can be created for one key pair. Implement this functionality in your wallet - users will find it useful.

### In general, there is no current "active" account

At the moment, the TON Connect is not built on the paradigm that there is one selected account in the wallet, and when the user switches to another account, the `AccountChanged` event is sent to dapp.

We think of a wallet as a physical wallet that can contain many "bank cards" (accounts).

In most cases the sender address is not important to dapp, in these cases the user can select the appropriate account at the time of approving the transaction and the transaction will be sent from selected account.

In some cases, it is important for DAppto send the transaction from a specific address, in which case it explicitly specifies the `from` field in `SendTransaction` request. If `from` parameter is set, the wallet should DO NOT ALLOW user to select the sender's address; If sending from the specified address is impossible, the wallet should show an alert and DO NOT ALLOW TO SEND this transaction.

### Login flow

When DAppconnects the wallet, the user selects in the wallet one of their accounts that they want to log into dapp.

Regardless of what accounts the user uses next in the wallet, DAppworks with the account he received on the connection.

Just like if you logged into a web service with one of your email accounts - if you then change the email account in the email service, the web service continues to use the one he got when you logged in.

For this reason, the protocol does not provide the `AccountChanged` event.

To switch account user need to disconnect (Log out) and connect  (Login) again in DAppUI.

We recommend wallets provide the ability to disconnect session with a specified DAppbecause the DAppmay have an incomplete UI.

## See Also

* [TON Connect Overview](/dapps/ton-connect/overview)
* [Connect a Wallet](/dapps/ton-connect/wallet)
