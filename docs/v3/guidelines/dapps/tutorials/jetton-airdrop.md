import Feedback from '@site/src/components/Feedback';

import Player from '@site/src/components/player'

# How to launch a jetton airdrop

## Overview

This article describes ready-to-use methods for mass token distribution on the TON Blockchain.

## TONAPI Airdrop

<Player url="https://www.youtube.com/watch?v=8HHXykOyNys" />

- [Tool](https://tonapi.io/airdrop?utm_source=web&utm_medium=tondocs&utm_campaign=tondocs_1)

- [Documentation](https://docs.tonconsole.com/tonconsole/jettons/airdrop)

### About the instrument

- Throughput: up to 10 million claims.
- Optimized for the TON blockchain.
- Earn per claim – the organizer sets the price.
- Developed by the Tonkeeper team. Check out other products:
    - Non-custodial wallet [Tonkeeper](/v3/concepts/dive-into-ton/ton-ecosystem/wallet-apps#tonkeeper);
    - [TON Connect](/v3/guidelines/ton-connect/overview);
    - [Tonviewer](/v3/concepts/dive-into-ton/ton-ecosystem/explorers-in-ton#tonviewer);
    - [TON API](https://tonapi.io/).

### Example of organizing an airdrop

1. Collect a list of eligible user wallet addresses within your DApp;
2. Enter the airdrop details in TONAPI Airdrop: token address, claim fee;
3. Upload the wallet list;
4. Enable claims.

On the client side of the DApp, implement a request to our API (details in the [documentation](https://docs.tonconsole.com/tonconsole/jettons/airdrop#api-for-dapp-interaction)). If a positive response is received, the user will be prompted to claim the token.

## See also

[Learn more about TON API](https://tonapi.io?utm_source=web&utm_medium=tondocs&utm_campaign=tondocs_2)
<Feedback />

