import Feedback from '@site/src/components/Feedback';

# Creating the TON Connect manifest for DApp

## Manifest definition

Every app needs a manifest to pass meta information to the wallet.

每个应用都需要有它的 manifest 文件，用以向钱包传递元信息。Manifest 是一个名为 `tonconnect-manifest.json` 的 JSON 文件，遵循以下格式：

```json
{
    "url": "<app-url>",                        // required
    "name": "<app-name>",                      // required
    "iconUrl": "<app-icon-url>",               // required
    "termsOfUseUrl": "<terms-of-use-url>",     // optional
    "privacyPolicyUrl": "<privacy-policy-url>" // optional
}
```

| 字段                 | 要求 | 描述                                                                                                                                                                                                                                                                                                              |
| ------------------ | -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`              | 必需 | `url` defines the app URL.  It will be used to open the DApp after clicking its icon in the wallet. 应用 URL。将被用作 DApp 标识符。点击钱包中的图标后，将用来打开 DApp。推荐传递不带关闭斜杠的 url，例如 'https://mydapp.com' 而非 'https://mydapp.com/'。 |
| `name`             | 必需 | `name` defines the app name. Typically simple word. Shouldn't be used as identifier.                                                                                                                                                                            |
| `iconUrl`          | 必需 | `iconUrl` defines the URL to the app icon. It must be in `PNG` or `ICO` format. `SVG` icons are not supported. 应用图标的 URL。必须是 PNG、ICO 等格式，不支持 SVG 图标。最好传递指向 180x180px PNG 图标的 url。                                                                               |
| `termsOfUseUrl`    | 可选 | Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                                                                                                               |
| `privacyPolicyUrl` | 可选 | Optional for usual apps, but required for the apps placed in the Tonkeeper recommended apps list.                                                                                                                                                                                               |

:::info
The original definition is [here](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest).
:::

### 示例

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```

## 最佳实践

- 最佳实践是将 manifest 放置在您应用和库的根目录，例如 `https://myapp.com/tonconnect-manifest.json`。这样可以让钱包更好地处理您的应用，并提升与您应用相关的用户体验。 It allows the wallet to handle your app better and improve the UX connected to your app.
- The fields `url`, `iconUrl`, `termsOfUseUrl`, `privacyPolicyUrl`: must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- The manifest must be publicly accessible from the internet and should be requestable from any origin without CORS restrictions.
- 确保 `manifest.json` 文件通过其 URL 可以被 GET 访问。

## See also

- [TON Connect GitHub - App manifest](https://github.com/ton-blockchain/ton-connect/blob/main/requests-responses.md#app-manifest)

<Feedback />

