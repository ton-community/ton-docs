import Feedback from '@site/src/components/Feedback';

# ADNL protocol

Please see the [**implementation**](https://github.com/ton-blockchain/ton/tree/master/adnl) first.

## Overview

The Abstract Datagram Network Layer (ADNL) is a fundamental component of the TON. 

ADNL is an overlay, peer-to-peer, unreliable (small-size) datagram protocol that operates over **UDP** in **IPv4**, with plans to support **IPv6** in the future. Additionally, it has an optional **TCP fallback** for instances when UDP is unavailable.

## ADNL address

Each participant in the network possesses a 256-bit ADNL Address.

The ADNL Protocol enables the sending and receiving of datagrams using only ADNL Addresses, concealing the underlying IP Addresses and Ports.

An ADNL Address effectively functions as a 256-bit ECC public key, which can be generated arbitrarily, allowing for the creation of multiple network identities as needed by the node.

However, the corresponding private key must be known to receive and decrypt messages intended for a specific address.

In practice, the ADNL Address is not the public key itself; rather, it is a 256-bit SHA256 hash of a serialized TL object. Depending on its constructor, this TL object can represent various types of public keys and addresses.

## Encryption and security

Typically, each datagram sent is signed by the sender and encrypted so that only the intended recipient can decrypt the message and verify its integrity using the signature.

## Neighbor tables

A TON ADNL node will typically maintain a **neighbor table** that contains information about other known nodes, including their abstract addresses, public keys, IP addresses, and UDP ports. Over time, this table expands with information gathered from these known nodes, which may come from responses to specific queries or by removing outdated records.

ADNL facilitates the establishment of point-to-point channels and tunnels (chains of proxies).

A TCP-like stream protocol can be constructed on top of ADNL.

## What's next?

* To learn more about ADNL, refer to the [Low-level ADNL documentation](/v3/documentation/network/protocols/adnl/low-level-adnl).
* See Chapter 3.1 of the [TON Whitepaper](https://docs.ton.org/ton.pdf).
<Feedback />

