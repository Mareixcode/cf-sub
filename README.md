# 🚀 Cloudflare Workers Multi-Client Subscription Converter & Chain Proxy (`cf-sub`)

<p align="center">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

> ⚡ 一个完全部署在 **Cloudflare Workers (Module Worker)** 的多客户端开源机场订阅转换服务与全协议家宽链式代理 (Exit Proxy / `dialer-proxy` / `detour` / `under-proxy`) 节点注入工具。

---

## 📖 项目简介

`cf-sub` 旨在将标准的机场节点订阅转化为支持多客户端格式（**Clash / Mihomo**、**Sing-box**、**Surge**、**Quantumult X**、**Shadowrocket**）的配置。通过为机场节点自动附加后置家宽代理（支持 SOCKS5, HTTP, HTTPS, SS, Trojan, VLESS 出口），用户能够以家宽 IP 作为终点出口访问网络，同时保留机场原生节点的高速传输能力与原有客户端的复杂分流策略。

无需自建服务器，利用 Cloudflare Workers 的边缘无服务器架构，毫秒级响应且全免费部署。

---

## 🌟 核心特性

- 🌐 **多客户端无缝转换 (Multi-Client Support)**：
  - **Clash / Mihomo** (YAML) -> 利用 `dialer-proxy` 链式代理
  - **Sing-box** (JSON 1.8+) -> 利用 `detour` 链式代理
  - **Surge** (.conf) -> 利用 `under-proxy` 链式代理
  - **Quantumult X** -> 策略组与节点转换
  - **Shadowrocket / 通用节点** -> Base64 编码与单行 URI 列表
- 🛡️ **家宽敏感信息零暴露防护 (Privacy First)**：支持在 Workers 环境变量中存储家宽 IP、端口与密码，生成的订阅链接极简隐蔽，彻底告别参数暴露。
- 📊 **剩余流量与到期时间透传 (Subscription Userinfo)**：自动提取与透传机场 `subscription-userinfo` Header，在客户端卡片及 Web UI 中直观展示已用流量、剩余流量及到期倒计时。
- 🎨 **完整 Emoji 图标保留与美化**：保留机场原有国旗 Emoji（🇺🇸, 🇯🇵, 🇭🇰），并为策略组与出口节点匹配精美图标（🏠 🚀 ⚡ ✉️）。
- 🔗 **一键客户端导入 Scheme 唤起**：网页控制台可一键生成并调用 `clash://`, `sing-box://`, `surge://`, `sub://` 客户端快捷导入链接。
- ⚡ **100% Serverless 架构**：基于 TypeScript Module Worker 与 `wrangler.jsonc` 配置文件，开箱即用。

---

## 🏗️ 工作原理

```text
[ 用户客户端 (Clash / Sing-box / Surge) ] 
            │
            ▼ (访问目标网站)
    [ 前置节点 (机场节点) ] ── (中继流量) ──► [ 出口节点 (家宽出口) ] ──► [ 目标网站 ]
```

---

## ⚡ 极简部署指南

### 方式一：网页一键部署 (推荐)

点击下方按钮，登录 Cloudflare 账号即可完成部署：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mareixcode/cf-sub)

---

### 方式二：命令行部署 (Wrangler CLI)

```bash
# 1. 克隆项目仓库
git clone https://github.com/Mareixcode/cf-sub.git
cd cf-sub

# 2. 安装依赖
npm install

# 3. 部署至 Cloudflare Workers
npx wrangler deploy
```

---

## ⚙️ 配置说明

### 方法 A：使用 Web UI 界面 (隐蔽与可视化)

打开部署好的 Worker 网址，在可视化控制台中填入机场订阅，选择目标客户端与家宽出口协议（若家宽信息已配置在环境变量中，可保持留空），点击**生成订阅链接**或**一键导入客户端**。

### 方法 B：Cloudflare 后台环境变量配置 (推荐，零暴露链接)

前往 Cloudflare Dashboard -> **Workers & Pages** -> 选择您的 Worker -> **Settings** -> **Variables**，添加以下环境变量：

| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `SOCKS_TYPE` | 出口协议类型 (`socks5` \| `http` \| `https` \| `ss` \| `trojan` \| `vless`) | `socks5` |
| `SOCKS_SERVER` | 家宽出口服务器 IP 或域名 | `1.2.3.4` 或 `exit.example.com` |
| `SOCKS_PORT` | 出口服务端口 | `1080` |
| `SOCKS_USERNAME` | 认证用户名 (可选) | `user` |
| `SOCKS_PASSWORD` | 认证密码 (可选) | `pass` |

---

## 📡 API 路由与动态参数

- **订阅转换端点**：`GET /sub`
  - `url`: 原始机场订阅 URL（需 URL 编码）
  - `target`: 目标客户端 (`clash`, `singbox`, `surge`, `quanx`, `shadowrocket`)
  - `socks_type`: 出口协议类型 (`socks5`, `http`, `https`, `ss`, `trojan`, `vless`)
  - `socks_server`: 家宽出口 IP/域名 (可选)
  - `socks_port`: 家宽出口端口 (Optional)

---

## 🙏 致谢 (Credits & Acknowledgments)

本项目在开发与协议转换架构设计过程中，灵感与规则规范借鉴并致谢以下优秀的开源项目：

- **[tindy2013/subconverter](https://github.com/tindy2013/subconverter)** - 强大的全功能订阅转换工具与客户端转换规范标杆。
- **[Metacubex/mihomo](https://github.com/Metacubex/mihomo)** - 优秀的 Clash Meta 内核，全面支持 `dialer-proxy` 链式代理。
- **[SagerNet/sing-box](https://github.com/SagerNet/sing-box)** - 新一代通用网络代理平台，提供卓越的 `detour` 链式代理性能。
- **[Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)** - 精品分流规则集。
- **[ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)** - 经典灵活的策略组与规则定义。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。

