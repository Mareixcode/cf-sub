import { ClashConfig, ClashProxy } from '../types';

export function formatSurgeConf(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const groups = config['proxy-groups'] || [];

  const proxyLines: string[] = [];
  for (const proxy of proxies) {
    const line = transformProxyToSurge(proxy);
    if (line) {
      proxyLines.push(line);
    }
  }

  const groupLines: string[] = [];
  for (const group of groups) {
    const members = (group.proxies || []).join(', ');
    groupLines.push(`${group.name} = select, ${members}`);
  }

  return `[General]
loglevel = notify
bypass-system = true
ipv6 = false

[Proxy]
${proxyLines.join('\n')}

[Proxy Group]
${groupLines.join('\n')}

[Rule]
FINAL, ⚡ 最终出口
`;
}

function transformProxyToSurge(proxy: ClashProxy): string | null {
  if (!proxy || !proxy.name) return null;

  const name = proxy.name;
  const server = proxy.server;
  const port = proxy.port;
  const dialerProxy = proxy['dialer-proxy'] as string | undefined;

  const type = (proxy.type || '').toLowerCase();
  const parts: string[] = [];

  if (type === 'socks5' || type === 'socks') {
    // Surge SOCKS5: name = socks5, server, port, username=x, password=x
    parts.push('socks5', server, String(port));
    if (proxy.username) parts.push(`username=${proxy.username}`);
    if (proxy.password) parts.push(`password=${proxy.password}`);
    parts.push('udp-relay=true');
  } else if (type === 'http') {
    parts.push('http', server, String(port));
    if (proxy.username) parts.push(`username=${proxy.username}`);
    if (proxy.password) parts.push(`password=${proxy.password}`);
  } else if (type === 'https') {
    // Surge: https 用 http 类型加 tls=true
    parts.push('http', server, String(port));
    if (proxy.username) parts.push(`username=${proxy.username}`);
    if (proxy.password) parts.push(`password=${proxy.password}`);
    parts.push('tls=true');
    if (proxy.sni) parts.push(`sni=${proxy.sni}`);
  } else if (type === 'ss') {
    // Surge 4+ 标准 Shadowsocks 格式
    parts.push('ss', server, String(port));
    parts.push(`encrypt-method=${proxy.cipher}`);
    parts.push(`password=${proxy.password}`);
    parts.push('udp-relay=true');
  } else if (type === 'trojan') {
    // Surge Trojan 格式
    parts.push('trojan', server, String(port));
    parts.push(`password=${proxy.password}`);
    if (proxy.sni) parts.push(`sni=${proxy.sni}`);
    parts.push('udp-relay=true');
  } else if (type === 'vmess') {
    // Surge VMess 格式
    parts.push('vmess', server, String(port));
    parts.push(`username=${proxy.uuid}`);
    if (proxy.cipher) parts.push(`encrypt-method=${proxy.cipher}`);
    if (proxy.tls) {
      parts.push('tls=true');
      if (proxy.servername) parts.push(`sni=${proxy.servername}`);
    }
  } else {
    // 降级回 socks5
    parts.push('socks5', server, String(port));
  }

  if (dialerProxy) {
    parts.push(`under-proxy=${dialerProxy}`);
  }

  return `${name} = ${parts.join(', ')}`;
}

