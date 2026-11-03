import path from 'path';
import fs from 'fs';
import https from 'https';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

// Project Configuration
const CONFIG = {
  appName: 'ONEVISHWAM • CORE ADMIN PORTAL',
  projectId: 'onevishwam',
  target: 'admin',
  site: 'onevishwam-admin',
  liveUrl: 'https://onevishwam-admin.web.app',
};

// ─── ANSI Terminal Colors & Styling ──────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Bright Foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

// Strip ANSI color escape codes and terminal hyperlinks
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').replace(/\x1b\]8;;.*?\x07/g, '');
}

// Calculate true visual terminal display width (accounting for wide emojis & control codes)
function getStringWidth(str) {
  const clean = stripAnsi(str);
  let width = 0;
  for (const char of Array.from(clean)) {
    const code = char.codePointAt(0);
    // Ignore variation selectors and zero-width characters
    if (code === 0xfe0f || code === 0x200d || (code >= 0xfe00 && code <= 0xfe0f)) {
      continue;
    }
    // Emojis and wide symbols take 2 terminal columns
    if (
      (code >= 0x1f300 && code <= 0x1faff) ||
      (code >= 0x2600 && code <= 0x27bf) ||
      (code >= 0x2b50 && code <= 0x2b55) ||
      (code >= 0x1f1e6 && code <= 0x1f1ff) ||
      code === 0x231a || code === 0x231b || code === 0x23e9 || code === 0x23ea ||
      code === 0x23eb || code === 0x23ec || code === 0x23f0 || code === 0x23f3
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

// Render mathematically aligned, pixel-perfect terminal double-box
function renderBox({ title, subtitle, items = [], borderColor = C.brightGreen, innerWidth = null }) {
  const visLens = [
    title ? getStringWidth(title) : 0,
    subtitle ? getStringWidth(subtitle) : 0,
    ...items.map(getStringWidth),
  ];
  const maxContentLen = Math.max(...visLens, 40);

  // Keep securely within terminal width to prevent line wrapping
  const termCols = process.stdout.columns || 80;
  const maxAllowed = Math.max(46, termCols - 6);

  const w = innerWidth
    ? Math.min(innerWidth, maxAllowed)
    : Math.min(maxContentLen + 2, maxAllowed);

  const top = `${borderColor}  ╔${'═'.repeat(w + 2)}╗${C.reset}`;
  const div = `${borderColor}  ╠${'═'.repeat(w + 2)}╣${C.reset}`;
  const bottom = `${borderColor}  ╚${'═'.repeat(w + 2)}╝${C.reset}`;

  function padLine(content) {
    const visLen = getStringWidth(content);
    const fill = Math.max(0, w - visLen);
    return `${borderColor}  ║${C.reset} ${content}${' '.repeat(fill)} ${borderColor}║${C.reset}`;
  }

  const lines = [top];
  if (title) {
    lines.push(padLine(title));
  }
  if (subtitle) {
    lines.push(padLine(subtitle));
  }
  if (items.length > 0) {
    lines.push(div);
    for (const item of items) {
      lines.push(padLine(item));
    }
  }
  lines.push(bottom);
  return lines.join('\n');
}

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDuration(ms) {
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

// ─── Directory & Asset Inspection ────────────────────────────────────────────
function scanDirectory(dir) {
  let count = 0;
  let size = 0;
  const types = { js: 0, css: 0, html: 0, img: 0, other: 0 };
  const list = fs.readdirSync(dir);

  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      const sub = scanDirectory(full);
      count += sub.count;
      size += sub.size;
      types.js += sub.types.js;
      types.css += sub.types.css;
      types.html += sub.types.html;
      types.img += sub.types.img;
      types.other += sub.types.other;
    } else {
      count++;
      size += stat.size;
      const ext = path.extname(item).toLowerCase();
      if (ext === '.js') types.js++;
      else if (ext === '.css') types.css++;
      else if (ext === '.html') types.html++;
      else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext)) types.img++;
      else types.other++;
    }
  }
  return { count, size, types };
}

// ─── High-Resolution Liquid Progress Bar ─────────────────────────────────────
const SUB_BLOCKS = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'];

function renderLiquidBar(ratio, width = 20) {
  const clamped = Math.max(0, Math.min(1, ratio));
  const fullFloat = clamped * width;
  const fullBlocks = Math.floor(fullFloat);
  const remainder = fullFloat - fullBlocks;
  const subIndex = Math.floor(remainder * 8);

  let bar = '';
  for (let i = 0; i < fullBlocks; i++) {
    const pos = i / width;
    if (pos < 0.35) bar += `${C.brightCyan}█`;
    else if (pos < 0.75) bar += `${C.brightBlue}█`;
    else bar += `${C.brightGreen}█`;
  }

  if (fullBlocks < width) {
    const subChar = SUB_BLOCKS[subIndex] || '';
    if (subChar) {
      bar += `${C.brightWhite}${subChar}`;
    }
    const emptyCount = width - fullBlocks - (subChar ? 1 : 0);
    bar += `${C.dim}${'░'.repeat(Math.max(0, emptyCount))}`;
  }

  const percent = `${C.bold}${C.brightGreen}${(clamped * 100).toFixed(1).padStart(5, ' ')}%${C.reset}`;
  return `[${bar}${C.reset}] ${percent}`;
}

// ─── Animated Terminal Spinner ───────────────────────────────────────────────
function createSpinner() {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIdx = 0;
  let timer = null;
  let currentText = '';

  return {
    start(text) {
      currentText = text;
      frameIdx = 0;
      process.stdout.write('\x1b[?25l');
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        const frame = frames[frameIdx];
        frameIdx = (frameIdx + 1) % frames.length;
        process.stdout.write(`\r\x1b[2K  ${C.brightCyan}${frame}${C.reset} ${currentText}`);
      }, 75);
    },
    update(text) {
      currentText = text;
    },
    succeed(text) {
      if (timer) clearInterval(timer);
      process.stdout.write(`\r\x1b[2K  ${C.brightGreen}✔${C.reset} ${C.bold}${text}${C.reset}\n`);
      process.stdout.write('\x1b[?25h');
    },
    warn(text) {
      if (timer) clearInterval(timer);
      process.stdout.write(`\r\x1b[2K  ${C.brightYellow}▲${C.reset} ${C.yellow}${text}${C.reset}\n`);
      process.stdout.write('\x1b[?25h');
    },
    fail(text) {
      if (timer) clearInterval(timer);
      process.stdout.write(`\r\x1b[2K  ${C.brightRed}✖${C.reset} ${C.bold}${C.red}${text}${C.reset}\n`);
      process.stdout.write('\x1b[?25h');
    },
    stop() {
      if (timer) clearInterval(timer);
      process.stdout.write('\r\x1b[2K');
      process.stdout.write('\x1b[?25h');
    },
  };
}

// ─── Header Banner ───────────────────────────────────────────────────────────
function printBanner() {
  console.clear();
  console.log(
    '\n' +
      renderBox({
        title: `${C.bold}${C.brightWhite}⚡ ${CONFIG.appName}${C.reset}`,
        subtitle: `${C.dim}Automated build sync, Firebase CDN upload & live site verification${C.reset}`,
        borderColor: C.brightCyan,
        innerWidth: 70,
      }) +
      '\n'
  );
}

// ─── Live HTTP Status Checker ────────────────────────────────────────────────
function verifyLiveWebsite(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'OneVishwam-Admin-Deploy/2.0' }, timeout: 7000 },
      (res) => {
        const latency = Date.now() - startTime;
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, statusCode: res.statusCode, latency });
      }
    );
    req.on('error', (err) => resolve({ ok: false, error: err.message, latency: Date.now() - startTime }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: 'Timed out', latency: Date.now() - startTime });
    });
  });
}

function resolveFirebaseBinary() {
  if (process.platform === 'win32') return 'firebase.cmd';
  const possiblePaths = [
    '/opt/homebrew/bin/firebase',
    '/usr/local/bin/firebase',
    path.resolve(process.env.HOME || '', '.npm-global/bin/firebase'),
  ];
  for (const bin of possiblePaths) {
    if (fs.existsSync(bin)) return bin;
  }
  return 'firebase';
}

// ─── Main Deploy Function ────────────────────────────────────────────────────
async function deploy() {
  printBanner();

  const startTime = Date.now();
  const spinner = createSpinner();

  // ── STEP 1: Verify Build Directory ──
  spinner.start('Validating production build artifacts in dist/...');
  await new Promise((r) => setTimeout(r, 250));

  if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
    spinner.fail('Build artifact validation failed: "dist/index.html" not found!');
    console.log(`\n  ${C.brightYellow}👉 Please run "npm run build" first before deploying.${C.reset}\n`);
    process.exit(1);
  }

  const { count: totalFiles, size: totalBytes, types } = scanDirectory(distDir);
  const typeSummary = `${C.cyan}${types.js} JS${C.reset} • ${C.blue}${types.css} CSS${C.reset} • ${C.yellow}${types.html} HTML${C.reset} • ${C.magenta}${types.img} Media${C.reset}`;
  spinner.succeed(`Production build verified (${C.brightCyan}${totalFiles} assets${C.reset}, ${C.brightGreen}${formatBytes(totalBytes)}${C.reset}) [${typeSummary}]`);

  // ── STEP 2: Verify Firebase Target Configuration ──
  spinner.start('Verifying Firebase Hosting project & deploy target...');
  await new Promise((r) => setTimeout(r, 200));

  const firebasercPath = path.resolve(projectRoot, '.firebaserc');
  const firebaseJsonPath = path.resolve(projectRoot, 'firebase.json');

  if (!fs.existsSync(firebasercPath) || !fs.existsSync(firebaseJsonPath)) {
    spinner.fail('Missing .firebaserc or firebase.json in project root!');
    process.exit(1);
  }

  spinner.succeed(`Firebase target ready: ${C.brightCyan}${CONFIG.target}${C.reset} → site ${C.brightGreen}${CONFIG.site}${C.reset} (Project: ${C.brightYellow}${CONFIG.projectId}${C.reset})`);

  // ── STEP 3: Firebase Deployment Streaming Animation ──
  console.log(`\n  ${C.bold}🚀 Deploying to Firebase Hosting Global CDN...${C.reset}`);

  let currentPhase = 'Initializing Firebase CLI...';
  let progressRatio = 0.05;
  const pulseFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let pulseIdx = 0;

  process.stdout.write('\x1b[?25l');

  // Render loop for smooth live updates
  const renderInterval = setInterval(() => {
    pulseIdx = (pulseIdx + 1) % pulseFrames.length;
    const spinChar = pulseFrames[pulseIdx];

    const bar = renderLiquidBar(progressRatio, 18);
    const termCols = process.stdout.columns || 80;
    const prefix = `  ${C.brightCyan}${spinChar}${C.reset} ${bar} ${C.dim}|${C.reset} `;

    const visiblePrefixLen = stripAnsi(prefix).length;
    const maxPhaseLen = Math.max(15, termCols - visiblePrefixLen - 4);

    let displayPhase = currentPhase;
    if (displayPhase.length > maxPhaseLen) {
      displayPhase = displayPhase.slice(0, maxPhaseLen - 3) + '...';
    }

    const output = `${prefix}${C.yellow}${displayPhase}${C.reset}`;
    process.stdout.write(`\r\x1b[2K${output}`);
  }, 45);

  const firebaseBin = resolveFirebaseBinary();
  const firebaseProcess = spawn(
    firebaseBin,
    ['deploy', `--only=hosting:${CONFIG.target}`, `--project=${CONFIG.projectId}`],
    {
      cwd: projectRoot,
      shell: true,
    }
  );

  let fullOutput = '';

  firebaseProcess.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    fullOutput += text;
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
      if (line.includes('preparing') && line.includes('directory')) {
        progressRatio = Math.max(progressRatio, 0.2);
        currentPhase = 'Packaging dist/ assets for upload...';
      } else if (line.includes('packaged') && line.includes('for uploading')) {
        progressRatio = Math.max(progressRatio, 0.4);
        currentPhase = 'Assets compressed and ready for CDN upload';
      } else if (line.includes('uploading') || line.includes('Uploading')) {
        progressRatio = Math.max(progressRatio, 0.65);
        currentPhase = 'Uploading file chunks to Firebase Hosting...';
      } else if (line.includes('upload') && line.includes('%')) {
        const match = line.match(/(\d+)%/);
        if (match) {
          progressRatio = Math.max(progressRatio, parseInt(match[1], 10) / 100);
          currentPhase = `Uploading to CDN: ${match[1]}%`;
        }
      } else if (line.includes('finalizing') || line.includes('Finalizing')) {
        progressRatio = Math.max(progressRatio, 0.9);
        currentPhase = 'Finalizing CDN release & version rollout...';
      } else if (line.includes('Deploy complete!') || line.includes('hosting:admin: Deploy complete')) {
        progressRatio = 1.0;
        currentPhase = 'Release deployed successfully to CDN!';
      }
    }
  });

  firebaseProcess.stderr.on('data', (chunk) => {
    fullOutput += chunk.toString();
  });

  const exitCode = await new Promise((resolve) => {
    firebaseProcess.on('close', (code) => resolve(code));
  });

  clearInterval(renderInterval);
  process.stdout.write('\x1b[?25h');

  if (exitCode !== 0) {
    spinner.fail(`Firebase deployment failed with exit code ${exitCode}`);
    console.log(`\n${C.red}Firebase CLI Output:${C.reset}\n${fullOutput}\n`);
    process.exit(exitCode);
  }

  // Final 100% completion bar
  const completeBar = renderLiquidBar(1, 18);
  process.stdout.write(
    `\r\x1b[2K  ${C.brightGreen}✔${C.reset} ${completeBar} ${C.dim}|${C.reset} ${C.bold}${formatBytes(totalBytes)} / ${formatBytes(totalBytes)}${C.reset} ${C.dim}|${C.reset} ${C.brightGreen}100% DEPLOYED${C.reset}\n\n`
  );

  // ── STEP 4: Live Website Verification Ping ──
  spinner.start(`Pinging ${CONFIG.liveUrl} to verify live status...`);
  const liveCheck = await verifyLiveWebsite(CONFIG.liveUrl);

  if (liveCheck.ok) {
    spinner.succeed(`Live portal online: ${C.brightGreen}HTTP ${liveCheck.statusCode} OK${C.reset} ${C.dim}(Latency: ${liveCheck.latency}ms)${C.reset}`);
  } else {
    spinner.warn(`Live ping check returned: ${liveCheck.statusCode || liveCheck.error} (CDN propagation may take ~15s)`);
  }

  const elapsed = formatDuration(Date.now() - startTime);

  // Clickable terminal hyperlink standard (OSC 8)
  const clickableUrl = `\x1b]8;;${CONFIG.liveUrl}\x07${C.brightCyan}${C.underline}${CONFIG.liveUrl}${C.reset}\x1b]8;;\x07`;

  // ── Celebration Summary Card ──
  const summaryCard = renderBox({
    title: `${C.bold}${C.brightWhite}✨ ${CONFIG.appName} • DEPLOYED!${C.reset}`,
    items: [
      `${C.bold}🌐 Live Website:${C.reset}     ${clickableUrl} ${C.dim}(Cmd+Click to open)${C.reset}`,
      `${C.bold}🎯 Deploy Target:${C.reset}    ${C.brightMagenta}hosting:${CONFIG.target}${C.reset} → ${C.brightWhite}${CONFIG.site}${C.reset}`,
      `${C.bold}📦 Total Assets:${C.reset}     ${C.brightWhite}${totalFiles} files synchronized${C.reset}`,
      `${C.bold}📊 Upload Size:${C.reset}      ${C.brightGreen}${formatBytes(totalBytes)}${C.reset}`,
      `${C.bold}🕒 Elapsed Time:${C.reset}     ${C.brightYellow}${elapsed}${C.reset}`,
    ],
    borderColor: C.brightGreen,
    innerWidth: 70,
  });
  console.log('\n' + summaryCard + '\n');

  process.stdout.write('\x07'); // Audio chime
}

deploy();

