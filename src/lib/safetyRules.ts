const absoluteWords = ["必然", "一定", "百分百", "注定", "绝对", "肯定会", "永远"];
const sensitiveWords = ["死亡", "死", "疾病", "怀孕", "官司", "违法", "投资收益", "股票", "基金", "自杀", "伤害自己"];

export function containsSensitiveTopic(question: string): boolean {
  return sensitiveWords.some((word) => question.includes(word));
}

export function getSafetyDisclaimer(category: string, question: string): string {
  const text = `${category} ${question}`;
  if (text.includes("健康") || text.includes("疾病") || text.includes("怀孕")) {
    return "本解读不能替代医生建议、诊断或治疗；如有身体不适或健康风险，请及时咨询专业医疗人员。";
  }
  if (text.includes("投资") || text.includes("股票") || text.includes("基金") || text.includes("财运")) {
    return "本解读不能替代专业财务建议，也不构成投资收益承诺；涉及资金决策请咨询合格专业人士。";
  }
  if (text.includes("法律") || text.includes("官司") || text.includes("违法")) {
    return "本解读不能替代律师意见或法律判断；涉及法律事项请咨询专业律师。";
  }
  return "塔罗解读用于自我观察与决策参考，不构成绝对预测；请结合现实信息、个人判断和必要的专业建议行动。";
}

export function sanitizeReadingText(text: string): string {
  return absoluteWords.reduce((current, word) => current.replaceAll(word, "倾向于"), text);
}
