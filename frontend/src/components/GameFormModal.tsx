import { useState, type FormEvent } from "react";
import { GENRE_LABELS, GENRES, type Game, type GameInput } from "../types";
import { ImageManager } from "./ImageManager";

interface Props {
  initial?: Game;
  onSubmit: (input: GameInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-md border border-gold/20 bg-black/40 px-3 py-2 text-stone-100 placeholder-stone-500 outline-none transition focus:border-gold/50";

// Дата ISO → значение для <input type="date"> (yyyy-mm-dd).
const toDateInput = (iso: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "";

export function GameFormModal({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<GameInput>({
    title: initial?.title ?? "",
    genre: initial?.genre ?? "action",
    platform: initial?.platform ?? "",
    criticScore: initial?.criticScore ?? null,
    personalScore: initial?.personalScore ?? "",
    completedAt: initial?.completedAt
      ? new Date(initial.completedAt).getTime()
      : null,
    description: initial?.description ?? "",
    images: initial?.images ?? [],
  });
  const [dateStr, setDateStr] = useState(toDateInput(initial?.completedAt ?? null));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof GameInput>(k: K, v: GameInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Название обязательно");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        completedAt: dateStr ? new Date(dateStr).getTime() : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-stone-400">Title *</label>
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Stellar Blade"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-stone-400">Genre</label>
          <select
            className={inputClass}
            value={form.genre}
            onChange={(e) => set("genre", e.target.value as GameInput["genre"])}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {GENRE_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-400">Platform</label>
          <input
            className={inputClass}
            value={form.platform}
            onChange={(e) => set("platform", e.target.value)}
            placeholder="PS5 Pro"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-stone-400">
            Critic score (0–100)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            className={inputClass}
            value={form.criticScore ?? ""}
            onChange={(e) =>
              set(
                "criticScore",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
            placeholder="81"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-400">
            Personal score
          </label>
          <input
            className={inputClass}
            value={form.personalScore}
            onChange={(e) => set("personalScore", e.target.value)}
            placeholder="5+/5"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-400">
          Completed date
        </label>
        <input
          type="date"
          className={inputClass}
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-400">Description</label>
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Обзор игры, впечатления, заметки…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-stone-400">
          Images (gallery)
        </label>
        <ImageManager
          images={form.images}
          onChange={(imgs) => set("images", imgs)}
        />
      </div>

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-stone-300 transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="font-display rounded-md bg-gradient-to-b from-[#f3d3a3] to-[#e0a866] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-stone-900 transition hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "…" : initial ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
}
