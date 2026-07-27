import { ClashConfig, ClashProxy } from '../types';

export function formatBase64Sub(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const lines: string[] = [];

  for (const proxy of proxies) {
    const link = proxyToUri(proxy);
    if (link) {
      lines.push(link);
    }
  }

  const rawText = lines.join('\n');
  return btoa(unescape(encodeURIComponent(rawText)));
}

export function formatRawTextSub(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const lines: string[] = [];

  for (const proxy of proxies) {
    const link = proxyToUri(proxy);
    if (link) {
      lines.push(link);
    }
  }

  return lines.join('\n');
}

function proxyToUri(proxy: ClashProxy): string | null {
  if (!proxy || !proxy.name) return null;

  const name = encodeURIComponent(proxy.name);
  const server = proxy.server;
  const port = proxy.port;
  const type = (proxy.type || '').toLowerCase();

  if (type === 'socks5' || type === 'socks') {
    let auth = '';
    if (proxy.username && proxy.password) {
      auth = `${encodeURIComponent(String(proxy.username))}:${encodeURIComponent(String(proxy.password))}@`;
    }
    return `socks5://${auth}${server}:${port}#${name}`;
  } else if (type === 'ss') {
    const userInfo = btoa(`${proxy.cipher}:${proxy.password}`);
    return `ss://${userInfo}@${server}:${port}#${name}`;
  } else if (type === 'trojan') {
    return `trojan://${encodeURIComponent(String(proxy.password))}@${server}:${port}#${name}`;
  } else if (type === 'vless') {
    return `vless://${proxy.uuid}@${server}:${port}?encryption=none#${name}`;
  } else if (type === 'vmess') {
    const vmessObj = {
      v: '2',
      ps: proxy.name,
      add: server,
      port: String(port),
      id: proxy.uuid,
      aid: String(proxy.alterId || '0'),
      scy: proxy.cipher || 'auto',
      net: proxy.network || 'tcp',
      type: 'none',
      host: proxy.servername || '',
      tls: proxy.tls ? 'tls' : '',
    };
    const jsonStr = JSON.stringify(vmessObj);
    const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
    return `vmess://${base64Str}`;
  }

  return null;
}
