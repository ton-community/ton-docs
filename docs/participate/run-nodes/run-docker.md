# Run MyTonCtrl in Docker

## Hardware requirements:

* 16 cores CPU
* 128 GB RAM
* 1TB NVME SSD OR Provisioned 64+k IOPS storage
* 1 Gbit/s network connectivity
* Public IP address (fixed IP address)
* 16 TB/month traffic on peak load

**_Not recommended!_** **_For testing purposes only!_**

Variable **IGNORE_MINIMAL_REQS=true** turns off requirements verification of CPU/RAM.

## Software requirements:

* docker-ce
* docker-ce-cli
* containerd.io
* docker-buildx-plugin
* docker-compose-plugin

  _Installation guide in official [Docker](https://docs.docker.com/engine/install/)_

## Tested operational systems:

* Ubuntu 20.04
* Ubuntu 22.04
* Ubuntu 24.04
* Debian 11
* Debian 12

## Installation and start MyTonCtrl:

1. Clone the last version of the repository
```bash
git clone https://github.com/ton-community/ton-docker-ctrl.git
```
2. Go to directory
```bash
cd ./ton-docker-ctrl
```
3. Indicate the necessary values in the .env file
```bash
vi .env
```
4. Initiate assembling of docker image. This step involves the compilation of the latest versions of fift, validator-engine, lite-client, etc., as well as the installation and initial setup of MyTonCtrl.
```bash
docker compose build ton-node
```
5. Start of MyTonCtrl
```bash
docker compose up -d
```
## Variables setting:

Variables indicated in the file .env
* **GLOBAL_CONFIG_URL** - Network configs of TON Blockchain (default: [Testnet](https://ton.org/testnet-global.config.json))
* **MYTONCTRL_VERSION** - Git branch  from which MyTonCtrl assembled
* **TELEMETRY** - Enabling/Disabling telemetry
* **MODE** - Set MyTonCtrl in the indicated mode (validator or liteserver)
* **IGNORE_MINIMAL_REQS** - Ignore hardware requirements

## Stop and delete MyTonCtrl:

1. Stop container
```bash
docker compose stop
```
2. Delete container
```bash
docker compose down
```
3. Delete container with data
```bash
docker compose down --volumes
```
## Connection to  MyTonCtrl:
```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```
As soon as get connected it is possible to check the status by using the command `status`
```bash
MyTonCtrl> status
```
![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

Reflects the list of accessible commands `help`
```bash
MyTonCtrl> help
```
## Review of MyTonCtrl logs:
```bash
docker compose logs
```
## Updates of MyTonCtrl and TON:

To get the last versions of TON validator and MyTonCtrl, it is necessary to go to catalogue with  docker-compose.yml and make assembling
```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```
Once finished, start Docker Compose again
```bash
docker compose up -d
```
When connected to MyTonCtrl, an automatic verification for updates is performed. If any updates are detected, a message is displayed"_MyTonCtrl update available. Please update it with `update` command._"

Update is done using the update command by specifying the necessary branch
```bash
MyTonCtrl> update mytonctrl2
```
## Change of data storage path:

By default TON and Mytoncore works are stored in **/var/lib/docker/volumes/**

You can change it in the file docker-compose.yml, by indicating the required route in **volumes** section
