# Cloudflare Workers Subscription Converter & SOCKS5 Chain Proxy (cf-cub)

一个完全部署在 **Cloudflare Workers (Module Worker 架构)** 的开源机场订阅转换服务与 SOCKS5 链式代理 Exit 节点注入工具。

[![License: MIT](https://img.shields.com/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.com/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.com/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

## 🌟 核心特性

- **Module Worker & Wrangler JSONC 架构**：采用最新标准 TypeScript Module Worker 导出与 `wrangler.jsonc` 配置文件。
- **SOCKS5 链式代理 (Exit Proxy)**：将机场节点作为前置，家宽 SOCKS5 作为后置 Exit 出口 (`dialer-proxy: 前置节点`)，不改变原本的分流规则与策略组。
- **严格隐私安全**：代码与配置文件零硬编码隐私信息，支持环境变量与 URL 动态查询参数。
- **智能订阅格式解析**：支持自动检测解析 Base64 节点列表、Clash YAML 配置以及单行节点 URI 列表 (SS / Vmess / Trojan / Vless / Hysteria2)。
- **Fluxgrid Hacker 极客控制台**：集成 yantao.wiki 风格 Terminal 调试控制台，支持在线一键解析测试与 Clash 客户端快速导入。
- **Cloudflare Cache API**：针对 `/sub` 自动边缘缓存 300 秒，减少对机场源站的频繁请求。

## 📁 项目结构

```text
cf-cub/
├── src/
│   ├── index.ts              # Worker 入口 (Module Worker Fetch & Edge Cache)
│   ├── router.ts             # REST 路由管理 (/, /health, /version, /sub)
│   ├── transform.ts          # 订阅转换管道
│   ├── script.js             # 链式代理逻辑脚本
│   ├── script.d.ts           # 脚本 TS 声明
│   ├── ui/
│   │   └── html.ts           # yantao.wiki 极客风 Web UI
│   ├── parser/
│   │   ├── clash.ts          # 订阅识别与解析
│   │   ├── yaml.ts           # YAML 格式化解析
│   │   └── base64.ts         # UTF-8 Base64 工具
│   ├── output/
│   │   └── clash.ts          # 格式化输出 Clash YAML
│   ├── utils/
│   │   ├── http.ts           # 订阅抓取 & UA 透传
│   │   └── link-parser.ts    # 节点 URI 解析器
│   └── types.ts              # TS 类型定义
├── package.json
├── tsconfig.json
├── wrangler.jsonc            # Wrangler 配置文件
├── README.md
└── LICENSE
```

## 🛠️ 快速开始 & 本地开发

1. **克隆项目并安装依赖**:

```bash
git clone https://github.com/Mareixcode/cf-cub.git
cd cf-cub
npm install
```

2. **启动本地调试**:

```bash
npm run dev
```

3. **TypeScript 类型检查**:

```bash
npm run typecheck
```

## ⚙️ 环境变量配置

在 `wrangler.jsonc` 或 Cloudflare Dashboard 中配置以下环境变量：

```jsonc
"vars": {
  "SOCKS_SERVER": "your-socks-server.com",
  "SOCKS_PORT": "1080",
  "SOCKS_USERNAME": "your_username",
  "SOCKS_PASSWORD": "your_password"
}
```

## 🚀 部署至 Cloudflare Workers

1. **登录 Cloudflare 账号**:

```bash
npx wrangler login
```

2. **部署 Worker**:

```bash
npx wrangler deploy
```

## 🔗 URL 参数说明

请求 `/sub` 转换时，可通过 URL 查询参数动态指定家宽 SOCKS5 节点：

- `url`: 机场订阅链接 (**必需**)
- `socks_server` (或 `server`): 自定义 SOCKS5 服务器 IP/域名
- `socks_port` (或 `port`): 自定义 SOCKS5 端口
- `socks_user` (或 `username`): 自定义认证用户名
- `socks_pass` (或 `password`): 自定义认证密码

示例：
`https://your-worker.workers.dev/sub?url=https://example.com/sub&socks_server=1.2.3.4&socks_port=1080`

## 📄 License

[MIT License](LICENSE) &copy; 2026 [Mareixcode](https://github.com/Mareixcode)
