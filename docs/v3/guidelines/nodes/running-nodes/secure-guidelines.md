import Feedback from '@site/src/components/Feedback';

# Secure guidelines for nodes

Ensuring the security of nodes, particularly in decentralized networks such as blockchain or distributed systems, is essential for maintaining data integrity, confidentiality, and availability. The guidelines for securing nodes should cover several layers, including network communication, hardware, and software configurations. Below are a set of guidelines to enhance node security:

### 1. Use the server exclusively to operate the TON node:

* Using the server for additional tasks presents a potential security risk.

### 2. Update and patch regularly:

* Keep your system updated with the latest security patches.  
* Regularly use package management tools like apt (Debian/Ubuntu) or yum/dnf (CentOS/Fedora) to perform updates.

	```bash
	#Debian/Ubuntu
	sudo apt update && sudo  apt  upgrade  -y
	
	#CentOS
	sudo yum update && sudo yum upgrade -y

	#Fedora
	sudo dnf update && sudo dnf upgrade -y
	```

* Consider automating security updates by enabling unattended upgrades for your system.

### 3. Ensure a robust SSH configuration:

* **Disable root login:** Prevent root access through SSH by editing the `/etc/ssh/sshd_config` file.

	```bash
	PermitRootLogin no
	```
* **Use SSH keys:** For a more secure connection, opt for SSH keys instead of password authentication.
	```bash
	PasswordAuthentication no
	```
* **Modify the default SSH port:** Changing the default SSH port can help reduce automated brute-force attacks:

	```bash
	Port 2222
	```
*	**Restrict SSH access:** Allow SSH connections only from trusted IP addresses by implementing firewall rules.

### 4. Implement a firewall

* Set up a firewall to permit only essential services. Common tools are **ufw (Uncomplicated Firewall)** and **iptables**:

	```bash
	sudo ufw allow 22/tcp # Allow SSH
	sudo ufw allow 80/tcp # Allow HTTP
	sudo ufw allow 443/tcp # Allow HTTPS
	sudo ufw enable # Enable firewall
	```

### 5. Monitor logs

* Regularly monitor system logs to detect suspicious activities:
    *  `/var/log/auth.log` (for authentication attempts)
    *  `/var/log/syslog` or `/var/log/messages`
* Consider implementing centralized logging.

### 6. Limit user privileges

* Grant root or sudo privileges only to trusted users. Use the sudo command carefully and audit the `/etc/sudoers` file to limit access.

* Regularly review user accounts and remove any unnecessary or inactive users.

### 7. Utilize SELinux or AppArmor

*  **SELinux** (on RHEL/CentOS) and **AppArmor** (on Ubuntu/Debian) provide mandatory access control, adding an extra layer of security by restricting programs from accessing specific system resources.

### 8. Install security tools

* Utilize tools such as **Lynis** to conduct regular security audits and identify potential vulnerabilities:

	```bash
	sudo apt install lynis
	sudo lynis audit system
	```

### 9. Disable unnecessary services 

* To minimize the attack surface, disable or remove any unused services. For instance, if FTP or mail services are not needed, ensure to disable them: 

	```bash
	sudo systemctl disable service_name
	```

### 10. Implement intrusion detection and prevention systems (IDS/IPS)

* Use tools like **Fail2ban** to block IP addresses after multiple failed login attempts:

	```bash
	sudo apt install fail2ban
	```

* Utilize **AIDE (Advanced Intrusion Detection Environment)** to monitor file integrity and identify any unauthorized changes.

:::caution
Please remain vigilant and ensure that your node is secure at all times.
:::
<Feedback />

