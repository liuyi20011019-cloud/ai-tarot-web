import type { DrawnCard, KnowledgeChunk, ReadingCase, ReadingInput, ReadingOutput } from "../types/tarot";
import { searchCases, searchKnowledgeForReading } from "./ragEngine";
import { getSafetyDisclaimer, sanitizeReadingText } from "./safetyRules";

interface ReadingStats {
  uprightCount: number;
  reversedCount: number;
  majorCount: number;
  suitCounts: Record<string, number>;
  dominantSuit?: string;
}

const suitThemes: Record<string, string> = {
  权杖: "行动、推进、动力与事业能量",
  圣杯: "情绪、关系、感受与依恋",
  宝剑: "压力、沟通、理性判断与冲突",
  星币: "现实条件、金钱、安全感与长期稳定",
};

function getCardDomainMeaning(card: DrawnCard, category: string): string {
  const source = card.orientation === "upright" ? card.card.upright : card.card.reversed;
  if (category === "感情") return source.love;
  if (category === "事业" || category === "学业") return source.career;
  if (category === "财运") return source.wealth;
  if (category === "健康") return source.health;
  return source.general;
}

function getReadingStats(drawnCards: DrawnCard[]): ReadingStats {
  const suitCounts = drawnCards.reduce<Record<string, number>>((acc, item) => {
    if (item.card.suitCn) acc[item.card.suitCn] = (acc[item.card.suitCn] ?? 0) + 1;
    return acc;
  }, {});
  const dominantSuit = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const reversedCount = drawnCards.filter((item) => item.orientation === "reversed").length;
  return {
    uprightCount: drawnCards.length - reversedCount,
    reversedCount,
    majorCount: drawnCards.filter((item) => item.card.arcana === "major").length,
    suitCounts,
    dominantSuit,
  };
}

function ratioText(stats: ReadingStats): string {
  if (stats.reversedCount > stats.uprightCount) return `逆位 ${stats.reversedCount} 张多于正位 ${stats.uprightCount} 张，说明存在延迟、内耗、沟通不清或现实阻力。`;
  if (stats.uprightCount > stats.reversedCount) return `正位 ${stats.uprightCount} 张多于逆位 ${stats.reversedCount} 张，整体趋势较顺，但仍需要结合阻碍位与逆位牌调整。`;
  return `正位与逆位各 ${stats.uprightCount} 张，显示外部推进和内部调整需要同步发生。`;
}

function arcanaText(stats: ReadingStats, total: number): string {
  if (stats.majorCount >= Math.ceil(total / 2)) return `大阿尔卡那出现 ${stats.majorCount} 张，说明这个问题影响较深，可能正处在阶段性转折。`;
  return `大阿尔卡那出现 ${stats.majorCount} 张，重点更偏向日常选择、沟通方式和可执行行动。`;
}

function elementText(stats: ReadingStats): string {
  if (!stats.dominantSuit) return "本次大牌能量更明显，重点不只在具体事件，也在心态和阶段变化。";
  const count = stats.suitCounts[stats.dominantSuit];
  return `${stats.dominantSuit}元素出现 ${count} 张，${suitThemes[stats.dominantSuit] ?? "对应主题"}是本次解读的明显重心。`;
}

function combinationRules(drawnCards: DrawnCard[]): string[] {
  const names = drawnCards.map((item) => item.card.nameCn);
  const has = (name: string) => names.includes(name);
  const rules: string[] = [];
  if (has("死神") && has("审判")) rules.push("死神与审判同现，提示重大转折、旧模式结束与重新开始。");
  if (has("恶魔") && (has("宝剑五") || has("宝剑八") || has("宝剑九"))) rules.push("恶魔与宝剑压力牌组合，提示执念、恐惧或限制性想法可能影响判断。");
  if (has("太阳") && has("星星")) rules.push("太阳与星星同现，显示希望、恢复与积极趋势。");
  if (has("恋人") && has("圣杯二")) rules.push("恋人与圣杯二同现，强调关系吸引、情感连接与价值选择。");
  if (has("高塔") && has("星星")) rules.push("高塔与星星同现，表示破局之后存在修复机会。");
  if (has("月亮") && has("女祭司")) rules.push("月亮与女祭司同现，直觉增强但信息仍不透明。");
  if (has("皇帝") && has("星币四")) rules.push("皇帝与星币四同现，控制、安全感和现实边界是关键。");
  if (has("战车") && has("权杖骑士")) rules.push("战车与权杖骑士同现，推进很快，但需要留意冲动。");
  return rules;
}

function categoryFocus(category: string): string {
  if (category === "感情") return "感情问题要重点观察情绪流动、关系互动、对方状态和未来发展，不宜只凭单一牌面替对方下结论。";
  if (category === "事业") return "事业问题要重点看机会、执行力、阻碍、资源和建议，尤其要把行动节奏落到现实条件上。";
  if (category === "财运") return "财运问题要重点看现实条件、风险、稳定性和行动建议，避免把牌面理解成收益承诺。";
  if (category === "学业") return "学业问题要重点看专注度、压力来源、学习方法和结果趋势。";
  return "这个问题适合把牌面当作自我观察工具，同时结合现实信息做判断。";
}

function buildPositionStory(input: ReadingInput): string {
  const first = input.drawnCards[0];
  const last = input.drawnCards[input.drawnCards.length - 1];
  const middle = input.drawnCards.length > 2 ? input.drawnCards[Math.floor(input.drawnCards.length / 2)] : undefined;
  const middleText = middle ? `中段的「${middle.position.name}」由${middle.card.nameCn}${middle.orientation === "reversed" ? "逆位" : "正位"}承接，说明过程里需要处理${middle.position.meaning}` : "";
  return `在${input.spread.name}里，故事从「${first.position.name}」的${first.card.nameCn}${first.orientation === "reversed" ? "逆位" : "正位"}展开，落到「${last.position.name}」的${last.card.nameCn}${last.orientation === "reversed" ? "逆位" : "正位"}。${middleText}这些牌不是孤立含义，而是在牌位之间形成从现状、阻碍到建议或趋势的连续线索。`;
}

function buildCombinationReading(input: ReadingInput, stats: ReadingStats): string {
  const combos = combinationRules(input.drawnCards);
  const parts = [ratioText(stats), arcanaText(stats, input.drawnCards.length), elementText(stats)];
  if (combos.length > 0) parts.push(...combos);
  else parts.push(`本次没有出现强规则组合牌，解读重点更适合放在${input.spread.name}的牌位顺序和单牌之间的能量递进。`);
  return sanitizeReadingText(parts.join(" "));
}

function buildOverallSummary(input: ReadingInput, knowledge: KnowledgeChunk[], cases: ReadingCase[], stats: ReadingStats, combinationReading: string): string {
  const cardNames = input.drawnCards.map((item) => `${item.position.name}的${item.card.nameCn}${item.orientation === "reversed" ? "逆位" : "正位"}`);
  const highlightedCards = cardNames.slice(0, 3).join("、");
  const knowledgeHint = knowledge[0] ? `结合知识库「${knowledge[0].title}」，本次应优先按牌位解释，再看正逆位与组合关系。` : "";
  const caseHint = cases[0] ? `相似案例「${cases[0].question}」提供的参考是：${cases[0].interpretation}` : "";
  return sanitizeReadingText(
    `围绕“${input.question}”，本次${input.spread.name}显示的核心线索是${highlightedCards}。${combinationReading} ${buildPositionStory(input)} ${categoryFocus(input.category)} ${knowledgeHint} ${caseHint}`.trim(),
  );
}

function buildAdvice(input: ReadingInput, stats: ReadingStats): string {
  const adviceCard = input.drawnCards.find((item) => item.position.name.includes("建议") || item.position.name.includes("核心")) ?? input.drawnCards[input.drawnCards.length - 1];
  const obstacleCard = input.drawnCards.find((item) => item.position.name.includes("阻碍")) ?? input.drawnCards.find((item) => item.orientation === "reversed");
  const first = input.drawnCards[0];
  const adviceMeaning = (adviceCard.orientation === "upright" ? adviceCard.card.upright : adviceCard.card.reversed).advice;
  const obstacleText = obstacleCard
    ? `2. 可以考虑先处理${obstacleCard.position.name}里的${obstacleCard.card.nameCn}${obstacleCard.orientation === "reversed" ? "逆位" : "正位"}：把它对应的阻力写成一个具体问题，再决定下一步沟通或行动。`
    : `2. 可以考虑把${first.card.nameCn}显示的当前状态拆成事实、感受和选择，避免被单一情绪带着走。`;
  const paceText = stats.reversedCount > stats.uprightCount
    ? "3. 目前更适合放慢节奏，优先澄清误解、补足信息和修正计划，再推进关键决定。"
    : "3. 目前更适合顺势推进一个小行动，同时保留复盘空间，避免因为趋势较顺就忽略细节。";
  return sanitizeReadingText(
    [
      `1. 建议你围绕${adviceCard.position.name}的${adviceCard.card.nameCn}${adviceCard.orientation === "reversed" ? "逆位" : "正位"}行动：${adviceMeaning}`,
      obstacleText,
      paceText,
    ].join("\n"),
  );
}

export function generateAIReadingPrompt(input: ReadingInput, ragContext: KnowledgeChunk[], cases: ReadingCase[]): string {
  return JSON.stringify(
    {
      role: "你是温和、理性、有边界的塔罗解读助手。",
      user: {
        question: input.question,
        category: input.category,
        timeframe: input.timeframe,
        subject: input.subject,
        background: input.background ?? "",
      },
      spread: {
        name: input.spread.name,
        positions: input.spread.positions,
      },
      drawnCards: input.drawnCards.map((item) => ({
        position: item.position.name,
        cardName: item.card.nameCn,
        orientation: item.orientation,
        keywords: (item.orientation === "upright" ? item.card.upright : item.card.reversed).keywords,
      })),
      ragContext: ragContext.map((item) => ({ title: item.title, content: item.content })),
      similarCases: cases.map((item) => ({ question: item.question, interpretation: item.interpretation })),
      steps: ["分析问题类型和时间范围", "分析牌阵位置", "逐张牌解释", "分析正逆位比例", "分析大阿尔卡那数量", "分析四元素比例", "分析相邻牌组合", "调用本地 RAG 与案例", "生成综合总结", "生成三条行动建议", "加入免责声明"],
      safety: ["不做绝对化预测", "不恐吓用户", "不提供医疗诊断、法律结论或投资承诺", "使用倾向、可能、显示、建议、留意等表达"],
      outputFormat: "返回 ReadingOutput JSON，字段包括 cards、knowledgeUsed、similarCasesUsed、combinationReading、overallSummary、advice、disclaimer。",
    },
    null,
    2,
  );
}

export function generateReading(input: ReadingInput): ReadingOutput {
  const knowledge = searchKnowledgeForReading(input.question, input.category, input.drawnCards, input.spread.name, 6);
  const cases = searchCases(input.question, input.category, input.drawnCards, 3);
  const stats = getReadingStats(input.drawnCards);
  const combinationReading = buildCombinationReading(input, stats);
  const cardReadings = input.drawnCards.map((drawn) => {
    const source = drawn.orientation === "upright" ? drawn.card.upright : drawn.card.reversed;
    return {
      position: drawn.position.name,
      positionMeaning: drawn.position.meaning,
      cardName: drawn.card.nameCn,
      orientation: drawn.orientation,
      keywords: source.keywords,
      meaning: sanitizeReadingText(`${drawn.position.name}位置优先显示：${drawn.position.meaning}${getCardDomainMeaning(drawn, input.category)}关键词为${source.keywords.join("、")}。`),
    };
  });

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    question: input.question,
    category: input.category,
    timeframe: input.timeframe,
    subject: input.subject,
    background: input.background,
    spreadName: input.spread.name,
    cards: cardReadings,
    knowledgeUsed: knowledge.map((item) => item.title),
    similarCasesUsed: cases.map((item) => item.question),
    combinationReading,
    overallSummary: buildOverallSummary(input, knowledge, cases, stats, combinationReading),
    advice: buildAdvice(input, stats),
    disclaimer: getSafetyDisclaimer(input.category, input.question),
  };
}
