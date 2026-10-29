// Gera as capturas do guia /como-usar (public/guia/*.jpg) com destaques numerados.
// Uso: com `npx vite dev --port 5173` rodando, execute
//   node scripts/capture-guide.cjs public/guia
// Requer Playwright com Chromium (uma vez só: npm i --no-save playwright && npx playwright
// install chromium). Rode de novo sempre que as telas mudarem.

const { chromium } = require("playwright");
const OUT = process.argv[2];
const BASE = "http://127.0.0.1:5173";
const ids = ["r", "i", "a", "s", "e", "c"].flatMap((d) => [1, 2, 3, 4, 5].map((n) => d + n));
const dims = { r: 2, i: 5, a: 2, s: 1, e: 2, c: 4 };
const fullAnswers = Object.fromEntries(ids.map((id) => [id, dims[id[0]]]));
function state(over = {}) {
  return {
    version: 2,
    ser: {
      status: "completed",
      interestResponses: fullAnswers,
      strengths: ["problem-solving", "focus"],
      values: ["autonomy", "learning", "challenge"],
      preferences: { social: 2, routine: 4, practical: 3, structure: 3 },
      ...(over.ser || {}),
    },
    pensar: {
      status: "completed",
      exploredPathIds: ["data"],
      savedPathIds: ["data", "cybersecurity", "chemistry"],
      selectedPathIds: ["data", "cybersecurity", "chemistry"],
      ...(over.pensar || {}),
    },
    fazer: {
      status: "not_started",
      selectedPathId: null,
      missionId: null,
      targetDate: null,
      ...(over.fazer || {}),
    },
  };
}
async function highlight(page, marks) {
  await page.evaluate(() => document.querySelectorAll(".guide-mark").forEach((n) => n.remove()));
  for (const { loc, n } of marks) {
    const h = await loc.elementHandle();
    await page.evaluate(
      ([el, n]) => {
        const r = el.getBoundingClientRect();
        const pad = 6;
        const box = document.createElement("div");
        box.className = "guide-mark";
        Object.assign(box.style, {
          position: "absolute",
          left: r.left + scrollX - pad + "px",
          top: r.top + scrollY - pad + "px",
          width: r.width + pad * 2 + "px",
          height: r.height + pad * 2 + "px",
          border: "3px solid #f5c84b",
          borderRadius: "16px",
          boxShadow: "0 0 0 4px rgba(245,200,75,.25)",
          zIndex: 9998,
          pointerEvents: "none",
        });
        const b = document.createElement("div");
        b.className = "guide-mark";
        b.textContent = n;
        Object.assign(b.style, {
          position: "absolute",
          left: r.left + scrollX - pad - 12 + "px",
          top: r.top + scrollY - pad - 12 + "px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#f5c84b",
          color: "#111",
          font: "700 15px 'Space Grotesk',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          boxShadow: "0 2px 6px rgba(0,0,0,.4)",
        });
        document.body.append(box, b);
      },
      [h, n],
    );
  }
}
async function shot(page, name, _context, marks) {
  // Centraliza a tela no meio dos elementos destacados.
  const boxes = [];
  for (const { loc } of marks) {
    await loc.scrollIntoViewIfNeeded();
    const r = await loc.boundingBox();
    const y = await page.evaluate(() => scrollY);
    boxes.push({ top: r.y + y, bottom: r.y + r.height + y });
  }
  const mid = (Math.min(...boxes.map((b) => b.top)) + Math.max(...boxes.map((b) => b.bottom))) / 2;
  await page.evaluate((mid) => window.scrollTo(0, Math.max(0, mid - innerHeight * 0.55)), mid);
  await page.waitForTimeout(250);
  await highlight(page, marks);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 82 });
  console.log("saved", name);
}
(async () => {
  const b = await chromium.launch({ args: ["--lang=pt-BR"] });
  const ctx = await b.newContext({
    viewport: { width: 390, height: 760 },
    deviceScaleFactor: 2,
    locale: "pt-BR",
  });
  const p = await ctx.newPage();
  const seed = async (s) => {
    await p.goto(BASE + "/");
    await p.evaluate((s) => {
      localStorage.setItem("vocare:analytics:v1", "denied");
      s
        ? localStorage.setItem("vocare:journey:v2", JSON.stringify(s))
        : localStorage.removeItem("vocare:journey:v2");
    }, s);
  };

  // 1. Início
  await seed(null);
  await p.goto(BASE + "/");
  await p.waitForTimeout(800);
  const cta = p.getByRole("link", { name: "Comece por você" }).first();
  await shot(p, "01-inicio", cta, [{ loc: cta, n: 1 }]);

  // 2. SER perguntas
  await p.goto(BASE + "/ser");
  await p.getByText("Parte 1 de 5").waitFor();
  const g = p.getByRole("radiogroup").first();
  await g.getByRole("radio", { name: "Bastante", exact: true }).click();
  await shot(p, "02-ser-perguntas", p.getByText("Parte 1 de 5"), [{ loc: g, n: 1 }]);

  // 3. SER forças
  await seed(
    state({
      ser: {
        status: "in_progress",
        strengths: [],
        values: [],
        preferences: { social: null, routine: null, practical: null, structure: null },
      },
    }),
  );
  await p.goto(BASE + "/ser");
  await p.getByText("Em quais situações").waitFor();
  for (const s of ["Resolver problemas", "Manter o foco"])
    await p.getByRole("button", { name: s }).click();
  const chips = p.getByRole("group", { name: "Forças" });
  await shot(p, "03-ser-escolhas", p.getByText("Em quais situações"), [{ loc: chips, n: 1 }]);

  // 4. SER mapa
  await seed(state());
  await p.goto(BASE + "/ser");
  await p.getByText("Seu Mapa começou a aparecer.").waitFor();
  const interesses = p.getByText("INTERESSES").locator("..");
  await shot(p, "04-ser-mapa", p.getByText("Seu Mapa começou a aparecer."), [
    { loc: interesses, n: 1 },
  ]);

  // 5. PENSAR sugestões
  await seed(
    state({
      pensar: { status: "in_progress", exploredPathIds: [], savedPathIds: [], selectedPathIds: [] },
    }),
  );
  await p.goto(BASE + "/pensar");
  await p.getByText("Alguns caminhos para começar").waitFor();
  const card = p.locator("article").first();
  await shot(p, "05-pensar-sugestoes", card, [
    { loc: card.getByText(/^Combina com/), n: 1 },
    { loc: card.getByRole("button", { name: "Salvar" }), n: 2 },
  ]);

  // 6. PENSAR escolher 3
  await seed(
    state({
      pensar: {
        status: "in_progress",
        exploredPathIds: [],
        savedPathIds: ["data", "cybersecurity", "chemistry", "biology"],
        selectedPathIds: [],
      },
    }),
  );
  await p.goto(BASE + "/pensar");
  await p.waitForTimeout(800);
  const h3 = p.getByRole("heading", { name: /Escolh/ }).first();
  await h3.waitFor();
  const opts = p.locator("button[aria-pressed]");
  await opts.nth(0).click();
  await opts.nth(1).click();
  await opts.nth(2).click();
  await shot(p, "06-pensar-escolher", h3, [{ loc: opts.nth(0), n: 1 }]);

  // 7. FAZER missão
  await seed(
    state({
      fazer: { status: "in_progress", selectedPathId: "data", missionId: null, targetDate: null },
    }),
  );
  await p.goto(BASE + "/fazer");
  await p.waitForTimeout(800);
  const mh = p.getByRole("heading", { name: "Escolha uma missão" });
  if (!(await mh.isVisible().catch(() => false))) {
    await p.getByRole("button", { name: "Continuar" }).first().click();
  }
  await mh.waitFor();
  const mission = p.getByRole("button", { name: /mini-projeto/i }).first();
  await mission.click();
  await shot(p, "07-fazer-missao", mh, [{ loc: mission, n: 1 }]);

  // 8. FAZER prazo
  await p.getByRole("button", { name: "Continuar" }).first().click();
  const dh = p.getByRole("heading", { name: "Quando você vai começar?" });
  await dh.waitFor();
  const quick = p.getByRole("button", { name: "Em 2 semanas" });
  await quick.click();
  await shot(p, "08-fazer-prazo", dh, [
    { loc: quick, n: 1 },
    { loc: p.getByRole("button", { name: "Concluir meu plano" }), n: 2 },
  ]);

  // 9. Passaporte
  await seed(
    state({
      fazer: {
        status: "completed",
        selectedPathId: "data",
        missionId: "mini-project",
        targetDate: "2026-11-15",
      },
    }),
  );
  await p.goto(BASE + "/resumo");
  await p.getByText("Seu passaporte em PDF").waitFor();
  const name = p.locator("input[type=text]").first();
  await name.fill("Ana");
  await shot(p, "09-passaporte", p.getByText("Seu passaporte em PDF"), [
    { loc: name, n: 1 },
    { loc: p.getByRole("button", { name: /Baixar passaporte/ }), n: 2 },
  ]);
  await b.close();
})().catch((e) => {
  console.error("FAIL", e.message);
  process.exit(1);
});
