import { useState } from "react";
import type { Suggestion } from "../types";

interface Props {
  suggestions: Suggestion[];
  isAdmin: boolean;
  onVote: (id: number) => void;
  onAdd: (title: string) => Promise<void>;
  onDelete: (id: number) => void;
}

export function VoteSuggestions({
  suggestions,
  isAdmin,
  onVote,
  onAdd,
  onDelete,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const submit = async () => {
    if (!title.trim()) return;
    await onAdd(title.trim());
    setTitle("");
    setAdding(false);
  };

  return (
    <section>
      <div className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold/60">
        Vote for next game
      </div>
      <h2 className="font-display mt-1 text-2xl uppercase tracking-wide text-stone-100">
        Top games to suggest
      </h2>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="group flex items-center gap-2 rounded-md border border-gold/15 bg-black/30 py-1.5 pl-3 pr-2 text-sm text-stone-300 transition hover:border-gold/40"
          >
            <span>{s.title}</span>
            <button
              onClick={() => onVote(s.id)}
              title="Проголосовать"
              className="flex items-center gap-1 rounded px-1 text-gold/80 transition hover:text-gold-bright"
            >
              <span className="text-xs">▲</span>
              <span className="tabular-nums">{s.votes}</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(s.id)}
                title="Удалить"
                className="text-stone-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-400"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {adding ? (
          <div className="flex items-center gap-1 rounded-md border border-gold/30 bg-black/40 py-1 pl-2 pr-1">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="Название игры…"
              className="w-44 bg-transparent px-1 text-sm text-stone-200 outline-none placeholder-stone-500"
            />
            <button
              onClick={submit}
              className="rounded bg-gold/20 px-2 py-0.5 text-sm text-gold-bright"
            >
              ✓
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded-md border border-dashed border-gold/25 px-3 py-1.5 text-sm text-gold/70 transition hover:border-gold/50 hover:text-gold"
          >
            + Suggest
          </button>
        )}
      </div>
    </section>
  );
}
