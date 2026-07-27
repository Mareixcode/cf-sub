export function renderWebUI(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CF-Cub - 订阅转换 & SOCKS5 链式代理控制台</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* YTBlog-Theme (Fluxgrid) Official Color & Layout Tokens */
      --bg: #0b0f14;
      --bg-soft: #0f1621;
      --card: #111827;
      --card-2: #0f172a;
      --border: #1f2937;
      --border-soft: rgba(148, 163, 184, 0.16);
      --text: #e5e7eb;
      --heading: #f8fafc;
      --body: #cbd5e1;
      --muted: #9ca3af;
      --muted-2: #64748b;
      --card-bg: rgba(17, 24, 39, 0.72);
      --header-bg: rgba(11, 15, 20, 0.85);
      --input-bg: #0b1220;
      --blue: #3b82f6;
      --blue-2: #2563eb;
      --blue-light: #93c5fd;
      --green: #22c55e;
      --red: #ef4444;
      --yellow: #f59e0b;
      --purple: #c084fc;
      --radius: 16px;
      --radius-sm: 10px;
      --shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
      --max: 920px;
      --font: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif;
      --mono: "JetBrains Mono", Consolas, monospace;
      --transition: all 0.22s ease;
    }

    html[data-theme="light"] {
      --bg: #f8fafc;
      --bg-soft: #f1f5f9;
      --card: #ffffff;
      --card-2: #f8fafc;
      --border: #e2e8f0;
      --border-soft: rgba(15, 23, 42, 0.08);
      --text: #1e293b;
      --heading: #0f172a;
      --body: #334155;
      --muted: #64748b;
      --muted-2: #94a3b8;
      --card-bg: rgba(255, 255, 255, 0.85);
      --header-bg: rgba(248, 250, 252, 0.85);
      --input-bg: #f1f5f9;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: var(--font);
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 34%),
        radial-gradient(circle at top right, rgba(34, 197, 94, 0.06), transparent 28%),
        var(--bg);
      line-height: 1.65;
      min-height: 100vh;
      position: relative;
    }

    /* YTBlog-Theme Particle Background Canvas */
    #particle-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 0.8;
    }

    .site-shell {
      min-height: 100vh;
      position: relative;
      width: 100%;
      z-index: 1;
      display: flex;
      flex-direction: column;
    }

    .flux-container {
      width: min(var(--max), calc(100% - 32px));
      max-width: var(--max);
      margin: 0 auto;
    }

    /* YTBlog-Theme Header Navbar */
    .site-header {
      position: sticky;
      top: 0;
      background: var(--header-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-soft);
      z-index: 100;
      padding: 1rem 0;
      margin-bottom: 2.5rem;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .brand-mark {
      width: 12px;
      height: 12px;
      background: var(--blue);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--blue);
    }

    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--heading);
      letter-spacing: -0.02em;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .theme-toggle {
      background: var(--card);
      border: 1px solid var(--border-soft);
      color: var(--text);
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .theme-toggle:hover {
      border-color: var(--blue);
      color: var(--blue);
    }

    html[data-theme="dark"] .icon-sun { display: block; }
    html[data-theme="dark"] .icon-moon { display: none; }
    html[data-theme="light"] .icon-sun { display: none; }
    html[data-theme="light"] .icon-moon { display: block; }

    /* YTBlog-Theme Card Component */
    .flux-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius);
      padding: 2rem;
      box-shadow: var(--shadow);
      margin-bottom: 2rem;
      transition: var(--transition);
    }

    .flux-card:hover {
      border-color: rgba(59, 130, 246, 0.3);
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--heading);
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

    /* Form Fields */
    .field-group {
      margin-bottom: 1.25rem;
    }

    .field-group label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    input[type="text"], input[type="number"], input[type="password"] {
      width: 100%;
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0.8125rem 1rem;
      color: var(--text);
      font-family: var(--mono);
      font-size: 0.875rem;
      outline: none;
      transition: var(--transition);
    }

    input:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    /* Collapsible Socks Panel */
    .socks-toggle-btn {
      background: var(--card-2);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      padding: 0.875rem 1.125rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--heading);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .socks-toggle-btn:hover {
      border-color: var(--blue);
    }

    .socks-panel {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px dashed var(--border-soft);
    }

    /* Buttons */
    .btn-group {
      display: flex;
      gap: 0.875rem;
      flex-wrap: wrap;
      margin-top: 1.75rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8125rem 1.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      border: none;
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--blue), var(--blue-2));
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      opacity: 0.92;
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: var(--card-2);
      color: var(--text);
      border: 1px solid var(--border-soft);
    }

    .btn-secondary:hover {
      border-color: var(--border);
      color: var(--heading);
    }

    .btn-outline {
      background: transparent;
      color: var(--blue-light);
      border: 1px solid var(--blue);
    }

    .btn-outline:hover {
      background: rgba(59, 130, 246, 0.1);
    }

    /* Output Section */
    .output-box {
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 1rem;
      font-family: var(--mono);
      font-size: 0.8125rem;
      color: var(--blue-light);
      word-break: break-all;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    /* Inspector Code Box */
    .inspector-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }

    .pill {
      background: var(--card-2);
      border: 1px solid var(--border-soft);
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-family: var(--mono);
      color: var(--muted);
    }

    .pill-blue {
      border-color: rgba(59, 130, 246, 0.4);
      color: var(--blue-light);
    }

    .pill-green {
      border-color: rgba(34, 197, 94, 0.4);
      color: var(--green);
    }

    pre {
      background: #070b10;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 1.25rem;
      max-height: 460px;
      overflow-y: auto;
      font-family: var(--mono);
      font-size: 0.8125rem;
      color: #e2e8f0;
      line-height: 1.6;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 2.5rem;
      right: 2.5rem;
      background: var(--green);
      color: #04130a;
      padding: 0.875rem 1.375rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(20px);
      transition: var(--transition);
      pointer-events: none;
      z-index: 200;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    footer {
      text-align: center;
      padding: 2rem 0;
      font-size: 0.8125rem;
      color: var(--muted-2);
      margin-top: auto;
    }
  </style>
</head>
<body class="theme-fluxgrid">
  <!-- YTBlog-Theme Particle Background Canvas -->
  <canvas id="particle-bg" aria-hidden="true"></canvas>

  <div class="site-shell">
    <!-- YTBlog-Theme Header Navbar -->
    <header class="site-header">
      <div class="flux-container header-inner">
        <a class="brand" href="/">
          <span class="brand-mark"></span>
          <span class="brand-text">Almighty.CF-Cub</span>
        </a>

        <div class="header-actions">
          <button type="button" class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" aria-label="切换明暗主题">
            <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flux-container">
      <div class="flux-card">
        <h2 class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          基础订阅链接配置
        </h2>

        <div class="field-group">
          <label for="subUrl">机场订阅链接 (URL / Base64 / YAML)</label>
          <input type="text" id="subUrl" placeholder="https://example.com/sub?target=clash" value="">
        </div>

        <!-- Custom SOCKS5 Panel -->
        <div style="margin-top: 1.5rem;">
          <button type="button" class="socks-toggle-btn" onclick="toggleSocksPanel()">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              自定义家宽 Exit SOCKS5 节点参数 (可选)
            </span>
            <span id="socksChevron">▼</span>
          </button>

          <div id="socksPanel" class="socks-panel" style="display: none;">
            <div class="field-group">
              <label for="socksServer">SOCKS5 服务器 IP/域名</label>
              <input type="text" id="socksServer" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksPort">端口</label>
              <input type="number" id="socksPort" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksUser">认证用户名</label>
              <input type="text" id="socksUser" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksPass">认证密码</label>
              <input type="password" id="socksPass" placeholder="留空使用默认环境配置">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generateLink()">
            生成订阅转换链接
          </button>
          <button class="btn btn-secondary" onclick="testLiveConvert()">
            在线解析与测试 (Live Debug)
          </button>
        </div>

        <!-- Output Result Box -->
        <div id="resultSection" style="margin-top: 1.75rem; display: none;">
          <label style="margin-bottom: 0.5rem; display: block;">生成的 Clash 订阅转换地址：</label>
          <div class="output-box">
            <span id="finalUrl"></span>
            <button class="btn btn-secondary" style="padding: 0.4rem 0.875rem; font-size: 0.75rem;" onclick="copyResultLink()">复制链接</button>
          </div>

          <div class="btn-group" style="margin-top: 1.25rem;">
            <a id="clashImportBtn" href="#" class="btn btn-outline" target="_blank">
              一键导入 Clash 客户端
            </a>
          </div>
        </div>
      </div>

      <!-- Inspector Output Card -->
      <section id="inspectorCard" class="flux-card" style="display: none;">
        <h3 class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          实时解析预览 (Clash YAML Inspector)
        </h3>

        <div class="inspector-header">
          <span class="pill pill-blue" id="statNodes">前置节点: -</span>
          <span class="pill pill-green" id="statExit">最终出口: 家宽 SOCKS 01</span>
          <span class="pill" id="statRules">链式代理: dialer-proxy ✅</span>
        </div>

        <pre><code id="yamlPreview">正在发起请求并执行转换脚本...</code></pre>
      </section>
    </main>

    <footer>
      Almighty.CF-Cub &bull; YTBlog-Theme (Fluxgrid Engine) &bull; Cloudflare Workers Module Architecture
    </footer>
  </div>

  <div id="toast" class="toast">已成功复制到剪贴板！</div>

  <script>
    /* YTBlog-Theme Theme Switcher */
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('fluxgrid-theme', newTheme);
      } catch (e) {}
    }

    (function initTheme() {
      try {
        const stored = localStorage.getItem('fluxgrid-theme');
        if (stored === 'dark' || stored === 'light') {
          document.documentElement.setAttribute('data-theme', stored);
        }
      } catch (e) {}
    })();

    /* YTBlog-Theme Particle Background Engine */
    (function initParticles() {
      const canvas = document.getElementById('particle-bg');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;

      const particles = [];
      const particleCount = Math.min(45, Math.floor(width / 30));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1
        });
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const particleColor = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)';
        const lineColor = isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)';

        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();

          for (let j = i + 1; j < particleCount; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = lineColor;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      draw();
    })();

    /* Interactive Form Logic */
    function toggleSocksPanel() {
      const panel = document.getElementById('socksPanel');
      const chevron = document.getElementById('socksChevron');
      if (panel.style.display === 'none') {
        panel.style.display = 'grid';
        chevron.textContent = '▲';
      } else {
        panel.style.display = 'none';
        chevron.textContent = '▼';
      }
    }

    function buildTargetUrl() {
      const subUrl = document.getElementById('subUrl').value.trim();
      if (!subUrl) return '';

      const workerOrigin = window.location.origin;
      const urlObj = new URL('/sub', workerOrigin);
      urlObj.searchParams.set('url', subUrl);

      const server = document.getElementById('socksServer').value.trim();
      const port = document.getElementById('socksPort').value.trim();
      const user = document.getElementById('socksUser').value.trim();
      const pass = document.getElementById('socksPass').value.trim();

      if (server) urlObj.searchParams.set('socks_server', server);
      if (port) urlObj.searchParams.set('socks_port', port);
      if (user) urlObj.searchParams.set('socks_user', user);
      if (pass) urlObj.searchParams.set('socks_pass', pass);

      return urlObj.toString();
    }

    function generateLink() {
      const url = buildTargetUrl();
      if (!url) {
        alert('请输入有效的机场订阅链接！');
        return;
      }

      document.getElementById('finalUrl').textContent = url;
      document.getElementById('clashImportBtn').href = 'clash://install-config?url=' + encodeURIComponent(url);
      document.getElementById('resultSection').style.display = 'block';
      showToast('转换链接已成功生成！');
    }

    function copyResultLink() {
      const text = document.getElementById('finalUrl').textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制转换链接到剪贴板！');
      });
    }

    async function testLiveConvert() {
      const url = buildTargetUrl();
      if (!url) {
        alert('请输入有效的机场订阅链接！');
        return;
      }

      const inspectorCard = document.getElementById('inspectorCard');
      const yamlPreview = document.getElementById('yamlPreview');
      inspectorCard.style.display = 'block';
      yamlPreview.textContent = '正在发起请求并执行转换脚本...';

      try {
        const res = await fetch(url);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || ('HTTP Error ' + res.status));
        }

        const yamlText = await res.text();
        yamlPreview.textContent = yamlText;

        const proxyMatches = (yamlText.match(/- name:/g) || []).length;
        document.getElementById('statNodes').textContent = '前置节点数: ' + proxyMatches + ' 个';

      } catch (err) {
        yamlPreview.textContent = '❌ 在线解析测试失败: ' + err.message;
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }
  </script>
</body>
</html>`;
}
