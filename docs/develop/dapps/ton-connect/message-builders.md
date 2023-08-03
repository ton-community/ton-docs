# Preparing Messages

While using TON Connect you should prepare Bag of Cells for Payload for various transactions. Here you can find most relatable examples for payload for using it in TON Connect SDKs.

:::warning
Page in development.
:::


## Regular TON Transfer
As ton-connect SDK is already wrapper above messages, we have no problem to prepare regular Transfer. For the following actions we should specify Payload(Message Body)


## TON Connect React UI

Suppose, we specified simple hook built with ton-connect/react-ui useJettonContract.ts, which defines mint request from our application:


```ts
import { useEffect, useState } from "react";
import { Address, fromNano, OpenedContract, toNano } from "ton-core";
import {Mint, SampleJetton} from "../../build/SampleJetton/tact_SampleJetton";
import {JettonDefaultWallet} from "../../build/SampleJetton/tact_JettonDefaultWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export function useJettonContract() {
    const {client} = useTonClient()
    const {wallet, sender} = useTonConnect()
    const [balance, setBalance] = useState<string | null>()

    const jettonContract = useAsyncInitialize(async()=>{
        if(!client || !wallet) return;

        const contract = SampleJetton.fromAddress(Address.parse("EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y"))

        return client.open(contract) as OpenedContract<SampleJetton>
    }, [client, wallet])

    const jettonWalletContract = useAsyncInitialize(async()=>{
        if(!jettonContract || !client) return;

        const jettonWalletAddress = await jettonContract.getGetWalletAddress(
            Address.parse(Address.parse(wallet!).toString())
        )

        return client.open(JettonDefaultWallet.fromAddress(jettonWalletAddress))
    }, [jettonContract, client])

    useEffect(()=>{
        async function getBalance() {
            if(!jettonWalletContract) return
            setBalance(null)
            const balance = (await jettonWalletContract.getGetWalletData()).balance
            setBalance(fromNano(balance))
            await sleep(5000)
            getBalance()
        }

        getBalance()

    }, [jettonWalletContract])

    return {
        jettonWalletAddress: jettonWalletContract?.address.toString(),
        balance: balance,
        mint: () => {
            const message: Mint = {
                $$type: "Mint",
                amount: 150n
            }

            jettonContract?.send(sender, {
                value: toNano("0.05")
            }, message)
        }
    }
}
```

Here our payload defined by sending `send()` message with following specs:
`destination` - Address, JettonWallet address, that defined based on JettonMaser and Wallet contracts
`balance` - Integer, amount of Toncoin for gas payments in nanotons.
balance`

address, amount and payload defines by the following

```ts "title" = "destination address"


```


### Jettons

#### Transfer Jetton



### NFTs 

#### Deploy NFT

#### Sale NFT

