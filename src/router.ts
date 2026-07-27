import { Env, DynamicSocksConfig } from './types';
import { fetchSubscription } from './utils/http';
import { transformSubscription } from './transform';
import { renderWebUI } from './ui/html';

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const acceptHeader = request.headers.get('Accept') || '';

  // 1. GET / & GET /ui
  if (pathname === '/' || pathname === '' || pathname === '/ui') {
    // 浏览器直接访问 HTML 页面
    if (pathname === '/ui' || acceptHeader.includes('text/html')) {
      const htmlContent = renderWebUI();
      return new Response(htmlContent, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 其它 API / JSON 客户端请求
    return new Response(
      JSON.stringify({
        name: 'CF Subscription',
        version: '1.0.0',
        status: 'ok',
        web_ui: '/ui'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  // 2. GET /health
  if (pathname === '/health') {
    return new Response(
      JSON.stringify({ status: 'ok' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  // 3. GET /version
  if (pathname === '/version') {
    return new Response(
      JSON.stringify({ version: '1.0.0' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  // 4. GET /sub?url=<机场订阅链接>
  if (pathname === '/sub') {
    const subUrl = url.searchParams.get('url');
    if (!subUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Download failed',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    // 解析可选项：自定义家宽 SOCKS5 配置
    const socksServer = url.searchParams.get('socks_server') || url.searchParams.get('server');
    const socksPort = url.searchParams.get('socks_port') || url.searchParams.get('port');
    const socksUser = url.searchParams.get('socks_user') || url.searchParams.get('username');
    const socksPass = url.searchParams.get('socks_pass') || url.searchParams.get('password');

    let customSocks: DynamicSocksConfig | undefined = undefined;
    if (socksServer || socksPort || socksUser || socksPass) {
      customSocks = {
        server: socksServer || undefined,
        port: socksPort || undefined,
        username: socksUser || undefined,
        password: socksPass || undefined,
      };
    }

    const userAgent = request.headers.get('User-Agent');

    // 下载订阅
    let rawContent: string;
    try {
      rawContent = await fetchSubscription(subUrl, userAgent);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Download failed',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    // 解析与转换
    try {
      const clashYaml = transformSubscription(rawContent, env, 'CF-Sub', customSocks);

      return new Response(clashYaml, {
        status: 200,
        headers: {
          'Content-Type': 'text/yaml; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    } catch (err) {
      const errorMsg = (err as Error).message || '';
      if (errorMsg.includes('Script Error')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Script Error',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Invalid Clash Config',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      }
    }
  }

  // 未知路径 404
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Not Found',
    }),
    {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
}
