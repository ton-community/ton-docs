# 自定义 overlays

TON 节点通过形成称为 *Overlays* 的子网进行通信。节点通常会参与一些常见的 Overlay，例如：每个分片的公共 Overlay，验证者参与的通用验证者 Overlay，以及特定验证者集合的专用 Overlay。

节点还可以配置为加入自定义overlays。
目前，这些overlays有两种用途：

- 广播外部信息
- 广播区块候选人。

参与定制 overlays 可以避免公共 overlays 的不确定性，提高交付可靠性和延迟。

每个自定义 overlays 都有严格确定的参与方列表，这些参与方具有预定义的权限，尤其是发送外部信息和块的权限。所有参与节点上的 overlay 配置都应相同。

如果您控制着多个节点，最好将它们合并到自定义 overlays 中，这样所有验证器都能发送候选块，所有 LS 都能发送外部信息。这样，LS 的同步速度会更快，同时外部信息的发送率也会更高（一般来说，发送能力也会更强）。需要注意的是，额外的 overlays 会导致额外的网络流量。

## 默认自定义 overlays

Mytonctrl 使用 https://ton-blockchain.github.io/fallback_custom_overlays.json 上的默认自定义overlays。这种 overlays 在大多数情况下都不会使用，而是在公共overlays连接出现问题时应急使用。
要停止参与默认自定义overlays，请运行命令

```bash
MyTonCtrl> set useDefaultCustomOverlays false
MyTonCtrl> delete_custom_overlay default
```

## 创建自定义 overlays

### 收集 adnl 地址

要在自定义 overlays 中添加验证器，可以使用 `fullnode adnl id`（可通过`validator-console -c getconfig`
获取）或`validator adnl id`（可在 mytonctrl 的状态中找到）。
要将 liteservers 添加到自定义overlays中，必须使用它们的 `fullnode adnl id`。

### 创建配置文件

创建格式为

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

`msg_sender_priority` 决定将外部信息纳入区块的顺序：首先处理来自优先级较高来源的信息。来自公共overlays和本地 LS 的信息优先级为 0。

**注意，配置中列出的所有节点都应参与 overlays （换句话说，它们需要使用此配置添加 overlays ），否则连接性会很差，广播也会失败**

有一个特殊字符 `@validators` 可以创建一个动态自定义 overlays ，mytonctrl 会在每一轮自动生成
，并添加所有当前验证器。

### 添加自定义 overlay

使用 mytonctrl 命令添加自定义 overlay ：

```bash
MyTonCtrl> add_custom_overlay <name> <path_to_config>
```

请注意，所有 overlay. 层成员的名称和配置文件 \*\* 必须\*\*相同。使用
mytonctrl `list_custom_overlays` 命令检查 overlay 是否已创建。

### 调试

您可以将节点的冗余级别设置为 4，并使用 "CustomOverlay"（自定义 overlays ）字样对日志进行 grep 处理。

## 删除自定义 overlay

要删除节点上的自定义 overlay 层，请使用 mytonctrl 命令 `delete_custom_overlay<name>`。
如果overlays层是动态的（即配置中有 `@validators` 字样），则会在一分钟内删除，否则会立即删除。
要确保节点已删除自定义overlays层，请检查 `list_custom_overlays` mytonctrl 和 `showcustomoverlays` validator-console 命令。

## 低层级

用于使用自定义 overlays 层的验证器控制台命令列表：

- `addcustomoverlay<path_to_config>` - 为本地节点添加自定义overlay。请注意，此配置的格式必须与 mytonctrl 的配置格式不同：
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
- `delcustomoverlay<name>` - 删除节点上的自定义 overlay 。
- `showcustomoverlays` - 显示节点知道的自定义 overlay 列表。
