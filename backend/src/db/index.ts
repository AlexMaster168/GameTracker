import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const dbPath = process.env.DATABASE_URL ?? "./local.db";

const sqlite = new Database(dbPath, { create: true });
// Включаем WAL — лучше для конкурентных чтений/записей.
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = ON;");

export const db = drizzle(sqlite, { schema });
export { schema };
