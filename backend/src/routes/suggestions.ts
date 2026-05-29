import { desc, eq, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db";
import { suggestions } from "../db/schema";
import { authPlugin } from "./auth";

export const suggestionsRoutes = new Elysia({ prefix: "/api/suggestions" })
  .use(authPlugin)
  // Список кандидатов, отсортированный по количеству голосов.
  .get("/", async () =>
    db.select().from(suggestions).orderBy(desc(suggestions.votes)),
  )

  // Проголосовать за кандидата (+1). Доступно всем.
  .post(
    "/:id/vote",
    async ({ params, status }) => {
      const [updated] = await db
        .update(suggestions)
        .set({ votes: sql`${suggestions.votes} + 1` })
        .where(eq(suggestions.id, params.id))
        .returning();
      if (!updated) return status(404, { error: "Кандидат не найден" });
      return updated;
    },
    { params: t.Object({ id: t.Integer() }) },
  )

  // Добавить кандидата (любой пользователь может предложить игру).
  .post(
    "/",
    async ({ body, status }) => {
      const [created] = await db
        .insert(suggestions)
        .values({ title: body.title.trim() })
        .returning();
      return status(201, created);
    },
    { body: t.Object({ title: t.String({ minLength: 1, maxLength: 200 }) }) },
  )

  // Удалить кандидата — только для авторизованных.
  .delete(
    "/:id",
    async ({ params, status }) => {
      const [deleted] = await db
        .delete(suggestions)
        .where(eq(suggestions.id, params.id))
        .returning();
      if (!deleted) return status(404, { error: "Кандидат не найден" });
      return { success: true, id: deleted.id };
    },
    { params: t.Object({ id: t.Integer() }), auth: true },
  );
