import { randomUUID } from "node:crypto";
import { Elysia, t } from "elysia";
import { authPlugin } from "./auth";

const UPLOAD_DIR = "uploads";
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Расширение по mime-типу.
const extFor = (type: string) =>
  ({
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  })[type] ?? ".bin";

export const uploadRoutes = new Elysia()
  .use(authPlugin)
  // Загрузка одного или нескольких изображений. Возвращает массив URL.
  .post(
    "/api/upload",
    async ({ body, status }) => {
      const files = body.files;
      const urls: string[] = [];

      for (const file of files) {
        if (!ALLOWED.includes(file.type)) {
          return status(400, {
            error: `Недопустимый тип файла: ${file.type}`,
          });
        }
        const name = `${randomUUID()}${extFor(file.type)}`;
        await Bun.write(`${UPLOAD_DIR}/${name}`, file);
        urls.push(`/uploads/${name}`);
      }

      return { urls };
    },
    {
      auth: true,
      body: t.Object({
        // До 10 изображений за раз, каждое не больше 8 МБ.
        files: t.Files({
          type: ALLOWED,
          maxSize: 8 * 1024 * 1024,
          maxItems: 10,
        }),
      }),
    },
  )

  // Раздача загруженных файлов как статики.
  .get(
    "/uploads/:name",
    ({ params, status }) => {
      const file = Bun.file(`${UPLOAD_DIR}/${params.name}`);
      return file.exists().then((ok) =>
        ok ? file : status(404, { error: "Файл не найден" }),
      );
    },
    { params: t.Object({ name: t.String() }) },
  );
