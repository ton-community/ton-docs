import Feedback from '@site/src/components/Feedback';


# Storage provider
A **storage provider** is a service that stores files for a fee.


## Binaries

Precompiled binaries of `storage-daemon` and `storage-daemon-cli` are available for Linux, Windows, and macOS at [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).

## Compile from sources
To build `storage-daemon` and `storage-daemon-cli` from the source, follow the [instruction](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Key concepts

A storage provider consists of:
- A smart contract that handles storage requests and manages client payments. 
- A daemon application that uploads and serves files to clients.

The process works as follows:

1. The owner of the provider launches the `storage-daemon`, deploying the main smart contract, and configuring the necessary parameters. The contract address is then shared with potential clients.

2. A client uses the `storage-daemon` to create **a bag** from their files and sends an internal message to the provider's smart contract. 
3. The smart contract creates a storage contract for **this bag**. 
4. The provider detects the request on-chain, downloads the bag, and activates the storage contract. 
5. The client transfers payment to the storage contract. The provider must regularly submit proof that the bag is still being stored to continue receiving payment. 
6. If the contract's funds are depleted, it becomes inactive, and the provider is no longer obligated to store the bag. The client can either refill the contract or retrieve their files.


:::info
Clients can retrieve their files anytime by providing proof of ownership to the storage contract. Once validated, the contract releases the files and deactivates itself.
:::

## Smart contract

View the [smart contract source code](https://github.com/ton-blockchain/ton/tree/master/storage/storage-daemon/smartcont).

## Using a provider by clients
To use a storage provider, you need to first know the address of its smart contract. You can retrieve the provider's parameters using the following command in `storage-daemon-cli`:

```
get-provider-params <address>
```

### Provider parameters

* Whether new storage contracts are accepted.
* Minimum and maximum *Bag* size (in bytes).
* Rate - the cost of storage. Specified in nanoTON per megabyte per day.
* Max span - how often the provider should provide proofs of *Bag* storage.


The output includes the following parameters:
- Whether new storage contracts are currently accepted. 
- Minimum and maximum **bag** size (in bytes). 
- Rate – the cost of storage specified in nanoTON per megabyte per day. 
- Max span – the interval at which the provider must submit proof of **bag** storage.

### A request to store
To request storage, you need to create a **bag** and generate a message using the following command:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Notes
- This command may take some time to execute for large **bags**. 
- The generated message body, not the full internal message, is saved to `<file>`.
- Query ID can be any integer from `0` to `2^64 - 1`. 
- The generated message includes the provider's current rate and max span parameters. These values are displayed after execution and should be reviewed before sending. 
- If the provider updates their parameters before the message is submitted, it will be rejected. This ensures that the storage contract is created under the client's agreed-upon conditions.

The client must then send the generated message body to the provider's smart contract address. If an error occurs, the message bounces back to the sender. If successful, a new storage contract is created, and the client receives a message from the contract with [`op=0xbf7bd0c1`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L3) and the same query ID.

At this stage, the contract is not yet active. Once the provider downloads the bag, the contract is activated, and the client receives another message from the same contract with  [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4).


#### Client balance

The storage contract maintains a client balance, which consists of the funds transferred by the client that have not yet been paid to the provider. This balance gradually reduces over time based on the provider's rate (in nanoTON per megabyte per day).
- The initial balance is the amount sent when creating the storage contract with the request. 
- The client can top up the contract anytime by making transfers to the storage contract — this can be done from any wallet address. 
- The current balance can be retrieved using the [`get_storage_contract_data`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/storage-contract.fc#L222) getter method. It is returned as the second value: `balance`.


### Contract closure

:::info
If the storage contract is closed, the client receives a message with the remaining balance and [`op=0xb6236d63`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L6). 
:::

A storage contract may be closed under the following conditions:

* Immediately after creation, before activation, if the provider declines the request, e.g., due to capacity limits or configuration issues.
* When the client balance reaches 0.
* Voluntarily by the provider.
* Voluntarily by the client by sending a message with [`op=0x79f937ea`](https://github.com/ton-blockchain/ton/tree/testnet/storage/storage-daemon/smartcont/constants.fc#L2) from the address with any query ID.


## Running and configuring a provider
The storage provider is a component of the `storage-daemon` and is managed using the `storage-daemon-cli`. To run the provider, launch `storage-daemon` with the `-P` flag.

### Create a main smart contract

To deploy the provider’s smart contract from `storage-daemon-cli`, run:
```
deploy-provider
```

:::info IMPORTANT!
During deployment, you’ll be prompted to send a non-bounceable message with 1 TON to the specified address to initialize the provider. You can verify successful deployment with the `get-provider-info` command.
:::

By default, the contract does not accept new storage contracts. Before activating it, you must configure the provider configuration, which is stored in  `storage-daemon`, and contract parameters stored on-chain.

### Configuration

The provider configuration includes:

* `max contracts` - maximum number of concurrent storage contracts.
* `max total size` - maximum total size of *bags* in storage contracts.

To view the current configuration:

```
get-provider-info
```

To update the configuration:
```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Contract parameters
* `accept` - whether to accept new storage contracts.
* `max file size`, `min file size` - size limits for one *bag*.
* `rate` - cost of storage specified in nanoTON per megabyte per day.
* `max span` - how often the provider will have to submit storage proofs.

To view the current parameters:
```
get-provider-info
```

To update the parameters:
```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

**Note:** in the `set-provider-params` command, you may update only a subset of parameters. Any omitted values will retain their current settings. Since blockchain data is not updated instantly, executing multiple `set-provider-params` commands quickly can lead to inconsistent results.

It is recommended that the provider’s smart contract be funded with more than 1 TON after deployment to cover future transaction fees. However, avoid transferring large amounts during the initial non-bounceable setup.



After setting the `accept` parameter to `1`, the smart contract will start accepting requests from clients and creating storage contracts, while the storage daemon will automatically process them: downloading and distributing *Bags*, generating storage proofs.


- The provider begins accepting client requests once the `accept` parameter is set to `1` and creates storage contracts. The storage daemon will automatically:
- Download and distribute **bags**. 
- Generate and submit storage proofs.


## Further work with the provider

### List of existing storage contracts

To list all active storage contracts and their balances:
```
get-provider-info --contracts --balances
```
Each contract displays:
- `Client$`: funds provided by the client.
- `Contract$`: total funds in the contract.

The difference between these values represents the provider’s earnings, which can be withdrawn using `withdraw <address>`.

To withdraw from all contracts with at least 1 TON available:
`withdraw-all`

To close a specific contract: 
`close-contract <address>`

Closing a contract automatically transfers available funds to the main provider contract. The exact process occurs automatically when the client’s balance is depleted. In both cases, the associated bag files will be deleted—unless other active contracts still use them.

### Transfer

You can transfer funds from the main smart contract to any address (the amount is specified in nanoTON):

```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
All *bags* stored by the provider are available with the command `list` and can be used as usual. To prevent disrupting the provider's operations, do not delete them or use this storage daemon to work with any other *bags*.
:::

<Feedback />

