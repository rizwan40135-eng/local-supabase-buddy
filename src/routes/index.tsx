import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Notes Demo" },
      { name: "description", content: "Simple notes app backed by a database." },
      { property: "og:title", content: "Notes Demo" },
      { property: "og:description", content: "Simple notes app backed by a database." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Note = { id: string; title: string; created_at: string };

function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setNotes(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabase.from("notes").insert({ title: title.trim() });
    if (error) return setError(error.message);
    setTitle("");
    load();
  };

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Notes</h1>
      <form onSubmit={add} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New note"
          maxLength={200}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2"
        />
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Add</button>
      </form>
      {error && <p className="mb-4 text-destructive">{error}</p>}
      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="rounded-md border border-border p-3 text-foreground">
            {n.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
