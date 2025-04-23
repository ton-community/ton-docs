import Feedback from '@site/src/components/Feedback';

# TON Storage FAQ

## How to assign a TON domain to a TON Storage bag 

1. [Upload your bag of files]((/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files))to the network and copy the bag ID. 
2. Open Google Chrome on your computer. 
3. Install a TON extension:
   - [TON Wallet](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)
   - or [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)
4. Open the extension, click "Import wallet", and import the wallet that owns the domain using your recovery phrase. 
5. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit". 
6. Paste the bag ID into the "Storage" field and click "Save".

## How to host static TON site in TON Storage

1. [Create a bag](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) from the folder containing your static website. 
2. The folder must contain an `index.html` file. 
3. Upload the bag to the network and copy the bag ID. 
4. Open Google Chrome and install a [TON extension](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) or [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).  
5. Import the wallet that owns the domain using your recovery phrase. 
6. Go to [dns.ton.org](https://dns.ton.org), open your domain, and click "Edit". 
7. Paste the bag ID into the "Site" field, select "Host in TON Storage", and click "Save".

## How to migrate TON NFT content to TON Storage

If you're using a [standard NFT contract](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc), update the content prefix by sending a [message](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132) to your NFT collection smart contract from the collection owner's wallet.

- **Old URL prefix example:** `https://mysite/my_collection/`
- **New URL prefix format:** `tonstorage://my_bag_id/`.


## How to assign a TON domain to a TON Storage bag (low-level)

You need to assign the following value to the sha256("storage") DNS Record of your TON domain:
```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## How to host static TON site in TON Storage (low-level)


To host a static site via TON Storage directly:
- [Create a bag](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) from your website folder. The folder must include `index.html`. 
- Assign the following value to the DNS record with key sha256("site"):

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```


<Feedback />

