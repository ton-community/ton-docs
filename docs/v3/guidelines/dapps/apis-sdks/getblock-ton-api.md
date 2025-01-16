# TON API by GetBlock

:::tip TON Infrastructure Status
* [status.toncenter](https://status.toncenter.com/) - various statistics of nodes activity during the last hour.
* [Tonstat.us](https://tonstat.us/) - a real-time Grafana, updated every 5 minutes.
  :::

This guide will cover essential steps in acquiring and using private RPC endpoints by GetBlock to access the TON blockchain.

:::info
[GetBlock](https://getblock.io/) is a Web3 infrastructure provider, offers HTTP-based API endpoints for clients to interact with various blockchain networks, including TON.
:::

## How to Access TON Blockchain Endpoints
To start using GetBlock’s endpoints, users are required to log in to their account, retrieve a TON endpoint URL, and they're good to go. Follow along for more detailed guidance.

### 1. Create a GetBlock Account
Visit the GetBlock [website](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) and locate the “Get Started for Free” button on the main page. Sign up for an account with your email address or by connecting a MetaMask wallet.

![**GetBlock.io_main_page**](/img/docs/getblock-img/unnamed-2.png?=RAW)


### 2. Select the TON Blockchain
After signing in, you’ll be redirected to the dashboard. Locate the section titled "My Endpoints" and select "TON" under the "Protocols" dropdown menu.

Choose the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![**GetBlock_account__dashboard**](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate Your Endpoint URL
Click on the “Get” button to generate your TON blockchain endpoint URL.

All endpoints within the GetBlock API follow a consistent structure: `https://go.getblock.io/[ACCESS TOKEN]/`.

These access tokens serve as unique identifiers for each user or application and contain information necessary for routing the request to appropriate endpoints without revealing sensitive details. It essentially replaces the need for separate authorization headers or API keys.

Users have the flexibility to generate multiple endpoints, roll tokens if compromised, or delete unused endpoints.

![**GetBlock_account_endpoints**](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with the TON blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free Requests and User Limits

Please note that every registered GetBlock user receives 40,000 free requests capped at 60 RPS (Requests per Second). The request balance is renewed daily and can be utilized on any shared endpoints across supported blockchains.

For enhanced features and capabilities, users have the option to explore paid options, which will be outlined below.

GetBlock.io offers two types of plans: Shared Nodes and Dedicated Nodes. Clients can choose the tariff based on their requirements and budget.

### Shared Nodes

- Entry-level opportunity where same nodes are utilized by several clients simultaneously;
- Rate limit increased to 200 RPS;
- Well-suited for individual use or for applications that have lower transaction volumes and resource requirements compared to fully-scaled production applications;
- A more affordable option for individual developers or small teams with limited budgets.

Shared nodes provide a cost-effective solution for accessing TON blockchain infrastructure without the need for significant upfront investment or commitment.

As developers scale their applications and require additional resources, they can easily upgrade their subscription plans or transition to dedicated nodes if necessary.

### Dedicated Nodes

- One node is exclusively allocated to a single client;
  No request limits;
- Opens access to archive nodes, a variety of server locations, and custom settings;
- Guarantees premium-level service and support to clients.

This is a next-level solution for developers and decentralized applications (dApps) that require enhanced throughput, higher speed of node connection, and guaranteed resources as they scale.

## How to use TON HTTP API by GetBlock

In this section, we'll delve into the practical usage of the TON HTTP API provided by GetBlock. We'll explore examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### Examples of common API calls

Let's begin with a simple example using the ‘/getAddressBalance’ method to retrieve the balance for a specific address using the curl command.

    curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \
    
    --header 'Content-Type: application/json'

Make sure to replace `ACCESS-TOKEN` with your actual access token provided by GetBlock.

This will output the balance in nanotons.

![**getAddressBalance_response_on_TON_blockchain**](/img/docs/getblock-img/unnamed-2.png)

Some other available methods to query the TON blockchain:

| # | Method | Endpoint           | Description                                                                                                |
|---|--------|--------------------|------------------------------------------------------------------------------------------------------------|
| 1 | GET    | getAddressState    | returns the current status (uninitialized, active, or frozen) of a specified address on the TON blockchain |
| 2 | GET    | getMasterchainInfo | Fetches information about the state of the masterchain                                                     |
| 3 | GET    | getTokenData       | Retrieves details about an NFT or Jetton associated with a specified TON account                           |
| 4 | GET    | packAddress        | Converts a TON address from its raw format to a human-readable format                                      |
| 5 | POST   | sendBoc            | Sends serialized BOC files along with external messages to the blockchain for execution                    |

Please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/) for a comprehensive API reference with examples and a list of additional methods.

### Deploying smart contracts

Developers can utilize the same endpoint URLs to seamlessly deploy contracts onto the TON blockchain using the TON library.

The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![**Image from TON Blueprint IDE**](/img/docs/getblock-img/unnamed-6.png)

This tutorial should provide a comprehensive guide for developers looking to utilize GetBlock's API with the TON Blockchain effectively.

Feel free to learn more from the [website](https://getblock.io/?utm_source=external&utm_medium=article&utm_campaign=ton_docs) or drop a line to GetBlock’s support via live chat, [Telegram](https://t.me/GetBlock_Support_Bot), or a website form.

