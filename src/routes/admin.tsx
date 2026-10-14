import { useEffect, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter } from "@/components/SiteFooter";
import { VoLogo } from "@/components/brand/VoLogo";

const title = "Registro interno | VOcare";
const description = "Área restrita do VOcare.";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AdminPage,
});

type Row = {
  id: string;
  coupon_code: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
};

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("coupon_redemptions")
      .select("id, coupon_code, referrer, user_agent, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      setDenied(true);
      setRows(null);
      return;
    }
    setDenied(false);
    setRows(data as Row[]);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSignedIn(Boolean(data.session));
      if (data.session) await load();
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
      if (session) void load();
      else setRows(null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <header className="px-5 pt-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <VoLogo className="h-7" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-offwhite/50">
            Interno
          </span>
        </div>
      </header>

      <main className="px-5 py-12">
        <div className="mx-auto max-w-4xl">
          {!ready && <p className="text-offwhite/60">Carregando…</p>}

          {ready && !signedIn && <SignIn />}

          {ready && signedIn && denied && (
            <div className="rounded-2xl border border-offwhite/15 p-6">
              <h1 className="font-display text-2xl font-bold">Sem permissão</h1>
              <p className="mt-2 text-sm text-offwhite/70">
                Esta conta não tem acesso ao registro. Entre com a conta de administrador.
              </p>
              <SignOutButton />
            </div>
          )}

          {ready && signedIn && !denied && rows && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-solar">
                    Cupom educacional
                  </p>
                  <h1 className="mt-2 font-display text-4xl font-bold leading-none">
                    {rows.length}
                  </h1>
                  <p className="mt-1 text-sm text-offwhite/70">
                    {rows.length === 1 ? "acesso liberado" : "acessos liberados"}
                  </p>
                </div>
                <SignOutButton />
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-offwhite/15">
                {rows.length === 0 && (
                  <p className="p-6 text-sm text-offwhite/60">Nenhum acesso registrado ainda.</p>
                )}
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-offwhite/10 px-5 py-4 last:border-b-0"
                  >
                    <span className="font-mono text-xs tracking-wide text-solar">
                      {r.coupon_code}
                    </span>
                    <span className="text-sm text-offwhite/70">
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => void supabase.auth.signOut()}
      className="tap rounded-full border border-offwhite/25 px-5 py-2.5 text-sm text-offwhite/80 transition-colors hover:bg-offwhite/10"
    >
      Sair
    </button>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
  };

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-offwhite/15 p-6">
      <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
      <p className="mt-2 text-sm text-offwhite/60">Entre para ver o registro de cupons.</p>

      <label className="mt-6 block">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/50">
          E-mail
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-offwhite/20 bg-offwhite/5 px-4 py-3 text-base outline-none focus:border-solar"
        />
      </label>

      <label className="mt-4 block">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/50">
          Senha
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
          autoComplete="current-password"
          className="mt-2 w-full rounded-xl border border-offwhite/20 bg-offwhite/5 px-4 py-3 text-base outline-none focus:border-solar"
        />
      </label>

      {msg && <p className="mt-3 text-sm text-terra">{msg}</p>}

      <button
        type="button"
        disabled={busy}
        onClick={() => void submit()}
        className="tap mt-5 w-full rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "…" : "Entrar"}
      </button>
    </div>
  );
}
