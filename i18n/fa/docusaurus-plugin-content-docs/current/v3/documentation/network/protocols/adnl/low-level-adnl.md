import Feedback from '@site/src/components/Feedback';

# Low-level ADNL

Abstract Datagram Network Layer (ADNL) is the core protocol of TON, which helps network peers communicate.

## هویت همتا

Each peer must have at least one identity; while it's possible to use multiple identities, it is not required. Each identity consists of a keypair used for performing the Diffie-Hellman exchange between peers. An abstract network address is derived from the public key in the following way: `address = SHA-256(type_id || public_key)`. Note that the `type_id` must be serialized as a little-endian uint32.

## فهرست رمزنگاری سیستم‌های کلید عمومی

| type_id | سیستم رمزنگاری      |
| ---------------------------- | ------------------- |
| 0x4813b4c6                   | ed25519<sup>1</sup> |

- **To perform x25519, the keypair must be generated in "x25519" format. However, the public key is transmitted over the network in ed25519 format, so you have to convert the public key from x25519 to ed25519, examples of such conversions can be found [here](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39) for Kotlin.**

## پروتکل کلاینت-سرور (ADNL بر روی TCP)

The client connects to the server using TCP and sends an ADNL handshake packet. This packet contains a server abstract address, a client public key, and encrypted AES-CTR session parameters, which the client determines.

### دست‌دهی

First, the client must perform a key agreement protocol (for example, x25519) using their private key and server public key, taking into account the server key's `type_id`. As a result, the client will gain `secret`, which is used to encrypt session keys in future steps.

سپس، کلاینت باید پارامترهای جلسه AES-CTR، یک nonce ۱۶ بایتی و کلید ۳۲ بایتی را برای جهت‌های TX (کلاینت->سرور) و RX (سرور->کلاینت) تولید کند و آن را به صورت یک بافر ۱۶۰ بایتی به شرح زیر سریال کند:

| پارامتر                       | اندازه  |
| ----------------------------- | ------- |
| rx_key   | ۳۲ بایت |
| tx_key   | ۳۲ بایت |
| rx_nonce | ۱۶ بایت |
| tx_nonce | ۱۶ بایت |
| پدینگ                         | ۶۴ بایت |

The purpose of padding is unknown; it is not used by server implementations. It is recommended that the whole 160-byte buffer be filled with random bytes. Otherwise, an attacker may perform an active MitM attack using compromised AES-CTR session parameters.

The next step is to encrypt the session parameters using the `secret` through the key agreement protocol outlined above. To achieve this, AES-256 needs to be initialized in CTR mode with a 128-bit big-endian counter. This will utilize a (key, nonce) pair that is computed as follows (note that `aes_params` is a 160-byte buffer that was created earlier):

```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```

After encrypting `aes_params`, noted as `E(aes_params)`, remove AES as it is no longer needed. We are now ready to serialize all this information into the 256-byte handshake packet and send it to the server.

| پارامتر                                                     | اندازه   | یادداشت‌ها                                                  |
| ----------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| receiver_address                       | ۳۲ بایت  | هویت همتای سرور همانطور که در بخش مربوطه توضیح داده شده است |
| sender_public                          | ۳۲ بایت  | کلید عمومی کلاینت                                           |
| SHA-256(aes_params) | ۳۲ بایت  | اثبات صحت پارامترهای جلسه                                   |
| E(aes_params)       | ۱۶۰ بایت | پارامترهای جلسه رمزگذاری شده                                |

The server must decrypt session parameters using a secret derived from the key agreement protocol, just as the client does. After decryption, the server must perform the following checks to ensure the security properties of the protocol:

- The server must possess the corresponding private key for `receiver_address`. Without this key, it cannot execute the key agreement protocol.

- The condition `SHA-256(aes_params) == SHA-256(D(E(aes_params)))` must hold true. If this condition is not met, it indicates that the key agreement protocol has failed and the `secret` values on both sides are not equal.

If any of these checks fail, the server will immediately drop the connection without responding to the client. If all checks pass, the server must issue an empty datagram (see the [Datagram](#datagram) section) to the client in order to prove that it owns the private key for the specified `receiver_address`.

### دیتاگرام

Both the client and server must initialize two AES-CTR instances each for both transmission (TX) and reception (RX) directions. The AES-256 must be used in CTR mode with a 128-bit big-endian counter. Each AES instance is initialized using a (key, nonce) pair, which can be taken from the `aes_params` during the handshake.

To send a datagram, either the client or the server must construct the following structure, encrypt it, and send it to the other peer:

| پارامتر | اندازه                         | یادداشت‌ها                                |
| ------- | ------------------------------ | ----------------------------------------- |
| طول     | ۴ بایت (LE) | طول تمام دیتاگرام، به جز فیلد `length`    |
| nonce   | ۳۲ بایت                        | مقدار تصادفی                              |
| بافر    | `طول - ۶۴` بایت                | داده واقعی که باید به طرف مقابل ارسال شود |
| hash    | ۳۲ بایت                        | \`SHA-256(nonce \\   |

کل ساختار باید با استفاده از نمونه مربوطه AES رمزگذاری شود (TX برای client -> server، RX برای server -> client).

The receiving peer must fetch the first 4 bytes, decrypt it into the `length` field, and read exactly the `length` bytes to get the full datagram. The receiving peer may start to decrypt and process `buffer` earlier, but it must take into account that it may be corrupted, intentionally or occasionally. Datagram `hash` must be checked to ensure the integrity of the `buffer`. In case of failure, no new datagrams can be issued and the connection must be dropped.

The first datagram in the session always goes from the server to the client after a handshake packet is successfully accepted by the server and its actual buffer is empty. The client should decrypt it and disconnect from the server in case of failure because it means that the server has not followed the protocol properly and the actual session keys differ on the server and client side.

### جزئیات ارتباط

If you want to dive into communication details, you could check the article [ADNL TCP - liteserver](/v3/documentation/network/protocols/adnl/adnl-tcp) to see some examples.

### ملاحظات امنیتی

#### پرکردن handshake

It is unknown why the initial TON team decided to include this field in the handshake. `aes_params` integrity is protected by a SHA-256 hash, and confidentiality is protected by the key derived from the `secret` parameter. Probably, it was intended to migrate from AES-CTR at some point. To do this, the specification may be extended to include a special magic value in `aes_params`, which will signal that the peer is ready to use the updated primitives. The response to such a handshake may be decrypted twice, with new and old schemes, to clarify which scheme the other peer is actually using.

#### فرایند مشتق‌سازی کلید رمزگذاری پارامترهای جلسه

If an encryption key is derived only from the `secret` parameter, it will be static because the secret is static. To derive a new encryption key for each session, developers also use `SHA-256(aes_params)`, which is random if `aes_params` is random. However, the actual key derivation algorithm with the concatenation of different subarrays is considered harmful.

#### دیتاگرام nonce

The purpose of the `nonce` field in the datagram may not be immediately clear. Even without it, any two ciphertexts will differ due to the session-bounded keys used in AES and the encryption method in CTR mode. However, if a nonce is absent or predictable, a potential attack can occur.

In CTR encryption mode, block ciphers like AES function as stream ciphers, allowing for bit-flipping attacks. If an attacker knows the plaintext corresponding to an encrypted datagram, they can create an exact key stream and XOR it with their own plaintext, effectively replacing the original message sent by a peer. Although buffer integrity is protected by a hash (referred to here as SHA-256), an attacker can still manipulate it because if they know the entire plaintext, they can also compute its hash.

The nonce field is crucial for preventing such attacks, as it ensures that an attacker cannot replace the SHA-256 without also having access to the nonce.

## پروتکل P2P (ADNL over UDP)

A detailed description can be found in the article [ADNL UDP - internode](/v3/documentation/network/protocols/adnl/adnl-udp).

## منابع

- [The Open Network, p. 80](https://ton.org/whitepaper.pdf#80)

- [پیاده‌سازی ADNL در TON](https://github.com/ton-blockchain/ton/tree/master/adnl)

_Thanks to the [hacker-volodya](https://github.com/hacker-volodya) for contributing to the community!_
_Here a [link to the original article](https://github.com/tonstack/ton-docs/tree/main/ADNL) on GitHub._ <Feedback />

