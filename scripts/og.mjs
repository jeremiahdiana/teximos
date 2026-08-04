#!/usr/bin/env node
/**
 * Social cards, cut from the real pages.
 *
 * The figures ARE the identity of this site, so the card is a screenshot of the
 * masthead and the article's own figure rather than a text template that would
 * have to be kept in sync by hand. That means the generator needs a browser, so
 * it is NOT part of `npm run build`: the PNGs are committed, and this is run
 * again only when a figure or the masthead changes.
 *
 *   npm run build && npm run preview &          # serve the built site
 *   node scripts/og.mjs                         # writes public/og/*.png
 *   npm run build                               # copy them into dist
 *
 * Chrome headless clamps window width near 500px, so the viewport is set with
 * Emulation.setDeviceMetricsOverride. Captured at 2x and downsampled to exactly
 * 1200x630, which is the aspect every platform crops toward.
 */
import { writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "public/og");
const ORIGIN = process.env.OG_ORIGIN ?? "http://localhost:4321";

const W = 1200;
const H = 630;

const slugs = readdirSync(join(ROOT, "src/content/blog"))
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => f.replace(/\.mdx?$/, ""));

const targets = [
  { name: "default", url: "/" },
  ...slugs.map((s) => ({ name: s, url: `/blog/${s}/` })),
];

mkdirSync(OUT, { recursive: true });

const CDP = process.env.OG_CDP ?? "http://localhost:9222";
const target = await (
  await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })
).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const n = ++id;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");

for (const t of targets) {
  await send("Emulation.setDeviceMetricsOverride", {
    width: W,
    height: H,
    deviceScaleFactor: 2,
    mobile: false,
  });
  // Cards are always the paper scheme. A reader's dark preference must not leak
  // into an image that ends up on somebody else's timeline.
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: "light" }],
  });
  await send("Page.navigate", { url: ORIGIN + t.url });
  await new Promise((r) => setTimeout(r, 400));
  await send("Runtime.evaluate", {
    expression: "try{localStorage.clear()}catch(e){}",
  });
  await send("Page.reload", {});
  await new Promise((r) => setTimeout(r, 1100));

  // Drop the utility bar. Subscribe, About and a theme switch are navigation,
  // and on somebody else's timeline they are noise around the one thing the
  // card is for. Removing it also hands 44px back to the figure.
  await send("Runtime.evaluate", {
    expression: `(() => {
      const s = document.createElement('style');
      s.textContent = '.utility{display:none!important}';
      document.head.appendChild(s);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 150));

  // Take everything down to the bottom of the figure. On an article that is the
  // hero band, on the index it is the lead plate. Falls back to the fold.
  const probe = await send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector('.hero') || document.querySelector('.plate');
      const b = el ? Math.ceil(el.getBoundingClientRect().bottom + window.scrollY) : ${H};
      return String(Math.max(${H}, b));
    })()`,
    returnByValue: true,
  });
  const bottom = Number(probe.result.value);

  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: W, height: bottom, scale: 2 },
  });

  // `cover` from the top keeps the masthead and as much of the figure as fits,
  // and crops the overflow off the bottom rather than squashing the artwork.
  const png = await sharp(Buffer.from(shot.data, "base64"))
    .resize(W, H, { fit: "cover", position: "top" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(join(OUT, `${t.name}.png`), png);
  console.log(`${t.name.padEnd(62)} ${W}x${H}  from ${W}x${bottom}  ${(png.length / 1024).toFixed(0)}kb`);
}

ws.close();
