import { knowledgeBase } from "../data/knowledgeBase";
import { readingCases } from "../data/readingCases";
import type { DrawnCard, KnowledgeChunk, ReadingCase } from "../types/tarot";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[，。！？、,.!?]/g, " ")
    .split(/\s+/)
    .flatMap((token) => (token.length > 1 ? [token] : []));
}

function scoreText(target: string, terms: string[]): number {
  return terms.reduce((score, term) => score + (target.toLowerCase().includes(term.toLowerCase()) ? 2 : 0), 0);
}

export function searchKnowledge(query: string, category?: KnowledgeChunk["category"], limit = 5): KnowledgeChunk[] {
  const terms = tokenize(query);
  return knowledgeBase
    .filter((chunk) => !category || chunk.category === category)
    .map((chunk) => {
      const target = `${chunk.title} ${chunk.tags.join(" ")} ${chunk.content}`;
      return { chunk, score: scoreText(target, terms) + chunk.tags.filter((tag) => query.includes(tag)).length * 3 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}

export function searchKnowledgeForReading(question: string, category: string, drawnCards: DrawnCard[], spreadName: string, limit = 6): KnowledgeChunk[] {
  const cardTerms = drawnCards.map((item) => `${item.card.nameCn} ${item.card.suitCn ?? ""} ${item.card.arcana}`).join(" ");
  return searchKnowledge(`${question} ${category} ${spreadName} ${cardTerms}`, undefined, limit);
}

export function searchCases(question: string, category: string, drawnCards: DrawnCard[], limit = 3): ReadingCase[] {
  const cardNames = drawnCards.map((item) => item.card.nameCn);
  const terms = [...tokenize(question), category, ...cardNames];
  return readingCases
    .map((item) => {
      const target = `${item.question} ${item.category} ${item.spreadId} ${item.tags.join(" ")} ${item.cards.map((card) => card.cardName).join(" ")} ${item.interpretation}`;
      const categoryScore = item.category === category ? 5 : 0;
      const cardScore = item.cards.filter((card) => cardNames.includes(card.cardName)).length * 4;
      return { caseItem: item, score: scoreText(target, terms) + categoryScore + cardScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.caseItem);
}
