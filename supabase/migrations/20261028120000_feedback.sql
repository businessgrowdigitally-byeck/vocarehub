-- Feedback anônimo dos estudantes. Sem dados pessoais: nem nome, nem e-mail, nem IP.
-- Só o servidor do site (service_role) lê e escreve; nenhuma política para anon/authenticated.
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL CHECK (kind IN ('sugestao', 'problema', 'elogio')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 3 AND 1000),
  rating smallint CHECK (rating BETWEEN 1 AND 5),
  page text CHECK (char_length(page) <= 200),
  read_at timestamptz
);

REVOKE ALL ON public.feedback FROM anon, authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE INDEX feedback_created_at_idx ON public.feedback (created_at DESC);
