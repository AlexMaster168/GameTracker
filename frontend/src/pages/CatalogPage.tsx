import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameCard } from "../components/GameCard";
import { GameFormModal } from "../components/GameFormModal";
import { Modal } from "../components/Modal";
import { Navbar } from "../components/Navbar";
import { PriceBot } from "../components/PriceBot";
import { VoteSuggestions } from "../components/VoteSuggestions";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Game, GameInput, Genre, Suggestion } from "../types";

export function CatalogPage() {
  const { user, logout } = useAuth();
  const isAdmin = !!user;
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);

  const loadGames = useCallback(async () => {
    setError(null);
    try {
      const list = await api.games({
        genre: genre === "all" ? undefined : genre,
        search: search.trim() || undefined,
      });
      setGames(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [genre, search]);

  useEffect(() => {
    const t = setTimeout(loadGames, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadGames, search]);

  useEffect(() => {
    api.suggestions().then(setSuggestions).catch(() => {});
  }, []);

  const refreshSuggestions = () =>
    api.suggestions().then(setSuggestions).catch(() => {});

  const handleCreate = async (input: GameInput) => {
    await api.createGame(input);
    setCreating(false);
    await loadGames();
  };

  const handleUpdate = async (input: GameInput) => {
    if (!editing) return;
    await api.updateGame(editing.id, input);
    setEditing(null);
    await loadGames();
  };

  const handleDelete = async (game: Game) => {
    if (!confirm(`Delete "${game.title}"?`)) return;
    await api.deleteGame(game.id);
    await loadGames();
  };

  const handleVote = async (id: number) => {
    setSuggestions((s) =>
      s.map((x) => (x.id === id ? { ...x, votes: x.votes + 1 } : x)),
    );
    try {
      await api.vote(id);
      await refreshSuggestions();
    } catch {
      await refreshSuggestions();
    }
  };

  const handleAddSuggestion = async (title: string) => {
    await api.addSuggestion(title);
    await refreshSuggestions();
  };

  const handleDeleteSuggestion = async (id: number) => {
    await api.deleteSuggestion(id);
    await refreshSuggestions();
  };

  return (
    <div className="app-bg min-h-screen pb-20">
      <Navbar
        activeGenre={genre}
        onGenre={setGenre}
        search={search}
        onSearch={setSearch}
        isAdmin={isAdmin}
        onLoginClick={() => navigate("/login")}
        onLogout={logout}
      />

      <main className="mx-auto max-w-6xl px-6 pt-8">
        {isAdmin && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-gold/15 bg-black/20 px-4 py-2 text-sm">
            <span className="text-gold/80">Админ-режим · {user!.username}</span>
            <button
              onClick={() => setCreating(true)}
              className="font-display rounded-md bg-gradient-to-b from-[#f3d3a3] to-[#e0a866] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-900 transition hover:brightness-110"
            >
              + Add game
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-300">
            {error}{" "}
            <button onClick={loadGames} className="underline">
              Повторить
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-16 text-center text-stone-500">Loading…</p>
        ) : games.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gold/20 py-16 text-center text-stone-500">
            Ничего не найдено.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isAdmin={isAdmin}
                onOpen={() => navigate(`/game/${game.id}`)}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <VoteSuggestions
            suggestions={suggestions}
            isAdmin={isAdmin}
            onVote={handleVote}
            onAdd={handleAddSuggestion}
            onDelete={handleDeleteSuggestion}
          />
          <PriceBot />
        </div>
      </main>

      {creating && (
        <Modal title="New game" onClose={() => setCreating(false)}>
          <GameFormModal
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit game" onClose={() => setEditing(null)}>
          <GameFormModal
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
