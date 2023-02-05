# Tact wallet contract

This article explains how wallet contract works in Tact, how to deploy and test this.

:::caution article in open beta
Did you notice something unclear, incorrect or get stuck with some issue in guide? Please ask a question in the Telegram [chat](https://t.me/tondev_eng) or text me directly [@iftryalexg](https://t.me/iftryalexg).
Guide will be updated ASAP and all unclear points will be clarified 🚒💦🔥.
:::


### Set up your environment

For this project you should install 


* **Git**. Essential tool for every developer to work with repositories. Download it [here](https://git-scm.com/downloads).
* **NodeJS**. We will use JavaScript with TypeScript mode as the most popular choice for dApp development on TON. Download it [here](https://nodejs.org/en/download/).
* **JavaScript IDE**. Your normal choice for development. [VSCode](https://code.visualstudio.com/download), for example.
* **Wallet app**. You need one of TON noncustodial testnet [wallet app](docs/participate/wallets/apps) (better with support Walletv4), for example [Sandbox](https://apps.apple.com/app/ton-development-wallet/id1607857373)/[Tonkeeper](https://tonkeeper.com/). This is as part of simplify demonstration, you also can get access to your wallet from code, example added in demo. 

- [Tact SDK and libraries full list](docs/develop/tact/introduce/tact-sdk)


### Tact wallet demo project
Get tact-wallet project from git:

```bash
git clone https://github.com/Reveloper/tact-wallet.git
cd tact-wallet
```

This project has ready to use TACT compiler, typescript + jest with [ton-emulator](https://github.com/ton-community/ton-emulator), example how to test and deploy.
You have ready-to-use commands configured for contract. Try to input them in terminal and look how it works:

```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract via deployment link
yarn deploy-api # To deploy through API(need to input deployment wallet in wallet.deploy-api.ts before using)
```

### Briefing for Tact project structure

In the `tact-wallet/sources/` directory placed core project files, that defines what `yarn` commands will do:

1. File `wallet.tact` contract on Tact language, that will be compiled with Tact compiler in `yarn build`
2. File `wallet.spec.ts` contents unit tests for `yarn tests` command. This command allow to launch local tests on your local IDE. Not necessary for deployment.
3. File `wallet.deploy.ts` is a helper, that allow to deploy your `wallet.tact` compiled file(src/output) with deployment link. From the beginning you can deploy your smart contract via [Sandbox](https://apps.apple.com/app/ton-development-wallet/id1607857373)/[Tonkeeper](https://tonkeeper.com/) application.
4. Describes alternative deployment script `wallet.deploy-api.ts` for `yarn deploy-api` according to your `contract.tact` to send deployment message from deployment wallet. You need to input your deployment wallet 24 words [here](sources/wallet.deploy-api.ts#L19).


### What is wallet contract general idea?

Wallet similar to usual smart contract serve as a platform for managing and transferring funds in a decentralized and secure manner. However, it is important to note that while a smart contract may have built-in features for handling funds, additional steps may be necessary to make the user experience more convenient and secure. This may involve handling additional user stories and implementing additional features to meet real-life requirements.

Let's describe small list of feature for wallet contract:
* Deployment of smart contract where placed information of its owner with public key.
* Requests for action with funds by owner.
* Get and handle messages from other smart-contracts, including incoming transfer of funds.

:::info
Explorers recognize and its type by hash of the smart contract's code or by interfaces founded in smart contract. If you check your common wallet contract with explorer, you will see that it recognized with type "wallet". From this side, tact-wallet contract is a new version, and it will have
different hash(because of original FunC contract and FunC compiled from Tact will be absolutely different). On the same reason current wallet application will not support Tact contract until they add its tact version to their applications.
:::

### Contract structure

Tact language allows to define behaviour of contracts with convenient tools as Contract, Trait, Receiver, Message. Generally simple contract has such structure:

* Includes
* Custom Messages and Structs declaration
* Contract's body
  * Fields
  * Init function
  * Functions
  * Receivers
  * Getters

  
### Wallet contract overview

As we mentioned earlier, contract consists of
1. Includes and struct definition
2. Contract's body

For contract wallet we will define struct Transfer as base struct for messages:

```java title="tact-wallet/sources/wallet.tact"

struct Transfer {
seqno: Int as uint32;
mode: Int as uint8;
to: Address;
amount: Int as coins;
body: Cell?;
}
```

Next will be wallet contract body with all included sections:

```java title="tact-wallet/sources/wallet.tact"

contract Wallet {

    // contract fields
    
    // init function
    
    // receivers functions
    
    // get functions

}

```
#### Wallet fields
Now, let's take a look one by one these section and find out their functions.
First - contract fields. In these section we describe data, that will be store in Blockchain inside contract's storage. Shortly, it calls on-chain.
For features of wallet contract we declare following:

* seqno - is field that store last executed transaction id. Used for deduplication of transactions.
* key - key of owner. Used for checks if transaction asked from wallet owner.
* walletId - wallet id, serves for supporting different(up to uint64) instance of wallets based on one key. For each `walledId` we deploy unique smart contract with access by same `key`.

```java title="tact-wallet/sources/wallet.tact"

contract Wallet {

    seqno: Int as uint32 = 0;
    key: Int as uint256;
    walletId: Int as uint64;

    // init function
    
    // receivers functions
    
    // get functions
}

```

#### Wallet init

The `init()` function define first state of our smart contract for deploying process. To deploy our wallet contract we will keep public key and id in its store. Usually, public keypair - public and secret keys computes locally on device which initiate deployment. Secret key stores locally for future signing transaction of owner, and public key sent as argument in `init()` function.
Wallet ID, according to definition of field allows to create several(up to uin64) wallets based on same keypair.

```java title="tact-wallet/sources/wallet.tact"
contract Wallet {

    // contract fields
    
    init(key: Int, walletId: Int) {
        self.key = key;
        self.walletId = walletId;
    }
    
    // receivers functions

    // get functions
    
}
```

#### Wallet receivers 

Contract receivers define how contract acts depending on what it was received in incoming message. Notice, that when contract sends outgoing message or do computation it pays network fees from its contract balance. Read more about fees in TON here. For wallet contract we describe the following:

* msg: TransferMessage - receiver that handles incoming message and performs outcoming message from our wallet. It will check op_code and seqno to be sure, that transaction valid. If requires successes, we will increment seqno counter and send outgoing message.
* msg: Slice - if msg_body is Slice we check that incoming message was not bounced before, and if this requirements successes increment our seqno counter.
* "notify" - receiver declares actions when incoming message contents string comment "notify". Here it will increment seqno field.
* "duplicate" - receiver declares actions when incoming message contents string comment "duplicate". Here it will increment seqno field.
* bounced() - special receiver for handling bounced messages.

```java title="tact-wallet/sources/wallet.tact"
contract Wallet {

    // contract fields
    
    // init function
    
    receive(msg: TransferMessage) {

        // Check Signature
        let op_hash: Int = msg.transfer.toCell().hash();
        require(checkSignature(op_hash, msg.signature, self.key), "Invalid signature");
        require(msg.transfer.seqno == self.seqno, "Invalid seqno");

        // Increment seqno
        self.seqno = self.seqno + 1;

        // Send message
        send(SendParameters{value: msg.transfer.amount, to: msg.transfer.to, mode: msg.transfer.mode, body: msg.transfer.body});
    }

    receive(msg: Slice) {
            self.seqno = self.seqno + 1;
    }

    receive("notify") {
            self.seqno = self.seqno + 1;
    }

    receive("duplicate") {
        // Create new wallet
        let walletInit: StateInit = initOf Wallet(self.key, self.walletId + 1);
    }
    
    bounced(msg: Slice) {
        // TODO: Handle
    }
    
    // get functions
    
}
    
```

#### Wallet getters

Get functions allows to get information about contract's data for free. It's helpfully for us, as we want get seqno before every transaction we want made.

* get publicKey() - returns Integer number of public key for smart contract;
* get walletId() - returns walletId that was used to initiate this wallet;
* get seqno() - returns current seqno of wallet

```java title="tact-wallet/sources/wallet.tact"

    // contract fields
    
    // init function
    
    // receivers functions

    get fun publicKey(): Int {
        return self.key;
    }

    get fun walletId(): Int {
        return self.walletId;
    }

    get fun seqno(): Int {
        return self.seqno;
    }
}

```

### Wallet tests overview

From the beginning example of unit tests distributed with contract in wallet.spec.contract.
You can launch test via `yarn test` or specify your own with help of jest and ton-emulator library.


### Wallet deployment

For deployment wallet we have two demo options to run:

```bash
yarn deploy
yarn deploy-api
```

#### Deployment with user wallet application

As simple way offered to deploy smart contract with usual wallet application. The trick is that we just need specify our outgoing message with data we need(we've already done this) and input this data in message.
Wallet applications supports transfer links and QR, so we can use it for our deployment message.
The following scheme shows how deployment process via wallet applications works.

![Tact wallet deploy](/img/docs/smart-contract/tact-deployment-1.png?raw=true)

Step list here:
1. Install wallet application on device from which we will do deployment.
2. Get test Toncoins on our wallet application with bot.
3. Run deployment script for deployment:
```bash
yarn deploy
```
4. Use deployment link or QR with wallet application and confirm the sending of outgoing message.
5. Notice our new smart contract deployed on the address we sent the message.

#### Deployment with TON public API 

The way, some applications in production uses is public API. It is acceptable solution for services that not requires operative updating data and just need sometimes send messages.
Demo script for this process needs to fill with your wallet 24 words of wallet in testnet, you also can use your wallet from previous step.
So, this wallet will call _deployment wallet_ and will be use in similar to wallet application way.

![Tact API deploy](/img/docs/smart-contract/tact-deployment-2.png?raw=true)

Step list here:
1. Install wallet application on device from which we will do deployment and get toncoins.(Using same wallet from previous step)
2. Input your test wallet 24 words in deployment script `soucre/wallet.deploy-api.ts`.
3. Run `yarn deploy-api` in terminal command line.
4. Notice in blockchain explorer our new smart contract deployed according address in console log where we sent the deployment message.

### Summary about Tact wallet

TON dApps uses code hash as identifier of contract type, and wallet contract will absolutely different hash for its, so it will not work from the box.
This contract is generic, so in production all application already set up for using original FunC contract, but still it is most used contract so it was used for learning and explanation purposes of how it works.
You can learn more about launching and testing your own tact contract from Jetton Tact article.