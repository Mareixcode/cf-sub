export interface Env {
  SOCKS_SERVER?: string;
  SOCKS_PORT?: string | number;
  SOCKS_USERNAME?: string;
  SOCKS_PASSWORD?: string;
}

export interface DynamicSocksConfig {
  server?: string;
  port?: number | string;
  username?: string;
  password?: string;
  name?: string;
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

export interface ErrorResponse {
  success: false;
  message: string;
}
