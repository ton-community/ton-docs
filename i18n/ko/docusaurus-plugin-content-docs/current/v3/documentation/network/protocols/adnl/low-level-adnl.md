import Feedback from '@site/src/components/Feedback';

# Low-level ADNL

Abstract Datagram Network Layer (ADNL) is the core protocol of TON, which helps network peers communicate.

## Peer identity

Each peer must have at least one identity; while it's possible to use multiple identities, it is not required. Each identity consists of a keypair used for performing the Diffie-Hellman exchange between peers. An abstract network address is derived from the public key in the following way: `address = SHA-256(type_id || public_key)`. Note that the `type_id` must be serialized as a little-endian uint32.

## 공개 키 암호 시스템 목록

| type_id | 암호시스템               |
| ---------------------------- | ------------------- |
| 0x4813b4c6                   | ed25519<sup>1</sup> |

- **To perform x25519, the keypair must be generated in "x25519" format. However, the public key is transmitted over the network in ed25519 format, so you have to convert the public key from x25519 to ed25519, examples of such conversions can be found [here](https://github.com/andreypfau/curve25519-kotlin/blob/f008dbc2c0ebc3ed6ca5d3251ffb7cf48edc91e2/src/commonMain/kotlin/curve25519/MontgomeryPoint.kt#L39) for Kotlin.**

## 클라이언트-서버 프로토콜 (TCP 기반 ADNL)

The client connects to the server using TCP and sends an ADNL handshake packet. This packet contains a server abstract address, a client public key, and encrypted AES-CTR session parameters, which the client determines.

### 핸드셰이크

먼저, 클라이언트는 서버 키의 `type_id`를 고려하여 자신의 개인 키와 서버 공개 키를 사용하여 키 합의 프로토콜(예: x25519)을 수행해야 합니다. 그 결과로 클라이언트는 이후 단계에서 세션 키 암호화에 사용되는 `secret`을 얻게 됩니다.

그런 다음 클라이언트는 AES-CTR 세션 매개변수, 16바이트 논스 및 32바이트 키를 TX(클라이언트->서버)와 RX(서버->클라이언트) 방향 모두에 대해 생성하고 다음과 같이 160바이트 버퍼로 직렬화해야 합니다:

| 매개변수                          | 크기     |
| ----------------------------- | ------ |
| rx_key   | 32 바이트 |
| tx_key   | 32 바이트 |
| rx_nonce | 16 바이트 |
| tx_nonce | 16 바이트 |
| padding                       | 64 바이트 |

The purpose of padding is unknown; it is not used by server implementations. It is recommended that the whole 160-byte buffer be filled with random bytes. Otherwise, an attacker may perform an active MitM attack using compromised AES-CTR session parameters.

The next step is to encrypt the session parameters using the `secret` through the key agreement protocol outlined above. To achieve this, AES-256 needs to be initialized in CTR mode with a 128-bit big-endian counter. This will utilize a (key, nonce) pair that is computed as follows (note that `aes_params` is a 160-byte buffer that was created earlier):

```cpp
hash = SHA-256(aes_params)
key = secret[0..16] || hash[16..32]
nonce = hash[0..4] || secret[20..32]
```

After encrypting `aes_params`, noted as `E(aes_params)`, remove AES as it is no longer needed. We are now ready to serialize all this information into the 256-byte handshake packet and send it to the server.

| 매개변수                                                        | 크기      | 참고                                                             |
| ----------------------------------------------------------- | ------- | -------------------------------------------------------------- |
| receiver_address                       | 32 바이트  | Server peer identity as described in the corresponding section |
| sender_public                          | 32 바이트  | 클라이언트 공개 키                                                     |
| SHA-256(aes_params) | 32 바이트  | 세션 매개변수의 무결성 증명                                                |
| E(aes_params)       | 160 바이트 | 암호화된 세션 매개변수                                                   |

The server must decrypt session parameters using a secret derived from the key agreement protocol, just as the client does. After decryption, the server must perform the following checks to ensure the security properties of the protocol:

- The server must possess the corresponding private key for `receiver_address`. Without this key, it cannot execute the key agreement protocol.

- The condition `SHA-256(aes_params) == SHA-256(D(E(aes_params)))` must hold true. If this condition is not met, it indicates that the key agreement protocol has failed and the `secret` values on both sides are not equal.

If any of these checks fail, the server will immediately drop the connection without responding to the client. If all checks pass, the server must issue an empty datagram (see the [Datagram](#datagram) section) to the client in order to prove that it owns the private key for the specified `receiver_address`.

### 데이터그램

Both the client and server must initialize two AES-CTR instances each for both transmission (TX) and reception (RX) directions. The AES-256 must be used in CTR mode with a 128-bit big-endian counter. Each AES instance is initialized using a (key, nonce) pair, which can be taken from the `aes_params` during the handshake.

To send a datagram, either the client or the server must construct the following structure, encrypt it, and send it to the other peer:

| 매개변수   | 크기                            | 참고                                                   |
| ------ | ----------------------------- | ---------------------------------------------------- |
| length | 4 바이트 (LE) | `length` 필드를 제외한 전체 데이터그램의 길이                        |
| nonce  | 32 바이트                        | 무작위 값                                                |
| buffer | `length - 64` 바이트             | 다른 쪽으로 보낼 실제 데이터                                     |
| hash   | 32 바이트                        | 무결성을 보장하기 위한 \`SHA-256(nonce \\ |

전체 구조는 해당 AES 인스턴스(클라이언트 -> 서버는 TX, 서버 -> 클라이언트는 RX)를 사용하여 암호화되어야 합니다.

The receiving peer must fetch the first 4 bytes, decrypt it into the `length` field, and read exactly the `length` bytes to get the full datagram. The receiving peer may start to decrypt and process `buffer` earlier, but it must take into account that it may be corrupted, intentionally or occasionally. Datagram `hash` must be checked to ensure the integrity of the `buffer`. In case of failure, no new datagrams can be issued and the connection must be dropped.

The first datagram in the session always goes from the server to the client after a handshake packet is successfully accepted by the server and its actual buffer is empty. The client should decrypt it and disconnect from the server in case of failure because it means that the server has not followed the protocol properly and the actual session keys differ on the server and client side.

### 통신 세부사항

If you want to dive into communication details, you could check the article [ADNL TCP - liteserver](/v3/documentation/network/protocols/adnl/adnl-tcp) to see some examples.

### 보안 고려사항

#### 핸드셰이크 패딩

It is unknown why the initial TON team decided to include this field in the handshake. `aes_params` integrity is protected by a SHA-256 hash, and confidentiality is protected by the key derived from the `secret` parameter. Probably, it was intended to migrate from AES-CTR at some point. To do this, the specification may be extended to include a special magic value in `aes_params`, which will signal that the peer is ready to use the updated primitives. The response to such a handshake may be decrypted twice, with new and old schemes, to clarify which scheme the other peer is actually using.

#### 세션 매개변수 암호화 키 도출 프로세스

암호화 키가 `secret` 매개변수에서만 도출되는 경우, secret이 정적이므로 키도 정적일 것입니다. 각 세션마다 새로운 암호화 키를 도출하기 위해 개발자들은 `aes_params`가 무작위이면 무작위인 `SHA-256(aes_params)`도 사용합니다. 하지만 서로 다른 하위 배열을 연결하는 실제 키 도출 알고리즘은 유해한 것으로 간주됩니다.

#### 데이터그램 논스

The purpose of the `nonce` field in the datagram may not be immediately clear. Even without it, any two ciphertexts will differ due to the session-bounded keys used in AES and the encryption method in CTR mode. However, if a nonce is absent or predictable, a potential attack can occur.

In CTR encryption mode, block ciphers like AES function as stream ciphers, allowing for bit-flipping attacks. If an attacker knows the plaintext corresponding to an encrypted datagram, they can create an exact key stream and XOR it with their own plaintext, effectively replacing the original message sent by a peer. Although buffer integrity is protected by a hash (referred to here as SHA-256), an attacker can still manipulate it because if they know the entire plaintext, they can also compute its hash.

The nonce field is crucial for preventing such attacks, as it ensures that an attacker cannot replace the SHA-256 without also having access to the nonce.

## P2P 프로토콜 (UDP 기반 ADNL)

A detailed description can be found in the article [ADNL UDP - internode](/v3/documentation/network/protocols/adnl/adnl-udp).

## 참조

- [The Open Network, p. 80](https://ton.org/whitepaper.pdf#80)

- [TON의 ADNL 구현](https://github.com/ton-blockchain/ton/tree/master/adnl)

_Thanks to the [hacker-volodya](https://github.com/hacker-volodya) for contributing to the community!_
_Here a [link to the original article](https://github.com/tonstack/ton-docs/tree/main/ADNL) on GitHub._ <Feedback />

