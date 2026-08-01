# ⚡ cf-sub — 多客户端订阅转换器 & 家宽链式代理

<p align="center">
  <a href="https://workers.cloudflare.com/" target="_blank">
    <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-4CAF50?style=flat-square&logo=open-source-initiative&logoColor=white" alt="License" />
  </a>
  <a href="https://github.com/Mareixcode/cf-sub">
    <img src="https://img.shields.io/github/stars/Mareixcode/cf-sub?style=flat-square&logo=github" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/Mareixcode/cf-sub/commits/main">
    <img src="https://img.shields.io/github/last-commit/Mareixcode/cf-sub?style=flat-square&logo=git&logoColor=white" alt="Last Commit" />
  </a>
</p>

> 🚀 一个运行在 Cloudflare Workers 上的机场订阅转换工具，自动为节点附加**家宽链式代理出口**，一套订阅通吃全部主流客户端。

---

## 📖 项目简介

`cf-sub` 将标准的机场节点订阅转换为支持多客户端格式的配置：**Clash / Mihomo**、**Sing-box**、**Surge**、**Quantumult X**、**Shadowrocket**。

同时可为机场节点自动附加后置家宽代理（支持 **SOCKS5 / HTTP / HTTPS / SS / Trojan / VLESS** 出口协议），以家宽 IP 作为最终出口，在保留机场原生节点与原有分流策略的前提下，实现"机场前置 + 家宽出口"的链式代理。

---

## 🌟 核心特性

- 🌐 **多客户端格式**
  - **Clash / Mihomo** (YAML) — 利用 `dialer-proxy` 链式代理
  - **Sing-box** (JSON 1.8+) — 利用 `detour` 链式代理
  - **Surge** (.conf) — 利用 `under-proxy` 链式代理
  - **Quantumult X** — 策略组与节点转换
  - **Shadowrocket / 通用节点** — Base64 编码与单行 URI 列表
- 🛡️ **家宽敏感信息零暴露** — 家宽 IP、端口、密码仅存于 Workers 环境变量，不写入任何客户端配置
- 📊 **流量与到期展示** — 在客户端卡片及 Web UI 直观展示已用 / 剩余流量与到期倒计时
- 🔗 **一键客户端导入** — 生成 `clash://`、`sing-box://`、`surge://`、`sub://` 快捷导入链接
- ⚡ **Cloudflare Cache API 缓存** — `/sub` 结果缓存 300 秒，降低上游订阅压力、加速响应
- 🔌 **GET / HEAD 请求白名单** — 仅处理转换请求，返回规范的 JSON 错误

---

## 🏗️ 工作原理

```text
[ 用户客户端 (Clash / Sing-box / Surge / ...) ]
            │
            ▼ (访问目标网站)
    [ 前置节点 (机场节点) ] ──(中继流量)──► [ 出口节点 (家宽出口) ] ──► [ 目标网站 ]
```

机场节点负责接入与加速，家宽节点作为最终出口，两者通过各客户端的链式代理机制（`dialer-proxy` / `detour` / `under-proxy`）串联，原生分流策略不受影响。

---

## ⚡ 快速部署

### 方式一：网页一键部署（推荐）

1. Fork 本仓库
2. 点击下方按钮，登录 Cloudflare 账号并连接你 Fork 的仓库

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mareixcode/cf-sub)

### 方式二：Wrangler CLI 部署

```bash
git clone https://github.com/Mareixcode/cf-sub.git
cd cf-sub
npm install
npx wrangler deploy
```

---

## ⚙️ 配置说明

### 方法 A：Web UI 界面

访问 Worker 根路径（`/`）或 `/ui`，填入机场订阅地址，选择目标客户端与家宽出口协议，点击**生成订阅链接**或**一键导入客户端**。家宽信息若已配置在环境变量中，可留空。

### 方法 B：环境变量配置（推荐）

Cloudflare Dashboard → **Workers & Pages** → 选择 Worker → **Settings** → **Variables**：

| 变量名 | 说明 | 示例 |
| :--- | :--- | :--- |
| `SOCKS_TYPE` | 出口协议类型（`socks5` \| `http` \| `https` \| `ss` \| `trojan` \| `vless`） | `socks5` |
| `SOCKS_SERVER` | 家宽出口服务器 IP 或域名 | `1.2.3.4` 或 `exit.example.com` |
| `SOCKS_PORT` | 出口服务端口 | `1080` |
| `SOCKS_USERNAME` | 认证用户名（可选） | `user` |
| `SOCKS_PASSWORD` | 认证密码（可选） | `pass` |

---

## 📡 API 路由

| 路由 | 说明 |
| :--- | :--- |
| `GET /` | 服务信息（JSON） |
| `GET /ui` | Web UI 配置页面 |
| `GET /health` | 健康检查 |
| `GET /version` | 版本信息 |
| `GET /sub` | 订阅转换端点（Cloudflare Cache 缓存 300s） |

### `/sub` 动态参数

- `url` — 原始机场订阅 URL（需 URL 编码）
- `target` — 目标客户端：`clash` / `singbox` / `surge` / `quanx` / `shadowrocket`
- `socks_type` — 出口协议类型：`socks5` / `http` / `https` / `ss` / `trojan` / `vless`
- `socks_server` — 家宽出口 IP / 域名（可选）
- `socks_port` — 家宽出口端口（可选）

---

## 🛠️ 开发

```bash
npm install     # 安装依赖
npm run dev     # 本地开发 (wrangler dev)
npm run typecheck   # TypeScript 类型检查
npm run deploy  # 部署到 Cloudflare Workers
```

推送 / PR 至 `dev` 分支将自动触发 GitHub Actions：TypeScript 类型检查 + 自动部署（需配置 `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID` Secrets）。

---

## 🙏 致谢

- [tindy2013/subconverter](https://github.com/tindy2013/subconverter) — 订阅转换工具与客户端转换
- [Metacubex/mihomo](https://github.com/Metacubex/mihomo) — Clash Meta 内核
- [SagerNet/sing-box](https://github.com/SagerNet/sing-box) — 网络代理工具
- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) — 分流规则集
- [ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR) — 策略组与规则定义
- 感谢 [LINUX DO](https://linux.do) 社区开发者的支持

<a href="https://linux.do?ref=seal-click" target="_blank" rel="noopener noreferrer" title="Powered by LINUX DO">
  <img src="https://linuxdo-seal.cuishushu.com/seals/seal-support-by.svg" alt="SUPPORT by LINUX DO" width="130" height="55" />
</a>

---

## ⚠️ 免责声明

1. **仅供学习交流**：本项目仅供网络技术研究、开源代码学习及个人测试使用，请勿用于任何违反所在国家或地区法律法规的用途。
2. **风险自负**：使用者应自行承担部署和使用风险，开发者不对因使用、复制、修改或分发本软件产生的任何直接或间接损失、法律纠纷、设备故障或安全后果负责。
3. **第三方服务**：本项目依赖 Cloudflare Workers 及第三方订阅节点，其稳定性、安全性及合法性由对应服务提供方负责。
4. **合规使用**：请严格遵守所在国家 / 地区的法律法规及网络管理规定，因违规使用产生的法律后果由使用者自行承担。

---

## 📬 联系方式

- 开发者：MareixHunk
- Email：[ceohunk@gmail.com](mailto:ceohunk@gmail.com)
- GitHub：[Mareixcode](https://github.com/Mareixcode)

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。
