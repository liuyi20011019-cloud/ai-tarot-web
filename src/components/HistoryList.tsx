import { useEffect, useMemo, useState } from "react";
import { clearHistory, deleteHistoryItem, filterHistory } from "../lib/historyStorage";
import type { ReadingOutput } from "../types/tarot";

interface HistoryListProps {
  refreshKey: number;
}

export function HistoryList({ refreshKey }: HistoryListProps) {
  const [category, setCategory] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<ReadingOutput[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const categories = useMemo(() => ["全部", "感情", "事业", "财运", "学业", "家庭", "健康", "自我成长", "选择题", "其他"], []);

  const reload = () => setItems(filterHistory(category, keyword));

  useEffect(() => {
    reload();
  }, [category, keyword, refreshKey]);

  return (
    <section className="mt-8 rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-oracle">历史记录</p>
          <h2 className="font-display text-2xl text-white">已保存测算</h2>
        </div>
        <button
          onClick={() => {
            clearHistory();
            reload();
          }}
          className="rounded-md border border-white/15 px-4 py-2 text-sm text-pearl transition hover:border-oracle hover:text-oracle"
        >
          清空全部
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none">
          {categories.map((item) => (
            <option key={item} className="bg-night">{item}</option>
          ))}
        </select>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索问题或总结" className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-white outline-none" />
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-pearl/60">还没有保存的测算。</p> : null}
        {items.map((item) => (
          <article key={item.id} className="rounded-md border border-white/10 bg-white/[.04] p-3">
            <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="w-full text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-oracle">{new Date(item.createdAt).toLocaleString("zh-CN")} · {item.spreadName}</p>
                  <h3 className="mt-1 font-semibold text-white">{item.question}</h3>
                </div>
                <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-pearl/70">{item.category}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-pearl/70">{item.overallSummary}</p>
            </button>
            {openId === item.id ? (
              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-sm leading-6 text-pearl/85">{item.advice}</p>
                <button
                  onClick={() => {
                    deleteHistoryItem(item.id);
                    reload();
                  }}
                  className="mt-3 rounded-md border border-red-300/30 px-3 py-2 text-sm text-red-200 hover:bg-red-500/10"
                >
                  删除记录
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
