import { createServerFn } from "@tanstack/react-start";

import {
  FEEDBACK_ADMIN_LIST_LIMIT,
  FEEDBACK_HOURLY_LIMIT,
  retentionCutoff,
  validateFeedback,
} from "./feedback";

export type FeedbackRow = {
  id: string;
  created_at: string;
  kind: string;
  message: string;
  rating: number | null;
  page: string | null;
  read_at: string | null;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

type FeedbackClient = ReturnType<typeof import("./feedback.server").createFeedbackClient>;

/** Retenção: roda a cada envio e a cada abertura do admin, sem depender só de um deles. */
async function purgeExpired(supabase: FeedbackClient): Promise<void> {
  const { error } = await supabase
    .from("feedback")
    .delete()
    .lt("created_at", retentionCutoff(new Date()).toISOString());
  if (error) console.error("[feedback] purge failed", error.message);
}

// Imports de servidor ficam dentro dos handlers: este arquivo também entra no bundle do
// navegador, e lá só sobram as chamadas RPC.

export const submitFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const result = validateFeedback(data);
    if (!result.ok) return result;
    // Robô: finge que deu certo para não ensinar como passar pelo filtro.
    if (result.spam) return { ok: true };

    const { createFeedbackClient } = await import("./feedback.server");
    const supabase = createFeedbackClient();

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .gte("created_at", hourAgo);
    if ((count ?? 0) >= FEEDBACK_HOURLY_LIMIT) {
      return { ok: false, error: "Muitas mensagens agora. Tente de novo mais tarde." };
    }

    await purgeExpired(supabase);
    const { error } = await supabase.from("feedback").insert(result.value);
    if (error) {
      console.error("[feedback] insert failed", error.message);
      return { ok: false, error: "Não conseguimos enviar agora. Tente de novo mais tarde." };
    }
    return { ok: true };
  });

async function requireAdmin(): Promise<void> {
  const { getCookie } = await import("@tanstack/react-start/server");
  const { ADMIN_COOKIE, verifyAdminToken } = await import("./admin-session");
  if (!verifyAdminToken(process.env["ADMIN_PASSWORD"], getCookie(ADMIN_COOKIE), Date.now())) {
    throw new Error("Não autorizado");
  }
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const { setCookie } = await import("@tanstack/react-start/server");
    const {
      ADMIN_COOKIE,
      ADMIN_SESSION_HOURS,
      checkAdminPassword,
      createAdminToken,
      isAdminConfigured,
    } = await import("./admin-session");
    const secret = process.env["ADMIN_PASSWORD"];
    if (!isAdminConfigured(secret)) {
      return { ok: false, error: "Admin desligado: configure ADMIN_PASSWORD (12+ caracteres)." };
    }
    const password = (data as { password?: unknown } | null)?.password;
    if (!checkAdminPassword(secret, password)) {
      // Atrasa tentativas erradas para dificultar adivinhação.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ok: false, error: "Senha incorreta." };
    }
    setCookie(ADMIN_COOKIE, createAdminToken(secret, Date.now()), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_HOURS * 60 * 60,
    });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  const { ADMIN_COOKIE } = await import("./admin-session");
  deleteCookie(ADMIN_COOKIE, { path: "/" });
  return { ok: true };
});

export const adminListFeedback = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ authorized: false } | { authorized: true; rows: FeedbackRow[] }> => {
    try {
      await requireAdmin();
    } catch {
      return { authorized: false };
    }
    const { createFeedbackClient } = await import("./feedback.server");
    const supabase = createFeedbackClient();
    await purgeExpired(supabase);
    const { data, error } = await supabase
      .from("feedback")
      .select("id, created_at, kind, message, rating, page, read_at")
      .order("created_at", { ascending: false })
      .limit(FEEDBACK_ADMIN_LIST_LIMIT);
    if (error) throw new Error(error.message);
    return { authorized: true, rows: data ?? [] };
  },
);

function readId(data: unknown): string {
  const id = (data as { id?: unknown } | null)?.id;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) throw new Error("id inválido");
  return id;
}

export const adminSetRead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const id = readId(data);
    const read = (data as { read?: unknown }).read === true;
    const { createFeedbackClient } = await import("./feedback.server");
    const { error } = await createFeedbackClient()
      .from("feedback")
      .update({ read_at: read ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    const id = readId(data);
    const { createFeedbackClient } = await import("./feedback.server");
    const { error } = await createFeedbackClient().from("feedback").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
