import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  type AnalyticsConsent,
  clearConsent,
  isAnalyticsConfigured,
  readConsent,
} from "@/lib/analytics/analytics";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/contact/contact";

export const PRIVACY_CONTACT_EMAIL = "vocare.institucional@gmail.com";
export const PRIVACY_LAST_UPDATED = "28 de outubro de 2026";

const CONSENT_LABELS: Record<AnalyticsConsent, string> = {
  granted: "Você aceitou o analytics neste navegador.",
  denied: "Você recusou o analytics neste navegador.",
  unset: "Você ainda não escolheu.",
};

/** Mostra a escolha atual e permite refazê-la: apaga a escolha e recarrega, e o aviso volta. */
function ConsentControl() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  if (!isAnalyticsConfigured()) {
    return (
      <p className="mt-4 text-sm text-offwhite/70">
        No momento, o analytics está desligado: nenhum dado de uso é enviado.
      </p>
    );
  }

  const change = () => {
    clearConsent();
    window.location.reload();
  };

  return (
    <div className="mt-4 rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5">
      <p className="text-sm text-offwhite/80" role="status">
        {consent ? CONSENT_LABELS[consent] : "Carregando…"}
      </p>
      {consent && consent !== "unset" && (
        <button
          type="button"
          onClick={change}
          className="tap mt-4 rounded-full border border-offwhite/25 px-5 py-2.5 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
        >
          Mudar minha escolha
        </button>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-4 space-y-4 text-offwhite/80">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <main className="px-5 pb-28 pt-12">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow text-solar">Privacidade</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-offwhite/75">
            O VOcare foi feito para jovens. Por isso coletamos o mínimo possível — e explicamos
            aqui, sem letras miúdas, o que acontece com os seus dados.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-offwhite/50">
            Última atualização: {PRIVACY_LAST_UPDATED}
          </p>

          <Section title="Quem é responsável">
            <p>
              O VOcare é mantido pela <strong>BGD Systems</strong>, responsável pelo tratamento dos
              dados descritos nesta política. Para qualquer dúvida ou pedido sobre seus dados,
              escreva para{" "}
              <a
                href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
                className="text-solar underline underline-offset-4"
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
              .
            </p>
          </Section>

          <Section title="Suas respostas ficam com você">
            <p>
              Tudo o que você responde no SER, no PENSAR e no FAZER fica guardado apenas no
              navegador do seu aparelho. Essas respostas não são enviadas para nós nem para ninguém.
              Não existe conta, cadastro ou login.
            </p>
            <p>
              Você pode apagar tudo quando quiser: use “Começar uma nova jornada” no Passaporte ou
              limpe os dados do site no seu navegador.
            </p>
            <p>
              O nome que você escreve no Passaporte é opcional. Ele só é usado para montar o PDF no
              seu próprio aparelho e não é enviado nem guardado.
            </p>
          </Section>

          <Section title="Sugestões por e-mail ou Instagram">
            <p>
              O VOcare não tem formulário de mensagens. Se você mandar uma sugestão por e-mail ou
              pelo Instagram{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-solar underline underline-offset-4"
              >
                @{INSTAGRAM_HANDLE}
              </a>
              , usamos a mensagem só para entender sua sugestão e responder. Ela não é ligada às
              suas respostas da jornada nem usada para publicidade. Não precisa mandar nome
              completo, telefone ou escola. O Instagram tem suas próprias regras de privacidade.
            </p>
          </Section>

          <Section title="Analytics: só se você aceitar">
            <p>
              Para entender como a jornada é usada e melhorar o VOcare, usamos o Google Analytics —
              mas só depois que você aceita no aviso que aparece no site. Se você recusar, ele nem é
              carregado.
            </p>
            <p>Quando você aceita, são registrados:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>as páginas visitadas;</li>
              <li>
                as etapas alcançadas na jornada (começou o SER, terminou o SER, terminou o PENSAR,
                terminou o FAZER, baixou o Passaporte);
              </li>
              <li>
                informações técnicas como tipo de aparelho, navegador e região aproximada (o
                endereço IP não é guardado pelo Google Analytics).
              </li>
            </ul>
            <p>
              <strong>Nunca enviamos</strong> suas respostas, os caminhos que você escolheu nem o
              seu nome. Os dados são tratados pelo Google, inclusive fora do Brasil, e ficam
              guardados por no máximo 14 meses.
            </p>
            <p>
              A base legal é o seu consentimento (LGPD, art. 7º, I). Como o VOcare é feito para
              adolescentes, seguimos o princípio do melhor interesse (LGPD, art. 14): sem
              publicidade, sem venda de dados e sem pixels de anúncios.
            </p>
            <ConsentControl />
          </Section>

          <Section title="Seus direitos">
            <p>
              Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir acesso,
              correção ou eliminação dos seus dados e retirar o consentimento a qualquer momento.
              Retirar o consentimento é tão simples quanto dar: use o botão acima. Para outros
              pedidos, escreva para{" "}
              <a
                href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
                className="text-solar underline underline-offset-4"
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
              . Se você tiver menos de 18 anos, um responsável também pode fazer esses pedidos.
            </p>
          </Section>

          <Section title="Links para outros sites">
            <p>
              A Biblioteca e as Oportunidades levam para sites de outras organizações. Eles têm suas
              próprias regras de privacidade, que valem quando você os visita.
            </p>
          </Section>

          <Section title="Mudanças nesta política">
            <p>
              Se esta política mudar, a data de atualização no topo da página também muda. Mudanças
              importantes serão avisadas no site.
            </p>
          </Section>

          <p className="mt-12">
            <Link to="/sobre" className="text-solar underline underline-offset-4">
              Saiba mais sobre o VOcare
            </Link>
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
