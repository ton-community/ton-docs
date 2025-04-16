# FAQ по TON Storage

:::warning
Эта страница переведена сообществом на русский язык, но нуждается в улучшениях. Если вы хотите принять участие в переводе свяжитесь с [@alexgton](https://t.me/alexgton).
:::

## Как назначить домен TON пакету файлов TON Storage

1. [Загрузите](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет файлов в сеть и получите идентификатор Bag ID

2. Откройте браузер Google Chrome на своем компьютере.

3. Установите [расширение TON](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) для Google Chrome.
   Вы также можете использовать [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).

4. Откройте расширение, нажмите «Import wallet» и импортируйте кошелек, которому принадлежит домен, используя фразу восстановления.

5. Теперь откройте Ваш домен на https://dns.ton.org и нажмите «Manage domain».

6. Скопируйте Bag ID в поле «TON Storage» и нажмите «Save».

## Как разместить статический TON-сайт в TON Storage

1. [Создайте](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет из папки с файлами сайта, загрузите его в сеть и получите Bag ID. Папка должна содержать файл `index.html`.

2. Откройте браузер Google Chrome на своем компьютере.

3. Установите [расширение TON](https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd) для Google Chrome.
   Вы также можете использовать [MyTonWallet](https://chrome.google.com/webstore/detail/mytonwallet/fldfpgipfncgndfolcbkdeeknbbbnhcc).

4. Откройте расширение, нажмите "Import wallet" и импортируйте кошелек, которому принадлежит домен, используя фразу восстановления.

5. Теперь откройте ваш домен на https://dns.ton.org и нажмите «Manage domain».

6. Скопируйте ID вашего пакета в поле «Site», установите флажок «Host in TON Storage» и нажмите «Save».

## Как перенести содержимое TON NFT в TON Storage

Если вы использовали [стандартный смарт-контракт NFT](https://github.com/ton-blockchain/token-contract/blob/main/nft/nft-collection-editable.fc) для своей коллекции, вам необходимо отправить [сообщение](https://github.com/ton-blockchain/token-contract/blob/2d411595a4f25fba43997a2e140a203c140c728a/nft/nft-collection-editable.fc#L132) смарт-контракту коллекции из кошелька владельца коллекции с новым префиксом URL.

Например, если раньше префикс url был `https://mysite/my_collection/`, то новый префикс будет `tonstorage://my_bag_id/`.

## Как назначить домен TON пакету TON Storage (низкий уровень)

Вам нужно присвоить следующее значение sha256("storage") DNS-записи вашего домена TON:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

## Как разместить статический сайт TON в TON Storage (низкий уровень)

[Создайте](/v3/guidelines/web3/ton-storage/storage-daemon#creating-a-bag-of-files) пакет из папки с файлами сайта, загрузите его в сеть и получите Bag ID. Папка должна содержать файл `index.html`.

Вам нужно присвоить следующее значение sha256("site") DNS-записи вашего домена TON:

```
dns_storage_address#7473 bag_id:uint256 = DNSRecord;
```

