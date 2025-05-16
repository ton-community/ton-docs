import Feedback from '@site/src/components/Feedback';

# Node configuration backup and restore

MyTonCtrl enables users to easily create and restore backups of node configurations with two straightforward commands. This feature allows efficient and quick transfer of node configurations from one host to another.

## Manual backup package creation

The `create_backup` command initializes manual backup creation, which should take no more than a few seconds.

MyTonCtrl will create a backup package in the user's home directory. The package name will include the hostname and the backup's epoch timestamp.

The backup will include the following components:

* Node configuration file located at (`/var/ton-work/db/config.json`)

* Node keyring found in (`/var/ton-work/db/keyring`)

* Node liteserver and console keys stored in (`/var/ton-work/keys`)

* MyTonCtrl configuration database and related files located at (`~/.local/share/mytoncore`)

* Wallet and pool data

## Automated backup package creation

If your node is involved in validation, you can set up automated backups of the node configuration. These backups will be performed immediately after your node participates in the elections, ensuring that all data needed for the upcoming validation cycle is preserved.

To enable automated backups, set the parameter: `auto_backup` to `true` by issuing the command `set auto_backup true` on the MyTonCtrl console.

### Automated backup location and lifecycle

By default, automated backups are saved in the directory `/tmp/mytoncore/auto_backups/` located in the home folder of the user under which the **mytoncore** process is running. You can change this location by adjusting the `auto_backup_path` parameter in the MyTonCtrl console.

**Note that automated backups that are older than 7 days will be automatically deleted.**

### Restore backup package

**Important notes**:

* Make sure to stop or disable the TON node on the donor machine. Failing to do so can lead to connectivity and synchronization issues on both machines. It is recommended to stop the donor node for at least 20 minutes before applying the backup data to the new machine.

* Before restoring the backup package to the existing node, it is strongly advised to manually back up the node's original configuration to ensure you have a rollback option.

Use the `restore_backup <file_name>` command and follow the provided instructions. Backups should be restored to a fully synchronized node. MyTonCtrl will retain all settings except for the IP address, which will be updated accordingly.

<Feedback />

