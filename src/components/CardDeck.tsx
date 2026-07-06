import { useState } from "react";
import { tarotCards } from "../data/tarotCards";
import { createDrawnCard, shuffleCards } from "../lib/drawCards";
import type { DrawnCard, Spread, TarotCardData } from "../types/tarot";
import { TarotCard } from "./TarotCard";

interface CardDeckProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  setDrawnCards: (cards: DrawnCard[]) => void;
  onComplete: (cards: DrawnCard[]) => void;
}

export function CardDeck({ spread, drawnCards, setDrawnCards, onComplete }: CardDeckProps) {
  const [deck] = useState<TarotCardData[]>(() => shuffleCards(tarotCards));

  const handleCardClick = (card: TarotCardData) => {
    if (drawnCards.some((item) => item.cardId === card.id)) return;
    if (drawnCards.length >= spread.cardCount) return;

    const nextCard = createDrawnCard(card, drawnCards.length, spread);
    const next = [...drawnCards, nextCard];
    setDrawnCards(next);

    if (next.length === spread.cardCount) {
      window.setTimeout(() => onComplete(next), 650);
    }
  };

  return (
    <section className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-lg border border-white/10 bg-white/[.05] p-4 shadow-card md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-oracle">{spread.name}</p>
            <h2 className="font-display text-3xl text-white">抽取你的牌</h2>
          </div>
          <span className="rounded-full border border-oracle/40 px-3 py-1 text-sm text-oracle">
            {drawnCards.length}/{spread.cardCount}
          </span>
        </div>

        <div className="deck-grid mt-6 grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-13">
          {deck.map((card, index) => {
            const selectedCard = drawnCards.find((item) => item.cardId === card.id);
            return (
              <TarotCard
                key={card.id}
                card={card}
                index={index}
                isSelected={Boolean(selectedCard)}
                orientation={selectedCard?.orientation}
                onClick={() => handleCardClick(card)}
              />
            );
          })}
        </div>
      </div>

      <aside className="rounded-lg border border-oracle/30 bg-black/25 p-4">
        <p className="text-sm text-oracle">已抽取</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {spread.positions.map((position, index) => {
            const drawn = drawnCards[index];
            return (
              <div key={position.index} className="rounded-md border border-white/10 bg-white/[.04] p-2">
                <p className="mb-2 text-xs text-pearl/70">{position.name}</p>
                {drawn ? <TarotCard drawn={drawn} index={index} /> : <div className="aspect-[2/3] rounded-md border border-dashed border-white/20" />}
              </div>
            );
          })}
        </div>
      </aside>
    </section>
  );
}
