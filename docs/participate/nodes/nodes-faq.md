# Nodes FAQ


This section contains answers to the most frequently asked questions about running a nodes.

### What does Error 651 mean?

`[Error : 651 : no nodes]` indicates that your node is unable to locate another node within the TON Blockchain.

Sometimes, this process can take up to 24 hours. However, if you've been receiving this error for several days, that means that your node cannot synchronize via current network connection.

:::tip Solution
You need to check the firewall settings, including any NAT settings if they exist. 

It should allow incoming connections on one specific port and outgoing connections from any port.
:::

### Validator console is not settings

If you see this error this means that you run `mytonctrl` not from the user you've installed it.

:::tip Solution
Run `mytonctrl` from the user you've installed it.
:::

### What does block is not applied mean?

Sometimes we get `block is not applied` or `block is not ready` for various request - is this normal?

This is normal, typically this means you tried to retrieve block, wich does not reach the node you asked.

:::tip Solution
Retry request up to three times.
:::