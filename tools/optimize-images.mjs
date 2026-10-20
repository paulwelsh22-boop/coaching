// One-off: writes AVIF and WebP renditions of every assets/*.jpg into assets/img/.
// Needs sharp, which is not a project dependency. Run it from anywhere sharp is installed:
//   SHARP=/path/to/node_modules/sharp node tools/optimize-images.mjs
// The original JPEGs stay put (social previews and the <img> fallback use them).
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const sharp = process.env.SHARP ? createRequire(join(process.env.SHARP, 'package.json'))(process.env.SHARP) : (await import('sharp')).default;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets');
const OUT = join(SRC, 'img');
const WIDTHS = [480, 800, 1200, 1600, 2000];
mkdirSync(OUT, { recursive: true });

let before = 0, after = 0;
for (const f of readdirSync(SRC).filter((f) => f.endsWith('.jpg'))) {
  const base = f.replace(/\.jpg$/, '');
  const { width } = await sharp(join(SRC, f)).metadata();
  before += statSync(join(SRC, f)).size;
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
  for (const w of widths) {
    const img = () => sharp(join(SRC, f)).resize({ width: w, withoutEnlargement: true });
    await img().avif({ quality: 50, effort: 4 }).toFile(join(OUT, `${base}-${w}.avif`));
    await img().webp({ quality: 72 }).toFile(join(OUT, `${base}-${w}.webp`));
  }
  console.log(base, widths.join(','));
}
for (const f of readdirSync(OUT)) after += statSync(join(OUT, f)).size;
console.log(`originals ${(before / 1024) | 0} KiB, renditions ${(after / 1024) | 0} KiB across ${readdirSync(OUT).length} files`);
