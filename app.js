// DevForge Playground - Core Logic & Tab Management
let currentTab = 'effects';
let monacoEditor = null;
let snippetsData = {};

// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? '' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

// Tab Switching with ARIA
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });
  document.querySelectorAll('nav button').forEach(btn => {
    btn.setAttribute('aria-selected', 'false');
  });
  
  const targetTab = document.getElementById(`${tabName}-tab`);
  const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (targetTab) targetTab.style.display = 'block';
  if (targetBtn) targetBtn.setAttribute('aria-selected', 'true');
  
  currentTab = tabName;
  
  if (tabName === 'effects') initEffects();
  if (tabName === 'crypto') initCrypto();
  if (tabName === 'infra') initInfra();
  if (tabName === 'code') initMonaco();
}

// EFFECTS LAB
function initEffects() {
  initMetaballs();
  initMatrix();
  initFractal();
  initParticles();
}

function initMetaballs() {
  const canvas = document.getElementById('metaballs-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const balls = Array.from({length: 5}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    r: 30 + Math.random() * 20
  }));
  
  function animate() {
    ctx.fillStyle = 'rgba(8,20,31,0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
      ball.x += ball.vx * (document.getElementById('metaballs-speed')?.value || 5) / 5;
      ball.y += ball.vy * (document.getElementById('metaballs-speed')?.value || 5) / 5;
      
      if (ball.x < 0 || ball.x > canvas.width) ball.vx *= -1;
      if (ball.y < 0 || ball.y > canvas.height) ball.vy *= -1;
      
      const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.r);
      gradient.addColorStop(0, 'rgba(0,255,136,0.8)');
      gradient.addColorStop(1, 'rgba(0,204,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  animate();
}

function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01234567890'.split('');
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  function draw() {
    ctx.fillStyle = 'rgba(8,20,31,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';
    
    const intensity = document.getElementById('matrix-intensity')?.value || 50;
    drops.forEach((y, i) => {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > intensity / 100) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }
  
  setInterval(draw, 50);
}

function initFractal() {
  const canvas = document.getElementById('fractal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function drawTree(x, y, len, angle, depth) {
    if (depth === 0) return;
    const x2 = x + len * Math.cos(angle);
    const y2 = y + len * Math.sin(angle);
    
    ctx.strokeStyle = `hsl(${120 + depth * 20}, 100%, 50%)`;
    ctx.lineWidth = depth * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    drawTree(x2, y2, len * 0.7, angle - 0.5, depth - 1);
    drawTree(x2, y2, len * 0.7, angle + 0.5, depth - 1);
  }
  
  function render() {
    ctx.fillStyle = '#08141f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const depth = parseInt(document.getElementById('fractal-depth')?.value || 8);
    drawTree(canvas.width / 2, canvas.height, 40, -Math.PI / 2, depth);
  }
  
  render();
  document.getElementById('fractal-depth')?.addEventListener('input', render);
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function createParticles() {
    const count = parseInt(document.getElementById('particles-count')?.value || 200);
    particles = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2
    }));
  }
  
  createParticles();
  document.getElementById('particles-count')?.addEventListener('input', createParticles);
  
  function animate() {
    ctx.fillStyle = 'rgba(8,20,31,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.fillStyle = '#00ccff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  animate();
}

function exportCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${canvasId}-export.png`;
  link.href = canvas.toDataURL();
  link.click();
}

// CRYPTO DASHBOARD
function initCrypto() {
  loadCryptoData();
}

function loadCryptoData() {
  const container = document.getElementById('crypto-charts');
  if (!container) return;
  
  container.innerHTML = `
    <div style="padding:2rem; text-align:center;">
      <h3>Real-Time Crypto Charts</h3>
      <p style="color:var(--text-sec); margin:1rem 0;">Mock Binance data</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1.5rem; margin-top:2rem;">
        <div class="glass-panel">
          <h4>BTC/USDT</h4>
          <div style="font-size:2rem; color:var(--accent);">$45,234</div>
          <div style="color:#0f0;">+2.3%</div>
        </div>
        <div class="glass-panel">
          <h4>ETH/USDT</h4>
          <div style="font-size:2rem; color:var(--accent-sec);">$2,567</div>
          <div style="color:#0f0;">+1.8%</div>
        </div>
        <div class="glass-panel">
          <h4>BNB/USDT</h4>
          <div style="font-size:2rem; color:var(--accent);">$312</div>
          <div style="color:#f00;">-0.5%</div>
        </div>
      </div>
      <canvas id="crypto-chart" width="600" height="300" style="margin-top:2rem; max-width:100%;"></canvas>
    </div>
  `;
  
  const canvas = document.getElementById('crypto-chart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < canvas.width; i += 10) {
      const y = canvas.height / 2 + Math.sin(i / 50) * 80 + (Math.random() - 0.5) * 20;
      ctx.lineTo(i, y);
    }
    ctx.stroke();
  }
}

function simulateTransaction() {
  alert('⚡ Gasless Transaction Simulated\n\nFrom: 0xabc...def\nTo: 0x123...456\nAmount: 0.01 ETH\nGas: Sponsored\nStatus: ✓ Confirmed');
}

// INFRA MONITOR
function initInfra() {
  drawCpuGauge();
}

function drawCpuGauge() {
  const canvas = document.getElementById('cpu-gauge');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height;
  const radius = 80;
  
  ctx.strokeStyle = 'rgba(100,100,100,0.3)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 0);
  ctx.stroke();
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#00ff88');
  gradient.addColorStop(1, '#00ccff');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * 0.67));
  ctx.stroke();
}

function healthCheck() {
  const logsOutput = document.getElementById('logs-output');
  if (!logsOutput) return;
  logsOutput.textContent = `[${new Date().toISOString()}] Running health checks...\n`;
  logsOutput.textContent += '[INFO] K8s API: ✓ Healthy\n[INFO] Pods: 12/15 Running\n[INFO] KrakenD: ✓ (45ms)\n[SUCCESS] All OK\n';
}

function parseLogs() {
  const logsOutput = document.getElementById('logs-output');
  if (!logsOutput) return;
  logsOutput.textContent = '[2025-11-30 19:45:12] GET /api/v1/crypto - 200 (42ms)\n[2025-11-30 19:45:15] GET /api/v1/users - 200 (38ms)\n';
}

// CODE PLAYGROUND
function initMonaco() {
  if (monacoEditor) return;
  
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
  require(['vs/editor/editor.main'], function() {
    monacoEditor = monaco.editor.create(document.getElementById('monaco-editor'), {
      value: '// Write code...\nconsole.log("Hello DevForge!");',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false }
    });
  });
  
  fetch('snippets.json').then(r => r.json()).then(data => { snippetsData = data; }).catch(() => {});
}

function loadTemplate() {
  const select = document.getElementById('template-select');
  const templateKey = select.value;
  if (!templateKey || !snippetsData[templateKey]) return;
  
  const snippet = snippetsData[templateKey];
  if (monacoEditor) {
    monaco.editor.setModelLanguage(monacoEditor.getModel(), snippet.language);
    monacoEditor.setValue(snippet.code);
  }
}

function runCode() {
  if (!monacoEditor) return;
  const code = monacoEditor.getValue();
  const consoleOutput = document.getElementById('console-output');
  const preview = document.getElementById('code-preview');
  
  consoleOutput.textContent = '> Running...\n';
  
  try {
    if (code.includes('<') && code.includes('>')) {
      const doc = preview.contentDocument;
      doc.open();
      doc.write(code);
      doc.close();
      consoleOutput.textContent += '✓ HTML rendered\n';
    } else {
      const result = eval(code);
      consoleOutput.textContent += `✓ Result: ${result}\n`;
    }
  } catch (error) {
    consoleOutput.textContent += `✗ Error: ${error.message}\n`;
  }
}

function clearEditor() {
  if (monacoEditor) monacoEditor.setValue('');
  document.getElementById('console-output').textContent = '';
  document.getElementById('template-select').value = '';
}

// DEPLOY CENTER
function generateZip() {
  document.getElementById('deploy-files').innerHTML = '<h4>📦 ZIP Generated</h4><p>devforge-playground.zip</p><button onclick="alert(\'Download ready!\')">⬇️ Download</button>';
}

function generateGitHubActions() {
  const yaml = 'name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest';
  document.getElementById('deploy-files').innerHTML = `<h4>⚙️ GitHub Actions</h4><pre style="background:#000;padding:1rem;border-radius:8px;">${yaml}</pre>`;
}

function generateVercel() {
  document.getElementById('deploy-files').innerHTML = '<h4>▲ Vercel Config</h4><p>Run: <code>vercel deploy --prod</code></p>';
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  initEffects();
});