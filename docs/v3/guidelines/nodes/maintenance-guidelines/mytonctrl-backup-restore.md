# Node configuration backup and restore
MyTonCtrl allows users to create and restore node configuration backups with two simple, easy-to-use commands. This feature allows node operations to quickly and efficiently transfer node configuration from one host to another.

### Manually create backup package
Manual backup creation is initialized with the `create_backup` command, the backup creation process should not take more than a few seconds. 

MyTonCtrl will create a backup package in the home directory of the MyTonCtrl user, the package name will include the hostname as well as the epoch timestamp of the backup.

The backup will contain
* Node configuration file (`/var/ton-work/db/config.json`)
* Node keyring (`/var/ton-work/db/keyring`)
* Node liteserver and console keys (`/var/ton-work/keys`)
* MyTonCtrl configuration database and files (`~/.local/share/mytoncore`)
* Wallet and pool information

### Automated backup creation
If your node is participating in validation, you can set up automated backups of the node configuration; this backup will be performed immediately after your node participates in the elections, thus ensuring that all data required for the upcoming validation cycle has been preserved.
To enable automated backups, please set the parameter: `auto_backup` to `true` by issuing command `set auto_backup true` on MyTonCtrl console.

#### Automated backups location and lifecycle
By default, automated backups are stored in directory `/tmp/mytoncore/auto_backups/` within home of the user mytoncore process is running under. You can adjust this by setting parameter `auto_backup_path` in MyTonCtrl console.

Automated backups older than 7 days will be deleted.

### Restore backup package
**Important Notes**: 
1) Please ensure that you have stopped / disabled the Ton node on the donor machine. Failure to do so will result in connectivity and synchronization problems on both machines. We also recommend that you stop the donor node 20 minutes before applying the backup data to the new machine.
2) Before restoring the backup package to the existing node, we strongly recommend that you manually backup the original configuration of the node to ensure a possible rollback path.

Use the `restore_backup <file_name>` command and follow the instructions.
Backups should be restored to a fully synchronized node, MyTonCtrl will keep all settings except the IP address which will be adjusted accordingly.
