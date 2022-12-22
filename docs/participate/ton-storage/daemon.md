# Use TON Storage

A Bag of Files, or Bag, in the TON is a collection of files that are distributed over the TON Storage network. TON Storage uses a technology similar to torrents to transmit data, but it has its own overlay network and uses the TON DHT network to find peers.

Let's go deeper to some key concepts to understand what's going on.

## Key concepts

* A *Bag of Files*, or *Bag*, is a collection of files distributed through TON Storage.
* The networking part of TON Storage is based on a technology similar to torrents, so the terms *Torrent*, *Bag of files*, and *Bag* will be used interchangeably. However, that there are some differences:
  * TON Storage transmits data over ADNL
  * Each *Bag* is distributed through its own overlay network
  * The merkle structure can be present in two versions:
    * _large chunks_ for efficient downloading
    * _small chunks_ for efficient proof of ownership
  * The TON DHT network is used to find peers.
* A *Bag of files* consists of *torrent info* and a data block.
* The data block begins with the *torrent header*, which contains a list of files with their names and sizes. The files themselves follow in the data block.
* The data block is divided into chunks (128 KB by default), and a merkle tree (made up of TVM cells) is constructed from the SHA256 hashes of these chunks. This allows for the construction and verification of merkle proofs of individual chunks.
* *Torrent info* is a structure that contains the *torrent header*, the *Bag ID* (a unique identifier for the *Bag*), and a *merkle root* (the root of the merkle tree).
* A *merkle proof* is a set of hashes that allows you to verify that a particular chunk is part of a *Bag*. To do this, you need the *merkle root* and the hashes of the chunk's siblings in the merkle tree.
* The *storage-daemon-cli* console program allows you to create and manage *Bags*, and the *storage daemon* is responsible for downloading and distributing them.

## Storage daemon

The *Storage daemon* is a program designed for downloading and distributing torrents in the TON network. The *storage-daemon-cli* console program is used to manage the running storage daemon.

~~The current version of the storage daemon is in the [tonstorage](https://github.com/SpyCheese/ton/tree/tonstorage) branch.~~

The cmake targets are called `storage-daemon` and `storage-daemon-cli`:
```bash
cmake --build . --target storage-daemon storage-daemon-cli
```

The executable files are located in the `<build-dir>/storage/storage-daemon/` directory.

### Starting the Storage Daemon

Here is an example command for starting the storage daemon:
```bash
storage-daemon -v 3 -C global.config.json -I <ip>:3333 -p 5555 -D storage-db
```

* `-v` - verbosity level (INFO)
* `-C` - global network config
* `-I` - ip address and port for adnl
* `-p` - tcp port for the console interface
* `-D` - directory for the storage daemon database

### storage-daemon-cli

To manage the storage daemon, the storage-daemon-cli program is used. It is started as follows:

```bash
storage-daemon-cli -I 127.0.0.1:5555 -k storage-db/cli-keys/client -p storage-db/cli-keys/server.pub
```

* `-I` - this is the ip address and port of the daemon (the port is the same as the one specified in the `-p` parameter above)
* `-k` and `-p` - these are the client's private key and the server's public key (similar to `validator-engine-console`). These keys are generated when the daemon is first started and placed in `<db>/cli-keys/`.

A list of storage-daemon-cli commands can be obtained with the help command. Parameters containing spaces should be enclosed in quotes.

The `storage-daemon-cli` can be run in non-interactive mode by passing it commands to execute:
```bash
storage-daemon-cli ... -c "add-by-meta m" -c "list --hashes"
```

## Bag of Files

### Adding a Bag of Files
To download a *Bag of Files*, you need to know its `BagID` or have a meta-file. You can add a *Bag* for download with the following commands:

```bash
add-by-hash <hash> -d directory
add-by-meta <meta-file> -d directory
```

The *Bag* will be downloaded to the specified directory. You can omit the directory and it will be saved in the storage daemon's directory.

The hash is specified in hexadecimal form (length - 64 characters).

When adding a *Bag* using a meta-file, information about the *Bag* will be immediately available: size, description, list of files. When adding by hash, you will have to wait for this information to be loaded.

### Managing Added Bags

The `list` command outputs a list of *Bag*s. `list --hashes` outputs a list with full hashes. In all subsequent commands, `<BagID>` is either a hash (hexadecimal) or the sequential number of the *Bag* within the session (a number that can be seen in the list using the `list` command). Sequential numbers of *Bags* are not saved between restarts of storage-daemon-cli and are not available in non-interactive mode.

* `get <BagID>` outputs detailed information about the *Bag*: description, size, download speed, list of files.
* `get-peers <BagID>` outputs a list of peers
* `download-pause <BagID>` stops downloading
* `download-resume <BagID>` resumes downloading
* `remove <BagID>` - removes the *Bag*
* `remove --remove-files` also removes all files in the *Bag*. Note that if the *Bag* is saved in the storage daemon's internal directory, the files will be removed in any case.

### Partial Downloading

When adding a *Bag*, you can specify the names of the files that will be downloaded from the *Bag*:

```bash
add-by-hash <hash> -d dir --partial file1 file2 file3
add-by-meta <meta-file> -d dir --partial file1 file2 file3
```

### File Priorities in Bag of Files

Each file in a *Bag of Files* has a priority - a number from 0 to 255. Priority 0 means the file will not be downloaded. The `--partial` flag sets a priority of 1 for the specified files and a priority of 0 for the rest.

To change the priorities of an already added *Bag*, you can use the following commands:
* `priority-all <BagID> <priority>` - for all files.
* `priority-idx <BagID> <idx> <priority>` - for one file by number (see in the list with the `get` command).
* `priority-name <BagID> <name> <priority>` - for one file by name.
  Priorities can be set even before the list of files is loaded.

### Creating a Bag of Files

To create a *Bag* and start distributing it, use the `create` command:
```bash
create <path>
```
`<path>` can refer to either a single file or a directory. When creating a *Bag*, you can specify a description:
```bash
create <path> -d "Bag of Files description"
```
After creating the *Bag*, detailed information about it will be printed in the console (including the hash == `BagID`, by which the *Bag* will be identified), and the daemon will start distributing the torrent.

To download a *Bag*, other users only need to know its hash. You can also save the torrent meta file:
```bash
get-meta <BagID> <meta-file>
```

