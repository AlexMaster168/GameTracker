// Заглушка блока с ботом цен. Живой Telegram-бот не реализован —
// это визуальное представление как на оригинальном сайте.
export function PriceBot() {
  return (
    <section>
      <div className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold/60">
        Vote
      </div>
      <h2 className="font-display mt-1 text-2xl uppercase tracking-wide text-stone-100">
        Game price and language bot
      </h2>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
        Голосование за бота, который будет рассчитывать стоимость игры и язык
        по ссылке в разных регионах (а также расчёт стоимости с учётом
        подарочных карт).
      </p>

      <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-gold/15 bg-black/30 py-1.5 pl-3 pr-2 text-sm text-stone-300">
        <span>💱 Price bot</span>
        <span className="flex items-center gap-1 text-gold/80">
          <span className="text-xs">▲</span>
          <span className="tabular-nums">1</span>
        </span>
      </div>

      <p className="mt-3 text-xs italic text-stone-500">
        * демо-блок: реальный бот не подключён
      </p>
    </section>
  );
}
