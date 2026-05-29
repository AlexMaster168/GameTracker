export const GENRES = [
  "action",
  "soulslike",
  "rpg",
  "adventure",
  "horror",
  "shooter",
  "platformer",
  "racing",
] as const;

export type Genre = (typeof GENRES)[number];

// Подписи жанров в навигации (как на сайте).
export const GENRE_LABELS: Record<Genre, string> = {
  action: "Action",
  soulslike: "Sosaliki",
  rpg: "RPG",
  adventure: "Adventure",
  horror: "Horror",
  shooter: "Shooter",
  platformer: "Platformer",
  racing: "Racing",
};

export interface Game {
  id: number;
  title: string;
  genre: Genre;
  platform: string;
  criticScore: number | null;
  personalScore: string;
  completedAt: string | null;
  description: string;
  images: string[];
  createdAt: string;
}

export type GameInput = {
  title: string;
  genre: Genre;
  platform: string;
  criticScore: number | null;
  personalScore: string;
  completedAt: number | null;
  description: string;
  images: string[];
};

export interface Suggestion {
  id: number;
  title: string;
  votes: number;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
}
