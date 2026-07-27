import { ClashConfig } from '../types';
import { parseYaml } from './yaml';
import { decodeBase64, isBase64 } from './base64';
import { parseNodeLinks } from '../utils/link-parser';

export function parseSubscription(rawContent: string): ClashConfig {
  let content = rawContent.trim();
  if (!content) {
    throw new Error('Invalid Clash Config');
  }

  // 1. 如果是 Base64 编码，先尝试解码
  if (isBase64(content)) {
    try {
      const decoded = decodeBase64(content);
      if (decoded && decoded.trim()) {
        content = decoded.trim();
      }
    } catch {
      // 若 Base64 解码失败，保留原文尝试直接解析
    }
  }

  // 2. 检查是否为 YAML (包含 proxies: 或 proxy-groups:)
  if (content.includes('proxies:') || content.includes('proxy-groups:') || content.includes('rules:')) {
    try {
      const parsed = parseYaml<ClashConfig>(content);
      if (parsed && typeof parsed === 'object') {
        if (!Array.isArray(parsed.proxies)) {
          parsed.proxies = [];
        }
        return parsed;
      }
    } catch (e) {
      throw new Error('Invalid Clash Config');
    }
  }

  // 3. 尝试作为节点 URI 列表解析 (如 ss://, vmess:// 等)
  const proxies = parseNodeLinks(content);
  if (proxies.length > 0) {
    return { proxies };
  }

  // 4. 如果再次尝试用 YAML 解析兜底
  try {
    const parsed = parseYaml<ClashConfig>(content);
    if (parsed && typeof parsed === 'object') {
      if (!Array.isArray(parsed.proxies)) {
        parsed.proxies = [];
      }
      return parsed;
    }
  } catch {
    // ignore
  }

  throw new Error('Invalid Clash Config');
}
