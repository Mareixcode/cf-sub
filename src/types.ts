export interface Env {
  SOCKS_SERVER?: string;
  SOCKS_PORT?: string | number;
  SOCKS_USERNAME?: string;
  SOCKS_PASSWORD?: string;
  SOCKS_TYPE?: string;
  SOCKS_CIPHER?: string;
  SOCKS_UUID?: string;
  SOCKS_SNI?: string;
}

export interface DynamicSocksConfig {
  type?: string; // 'socks5' | 'http' | 'https' | 'ss' | 'trojan' | 'vless'
  server?: string;
  port?: number | string;
  username?: string;
  password?: string;
  cipher?: string;
  uuid?: string;
  sni?: string;
  name?: string;
  tls?: boolean;
}

export interface ClashProxy {
  name: string;
  type: string;
  server: string;
  port: number;
  [key: string]: unknown;
}

export interface ClashProxyGroup {
  name: string;
  type: string;
  proxies: string[];
  [key: string]: unknown;
}

export interface ClashConfig {
  proxies?: ClashProxy[];
  'proxy-groups'?: ClashProxyGroup[];
  rules?: string[];
  'rule-providers'?: Record<string, unknown>;
  [key: string]: unknown;
}

export type TargetClient = 'clash' | 'singbox' | 'surge' | 'quanx' | 'shadowrocket' | 'base64';

export interface FetchSubResult {
  content: string;
  userinfo?: string;
  profileUpdateInterval?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

