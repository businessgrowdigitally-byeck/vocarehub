export type GuidePhase = "Início" | "SER" | "PENSAR" | "FAZER" | "Passaporte";

export type GuideStep = {
  phase: GuidePhase;
  title: string;
  /** Texto do passo; {1}, {2} viram os mesmos números destacados na imagem. */
  text: string;
  image: string;
  alt: string;
};

export const GUIDE_STEPS: readonly GuideStep[] = [
  {
    phase: "Início",
    title: "Comece por você",
    text: "Na página inicial, toque em Comece por você {1}. Não precisa criar conta nem fazer cadastro.",
    image: "/guia/01-inicio.jpg",
    alt: "Página inicial do VOcare com o botão Comece por você destacado.",
  },
  {
    phase: "SER",
    title: "Responda as 30 perguntas",
    text: "Para cada atividade, toque no quanto ela chama sua atenção {1}, de Nada a Muito. Não tem resposta certa e não precisa saber fazer. São 5 partes de 6 perguntas: toque em Continuar no fim de cada parte.",
    image: "/guia/02-ser-perguntas.jpg",
    alt: "Tela do SER com a primeira pergunta respondida como Bastante.",
  },
  {
    phase: "SER",
    title: "Escolha forças, valores e preferências",
    text: "Toque nas opções que têm a ver com você {1}. O contador em cima mostra quantas escolher em cada etapa.",
    image: "/guia/03-ser-escolhas.jpg",
    alt: "Tela do SER com duas forças selecionadas: Resolver problemas e Manter o foco.",
  },
  {
    phase: "SER",
    title: "Veja o seu Mapa",
    text: "No fim do SER aparece o seu Mapa, com os temas que mais chamaram sua atenção {1}. Ele não define quem você é: é um retrato de agora e pode mudar.",
    image: "/guia/04-ser-mapa.jpg",
    alt: "Mapa do SER mostrando o tema Investigar em destaque.",
  },
  {
    phase: "PENSAR",
    title: "Explore e salve caminhos",
    text: "O PENSAR mostra caminhos parecidos com os seus interesses, e cada um diz por que aparece {1}. Toque em Salvar {2} nos que despertarem curiosidade — salve pelo menos 3. Você também pode abrir todas as áreas e salvar qualquer caminho.",
    image: "/guia/05-pensar-sugestoes.jpg",
    alt: "Sugestão Dados com a explicação Combina com seu interesse em Investigar e Organizar e o botão Salvar destacados.",
  },
  {
    phase: "PENSAR",
    title: "Escolha 3 caminhos",
    text: "Entre os caminhos salvos, toque nos 3 que você quer investigar melhor {1}. Depois compare os três e toque em Experimentar um caminho.",
    image: "/guia/06-pensar-escolher.jpg",
    alt: "Tela Escolha 3 caminhos com Dados, Cibersegurança e Química selecionados.",
  },
  {
    phase: "FAZER",
    title: "Escolha uma missão",
    text: "Escolha um dos seus caminhos e uma ação pequena para experimentar na prática {1}: um mini-projeto, uma conversa com alguém da área, uma aula introdutória…",
    image: "/guia/07-fazer-missao.jpg",
    alt: "Tela Escolha uma missão com Faça um mini-projeto selecionado.",
  },
  {
    phase: "FAZER",
    title: "Marque um prazo",
    text: "Escolha quando vai fazer a missão — os atalhos ajudam {1} — e toque em Concluir meu plano {2}. Uma meta com data é mais fácil de cumprir.",
    image: "/guia/08-fazer-prazo.jpg",
    alt: "Tela Quando você vai começar com o atalho Em 2 semanas e o botão Concluir meu plano destacados.",
  },
  {
    phase: "Passaporte",
    title: "Baixe o seu Passaporte",
    text: "O Passaporte reúne toda a sua jornada. Escreva seu nome se quiser {1} e toque em Baixar passaporte {2} para guardar o PDF no celular.",
    image: "/guia/09-passaporte.jpg",
    alt: "Passaporte com o campo de nome e o botão Baixar passaporte destacados.",
  },
];
