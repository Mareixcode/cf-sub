export async function fetchSubscription(url: string, userAgent?: string | null): Promise<string> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': userAgent || 'ClashforWindows/0.20.39',
      'Accept': '*/*',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15秒超时

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const text = await response.text();
    if (!text || !text.trim()) {
      throw new Error('Empty subscription response');
    }

    return text;
  } catch (error) {
    throw new Error(`Download failed: ${(error as Error).message}`);
  }
}
