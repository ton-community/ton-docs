# Custom overlays

TON `v2024.04` update introduces the ability to use custom overlays.  
Currently they can be used only for broadcasting external messages. The main idea is to create private overlay with 
sender nodes and validators. Only sender nodes can create broadcasts with external messages which will be (hopefully) 
received by block collator and get into the block.

## Default custom overlays

Mytonctrl uses default custom overlays available at https://ton-blockchain.github.io/fallback_custom_overlays.json. To 
stop participation in default custom overlays run commands
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


