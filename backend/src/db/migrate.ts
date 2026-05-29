import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const dbPath = process.env.DATABASE_URL ?? "./local.db";

const sqlite = new Database(dbPath, { create: true });
const db = drizzle(sqlite);

console.log("⏳ Применяю миграции...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("✅ Миграции применены.");

sqlite.close();
