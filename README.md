# Hallelujah Challenge

Hallelujah Challenge is an hour-long online praise programme unto the Lord,
convened by Pastor Nathaniel Bassey. The sessions are held daily through
designated periods each year, commencing at 11:59 PM WAT, and carry an hour of
praise, worship and prayer gathered from all over the world.

This repository is a rebuild of
[hallelujahchallengelive.com](https://www.hallelujahchallengelive.com).

## Tech stack

| | |
|---|---|
| Framework | Next.js 16.4.2, App Router, Turbopack |
| Language | TypeScript 5 |
| UI | React 19.3 |
| Styling | Plain CSS custom properties in `app/globals.css`, with inline style objects on components. Light is the default theme; `[data-theme="dark"]` overrides the tokens. |
| Type | Instrument Serif for display, Geist and Geist Mono for body and UI |
| Output | `output: "export"` — every route prerenders to a static file |
| Hosting | Cloudflare Workers Assets |
| Linting | ESLint 9 with `eslint-config-next` |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```
