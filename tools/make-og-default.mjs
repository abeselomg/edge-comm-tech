// Builds public/og-default.png, the picture a page is shared with when it has
// none of its own: the Edge logo centred on a pale brand-blue ground, with a
// brand-blue band along the foot. 1200 x 630, the Open Graph size.
//
//   node tools/make-og-default.mjs
//
// Run from the repository root. Uses sharp, which the app already depends on.
import sharp from "sharp";

const W = 1200;
const H = 630;
const logo = await sharp("public/edge-logo.png")
  .resize({ width: 640, withoutEnlargement: false })
  .toBuffer({ resolveWithObject: true });

const background = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3f9fd"/><stop offset="1" stop-color="#dcedf8"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect y="${H - 22}" width="${W}" height="22" fill="#003D6B"/>
    <rect y="${H - 28}" width="${W}" height="6" fill="#10C7FF"/>
  </svg>`,
);

await sharp(background)
  .composite([
    {
      input: logo.data,
      left: Math.round((W - logo.info.width) / 2),
      top: Math.round((H - 28 - logo.info.height) / 2),
    },
  ])
  .png({ palette: true, quality: 90, compressionLevel: 9 })
  .toFile("public/og-default.png");
