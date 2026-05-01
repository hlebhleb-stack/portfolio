# Site state — 2026-05-02

Snapshot of where the portfolio is right now so you can pick up later without re-exploring.

**Git checkpoint tag:** `checkpoint-2026-05-02-auto-cases`
Previous: `checkpoint-2026-05-01-analytics-bot-rewrite`, `checkpoint-2026-05-01-icon-theme-toggle`, `checkpoint-2026-04-30-home-3sections`.

**Live:** https://www.glebaagleb.com (Vercel auto-deploy from `main`)
**Repo:** github.com/hlebhleb-stack/portfolio

## How to return to this exact state

```bash
git fetch --tags
git checkout checkpoint-2026-05-02-auto-cases
# or, to make main this state again:
git switch main && git reset --hard checkpoint-2026-05-02-auto-cases && git push --force-with-lease origin main
```

## What's on the site now

### Home (`/`) — 3 snap-scroll sections
- **Section 1:** portrait photo + hero (typed name with pink caret + role). Photo wrapper sizes (after 2026-05-02 ~10% shrink): 128×144 / 108×122 / 100×113 / 82×93 (desktop/tablet/mobile/small).
- **Section 2:** works list — `Colb.finance`, `Sova Labs`, `Re Protocol`. No "Experience" title. Mobile work-period color is `var(--text)` (solid, not muted).
- **Section 3:** 3 social icons (Telegram → LinkedIn → X). Desktop now 64×64 (down from 72), gap 36px (down from 48). Hover lift (translateY -6px) only on `(hover: hover) and (pointer: fine)` devices; React-managed hover state cleared on `window.blur` / `visibilitychange`.
- **Header (fixed):** language toggle (En/Ru/De, persisted) on the left, single sun↔moon icon button on the right. Sun 17×17, moon 14×14. Tap target enlarged via padding+negative-margin on mobile. Theme toggle button color is locked to `var(--text)` (no hover/transition) — black in light theme, white in dark — so taps don't leave a sticky muted color on touch.
- **Footer (fixed):** CV link (left), email (right). Both locked to `var(--text)` (no hover transition). No socials, no copyright.
- **Edge fade (anchored to header/footer line):** desktop ≥1025 220/90px, tablet ≤1024 180/70px, mobile ≤768 150/55px (total/solid).
- **Snap-scroll restoration:** `.home-sections` scrollTop persists to `sessionStorage` on scroll, restored on mount with `scroll-behavior: auto`.
- Snap is mandatory + `scroll-snap-stop: always`.

### Case pages (`/case/:slug`)
- Slugs: `colb-finance`, `sova-labs`, `re-protocol`.
- Description, skill pills (2-per-row on mobile), gallery filter (All/Videos/Banners), swipe nav left/right between cases.
- **Header/footer not fixed** — they sit at top/bottom of normal flow.
- Footer: CV + email row layout on mobile too.
- **Vertical rhythm** (title→desc / desc→skills / skills→filter): desktop 32/20/40, tablet 26/16/34, mobile 22/14/30.

### Case-gallery videos (changed 2026-05-02)
- Auto-play, muted, looped, no native controls.
- Small speaker icon bottom-right toggles mute (on desktop appears on hover; on mobile always visible).
- Click on the video itself also toggles mute.
- The big pink play button is gone.

### Auto-discovery of case items (NEW 2026-05-02)
`client/vite-plugin-case-items.js` scans `client/public/assets/works/<slug>/` at build start and on every file change in dev. Files matching `^\d+(\.[a-z0-9-]+)?\.(mp4|png|jpg|jpeg|webp)$` (numeric-prefixed) are picked up; everything else is ignored (e.g. `honeybee_1f41d.png` used inside translations).

Output: `client/src/caseItems.generated.json` — committed to git. `CasePage.jsx` reads `items` per slug from this JSON; only the slug→{company,url} map (`caseMeta`) remains hardcoded, plus per-language descriptions in `translations.jsx`.

**Order inside each case:** all videos first (natural order by numeric prefix), then all images. New file slots automatically at the end of its type group.

**Workflow to add a work:**
1. Drop `client/public/assets/works/<slug>/N.mp4` (or `.png` / `.jpg` / `.webp`).
2. `git add client/public/assets/works/ && git commit -m "Add work" && git push`.
3. Vercel rebuild → live.

Adding a brand-new case (new slug) still requires manual edits to `caseMeta` in `CasePage.jsx` + `translations.jsx`.

### Type scale (uniform)
- Heading: 26 / 24 / 22 / 20 (desktop / tablet / mobile / small).
- Body: 14 / 13 / 12 / 11.
- Small caption: 12 / 11.

### Theme transition
- `.home-page` and `.page` background/color transitions are **0.15s**.

### Localization
- EN/RU/DE in `client/src/translations.jsx`. Theme labels (`theme.light`, `theme.dark`) currently unused after the icon-only switch — safe to remove later.

## Key files

| File | Purpose |
|---|---|
| `client/src/App.jsx` | `HomePage` (3 sections, fixed header/footer, scroll restore) + `App` root with custom cursor + routes |
| `client/src/CasePage.jsx` | Case pages. `caseMeta` (slug→company/url) + auto-loaded items from generated JSON. `VideoItem` autoplays muted with corner mute toggle |
| `client/src/translations.jsx` | EN/RU/DE strings, per-case descriptions |
| `client/src/App.css` | All styles, breakpoints `≤1024 / ≤768 / ≤400`. `.video-mute-btn`, `.home-social`, edge fades live here |
| `client/src/useFadeIn.js` | IntersectionObserver fade-in |
| `client/src/caseItems.generated.json` | **Auto-generated**. Don't edit by hand — it gets overwritten on every build |
| `client/vite-plugin-case-items.js` | Vite plugin that produces the JSON above |
| `client/vite.config.js` | React plugin + caseItems plugin |
| `client/public/assets/works/<slug>/*` | Numeric-prefixed media → auto-picked into the case gallery |
| `client/public/assets/socials/{tg,linkedin,x}.svg` | Home section 3 icons (built-in dark gradient frame) |

## Dev

```bash
cd client
npm install
npm run dev          # localhost:5173 — hot-reloads when you drop new media into a case folder
npm run lint
npm run build
```

CI runs eslint + build + image optimization on push to `main`. Lint rule `react-hooks/set-state-in-effect` is strict — use render-time state sync (`if (x !== last) { setLast(x); setY(...) }`) for prop-derived resets, not `setState` inside `useEffect`.

## Untracked drafts (don't commit)

`*.drawio`, root `package-lock.json`, `server/analytics.json`, `client/README.md`, `socials icons/`, `ellipse.svg`. Always stage paths explicitly — never `git add -A`. The honeybee SVG (`works/re-protocol/honeybee_1f41d.png`) is committed and used inside the Re Protocol description; the auto-loader ignores it because it doesn't start with a digit.

## Server / Telegram analytics bot

`server/server.js` — Express + node-telegram-bot-api + node-cron + geoip-lite.

### Storage (changed 2026-05-02)
Render free tier wipes the filesystem every 2-3 hours, so analytics are now persisted to a **GitHub Gist**.

- **In-memory state** is hydrated from the gist on startup.
- Saves debounced 15s, then PATCHed back to the gist.
- SIGTERM handler flushes pending writes before Render kills the container.
- Falls back to local `server/analytics.json` if `GITHUB_TOKEN`/`GIST_ID` env vars aren't set.

**Render env vars to keep set:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TZ_OFFSET_HOURS`, `GITHUB_TOKEN` (PAT classic, scope `gist`), `GIST_ID`. Optional: `GIST_FILENAME` (default `analytics.json`), `PORT`.

### Endpoints
- `POST /api/track` — `{ page, screenWidth, lang, sessionId }`. Filters bot UAs. Dedupes session+page within 30 min. Resolves IP→country offline (`geoip-lite`) and stores `country`. **No referrer field** (removed 2026-05-02 — too noisy due to social-media stripping).
- `POST /api/contact` — kept on the server even though no contact form is rendered today (so adding one later is zero-config).
- `GET /api/stats` — minimal JSON for self-checks.

### Telegram bot
**Commands (registered in the menu via `setMyCommands`)**
- `/today`, `/yesterday`, `/week`, `/month`, `/all` — period summaries.
- `/pages`, `/geo`, `/langs`, `/devices` — single breakdowns (default period `all`).
- `/export` — sends `analytics.json` as a file.
- `/wipe` — deletes bot messages from the chat (in-memory tracker; bound by Telegram's 48h delete limit; tracker resets on server restart).
- `/clear` then `/yes` (within 60s) — wipes all analytics data.
- `/help` (also `/start`) — command list.

**Removed**: `/referrers` (social platforms strip referer header), `/contacts` (no form on the site), `/reset` (redundant with `/clear`).

**Style**: no emojis, `<b>Title</b>` + monospace `<pre>` tables. Rows are right-padded with NBSP to a 38-char minimum width so Telegram doesn't collapse short tables (`/langs`, `/devices`, etc.).

**Geo**: country code + name lookup map for top-50 countries; falls back to bare code for unmapped.

**Crons** (server time)
- Daily digest at 21:00 — `summary('today')`.
- Weekly digest Mondays 09:00 — `summary('week')`.

**Note**: no "Server up" startup notification (used to spam the chat on every Render restart).

### Frontend tracking
`App.jsx` → `trackPage(page, lang)`: generates a per-tab UUID in `sessionStorage` as `sid`, POSTs to `/api/track` with `{page, screenWidth, lang, sessionId}`. HomePage tracks once on mount; CasePage tracks on `slug` change.

## Possible next steps (if resuming)

- Replace placeholder Telegram (`t.me/glebaagleb`) and X (`x.com/glebaagleb`) URLs in `App.jsx` (home section 3) with the real ones.
- Persist theme in localStorage (currently only language is persisted; defaults to light per session).
- Drop unused `icon-social-{1,2,3}.svg`, `.social-icons` / `.footer-copy` / `.theme-toggle` (the old text variant) / `.theme-btn` CSS, and `theme.light` / `theme.dark` strings.
- Verify edge-blur on Safari (`-webkit-backdrop-filter` is set; Safari is picky about masked backdrops).
- Render keep-alive ping (every 14 min) to avoid free-tier sleep — not strictly needed since `/api/track` from real visitors keeps it warm, but useful for the bot.
- OG/Twitter card auto-generation per `/case/:slug` for nicer link previews.
