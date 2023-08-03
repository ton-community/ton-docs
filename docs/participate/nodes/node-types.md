import Button from '@site/src/components/button'

# TON Node Types

There are different types of nodes in The Open Network:

* **Full Node**

  A node that is synchronized with the blockchain, stores the current state of the blockchain and the block history or part of the block history.

  In a full node, you can enable one or more additional functionalities:

  * **Archive node**
  
     A full node that stores the entire block history is called an archive node.

     An archive node requires a lot of resources and is needed if you are making a blockchain explorer or something like that.

     For most cases, you will be fine with a regular node that only stores the latest blocks and has significantly lower hardware requirements.
  
    <Button href="/participate/run-nodes/archive-node"
    colorType="primary" sizeType={'lg'}>
    Running an Archive Node
    </Button>

  * **Liteserver**

     If you enable an endpoint in a full node, then it starts to perform the functions of a Liteserver - it can receive and respond to requests from Lite Clients.

     Using this node, your product can interact with TON Blockchain.
  
    :::info 
    TON Foundation supports a number of **public Liteservers** that you can find in the global config ([mainnet](https://ton.org/global-config.json) and [testnet](https://ton.org/testnet-global.config.json)).

    These are endpoints available to everyone, for example, standard wallets connect to them. 
    :::
    <Button href="/participate/run-nodes/liteserver"
    colorType="primary" sizeType={'lg'}>
    Running a Liteserver
    </Button>

  * **Validator** 

     If you enable the validator functionality in the node and you have a sufficient number of Toncoin (stake), then the node will begin to participate in the process of validating new network blocks. 
  
     TON is a Proof-of-Stake blockchain, so validators keep the network running and are rewarded in Toncoin for doing so.
  
    <Button href="/participate/run-nodes/full-node"
    colorType="primary" sizeType={'lg'}>
    Running a Full Node (Validator)
    </Button>