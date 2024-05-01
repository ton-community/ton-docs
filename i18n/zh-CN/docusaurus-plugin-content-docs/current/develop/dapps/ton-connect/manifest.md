# 创建 manifest.json

每个应用都需要有它的 manifest 文件，用以向钱包传递元信息。Manifest 是一个名为 `tonconnect-manifest.json` 的 JSON 文件，遵循以下格式：

```json
{
    "url": "<app-url>",                        // 必填
    "name": "<app-name>",                      // 必填
    "iconUrl": "<app-icon-url>",               // 必填
    "termsOfUseUrl": "<terms-of-use-url>",     // 可选
    "privacyPolicyUrl": "<privacy-policy-url>" // 可选
}
```

## 示例

您可以在下面找到一个 manifest 的示例：

```json
{
    "url": "https://ton.vote",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
}
```
## 最佳实践

- 最佳实践是将 manifest 放置在您应用和库的根目录，例如 `https://myapp.com/tonconnect-manifest.json`。这样可以让钱包更好地处理您的应用，并提升与您应用相关的用户体验。
- 确保 `manifest.json` 文件通过其 URL 可以被 GET 访问。

## 字段描述
|字段|要求|描述|
|---|---|---|
|`url` |必填| 应用 URL。将被用作 DApp 标识符。点击钱包中的图标后，将用来打开 DApp。推荐传递不带关闭斜杠的 url，例如 'https://mydapp.com' 而非 'https://mydapp.com/'。|
| `name`|必填| 应用名称。可以简单，不会被用作标识符。|
| `iconUrl`| 必填 | 应用图标的 URL。必须是 PNG、ICO 等格式，不支持 SVG 图标。最好传递指向 180x180px PNG 图标的 url。|
| `termsOfUseUrl` |可选| 使用条款文档的 url。普通应用为可选，但对于放在 Tonkeeper 推荐应用列表中的应用则为必填。|
| `privacyPolicyUrl` | 可选 | 隐私政策文档的 url。普通应用为可选，但对于放在 Tonkeeper 推荐应用列表中的应用则为必填。|