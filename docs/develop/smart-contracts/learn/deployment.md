# Deployment

* Compile to ByteCode
* Wrap the bytecode to BoC
* Execute the message address destination
* Top Up balance
* Send BoC to destination address
* Check success in the explorer


### Compile to ByteCode
Use the ton compilers to create bytecode from your smart contract code.

### Wrap the bytecode to BoC
Wrap the bytecode to BoC according to message layout rules. Create a new file and save the bytecode with a .boc extension. Then, use the TONOS CLI tool to wrap the bytecode to BoC with this command:

### Execute the message address destination 
Execute the message address destination according to the rule "Address = Hash(StateInit, ContractCode)". Use the TONOS CLI tool to get the state init of your contract and the hash of your contract code. Then, use a hash function to hash the state init and contract code to get the destination address. Finally, use the TONOS CLI tool to execute the message address destination with this command:

### Top up the deployer contract balance.
Send funds to your deployer contract with this command:

### Use a Lite Client or a wallet app to send BoC to the destination address. 
Open your Lite Client or wallet app, click on the "Send" button, and enter the destination address and the amount of BoC that you want to send.

### Check the contract address with a blockchain explorer to find out if the deployment was successful. 
Open a blockchain explorer, such as TONScan, and enter the contract address into the search bar to view its details.
