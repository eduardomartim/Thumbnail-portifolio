# Thumbnail Portfolio

A single-page portfolio site for video-thumbnail design work. It is a creative project, separate from my software-engineering projects.

**Live site:** https://thumbnail-portifolio.vercel.app/

## What it is

- A static site built with [Astro](https://astro.build): no UI framework and no animation library.
- Original thumbnails live in `src/assets/work/`; the build generates AVIF, WebP and JPEG versions at several sizes automatically.
- A full-screen viewer with keyboard and swipe navigation (`src/components/Viewer.astro`, `src/scripts/viewer.ts`), plus a feed preview that shows each piece at real video-feed sizes.
- Texts and the list of pieces are data, not markup: see `src/data/site.ts` and `src/data/projects.ts`.

## Run it locally

Requires Node.js 22.12 or newer (tested with Node 24).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
npm run check    # type and template checks
```

## Rights

Star Wars, The Outlast Trials and Minecraft names, characters and logos belong to their respective owners. This is a personal portfolio, not affiliated with or endorsed by them. The thumbnails are my own design work.
