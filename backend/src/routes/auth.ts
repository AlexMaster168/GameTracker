import { jwt } from "@elysiajs/jwt";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";

const JWT_SECRET =
  process.env.JWT_SECRET ?? "dev-secret-change-me-in-production";

/**
 * Переиспользуемый плагин аутентификации.
 * Даёт macro `auth: true` — оно требует валидный Bearer-токен,
 * иначе кидает 401, а в хендлер прокидывает `user`.
 */
export const authPlugin = new Elysia({ name: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: "7d",
    }),
  )
  .macro({
    auth(enabled: boolean) {
      if (!enabled) return;
      return {
        async resolve({ jwt, status, headers }) {
          const header = headers.authorization;
          const token = header?.startsWith("Bearer ")
            ? header.slice(7)
            : undefined;
          if (!token) return status(401, { error: "Требуется авторизация" });

          const payload = await jwt.verify(token);
          if (!payload || typeof payload.sub !== "string") {
            return status(401, { error: "Невалидный токен" });
          }
          return {
            user: { id: Number(payload.sub), username: payload.username },
          };
        },
      };
    },
  });

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(authPlugin)
  // Вход: проверяем пароль, выдаём JWT.
  .post(
    "/login",
    async ({ body, jwt, status }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username));

      if (!user) return status(401, { error: "Неверный логин или пароль" });

      const ok = await Bun.password.verify(body.password, user.passwordHash);
      if (!ok) return status(401, { error: "Неверный логин или пароль" });

      const token = await jwt.sign({
        sub: String(user.id),
        username: user.username,
      });

      return { token, user: { id: user.id, username: user.username } };
    },
    {
      body: t.Object({
        username: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    },
  )
  // Кто я (проверка валидности токена на фронте).
  .get("/me", ({ user }) => ({ user }), { auth: true });
