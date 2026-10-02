# andersonlaverde.com

Personal site — CV (home), blog and videos.
Next.js 16.3.5 (App Router) · React 19 · Tailwind CSS 4.3.3 · TypeScript.

## Run

```bash
npm install
npm run dev
```

## Structure

```
src/app/layout.tsx        shell: fonts, theme bootstrap, header, scanlines, glow
src/app/page.tsx          home hub — pick /cv, /blog, /noticias
src/app/cv/page.tsx       /cv — experience, education, stack
src/app/blog/page.tsx     /blog
src/app/videos/page.tsx   /videos
src/app/globals.css       terminal theme (CSS vars) + Tailwind v4 @theme
src/components/           Header, CursorGlow, TypedRoles, LisbonClock, PrintButton, T (i18n)
src/data/                 experience.ts, posts.ts, videos.ts — edit content here
```

## Notes on the upgrade

- **Tailwind v4** has no `tailwind.config.ts`. Theme tokens live in `globals.css` under
  `@theme inline`, and PostCSS uses `@tailwindcss/postcss`. Delete the old
  `tailwind.config.ts` and `postcss.config.js` from the repo root.
- The design uses semantic CSS classes rather than utility soup; Tailwind utilities are
  available on top via the theme tokens (`text-accent`, `bg-panel`, …).
- Dark/light is a `data-theme` attribute on `<html>`, set before paint by an inline script
  in `layout.tsx` (no flash), persisted in `localStorage`.

## Deploy

Push to GitHub, import on Vercel (framework auto-detected as Next.js), then point
`andersonlaverde.com` at it in Settings → Domains and remove it from Framer.

## To do

- Real headshot in `page.tsx` via `next/image`.
- Post pages: add `src/app/blog/[slug]/page.tsx` reading MDX from `content/posts/`.
- Real YouTube links/thumbnails in `src/data/videos.ts`.
- Wire the newsletter form to a provider (Buttondown, Resend).
