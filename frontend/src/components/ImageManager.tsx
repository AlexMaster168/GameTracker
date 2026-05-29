import { useRef, useState } from "react";
import { api } from "../lib/api";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

// Управление галереей: добавление по ссылке или загрузкой с компа,
// удаление, перестановка. Первая картинка — обложка.
export function ImageManager({ images, onChange }: Props) {
  const [mode, setMode] = useState<"file" | "url">("file");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const v = url.trim();
    if (!v) return;
    onChange([...images, v]);
    setUrl("");
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await api.uploadImages(files);
      onChange([...images, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const remove = (i: number) =>
    onChange(images.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {/* Превью галереи */}
      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative h-20 w-28 overflow-hidden rounded-md border border-gold/20"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[0.6rem] uppercase tracking-wider text-gold">
                  cover
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded bg-white/10 px-1.5 text-xs text-white disabled:opacity-30"
                  title="Влево"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded bg-rose-600/80 px-1.5 text-xs text-white"
                  title="Удалить"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="rounded bg-white/10 px-1.5 text-xs text-white disabled:opacity-30"
                  title="Вправо"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Переключатель способа добавления */}
      <div className="mb-2 inline-flex overflow-hidden rounded-md border border-gold/20 text-xs">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-3 py-1 uppercase tracking-wider transition ${
            mode === "file"
              ? "bg-gold/20 text-gold-bright"
              : "text-stone-400 hover:text-gold"
          }`}
        >
          С компа
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1 uppercase tracking-wider transition ${
            mode === "url"
              ? "bg-gold/20 text-gold-bright"
              : "text-stone-400 hover:text-gold"
          }`}
        >
          Ссылкой
        </button>
      </div>

      {mode === "file" ? (
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-sm text-stone-400 file:mr-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-sm file:text-gold-bright hover:file:bg-gold/30"
          />
          {uploading && (
            <p className="mt-1 text-xs text-gold/70">Загружаю…</p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://…"
            className="flex-1 rounded-md border border-gold/20 bg-black/40 px-3 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-gold/50"
          />
          <button
            type="button"
            onClick={addUrl}
            className="rounded-md border border-gold/30 px-3 py-2 text-sm text-gold transition hover:bg-gold/10"
          >
            +
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      <p className="mt-1 text-xs text-stone-500">
        Можно несколько сразу. Первая — обложка (перетащи стрелками).
      </p>
    </div>
  );
}
