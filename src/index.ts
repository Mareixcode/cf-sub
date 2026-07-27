import { Env } from './types';
import { handleRequest } from './router';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 限制仅处理 GET / HEAD 请求
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method Not Allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const url = new URL(request.url);

    // 仅针对 /sub 路由使用 Cloudflare Cache API 缓存
    if (url.pathname === '/sub' && url.searchParams.has('url')) {
      const cache = caches.default;
      // 匹配现有缓存
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 没有缓存则执行实际逻辑处理
      const response = await handleRequest(request, env);

      // 如果返回 200 成功响应，则将其存入缓存 (缓存 300 秒)
      if (response.status === 200) {
        const responseToCache = response.clone();
        // ctx.waitUntil 在后台异步更新缓存，不阻塞当前响应
        ctx.waitUntil(cache.put(request, responseToCache));
      }

      return response;
    }

    // 其它非订阅转换请求直接响应
    return handleRequest(request, env);
  },
};
