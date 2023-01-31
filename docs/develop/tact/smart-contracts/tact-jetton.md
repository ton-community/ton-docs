# Tact Jetton smart contract

## Jetton is a part of TON.

Jettons are custom fungible tokens on the TON Blockchain. It's digital assets, that allow to support business process flow with zero trust functions in transaction.
In TON Blockchain Jettons declares according to [Jetton standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md). This standard already fully successfully
implemented with FunC language and support in libraries in various languages. Some of them, you can find and research for [here](docs/develop/dapps/defi/tokens).

The scope of this article is remind how jetton standard could be implemented in Tact language, and researching how this works in blockchain.
Note, that jetton.tact used for learning goals and was not fully tested. You can test it and use for production on your own risk.

Take example of project from GitHub:

```bash
git clone https://github.com/Reveloper/tact-jetton.git
cd tact-jetton
```
### Contract implementation

tact-jetton demonstrate how relationships between messages should be implemented. Idea of scaling in TON allows to think about Jetton standard as a workable process even if userbase will grow in digits.
It becomes possible, because in TON Jetton standard we have no any elements, that could slow down - we have no bottleneck here. But why does this possible and what the price?
- This is possible, because every part of jetton processing become independent element(smart contract) of the whole jetton wallets. No matter how many users' income, it's just increase quantity of smart contracts and will not slow down blockchain.
- Price we have to pay is increasing of compositely for this technology. Asynchronous messages increase number of cases, we have to handle in smart contracts, and developers of smart contract have to solve this during designing of smart-contract.

### Classic task of digital token.

Suppose we have amount of users with wallets(wallet smart contract) with funds on them in native Blockchain currency. Now, we want somehow to add tokens to user's wallet.
In general, issue that we meet with implementing of tokens are:
* How to store balance of token's users in Blockchain?
* How to get general statistic of token from Blockchain?
* How to implement transfer?

From this point, classic implementation for these features could be designed. Let's try figure out one by one.

* Store token contract balance. We can use as additional field in wallet smart contract - let's say it Ext Wallet contract. That contract will keep token ID(contract and correspondingly token value)
* Get general statistic of token in Blockchain. For our convenience, we want create special contract, where all our total values will be store.
  ![deployment-1](/img/docs/tact-jetton/tact-jetton-1.png)
  Both actions will be delivered to off-chain space, where we will display and use it in our application.
 
  
* Implement transfer. We can use special transfer between wallet contracts, that will update their balance.
According, what information
  ![deployment-2](/img/docs/tact-jetton/tact-jetton-2.png)
And here we noticed first issue in designing. For each update of wallet's token balance, we should update data in Master Smart Contract. The problem is, that if we get say, millions of users, our Master contract is bottleneck. Because of that, we have to exclude all dynamic data of Token from Master Smartcontract. 
Store balance of token's users in Blockchain?
* ~~Keep general dynamic data of token in public blockchain.~~
* Transfer token balance with extended transaction in regular message.
* Keep additional currencies in same, but extended version of wallet contract.

Ok our problem about general information could be solved with indexer of blockchain. It takes additional resource from us, but allows use master contract only for get methods(to display in apps general static information about token).

But what about transfers and balance's for tokens. Are there any issues?
Let's remember, that we have a billion of users, and soppouse we want supports hudreds, thousands or millions of tokens. No matter. What if we will try keep all of them in the one Extended Wallet Contract?
Our wallet's storage become really big, that will invoke increasing storage fee(correspondingly for EACH outgoing transfer).
![deployment-3](/img/docs/tact-jetton/tact-jetton-3.png)
As result, in years, user wallet have to pay for each outgoing message huge storage-fee, even if he will not use Token anymore. That's why(but not only reason) we shouldn't keep Token's balance in wallet contract.
If we can't keep in wallet balance, we have to create new scheme of transfers for each token.
* ~~Keep general dynamic data of token in public blockchain.~~
* ~~Transfer token balance with extended transaction in regular message.~~
* ~~Keep additional currencies in same, but extended version of wallet contract.~~


### Reveal the Jetton
In TON digital tokens was named Jettons. Now, we will walk through the Jetton standard and see how problems we met previously were solved.

