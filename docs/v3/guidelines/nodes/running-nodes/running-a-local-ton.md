import Feedback from '@site/src/components/Feedback';

# Running a local TON

MyLocalTon is your personal blockchain development environment, running directly on your local computer. This comprehensive guide covers the installation, configuration, and operation of this powerful development tool.

## MyLocalTon user guide

### Prerequisites

Before starting, ensure your system meets these requirements:

-   Java version 21 or higher
-   Python 3.x for HTTP API integration
-   Windows users must install Microsoft Visual C++ Redistributable 2015+ x64    

### Installation process

#### Windows installation steps

- Install Microsoft Visual C++ Redistributable 2015+ x64
- Download the correct JAR file based on your system architecture:
    -   For x86-64 systems: `MyLocalTon-x86-64.jar`
    -   For ARM64 systems: `MyLocalTon-arm64.jar`

#### Linux/MacOS Installation Steps

```bash
# For x86-64 systems
wget https://github.com/neodix42/MyLocalTon/releases/latest/download/MyLocalTon-x86-64.jar 
# For ARM64 systems
wget https://github.com/neodix42/MyLocalTon/releases/latest/download/MyLocalTon-arm64.jar
```

#### Building from source

##### Prerequisites setup

```bash
# Install Java Development Kit (JDK)  
sudo  apt  install default-jdk 
# Install Apache Ant build tool  
sudo  apt  install ant 
# Install Maven build automation tool  
sudo  apt  install maven
```

##### Clone and build

```bash
git clone https://github.com/neodix42/MyLocalTon.git
cd MyLocalTon
mvn clean package assembly:single
```

##### Locate built artifacts

After successful compilation, find your built artifacts in the `target` directory:

-   `MyLocalTon-x86_64.jar` for x86-64 systems
-   `MyLocalTon-arm64.jar` for ARM64 systems

### Basic operation

Launch MyLocalTon using Java:

```bash
# For x86-64 systems  
java -jar MyLocalTon-x86-64.jar

# For ARM64 systems  
java -jar MyLocalTon-arm64.jar`
```
#### Command line options

MyLocalTon accepts several parameters to customize its operation:

-   `nogui`: Run without graphical interface
-   `ton-http-api`: Enable HTTP API functionality
-   `explorer`: Launch explorer interface
-   `ip.addr.xxx.xxx`: Set custom IP address
-   `with-validators-N`: Specify number of validators to start
-   `custom-binaries=absolute-path`: Use custom binaries
-   `debug`: Enable debug mode

For complete technical details, [see](https://github.com/neodix42/MyLocalTon?tab=readme-ov-file#parameters).

MyLocalTon features a user-friendly interface:
![](/img/docs/mylocalton.jpeg)
![](/img/docs/mylocalton-demo.gif)

### Lite-client access setup

MyLocalTon generates permanent private/public keys for secure lite-server and validator-engine-console connections:

To establish a lite-client connection:

```bash
lite-client -a 127.0.0.1:4443 -b E7XwFSQzNkcRepUC23J2nRpASXpnsEKmyyHYV4u/FZY= -c last
```

To access validator-engine-console:

```bash
validator-engine-console -a 127.0.0.1:4441 -k <absolute-path>/myLocalTon/genesis/bin/certs/client -p <absolute-path>/myLocalTon/genesis/bin/certs/server.pub
```

### Monitoring your system

Track MyLocalTon's operation through these log files:

-   Main application logs: `./myLocalTon/MyLocalTon.log`
-   Validator-engine logs: `./myLocalTon/genesis/db/log`

### Troubleshooting guide

- Run MyLocalTon in debug mode:

  ```bash
  java -jar MyLocalTon*.jar debug
  ```
- Check log files for error messages
- Verify system requirements are met

### Essential information

1.  System compatibility matrix:
    
    | Operating System |  Architecture      | Supported |
    | --------------------  | ---------------       |  ----------- |
    | Linux                 |  x86_64               |  ✅          |
    | Linux                 |  arm64/aarch64        |  ✅          |
    | MacOS                 |   x86_64 (12+)        |  ✅          |
    | MacOS                 |  arm64/aarch64        |  ✅          |
    | Windows               |  x86_64.              |  ✅          |
    
2.  MacOS users note
    
    If you use MacPorts instead of Homebrew, execute these commands:
     ```bash
    mkdir -p /usr/local/opt/readline/lib
    ln -s /opt/local/lib/libreadline.8.dylib /usr/local/opt/readline/lib
    ```
    
3. Upgrade process :
    
    Currently, upgrading requires these steps:
    
    - Download the latest version
    - Replace the existing MyLocalTon file
    - Remove the myLocalTon directory
    
    Developers are planning to include direct upgrade functionality in future releases.
    
4.  HTTP API integration:
    
    ```bash
    # Linux Installation  
    sudo  apt  install -y python3 
    sudo  apt  install -y      
    python3-pip pip3 install --user ton-http-api 
    
    # MacOS Installation  
    brew install -q python3 
    python3 -m ensurepip --upgrade
    pip3 install --user ton-http-api 
    
    # Windows Installation  
    wget https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe    
    python -m ensurepip --upgrade
    start pip3 install -U ton-http-api`
    
### Important notice

:::caution
Developers currently classify MyLocalTon as alpha software, making it unsuitable for production environments. For containerized deployment, developers recommend using the  [dedicated Docker repository](https://github.com/neodix42/mylocalton-docker).
:::

### Resources

* [MyLocalTon binaries](https://github.com/neodiX42/MyLocalTon/releases)

* [MyLocalTon source code](https://github.com/neodiX42/MyLocalTon)
<Feedback />

