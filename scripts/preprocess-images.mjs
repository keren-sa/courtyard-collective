/* Pre-process Stitch PNGs into static AVIF/WebP/PNG variants. */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inDir = "src/assets/images";
const outDir = "public/images";
const widths = [320, 512];

await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(inDir)).filter((f) => f.endsWith(".png"));
console.log(`Processing ${files.length} source images into ${outDir}/`);

let totalIn = 0;
let totalOut = 0;
for (const file of files) {
  const inPath = path.join(inDir, file);
  const base = path.basename(file, ".png");
  const buf = await fs.readFile(inPath);
  totalIn += buf.length;

  for (const w of widths) {
    const pipeline = sharp(buf).resize({ width: w, height: w, fit: "cover" });

    const avif = await pipeline.clone().avif({ quality: 60 }).toBuffer();
    const webp = await pipeline.clone().webp({ quality: 78 }).toBuffer();
    const png = await pipeline.clone().png({ quality: 90, compressionLevel: 9 }).toBuffer();

    await fs.writeFile(path.join(outDir, `${base}-${w}.avif`), avif);
    await fs.writeFile(path.join(outDir, `${base}-${w}.webp`), webp);
    await fs.writeFile(path.join(outDir, `${base}-${w}.png`), png);
    totalOut += avif.length + webp.length + png.length;
    console.log(`  ${base}-${w}: avif=${(avif.length/1024).toFixed(1)}k webp=${(webp.length/1024).toFixed(1)}k png=${(png.length/1024).toFixed(1)}k`);
  }
}

console.log(`\nTotal: source=${(totalIn/1024).toFixed(0)}KB → all variants=${(totalOut/1024).toFixed(0)}KB`);
