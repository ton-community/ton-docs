# Standby validator nodes
Ensuring the uninterrupted and reliable operation of validators is of paramount importance to validator node operators. Failure to do so can affect the performance of the TON network and can result in significant penalties.

However, no system is perfect or reliable, and validators may fail to perform their duties for reasons such as

* Loss of TON network synchronization due to hardware overload or physical network problems
* Hardware failure
* ISP failure

## Standby node
We recommend that all validator operators maintain at least one standby node that can take over validation duties if the main machine fails. 

The standby machine should ideally be hosted at a different physical location / ISP. Such machine should have MyTonCtrl installed in full node mode, and should be synchronized with the TON blockchain network. Hardware sizing should match your main validator configuration.

## Standby activation mechanics
At present, the standby node is activated manually by the node operator. There is no automated main/standby operation.

## Backup
In order to transfer validation duties from the main node to the standby node, operators need the following data

* up-to-date MyTonCtrl configuration database and files
* up-to-date node configuration file and keyring
* keys required for MyTonCtrl functionality

MyTonCtrl provides functionality to [create backups](mytonctrl-backup-restore.md) that contain all required data. If you are running a validator node, we strongly recommend that you set up [automated backups](mytonctrl-backup-restore.md#automated-backup-creation) and download backup archives from your machine frequently.

## Restore
Before transferring the validator configuration to the standby machine, please ensure that you have stopped / disabled the TON node on the donor machine for ~20 minutes. Failure to do so will result in connectivity issues and crashes on both the donor and target machines.

The restore process is [described in Backups](mytonctrl-backup-restore.md)

Please ensure that you create and retain the backup of your standby node original configuration before you apply/restore a backup package from another machine, as you will need this to bring the standby node back into standby mode.

## Standby rollback
If you wish to transfer your validator configuration back to the main validator machine and restore the standby node, please do the following

1) Back up the active validator configuration on the standby node.
2) Transfer the configuration to the main Validator machine following the instructions above
3) Restore the backup of your standby node's original configuration that you created before the validator configuration was applied to it.

