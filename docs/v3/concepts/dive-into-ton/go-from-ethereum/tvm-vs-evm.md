# TVM vs EVM

Ethereum Virtual Machine (EVM) and TON Virtual Machine (TVM) are both stack-based virtual machines developed for running smart contract code. Although they have common features, there are notable distinctions between them.

## Data presentation

### Ethereum Virtual Machine (EVM)
1. Fundamental Data Units
 - The EVM operates primarily on 256-bit integers, reflecting its design around Ethereum's cryptographic functions (e.g.,   Keccak-256 hashing and elliptic curve operations).
 - Data types are limited mainly to integers, bytes, and occasionally arrays of these types, but all must conform to 256-bit processing rules.
2. State Storage
- The entire state of the Ethereum blockchain is a mapping of 256-bit addresses to 256-bit values. This mapping is maintained in a data structure known as the Merkle Patricia Trie (MPT).
- The MPT enables Ethereum to efficiently prove the consistency and integrity of the blockchain state through cryptographic verification, which is vital for a decentralized system like Ethereum.
3. Data Structure Limitations
- The simplification to 256-bit word constraints means that the EVM is not inherently designed to handle complex or custom data structures directly.
- Developers often need to implement additional logic within smart contracts to simulate more complex data structures, which can lead to increased gas costs and complexity.

### TON Virtual Machine (TVM)
1. Cell-Based Architecture
- TVM uses a unique "bag of cells" model to represent data. Each cell can contain up to 128 data bytes and can have up to 4 references to other cells.
- This structure allows the TVM to natively support arbitrary algebraic data types and more complex constructions such as trees or directed acyclic graphs (DAGs) directly within its storage model.
2. Flexibility and Efficiency
- The cell model provides significant flexibility, enabling the TVM to handle a wide variety of data structures more naturally and efficiently than the EVM.
- For example, the ability to create linked structures through cell references allows for dynamic and potentially infinite data structures, which are crucial for certain types of applications like decentralized social networks or complex decentralized finance (DeFi) protocols.
3. Complex Data Handling
- The ability to manage complex data types inherently within the VM architecture reduces the need for workaround implementations in smart contracts, potentially lowering the execution cost and increasing execution speed.
- TVM's design is particularly advantageous for applications requiring complex state management or interlinked data structures, providing a robust foundation for developers to build sophisticated and scalable decentralized applications.

## Stack machine

### Ethereum Virtual Machine (EVM)

- The EVM operates as a traditional stack-based machine, where it uses a last-in, first-out (LIFO) stack to manage computation.
- It processes operations by pushing and popping 256-bit integers, which are the standard size for all elements in the stack.

### TON Virtual Machine (TVM)

- TVM also functions as a stack-based machine but with a key distinction: it supports both 257-bit integers and references to cells.
- This allows TVM to push and pop these two distinct types of data onto/from the stack, providing enhanced flexibility in direct data manipulation.

### Example of stack operations

Suppose we want to add two numbers (2 and 2) in EVM. The process would involve pushing the numbers onto the stack and then calling the `ADD` instruction. The result (4) would be left on the top of the stack.

We can do this operation in the same way in TVM. But let’s look at another example with more complex data structures, such as hashmaps and cell reference. Suppose we have a hashmap that stores key-value pairs, where keys are integers and values are either integers or cell references. Let’s say our hashmap contains the following entries:

```js
{
    1: 10
    2: cell_a (which contains 10)
}
```

We want to add the values associated with keys 1 and 2 and store the result with key 3. Let’s look at stack operations:

1. Push key 1 onto the stack: `stack` = (1)
2. Call `DICTGET` for key 1 (retrieves the value associated with the key at the top of the stack): Retrieves value 10. `stack` = (10)
3. Push key 2 onto the stack: `stack` = (10, 2)
4. Call `DICTGET` for key 2: Retrieves reference to Cell_A. `stack` = (10, Cell_A)
5. Load value from Cell_A: An instruction to load the value from the cell reference is executed. `stack` = (10, 10)
6. Call the `ADD` instruction: When the `ADD` instruction is executed, the TVM will pop the top two elements from the stack, add them together, and push the result back onto the stack. In this case, the top two elements are 10 and 10. After the addition, the stack will contain the result: `stack` = (20)
7. Push key 3 onto the stack: `stack` = (20, 3)
8. Call `DICTSET`: Stores 20 with key 3. Updated hashmap:

```js
{
    1: 10,
    2: cell_a,
    3: 20
}
```

To do the same in EVM, we need to define a mapping that stores key-value pairs and the function where we work directly with 256-bit integers stored in the mapping.
It’s essential to note that the EVM supports complex data structures by leveraging Solidity, but these structures are built on top of the EVM’s simpler data model, which is fundamentally different from the more expressive data model of the TVM

## Arithmetic operations

### Ethereum Virtual Machine (EVM)

- The Ethereum Virtual Machine (EVM) handles arithmetic using 256-bit integers, meaning operations such as addition, subtraction, multiplication, and division are tailored to this data size. 

### TON Virtual Machine (TVM)

- The TON Virtual Machine (TVM) supports a more diverse range of arithmetic operations, including 64-bit, 128-bit, and 256-bit integers, both unsigned and signed, as well as modulo operations. TVM further enhances its arithmetic capabilities with operations like multiply-then-shift and shift-then-divide, which are particularly useful for implementing fixed-point arithmetic. This variety allows developers to select the most efficient arithmetic operations based on the specific requirements of their smart contracts, offering potential optimizations based on data size and type.

## Overflow checks

### Ethereum Virtual Machine (EVM)

- In the EVM, overflow checks are not inherently performed by the virtual machine itself. With the introduction of Solidity 0.8.0, automatic overflow and underflow checks were integrated into the language to enhance security. These checks help prevent common vulnerabilities related to arithmetic operations but require newer versions of Solidity, as earlier versions necessitate manual implementation of these safeguards. 

### TON Virtual Machine (TVM)

- In contrast, TVM automatically performs overflow checks on all arithmetic operations, a feature built directly into the virtual machine. This design choice simplifies the development of smart contracts by inherently reducing the risk of errors and enhancing the overall reliability and security of the code.

## Cryptography and hash functions

### Ethereum Virtual Machine (EVM)

- EVM has support for the Ethereum-specific cryptography scheme, such as the secp256k1 elliptic curve and the keccak256 hash function. Also, EVM does not have built-in support for Merkle proofs, which are cryptographic proofs used to verify the membership of an element in a set.

### TON Virtual Machine (TVM)

- TVM offers support for 256-bit Elliptic Curve Cryptography (ECC) for predefined curves, like Curve25519. It also supports Weil pairings on some elliptic curves, which are useful for fast implementation of zk-SNARKs (zero-knowledge proofs). Popular hash functions like sha256 are also supported, providing more options for cryptographic operations. In addition, TVM can work with Merkle proofs, providing additional cryptographic features that can be beneficial for certain use cases, such as verifying the inclusion of a transaction in a block.

## High-level languages

### Ethereum Virtual Machine (EVM)

- EVM primarily uses Solidity as its high-level language, which is an object-oriented, statically-typed language similar to JavaScript and C++. Also, there are other languages for writing Ethereum smart-contracts such as Vyper, Yul, etc.

### TON Virtual Machine (TVM)

- TVM uses FunC as a high-level language designed for writing TON smart contracts. It is a procedural language with static types and support for algebraic data types. FunC compiles to Fift, which in turn compiles to TVM bytecode.

## Conclusion

In summary, while both EVM and TVM are stack-based machines designed to execute smart contracts, TVM offers more flexibility, support for a wider range of data types and structures, built-in overflow checks, advanced cryptographic features.

TVM’s support for sharding-aware smart contracts and its unique data representation approach make it better suited for certain use cases and scalable blockchain networks.

