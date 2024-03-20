# TON存储常见问题解答

## 如何将TON域名分配给TON存储的文件包

1. [上传](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)文件包到网络并获取Bag ID。

2. 在您的电脑上打开Google Chrome浏览器。

3. 为Google Chrome安装[TON扩展](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)。
   您也可以使用[MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)。

4. 打开扩展，点击“导入钱包”，使用恢复短语导入拥有该域名的钱包。

5. 现在在https://dns.ton.org打开您的域名并点击“编辑”。

6. 将您的Bag ID复制到“存储”字段并点击“保存”。

## 如何在TON存储中托管静态TON网站

1. [创建](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)一个文件夹的包，其中包含网站文件，将其上传到网络并获取Bag ID。文件夹必须包含`index.html`文件。

2. 在您的电脑上打开Google Chrome浏览器。

3. 为Google Chrome安装[TON扩展](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd)。
   您也可以使用[MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc)。

4. 打开扩展，点击“导入钱包”，使用恢复短语导入拥有该域名的钱包。

5. 现在在https://dns.ton.org打开您的域名并点击“编辑”。

6. 将您的Bag ID复制到“网站”字段，选中“在TON存储中托管”复选框并点击“保存”。

## 如何将TON NFT内容迁移到TON存储

如果您为您的收藏使用了[标准NFT智能合约](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc)，您需要从收藏所有者的钱包向收藏智能合约发送[消息](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132)，带有新的URL前缀。

例如，如果URL前缀曾经是`https://mysite/my_collection/`，新前缀将是`tonstorage://my_bag_id/`。

## 如何将TON域名分配给TON存储的文件包（低层级）

您需要将以下值分配给TON域的sha256("storage") DNS记录：

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## 如何在TON存储中托管静态TON网站（低层级）

[创建](/participate/ton-storage/storage-daemon#creating-a-bag-of-files)一个文件夹的包，其中包含网站文件，将其上传到网络并获取Bag ID。文件夹必须包含`index.html`文件。

您需要将以下值分配给TON域的sha256("site") DNS记录：

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```
