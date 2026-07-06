import { spreads } from "../data/spreads";
import type { Spread } from "../types/tarot";

interface SpreadRecommendationProps {
  spread: Spread;
  reason: string;
  onSelect: (spread: Spread) => void;
  onStart: () => void;
}

export function SpreadRecommendation({ spread, reason, onSelect, onStart }: SpreadRecommendationProps) {
  return (
    <section className="mt-5 rounded-lg border border-oracle/30 bg-black/20 p-4 shadow-glow md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm text-oracle">推荐牌阵</p>
          <h2 className="font-display text-3xl text-white">{spread.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-pearl/80">{reason}</p>
        </div>
        <button onClick={onStart} className="rounded-md bg-white px-5 py-3 font-semibold text-night transition hover:bg-pearl">
          开始抽牌
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {spreads.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)} className={`rounded-md border p-3 text-left transition ${item.id === spread.id ? "border-oracle bg-oracle/15" : "border-white/10 bg-white/[.04] hover:border-white/30"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">{item.name}</span>
              <span className="text-xs text-oracle">{item.cardCount} 张</span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-pearl/70">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
