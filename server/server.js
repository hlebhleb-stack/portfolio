import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ========== Config ==========
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// ========== Telegram Bot ==========
let bot = null;
if (BOT_TOKEN) {
  bot = new TelegramBot(BOT_TOKEN, { polling: false });
  console.log('Telegram bot initialized');
} else {
  console.warn('TELEGRAM_BOT_TOKEN not set — bot disabled');
}

function sendTelegram(text) {
  if (bot && CHAT_ID) {
    bot.sendMessage(CHAT_ID, text, { parse_mode: 'HTML' }).catch(console.error);
  }
}

// ========== Analytics Storage ==========
const DATA_FILE = path.join(__dirname, 'analytics.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { visits: [], contacts: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Init file if missing
if (!fs.existsSync(DATA_FILE)) {
  saveData({ visits: [], contacts: [] });
}

// ========== Middleware ==========
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// ========== API: Track Page View ==========
app.post('/api/track', (req, res) => {
  const { page, referrer, screenWidth } = req.body;
  const data = loadData();

  const visit = {
    page: page || '/',
    referrer: referrer || '',
    screenWidth: screenWidth || 0,
    device: (screenWidth || 0) <= 768 ? 'mobile' : 'desktop',
    ip: req.headers['x-forwarded-for'] || req.ip,
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString(),
  };

  data.visits.push(visit);
  saveData(data);

  res.json({ ok: true });
});

// ========== API: Contact Form ==========
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const data = loadData();
  const contact = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  };
  data.contacts.push(contact);
  saveData(data);

  // Send to Telegram
  const text =
    `📩 <b>New message from portfolio</b>\n\n` +
    `<b>Name:</b> ${name}\n` +
    `<b>Email:</b> ${email}\n` +
    `<b>Message:</b>\n${message}`;
  sendTelegram(text);

  res.json({ ok: true });
});

// ========== API: Stats (for you) ==========
app.get('/api/stats', (req, res) => {
  const data = loadData();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const todayVisits = data.visits.filter(v => v.timestamp.startsWith(todayStr));
  const totalVisits = data.visits.length;
  const totalContacts = data.contacts.length;

  // Unique IPs today
  const uniqueToday = new Set(todayVisits.map(v => v.ip)).size;

  // Page breakdown today
  const pages = {};
  todayVisits.forEach(v => {
    pages[v.page] = (pages[v.page] || 0) + 1;
  });

  // Device breakdown today
  const devices = { mobile: 0, desktop: 0 };
  todayVisits.forEach(v => {
    devices[v.device] = (devices[v.device] || 0) + 1;
  });

  res.json({
    today: {
      views: todayVisits.length,
      unique: uniqueToday,
      pages,
      devices,
    },
    total: {
      views: totalVisits,
      contacts: totalContacts,
    },
  });
});

// ========== Daily Report Cron ==========
// Every day at 21:00 (server time)
cron.schedule('0 21 * * *', () => {
  const data = loadData();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const todayVisits = data.visits.filter(v => v.timestamp.startsWith(todayStr));
  const uniqueIPs = new Set(todayVisits.map(v => v.ip)).size;

  const pages = {};
  todayVisits.forEach(v => {
    pages[v.page] = (pages[v.page] || 0) + 1;
  });

  const devices = { mobile: 0, desktop: 0 };
  todayVisits.forEach(v => {
    devices[v.device] = (devices[v.device] || 0) + 1;
  });

  const pageList = Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .map(([p, c]) => `  ${p} — ${c}`)
    .join('\n') || '  No visits';

  const text =
    `📊 <b>Daily Report — ${todayStr}</b>\n\n` +
    `👀 Views: <b>${todayVisits.length}</b>\n` +
    `👤 Unique visitors: <b>${uniqueIPs}</b>\n` +
    `📱 Mobile: <b>${devices.mobile}</b> | 🖥 Desktop: <b>${devices.desktop}</b>\n\n` +
    `<b>Pages:</b>\n${pageList}\n\n` +
    `<b>Total all time:</b> ${data.visits.length} views, ${data.contacts.length} messages`;

  sendTelegram(text);
  console.log(`Daily report sent: ${todayStr}`);
});

// ========== SPA Fallback ==========
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (bot && CHAT_ID) {
    sendTelegram('🟢 Portfolio server started');
  }
});
