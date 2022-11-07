# ADNL Protocol

Implementation:
* https://github.com/ton-blockchain/ton/tree/master/adnl

## Overview

The cornerstone in the TON networking is the Abstract Datagram Network Layer (ADNL). 

This is an overlay, peer-to-peer, unreliable (small-size) datagram protocol running on top of **UDP** in **IPv4** (in future IPv6), with an optional **TCP fallback** if UDP is not available.

## ADNL Address

Each participant has a 256-bit ADNL address.

The ADNL protocol allows you to send (unreliable) and receive datagrams using only these ADNL addresses. IP addresses and ports are hidden by the ADNL protocol.

An ADNL address essentially equal to a 256-bit ECC public key. This public key can be generated arbitrarily, thus creating as many different network identities as the node likes.
However, one must know the corresponding private key in order to receive (and decrypt) messages intended for such an address.

In fact, the ADNL address is not the public key itself; instead, it is a 256-bit sha256 hash of a serialized TL-object that can describe several types of public keys and addresses depending on its constructor.

## Encryption & Security

Normally each datagram sent is signed by the sender and encrypted so that only the recipient can decrypt the message, and the recipient can verify the integrity by the signature.

## Neighbor tables

Normally, a TON ADNL node will have some “neighbor table”, containing information about
other known nodes, such as their abstract addresses and their
public keys, IP addresses and UDP ports. Then it will gradually
extend this table by using information learned from these known nodes as
answers to special queries, and sometimes prune obsolete records.

ADNL allows you to set up point-to-point channels and tunnels (a chain of proxies).

A TCP-like stream protocol can be built over ADNL.

:::info
Read more about ADNL in [Low-Level ADNL article](/learn/networking/low-level-adnl) or [TON Whitepaper](https://ton.org/docs/ton.pdf) chapter 3.1.
:::
