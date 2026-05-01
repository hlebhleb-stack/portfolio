# Site state — 2026-05-01

Snapshot of where the portfolio is right now so you can pick up later without re-exploring.

**Git checkpoint tag:** `checkpoint-2026-05-01-analytics-bot-rewrite`
Previous: `checkpoint-2026-05-01-icon-theme-toggle`, `checkpoint-2026-04-30-home-3sections`.

**Older tag:** `checkpoint-2026-05-01-icon-theme-toggle`
**Live:** https://www.glebaagleb.com (Vercel auto-deploy from `main`)
**Repo:** github.com/hlebhleb-stack/portfolio

## How to return to this exact state

```bash
git fetch --tags
git checkout checkpoint-2026-05-01-analytics-bot-rewrite
# or, to make main this state again:
git switch main && git reset --hard checkpoint-2026-05-01-analytics-bot-rewrite && git push --force-with-lease origin main
```

## What's on the site now

### Home (`/`) — 3 snap-scroll sections
- **Section 1:** portrait photo + hero (typed name with pink caret + role). Photo→name gap reduced (16/14/10px desktop/tablet/mobile).
- **Section 2:** works list — `Colb.finance`, `Sova Labs`, `Re Protocol`. No "Experience" title.
- **Section 3:** 3 large social icons (Telegram → LinkedIn → X). Hover lift (translateY -6px) only on `(hover: hover) and (pointer: fine)` devices; React-managed hover state is cleared on `window.blur` and `visibilitychange` so icons don't stay stuck after returning from a new tab.
- **Header (fixed):** language toggle (En/Ru/De, persisted) on the left, **single sun↔moon icon button** on the right (replaces the old Light/Dark text toggle). Sun is 17×17, moon is 14×14. Tap target enlarged via padding+negative-margin on mobile.
- **Footer (fixed):** CV link (left), email (right). No socials, no copyright.
- **Edge fade (anchored to header/footer line):** the solid blur band aligns with the fixed header/footer height; transparency continues into content below/above.
  - Desktop ≥1025: total 220px, solid 90px
  - Tablet ≤1024: total 180px, solid 70px
  - Mobile ≤768: total 150px, solid 55px
- **Snap-scroll restoration:** `.home-sections` scrollTop is persisted to `sessionStorage` on scroll and restored on HomePage mount (with `scroll-behavior: auto` during restore) — returning from a case page lands you back on the same section.
- Snap is mandatory + `scroll-snap-stop: always` — no in-between states.

### Case pages (`/case/:slug`)
- Slugs: `colb-finance`, `sova-labs`, `re-protocol`.
- Description, skill pills (2-per-row on mobile), gallery filter (All/Videos/Banners — only when both types exist), swipe nav left/right between cases.
- **Header/footer not fixed** — they sit at top/bottom of normal flow. Same icon-only theme toggle as home.
- Footer: CV + email row layout on mobile too.
- **Vertical rhythm**: title→description and skills→filter are larger than description→skills, so description+skills reads as one block.
  - Desktop: 32 / 20 / 40
  - Tablet:  26 / 16 / 34
  - Mobile:  22 / 14 / 30

### Type scale (uniform)
- Heading: 26 / 24 / 22 / 20 (desktop / tablet / mobile / small).
- Body: 14 / 13 / 12 / 11.
- Small caption: 12 / 11.

### Theme transition
- `.home-page` and `.page` background/color transitions are **0.15s** (halved from 0.3s) so rapid theme-toggle taps register.

### Localization
- EN/RU/DE in `client/src/translations.jsx`. Theme labels (`theme.light`, `theme.dark`) are still in the dictionary but currently unused after the icon-only switch — safe to remove later.

## Key files

| File | Purpose |
|---|---|
| `client/src/App.jsx` | `HomePage` (3 sections, fixed header/footer, scroll restore, hover-clear effects) + `App` root with custom cursor + routes |
| `client/src/CasePage.jsx` | Case pages — DO NOT change without explicit ask |
| `client/src/translations.jsx` | EN/RU/DE strings, per-case descriptions |
| `client/src/App.css` | All styles, breakpoints `≤1024 / ≤768 / ≤400`. Edge fades, theme-toggle-btn, vertical rhythm tokens live here |
| `client/src/useFadeIn.js` | IntersectionObserver fade-in |
| `client/public/assets/socials/{tg,linkedin,x}.svg` | Home section 3 icons (with built-in dark gradient frame) |
| `client/public/assets/icon-social-{1,2,3}.svg` | Older small icons (no longer used after redesign — safe to drop later) |

## Dev

```bash
cd client
npm install
npm run dev          # localhost:5173
npm run lint
npm run build
```

CI runs eslint + build + image optimization on push to `main`. Lint rule `react-hooks/set-state-in-effect` is strict — use render-time state sync (`if (x !== last) { setLast(x); setY(...) }`) for prop-derived resets, not `setState` inside `useEffect` (see typewriter reset on language change in `App.jsx`).

## Untracked drafts (don't commit)

`*.drawio`, root `package-lock.json`, `server/analytics.json`, `client/README.md`, `socials icons/`, `ellipse.svg`, `client/public/assets/works/re-protocol/honeybee_1f41d.png`. Stage paths explicitly — never `git add -A`.

## Server / Telegram analytics bot

`server/server.js` — Express + node-telegram-bot-api + node-cron.

**Endpoints**
- `POST /api/track` — accepts `{ page, referrer, screenWidth, lang, sessionId }`. Filters bot user agents. Dedupes identical `sessionId+page` within 30 minutes so SPA route changes / reloads don't inflate counts. Stores into `analytics.json`.
- `POST /api/contact` — name/email/message → saved + sent to TG.
- `GET /api/stats` — minimal JSON for self.

**Telegram commands** (only respond to `TELEGRAM_CHAT_ID`)
- `/today`, `/yesterday`, `/week`, `/month`, `/all` — period summaries (views, sessions, mobile/desktop, top pages, top languages, top referrers).
- `/pages [period]`, `/langs [period]`, `/devices [period]`, `/referrers [period]` — single breakdown for the chosen period (default `all`).
- `/contacts` — last 10 contact form messages.
- `/export` — sends `analytics.json` as a file.
- `/clear` then `/yes` (within 60s) — wipes all analytics.
- `/help` (also `/start`) — command list.

**Style**: no emojis, `<b>Title</b>` + monospace `<pre>` tables. Matches site's minimalist look.

**Crons** (server time)
- Daily digest at 21:00 — calls `summary('today')`.
- Weekly digest Mondays 09:00 — calls `summary('week')`.

**Env vars**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, optional `PORT` (default 3001).

**Frontend tracking**: `App.jsx` defines `trackPage(page, lang)` which generates a per-tab UUID stored in `sessionStorage` as `sid` and POSTs to `/api/track`. HomePage tracks once on mount with the initial language. CasePage tracks on `slug` change using a ref so language switches don't re-track.

## Possible next steps (if resuming)

- Replace placeholder Telegram (`t.me/glebaagleb`) and X (`x.com/glebaagleb`) URLs with real ones (in `App.jsx` home section 3).
- Persist theme in localStorage (currently only language is persisted).
- Drop unused `icon-social-{1,2,3}.svg` and the old `.social-icons` / `.footer-copy` / `.theme-toggle` / `.theme-btn` CSS rules.
- Remove unused `theme.light` / `theme.dark` strings from `translations.jsx`.
- Check the edge-blur on Safari (`-webkit-backdrop-filter` is set, but Safari can be picky about masked backdrops).
