import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, X } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const phases = [
  {
    number: "01",
    name: "SER",
    headline: "Olhe para dentro.",
    description:
      "SER ajuda você a observar interesses, forças, valores e preferências — sem transformar respostas em um rótulo.",
    points: ["Interesses", "Forças", "Valores", "Preferências"],
    output: "Meu Mapa",
    message:
      "O resultado não define quem você é. É apenas um retrato do que você percebe sobre si neste momento.",
    cta: "Conhecer o SER",
    to: "/ser" as const,
    visual: {
      background: "bg-amazon text-offwhite",
      accent: "text-solar",
      muted: "text-offwhite/65",
    },
  },
  {
    number: "02",
    name: "PENSAR",
    headline: "Olhe ao redor.",
    description:
      "PENSAR apresenta áreas e caminhos para explorar possibilidades, investigar atividades, comparar e escolher três opções para observar melhor.",
    points: ["Explorar possibilidades", "Investigar atividades", "Comparar caminhos"],
    output: "Meus 3 Caminhos",
    message:
      "Escolher três caminhos não significa decidir sua profissão. Significa reduzir o campo para conseguir investigar melhor.",
    cta: "Explorar o PENSAR",
    to: "/pensar" as const,
    visual: {
      background: "bg-cian text-ink",
      accent: "text-terra",
      muted: "text-ink/65",
    },
  },
  {
    number: "03",
    name: "FAZER",
    headline: "Olhe para frente.",
    description:
      "FAZER transforma uma possibilidade em um pequeno experimento: testar uma atividade, conversar com alguém da área ou investigar formas de começar.",
    points: ["Experimentar", "Conversar", "Investigar"],
    output: "Meu Primeiro Experimento",
    message:
      "Você não precisa apostar anos da sua vida para aprender algo sobre um caminho. Pode começar com um pequeno teste.",
    cta: "Conhecer o FAZER",
    to: "/fazer" as const,
    visual: {
      background: "bg-solar text-ink",
      accent: "text-terra",
      muted: "text-ink/65",
    },
  },
] as const;

const suggestionSteps = [
  "No SER, você responde 30 perguntas curtas sobre atividades. Não precisa saber fazer — só dizer o quanto gostaria de experimentar.",
  "As respostas formam um retrato dos seus interesses em seis temas: fazer na prática, investigar, criar, cuidar e ensinar, liderar e empreender, e organizar.",
  "No PENSAR, esse retrato é comparado com perfis de interesse de profissões do O*NET, um banco de dados público do Departamento do Trabalho dos Estados Unidos. Os caminhos mais parecidos aparecem como sugestões.",
  "Só os interesses entram nessa comparação. Forças, valores e preferências ajudam você a refletir, mas não mudam as sugestões.",
];

const notVocare = [
  "Teste que revela sua “profissão ideal”",
  "Diagnóstico psicológico ou avaliação de personalidade",
  "Promessa de emprego",
  "Substituto de orientação profissional individual",
  "Ranking de carreiras",
  "Sistema que diz quem você deveria ser",
] as const;

const principles = [
  {
    title: "Mais de um caminho",
    text: "Não existe uma única sequência correta para construir o futuro.",
  },
  {
    title: "Explorar antes de decidir",
    text: "Conhecer possibilidades reduz decisões baseadas apenas no que já é familiar.",
  },
  {
    title: "Experimentar pequeno",
    text: "Uma conversa, pesquisa ou pequena experiência pode ensinar mais do que imaginar um caminho à distância.",
  },
  {
    title: "Informação confiável",
    text: "Quando o VOcare direciona para oportunidades, prioriza fontes oficiais e instituições responsáveis.",
  },
  {
    title: "Acesso",
    text: "O núcleo da experiência é gratuito e funciona diretamente no navegador.",
  },
] as const;

export function AboutPage() {
  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-amazon" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--solar)_0%,_transparent_70%)] opacity-20" />
        <div
          className="absolute right-0 top-20 h-64 w-64 sm:h-96 sm:w-96 opacity-10"
          style={{
            backgroundColor: "var(--cian)",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-5 pb-14 sm:min-h-[75vh] sm:pb-20 text-center">
          <p className="eyebrow text-solar">Sobre o VOcare</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.02] sm:text-6xl md:text-7xl">
            Você não precisa decidir sua vida inteira agora.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-offwhite/80">
            VOcare é uma jornada gratuita para ajudar jovens a se conhecerem, explorarem
            possibilidades e transformarem uma ideia em um primeiro passo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/ser"
              className="tap inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
            >
              Começar minha jornada
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#como-funciona"
              className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-7 py-3.5 font-display font-bold text-offwhite/85 transition-colors hover:bg-offwhite/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
            >
              Ver como funciona
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — POR QUE EXISTE */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-solar">Por que existe</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Escolher fica mais difícil quando você nem sabe por onde começar.
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-lg text-offwhite/75">
            Muitos jovens escutam “O que você quer fazer?”, “Que curso vai escolher?” e “Qual
            profissão quer seguir?” antes de terem espaço para observar interesses, reconhecer
            forças e valores, conhecer possibilidades e experimentar alguma delas.
          </p>
          <div className="mt-8 p-6 border border-solar/30 bg-solar/5 rounded-2xl">
            <p className="font-display text-xl font-bold text-solar">
              Antes de escolher um caminho, talvez você precise enxergar quais caminhos existem — e
              entender um pouco melhor quem está escolhendo.
            </p>
          </div>
          <p className="mt-6 text-offwhite/70">
            O VOcare organiza esse processo sem entregar uma resposta pronta.
          </p>
        </div>
      </section>

      {/* SECTION 3 — METODOLOGIA */}
      <section id="como-funciona" className="scroll-mt-16 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow text-cian">Como funciona</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Três movimentos. Nenhuma resposta pronta.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {phases.map((phase) => (
              <article key={phase.number} className={phase.visual.background}>
                <div className="rounded-3xl p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-lg font-bold {phase.visual.accent}">
                      {phase.number}
                    </span>
                    <span className="eyebrow {phase.visual.accent}">{phase.name}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold">{phase.headline}</h3>
                  <p className="mt-3 {phase.visual.muted}">{phase.description}</p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {phase.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <Check
                          className={`h-5 w-5 shrink-0 mt-0.5 ${phase.visual.accent}`}
                          aria-hidden="true"
                        />
                        <span className={phase.visual.muted}>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-current/15">
                    <p className="eyebrow {phase.visual.accent}">Resultado</p>
                    <p className="mt-1 font-display text-lg font-bold">{phase.output}</p>
                    <p className="mt-3 text-sm {phase.visual.muted}">{phase.message}</p>
                    <Link
                      to={phase.to}
                      className="mt-5 tap inline-flex items-center gap-2 font-display font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
                      style={{
                        color: phase.name === "SER" ? "var(--solar)" : "var(--terra)",
                        backgroundColor: phase.name === "SER" ? "transparent" : "transparent",
                      }}
                    >
                      {phase.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — A LÓGICA */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow text-terra">A lógica</p>
          </div>
          <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:items-end">
            {phases.map((phase, index) => (
              <div key={phase.number} className="flex flex-col items-center text-center">
                <div
                  className={`rounded-2xl p-6 w-full max-w-sm ${
                    phase.name === "SER"
                      ? "bg-amazon text-offwhite"
                      : phase.name === "PENSAR"
                        ? "bg-cian text-ink"
                        : "bg-solar text-ink"
                  }`}
                >
                  <p
                    className="eyebrow"
                    style={{
                      color:
                        phase.name === "SER"
                          ? "var(--solar)"
                          : phase.name === "PENSAR"
                            ? "var(--terra)"
                            : "var(--terra)",
                    }}
                  >
                    {phase.name}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold">
                    {phase.name === "SER"
                      ? "Quem sou e o que valorizo?"
                      : phase.name === "PENSAR"
                        ? "Que possibilidades posso explorar?"
                        : "O que posso testar agora?"}
                  </h3>
                </div>
                {index < phases.length - 1 && (
                  <ArrowRight
                    className="h-6 w-6 text-offwhite/40 md:block hidden"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          {/* PASSAPORTE VOCARE */}
          <div className="mt-16 rounded-3xl border border-solar/30 bg-solar/5 p-6 sm:p-8">
            <p className="eyebrow text-solar">PASSAPORTE VOCARE</p>
            <p className="mt-3 max-w-3xl text-offwhite/80">
              Ao terminar, você pode gerar um resumo da sua jornada com seu mapa, seus três caminhos
              e seu primeiro experimento. É um registro pessoal — não um diploma, diagnóstico,
              documento oficial ou avaliação psicológica.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — LIMITES CLAROS */}
      <section className="px-5 py-16 sm:py-24 bg-amazon">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-solar">Limites claros</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            O VOcare não escolhe por você.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notVocare.map((item) => (
              <div key={item} className="rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 shrink-0 mt-0.5 text-solar" aria-hidden="true" />
                  <p className="text-sm text-offwhite/85">{item}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 font-display text-xl font-bold text-solar">
            Decisões importantes continuam sendo suas. O VOcare existe para aumentar clareza, não
            para eliminar a incerteza.
          </p>
        </div>
      </section>

      {/* SECTION 5B — COMO AS SUGESTÕES APARECEM */}
      <section id="sugestoes" className="scroll-mt-16 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-cian">Como as sugestões aparecem</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Suas respostas, dados abertos e nenhum veredito.
          </h2>
          <ol className="mt-8 space-y-5">
            {suggestionSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="font-mono text-sm text-cian">0{index + 1}</span>
                <p className="text-offwhite/80">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5 text-sm text-offwhite/80">
            Os dados do O*NET descrevem profissões nos Estados Unidos, e as perguntas ainda estão
            sendo testadas com estudantes. Por isso as sugestões são pontos de partida para explorar
            — não uma indicação do que você deve escolher. Empreendedorismo, produto digital e
            relações internacionais ainda não têm dados confiáveis: não aparecem como sugestão, mas
            continuam disponíveis para você explorar.
          </p>
          <p className="mt-6 text-xs text-offwhite/55">
            Inclui informações do banco de dados O*NET 31.0, do U.S. Department of Labor, Employment
            and Training Administration (USDOL/ETA), usadas sob a licença{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              CC BY 4.0
            </a>{" "}
            e adaptadas pelo VOcare. O*NET® é marca registrada do USDOL/ETA.
          </p>
        </div>
      </section>

      {/* SECTION 6 — CONTINUE EXPLORANDO */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-cian">Continue explorando</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            A jornada termina. A curiosidade não precisa terminar.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8 text-left">
              <h3 className="font-display text-2xl font-bold text-offwhite">
                Biblioteca Essencial
              </h3>
              <p className="mt-3 text-offwhite/75">
                Livros, cursos, fontes oficiais, referências sobre carreiras e educação financeira
                para seguir aprendendo.
              </p>
              <Link
                to="/biblioteca"
                className="mt-5 tap inline-flex items-center gap-2 font-display font-bold text-solar hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
              >
                Explorar a Biblioteca
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
            <article className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8 text-left">
              <h3 className="font-display text-2xl font-bold text-offwhite">Oportunidades</h3>
              <p className="mt-3 text-offwhite/75">
                Fontes confiáveis para procurar trabalho, aprendizagem, formação técnica,
                universidade, ciência e projetos.
              </p>
              <Link
                to="/oportunidades"
                className="mt-5 tap inline-flex items-center gap-2 font-display font-bold text-solar hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
              >
                Encontrar oportunidades
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRINCÍPIOS */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="eyebrow text-terra">Princípios</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              O que orienta o VOcare
            </h2>
          </div>
          <ol className="mt-10 space-y-8">
            {principles.map((principle, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="font-mono text-2xl font-bold text-terra shrink-0"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-offwhite">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-offwhite/75">{principle.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 8 — PRIVACIDADE E ACESSO */}
      <section className="px-5 py-16 sm:py-24 bg-solar text-ink">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-ink/15 bg-amazon/40 p-6 sm:p-8">
              <p className="eyebrow text-terra">Privacidade</p>
              <h3 className="mt-2 font-display text-2xl font-bold">Sua jornada é sua.</h3>
              <p className="mt-3 text-ink/75">
                As respostas da jornada ficam no próprio navegador do dispositivo. O VOcare não
                exige uma conta para realizar SER, PENSAR e FAZER.
              </p>
            </div>
            <div className="rounded-3xl border border-ink/15 bg-amazon/40 p-6 sm:p-8">
              <p className="eyebrow text-terra">Acesso</p>
              <h3 className="mt-2 font-display text-2xl font-bold">
                Feito para chegar a mais jovens.
              </h3>
              <p className="mt-3 text-ink/75">
                O VOcare foi pensado para ser gratuito no acesso ao estudante e simples de aplicar
                individualmente ou em contextos educacionais.
              </p>
              <Link
                to="/escolas"
                className="mt-5 tap inline-flex items-center gap-2 rounded-full bg-terra px-6 py-3 font-display font-bold text-offwhite transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terra focus-visible:ring-offset-2 focus-visible:ring-offset-solar"
              >
                VOcare para escolas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — QUEM CONSTRÓI */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-solar">Quem constrói o VOcare</p>
          <p className="mt-3 max-w-2xl mx-auto text-offwhite/80">
            O VOcare é uma iniciativa educacional criada para ampliar o acesso de jovens a
            orientação, referências e oportunidades.
          </p>
          <p className="mt-5 text-offwhite/60">
            Desenvolvido por{" "}
            <a
              href="https://www.bgdsystems.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-offwhite/90"
            >
              BGD Systems
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </p>
        </div>
      </section>

      {/* SECTION 10 — CTA FINAL */}
      <section className="px-5 py-16 sm:py-24 bg-amazon text-offwhite">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Você não precisa ter todas as respostas para começar.
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/ser"
              className="tap inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
            >
              Começar pelo SER
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/escolas"
              className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-7 py-3.5 font-display font-bold text-offwhite/85 transition-colors hover:bg-offwhite/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-solar focus-visible:ring-offset-2 focus-visible:ring-offset-amazon"
            >
              Sou educador
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
