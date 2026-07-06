import type { Spread } from "../types/tarot";

export const spreads: Spread[] = [
  {
    id: "single_card",
    name: "一张核心指引",
    cardCount: 1,
    description: "适合简单建议、当下提醒和快速聚焦。",
    positions: [{ index: 0, name: "核心指引", meaning: "指出当前最值得关注的能量与建议。" }],
    suitableFor: ["简单建议", "今日状态", "快速决策"],
  },
  {
    id: "three_card_timeline",
    name: "三张时间线",
    cardCount: 3,
    description: "从过去、现在、未来观察近期趋势。",
    positions: [
      { index: 0, name: "过去", meaning: "影响问题的既有背景或惯性。" },
      { index: 1, name: "现在", meaning: "当下正在发生的核心状态。" },
      { index: 2, name: "未来", meaning: "若维持当前路径，近期可能出现的趋势。" },
    ],
    suitableFor: ["近期趋势", "运势", "发展"],
  },
  {
    id: "love_five",
    name: "五张感情关系",
    cardCount: 5,
    description: "细看双方状态、关系现状、阻碍与发展。",
    positions: [
      { index: 0, name: "你的状态", meaning: "你在关系中的需求、感受与行动倾向。" },
      { index: 1, name: "对方状态", meaning: "对方可能呈现出的态度与心理位置。" },
      { index: 2, name: "关系现状", meaning: "两人之间正在形成的互动模式。" },
      { index: 3, name: "阻碍", meaning: "需要被看见或调整的卡点。" },
      { index: 4, name: "未来发展", meaning: "关系在近期可能走向的趋势。" },
    ],
    suitableFor: ["感情", "复合", "暧昧", "伴侣"],
  },
  {
    id: "choice_four",
    name: "四张选择牌阵",
    cardCount: 4,
    description: "比较 A/B 两个选项的现状与结果。",
    positions: [
      { index: 0, name: "选择A现状", meaning: "选项 A 当前的真实条件。" },
      { index: 1, name: "选择A结果", meaning: "选项 A 可能带来的后续。" },
      { index: 2, name: "选择B现状", meaning: "选项 B 当前的真实条件。" },
      { index: 3, name: "选择B结果", meaning: "选项 B 可能带来的后续。" },
    ],
    suitableFor: ["选择题", "是否", "比较"],
  },
  {
    id: "seven_insight",
    name: "七张深度洞察",
    cardCount: 7,
    description: "适合复杂问题，兼顾现状、潜意识、外部影响和建议。",
    positions: [
      { index: 0, name: "现状", meaning: "问题当前表层状态。" },
      { index: 1, name: "潜意识", meaning: "未被充分说出的内在动机。" },
      { index: 2, name: "外部影响", meaning: "环境、人际或资源因素。" },
      { index: 3, name: "阻碍", meaning: "当下最大的卡点。" },
      { index: 4, name: "建议", meaning: "可以采取的调整方向。" },
      { index: 5, name: "近期发展", meaning: "短期内可能出现的变化。" },
      { index: 6, name: "最终趋势", meaning: "整体走向与长期提醒。" },
    ],
    suitableFor: ["复杂问题", "自我成长", "综合"],
  },
  {
    id: "celtic_cross_simple",
    name: "凯尔特十字简化版",
    cardCount: 10,
    description: "用于重大、牵涉面广的问题，提供完整结构化观察。",
    positions: [
      { index: 0, name: "当前核心", meaning: "问题的中心主题。" },
      { index: 1, name: "交叉影响", meaning: "正在推动或阻挡你的因素。" },
      { index: 2, name: "显意识", meaning: "你知道并正在关注的层面。" },
      { index: 3, name: "潜在根基", meaning: "问题深层来源。" },
      { index: 4, name: "过去影响", meaning: "尚未完全消散的旧影响。" },
      { index: 5, name: "近期未来", meaning: "接下来会显现的趋势。" },
      { index: 6, name: "你的姿态", meaning: "你可以调整的立场与行动。" },
      { index: 7, name: "环境", meaning: "外部世界给出的条件。" },
      { index: 8, name: "希望与恐惧", meaning: "内在期待与担忧。" },
      { index: 9, name: "最终趋势", meaning: "综合后的发展倾向。" },
    ],
    suitableFor: ["重大问题", "长期发展", "深度综合"],
  },
];

export const getSpreadById = (id: string): Spread => spreads.find((spread) => spread.id === id) ?? spreads[0];
