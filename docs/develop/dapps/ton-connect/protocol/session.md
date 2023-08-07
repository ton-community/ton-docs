# Session protocol

Session protocol defines client identifiers and offers end-to-end encryption for the app and the wallet. This means the HTTP bridge is fully untrusted and cannot read the user’s data transmitted between the app and the wallet. JS bridge does not use this protocol since both the wallet and the app run on the same device.

## Definitions

### Client Keypair

X25519 keypair for the use with NaCl “crypto_box” protocol.

```
a <- random 23 bytes
A <- X25519Pubkey(s)
```

or

```
(a,A) <- nacl.box.keyPair()
```


### Client ID

The public key part of the [Client Keypair](#client-keypair) (32 bytes).

### Session

A session is defined by a pair of two client IDs. Both the app and the wallet create their own [Client IDs](#client-id).


### Creating client Keypair

```
(a,A) <- nacl.box.keyPair()
```

### Encryption

All requests from the app (except the initial request) and all responses from the wallet are encrypted.

Given a binary encoding of message **m**, recipient’s [Client ID](#client-id) **X** and sender’s private key **y** the message is encrypted as follows:

```
nonce <- random(24 bytes)
ct    <- nacl.box(m, nonce, X, y)
M     <- nonce ++ ct
```

That is, the final message **M** has the first 24 bytes set to the random nonce.

### Decryption

To decrypt the message **M**, the recipient uses its private key **x** and sender’s public key **Y** (aka [Client ID](#client-id)):

```
nonce <- M[0..24]
ct    <- M[24..]
m     <- nacl.box.open(ct, nonce, Y, x)
```

Plaintext **m** is recovered and parsed per [Requests/Responses](/develop/dapps/ton-connect/protocol/requests-responses#requests-and-responses).