# Prepare Messages

While using TON Connect you should prepare Bag of Cells for Payload for various transactions. Here you can find most relatable examples for payload for using it in TON Connect SDKs.

## Regular TON Transfer
As ton-connect SDK is already wrapper above messages, we have no problem to prepare regular Transfer. For the following actions we should specify Payload(Message Body)


## TON Connect React UI

Suppose, we specified simple hook built with ton-connect/react-ui

```ts
import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { SenderArguments } from "@ton/core";
import { Sender } from "@ton/core";

export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: CHAIN | null;
} {
    const [tonConnectUI] = useTonConnectUI()
    const wallet = useTonWallet()

    return {
        sender: {
            send: async (args: SenderArguments) => {
              tonConnectUI.sendTransaction({
                messages: [
                  {
                    address: args.to.toString(),
                    amount: args.value.toString(),
                    payload: args.body?.toBoc().toString("base64"),
                  },
                ],
                validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
              });
            },
            address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined
          }, 

        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null
        
    }
}
```

### Jettons

#### Transfer Jetton



### NFTs 

#### Deploy NFT

#### Sale NFT

