import type { CardMeaning, TarotCardData } from "../types/tarot";

const domainText = (base: string, domain: string) => `${base}${domain}层面需要看见真实动机与可执行的下一步。`;

function meaning(keywords: string[], base: string, advice: string): CardMeaning {
  return {
    keywords,
    general: `${base}整体显示事情正在形成清晰的能量线索。`,
    love: domainText(base, "感情"),
    career: domainText(base, "事业"),
    wealth: domainText(base, "财务"),
    health: `${base}身心状态适合放慢节奏，观察压力来源。`,
    advice,
  };
}

const majorSeed: Array<[string, string, string, string[], string[], string]> = [
  ["愚者", "The Fool", "0", ["开始", "自由", "冒险"], ["冲动", "迷失", "准备不足"], "带着开放心态前进，但先确认基本边界。"],
  ["魔术师", "The Magician", "I", ["显化", "资源", "行动"], ["操控", "分心", "资源误用"], "把已有资源整合起来，先做一个小而明确的动作。"],
  ["女祭司", "The High Priestess", "II", ["直觉", "秘密", "静观"], ["压抑", "信息不明", "逃避"], "先倾听直觉，也要等待更多事实浮现。"],
  ["女皇", "The Empress", "III", ["滋养", "丰盛", "创造"], ["依赖", "停滞", "过度付出"], "照顾需求与感受，让关系或计划自然生长。"],
  ["皇帝", "The Emperor", "IV", ["秩序", "责任", "掌控"], ["僵硬", "控制", "压力"], "建立规则，但保留弹性与倾听空间。"],
  ["教皇", "The Hierophant", "V", ["传统", "学习", "信念"], ["教条", "束缚", "质疑"], "参考成熟经验，同时确认它是否仍适合你。"],
  ["恋人", "The Lovers", "VI", ["吸引", "选择", "价值观"], ["摇摆", "失衡", "价值冲突"], "把心动与价值排序放在同一张桌上讨论。"],
  ["战车", "The Chariot", "VII", ["推进", "意志", "胜利"], ["急躁", "失控", "方向分裂"], "聚焦目标，避免用速度掩盖路线问题。"],
  ["力量", "Strength", "VIII", ["勇气", "温柔", "自控"], ["耗竭", "压抑", "不安"], "用稳定和耐心处理，而不是硬碰硬。"],
  ["隐士", "The Hermit", "IX", ["独处", "洞察", "寻找"], ["孤立", "退缩", "迷惘"], "给自己安静空间，整理真正的问题。"],
  ["命运之轮", "Wheel of Fortune", "X", ["转机", "循环", "变化"], ["反复", "延迟", "失控感"], "顺势观察周期，不急着把变化定性。"],
  ["正义", "Justice", "XI", ["公平", "因果", "判断"], ["偏差", "失衡", "逃责"], "回到事实、责任与边界，做清楚的决定。"],
  ["倒吊人", "The Hanged Man", "XII", ["暂停", "换位", "牺牲"], ["卡住", "拖延", "不甘"], "暂缓推进，换角度会比硬冲更有效。"],
  ["死神", "Death", "XIII", ["结束", "转化", "更新"], ["抗拒", "停滞", "难放下"], "温和告别旧模式，给新阶段留位置。"],
  ["节制", "Temperance", "XIV", ["整合", "平衡", "疗愈"], ["失调", "过量", "急切"], "用中间路线调和矛盾，避免极端选择。"],
  ["恶魔", "The Devil", "XV", ["执念", "诱惑", "束缚"], ["松绑", "觉察", "脱困"], "看见让你不自由的欲望或恐惧。"],
  ["高塔", "The Tower", "XVI", ["破局", "震荡", "真相"], ["余震", "抗拒", "重建"], "先处理现实冲击，再重建更诚实的结构。"],
  ["星星", "The Star", "XVII", ["希望", "疗愈", "愿景"], ["失望", "信心弱", "延迟"], "保持长期信念，用温和行动恢复能量。"],
  ["月亮", "The Moon", "XVIII", ["潜意识", "迷雾", "敏感"], ["澄清", "焦虑", "误判"], "在信息不透明时，不要让想象替你下结论。"],
  ["太阳", "The Sun", "XIX", ["明朗", "快乐", "成功"], ["低潮", "过度乐观", "遮掩"], "把清晰和真诚带进局面，接受可见的支持。"],
  ["审判", "Judgement", "XX", ["召唤", "复盘", "重启"], ["自责", "逃避", "迟疑"], "从过去提炼经验，回应新的阶段邀请。"],
  ["世界", "The World", "XXI", ["完成", "整合", "圆满"], ["未竟", "收尾", "局限"], "完成该完成的闭环，再进入下一轮。"],
];

const majorCards: TarotCardData[] = majorSeed.map(([nameCn, nameEn, numberLabel, uprightKeys, reversedKeys, advice], index) => ({
  id: index,
  nameCn,
  nameEn,
  arcana: "major",
  numberLabel,
  astrology: ["太阳", "月亮", "水星", "金星", "火星", "木星", "土星"][index % 7],
  upright: meaning(uprightKeys, `${nameCn}正位`, advice),
  reversed: meaning(reversedKeys, `${nameCn}逆位`, "先调整内在阻力，再谈外部推进。"),
}));

const suits = [
  { suit: "wands", suitCn: "权杖", element: "fire", theme: "行动、热情、创造力", base: "行动动力" },
  { suit: "cups", suitCn: "圣杯", element: "water", theme: "情绪、关系、感受", base: "情感流动" },
  { suit: "swords", suitCn: "宝剑", element: "air", theme: "思维、沟通、判断", base: "理性判断" },
  { suit: "pentacles", suitCn: "星币", element: "earth", theme: "现实、金钱、身体、资源", base: "现实资源" },
] as const;

const rankSeeds = [
  ["Ace", "一", ["新机会", "萌芽", "潜力"], ["延迟", "阻塞", "信心不足"]],
  ["Two", "二", ["平衡", "选择", "互动"], ["犹豫", "失衡", "回避"]],
  ["Three", "三", ["合作", "成长", "表达"], ["不合", "分散", "期待落差"]],
  ["Four", "四", ["稳定", "基础", "停顿"], ["封闭", "僵化", "安全感不足"]],
  ["Five", "五", ["冲突", "挑战", "变化"], ["缓和", "内耗", "修复"]],
  ["Six", "六", ["调整", "支持", "过渡"], ["停留", "依赖", "旧模式"]],
  ["Seven", "七", ["评估", "坚持", "策略"], ["动摇", "防御", "看不清"]],
  ["Eight", "八", ["推进", "练习", "节奏"], ["急躁", "重复", "消耗"]],
  ["Nine", "九", ["成熟", "收获", "临界"], ["焦虑", "过载", "不满足"]],
  ["Ten", "十", ["完成", "结果", "压力"], ["释放", "负担", "重整"]],
  ["Page", "侍从", ["学习", "消息", "尝试"], ["幼稚", "迟疑", "误读"]],
  ["Knight", "骑士", ["追求", "移动", "突破"], ["冲动", "摇摆", "方向不稳"]],
  ["Queen", "王后", ["接纳", "成熟", "滋养"], ["敏感", "失衡", "过度保护"]],
  ["King", "国王", ["掌握", "领导", "稳定"], ["控制", "固执", "压力外放"]],
] as const;

const minorCards: TarotCardData[] = suits.flatMap((suit, suitIndex) =>
  rankSeeds.map(([rankEn, rankCn, uprightKeys, reversedKeys], rankIndex) => {
    const nameCn = `${suit.suitCn}${rankCn}`;
    const base = `${nameCn}围绕${suit.theme}展开`;
    return {
      id: 22 + suitIndex * 14 + rankIndex,
      nameCn,
      nameEn: `${rankEn} of ${suit.suitCn === "权杖" ? "Wands" : suit.suitCn === "圣杯" ? "Cups" : suit.suitCn === "宝剑" ? "Swords" : "Pentacles"}`,
      arcana: "minor",
      suit: suit.suit,
      suitCn: suit.suitCn,
      numberLabel: rankCn,
      element: suit.element,
      astrology: `${suit.base}-${rankCn}`,
      upright: meaning([...uprightKeys], `${base}，正位强调${uprightKeys.join("、")}`, `顺着${suit.theme}的积极面行动，保持节奏。`),
      reversed: meaning([...reversedKeys], `${base}，逆位提示${reversedKeys.join("、")}`, `先处理${suit.theme}中的阻塞，再做下一步承诺。`),
    } satisfies TarotCardData;
  }),
);

export const tarotCards: TarotCardData[] = [...majorCards, ...minorCards];
