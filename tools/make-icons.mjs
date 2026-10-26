/*
 * Site icons, cut from Edge's own logo: the blue ring-and-node mark on the left
 * of public/edge-logo.png, without the wordmark. Nothing is redrawn.
 *
 *   src/app/icon.png        512x512, transparent   (browser tab, Next file convention)
 *   src/app/apple-icon.png  180x180, white         (iOS home screen has no transparency)
 *   src/app/favicon.ico      48x48 PNG-in-ICO      (crawlers and old browsers ask for /favicon.ico)
 *
 * Run it if the logo artwork is ever replaced:  node tools/make-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "public/edge-logo.png";
// The mark spans the left ~172px of the 391x176 lockup; the "E" of the wordmark starts after it.
const MARK = { left: 0, top: 0, width: 172, height: 176 };

const meta = await sharp(SRC).metadata();
if (meta.height !== 176 || (meta.width ?? 0) < 300) throw new Error(`unexpected logo size ${meta.width}x${meta.height}`);

const clear = { r: 0, g: 0, b: 0, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

// Crop the mark, then pad it to a square so it is centred, not stretched.
async function square(size, background, inset) {
  const mark = await sharp(SRC).extract(MARK).png().toBuffer();
  const inner = Math.round(size * (1 - inset * 2));
  const resized = await sharp(mark)
    .resize(inner, inner, { fit: "contain", background: clear })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

const icon = await square(512, clear, 0.04);
const apple = await square(180, white, 0.1);
const ico48 = await square(48, clear, 0.04);

// ICO with one PNG image (supported by every current browser and crawler).
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); // planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico48.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset

writeFileSync("src/app/icon.png", icon);
writeFileSync("src/app/apple-icon.png", apple);
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ico48]));
console.log("wrote icon.png (512), apple-icon.png (180), favicon.ico (48)");
