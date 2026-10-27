# VOcare

Portal gratuito de exploração vocacional para jovens brasileiros de 15 a 18 anos. Ajuda a
explorar possibilidades — não diz qual profissão escolher, não diagnostica e não promete
sucesso. Linguagem direta, convidativa, sem pressão. Mobile primeiro.

Jornada: **SER** (interesses, forças, valores, preferências) → **PENSAR** (caminhos e áreas)
→ **FAZER** (um primeiro passo prático) → **Passaporte** (`/resumo`).

## Stack

TanStack Start + React 19, Tailwind 4, Vite. Projeto conectado ao Lovable (veja `AGENTS.md`:
não reescreva histórico publicado). Deploy na Vercel a partir de `main`. Sem login e sem
banco de dados no MVP: a jornada fica no `localStorage` (`src/lib/journey/`, chave
`vocare:journey:v2`). Não adicione autenticação, Supabase ou backend sem pedido explícito.

## Onde fica o quê

- `src/features/{ser,pensar,fazer,journey-summary}` — telas e lógica de cada fase.
- `src/lib/exploration/` — questionário RIASEC, perfil, ranking e perfis profissionais.
  Regras e fórmulas em `docs/exploration-engine.md`; leia antes de mexer no matching.
- `CAREER_PATHS` / `CAREER_AREAS` (`src/features/pensar/`) — catálogo de apresentação (30
  caminhos, 8 áreas).

## Invariantes do matching

- Só as respostas de interesse definem as sugestões; forças e valores não entram.
- Toda sugestão vem de um perfil O\*NET com fonte. Sem candidatos válidos → lista vazia e
  mensagem explicando; nunca um ranking alternativo.
- `digital-product`, `entrepreneurship` e `international-relations` nunca são recomendados.
- Não altere fórmulas, limiares ou pontuações para "melhorar" resultados.

## Analytics

Google Analytics 4 (`src/lib/analytics/analytics.ts`), só depois do consentimento no banner e
só se `VITE_ENABLE_ANALYTICS=true` estiver definido no build (Vercel → Environment
Variables). Eventos de funil, sem parâmetros nem dados pessoais: `ser_started`,
`ser_completed`, `pensar_completed`, `fazer_completed` (em `src/lib/journey/events.ts`, a
partir das mudanças de status) e `passport_downloaded`. Nunca envie respostas, caminhos ou o
nome do certificado — o público é menor de idade.

## Privacidade e compartilhamento

- `/privacidade` descreve exatamente o que o código coleta; ao mudar analytics ou dados,
  atualize a página e a data. Contato: vocare.institucional@gmail.com (BGD Systems).
- Imagem de compartilhamento: `public/og-image.png` (1200×630). A URL absoluta usa
  `SITE_URL` em `src/routes/__root.tsx` — troque ao adotar domínio próprio.

## Comandos

```
npm test            # node --test (arquivos *.test.ts)
npm run typecheck
npm run lint        # 6 avisos antigos em src/components/ui são conhecidos
npm run build
npx prettier --check .
```

A CI (`.github/workflows/lockfile-registry.yml`) bloqueia URLs de registro privado no
`bun.lock`.

## Pendências

- Adicionar referências CBO ao mapeamento de perfis.
- Validar os 30 itens do questionário com estudantes reais.
