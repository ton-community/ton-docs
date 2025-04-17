import Feedback from '@site/src/components/Feedback';

# Standby validator nodes

Validator node operators must ensure the continuous and reliable operation of their validators. Failure to do so can negatively impact the performance of the TON network and may lead to significant penalties.

However, no system is flawless, and validators may fail in their duties for several reasons, including:

* Loss of synchronization with the TON network due to hardware overload or physical network issues

* Hardware malfunction

* ISP failure

## Standby node

We recommend that all validator operators maintain at least one standby node that can take over validation duties if the main machine fails.

The standby machine should ideally be hosted at a different physical location/ISP. It should have MyTonCtrl installed in full node mode and be synchronized with the TON Blockchain network. **Hardware sizing should match your main validator configuration.**

## Standby activation mechanics

Currently, the node operator activates the standby node manually, as there is no automated main/standby operation.

## Backup

To transfer validation duties from the main node to the standby node, operators require the following information:

* An up-to-date MyTonCtrl configuration database and files.

* An up-to-date node configuration file and keyring.

* The keys needed for MyTonCtrl functionality.

MyTonCtrl offers functionality to [create backups](mytonctrl-backup-restore.md) that include all necessary data. If you operate a validator node, we highly recommend setting up [automated backups](mytonctrl-backup-restore.md#automated-backup-creation) and regularly downloading backup archives from your machine.

## Restore

Before transferring the validator configuration to the standby machine, make sure to stop or disable the TON node on the donor machine for approximately 20 minutes. **Failure to follow this step may lead to connectivity issues and crashes on both the donor and target machines.**

The restore process is outlined in [the section](mytonctrl-backup-restore.md).

Additionally, create and retain a backup of your standby node's original configuration before applying or restoring a backup package from another machine. You will need this backup to revert the standby node back to standby mode.

## Standby rollback

To transfer your validator configuration back to the main validator machine and restore the standby node, follow these steps:

1. Back up the active validator configuration from the standby node.
2. Transfer the configuration to the main validator machine according to the instructions provided earlier.
3. Restore the backup of the standby node's original configuration that you created before applying the validator configuration

<Feedback />

