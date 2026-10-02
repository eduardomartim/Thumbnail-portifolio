// @ts-check
import { readdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { site } from './src/data/site.ts';

// The public URL makes link previews (og:image) absolute. Taken from src/data/site.ts,
// or detected on Netlify and Vercel, or passed as SITE_URL (e.g. on Cloudflare Pages).
const env = process.env;
const siteUrl =
  site.url ||
  env.SITE_URL ||
  env.URL || // Netlify
  (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  undefined;

if (process.argv.includes('build')) {
  const missing = [
    !siteUrl && '`url` — link previews (Discord, LinkedIn, X) will show no image',
    !site.name && '`name`',
    !site.email && site.links.length === 0 && '`email` / `links` — the contact section has nothing to click',
  ].filter(Boolean);
  if (missing.length) {
    console.warn(`\n[portfolio] Not filled in src/data/site.ts:\n  - ${missing.join('\n  - ')}\n`);
  }
}

/**
 * Deletes image files from dist/_astro that no page references — e.g. an original sitting in
 * src/assets/work that no project uses — so untouched source files (and their metadata) never ship.
 * @type {import('astro').AstroIntegration}
 */
const dropUnreferencedImages = {
  name: 'drop-unreferenced-images',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      const files = await readdir(root, { recursive: true });
      const pages = await Promise.all(
        files.filter((f) => f.endsWith('.html')).map((f) => readFile(path.join(root, f), 'utf8')),
      );
      const html = pages.join('\n');
      const assets = path.join(root, '_astro');
      const removed = [];
      for (const file of await readdir(assets).catch(() => [])) {
        if (/\.(png|jpe?g|webp|avif|gif)$/i.test(file) && !html.includes(file)) {
          await unlink(path.join(assets, file));
          removed.push(file);
        }
      }
      if (removed.length) logger.info(`Removed ${removed.length} unreferenced image(s): ${removed.join(', ')}`);
    },
  },
};

export default defineConfig({
  site: siteUrl,
  devToolbar: { enabled: false },
  integrations: [dropUnreferencedImages],
  build: {
    // The whole stylesheet is small; inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // AVIF keeps full colour resolution (4:4:4) and is visually lossless at this level;
        // WebP's smart subsampling keeps red type edges clean.
        avif: { quality: 72 },
        webp: { quality: 84, smartSubsample: true },
        jpeg: { quality: 84, mozjpeg: true },
      },
    },
  },
});
