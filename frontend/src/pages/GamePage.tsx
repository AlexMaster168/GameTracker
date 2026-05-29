import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GameFormModal } from "../components/GameFormModal";
import { Modal } from "../components/Modal";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { GENRE_LABELS, type Game, type GameInput } from "../types";

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const scoreColor = (s: number | null) => {
  if (s == null) return "bg-stone-600";
  if (s >= 80) return "bg-emerald-600";
  if (s >= 60) return "bg-amber-500";
  return "bg-rose-600";
};

export function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = !!user;

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  // Индекс выбранной картинки для большого превью.
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    api
      .gameById(Number(id))
      .then(setGame)
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (input: GameInput) => {
    if (!game) return;
    const updated = await api.updateGame(game.id, input);
    setGame(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!game || !confirm(`Delete "${game.title}"?`)) return;
    await api.deleteGame(game.id);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center text-gold/60">
        Loading…
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="app-bg flex min-h-screen flex-col items-center justify-center gap-4 text-stone-400">
        <p>{error ?? "Игра не найдена"}</p>
        <button
          onClick={() => navigate("/")}
          className="font-display text-sm uppercase tracking-widest text-gold hover:text-gold-bright"
        >
          ← Back to catalog
        </button>
      </div>
    );
  }

  const completed = fmtDate(game.completedAt);
  const hero = game.images[activeImg] ?? game.images[0];

  return (
    <div className="app-bg min-h-screen pb-20">
      {/* Большая обложка-герой */}
      <div className="relative h-[42vh] min-h-72 w-full overflow-hidden">
        {hero ? (
          <img src={hero} alt={game.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-900 text-7xl opacity-20">
            🎮
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b11] via-[#070b11]/40 to-transparent" />

        <button
          onClick={() => navigate("/")}
          className="font-display absolute left-6 top-6 rounded-md border border-gold/30 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-widest text-gold backdrop-blur transition hover:bg-gold/10"
        >
          ← Back
        </button>
      </div>

      <main className="mx-auto -mt-24 max-w-4xl px-6">
        <div className="font-display text-xs uppercase tracking-[0.25em] text-gold/70">
          {GENRE_LABELS[game.genre]}
        </div>
        <h1 className="title-gold mt-2 text-4xl font-semibold uppercase sm:text-5xl">
          {game.title}
        </h1>

        {/* Оценки */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {game.criticScore != null && (
            <div className="flex items-center gap-2">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-md text-lg font-bold text-white ${scoreColor(
                  game.criticScore,
                )}`}
              >
                {game.criticScore}
              </span>
              <span className="text-sm text-stone-400">Critic score</span>
            </div>
          )}
          {game.personalScore && (
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-black/50 px-3 py-2 text-lg font-semibold text-gold">
                {game.personalScore}
              </span>
              <span className="text-sm text-stone-400">Personal</span>
            </div>
          )}
        </div>

        {/* Детали */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gold/15 bg-gold/10 sm:grid-cols-3">
          <Detail label="Platform" value={game.platform || "—"} />
          <Detail label="Genre" value={GENRE_LABELS[game.genre]} />
          <Detail label="Completed" value={completed ?? "Not completed"} />
        </div>

        {/* Описание / обзор */}
        {game.description && (
          <section className="mt-10">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-gold/60">
              About
            </h2>
            <p className="mt-3 whitespace-pre-line text-lg leading-relaxed text-stone-300">
              {game.description}
            </p>
          </section>
        )}

        {/* Галерея */}
        {game.images.length > 1 && (
          <section className="mt-10">
            <h2 className="font-display text-xs uppercase tracking-[0.25em] text-gold/60">
              Gallery
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {game.images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveImg(i)}
                  className={`h-24 w-36 overflow-hidden rounded-lg border transition ${
                    i === activeImg
                      ? "border-gold ring-1 ring-gold/50"
                      : "border-gold/15 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>
        )}

        {isAdmin && (
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="font-display rounded-md border border-gold/30 px-5 py-2 text-sm uppercase tracking-wider text-gold transition hover:bg-gold/10"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="font-display rounded-md border border-rose-500/30 px-5 py-2 text-sm uppercase tracking-wider text-rose-400 transition hover:bg-rose-500/10"
            >
              Delete
            </button>
          </div>
        )}
      </main>

      {editing && (
        <Modal title="Edit game" onClose={() => setEditing(false)}>
          <GameFormModal
            initial={game}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0a1016] p-4">
      <div className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-gold/60">
        {label}
      </div>
      <div className="mt-1 text-stone-200">{value}</div>
    </div>
  );
}
