# Storage daemon

*A storage daemon is a program used to download and share torrents in the TON network. The storage daemon console program, `storage-daemon-cli`, is used to manage a running storage daemon.*

The current version of the storage daemon can be found in the [tonstorage](https://github.com/SpyCheese/ton/tree/master/storage) branch.


## Installation 

Before installing all the necessary components, it is worth reading [this tutorial on installing](https://ton.org/docs/develop/smart-contracts/environment/installation) the environment.

### Linux (Ubuntu / Debian):

* Download the latest version of the TON Blockchain source code available at the [GitHub repository](https://github.com/ton-blockchain/ton/)

```
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
```

* Install the latest versions of:
     * `make`
     * `cmake` version 3.0.2+
     * C++ Compiler: `g++` or `clang` 
     * OpenSSL

* Run this in the linux terminal:

```bash
sudo apt update
sudo apt install git make cmake g++ libssl-dev zlib1g-dev wget
cd ~ && git clone https://github.com/ton-blockchain/ton.git
cd ~/ton && git submodule update --init
mkdir ~/ton/build && cd ~/ton/build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j 4
```

### Run project


To run, run this and you're done:
```
cmake --build . --target storage-daemon storage-daemon-cli
```


## Key concepts
* *Bag of files* or *Bag* - a collection of files distributed through TON Storage
* TON Storage's network part is based on technology similar to torrents, so the terms *Torrent*, *Bag of files*, and *Bag* will be used interchangeably. It's important to note some differences, however: TON Storage transfers data over ADNL, each *Bag* is distributed through its own overlay, the merkle structure can exist in two versions - with large chunks for efficient downloading and small ones for efficient ownership proof, and TON's DHT network is used for finding peers.
* A *Bag of files* consists of *torrent info* and a data block.
* The data block starts with a *torrent header* - a structure that contains a list of files with their names and sizes. The files themselves follow in the data block.
* The data block is divided into chunks (128 KB by default), and a *merkle tree* (made of TVM cells) is built on the SHA256 hashes of these chunks. This allows building and verifying *merkle proofs* of individual chunks, as well as efficiently updating the *Bag* by exchanging only the proof of the modified chunk.
* *Torrent info* contains the *merkle root* of the 
    * Chunk size (data block)
    * the list of chunks' sizes
    * Hash *merkle tree*
    * Description - any text specified by the creator of the torrent
* *Torrent info* is serialized to a TVM cell. The hash of this cell is called *BagID*, and it uniquely identifies *Bag*.
* *Bag meta* is a file containing *torrent info* and *torrent header*.* This is an analog `.torrent` files.


## Starting the storage daemon and storage-daemon-cli

### An example command for starting the storage-daemon:


```storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db```

* `-v` - verbosity level (INFO)
* `-C` - global network config
* `-I` - IP address and port for adnl
* `-p` - tcp port for console interface
* `-D` - directory for the storage daemon database

### storage-daemon-cli management
It's started like this:

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

* `-I` - this is the IP address and port of the daemon (the port is the same one specified in the `-p` parameter above)
* `-k` and `-p` - these are the client's private key and the server's public key (similar to `validator-engine-console`). These keys are generated on the first run of the daemon and are placed in `<db>/cli-keys/`.

### List of commands

The list of `storage-daemon-cli` commands can be obtained with the `help` command.
Parameters with spaces should be enclosed in quotes.

`storage-daemon-cli` can be run in non-interactive mode by passing it commands to execute:

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## Adding a Bag of Files
To download a *Bag of Files*, you need to know its `BagID` or have a meta-file. The following commands can be used to add a *Bag* for download:
```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```
The *Bag* will be downloaded to the specified directory. You can omit it, then it will be saved to the storage daemon directory.

:::info
The hash is specified in hexadecimal form (length - 64 characters).
:::

When adding a *Bag* by a meta-file, information about the *Bag* will be immediately available: size, description, list of files. When adding by hash, you will have to wait for this information to be loaded.


## Managing Added Bags
* The `list` command outputs a list of *Bags*. 
* `list --hashes` outputs a list with full hashes. In all subsequent commands, 
* `<BagID>` is either a hash (hexadecimal) or an ordinal number of the *Bag* within the session (a number that can be seen in the list by the `list` command). Ordinal numbers of *Bags* are not saved between restarts of storage-daemon-cli and are not available in non-interactive mode.

### Methods

* `get <BagID>` - outputs detailed information about the *Bag*: description, size, download speed, list of files.
* `get-peers <BagID>` - outputs a list of peers.
* `download-pause <BagID>`, `download-resume <BagID>` - pauses or resumes downloading.
* `remove <BagID>` - removes the *Bag*. `remove --remove-files` also deletes all files of the *Bag*. Note that if the *Bag* is saved in the internal storage daemon directory, the files will be deleted in any case.


## Partial Download, Priorities
:::info
When adding a *Bag* you can specify which files you want to download from it:
:::
```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### Priorities

Each file in the *Bag of Files* has a priority, a number from 0 to 255. Priority 0 means the file won't be downloaded. The `--partial` flag sets the specified files to priority 1, the others to 0.

You can change the priorities of an already added *Bag* with the following commands:
* `priority-all <BagID> <priority>` - for all files.
* `priority-idx <BagID> <idx> <priority>` - for one file by number (see with `get` command).
* `priority-name <BagID> <name> <priority>` - for one file by name.
Priorities can be set even before the list of files is downloaded.


## Creating a Bag of Files
To create a *Bag* and start distributing it, use the `create` command:
```
create <path>
```
`<path>` can point to either a single file or a directory. When creating a *Bag*, you can specify a description:
```
create <path> -d "Bag of Files description"
```
After the *Bag* is created, the console will display detailed information about it (including the hash, which is the `BagID` by which the *Bag* will be identified), and the daemon will start distributing the torrent.

To download the *Bag*, other users just need to know its hash. You can also save the torrent meta file:
```
get-meta <BagID> <meta-file>
```


# A storage provider
*A storage provider* is a service that stores files for a fee. It consists of a smart contract that accepts storage requests and manages payment from clients, and an application that uploads and serves the files to clients. Here's how it works:

1. The owner of the provider launches the `storage-daemon`, deploys the main smart contract, and sets up the parameters. The contract's address is shared with potential clients.
2. Using the `storage-daemon`, the client creates a Bag from their files and sends a special internal message to the provider's smart contract.
3. The provider's smart contract creates a storage contract to handle this specific Bag.
4. The provider, upon finding the request in the blockchain, downloads the Bag and activates the storage contract.
5. The client can then transfer payment for storage to the storage contract. To receive the payment, the provider regularly presents the contract with proof that they are still storing the Bag.
6. If the funds on the storage contract run out, the contract is considered inactive and the provider is no longer required to store the Bag. The client can either refill the contract or retrieve their files.

:::info
The client can also retrieve their files at any time by providing proof of ownership to the storage contract. The contract will then release the files to the client and deactivate itself.
:::


## Using a Provider by Clients
In order to use a storage provider, you need to know the address of its smart contract. The client can obtain the provider's parameters with the following command:
```
get-provider-params <address>
```

### The provider's parameters:

* Whether new storage contracts are accepted.
* Minimum and maximum *Bag* size (in bytes).
* Rate - the cost of storage. Specified in nanoTON per megabyte per day.
* Max span - how often the provider should provide proofs of *Bag* storage.

### A request to store

You need to create a *Bag* and generate a message with the following command:

```
new-contract-message <BagID> <file> --query-id 0 --provider <address>
```

### Info:

Executing this command may take some time for large *Bags*. The message body will be saved to `<file>` (not the entire internal message). Query id can be any number from 0 to `2^64-1`. The message contains the provider's parameters (rate and max span). These parameters will be printed out after executing the command, so they should be double checked before sending. If the provider's owner changes the parameters, the message will be rejected, so the conditions of the new storage contract will be exactly what the client expects.

The client must then send the message with this body to the provider's address. In case of an error the message will come back to the sender (bounce). Otherwise, a new storage contract will be created and the client will receive a message from it with [`op=0xbf7bd0c1`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L3) and the same query id.

At this point the contract is not yet active. Once the provider downloads the *Bag*, it will activate the storage contract and the client will receive a message with [`op=0xd4caedcd`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L4) (also from the storage contract).

The storage contract has a "client balance" - these are the funds that the client transferred to the contract and which have not yet been paid to the provider. Funds are gradually debited from this balance (at a rate equal to the rate per megabyte per day). The initial balance is what the client transferred with the request to create the storage contract. The client can then top up the balance by making simple transfers to the storage contract (this can be done from any address). The remaining client balance is returned by the [`get_storage_contract_data`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/storage-contract.fc#L222) get method as the second value (`balance`).

### The contract may be closed for the following cases:

:::info
In case of the storage contract being closed, the client receives a message with the remaining balance and [`op=0xb6236d63`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L6). 
:::

* Immediately after creation, before activation, if the provider refuses to accept the contract (the provider's limit is exceeded or other errors).
* The client balance reaches 0.
* The provider can voluntarily close the contract.
* The client can voluntarily close the contract by sending a message with [`op=0x79f937ea`](https://github.com/SpyCheese/ton/blob/tonstorage/storage/storage-daemon/smartcont/constants.fc#L2) from its own address and any query id.


## Running and Configuring a Provider
The Storage Provider is part of the `storage-daemon`, and is managed by the `storage-daemon-cli`. `storage-daemon` needs to be started with the `-P` flag.


### Create a main smart contract

You can do this from `storage-daemon-cli`:
```
deploy-provider
```

:::info IMPORTANT!
You will be asked to send a non-bounceable message with 1 TON to the specified address in order to initialize the provider. You can check that the contract has been created using the `get-provider-info` command.
:::

By default, the contract is set to not accept new storage contracts. Before activating it, you need to configure the provider. The provider's settings consist of a configuration (stored in `storage-daemon`) and contract parameters (stored in the blockchain).

### Configuration:
* `max contracts` - maximum number of storage contracts that can exist at the same time.
* `max total size` - maximum total size of *Bags* in storage contracts.
You can view the configuration values using `get-provider-info`, and change them with:
```
set-provider-config --max-contracts 100 --max-total-size 100000000000
```

### Contract parameters:
* `accept` - whether to accept new storage contracts.
* `max file size`, `min file size` - size limits for one *Bag*.
* `rate` - storage cost (specified in nanoTONs per megabyte per day).
* `max span` - how often the provider will have to submit storage proofs.

You can view the parameters using `get-provider-info`, and change them with:
```
set-provider-params --accept 1 --rate 1000000000 --max-span 86400 --min-file-size 1024 --max-file-size 1000000000
```

### It is worth paying attention

Note: in the `set-provider-params` command, you can specify only some of the parameters. The others will be taken from the current parameters. Since the data in the blockchain is not updated instantly, several consecutive `set-provider-params` commands can lead to unexpected results.

It is recommended to initially put more than 1 TON on the provider's balance, so that there are enough funds to cover the commissions for working with storage contracts. However, do not send too many TONs with the first non-bounceable message.

After setting the `accept` parameter to `1`, the smart contract will start accepting requests from clients and creating storage contracts, while the storage daemon will automatically process them: downloading and distributing *Bags*, generating storage proofs.


## Further Work With the Provider

### List of existing storage contracts

```
get-provider-info --contracts --balances
```
Each storage contract has a `Client$` and `Contract$` balance listed; the difference between them can be withdrawn to the main provider contract with the command `withdraw <address>`.

The command `withdraw-all` will withdraw funds from all contracts that have at least `1 TON` available.

Any storage contract can be closed with the command `close-contract <address>`. This will also transfer the funds to the main contract. The same will happen automatically when the client's balance runs out. The *Bag* files will be deleted in this case (unless there are other contracts using the same *Bag*).

### Transfer

You can transfer funds from the main smart contract to any address (the amount is specified in nanoTON):
```
send-coins <address> <amount>
send-coins <address> <amount> --message "Some message"
```

:::info
All *Bags* stored by the provider are available with the command `list`, and can be used as usual. To prevent disrupting the provider's operations, do not delete them or use this storage daemon to work with any other *Bags*.
:::
