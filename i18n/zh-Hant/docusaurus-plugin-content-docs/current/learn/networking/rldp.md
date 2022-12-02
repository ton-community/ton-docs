# RLDP Protocol

Implementation:
* https://github.com/ton-blockchain/ton/tree/master/rldp
* https://github.com/ton-blockchain/ton/tree/master/rldp2
* https://github.com/ton-blockchain/ton/tree/master/rldp-http-proxy

## Overview

A reliable arbitrary-size datagram protocol built upon the ADNL, called RLDP,
is used instead of a TCP-like protocol. This reliable datagram protocol can
be employed, for instance, to send RPC queries to remote hosts and receive
answers from them.
