import { and, desc, eq, like } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db";
import { GENRES, games } from "../db/schema";
import { authPlugin } from "./auth";

const gameBody = t.Object({
  title: t.String({ minLength: 1, maxLength: 200 }),
  genre: t.Optional(t.Union(GENRES.map((g) => t.Literal(g)))),
  platform: t.Optional(t.String({ maxLength: 100 })),
  criticScore: t.Optional(t.Nullable(t.Integer({ minimum: 0, maximum: 100 }))),
  personalScore: t.Optional(t.String({ maxLength: 20 })),
  completedAt: t.Optional(t.Nullable(t.Number())),
  description: t.Optional(t.String({ maxLength: 5000 })),
  images: t.Optional(t.Array(t.String({ maxLength: 1000 }))),
});

// Преобразуем completedAt (ms из тела) в Date для Drizzle timestamp.
const normalize = (body: Record<string, unknown>) => {
  const out = { ...body } as Record<string, unknown>;
  if ("completedAt" in out) {
    out.completedAt =
      out.completedAt == null ? null : new Date(Number(out.completedAt));
  }
  return out;
};

export const gamesRoutes = new Elysia({ prefix: "/api/games" })
  .use(authPlugin)
  // Список игр с фильтром по жанру и поиском.
  .get(
    "/",
    async ({ query }) => {
      const conditions = [];
      if (query.genre) conditions.push(eq(games.genre, query.genre));
      if (query.search)
        conditions.push(like(games.title, `%${query.search}%`));

      return db
        .select()
        .from(games)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(games.completedAt), desc(games.createdAt));
    },
    {
      query: t.Object({
        genre: t.Optional(t.Union(GENRES.map((g) => t.Literal(g)))),
        search: t.Optional(t.String()),
      }),
    },
  )

  .get(
    "/:id",
    async ({ params, status }) => {
      const [game] = await db
        .select()
        .from(games)
        .where(eq(games.id, params.id));
      if (!game) return status(404, { error: "Игра не найдена" });
      return game;
    },
    { params: t.Object({ id: t.Integer() }) },
  )

  // Создание — только для авторизованных.
  .post(
    "/",
    async ({ body, status }) => {
      const [created] = await db
        .insert(games)
        .values(normalize(body) as typeof games.$inferInsert)
        .returning();
      return status(201, created);
    },
    { body: gameBody, auth: true },
  )

  .put(
    "/:id",
    async ({ params, body, status }) => {
      const [updated] = await db
        .update(games)
        .set(normalize(body))
        .where(eq(games.id, params.id))
        .returning();
      if (!updated) return status(404, { error: "Игра не найдена" });
      return updated;
    },
    { params: t.Object({ id: t.Integer() }), body: t.Partial(gameBody), auth: true },
  )

  .delete(
    "/:id",
    async ({ params, status }) => {
      const [deleted] = await db
        .delete(games)
        .where(eq(games.id, params.id))
        .returning();
      if (!deleted) return status(404, { error: "Игра не найдена" });
      return { success: true, id: deleted.id };
    },
    { params: t.Object({ id: t.Integer() }), auth: true },
  );
