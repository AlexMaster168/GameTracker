import type { Game, GameInput, Genre, Suggestion, User } from "../types";

let authToken: string | null = localStorage.getItem("token");

export function setToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getToken() {
  return authToken;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    let message = `Ошибка ${res.status}`;
    try {
      const data = await res.json();
      message = data.error ?? data.details ?? message;
    } catch {
      /* не JSON */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // --- auth ---
  login(username: string, password: string) {
    return request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  me() {
    return request<{ user: User }>("/api/auth/me");
  },

  // --- games ---
  games(params?: { genre?: Genre; search?: string }) {
    const qs = new URLSearchParams();
    if (params?.genre) qs.set("genre", params.genre);
    if (params?.search) qs.set("search", params.search);
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<Game[]>(`/api/games${suffix}`);
  },
  gameById(id: number) {
    return request<Game>(`/api/games/${id}`);
  },

  // Загрузка изображений с компьютера. Возвращает массив URL.
  async uploadImages(files: FileList | File[]): Promise<string[]> {
    const form = new FormData();
    for (const file of Array.from(files)) form.append("files", file);

    const headers = new Headers();
    if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers, // Content-Type выставит сам браузер (boundary).
      body: form,
    });
    if (!res.ok) {
      let message = `Ошибка загрузки ${res.status}`;
      try {
        message = (await res.json()).error ?? message;
      } catch {
        /* */
      }
      throw new Error(message);
    }
    return (await res.json()).urls as string[];
  },
  createGame(input: GameInput) {
    return request<Game>("/api/games", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updateGame(id: number, input: Partial<GameInput>) {
    return request<Game>(`/api/games/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  deleteGame(id: number) {
    return request<{ success: boolean }>(`/api/games/${id}`, {
      method: "DELETE",
    });
  },

  // --- suggestions ---
  suggestions() {
    return request<Suggestion[]>("/api/suggestions");
  },
  vote(id: number) {
    return request<Suggestion>(`/api/suggestions/${id}/vote`, {
      method: "POST",
    });
  },
  addSuggestion(title: string) {
    return request<Suggestion>("/api/suggestions", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },
  deleteSuggestion(id: number) {
    return request<{ success: boolean }>(`/api/suggestions/${id}`, {
      method: "DELETE",
    });
  },
};
