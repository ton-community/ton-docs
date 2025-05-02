import Feedback from '@site/src/components/Feedback';

# Custom overlays

TON nodes communicate with each other by forming subnets called **overlay**. A few common overlay nodes participate, such as public overlays for each shard. Validators also participate in general validator overlays and overlays for specific validator sets.

Nodes can also be configured to join custom overlays for two primary purposes: broadcasting external messages and broadcasting block candidates.

Participation in custom overlays allows for the avoidance of uncertainty of public overlays and improves delivery reliability and delays.

Each custom overlay has a strictly determined list of participants with predefined permissions, particularly permission to send external messages and blocks. The overlay's configuration should be the same on all participating nodes.

If you have multiple nodes under your control, it is expedient to unite them into a custom overlay, where all validators can send block candidates and all LS can send external messages. That way, LS will synchronize faster while simultaneously increasing the external message delivery rate (and delivery more robust in general). Note that additional overlay causes additional network traffic.

## Default custom overlays

MyTonCtrl utilizes default custom overlays, which can be found [here](https://ton-blockchain.github.io/fallback_custom_overlays.json). These overlays are typically not in use and are meant for emergency situations when there are connectivity issues with the public overlay.

If you wish to stop participating in default custom overlays, please run the following commands:

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## Creating a custom overlay

### Collect ADNL  addresses

To add validators to a custom overlay, you can use either their `fullnode adnl id` available with `validator-console -c getconfig` or `validator adnl id`, which can be found in MyTonCtrl's status. 

To add liteservers to a custom overlay, you must use their `fullnode adnl id`.

### Create a config file

Create a config file in the following format:

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

`msg_sender_priority` determines the order of external message inclusion in blocks: messages from higher-priority sources are first processed. Messages from the public overlay and local LS have priority 0.

:::caution
All nodes listed in the configuration **must** participate in the overlay; if they do not add an overlay with the exact same configuration, connectivity will be poor and broadcasts may fail.
:::

There is a special word `@validators` to create a dynamic custom overlay that MyTonCtrl will generate automatically each round adding all current validators.

### Add custom overlay

Use the following MyTonCtrl command to add a custom overlay:

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

:::caution
The name and config file **must** be the same on all overlay members. Check that the overlay has been created using MyTonCtrl's `list_custom_overlays` command.
:::

### Debug

You can set the node verbosity level equal to 4, and grep logs with the **CustomOverlay** word.

## Deleting a custom overlay

To remove a custom overlay from a node, use the MyTonCtrl command `delete_custom_overlay <name>.`

If the overlay is dynamic (i.e., there is a `@validators` word in the config), it will be deleted within one minute; otherwise, it will be removed instantly.

To make sure that the node has deleted the custom overlay, check MyTonCtrl's `list_custom_overlays`  and `showcustomoverlays` validator-console commands.

## Low level

List of validator-console commands for managing custom overlays:

* `addcustomoverlay <path_to_config>`: Adds a custom overlay to the local node. Note that this configuration must be in a format different from the config used for MyTonCtrl:

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

* `delcustomoverlay <name>`: Removes the custom overlay from the node.

* `showcustomoverlays`: Displays a list of custom overlays known to the node.

<Feedback />

