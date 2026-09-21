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
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "design-src/span/logos/wordmark.png";
const OUT = "design-files/highland/edge-logo.png";
const TARGET_H = 176; // ~3x the 56px the header reserves

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
} finally {
  await browser.close();
}
