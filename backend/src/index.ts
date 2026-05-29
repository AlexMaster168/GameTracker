import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { gamesRoutes } from "./routes/games";
import { suggestionsRoutes } from "./routes/suggestions";
import { uploadRoutes } from "./routes/upload";

const PORT = Number(process.env.PORT ?? 3001);

const app = new Elysia()
  .use(cors())
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Невалидные данные", details: error.message };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Не найдено" };
    }
    console.error("❌ Ошибка сервера:", error);
    set.status = 500;
    return { error: "Внутренняя ошибка сервера" };
  })
  .get("/", () => ({ status: "ok", service: "games-by-alexmaster-api" }))
  .get("/health", () => ({ status: "ok" }))
  .use(authRoutes)
  .use(uploadRoutes)
  .use(gamesRoutes)
  .use(suggestionsRoutes)
  .listen(PORT);

console.log(
  `🎮 GAMES BY ALEXMASTER API запущен на http://localhost:${app.server?.port}`,
);

export type App = typeof app;
