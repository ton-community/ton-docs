# Secure guidelines for Nodes

Ensuring the security of nodes, especially in decentralized networks like blockchain or distributed systems, is crucial to maintain the integrity, confidentiality, and availability of data. The guidelines for securing nodes should address various layers, from network communication to hardware and software configurations. Here's a set of secure guidelines for nodes:

### 1. Use the server only to run TON Node
   * Using the server for other tasks poses a potential security risk

### 2. Update and Patch Regularly
   * Ensure that your system is always up-to-date with the latest security patches.
   * Use package management tools like apt (for Debian/Ubuntu) or yum/dnf (for CentOS/Fedora) to update regularly:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
   * Consider automating security updates by enabling unattended upgrades.

### 3. Use Strong SSH Configuration
   * Disable Root Login: Prevent root access via SSH. Edit the /etc/ssh/sshd_config file:
   ```bash
   PermitRootLogin no
   ```
   * Use SSH Keys: Avoid password authentication and use SSH keys instead.
   ```bash
   PasswordAuthentication no
   ```
   * Change Default SSH Port: Moving SSH to a non-standard port can reduce automated brute-force attacks. For example:
   ```bash
   Port 2222
   ```
   * Limit SSH Access: Only allow SSH from trusted IPs using firewall rules

### 4. Implement a Firewall
   * Configure a firewall to allow only necessary services. Common tools are ufw (Uncomplicated Firewall) or iptables:
   ```bash
   sudo ufw allow 22/tcp   # Allow SSH
   sudo ufw allow 80/tcp   # Allow HTTP
   sudo ufw allow 443/tcp  # Allow HTTPS
   sudo ufw enable         # Enable firewall
   ```

### 5. Monitor Logs
   * Regularly monitor system logs to identify suspicious activity:
     * _/var/log/auth.log_ (for authentication attempts)
     * _/var/log/syslog_ or _/var/log/messages_
   * Consider centralized logging

### 6. Limit User Privileges
   * Only provide root or sudo privileges to trusted users. Use the sudo command with care and audit _/etc/sudoers_ to minimize access.
   * Regularly review user accounts and remove unnecessary or inactive users.

### 7. Configure SELinux or AppArmor
   * **SELinux** (on RHEL/CentOS) and **AppArmor** (on Ubuntu/Debian) provide mandatory access control, adding an additional layer of security by restricting programs from accessing specific system resources.

### 8. Install Security Tools
   * Use tools like Lynis to perform regular security audits and identify potential vulnerabilities:
   ```bash
   sudo apt install lynis
   sudo lynis audit system
   ```
### 9. Disable Unnecessary Services
   * Disable or remove unused services to minimize the attack surface. For example, if you don’t need FTP or mail services, disable them using:
   ```bash
   sudo systemctl disable service_name
   ```
### 10. Use Intrusion Detection and Prevention Systems (IDS/IPS)
   * Install tools like Fail2ban to block IP addresses after too many failed login attempts:
   ```bash
   sudo apt install fail2ban
   ```
   * Use AIDE (Advanced Intrusion Detection Environment) to monitor file integrity and detect unauthorized changes.
