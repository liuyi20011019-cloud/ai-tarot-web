import { spreads } from "../data/spreads";
import type { QuestionInput, Spread } from "../types/tarot";

const includesAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

export function recommendSpread(input: QuestionInput): Spread {
  const text = `${input.question} ${input.category} ${input.subject} ${input.background ?? ""}`;
  const longContext = text.length > 90;

  if (longContext) return spreads.find((spread) => spread.id === "seven_insight")!;
  if (includesAny(text, ["感情", "喜欢", "复合", "对方", "关系", "暧昧", "前任", "分手", "伴侣"])) {
    return spreads.find((spread) => spread.id === "love_five")!;
  }
  if (includesAny(text, ["选择", "要不要", "A还是B", "哪一个更好", "是否应该", "该不该"]) || input.category === "选择题") {
    return spreads.find((spread) => spread.id === "choice_four")!;
  }
  if (includesAny(text, ["未来", "发展", "最近", "趋势", "会怎样", "结果", "运势"])) {
    return spreads.find((spread) => spread.id === "three_card_timeline")!;
  }
  if (input.timeframe.includes("长期")) return spreads.find((spread) => spread.id === "celtic_cross_simple")!;
  return spreads.find((spread) => spread.id === "single_card")!;
}

export function getRecommendationReason(input: QuestionInput, spread: Spread): string {
  if (spread.id === "love_five") return "问题中出现了关系、对方或感情线索，五张牌能同时观察双方状态、阻碍与发展。";
  if (spread.id === "choice_four") return "问题带有明显 A/B 或是否判断，四张牌更适合比较不同路径。";
  if (spread.id === "three_card_timeline") return "问题关注近期发展或趋势，时间线牌阵能呈现过去、现在、未来的变化。";
  if (spread.id === "seven_insight") return "问题背景较长或较复杂，七张牌能展开潜意识、外部影响与建议。";
  if (spread.id === "celtic_cross_simple") return "问题带有长期或重大议题，凯尔特十字简化版更适合深度结构化观察。";
  return "问题适合先聚焦一个核心指引，避免过度解读。";
}
