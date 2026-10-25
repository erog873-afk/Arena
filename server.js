'use strict';

/**
 * Онлайн-арена. Один сервер = одна комната.
 * HTTP + Server-Sent Events (EventSource) + POST-запросы.
 *
 * НАСТРОЙКИ ДЛЯ ЗАПОЛНЕНИЯ находятся ниже.
 * Не вставляйте токен бота в public/index.html — только в этот файл.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* ═══════════════════════════════════════════════════════════════
   НАСТРОЙКИ — ЗАПОЛНИ ЗНАЧЕНИЯ В КАВЫЧКАХ
   ═══════════════════════════════════════════════════════════════ */

// 1. Токен Telegram-бота от @BotFather.
//    Пример формата: '123456789:AA...'
//    Используй новый токен, если старый уже отправлялся кому-либо.
const BOT_TOKEN = '8884195033:AAG_UPjYCKkVzcwvyjhVyIXDfAiejQJ75DY';

// 2. Публичная HTTPS-ссылка на сервер (например, адрес сервиса Render).
//    Если PUBLIC_URL не указан, вебхук Telegram автоматически не установится.
const PUBLIC_URL = 'https://arena-0gpy.onrender.com';

// 3. Секретный ключ для ручного пополнения через /api/admin/credit.
//    Придумай длинную случайную строку и никому её не отправляй.
const ADMIN_KEY = '123';

// 4. Порт сервера. На хостинге обычно назначается автоматически.
const PORT = process.env.PORT || 3000;

// 5. Баланс нового игрока.
//    Если указан BOT_TOKEN, по умолчанию новые игроки получают 0 звёзд.
//    Для теста можно поставить 200, но это не изменит балансы уже созданных игроков.
const START_BALANCE = 200;

// 6. Допуск гостевых пользователей.
//    true — разрешить вход без Telegram (удобно для локального теста).
//    false — требовать проверенный вход через Telegram.
const ALLOW_GUEST = !BOT_TOKEN || BOT_TOKEN.startsWith('ВСТАВЬ_');

// 7. Игровые параметры.
const FEE_PERCENT = 0;  // Комиссия с банка, проценты.
const COUNTDOWN = 20;   // Секунд до старта после второй ставки.
const WAIT_TIMEOUT = 120; // Секунд ожидания второго игрока.
// 8. ТЕСТ. Сколько звёзд один раз получает каждый, кто зашёл в игру. После теста поставь 0.
const TEST_GRANT = 100;

const MIN_BET = 10;
const MAX_BET = 20000;

/* ═══════════════════════════════════════════════════════════════
   ОСНОВНЫЕ НАСТРОЙКИ СЕРВЕРА — ОБЫЧНО МЕНЯТЬ НЕ НУЖНО
   ═══════════════════════════════════════════════════════════════ */

const cfg = {
  port: +PORT,
  botToken: BOT_TOKEN.startsWith('ВСТАВЬ_') ? '' : BOT_TOKEN,
  adminKey: ADMIN_KEY.startsWith('ПРИДУМАЙ_') ? '' : ADMIN_KEY,
  publicUrl: PUBLIC_URL.startsWith('https://ВСТАВЬ_')
    ? ''
    : PUBLIC_URL.replace(/\/$/, ''),
  dataDir: process.env.DATA_DIR || path.join(__dirname, 'data'),
  allowGuest: process.env.ALLOW_GUEST
    ? process.env.ALLOW_GUEST === '1'
    : ALLOW_GUEST,
  startBalance: START_BALANCE,
  feePercent: FEE_PERCENT,
  countdown: COUNTDOWN,
  waitTimeout: WAIT_TIMEOUT,
  runMs: 10000,
  doneHoldMs: 3500,
  testGrant: TEST_GRANT,
  min: MIN_BET,
  max: MAX_BET,
};

const PALETTE = ['#FF6B63', '#20845F', '#376FEA', '#F6D14A', '#A855F7', '#14B8A6', '#F97316', '#EC4899'];
const EMOJIS = ['😘', '🔥', '🤣', '💩', '🤡'];

/* ───────────── хранилище (JSON-файл) ───────────── */
fs.mkdirSync(cfg.dataDir, { recursive: true });
const DB_FILE = path.join(cfg.dataDir, 'db.json');
let db = {
  salt: crypto.randomBytes(16).toString('hex'),
  users: {},
  sessions: {},
  payments: {},
  history: [],
};

try {
  db = Object.assign(db, JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
} catch (e) {
  // Первый запуск: база будет создана при первом сохранении.
}

let saveT = null;

function save(now) {
  if (now) return flush();
  if (saveT) return;
  saveT = setTimeout(flush, 400);
}

function flush() {
  clearTimeout(saveT);
  saveT = null;
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE);
}

process.on('SIGINT', () => {
  flush();
  process.exit(0);
});
process.on('SIGTERM', () => {
  flush();
  process.exit(0);
});

const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
const hmac = (k, s) => crypto.createHmac('sha256', k).update(s).digest();
const safeEq = (a, b) => {
  a = Buffer.from(String(a));
  b = Buffer.from(String(b));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const cleanName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 24);

/* ───────────── пользователи и вход ───────────── */
function getUser(uid, name, photo) {
  let u = db.users[uid];
  if (!u) {
    u = db.users[uid] = {
      id: uid,
      pid: sha256(db.salt + uid).slice(0, 10),
      name: '',
      photo: '',
      balance: cfg.startBalance,
      created: Date.now(),
    };
  }
  if (name) u.name = name;
  if (photo !== undefined) u.photo = photo;
  if (!u.name) u.name = 'Игрок ' + u.pid.slice(0, 4);
  return u;
}

const byPid = pid => Object.values(db.users).find(u => u.pid === pid);

/** Проверка подписи Telegram Mini App (initData). Возвращает объект user или null. */
function checkInitData(initData) {
  if (!cfg.botToken || !initData) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get('hash');
  if (!hash) return null;
  p.delete('hash');
  const dcs = [...p.entries()].map(([k, v]) => k + '=' + v).sort().join('\n');
  const secret = hmac('WebAppData', cfg.botToken);
  const calc = crypto.createHmac('sha256', secret).update(dcs).digest('hex');
  if (!safeEq(calc, hash)) return null;
  const ad = +p.get('auth_date');
  if (!ad || Date.now() / 1000 - ad > 86400) return null;
  try {
    return JSON.parse(p.get('user') || 'null');
  } catch (e) {
    return null;
  }
}

function newSession(uid) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = uid;
  save();
  return token;
}

const authUser = token =>
  (token && db.sessions[token] && db.users[db.sessions[token]]) || null;

/* ───────────── игра ───────────── */
function newGame(id) {
  const secret = crypto.randomBytes(32).toString('hex');
  return {
    id,
    phase: 'waiting',
    bets: [],
    secret,
    hash: sha256(secret),
    countEndsAt: 0,
    runStartAt: 0,
    winnerId: null,
    seed: 0,
    revealed: false,
    waitTimer: null,
    countTimer: null,
  };
}

let game = newGame(Math.max(1, ...db.history.map(h => h.id + 1), 1));

function publicState() {
  const live = game.phase === 'run' || game.phase === 'done';
  return {
    now: Date.now(),
    gameId: game.id,
    phase: game.phase,
    hash: game.hash,
    bets: game.bets.map(b => {
      const u = db.users[b.uid];
      return { id: u.pid, name: u.name, photo: u.photo || '', v: b.v, c: b.c };
    }),
    countEndsAt: game.countEndsAt,
    runStartAt: game.runStartAt,
    runDur: cfg.runMs,
    winnerId: live ? game.winnerId : null,
    seed: live ? game.seed : 0,
    secret: game.revealed ? game.secret : null,
    min: cfg.min,
    max: cfg.max,
    fee: cfg.feePercent,
  };
}

/* ───────────── рассылка (SSE) ───────────── */
const clients = new Set();

function sse(res, event, data) {
  res.write('event: ' + event + '\ndata: ' + JSON.stringify(data) + '\n\n');
}

function broadcastState() {
  const s = publicState();
  for (const c of clients) sse(c.res, 'state', s);
}

function sendBalance(uid) {
  const u = db.users[uid];
  if (!u) return;
  for (const c of clients) {
    if (c.uid === uid) sse(c.res, 'balance', { balance: u.balance });
  }
}

setInterval(() => {
  for (const c of clients) c.res.write(': ping\n\n');
}, 15000);

/* ───────────── правила игры ───────────── */
const err = (msg, code = 400) => Object.assign(new Error(msg), { code });

function placeBet(user, amount) {
  if (!Number.isInteger(amount) || amount < cfg.min || amount > cfg.max) {
    throw err('Сумма от ' + cfg.min + ' до ' + cfg.max.toLocaleString('ru-RU'));
  }
  if (game.phase !== 'waiting' && game.phase !== 'count') throw err('Ставки закрыты');
  if (user.balance < amount) throw err('Недостаточно звёзд');

  user.balance -= amount;
  const ex = game.bets.find(b => b.uid === user.id);
  if (ex) ex.v += amount;
  else game.bets.push({ uid: user.id, v: amount, c: PALETTE[game.bets.length % PALETTE.length] });

  save();
  sendBalance(user.id);

  if (game.phase === 'waiting') {
    if (game.bets.length >= 2) startCount();
    else if (!game.waitTimer) game.waitTimer = setTimeout(refundWaiting, cfg.waitTimeout * 1000);
  }
  broadcastState();
}

function refundWaiting() {
  game.waitTimer = null;
  if (game.phase !== 'waiting') return;
  for (const b of game.bets) {
    db.users[b.uid].balance += b.v;
    sendBalance(b.uid);
  }
  game.bets = [];
  save();
  broadcastState();
}

function startCount() {
  clearTimeout(game.waitTimer);
  game.waitTimer = null;
  game.phase = 'count';
  game.countEndsAt = Date.now() + cfg.countdown * 1000;
  game.countTimer = setTimeout(startRun, cfg.countdown * 1000);
  broadcastState();
}

function startRun() {
  const total = game.bets.reduce((a, b) => a + b.v, 0);
  if (total <= 0 || game.bets.length < 2) {
    refundWaiting();
    return;
  }

  // Победитель определяется секретом, хэш которого опубликован до ставок.
  const h = hmac(game.secret, 'winner:' + game.id);
  let ticket = Number(h.readBigUInt64BE(0) % BigInt(total));
  let win = game.bets[0];

  for (const b of game.bets) {
    if (ticket < b.v) {
      win = b;
      break;
    }
    ticket -= b.v;
  }

  game.winnerId = db.users[win.uid].pid;
  game.winnerUid = win.uid;
  game.seed = hmac(game.secret, 'puck:' + game.id).readUInt32BE(0);
  game.phase = 'run';
  game.runStartAt = Date.now();
  broadcastState();
  setTimeout(finishGame, cfg.runMs + 300);
}

function finishGame() {
  const total = game.bets.reduce((a, b) => a + b.v, 0);
  const fee = Math.floor(total * cfg.feePercent / 100);
  const w = db.users[game.winnerUid];

  if (!w) return;

  w.balance += total - fee;
  game.phase = 'done';
  game.revealed = true;
  db.history.push({
    id: game.id,
    hash: game.hash,
    secret: game.secret,
    winner: game.winnerId,
    total,
    fee,
    bets: game.bets.map(b => ({ pid: db.users[b.uid].pid, v: b.v })),
    ts: Date.now(),
  });

  if (db.history.length > 200) db.history.splice(0, db.history.length - 200);
  save(true);
  sendBalance(w.id);
  broadcastState();

  setTimeout(() => {
    game = newGame(game.id + 1);
    broadcastState();
  }, cfg.doneHoldMs);
}

/* ───────────── Telegram Stars (пополнение) ───────────── */
async function tg(method, body) {
  const r = await fetch(
    'https://api.telegram.org/bot' + cfg.botToken + '/' + method,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );
  const j = await r.json();
  if (!j.ok) throw new Error(j.description || 'Telegram error');
  return j.result;
}

const sign = uid => hmac(cfg.botToken, 'inv:' + uid).toString('hex').slice(0, 16);
const webhookPath = () => '/tg/' + sha256('wh' + cfg.botToken).slice(0, 24);

async function handleTelegramUpdate(u) {
  if (u.pre_checkout_query) {
    await tg('answerPreCheckoutQuery', {
      pre_checkout_query_id: u.pre_checkout_query.id,
      ok: true,
    });
    return;
  }

  const sp = u.message && u.message.successful_payment;
  if (sp && sp.currency === 'XTR') {
    const [uid, sig] = String(sp.invoice_payload || '').split('|');
    if (!uid || !safeEq(sig, sign(uid)) || !db.users[uid]) return;
    if (db.payments[sp.telegram_payment_charge_id]) return;

    db.payments[sp.telegram_payment_charge_id] = {
      uid,
      amount: sp.total_amount,
      ts: Date.now(),
    };
    db.users[uid].balance += sp.total_amount;
    save(true);
    sendBalance(uid);
  }
}

/* ───────────── HTTP ───────────── */
const INDEX = path.join(__dirname, 'public', 'index.html');
const rate = new Map();
const emojiLog = new Map();   // uid -> времена последних смайликов
const EMOJI_MAX = 5;          // максимум смайликов подряд
const EMOJI_WINDOW = 2000;    // через сколько мс можно снова

function limited(uid, key, ms) {
  const k = uid + key;
  const n = Date.now();
  if ((rate.get(k) || 0) > n - ms) return true;
  rate.set(k, n);
  return false;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', d => {
      s += d;
      if (s.length > 20000) {
        reject(err('Слишком большой запрос', 413));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(s ? JSON.parse(s) : {});
      } catch (e) {
        reject(err('Неверный JSON'));
      }
    });
  });
}

const json = (res, code, obj) => {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(obj));
};

const bearer = req => {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;

    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      if (!fs.existsSync(INDEX)) {
        return json(res, 500, { error: 'Не найден файл public/index.html' });
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      });
      return fs.createReadStream(INDEX).pipe(res);
    }

    if (req.method === 'GET' && p === '/events') {
      const user = authUser(url.searchParams.get('token'));
      if (!user) return json(res, 401, { error: 'Нет входа' });

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.write('retry: 2000\n\n');

      const c = { res, uid: user.id };
      clients.add(c);
      sse(res, 'state', publicState());
      sse(res, 'balance', { balance: user.balance });
      req.on('close', () => clients.delete(c));
      return;
    }

    if (req.method === 'POST' && p === '/api/auth') {
      const b = await readBody(req);
      let user;
      let guest;
      const tgUser = checkInitData(b.initData);

      if (tgUser && tgUser.id) {
        user = getUser(
          'tg:' + tgUser.id,
          cleanName(tgUser.first_name || tgUser.username),
          tgUser.photo_url || ''
        );
      } else if (cfg.allowGuest) {
        guest = /^[a-f0-9]{32}$/.test(b.guest || '')
          ? b.guest
          : crypto.randomBytes(16).toString('hex');
        user = getUser('g:' + guest, null, undefined);
      } else {
        return json(res, 401, { error: 'Откройте игру из Telegram' });
      }

      if (cfg.testGrant > 0 && !user.testGranted) {
        user.testGranted = true;
        user.balance += cfg.testGrant;
      }

      save();
      return json(res, 200, {
        token: newSession(user.id),
        guest,
        deposit: !!cfg.botToken,
        user: { id: user.pid, name: user.name, balance: user.balance },
      });
    }

    if (req.method === 'POST' && p.startsWith('/api/')) {
      // Ручное пополнение через секретный ADMIN_KEY.
      if (p === '/api/admin/credit') {
        if (!cfg.adminKey || !safeEq(req.headers['x-admin-key'] || '', cfg.adminKey)) {
          return json(res, 403, { error: 'Нет доступа' });
        }

        const b = await readBody(req);
        const u = byPid(b.pid);
        if (!u || !Number.isInteger(b.amount)) {
          return json(res, 400, { error: 'pid и целое amount обязательны' });
        }

        u.balance += b.amount;
        save(true);
        sendBalance(u.id);
        return json(res, 200, { balance: u.balance });
      }

      const user = authUser(bearer(req));
      if (!user) return json(res, 401, { error: 'Нет входа' });
      const b = await readBody(req);

      if (p === '/api/bet') {
        if (limited(user.id, 'bet', 150)) throw err('Слишком часто');
        placeBet(user, Number(b.amount));
        return json(res, 200, { ok: true, balance: user.balance });
      }

      if (p === '/api/emoji') {
        if (!EMOJIS.includes(b.e) || !game.bets.some(x => x.uid === user.id)) {
          return json(res, 400, { error: 'Нельзя' });
        }
        // Не больше EMOJI_MAX смайликов за EMOJI_WINDOW мс. Дальше — тихо игнорируем,
        // через 2 секунды после первого из пяти можно снова отправлять.
        const nowMs = Date.now();
        const log = (emojiLog.get(user.id) || []).filter(t => nowMs - t < EMOJI_WINDOW);
        if (log.length >= EMOJI_MAX) {
          emojiLog.set(user.id, log);
          return json(res, 200, { ok: false });
        }
        log.push(nowMs);
        emojiLog.set(user.id, log);
        for (const c of clients) sse(c.res, 'emoji', { id: user.pid, e: b.e });
        return json(res, 200, { ok: true });
      }

      if (p === '/api/deposit') {
        if (!cfg.botToken) {
          return json(res, 400, { error: 'Пополнение доступно только в Telegram' });
        }

        const amount = Math.floor(Number(b.amount));
        if (!(amount >= 1 && amount <= 100000)) {
          return json(res, 400, { error: 'Сумма от 1 до 100 000' });
        }

        const link = await tg('createInvoiceLink', {
          title: 'Пополнение баланса',
          description: amount + ' ⭐ на баланс арены',
          payload: user.id + '|' + sign(user.id),
          provider_token: '',
          currency: 'XTR',
          prices: [{ label: 'Звёзды', amount }],
        });
        return json(res, 200, { link });
      }

      return json(res, 404, { error: 'Нет такого метода' });
    }

    if (req.method === 'POST' && cfg.botToken && p === webhookPath()) {
      const u = await readBody(req);
      handleTelegramUpdate(u).catch(e => console.error('webhook:', e.message));
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { error: 'Не найдено' });
  } catch (e) {
    json(res, e.code || 500, { error: e.code ? e.message : 'Ошибка сервера' });
    if (!e.code) console.error(e);
  }
});

server.listen(cfg.port, async () => {
  console.log(
    'Арена запущена: http://localhost:' + cfg.port +
    (cfg.botToken
      ? ' (режим Telegram)'
      : ' (тестовый режим, гости, старт ' + cfg.startBalance + ' ⭐)')
  );

  if (cfg.botToken && cfg.publicUrl) {
    try {
      await tg('setWebhook', {
        url: cfg.publicUrl + webhookPath(),
        allowed_updates: ['pre_checkout_query', 'message'],
      });
      console.log('Вебхук Telegram установлен');
    } catch (e) {
      console.error('Не удалось поставить вебхук:', e.message);
    }
  }
});

