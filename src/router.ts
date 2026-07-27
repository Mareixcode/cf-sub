import { Env, DynamicSocksConfig, TargetClient } from './types';
import { fetchSubscription } from './utils/http';
import { transformSubscription } from './transform';
import { renderWebUI } from './ui/html';

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const acceptHeader = request.headers.get('Accept') || '';
  const userAgent = request.headers.get('User-Agent') || '';

  // 1. GET / & GET /ui
  if (pathname === '/' || pathname === '' || pathname === '/ui') {
    if (pathname === '/ui' || acceptHeader.includes('text/html')) {
      const htmlContent = renderWebUI();
      return new Response(htmlContent, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response(
      JSON.stringify({
        name: 'CF Subscription & Multi-Client Chain Proxy',
        version: '2.0.0',
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
      JSON.stringify({ version: '2.0.0' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  // 4. GET /sub?url=<机场订阅链接>&target=<clash|singbox|surge|quanx|shadowrocket>
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

    // 确定目标客户端类型 (Priority: URL query > User-Agent > Default clash)
    let target: TargetClient = 'clash';
    const queryTarget = (url.searchParams.get('target') || '').toLowerCase();

    if (['clash', 'singbox', 'surge', 'quanx', 'shadowrocket', 'base64'].includes(queryTarget)) {
      target = queryTarget as TargetClient;
    } else {
      const uaLower = userAgent.toLowerCase();
      if (uaLower.includes('sing-box') || uaLower.includes('singbox')) {
        target = 'singbox';
      } else if (uaLower.includes('surge')) {
        target = 'surge';
      } else if (uaLower.includes('quantumult')) {
        target = 'quanx';
      } else if (uaLower.includes('shadowrocket')) {
        target = 'shadowrocket';
      }
    }

    // 解析出口代理参数
    const socksType = url.searchParams.get('socks_type') || url.searchParams.get('type');
    const socksServer = url.searchParams.get('socks_server') || url.searchParams.get('server');
    const socksPort = url.searchParams.get('socks_port') || url.searchParams.get('port');
    const socksUser = url.searchParams.get('socks_user') || url.searchParams.get('username');
    const socksPass = url.searchParams.get('socks_pass') || url.searchParams.get('password');
    const socksCipher = url.searchParams.get('socks_cipher') || url.searchParams.get('cipher');
    const socksUuid = url.searchParams.get('socks_uuid') || url.searchParams.get('uuid');
    const socksSni = url.searchParams.get('socks_sni') || url.searchParams.get('sni');

    let customSocks: DynamicSocksConfig | undefined = undefined;
    if (socksType || socksServer || socksPort || socksUser || socksPass || socksCipher || socksUuid || socksSni) {
      customSocks = {
        type: socksType || undefined,
        server: socksServer || undefined,
        port: socksPort || undefined,
        username: socksUser || undefined,
        password: socksPass || undefined,
        cipher: socksCipher || undefined,
        uuid: socksUuid || undefined,
        sni: socksSni || undefined,
      };
    }

    // 下载订阅
    let subResult;
    try {
      subResult = await fetchSubscription(subUrl, userAgent);
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
      const transformResult = transformSubscription(
        subResult.content,
        env,
        target,
        'CF-Sub',
        customSocks
      );

      const headers: Record<string, string> = {
        'Content-Type': transformResult.contentType,
        'Cache-Control': 'public, max-age=300',
        // 允许浏览器跨域读取（UI 调试页面 fetch 同源，但明确声明更安全）
        'Access-Control-Allow-Origin': '*',
        // 必须显式暴露自定义响应头，否则浏览器 JS 无法读取
        'Access-Control-Expose-Headers': 'subscription-userinfo, Subscription-Userinfo, profile-update-interval, Profile-Update-Interval',
      };

      // 原样透传剩余流量与更新间隔 Response Headers
      if (subResult.userinfo) {
        headers['subscription-userinfo'] = subResult.userinfo;
      }

      if (subResult.profileUpdateInterval) {
        headers['profile-update-interval'] = subResult.profileUpdateInterval;
      }

      return new Response(transformResult.content, {
        status: 200,
        headers,
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
            message: 'Invalid Subscription Content',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      }
    }
  }

  // 404
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

