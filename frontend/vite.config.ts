import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Всё, что идёт на /api, проксируем на backend (Elysia).
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Загруженные изображения раздаёт backend.
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
