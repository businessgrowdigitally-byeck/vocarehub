export const CONTACT_EMAIL = "vocare.institucional@gmail.com";
export const INSTAGRAM_HANDLE = "vocare.hub";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

function mailto(subject: string, body: string[]): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join("\n"))}`;
}

/** E-mail já com assunto e um roteiro curto, para facilitar quem nunca mandou sugestão. */
export function feedbackMailto(): string {
  return mailto("Sugestão para o VOcare", [
    "Oi, equipe VOcare!",
    "",
    "Minha sugestão / o que achei:",
    "",
    "",
    "(Não precisa colocar seu nome completo, telefone ou escola.)",
  ]);
}

/** Contato de escolas e educadores: o roteiro pede o que precisamos para responder. */
export function partnershipMailto(): string {
  return mailto("Parceria VOcare — escola", [
    "Olá, equipe VOcare!",
    "",
    "Quero conversar sobre levar o VOcare para a minha escola.",
    "",
    "Escola:",
    "Cidade/UF:",
    "Meu nome e função:",
    "Turmas/séries e número aproximado de estudantes:",
    "Como pensamos usar o VOcare:",
    "",
  ]);
}
