import { GENRE_LABELS, type Game } from "../types";

interface Props {
  game: Game;
  isAdmin: boolean;
  onOpen: () => void;
  onEdit: (g: Game) => void;
  onDelete: (g: Game) => void;
}

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Цвет бейджа оценки критиков, как на агрегаторах (зелёный/жёлтый/красный).
const scoreColor = (s: number | null) => {
  if (s == null) return "bg-stone-600/80";
  if (s >= 80) return "bg-emerald-600/90";
  if (s >= 60) return "bg-amber-500/90";
  return "bg-rose-600/90";
};

export function GameCard({ game, isAdmin, onOpen, onEdit, onDelete }: Props) {
  const completed = fmtDate(game.completedAt);

  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gold/15 bg-black/30 shadow-lg transition hover:border-gold/40 hover:shadow-gold/5"
    >
      {/* Обложка */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-stone-800 to-stone-900">
        {game.images[0] ? (
          <img
            src={game.images[0]}
            alt={game.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            onError={(e) => (e.currentTarget.style.opacity = "0")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl opacity-20">
            🎮
          </div>
        )}
        {game.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-stone-200 backdrop-blur">
            🖼 {game.images.length}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Оценка критиков — слева сверху */}
        {game.criticScore != null && (
          <div
            className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold text-white shadow ${scoreColor(
              game.criticScore,
            )}`}
          >
            {game.criticScore}
          </div>
        )}

        {/* Личная оценка — справа сверху */}
        {game.personalScore && (
          <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-sm font-semibold text-gold backdrop-blur">
            {game.personalScore}
          </div>
        )}
      </div>

      {/* Низ карточки */}
      <div className="space-y-1 p-4">
        <div className="font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold/70">
          {GENRE_LABELS[game.genre]}
        </div>
        <h3 className="font-display text-lg uppercase tracking-wide text-stone-100">
          {game.title}
        </h3>
        <p className="text-sm text-stone-400">
          {game.platform}
          {game.platform && completed ? "  ·  " : ""}
          {completed ? `Completed: ${completed}` : ""}
        </p>

        {isAdmin && (
          <div className="flex gap-2 pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(game);
              }}
              className="flex-1 rounded-md border border-gold/25 py-1.5 text-xs uppercase tracking-wider text-gold/90 transition hover:bg-gold/10"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(game);
              }}
              className="rounded-md border border-rose-500/30 px-3 py-1.5 text-xs uppercase tracking-wider text-rose-400 transition hover:bg-rose-500/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
