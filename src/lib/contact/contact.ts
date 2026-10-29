export const CONTACT_EMAIL = "vocare.institucional@gmail.com";
export const INSTAGRAM_HANDLE = "vocare.hub";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

/** E-mail já com assunto e um roteiro curto, para facilitar quem nunca mandou sugestão. */
export function feedbackMailto(): string {
  const subject = "Sugestão para o VOcare";
  const body = [
    "Oi, equipe VOcare!",
    "",
    "Minha sugestão / o que achei:",
    "",
    "",
    "(Não precisa colocar seu nome completo, telefone ou escola.)",
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
