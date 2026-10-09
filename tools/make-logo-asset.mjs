/*
 * Prepares Edge's official lockup for the web.
 *
 * Their master file is 3587x1753 with a lot of surrounding whitespace — fine
 * as artwork, wasteful as a 40px header image. This trims to the ink, adds a
 * small even margin, and writes a 2x asset for the size it is actually shown
 * at.
 *
 * It re-derives everything from Edge's own file, so nothing here is a
 * redrawing of their mark. Run it if the source artwork is ever replaced:
 *   node tools/make-logo-asset.mjs
 */
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { PARTNERS, CLIENTS } from "../design-src/highland/content.mjs";

const SRC = "design-src/span/logos/wordmark.png";
const OUT = "design-files/highland/edge-logo.png";
const TARGET_H = 176; // ~3x the 56px the header reserves
const MARK_SRC = "design-src/span/logos";
const PARTNER_OUT = "design-files/highland/logos";
const CLIENT_OUT = "design-files/highland/clients";

const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({ viewport: { width: 400, height: 200 } });
  await page.goto("about:blank");

  const dataUrl = await page.evaluate(
    async ({ src, targetH }) => {
      const img = new Image();
      img.src = src;
      await img.decode();

      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;

      /* Ink is anything opaque and not near-white. */
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          const i = (y * c.width + x) * 4;
          if (d[i + 3] > 40 && !(d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235)) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 < 0) throw new Error("no ink found in the source artwork");

      const w = x1 - x0 + 1;
      const h = y1 - y0 + 1;
      const pad = Math.round(h * 0.04);
      const scale = targetH / (h + pad * 2);

      const o = document.createElement("canvas");
      o.width = Math.round((w + pad * 2) * scale);
      o.height = Math.round((h + pad * 2) * scale);
      const og = o.getContext("2d");
      og.imageSmoothingQuality = "high";
      og.drawImage(img, x0 - pad, y0 - pad, w + pad * 2, h + pad * 2, 0, 0, o.width, o.height);

      return { url: o.toDataURL("image/png"), w: o.width, h: o.height, trimmed: [w, h] };
    },
    { src: "data:image/png;base64," + readFileSync(SRC).toString("base64"), targetH: TARGET_H },
  );

  writeFileSync(OUT, Buffer.from(dataUrl.url.split(",")[1], "base64"));
  const bytes = readFileSync(OUT).length;
  console.log(`trimmed ${dataUrl.trimmed[0]}x${dataUrl.trimmed[1]} → ${dataUrl.w}x${dataUrl.h}`);
  console.log(`wrote ${OUT} (${(bytes / 1024).toFixed(1)} KB)`);

  /* Brand and client marks, published alongside.
     These arrive already padded into a common 300x200 box -- someone has
     optically balanced them against each other, and trimming to the ink would
     undo that and make one brand tower over another. They are copied at their
     given framing and only downscaled.

     Only the entries whose `logo` is set are published. Most of the approved
     brands and institutions have no artwork on file yet and render as their
     name instead, so there is nothing here to publish for them. Anything left
     over in the output folder from an earlier model is removed, so a retired
     brand's mark cannot linger in the published site. */
  const publish = async (items, outDir, what) => {
    mkdirSync(outDir, { recursive: true });
    const wanted = new Set();
    let total = 0;

    for (const item of items.filter((i) => i.logo)) {
      const src = `${MARK_SRC}/${item.logo}.png`;
      if (!existsSync(src)) throw new Error(`${item.name}: no artwork at ${src}`);

      const out = await page.evaluate(
        async ({ src, h }) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          const c = document.createElement("canvas");
          c.height = h;
          c.width = Math.round((img.width / img.height) * h);
          const g = c.getContext("2d");
          g.imageSmoothingQuality = "high";
          g.drawImage(img, 0, 0, c.width, c.height);
          return c.toDataURL("image/png");
        },
        { src: "data:image/png;base64," + readFileSync(src).toString("base64"), h: 160 },
      );

      const name = `${item.logo}.png`;
      writeFileSync(`${outDir}/${name}`, Buffer.from(out.split(",")[1], "base64"));
      wanted.add(name);
      total += readFileSync(`${outDir}/${name}`).length;
    }

    const stale = readdirSync(outDir).filter((f) => f.endsWith(".png") && !wanted.has(f));
    for (const f of stale) rmSync(`${outDir}/${f}`);

    console.log(
      `wrote ${wanted.size} ${what} mark(s) to ${outDir} (${(total / 1024).toFixed(1)} KB total)` +
        (stale.length ? `, removed ${stale.length} orphaned: ${stale.join(", ")}` : ""),
    );
    const pending = items.filter((i) => !i.logo).length;
    if (pending) console.log(`  ${pending} ${what}(s) still awaiting approved artwork`);
  };

  await publish(PARTNERS, PARTNER_OUT, "partner");
  await publish(CLIENTS, CLIENT_OUT, "client");
} finally {
  await browser.close();
}
