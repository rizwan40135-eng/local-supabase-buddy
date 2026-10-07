CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.notes TO anon, authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read notes" ON public.notes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add notes" ON public.notes FOR INSERT TO anon, authenticated WITH CHECK (char_length(title) BETWEEN 1 AND 200);
INSERT INTO public.notes (title) VALUES ('Buy groceries'), ('Call the bank'), ('Read a book'), ('Go for a walk');