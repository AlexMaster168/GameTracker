import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Жанры — соответствуют пунктам навигации на сайте.
 * "soulslike" в навбаре подписан как "Sosaliki".
 */
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

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  genre: text("genre", { enum: GENRES }).notNull().default("action"),
  platform: text("platform").notNull().default(""),
  /** Оценка критиков 0..100 (как Metacritic) */
  criticScore: integer("critic_score"),
  /** Личная оценка автора в свободной форме, например "5+/5" */
  personalScore: text("personal_score").notNull().default(""),
  /** Дата прохождения (timestamp), null если не пройдено */
  completedAt: integer("completed_at", { mode: "timestamp" }),
  /** Развёрнутое описание / обзор игры */
  description: text("description").notNull().default(""),
  /** Галерея изображений: массив URL (внешних или загруженных /uploads/...). */
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Игры-кандидаты, за которые голосуют в блоке "Top games to suggest". */
export const suggestions = sqliteTable("suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  votes: integer("votes").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Пользователи (админы), которые могут управлять каталогом. */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;
export type User = typeof users.$inferSelect;
