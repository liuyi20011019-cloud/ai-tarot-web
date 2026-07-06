export type TarotCategory =
  | "感情"
  | "事业"
  | "财运"
  | "学业"
  | "家庭"
  | "健康"
  | "自我成长"
  | "选择题"
  | "其他";

export type Orientation = "upright" | "reversed";

export interface TarotCardData {
  id: number;
  nameCn: string;
  nameEn: string;
  arcana: "major" | "minor";
  suit?: "wands" | "cups" | "swords" | "pentacles";
  suitCn?: "权杖" | "圣杯" | "宝剑" | "星币";
  numberLabel: string;
  element?: "fire" | "water" | "air" | "earth";
  astrology?: string;
  image?: string;
  upright: CardMeaning;
  reversed: CardMeaning;
}

export interface CardMeaning {
  keywords: string[];
  general: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
  advice: string;
}

export interface Spread {
  id: string;
  name: string;
  cardCount: number;
  description: string;
  positions: SpreadPosition[];
  suitableFor: string[];
}

export interface SpreadPosition {
  index: number;
  name: string;
  meaning: string;
}

export interface DrawnCard {
  cardId: number;
  card: TarotCardData;
  orientation: Orientation;
  position: SpreadPosition;
  positionIndex: number;
}

export interface QuestionInput {
  question: string;
  category: TarotCategory;
  timeframe: string;
  subject: string;
  background?: string;
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: "card_meaning" | "spread_rule" | "combination" | "reading_principle" | "safety";
  tags: string[];
  content: string;
}

export interface ReadingCase {
  id: string;
  question: string;
  category: string;
  spreadId: string;
  cards: {
    position: string;
    cardName: string;
    orientation: Orientation;
  }[];
  interpretation: string;
  tags: string[];
}

export interface ReadingInput extends QuestionInput {
  spread: Spread;
  drawnCards: DrawnCard[];
}

export interface ReadingOutput {
  id: string;
  createdAt: string;
  question: string;
  category: string;
  timeframe: string;
  subject: string;
  background?: string;
  spreadName: string;
  cards: {
    position: string;
    positionMeaning: string;
    cardName: string;
    orientation: Orientation;
    keywords: string[];
    meaning: string;
  }[];
  knowledgeUsed: string[];
  similarCasesUsed: string[];
  combinationReading: string;
  overallSummary: string;
  advice: string;
  disclaimer: string;
}
