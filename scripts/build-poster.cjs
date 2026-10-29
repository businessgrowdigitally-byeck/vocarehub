// Gera public/cartaz-vocare.pdf (A4) a partir de scripts/poster/cartaz.html.
//
// Uso: node scripts/build-poster.cjs
//
// Requer Playwright com Chromium, que não é dependência do projeto (pesaria em todo build da
// Vercel). Uma vez só: npm i --no-save playwright && npx playwright install chromium
//
// O QR code está embutido no HTML e aponta para https://vocarehub.vercel.app. Ao trocar de
// domínio, gere um SVG novo (ex.: biblioteca "qrcode" do Python, SvgPathImage, border=0),
// substitua o <svg> dentro de .qr e o texto .url no HTML, e rode este script de novo.
const path = require("node:path");
const { chromium } = require("playwright");

(async () => {
  const root = path.join(__dirname, "..");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.join(root, "scripts/poster/cartaz.html"), {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(root, "public/cartaz-vocare.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log("public/cartaz-vocare.pdf gerado");
})();
