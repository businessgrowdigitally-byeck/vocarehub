# VOcare Journey Builder

Você é um desenvolvedor front-end e designer de produto especializado em sites institucionais/editoriais modernos. Construa o site do VOcare seguindo rigorosamente o sistema de marca abaixo — ele já está definido e aprovado, não deve ser reinventado.

Sobre o produto

VOcare é um portal gratuito de orientação vocacional para jovens de 15 a 18 anos. Tagline oficial: "O chamado para o que vem depois." O site tem três fases centrais — Ser, Pensar, Fazer — que formam um arco de descoberta, além de uma Biblioteca de recursos e uma seção de Oportunidades. No final do arco, o site convida o jovem a continuar no Altus, o app irmão de execução e constância.

Sistema de marca (seguir exatamente)

Paleta de cores

NomeHexUsoDeep Amazon#071F1ACor principal, fundos escurosElectric Cian#00C2C7Destaques digitais, cor da fase PensarSolar#FFC83DEnergia/descoberta, cor da fase Fazer, cor do símboloTerra#C6664AHumanidade/Brasil, uso pontualOff-white#F4F1E8Fundos clarosBlack#0B0B0BTextos, alto contraste

Tipografia

Space Grotesk — títulos e destaques (bold, uso em headlines grandes)

DM Sans — textos corridos e apoio

IBM Plex Mono — metadados, numeração (ex: "01", "02", "03"), datas

Logotipo

Símbolo: duas formas triangulares (verde escuro + amarelo Solar) formando um "V" — remete a montanha/vocação/direção. Espaço negativo do símbolo é intencional: representa o futuro em aberto.

Wordmark: "VOcare" — "VO" em caixa alta, "care" em minúsculo, mesma fonte (Space Grotesk bold).

Variações necessárias: assinatura principal (símbolo + wordmark horizontal), ícone isolado (para favicon/app icon), versão preto e branco.

Linguagem de ícones (line icons, minimalistas, 1.5px stroke)

Ser → círculo com ponto central (autoconhecimento)

Pensar → losango (possibilidades)

Fazer → seta (primeiros passos)

Oportunidades → estrela/sparkle (conexões)

Conhecimento → cruz/plus (recursos)

Caminhos → duas barras diagonais (exploração)

Linguagem visual

Composições assimétricas com recortes triangulares/diagonais sobrepostos às fotos (o triângulo amarelo Solar cortando a imagem é uma assinatura visual recorrente).

Fotografia: jovens reais (não modelos genéricos), em poses de olhar para frente/para cima, luz cinematográfica quente, ambientes urbanos ou naturais brasileiros.

Fundo escuro (Deep Amazon/Black) predominante nas seções de abertura e institucionais; fundos coloridos sólidos (verde/ciano/amarelo) identificam cada fase do arco.

Arquitetura do site

/ (Início)
├── /ser        (Fase 01 — fundo Deep Amazon)
├── /pensar     (Fase 02 — fundo Electric Cian)
├── /fazer      (Fase 03 — fundo Solar)
├── /biblioteca (Explorar por tema)
├── /oportunidades
└── seção final → CTA para o Altus

Especificação seção a seção

1. Início (Hero)

Fundo escuro (Deep Amazon/Black), composição com foto de jovem olhando para cima + recorte triangular amarelo, no estilo do brandbook.

Headline em Space Grotesk grande: "O chamado para o que vem depois."

Wordmark VOcare em destaque.

Navegação simples: SER / PENSAR / FAZER (texto uppercase, espaçado, estilo do brandbook).

CTA principal: "Comece por você →" (botão Solar #FFC83D, texto escuro).

2. Cards de transição do arco (antes de entrar em cada fase) Três blocos numerados, um por fase, cada um herdando a cor da fase:

#FaseCor de fundoTítuloPerguntas-guia01SERDeep Amazon #071F1A"OLHE PARA DENTRO"Quem sou? O que gosto? O que valorizo?02PENSARElectric Cian #00C2C7"OLHE AO REDOR"Quais possibilidades existem? Que tipo de vida quero construir? O que preciso aprender?03FAZERSolar #FFC83D"OLHE PARA FRENTE"Qual é o primeiro passo? Onde posso experimentar? Onde começo?

Cada card leva para a página da respectiva fase.

3. Página de cada fase (Ser / Pensar / Fazer)

Topo: cabeçalho com a cor e numeração da fase (mesmo padrão dos cards acima), reforçando onde o usuário está no arco.

Abaixo do cabeçalho, embutir o conteúdo real da fase vindo do Notion, dentro de um container com moldura da marca (borda ou padding na cor da fase, cantos levemente arredondados, fundo off-white por trás do iframe para não conflitar com o fundo escuro do site) — isso evita que o branco padrão do Notion "quebre" o visual:

html

<!-- SER -->
<iframe src="https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf806a8d2cf87e44989504" width="100%" height="600" frameborder="0" allowfullscreen />

<!-- PENSAR -->
<iframe src="https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf800f9b61e867c11804e1" width="100%" height="600" frameborder="0" allowfullscreen />

<!-- FAZER -->
<iframe src="https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf80a49007fe456a6ee79c" width="100%" height="600" frameborder="0" allowfullscreen />

Rodapé de cada página: botão "Próxima etapa →" navegando para a próxima fase (Ser→Pensar→Fazer), e na página Fazer, um bloco final de transição pro Altus (ver seção 5).

4. Biblioteca (Explorar por tema)

Seção com o ícone de "Conhecimento" (cruz) e headline "Explore por tema".

Lista de temas com ícones, espelhando exatamente os temas usados na Biblioteca do Notion: Profissões, Cursos gratuitos, Oportunidades, Dinheiro & trabalho, Conhecimento.

Embutir a view filtrável da Biblioteca:

html

<iframe src="https://thinkable-whip-d06.notion.site/ebd//d0ed8a7ee2814bd1b55d8b0b931c5a86?v=6133f4685318408d91c56eca78ac86c1" width="100%" height="600" frameborder="0" allowfullscreen />

5. Oportunidades

Ícone de "Oportunidades" (estrela). Headline curta como "O que está aberto agora."

Embutir:

html

<iframe src="https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf80f28357c851eaa3d4bc" width="100%" height="600" frameborder="0" allowfullscreen />

6. Bloco final — "VOcare × Altus" Reproduzir o painel de transição de marca do brandbook: duas colunas lado a lado.

VOcareAltusDISCOVER — Possibilidades.BECOME — Consistência."Quem sou eu?" / "O que é possível?" / "O que eu quero fazer?""Vamos construir."

Legenda abaixo: "Duas marcas. Um mesmo propósito: mais jovens no controle do seu futuro." Botão final: "Continuar no Altus →" linkando para https://altus-life-os.vercel.app/en.

Requisitos técnicos

Todos os iframes devem ser responsivos (usar width: 100% com altura mínima de 500-600px, e permitir scroll interno do próprio Notion — não cortar o conteúdo).

Em mobile, os iframes devem manter usabilidade (o conteúdo do Notion já é responsivo por padrão, mas teste o comportamento de scroll dentro do container).

Adicionar um loading state (skeleton ou spinner na cor da fase) enquanto o iframe carrega, já que páginas do Notion podem demorar 1-2s pra renderizar.

Não duplicar textualmente o conteúdo do Notion na página do Lovable — o Lovable é a moldura, o Notion é o conteúdo.

Manter as URLs do Notion exatamente como fornecidas; se a página do Notion for renomeada ou movida, o embed quebra.

Navegação mobile (prioridade alta — a maioria do público acessa pelo celular)

O público-alvo (15-18 anos) navega quase exclusivamente pelo smartphone. O site deve ser desenhado mobile-first, não como uma versão desktop encolhida.

Home mobile — seguir esta referência exata (anexar a imagem de referência junto com este prompt no Lovable):

A tela inicial no mobile é dividida em duas zonas:

Zona superior (~55-60% da tela), foto de hero em tela cheia com overlay em gradiente escuro (Deep Amazon → transparente, de baixo para cima), garantindo contraste pro texto e pro header.

Header sobreposto à foto: logotipo (símbolo V + wordmark "VOcare") no canto superior esquerdo, em branco; ícone de menu hambúrguer (3 linhas) no canto superior direito, também em branco.

Ao tocar no hambúrguer, abre um menu drawer (painel lateral ou modal) com os links: Início, Ser, Pensar, Fazer, Biblioteca, Oportunidades.

Na parte inferior dessa zona, sobre o gradiente: headline em Space Grotesk bold, branco, alinhado à esquerda — "Existe mais de um caminho."; abaixo, um parágrafo curto em DM Sans, cor clara (cinza-claro/branco 80% opacidade), 2 linhas; abaixo, botão CTA em formato pílula, fundo Solar #FFC83D, texto escuro, alinhado à esquerda — "Comece por você →".

Zona inferior, cartão sólido off-white (#F4F1E8) com cantos superiores arredondados, sobrepondo levemente a foto de hero (efeito "sheet"/bottom-sheet subindo por cima da imagem).

Título do cartão em Space Grotesk, cor escura: "Explore por tema".

Lista vertical de itens, cada um com: ícone de linha simples à esquerda (usar os ícones do sistema de marca) + label em DM Sans à direita, espaçamento generoso entre linhas, área de toque de linha inteira (não só o texto):

Profissões

Cursos gratuitos

Oportunidades

Dinheiro & trabalho

Conhecimento

Cada item da lista deve levar para a seção correspondente: "Oportunidades" → página /oportunidades; os demais quatro itens (Profissões, Cursos gratuitos, Dinheiro & trabalho, Conhecimento) → todos levam para a mesma página /biblioteca, que já mostra o conteúdo agrupado por tema (a pessoa rola até a coluna que interessa). Ainda não existem views filtradas individuais publicadas por tema — se no futuro isso for criado, cada item passa a linkar direto pro filtro específico.

Demais páginas (Ser, Pensar, Fazer) no mobile:

Manter o mesmo header (logo + hambúrguer) fixo no topo, sem bottom nav — consistência com a home.

Indicador de progresso do arco logo abaixo do header (ex: "01 → 02 → 03" ou 3 pontinhos), pra o jovem sempre saber em que etapa está.

CTA "Próxima etapa →" fixo/sticky na parte inferior da tela, sempre alcançável sem precisar rolar até o fim do conteúdo.

Cuidado com scroll duplo nos iframes: um iframe de altura fixa (600px) dentro de uma página que também rola pode confundir o dedo no mobile (fica ambíguo se está rolando a página ou o conteúdo do Notion). Duas soluções:

Em telas mobile, aumentar a altura do iframe para algo próximo de 80vh.

Adicionar um botão discreto "Abrir em tela cheia ↗" acima de cada iframe, levando direto pra URL do Notion publicada.

Áreas de toque de no mínimo 44x44px em todos os botões e itens de navegação.

Cards do arco (01/02/03), quando aparecerem juntos (ex: na home ou em uma página de overview), ficam empilhados verticalmente no mobile, sem carrossel horizontal.

Tom de voz no copy próprio do Lovable (fora dos embeds)

Direto, convidativo, nunca impositivo. Frases curtas, no estilo dos exemplos do brandbook: "Existe mais de um caminho.", "Você tem mais possibilidades do que imagina.", "O futuro não é uma resposta. É uma possibilidade."" no final, adicione bem pequeno, feito por BGD Systems com link para <https://www.bgdsystems.com.br/>

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vocarehub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5948a753-1fe2-43a8-922f-833b79681667).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
