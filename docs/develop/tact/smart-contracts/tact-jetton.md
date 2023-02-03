# Tact Jetton smart contract

:::caution article in open beta
Did you notice something unclear, incorrect or get stuck with some issue in guide? Please ask a question in the Telegram [chat](https://t.me/tondev_eng) or text me directly [@iftryalexg](https://t.me/iftryalexg).
Guide will be updated ASAP and all unclear points will be clarified 🚒💦🔥.
:::

### Jetton is a part of TON

Jettons is implementation fungible tokens on the TON Blockchain. Fungible Tokens means that they have a property that makes each Token be exactly the same (in type and value) as another Token. From the side of users - it's digital tool in blockchain, that allow to organize business process of distribution and keeping funds with zero trust functions in transaction.
In TON Blockchain Jettons declared according to [Jetton standard](https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md). This standard already fully successfully
implemented with FunC language and support in libraries in various languages. Some of them, you can find and research [here](docs/develop/dapps/defi/tokens).

The scope of this article are:
* Remind how Fungal Tokens works in TON blockchain.
* Research how jetton standard could be implemented in the Tact language.

:::info
Note, that `jetton.tact` used for learning goals and was not fully tested. You can test it and use for production on your own risk.
:::

### Jetton as example of designing architecture

Implementation of jetton demonstrate how relationships between contracts could be implemented. Idea of scaling in TON allows to think about Jetton standard as a workable process even if userbase will grow in digits.
It becomes possible, because in Jetton standard we have no any parts, that could slow down. But why does this possible and what the price?
- This is possible, because every part of jetton processing become independent element(smart contract) of the whole jetton wallets. No matter how many users will come, it's just increase quantity of smart contracts, shards and will not slow down blockchain.
- Price we have to pay is increasing of complexity of development. Asynchronous messages increase number of cases, we have to handle in smart contracts. Developers of smart contract have to solve this during at very first steps of designing smart-contract.

### Classic issue of fungible token

Suppose we have amount of users with wallets(wallet smart contract) with funds on them in native Blockchain currency. Now, we want somehow to add tokens to user's wallet.
In general, issue that we meet with implementing of tokens are:
* How to keep balance of users' tokens in the blockchain?
* How to get general statistic of token from blockchain?
* How to implement transfer?

In the [ERC20](https://ethereum.org/ru/developers/docs/standards/tokens/erc-20/) standard we keep balance and processing transaction in special token contract.
If we want to deliver to user information about his balance, we read data from his wallet and token contract.
  ![jetton-1](/img/docs/tact-jetton/tact-jetton-1.png)
Both actions will be delivered to off-chain space, where we will display and use it in our application.
Here, Wallet A, Wallet B - regular wallet contracts.
 
  
* Implement transfer. We can use special transfer between wallet contracts, that will update their balance.
According, what information
  ![jetton-2](/img/docs/tact-jetton/tact-jetton-2.png)

With sharding paradigms in TON blockchain we can without problem support million of users and millions of transactions. But for Token Master will always live in one shard, and become unscalable now. 

![jetton-5](/img/docs/tact-jetton/tact-jetton-5.png)

And what we can do, to solve this issue? Redesign our solution to case, where every atomic part(smart contract) of our process is a small blockchain, that will never grow to infinity.

### Reveal the Jetton
In TON digital tokens was named Jettons. Now, we will walk through the Jetton standard and see how problems we met previously were solved.

Because of sharding, where payload on Blockchain will split to different nodes, we need keep our contracts as small blockchains.
:::info
Every time you noticed, that your contract keep growing to infinity map in your contract-like-big-monolith - something in designing of service went wrong.
:::
To keep possibility make our smart contracts split shards we want keep all smart contracts as small blockchain.

Let's take a look how regular transfer Jetton works according to standard.
![jetton-6](/img/docs/tact-jetton/tact-jetton-6-b.png)

Here scheme of transfer tokens from user of _Wallet App A_ to user _Wallet App B_:
1. _Wallet App A_ connects with our wallet smart contract _Wallet A_ and request to send Jetton transfer message.
2. _Wallet A_ sends to our Jetton wallet message with request of sending jettons.
3. _Jetton A_ sends to _Jetton B_ value of jetton we want to transfer. Decrease his own balance of jettons.
4. _Jetton B_ send notification to wallet contract _Wallet B_.

Notification necessary to find out what is balance of Jetton contract, because you have no option to get(use get method) information from contract.

If we will scale our user base, we just get growing of little blockchains. THere will not appear big monolith entity now.
![jetton-7](/img/docs/tact-jetton/tact-jetton-7.png)

When quantity of actual contracts become to large, they will split to different shardchains.
Each of these contracts has fixed size state and each contract may live in own shardchain. In this way contracts can live in one shardchain(i.e. Shard 1) and never touch other smart contracts

![jetton-8](/img/docs/tact-jetton/tact-jetton-8.png)


### Jetton with Tact

Take example of project from GitHub:

```bash
git clone https://github.com/Reveloper/tact-jetton.git
cd tact-jetton
```

In `jetton.tact` defines minter contract, that will deploy initial contracts of jetton wallets with special "Mint" message.
Minter, usually used before Token become using by users, to distribute to all owners. In current case, we will deliver all Tokens to one owner and instantly deactivate option of mint again.
Look briefly to our contract:


```java title="tact-wallet/sources/jetton.tact"
import "@stdlib/jetton";

message Mint {
    amount: Int;
}

contract SampleJetton with Jetton {

    totalSupply: Int as coins;
    owner: Address;
    content: Cell?;
    mintable: Bool;

    init(owner: Address, content: Cell?) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        self.mint(ctx.sender, msg.amount, ctx.sender);
    }

    receive("Mint!") {
        let ctx: Context = context();
        self.mint(ctx.sender, 1000000000, ctx.sender);
    }
}
```
In general, this contract receive "Mint" message, and if it happens he invoke mint() function,
that declared in `@stdlib/jetton`. mint() create message and send it to new wallet address.

![jetton-8](/img/docs/tact-jetton/tact-jetton-9.png)
1. _Wallet App A_ send request to _Wallet A_ send mint message to minter. Currently Minter does not exist in blockchain.
2. _Wallet A_ send "Mint" message to Minter's contract address. When it delivered, Minter become deployed and invoke in its mint() function.
3. _Minter_ send to _Jetton A_ address Transfer message with token's supply value. When it delivered, Jetton A contract become deployed.

Similar process happens when user of _Wallet App A_, want to send tokens to user of _Wallet App B_.
The trick is, our contract Jetton always send information and the whole code to another address. When it comes to destination, code executes and from case was it deployed before or already deployed.
In this case - [transfer](https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton/messages.tact#L1) jetton message become the initial message at same moment and deploys Jetton B smart contract.

![jetton-8](/img/docs/tact-jetton/tact-jetton-10.png)

From [wallet.tact](https://github.com/ton-core/tact/blob/main/stdlib/libs/jetton/wallet.tact#L38), we can see, that it will create initial data for new jetton wallet contract:

```java title="ton-core/tact/stdlib/libs/jetton/wallet.tact"
//previous code

       let init: StateInit = initOf JettonDefaultWallet(self.master, msg.destination);
        let walletAddress: Address = contractAddress(init);
        send(SendParameters{
            to: walletAddress, 
            value: 0,
            mode: SendRemainingValue, 
            bounce: true,
            body: TokenTransferInternal{
                amount: msg.amount,
                queryId: msg.queryId,
                from: self.owner,
                responseAddress: self.owner,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });
        
```

Here, `initOf` allows to calculate new contract's init data.
It calculates from address of regular `Wallet B`, here `msg.destination` and address of Token master contract `self.master`. Because of that we always now both, we can now what address we will use as destination.


To display all data clear, application should read each element of process with get methods. It is job, that, for example, have to do blockchain explorers.
![jetton-8](/img/docs/tact-jetton/tact-jetton-11.png)

### Deployment of tact.jetton

This project has ready-made example of script for deploying jetton in testnet. Specify following things: 

* Input your deployment Testnet wallet seed here:
```java title="tact-wallet/sources/jetton.deploy.ts"
  // Insert your test wallet's 24 words, make sure you have some test Toncoins on its balance. Every deployment spent 0.5 test toncoin.
  let mnemonics = "multiply voice predict admit hockey fringe flat bike napkin child quote piano";
```

* Input owner address here:
```java title="tact-wallet/sources/jetton.deploy.ts"
  // Owner should usually be the deploying wallet's address.
  let owner = Address.parse('kQDND6yHEzKB82ZGRn58aY9Tt_69Ie_uz73e2V...');
```
* Note, that in deployment script using walletV4. If you want use your V3R2, you need change wallet contract here.

* Run deployment script
```bash
  yarn deploy
```

As a result of successfully deployment, you should deploy two contracts:
* Minter, Token Master - [example](https://testnet.ton.cx/address/EQDupHQXvagCZ3RpkeMZ0dQMI2ACY-jowmCZQ_Y84aSqKw-Z).
* Jetton Wallet of first owner, Wallet A - [example](https://testnet.ton.cx/address/EQA7EdSn6hMMwC7g01w2FwtiZuJE7GZCxss7n3MD26nD6S65).