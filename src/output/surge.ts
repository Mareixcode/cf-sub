import { ClashConfig, ClashProxy } from '../types';

export function formatSurgeConf(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const groups = config['proxy-groups'] || [];

  let proxyLines: string[] = [];
  for (const proxy of proxies) {
    const line = transformProxyToSurge(proxy);
    if (line) {
      proxyLines.push(line);
    }
  }

  let groupLines: string[] = [];
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
  let parts: string[] = [];

  if (type === 'socks5' || type === 'socks') {
    parts.push('socks5', server, String(port));
    if (proxy.username) parts.push(`username=${proxy.username}`);
    if (proxy.password) parts.push(`password=${proxy.password}`);
    parts.push('udp-relay=true');
  } else if (type === 'http' || type === 'https') {
    parts.push(type === 'https' ? 'https' : 'http', server, String(port));
    if (proxy.username) parts.push(`username=${proxy.username}`);
    if (proxy.password) parts.push(`password=${proxy.password}`);
  } else if (type === 'ss') {
    parts.push('custom', server, String(port), String(proxy.cipher), String(proxy.password), 'https://raw.githubusercontent.com/lhie1/Rules/master/SSEncrypt.module');
  } else if (type === 'trojan') {
    parts.push('trojan', server, String(port), `password=${proxy.password}`);
    if (proxy.sni) parts.push(`sni=${proxy.sni}`);
  } else if (type === 'vmess') {
    parts.push('vmess', server, String(port), `username=${proxy.uuid}`);
  } else {
    parts.push(type, server, String(port));
  }

  if (dialerProxy) {
    parts.push(`under-proxy=${dialerProxy}`);
  }

  return `${name} = ${parts.join(', ')}`;
}
