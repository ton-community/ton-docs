# Low-Level ADNL 

Abstract Datagram Network Layer (ADNL) is the core protocol of TON, which helps network peers to communicate with each other.

## Peer identity
Each peer must have at least one identity, but it's not restricted to use multiple. Each identity is a keypair, which is used to perform Diffie-Hellman between peers. Abstract network address is derived from public key in such way: `address = SHA-256(type_id || public_key)`. Note that type_id must be serialized as little-endian uint32.

## Public-key cryptosystems list
| type_id    | cryptosystem        |
|------------|---------------------|
| 0x4813b4c6 | ed25519<sup>1</sup> |

_1. To perform x25519, keypair must be generated in x25519 format. However, public key is transmitted over the network in ed25519 format, so you have to convert public key from x25519 to ed25519, example of such conversion can be found [here](https://github.com/tonstack/adnl-rs/blob/master/src/integrations/dalek.rs#L10) for Rust and [here](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39) for Kotlin._

## Client-server protocol (ADNL over TCP)
Client connects to server using TCP and sends ADNL handshake packet, which contains server abstract address, client public key, and encrypted AES-CTR session parameters, which is determined by the client.

### Handshake
First, client must perform key agreement protocol (for example, x25519) using their private key and server public key, taking into account the `type_id` of server key. In the result, client have `secret`, which is used to encrypt session keys in the next steps.

Then, client have to generate AES-CTR session parameters, 16-byte nonce and 32-byte key, both for TX (client->server) and RX (server->client) directions and serialize it into 160-byte buffer as follows:

| Parameter    | Size     |
|--------------|----------|
| rx_key       | 32 bytes |
| tx_key       | 32 bytes |
| rx_nonce     | 16 bytes |
| tx_nonce     | 16 bytes |
| padding      | 64 bytes |

The purpose of padding is unknown, it is not used by server implementations. It is recommended to fill whole 160-byte buffer with random bytes, otherwise an attacker may perform active MitM attack using compromised AES-CTR session parameters.

The next step is to encrypt session parameters using `secret` computed by key agreement protocol above. To do that, an instance of AES-256 in mode CTR with 128-bit big endian counter must be initialized using pair of (key, nonce) which is computed in such way (`aes_params` is a 160-byte buffer which was built above):
```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```
After encryption of `aes_params` which is noted as `E(aes_params)`, instance of AES should be disposed, as it is not needed anymore.

Now we are ready to serialize all that information to the 256-bytes handshake packet and send it to server:

| Parameter           | Size      | Notes                                                      |
|---------------------|-----------|------------------------------------------------------------|
| receiver_address    | 32 bytes  | Server peer identity as described in corresponding section |
| sender_public       | 32 bytes  | Client public key                                          |
| SHA-256(aes_params) | 32 bytes  | Integrity proof of session parameters                      |
| E(aes_params)       | 160 bytes | Encrypted session parameters                               |

Server must decrypt session parameters using a secret, derived from the key agreement protocol in the same way as client. Then server must perform following checks to ensure security properties of the protocol:
1. Server must have corresponding private key for `receiver_address`, otherwise there is no way to perform the key agreement protocol.
2. `SHA-256(aes_params) == SHA-256(D(E(aes_params)))`, otherwise the key agreement protocol has failed and `secret` is not equal on both sides.

If any of this checks has failed, server must immediately drop the connection without any response to the client. If all checks pass, server must issue an empty datagram (see Datagram section) to client to prove that it owns the private key for the specified `receiver_address`.


### Datagram

Both client and server must initialize two AES-CTR instances each, for TX and RX directions. AES-256 must be used in mode CTR with 128-bit big endian counter. Each AES instance is initialized using pair of (key, nonce) belonging to it, which can be taken from `aes_params` in handshake.

To send a datagram, peer (client or server) must build the following structure, encrypt it, and send to the other peer:

| Parameter | Size                 | Notes                                                      |
|-----------|----------------------|------------------------------------------------------------|
| length    | 4 bytes (LE)         | Length of the whole datagram, excluding `length` field     |
| nonce     | 32 bytes             | Random value                                               |
| buffer    | `length - 64` bytes  | Actual data to be sent to the other side                   |
| hash      | 32 bytes             | `SHA-256(nonce \|\| buffer)` to ensure integrity             |

The whole structure must be encrypted by the corresponding AES instance (TX for client -> server, RX for server -> client).

The receiving peer must fetch the first 4 bytes, decrypt it into `length` field and read exactly `length` bytes to get the full datagram. The receiving peer may start to decrypt and process `buffer` earlier, but it must take into account that it may be corrupted, intentionally or occasionally. Datagram `hash` must be checked to ensure integrity of the `buffer`. In case of failure, no new datagrams can be issued and the connection must be dropped.

The first datagram in session always goes from server to client after handshake packet was successfully accepted by server, and it's actual buffer is empty. Client should decrypt it and disconnect from server in case of failure, because it means that the server not follows the protocol properly and actual session keys differs on server and client side.

### Security considerations
#### Handshake padding
It is unknown why initial TON team decided to include this field into handshake. `aes_params` integrity is protected by SHA-256 hash and confidentiality is protected by the key derived from `secret` parameter. Probably, it was designed to migrate from AES-CTR at some moment. To do this, specification may be extended to include special magic value in `aes_params`, which will signalize that the peer is ready to use the updated primitives. The response to such handshake may be decrypted twice, with new and old schemes, to clarify which scheme other peer is actually using.

#### Session parameters encryption key derivation process
If encryption key derives only from `secret` parameter, it become static, because the secret is static. To derive new encryption key for each session, developers also took `SHA-256(aes_params)`, which is random if `aes_params` is random. However, the actual key derivation algorithm with concatenation of different subarrays is considered harmful.

#### Datagram nonce
It is not obvious why `nonce` field in datagram is present, because even without it any two ciphertexts will differ, because of session-bounded keys for AES and encryption in CTR mode. However, the following attack can be performed in case of absent or predictable nonce. CTR encryption mode turns block ciphers such as AES into stream ciphers, so it is possible to perform bit-flipping attack. If attacker knows the plaintext which belongs to encrypted datagram, they can obtain pure keystream and than XOR it with their own plaintext, efficiently replace the message which was sent by peer. The buffer integrity is protected by SHA-256 hash, but an attacker can replace it too, because knowledge of full plaintext means knowledge of its hash. To prevent such attack, nonce field is present, so attacker can't replace SHA-256 without the knowledge of nonce.

## P2P protocol (ADNL over UDP)
TBD

## References
- [The Open Network, p. 80](https://ton.org/ton.pdf)
- [ADNL implementation in TON](https://github.com/ton-blockchain/ton/tree/master/adnl)

_Thanks to the [hacker-volodya](https://github.com/hacker-volodya) for contributing to the community!_  
_Here a [link to the original article](https://github.com/tonstack/ton-docs/tree/main/ADNL) on GitHub._