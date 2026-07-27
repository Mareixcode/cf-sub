import { ClashConfig, ClashProxy } from '../types';

export function formatQuanxConfig(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const groups = config['proxy-groups'] || [];

  const nodeLines: string[] = [];
  for (const proxy of proxies) {
    const line = transformProxyToQuanx(proxy);
    if (line) {
      nodeLines.push(line);
    }
  }

  const policyLines: string[] = [];
  for (const group of groups) {
    const members = (group.proxies || []).join(', ');
    policyLines.push(`static=${group.name}, ${members}, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png`);
  }

  return `[general]
profile_img_url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Server.png

[server_local]
${nodeLines.join('\n')}

[policy]
${policyLines.join('\n')}

[filter_local]
FINAL, ⚡ 最终出口
`;
}

function transformProxyToQuanx(proxy: ClashProxy): string | null {
  if (!proxy || !proxy.name) return null;

  const name = proxy.name;
  const server = proxy.server;
  const port = proxy.port;
  const type = (proxy.type || '').toLowerCase();

  let line = '';
  if (type === 'socks5' || type === 'socks') {
    const auth = (proxy.username && proxy.password)
      ? `, fast-open=false, udp-relay=true, user=${proxy.username}, password=${proxy.password}`
      : ', fast-open=false, udp-relay=true';
    line = `socks5=${server}:${port}${auth}, tag=${name}`;
  } else if (type === 'http' || type === 'https') {
    const tls = type === 'https' ? ', over-tls=true' : '';
    const auth = (proxy.username && proxy.password)
      ? `, user=${proxy.username}, password=${proxy.password}`
      : '';
    line = `http=${server}:${port}${auth}${tls}, tag=${name}`;
  } else if (type === 'ss') {
    // QX Shadowsocks 格式
    const cipher = proxy.cipher || 'chacha20-ietf-poly1305';
    line = `shadowsocks=${server}:${port}, method=${cipher}, password=${proxy.password}, fast-open=false, udp-relay=true, tag=${name}`;
  } else if (type === 'trojan') {
    line = `trojan=${server}:${port}, password=${proxy.password}, over-tls=true, tls-verification=true, tag=${name}`;
  } else if (type === 'vmess') {
    // QX VMess: method 使用节点实际加密方式而非固定 none
    const cipher = (proxy.cipher && proxy.cipher !== 'auto') ? String(proxy.cipher) : 'chacha20-ietf-poly1305';
    const tls = proxy.tls ? ', obfs=over-tls' : '';
    line = `vmess=${server}:${port}, method=${cipher}, password=${proxy.uuid}${tls}, tag=${name}`;
  } else if (type === 'vless') {
    // QX VLESS (需要 QX >= 1.0.30)
    line = `vless=${server}:${port}, password=${proxy.uuid}, over-tls=true, tag=${name}`;
  } else {
    // 不支持的类型跳过
    return null;
  }

  return line;
}

