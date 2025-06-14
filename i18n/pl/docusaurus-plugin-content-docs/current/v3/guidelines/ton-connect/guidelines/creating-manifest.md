import Feedback from '@site/src/components/Feedback';

# Creating the TON Connect manifest for DApp

## Manifest definition

Every app needs a manifest to pass meta information to the wallet.

The manifest is a JSON file named `tonconnect-manifest.json` and has the following format:

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

| Field              | Requirement | Description                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | required    | `url` defines the app URL.  It will be used to open the DApp after clicking its icon in the wallet. It is recommended to pass the URL without closing the slash, e.g., 'https://mydapp.com' instead of 'https://mydapp.com/'. |
| `name`             | required    | `name` defines the app name. Typically simple word. Shouldn't be used as identifier.                                                                                                                                                                                                                                          |
| `iconUrl`          | required    | `iconUrl` defines the URL to the app icon. It must be in `PNG` or `ICO` format. `SVG` icons are not supported. Perfectly pass the URL to a 180x180px PNG icon.                                                                                                                                                |
| `termsOfUseUrl`    | optional    | Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                                                                                                                                                                             |
| `privacyPolicyUrl` | optional    | Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                                                                                                                                                                             |

:::info
The original definition is [here](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest).
:::

### Example

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

## Best practices

- Place the manifest in the root of your app and repository, for example: `https://myapp.com/tonconnect-manifest.json`. It allows the wallet to handle your app better and improve the UX connected to your app.
- The fields `url`, `iconUrl`, `termsOfUseUrl`, `privacyPolicyUrl`: must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- The manifest must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- Ensure that the `manifest.json` file is accessible via a GET request at its URL

## See also

- [TON Connect GitHub - App manifest](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest)

<Feedback />

