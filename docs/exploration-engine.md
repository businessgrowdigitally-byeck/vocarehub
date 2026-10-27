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

6. **Explicação** (`explanation.ts`): cada sugestão mostra até 2 temas que estão entre os 3
   mais fortes do estudante (com pelo menos 0,5, "Mais ou menos") e entre os 3 mais fortes da
   profissão. Perfil plano não recebe explicação. Só descreve; não altera o ranking.

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
- Pontuações em `career-profiles.generated.ts`, gerado a partir do arquivo oficial
  "Career Interest Types" (escala OI, 1–7): `(bruto - 1) / 6`, média aritmética entre as
  ocupações do caminho, arredondamento a 4 casas no final. O arquivo registra banco, nome e
  SHA-256 da fonte.
- **Estado atual:** importado do O\*NET 31.0 (`career_interest_types.csv`), 27 perfis.
- `21-1029.00` (Social Workers, All Other) não tem dados de interesse no O\*NET; Serviço
  Social usa só `21-1021.00`, com confiança média.

### Como importar

1. Em https://www.onetcenter.org/database.html, seção "Excel, CSV, JSON" → "Career
   Interests" → "Career Interest Types", baixe em CSV. (Versões antigas: `Interests.txt`
   do download em texto também funciona.)
2. `node scripts/import-onet-interests.ts caminho/para/career_interest_types.csv "O*NET 31.0"`
   (use a versão baixada). O script falha se algum código mapeado não existir no arquivo.
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
- No O\*NET 31.0 os perfis de interesse vêm de "Machine Learning/Expert" (modelo revisado
  por especialistas), não de pesquisa direta com trabalhadores.
- Referências CBO (Classificação Brasileira de Ocupações) ainda não foram adicionadas ao
  mapeamento; os títulos dos caminhos já estão em português.
