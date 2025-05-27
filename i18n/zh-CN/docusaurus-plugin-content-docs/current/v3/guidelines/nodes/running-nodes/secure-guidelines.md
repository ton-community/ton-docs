# 节点安全准则

确保节点的安全性，尤其是在区块链或分布式系统等去中心化网络中，对于维护数据的完整性、保密性和可用性至关重要。节点安全指南应涉及从网络通信到硬件和软件配置的各个层面。下面是一套节点安全指南：

### 1. 仅使用服务器运行 TON 节点

- 使用服务器执行其他任务会带来潜在的安全风险

### 2. 定期更新和打补丁

- 确保您的系统始终使用最新的安全补丁。
- 使用软件包管理工具，如 apt（适用于 Debian/Ubuntu）或 yum/dnf（适用于 CentOS/Fedora），定期更新：

```bash
sudo apt update && sudo apt upgrade -y
```

- 考虑通过启用无人值守升级来自动进行安全更新。

### 3. 使用强 SSH 配置

- 禁用 Root 登录：防止通过 SSH 进行 root 访问。编辑 /etc/ssh/sshd_config 文件：

```bash
PermitRootLogin no
```

- 使用 SSH 密钥：避免使用密码验证，改用 SSH 密钥。

```bash
PasswordAuthentication no
```

- 更改 SSH 默认端口：将 SSH 改为非标准端口可减少自动暴力破解攻击。例如

```bash
Port 2222
```

- 限制 SSH 访问：使用防火墙规则，只允许来自受信任 IP 的 SSH 访问

### 4. 安装防火墙

- 配置防火墙，只允许必要的服务。常用的工具有 ufw（简易防火墙）或 iptables：

```bash
sudo ufw allow 22/tcp   # Allow SSH
sudo ufw allow 80/tcp   # Allow HTTP
sudo ufw allow 443/tcp  # Allow HTTPS
sudo ufw enable         # Enable firewall
```

### 5. 监控日志

- 定期监控系统日志，识别可疑活动：
  - */var/log/auth.log*（用于验证尝试）
  - */var/log/syslog* 或 */var/log/messages*。
- 考虑集中登录

### 6. 限制用户权限

- 只为受信任的用户提供 root 或 sudo 权限。谨慎使用 sudo 命令，并审计 */etc/sudoers*，以尽量减少访问权限。
- 定期检查用户账户，删除不必要或不活跃的用户。

### 7. 配置 SELinux 或 AppArmor

- **SELinux**（在 RHEL/CentOS 上）和**AppArmor**（在 Ubuntu/Debian 上）提供强制访问控制，通过限制程序访问特定系统资源，增加了一层额外的安全性。

### 8. 安装安全工具

- 使用 Lynis 等工具定期进行安全审计，找出潜在漏洞：

```bash
sudo apt install lynis
sudo lynis audit system
```

### 9. 停用不必要的服务

- 禁用或删除不使用的服务，以尽量减少攻击面。例如，如果您不需要 FTP 或邮件服务，请禁用它们：

```bash
sudo systemctl disable service_name
```

### 10. 使用入侵检测和防御系统（IDS/IPS）

- 安装 Fail2ban 等工具，在尝试登录失败次数过多后阻止 IP 地址：

```bash
sudo apt install fail2ban
```

- 使用 AIDE（高级入侵检测环境）监控文件完整性并检测未经授权的更改。
