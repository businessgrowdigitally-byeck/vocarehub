# Motor de exploração (SER → PENSAR)

Código em `src/lib/exploration/`. Testes em `*.test.ts` na mesma pasta e em
`src/features/pensar/pensar.test.ts`.

## Fluxo

1. **SER – questionário** (`interest-items.ts`): 30 itens originais, 5 por dimensão RIASEC,
   escala 1–5 ("Nada" a "Muito"). Pergunta o quanto a atividade atrai, não se a pessoa sabe
   fazê-la. Respostas ficam em `ser.interestResponses` (id do item → 1–5).
2. **Perfil** (`scoring.ts`): por dimensão, `(média - 1) / 4` → 0–1. Só existe com as 30
   respostas; perfil parcial não é calculado.
3. **Candidatos** (`career-profiles.ts`): `getSourcedCareerCandidates()` devolve apenas perfis
   ocupacionais, com confiança `high`/`medium`, código O\*NET, valores 0–1, caminho existente em
   `CAREER_PATHS` e fora da lista de pendentes.
4. **Ranking** (`matching.ts`): similaridade `clamp01(1 - Σ|diff| / 6)`; elegível se
   `score ≥ max(topo - 0,15, 0,55)`; até 6 sugestões, 4 áreas, 2 por área; empate pelo id.
5. **PENSAR** (`pensar-logic.ts` → `getRecommendationResult`): devolve os caminhos e um
   `status` (`ok`, `incomplete-profile`, `no-sourced-profiles`, `no-matches`). Não existe
   ranking alternativo: sem candidatos válidos, a lista fica vazia e a tela explica o motivo.

## Regras que não podem ser quebradas

- Só os interesses definem a similaridade. Forças, valores e preferências do SER são
  reflexão complementar e não entram no cálculo.
- Toda recomendação vem de um perfil com fonte. Nada de pontuação inventada.
- `digital-product`, `entrepreneurship` e `international-relations` são pendentes: nunca
  recebem perfil nem são recomendados.
- Fórmulas e limiares acima só mudam com justificativa documentada. Os limiares de
  classificação (`classification.ts`: plano ≤ 0,12; duplo ≤ 0,10; dominante ≥ 0,67 com
  diferença ≥ 0,15; senão distribuído) são provisórios, escolhas de produto, não padrões
  validados.
- O resultado nunca é apresentado como diagnóstico, percentual de compatibilidade ou
  previsão de sucesso. Confiança do mapeamento não é compatibilidade.

## Perfis profissionais (O\*NET)

- Mapeamento em `career-profile-mapping.ts`: 27 caminhos → códigos O\*NET-SOC (taxonomia
  2019), com confiança e observações. É uma adaptação de ocupações dos EUA para caminhos
  brasileiros, não uma validação para adolescentes brasileiros.
- Pontuações em `career-profiles.generated.ts`, gerado a partir do `Interests.txt` oficial
  (escala OI, 1–7): `(bruto - 1) / 6`, média aritmética entre as ocupações do caminho,
  arredondamento a 4 casas no final. O arquivo registra banco, nome e SHA-256 da fonte.
- **Estado atual: ainda não importado.** O ambiente onde o motor foi reconstruído não tinha
  acesso ao site do O\*NET. Enquanto o arquivo gerado estiver vazio, o PENSAR não faz
  sugestões e mostra o catálogo completo.

### Como importar

1. Baixe o banco O\*NET em formato texto em https://www.onetcenter.org/database.html e
   extraia `Interests.txt`.
2. `node scripts/import-onet-interests.ts caminho/para/Interests.txt "O*NET 30.0"` (use a
   versão baixada). O script falha se algum código mapeado não existir no arquivo.
3. `npx prettier --write src/lib/exploration/career-profiles.generated.ts` e `npm test`.

### Licença

Dados do O\*NET: U.S. Department of Labor, Employment and Training Administration
(USDOL/ETA), licença CC BY 4.0. A atribuição está no arquivo gerado e na tela do PENSAR
quando há sugestões. O\*NET® é marca registrada do USDOL/ETA.

## Armazenamento

Chave `vocare:journey:v2`. Na primeira carga sem v2, os dados de `vocare:journey:v1` são
aproveitados (forças, valores, preferências, PENSAR, FAZER); as etiquetas antigas de
interesse não viram respostas, então o SER volta a "em andamento". A v1 não é apagada,
exceto quando o estudante reinicia a jornada.

## Limitações conhecidas

- Os 30 itens são originais e ainda não passaram por validação psicométrica.
- Referências CBO (Classificação Brasileira de Ocupações) ainda não foram adicionadas ao
  mapeamento; os títulos dos caminhos já estão em português.
