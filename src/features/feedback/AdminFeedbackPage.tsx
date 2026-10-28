import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, LogOut, Star, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FEEDBACK_KINDS,
  FEEDBACK_KIND_LABELS,
  feedbackToCsv,
  type FeedbackKind,
} from "@/lib/feedback/feedback";
import {
  adminDeleteFeedback,
  adminListFeedback,
  adminLogin,
  adminLogout,
  adminSetRead,
  type FeedbackRow,
} from "@/lib/feedback/feedback.functions";

type Filter = "todos" | "nao-lidos" | FeedbackKind;

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

function kindLabel(kind: string): string {
  return (FEEDBACK_KINDS as readonly string[]).includes(kind)
    ? FEEDBACK_KIND_LABELS[kind as FeedbackKind]
    : kind;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const login = useServerFn(adminLogin);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await login({ data: { password } });
      if (result.ok) onLogin();
      else setError(result.error);
    } catch {
      setError("Erro ao entrar. Tente de novo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-sm space-y-4">
      <h1 className="font-display text-3xl font-bold">Admin · Feedback</h1>
      <label htmlFor="admin-password" className="block text-sm text-offwhite/75">
        Senha
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full rounded-xl border border-offwhite/25 bg-amazon/40 px-4 py-3 text-offwhite outline-none focus:border-solar"
      />
      {error && (
        <p className="text-sm text-terra" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || !password}
        className="tap rounded-full bg-solar px-6 py-3 font-display font-bold text-ink disabled:opacity-60"
      >
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export function AdminFeedbackPage() {
  const list = useServerFn(adminListFeedback);
  const logout = useServerFn(adminLogout);
  const setRead = useServerFn(adminSetRead);
  const remove = useServerFn(adminDeleteFeedback);

  const [state, setState] = useState<"loading" | "login" | "ready" | "error">("loading");
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [filter, setFilter] = useState<Filter>("nao-lidos");

  const load = useCallback(async () => {
    try {
      const result = await list();
      if (!result.authorized) return setState("login");
      setRows(result.rows);
      setState("ready");
    } catch {
      setState("error");
    }
  }, [list]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () =>
      rows.filter((row) =>
        filter === "todos" ? true : filter === "nao-lidos" ? !row.read_at : row.kind === filter,
      ),
    [rows, filter],
  );

  const stats = useMemo(() => {
    const rated = rows.filter((row) => row.rating !== null);
    const average = rated.length
      ? rated.reduce((sum, row) => sum + (row.rating ?? 0), 0) / rated.length
      : null;
    return { total: rows.length, unread: rows.filter((row) => !row.read_at).length, average };
  }, [rows]);

  const toggleRead = async (row: FeedbackRow) => {
    const read = !row.read_at;
    await setRead({ data: { id: row.id, read } });
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, read_at: read ? new Date().toISOString() : null } : item,
      ),
    );
  };

  const deleteRow = async (row: FeedbackRow) => {
    if (!window.confirm("Apagar esta mensagem para sempre?")) return;
    await remove({ data: { id: row.id } });
    setRows((current) => current.filter((item) => item.id !== row.id));
  };

  const exportCsv = () => {
    const blob = new Blob(["﻿" + feedbackToCsv(visible)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vocare-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await logout();
    setRows([]);
    setState("login");
  };

  return (
    <div className="min-h-screen bg-amazon px-5 pb-24 pt-10 text-offwhite">
      {state === "loading" && <p className="text-center text-offwhite/60">Carregando…</p>}
      {state === "error" && (
        <p className="mx-auto max-w-md text-center text-terra" role="alert">
          Não foi possível carregar. Confira se SUPABASE_SERVICE_ROLE_KEY está configurada na Vercel
          e se a tabela feedback foi criada.
        </p>
      )}
      {state === "login" && <LoginForm onLogin={() => void load()} />}
      {state === "ready" && (
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-bold">Feedback</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportCsv}
                className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-4 py-2 text-sm hover:bg-offwhite/10"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Exportar CSV
              </button>
              <button
                type="button"
                onClick={signOut}
                className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-4 py-2 text-sm hover:bg-offwhite/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" /> Sair
              </button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: String(stats.total) },
              { label: "Não lidos", value: String(stats.unread) },
              {
                label: "Nota média",
                value: stats.average === null ? "—" : stats.average.toFixed(1).replace(".", ","),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-offwhite/12 bg-offwhite/5 p-4"
              >
                <dt className="text-xs text-offwhite/60">{item.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar">
            {(["nao-lidos", "todos", ...FEEDBACK_KINDS] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={cn(
                  "tap rounded-full border px-4 py-1.5 text-sm",
                  filter === option
                    ? "border-solar bg-solar text-ink"
                    : "border-offwhite/25 text-offwhite/80 hover:bg-offwhite/10",
                )}
              >
                {option === "todos"
                  ? "Todos"
                  : option === "nao-lidos"
                    ? "Não lidos"
                    : FEEDBACK_KIND_LABELS[option]}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="mt-10 text-offwhite/60">Nenhuma mensagem aqui.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {visible.map((row) => (
                <li
                  key={row.id}
                  className={cn(
                    "rounded-2xl border p-5",
                    row.read_at
                      ? "border-offwhite/10 opacity-70"
                      : "border-offwhite/25 bg-offwhite/5",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-offwhite/60">
                    <span className="rounded-full bg-offwhite/10 px-2.5 py-0.5 font-bold text-offwhite">
                      {kindLabel(row.kind)}
                    </span>
                    <span>{dateFormat.format(new Date(row.created_at))}</span>
                    {row.page && <span>em {row.page}</span>}
                    {row.rating !== null && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-solar text-solar" aria-hidden="true" />
                        {row.rating}/5
                      </span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words">{row.message}</p>
                  <div className="mt-4 flex gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => void toggleRead(row)}
                      className="text-solar underline underline-offset-4"
                    >
                      {row.read_at ? "Marcar como não lido" : "Marcar como lido"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteRow(row)}
                      className="inline-flex items-center gap-1 text-offwhite/60 hover:text-terra"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Apagar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
