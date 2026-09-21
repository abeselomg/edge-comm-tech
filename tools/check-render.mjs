/*
 * Browser checks: overflow, Tailwind compilation, and the contact sheet that
 * settles whether the pages are actually distinct.
 *
 * Two details here are load-bearing and should not be "tidied":
 *
 *   - ONE browser, closed in a finally block. Launching per page leaked 28
 *     Chrome processes on this machine once already and crashed the driver.
 *   - A wait after load before measuring. The Tailwind play CDN compiles at
 *     runtime, so measuring immediately reports a page with no styles.
 */
import { chromium } from "playwright-core";
import { readdirSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

const dir = process.argv[2];
if (!dir) throw new Error("usage: node check-render.mjs <dir>");

const SHOTS = "shots-highland";
mkdirSync(SHOTS, { recursive: true });

const files = readdirSync(dir).filter((f) => f.endsWith(".html")).sort();
const WIDTHS = [390, 768, 940, 1440];
const problems = [];
const shots = [];

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });

/* Fetch the Tailwind runtime once and serve every page from memory.
   Fourteen pages at four widths is 56 loads; hitting the CDN that many times
   in a burst gets throttled, and a throttled load looks exactly like a broken
   page to the checks below. Cached, it is also several times faster. */
let tw = null;
const cacheTailwind = async (page) => {
  await page.route("**/cdn.tailwindcss.com/**", async (route) => {
    if (!tw) {
      const res = await route.fetch();
      tw = await res.text();
    }
    await route.fulfill({ status: 200, contentType: "application/javascript", body: tw });
  });
};

try {
  for (const f of files) {
    const url = pathToFileURL(path.resolve(dir, f)).href;

    for (const w of WIDTHS) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await cacheTailwind(page);
      await page.goto(url, { waitUntil: "load", timeout: 60000 });

      /* Wait for the fact, not for a guess at how long it takes.
         The Tailwind play CDN compiles at runtime, and a fixed sleep produced
         false overflow failures on a slow compile: the page is measured while
         `overflow-hidden` has not yet applied, so a decorative element that is
         meant to be clipped still counts toward scrollWidth. Poll for the
         compiled max-width instead. */
      await page
        .waitForFunction(
          () => {
            const el = document.querySelector('[class*="max-w-6xl"]');
            return el && getComputedStyle(el).maxWidth === "1152px";
          },
          { timeout: 20000 },
        )
        .catch(() => problems.push(`${f} @${w}: Tailwind never compiled within 20s`));
      await page.waitForTimeout(120); // let the resulting layout settle

      const r = await page.evaluate(() => {
        const el = document.querySelector('[class*="max-w-6xl"], main');
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          maxW: el ? getComputedStyle(el).maxWidth : "none",
          navItems: document.querySelectorAll('nav[aria-label="Main"] a').length,
          height: document.body.scrollHeight,
        };
      });

      if (r.overflow > 0) problems.push(`${f} @${w}: horizontal overflow ${r.overflow}px`);

      if (w === 1440) {
        if (r.maxW !== "1152px") problems.push(`${f}: Tailwind did not compile (max-width ${r.maxW})`);
        if (r.navItems !== 7) problems.push(`${f}: desktop nav has ${r.navItems} items, expected 7`);
        const shot = path.join(SHOTS, f.replace(".html", ".png"));
        await page.screenshot({ path: shot, clip: { x: 0, y: 0, width: 1440, height: 1100 } });
        shots.push({ f, shot: path.basename(shot), height: r.height });
      }
      await page.close();
    }
    console.log(`checked ${f}`);
  }
} finally {
  await browser.close();
}

/* The redundancy contact sheet. If two of these read as the same page at
   thumbnail size, the design brief has failed regardless of the markup. */
writeFileSync(
  path.join(SHOTS, "sheet.html"),
  `<!doctype html><meta charset=utf-8><title>Highland contact sheet</title>
<style>body{margin:0;background:#111;font:12px system-ui;color:#ccc;display:grid;
grid-template-columns:repeat(4,1fr);gap:10px;padding:10px}
figure{margin:0}img{width:100%;border:1px solid #333}figcaption{padding:4px 2px}</style>
${shots.map((s) => `<figure><img src="${s.shot}"><figcaption>${s.f} — ${s.height}px</figcaption></figure>`).join("\n")}`,
);

if (problems.length) {
  console.error(`\nFAIL — ${problems.length} problem(s):`);
  problems.forEach((p) => console.error("  " + p));
  process.exit(1);
}
console.log(`\nPASS — ${files.length} pages, no overflow at ${WIDTHS.join("/")}px, Tailwind compiled, nav intact`);
console.log(`Contact sheet: ${SHOTS}/sheet.html`);
