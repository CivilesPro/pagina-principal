const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const plataformaHtml = path.join(distDir, "plataforma.html");
const plataformaDir = path.join(distDir, "plataforma");
const plataformaIndex = path.join(plataformaDir, "index.html");

if (!fs.existsSync(plataformaHtml)) {
  console.warn(
    "[postbuild] plataforma.html no encontrado, omitiendo movimiento de archivo."
  );
  process.exit(0);
}

fs.mkdirSync(plataformaDir, { recursive: true });
fs.renameSync(plataformaHtml, plataformaIndex);

