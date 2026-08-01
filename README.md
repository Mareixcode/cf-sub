# 🚀 多客户端订阅转换器与链式代理(`cf-sub`)

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

> ⚡ 一个多客户端机场订阅转换工具与家宽链式代理节点注入工具

---

## 📖 项目简介

`cf-sub` 可以将标准的机场节点订阅转化为支持多客户端格式（**Clash / Mihomo**、**Sing-box**、**Surge**、**Quantumult X**、**Shadowrocket**）的配置。为机场节点自动附加后置家宽代理（支持 SOCKS5, HTTP, HTTPS, SS, Trojan, VLESS 出口），以家宽 IP 作为终点出口，同时保留机场原生节点与原有的分流策略。

---

## 🌟 核心特性

- 🌐 **多客户端**：
  - **Clash / Mihomo** (YAML) -> 利用 `dialer-proxy` 链式代理
  - **Sing-box** (JSON 1.8+) -> 利用 `detour` 链式代理
  - **Surge** (.conf) -> 利用 `under-proxy` 链式代理
  - **Quantumult X** -> 策略组与节点转换
  - **Shadowrocket / 通用节点** -> Base64 编码与单行 URI 列表
- 🛡️ **家宽敏感信息零暴露**：支持在 Workers 环境变量中存储家宽 IP、端口与密码。
- 📊 **剩余流量与到期时间显示**：在客户端卡片及 Web UI 中直观展示已用流量、剩余流量及到期倒计时。
- 🔗 **一键客户端导入**：可一键生成并调用 `clash://`, `sing-box://`, `surge://`, `sub://` 客户端快捷导入链接。
---

## 🏗️ 工作原理

```text
[ 用户客户端 (Clash / Sing-box / Surge) ] 
            │
            ▼ (访问目标网站)
    [ 前置节点 (机场节点) ] ── (中继流量) ──► [ 出口节点 (家宽出口) ] ──► [ 目标网站 ]
```

---

## ⚡ 部署指南

### 方式一：网页一键部署 (推荐)
1、Fork 本仓库

2、点击下方按钮，登录 Cloudflare 账号

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mareixcode/cf-sub)

3、在 Cloudflare 中连接你 Fork 的仓库

---

### 方式二：命令行部署 (使用Wrangler CLI)

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

### 方法 A：使用 Web UI 界面

填入机场订阅，选择目标客户端与家宽出口协议（若家宽信息已配置在环境变量中，可保持留空），点击**生成订阅链接**或**一键导入客户端**。

### 方法 B：Cloudflare 后台环境变量配置 (推荐)

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
  - `socks_port`: 家宽出口端口 (可选)

---

## 🙏 致谢

- **[tindy2013/subconverter](https://github.com/tindy2013/subconverter)** -订阅转换工具与客户端转换
- **[Metacubex/mihomo](https://github.com/Metacubex/mihomo)** - Clash Meta 内核
- **[SagerNet/sing-box](https://github.com/SagerNet/sing-box)** - 网络代理工具
- **[Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)** - 分流规则集
- **[ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)** - 策略组与规则定义

---

## ⚠️ 免责声明 (Disclaimer)

1. **仅供学习交流**：本项目（`cf-sub`）仅供网络技术研究、开源代码学习及个人测试使用，请勿用于任何违反所在国家或地区法律法规的用途。
2. **风险自负**：使用者在部署和使用本项目时，应自行承担相关风险。开发者不对因使用、复制、修改或分发本软件而产生的任何直接或间接损失、法律纠纷、设备故障或安全后果承担任何责任。
3. **第三方服务**：本项目依赖 Cloudflare Workers 及第三方订阅节点，第三方服务的稳定性、安全性及合法性由对应服务提供方负责，本项目不做任何形式的保证或担保。
4. **合规使用**：请使用者严格遵守所在国家/地区的法律法规及网络管理规定，如因违规使用产生任何法律后果，均由使用者自行承担，与本项目开发者无关。

---

## 📬 联系方式

* ​**开发者**​: MareixHunk
* ​**Email**​: [ceohunk@gmail.com](mailto:ceohunk@gmail.com)
* ​**GitHub**​: [MareixHunk](https://github.com/Mareixcode)

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议开源。

感谢 LINUX DO 社区开发者对本项目的支持
<a href="https://linux.do?ref=seal-click" target="_blank" rel="noopener noreferrer" title="Powered by LINUX DO">
  <img
    src="https://linuxdo-seal.cuishushu.com/seals/seal-support-by.svg"
    alt="SUPPORT by LINUX DO"
    width="130"
    height="55"
  />
</a>