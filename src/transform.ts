import { Env, ClashConfig, DynamicSocksConfig, TargetClient } from './types';
import { parseSubscription } from './parser/clash';
import { formatClashYaml } from './output/clash';
import { formatSingboxJson } from './output/singbox';
import { formatSurgeConf } from './output/surge';
import { formatQuanxConfig } from './output/quanx';
import { formatBase64Sub } from './output/base64';
import main from './script.js';

export interface TransformResult {
  content: string;
  contentType: string;
}

export function transformSubscription(
  rawContent: string,
  env: Env,
  target: TargetClient = 'clash',
  profileName: string = 'CF-Sub',
  customSocks?: DynamicSocksConfig
): TransformResult {
  // 1. 将 env 及 customSocks 注入全局
  if (env.SOCKS_SERVER) (globalThis as unknown as Record<string, unknown>).SOCKS_SERVER = env.SOCKS_SERVER;
  if (env.SOCKS_PORT) (globalThis as unknown as Record<string, unknown>).SOCKS_PORT = env.SOCKS_PORT;
  if (env.SOCKS_USERNAME) (globalThis as unknown as Record<string, unknown>).SOCKS_USERNAME = env.SOCKS_USERNAME;
  if (env.SOCKS_PASSWORD) (globalThis as unknown as Record<string, unknown>).SOCKS_PASSWORD = env.SOCKS_PASSWORD;
  if (env.SOCKS_TYPE) (globalThis as unknown as Record<string, unknown>).SOCKS_TYPE = env.SOCKS_TYPE;
  if (env.SOCKS_CIPHER) (globalThis as unknown as Record<string, unknown>).SOCKS_CIPHER = env.SOCKS_CIPHER;
  if (env.SOCKS_UUID) (globalThis as unknown as Record<string, unknown>).SOCKS_UUID = env.SOCKS_UUID;
  if (env.SOCKS_SNI) (globalThis as unknown as Record<string, unknown>).SOCKS_SNI = env.SOCKS_SNI;

  if (customSocks) {
    (globalThis as unknown as Record<string, unknown>).CUSTOM_SOCKS = customSocks;
  } else {
    delete (globalThis as unknown as Record<string, unknown>).CUSTOM_SOCKS;
  }

  // 2. 解析订阅
  const config: ClashConfig = parseSubscription(rawContent);

  // 3. 执行 Script 中的 main
  let newConfig: ClashConfig;
  try {
    newConfig = main(config, profileName);
  } catch (err) {
    throw new Error(`Script Error: ${(err as Error).message}`);
  }

  // 4. 根据目标客户端按需导出格式
  if (target === 'singbox') {
    return {
      content: formatSingboxJson(newConfig),
      contentType: 'application/json; charset=utf-8',
    };
  } else if (target === 'surge') {
    return {
      content: formatSurgeConf(newConfig),
      contentType: 'text/plain; charset=utf-8',
    };
  } else if (target === 'quanx') {
    return {
      content: formatQuanxConfig(newConfig),
      contentType: 'text/plain; charset=utf-8',
    };
  } else if (target === 'shadowrocket' || target === 'base64') {
    return {
      content: formatBase64Sub(newConfig),
      contentType: 'text/plain; charset=utf-8',
    };
  }

  // 默认 Clash / Mihomo
  return {
    content: formatClashYaml(newConfig),
    contentType: 'text/yaml; charset=utf-8',
  };
}

