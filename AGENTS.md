# AGENTS.md

Context for AI agents (Claude Code, Cursor, Copilot) working on **andersonlaverde.com**.

## What this is

Anderson Laverde's personal site. The CV is the main content; blog and videos are secondary
destinations. Replaces a Framer page (`second-pineapple-995158.framer.app`).

Repo: `andirsun/andersonlaverde.com`, branch `master`. Deployed on Vercel.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3.5, App Router |
| React | 19 |
| Styling | Tailwind CSS 4.3.3 + semantic CSS in `globals.css` |
| Language | TypeScript 5.9, strict |
| Host | Vercel |
| Lint | ESLint 10, flat config (`eslint.config.mjs`) |
| Tests | Vitest (`npm test`) |

## Linting

`eslint-config-next` is deliberately **not** used. It bundles `eslint-plugin-react`, which still
calls the `context.getFilename()` API that ESLint 10 removed, so it throws on startup. The
equivalent coverage is wired up directly in `eslint.config.mjs` from
`@next/eslint-plugin-next`, `typescript-eslint`, `eslint-plugin-react-hooks` and
`eslint-plugin-jsx-a11y`. The one rule set lost is `eslint-plugin-react` itself — reinstate it
(and `eslint-config-next`) once it supports ESLint 10.

`eslint-plugin-jsx-a11y` runs fine on ESLint 10 but its declared peer range stops at 9, so
`package.json` pins it with an `overrides` entry. Without that, `npm ci` fails outright and the
Vercel build breaks — don't remove it.

The repo previously held an empty `create-next-app` scaffold on Next 14 / Tailwind 3.
That was upgraded wholesale. **Files removed in the upgrade:** `tailwind.config.ts`,
`postcss.config.js`, `README copy.md`, `src/app/next.svg`, `public/vercel.svg`.

## Structure

```
src/app/layout.tsx        shell: fonts, pre-paint theme script, Header, scanlines, CursorGlow
src/app/page.tsx          CV — the main page (server component)
src/app/blog/page.tsx     /blog
src/app/videos/page.tsx   /videos
src/app/globals.css       design tokens, all component CSS, print styles
src/components/           Header, CursorGlow, TypedRoles, LisbonClock, PostList, PrintButton
src/data/                 experience.ts, posts.ts, videos.ts
```

**Content lives in `src/data/`.** Adding a job or a post means editing a typed array
there, not touching a component. Keep it that way.

**Videos are the exception — they are not hand-edited.** `src/data/videos.ts` fetches the
public YouTube RSS feed for channel `UC-GGZODarfLyjEOz3GhgKnw` (@andirsun) and `/videos`
revalidates hourly, so new uploads appear without a deploy. No API key is involved. The feed
carries title, id, publish date and thumbnail — but no duration, which is why the page shows
dates alone. `FALLBACK_VIDEOS` in that file is a committed snapshot used only when the fetch
fails; without it a failed build would ship an empty page. Parser lives in `src/lib/youtube.ts`
and is tested in `test/youtube.test.ts`.

The channel is personal vlogs in Spanish, not dev content. `/videos` copy and the home-page
card are written to match that — don't reintroduce "dev setups / build-alongs" framing.

## Design system

Terminal / Linux aesthetic. Deliberate, not decorative — it reflects that Anderson has run
Linux as his daily desktop since 2019.

### Tokens

Defined as CSS custom properties on `:root` and `:root[data-theme="light"]` in `globals.css`,
and re-exported to Tailwind under `@theme inline` (so `text-accent`, `bg-panel` etc. work).

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--bg` | `#0c0d0c` | `#f4f4ef` | page background |
| `--panel` | `#121413` | `#fbfbf7` | cards, inputs, hover fills |
| `--ink` | `#dfe3dd` | `#1b1e1a` | body text |
| `--dim` | `#7d857b` | `#5f6659` | secondary text |
| `--line` | `#232724` | `#dcdcd2` | borders, dividers |
| `--accent` | `#8ec07c` | `#4a7a3d` | primary green — links, CTAs, prompts |
| `--amber` | `#d8a657` | `#a3701a` | dates, labels, hover on primary |

Two accents only. Green leads, amber is for metadata and hover. Do not introduce a third hue.

### Type

- **JetBrains Mono** — everything structural: headings, nav, labels, dates, buttons.
- **IBM Plex Sans** — body copy only, via the `.sans` class. Prose in monospace is tiring to
  read; that is the whole reason the second family exists.

Loaded from Google Fonts in `layout.tsx`.

### Rules

- Borders, not shadows, define structure. 1px `--line`, radius 0–2px. Nothing is pill-shaped.
- Section headings are `$ section-name` in uppercase mono, the `$` in accent — shell prompts.
- Buttons read like commands: `./read-cv`, `mail --to=hola@`, `export --pdf`.
- No emoji. No gradients as decoration (the two decorative layers below are the exception).
- Placeholders for missing imagery are diagonal-stripe boxes with a monospace filename label.

## Motion

Five layers, all subtle. The brief was explicitly "feels too static".

| Effect | Where | Notes |
| --- | --- | --- |
| Typed role line | `TypedRoles.tsx` | cycles 5 roles under the name, blinking caret |
| Cursor glow | `CursorGlow.tsx` | radial accent halo trailing the pointer, rAF-throttled |
| CRT scanlines | `.scanlines` in `globals.css` | fixed overlay, 9s vertical drift, 35% opacity |
| Experience row hover | `.job:hover` | slides right 16px, accent left bar, gradient wash |
| Card/chip hover | `.card`, `.chips span` | 4px lift + accent shadow; chips invert to green |

All of it is gated behind `@media (prefers-reduced-motion: reduce)`, which also hides the
scanlines and glow entirely. Keep any new animation inside that guard.

## Theming

`data-theme` on `<html>`, either `dark` (default) or `light`.

An inline script in `layout.tsx` sets it from `localStorage` **before first paint** — this is
what prevents a white flash on load. Do not move it into a component or a `useEffect`.
`Header.tsx` toggles it and writes back to `localStorage` under the key `al-theme`.

The header reads the current theme with `useSyncExternalStore` + a `MutationObserver`, not
`useState` + `useEffect`. The DOM attribute is the source of truth; copying it into state in an
effect renders the wrong button label for a frame on a light-mode visit, and trips
`react-hooks/set-state-in-effect`. `toggle` only writes the attribute — the observer drives the
re-render. Don't "simplify" it back.

## Content

Experience data was transcribed from Anderson's LinkedIn export (Sept 2026). Current roles:

- **AI Advocate**, Streamline (Jun 2026 – now) — the current title, listed separately from the
  Growth role so the progression inside Streamline is visible.
- **Technical Lead, Growth**, Streamline (2024–2026)
- **Co-founder**, Slinqer (2020–2024)
- Agrosty, Tingo Colombia, Timugo, Gases de Occidente, freelance — 2018 onward.

Copy is in English, written in active voice, first person, understated. No superlatives, no
"passionate about", no metrics that aren't real. Blog posts and videos in `src/data/` are
**placeholder entries** with `#` URLs until real content exists.

## Gotchas

- `overflow: hidden` on any ancestor of `<header>` breaks the sticky nav. Use `overflow-x: clip`.
- `LisbonClock` renders `--:--` on the server and hydrates to the real time; it carries
  `suppressHydrationWarning` for that reason.
- Tailwind 4 has no JS config file. Theme changes go in the `@theme inline` block in
  `globals.css`.

## Open work

- **`public/portrait.jpg` is a generated stand-in, not a real photo.** The hero already renders
  it through `next/image` (square slot, `object-fit:cover`, `object-position:50% 22%`). Drop the
  real 3:4 portrait in at that exact path and no code changes are needed. Do not deploy until
  it is replaced.
- `src/app/blog/[slug]/page.tsx` reading MDX from `content/posts/`; `src/data/posts.ts` becomes
  a filesystem read. RSS feed alongside it.
- Real YouTube links and thumbnails in `src/data/videos.ts`.
- Newsletter form posts nowhere — wire to Buttondown or Resend.
- Point `andersonlaverde.com` DNS at Vercel and remove the domain from Framer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
