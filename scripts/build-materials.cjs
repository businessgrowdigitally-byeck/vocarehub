// Gera os PDFs de apoio para escolas (A4) a partir dos HTMLs em scripts/poster/:
//   cartaz.html  -> public/cartaz-vocare.pdf
//   roteiro.html -> public/roteiro-de-aula-vocare.pdf
//
// Uso: node scripts/build-materials.cjs
//
// Requer Playwright com Chromium, que não é dependência do projeto (pesaria em todo build da
// Vercel). Uma vez só: npm i --no-save playwright && npx playwright install chromium
//
// O QR code está embutido no HTML e aponta para https://vocarehub.vercel.app. Ao trocar de
// domínio, gere um SVG novo (ex.: biblioteca "qrcode" do Python, SvgPathImage, border=0),
// substitua o <svg> dentro de .qr e o texto .url no HTML, e rode este script de novo.
const path = require("node:path");
const { chromium } = require("playwright");

const MATERIALS = [
  ["scripts/poster/cartaz.html", "public/cartaz-vocare.pdf"],
  ["scripts/poster/roteiro.html", "public/roteiro-de-aula-vocare.pdf"],
];

(async () => {
  const root = path.join(__dirname, "..");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const [source, target] of MATERIALS) {
    await page.goto("file://" + path.join(root, source), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: path.join(root, target),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    console.log(`${target} gerado`);
  }
  await browser.close();
})();
