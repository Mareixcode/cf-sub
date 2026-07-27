# Cloudflare Workers Subscription Converter & SOCKS5 Chain Proxy (cf-cub)

一个部署在 **Cloudflare Workers** 的开源机场订阅转换服务与 SOCKS5 链式代理 Exit 节点注入工具。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mareixcode/cf-cub)
[![License: MIT](https://img.shields.com/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.com/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.com/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

---

## ⚡ 30 秒极简部署

选择以下 **任意一种** 方式即可完成部署：

### 方式一：一键网页部署 (推荐，无需本地环境)

点击下方按钮，登录 Cloudflare 网页上一键自动完成部署：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mareixcode/cf-cub)

---

### 方式二：命令行 3 步部署

复制粘贴以下 3 行命令：

```bash
git clone https://github.com/Mareixcode/cf-cub.git
cd cf-cub && npm install
npx wrangler deploy
```

---

## ⚙️ 环境变量配置 (可选)

部署成功后，配置您的家宽 SOCKS5 出口参数（两种）：

- **方法 A (Web UI 界面直接填)**：直接在浏览器打开部署好的 Worker 网址，在网页界面上直接填入 SOCKS5 IP、端口、账号和密码。
- **方法 B (Cloudflare 环境变量)**：在 Cloudflare Dashboard -> Worker -> **Settings** -> **Variables** 中添加环境变量：
  - `SOCKS_SERVER`: SOCKS5 服务器 IP/域名
  - `SOCKS_PORT`: SOCKS5 端口
  - `SOCKS_USERNAME`: 认证用户名
  - `SOCKS_PASSWORD`: 认证密码

---

## 🌟 核心特性

- **Module Worker & Wrangler JSONC 架构**：采用最新标准 TypeScript Module Worker 导出与 `wrangler.jsonc` 配置文件。
- **SOCKS5 链式代理 (Exit Proxy)**：将机场节点作为前置，家宽 SOCKS5 作为后置 Exit 出口 (`dialer-proxy: 前置节点`)，不改变原本的分流规则与策略组。
- **严格隐私安全**：代码与配置文件零硬编码隐私信息，支持环境变量与 URL 动态查询参数。
- **智能订阅格式解析**：支持自动检测解析 Base64 节点列表、Clash YAML 配置以及单行节点 URI 列表 (SS / Vmess / Trojan / Vless / Hysteria2)。
- **yantao.wiki 极客控制台**：集成科技风 Terminal 调试控制台，支持在线一键解析测试与 Clash 客户端快速导入。
- **Cloudflare Cache API**：针对 `/sub` 自动边缘缓存 300 秒，减少对机场源站的频繁请求。

## 📄 License

[MIT License](LICENSE) &copy; 2026 [Mareixcode](https://github.com/Mareixcode)
