# 工作流程

## 概览

### 通过 http bridge 的首次连接

1. 应用启动与bridge的 SSE 连接；
2. 应用通过通用链接、深链接或二维码将连接信息传递给钱包；
3. 钱包使用给定参数连接到bridge，并本地保存连接信息；
4. 钱包使用bridge将账户信息发送给应用；
5. 应用接收消息并本地保存连接信息；

### 与 http bridge 的重新连接

1. 应用从本地存储读取连接信息
2. 应用连接到bridge
3. 用户打开钱包，钱包使用存储的连接信息连接到bridge

### 通过 js bridge 的首次连接

1. 应用检查 `window.[walletJsBridgeKey].tonconnect` 的存在
2. 应用调用 `window.[walletJsBridgeKey].tonconnect.connect()` 并等待响应
3. 钱包将账户信息发送给应用；

### 发起普通请求和响应

1. 应用和钱包处于连接状态
2. 应用生成请求并将其发送给bridge
3. bridge将消息转发给钱包
4. 钱包生成响应并将其发送给bridge
5. bridge将消息转发给应用

## 规范

[这里](https://github.com/ton-blockchain/ton-connect/blob/main/workflows.md#details)读取详细规范。

## 另见

- [Ton Connect 概览](/dapps/ton-connect/)
- [集成手册](/develop/dapps/ton-connect/integration)
- [Telegram 机器人集成手册](/develop/dapps/ton-connect/tg-bot-integration)
