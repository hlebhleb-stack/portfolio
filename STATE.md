# Site state — 2026-04-30

Snapshot of where the portfolio is right now so you can pick up later without re-exploring.

**Git checkpoint tag:** `checkpoint-2026-04-30-home-3sections`
**Live:** https://www.glebaagleb.com (Vercel auto-deploy from `main`)
**Repo:** github.com/hlebhleb-stack/portfolio

## How to return to this exact state

```bash
git fetch --tags
git checkout checkpoint-2026-04-30-home-3sections
# or, to make main this state again:
git switch main && git reset --hard checkpoint-2026-04-30-home-3sections && git push --force-with-lease origin main
```

## What's on the site now

### Home (`/`) — 3 snap-scroll sections
- **Section 1:** portrait photo + hero (typed name with pink caret + role).
- **Section 2:** works list — `Colb.finance`, `Sova Labs`, `Re Protocol`. No "Experience" title.
- **Section 3:** 3 large social icons (Telegram → LinkedIn → X), from `client/public/assets/socials/{tg,linkedin,x}.svg`.
- **Header (fixed):** language toggle (En/Ru/De, persisted) on the left, theme toggle (Light/Dark, not persisted) on the right.
- **Footer (fixed):** CV link (left), email (right). No socials, no copyright.
- **Edge fade:** top and bottom 140px (desktop) / 110px (tablet) / 90px (mobile) have `backdrop-filter: blur(12px)` + `var(--bg) → transparent` gradient under a fade mask, so content blurs and fades into bg near the edges during snap.
- Snap is mandatory + `scroll-snap-stop: always` — no in-between states.

### Case pages (`/case/:slug`)
- Slugs: `colb-finance`, `sova-labs`, `re-protocol`.
- Description, skill pills (2-per-row on mobile), gallery filter (All/Videos/Banners — only when both types exist), swipe nav left/right between cases.
- **Header/footer not fixed** — they sit at top/bottom of normal flow.
- Footer simplified: only CV + email (no socials, no copyright). Row layout on mobile too (CV left, email right).

### Type scale (uniform across breakpoints)
- Heading: 26 / 24 / 22 / 20 (desktop / tablet / mobile / small).
- Body: 14 / 13 / 12 / 11.
- Small caption: 12 / 11.

## Key files

| File | Purpose |
|---|---|
| `client/src/App.jsx` | `HomePage` (3 sections, fixed header/footer) + `App` root with custom cursor + routes |
| `client/src/CasePage.jsx` | Case pages (DO NOT change without explicit ask — user wants these stable) |
| `client/src/translations.jsx` | EN/RU/DE strings, per-case descriptions |
| `client/src/App.css` | All styles, breakpoints `≤1024 / ≤768 / ≤400` |
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

`*.drawio`, root `package-lock.json`, `server/analytics.json`, `client/README.md`, `socials icons/`, `ellipse.svg`. Stage paths explicitly — never `git add -A`.

## Possible next steps (if resuming)

- Replace placeholder Telegram (`t.me/glebaagleb`) and X (`x.com/glebaagleb`) URLs with real ones — both shown in `App.jsx` home footer-section-3 and `CasePage.jsx` (wait, case footer no longer has socials).
- Persist theme in localStorage (currently only language is persisted).
- Drop unused `icon-social-{1,2,3}.svg` and the old `.social-icons` / `.footer-copy` CSS rules if you don't plan to reuse them.
- Check the edge-blur on Safari — `-webkit-backdrop-filter` is set, but Safari can be picky about masked backdrops.
