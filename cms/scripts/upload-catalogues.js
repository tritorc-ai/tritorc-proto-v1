// Uploads every PDF in a folder (recursively) to the Strapi Media Library so the app's
// Library and the product/service "catalogue" buttons can show them.
//
// Safe to re-run: a file whose display name already exists is skipped.
// Stop `npm run develop` first (SQLite has a single writer), then:
//   node scripts/upload-catalogues.js "<folder with the PDFs>"
//
// Display name = file name without ".pdf" (the app matches catalogues by this name).
// Caption = the Library category label. Edit it later in the Media Library.
// Files starting with "Copy of" are skipped (duplicates).

const fs = require("fs");
const path = require("path");
const { createStrapi, compileStrapi } = require("@strapi/strapi");

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error('Usage: node scripts/upload-catalogues.js "<folder>"');
  process.exit(1);
}

function pdfsIn(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return pdfsIn(p);
    return e.name.toLowerCase().endsWith(".pdf") && !/^copy of /i.test(e.name) ? [p] : [];
  });
}

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = "error";
  const upload = app.plugin("upload").service("upload");
  let added = 0;
  let skipped = 0;

  for (const file of pdfsIn(dir)) {
    const base = path.basename(file);
    const name = base.replace(/\.pdf$/i, "").replace(/\s+/g, " ").trim();
    const exists = await app.db.query("plugin::upload.file").findOne({ where: { name: `${name}.pdf` } });
    if (exists) {
      skipped++;
      continue;
    }
    const size = fs.statSync(file).size;
    await upload.upload({
      data: { fileInfo: { name: `${name}.pdf`, caption: "Catalogues", alternativeText: name } },
      files: { filepath: file, originalFilename: base, mimetype: "application/pdf", size },
    });
    added++;
    console.log("uploaded", name);
  }
  console.log(`done: ${added} uploaded, ${skipped} already there`);
  await app.destroy();
  process.exit(0);
}

main().catch((e) => {
  console.error("upload failed:", e);
  process.exit(1);
});
