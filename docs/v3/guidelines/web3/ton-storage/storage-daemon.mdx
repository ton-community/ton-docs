import Feedback from '@site/src/components/Feedback';

# Storage daemon

A **storage daemon** is a program used to download and share files in the TON network. The `storage-daemon-cli` console program manages a running storage daemon.

The current version of the storage daemon is available in the [Testnet](https://github.com/ton-blockchain/ton/tree/testnet) branch.

## Hardware requirements

* At least 1GHz dual-core CPU
* At least 2 GB RAM
* At least 2 GB SSD, excluding space for torrents
* 10 Mb/s network bandwidth with a static IP

## Binaries 

You can download `storage-daemon` and `storage-daemon-cli` for Linux, Windows, and macOS from [TON auto builds](https://github.com/ton-blockchain/ton/releases/latest).


## Compile from sources
You can compile `storage-daemon` and `storage-daemon-cli` from the source using this [instruction](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#storage-daemon).

## Key concepts

* **Bag of files** or **bag** – a collection of files distributed via TON Storage.
* TON Storage uses torrent-like technology, so terms like *Torrent*, *bag of files*, and *bag* are used interchangeably. However, there are some important differences:
  * Data is transferred over [ADNL](/v3/documentation/network/protocols/adnl/overview) using the [RLDP](/v3/documentation/network/protocols/rldp) protocol.
  * Each bag is distributed via its overlay network.
  * The Merkle structure can exist in two formats: one with large chunks for efficient downloading and one with smaller chunks for efficient proof of ownership.
  * The [TON DHT](/v3/documentation/network/protocols/dht/ton-dht) network is used to discover peers.

* A **bag of files** includes:
  * Torrent info. 
  * Data block - starts with a torrent header including file names and sizes, followed by the files themselves.


The data block is divided into chunks, with a default size of 128 KB. A merkle tree built from TVM cells is constructed on the SHA256 hashes of these chunks. This structure enables the creation and verification of *merkle proofs* for individual chunks and allows efficient reconstruction of the *bag* by exchanging only the proof of the changed chunk.


* **Torrent info** contains the merkle root of the following:
  * The chunk size (data block)
  * The list of chunk sizes 
  * Hash-based merkle tree 
  * Description, which is any text specified by the creator of the torrent

* Torrent info is serialized into a TVM cell. The hash of this cell is called the **bagID**, and it uniquely identifies the **bag**.
* The **bag meta** is a file that includes the *torrent info* and *header*. This file serves the same purpose as a `.torrent` file.




## Starting the storage daemon and storage-daemon-cli

### Starting storage-daemon:

**Example**

```storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db```

* `-v` - verbosity level (INFO)
* `-C` - global network config ([download](/v3/guidelines/smart-contracts/howto/compile/compilation-instructions#download-global-config))
* `-I` - IP address and port for ADNL
* `-p` - TCP port for the console interface
* `-D` - path to the storage daemon’s database

### Starting storage-daemon-cli 
It's started like this:

```
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

* `-I` - IP address and port of the daemon (same as `-p` above)
* `-k` and `-p` - client private and server public keys (similar to `validator-engine-console`). These are auto-generated at first daemon startup and stored in `<db>/cli-keys/`.

### List of commands
You can view the list of `storage-daemon-cli` commands using the `help` command.


Commands include *positional parameters* and *flags*. 
* Parameters that contain spaces must be enclosed in quotes, using either single `'` or double `"` quotation marks. 
* Alternatively, spaces can be escaped. 
* Other common escape sequences are also supported.

**Example**
```
create filename\ with\ spaces.txt -d "Description\nSecond line of \"description\"\nBackslash: \\"
```

All parameters following the `--` flag are treated as positional parameters. This allows specifying filenames that begin with a dash:

```
create -d "Description" -- -filename.txt
```

You can run `storage-daemon-cli` in non-interactive mode by passing it commands to execute:

```
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## Adding a bag of files

To download a **bag of files**, you need its hash `bagID` or a metafile. Use the following commands to add a *bag* for download:

```
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```
The bag will be downloaded to the specified directory. It will be saved to the default storage daemon directory if not specified.

:::info
The hash must be provided in hexadecimal format with a length of 64 characters.
:::

When adding a bag via a metafile, information such as size, description, and file list becomes available immediately. When adding by hash, this information may take time to load.


## Managing added bags
* The `list` command shows all added bags. 
* The `list --hashes` command shows full hashes.

In the following commands, `<BagID>` can be either a bag's hexadecimal hash or its ordinal number in the current session, which is visible in the list output using `list` command. Note that ordinal numbers of bags are not persistent and are unavailable in non-interactive mode.

### Methods

* `get <BagID>` - shows full information about the Bag: description, size, download speed, and file list.
* `get-peers <BagID>` - lists connected peers.
* `download-pause <BagID>`, `download-resume <BagID>` - pauses or resumes download.
* `upload-pause <BagID>`, `upload-resume <BagID>` - pauses or resumes upload.
* `remove <BagID>` - removes the bag. 
* `remove --remove-files` also removes the bag and its files. Note that if the bag is saved in the internal storage daemon directory, the files will be deleted in any case.


## Partial download, priorities
:::info
When adding a bag, you can specify which files to download:
:::
```
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### Priorities
Each file in a bag has a priority from 0 to 255. A priority of 0 means the file will not be downloaded. The `--partial` flag sets selected files to priority 1 and all others to 0.

To update priorities after adding a bag:

* `priority-all <BagID> <priority>` - sets priority for all files.
* `priority-idx <BagID> <idx> <priority>` - sets priority by file index (shown by the `get` command).
* `priority-name <BagID> <name> <priority>` - sets priority by file name.

You can set priorities even before the file list is fully available.


## Creating a bag of files
To create and start sharing a bag, use the `create` command:
```
create <path>
```
`<path>` can be a file or a directory. Add a description if needed:  

```
create <path> -d "Bag of Files description"
```

After creation, detailed information, including the hash `BagID`, is shown in the console, and the daemon begins sharing the torrent.
Additional options for the `create` command:

* `--no-upload` - daemon will not distribute files to peers. Upload can be started using the `upload-resume` command.
* `--copy` - files will be copied to the internal directory of the storage daemon.

To download the bag, other users need to know its hash. You can also save the torrent metafile:

```
get-meta <BagID> <meta-file>
```

<Feedback />

