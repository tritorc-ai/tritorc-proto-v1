// Makes a cover picture (first page) for every PDF in a folder and uploads it to the Strapi
// Media Library as "<pdf name>.thumb.webp" with caption "catalogue-thumb". The app's Library
// then shows it on the PDF's card. Safe to re-run: existing thumbnails are skipped.
// Stop `npm run develop` first (SQLite has a single writer), then:
//   node scripts/upload-catalogue-thumbnails.js "<folder with the PDFs>"

const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");
const { createCanvas } = require("@napi-rs/canvas");
const { createStrapi, compileStrapi } = require("@strapi/strapi");

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error('Usage: node scripts/upload-catalogue-thumbnails.js "<folder>"');
  process.exit(1);
}

function pdfsIn(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return pdfsIn(p);
    return e.name.toLowerCase().endsWith(".pdf") && !/^copy of /i.test(e.name) ? [p] : [];
  });
}

async function cover(pdfjs, file, width) {
  const data = new Uint8Array(fs.readFileSync(file));
  const task = pdfjs.getDocument({ data, useSystemFonts: true });
  const doc = await task.promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvasContext: canvas.getContext("2d"), canvas, viewport }).promise;
  const png = canvas.toBuffer("image/png");
  await task.destroy();
  return sharp(png).flatten({ background: "#ffffff" }).webp({ quality: 80 }).toBuffer();
}

async function main() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = "error";
  const upload = app.plugin("upload").service("upload");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "thumbs-"));
  let added = 0;
  let skipped = 0;

  for (const file of pdfsIn(dir)) {
    const name = path.basename(file).replace(/\.pdf$/i, "").replace(/\s+/g, " ").trim();
    const thumbName = `${name}.thumb.webp`;
    if (await app.db.query("plugin::upload.file").findOne({ where: { name: thumbName } })) {
      skipped++;
      continue;
    }
    try {
      const buf = await cover(pdfjs, file, 600);
      const out = path.join(tmp, "thumb.webp");
      fs.writeFileSync(out, buf);
      await upload.upload({
        data: { fileInfo: { name: thumbName, caption: "catalogue-thumb", alternativeText: name } },
        files: { filepath: out, originalFilename: thumbName, mimetype: "image/webp", size: buf.length },
      });
      added++;
      console.log("thumbnail", name, `${Math.round(buf.length / 1024)} KB`);
    } catch (e) {
      console.error("FAILED", name, e.message);
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`done: ${added} created, ${skipped} already there`);
  await app.destroy();
  process.exit(0);
}

main().catch((e) => {
  console.error("thumbnails failed:", e);
  process.exit(1);
});
