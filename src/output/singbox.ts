import { ClashConfig, ClashProxy } from '../types';

export function formatSingboxJson(config: ClashConfig): string {
  const clashProxies = config.proxies || [];
  const clashGroups = config['proxy-groups'] || [];

  const outbounds: Record<string, unknown>[] = [];

  // 1. 转换基础节点
  for (const proxy of clashProxies) {
    const sbOutbound = transformProxyToSingbox(proxy);
    if (sbOutbound) {
      outbounds.push(sbOutbound);
    }
  }

  // 2. 转换策略组为 selector
  for (const group of clashGroups) {
    outbounds.push({
      type: 'selector',
      tag: group.name,
      outbounds: group.proxies || [],
    });
  }

  // 3. 补全内置出站
  outbounds.push(
    { type: 'direct', tag: 'DIRECT' },
    { type: 'block', tag: 'REJECT' },
    { type: 'dns', tag: 'dns-out' }
  );

  // Sing-box 1.8+ 规范：dns.servers 不放 detour，通过 dns.rules 路由
  const singboxConfig = {
    log: {
      level: 'info',
      timestamp: true,
    },
    dns: {
      servers: [
        { tag: 'remote', address: 'tls://8.8.8.8', detour: '⚡ 最终出口' },
        { tag: 'local', address: '223.5.5.5' },
        { tag: 'block', address: 'rcode://success' },
      ],
      rules: [
        { geosite: ['cn'], server: 'local' },
        { geosite: ['category-ads-all'], server: 'block', disable_cache: true },
      ],
      final: 'remote',
      strategy: 'prefer_ipv4',
    },
    inbounds: [
      {
        type: 'tun',
        tag: 'tun-in',
        address: ['172.19.0.1/30', 'fdfe:dcba:9876::1/126'],
        auto_route: true,
        strict_route: true,
        sniff: true,
      },
    ],
    outbounds,
    route: {
      auto_detect_interface: true,
      final: '⚡ 最终出口',
    },
  };

  return JSON.stringify(singboxConfig, null, 2);
}


function transformProxyToSingbox(proxy: ClashProxy): Record<string, unknown> | null {
  if (!proxy || !proxy.name) return null;

  const tag = proxy.name;
  const server = proxy.server;
  const port = proxy.port;
  const dialerProxy = proxy['dialer-proxy'] as string | undefined;

  const type = (proxy.type || '').toLowerCase();

  let outbound: Record<string, unknown> = {
    tag,
    server,
    server_port: port,
  };

  if (dialerProxy) {
    outbound.detour = dialerProxy;
  }

  if (type === 'socks5' || type === 'socks') {
    outbound.type = 'socks';
    outbound.version = '5';
    if (proxy.username) outbound.username = proxy.username;
    if (proxy.password) outbound.password = proxy.password;
  } else if (type === 'http') {
    outbound.type = 'http';
    if (proxy.username) outbound.username = proxy.username;
    if (proxy.password) outbound.password = proxy.password;
  } else if (type === 'https') {
    // Sing-box 中 https 代理用 http + tls 实现
    outbound.type = 'http';
    if (proxy.username) outbound.username = proxy.username;
    if (proxy.password) outbound.password = proxy.password;
    outbound.tls = { enabled: true, server_name: proxy.sni || server };
  } else if (type === 'ss') {
    outbound.type = 'shadowsocks';
    outbound.method = proxy.cipher || 'chacha20-ietf-poly1305';
    outbound.password = proxy.password;
  } else if (type === 'vmess') {
    outbound.type = 'vmess';
    outbound.uuid = proxy.uuid;
    outbound.security = proxy.cipher || 'auto';
    outbound.alter_id = proxy.alterId || 0;
    if (proxy.tls) {
      outbound.tls = { enabled: true, server_name: proxy.servername || server };
    }
  } else if (type === 'vless') {
    outbound.type = 'vless';
    outbound.uuid = proxy.uuid;
    if (proxy.flow) outbound.flow = proxy.flow;
    // VLESS 通常需要 TLS（Reality 或 TLS）
    outbound.tls = { enabled: true, server_name: proxy.sni || proxy.servername || server };
  } else if (type === 'trojan') {
    outbound.type = 'trojan';
    outbound.password = proxy.password;
    outbound.tls = { enabled: true, server_name: proxy.sni || server };
  } else if (type === 'hysteria2' || type === 'hy2') {
    outbound.type = 'hysteria2';
    outbound.password = proxy.auth;
    outbound.tls = { enabled: true, server_name: proxy.sni || server };
  } else {
    // 不支持的类型直接跳过，避免生成无效配置
    return null;
  }

  return outbound;
}
