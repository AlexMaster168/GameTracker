import { useState, type FormEvent } from "react";
import { useAuth } from "../lib/auth";

interface Props {
  onClose: () => void;
}

export function Login({ onClose }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
      setBusy(false);
    }
  };

  return (
    <div className="app-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="title-gold mb-8 text-center text-2xl font-semibold uppercase sm:text-3xl">
          Games by AlexMaster
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
            className="w-full rounded-md border border-gold/20 bg-black/30 px-4 py-3 tracking-wide text-stone-100 placeholder-stone-400/60 outline-none backdrop-blur transition focus:border-gold/50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-gold/20 bg-black/30 px-4 py-3 tracking-wide text-stone-100 placeholder-stone-400/60 outline-none backdrop-blur transition focus:border-gold/50"
          />

          {error && (
            <p className="text-center text-sm text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="font-display w-full rounded-md bg-gradient-to-b from-[#f3d3a3] to-[#e0a866] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-900 transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "…" : "Login"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mx-auto mt-6 block text-xs uppercase tracking-widest text-stone-400 transition hover:text-gold"
        >
          ← Back to catalog
        </button>

        <p className="mt-6 text-center text-xs italic text-stone-500">
          demo: admin / admin
        </p>
      </div>
    </div>
  );
}
