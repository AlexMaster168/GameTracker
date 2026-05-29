import { GENRE_LABELS, GENRES, type Genre } from "../types";

interface Props {
  activeGenre: Genre | "all";
  onGenre: (g: Genre | "all") => void;
  search: string;
  onSearch: (s: string) => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Navbar({
  activeGenre,
  onGenre,
  search,
  onSearch,
  isAdmin,
  onLoginClick,
  onLogout,
}: Props) {
  return (
    <header className="px-6 pt-6">
      <div className="relative flex items-center justify-center">
        <h1
          className="title-gold cursor-pointer text-2xl font-semibold uppercase sm:text-3xl"
          onClick={() => onGenre("all")}
        >
          Games by AlexMaster
        </h1>
        <button
          onClick={isAdmin ? onLogout : onLoginClick}
          title={isAdmin ? "Выйти" : "Войти"}
          className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:bg-gold/10"
        >
          {isAdmin ? "⎋" : "ⓘ"}
        </button>
      </div>

      {/* Навигация по жанрам */}
      <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
        {(["all", ...GENRES] as Array<Genre | "all">).map((g) => {
          const label = g === "all" ? "All" : GENRE_LABELS[g];
          const active = activeGenre === g;
          return (
            <button
              key={g}
              onClick={() => onGenre(g)}
              className={`font-display text-sm uppercase tracking-widest transition ${
                active
                  ? "text-gold-bright underline decoration-gold/60 underline-offset-8"
                  : "text-stone-300/70 hover:text-gold"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Поиск */}
      <div className="mx-auto mt-5 max-w-md">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Alex's completed games..."
          className="w-full rounded-full border border-gold/20 bg-black/30 px-5 py-2 text-center text-sm tracking-wide text-stone-200 placeholder-stone-400/60 outline-none backdrop-blur transition focus:border-gold/50"
        />
      </div>

      <div className="gold-divider mt-6" />
    </header>
  );
}
