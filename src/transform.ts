import { Env, ClashConfig, DynamicSocksConfig } from './types';
import { parseSubscription } from './parser/clash';
import { formatClashYaml } from './output/clash';
import main from './script.js';

export function transformSubscription(
  rawContent: string,
  env: Env,
  profileName: string = 'CF-Sub',
  customSocks?: DynamicSocksConfig
): string {
  // 1. 将 env 及 customSocks 注入全局
  if (env.SOCKS_SERVER) (globalThis as unknown as Record<string, unknown>).SOCKS_SERVER = env.SOCKS_SERVER;
  if (env.SOCKS_PORT) (globalThis as unknown as Record<string, unknown>).SOCKS_PORT = env.SOCKS_PORT;
  if (env.SOCKS_USERNAME) (globalThis as unknown as Record<string, unknown>).SOCKS_USERNAME = env.SOCKS_USERNAME;
  if (env.SOCKS_PASSWORD) (globalThis as unknown as Record<string, unknown>).SOCKS_PASSWORD = env.SOCKS_PASSWORD;

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

  // 4. 输出 YAML
  return formatClashYaml(newConfig);
}
