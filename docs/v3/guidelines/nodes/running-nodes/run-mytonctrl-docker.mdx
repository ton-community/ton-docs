import Feedback from '@site/src/components/Feedback';

# Running MyTonCtrl in Docker

This guide provides a step-by-step process for installing MyTonCtrl using Docker.

## Hardware requirements

To ensure an optimal experience while running MyTonCtrl, here are the recommended hardware specifications:

- 16-core CPU
- 128 GB RAM
- 1TB NVME SSD or provisioned 64+k IOPS storage
- 1 Gbit/s network connectivity
- Public IP address (fixed IP address)
- 16 TB/month traffic on peak load

:::warning 
 This setup is primarily intended for testing purposes, so it may not be suitable for production environments. If you’d like to bypass hardware checks for any reason, you can easily do this by setting the variable ``IGNORE_MINIMAL_REQS=true``.
:::
## Software requirements

To get started, please ensure you have the following software installed:

- Docker CE  
- Docker CE CLI  
- Containerd.io  
- Docker Buildx Plugin  
- Docker Compose Plugin  

For detailed installation instructions, see the official [Docker installation guide](https://docs.docker.com/engine/install/).

## Tested operating systems

We’ve successfully tested MyTonCtrl on these operating systems:

- Ubuntu 20.04  
- Ubuntu 22.04  
- Ubuntu 24.04  
- Debian 11  
- Debian 12  

## Running MyTonCtrl v2 using the official Docker image

Here’s how you can pull the image and set up your MyTonCtrl node:

```bash
docker run -d --name ton-node -v <YOUR_LOCAL_FOLDER>:/var/ton-work -it ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Installing and starting MyTonCtrl from source

If you prefer to install from source, just follow these easy steps:

1. Clone the repository with the latest version:

```bash
git clone https://github.com/ton-blockchain/ton-docker-ctrl.git
```

2. Change into the project directory:

```bash
cd ./ton-docker-ctrl
```

3. Open the `.env` file and make any necessary updates:

```bash
vi .env
```

4. Next, build the Docker image, which will set up everything you need—compiling the latest versions of fift, validator-engine, lite-client, and more:

```bash
docker compose build ton-node
```

5. Finally, start MyTonCtrl:

```bash
docker compose up -d
```

## Migrating a non-Docker full node or validator to a Dockerized MyTonCtrl v2

If you want to transition your existing TON setup to a Dockerized version, specify the paths for your TON binaries, source files, work directory, and MyTonCtrl settings:

```bash
docker run -d --name ton-node --restart always \
-v <EXISTING_TON_WORK_FOLDER>:/var/ton-work \
-v /usr/bin/ton:/usr/bin/ton \
-v /usr/src/ton:/usr/src/ton \
-v /home/<USER>/.local/share:/usr/local/bin \
ghcr.io/ton-blockchain/ton-docker-ctrl:latest
```

## Variable settings

In the `.env` file, you can configure the following variables:

- ``GLOBAL_CONFIG_URL``: Points to the network configurations for the TON Blockchain (default: [Testnet](https://ton.org/testnet-global.config.json))  
- ``MYTONCTRL_VERSION``: Indicates the Git branch used for assembling MyTonCtrl  
- ``TELEMETRY``: Turn telemetry on or off  
- ``MODE``: Define the mode for MyTonCtrl (either validator or liteserver)  
- ``IGNORE_MINIMAL_REQS``: Option to bypass hardware requirements  

## Stopping and deleting MyTonCtrl

When it’s time to stop or remove your MyTonCtrl setup, here’s how you can do it:

1. Stop the container:

```bash
docker compose stop
```

2. Delete the container:

```bash
docker compose down
```

3. To completely remove the container along with its data:

```bash
docker compose down --volumes
```

## Connecting to MyTonCtrl

You can easily connect to MyTonCtrl using this command:

```bash
docker compose exec -it ton-node bash -c "mytonctrl"
```

Once connected, check the status with:

```bash
MyTonCtrl> status
```
![](https://raw.githubusercontent.com/ton-blockchain/mytonctrl/master/screens/mytonctrl-status.png)

And if you would like to see a list of commands you can use, simply enter:

```bash
MyTonCtrl> help
```

## Reviewing MyTonCtrl logs

Monitoring the situation is simple, as you can easily view the logs:

```bash
docker compose logs
```

## Updating MyTonCtrl and TON

Updating your version of TON and MyTonCtrl is easy: just navigate to the directory containing your `docker-compose.yml` file and rebuild.

```bash
cd ./ton-docker-ctrl
docker compose build ton-node
```

After that, restart Docker Compose:

```bash
docker compose up -d
```

When you’re connected to MyTonCtrl, it will automatically check for updates. If any are available, you’ll see a message saying, “``MyTonCtrl update available. Please update it with the `update` command``”.  To do the update, use the command below and specify the branch you want:

```bash
MyTonCtrl> update mytonctrl2
```

## Changing the data storage path

TON and MyTonCore data is stored in ``/var/lib/docker/volumes/``by default. If you wish to change this storage path, update the required route in the ``volumes`` section of your `docker-compose.yml` file to fit your needs. 
<Feedback />

