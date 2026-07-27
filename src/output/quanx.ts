import { ClashConfig, ClashProxy } from '../types';

export function formatQuanxConfig(config: ClashConfig): string {
  const proxies = config.proxies || [];
  const groups = config['proxy-groups'] || [];

  let nodeLines: string[] = [];
  for (const proxy of proxies) {
    const line = transformProxyToQuanx(proxy);
    if (line) {
      nodeLines.push(line);
    }
  }

  let policyLines: string[] = [];
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
    let auth = '';
    if (proxy.username && proxy.password) {
      auth = `, fast-open=false, udp-relay=true, user=${proxy.username}, password=${proxy.password}`;
    }
    line = `socks5=${server}:${port}${auth}, tag=${name}`;
  } else if (type === 'http' || type === 'https') {
    let auth = '';
    if (proxy.username && proxy.password) {
      auth = `, user=${proxy.username}, password=${proxy.password}`;
    }
    line = `http=${server}:${port}${auth}, tag=${name}`;
  } else if (type === 'ss') {
    line = `shadowsocks=${server}:${port}, method=${proxy.cipher}, password=${proxy.password}, fast-open=false, udp-relay=true, tag=${name}`;
  } else if (type === 'trojan') {
    line = `trojan=${server}:${port}, password=${proxy.password}, over-tls=true, tls-verification=true, tag=${name}`;
  } else if (type === 'vmess') {
    line = `vmess=${server}:${port}, method=none, password=${proxy.uuid}, tag=${name}`;
  } else {
    line = `socks5=${server}:${port}, tag=${name}`;
  }

  return line;
}
