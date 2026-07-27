import YAML from 'yaml';

/**
 * 安全解析 YAML 字符串为 JS 对象
 */
export function parseYaml<T = unknown>(yamlStr: string): T {
  try {
    return YAML.parse(yamlStr) as T;
  } catch (error) {
    throw new Error(`YAML Parse Error: ${(error as Error).message}`);
  }
}

/**
 * 将 JS 对象格式化为 YAML 字符串
 */
export function stringifyYaml(data: unknown): string {
  try {
    return YAML.stringify(data, {
      indent: 2,
      lineWidth: 0,
    });
  } catch (error) {
    throw new Error(`YAML Stringify Error: ${(error as Error).message}`);
  }
}
