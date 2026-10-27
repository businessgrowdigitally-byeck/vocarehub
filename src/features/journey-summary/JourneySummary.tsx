import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, Download, RotateCcw } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useJourney } from "@/hooks/use-journey";
import { trackEvent } from "@/lib/analytics/analytics";
import { buildCertificatePdf, latin1Bytes } from "./certificate";
import { buildJourneySummary, isJourneyComplete } from "./summary-logic";

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

function TagList({ items }: { items: { id: string; label: string }[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-full border border-offwhite/20 px-3 py-1 text-xs text-offwhite/80"
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function JourneySummary() {
  const { state, isHydrated, resetJourney } = useJourney();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const complete = isJourneyComplete(state);
  const summary = buildJourneySummary(state);

  const download = () => {
    const pdf = buildCertificatePdf({
      name: name.trim() || null,
      pathTitles: summary.paths.map((path) => path.title),
      missionTitle: summary.plan.mission?.title ?? null,
      targetPathTitle: summary.plan.path?.title ?? null,
      targetDate: summary.plan.targetDate ? formatDate(summary.plan.targetDate) : null,
    });
    const blob = new Blob([latin1Bytes(pdf)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "passaporte-vocare.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    // Sem parâmetros: o nome digitado no certificado nunca sai do navegador.
    trackEvent("passport_downloaded");
  };

  const restart = () => {
    if (!window.confirm("Começar de novo? Suas respostas atuais serão apagadas.")) return;
    resetJourney();
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <section className="px-5 pb-10 pt-12">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-solar">PASSAPORTE</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Sua jornada, registrada.
          </h1>
          <p className="mt-4 max-w-xl text-offwhite/75">
            Este é o retrato do que você descobriu sobre si, sobre o mundo e sobre o seu próximo
            passo.
          </p>
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="mx-auto max-w-4xl">
          {!isHydrated ? (
            <p className="text-offwhite/60">Carregando…</p>
          ) : !complete ? (
            <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Sua jornada ainda não terminou.</h2>
              <p className="mt-2 text-sm text-offwhite/70">
                O passaporte reúne o SER, o PENSAR e o FAZER. Conclua as três fases para vê-lo.
              </p>
              <Link
                to="/ser"
                className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink"
              >
                Continuar minha jornada
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-3xl border border-solar/40 bg-solar/10 p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 eyebrow text-solar">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  JORNADA COMPLETA
                </span>
                <p className="mt-3 max-w-2xl text-offwhite/85">
                  Você olhou para dentro, olhou ao redor e escolheu um primeiro passo. Isso já é
                  começar.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6">
                  <p className="eyebrow text-cian">SER</p>
                  <h3 className="mt-2 font-display text-lg font-bold">Meu mapa</h3>
                  <p className="mt-4 eyebrow text-offwhite/50">Interesses</p>
                  <TagList items={summary.interests} />
                  <p className="mt-4 eyebrow text-offwhite/50">Forças</p>
                  <TagList items={summary.strengths} />
                  <p className="mt-4 eyebrow text-offwhite/50">Valores</p>
                  <TagList items={summary.values} />
                </div>

                <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6">
                  <p className="eyebrow text-cian">PENSAR</p>
                  <h3 className="mt-2 font-display text-lg font-bold">Meus 3 caminhos</h3>
                  <ul className="mt-4 space-y-3">
                    {summary.paths.map((path) => (
                      <li key={path.id} className="text-sm text-offwhite/85">
                        {path.title}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 eyebrow text-offwhite/50">Preferências de trabalho</p>
                  <ul className="mt-3 space-y-2 text-xs text-offwhite/70">
                    {summary.preferences.map((phrase) => (
                      <li key={phrase}>{phrase}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6">
                  <p className="eyebrow text-solar">FAZER</p>
                  <h3 className="mt-2 font-display text-lg font-bold">Meu primeiro passo</h3>
                  <p className="mt-4 eyebrow text-offwhite/50">Missão</p>
                  <p className="mt-1 text-sm text-offwhite/85">{summary.plan.mission?.title}</p>
                  <p className="mt-4 eyebrow text-offwhite/50">Caminho</p>
                  <p className="mt-1 text-sm text-offwhite/85">{summary.plan.path?.title}</p>
                  <p className="mt-4 eyebrow text-offwhite/50">Até</p>
                  <p className="mt-1 text-sm text-offwhite/85">
                    {summary.plan.targetDate ? formatDate(summary.plan.targetDate) : "—"}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold">Seu passaporte em PDF</h2>
                <p className="mt-2 max-w-2xl text-sm text-offwhite/70">
                  Gere um documento com o resumo da sua jornada. O nome é opcional e usado apenas
                  para montar o arquivo — nada é enviado nem guardado.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="w-full sm:max-w-xs">
                    <label htmlFor="passaporte-nome" className="eyebrow block text-offwhite/60">
                      NOME (OPCIONAL)
                    </label>
                    <input
                      id="passaporte-nome"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Como você quer aparecer?"
                      className="mt-2 w-full rounded-xl border border-offwhite/25 bg-amazon/40 px-4 py-3 text-offwhite outline-none placeholder:text-offwhite/40 focus:border-solar"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={download}
                    className="tap inline-flex items-center justify-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Baixar passaporte
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/fazer"
                  className="text-sm text-offwhite/60 underline underline-offset-4 hover:text-solar"
                >
                  Rever meu plano
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-5 py-3 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Começar uma nova jornada
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
