/**
 * UTF-8 安全的 Base64 解码
 */
export function decodeBase64(str: string): string {
  try {
    let clean = str.trim().replace(/\s+/g, '');
    // 替换 base64url 字符
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    // 补齐 padding
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    
    // Cloudflare Workers 环境支持 atob / TextDecoder
    const binary = atob(clean);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  } catch (err) {
    throw new Error('Invalid Base64 string');
  }
}

/**
 * 判断字符串是否很有可能是 Base64 编码
 */
export function isBase64(str: string): boolean {
  const clean = str.trim().replace(/\s+/g, '');
  if (!clean || clean.length % 4 !== 0 && !clean.includes('=')) {
    // base64url 可能不带 =，但字符集中只有 [A-Za-z0-9-_=+]
  }
  const base64Regex = /^[A-Za-z0-9+/=\-_]+$/;
  return base64Regex.test(clean) && !clean.includes('proxies:');
}
