export function renderWebUI(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Almighty.CF-Sub - Cloudflare Worker 订阅转换器</title>
  <!-- Google Fonts: JetBrains Mono (Code/Terminal), Outfit (Display), Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      /* yantao.wiki Fluxgrid Hacker/DevOps Theme Tokens */
      --bg-base: #0a0e17;
      --bg-terminal: #05080e;
      --bg-card: rgba(13, 19, 31, 0.75);
      --bg-input: #04060a;
      --border-color: rgba(255, 255, 255, 0.1);
      --border-accent: rgba(0, 229, 255, 0.3);
      --accent-cyan: #00e5ff;
      --accent-green: #00ff9d;
      --accent-blue: #3b82f6;
      --text-main: #f1f5f9;
      --text-muted: #8b9bb4;
      --text-dim: #475569;
      --radius-lg: 14px;
      --radius-md: 8px;
      --radius-sm: 4px;
      --font-mono: 'JetBrains Mono', monospace;
      --shadow-terminal: 0 20px 50px rgba(0, 0, 0, 0.7);
      --transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-base);
      /* yantao.wiki Tech Grid & Scanline Background */
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.08) 0%, transparent 65%);
      background-size: 32px 32px, 32px 32px, 100% 100%;
      background-attachment: fixed;
      color: var(--text-main);
      font-family: var(--font-mono);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1.25rem;
      line-height: 1.5;
    }

    .container {
      width: 100%;
      max-width: 880px;
    }

    /* yantao.wiki Header Nav Bar */
    .nav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
    }

    .nav-logo-badge {
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid var(--accent-cyan);
      color: var(--accent-cyan);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--accent-green);
      background: rgba(0, 255, 157, 0.08);
      border: 1px solid rgba(0, 255, 157, 0.3);
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--accent-green);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--accent-green);
      animation: blink 1.8s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Terminal Code Window Hero (yantao.wiki Signature) */
    .terminal-window {
      background: var(--bg-terminal);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-terminal);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .terminal-header {
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border-color);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .window-controls {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .control-btn {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }

    .btn-red { background: #ff5f56; }
    .btn-yellow { background: #ffbd2e; }
    .btn-green { background: #27c93f; }

    .terminal-title {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .terminal-body {
      padding: 1.5rem;
    }

    /* Code Block Header */
    .code-comment {
      color: var(--accent-cyan);
      font-size: 0.8125rem;
      margin-bottom: 1.25rem;
      display: block;
    }

    /* Form Elements */
    .field-group {
      margin-bottom: 1.25rem;
    }

    .field-group:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input[type="text"], input[type="number"], input[type="password"] {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      color: #00ff9d;
      font-family: var(--font-mono);
      font-size: 0.875rem;
      outline: none;
      transition: var(--transition);
    }

    input[type="text"]::placeholder, input[type="number"]::placeholder, input[type="password"]::placeholder {
      color: #475569;
    }

    input:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 12px rgba(0, 229, 255, 0.15);
    }

    /* Accordion Custom Socks Panel */
    .socks-toggle-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--accent-cyan);
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .socks-toggle-btn:hover {
      background: rgba(0, 229, 255, 0.05);
      border-color: var(--accent-cyan);
    }

    .socks-panel {
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Command Line Buttons */
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
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      border: 1px solid transparent;
      text-decoration: none;
      white-space: nowrap;
    }

    .btn:active {
      transform: translateY(1px);
    }

    .btn-primary {
      background: #00e5ff;
      color: #040811;
      border-color: #00e5ff;
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
    }

    .btn-primary:hover {
      background: #33ebff;
      box-shadow: 0 0 22px rgba(0, 229, 255, 0.5);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-main);
      border-color: var(--border-color);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: var(--text-muted);
    }

    .btn-outline {
      background: transparent;
      color: var(--accent-green);
      border-color: rgba(0, 255, 157, 0.4);
    }

    .btn-outline:hover {
      background: rgba(0, 255, 157, 0.08);
      border-color: var(--accent-green);
    }

    /* Output Terminal Box */
    .output-box {
      background: var(--bg-input);
      border: 1px solid var(--border-accent);
      border-radius: var(--radius-md);
      padding: 0.875rem 1rem;
      font-size: 0.8125rem;
      color: var(--accent-green);
      word-break: break-all;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    /* Code Inspector Container */
    .inspector-panel {
      background: var(--bg-terminal);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      margin-top: 1.5rem;
    }

    .inspector-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .pill-cyan {
      border-color: rgba(0, 229, 255, 0.3);
      color: var(--accent-cyan);
    }

    .pill-green {
      border-color: rgba(0, 255, 157, 0.3);
      color: var(--accent-green);
    }

    pre {
      background: #020407;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      padding: 1rem;
      max-height: 420px;
      overflow-y: auto;
      font-size: 0.8125rem;
      color: #00ff9d;
      line-height: 1.6;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 229, 255, 0.2) transparent;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--accent-green);
      color: #040811;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.8125rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      opacity: 0;
      transform: translateY(20px);
      transition: var(--transition);
      pointer-events: none;
      z-index: 100;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    footer {
      text-align: center;
      margin-top: 2.5rem;
      font-size: 0.75rem;
      color: var(--text-dim);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- yantao.wiki Header Nav -->
    <header class="nav-header">
      <a href="/" class="nav-logo">
        <span>Almighty.CF-Sub</span>
        <span class="nav-logo-badge">v1.0.0</span>
      </a>
      <div class="status-indicator">
        <div class="status-dot"></div>
        <span>CF WORKER READY</span>
      </div>
    </header>

    <!-- yantao.wiki Code Terminal Window Hero -->
    <main class="terminal-window">
      <div class="terminal-header">
        <div class="window-controls">
          <div class="control-btn btn-red"></div>
          <div class="control-btn btn-yellow"></div>
          <div class="control-btn btn-green"></div>
        </div>
        <div class="terminal-title">cf-sub-converter.ts — bash</div>
        <div></div>
      </div>

      <div class="terminal-body">
        <span class="code-comment">// SUBSCRIPTION_CONVERTER & SOCKS5_CHAIN_PROXY</span>

        <div class="field-group">
          <label for="subUrl">$ SUB_URL (机场订阅链接)</label>
          <input type="text" id="subUrl" placeholder="https://example.com/sub?target=clash" value="">
        </div>

        <!-- Custom SOCKS5 Exit Panel -->
        <div style="margin-top: 1.5rem;">
          <button type="button" class="socks-toggle-btn" onclick="toggleSocksPanel()">
            <span>// CUSTOM_SOCKS5_EXIT_CONFIG (可选家宽参数)</span>
            <span id="socksChevron">▼</span>
          </button>

          <div id="socksPanel" class="socks-panel" style="display: none;">
            <div class="field-group">
              <label for="socksServer">$ SOCKS_SERVER</label>
              <input type="text" id="socksServer" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksPort">$ SOCKS_PORT</label>
              <input type="number" id="socksPort" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksUser">$ SOCKS_USERNAME</label>
              <input type="text" id="socksUser" placeholder="留空使用默认环境配置">
            </div>
            <div class="field-group">
              <label for="socksPass">$ SOCKS_PASSWORD</label>
              <input type="password" id="socksPass" placeholder="留空使用默认环境配置">
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generateLink()">
            $ generate-link
          </button>
          <button class="btn btn-secondary" onclick="testLiveConvert()">
            $ live-debug --test
          </button>
        </div>

        <!-- Generated Result Output -->
        <div id="resultSection" style="margin-top: 1.5rem; display: none;">
          <label>// GENERATED_CLASH_SUBSCRIPTION_URL:</label>
          <div class="output-box">
            <span id="finalUrl"></span>
            <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="copyResultLink()">COPY</button>
          </div>

          <div class="btn-group" style="margin-top: 1rem;">
            <a id="clashImportBtn" href="#" class="btn btn-outline" target="_blank">
              $ import-to-clash
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- Code Inspector Output Window -->
    <section id="inspectorCard" class="terminal-window" style="display: none;">
      <div class="terminal-header">
        <div class="window-controls">
          <div class="control-btn btn-red"></div>
          <div class="control-btn btn-yellow"></div>
          <div class="control-btn btn-green"></div>
        </div>
        <div class="terminal-title">clash-output-inspector.yaml</div>
        <div></div>
      </div>

      <div class="terminal-body">
        <div class="inspector-header">
          <span class="pill pill-cyan" id="statNodes">前置节点: -</span>
          <span class="pill pill-green" id="statExit">最终出口: 家宽 SOCKS 01</span>
          <span class="pill" id="statRules">dialer-proxy: ✅</span>
        </div>

        <pre><code id="yamlPreview">Connecting and executing transform script...</code></pre>
      </div>
    </section>

    <footer>
      Almighty.CF-Sub &bull; Powered by Cloudflare Workers &bull; Fluxgrid Terminal Theme
    </footer>
  </div>

  <div id="toast" class="toast">✓ Copied to clipboard</div>

  <script>
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
      showToast('✓ 转换链接生成成功！');
    }

    function copyResultLink() {
      const text = document.getElementById('finalUrl').textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast('✓ 复制成功！');
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
      yamlPreview.textContent = 'Executing transform script...';

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
        yamlPreview.textContent = '❌ 测试转换失败: ' + err.message;
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
