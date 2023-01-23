# Tact Hello world

## Introduction to TON Smart Contracts using Tact

In this guide, we will walk through the process of creating and deploying a simple smart contract using the TON Contract Language (Tact).
Main goal is trying and touch the smart contract developing process and find out what you should learn next.
You need spend about one-two hours, it depends on your background knowledge.

:::caution tutorial in open beta
Did you meet something unclear and hard to understand?🙈 Are you are stuck and have no clues how to solve your issue?🤯 Please ask a question in the [Telegram chat](https://t.me/tondev_eng) or ask me directly at Telegram - [@iftryalexg](https://t.me/iftryalexg).
Based on the questions received, the guide will be updated ASAP and unclear points will be clarified 🚒💦💦🔥🔥🔥.
:::

### Tact's facts #1

Five things you need to know in the beginning:

* Smart contract is a computer program that stores and executes in blockchain.
* Blockchain is a shared and structured way to keep data. Data that stored in blockchain impossible to edit and replace with fake.
* TON Blockchain works on its own special program software, called the Ton Virtual Machine(TVM). 
* Tact is a special computer language that helps people make smart contracts on the TON blockchain. Smart contracts are like computer programs that live on the internet and can do things like store information and make decisions.
* Tact uses JavaScript frameworks, so basic knowing helps you learn it faster, but even you just newcomer it is possible learn from the beginning.


:::info
**Blockchain** is like a digital notebook where important information is written down and shared with many people. Once something is written in the notebook, it can't be changed or erased. It's like a permanent record that everyone can trust.
But instead of a notebook, it's a stores on multiple servers. And instead of just one person writing in it, many people can write in it at the same time. This way, everyone can see and agree on the information that is written in the blockchain. And because it's placed on a multiple servers, it's safe and can't be lost or changed by accident.
:::


### Tactical practise #1 - set up your environment

:::info
If you have choice it's better to use Unix like or MacOS operating system for developing. In Windows OS you will face some additional issues.
:::

Get ready to build your own blockchain creation! First, you'll need to gather a few tools to help you along the way.

- **Git** is like a magic toolbox for developers. It helps you keep track of all the different parts of your project, so you can work on them together with your team. You can download it [here](https://git-scm.com/downloads).
- **NodeJS** is JavaScript central tool. We'll be using JavaScript and a special version called TypeScript to create our smart contract. You can download it  [here](https://nodejs.org/en/download/).
- **JavaScript IDE** is like your own personal workshop. It's where you'll be building and designing your code, code text editor with highlights. A popular choice is [VSCode](https://code.visualstudio.com/download), for example. Get it now and let's get building!

### Tact's facts #2

Once git is installed, you can use the command line or terminal to navigate to the folder where you want to create your project.
Then, you need to use the command `git clone <link>` to copy the project files from the internet. The link is usually provided by the project creator or can be found on a code hosting platform like GitHub.

The project files will be downloaded and stored in a new folder with the same name as the project.
From there, you can start working on the project and make changes. You can use commands like `git add`, `git commit`, and `git push` to save your changes and share them with others working on the project.
Note, that git is a complex tool with many features and commands, but for beginners, these basic steps will be enough to get started. In current guide we will use `git clone` only. As you continue to work with git, you can learn more advanced features and commands.
Commands for git will be demonstrated in special code block, you should execute it in [terminal](https://askubuntu.com/questions/38162/what-is-a-terminal-and-how-do-i-open-and-use-it) bash, zdsh, windows PowerShell or IDE implicit command line:

```
command that you should input in your command line
```

### Tactical practise #2 - get template from Github

For beginning let's take basic tact project from community repository:

Open local directory, where you want to keep your project
```bash
cd usr/dev 
```

Execute cloning template:
```bash
git clone https://github.com/Reveloper/tact-guide-template
```

Then open new downloaded local directory:
```bash
cd tact-guide-template
```

To finish installation process and resolve predefined dependencies for tact-template, check updates fot Tact via following commands:
```bash
yarn install
yarn add ton-tact
```

Now check, that everything is ok, input command:

```bash
yarn build
```

Something like this you should see in your terminal window:

![deployment-1](/img/docs/tact-hello-world/tact-compiler-process-1.png)

### Tact's facts #3

**tact-template** is basic demo project for developing smart contract on Tact language. Let's learn general things about this:

* By default, this project has a number of additional frameworks used in it, that specified in "yarn". To simplify, we skip details of this in current lesson and will take attention to the general structure, where smart contract define. All you need to use template, resolving dependencies with `yarn add ton-tact` we did before.
* Main folder with files we need to learn placed in `tact-guide-template/sources/` folder:
```
+--tact-guide-template
|   +--sources
|   |  +--contract.deploy.ts
|   |  +-- contract.spec.ts
|   |  +-- contract.tact

```
* Our Tact langauge smart contract will be written in `contract.tact`. 
* File `contract.spec.ts` contents tests for using `yarn tests` for launching local tests. Not necessary part for deployment. Some actions we want to check before using smart contract in productions really faster to check with local tests.
* File `contract.deploy.ts` contents instructions to generate a deployment link. This link includes all necessary information to send our smart contract in blockchain.  When our smart contract is delivered in TON Blockchain as bytecode and become ready to work as program he becomes **deployed**.
* As a result we use three yarn commands to work with Tact project:
```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract
```

### Tact's deep thoughts #1

A lot of important details you should learn to understand how TON works, but here, we simplify our field of knowledge and goals.
So, let's say, **contracts** and **messages** our main characters in blockchain. 

1. **contract** is like a computer program that lives on the blockchain. It can store information and carry out certain actions based on the instructions that are written inside it.

2. **message** is like a command that we send to the contract. It tells the contract what to do and can include information like how much funds to transfer or what information to store.

Think of it like a game, where the contract is the game rules and the messages are the moves you make to play the game. On the scheme you can see graphic representation of working in blockchain, where different smart contracts(circles) communicate to each other with messages.

![Tact deploy](/img/docs/tact-hello-world/tact-compiler-process-5.png?raw=true)

To summarize these, in common words, main goal of smart contract developer is to declare and write logic of actions in smart contract correspondingly to messages it gets from other smart contracts.

Our smart contract is like a piggy bank. It has a number inside called "Total" that we want to keep track of. This contract will cover 4 features:
1. _Store Total value_. If we need find out what is current value of "Total", we can read this directly from blockchain via special `get` method.
2. _Get Total value_. Special tool for reading current "Total" value from blockchain without sending messages.
3. _Processing "Increment" command_. When it gets a message, it checks what the message says. If the message says "Increment," it will add 1 to the Total inside the piggy bank and update it. It will check if the person sending the message is the owner of the piggy bank or not. This way, only the owner can add or increment the Total inside the piggy bank.
4. _Processing "Add" command_. If the message says "Add," it will add a specific number to the Total inside the piggy bank and update it. 


### Tactical practise #3 - create contract

Let's open our contract file `contract.tact` file and clear what it contents. That, our first Tact string is declaring additional library, where some usefully Tact functions defined.


```java title="tact-template/sources/contract.tact"
import "@stdlib/deploy";

```

`@stdlib/deploy` module extends our tools with `Trait` Deployable, so we can use it Trait later and its contents messages.
Note, that Tact language consists of some unusual for classic program language, here is what we face in the lesson:

| Type     | Description                                                                                                                                            |
|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Contract | Basic type of Tact that declares contract entity in it's `{}` block.                                                                                   |
| Message  | Special Tact type for convenient message's declaration.                                                                                                |
| Trait    | Struct similar to Contract, but serves as extension for Contract(it's similar to interfaces or inheritance for Classes in classic Object‑oriented PL). |
| Address  | Smart contract address in native TON declaration. You'll see this parameter as sender or destination of messages.                                      |


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


### Tact's facts #4
Let's take a little break and learn little bit more about tools in Tact.
We have some additional default Contract's tools that helps us to describe contract's behaviour. `init()` - is one of them, let briefly check several another:


| Entity      | Description                                                                                                                                                                                                |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `init()`    | Function that declares initial values will be stored in contract's data. It will be use in Deployment process, when contract creates in Blockchain.                                                        |
| `context()` | Function that gets common properties about current incoming messages such as sender's Address, message's body and so on                                                                                    |
| `fun`       | Special Tact keyword for declaring function. In general similar to functions in program languages. Functions serves for convenient abstraction of logic and optimization that helps code be more readable. |
| `recieve()` | Special function of contract serves to declare behaviours of contract with messages.                                                                                                                       |
| `get fun`   | Special keywords of contract serves to declare get functions. According to name, this uses to get information from its data.                                                                               |
 


### Tactical Practise #4 - add contract's behaviour

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
Command `yarn build` will compile `contract.tact` and place result in `tact-template/src/output`.

![Tact compile scheme](/img/docs/tact-hello-world/tact-compiler-scheme.png?raw=true)


## Tact's facts #5

Now we on finale stage. We need to deploy our contract to Blockchain. To do this, we will use another smart contract, wallet. In this way we avoid a lot of details about deployment process, but you can find more about this in low-levels guides.

* To deploy new contract we need send message with init information in message. 
* We can know destination address of contract because of definition of Address depends on only from contract's data. 
* To send message in blockchain it is necessary to communicate with TON blockchain nodes. Wallet application will do this with own API, so we will avoid lowlevel details in current lesson.
* To send message in TON, sender should pay fees for outcomming message. In our case, we need some funds on Ton wallet to pay this action.

![Tact deploy](/img/docs/tact-hello-world/tact-compiler-process-6.png?raw=true)


### Tactical Practise #5 - deploy the contract

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


4. Read deployment link through reading QR or open link via your testnet TON wallet, confirm outcomming message.

![deployment-1](/img/docs/tact-hello-world/tact-deployment-process-2.png)

:::info
If you faced some compile issue and can't figure out what is wrong, just compare with target contract placed in `sources/increment.tact`. 
:::


### Last Tact and next steps

We send and deploy our Contract. We can check this with blockchain explorer. 
Take your new contract address from terminal or follow ready-made link and check result of sent message in explorer.
If you saw in blockchain explorer same for your contract...

![deployment-2](/img/docs/tact-hello-world/tact-deployment-process-3.png)

Yes! You successfully created and deployed your own smart contract, congrats!




//TODO

* Check Add(1) function.
* Check get function through explorer.
* Add links and summarize.
