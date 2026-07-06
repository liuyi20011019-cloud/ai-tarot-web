import type { DrawnCard, Orientation, TarotCardData } from "../types/tarot";

interface TarotCardProps {
  card?: TarotCardData;
  drawn?: DrawnCard;
  index?: number;
  isSelected?: boolean;
  orientation?: Orientation;
  onClick?: () => void;
}

export function TarotCard({ card, drawn, index = 0, isSelected, orientation, onClick }: TarotCardProps) {
  const data = drawn?.card ?? card;
  const shownOrientation = drawn?.orientation ?? orientation;
  const isReversed = shownOrientation === "reversed";
  const shouldShowFace = Boolean(drawn || isSelected);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick || isSelected}
      className={`tarot-card group relative aspect-[2/3] w-full max-w-[132px] overflow-hidden rounded-lg border transition duration-300 ${isSelected ? "selected border-oracle shadow-glow" : "border-oracle/30"} ${isReversed ? "rotate-180" : ""}`}
      style={{ animationDelay: `${index * 25}ms` }}
      aria-label={data ? `${data.nameCn}${shownOrientation === "reversed" ? "逆位" : "正位"}` : "塔罗牌背"}
    >
      {data && shouldShowFace ? (
        <div className="flex h-full min-h-0 flex-col justify-between rounded-lg bg-[linear-gradient(155deg,#24103d,#5b275f_52%,#b68439)] p-2 text-center text-white sm:p-3">
          <span className="text-[10px] uppercase tracking-widest text-pearl/70">{data.arcana === "major" ? "Major Arcana" : data.suitCn}</span>
          <strong className="break-words font-display text-sm leading-tight sm:text-lg">{data.nameCn}</strong>
          <span className="text-xs text-pearl/80">{shownOrientation === "reversed" ? "逆位" : "正位"}</span>
        </div>
      ) : (
        <div className="card-back flex h-full items-center justify-center rounded-lg">
          <div className="h-16 w-16 rounded-full border border-oracle/70" />
        </div>
      )}
    </button>
  );
}
