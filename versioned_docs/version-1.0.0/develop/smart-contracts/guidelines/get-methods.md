# Get Methods

Some smart contracts are expected to implement certain well-defined get-methods.

[//]: # (![image]&#40;/img/docs/Screenshot_4.png&#41;)

For instance, any subdomain resolver smart contract for TON DNS is expected to implement the get-method `dnsresolve`. Custom smart contracts may define their specific get-methods. 

:::danger 
Our only general recommendation at this point is to implement the get-method `seqno` (without parameters) that returns the current `seqno` of a smart contract that uses sequence numbers to prevent replay attacks related to inbound external methods, whenever such a method makes sense.
:::



