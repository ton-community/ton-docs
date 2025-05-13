import Feedback from '@site/src/components/Feedback';

# Changing the parameters

This document aims to provide a basic explanation of TON Blockchain's configuration parameters and give step-by-step instructions for changing these parameters based on a consensus of a majority of validators.

We assume that the reader is already familiar with [Fift](/v3/documentation/smart-contracts/fift/overview) and the [Lite Client](/v3/guidelines/nodes/running-nodes/liteserver-node), as explained in [FullNode-HOWTO (low-level)](/v3/guidelines/nodes/running-nodes/full-node), and [Validator-HOWTO (low-level)](/v3/guidelines/nodes/running-nodes/validator-node) particularly in the sections discussing how validators vote on configuration proposals.

## Configuration parameters

The **configuration parameters** are specific values that influence the behavior of validators and fundamental smart contracts on the TON Blockchain. The current values of all configuration parameters are stored as a distinct part of the MasterChain state and are retrieved whenever necessary. Consequently, we can refer to the values of the configuration parameters concerning a particular MasterChain block. Each ShardChain block includes a reference to the most recently known MasterChain block; the values from the corresponding MasterChain state are considered active for this ShardChain block and are used during its generation and validation.

For MasterChain blocks, the state of the previous MasterChain block is used to extract the active configuration parameters. Therefore, even if certain configuration parameters are attempted to be modified within a MasterChain block, any changes will only take effect in the subsequent MasterChain block.


Each configuration parameter is identified by a signed 32-bit integer known as the **configuration parameter index**, or simply the **index**. The value of a configuration parameter is always a `Cell`. In some cases, certain configuration parameters may be absent, and it is generally assumed that the value of these missing parameters is `Null`. Additionally, there is a list of **mandatory** configuration parameters that must always be present. This list is stored in the configuration parameter `#10`.

All configuration parameters are combined into a **configuration dictionary**, which is a `Hashmap` with signed 32-bit keys (the configuration parameter indices) and values that consist of exactly one cell reference. In other words, a configuration dictionary is a value of the TL-B type `HashmapE 32 ^Cell`. The collection of all configuration parameters is retained in the MasterChain state as a value of the TL-B type `ConfigParams`:

`_ config_addr:bits256 config:^(Hashmap 32 ^Cell) = ConfigParams;`

In addition to the configuration dictionary, `ConfigParams` contains `config_addr`—the 256-bit address of the configuration smart contract within the MasterChain. Further details on the configuration smart contract will be provided later.

The configuration dictionary, which contains the active values of all configuration parameters, is accessible to all smart contracts through a special TVM register called `c7` during the execution of a transaction. Specifically, when a smart contract is executed, `c7` is initialized as a tuple. This tuple consists of a single element, which is another tuple containing several "context" values that are useful for executing the smart contract, such as the current Unix time (as recorded in the block header). 

The tenth entry of this inner tuple (i.e., the one indexed with zero-based index 9) contains a `Cell` representing the configuration dictionary. This configuration dictionary can be accessed by using the TVM instructions `PUSH c7; FIRST; INDEX 9` or the equivalent instruction `CONFIGROOT`. Furthermore, special TVM instructions like `CONFIGPARAM` and `CONFIGOPTPARAM` streamline this process by combining the previous actions with a dictionary lookup, allowing smart contracts to retrieve any configuration parameter by its index.

It is important to note that all configuration parameters are readily accessible to all smart contracts, whether they operate on the MasterChain or ShardChain. As a result, smart contracts can inspect these parameters and utilize them for specific checks. For instance, a smart contract might extract data storage prices for different WorkChains from a configuration parameter in order to calculate the cost of storing a piece of user-provided data.


The values of configuration parameters are not arbitrary. Specifically, if the configuration parameter index `i` is non-negative, then its value must correspond to a valid value of the TL-B type `ConfigParam i`. Validators enforce this restriction and do not accept changes to configuration parameters with non-negative indices unless the values are valid for the corresponding TL-B type.

The structure of these parameters is defined in the source file `crypto/block/block.tlb`, where `ConfigParam i` is specified for different values of `i`. For example:

- `_config_addr: bits256 = ConfigParam 0;`
- `_elector_addr: bits256 = ConfigParam 1;`
- `_dns_root_addr: bits256 = ConfigParam 4; // root TON DNS resolver`
- `capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;`
- `_GlobalVersion = ConfigParam 8; // all zero if absent`

These entries illustrate how configuration parameters are structured and defined within the specified file.

The configuration parameter `#8` includes a `Cell` that has no references and contains exactly 104 data bits. The first four bits are allocated for `11000100`, followed by 32 bits that represent the currently enabled "global version." This is followed by a 64-bit integer with flags that correspond to the currently enabled capabilities. A more detailed description of all configuration parameters will be provided in an appendix to the TON Blockchain documentation. In the meantime, you can review the TL-B scheme in `crypto/block/block.tlb` to see how different parameters are utilized in the validator sources.

Unlike configuration parameters with non-negative indices, those with negative indices can hold arbitrary values. Validators do not enforce any restrictions on these values. As a result, they can be used to store essential information, such as the Unix time when specific smart contracts are set to begin operating. This information is not critical for block generation but is necessary for some fundamental smart contracts.

## Changing configuration parameters

The current values of configuration parameters are stored in a special section of the MasterChain state. But how are they changed?

There is a special smart contract known as the **configuration smart contract** that resides in the MasterChain. Its address is specified by the `config_addr` field in `ConfigParams`. The first cell reference in its data must contain an up-to-date copy of all configuration parameters. When a new MasterChain block is generated, the configuration smart contract is accessed using its address (`config_addr`), and the new configuration dictionary is extracted from the first cell reference of its data. 

Following some validity checks—like ensuring that any value with a non-negative 32-bit index `i` is indeed a valid TL-B type (`ConfigParam i`)—the validator copies this new configuration dictionary into the portion of the MasterChain that contains `ConfigParams`. This operation occurs after all transactions have been created, meaning only the final version of the new configuration dictionary stored in the smart contract is evaluated. 

If the validity checks fail, the existing configuration dictionary remains unchanged, ensuring that the configuration smart contract cannot install invalid parameter values. If the new configuration dictionary is identical to the current one, no checks are performed, and no changes are made.

All changes to configuration parameters are executed by the configuration smart contract, which defines the rules for modifying these parameters. Currently, the configuration smart contract supports two methods for changing configuration parameters:

- **External message**: This method involves an external message signed by a specific private key, which corresponds to a public key stored in the configuration smart contract's data. This approach is typically used in public testnets and possibly in smaller private test networks controlled by a single entity, as it allows the operator to easily modify any configuration parameter values. 

  It is important to note that this public key can be changed through a special external message signed by the previous key, and if changed to zero, this mechanism becomes disabled. This means the method can be used for fine-tuning right after launch and then permanently disabled.

- **Configuration proposals**: This method involves creating "configuration proposals" that validators vote on. Generally, a configuration proposal must gather votes from more than 3/4 (75%) of all validators by weight, and this requires approval in multiple rounds (i.e., several consecutive sets of validators must confirm the proposed parameter change). This serves as the distributed governance mechanism for the TON Blockchain Mainnet.

We will provide a more detailed explanation of the second method for changing configuration parameters.

## Creating configuration proposals

A new **configuration proposal** includes the following information:

- The index of the configuration parameter to be changed.
  
- The new value of the configuration parameter (or `Null`, if it is to be deleted).
  
- The expiration Unix time of the proposal.
  
- A flag indicating whether the proposal is **critical**.
  
- An optional **old value hash** that contains the cell hash of the current value (the proposal can only be activated if the current value matches the specified hash).

Anyone with a wallet in the MasterChain can create a new configuration proposal, provided they pay the required fee. However, only validators have the authority to vote for or against existing configuration proposals.

It is important to note that there are **critical** and **ordinary** configuration proposals. A critical configuration proposal can modify any configuration parameter, including those classified as critical. The list of critical configuration parameters is stored in configuration parameter `#10`, which is itself considered critical. Creating critical configuration proposals is more costly, and they typically require gathering more validator votes across multiple rounds. The specific voting requirements for both ordinary and critical configuration proposals are detailed in the critical configuration parameter `#11`. Conversely, ordinary configuration proposals are less expensive to create but cannot alter critical configuration parameters.

To create a new configuration proposal, one must first generate a BoC (bag-of-cells) file that contains the proposed new value. The method for doing this varies depending on the configuration parameter being modified. For example, if we want to create a parameter `-239` containing the UTF-8 string "TEST" (i.e., `0x54455354`), we would generate `config-param-239.boc` by invoking Fift and then typing:

```
<b "TEST" $, b> 2 boc+>B "config-param-239.boc" B>file
bye
```

As a result, a 21-byte file named `config-param-239.boc` will be created, which contains the serialization of the required value.

For more complex cases, especially for configuration parameters with non-negative indices, this straightforward approach may not be easily applicable. We recommend using `create-state`, which is available as `crypto/create-state` in the build directory, instead of using `fift`. You should also consider copying and modifying relevant portions of the source files `crypto/smartcont/gen-zerostate.fif` and `crypto/smartcont/CreateState.fif`. These files are typically used to create the zero state, corresponding to the "genesis block" found in other blockchain architectures, for the TON Blockchain.

For example, consider configuration parameter `#8`, which contains the currently enabled global blockchain version and its capabilities:

```
capabilities#c4 version:uint32 capabilities:uint64 = GlobalVersion;
_ GlobalVersion = ConfigParam 8;
```

We can check its current value by running the lite client and typing `getconfig 8`:

```
> getconfig 8
...
ConfigParam(8) = (
  (capabilities version:1 capabilities:6))

x{C4000000010000000000000006}
```

Let’s consider enabling the capability represented by bit `#3` (which corresponds to `+8`), specifically the `capReportVersion` capability. When this capability is enabled, it requires all collators to include their supported versions and capabilities in the block headers of the blocks they generate. Therefore, we need to set `version=1` and `capabilities=14`. In this case, we can accurately guess the correct serialization and create the BoC file directly by entering commands in Fift.

```
x{C400000001000000000000000E} s>c 2 boc+>B "config-param8.boc" B>file
```

A 30-byte file named `config-param8.boc` is created, containing the desired value.

In more complicated cases, this may not be an option. Therefore, let's approach this example differently. We can inspect the source files `crypto/smartcont/gen-zerostate.fif` and `crypto/smartcont/CreateState.fif` for relevant portions.

```
// version capabilities --
{ <b x{c4} s, rot 32 u, swap 64 u, b> 8 config! } : config.version!
1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
```
    
and

```
// version capabilities
1 capCreateStats capBounceMsgBody or capReportVersion or config.version!
```

We observe that `config.version!`, excluding the last `8 config!`, effectively accomplishes our goal. Therefore, we can create a temporary Fift script named `create-param8.fif`:

```
#!/usr/bin/fift -s
"TonUtil.fif" include

1 constant capIhr
2 constant capCreateStats
4 constant capBounceMsgBody
8 constant capReportVersion
16 constant capSplitMergeTransactions
{ <b x{c4} s, rot 32 u, swap 64 u, b> } : prepare-param8

// create new value for config param #8
1 capCreateStats capBounceMsgBody or capReportVersion or prepare-param8
// check the validity of this value
dup 8 is-valid-config? not abort"not a valid value for chosen configuration parameter"
// print
dup ."Serialized value = " <s csr.
// save into file provided as first command line argument
2 boc+>B $1 tuck B>file
."(Saved into file " type .")" cr
```

To execute the command `fift -s create-param8.fif config-param8.boc` or, even better, use `crypto/create-state -s create-param8.fif config-param8.boc` from the build directory, we will see the following output:

```
Serialized value = x{C400000001000000000000000E}
(Saved into file config-param8.boc)
```

We have obtained a 30-byte file named `config-param8.boc`, which contains the same content as before.

To create a configuration proposal, we first need a file containing the desired value for the configuration parameter. Next, we execute the script `create-config-proposal.fif`, which is located in the `crypto/smartcont` directory of the source tree, using appropriate arguments. We recommend using `create-state` (found as `crypto/create-state` in the build directory) instead of `fift`. This is because `create-state` is a specialized version of Fift that performs additional blockchain related validity checks:

```
$ crypto/create-state -s create-config-proposal.fif 8 config-param8.boc -x 1100000


Loading new value of configuration parameter 8 from file config-param8.boc
x{C400000001000000000000000E}

Non-critical configuration proposal will expire at 1586779536 (in 1100000 seconds)
Query id is 6810441749056454664 
resulting internal message body: x{6E5650525E838CB0000000085E9455904_}
 x{F300000008A_}
  x{C400000001000000000000000E}

B5EE9C7241010301002C0001216E5650525E838CB0000000085E9455904001010BF300000008A002001AC400000001000000000000000ECD441C3C
(a total of 104 data bits, 0 cell references -> 59 BoC data bytes)
(Saved to file config-msg-body.boc)
```

We have acquired the content of an internal message intended for the configuration smart contract, along with an appropriate amount of Toncoin from any wallet smart contract located in the MasterChain. To find the address of the configuration smart contract, you can enter the `get config 0' command in the lite client:

```
> getconfig 0
ConfigParam(0) = ( config_addr:x5555555555555555555555555555555555555555555555555555555555555555)
x{5555555555555555555555555555555555555555555555555555555555555555}
```

We have the address of the configuration smart contract as `-1:5555...5555`. By using appropriate getter methods of this smart contract, we can determine the required payment for creating this configuration proposal:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 proposal_storage_price 0 1100000 104 0

arguments:  [ 0 1100000 104 0 75077 ] 
result:  [ 2340800000 ] 
remote result (not to be trusted):  [ 2340800000 ] 
```

The parameters for the `proposal_storage_price` get-method include the following: a critical flag set to 0, a time interval of 1.1 megaseconds during which the proposal will remain active, a total of 104 bits, and 0 cell references in the data. The latter two quantities can be found in the output of `create-config-proposal.fif`.
  
To create this proposal, we need to pay 2.3408 Toncoins. It's advisable to add at least 1.5 Toncoins to cover the processing fees. Therefore, we will send a total of 4 Toncoins with the request (any excess Toncoins will be returned). We will then use `wallet.fif` (or the appropriate Fift script for our wallet) to execute a transfer from our wallet to the configuration smart contract, including the 4 Toncoins and the body from `config-msg-body.boc`. This process typically looks like:

```
$ fift -s wallet.fif my-wallet -1:5555555555555555555555555555555555555555555555555555555555555555 31 4. -B config-msg-body.boc

Transferring GR$4. to account kf9VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQft = -1:5555555555555555555555555555555555555555555555555555555555555555 seqno=0x1c bounce=-1 
Body of transfer message is x{6E5650525E835154000000085E9293944_}
 x{F300000008A_}
  x{C400000001000000000000000E}

signing message: x{0000001C03}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

resulting external message: x{89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C_}
 x{627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944_}
  x{F300000008A_}
   x{C400000001000000000000000E}

B5EE9C724101040100CB0001CF89FE000000000000000000000000000000000000000000000000000000000000000007F0BAA08B4161640FF1F5AA5A748E480AFD16871E0A089F0F017826CDC368C118653B6B0CEBF7D3FA610A798D66522AD0F756DAEECE37394617E876EFB64E9800000000E01C010189627FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA773594000000000000000000000000000006E5650525E835154000000085E9293944002010BF300000008A003001AC400000001000000000000000EE1F80CD3
(Saved to file wallet-query.boc)
```

We will now send the external message `wallet-query.boc` to the blockchain using the lite client.

    > sendfile wallet-query.boc
    ....
    external message status is 1

After waiting for a brief period, we can check the incoming messages in our wallet to look for response messages from the configuration smart contract. Alternatively, if we are feeling lucky, we can directly inspect the list of all active configuration proposals by using the `list_proposals` method of the configuration smart contract.

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 list_proposals
...
arguments:  [ 107394 ] 
result:  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
remote result (not to be trusted):  [ ([64654898543692093106630260209820256598623953458404398631153796624848083036321 [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0]]) ] 
... caching cell FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC
```

The list of all active configuration proposals contains exactly one entry represented by a pair.

```
[6465...6321 [1586779536 0 [8 C{FDCD...} -1] 1124...2998 () 8646...209 3 0 0]]
```

The first number, `6465..6321`, serves as the unique identifier for the configuration proposal and represents its 256-bit hash. The second component of this pair is a tuple that describes the status of the configuration proposal. The first part of this tuple indicates the expiration Unix time of the proposal (`1586779546`), while the second part (`0`) acts as a criticality flag.

Next, we find the configuration proposal itself, which is expressed by the triple `[8 C{FDCD...} -1]`. In this notation, `8` represents the index of the configuration parameter to be modified, `C{FDCD...}` denotes the cell containing the new value (its hash is represented by the value that follows), and `-1` indicates the optional hash of the old value for this parameter (where `-1` means the old hash is not specified).

Following that, we encounter a large number, `1124...2998`, which identifies the current validator set. An empty list `()` is included to signify the set of all currently active validators who have voted for this proposal so far. Next is `weight_remaining`, equal to `8646...209`. This value is positive if the proposal has not yet garnered enough validator votes in this round, and negative otherwise.

Lastly, we see three numbers: `3 0 0`. These represent `rounds_remaining` (the proposal can survive at most three rounds, meaning changes to the current validator set), `wins` (the count of rounds in which the proposal received votes exceeding 3/4 of all validators by weight), and `losses` (the count of rounds where the proposal failed to secure 3/4 of all validator votes).

To inspect the proposed value for configuration parameter `#8`, you can ask the lite client to expand cell `C{FDCD...}` using its hash `FDCD...` or a sufficiently long prefix of this hash to uniquely identify the specific cell in question:

```
> dumpcell FDC
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
```

We observe that the value is `x{C400000001000000000000000E}`, which is the value we have incorporated into our configuration proposal. Additionally, we can ask the lite client to present this Cell as a TL-B type value (`ConfigParam 8`).

```
> dumpcellas ConfigParam8 FDC
dumping cells as values of TLB type (ConfigParam 8)
C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} =
  x{C400000001000000000000000E}
(
    (capabilities version:1 capabilities:14))
```

This is particularly useful when we evaluate configuration proposals created by others.

Each configuration proposal is identified by its unique 256-bit hash, represented by the large decimal number `6465...6321`. To check the current status of a specific configuration proposal, you can use the `get_proposal` method, providing the identifier of the configuration proposal as the only argument:

```
> runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
...
arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 () 864691128455135209 3 0 0] ] 
```

We achieve essentially the same outcome as before, but for only one configuration proposal and without the identifier at the beginning.

## Voting for configuration proposals

Once a configuration proposal is created, it must collect votes from more than 75% of all current validators (based on their stake) during the current round and possibly in several subsequent rounds (with elected validator sets). This ensures that the decision to change a configuration parameter is approved by a significant majority, not only of the current set of validators but also of several future sets.

Voting for a configuration proposal is limited to the current validators listed (with their permanent public keys) in configuration parameter `#34`. The process is outlined below:

- The operator of a validator first looks up `val-idx`, the zero-based index of their validator in the current set of validators stored in configuration parameter `#34`.

- The operator then invokes a special Fift script, `config-proposal-vote-req.fif`, found in the `crypto/smartcont` directory of the source tree. They must indicate both `val-idx` and `config-proposal-id` as arguments:

  ```
    $ fift -s config-proposal-vote-req.fif -i 0 64654898543692093106630260209820256598623953458404398631153796624848083036321
    Creating a request to vote for configuration proposal 0x8ef1603180dad5b599fa854806991a7aa9f280dbdb81d67ce1bedff9d66128a1 on behalf of validator with index 0 
    566F744500008EF1603180DAD5B599FA854806991A7AA9F280DBDB81D67CE1BEDFF9D66128A1
    Vm90RQAAjvFgMYDa1bWZ-oVIBpkaeqnygNvbgdZ84b7f-dZhKKE=
    Saved to file validator-to-sign.req
  ```

- The vote request must then be signed using the current validator’s private key, with the command `sign <validator-key-id> 566F744...28A1` in the `validator-engine-console` connected to the validator. This process is similar to the steps described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node) for participating in validator elections; however, the currently active key must be used.

- Next, the `config-proposal-signed.fif` script is invoked. This script has similar arguments to `config-proposal-req.fif`, but it also requires two additional arguments: the base64 representation of the public key used to sign the vote request and the base64 representation of the signature. The process is again akin to what is described in the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node).

- This process generates a file named `vote-msg-body.boc`, which contains the body of an internal message carrying a signed vote for this configuration proposal.

- After that, `vote-msg-body.boc` must be sent in an internal message from any smart contract residing in the masterchain (typically from the controlling smart contract of the validator) along with a small amount of Toncoin for processing (usually, 1.5 Toncoin is sufficient). This step follows the same procedure used during validator elections. The command is typically structured as follows:

  ```
  $ fift -s wallet.fif my_wallet_id -1:5555555555555555555555555555555555555555555555555555555555555555 1 1.5 -B vote-msg-body.boc
  ```

  (if a simple wallet controls the validator), followed by sending the resulting file `wallet-query.boc` from the lite client:

    ```
    > sendfile wallet-query.boc
    ```

- You can monitor the response messages from the configuration smart contract to the controlling smart contract to check the status of your voting queries. Alternatively, you can inspect the status of the configuration proposal by using the `get-method` `show_proposal` of the configuration smart contract:

  ```
  > runmethod -1:5555555555555555555555555555555555555555555555555555555555555555 get_proposal 64654898543692093106630260209820256598623953458404398631153796624848083036321
  ...
  arguments:  [ 64654898543692093106630260209820256598623953458404398631153796624848083036321 94347 ] 
  result:  [ [1586779536 0 [8 C{FDCD887EAF7ACB51DA592348E322BBC0BD3F40F9A801CB6792EFF655A7F43BBC} -1] 112474791597373109254579258586921297140142226044620228506108869216416853782998 (0) 864691128455135209 3 0 0] ]
  ```
  In this output, the list of indices for validators that voted for this configuration proposal should not be empty and must include the index of your validator. For example, if the list contains (`0`), it indicates that only the validator with index `0` in configuration parameter `#34` has voted. If this list grows, the second-to-last integer (the first zero in `3 0 0`) in the proposal status will increase, reflecting another win for this proposal. If the number of wins reaches or exceeds the value indicated in configuration parameter `#11`, the configuration proposal is automatically accepted, and the proposed changes take effect immediately.

  Conversely, when the validator set changes, the list of validators that have already voted will become empty, the `rounds_remaining` value (currently three in `3 0 0`) will decrease by one, and if it becomes negative, the configuration proposal will be destroyed. If the proposal is not destroyed and has not won in the current round, the number of losses (the second zero in `3 0 0`) will increase. If this number exceeds the value specified in configuration parameter `#11`, the configuration proposal will be rejected.

## An automated way of voting on configuration proposals

The automation provided by the command `createelectionbid` in `validator-engine-console` facilitates participation in validator elections. Similarly, both `validator-engine` and `validator-engine-console` automate most of the steps mentioned in the previous section, allowing you to generate a `vote-msg-body.boc` that can be used with the controlling wallet.

To use this method, you need to install the Fift scripts `config-proposal-vote-req.fif` and `config-proposal-vote-signed.fif` in the same directory that the validator-engine uses to locate `validator-elect-req.fif` and `validator-elect-signed.fif`, as described in Section 5 of the [Validator-HOWTO](/v3/guidelines/nodes/running-nodes/validator-node). Once you have those files set up, you can create the `vote-msg-body.boc` by executing the following command in the validator-engine-console:

```
    createproposalvote 64654898543692093106630260209820256598623953458404398631153796624848083036321 vote-msg-body.boc
```

This command will generate the `vote-msg-body.boc`, which contains the body of the internal message to be sent to the configuration smart contract.

## Upgrading the code of the configuration smart contract and the elector smart contract

It may be necessary to upgrade the code of either the configuration smart contract or the elector smart contract. To do this, we will use the same mechanism described previously. The new code must be stored in a reference of a value cell, and this value cell should be proposed as the new value for the configuration parameter `-1000` (for upgrading the configuration smart contract) or `-1001` (for upgrading the elector smart contract). These parameters are considered critical, so a significant number of validator votes will be required to make changes to the configuration smart contract, similar to adopting a new constitution. We anticipate that such changes will first be tested in a test network and discussed in public forums before each validator operator makes their decision to vote for or against the proposed changes.

Alternatively, critical configuration parameters `0` (which indicates the address of the configuration smart contract) or `1` (which indicates the address of the elector smart contract) can be changed to other values, provided that these values match existing and correctly initialized smart contracts. Specifically, the new configuration smart contract must contain a valid configuration dictionary in the first reference of its persistent data. Since transferring changing data—such as the list of active configuration proposals or the previous and current participant lists of validator elections—between different smart contracts can be complicated, it is generally more beneficial to upgrade the code of an existing smart contract rather than change the address of the configuration smart contract.

There are two auxiliary scripts designed to create configuration proposals for upgrading the code of the configuration or elector smart contract. The script `create-config-upgrade-proposal.fif` loads a Fift assembler source file (`auto/config-code.fif` by default), which corresponds to the code automatically generated by the FunC compiler from `crypto/smartcont/config-code.fc`, and creates the corresponding configuration proposal for the configuration parameter `-1000`. Similarly, the script `create-elector-upgrade-proposal.fif` loads a Fift assembler source file (`auto/elector-code.fif` by default) and uses it to create a configuration proposal for configuration parameter `-1001`. This makes it simple to create configuration proposals to upgrade either of these two smart contracts. 

However, it is also essential to publish the modified FunC source code of the smart contract and specify the exact version of the FunC compiler used for compilation. This way, all validators (or their operators) will be able to reproduce the code in the configuration proposal, compare the hashes, and examine the source code and changes before deciding how to vote on the proposed changes.
<Feedback />

