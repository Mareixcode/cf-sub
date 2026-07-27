import { ClashConfig } from '../types';
import { stringifyYaml } from '../parser/yaml';

export function formatClashYaml(config: ClashConfig): string {
  return stringifyYaml(config);
}
