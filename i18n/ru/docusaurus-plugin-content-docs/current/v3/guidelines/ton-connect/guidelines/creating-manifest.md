import Feedback from '@site/src/components/Feedback';

# Creating the TON Connect manifest for DApp

## Manifest definition

Каждому приложению нужен манифест для передачи метаданных в кошелек.

Манифест — это файл JSON с именем `tonconnect-manifest.json` следующего формата:

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

| Поле               | Требование  | Описание                                                                                                                                                                                                                                                                |
| ------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | обязательно | URL приложения.  Будет использоваться для открытия DApp после нажатия на его значок в кошельке. Рекомендуется передавать URL без закрывающей косой черты, например, `https://mydapp.com` вместо `https://mydapp.com/`.  |
| `name`             | обязательно | Имя приложения. Typically simple word. Может быть простым, не будет использоваться как идентификатор.                                                                                                                   |
| `iconUrl`          | обязательно | URL значка приложения. Должен быть в формате PNG, ICO, .... Иконки SVG не поддерживаются. Идеально передавать URL иконку PNG размером 180x180 пикселей. |
| `termsOfUseUrl`    | optional    | Необязательно для обычных приложений, но обязательно для приложений, которые размещены в списке рекомендованных приложений Tonkeeper.                                                                                                                   |
| `privacyPolicyUrl` | optional    | Необязательно для обычных приложений, но обязательно для приложений, которые размещены в списке рекомендованных приложений Tonkeeper.                                                                                                                   |

:::info
The original definition is [here](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest).
:::

### Пример

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

## Best practices

- Лучшей практикой является разместить манифест в корне приложения и репозитория, например. `https://myapp.com/tonconnect-manifest.json`. Это позволяет кошельку лучше обрабатывать ваше приложение и улучшать пользовательский опыт, связанный с вашим приложением.
- The fields `url`, `iconUrl`, `termsOfUseUrl`, `privacyPolicyUrl`: must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- The manifest must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- Убедитесь, что файл `manifest.json` доступен через GET-запрос по его URL

## See also

- [TON Connect GitHub - App manifest](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest)

<Feedback />

