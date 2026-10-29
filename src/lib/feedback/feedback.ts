/**
 * Feedback anônimo: o estudante escolhe um tipo, escreve uma mensagem e, se quiser, dá uma
 * nota. Nada de nome, e-mail ou IP — o público é menor de idade.
 */
export const FEEDBACK_KINDS = ["sugestao", "problema", "elogio"] as const;
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

export const FEEDBACK_KIND_LABELS: Record<FeedbackKind, string> = {
  sugestao: "Sugestão",
  problema: "Problema",
  elogio: "Elogio",
};

export const FEEDBACK_MIN_LENGTH = 3;
export const FEEDBACK_MAX_LENGTH = 1000;
export const FEEDBACK_PAGE_MAX_LENGTH = 200;
/** Envios mais rápidos que isso depois de abrir o formulário são tratados como robô. */
export const FEEDBACK_MIN_FILL_MS = 3000;
/** Limite global de envios por hora, para um ataque de spam não lotar a tabela. */
export const FEEDBACK_HOURLY_LIMIT = 200;
/** O admin carrega no máximo esta quantidade (as mais recentes) de uma vez. */
export const FEEDBACK_ADMIN_LIST_LIMIT = 1000;
/** Feedbacks mais antigos que isso são apagados (dito na página de privacidade). */
export const FEEDBACK_RETENTION_MONTHS = 12;

export type FeedbackInput = {
  kind: FeedbackKind;
  message: string;
  rating: number | null;
  page: string | null;
};

export type FeedbackSubmission = FeedbackInput & {
  /** Campo invisível: pessoas deixam vazio, robôs costumam preencher. */
  website: string;
  /** Milissegundos entre abrir o formulário e enviar. */
  elapsedMs: number;
};

export type FeedbackValidation =
  { ok: true; value: FeedbackInput; spam: boolean } | { ok: false; error: string };

function isKind(value: unknown): value is FeedbackKind {
  return typeof value === "string" && (FEEDBACK_KINDS as readonly string[]).includes(value);
}

/** Só caminhos internos (ex.: "/resumo"); qualquer outra coisa vira null. */
export function normalizePage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const page = value.trim();
  if (!/^\/(?!\/)[a-z0-9\-/]*$/i.test(page) || page.length > FEEDBACK_PAGE_MAX_LENGTH) return null;
  return page;
}

export function validateFeedback(input: unknown): FeedbackValidation {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Envio inválido." };
  const data = input as Record<string, unknown>;

  if (!isKind(data["kind"])) return { ok: false, error: "Escolha o tipo de mensagem." };

  const message = typeof data["message"] === "string" ? data["message"].trim() : "";
  if (message.length < FEEDBACK_MIN_LENGTH) {
    return { ok: false, error: "Escreva sua mensagem." };
  }
  if (message.length > FEEDBACK_MAX_LENGTH) {
    return { ok: false, error: `Use no máximo ${FEEDBACK_MAX_LENGTH} caracteres.` };
  }

  const rawRating = data["rating"];
  let rating: number | null = null;
  if (rawRating !== null && rawRating !== undefined) {
    if (typeof rawRating !== "number" || !Number.isInteger(rawRating)) {
      return { ok: false, error: "Nota inválida." };
    }
    if (rawRating < 1 || rawRating > 5) return { ok: false, error: "Nota inválida." };
    rating = rawRating;
  }

  const website = typeof data["website"] === "string" ? data["website"] : "";
  const elapsedMs = typeof data["elapsedMs"] === "number" ? data["elapsedMs"] : 0;
  const spam = website.trim() !== "" || elapsedMs < FEEDBACK_MIN_FILL_MS;

  return {
    ok: true,
    value: { kind: data["kind"], message, rating, page: normalizePage(data["page"]) },
    spam,
  };
}

/** Data limite da retenção: tudo criado antes disso deve ser apagado. */
export function retentionCutoff(now: Date, months = FEEDBACK_RETENTION_MONTHS): Date {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return cutoff;
}

/** CSV para exportar no admin (separador ";" abre direto no Excel em português). */
export function feedbackToCsv(
  rows: readonly {
    created_at: string;
    kind: string;
    rating: number | null;
    page: string | null;
    message: string;
    read_at: string | null;
  }[],
): string {
  const escape = (value: string) => {
    // Evita que o Excel interprete a célula como fórmula.
    const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const header = ["data", "tipo", "nota", "pagina", "mensagem", "lido"].join(";");
  const lines = rows.map((row) =>
    [
      row.created_at,
      isKind(row.kind) ? FEEDBACK_KIND_LABELS[row.kind] : row.kind,
      row.rating === null ? "" : String(row.rating),
      row.page ?? "",
      row.message,
      row.read_at ? "sim" : "não",
    ]
      .map(escape)
      .join(";"),
  );
  return [header, ...lines].join("\r\n");
}
