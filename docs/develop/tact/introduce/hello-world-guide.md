# TON Hello world with Tact

This article helps to learn how to write simple smart contract via Tact language, look through usefull frameworks for deploying and testing smart contract in testnet.
Main goal is trying and touch the smart contract developing process and find out what you should learn next.
You need spend only one-two hours to find out basic details and try main steps of TON blockchain developing! Let's do it!

## Tact's facts #1

Five things you need to know in the beginning:
* Smart contract is a computer program that stores and executes in blockchain.
* TON blockchain is ecosystem, particular, for building decentralized application(dApp), that will not depend on someone else, but only from logic input in smart contracts.
* For to cope with the challenges of scalability and versatility for dApps TON designed with original Ton Virtual Machine(TVM).
* Tact is special langauge designed for developing smart in simplest and convinient way contracts in TON. Perhaps it will look very hard to understand how all works from the first sight. It is a price for opportunities that TON offers in return and worth it.
* Tact uses JavaSrcript frameworks, so basic knowing helps you learn it faster, but even you just newcomer it is possible learn from the beginning.

:::info
If you have choice it's better to chose Unix like operating system for developing or MacOS. In Windows OS you will face some additional issue, so it up to you.
:::

## Practice #1 - set up your environment
Annoying, but you have to do some preparation steps:

- **Git**. Essential tool for every developer to work with repositories. Download it [here](https://git-scm.com/downloads).
- **NodeJS**. We will use JavaScript with TypeScript mode as the most popular choice for dApp development on TON. Download it [here](https://nodejs.org/en/download/).
- **JavaScript IDE**. Your normal choice for development. [VSCode](https://code.visualstudio.com/download), for example.

## Tact's facts #2

Next step big one for absolute newcomers with git. If you now how it works, just skip this.
If you never works with git before there is small briefing for you:

* Git is a special software for developers(at first order), that helps to control changes in big projects and where number of people involved.
* In the very first step, all you need to learn is a fact, that you just copy project specified by link from internet. It could be imaged as copy files from online disk service.
* Commands for git will be demonstrated in special code block, you should execute it in [terminal](https://askubuntu.com/questions/38162/what-is-a-terminal-and-how-do-i-open-and-use-it) (bash, zdsh, windows PowerShell or IDE implicit command line):

```
command that you should input in your command line
```

## Practice #2 - get template from Github

For beginning let's take basic tact project from community repository:
```bash
https://github.com/ton-community/tact-template.git
```
and then open this local directory in command line:

```bash
cd tact-template
```

To check, that everything is ok, input command:

```bash
yarn build
```

Something like this you should see:

![Tact ABI template](/img/docs/tact-hello-world/tact-compile-success.jpg?raw=true)

## Tact's facts #3

tact-template is basic project for developing tact contract on Tact language. Let's learn general things about this:

* By default, this project has a number of additional frameworks used in it, that specified in "yarn". To simplify, we skip details of this in current lesson and will take attention to the general structure, where smart contract define.
* Main folder with files we need to learn placed in `*/src/` folder:
```
- sources
    - contract.deploy.ts
    - contract.spec.ts
    - contract.tact
```
* Our Tact langauge smart contract placed in `contract.tact`. Command `yarn build` will compile `contract.tact` and place result in `tact-template/src/output`.

  ![Tact compile scheme](/img/docs/tact-hello-world/tact-compiler-scheme.png?raw=true)

* File `contract.spec.ts` contents tests for using `yarn tests` for launching local tests. Not necessary for deployment. Some actions we want to check before using smart contract in productions really faster to check with local tests.
* File `contract.deploy.ts` contents instructions to generate a deployment link. This link includes all necessary information to send our smart contract in blockchain. When our smart contract appears in Blockchain as bytecode and ready to work as program he becomes "deployed".
* As a result we use three yarn commands to work with Tact project template:
```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract
```

## Tact to contract plan thoughts #1

A lot of important details you should learn to understand how TON works, but here, we simplify our field of knowledge and goals.
So, let's say, Contracts(smart contract) and Messages our main characters in blockchain. You will meet this words in many places, but one more time: everything in TON blockchain is a Smart Contract.
If we try to find similar to smart contract entity it will be computer program. And in other words - smart contract is a program that defines, stores and executes in blockchain.
The second part - messages - are native TON blockchain tool to communicate between smart contracts.

To summarize these, in common words, main goal of smart contract developer is to declare and write logic of actions in smart contract correspondingly to messages it gets from other smart contracts.
Ok, now we want to declare behaviour of our contract for messages. This contract will cover 3 feature:

1. Store inside integer number that we will call "Total";
2. Accept messages and check its contents. If it contents "Increment", increment from contract integer by 1 and update this in contracts.  If it contents "Add" message, increment from contract integer by value of Add message and update this in contracts.
3. Store "owner" Address and check if messages got from owner or not. (TBD)

## Tactical Practise #3 - create contract

Let's open our contract file `contract.tact` file and clear what it contents. That, our first Tact string is declaring additional library, where some usefully Tact functions defined.


```java title="tact-template/sources/contract.tact"
import "@stdlib/deploy";

```

`@stdlib/deploy` module extends our tools with `Trait` Deployable, so we can use it Trait later and its contents messages.
Note, that Tact language consists of some unusual for classic program language, here is what we face in the lesson:

| Type     | Description                                                                                                       |
|----------|-------------------------------------------------------------------------------------------------------------------|
| Contract | Basic type of Tact that declares contract entity in it's `{}` block.                                              |
| Message  | Special Tact type for convenient message's declaration.                                                           |
| Trait    | Struct similar to Contract, but serves as extension for contract(similar to Interfaces, Inheritance).             |
| Address  | Smart contract address in native TON declaration. You'll see this parameter as sender or destination of messages. |


Next step, we need to specify our message Add, that will force contract do actions according to (2).
Here we specified, that our message should content Integer number of 32-bit length.

```java title="tact-template/sources/contract.tact"
//previous code
message Add{
  amount: Int as uint32;
}

```

Now we begin declare our contract, we will call it SampleTactContract. Also, we need specify our contract's own properties, that will be stored in its storage: `owner` and `counter`.

```java title="tact-template/sources/contract.tact"
//previous code

contract SampleTactContract with Deployable {

  owner: Address;
  counter: Int as uint32;

```

As said before Address special in Tact Type system that describes smart-contract's language.
* `owner` - is Address of owner set in for `SampleTactContract`, and we will use it for double check if message sent by owner or not.
* `counter` - integer number stored in contract that keep current value of iteration results.

Before we can use contract in Blockchain we should define(if it necceassary) its initial process. In our case, it means, that we should declare contract's function, that will define our `owner` and `counter` in particular.
This tool in smart contracts called init() function, and we need describe its behaviour next:

```java title="tact-template/sources/contract.tact"
//previous code

init(owner: Address) {
  self.owner = owner;
  self.counter = 0;
}
```

Where `self` - special Tact keyword of current level struct, here we using it for contract's fields we declared. Function `init()` will:
* Accept one argument of type `Address`, set this `ownertact-compiler-process-4 in contract's field `owner`.
* Initialize `counter` value equal to 0.


## Tact's facts #4
Let's take a little break and learn little bit more about tools in Tact.
We have some additional default Contract's tools that helps us to describe contract's behaviour. `init()` - is one of them, let briefly check several another:


| Entity      | Description                                                                                                                                                                                                |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `init()`    | Function that declares initial values will be stored in contract's data. It will be use in Deployment process, when contract creates in Blockchain.                                                        |
| `context()` | Function that gets common properties about current incoming messages such as sender's Address, message's body and so on                                                                                    |
| `fun`       | Special Tact keyword for declaring function. In general similar to functions in program languages. Functions serves for convenient abstraction of logic and optimization that helps code be more readable. |
| `recieve()` | Special function of contract serves to declare behaviours of contract with messages.                                                                                                                       |
| `get fun`   | Special keywords of contract serves to declare get functions. According to name, this uses to get information from its data.                                                                               |
 


## Tactical Practise #4 - add contract's behaviour

Ok, one more time, we need extend our contract's behaviour

```java title="tact-template/sources/contract.tact"
//previous code

fun add(v: Int) {

    let ctx: Context = context();
    require(ctx.sender == self.owner, "Invalid sender");
    
    self.counter = (self.counter + v);
}
```

Declare function `add` that will do following things:
1. Get incoming integer argument `v`.
2. Check current incoming message `sender` is equal to `owner` we set for contract in deployment process.
3. If this check passed add to current `counter` value `v` and update `counter` value in contract. If required is not pass, throw exception message "Invalid sender".


```java title="tact-template/sources/contract.tact"
//previous code

receive(msg: Add) {
    self.add(msg.amount);
  }
}

receive("increment") {
    self.add(1);
  }
}
```
Here we are specified two receive functions. This means, that if we get message in contract that correspond of one the receiver contract execute one of them. In other case, contract will do nothing.
receive() function expects an incoming argument of String type or Message type.
Take a look our receivers:
* `receive(msg: Add)` - specifies actions with messages defined in the beginning by Message add. It will content only one integer number of 32-bits length, that we called amount and nothing else. This receiver invokes function `add(amount)`.
* `receive("increment")` - specifies actions with messages, that contents comment string `"increment"` in its body. Here we invoke `add(1)`, so we increment contract's counter.




```java title="tact-template/sources/contract.tact"

contract SampleTactContract with Deployable {
    //previous code

    get fun counter(): Int {
      return self.counter;
    }

```
Last function we need to specifier is get function counter, that will return value of current counter value from contract.
Now our contract is ready, we need compile this, so run:

```bash
yarn build
```


## Tact's facts #5

Now we on finale stage. We need to deploy our contract to Blockchain. To do this, we will use another smart contract, wallet. In this way we avoid a lot of details about deployment process, but you can find more about this in low-levels guides.

* To deploy new contract we need send message with initilize information in message. 
* We can know destination address of contract because of definition of Address depends on only from contract's data. 
* To send message in blockchain it is necessary to communicate with TON blockchain nodes. Wallet application will do this with own API, so we will avoid lowlevel details in current lesson.
* To send message in TON, sender should pay for outcomming message. In our case, we need some funds on Ton wallet to pay this action.

![Tact ABI template](/img/docs/tact-hello-world/tact-compiler-process-4.png?raw=true)


## Tactical Practise #5 - deploy the contract

Before deployment, according to said before we need to prepare Ton wallet contract with funds. We will you test environment, that maintained with test nodes and called testnet(production calls mainnet).

1. To do this we need install one of ton wallet for testnet:

* Sandbox(separate application for testnet) - [Android](https://play.google.com/store/apps/details?id=com.tonhub.wallet.testnet)/[iOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)/[MacOS](https://apps.apple.com/app/ton-development-wallet/id1607857373)
* Tonkeeper(to switch on testnet tap several times in setting on diamond icon) - [Android](https://play.google.com/store/apps/details?id=com.ton_keeper)/[iOS](https://apps.apple.com/us/app/tonkeeper/id1587742107)/[MacOS](https://apps.apple.com/us/app/tonkeeper/id1587742107)

2. Create wallet in application according native wallet apps instructions.

3. Get test Toncoins for your wallet from Telegram [testgiver bot](https://t.me/testgiver_ton_bot).

4. Run deploy script to get deployment link in terminal. It will ask from you wallet you want use:

```bash
yarn deploy
```
//need fix or add suggestion about owner address in deployment link and ton amount(10 -> 1)
4. Read deployment link through reading QR or open link via your testnet TON wallet, confirm outcomming message.

![deployment-1](/img/docs/tact-hello-world/tact-deployment-process-2.png)


## Last Tact and next steps

We send and deploy our Contract. We can check this with blockchain explorer. 
Take your new contract address from terminal or follow ready-made link and check result of sent message in explorer.
If you saw in blockchain explorer same for your contract...

![deployment-2](/img/docs/tact-hello-world/tact-deployment-process-3.png)

Yes! You successfully created and deployed your own smart contract, congrats!




//TODO

* Check Add(1) function.
* Check get function through explorer.
* Add links and summarize.
