

# Using Blueprint

![Blueprint](\img\blueprint\logo.svg)

A development environment for TON for writing, testing, and deploying smart contracts.

## Quick start 🚀

Run the following in terminal to create a new project and follow the on-screen instructions:

```bash
npm create ton@latest
```

### Core features

- Streamlined workflow for building, testing and deploying smart contracts
- Dead simple deployment to mainnet/testnet using your favorite wallet (eg. Tonkeeper)
- Blazing fast testing of multiple smart contracts in an isolated blockchain running in-process

### Tech stack
- Compiling FunC with https://github.com/ton-community/func-js (no cli)
- Testing smart contracts with https://github.com/ton-community/sandbox
- Deploying smart contracts with TON Connect 2, Tonhub wallet or a `ton://` deeplink

### Requirements

- [Node.js](https://nodejs.org/) with a recent version like v18, verify version with `node -v`
- IDE with TypeScript and FunC support like [Visual Studio Code](https://code.visualstudio.com/) with the [FunC plugin](https://marketplace.visualstudio.com/items?itemName=tonwhales.func-vscode)

## References

### GitHub

- https://github.com/ton-community/blueprint

### Materials

- [Blueprint using on DoraHacks stream](https://www.youtube.com/watch?v=5ROXVM-Fojo)
- [Create a new project](https://github.com/ton-community/blueprint#create-a-new-project)
- [Develop a new smart contract](https://github.com/ton-community/blueprint#develop-a-new-contract)
- [[YouTube] Func with Blueprint](https://youtube.com/playlist?list=PLyDBPwv9EPsDjIMAF3XqNI2XGNwdcB3sg)[RU](https://youtube.com/playlist?list=PLyDBPwv9EPsA5vcUM2vzjQOomf264IdUZ)


## See Also

* [Develop Smart Contract Introduction](/develop/smart-contracts/)
* [How to work with wallet smart contracts](/develop/smart-contracts/tutorials/wallet)
* [Using toncli](/develop/smart-contracts/sdk/toncli)