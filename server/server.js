import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import geoip from 'geoip-lite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ========== Config ==========
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TZ = process.env.TZ_OFFSET_HOURS ? Number(process.env.TZ_OFFSET_HOURS) : 0;
const DEDUPE_MIN = 30; // same session+page within N minutes counts once
const BOT_UA = /(bot|crawler|spider|crawling|preview|fetch|monitor|pingdom|uptime|headlesschrome|googlebot|bingbot|yandex|facebookexternalhit|slurp|duckduckbot|baiduspider|telegrambot|whatsapp|curl|wget|python|node-fetch|axios|postman)/i;

// ========== Storage ==========
// Primary: GitHub Gist (survives Render free-tier restarts)
// Fallback: local file (works locally / on persistent-disk hosts)
const DATA_FILE = path.join(__dirname, 'analytics.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GIST_ID = process.env.GIST_ID || '';
const GIST_FILENAME = process.env.GIST_FILENAME || 'analytics.json';
const GIST_ENABLED = !!(GITHUB_TOKEN && GIST_ID);

function emptyData() {
  return { visits: [], contacts: [] };
}

function normalize(d) {
  if (!d || typeof d !== 'object') return emptyData();
  if (!Array.isArray(d.visits)) d.visits = [];
  if (!Array.isArray(d.contacts)) d.contacts = [];
  return d;
}

let state = emptyData();

function readLocal() {
  try {
    return normalize(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')));
  } catch {
    return emptyData();
  }
}

function writeLocal(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error('Local write failed:', e.message); }
}

async function readGist() {
  const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'portfolio-analytics',
      Accept: 'application/vnd.github+json',
    },
  });
  if (!r.ok) throw new Error(`Gist GET ${r.status}`);
  const g = await r.json();
  const file = g.files?.[GIST_FILENAME] || Object.values(g.files || {})[0];
  if (!file) return emptyData();
  // Truncated content → fetch raw_url
  let content = file.content;
  if (file.truncated && file.raw_url) {
    const raw = await fetch(file.raw_url);
    content = await raw.text();
  }
  try { return normalize(JSON.parse(content)); } catch { return emptyData(); }
}

async function writeGist(data) {
  const r = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'portfolio-analytics',
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(data, null, 2) } },
    }),
  });
  if (!r.ok) throw new Error(`Gist PATCH ${r.status}`);
}

let gistTimer = null;
let gistPending = false;
let gistInFlight = false;
const GIST_DEBOUNCE_MS = 15000;

function scheduleGistSync() {
  if (!GIST_ENABLED) return;
  gistPending = true;
  if (gistTimer || gistInFlight) return;
  gistTimer = setTimeout(flushGist, GIST_DEBOUNCE_MS);
}

async function flushGist() {
  gistTimer = null;
  if (gistInFlight || !gistPending) return;
  gistInFlight = true;
  gistPending = false;
  try {
    await writeGist(state);
  } catch (e) {
    console.error('Gist sync failed:', e.message);
    gistPending = true; // retry next tick
    gistTimer = setTimeout(flushGist, 60000);
  } finally {
    gistInFlight = false;
    if (gistPending && !gistTimer) gistTimer = setTimeout(flushGist, GIST_DEBOUNCE_MS);
  }
}

function loadData() {
  return state;
}

function saveData(data) {
  state = normalize(data);
  writeLocal(state);
  scheduleGistSync();
}

async function initStorage() {
  if (GIST_ENABLED) {
    try {
      state = await readGist();
      writeLocal(state);
      console.log(`Storage: Gist ${GIST_ID} loaded (${state.visits.length} visits, ${state.contacts.length} contacts)`);
      return;
    } catch (e) {
      console.error('Gist load failed, falling back to local file:', e.message);
    }
  }
  state = readLocal();
  if (!fs.existsSync(DATA_FILE)) writeLocal(state);
  console.log(`Storage: local file (${state.visits.length} visits, ${state.contacts.length} contacts)`);
}

// Flush pending gist writes on shutdown
async function gracefulShutdown() {
  console.log('Shutting down, flushing gist...');
  if (gistTimer) { clearTimeout(gistTimer); gistTimer = null; }
  if (gistPending && GIST_ENABLED) {
    try { await writeGist(state); console.log('Gist flushed'); }
    catch (e) { console.error('Final flush failed:', e.message); }
  }
  process.exit(0);
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ========== Date helpers ==========
function todayStr(offset = 0) {
  const d = new Date(Date.now() + offset * 86400000);
  return d.toISOString().slice(0, 10);
}

function inLastDays(ts, days) {
  const cutoff = Date.now() - days * 86400000;
  return new Date(ts).getTime() >= cutoff;
}

function rangeLabel(period) {
  if (period === 'today') return `Today · ${todayStr()}`;
  if (period === 'yesterday') return `Yesterday · ${todayStr(-1)}`;
  if (period === 'week') return 'Last 7 days';
  if (period === 'month') return 'Last 30 days';
  return 'All time';
}

function filterByPeriod(visits, period) {
  if (period === 'today') {
    const t = todayStr();
    return visits.filter(v => v.timestamp.startsWith(t));
  }
  if (period === 'yesterday') {
    const y = todayStr(-1);
    return visits.filter(v => v.timestamp.startsWith(y));
  }
  if (period === 'week') return visits.filter(v => inLastDays(v.timestamp, 7));
  if (period === 'month') return visits.filter(v => inLastDays(v.timestamp, 30));
  return visits;
}

// ========== Formatting ==========
function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function padLeft(s, n) {
  s = String(s);
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

const MIN_ROW_WIDTH = 38;
const NBSP = ' '; // Telegram preserves NBSP in <pre>; trims trailing regular spaces

function padRightNbsp(s, n) {
  s = String(s);
  return s.length >= n ? s : s + NBSP.repeat(n - s.length);
}

function table(rows) {
  if (!rows.length) return padRightNbsp('  —', MIN_ROW_WIDTH);
  const labelW = Math.min(28, Math.max(...rows.map(r => String(r[0]).length)));
  const valW = Math.max(...rows.map(r => String(r[1]).length));
  return rows
    .map(([k, v]) => {
      const line = `  ${pad(String(k).slice(0, labelW), labelW)}  ${padLeft(v, valW)}`;
      return padRightNbsp(line, MIN_ROW_WIDTH);
    })
    .join('\n');
}

function topCounts(items, limit = 10) {
  const counts = {};
  for (const it of items) {
    const key = it || '—';
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function uniqueSessions(visits) {
  return new Set(visits.map(v => v.sessionId || v.ip || '')).size;
}

const COUNTRY_NAMES = {
  US: 'United States', RU: 'Russia', UA: 'Ukraine', BY: 'Belarus', KZ: 'Kazakhstan',
  DE: 'Germany', GB: 'United Kingdom', FR: 'France', ES: 'Spain', IT: 'Italy',
  NL: 'Netherlands', PL: 'Poland', CZ: 'Czech Republic', AT: 'Austria', CH: 'Switzerland',
  SE: 'Sweden', NO: 'Norway', FI: 'Finland', DK: 'Denmark', PT: 'Portugal',
  CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', CL: 'Chile',
  JP: 'Japan', CN: 'China', KR: 'South Korea', IN: 'India', TH: 'Thailand',
  VN: 'Vietnam', SG: 'Singapore', AU: 'Australia', NZ: 'New Zealand',
  TR: 'Turkey', IL: 'Israel', AE: 'UAE', SA: 'Saudi Arabia',
  GE: 'Georgia', AM: 'Armenia', AZ: 'Azerbaijan', UZ: 'Uzbekistan',
  RO: 'Romania', BG: 'Bulgaria', HU: 'Hungary', GR: 'Greece', IE: 'Ireland',
  BE: 'Belgium', LU: 'Luxembourg', LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia',
  RS: 'Serbia', HR: 'Croatia', SI: 'Slovenia', SK: 'Slovakia', MD: 'Moldova',
};

function lookupCountry(ip) {
  if (!ip) return null;
  // Strip port from IPv4 addresses if present
  const clean = ip.replace(/^::ffff:/, '').split(':')[0];
  if (!clean || clean === '127.0.0.1' || clean.startsWith('10.') ||
      clean.startsWith('192.168.') || clean.startsWith('172.')) return null;
  try {
    const r = geoip.lookup(clean);
    return r?.country || null;
  } catch { return null; }
}

function geoBreakdown(visits, limit = 20) {
  const codes = visits.map(v => v.country || lookupCountry(v.ip)).filter(Boolean);
  const top = topCounts(codes, limit);
  return top.map(([code, n]) => [`${code}  ${COUNTRY_NAMES[code] || ''}`.trim(), n]);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function section(title, body) {
  return `<b>${escapeHtml(title)}</b>\n<pre>${escapeHtml(body)}</pre>`;
}

// ========== Reports ==========
function summary(period) {
  const data = loadData();
  const visits = filterByPeriod(data.visits, period);
  const sessions = uniqueSessions(visits);
  const mobile = visits.filter(v => v.device === 'mobile').length;
  const desktop = visits.length - mobile;
  const pages = topCounts(visits.map(v => v.page), 8);
  const langs = topCounts(visits.map(v => v.lang).filter(Boolean), 5);
  const referrers = topCounts(
    visits.map(v => v.referrer)
      .filter(r => r && !r.includes('glebaagleb.com'))
      .map(r => { try { return new URL(r).hostname; } catch { return r; } }),
    5
  );

  let out = `<b>${escapeHtml(rangeLabel(period))}</b>\n\n`;
  out += `<pre>${escapeHtml(table([
    ['Views', visits.length],
    ['Sessions', sessions],
    ['Mobile', mobile],
    ['Desktop', desktop],
  ]))}</pre>\n\n`;
  const geo = geoBreakdown(visits, 8);
  if (pages.length) out += section('Pages', table(pages)) + '\n\n';
  if (geo.length) out += section('Geo', table(geo)) + '\n\n';
  if (langs.length) out += section('Languages', table(langs)) + '\n\n';
  if (referrers.length) out += section('Referrers', table(referrers));
  return out.trim();
}

function helpText() {
  return [
    '<b>Commands</b>',
    '<pre>',
    '  /today       today summary',
    '  /yesterday   yesterday summary',
    '  /week        last 7 days',
    '  /month       last 30 days',
    '  /all         all time',
    '  /pages [p]   top pages',
    '  /geo [p]     visitor countries',
    '  /langs [p]   language split',
    '  /devices [p] device split',
    '  /referrers [p]  top referrers',
    '  /export      send analytics.json',
    '  /wipe        delete bot messages',
    '  /clear       wipe analytics (confirm)',
    '  /help        this list',
    '</pre>',
    '<i>p = today | yesterday | week | month | all (default: all)</i>',
  ].join('\n');
}

function parsePeriod(text) {
  const m = (text || '').trim().split(/\s+/)[1];
  if (['today', 'yesterday', 'week', 'month', 'all'].includes(m)) return m;
  return 'all';
}

// ========== Bot ==========
let bot = null;
let pendingClear = false;
let pendingTimer = null;
const sentMessages = new Map(); // chatId -> Set<messageId>

function rememberSent(chatId, messageId) {
  if (!messageId) return;
  if (!sentMessages.has(chatId)) sentMessages.set(chatId, new Set());
  sentMessages.get(chatId).add(messageId);
}

function authed(msg) {
  return CHAT_ID && String(msg.chat.id) === CHAT_ID;
}

function reply(chatId, html) {
  return bot.sendMessage(chatId, html, { parse_mode: 'HTML', disable_web_page_preview: true })
    .then(m => { rememberSent(chatId, m?.message_id); return m; })
    .catch(err => console.error('TG send error:', err.message));
}

if (BOT_TOKEN) {
  bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log('Telegram bot initialized');

  bot.on('polling_error', e => console.error('Polling error:', e.message));

  bot.setMyCommands([
    { command: 'today',     description: 'Today summary' },
    { command: 'yesterday', description: 'Yesterday summary' },
    { command: 'week',      description: 'Last 7 days' },
    { command: 'month',     description: 'Last 30 days' },
    { command: 'all',       description: 'All time' },
    { command: 'pages',     description: 'Top pages' },
    { command: 'geo',       description: 'Visitor countries' },
    { command: 'langs',     description: 'Language split' },
    { command: 'devices',   description: 'Device split' },
    { command: 'referrers', description: 'Top referrers' },
    { command: 'export',    description: 'Send analytics.json' },
    { command: 'wipe',      description: 'Delete bot messages in this chat' },
    { command: 'clear',     description: 'Wipe all analytics data (confirm)' },
    { command: 'help',      description: 'Show command list' },
  ]).catch(e => console.error('setMyCommands failed:', e.message));

  bot.onText(/^\/(start|help)\b/, msg => { if (authed(msg)) reply(msg.chat.id, helpText()); });
  bot.onText(/^\/today\b/, msg => { if (authed(msg)) reply(msg.chat.id, summary('today')); });
  bot.onText(/^\/yesterday\b/, msg => { if (authed(msg)) reply(msg.chat.id, summary('yesterday')); });
  bot.onText(/^\/week\b/, msg => { if (authed(msg)) reply(msg.chat.id, summary('week')); });
  bot.onText(/^\/month\b/, msg => { if (authed(msg)) reply(msg.chat.id, summary('month')); });
  bot.onText(/^\/all\b/, msg => { if (authed(msg)) reply(msg.chat.id, summary('all')); });

  bot.onText(/^\/pages\b/, msg => {
    if (!authed(msg)) return;
    const period = parsePeriod(msg.text);
    const visits = filterByPeriod(loadData().visits, period);
    const rows = topCounts(visits.map(v => v.page), 20);
    reply(msg.chat.id, `<b>Pages · ${escapeHtml(rangeLabel(period))}</b>\n<pre>${escapeHtml(table(rows))}</pre>`);
  });

  bot.onText(/^\/langs\b/, msg => {
    if (!authed(msg)) return;
    const period = parsePeriod(msg.text);
    const visits = filterByPeriod(loadData().visits, period);
    const rows = topCounts(visits.map(v => v.lang).filter(Boolean), 10);
    reply(msg.chat.id, `<b>Languages · ${escapeHtml(rangeLabel(period))}</b>\n<pre>${escapeHtml(table(rows))}</pre>`);
  });

  bot.onText(/^\/devices\b/, msg => {
    if (!authed(msg)) return;
    const period = parsePeriod(msg.text);
    const visits = filterByPeriod(loadData().visits, period);
    const rows = topCounts(visits.map(v => v.device), 5);
    reply(msg.chat.id, `<b>Devices · ${escapeHtml(rangeLabel(period))}</b>\n<pre>${escapeHtml(table(rows))}</pre>`);
  });

  bot.onText(/^\/geo\b/, msg => {
    if (!authed(msg)) return;
    const period = parsePeriod(msg.text);
    const visits = filterByPeriod(loadData().visits, period);
    const rows = geoBreakdown(visits, 30);
    reply(msg.chat.id, `<b>Geo · ${escapeHtml(rangeLabel(period))}</b>\n<pre>${escapeHtml(table(rows))}</pre>`);
  });

  bot.onText(/^\/referrers\b/, msg => {
    if (!authed(msg)) return;
    const period = parsePeriod(msg.text);
    const visits = filterByPeriod(loadData().visits, period);
    const rows = topCounts(
      visits.map(v => v.referrer)
        .filter(r => r && !r.includes('glebaagleb.com'))
        .map(r => { try { return new URL(r).hostname; } catch { return r; } }),
      20
    );
    reply(msg.chat.id, `<b>Referrers · ${escapeHtml(rangeLabel(period))}</b>\n<pre>${escapeHtml(table(rows.length ? rows : [['—', 0]]))}</pre>`);
  });

  bot.onText(/^\/export\b/, msg => {
    if (!authed(msg)) return;
    bot.sendDocument(msg.chat.id, DATA_FILE, {}, { filename: 'analytics.json', contentType: 'application/json' })
      .then(m => rememberSent(msg.chat.id, m?.message_id))
      .catch(err => reply(msg.chat.id, `<b>Export failed</b>\n<pre>${escapeHtml(err.message)}</pre>`));
  });

  bot.onText(/^\/wipe\b/, async msg => {
    if (!authed(msg)) return;
    const chatId = msg.chat.id;
    const ids = sentMessages.get(chatId);
    let deleted = 0;
    let failed = 0;
    if (ids) {
      for (const id of [...ids]) {
        try {
          await bot.deleteMessage(chatId, id);
          ids.delete(id);
          deleted++;
        } catch {
          ids.delete(id); // older than 48h or already gone
          failed++;
        }
      }
    }
    // Also try to delete the /wipe command itself
    try { await bot.deleteMessage(chatId, msg.message_id); } catch {}
    const note = await bot.sendMessage(
      chatId,
      `<b>Wiped</b>\nDeleted ${deleted} bot message(s)${failed ? `, ${failed} were too old` : ''}.`,
      { parse_mode: 'HTML' }
    );
    rememberSent(chatId, note?.message_id);
  });

  bot.onText(/^\/clear\b/, msg => {
    if (!authed(msg)) return;
    pendingClear = true;
    if (pendingTimer) clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => { pendingClear = false; }, 60000);
    reply(msg.chat.id, '<b>Confirm wipe</b>\nReply <code>/yes</code> within 60s to wipe all analytics.');
  });

  bot.onText(/^\/yes\b/, msg => {
    if (!authed(msg)) return;
    if (!pendingClear) return reply(msg.chat.id, 'Nothing to confirm.');
    saveData({ visits: [], contacts: [] });
    pendingClear = false;
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    reply(msg.chat.id, '<b>Cleared</b>');
  });
} else {
  console.warn('TELEGRAM_BOT_TOKEN not set — bot disabled');
}

function sendTelegram(html) {
  if (bot && CHAT_ID) reply(CHAT_ID, html);
}

// ========== Middleware ==========
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// ========== Track ==========
app.post('/api/track', (req, res) => {
  const ua = req.headers['user-agent'] || '';
  if (BOT_UA.test(ua)) return res.json({ ok: true, ignored: 'bot' });

  const { page, referrer, screenWidth, lang, sessionId } = req.body || {};
  const ip = (req.headers['x-forwarded-for'] || req.ip || '').toString().split(',')[0].trim();
  const data = loadData();

  // Dedupe: same sessionId+page within DEDUPE_MIN minutes counts once
  const key = sessionId || ip;
  const cutoff = Date.now() - DEDUPE_MIN * 60000;
  const dupe = data.visits.find(v =>
    (v.sessionId || v.ip) === key &&
    v.page === page &&
    new Date(v.timestamp).getTime() >= cutoff
  );
  if (dupe) return res.json({ ok: true, ignored: 'dedupe' });

  data.visits.push({
    page: page || '/',
    referrer: referrer || '',
    screenWidth: Number(screenWidth) || 0,
    device: (Number(screenWidth) || 0) <= 768 ? 'mobile' : 'desktop',
    lang: lang || '',
    sessionId: sessionId || '',
    ip,
    country: lookupCountry(ip) || '',
    userAgent: ua,
    timestamp: new Date().toISOString(),
  });
  saveData(data);
  res.json({ ok: true });
});

// ========== Contact ==========
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields required' });
  const data = loadData();
  data.contacts.push({ name, email, message, timestamp: new Date().toISOString() });
  saveData(data);
  sendTelegram(
    `<b>New message</b>\n<pre>${escapeHtml(`From: ${name} <${email}>\n\n${message}`)}</pre>`
  );
  res.json({ ok: true });
});

// ========== Stats JSON ==========
app.get('/api/stats', (req, res) => {
  const data = loadData();
  const today = filterByPeriod(data.visits, 'today');
  res.json({
    today: { views: today.length, sessions: uniqueSessions(today) },
    total: { views: data.visits.length, contacts: data.contacts.length },
  });
});

// ========== Crons ==========
// Daily digest — 21:00 server time
cron.schedule('0 21 * * *', () => {
  sendTelegram(summary('today'));
  console.log('Daily digest sent');
});

// Weekly digest — Monday 09:00 server time
cron.schedule('0 9 * * 1', () => {
  sendTelegram('<b>Weekly digest</b>\n\n' + summary('week'));
  console.log('Weekly digest sent');
});

// ========== SPA fallback ==========
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

initStorage().then(() => {
  app.listen(PORT, () => {
    console.log(`Server on :${PORT} (TZ offset ${TZ}h)`);
  });
});
