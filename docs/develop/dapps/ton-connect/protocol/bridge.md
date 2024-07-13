# Bridge API

Bridge is a transport mechanism to deliver messages from the app to the wallet and vice versa.

* **Bridge is maintained by the wallet provider**. App developers do not have to choose or build a bridge. Each wallet’s bridge is listed in the [wallets-list](https://github.com/ton-blockchain/wallets-list) config.
* **Messages are end-to-end encrypted.** Bridge does not see the contents or long-term identifiers of the app or wallet.
* **Communication is symmetrical.** Bridge does not distinguish between apps and wallets: both are simply clients.
* Bridge keeps separate queues of messages for each recipient’s **Client ID**.

Bridge comes in two flavors:

- [HTTP Bridge](#http-bridge): for the external apps and services.
- [JS Bridge](#js-bridge): for apps opened within the wallet; or when the wallet is a browser extension.

## HTTP Bridge

Client with ID **A** connects to the bridge to listen to incoming requests.

**Client ID is semi-private:** apps and wallets are not supposed to share their IDs with other entities to avoid having their messages removed unexpectedly.

**Client can subscribe on few Client IDs** - in this case it should enumerate IDs separated with commas. For example: `?client_id=<A1>,<A2>,<A3>`

```tsx
request
    GET /events?client_id=<to_hex_str(A)>

    Accept: text/event-stream
```

**Subscribing to the bridge second (any other) time**

```tsx
request
    GET /events?client_id=<to_hex_str(A)>&last_event_id=<lastEventId>

    Accept: text/event-stream
```

**lastEventId** – the eventId of the last SSE event wallet got over the bridge. In this case wallet will fetch all the events which happened after the last connection.

Sending message from client A to client B. Bridge returns error if ttl is too high.

```tsx
request
    POST /message?client_id=<to_hex_str(A)>?to=<to_hex_str(B)>&ttl=300&topic=<sendTransaction|signData>

    body: <base64_encoded_message>
```


The `topic` [optional] query parameter can be used by the bridge to deliver the push notification to the wallet. If the parameter is given, it must correspond to the RPC method called inside the encrypted `message`.

Bridge buffers messages up to TTL (in secs), but removes them as soon as the recipient receives the message.

If the TTL exceeds the hard limit of the bridge server, it should respond with HTTP 400. Bridges should support at least 300 seconds TTL.

When the bridge receives a message `base64_encoded_message` from client `A` addressed to client `B`, it generates a message `BridgeMessage`:

```js
{
  "from": <to_hex_str(A)>,
  "message": <base64_encoded_message>
}
```

and sends it to the client B via SSE connection
```js
resB.write(BridgeMessage)
```

### Heartbeat

To keep the connection, bridge server should periodically send a "heartbeat" message to the SSE channel. Client should ignore such messages.
So, the bridge heartbeat message is a string with word `heartbeat`.


## Universal link

When the app initiates the connection it sends it directly to the wallet via the QR code or a universal link.

```bash
https://<wallet-universal-url>?
                               v=2&
                               id=<to_hex_str(A)>&
                               r=<urlsafe(json.stringify(ConnectRequest))>&
                               ret=back
```

Parameter **v** specifies the protocol version. Unsupported versions are not accepted by the wallets.

Parameter **id** specifies app’s Client ID encoded as hex (without '0x' prefix).

Parameter **r** specifies URL-safe json [ConnectRequest](/develop/dapps/ton-connect/protocol/requests-responses#initiating-connection).

Parameter **ret** (optional) specifies return strategy for the deeplink when user signs/declines the request.
- 'back' (default) means return to the app which initialized deeplink jump (e.g. browser, native app, ...),
- 'none' means no jumps after user action;
- a URL: wallet will open this URL after completing the user's action. Note, that you shouldn't pass your app's URL if it is a webpage. This option should be used for native apps to work around possible OS-specific issues with `'back'` option.

`ret` parameter should be supported for empty deeplinks -- it might be used to specify the wallet behavior after other actions confirmation (send transaction, sign raw, ...).
```bash
https://<wallet-universal-url>?ret=back
```


The link may be embedded in a QR code or clicked directly.

The initial request is unencrypted because (1) there is no personal data being communicated yet, (2) app does not even know the identity of the wallet.

### Unified deeplink `tc`
In addition to its own universal link, the wallet must support the unified deeplink.

This allows applications to create a single qr code, which can be used to connect to any wallet.

More specifically, the wallet must support `tc://` deeplink as well as its own `<wallet-universal-url>`.

Therefore, the following `connect request` must be processed by the wallet:

```bash
tc://?
       v=2&
       id=<to_hex_str(A)>&
       r=<urlsafe(json.stringify(ConnectRequest))>&
       ret=back
```


## JS bridge

Used by the embedded apps via the injected binding `window.<wallet-js-bridge-key>.tonconnect`.

`wallet-js-bridge-key` can be specified in the [wallets list](https://github.com/ton-blockchain/wallets-list)

JS bridge runs on the same device as the wallet and the app, so communication is not encrypted.

The app works directly with plaintext requests and responses, without session keys and encryption.

```tsx
interface TonConnectBridge {
    deviceInfo: DeviceInfo; // see Requests/Responses spec
    walletInfo?: WalletInfo;
    protocolVersion: number; // max supported Ton Connect version (e.g. 2)
    isWalletBrowser: boolean; // if the page is opened into wallet's browser
    connect(protocolVersion: number, message: ConnectRequest): Promise<ConnectEvent>;
    restoreConnection(): Promise<ConnectEvent>;
    send(message: AppRequest): Promise<WalletResponse>;
    listen(callback: (event: WalletEvent) => void): () => void;
}
```

Just like with the HTTP bridge, wallet side of the bridge does not receive the app requests except for [ConnectRequest](/develop/dapps/ton-connect/protocol/requests-responses#initiating-connection) until the session is confirmed by the user. Technically, the messages arrive from the webview into the bridge controller, but they are silently ignored.

SDK around the implements **autoconnect()** and **connect()** as silent and non-silent attempts at establishing the connection.

### walletInfo (optional)
Represents wallet metadata. Might be defined to make an injectable wallet works with TonConnect even if the wallet is not listed in the [wallets-list.json](https://github.com/ton-blockchain/wallets-list).

Wallet metadata format:
```ts
interface WalletInfo {
    name: string;
    image: <png image url>;
    tondns?:  string;
    about_url: <about page url>;
}
```

Detailed properties description: https://github.com/ton-blockchain/wallets-list#entry-format.

If `TonConnectBridge.walletInfo` is defined and the wallet is listed in the [wallets-list.json](https://github.com/ton-blockchain/wallets-list), `TonConnectBridge.walletInfo` properties will override corresponding wallet properties from the wallets-list.json.


### connect()

Initiates connect request, this is analogous to QR/link when using the HTTP bridge.

If the app was previously approved for the current account — connects silently with ConnectEvent. Otherwise shows confirmation dialog to the user.

You shouldn't use the `connect` method without explicit user action (e.g. connect button click). If you want automatically try to restore previous connection, you should use the `restoreConnection` method.

### restoreConnection()

Attempts to restore the previous connection.

If the app was previously approved for the current account — connects silently with the new `ConnectEvent` with only a `ton_addr` data item.


Otherwise returns `ConnectEventError` with error code 100 (Unknown app).


### send()

Sends a [message](/develop/dapps/ton-connect/protocol/requests-responses#messages) to the bridge, excluding the ConnectRequest (that goes into QR code when using HTTP bridge and into connect when using JS Bridge).
Directly returns promise with WalletResponse, so you don't need to wait for responses with `listen`;

### listen()

Registers a listener for events from the wallet.

Returns unsubscribe function.

Currently, only `disconnect` event is available. Later there will be a switch account event and other wallet events.
