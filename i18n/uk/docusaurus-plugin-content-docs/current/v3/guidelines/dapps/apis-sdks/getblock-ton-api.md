import Feedback from '@site/src/components/Feedback';

# HTTP API by GetBlock

:::tip TON infrastructure status

- [status.toncenter](https://status.toncenter.com/) - Provides various statistics of node activity in the last hour.
- [Tonstat.us](https://tonstat.us/) - A real-time Grafana dashboard that updates every 5 minutes.
  :::

This guide covers essential steps in acquiring and using private RPC endpoints by GetBlock to access TON Blockchain.

:::info
[GetBlock](https://getblock.io/) is a Web3 infrastructure provider that offers HTTP-based API endpoints for clients to interact with multiple blockchain networks, including TON.
:::

## How to access TON Blockchain endpoints

To start using GetBlock’s endpoints, users need to log in to their accounts, and retrieve a TON endpoint URL. Follow these instructions:

### 1. Create a GetBlock account

Visit the GetBlock website and click on the "Get Started for Free" button. Sign up using your email address or by connecting your MetaMask wallet.

![GetBlock.io_main_page](/img/docs/getblock-img/unnamed-2.png?=RAW)

### 2. Select TON Blockchain

After signing in, go to the "My Endpoints" section. Choose TON from the "Protocols" dropdown menu and select the desired network and API type (JSON-RPC or JSON-RPC(v2)).

![GetBlock_account__dashboard](/img/docs/getblock-img/unnamed-4.png)

### 3. Generate your endpoint URL

Click the **Get** button to generate your TON Blockchain endpoint URL. The structure of the endpoint will be: `https://go.getblock.io/[ACCESS TOKEN]/`.

Access tokens act as unique identifiers for your requests, eliminating the need for separate API keys or authorization headers.

Users have the flexibility to generate multiple endpoints, roll tokens if compromised, or delete unused endpoints.

![GetBlock_account_endpoints](/img/docs/getblock-img/unnamed-3.png)

Now, you can use these URLs to interact with TON Blockchain, query data, send transactions, and build decentralized applications without the hassle of infrastructure setup and maintenance.

### Free requests and user limits

Each registered user receives 40,000 free requests per day, with a cap of 60 requests per second (RPS). This balance is renewed daily and can be used for any supported blockchain.

### Shared nodes

- Entry-level opportunity where same nodes are utilized by several clients simultaneously;
- Rate limit increased to 200 RPS;
- Well-suited for individual use or for applications that have lower transaction volumes and resource requirements compared to fully-scaled production applications;
- A more affordable option for individual developers or small teams with limited budgets.

Shared nodes provide a cost-effective solution for accessing TON Blockchain infrastructure without the need for significant upfront investment or commitment.

As developers scale their applications and require additional resources, they can easily upgrade their subscription plans or transition to dedicated nodes if necessary.

### Dedicated nodes

- One node is exclusively allocated to a single client;
- No request limits;
- Opens access to archive nodes, a variety of server locations, and custom settings;
- Guarantees premium-level service and support to clients.

This is a next-level solution for developers and decentralized applications (dApps) that require enhanced throughput, higher speed of node connection, and guaranteed resources as they scale.

## How to use TON HTTP API by GetBlock

In this section, we delve into the practical usage of the TON HTTP API provided by GetBlock. We explore the examples to showcase how to effectively utilize the generated endpoints for your blockchain interactions.

### Examples of common API calls

You can use the `/getAddressBalance` method to get the balance for a specific TON address:

```
curl --location --request GET 'https://go.getblock.io/[ACCESS-TOKEN]/getAddressBalance?address=EQDXZ2c5LnA12Eum-DlguTmfYkMOvNeFCh4rBD0tgmwjcFI-' \    
--header 'Content-Type: application/json' 
```

Make sure to replace `ACCESS-TOKEN` with your actual access token provided by GetBlock.

This will output the balance in nanotons.

![getAddressBalance_response_on_TON_Blockchain](/img/docs/getblock-img/unnamed-2.png)

Some other available methods to query the TON blockchain:

| # | Метод | Кінцева точка      | Опис                                                                                                                    |
| - | ----- | ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1 | GET   | getAddressState    | Returns the current state of a specified address (uninitialized, active, or frozen). |
| 2 | GET   | getMasterchainInfo | Fetches the state of the masterchain.                                                                   |
| 3 | GET   | getTokenData       | Retrieves details about an NFT or jetton associated with the address.                                   |
| 4 | GET   | packAddress        | Converts a TON address from raw format to human-readable format.                                        |
| 5 | POST  | sendBoc            | Sends serialized BOC files with external messages for blockchain execution.                             |

For a comprehensive list of methods and detailed API documentation, please refer to GetBlock's [documentation](https://getblock.io/docs/ton/json-rpc/ton_jsonrpc/).

### Deploying smart contracts

Developers can utilize the TON library to deploy and interact with contracts. The library will initialize a client to connect to the network via the GetBlock HTTP API endpoints.

![Image from TON Blueprint IDE](/img/docs/getblock-img/unnamed-6.png)

By following this guide, developers can easily access TON Blockchain using GetBlock's infrastructure. Whether you're working on decentralized applications (dApps) or simply querying data, GetBlock simplifies the process by offering ready-to-use HTTP API endpoints with various features.

Feel free to learn more at the website or drop a line to GetBlock’s support via live chat, Telegram, or a website form.

<Feedback />

