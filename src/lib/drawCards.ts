import { tarotCards } from "../data/tarotCards";
import type { DrawnCard, Spread, TarotCardData } from "../types/tarot";

export function shuffleCards(cards: TarotCardData[] = tarotCards): TarotCardData[] {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function createDrawnCard(card: TarotCardData, positionIndex: number, spread: Spread): DrawnCard {
  return {
    cardId: card.id,
    card,
    orientation: Math.random() > 0.5 ? "upright" : "reversed",
    position: spread.positions[positionIndex],
    positionIndex,
  };
}

export function drawOneCard(excludedIds: number[], positionIndex: number, spread: Spread): DrawnCard {
  const availableCards = tarotCards.filter((card) => !excludedIds.includes(card.id));
  const card = availableCards[Math.floor(Math.random() * availableCards.length)];
  return createDrawnCard(card, positionIndex, spread);
}

export function drawCardsForSpread(spread: Spread): DrawnCard[] {
  const drawn: DrawnCard[] = [];
  for (let index = 0; index < spread.cardCount; index += 1) {
    drawn.push(drawOneCard(drawn.map((item) => item.card.id), index, spread));
  }
  return drawn;
}
