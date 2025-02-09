//sending jetton new code to add as exemple most people in telegram struggle with it (TON dev en):

const TonWeb = require("tonweb");
const tonMnemonic = require("tonweb-mnemonic");
const { Address, TupleBuilder, TonClient, toNano } = require("@ton/ton");
const { getHttpEndpoint } = require("@orbs-network/ton-access");


// Initialize TonWeb
const tonweb = new TonWeb();

// Function to execute a Jetton transfer
const executeTransaction = async (
    token_address: string,
    recipient_address: string,
    amount: string, // Amount should be a string (TON utils require strings)
    mnemonic_array: string[],
    comment:string,
): Promise<void> => {
    try {
     
        const endpoint = await getHttpEndpoint();
        const client = new TonClient({ endpoint });

      
        const Token_address = Address.parse(token_address);

      
        const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic_array);

        // Initialize Wallet V3R2 Make sure in Tonkeper of the wallet version
        const WalletClass = tonweb.wallet.all["v3R2"];
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey,
            wc: 0, // Workchain 0 for mainnet
        });

        const address = await wallet.getAddress();
        const walletAddress = Address.parse(address.toString());

        //  Get the wallet sequence number
        const seqno = await wallet.methods.seqno().call();
        console.log("Current seqno:", seqno);

        const builder = new TupleBuilder();
        builder.writeAddress(walletAddress);
        const args = builder.build();

        // Get the Jetton wallet address
        const response = await client.runMethod(Token_address, "get_wallet_address", args);
        const JETTON_WALLET_ADDRESS = response.stack.readAddressOpt();

        if (!JETTON_WALLET_ADDRESS) {
            throw new Error("Failed to retrieve Jetton wallet address.");
        }

        
        const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
            address: JETTON_WALLET_ADDRESS.toString(),
        });

        // Execute Jetton transfer
        const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode(comment)]);
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: new TonWeb.utils.Address(JETTON_WALLET_ADDRESS.toString()), 
            amount: tonweb.utils.toNano('0.05'), // 
            seqno: seqno,
            payload: await jettonWallet.createTransferBody({
                jettonAmount: tonweb.utils.toNano(amount), 
                toAddress: new TonWeb.utils.Address(recipient_address), 
                forwardAmount: tonweb.utils.toNano('0.00001'), 
                 orwardPayload: comment,
                responseAddress: new TonWeb.utils.Address(walletAddress.toString()) 
            }),
            sendMode: 3,
        }).send();
        console.log("Transaction executed successfully!");
    } catch (error) {
        console.error("Transaction failed:", error);
    }
};

const token_address = "EQCIiZ6b5fYSHLfCCAqi4KsIeqQAD3H_HSP-V5r4OUgTEuAs"; // Token master contract 
const recipient_address = "UQAisQIXtyaEfWfXyIMOAffNoKDLnUgejb1XdLNFH7mNDTVq"; // Recipient's wallet
const amount = "500"; // Jetton amount in basic units
const mnemonic_array = [word 1, word 2, word 3, word 4, word 5, word 6, ...];// 24 word mnemonic

// Execute the transfer
executeTransaction(token_address, recipient_address, amount, mnemonic_array, comment);
