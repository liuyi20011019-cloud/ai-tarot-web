import type { FormEvent } from "react";
import type { QuestionInput, TarotCategory } from "../types/tarot";

const categories: TarotCategory[] = ["感情", "事业", "财运", "学业", "家庭", "健康", "自我成长", "选择题", "其他"];
const timeframes = ["当前", "近一个月", "中期 3-6 个月", "长期 1 年以上"];
const subjects = ["自己", "伴侣", "暧昧对象", "前任", "同事", "上级", "客户", "家人", "朋友", "其他"];

interface QuestionFormProps {
  value: QuestionInput;
  onChange: (value: QuestionInput) => void;
  onSubmit: () => void;
}

export function QuestionForm({ value, onChange, onSubmit }: QuestionFormProps) {
  const update = <K extends keyof QuestionInput>(key: K, next: QuestionInput[K]) => onChange({ ...value, [key]: next });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.question.trim()) onSubmit();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 bg-white/[.06] p-4 shadow-card backdrop-blur md:p-6">
      <label className="block">
        <span className="text-sm text-oracle">你的问题</span>
        <textarea
          value={value.question}
          onChange={(event) => update("question", event.target.value)}
          className="mt-2 min-h-28 w-full resize-none rounded-md border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none ring-oracle/40 transition focus:ring-2"
          placeholder="例如：我和暧昧对象接下来三个月会怎样发展？"
          required
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select label="问题类别" value={value.category} options={categories} onChange={(next) => update("category", next as TarotCategory)} />
        <Select label="时间范围" value={value.timeframe} options={timeframes} onChange={(next) => update("timeframe", next)} />
        <Select label="涉及对象" value={value.subject} options={subjects} onChange={(next) => update("subject", next)} />
      </div>
      <label className="block">
        <span className="text-sm text-oracle">补充背景</span>
        <input
          value={value.background ?? ""}
          onChange={(event) => update("background", event.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/25 px-4 py-3 text-white outline-none ring-oracle/40 transition focus:ring-2"
          placeholder="一句话补充即可"
        />
      </label>
      <button className="w-full rounded-md bg-oracle px-5 py-3 font-semibold text-night transition hover:bg-[#e2b963]">推荐牌阵</button>
    </form>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm text-oracle">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-3 text-white outline-none ring-oracle/40 focus:ring-2">
        {options.map((option) => (
          <option key={option} value={option} className="bg-night">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
