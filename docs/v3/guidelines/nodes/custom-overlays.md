# Custom overlays

TON nodes communicate each other by forming subnets called _Overlays_. There are few common overlays nodes participate in such as: public overlays for each shard, validators also participate in general validators overlay and overlays for specific validators sets.

Nodes also can be configured to join custom overlays.
Currently these overlays can be used for two purposes:
- broadcasting external messages
- broadcasting block candidates.

Participation in custom overlays allow to avoid uncertainty of public overlays and improve delivery reliability and delays.

Each custom overlay has strictly determined list of participants with predefined permissions, in particular permission to send external messages and blocks. Config of the overlay should be the same on all participating nodes.

If you have multiple node under your control it is expedient to unite them into custom overlay, where all validators will be able to send block candidates and all LS will be able to send external messages. That way LS will synchronize faster while simultaneously external message delivery rate will be higher (and delivery more robust in general). Note, that additional overlay causes additional network traffic.

## Default custom overlays

Mytonctrl uses default custom overlays available at https://ton-blockchain.github.io/fallback_custom_overlays.json. This overlay is not used most of the time and intended for emergency use in case of problems with public overlay connectivity.
To stop participation in default custom overlays run commands
```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## Create custom overlay

### Collect adnl addresses

To add validators to a custom overlay you can use either their `fullnode adnl id` available with `validator-console -c getconfig` 
or `validator adnl id` which can be found in mytonctrl's status.
To add liteservers to a custom overlay you must use their `fullnode adnl id`.

### Create a config file

Create a config file in format:

```json
{
    "adnl_address_hex_1": {
        "msg_sender": true,
        "msg_sender_priority": 1
    },
    "adnl_address_hex_2": {
        "msg_sender": false
    },

    "adnl_address_hex_2": {
        "block_sender": true
    },
  ...
}
```

`msg_sender_priority` determines the order of external message inclusion to blocks: first processed messages from higher priority source. Messages from public overlay and local LS have priority 0.

**Note, all nodes listed in config should participate in overlay (in other words they need to add overlay with exactly this config), otherwise connectivity will be poor and broadcasts will fail**

There is special word `@validators` to create a dynamic custom overlay that mytonctrl will generate automatically
each round adding all current validators.

### Add custom overlay

Use mytonctrl command to add custom overlay:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

Note, that name and config file **must** be the same on all overlay members. Check that overlay has been created using 
mytonctrl `list_custom_overlays` command.

### Debug

You can set node verbosity level equals to 4 and grep logs with "CustomOverlay" word.

## Delete custom overlay

To remove custom overlay from a node, use mytonctrl command `delete_custom_overlay <name>`. 
If the overlay is dynamic (i.e. there is `@validators` word in config) it will be deleted within one minute, otherwise it will be removed instantly. 
To make sure that node has deleted custom overlay check `list_custom_overlays` mytonctrl and `showcustomoverlays` validator-console commands.

## Low level

List of validator-console commands to work with custom overlays:

* `addcustomoverlay <path_to_config>` - add custom overlay to local node. Note, that this config  must be in a format other than config for mytonctrl:
    ```json
    {
      "name": "OverlayName",
      "nodes": [
        {
          "adnl_id": "adnl_address_b64_1",
          "msg_sender": true,
          "msg_sender_priority": 1
        },
        {
          "adnl_id": "adnl_address_b64_2",
          "msg_sender": false
        }, ...
      ]
    }
    ```
* `delcustomoverlay <name>` - delete custom overlay from node.
* `showcustomoverlays` - show list of custom overlays node knows about.


