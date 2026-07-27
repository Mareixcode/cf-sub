import { ClashProxy } from '../types';
import { decodeBase64 } from '../parser/base64';

export function parseNodeLinks(content: string): ClashProxy[] {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const proxies: ClashProxy[] = [];

  for (const line of lines) {
    const proxy = parseSingleNodeLink(line);
    if (proxy) {
      proxies.push(proxy);
    }
  }

  return proxies;
}

function parseSingleNodeLink(link: string): ClashProxy | null {
  try {
    if (link.startsWith('ss://')) {
      return parseShadowsocks(link);
    } else if (link.startsWith('trojan://')) {
      return parseTrojan(link);
    } else if (link.startsWith('vmess://')) {
      return parseVmess(link);
    } else if (link.startsWith('vless://')) {
      return parseVless(link);
    } else if (link.startsWith('hysteria2://') || link.startsWith('hy2://')) {
      return parseHysteria2(link);
    }
  } catch (e) {
    // 忽略无法解析的单节点，防止崩溃
  }
  return null;
}

function parseShadowsocks(link: string): ClashProxy | null {
  // ss://base64(method:password)@server:port#name 或 ss://base64@server:port#name
  const urlObj = new URL(link);
  const name = decodeURIComponent(urlObj.hash.slice(1)) || 'SS Node';
  const server = urlObj.hostname;
  const port = parseInt(urlObj.port, 10);

  let cipher = '';
  let password = '';

  if (urlObj.username) {
    const decodedUserInfo = decodeBase64(urlObj.username);
    if (decodedUserInfo.includes(':')) {
      [cipher, password] = decodedUserInfo.split(':');
    } else {
      cipher = urlObj.username;
      password = decodeURIComponent(urlObj.password);
    }
  }

  return {
    name,
    type: 'ss',
    server,
    port,
    cipher,
    password,
    udp: true
  };
}

function parseTrojan(link: string): ClashProxy | null {
  const urlObj = new URL(link);
  const name = decodeURIComponent(urlObj.hash.slice(1)) || 'Trojan Node';
  const server = urlObj.hostname;
  const port = parseInt(urlObj.port, 10);
  const password = decodeURIComponent(urlObj.username);

  const sni = urlObj.searchParams.get('sni') || urlObj.searchParams.get('peer') || server;
  const allowInsecure = urlObj.searchParams.get('allowInsecure') === '1' || urlObj.searchParams.get('insecure') === '1';

  return {
    name,
    type: 'trojan',
    server,
    port,
    password,
    sni,
    'skip-cert-verify': allowInsecure,
    udp: true
  };
}

function parseVmess(link: string): ClashProxy | null {
  const base64Str = link.replace('vmess://', '');
  const jsonStr = decodeBase64(base64Str);
  const vmessObj = JSON.parse(jsonStr);

  return {
    name: vmessObj.ps || 'Vmess Node',
    type: 'vmess',
    server: vmessObj.add,
    port: parseInt(vmessObj.port, 10),
    uuid: vmessObj.id,
    alterId: parseInt(vmessObj.aid || '0', 10),
    cipher: vmessObj.scy || 'auto',
    network: vmessObj.net || 'tcp',
    tls: vmessObj.tls === 'tls',
    servername: vmessObj.host || vmessObj.add,
    udp: true
  };
}

function parseVless(link: string): ClashProxy | null {
  const urlObj = new URL(link);
  const name = decodeURIComponent(urlObj.hash.slice(1)) || 'Vless Node';
  const server = urlObj.hostname;
  const port = parseInt(urlObj.port, 10);
  const uuid = decodeURIComponent(urlObj.username);

  return {
    name,
    type: 'vless',
    server,
    port,
    uuid,
    cipher: 'auto',
    udp: true
  };
}

function parseHysteria2(link: string): ClashProxy | null {
  const urlObj = new URL(link);
  const name = decodeURIComponent(urlObj.hash.slice(1)) || 'Hysteria2 Node';
  const server = urlObj.hostname;
  const port = parseInt(urlObj.port, 10);
  const auth = decodeURIComponent(urlObj.username);

  return {
    name,
    type: 'hysteria2',
    server,
    port,
    auth,
    sni: urlObj.searchParams.get('sni') || server,
    'skip-cert-verify': urlObj.searchParams.get('insecure') === '1'
  };
}
